import { ClassSerializerInterceptor, PlainLiteralObject } from "@nestjs/common";
import { ClassTransformOptions } from "class-transformer";

export class JsonldInterceptor extends ClassSerializerInterceptor {

    serialize(response: PlainLiteralObject | Array<PlainLiteralObject>, options: ClassTransformOptions): PlainLiteralObject | Array<PlainLiteralObject> {
        return super.serialize(response, options);
    }
    transformToPlain(plainOrClass: any, options: ClassTransformOptions): PlainLiteralObject {
        return super.transformToPlain(plainOrClass, options);
    }
}