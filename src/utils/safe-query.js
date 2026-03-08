export async function safeQuery(fn, fallback) {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}
