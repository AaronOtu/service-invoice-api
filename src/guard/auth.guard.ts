import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { jwtConstants } from "./auth.constants";



interface User {
  id: string;
  email: string;
  role: string;
}

// Extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}



@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      console.log('AuthGuard-Error, No token found')
      throw new UnauthorizedException('No token found. Access denied.');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: jwtConstants.secret });
      
      if(!payload.role){
        
        throw new UnauthorizedException('Invalid token: role missing');
      }
      
      request.user = {

        id: payload.id,
        email: payload.email,
        role: payload.role
      };
      console.log('AuthGuard- Payload', payload);
      console.log('AuthGuard- Set user',request.user);
      return true;


    } catch (error) {
      console.log('AuthGuard -Error', error)
      throw new UnauthorizedException('Invalid or expired token.');
    }

  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
