export * from './user';

export * from './blog';

export const applicationJsonType = 'application/json';

export const applicationXmlType = 'application/xml';

export type APIResponseType<T = any> = {
  status: string | number;
  responseCode: string;
  apiResponseCode?: string;
  responseMessage: string;
  details: T;
  message?: string;
};

export enum StatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  ALREADY_EXISTS = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export type TraceOptionsType = {
  user: string;
  action: string;
  message: string;
  status: string;
  options: {
    customerPhoneNo?: string;
    customerAccountNo?: string;
    deviceIP?: string;
    deviceID?: string;
    deviceName?: string;
    sourceOS?: string;
    apiRequest: string;
    apiResponse: string;
  };
};

export type GenericType = {
  [x: string]: any;
};

export type GenericAnyType = any;

export enum ResponseCode {
  SUCCESS = '00',
  FAILURE = '01',
  VALIDATION_ERROR = '02',
}

export type ExternalAPIResponseType = {
  status: string;
  apiResponseCode: string;
  apiResponseMessage?: string;
  message: string;
  details?: any;
};

export type FunctionResponseType = {
  status: string;
  message: string;
  [x: string]: any;
};

export enum ResponseType {
  SUCCESS = 1,
  FAILURE = 0,
}

export type HashedTokenType = { clientId: string; clientSecret: string };
