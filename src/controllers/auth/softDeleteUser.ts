import { Request, Response } from 'express';
import { ResponseCode, ResponseType, StatusCode, UserInterface } from '../../@types';
import { Toolbox } from '../../utils';
import { userService } from '../../service';

const { apiResponse } = Toolbox;

async function softDeleteUser(req: Request, res: Response) {
  try {
    const { deactivate, id, reason } = req.body;
    const appUser: any = await userService.getUserById(id);

    if (!appUser) {
      return apiResponse(
        res,
        ResponseType.FAILURE,
        StatusCode.BAD_REQUEST,
        ResponseCode.FAILURE,
        {},
        'User not found'
      );
    }

    if (appUser?.isDeleted?.status && deactivate)
      return apiResponse(
        res,
        ResponseType.FAILURE,
        StatusCode.BAD_REQUEST,
        ResponseCode.FAILURE,
        {},
        'This account is already marked for deleting.'
      );

    await userService.updateUser(appUser?._id, {
      isDeleted: {
        status: deactivate,
        date: new Date(),
        reason: reason || 'No reason provided',
      },
    } as unknown as UserInterface);

    return apiResponse(
      res,
      ResponseType.SUCCESS,
      StatusCode.OK,
      ResponseCode.SUCCESS,
      { },
      deactivate ? 'This account will be deleted in 30days.' : 'This account is restored.'
    );
  } catch (error) {
    return apiResponse(
      res,
      ResponseType.FAILURE,
      StatusCode.INTERNAL_SERVER_ERROR,
      ResponseCode.FAILURE,
      {},
      `looks like something went wrong: ${JSON.stringify(error)} `
    );
  }
}

export default softDeleteUser;
