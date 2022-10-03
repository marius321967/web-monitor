/**
 * @param query CSS selector
 * @param content HTML content
 * @returns false if element not found or HTML is malformed
 */
export type HTMLSelectorMatcher = (query: string, content: string) => boolean;

// todo
export const base =
  (): HTMLSelectorMatcher =>
  () => false

export default base()
