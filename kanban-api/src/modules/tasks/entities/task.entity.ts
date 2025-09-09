import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { TaskStatus } from '../../../common/enums/task-status.enum';
import { Priority } from '../../../common/enums/priority.enum';

@ObjectType()
@Entity('tasks')
export class Task {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  description?: string;

  @Field(() => TaskStatus)
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Field(() => Priority)
  @Column({
    type: 'enum',
    enum: Priority,
    default: Priority.MEDIUM,
  })
  priority: Priority;

  @Field({ nullable: true })
  @Column({ nullable: true })
  dueDate?: Date;

  @Field()
  @Column({ default: 0 })
  position: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  // Adicionar campos de relacionamento como colunas simples
  @Field()
  @Column()
  boardId: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  assigneeId?: string;
}
