/**
 * Regex patterns must be surrounded by slashes in the config file.
 * False if simple pattern.
 */
export default (pattern: string): boolean => 
  pattern.length > 1 
  && pattern.match(/^\//) !== null
  && pattern.match(/\/$/) !== null;
