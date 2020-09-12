import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { API_CONFIG } from '../../config/api.config';
import { CameraOptions, Camera } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente : ClienteDTO;
  picture : string;
  cameraOn : boolean = false;

  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      public storage: StorageService,
      public clienteService: ClienteService,
      public camera: Camera) {
  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData() {
    let localUser  = this.storage.getLocalUser();
    if(localUser && localUser.email) {
      this.clienteService.findByEmail(localUser.email)
        .subscribe(
          resposta => {
            //não retorna mais um clienteDTO, esta retornando agora o JSON todo, tem que fazer um cast
              this.cliente = resposta as ClienteDTO;
              this.getImageIfExists();
          },
          error =>{
              if(error.status == 403) {
                this.navCtrl.setRoot('HomePage');
              }
          }
        );
    } else {
      this.navCtrl.setRoot('HomePage');
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

  getCameraPicture() {

    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100, // qualidade maxima
      destinationType: this.camera.DestinationType.DATA_URL, //base64
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    //chamada assincrona, then para avisar quando finaliza (igual ao subscribe do Angular)
    this.camera.getPicture(options).then(
      imageData => {
        this.picture = 'data:image/png;base64,' + imageData;
        this.cameraOn = false;
      },
      err => {}
    );
  }

  sendPictue() {
    this.clienteService.uploadPicture(this.picture).subscribe(
      resposta => {
        this.picture = null;
        this.loadData();
      },
      error => {}
    );
  }

  cancel() {
    this.picture = null;
  }
}
