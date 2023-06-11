import { Document } from 'mongodb';
import { IUserType } from '../@types/interface';
import { UserModel, EmailListModel } from '../models';
import Tools, { BaseError } from '../utils';
class User {
  args: (string | undefined)[];
  constructor(...args: (string | undefined)[]) {
    this.args = args;
  }

  async find({ userId, username, email, confirmationCode }: IUserType, res: any) {
    try {
      const profile: IUserType | null =
        userId || email || confirmationCode || username
          ? await UserModel.findOne({
              $or: [{ _id: userId }, { email }, { confirmationCode }, { username }],
            })
          : await UserModel.find();
      return profile;
    } catch (error: any) {
      throw new BaseError('error from user service', error, 'find', 500);
    }
  }

  async update(user: Document, payload: { [x: string]: IUserType }) {
    try {
      for (const input in payload) {
        user[input] = payload[input] || user[input];
      }

      await user.save();

      return user;
    } catch (error) {
      throw new BaseError('error from user service', error, 'update', 500);
    }
  }

  async create({ username, firstName, lastName, email, password, status, confirmationCode }: IUserType, res: any) {
    try {
      const user = await UserModel.create({
        username,
        firstName,
        lastName,
        email,
        password,
        status,
        confirmationCode,
      });

      return user;
    } catch (error: any) {
      throw new BaseError('error from user service', error, 'create', 500);
    }
  }

  async remove({ userId, email }: IUserType, res: any) {
    try {
      const user = await UserModel.deleteOne({
        $or: [{ _id: userId }, { email }],
      });

      return user;
    } catch (error: any) {
      throw new BaseError('error from user service', error, 'remove', 500);
    }
  }

  async addEmailToList({ email }: IUserType, res: any) {
    try {
      const data = await EmailListModel.create({
        email,
      });

      return data;
    } catch (error: any) {
      throw new BaseError('error from user service', error, 'addEmailToList', 500);
    }
  }

  async findOneEmail({ email }: IUserType, res: any) {
    try {
      const data = await EmailListModel.findOne({
        email,
      });

      return data;
    } catch (error: any) {
      throw new BaseError('error from user service', error, 'findOneEmail', 500);
    }
  }
}

export default new User();
