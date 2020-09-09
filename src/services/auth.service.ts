import { Injectable } from "@angular/core";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api.config";

@Injectable()
export class AuthService {


    constructor(public http: HttpClient) {

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
}