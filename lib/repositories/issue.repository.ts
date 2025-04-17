import { CreateIssueDto, IssueResponseDto } from '../dto/issue.dto';
import Issue from '../models/issue';
import { IIssue } from '../interfaces/db';

export interface IIssueRepository {
  create(issue: CreateIssueDto, createdBy: string): Promise<IssueResponseDto>;
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
} 