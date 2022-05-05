import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


export class BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @UpdateDateColumn()
    updateAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}