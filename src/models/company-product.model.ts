import {Entity, model, property} from '@loopback/repository';

@model()
export class CompanyProduct extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  companyId?: number;

  @property({
    type: 'number',
  })
  productId?: number;

  constructor(data?: Partial<CompanyProduct>) {
    super(data);
  }
}

export interface CompanyProductRelations {
  // describe navigational properties here
}

export type CompanyProductWithRelations = CompanyProduct & CompanyProductRelations;
