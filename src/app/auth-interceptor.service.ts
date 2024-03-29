import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { tap } from "rxjs";

export class AuthInterceptorService implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const modifyRequest = req.clone({headers: req.headers.append('Auth', 'xyz')})
        return next.handle(modifyRequest)
    }
}