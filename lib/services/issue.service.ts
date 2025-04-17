import { CreateIssueDto, IssueResponseDto, ListIssuesResponseDto } from '../dto/issue.dto';
import { createIssueSchema } from '../schemas/issue.schema';
import { IIssueRepository, IssueRepository } from '../repositories/issue.repository';
import { IIssueRevisionRepository, IssueRevisionRepository } from '../repositories/issue-revision.repository';
import { ValidationError } from '../utils/errors';

export class IssueService {
  private repository: IIssueRepository;
  private revisionRepository: IIssueRevisionRepository;

  constructor(
    repository: IIssueRepository = new IssueRepository(),
    revisionRepository: IIssueRevisionRepository = new IssueRevisionRepository()
  ) {
    this.repository = repository;
    this.revisionRepository = revisionRepository;
  }

  async createIssue(issue: CreateIssueDto, createdBy: string): Promise<IssueResponseDto> {
    // Validate input
    const validationResult = createIssueSchema.safeParse(issue);
    if (!validationResult.success) {
      throw new ValidationError('Invalid issue data', validationResult.error.errors);
    }

    // Create issue
    const createdIssue = await this.repository.create(issue, createdBy);

    // Create initial revision
    await this.revisionRepository.create({
      issue_id: createdIssue.id,
      title: createdIssue.title,
      description: createdIssue.description,
      changes: {
        title: createdIssue.title,
        description: createdIssue.description
      },
      created_by: createdBy
    });

    return createdIssue;
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

  async updateIssue(id: number, issue: Partial<CreateIssueDto>, updatedBy: string): Promise<IssueResponseDto> {
    // Validate input if any fields are provided
    if (issue.title || issue.description) {
      const validationResult = createIssueSchema.partial().safeParse(issue);
      if (!validationResult.success) {
        throw new ValidationError('Invalid issue data', validationResult.error.errors);
      }
    }

    // Get current issue state
    const currentIssue = await this.repository.findById(id);
    if (!currentIssue) {
      throw new ValidationError(`Issue with id ${id} not found`);
    }

    // Update issue
    const updatedIssue = await this.repository.update(id, issue, updatedBy);

    // Create revision if there are changes
    const changes: Record<string, any> = {};
    if (issue.title && issue.title !== currentIssue.title) {
      changes.title = issue.title;
    }
    if (issue.description && issue.description !== currentIssue.description) {
      changes.description = issue.description;
    }

    if (Object.keys(changes).length > 0) {
      await this.revisionRepository.create({
        issue_id: id,
        title: updatedIssue.title,
        description: updatedIssue.description,
        changes,
        created_by: updatedBy
      });
    }

    return updatedIssue;
  }
} 