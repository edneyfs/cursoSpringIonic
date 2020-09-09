import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { MenuController } from 'ionic-angular/components/app/menu-controller';

//informa que esta classe representa uma pagina e pode ser chamada nas paginas com o seu nome entre aspas "HomePage"
@IonicPage()

//declaretor que anota a classe como Controlador
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public menu: MenuController) {
  }

  // por padrão, já é publico
  login() {
    //abrir a pagina de Categorias, a navegação (NavController, já foi declarado no construtor)
    //.push empilha uma pagina em cima da outra
    //.setRoot empilha uma pagina em cima da outra
    this.navCtrl.setRoot("CategoriasPage");
  }

  // https://ionicframework.com/docs/angular/lifecycle
  //quando entrar, desabilida o menu
  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }

  //quando sair, habilida o menu
  ionViewDidLeave() {
    this.menu.swipeEnable(true);
    }
}