import { CreateIssueDto, IssueResponseDto } from '../dto/issue.dto';
import Issue from '../models/issue';
import { IIssue } from '../interfaces/db';

export interface IIssueRepository {
  create(issue: CreateIssueDto, createdBy: string): Promise<IssueResponseDto>;
  list(limit: number, offset: number): Promise<{ issues: IssueResponseDto[]; total: number }>;
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

  async list(limit: number, offset: number): Promise<{ issues: IssueResponseDto[]; total: number }> {
    const { count, rows } = await Issue.findAndCountAll({
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    return {
      issues: rows.map(issue => issue.toJSON() as IssueResponseDto),
      total: count
    };
  }
} 