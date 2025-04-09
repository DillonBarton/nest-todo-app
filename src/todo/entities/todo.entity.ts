import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'unique identifier',
    examples: [1, 2, 3],
  })
  id: number;

  @Column()
  @ApiProperty({
    description: 'The title of the todo',
    example: 'Buy groceries',
  })
  title: string;

  @Column()
  @ApiProperty({
    description: 'A detailed description of the todo',
    example: 'Milk, bread, and eggs',
  })
  description: string;

  @Column({ default: false })
  @ApiProperty({
    description: 'Indicates whether the todo is complete.',
    example: false,
  })
  complete: boolean;

  constructor(todo: Pick<Todo, 'title' | 'description'>) {
    Object.assign(this, todo);
  }
}
