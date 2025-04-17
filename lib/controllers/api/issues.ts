import { Context } from 'koa';
import Issue from '../../models/issue';
import Issues from '../../interfaces/issues';
import { success } from '../../utils/responses';

const issues: Issues = {
  get: async (context: Context): Promise<void> => {
    const issue = await Issue.findByPk(context.params.id);
    success(context, { issue });
  }
};

export default issues; 