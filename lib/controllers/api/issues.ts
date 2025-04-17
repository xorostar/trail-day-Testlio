import { Context } from 'koa';
import { IssueService } from '../../services/issue.service';
import { CreateIssueDto } from '../../dto/issue.dto';
import { issueResponseSchema } from '../../schemas/issue.schema';
import { ValidationError } from '../../utils/errors';

export class IssueController {
  private service: IssueService;

  constructor(service: IssueService = new IssueService()) {
    this.service = service;
  }

  async create(ctx: Context): Promise<void> {
    try {
      const issueData = ctx.request.body as CreateIssueDto;
      const createdBy = ctx.state.user?.email || 'unknown';

      const issue = await this.service.createIssue(issueData, createdBy);
      
      ctx.status = 201;
      ctx.body = issueResponseSchema.parse(issue);
    } catch (error) {
      if (error instanceof ValidationError) {
        ctx.status = 400;
        ctx.body = {
          error: error.message,
          details: error.errors
        };
      } else {
        ctx.status = 500;
        ctx.body = {
          error: 'Internal server error'
        };
      }
    }
  }
} 