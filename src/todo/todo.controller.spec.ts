import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

describe('TodoController', () => {
  let controller: TodoController;

  const mockTodoService = {
    create: jest.fn(
      (createDto) =>
        ({
          id: Math.random() * 10,
          complete: false,
          ...createDto,
        }) as CreateTodoDto,
    ),
    findAll: jest.fn((title?: string) =>
      title
        ? [
            {
              id: 1,
              title: title,
              description: 'Filtered todo item',
              complete: false,
            },
          ]
        : [
            {
              id: 1,
              title: 'Default Todo',
              description: 'Default description',
              complete: false,
            },
          ],
    ),
    findOne: jest.fn((id: number) => ({
      id: id,
      title: 'Found Todo',
      description: 'A specific todo item',
      complete: false,
    })),
    update: jest.fn(
      (id: number, updateDto) =>
        ({
          id: id,
          ...updateDto,
        }) as UpdateTodoDto,
    ),
    remove: jest.fn((id: number) => ({
      id: id,
      deleted: true,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [TodoService],
    })
      .overrideProvider(TodoService)
      .useValue(mockTodoService)
      .compile();

    controller = module.get<TodoController>(TodoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a todo', async () => {
      const createTodo: CreateTodoDto = {
        title: 'test-todo',
        description: 'test this todo',
      };
      expect(await controller.create(createTodo)).toEqual({
        id: expect.any(Number) as number,
        title: createTodo.title,
        description: createTodo.description,
        complete: false,
      });
      expect(mockTodoService.create).toHaveBeenCalledWith(createTodo);
    });
  });

  describe('findAll', () => {
    it('should return all todos when no title is provided', async () => {
      expect(await controller.findAll()).toEqual([
        {
          id: 1,
          title: 'Default Todo',
          description: 'Default description',
          complete: false,
        },
      ]);
      expect(mockTodoService.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should return filtered todos by title', async () => {
      expect(await controller.findAll('Filtered')).toEqual([
        {
          id: 1,
          title: 'Filtered',
          description: 'Filtered todo item',
          complete: false,
        },
      ]);
      expect(mockTodoService.findAll).toHaveBeenCalledWith('Filtered');
    });
  });

  describe('findOne', () => {
    it('should return a specific todo by id', async () => {
      expect(await controller.findOne('1')).toEqual({
        id: 1,
        title: 'Found Todo',
        description: 'A specific todo item',
        complete: false,
      });
      expect(mockTodoService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a specific todo by id', async () => {
      const updateTodo: UpdateTodoDto = {
        title: 'Updated Todo',
        description: 'Updated description',
      };
      expect(await controller.update('1', updateTodo)).toEqual({
        id: 1,
        title: 'Updated Todo',
        description: 'Updated description',
      });
      expect(mockTodoService.update).toHaveBeenCalledWith(1, updateTodo);
    });
  });

  describe('remove', () => {
    it('should remove a specific todo by id', async () => {
      expect(await controller.remove('1')).toEqual({
        id: 1,
        deleted: true,
      });
      expect(mockTodoService.remove).toHaveBeenCalledWith(1);
    });
  });
});
