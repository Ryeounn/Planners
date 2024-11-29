import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('cusinfo')
export class Cusinfo {
    @PrimaryGeneratedColumn()
    cusinfoid: number;

    @Column({length: 255})
    cusname: string;

    @Column({length: 255})
    cusphone: string;

    @Column('text')
    cusadd: string;

    @Column({length: 255})
    cusemail: string;

    @Column({length: 255})
    cusnation: string;

    @Column({length: 255})
    cuspp: string;
}
