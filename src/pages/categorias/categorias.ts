import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CategoriaService } from '../../services/domain/categoria.services';

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
        },
        
        error => {
          console.log(error);
        });
  }
}