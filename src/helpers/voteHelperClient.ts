// src/helpers/voteHelpersClient.ts
export async function getOrCreateDeviceHash(): Promise<string> {
  const key = "device_hash_v1";
  const existing = localStorage.getItem(key);
  if (existing) return existing;

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const hash = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  localStorage.setItem(key, hash);
  return hash;
}
