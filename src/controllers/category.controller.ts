import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';

import {Category} from '../models';
import {CategoryRepository} from '../repositories';
import {ApiResponse, ERROR, SUCCESS} from '../responses';

class CategoryUpdated {
  code?: string;
  name?: string;
  description?: string;
  status?: boolean;
  deletedAt?: Date;
}

@authenticate('jwt')
export class CategoryController {
  constructor(
    @repository(CategoryRepository)
    public categoryRepository: CategoryRepository,
  ) {}

  @post('/categories')
  @response(200, {
    description: 'Create a new category',
    content: {'application/json': {schema: getModelSchemaRef(Category)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {
            exclude: ['id'],
          }),
        },
      },
    })
    category: Omit<Category, 'id'>,
  ): Promise<ApiResponse> {
    const verifyCategory = await this.verifyExist(category);

    if (verifyCategory?.code === undefined) {
      const data = await this.categoryRepository.create(category);

      return new ApiResponse(true, SUCCESS.CATEGORY_CREATED, data);
    } else {
      return verifyCategory;
    }
  }

  async verifyExist(category: any) {
    const codeFound = await this.categoryRepository.execute(
      'SELECT * FROM category WHERE code = $1 AND deletedat is NULL',
      [category.code],
    );
    const nameFound = await this.categoryRepository.execute(
      'SELECT * FROM category WHERE name = $1 AND deletedat is NULL',
      [category.name],
    );

    if (codeFound.length > 0) return new ApiResponse(false, ERROR.CODE_FOUND);
    if (nameFound.length > 0) return new ApiResponse(false, ERROR.NAME_FOUND);
  }

  @get('/categories')
  @response(200, {
    description: 'List all active categories',
    content: {'application/json': {schema: getModelSchemaRef(Category)}},
  })
  async find(): Promise<ApiResponse> {
    const result = await this.categoryRepository.execute(
      'SELECT * FROM category WHERE status = true AND deletedat IS NULL ORDER BY createdat DESC',
    );

    return new ApiResponse(true, SUCCESS.CATEGORIES_FOUND, result);
  }

  @get('/categories/{id}')
  @response(200, {
    description: 'List data for a specific category',
    content: {'application/json': {schema: getModelSchemaRef(Category)}},
  })
  async findById(@param.path.number('id') id: number): Promise<ApiResponse> {
    const result = await this.categoryRepository.execute(
      'SELECT * FROM category WHERE id = $1 AND deletedat is NULL',
      [id],
    );

    if (result.length === 0)
      return new ApiResponse(false, ERROR.CATEGORY_NOT_FOUND);

    return new ApiResponse(true, SUCCESS.CATEGORIES_FOUND, result);
  }

  @put('/categories/{id}/{action}', {
    responses: {
      '200': {
        description:
          'Method to Update, >>Passively delete<< and activate/deactivate a category. Parameter {action} allowed can be: update, activate, delete.',
      },
    },
  })
  async update(
    @param.path.number('id') id: number,
    @param.path.string('action') action: string,
    @requestBody() category: Category,
  ): Promise<ApiResponse> {
    const search = await this.findById(id);

    if (search?.code > 1000) {
      var data: CategoryUpdated = {
        code: search?.data[0].code,
        name: search?.data[0].name,
        description: search?.data[0].description,
        status: search?.data[0].status,
        deletedAt: undefined,
      };
      let message = SUCCESS.CATEGORY_UPDATED;

      switch (action) {
        case 'update':
          await this.categoryRepository.replaceById(id, category);
          break;
        case 'delete':
          data.deletedAt = new Date();

          message = SUCCESS.CATEGORY_DELETED;

          await this.categoryRepository.replaceById(id, data);
          break;
        case 'activate':
          data.status = !search?.data[0].status;

          !search?.data[0].status
            ? (message = SUCCESS.CATEGORY_ACTIVATE)
            : (message = SUCCESS.CATEGORY_DEACTIVATE);

          await this.categoryRepository.replaceById(id, data);
          break;
      }

      return new ApiResponse(true, message, true);
    } else {
      return search;
    }
  }
}
