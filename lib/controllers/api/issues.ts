import { Context } from 'koa';
import { IssueService } from '../../services/issue.service';
import { CreateIssueDto, ListIssuesResponseDto } from '../../dto/issue.dto';
import { issueResponseSchema, listIssuesResponseSchema } from '../../schemas/issue.schema';
import { success } from '../../utils/responses';

export class IssueController {
  private service: IssueService;

  constructor(service: IssueService = new IssueService()) {
    this.service = service;
  }

  async create(ctx: Context): Promise<void> {
    const issueData = ctx.request.body as CreateIssueDto;
    const createdBy = ctx.state.user?.email || 'unknown';

    const issue = await this.service.createIssue(issueData, createdBy);
    
    ctx.status = 201;
    success(ctx, issueResponseSchema.parse(issue));
  }

  async list(ctx: Context): Promise<void> {
    const limit = parseInt(ctx.query.limit as string) || 10;
    const offset = parseInt(ctx.query.offset as string) || 0;

    const result = await this.service.listIssues(limit, offset);
    
    success(ctx, listIssuesResponseSchema.parse(result));
  }

  async update(ctx: Context): Promise<void> {
    const id = parseInt(ctx.params.id);
    const issueData = ctx.request.body as Partial<CreateIssueDto>;
    const updatedBy = ctx.state.user?.email || 'unknown';

    const issue = await this.service.updateIssue(id, issueData, updatedBy);
    
    success(ctx, issueResponseSchema.parse(issue));
  }
} 