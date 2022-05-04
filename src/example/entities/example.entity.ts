import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Example {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    data: string;
}