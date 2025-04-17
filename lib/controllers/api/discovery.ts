import { Context } from 'koa';
import { success } from '../../utils/responses';
import config from '../../../config';
import Discovery from '../../interfaces/discovery';

const discovery: Discovery = {
  get: async (context: Context): Promise<void> => {
    success(context, {
      discovery: config.appUrl
    });
  }
};
  
export default discovery; 