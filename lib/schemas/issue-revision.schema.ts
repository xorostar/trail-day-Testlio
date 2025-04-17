import { z } from 'zod';

export const issueRevisionSchema = z.object({
  id: z.number(),
  issue_id: z.number(),
  title: z.string(),
  description: z.string(),
  changes: z.record(z.any()),
  created_by: z.string(),
  created_at: z.date()
});

export const listIssueRevisionsResponseSchema = z.object({
  revisions: z.array(issueRevisionSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number()
});

export const compareRevisionsResponseSchema = z.object({
  before: z.object({
    title: z.string(),
    description: z.string(),
    created_at: z.date()
  }),
  after: z.object({
    title: z.string(),
    description: z.string(),
    created_at: z.date()
  }),
  changes: z.record(z.any()),
  revisions: z.array(issueRevisionSchema)
}); 