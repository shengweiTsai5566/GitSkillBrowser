import axios from 'axios';

class GitClient {
  private baseUrl: string = "";
  private isGitHub: boolean = false;
  private apiBase: string = ""; // Normalized API Root

  constructor() {
    this.refresh();
  }

  /**
   * Refresh configuration from environment variables
   */
  refresh() {
    this.baseUrl = (process.env.INTERNAL_GIT_URL || "").replace(/\/$/, "");
    this.isGitHub = this.baseUrl.includes("github.com") || this.baseUrl.includes("api.github.com");
    
    if (this.isGitHub) {
      this.apiBase = "https://api.github.com";
    } else {
      // For Gitea, ensure /api/v1 is present
      if (this.baseUrl && !this.baseUrl.includes("/api/v1")) {
        this.apiBase = `${this.baseUrl}/api/v1`;
      } else {
        this.apiBase = this.baseUrl;
      }
    }
  }

  /**
   * Get current authenticated user info
   */
  async getUser(token: string) {
    const headers = { 
      Authorization: `token ${token}`,
      "User-Agent": "Skill-Browser-Web"
    };

    return axios.get(`${this.apiBase}/user`, { headers });
  }

  /**
   * List repositories for the authenticated user
   */
  async listUserRepos(token: string) {
    const headers = { 
      Authorization: `token ${token}`,
      "User-Agent": "Skill-Browser-Web"
    };

    if (this.isGitHub) {
      return axios.get(`${this.apiBase}/user/repos`, { 
        headers,
        params: { per_page: 100, sort: 'updated', type: 'all' }
      });
    } else {
      return axios.get(`${this.apiBase}/user/repos`, { 
        headers,
        params: { limit: 100 }
      });
    }
  }

  /**
   * Construct the archive download URL
   */
  getArchiveUrl(repoUrl: string, branch: string = "main") {
    const cleanUrl = repoUrl.replace(/\.git$/, "");
    const isTargetGitHub = cleanUrl.includes("github.com");

    if (isTargetGitHub) {
      const match = cleanUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (match) {
        const owner = match[1];
        const repo = match[2];
        return `https://api.github.com/repos/${owner}/${repo}/zipball/${branch}`;
      }
    } 
    
    // Gitea standard download URL is on the web root
    return `${cleanUrl}/archive/${branch}.zip`;
  }

  /**
   * Fetch raw content of a file (e.g., SKILL.md)
   */
  async getRawContent(repoUrl: string, branch: string, filePath: string, token: string) {
    const cleanUrl = repoUrl.replace(/\.git$/, "");
    const headers = { 
      Authorization: `token ${token}`,
      "User-Agent": "Skill-Browser-Web"
    };

    const isTargetGitHub = cleanUrl.includes("github.com");

    if (isTargetGitHub) {
      const match = cleanUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) return null;
      
      const owner = match[1];
      const repo = match[2];
      
      try {
        const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
          headers: { ...headers, "Accept": "application/vnd.github.v3.raw" },
          params: { ref: branch },
          responseType: 'text'
        });
        return res.data;
      } catch (e) {
        return null;
      }
    } else {
      // Gitea Raw URL logic
      const url = `${cleanUrl}/raw/branch/${branch}/${filePath}`;
      
      try {
        const res = await axios.get(url, { 
          headers,
          responseType: 'text'
        });
        return res.data;
      } catch (e) {
        return null;
      }
    }
  }
}

export const gitClient = new GitClient();
