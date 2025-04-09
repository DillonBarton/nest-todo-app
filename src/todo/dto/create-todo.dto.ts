import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({
    description: 'The title of the todo',
    example: 'Buy groceries',
  })
  title: string;
  @IsString()
  @MinLength(5)
  @MaxLength(10000)
  @ApiProperty({
    description: 'A detailed description of the todo',
    example: 'Milk, bread, and eggs',
  })
  description: string;
}
