import { z } from 'zod';

export const createMedicalSchema = z.object({ notes: z.string().min(1), date: z.string().min(1) }).passthrough();
export const updateMedicalSchema = createMedicalSchema.partial();
