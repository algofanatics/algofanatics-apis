import Joi from 'joi';
import joiDate from '@joi/date';
const joi = Joi.extend(joiDate);
class AuthValidations {
  args: (string | undefined)[];
  constructor(...args: (string | undefined)[]) {
    this.args = args;
  }

  async validateLogin(payload: object): Promise<boolean> {
    const schema = joi.object({
      email: joi
        .string()
        .email()
        .trim(false)
        .lowercase()
        .required()
        .label('invalid or missing email address. string should not contain spaces. use small letters.'),
      password: joi.string().min(8).max(50).trim().required().label('invalid or missing password'),
    });
    const { error } = schema.validate(payload, { convert: false });
    if (error) throw error.details[0].context.label;
    return true;
  }

  async validateSignup(payload: object): Promise<boolean> {
    const schema = joi.object({
      username: joi
        .string()
        .trim(false)
        .lowercase()
        .required()
        .label('invalid or missing username. string should not contain spaces. use small letters.'),
      firstName: joi
        .string()
        .trim(false)
        .lowercase()
        .optional()
        .label('invalid or missing firstName. string should not contain spaces. use small letters.'),
      lastName: joi
        .string()
        .trim(false)
        .lowercase()
        .optional()
        .label('invalid or missing lastName. string should not contain spaces. use small letters.'),
      email: joi
        .string()
        .email()
        .trim(false)
        .lowercase()
        .required()
        .label('invalid or missing email address. string should not contain spaces. use small letters.'),
      password: joi.string().min(8).max(50).required().label('invalid or missing password'),
    });
    const { error } = schema.validate(payload, { convert: false });
    if (error) throw error.details[0].context.label;
    return true;
  }

  async validateVerifyEmail(payload: object): Promise<boolean> {
    const schema = joi.object({
      confirmationCode: joi
        .string()
        .trim(false)
        .required()
        .label('invalid or missing confirmation code. string should not contain spaces.'),
    });
    const { error } = schema.validate(payload, { convert: false });
    if (error) throw error.details[0].context.label;
    return true;
  }
}

export default AuthValidations;
