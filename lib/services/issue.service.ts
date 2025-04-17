import { CreateIssueDto, IssueResponseDto } from '../dto/issue.dto';
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
} 