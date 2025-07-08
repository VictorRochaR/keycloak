import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itensRepository: Repository<Item>,
  ) {}

  create(createItemDto: CreateItemDto): Promise<Item> {
    const item = this.itensRepository.create(createItemDto);
    return this.itensRepository.save(item);
  }

  findAll(): Promise<Item[]> {
    return this.itensRepository.find();
  }

  async findOne(id: number): Promise<Item> {
    const item = await this.itensRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Item com ID ${id} não encontrado.`);
    }
    return item;
  }

  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    const item = await this.itensRepository.preload({
      id: id,
      ...updateItemDto,
    });
    if (!item) {
      throw new NotFoundException(`Item com ID ${id} não encontrado.`);
    }
    return this.itensRepository.save(item);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await this.itensRepository.remove(item);
  }
}