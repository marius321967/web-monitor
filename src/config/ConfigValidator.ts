export type Path = (string | number)[];

export type ConfigError = { path: Path, message: string };

export type ConfigValidator = (input: any) => Promise<Error | null>;
