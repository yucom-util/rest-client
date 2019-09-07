import Qs from 'qs';
import { FunctionProxy } from './func-path-proxy';
import { HttpOperation, HttpRequest } from '../http-client/model';


interface BaseRestClient {
  get(): Promise<any>;
  get(id: string | number): Promise<any>;
  get(options: object): Promise<any>;

  list(options?: object): Promise<any[]>;

  create(instance?: object, options?: object): Promise<any>;

  update(properties: object, options?: object): Promise<any>;

  replace(this: any, instance: object, options?: object): Promise<any>;

  remove(this: any): Promise<void>;
  remove(this: any, id: string | number): Promise<void>;
  remove(this: any, options: object): Promise<void>;
  remove(this: any, value?: string | number | object): Promise<void>;

  invoke(this: any, arg?: object, options?: object): Promise<any>;
}

export type RestClient = {
  [P in keyof BaseRestClient]: FunctionProxy<BaseRestClient[P]>;
};

export type RestOperations = { [key in keyof RestClient]: HttpOperation };

/** Request a un service REST */
export class RestRequest extends HttpRequest {

  constructor(
    operation: HttpOperation,
    path: any[],
    data?: object,
    options?: object
  ) {
    const basePath = '/' + path.map(part => String(part)).join('/');
    const url = basePath + (options ? `?${Qs.stringify(options)}` : '');
    super(operation, url, data);
  }
}

export type StatusErrorCodes = { [status: string]: { message: string, code: string } };
