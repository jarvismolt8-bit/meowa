import { z } from 'zod';

export const uploadSchema = z.object({}).passthrough(); // MIME checked by multer config
