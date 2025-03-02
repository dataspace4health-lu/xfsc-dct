import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OidcGuard extends AuthGuard('oidc') {
  constructor(private reflector: Reflector) {
    super();
  }
  
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    //const result = (await super.canActivate(context)) as boolean;
    //await super.logIn(request);
    //return result;
    return request.isAuthenticated();
  }
}