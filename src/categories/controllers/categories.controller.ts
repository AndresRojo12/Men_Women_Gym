import {
  Controller,
  Get,
  Post,
  ParseIntPipe,
  Delete,
  Put,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import type { Express } from 'express';
import { multerConfig } from 'src/common/config/multer.config';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/roles/rol.enum';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dtos/Category.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  createCategory(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateCategoryDto,
  ) {

    if (!file) {
      throw new Error('File is required');
    }
    return this.categoriesService.create({ ...data, image: file.filename });
    
  }

  @Get()
  getCategories() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  async findOneCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() changes: CreateCategoryDto,
  ) {
    return this.categoriesService.update(id, changes);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
