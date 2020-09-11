import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Rx'; // IMPORTANTE: IMPORT ATUALIZADO
import { StorageService } from '../services/storage.service';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Title } from '@angular/platform-browser';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        public storage: StorageService,
        public alertCtrl: AlertController) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.debug("Passou no ErrorInterceptor");
        return next.handle(req)
        .catch((error, caught) => {

            let errorObj = error;
            if (errorObj.error) {
                errorObj = errorObj.error;
            }
            //se não tiver o campo status, não é um JSON
            if (!errorObj.status) {
                errorObj = JSON.parse(errorObj);
            }

            console.log("Erro detectado pelo interceptor:");
            console.log(errorObj);

            switch(errorObj.status){
                case 401:
                    this.handle401();
                    break;

                case 403:
                    this.handle403();
                    break;

                default:
                    this.handleDefaultError(errorObj);
            }

            //levanta de novo o erro
            return Observable.throw(errorObj);
        }) as any;
    }

    handle403() {
        this.storage.setLocalUser(null);
    }

    handle401() {
        let alert = this.alertCtrl.create({
            title: 'Erro 401: falha de autenticação',
            message: 'Email ou senha incorretos',
            //para o alert sumir apenas quando clicar no botao OK
            enableBackdropDismiss: false,
            //definir a lista de botoes
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }

    handleDefaultError(errorObj ) {
        let alert = this.alertCtrl.create({
            title: "Erro " + errorObj.status + ": " +  errorObj.error,
            message: errorObj.message,
            //para o alert sumir apenas quando clicar no botao OK
            enableBackdropDismiss: false,
            //definir a lista de botoes
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};