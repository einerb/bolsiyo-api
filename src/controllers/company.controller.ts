import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';

import {Company, Product} from '../models';
import {CompanyRepository} from '../repositories';
import {ApiResponse, ERROR, SUCCESS} from '../responses';

@authenticate('jwt')
export class CompanyController {
  constructor(
    @repository(CompanyRepository)
    protected companyRepository: CompanyRepository,
  ) {}

  @get('/companies/{id}/products')
  @response(200, {
    description:
      'List products by business. Filter by number of products and initial and final creation date.',
    content: {
      'application/json': {
        schema: {type: 'array', items: getModelSchemaRef(Product)},
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.number('pageElements') pageElements: number,
    @param.query.date('start') start: Date,
    @param.query.date('end') end: Date,
  ): Promise<ApiResponse> {
    if (!pageElements)
      return new ApiResponse(false, ERROR.PAGINATION_WAS_NOT_PROVIDED);
    if (!start)
      return new ApiResponse(false, ERROR.PAGINATION_WAS_NOT_PROVIDED_START);
    if (!end)
      return new ApiResponse(false, ERROR.PAGINATION_WAS_NOT_PROVIDED_END);

    const company = await this.companyRepository.execute(
      'SELECT "name", address, createdat FROM company WHERE id = $1 AND deletedat IS NULL',
      [id],
    );
    if (company.length === 0)
      return new ApiResponse(false, ERROR.COMPANY_NOT_FOUND);

    const products = await this.companyRepository.execute(
      'SELECT p."id" AS id, p."code" AS code, p."name" AS name, p.description AS description, p.brand AS brand, p.quantity AS quantity, p.price AS price, p.createdat AS created, ct."name" AS category, ct.status AS categorystatus FROM company c LEFT JOIN companyproduct cp ON c.id = cp.companyid LEFT JOIN product p ON p.id = cp.productid LEFT JOIN category ct ON ct.id = p.categoryid WHERE c.id = $1 and ct.status = true AND p.createdat >= $2 AND p.createdat <= $3 AND c.deletedat IS NULL ORDER BY p.createdat DESC LIMIT $4 offset 0',
      [id, start, end, pageElements],
    );

    return new ApiResponse(true, SUCCESS.COMPANY_FOUND, {
      ...company[0],
      products,
      pageElements: products.length,
    });
  }

  @post('/companies')
  @response(200, {
    description: 'Create a company',
    content: {'application/json': {schema: getModelSchemaRef(Company)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Company, {
            exclude: ['id'],
          }),
        },
      },
    })
    company: Omit<Company, 'id'>,
  ): Promise<ApiResponse> {
    const companyFound = await this.companyRepository.execute(
      'SELECT * FROM company WHERE name = $1 AND deletedat IS NULL',
      [company.name],
    );

    if (companyFound.length > 0)
      return new ApiResponse(false, ERROR.COMPANY_FOUND);

    const data = await this.companyRepository.create(company);

    return new ApiResponse(true, SUCCESS.COMPANY_CREATED, data);
  }
}
