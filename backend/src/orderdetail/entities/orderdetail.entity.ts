import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Orders } from 'src/orders/entities/order.entity';
import { TourPrice } from 'src/tourprice/entities/tourprice.entity';
import { Cusinfo } from 'src/cusinfo/entities/cusinfo.entity';

@Entity('orderdetail')
export class OrderDetail {
  @PrimaryGeneratedColumn()
  orderdetailid: number;

  @ManyToOne(() => Orders, (order) => order.orderid, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderid' })
  order: Orders;

  @ManyToOne(() => TourPrice, (tourPrice) => tourPrice.tourpriceid, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tourpriceid' })
  tourPrice: TourPrice;

  @ManyToOne(() => Cusinfo,(cusinfo) => cusinfo.cusinfoid, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'cusinfoid'})
  cusinfo: Cusinfo;
}
