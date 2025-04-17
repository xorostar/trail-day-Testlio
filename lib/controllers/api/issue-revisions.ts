import { Context } from 'koa';
import { IssueRevisionService } from '../../services/issue-revision.service';
import { ListIssueRevisionsResponseDto } from '../../dto/issue-revision.dto';
import { listIssueRevisionsResponseSchema } from '../../schemas/issue-revision.schema';
import { success } from '../../utils/responses';

export class IssueRevisionController {
  private service: IssueRevisionService;

  constructor(service: IssueRevisionService = new IssueRevisionService()) {
    this.service = service;
  }

  async list(ctx: Context): Promise<void> {
    const issueId = parseInt(ctx.params.issueId);
    const limit = parseInt(ctx.query.limit as string) || 10;
    const offset = parseInt(ctx.query.offset as string) || 0;

    const result = await this.service.listRevisions(issueId, limit, offset);
    
    success(ctx, listIssueRevisionsResponseSchema.parse(result));
  }
} 