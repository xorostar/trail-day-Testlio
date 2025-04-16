import { Context } from 'koa';

interface ErrorResponse {
  message: string;
  errors?: any[];
}

const responses = {
  success: (context: Context, data: any): void => {
    context.body = data;
    context.status = data ? 200 : 204;
  },
  badRequest: (context: Context, errors: any[]): void => {
    const response: ErrorResponse = {
      message: 'Check your request parameters',
      errors
    };
    context.body = response;
    context.status = 400;
  },
  notFound: (context: Context): void => {
    context.body = { message: 'Resource was not found' };
    context.status = 404;
  }
};

export default responses; 