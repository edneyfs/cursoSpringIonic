import { Injectable } from "@angular/core";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api.config";
import { LocalUser } from "../models/local_user";
import { StorageService } from "./storage.service";
import { JwtHelper } from 'angular2-jwt';
import { CartService } from "./domain/cart.service";

@Injectable()
export class AuthService {

    jwtHelper: JwtHelper = new JwtHelper();

    constructor(
        public http: HttpClient, 
        public storage : StorageService,
        public cartService : CartService) {

    }

    authenticate(creds: CredenciaisDTO) {
        // o POST, tem que informar a URL e o objeto a ser enviado
        return this.http.post(`${API_CONFIG.baseUrl}/login`, 
            creds,
            {
                //vai pegar o headr da resposta (tipo respose)
                observe: 'response',
                //o endpoint, responde um corpo vazio, então tem que colocar como texto para não tentar fazer o parse no json (geraria erro).
                responseType: 'text'
            });
    }

    refreshToken() {
        return this.http.post(`${API_CONFIG.baseUrl}/auth/refresh_token`, 
            {},
            {
                observe: 'response',
                responseType: 'text'
            });
    }

    successfulLogin(authorizationValue : string) {
        //remover o "Bearer "
        let tokenTemp = authorizationValue.substring(7);
        let user : LocalUser = {
            token: tokenTemp,
                                                        //.sub - faz pegar o email
            email: this.jwtHelper.decodeToken(tokenTemp).sub
        };
        this.storage.setLocalUser(user);
        this.cartService.createOrClearCart();
    }

    logout() {
        this.storage.setLocalUser(null);
    }
}