import Joi from 'joi';
import joiDate from '@joi/date';
import { RegisterType } from '../@types';

const joi = Joi.extend(joiDate);

const user = {
  async validateSignUp(payload: RegisterType) {
    const schema = joi.object({
      username: joi.string().required().label('username is required'),
      email: joi.string().email().required().label('A valid email is required'),
      phoneNumber: joi.string().optional().allow('').label('A valid phone number is required'),
      password: joi
        .string()
        .min(4)
        .max(50)
        .required()
        .label('password is required. It must be greater than digits'),
    });
    const { error } = schema.validate(payload);
    if (error) throw error.details[0].context.label;
    return true;
  },
  async validateAuth(payload: RegisterType) {
    const schema = joi.object({
      email: joi.string().email().required().label('A valid email is required'),
      password: joi
        .string()
        .min(4)
        .max(50)
        .optional()
        .label('password is required. It must be greater than digits'),
      tempToken: joi.string().min(6).max(6).optional().label('Invalid or missing token'),
    });
    const { error } = schema.validate(payload);
    if (error) throw error.details[0].context.label;
    return true;
  },
  async validateVerifyToken(payload: RegisterType) {
    const schema = joi.object({
      token: joi.string().required().label('Invalid or missing token in query'),
    });
    const { error } = schema.validate(payload);
    if (error) throw error.details[0].context.label;
    return true;
  },
  async validateToggleStatus(payload: any) {
    const schema = joi.object({
      deactivate: joi.boolean().required().label('Invalid or missing request body.'),
      id: joi.string().required().label('Invalid or missing request body.'),
      reason: joi.string().optional().label('invalid or missing request body'),
    });
    const { error } = schema.validate(payload);
    if (error) throw error.details[0].context.label;
    return true;
  },
};

export default user;
