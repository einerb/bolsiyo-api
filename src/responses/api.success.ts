export enum SUCCESS {
  TOKEN_GENERATED,
  CATEGORY_CREATED,
  CATEGORIES_FOUND,
  CATEGORY_UPDATED,
  CATEGORY_DELETED,
  CATEGORY_ACTIVATE,
  CATEGORY_DEACTIVATE,
  COMPANY_CREATED,
  COMPANY_FOUND,
  COMPANIES_FOUND,
  PRODUCT_ADD,
  PRODUCT_UPDATE,
  PRODUCT_DELETE,
}

export interface Success {
  code: number;
  message: string;
}

export function GET_SUCCESS(success: any): Success | any {
  switch (success) {
    case SUCCESS.TOKEN_GENERATED:
      return {code: 1, message: 'Token generado exitosamente!'};
    case SUCCESS.CATEGORY_CREATED:
      return {code: 2, message: 'Categoría creada exitosamente!'};
    case SUCCESS.CATEGORIES_FOUND:
      return {code: 3, message: 'Categorías encontradas!'};
    case SUCCESS.CATEGORY_UPDATED:
      return {code: 4, message: 'Categoría actualizada exitosamente!'};
    case SUCCESS.CATEGORY_DELETED:
      return {code: 5, message: 'Categoría eliminada exitosamente!'};
    case SUCCESS.CATEGORY_ACTIVATE:
      return {code: 6, message: 'Categoría activada exitosamente!'};
    case SUCCESS.CATEGORY_DEACTIVATE:
      return {code: 7, message: 'Categoría desactivada exitosamente!'};
    case SUCCESS.COMPANY_CREATED:
      return {code: 8, message: 'Negocio creado exitosamente!'};
    case SUCCESS.COMPANIES_FOUND:
      return {code: 9, message: 'Negocios encontrados!'};
    case SUCCESS.COMPANY_FOUND:
      return {code: 10, message: 'Negocio encontrado!'};
    case SUCCESS.PRODUCT_ADD:
      return {code: 11, message: 'Producto agregado al negocio exitosamente!'};
    case SUCCESS.PRODUCT_UPDATE:
      return {code: 12, message: 'Producto actualizado exitosamente!'};
    case SUCCESS.PRODUCT_DELETE:
      return {code: 13, message: 'Producto eliminado exitosamente!'};
  }
}
