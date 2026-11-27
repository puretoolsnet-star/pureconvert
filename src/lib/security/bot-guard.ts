const BLOCKED_UA =
  /(GPTBot|ChatGPT-User|CCBot|anthropic-ai|ClaudeBot|Bytespider|meta-externalagent|Amazonbot|Google-Extended)/i;

export function isAlwaysAllowedPath(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/ads.txt"
  );
}

export function shouldBlockBotRequest(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return BLOCKED_UA.test(userAgent);
}