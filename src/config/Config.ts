export type HttpResponseCode = number;

export enum RequestMethod {
    GET = 'GET',
    DELETE = 'DELETE',
    HEAD = 'HEAD',
    OPTIONS = 'OPTIONS',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH'
}

export enum MonitorType {
    ssl_validity = 'ssl_validity',
    response_code = 'response_code',
    response_time = 'response_time',
    content_match = 'content_match',
    element_match = 'element_match',
}

export type IntervalTimeUnit = 'second' | 'seconds' | 'minute' | 'minutes' | 'hour' | 'hours' | 'day' | 'days' | 'week' | 'weeks';
export type TimeAmount = `${number} ${IntervalTimeUnit}`;
export type MonitorInterval = TimeAmount;
export type ResponseTimeThreshold = TimeAmount;
export type ContentMatchPattern = string;
export type ElmentMatchPattern = string;

export type MonitorRequestConfigComplex = {
    url: string
    method: RequestMethod
    auth_header?: string
}

export type MonitorRequestConfig = string | MonitorRequestConfigComplex;

export type MonitorSpecificConfig = {
    type: MonitorType.ssl_validity
} | {
    type: MonitorType.response_code,
    expected_code: HttpResponseCode
} | {
    type: MonitorType.response_time,
    threshold: ResponseTimeThreshold
} | {
    type: MonitorType.content_match,
    pattern: ContentMatchPattern
} | {
    type: MonitorType.element_match,
    pattern: ElmentMatchPattern
}

export type SslMonitor = MonitorConfig<MonitorType.ssl_validity>;
export type ResponseCodeMonitor = MonitorConfig<MonitorType.response_code>;
export type ResponseTimeMonitor = MonitorConfig<MonitorType.response_time>;
export type ContentMatchMonitor = MonitorConfig<MonitorType.content_match>;
export type ElementMatchMonitor = MonitorConfig<MonitorType.element_match>;

export type MonitorConfig<T = MonitorType> = {
    label: string,
    type: T,
    interval: MonitorInterval,
    request: MonitorRequestConfig
} & MonitorSpecificConfig;

export type MonitorMap = { [key: string]: MonitorConfig }

export type Recipient = {
    email?: string
}

export type RecipientMap = { [key: string]: Recipient }

export type EmailNotifierAuthConfig = {
    user: string,
    pass: string
}

export type EmailNotifierConfig = {
    host: string,
    port: number,
    auth: EmailNotifierAuthConfig
}

export type Config = {
    monitors: MonitorMap,
    notify: RecipientMap,
    email_notifier: EmailNotifierConfig
}
