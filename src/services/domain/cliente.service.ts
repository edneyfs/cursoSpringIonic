import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { ClienteDTO } from "../../models/cliente.dto";
import { API_CONFIG } from "../../config/api.config";
import { StorageService } from "../storage.service";
import { ImageUtilService } from "../Image-util.service";

@Injectable()
export class ClienteService {

    constructor(
        public http: HttpClient, 
        public storage: StorageService,
        public imagemUtilService : ImageUtilService) {

    }

    findById(id: string) {
        return this.http.get(`${API_CONFIG.baseUrl}/clientes/${id}`);
    }

    findByEmail(email: string) {
        //antes de criar o auth-interceptor.js
        //let token = this.storage.getLocalUser().token;
        //                                criando o texto no Header
        //let authHeader = new HttpHeaders({'Authorization': 'Bearer ' + token});

        return this.http.get(
            `${API_CONFIG.baseUrl}/clientes/email?email=${email}`);
            //,{'headers' : authHeader});
    }

    // any aceita qualquer coisa, coringa
    getImageFromBucket(id : string) : Observable<any> {
        let url = `${API_CONFIG.bucketBaseUrl}/cp${id}.jpg`;
        //respota é um blob, não é um json
        let imagem = this.http.get(url, {responseType : 'blob'});
        return imagem;
    }

    insert(cliente: ClienteDTO){
        return this.http.post(
            `${API_CONFIG.baseUrl}/clientes`, 
            cliente,
            {
                //espera um resposta do tipo texto
                observe: "response",
                responseType: "text"
            }
        );
    }

    uploadPicture(picture) {
        let pictureBlob = this.imagemUtilService.dataUriToBlob(picture);
        //neste Rest, recebe um form-date
        let formData : FormData = new FormData();
        formData.set('file', pictureBlob, 'file.png');

        return this.http.post(
            `${API_CONFIG.baseUrl}/clientes/picture`, 
            formData,
            {
                //espera um resposta do tipo texto
                observe: "response",
                responseType: "text"
            }
        );
    }
}