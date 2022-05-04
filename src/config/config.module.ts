import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import databaseConfig from "./loaders/database.config";
import validationSchema from "./config-validation-schema";


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema,
            load: [databaseConfig]
        }),
    ]
})
export class AppConfigModule { }