import { IIssue } from '../interfaces/db';

export interface CreateIssueDto {
  title: string;
  description: string;
}

export interface IssueResponseDto extends IIssue {
  id: number;
  created_by: string;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface ListIssuesResponseDto {
  issues: IssueResponseDto[];
  total: number;
  limit: number;
  offset: number;
} 