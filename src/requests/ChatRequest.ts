import Joi from 'joi';

/**
 * Validates payload for a "chat:send" event.
 */
const chatSchema = Joi.object({
  threadId: Joi.string().required(),
  content: Joi.string().min(1).max(2000).required(),
  type: Joi.string().valid('text', 'file').required(),
});

export function validateChatPayload(payload: unknown) {
  const { error, value } = chatSchema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    throw error;
  }
  return value as { threadId: string; content: string; type: 'text' | 'file' };
}
