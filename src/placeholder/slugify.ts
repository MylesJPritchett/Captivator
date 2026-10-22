// PLACEHOLDER: exists only so the throwaway unit test has something to test.
// Delete the src/placeholder/ folder once the first real Splash Page reducer test exists.
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .split(/\s+/)
    .join("-");
}
