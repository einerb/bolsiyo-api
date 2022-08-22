import {GET_ERROR} from './api.error';
import {GET_SUCCESS} from './api.success';

export class ApiResponse<T = any> {
  code: number;
  message?: string;
  error?: any;
  data?: T;

  constructor(success: boolean, value: any, data: any = null) {
    const INCREMENT_FOR_SUCCESS = 1000;

    if (success) {
      let success = GET_SUCCESS(value);
      this.code = success.code + INCREMENT_FOR_SUCCESS;
      this.message = success.message;
      this.data = data;
    } else {
      let ex = GET_ERROR(value);
      this.code = ex.code;
      this.error = ex.error;
      if (data) this.data = data;
    }
  }
}
