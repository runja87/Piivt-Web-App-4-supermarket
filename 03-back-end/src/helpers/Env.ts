
import { readFileSync } from 'fs';

export const env = {
  str(key: string, def?: string) {
    const v = process.env[key];
    if (v === undefined || v === '') {
      if (def !== undefined) return def;
      throw new Error(`Missing env var: ${key}`);
    }
    return v;
  },
  int(key: string, def?: number) {
    const v = process.env[key];
    if (v === undefined || v === '') {
      if (def !== undefined) return def;
      throw new Error(`Missing env var: ${key}`);
    }
    const n = Number(v);
    if (Number.isNaN(n)) throw new Error(`Env ${key} must be a number`);
    return n;
  },
  bool(key: string, def?: boolean) {
    const v = process.env[key];
    if (v === undefined || v === '') {
      if (def !== undefined) return def;
      throw new Error(`Missing env var: ${key}`);
    }
    return ['1','true','yes','on'].includes(v.toLowerCase());
  },
};

// Narrow a string to a union set
export function oneOf<T extends readonly string[]>(
  key: string,
  allowed: T,
  def?: T[number]
): T[number] {
  const v = process.env[key];
  if (v === undefined || v === '') {
    if (def !== undefined) return def;
    throw new Error(`Missing env var: ${key}`);
  }
  if ((allowed as readonly string[]).includes(v)) return v as T[number];
  throw new Error(`Env ${key} must be one of: ${allowed.join(', ')}`);
}

// Handle index: string | false  (ENV: "false" => false, anything else => string)
export function indexStrOrFalse(key: string, def: string | false) {
  const v = process.env[key];
  if (v === undefined) return def;
  if (v.toLowerCase() === 'false') return false;
  return v; // string
}

// Read keys either from file path env or base64 env
export function readKeyPair(opts: {
  publicFileEnv: string;
  privateFileEnv: string;
  publicB64Env: string;
  privateB64Env: string;
}) {
  const readFromFile = (p?: string) => (p ? readFileSync(p, 'ascii') : undefined);
  const fromB64 = (b64?: string) => (b64 ? Buffer.from(b64, 'base64').toString('ascii') : undefined);

  const pub = fromB64(process.env[opts.publicB64Env]) ?? readFromFile(process.env[opts.publicFileEnv]);
  const prv = fromB64(process.env[opts.privateB64Env]) ?? readFromFile(process.env[opts.privateFileEnv]);

  if (!pub || !prv) {
    throw new Error(
      `Missing key pair. Provide either ${opts.publicFileEnv}/${opts.privateFileEnv} or ${opts.publicB64Env}/${opts.privateB64Env}`
    );
  }
  return { public: pub, private: prv };
}
