import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { Priority } from '../../../common/enums/priority.enum';

@InputType()
export class UpdateTaskInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  assigneeId?: string;

  @Field(() => Priority, { nullable: true })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  dueDate?: Date;
}
