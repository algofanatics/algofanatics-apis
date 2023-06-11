import { Request, Response } from 'express';
import User from '../../models/User';
import { ResponseCode, ResponseType, StatusCode } from '../../@types';
import { Toolbox } from '../../utils';

const { apiResponse } = Toolbox;

async function purchase(req: Request, res: Response) {
  try {
    let appUser = req.user as any;
    const results = await User.aggregate([
      { $match: { referer: appUser.referralId } },
      {
        $lookup: {
          from: 'purchases',
          let: {
            authorRef: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$author', '$$authorRef'],
                    },
                    {
                      $eq: ['$productType', 'credit'],
                    },
                    {
                      $gte: ['$amount', 1000],
                    },
                  ],
                },
              },
            },
          ],
          as: 'plans',
        },
      },
    ]);

    const count = results.length;
    const withSavings = results.filter((r) => r.plans.length > 0).length;

    res.send({
      success: true,
      signups: count,
      withSavings,
      remainder: Math.floor(withSavings / 3) - Number(appUser.withdrawalCount),
    });
    // return apiResponse(
    //   res,
    //   ResponseType.SUCCESS,
    //   StatusCode.OK,
    //   ResponseCode.SUCCESS,
    //   'Success message string.'
    // );
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

export default purchase;
