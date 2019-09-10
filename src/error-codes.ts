import { code } from '@yucom/common';

export const ErrorCodes = code.complete({
  badRequest: {
    objectRequired: {
      message: 'This operation requires an argument of type object.'
    }
  },
  unauthorized: {
    message: 'Authentication required.'
  },
  forbidden: {
    message: 'You\'re not authorized to execute this operation'
  },
  notFound: {
    message: 'Object not found.'
  },
  methodNotAllowed: {
    message: 'Operación not allowed.'
  },
  notAcceptable: {},
  proxyAuthenticationRequired: {},
  requestTimeout: {},
  conflict: {},
  gone: {},
  lengthRequired: {},
  preconditionFailed: {},
  payloadTooLarge: {},
  URITooLong: {},
  unsupportedMediaType: {},
  requestedRangeNotSatisfiable: {},
  expectationFailed: {},
  misdirectedRequest: {},
  unprocessableEntity: {},
  locked: {},
  failedDependency: {},
  upgradeRequired: {},
  preconditionRequired: {},
  tooManyRequests: {},
  requestFieldsTooLarge: {},
  unavailableForLegalReasons: {},
  internalServerError: {
    message: 'Internal server error.'
  },
  notImplemented: {},
  badGateway: {},
  serviceUnavailable: {},
  gatewayTimeout: {},
  HTTPVersionNotSupported: {},
  variantAlsoNegotiates: {},
  insufficientStorage: {},
  loopDetected: {},
  notExtended: {},
  networkAuthenticationRequired: {},
  invalidEndpoint: {
    message: 'Invalid endpoint URL.'
  },
  requestError: {
    message: 'Request error.'
  },
  responseError: {
    noBody: {
      message: 'Response body missing.'
    },
    noData: {
      message: 'Data expected but not present in response.'
    },
    message: 'Invalid response received.'
  }
});
