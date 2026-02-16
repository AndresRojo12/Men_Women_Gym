import { Controller, Get, Post, ParseIntPipe, Delete, Put, Param, Body } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dtos/Category.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private categoriesService: CategoriesService){}
    
    @Post() 
    createCategory(@Body() data: CreateCategoryDto){
        return this.categoriesService.create(data);
    }

    @Get()
    getCategories() {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    async findOneCategory(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.findOne(id);
    }

    @Put(':id')
    async updateCategory(@Param('id', ParseIntPipe) id: number, @Body() changes: CreateCategoryDto) {
        return this.categoriesService.update(id, changes);
    }

    @Delete(':id')
    async deleteCategory(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.remove(id);
    }



}
