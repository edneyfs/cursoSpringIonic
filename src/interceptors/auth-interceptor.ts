import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Rx'; // IMPORTANTE: IMPORT ATUALIZADO
import { StorageService } from '../services/storage.service';
import { API_CONFIG } from '../config/api.config';

/**
 * Serve para Interceptar as requisicoes e, caso exista usuario logado, ira adicionar no handle o Authorization
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        public storage : StorageService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.debug("Passou no AuthInterceptor");
        let localUser = this.storage.getLocalUser();

        //se deve ser add no headrs caso seja requisicoes para nosso sistema
        let tamanho = API_CONFIG.baseUrl.length;
        let isNossaAPI = (req.url.substring(0 , tamanho) == API_CONFIG.baseUrl);

        if(localUser && isNossaAPI) {
            console.debug("Add Authorization no Header");
            //clonando a requisicao original, mas adicionando o header com o Authorization
            const authReq = req.clone({headers: req.headers.set('Authorization', 'Bearer ' + localUser.token)});
            return next.handle(authReq);
        } else {
            console.debug("Nao existe usuario logado");
            return next.handle(req);
        }
    }
}

export const AuthInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
};