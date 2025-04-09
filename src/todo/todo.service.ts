import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ILike, Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todosRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto) {
    return this.todosRepository.save(new Todo(createTodoDto));
  }

  async findAll(title?: string) {
    return await this.todosRepository.find({
      where: title
        ? {
            title: ILike(`${title.trim().toLowerCase()}%`),
          }
        : {},
    });
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.todosRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException('Todo item with the specified ID not found');
    }
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    let todo = await this.todosRepository.findOneBy({ id });
    if (!todo)
      throw new NotFoundException('Todo item with the specified ID not found');
    todo = { ...todo, ...updateTodoDto };
    return await this.todosRepository.save(todo);
  }

  async remove(id: number) {
    await this.todosRepository.delete(id);
  }
}
