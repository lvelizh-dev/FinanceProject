import { Component, OnInit, Injectable } from '@angular/core';
import { NgForm, Form } from '@angular/forms';
import { BonosService } from '../../services/bonos.service';
import { AuthService } from '../../services/auth.service';

import { Bono } from 'src/app/models/bono';
import { Router } from '@angular/router';
import { Flujo } from '../../models/flujo';
import { combineLatest } from 'rxjs';
import { Config } from '../../models/config';
import { User } from '../../models/user';
// import { beh } from 'rxjs/BehaviorSubject';
@Component({
  selector: 'app-bonos',
  templateUrl: './bonos.component.html',
  styleUrls: ['./bonos.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class BonosComponent implements OnInit {
  message: string;
  u_id = '';
  u_Type = '';
  ///////este userType solo es para pasar como parametro 2 para traer los bonistas. El de arriba sirve para obtener su tipo de usuario
  userType = '2';
  arrFlujo: Flujo[];
  flujos: Flujo[];
  bonistasArray: User[] = [];
  user2Alert = '';
  user2AlertBool = false;
  formValorComercial: string = '';
  formValorNominal: string = '';
  formNroXAnos: string = '';
  formFrecuenciaPago: string = '';
  formDiasXano: string = '';
  // formTipoTasaInteres


  bono = {
    valorNominal: 0,
    valorComercial: 0,
    nroxAnos: 0,
    frecuenciaPago: '',
    diasXAño: 0,
    tipoTasaInteres: '',
    capitalizacion: '',
    tasaInteres: 0,
    tasaAnualDcto: 0,
    IRenta: 0,
    fechaEmision: '',
    porcentajePrima: 0,
    porcentajeEstructuracion: 0,
    porcentajeColocacion: 0,
    porcentajeFlotacion: 0,
    porcentajeCavali: 0
  }

  selected1 = true;
  selected2 = false;

  constructor(
    public bonosService: BonosService,
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit()  {
    console.log(localStorage.getItem('e'));
    console.log(localStorage.getItem('u_id'));
    this.u_id = localStorage.getItem('u_id');
    console.log(localStorage.getItem('u_Type'));
    this.u_Type = localStorage.getItem('u_Type');
    console.log(this.u_Type);
    this.getBonosByUserID();
    this.getUsersByTypeID();
    this.bonosService.currentMessage.subscribe(message => this.message = message);
    this.bonosService.currentFlujos.subscribe(flujos => this.flujos = flujos);
    

    
    // this.bonosService.currentConfig.subscribe()
  }


  resetForm(form?: NgForm){
    if(form){
      form.reset();
      this.bonosService.selectedBono = new Bono();
    }
  }

  newBono(bono: Bono){
    this.bonosService.changeBono(bono);
  }

  newConfig(user_id: string){
    this.bonosService.changeGetConfig(user_id);
  }

  newMessage(letra: string) {
    this.bonosService.changeMessage(letra);
  }
  newFlujos(flujos: Flujo[]) {
    this.bonosService.changeFlujos(flujos);
  }


  addBono(form: NgForm){
    this.arrFlujo = new Array();
    var flujo = new Flujo();

    form.value.user_id = this.u_id;

    console.log(this.arrFlujo);

    var bonito: Bono = new Bono();
    bonito = this.formToBono(bonito, form);
    this.newBono(bonito);
    this.newConfig(localStorage.getItem('u_id'));

    if(this.u_Type == '2'){
      
    if(form.value._id){
      console.log(form.value._id);
      this.message = form.value._id;
      this.newMessage(this.message);
      this.user2AlertBool = false;
      console.log(bonito);
      console.log(form.value);
      this.bonosService.putBono(form.value)
      .subscribe(res => {
      var a = 'cambiose'
        this.resetForm(form);
        this.getBonosByUserID();
        console.log(res);
        console.log('updated');
        this.router.navigate(['/extra']);
        
      })
    }
    else{
      this.user2AlertBool = true;
      this.user2Alert = 'Usted no tiene permiso para añadir un bono.'
      return;
    }
    }

    // if(!form.value.valorNominal){
    //   this.formValorNominal = 'Por favor ingrese un valor';
    //   return;
    // } 
    // if(form.value.valorNominal){
    //   this.formValorNominal = '';
    // }

    // if(!form.value.valorComercial){
    //   this.formValorComercial = 'Por favor ingrese un valor';
    //   return;
    // }
    // if(form.value.valorComercial){
    //   this.formValorComercial = '';

    // } 
    
    // if(!form.value.nroxAnos){
    //   return;
    // } 
    // if(!form.value.frecuenciaPago){
    //   return;
    // } if(form.value.tipoTasaInteres){

    // } if(form.value.capitalizacion){
    //   return;
    // } 
    //   if(form.value.tasaInteres){

    //   } if(form.value.tasaAnualDcto){
    //     return;
    //   } 
      
    //   if(form.value.fechaEmision){
        
    //   return;
    // }

    // frecuenciaPago
    // diasXAno
    // tipoTasaInteres
    // capitalizacion
    // tasaInteres
    // tasaAnualDcto
    // IRenta
    // fechaEmision



    if(form.value._id){
      console.log(form.value._id);
      this.message = form.value._id;
      this.newMessage(this.message);

      console.log(bonito);
      console.log(form.value);
      this.bonosService.putBono(form.value)
      .subscribe(res => {
      var a = 'cambiose'
        // this.resetForm(form);
        this.getBonosByUserID();
        console.log(res);
        console.log('updated');
        this.router.navigate(['/extra']);
        
      })
    }
    else {
      
      console.log(form.value);
      
      // if(this.u_Type == '1' || typeof this.u_Type === "undefined")
      // {
      this.bonosService.postBono(form.value)
      .subscribe(res => {
        // this.resetForm(form);
        // this.getBonosByUserID();
        console.log(res);
        console.log('added');
        localStorage.setItem('bono_id',res.e._id);
        console.log(localStorage.getItem('bono_id'));
        this.message = localStorage.getItem('bono_id');
        bonito._id = localStorage.getItem('bono_id');
        this.newBono(bonito);
        console.log(this.message);
        this.newMessage(this.message);
        // if(form.value.valorNominal == null || form.value.valorNominal == '' || form.value.valorComercial == null || form.value.valorComercial == ''||form.value.nroXAnos == null || form.value.nroXAnos == '' || form.value.frecuenciaPago == null || form.value.frecuenciaPago == '' || form.value.diasXAno == null|| form.value.diasXAno == '' || form.value.tipoTasaInteres == null || form.value.tipoTasaInteres == '' || form.value.capitalizacion == null || form.value.capitalizacion == ''|| form.value.tasaInteres == null || form.value.tasaInteres == '' || form.value.tasaAnualDcto == null || form.value.tasaAnualDcto == ''|| form.value.IRenta == null || form.value.IRenta == ''|| form.value.fechaEmision == null || form.value.fechaEmision == ''){
          if(form.value.valorNominal == null || form.value.valorNominal == '' || form.value.valorComercial == null || form.value.valorComercial == '' || form.value.nroxAnos == null || form.value.nroXAnos == '' || form.value.frecuenciaPago == null || form.value.frecuenciaPago == '' || form.value.diasXAno == null|| form.value.diasXAno == '' || form.value.tipoTasaInteres == null || form.value.tipoTasaInteres == '' || form.value.capitalizacion == null || form.value.capitalizacion == ''|| form.value.tasaInteres == null || form.value.tasaInteres == '' || form.value.tasaAnualDcto == null || form.value.tasaAnualDcto == ''|| form.value.IRenta == null || form.value.IRenta == ''|| form.value.fechaEmision == null || form.value.fechaEmision == ''){
  
        return false;
        }
        this.router.navigate(['/extra']);
      })
    // }
    }
  }

  getBonosByUserID(){
    this.bonosService.selectedBono = new Bono();
    console.log(this.u_id);
    console.log(this.u_Type);
    // if(this.u_Type == '1' || typeof this.u_Type === 'undefined'){
      this.bonosService.getBonosByUserID(this.u_id)
      .subscribe(res => {
        this.bonosService.bonos = res as Bono[];
        console.log(res);
      });
    // }
    if(this.u_Type == '2'){
      this.bonosService.getBonosByBonistaID(this.u_id)
      .subscribe(res => {
        this.bonosService.bonos = res as Bono[];
        console.log(this.bonosService.bonos);
      })
    }
   
  }

  getUsersByTypeID(){
    console.log(this.userType);
    var user1: User = new User();
    user1.userType = this.userType;
    /////////2 PORQUE SOLO SE TRAE EL ARR DE BONISTAS QUE TIENEN USERTYPE 2
    this.authService.getUsersByType(user1)
    .subscribe(res => {
      this.authService.users = res as User[];
      console.log(this.authService.users);
    })
  }

  editBono(bono: Bono){
    this.bonosService.selectedBono = bono;
    console.log(this.bonosService.selectedBono);
    
  }

  deleteBono(id: string){
    console.log(id);
    if(confirm('Are you sure you want to delete it?')){
    
      this.bonosService.deleteBono(id)
      .subscribe(res => {
        this.getBonosByUserID();
        console.log(res);
      })
    }
  }

  formToBono(bonito: Bono, form: NgForm){
    console.log(form.value._id);
    bonito._id = form.value._id;
    bonito.IRenta = form.value.IRenta;
    bonito.capitalizacion = form.value.capitalizacion;
    bonito.diasXAno = form.value.diasXAno;
    bonito.fechaEmision = form.value.fechaEmision;
    bonito.frecuenciaPago = form.value.frecuenciaPago;
    bonito.nroxAnos = form.value.nroxAnos;
    bonito.porcentajeCavali = form.value.porcentajeCavali;
    bonito.porcentajeColocacion = form.value.porcentajeColocacion;
    bonito.porcentajeEstructuracion = form.value.porcentajeEstructuracion;
    bonito.porcentajeFlotacion = form.value.porcentajeFlotacion;
    bonito.porcentajePrima = form.value.porcentajePrima;
    bonito.tasaAnualDcto = form.value.tasaAnualDcto;
    bonito.tasaInteres = form.value.tasaInteres;
    bonito.tipoTasaInteres = form.value.tipoTasaInteres;
    bonito.valorComercial = form.value.valorComercial;
    bonito.valorNominal = form.value.valorNominal;

    return bonito;
  }

  getValidation(formVariable: string){
    if(formVariable == ''){

    }
  }

  getFontColor(selected: boolean) {
    switch (selected) {
      case true:
        return 'white';
      case false:
        return 'black';
    }
  }

  getBackgroundColor(selected: boolean) {
    switch (selected) {
      case true:
        return '#008cba';
      case false:
        return '#eee';
    }
  }

  Select1(){
    this.selected1 = true;
    this.selected2 = false;
  }
  Select2(){
    this.selected1 = false;
    this.selected2 = true;
    this.getBonosByUserID();
  }

  

}
