import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigType } from 'src/config/config.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AdminStrategy } from './strategies/admin.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { TokenStrategy } from './strategies/token.strategy';

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (config: ConfigService<ConfigType>) => {
                const auth = config.get('admin.auth', { infer: true });
                return {
                    secret: auth.secret,
                    signOptions: { expiresIn: auth.expiresIn },
                };
            },
        }),
    ],
    providers: [AuthService, LocalStrategy, AdminStrategy, TokenStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
