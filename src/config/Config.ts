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

export type MonitorInterval = string;
export type ResponseTimeThreshold= string;
export type ContentMatchPattern = string;
export type ElmentMatchPattern = string;

export type MonitorRequestConfig = string | {
    url: string
    method: RequestMethod
    auth_header?: string
}

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
