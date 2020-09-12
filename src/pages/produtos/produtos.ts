import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
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
      public produtoService: ProdutoService,
      public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.loadData();  
  }

  loadData() {
    //pegando o pametro passado na navegacao
    let categoria_id = this.navParams.get("categoria_id");

    let loader = this.presentLoading();

    this.produtoService.findByCategoria(categoria_id).subscribe(
        resposta => {
            //é uma pesquisa paginada, retorna um Page - JSON: { "content": [ ...
            this.items = resposta["content"];
            loader.dismiss();
            this.loadImageUrls();
        },
        error => {
          loader.dismiss();
        }
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

  showDetail(id : string) {
    this.navCtrl.push("ProdutoDetailPage", {id: id});
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Aguarde..."
      //, duration: 3000 - removemos, vai ficar até termnar
    });
    loader.present();

    //retorna o objeto para fecha-lo depois
    return loader;
  }

  doRefresh(refresher) {
    this.loadData();
    //depois de X milessegundos, vai executar algo
    setTimeout(
      () => {
        //vai fechar o refresh que vai aparecer
        refresher.complete();
      }, 
      1000);
  }
}