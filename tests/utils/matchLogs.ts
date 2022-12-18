import { flow } from 'fp-ts/lib/function';
import fs from 'fs/promises'
import { complement, filter, intersection, isEmpty, map, split, trim } from 'ramda';

// todo: read line by line
const getLogFile = () => fs.readFile('./logs/web-monitor.log');
const toString = (content: Buffer): string => content.toString();
const splitLines = split('\n');
const isNotEmpty = complement(isEmpty);
const parseJson = (line: string): object => JSON.parse(line);
const matches = (fields: object) => (value: object): boolean => 
  intersection(
    Object.entries(fields), 
    Object.entries(value)
  ).length == Object.keys(fields).length;

export default (fields: object) => getLogFile()
  .then(flow(
    toString,
    splitLines,
    map(trim),
    filter(isNotEmpty),
    map(parseJson),
    filter(matches(fields))
  ));
