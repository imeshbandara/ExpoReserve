import { z } from 'zod';

export const uuidSchema = z.uuid();

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const validateParams = (schema, params) => {
  const result = schema.safeParse(params);
  if (!result.success) {
    const error = new Error('Invalid request parameters.');
    error.statusCode = 400;
    error.details = formatZodIssues(result.error);
    throw error;
  }
  return result.data;
};

export const validateBody = (schema, body) => {
  const result = schema.safeParse(body);
  if (!result.success) {
    const error = new Error('Validation failed.');
    error.statusCode = 400;
    error.details = formatZodIssues(result.error);
    throw error;
  }
  return result.data;
};

export const formatZodIssues = (error) => error.issues.map((issue) => ({
  field: issue.path.join('.'),
  message: issue.message,
}));

// User Profile
export const updateUserProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().max(20).optional().nullable(),
  organization_name: z.string().max(100).optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
});

// Reservations
export const createReservationSchema = z.object({
  exhibition_id: z.string().uuid(),
  reservation_date: z.string().datetime().refine(val => new Date(val) >= new Date(new Date().setHours(0,0,0,0)), {
    message: "Reservation date must be today or in the future"
  }),
  stall_type: z.enum(['STANDARD', 'PREMIUM', 'CORNER']),
  stall_size: z.enum(['SMALL', 'MEDIUM', 'LARGE']),
  quantity: z.number().int().min(1).max(10).default(1),
  business_category: z.string().min(2).max(100),
  special_requirements: z.string().max(500).optional().nullable(),
});

export const updateReservationSchema = z.object({
  stall_type: z.enum(['STANDARD', 'PREMIUM', 'CORNER']).optional(),
  stall_size: z.enum(['SMALL', 'MEDIUM', 'LARGE']).optional(),
  quantity: z.number().int().min(1).max(10).optional(),
  business_category: z.string().min(2).max(100).optional(),
  special_requirements: z.string().max(500).optional().nullable(),
});

// Exhibitions
export const createExhibitionSchemaBase = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(1000).optional().nullable(),
  venue: z.string().min(3).max(200),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  max_stalls: z.number().int().min(1).max(5000).default(100),
});

export const createExhibitionSchema = createExhibitionSchemaBase.refine(data => new Date(data.start_date) < new Date(data.end_date), {
  message: "End date must be after start date",
  path: ["end_date"]
});

export const updateExhibitionSchema = createExhibitionSchemaBase.partial().refine(
  data => {
    if (data.start_date && data.end_date) {
      return new Date(data.start_date) < new Date(data.end_date);
    }
    return true; // if both dates aren't provided, we can't reliably compare here
  }, {
  message: "End date must be after start date",
  path: ["end_date"]
});

// Stall Inventory
export const upsertStallInventorySchema = z.object({
  exhibition_id: z.string().uuid(),
  stall_type: z.enum(['STANDARD', 'PREMIUM', 'CORNER']),
  stall_size: z.enum(['SMALL', 'MEDIUM', 'LARGE']),
  total_count: z.number().int().min(0),
});
