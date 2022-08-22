export enum ERROR {
  EMAIL_NOT_PROVIDED,
  PASSWORD_NOT_PROVIDED,
  CODE_FOUND,
  NAME_FOUND,
  CATEGORY_NOT_FOUND,
  COMPANY_FOUND,
  COMPANY_NOT_FOUND,
  PRODUCT_FOUND,
  PRODUCT_NOT_FOUND,
  PAGINATION_WAS_NOT_PROVIDED,
  PAGINATION_WAS_NOT_PROVIDED_START,
  PAGINATION_WAS_NOT_PROVIDED_END,
}

export interface Error {
  code: number;
  error: string;
}

export function GET_ERROR(error: any): Error | any {
  switch (error) {
    case ERROR.EMAIL_NOT_PROVIDED:
      return {code: 1, error: 'No hay email!'};
    case ERROR.PASSWORD_NOT_PROVIDED:
      return {code: 2, error: 'No hay password!'};
    case ERROR.CODE_FOUND:
      return {code: 3, error: 'El código ya se encuentra registrado!'};
    case ERROR.NAME_FOUND:
      return {
        code: 4,
        error: 'El nombre de la categoría ya se encuentra registrado!',
      };
    case ERROR.CATEGORY_NOT_FOUND:
      return {
        code: 5,
        error: 'Categoría no encontrada!',
      };
    case ERROR.COMPANY_FOUND:
      return {
        code: 6,
        error: 'El nombre del negocio ya se encuentra registrado!',
      };
    case ERROR.COMPANY_NOT_FOUND:
      return {
        code: 7,
        error: 'Negocio no encontrado!',
      };
    case ERROR.PRODUCT_FOUND:
      return {
        code: 8,
        error:
          'El producto con este codigo ya se encuentra asociado al negocio!',
      };
    case ERROR.PRODUCT_NOT_FOUND:
      return {
        code: 9,
        error: 'Producto no encontrado!',
      };
    case ERROR.PAGINATION_WAS_NOT_PROVIDED:
      return {code: 100, error: 'Paginación no agregada!'};
    case ERROR.PAGINATION_WAS_NOT_PROVIDED_START:
      return {
        code: 101,
        error:
          'Paginación no agregada: Falta agregar el parámetro fecha inicial!',
      };
    case ERROR.PAGINATION_WAS_NOT_PROVIDED_END:
      return {
        code: 102,
        error:
          'Paginación no agregada: Falta agregar el parámetro fecha final!',
      };
  }
}
