import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ExampleDto {
    @IsString()
    @IsNotEmpty()
    data: string;
}
