import { CheerioAPI, load } from 'cheerio'
import { pipe } from 'fp-ts/lib/function'

/**
 * @param query CSS selector
 * @param content HTML content
 * @returns false if element not found or HTML is malformed
 */
export type HTMLSelectorMatcher = (query: string, content: string) => boolean;

/** Verify while ignoring selector errors */
const verifyContentAgainst = (query: string) => ($: CheerioAPI): boolean => {
  try {
    return $(query).length > 0;
  } catch(err) {
    return false;
  }
}

export const base =
  (cheerioLoad): HTMLSelectorMatcher =>
  (query, content) => pipe(
    cheerioLoad(content),
    verifyContentAgainst(query)
  )

export default base(load)
