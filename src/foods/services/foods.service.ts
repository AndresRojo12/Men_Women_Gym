import {
	Injectable,
	NotFoundException,
	ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Foods } from '../entities/Foods.entity';
import { CreateFoodDto, UpdateFoodDto } from '../dtos/Foods.dto';

@Injectable()
export class FoodsService {
	constructor(
		@InjectRepository(Foods)
		private foodsRepository: Repository<Foods>,
	) {}

	async findAll() {
		return await this.foodsRepository.find({
			order: {
				name: 'ASC',
			},
		});
	}

	async create(data: CreateFoodDto) {
		const existing = await this.foodsRepository.findOne({
			where: { name: data.name },
		});
		if (existing) {
			throw new ConflictException(`Food with name ${data.name} already exists`);
		}
		const food = this.foodsRepository.create(data as any);
		return await this.foodsRepository.save(food);
	}

	async findOne(id: number | string) {
		const food = await this.foodsRepository.findOneBy({ id: id as any });
		if (!food) {
			throw new NotFoundException(`Food with id ${id} not found`);
		}
		return food;
	}

	async update(id: number | string, changes: UpdateFoodDto) {
		const food = await this.foodsRepository.findOneBy({ id: id as any });
		if (!food) {
			throw new NotFoundException(`Food with id ${id} not found`);
		}
		this.foodsRepository.merge(food, changes as any);
		return this.foodsRepository.save(food);
	}

	async remove(id: number | string) {
		return this.foodsRepository.delete(id as any);
	}
}
