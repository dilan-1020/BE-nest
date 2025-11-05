import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard as PassportAuthGuard } from "@nestjs/passport";

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
    canActivate(context : ExecutionContext) : any {
        return super.canActivate(context)
    }
}
