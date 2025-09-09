import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  // Buscar todos os boards
  async findAll(): Promise<Board[]> {
    return this.boardRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  // Buscar boards de um usuário
  async findByUserId(userId: string): Promise<Board[]> {
    return this.boardRepository.find({
      where: { ownerId: userId },
      order: { createdAt: 'DESC' },
    });
  }

  // Buscar board por ID
  async findById(id: string): Promise<Board> {
    const board = await this.boardRepository.findOne({
      where: { id },
    });

    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }

    return board;
  }

  // Criar novo board
  async create(boardData: {
    name: string;
    description?: string;
    color?: string;
    ownerId: string;
  }): Promise<Board> {
    const board = this.boardRepository.create(boardData);
    return this.boardRepository.save(board);
  }

  // Atualizar board
  async update(
    id: string,
    updateData: {
      name?: string;
      description?: string;
      color?: string;
    },
  ): Promise<Board> {
    const board = await this.findById(id);
    Object.assign(board, updateData);
    return this.boardRepository.save(board);
  }

  // Deletar board
  async delete(id: string): Promise<void> {
    const board = await this.findById(id);
    await this.boardRepository.remove(board);
  }
}
