import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {


  constructor(
    private authService: AuthService
  ) { }

  ///////con eso se añade una cabecera A CADA PETICION CON EL TOKEN
  ////////DEL USUARIO PARA QUE SE SEPA SI SE HA LOGUEADO Y SIGA NAVEGANDO O NO
  intercept(req, next) {
    const tokenizeReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    })
    console.log(this.authService.getToken());
    return next.handle(tokenizeReq);
  }

}
