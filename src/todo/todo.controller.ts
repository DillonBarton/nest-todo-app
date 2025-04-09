import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Todo } from './entities/todo.entity';

@ApiTags('Todo')
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiBody({ type: CreateTodoDto, description: 'Payload to create a new todo' })
  @ApiResponse({
    status: 201,
    description: 'The todo has been successfully created.',
    type: Todo,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all todos' })
  @ApiQuery({
    name: 'title',
    required: false,
    description: 'Filter todos by title',
  })
  @ApiResponse({
    status: 200,
    type: Todo,
    isArray: true,
    description: 'Successfully retrieved todos.',
  })
  async findAll(@Query('title') title?: string) {
    return this.todoService.findAll(title);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a todo by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the todo', type: String })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the todo.',
    type: Todo,
  })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  async findOne(@Param('id') id: string) {
    return this.todoService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing todo' })
  @ApiParam({ name: 'id', description: 'The ID of the todo', type: String })
  @ApiBody({
    description: 'Payload to update a todo',
    schema: {
      example: {
        title: 'Buy groceries',
        description: 'Milk, bread, eggs and butter',
        complete: true,
      } as UpdateTodoDto,
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The todo has been successfully updated.',
    schema: {
      example: {
        id: 1,
        title: 'Buy groceries',
        description: 'Milk, bread, eggs and butter',
        complete: true,
      } as Todo,
    },
  })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  async update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(+id, updateTodoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the todo', type: String })
  @ApiResponse({
    status: 200,
    description: 'The todo has been successfully deleted.',
    schema: {
      example: {
        message: 'Todo deleted successfully',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  remove(@Param('id') id: string) {
    return this.todoService.remove(+id);
  }
}
