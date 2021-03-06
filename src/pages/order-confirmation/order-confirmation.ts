import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartItem } from '../../models/cart-item';
import { EnderecoDTO } from '../../models/endereco.dto';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { CartService } from '../../services/domain/cart.service';
import { PedidoService } from '../../services/domain/pedido.service';

@IonicPage()
@Component({
  selector: 'page-order-confirmation',
  templateUrl: 'order-confirmation.html',
})
export class OrderConfirmationPage {

  pedido: PedidoDTO;
  cartItems: CartItem[];
  cliente: ClienteDTO;
  endereco: EnderecoDTO;
  codigoPedido: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public clienteService: ClienteService,
    public cartService: CartService,
    public pedidoService: PedidoService) {

    this.pedido = this.navParams.get('pedido');
  }

  ionViewDidLoad() {
    this.cartItems = this.cartService.getCart().items;

    this.clienteService.findById(this.pedido.cliente.id).subscribe(
      response => {
        this.cliente = response as ClienteDTO;
        this.endereco = this.findEndereco(this.pedido.enderecoDeEntrega.id, response['enderecos']);
      },
      error => {
        this.navCtrl.setRoot('HomePage');
      }
    );
  }

  private findEndereco(id: string, list: EnderecoDTO[]) : EnderecoDTO {
    let position = list.findIndex(x => x.id == id);
    return list[position];
  }

  total() : number {
    return this.cartService.total();
  }

  back() {
    this.navCtrl.setRoot('CartPage');
  }

  home() {
    this.navCtrl.setRoot('CategoriasPage');
  }
  
  checkout() {
    this.pedidoService.insert(this.pedido).subscribe(
      response => {
        console.log("Pedido salvo");
        //pedido foi salvo, remover do carrinho
        this.cartService.createOrClearCart();

        //o location retorna http://localhost:8080/pedidos/5
        let linkNovoPedido = response.headers.get('location');
        console.log(linkNovoPedido);
        this.codigoPedido = this.extractId(linkNovoPedido);
      },
      error => {
        if (error.status == 403) { //403 autenticação
          this.navCtrl.setRoot('HomePage');
        }
    });
  }

  private extractId(location : string) : string {
    //pegando a ultima barra  ex: http://localhost:8080/pedidos/5
    let position = location.lastIndexOf('/');
    //retorna o que vem depois da barra (barra+1). ex:5
    return location.substring(position + 1, location.length);
  }
}