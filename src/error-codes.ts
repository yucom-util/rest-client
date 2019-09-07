import { code } from '@yucom/common';

export const ErrorCodes = code.complete({
  invalidEndpoint: {
    message: 'Invalid endpoint URL.'
  },
  badRequest: {
    objectRequired: {
      message: 'This operation requires an argument of type object.'
    }
  },
  forbidden: {
    message: 'You\'re not authorized to execute this operation'
  },
  unauthorized: {
    message: 'Authentication required.'
  },
  notFound: {
    message: 'Object not found.'
  },
  methodNotAllowed: {
    message: 'Operación not allowed.'
  },
  internal: {
    message: 'Internal server error.'
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
