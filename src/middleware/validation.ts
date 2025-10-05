import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.details.map(detail => detail.message) 
      });
    }
    return next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({ 
        error: 'Query validation error', 
        details: error.details.map(detail => detail.message) 
      });
    }
    return next();
  };
};

// Validation schemas
export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  first_name: Joi.string().min(2).max(100).required(),
  last_name: Joi.string().min(2).max(100).required(),
  role: Joi.string().valid('citizen', 'admin', 'provider').optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const createGrievanceSchema = Joi.object({
  title: Joi.string().min(5).max(255).required(),
  description: Joi.string().min(10).required(),
  service_id: Joi.number().integer().optional(),
  location_text: Joi.string().optional(),
});

export const updateGrievanceSchema = Joi.object({
  status: Joi.string().valid('Submitted', 'In Progress', 'Resolved', 'Closed').optional(),
  assigned_provider_id: Joi.number().integer().optional(),
});

export const createAnnouncementSchema = Joi.object({
  title: Joi.string().min(5).max(255).required(),
  content: Joi.string().min(10).required(),
  target_audience: Joi.string().valid('all', 'citizens', 'service_providers').default('all'),
  expires_at: Joi.date().optional()
});

export const addCommentSchema = Joi.object({
  comment_text: Joi.string().min(1).required(),
  is_internal: Joi.boolean().default(false)
});

export const grievanceQuerySchema = Joi.object({
  status: Joi.string().valid('submitted', 'in_progress', 'assigned', 'resolved', 'closed').optional(),
  service_id: Joi.string().uuid().optional(),
  zone_id: Joi.string().uuid().optional(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
  assigned_to: Joi.string().uuid().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort_by: Joi.string().valid('created_at', 'updated_at', 'priority', 'status').default('created_at'),
  sort_order: Joi.string().valid('asc', 'desc').default('desc')
});
