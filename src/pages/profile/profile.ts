import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente : ClienteDTO;

  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      public storage: StorageService,
      public clienteService: ClienteService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    let localUser  = this.storage.getLocalUser();
    if(localUser && localUser.email) {
      this.clienteService.findByEmail(localUser.email)
        .subscribe(
          resposta => {
              this.cliente = resposta;
              this.getImageIfExists();
          },
          error =>{}
        );
    }
  }

  getImageIfExists() {
      // faz o getImageFromBucket apenas para ir no servidor e ver se tem a image, caso não tenha, imageUrl fica nullo e eh mostrado imagem default na tela. 
      this.clienteService.getImageFromBucket(this.cliente.id)
        .subscribe(
            resposta => {
                this.cliente.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${this.cliente.id}.jpg`;
            },
            error => {}
        );
  }
}
