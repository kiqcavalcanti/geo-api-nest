import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('distances')
export class Distance {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ name: 'coordinates_hash' })
  coordinatesHash: string;

  @Column({ type: 'float' })
  distance: number;
}
