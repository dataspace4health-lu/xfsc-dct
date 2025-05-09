import {
    Controller,
    Get,
    Request,
    Res,
    UseGuards,
  } from '@nestjs/common';
  import { Response } from 'express';
  
  import { OidcGuard } from './oidc.guard';
  import { Issuer } from 'openid-client';
  
  @Controller()
  export class OidcController {
  
    @UseGuards(OidcGuard)
    @Get('/login')
    login() {}
  
    @UseGuards(OidcGuard)
    @Get('/user')
    user(@Request() req) {
      return req.user
    }
    
    @UseGuards(OidcGuard)
    @Get('/callback')
    loginCallback(@Res() res: Response) {
      res.redirect('/');
    }
    
    @UseGuards(OidcGuard)
    @Get('/logout')
    async logout(@Request() req, @Res() res: Response) {
      const id_token = req.user ? req.user.id_token : undefined;
      req.logout();
      req.session.destroy(async (error: any) => {
        const TrustIssuer = await Issuer.discover(`${process.env.NX_OIDC_ISSUER}/.well-known/openid-configuration`);
        const end_session_endpoint = TrustIssuer.metadata.end_session_endpoint;
        if (end_session_endpoint) {
          res.redirect(end_session_endpoint + 
            '?post_logout_redirect_uri=' + process.env.NX_OIDC_POST_LOGOUT_REDIRECT_URI + 
            (id_token ? '&id_token_hint=' + id_token : ''));
        } else {
          res.redirect('/')
        }
      })
    }
  }