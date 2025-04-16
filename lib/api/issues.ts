import { Context } from 'koa';
import respond from './responses';
import Issue from '../models/issue';

const baseUrl = 'http://localhost:8080';

interface Issues {
  get: (context: Context) => Promise<void>;
}

const issues: Issues = {
  get: async (context: Context): Promise<void> => {
    const issue = await Issue.findByPk(context.params.id);
    respond.success(context, { issue });
  }
};

export default issues; 