import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Category} from './category.model';

@model({
  settings: {strict: true},
})
export class Product extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 4,
      maxLength: 10,
      pattern: '^[a-zA-Z0-9]+$',
    },
  })
  code: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 4,
    },
  })
  name: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      dataType: 'text',
    },
  })
  description: string;

  @property({
    type: 'string',
    required: true,
  })
  brand: string;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      pattern: '^[0-9]+$',
    },
  })
  quantity: number;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      pattern: '^[0-9]+$',
    },
  })
  price: number;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  deletedAt?: Date;

  @belongsTo(() => Category)
  categoryId: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;
