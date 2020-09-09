import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

//informa que esta classe representa uma pagina e pode ser chamada nas paginas com o seu nome entre aspas "HomePage"
@IonicPage()

//declaretor que anota a classe como Controlador
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

}