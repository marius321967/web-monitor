export type ConfigFailureHandler = (error: Error) => void

export const base = 
    (): ConfigFailureHandler => 
    /** Reports & shuts down the application  */
    (error) => {}

// todo
export default base()
