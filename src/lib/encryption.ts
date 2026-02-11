import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

/**
 * 產生複合式金鑰：系統金鑰 + (選配)使用者自訂密碼
 */
function deriveKey(userKey?: string): Buffer {
  const systemKey = process.env.ENCRYPTION_KEY || 'default-fallback-key';
  // 使用 SHA-256 混合系統金鑰與使用者密碼
  const combined = userKey ? `${systemKey}:${userKey}` : systemKey;
  return crypto.createHash('sha256').update(combined).digest();
}

export function encrypt(text: string, userKey?: string): string {
  const key = deriveKey(userKey);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key as any, iv as any);
  
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8') as any, 
    cipher.final() as any
  ]);
  const tag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decrypt(encryptedText: string, userKey?: string): string {
  const key = deriveKey(userKey);
  const [ivHex, tagHex, contentHex] = encryptedText.split(':');
  if (!ivHex || !tagHex || !contentHex) throw new Error('Invalid format');

  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const content = Buffer.from(contentHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, key as any, iv as any);
  decipher.setAuthTag(tag as any);

  const decrypted = Buffer.concat([
    decipher.update(content as any) as any, 
    decipher.final() as any
  ]);
  return decrypted.toString('utf8');
}
