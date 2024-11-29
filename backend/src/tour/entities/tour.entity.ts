import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Region } from 'src/region/entities/region.entity';
import { Admin } from 'src/admins/entities/admin.entity';

@Entity('tour')
export class Tour {
    @PrimaryGeneratedColumn()
    tourid: number;

    @Column({ length: 255 })
    tourname: string;

    @Column('text')
    descrip: string;

    @Column('int')
    totaldate: number;

    @Column('date')
    startdate: Date;

    @Column({ length: 255 })
    airline: string;

    @Column({ length: 255 })
    imgairline: string;

    @Column('int')
    inventory: number;

    @Column({ length: 255 })
    condition: string;

    @Column({ length: 255 })
    tourpath: string;

    @Column({ length: 255 })
    nation: string;

    @Column('text')
    desclong: string;

    @Column({length: 255})
    tourcode: string;

    @ManyToOne(() => Region, (region) => region.regionid, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'regionid' })
    region: Region;

    @ManyToOne(() => Admin, (admin) => admin.adminid, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'adminid' })
    admin: Admin;
}
