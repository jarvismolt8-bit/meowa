import { z } from 'zod';

export const createVaccinationSchema = z.object({ name: z.string().min(1), date: z.string().min(1) }).passthrough();
export const updateVaccinationSchema = createVaccinationSchema.partial();
