import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CidadeService } from '../../services/domain/cidade.service';
import { EstadoService } from '../../services/domain/estado.service';
import { EstadoDTO } from '../../models/estado.dto';
import { CidadeDTO } from '../../models/cidade.dto';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  formGroup: FormGroup;
  estados: EstadoDTO[];
  cidades: CidadeDTO[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public cidadeService: CidadeService,
    public estadoService: EstadoService) {

      this.formGroup = this.formBuilder.group(
        {
           //nome esta declarado no html (name="nome")
                // valor default, colecao de Validacoes
            nome: ['Joaquim', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
            email: ['joaquim@gmail.com', [Validators.required, Validators.email]],
            tipo : ['1', [Validators.required]],
            cpfOuCnpj : ['06134596280', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
            senha : ['123', [Validators.required]],
            logradouro : ['Rua Via', [Validators.required]],
            numero : ['25', [Validators.required]],
            complemento : ['Apto 3', []],
            bairro : ['Copacabana', []],
            cep : ['10828333', [Validators.required]],
            telefone1 : ['977261827', [Validators.required]],
            telefone2 : ['', []],
            telefone3 : ['', []],
            estadoId : [null, [Validators.required]],
            cidadeId : [null, [Validators.required]] 
        }
      );

  }

  signupUser() {
    console.log("passou aqui");
  }

  /**
   * Disparado somente quando uma visão é armazenada na memória. Este evento NÃO é disparado ao entrar em uma exibição que já está em cache. 
   */
  ionViewDidLoad() {
    this.estadoService.findAll().subscribe(
      resposta =>
        {
          this.estados = resposta;
          //pegar o primeiro  estdo da lista
          this.formGroup.controls.estadoId.setValue(this.estados[0].id);
          this.atualizarCidades();
        },
        error => {}
    );
  }

  atualizarCidades() {
      this.cidadeService.findAll(this.formGroup.value.estadoId).subscribe(
          respota => {
              this.cidades = respota;
              //mudou a lista de cidades, entao vamos deselecionar a cidade
              this.formGroup.controls.cidadeId.setValue(null);
          },
          error => {}
      );
  }
}