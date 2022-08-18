import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';
import { ConfigType } from '../../config/config.module';

@Injectable()
export class AuthService {
    public constructor(
        protected readonly configService: ConfigService<ConfigType>,
        private readonly jwtService: JwtService
    ) { }

    async validateAdmin(username: string, pass: string): Promise<any> {
        const adminConfig = this.configService.get('admin', { infer: true });
        if (username === adminConfig.username && pass === adminConfig.password) {
            return {
                username,
            };
        }
        return null;
    }

    async loginAdmin(user: any) {
        const payload = { username: user.username };
        return {
            accessToken: this.jwtService.sign(payload),
            expiresAt: moment()
                .add(this.configService.get('admin.auth.expiresIn', { infer: true }), 'seconds')
                .unix(),
        };
    }
}
