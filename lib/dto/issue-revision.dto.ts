export interface IssueRevisionDto {
  id: number;
  issue_id: number;
  title: string;
  description: string;
  changes: Record<string, any>;
  created_by: string;
  created_at: Date;
}

export interface ListIssueRevisionsResponseDto {
  revisions: IssueRevisionDto[];
  total: number;
  limit: number;
  offset: number;
} 