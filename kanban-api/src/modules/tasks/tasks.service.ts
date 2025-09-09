import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskStatus } from '../../common/enums/task-status.enum';
import { Priority } from '../../common/enums/priority.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  // Buscar todas as tasks
  async findAll(): Promise<Task[]> {
    return this.taskRepository.find({
      order: { position: 'ASC', createdAt: 'DESC' },
    });
  }

  // Buscar tasks de um board
  async findByBoardId(boardId: string): Promise<Task[]> {
    return this.taskRepository.find({
      where: { boardId },
      order: { position: 'ASC', createdAt: 'DESC' },
    });
  }

  // Buscar tasks por status
  async findByStatus(boardId: string, status: TaskStatus): Promise<Task[]> {
    return this.taskRepository.find({
      where: { boardId, status },
      order: { position: 'ASC' },
    });
  }

  // Buscar task por ID
  async findById(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  // Criar nova task
  async create(taskData: {
    title: string;
    description?: string;
    boardId: string;
    assigneeId?: string;
    priority?: Priority;
    dueDate?: Date;
  }): Promise<Task> {
    // Calcular próxima posição
    const lastTask = await this.taskRepository.findOne({
      where: { boardId: taskData.boardId, status: TaskStatus.TODO },
      order: { position: 'DESC' },
    });

    const position = lastTask ? lastTask.position + 1 : 0;

    const task = this.taskRepository.create({
      ...taskData,
      position,
      status: TaskStatus.TODO,
    });

    return this.taskRepository.save(task);
  }

  // Atualizar task
  async update(
    id: string,
    updateData: {
      title?: string;
      description?: string;
      priority?: Priority;
      dueDate?: Date;
      assigneeId?: string;
    },
  ): Promise<Task> {
    const task = await this.findById(id);

    Object.assign(task, updateData);
    return this.taskRepository.save(task);
  }

  // Mover task para novo status
  async moveTask(id: string, newStatus: TaskStatus): Promise<Task> {
    const task = await this.findById(id);

    // Calcular nova posição
    const lastTaskInNewStatus = await this.taskRepository.findOne({
      where: { boardId: task.boardId, status: newStatus },
      order: { position: 'DESC' },
    });

    const newPosition = lastTaskInNewStatus
      ? lastTaskInNewStatus.position + 1
      : 0;

    task.status = newStatus;
    task.position = newPosition;

    return this.taskRepository.save(task);
  }

  // Deletar task
  async delete(id: string): Promise<void> {
    const task = await this.findById(id);
    await this.taskRepository.remove(task);
  }

  // Reordenar tasks
  async reorderTasks(
    boardId: string,
    status: TaskStatus,
    taskIds: string[],
  ): Promise<Task[]> {
    const tasks = await this.findByStatus(boardId, status);

    // Atualizar posições baseado na ordem fornecida
    const updates = taskIds
      .map((taskId, index) => {
        const task = tasks.find((t) => t.id === taskId);
        if (task) {
          task.position = index;
          return task;
        }
        return null;
      })
      .filter((task): task is Task => task !== null);

    return this.taskRepository.save(updates);
  }
}
