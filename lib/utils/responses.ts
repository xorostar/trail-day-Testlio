'use strict';

import { Context } from 'koa';

export const success = (context: Context, data: any): void => {
  context.status = 200;
  context.body = {
    status: 'success',
    data
  };
};

export const notFound = (context: Context, message = 'Resource not found'): void => {
  context.status = 404;
  context.body = {
    status: 'error',
    message
  };
};

export const badRequest = (context: Context, data: any): void => {
  context.status = 400;
  context.body = {
    status: 'error',
    ...data
  };
};

export const unauthorized = (context: Context, message = 'Authentication required'): void => {
  context.status = 401;
  context.body = {
    status: 'error',
    message
  };
};

export const forbidden = (context: Context, message = 'Access forbidden'): void => {
  context.status = 403;
  context.body = {
    status: 'error',
    message
  };
};

export const serverError = (context: Context, message = 'Internal server error'): void => {
  context.status = 500;
  context.body = {
    status: 'error',
    message
  };
}; 