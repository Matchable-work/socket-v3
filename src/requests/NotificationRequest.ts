import Joi from 'joi';

/**
 * Validates payload for a "notification:send" event.
 * If invalid, it throws a Joi.ValidationError.
 */
const notificationSchema = Joi.object({
  to: Joi.string().required(),
  title: Joi.string().min(3).required(),
  body: Joi.string().min(1).required(),
  url: Joi.string().uri().optional(),
});

export function validateNotificationPayload(payload: unknown) {
  const { error, value } = notificationSchema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    throw error;
  }
  return value as { to: string; title: string; body: string; url?: string };
}
