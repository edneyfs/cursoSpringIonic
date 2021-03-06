import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EnderecoDTO } from '../../models/endereco.dto';
import { StorageService } from '../../services/storage.service';
import { ClienteService } from '../../services/domain/cliente.service';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartService } from '../../services/domain/cart.service';

@IonicPage()
@Component({
  selector: 'page-pick-address',
  templateUrl: 'pick-address.html',
})
export class PickAddressPage {

  items: EnderecoDTO[];
  pedido: PedidoDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService,
    public cartService: CartService) {
  }

  ionViewDidLoad() {
    let localUser  = this.storage.getLocalUser();
    if(localUser && localUser.email) {
      this.clienteService.findByEmail(localUser.email)
        .subscribe(
          resposta => {
            //não retorna mais um clienteDTO, esta retornando agora o JSON todo, tem que fazer um cast - resposta.enderecos, o compilador da erro
              this.items = resposta["enderecos"];

              //recupera o carrinho
              let cart = this.cartService.getCart();

              //instanciou um novo pedidoDTO
              this.pedido = {
                  cliente: {
                    id: resposta["id"]
                  },
                  enderecoDeEntrega: null,
                  pagamento: null,
                                  //map vai percorrer a lista, cada item x
                  itens: cart.items.map(
                    x => {
                      return {
                        quantidade: x.quantidade, 
                        produto: {
                          id: x.produto.id
                        }
                      }
                    }
                  )
              }

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

  nextPage(endereco: EnderecoDTO) {
    this.pedido.enderecoDeEntrega = {id: endereco.id};
    this.navCtrl.push("PaymentPage", {pedido: this.pedido});
  }
}