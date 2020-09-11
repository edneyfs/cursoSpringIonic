import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';

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
      public produtoServoce: ProdutoService) {
  }

  ionViewDidLoad() {
    //pegando o pametro passado na navegacao
    let categoria_id = this.navParams.get("categoria_id");
    this.produtoServoce.findByCategoria(categoria_id).subscribe(
        resposta => {
            //é uma pesquisa paginada, retorna um Page - JSON: { "content": [ ...
            this.items = resposta["content"];
        },
        error => {}
    );

  }

}