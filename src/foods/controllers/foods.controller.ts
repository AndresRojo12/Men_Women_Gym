import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Param,
	Body,
	ParseIntPipe,
	UseGuards,
} from '@nestjs/common';
import { FoodsService } from '../services/foods.service';
import { CreateFoodDto, UpdateFoodDto } from '../dtos/Foods.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/roles/rol.enum';

@Controller('foods')
export class FoodsController {
	constructor(private readonly foodsService: FoodsService) {}

	@Post()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	create(@Body() data: CreateFoodDto) {
		return this.foodsService.create(data);
	}

	@Get()
	findAll() {
		return this.foodsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.foodsService.findOne(id);
	}

	@Put(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	update(@Param('id', ParseIntPipe) id: number, @Body() changes: UpdateFoodDto) {
		return this.foodsService.update(id, changes);
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.foodsService.remove(id);
	}
}
