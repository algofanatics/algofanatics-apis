import { IPasswordResetToken } from '../@types/interface';
import { PasswordResetTokenModel } from '../models';
import Tools, { BaseError } from '../utils';

class PasswordResetToken {
  args: (string | undefined)[];
  constructor(...args: (string | undefined)[]) {
    this.args = args;
  }

  async find({ userId, token }: IPasswordResetToken, res: any) {
    try {
      const resetToken: IPasswordResetToken | null =
        userId && token
          ? await PasswordResetTokenModel.findOne({ userId, token })
          : await PasswordResetTokenModel.find({ userId });
      return resetToken;
    } catch (error) {
      throw new BaseError('error from password reset service', error, 'find', 500);
    }
  }

  async create({ userId, token }: IPasswordResetToken, res: any) {
    try {
      const passwordResetToken = await PasswordResetTokenModel.create({
        userId,
        token,
      });

      return passwordResetToken;
    } catch (error) {
      throw new BaseError('error from password reset service', error, 'create', 500);
    }
  }

  async remove({ userId }: IPasswordResetToken, res: any) {
    try {
      const user = await PasswordResetTokenModel.deleteOne({ userId });

      return user;
    } catch (error) {
      throw new BaseError('error from password reset service', error, 'remove', 500);
    }
  }
}

export default new PasswordResetToken();
