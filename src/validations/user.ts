import Joi from 'joi';
import joiDate from '@joi/date';
const joi = Joi.extend(joiDate);

class UserValidations {
  args: (string | undefined)[];
  constructor(...args: (string | undefined)[]) {
    this.args = args;
  }

  async validateDeleteUser(payload: object): Promise<boolean> {
    const schema = joi.object({
      userId: joi.string().trim(false).required().label('invalid or missing userId. string should not contain spaces.'),
    });
    const { error } = schema.validate(payload, { convert: false });
    if (error) throw error.details[0].context.label;
    return true;
  }

  async validateEmailList(payload: object): Promise<boolean> {
    const schema = joi.object({
      email: joi.string().email().trim(false).required().label('invalid or missing email. string should not contain spaces.'),
    });
    const { error } = schema.validate(payload, { convert: false });
    if (error) throw error.details[0].context.label;
    return true;
  }
}

export default UserValidations;
