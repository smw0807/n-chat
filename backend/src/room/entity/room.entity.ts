import { Chat } from 'src/chat/entity/chat.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('TB_ROOM')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  description: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isPrivate: boolean;

  @Column({
    type: 'int',
    default: 10,
  })
  maxUsers: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.rooms)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Chat, (chat) => chat.room)
  chats: Chat[];
}
