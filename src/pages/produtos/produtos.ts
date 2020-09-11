import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items : ProdutoDTO[];

  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      public produtoService: ProdutoService) {
  }

  ionViewDidLoad() {
    //pegando o pametro passado na navegacao
    let categoria_id = this.navParams.get("categoria_id");
    this.produtoService.findByCategoria(categoria_id).subscribe(
        resposta => {
            //é uma pesquisa paginada, retorna um Page - JSON: { "content": [ ...
            this.items = resposta["content"];
            this.loadImageUrls();
        },
        error => {}
    );
  }

  loadImageUrls() {
    for (let index = 0; index < this.items.length; index++) {
      let item = this.items[index];
      // faz o getImageFromBucket apenas para ir no servidor e ver se tem a image, caso não tenha, imageUrl fica nullo e eh mostrado imagem default na tela. 
      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(
            resposta => {
                item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
            },
            error => {}
        );
    }
  }

  showDetail() {
    this.navCtrl.push("ProdutoDetailPage");
  }

}