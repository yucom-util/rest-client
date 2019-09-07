import Log from '@yucom/log';
import { AppError } from '@yucom/common';
import { ErrorCodes } from '../error-codes';
import functionProxy from './func-path-proxy';
import createHttpClient, { HttpClient } from '../http-client';
import { RestClient, RestRequest, RestOperations } from './model';
import { HttpOperation } from '../http-client/model';

const log = Log.create('rest-client');

/** Operaciones soportadas. */
const Operations: RestOperations = {
  get: new HttpOperation('GET', false, true),
  list: new HttpOperation('GET', false, true),
  create: new HttpOperation('POST', true, true),
  update: new HttpOperation('PATCH', true, true),
  replace: new HttpOperation('PUT', true, true),
  remove: new HttpOperation('DELETE', false, false),
  invoke: new HttpOperation('POST', true, true)
};

/**
 * Helpers
 */
function isPrimitive(value: any): value is string | number {
  return typeof (value) === 'string' || typeof (value) === 'number';
}

/** Construye un AppError */
function buildAppError(errorCode, { description }: RestRequest, info: object = {}): AppError {
  const appError = new AppError(
    errorCode.message,
    errorCode.code,
    { request: description, ...info});
  log.error(`${description} FAILED.`, appError);
  return appError;
}

/** Extrae el resultado del body de la respuesta */
function getResult(resBody, req: RestRequest) {
  if (!resBody) {
    throw buildAppError(ErrorCodes.responseError.noBody, req);
  }
  if (req.operation.expectsSomething) {
    if (resBody.data === undefined) {
      throw buildAppError(ErrorCodes.responseError.noData, req);
    }
    return resBody.data;
  }
  return undefined;
}

/**
 * Construye un cliente REST
 */
function client(httpClient: HttpClient): RestClient {

  async function perform(req: RestRequest): Promise<any> {
    let resBody = httpClient.request(req);
    return req.operation.expectsSomething && getResult(await resBody, req);
  }

  async function get(this: any, value?: string | number | object): Promise<any> {
    let options;
    let path;
    if (isPrimitive(value)) {
      options = undefined;
      path = [...this, value];
    } else {
      options = value;
      path = this;
    }

    const request = new RestRequest(
      Operations.get,
      path,
      undefined,
      options
    );
    return perform(request);
  }

  async function list(this: any, options?: object): Promise<any[]> {
    const request = new RestRequest(
      Operations.list,
      this,
      undefined,
      options
    );
    return perform(request);
  }

  async function create(this: any, instance?: object, options?: object): Promise<any> {

    const request = new RestRequest(
      Operations.create,
      this,
      instance,
      options
    );
    return perform(request);
  }

  async function update(this: any, properties: object, options?: object): Promise<void> {
    const request = new RestRequest(
      Operations.update,
      this,
      properties,
      options
    );
    if (!properties) {
      throw buildAppError(ErrorCodes.badRequest.objectRequired, request);
    }
    return perform(request);
  }

  async function replace(this: any, instance: object, options?: object): Promise<any> {

    const request = new RestRequest(
      Operations.replace,
      this,
      instance,
      options
    );
    return perform(request);
  }

  async function remove(this: any, value?: string | number | object): Promise<void> {
    let options;
    let path;
    if (isPrimitive(value)) {
      options = undefined;
      path = [...this, value];
    } else {
      options = value;
      path = this;
    }

    const request = new RestRequest(
      Operations.remove,
      path,
      undefined,
      options
    );
    perform(request);
  }

  async function invoke(this: any, arg?: object, options?: object): Promise<any> {

    const request = new RestRequest(
      Operations.invoke,
      this,
      arg,
      options
    );
    return perform(request);
  }

  return {
    get: functionProxy(get),
    list: functionProxy(list),
    create: functionProxy(create),
    update: functionProxy(update),
    replace: functionProxy(replace),
    remove: functionProxy(remove),
    invoke: functionProxy(invoke)
  };
}

/** Crea una instancia de cliente REST */
export function connect(endpointUrl: string, timeout?: number): RestClient {
  return client(createHttpClient(endpointUrl, timeout));
}
