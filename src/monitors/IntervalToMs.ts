import { IntervalTimeUnit, MonitorInterval } from '@/config/Config'
import moment from 'moment'

export type IntervalToMsConverter = (interval: MonitorInterval) => number;

const amount = (interval: MonitorInterval) => interval.split(' ')[0];
const unit = (interval: MonitorInterval): IntervalTimeUnit => interval.split(' ')[1] as IntervalTimeUnit;
const base = moment('1970-01-01T00:00:00.000');

const intervalToMs: IntervalToMsConverter = (interval) => base.clone().add(amount(interval), unit(interval)).diff(base, 'milliseconds')

export default intervalToMs;
