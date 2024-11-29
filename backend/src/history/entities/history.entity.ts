import { Tour } from "src/tour/entities/tour.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('history')
export class History {
    @PrimaryGeneratedColumn()
    historyid: number;

    @Column('date')
    viewed: Date;

    @ManyToOne(() => Tour, (tour) => tour.tourid, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tourid' })
    tour: Tour;

    @ManyToOne(() => User, (users) => users.userid, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userid' })
    user: User;
}
