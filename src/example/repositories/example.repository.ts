import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Example } from "../entities/example.entity";

@Injectable()
export class ExampleRepository {

    public constructor(@InjectRepository(Example) private repository: Repository<Example>) { }


    public async getEntity(id: string): Promise<Example> {
        return this.repository.findOneBy({ id });
    }

    public async getAll(): Promise<Example[]> {
        return this.repository.find();
    }

}