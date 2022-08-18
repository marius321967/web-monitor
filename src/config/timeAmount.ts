export const amount = (input: string): number => parseInt(input.split(' ')[0]);
export const unit = (input: string): string => input.split(' ')[1];
