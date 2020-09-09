import { IonicPageModule } from 'ionic-angular/module';
import { NgModule } from '@angular/core';
import { HomePage } from './home';

//HomePage -> corresponde ao nome da classe declarada no home.ts (export class HomePage)
@NgModule({
    declarations: [HomePage],
    imports: [IonicPageModule.forChild(HomePage)]
})
export class HomeModule {}