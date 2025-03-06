import { ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { TokenSet } from 'openid-client';
import { OidcStrategy } from './oidc.strategy';

@Injectable()
export class OidcGuard extends AuthGuard('oidc') {
  constructor(
    private readonly reflector: Reflector,
    @Inject('OidcStrategy') private readonly oidcStrategy: OidcStrategy
  ) {
    super('oidc');
  }
  
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const token = new TokenSet({ access_token: this.extractTokenFromHeader(request) });
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    // Add your token validation logic here
    return await this.oidcStrategy.validate(token);
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      return null;
    }
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}