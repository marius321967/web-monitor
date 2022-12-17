import { flow } from 'fp-ts/lib/function'
import fs from 'fs/promises'
import moment, { Moment } from 'moment'
import { complement, filter, intersection, isEmpty, map, split, trim } from 'ramda';

export type LogFilters = { after?: Moment };
type Log = { type: string, timestamp: string };
type FilterFn = (log: Log) => boolean;

const byOpts = 
  (filters: LogFilters): FilterFn =>
  (log) => {
    if (filters.after && moment(log.timestamp).isBefore(filters.after))
      return false;

    return true;
  }

// todo: read line by line
const getLogFile = () => fs.readFile('./logs/web-monitor.log');
const toString = (content: Buffer): string => content.toString();
const splitLines = split('\n');
const isNotEmpty = complement(isEmpty);
const parseJson = (line: string): Log => JSON.parse(line);
const matches = (fields: object) => (value: object): boolean => 
  intersection(
    Object.entries(fields), 
    Object.entries(value)
  ).length == Object.keys(fields).length;

export default (fields: object, filters: LogFilters = {}) => getLogFile()
  .then(flow(
    toString,
    splitLines,
    map(trim),
    filter(isNotEmpty),
    map(parseJson),
    filter(byOpts(filters)),
    filter(matches(fields)),
  ));
