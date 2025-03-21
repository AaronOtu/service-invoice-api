import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

interface User {
  id: string;
  email: string;
  role: string;
}

declare module 'express' {
  interface Request {
    user?: User;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    console.log(`AuthGuard triggered for: ${request.url}`);

    if (!token) {
      console.log('AuthGuard-Error: No token found');
      throw new UnauthorizedException('No token found. Access denied.');
    }

    try {
      const payload = await this.jwtService.verifyAsync<User>(token, {
        secret: process.env.JWT_SECRET,
      });

      if (!payload.role) {
        console.log('AuthGuard-Error: Invalid token - role missing');
        throw new UnauthorizedException('Invalid token: role missing');
      }

      request.user = payload;
      return true;
    } catch (error) {
      console.log('AuthGuard-Error:', error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
