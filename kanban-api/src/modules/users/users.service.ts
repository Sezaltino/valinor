import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Buscar todos os usuários
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  // Buscar usuário por ID
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  // Buscar usuário por email
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  // Criar novo usuário
  async create(userData: {
    email: string;
    name: string;
    password: string;
    avatar?: string;
  }): Promise<User> {
    // Verificar se email já existe
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Criar usuário
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  // Atualizar usuário
  async update(
    id: string,
    updateData: {
      name?: string;
      avatar?: string;
      password?: string;
    },
  ): Promise<User> {
    const user = await this.findById(id);

    // Hash nova senha se fornecida
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // Atualizar campos
    Object.assign(user, updateData);

    return this.userRepository.save(user);
  }

  // Deletar usuário
  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
  }

  // Verificar senha (para autenticação)
  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}
