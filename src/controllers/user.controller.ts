import {getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
const jwt = require('jsonwebtoken');

import {User} from '../models';

import {ApiResponse, ERROR, SUCCESS} from '../responses';

export class UserController {
  constructor() {}

  @post('/auth')
  @response(200, {
    description: 'Generate access token',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async auth(@requestBody() credentials: User): Promise<object> {
    if (!credentials.email)
      return new ApiResponse(false, ERROR.EMAIL_NOT_PROVIDED);
    if (!credentials.password)
      return new ApiResponse(false, ERROR.PASSWORD_NOT_PROVIDED);

    let user = {
      email: credentials.email,
      password: credentials.password,
    };
    let token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) * 3600,
        data: user,
      },
      process.env.JWT_ENCRYPTION,
    );

    return new ApiResponse(true, SUCCESS.TOKEN_GENERATED, token);
  }
}
