import { IssueRevisionDto, ListIssueRevisionsResponseDto } from '../dto/issue-revision.dto';
import IssueRevision from '../models/issue-revision';
import { NotFoundError } from '../utils/errors';

export interface IIssueRevisionRepository {
  create(revision: Omit<IssueRevisionDto, 'id' | 'created_at'>): Promise<IssueRevisionDto>;
  listByIssueId(issueId: number, limit: number, offset: number): Promise<ListIssueRevisionsResponseDto>;
  findById(id: number): Promise<IssueRevisionDto | null>;
}

export class IssueRevisionRepository implements IIssueRevisionRepository {
  async create(revision: Omit<IssueRevisionDto, 'id' | 'created_at'>): Promise<IssueRevisionDto> {
    const createdRevision = await IssueRevision.create(revision);
    return createdRevision.toJSON() as IssueRevisionDto;
  }

  async listByIssueId(issueId: number, limit: number, offset: number): Promise<ListIssueRevisionsResponseDto> {
    const { count, rows } = await IssueRevision.findAndCountAll({
      where: { issue_id: issueId },
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    return {
      revisions: rows.map(revision => revision.toJSON() as IssueRevisionDto),
      total: count,
      limit,
      offset
    };
  }

  async findById(id: number): Promise<IssueRevisionDto | null> {
    const revision = await IssueRevision.findByPk(id);
    return revision ? revision.toJSON() as IssueRevisionDto : null;
  }
} 