import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CategoriaService } from '../../services/domain/categoria.services';
import { CategoriaDTO } from '../../models/categoria.dto';
import { API_CONFIG } from '../../config/api.config';

/**
 * Generated class for the CategoriasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()

@Component({
  selector: 'page-categorias',
  templateUrl: 'categorias.html',
})
export class CategoriasPage {

  bucketUrl: string = API_CONFIG.bucketBaseUrl;
  items: CategoriaDTO[];

  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      public categoriaService: CategoriaService) {
  }

  //quando a pagina for carregada
  ionViewDidLoad() {
    this.categoriaService.findAll()
        //subscribe: as chamadas são assicronas, precisa disso para ser chamado quando for retornado  
        .subscribe(response => {
          console.log(response);
          this.items = response;
        },
        
        error => {});
  }

  showProdutos(cat_id : string) {
    //passando parametros de uma pagina para outra (categoria_id definido no html).
    this.navCtrl.push("ProdutosPage", {categoria_id: cat_id});
  }
}