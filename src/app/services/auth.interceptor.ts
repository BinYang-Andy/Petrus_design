import { HttpInterceptor,HttpEvent,HttpHandler,HttpRequest,HttpErrorResponse } from "@angular/common/http";
import { Injectable, Inject, Injector } from "@angular/core";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()

export class AuthInterceptor implements HttpInterceptor{
    constructor(private inj:Injector){}
    intercept(req: HttpRequest<any>, 
              next: HttpHandler
              ): Observable<HttpEvent<any>> {

      const authService = this.inj.get(AuthService);
      const authToken = authService.getToken();

      const authReq = req.clone({
          headers: req.headers.set('Authorization','bearer'+ authToken)
        
        });
        
      
      return next.handle(authReq);
    }
     


}

@Injectable()
export class UnauthorizedInterceptor  implements HttpInterceptor{
    constructor(private inj:Injector){}

    intercept(req: HttpRequest<any>, 
              next: HttpHandler
              ): Observable<HttpEvent<any>> {

      const authService = this.inj.get(AuthService);
      const authToken = authService.getToken();

      return next
       .handle(req)
       .pipe(tap((event:HttpEvent<any>)=>{

       }, (err:any)=>{
           if(err instanceof HttpErrorResponse){
               if(err.status === 401 && authToken){
                   console.log('Unauthorized Interceptor: ', err);
                   authService.checkJWTtoken();
               }
           }
       }))
    }



    
}