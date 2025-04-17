import { IIssueRevisionRepository, IssueRevisionRepository } from '../repositories/issue-revision.repository';
import { ListIssueRevisionsResponseDto } from '../dto/issue-revision.dto';
import { ValidationError } from '../utils/errors';

export class IssueRevisionService {
  private repository: IIssueRevisionRepository;

  constructor(repository: IIssueRevisionRepository = new IssueRevisionRepository()) {
    this.repository = repository;
  }

  async listRevisions(issueId: number, limit: number = 10, offset: number = 0): Promise<ListIssueRevisionsResponseDto> {
    // Validate pagination parameters
    if (limit < 1 || limit > 100) {
      throw new ValidationError('Limit must be between 1 and 100');
    }
    if (offset < 0) {
      throw new ValidationError('Offset must be greater than or equal to 0');
    }

    return this.repository.listByIssueId(issueId, limit, offset);
  }
} 