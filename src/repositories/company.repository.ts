import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Company, CompanyRelations, Product, CompanyProduct} from '../models';
import {CompanyProductRepository} from './company-product.repository';
import {ProductRepository} from './product.repository';

export class CompanyRepository extends DefaultCrudRepository<
  Company,
  typeof Company.prototype.id,
  CompanyRelations
> {

  public readonly products: HasManyThroughRepositoryFactory<Product, typeof Product.prototype.id,
          CompanyProduct,
          typeof Company.prototype.id
        >;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource, @repository.getter('CompanyProductRepository') protected companyProductRepositoryGetter: Getter<CompanyProductRepository>, @repository.getter('ProductRepository') protected productRepositoryGetter: Getter<ProductRepository>,
  ) {
    super(Company, dataSource);
    this.products = this.createHasManyThroughRepositoryFactoryFor('products', productRepositoryGetter, companyProductRepositoryGetter,);
    this.registerInclusionResolver('products', this.products.inclusionResolver);
  }
}
