/**
 * Basic security scanner to detect potential secrets in markdown content.
 */

const SECRET_PATTERNS = [
  // Generic API Keys
  /(?:key|api|token|secret|password|passwd|auth)[_-]?(?:key|api|token|secret|password|passwd|auth)?\s*[:=]\s*['"]?([a-zA-Z0-9]{16,})['"]?/gi,
  // GitHub/Gitea/GitLab tokens (common 40 char hex or glpat-)
  /\b(glpat-[a-zA-Z0-9\-]{20,})\b/g,
  /\b[a-f0-9]{40}\b/g,
  // AWS Keys
  /\bAKIA[0-9A-Z]{16}\b/g,
  // Generic Bearer tokens
  /Bearer\s+[a-zA-Z0-9\-\._~\+\/]+/gi,
];

export interface ScanResult {
  isSafe: boolean;
  matches: string[];
}

export function scanContent(content: string): ScanResult {
  const matches: string[] = [];
  
  for (const pattern of SECRET_PATTERNS) {
    const found = content.match(pattern);
    if (found) {
      matches.push(...found);
    }
  }

  // Deduplicate and filter small matches
  const uniqueMatches = Array.from(new Set(matches));

  return {
    isSafe: uniqueMatches.length === 0,
    matches: uniqueMatches,
  };
}
