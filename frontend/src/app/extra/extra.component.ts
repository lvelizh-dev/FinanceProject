import { Component, OnInit } from '@angular/core';
import { GracePeriodService } from '../services/grace-period.service';
import { InflationService } from '../services/inflation.service';
import { Inflation } from '../models/inflation';
import { BonosService } from '../services/bonos.service';
import { GracePeriod } from '../models/grace-period';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Bono } from '../models/bono';
import { Config } from '../models/config';
import { FlujoService } from '../services/flujo.service';
import { Flujo, TCEA } from '../models/flujo';
import { config } from 'rxjs';


@Component({
  selector: 'app-extra',
  templateUrl: './extra.component.html',
  styleUrls: ['./extra.component.css']
})
export class ExtraComponent implements OnInit {
  message: string;
  inflation = new Inflation();
  gracePeriod = new GracePeriod();
  arrInflation: Inflation[];
  arrGracePeriod: GracePeriod[];
  tcea: TCEA;
  

  bonoActual: Bono;
  configActual: Config;
  // arrGracePeriod: GracePeriod[];
  arrInflations: Inflation[];



  constructor(public inflationService: InflationService,
    public gracePeriodService: GracePeriodService,
    public bonosService: BonosService,
    public flujoService: FlujoService,
    private router: Router
    ) { }

   

  ngOnInit() {
    this.tcea = new TCEA();
    this.arrInflation = [];
    
    console.log(this.message);
    this.bonosService.currentMessage.subscribe(message => this.message = message);
    this.bonosService.currentBono.subscribe(bonito => this.bonoActual = bonito);
    this.bonosService.currentConfig.subscribe(config => this.configActual = config);
    
    this.gracePeriodService.getGracePeriodsByBonoID(this.message)
    .subscribe(res => {
      this.gracePeriodService.gracePeriods = res as GracePeriod[];
      console.log(this.gracePeriodService.gracePeriods);
      console.log(this.message);
      if(this.gracePeriodService.gracePeriods){
        this.arrGracePeriod = this.gracePeriodService.gracePeriods;
        console.log(this.arrGracePeriod);
      }
      else{
        console.log('arrGracePeriod Vacio');
        this.arrGracePeriod.push(this.gracePeriod);
      }


    })   
    this.inflationService.getInflationsByBonoID(this.message)
    .subscribe(res => {
      this.inflationService.inflations = res as Inflation[];
      console.log(this.inflationService.inflations);
      if(this.inflationService.inflations){
        this.arrInflation = this.inflationService.inflations;
        console.log(this.arrInflation);
      }
      else{
        console.log('arrInflation Vacio');
        this.arrInflation.push(this.inflation);
  
      }
    })
 


  }

  newFlujos(flujos: Flujo[]) {
    this.bonosService.changeFlujos(flujos);
  }

  newTcea(tcea: TCEA){
    this.bonosService.changeTCEA(tcea);
  }

  addInflationForm(){
    this.inflation = new Inflation();
    this.inflation.inflation = 0;
    this.inflation.year = 0;
    this.inflation.bono_id = this.message;
    this.arrInflation.push(this.inflation);
  }

  addGracePeriodForm(){
    this.gracePeriod = new GracePeriod();
    this.gracePeriod.bono_id = this.message;
    this.arrGracePeriod.push(this.gracePeriod);
  }

  onSubmit(){
    // console.log(form.value);
    console.log(this.arrInflation);
    this.inflationService.updateManyInflations(this.arrInflation);
  }

  
  onSubmitGracePeriod(){
    console.log(this.arrGracePeriod);
    this.gracePeriodService.updateManyGracePeriods(this.arrGracePeriod);
  }

  Calculo(){
    this.tcea = new TCEA();
    console.log(this.arrInflation);
    console.log(this.arrGracePeriod);
    console.log(this.configActual.method);
    this.bonosService.changeInflations(this.arrInflation);
    this.bonosService.changeGracePeriods(this.arrGracePeriod);
    
    // console.log(thi)
    var flujos = this.flujoService.llamarMetodo(this.bonoActual, this.configActual, this.arrInflation, this.arrGracePeriod, this.tcea);
    this.newTcea(this.tcea);
    // var flujos = this.flujoService.metodoFrances(this.bonoActual, this.configActual, this.arrInflation, this.arrGracePeriod);
    this.newFlujos(flujos);
    console.log(this.tcea);
    this.router.navigate(['/flujo']);
  }

  removeForm(index, id: string){
    console.log(id);
     if(confirm('¿Seguro que desea eliminar la inflación?')){
    this.inflationService.deleteInflation(id)
    .subscribe(res => {
      this.arrInflation.splice(index);
      console.log(res);
    })  // }
  }
    
  }
  // if(confirm('Are you sure you want to delete it?')){
    
  //   this.bonosService.deleteBono(id)
  //   .subscribe(res => {
  //     this.getBonosByUserID();
  //     console.log(res);
  //   })
  // }
 

  removeFormGracePeriod(index, id: string){
    console.log(id);
    if(confirm('¿Seguro que desea eliminar el período de gracia?')){
   this.gracePeriodService.deleteGracePeriod(id)
   .subscribe(res => {
     this.arrGracePeriod.splice(index);
     console.log(res);
   })  // }
 }
   
  }

  
  newMessage(letra: string) {
    this.bonosService.changeMessage(letra);
  }


}
