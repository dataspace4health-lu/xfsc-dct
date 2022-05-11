import { Cache } from 'cache-manager';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { BaseEntity } from '../model/base.entity';

export class BaseDatabaseRepository<T extends BaseEntity> {
    public constructor(protected cache: Cache, protected repository: Repository<T>) {}

    public async getEntity(id: string) {
        return this.rememberValue(id, async () => {
            return this.repository.findOneBy({ id } as FindOptionsWhere<T>); // TODO: remove cast when https://github.com/typeorm/typeorm/issues/8954 is fixed
        });
    }

    public async list() {
        return this.repository.find();
    }

    public async save(entity: DeepPartial<T>) {
        const [result] = await Promise.all([this.repository.save(entity), this.forgetCache(entity.id)]);
        return result;
    }

    public async delete(id: string) {
        const [result] = await Promise.all([this.repository.delete(id), this.forgetCache(id)]);
        return result;
    }

    protected async rememberValue(key: string, fetch: Function): Promise<any> {
        key = this.makeCacheKey(key);

        let data = await this.cache.get(key);
        if (!data) {
            data = await fetch();
            await this.cache.set(key, this.prepareCacheData(data));
        }

        return data;
    }

    protected forgetCache(key): Promise<boolean> {
        return this.cache.del(this.makeCacheKey(key));
    }

    protected makeCacheKey(name) {
        return `${this.constructor.name}:${name}`;
    }

    protected prepareCacheData(data): any {
        return data;
    }
}
