import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { encrypt, decrypt } from "./encryption";
import { gitClient } from "./git-client";

const prisma = new PrismaClient();

const getProviders = () => {
  const mode = process.env.AUTH_MODE || "public";
  const providers = [];

  if (mode === "internal") {
    providers.push(
      CredentialsProvider({
        id: "internal-auth",
        name: "Internal Git",
        credentials: {
          email: { label: "Email", type: "text" },
          token: { label: "Git Token", type: "password" },
          userKey: { label: "Personal Encryption Key", type: "password" }
        },
        async authorize(credentials) {
          if (!credentials?.email) return null;

          const email = credentials.email.trim().toLowerCase();
          const userKey = credentials.userKey;

          const existingUser = await prisma.user.findUnique({ where: { email } });
          
          let tokenToUse = credentials.token;
          if (!tokenToUse && existingUser?.gitToken) {
            try {
              tokenToUse = decrypt(existingUser.gitToken, userKey);
            } catch (e) {
              console.warn("[AUTH] Decryption failed for", email);
              throw new Error("INVALID_ENCRYPTION_KEY");
            }
          }

          if (!tokenToUse) throw new Error("TOKEN_REQUIRED");

          try {
            // Use unified git client (Supports Gitea & GitHub)
            const res = await gitClient.getUser(tokenToUse);

            if (res.status === 200) {
              const gitUser = res.data;
              const encryptedToken = encrypt(tokenToUse, userKey);

              const dbUser = await prisma.user.upsert({
                where: { email },
                update: {
                  name: gitUser.full_name || gitUser.login || gitUser.username, // GitHub uses login, Gitea uses username/login
                  image: gitUser.avatar_url,
                  gitToken: encryptedToken,
                  useUserKey: !!userKey,
                },
                create: {
                  email,
                  name: gitUser.full_name || gitUser.login || gitUser.username,
                  image: gitUser.avatar_url,
                  provider: "git",
                  gitToken: encryptedToken,
                  useUserKey: !!userKey,
                },
              });

              return { 
                id: dbUser.id, 
                name: dbUser.name, 
                email: dbUser.email, 
                image: dbUser.image,
                userKey: userKey 
              };
            } else {
              throw new Error("INVALID_TOKEN");
            }
          } catch (e: any) {
            console.error("[AUTH] Git Fetch Error:", e.message);
            // Throw specific errors for UI handling
            if (e.response?.status === 401) throw new Error("INVALID_TOKEN");
            throw e;
          }
        }
      })
    );
  }

  else if (mode === "dev") {
    providers.push(CredentialsProvider({
        id: "dev-login",
        name: "Dev Mode",
        credentials: { email: { label: "Email", type: "text" } },
        async authorize(credentials) {
            if (!credentials?.email) return null;
            const email = credentials.email.trim().toLowerCase();
            const dbUser = await prisma.user.upsert({
                where: { email },
                update: { name: "Dev User" },
                create: { email, name: "Dev User", provider: "dev" },
            });
            return { id: dbUser.id, email: dbUser.email, name: dbUser.name };
        }
    }));
  }

  return providers;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: getProviders(),
  callbacks: {
    session: ({ session, token }) => {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).userKey = token.userKey;
      }
      return session;
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.sub = user.id;
        token.userKey = (user as any).userKey;
      }
      return token;
    }
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/signin" },
};
