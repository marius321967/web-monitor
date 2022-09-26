import { AxiosResponse } from 'axios'

export const responseWithData = (data: any): AxiosResponse => ({
  data,
  config: {},
  headers: {},
  status: 200,
  statusText: 'OK'
})
