import { Config } from './Config'

/** 
 * Checks if input matches the structure of Config
 * @see Config
 */
export type ConfigValidator = (input: any) => Promise<Promise<Error | null>>

// todo
