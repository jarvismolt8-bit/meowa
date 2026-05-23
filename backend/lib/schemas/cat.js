import { z } from 'zod';

export const createCatSchema = z.object({ name: z.string().min(1) }).passthrough();
export const updateCatSchema = createCatSchema.partial();
