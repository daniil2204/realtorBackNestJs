import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data, context: ExecutionContext) => {
  const { user } = context.switchToHttp().getRequest();
  return {
    id: user.id,
    name: user.name,
  };
});
