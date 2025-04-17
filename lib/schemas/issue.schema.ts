import { z } from 'zod';
import { IIssue } from '../interfaces/db';

export const createIssueSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters'),
  description: z.string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be less than 1000 characters')
});

export const issueResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  created_by: z.string(),
  updated_by: z.string(),
  created_at: z.date(),
  updated_at: z.date()
}) satisfies z.ZodType<IIssue>; 