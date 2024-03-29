
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";


@Entity('channels')
export class Channel
{

  @PrimaryGeneratedColumn({ name: 'channel_id', unsigned: true })
  channelId: number

  @Column({ nullable: true })
  description: string

  @Column({ name: 'profile_image', nullable: true })
  channelImage: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToOne(() => User, (user => user.channelId))
  @JoinColumn({ name: 'user_id' })
  user: User
}
