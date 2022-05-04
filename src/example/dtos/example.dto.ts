import { IsOptional } from "class-validator";


export class ExampleDto {

    @IsOptional()
    data: string

}