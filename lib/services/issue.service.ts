import { CreateIssueDto, IssueResponseDto, ListIssuesResponseDto } from '../dto/issue.dto';
import { createIssueSchema } from '../schemas/issue.schema';
import { IIssueRepository, IssueRepository } from '../repositories/issue.repository';
import { ValidationError } from '../utils/errors';

export class IssueService {
  private repository: IIssueRepository;

  constructor(repository: IIssueRepository = new IssueRepository()) {
    this.repository = repository;
  }

  async createIssue(issue: CreateIssueDto, createdBy: string): Promise<IssueResponseDto> {
    // Validate input
    const validationResult = createIssueSchema.safeParse(issue);
    if (!validationResult.success) {
      throw new ValidationError('Invalid issue data', validationResult.error.errors);
    }

    // Create issue
    return this.repository.create(issue, createdBy);
  }

  async listIssues(limit: number = 10, offset: number = 0): Promise<ListIssuesResponseDto> {
    // Validate pagination parameters
    if (limit < 1 || limit > 100) {
      throw new ValidationError('Limit must be between 1 and 100');
    }
    if (offset < 0) {
      throw new ValidationError('Offset must be greater than or equal to 0');
    }

    const result = await this.repository.list(limit, offset);
    return {
      ...result,
      limit,
      offset
    };
  }
} 