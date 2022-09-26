import { AxiosResponse } from 'axios'

export const response = (): AxiosResponse<string, any> => ({
  data: 'foo\nbar',
  config: {},
  headers: {},
  status: 200,
  statusText: 'OK'
})

export const responseWithData = (data: any): AxiosResponse => ({ ...response(), data, })
export const responseWithStatus = (status: number, statusText: string): AxiosResponse => ({ ...response(), status, statusText })
