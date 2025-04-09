import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';
import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @IsBoolean()
  @ApiProperty({
    description: 'Indicates whether the todo is complete',
    example: true,
    required: false,
  })
  complete?: boolean;
}
