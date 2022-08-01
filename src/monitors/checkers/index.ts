import { MonitorConfig, MonitorType } from '../../config/Config'
import { MonitorChecker } from './MonitorChecker'
import ssl_validity from './ssl_validity'
import response_code from './response_code'
import response_time from './response_time'
import content_match from './content_match'
import element_match from './element_match'

export type MonitorCheckerMap<T = MonitorType> = { [key in keyof T]: MonitorChecker<MonitorConfig<T>> }

const map: MonitorCheckerMap = {
    ssl_validity,
    response_code,
    response_time,
    content_match,
    element_match,
}

export default map