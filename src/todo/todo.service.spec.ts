import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { FindOperator } from 'typeorm';

describe('TodoService', () => {
  let service: TodoService;

  const mockTodos: Todo[] = [
    {
      id: Math.floor(Math.random() * 10),
      title: 'test-todo',
      description: 'Filtered todo item',
      complete: false,
    },
    {
      id: Math.floor(Math.random() * 10),
      title: 'Default Todo',
      description: 'Default description',
      complete: false,
    },
  ];

  const mockTodoRepository = {
    save: jest.fn((newTodo: UpdateTodoDto & { id?: number }): Promise<Todo> => {
      if (newTodo.id) {
        const todo = mockTodos.find((todo) => todo.id === newTodo.id);

        return Promise.resolve({ ...todo, ...newTodo } as Todo);
      } else {
        return Promise.resolve({
          id: Math.floor(Math.random() * 10),
          complete: false,
          ...newTodo,
        } as Todo);
      }
    }),
    find: jest.fn((options?: { where?: { title?: FindOperator<string> } }) => {
      return mockTodos.filter((todo) =>
        options?.where?.title
          ? todo.title.startsWith(options?.where?.title.value.slice(0, -1))
          : true,
      );
    }),
    findOneBy: jest.fn((where: { id: number }) => {
      return mockTodos.find((todo) => todo.id === where.id);
    }),
    delete: jest.fn(() => Promise.resolve({ affected: 1 })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: mockTodoRepository,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a todo', async () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Test Todo',
        description: 'Test description',
      };

      const result = await service.create(createTodoDto);
      expect(result).toEqual({
        id: expect.any(Number) as number,
        title: 'Test Todo',
        description: 'Test description',
        complete: false,
      });
    });
  });

  describe('findAll', () => {
    it('should return all todos when no title is provided', async () => {
      await service.findAll();
      expect(mockTodoRepository.find).toHaveBeenCalledWith({ where: {} });
    });

    it('should return filtered todos by title', async () => {
      const title = 'test';
      const result = await service.findAll(title);

      expect(result).toEqual([
        {
          description: mockTodos[0].description,
          complete: false,
          id: expect.any(Number) as number,
          title: mockTodos[0].title,
        },
      ]);
    });
  });

  describe('findOne', () => {
    it('should return a todo by id', async () => {
      const result = await service.findOne(mockTodos[0].id);
      expect(result).toEqual(mockTodos[0]);
      expect(mockTodoRepository.findOneBy).toHaveBeenCalledWith({
        id: mockTodos[0].id,
      });
    });

    it('should throw an error if todo is not found', async () => {
      const result = service.findOne(200);
      await expect(result).rejects.toThrow(NotFoundException);
      await expect(result).rejects.toThrow(
        'Todo item with the specified ID not found',
      );
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const updateTodoDto: UpdateTodoDto = {
        title: 'Updated Todo',
        complete: true,
        description: 'new description',
      };

      const result = await service.update(mockTodos[0].id, updateTodoDto);

      expect(result).toEqual({ id: mockTodos[0].id, ...updateTodoDto });
      expect(mockTodoRepository.findOneBy).toHaveBeenCalledWith({
        id: mockTodos[0].id,
      });
      expect(mockTodoRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateTodoDto),
      );
    });

    it('should throw an error if todo is not found', async () => {
      const updateTodoDto: UpdateTodoDto = { title: 'Updated Todo' };
      const result = service.update(200, updateTodoDto);
      await expect(result).rejects.toThrow(NotFoundException);
      await expect(result).rejects.toThrow(
        'Todo item with the specified ID not found',
      );
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      await service.remove(mockTodos[0].id);
      expect(mockTodoRepository.delete).toHaveBeenCalledWith(mockTodos[0].id);
    });
  });
});
