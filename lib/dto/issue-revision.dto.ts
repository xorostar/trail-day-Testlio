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

export interface CompareRevisionsResponseDto {
  before: {
    title: string;
    description: string;
    created_at: Date;
  };
  after: {
    title: string;
    description: string;
    created_at: Date;
  };
  changes: Record<string, any>;
  revisions: IssueRevisionDto[];
} 