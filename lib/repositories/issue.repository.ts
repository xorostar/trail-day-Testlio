import { CreateIssueDto, IssueResponseDto, ListIssuesResponseDto } from '../dto/issue.dto';
import Issue from '../models/issue';
import { IIssue } from '../interfaces/db';
import { NotFoundError } from '../utils/errors';

export interface IIssueRepository {
  create(issue: CreateIssueDto, createdBy: string): Promise<IssueResponseDto>;
  list(limit: number, offset: number): Promise<ListIssuesResponseDto>;
  update(id: number, issue: Partial<CreateIssueDto>, updatedBy: string): Promise<IssueResponseDto>;
}

export class IssueRepository implements IIssueRepository {
  async create(issue: CreateIssueDto, createdBy: string): Promise<IssueResponseDto> {
    const createdIssue = await Issue.create({
      ...issue,
      created_by: createdBy,
      updated_by: createdBy
    });

    return createdIssue.toJSON() as IssueResponseDto;
  }

  async list(limit: number, offset: number): Promise<ListIssuesResponseDto> {
    const { count, rows } = await Issue.findAndCountAll({
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    return {
      issues: rows.map(issue => issue.toJSON() as IssueResponseDto),
      total: count,
      limit,
      offset
    };
  }

  async update(id: number, issue: Partial<CreateIssueDto>, updatedBy: string): Promise<IssueResponseDto> {
    const [affectedCount, affectedRows] = await Issue.update(
      { ...issue, updated_by: updatedBy },
      { 
        where: { id },
        returning: true 
      }
    );

    if (affectedCount === 0) {
      throw new NotFoundError(`Issue with id ${id} not found`);
    }

    return affectedRows[0].toJSON() as IssueResponseDto;
  }
} 