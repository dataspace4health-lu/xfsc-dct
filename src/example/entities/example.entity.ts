import { BaseEntity } from 'src/common/model/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Example extends BaseEntity {
    @Column()
    data: string;
}
