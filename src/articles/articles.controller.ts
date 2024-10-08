import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ArticleEntity } from './entities/article.entity';

@Controller('articles')
@ApiTags('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiCreatedResponse({
    type: ArticleEntity,
    description: 'The article has been successfully created.',
  })
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  @ApiOkResponse({
    type: ArticleEntity,
    isArray: true,
    description: 'Returns all articles',
  })
  findAll() {
    return this.articlesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: ArticleEntity,
    description: 'Returns a single article',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const article = await this.articlesService.findOne(id);
    if (!article) {
      throw new NotFoundException(`Article with ${id} does not exist.`);
    }

    return article;
  }

  @Get('drafts')
  @ApiOkResponse({
    description: 'Returns all articles that are drafts',
    type: ArticleEntity,
    isArray: true,
  })
  findDrafts() {
    return this.articlesService.findDrafts();
  }

  @Patch(':id')
  @ApiOkResponse({
    type: ArticleEntity,
    description: 'The record has been successfully updated.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.update(id, updateArticleDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    type: ArticleEntity,
    description: 'The record has been successfully deleted.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.remove(id);
  }
}
