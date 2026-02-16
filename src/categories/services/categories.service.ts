import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/Category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  // validación para evitar duplicados mas limpio

  //async create(data: CreateCategoryDto) {

  //const exists = await this.categoriesRepository.exists({
  //where: { name: data.name },
  //});

  //if (exists) {
  //throw new ConflictException(
  //`Category with name ${data.name} already exists`,
  //);
  //}

  //return await this.categoriesRepository.save(data);
  //}

  async create(data: CreateCategoryDto) {
    /*const vUnique = this.categoriesRepository.findOne({ where: {name: data.name}, });
        if(!vUnique){
          throw new NotFoundException(`Category with name ${data.name} created`);  
        }*/
    const existingCategory = await this.categoriesRepository.findOne({
      where: { name: data.name },
    });
    if (existingCategory) {
      throw new ConflictException(
        `Category with name ${data.name} already exists`,
      );
    }
    const newCategory = this.categoriesRepository.create(data);

    return await this.categoriesRepository.save(newCategory);
  }

  async findOne(id: number) {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async update(id: number, changes: UpdateCategoryDto) {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    this.categoriesRepository.merge(category, changes);
    return this.categoriesRepository.save(category);
  }

  async remove(id: number) {
    return this.categoriesRepository.delete(id);
  }
}
