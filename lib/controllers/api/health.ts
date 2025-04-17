import { Context } from 'koa';
import { success } from '../../utils/responses';
import Health from '../../interfaces/health';

const health: Health = {
  get: async (context: Context): Promise<void> => {
    success(context, {
      message: 'OK'
    });
  }
};

export default health; 