import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API_CONFIG } from "../../config/api.config";
import { ProdutoDTO } from "../../models/produto.dto";

@Injectable()
export class ProdutoService {

    constructor(
        public http: HttpClient) {

    }

    findById(id : string) {
        return this.http.get<ProdutoDTO>(`${API_CONFIG.baseUrl}/produtos/${id}`);
    }

    /**
     * 
     * @param categoria_id id da categoria selecionado
     * @param page pagina atual para paginação, caso não seja informado, assumo o valor zero
     * @param linesPerPage quantidade de itens por pagina
     */
    findByCategoria(categoria_id : string, page : number = 0, linesPerPage : number = 24) {
        return this.http.get(`${API_CONFIG.baseUrl}/produtos/?categorias=${categoria_id}&page=${page}&linesPerPage=${linesPerPage}`);
    }

    // any aceita qualquer coisa, coringa
    getSmallImageFromBucket(id : string) : Observable<any> {
        let url = `${API_CONFIG.bucketBaseUrl}/prod${id}-small.jpg`;
        //respota é um blob, não é um json
        let imagem = this.http.get(url, {responseType : 'blob'});
        return imagem;
    }

    getImageFromBucket(id : string) : Observable<any> {
        let url = `${API_CONFIG.bucketBaseUrl}/prod${id}.jpg`;
        //respota é um blob, não é um json
        let imagem = this.http.get(url, {responseType : 'blob'});
        return imagem;
    }
}