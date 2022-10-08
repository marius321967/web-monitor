/**
 * Compile pattern from config file (surrounded by slashes). 
 * Must be validated beforehand.
 */
export default (pattern: string): RegExp => new RegExp(pattern.replace(/^\//, '').replace(/\/$/, ''))
