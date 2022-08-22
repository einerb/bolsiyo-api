import {AuthenticationStrategy} from '@loopback/authentication';
import {HttpErrors, Request} from '@loopback/rest';
import parseBearerToken from 'parse-bearer-token';
const jwt = require('jsonwebtoken');

export interface Credentials {
  email: string;
  password: string;
}

export class AuthStrategy implements AuthenticationStrategy {
  name: string = 'jwt';

  constructor() {}

  async authenticate(request: Request): Promise<any | undefined> {
    const token = parseBearerToken(request);
    if (!token) {
      throw new HttpErrors[401]('No hay token!');
    }

    let verifytoken = this.verifyToken(token);
    if (await verifytoken) {
      let data = Object.assign({email: (await verifytoken).email});

      return data;
    }
  }

  verifyToken(token: string) {
    try {
      let decoded = jwt.verify(token, process.env.JWT_ENCRYPTION);

      return decoded;
    } catch {
      return null;
    }
  }
}
