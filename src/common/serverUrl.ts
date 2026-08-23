type Scheme = "http" | "ws";

const SCHEME_PREFIX = /^(https?|wss?):\/\//i;

const knownInsecure = new Set<string>();

function host(address: string): string {
  return address.trim().replace(SCHEME_PREFIX, "").replace(/\/+$/, "");
}

function pinnedSecure(address: string): boolean | null {
  const match = SCHEME_PREFIX.exec(address.trim());
  if (!match) return null;
  const scheme = match[1].toLowerCase();
  return scheme === "https" || scheme === "wss";
}

function base(address: string, scheme: Scheme, secure: boolean): string {
  return `${scheme}${secure ? "s" : ""}://${host(address)}`;
}

export function serverBases(address: string, scheme: Scheme): string[] {
  const pinned = pinnedSecure(address);
  if (pinned !== null) return [base(address, scheme, pinned)];
  if (knownInsecure.has(host(address))) return [base(address, scheme, false)];
  return [base(address, scheme, true), base(address, scheme, false)];
}

export function rememberInsecure(address: string) {
  knownInsecure.add(host(address));
}

export async function serverFetch(address: string, path: string, init?: RequestInit): Promise<Response> {
  const [primary, fallback] = serverBases(address, "http");
  try {
    return await fetch(`${primary}${path}`, init);
  } catch (error) {
    if (!fallback || !(error instanceof TypeError)) throw error;
  }
  const response = await fetch(`${fallback}${path}`, init);
  rememberInsecure(address);
  return response;
}
