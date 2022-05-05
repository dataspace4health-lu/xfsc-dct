import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cache } from "cache-manager";
import { BaseDatabaseRepository } from "src/common/repositories/base-db.repository";
import { Repository } from "typeorm";
import { Example } from "../entities/example.entity";

@Injectable()
export class ExampleRepository extends BaseDatabaseRepository<Example> {

    public constructor(@Inject(CACHE_MANAGER) cache: Cache, @InjectRepository(Example) repository: Repository<Example>) {
        super(cache, repository);
    }

    public async getEntity(id: string): Promise<Example> {
        return super.getEntity(id);
    }

}