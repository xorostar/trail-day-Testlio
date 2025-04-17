import { IIssueRevisionRepository, IssueRevisionRepository } from '../repositories/issue-revision.repository';
import { ListIssueRevisionsResponseDto, CompareRevisionsResponseDto } from '../dto/issue-revision.dto';
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

  async compareRevisions(issueId: number, revisionIdA: number, revisionIdB: number): Promise<CompareRevisionsResponseDto> {
    // Get both revisions
    const revisionA = await this.repository.findById(revisionIdA);
    const revisionB = await this.repository.findById(revisionIdB);

    if (!revisionA || !revisionB) {
      throw new ValidationError('One or both revisions not found');
    }

    if (revisionA.issue_id !== issueId || revisionB.issue_id !== issueId) {
      throw new ValidationError('Revisions do not belong to the specified issue');
    }

    // Determine which revision is older
    const dateA = new Date(revisionA.created_at);
    const dateB = new Date(revisionB.created_at);
    const isAFirst = dateA <= dateB;
    const [olderRevision, newerRevision] = isAFirst ? [revisionA, revisionB] : [revisionB, revisionA];

    // Get all revisions between the two (inclusive)
    const allRevisions = await this.repository.listByIssueId(issueId, 1000, 0);
    const revisions = allRevisions.revisions
      .filter(rev => {
        const revDate = new Date(rev.created_at);
        return revDate >= new Date(olderRevision.created_at) && 
               revDate <= new Date(newerRevision.created_at);
      })
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    // Calculate changes
    const changes: Record<string, any> = {};
    if (olderRevision.title !== newerRevision.title) {
      changes.title = newerRevision.title;
    }
    if (olderRevision.description !== newerRevision.description) {
      changes.description = newerRevision.description;
    }

    return {
      before: {
        title: olderRevision.title,
        description: olderRevision.description,
        created_at: olderRevision.created_at
      },
      after: {
        title: newerRevision.title,
        description: newerRevision.description,
        created_at: newerRevision.created_at
      },
      changes,
      revisions
    };
  }
} 