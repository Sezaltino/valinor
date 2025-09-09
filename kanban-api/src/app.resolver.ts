import { Query, Resolver, Mutation, Args, ID } from '@nestjs/graphql';
import { ValidationPipe } from '@nestjs/common';

// Entities
import { User } from './modules/users/entities/user.entity';
import { Board } from './modules/boards/entities/board.entity';
import { Task } from './modules/tasks/entities/task.entity';

// Services
import { UsersService } from './modules/users/users.service';
import { BoardsService } from './modules/boards/boards.service';
import { TasksService } from './modules/tasks/tasks.service';

// DTOs
import { CreateUserInput } from './modules/users/dto/create-user.input';
import { UpdateUserInput } from './modules/users/dto/update-user.input';
import { CreateBoardInput } from './modules/boards/dto/create-board.input';
import { UpdateBoardInput } from './modules/boards/dto/update-board.input';
import { CreateTaskInput } from './modules/tasks/dto/create-task.input';
import { UpdateTaskInput } from './modules/tasks/dto/update-task.input';

// Enums
import { TaskStatus } from './common/enums/task-status.enum';

@Resolver()
export class AppResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly boardsService: BoardsService,
    private readonly tasksService: TasksService,
  ) {}

  // ============ HEALTH CHECKS ============
  @Query(() => String)
  hello(): string {
    return 'Hello, Kanban API is working!';
  }

  @Query(() => String)
  health(): string {
    return 'API is healthy and running';
  }

  // ============ USER OPERATIONS ============
  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User)
  async user(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Mutation(() => User)
  async createUser(
    @Args('input', new ValidationPipe()) input: CreateUserInput,
  ): Promise<User> {
    return this.usersService.create(input);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('input', new ValidationPipe()) input: UpdateUserInput,
  ): Promise<User> {
    return this.usersService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteUser(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.usersService.delete(id);
    return true;
  }

  // ============ BOARD OPERATIONS ============
  @Query(() => [Board])
  async boards(): Promise<Board[]> {
    return this.boardsService.findAll();
  }

  @Query(() => Board)
  async board(@Args('id', { type: () => ID }) id: string): Promise<Board> {
    return this.boardsService.findById(id);
  }

  @Query(() => [Board])
  async boardsByUser(
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<Board[]> {
    return this.boardsService.findByUserId(userId);
  }

  @Mutation(() => Board)
  async createBoard(
    @Args('input', new ValidationPipe()) input: CreateBoardInput,
  ): Promise<Board> {
    return this.boardsService.create(input);
  }

  @Mutation(() => Board)
  async updateBoard(
    @Args('id', { type: () => ID }) id: string,
    @Args('input', new ValidationPipe()) input: UpdateBoardInput,
  ): Promise<Board> {
    return this.boardsService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteBoard(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.boardsService.delete(id);
    return true;
  }

  // ============ TASK OPERATIONS ============
  @Query(() => [Task])
  async tasks(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  @Query(() => Task)
  async task(@Args('id', { type: () => ID }) id: string): Promise<Task> {
    return this.tasksService.findById(id);
  }

  @Query(() => [Task])
  async tasksByBoard(
    @Args('boardId', { type: () => ID }) boardId: string,
  ): Promise<Task[]> {
    return this.tasksService.findByBoardId(boardId);
  }

  @Query(() => [Task])
  async tasksByStatus(
    @Args('boardId', { type: () => ID }) boardId: string,
    @Args('status', { type: () => TaskStatus }) status: TaskStatus,
  ): Promise<Task[]> {
    return this.tasksService.findByStatus(boardId, status);
  }

  @Mutation(() => Task)
  async createTask(
    @Args('input', new ValidationPipe()) input: CreateTaskInput,
  ): Promise<Task> {
    return this.tasksService.create(input);
  }

  @Mutation(() => Task)
  async updateTask(
    @Args('id', { type: () => ID }) id: string,
    @Args('input', new ValidationPipe()) input: UpdateTaskInput,
  ): Promise<Task> {
    return this.tasksService.update(id, input);
  }

  @Mutation(() => Task)
  async moveTask(
    @Args('id', { type: () => ID }) id: string,
    @Args('status', { type: () => TaskStatus }) status: TaskStatus,
  ): Promise<Task> {
    return this.tasksService.moveTask(id, status);
  }

  @Mutation(() => Boolean)
  async deleteTask(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.tasksService.delete(id);
    return true;
  }
}
