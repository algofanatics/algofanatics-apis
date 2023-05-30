import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req: any = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
