import { IsString } from "class-validator";


export class ValidateLogTokenDto {
    @IsString()
    logToken: string;
}