import {repository} from '@loopback/repository';
import {
  getModelSchemaRef,
  param,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Company, Product} from '../models';
import {CompanyRepository, ProductRepository} from '../repositories';
import {ApiResponse, ERROR, SUCCESS} from '../responses';

export class CompanyProductController {
  constructor(
    @repository(CompanyRepository)
    protected companyRepository: CompanyRepository,
    @repository(ProductRepository)
    protected productRepository: ProductRepository,
  ) {}

  @post('/companies/{id}/products')
  @response(200, {
    responses: {
      description: 'Add a product to the selected company.',
      content: {'application/json': {schema: getModelSchemaRef(Product)}},
    },
  })
  async create(
    @param.path.number('id') id: typeof Company.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            title: 'NewProductInCompany',
            exclude: ['id'],
          }),
        },
      },
    })
    product: Omit<Product, 'id'>,
  ): Promise<ApiResponse> {
    /* Search for a company */
    const company = await this.companyRepository.execute(
      'SELECT "name", address, createdat FROM company WHERE id = $1 AND deletedat IS NULL',
      [id],
    );
    if (company.length === 0)
      return new ApiResponse(false, ERROR.COMPANY_NOT_FOUND);

    /* Filter that the product is not added to the company  */
    const productFound = await this.companyRepository.execute(
      'SELECT p."code" AS code FROM company c LEFT JOIN companyproduct cp ON c.id = cp.companyid LEFT JOIN product p ON p.id = cp.productid LEFT JOIN category ct ON ct.id = p.categoryid WHERE c.id = $1 and ct.status = true AND c.deletedat IS NULL',
      [id],
    );
    const someCode = productFound.some(
      (element: any) => element.code === product.code,
    );
    if (someCode) return new ApiResponse(false, ERROR.PRODUCT_FOUND);

    /* Verify if the category exists */
    const categoryFound = await this.companyRepository.execute(
      'SELECT * FROM category WHERE id = $1 and deletedat IS NULL',
      [product.categoryId],
    );
    if (categoryFound.length === 0)
      return new ApiResponse(false, ERROR.CATEGORY_NOT_FOUND);

    const productAdd = await this.companyRepository
      .products(id)
      .create(product);

    return new ApiResponse(true, SUCCESS.PRODUCT_ADD, productAdd);
  }

  @put('/companies/product/{id}/update', {
    responses: {
      '200': {
        description: 'Delete a product',
        content: {'application/json': {schema: getModelSchemaRef(Product)}},
      },
    },
  })
  async put(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {partial: true}),
        },
      },
    })
    product: Partial<Product>,
  ): Promise<ApiResponse> {
    const productFound = await this.companyRepository.execute(
      'SELECT * FROM product WHERE id = $1 AND deletedat IS NULL',
      [id],
    );
    if (productFound.length === 0)
      return new ApiResponse(false, ERROR.PRODUCT_NOT_FOUND);

    await this.productRepository.replaceById(id, product);

    return new ApiResponse(true, SUCCESS.PRODUCT_UPDATE, true);
  }

  @put('/companies/product/{id}/delete', {
    responses: {
      '200': {
        description: 'Edit a product',
        content: {'application/json': {schema: getModelSchemaRef(Product)}},
      },
    },
  })
  async delete(@param.path.number('id') id: number): Promise<ApiResponse> {
    const productFound = await this.companyRepository.execute(
      'SELECT * FROM product WHERE id = $1 AND deletedat IS NULL',
      [id],
    );
    if (productFound.length === 0)
      return new ApiResponse(false, ERROR.PRODUCT_NOT_FOUND);

    const data = {
      code: productFound[0].code,
      name: productFound[0].name,
      description: productFound[0].description,
      brand: productFound[0].brand,
      categoryId: productFound[0].categoryId,
      quantity: productFound[0].quantity,
      price: productFound[0].price,
      deletedAt: new Date(),
    };
    await this.productRepository.replaceById(id, data);

    return new ApiResponse(true, SUCCESS.PRODUCT_DELETE, true);
  }
}
