import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/Category.dto';


@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ){}

    findAll(): Promise<Category[]> {
        return this.categoriesRepository.find();
    }

    create(data: CreateCategoryDto) {
        /*const vUnique = this.categoriesRepository.findOne({ where: {name: data.name}, });
        if(!vUnique){
          throw new NotFoundException(`Category with name ${data.name} created`);  
        }*/
        const newCategory = this.categoriesRepository.create(data);
        //if(newCategory){
          //throw new ConflictException(`Category with name ${data.name} already exists`);
       // }
        return this.categoriesRepository.save(newCategory);
    }

    async findOne(id: number) {
        const category = await this.categoriesRepository.findOneBy({ id });
        if(!category){
          throw new NotFoundException(`Category with id ${id} not found`);  
        }
        return category;
    } 

    async update(id: number, changes: UpdateCategoryDto) {
        const category = await this.categoriesRepository.findOneBy({ id });
        if(!category){
          throw new NotFoundException(`Category with id ${id} not found`);  
        }
        this.categoriesRepository.merge(category, changes);
        return this.categoriesRepository.save(category);
    }

    async remove(id: number) {
        return this.categoriesRepository.delete(id);
    }

}


