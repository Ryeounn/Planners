import { City } from "src/city/entities/city.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('attraction')
export class Attraction {
    @PrimaryGeneratedColumn()
    attractionid: number;

    @Column({length: 255})
    attractioname: string;

    @Column('text')
    attractiondescript: string;

    @Column({length: 255})
    attractionpath: string;

    @ManyToOne(() => City, (city) => city.cityid, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'cityid'})
    city: City;
}
