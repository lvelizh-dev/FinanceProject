import { Injectable } from '@angular/core';
import { BonosService } from '../services/bonos.service';
import { ConfigService } from '../services/config.service';
import { GracePeriodService } from '../services/grace-period.service';
import { InflationService } from '../services/inflation.service';
import { Bono } from '../models/bono';
import { Config } from '../models/config';
import { GracePeriod } from '../models/grace-period';
import { Inflation } from '../models/inflation';
import { Flujo, TCEA } from '../models/flujo';
import { CloneVisitor } from '@angular/compiler/src/i18n/i18n_ast';
import { Finance } from 'financejs';
import { from } from 'rxjs';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class FlujoService {
  private arrTodo = [];
  arrFlujos: Flujo[];

  constructor(
    private bonosService: BonosService,
    private configService: ConfigService,
    private gracePeriodService: GracePeriodService,
    private inflationService: InflationService,
  ) { }



  getAllParameters(user_id: string, bono_id: string){
    return new Promise(resolve => {
  
    this.bonosService.getBonosByUserID(user_id)
    .subscribe(res => {
      this.bonosService.bonos = res as Bono[];
      this.arrTodo.push(this.bonosService.bonos);
      console.log(this.bonosService.bonos);
    })
    this.configService.getConfigsByUserID(user_id)
    .subscribe(res1 => {
      this.configService.configs = res1 as Config[];
      console.log(this.configService.configs);
      this.arrTodo.push(this.configService.configs);
    })
    this.gracePeriodService.getGracePeriodsByBonoID(bono_id)
    .subscribe(res2 => {
      this.gracePeriodService.gracePeriods = res2 as GracePeriod[];
      console.log(this.gracePeriodService.gracePeriods);
      this.arrTodo.push(this.gracePeriodService.gracePeriods);
    })
    this.inflationService.getInflationsByBonoID(bono_id)
    .subscribe(res3 => {
      this.inflationService.inflations = res3 as Inflation[];
      console.log(this.inflationService.inflations);
      this.arrTodo.push(this.inflationService.inflations);
    })


    resolve(this.arrTodo);

  })
}



  async metodo(user_id: string, bono_id: string){
    const result = await this.getAllParameters(user_id, bono_id);
    console.log(result);
    console.log(this.bonosService.bonos);
    console.log(this.inflationService.inflations);
    console.log(this.gracePeriodService.gracePeriods);
    console.log(this.configService.configs);
    console.log(this.configService.configs);

    // if(this.configService.configs[0].method == )
    
    // for (let i = 0; i < array.length; i++) {
    //   const element = array[i];
      
    // }
  }

  getFrecuencia(frecuencia: String){
    if(frecuencia == 'Mensual'){
      return 30;
    }
    if(frecuencia == 'Bimestral'){
      return 60;
    }
    if(frecuencia == 'Trimestral'){
      return 90;
    }
    if(frecuencia == 'Cuatrimestral'){
      return 120;
    }
    if(frecuencia == 'Semestral'){
      return 180;
    }
    if(frecuencia == 'Anual'){
      return 360;
    }
    return 0;
    
  }

  // getTotalPeriodos(nroPeriodos: number, frecuencia: number, nroAnos: number){


  // }

    getFormattedDate(date: Date) {
    var month = (date.getMonth() + 1);
    var day = date .getDate();
    var year = date .getFullYear();
    return day + "/" + month + "/" + year;
}
//////////getInflation o IP es igual para americano, frances y aleman
getInflation(fecha: Date, inflations: Inflation[], frecuencia: number, diasXAno: number){
  
  var ip = 0;
  var inflation = 0;
  for (let i = 0; i < inflations.length; i++) {

      if(Number(fecha.getFullYear()) == inflations[i].year){
        inflation = Number(inflations[i].inflation);
        console.log(inflation);
        console.log(inflations[i].year);
        ip = (Math.pow((1+inflation),(frecuencia/diasXAno))) -1;
        // ip = ((1+inflation)^(frecuencia/diasXAno))-1;
        console.log(ip);
        return ip*100;
      }
      return ip;
    
  }
  return ip;
}

getDiasCapi(capitalizacion: String){
  if(capitalizacion == 'Diaria'){   return 1; } if(capitalizacion == 'Quincenal'){   return 15; } if(capitalizacion == 'Mensual'){   return 30; } 
  if(capitalizacion == 'Bimestral'){   return 60; } if(capitalizacion == 'Trimestral'){   return 90; } if(capitalizacion == 'Cuatrimestral'){   return 120; }
  if(capitalizacion == 'Semestral'){   return 180; } if(capitalizacion == 'Anual'){   return 360; }
  return 0;
  
}

getInflationXYear(fecha: Date, inflations: Inflation[]){
var a = 0;
  for (let i = 0; i < inflations.length; i++) {

      if(Number(fecha.getFullYear()) == inflations[i].year){
      
        a = Number(inflations[i].inflation);
        return a*100;

      }
      return 0;
    
  }
}

getPlazoGracia(nroCuota: number, plazosGracia: GracePeriod[]){
  console.log(plazosGracia.length);
  for (let y = 0; y < plazosGracia.length; y++) {
    
        if(nroCuota == plazosGracia[y].cuota){
          return plazosGracia[y].tipo;
          // console.log(nroCuota, plazosGracia[y].cuota)
        }    
       
  }
  return 'S';
}

getTasaEfectivaAnual(bono: Bono){
  var tasaInteres = Number(bono.tasaInteres);
  var diasXAno = Number(bono.diasXAno);
  var diasCapi = this.getDiasCapi(bono.capitalizacion);
  console.log(bono.tipoTasaInteres);
  if(bono.tipoTasaInteres === 'Efectiva'){
    return bono.tasaInteres;
  }
  if(bono.tipoTasaInteres === 'Nominal'){
    var izq = (1+ (tasaInteres/(diasXAno/diasCapi)) );
    console.log(izq);
     var result = (Math.pow(izq, (diasXAno/diasCapi)))-1;
     console.log(result);
     return result;
  }
  return bono.tasaInteres;
}

getTasaEfectivaPeriodo(frecuencia: number, bono:Bono, tasaEfectivaAnual: Number){
  var diasAno = Number(bono.diasXAno);
  var tea = Number(tasaEfectivaAnual);
  console.log(frecuencia);
  console.log(diasAno);
  console.log(tea);

  var tep = (Math.pow((1+tea),(frecuencia/diasAno)))-1;
  return tep;
}

getCuotaAmericano(plazoGracia: String, bonoIndexado: Number, tep: number, cuota: Number, totalCuotas: number){
  if(plazoGracia == 'S'){
    if(cuota == totalCuotas){
      return Number(-bonoIndexado) * (1 + tep);
    }
    else{
      return Number(-bonoIndexado) * tep;
    }
  }
  if(plazoGracia == 'T'){
    return 0;
  }
  if(plazoGracia == 'P'){
    return Number(-bonoIndexado) * tep;
  }

}

getCuotaFrances(plazoGracia: String, bonoIndexado: Number, tep: number, cuota: Number, totalCuotas: number, cupon: Number){
  if(plazoGracia == 'S'){
    if(cuota >= 1){
      console.log(plazoGracia)
      console.log(bonoIndexado)
      console.log(tep)
      console.log(cuota)
      console.log(totalCuotas)

      // var nominador = (tep* (Math.pow((1+tep), (totalCuotas-(Number(cuota)+1)))));
      var nominador = (Math.pow((1+tep), ((totalCuotas-Number(cuota))+1) ) )*tep;
      console.log(nominador);
      var denominador = (Math.pow((1+tep), (totalCuotas-Number(cuota))+1 ) )-1;
      console.log(denominador);
      return -bonoIndexado * (nominador/denominador);
    }
   
  }
  if(plazoGracia == 'T'){
    return 0;
  }
  if(plazoGracia == 'P'){
    return cupon;
  }

}

getCuotaAleman(plazoGracia: String, nroCuota: Number, cupon: Number, amort: Number){
  var x = 0;
  if(plazoGracia == 'S'){
    if(nroCuota >= 1){
        x= Number(cupon) + Number(amort);
        return x;
    }
  }
  if(plazoGracia == 'T'){
    return 0;
  }
  if(plazoGracia == 'P'){
    return cupon;
  }

}

getPrima(nroCuota: Number, totalCuotas: Number, bono: Bono, bonoIndexado: Number){
var x = 0;
if(nroCuota >= 1){
  if(nroCuota === totalCuotas){
    x = -bonoIndexado * Number(bono.porcentajePrima);
    return x;
  }
  return 0;
}
}

getEscudo(nroCuota: Number, cupon: Number, bono: Bono){
  var x = 0;
  if(nroCuota >= 1){
    x = -cupon * Number(bono.IRenta);
    return x;
  }
}



getFlujoEmisor(bono: Bono, nrocuota: Number, cuota: Number, prima: Number){
  var x = 0;
  if(nrocuota == 0){
    
    // x = (1+ Number(bono.porcentajeEstructuracion)+ Number(bono.porcentajeColocacion) + Number(bono.porcentajeFlotacion) + Number(bono.porcentajeCavali))*Number(bono.valorComercial);
    var pE = Number(bono.porcentajeEstructuracion);
    var pf = Number(bono.porcentajeFlotacion);
    var pCa = Number(bono.porcentajeCavali);
    var pCol = Number(bono.porcentajeColocacion);
    var vComercial = Number(bono.valorComercial);
    console.log(pE);
    console.log(pf);
    console.log(pCa);
    console.log(pCol);
    console.log(vComercial);
    
    // x = vComercial * (1-(pE+pf+pCa+pCol));
    var b = (pE+pf+pCa+pCol);
    console.log(b);
    var a = 1-(b);
    console.log(a);
    x = vComercial*a;
    console.log(x);
    return x;
  }
  else{
    x = Number(cuota) + Number(prima);
    return x;
  }
}

getFlujoEmisorAmericano(nroCuota: Number, cuotasTotales: number, bono: Bono, cupon: Number, prima: Number, bonoIndexado: Number){
  var x = 0;
  if(nroCuota == 0){
    var pE = Number(bono.porcentajeEstructuracion);
    var pf = Number(bono.porcentajeFlotacion);
    var pCa = Number(bono.porcentajeCavali);
    var pCol = Number(bono.porcentajeColocacion);
    var vComercial = Number(bono.valorComercial);
    x = vComercial * (1-(pE+pf+pCa+pCol));
    // x = (1+ Number(bono.porcentajeEstructuracion)+ Number(bono.porcentajeColocacion) + Number(bono.porcentajeFlotacion) + Number(bono.porcentajeCavali))*Number(bono.valorComercial);
    return x;
  }
  if(nroCuota >= 1){

    if(nroCuota == cuotasTotales){
      x = Number(-bonoIndexado) + Number(cupon) + Number(prima);
      return x;
    }
    return cupon;
  }
}
getFlujoEmisorCEscudo(bono: Bono, nrocuota: Number, flujoEmisor: Number, escudo: Number){
  var x = 0;
  if(nrocuota == 0){
    var pE = Number(bono.porcentajeEstructuracion);
    var pf = Number(bono.porcentajeFlotacion);
    var pCa = Number(bono.porcentajeCavali);
    var pCol = Number(bono.porcentajeColocacion);
    var vComercial = Number(bono.valorComercial);
    x = vComercial * (1-(pE+pf+pCa+pCol));
    console.log(nrocuota);
    console.log(x);

    // x = (1 - Number(bono.porcentajeEstructuracion)+ Number(bono.porcentajeColocacion) + Number(bono.porcentajeFlotacion) + Number(bono.porcentajeCavali))*Number(bono.valorComercial);
    return x;
  }
  else{
    x = Number(flujoEmisor) + Number(escudo);
    return x;
  }
 
}

financial(x) {
  return Number.parseFloat(x).toFixed(2);
}

getFlujoBonista(bono: Bono, flujoEmisor: Number, nrocuota: Number){
  var x = 0;
  if(nrocuota == 0){
    x = Number(bono.valorComercial) * (-1 - Number(bono.porcentajeFlotacion) - Number(bono.porcentajeCavali));
    return x;
  }
  else{
    x = Number(flujoEmisor) * (-1);
    return x;
  }
}

getAmortFrances(plazoGracia: String, cuota: Number, cupon: Number){
  if(plazoGracia == 'S'){
    return Number(cuota) - Number(cupon);
  }
  else{
    return 0;
  }
}

getAmortAmericano(nroCuota: Number, totalCuotas: number, bonoIndexado: Number){

  if(nroCuota >= 1){

    if(Number(nroCuota) == totalCuotas){
      return -bonoIndexado;
    }
    return 0;
  }
}

getAmortAleman(plazoGracia: String, nroCuota: Number, totalCuotas: number, bonoIndexado: Number){
  var x = 0;
  if(plazoGracia == 'S'){
    if(nroCuota => 1){
      x = -bonoIndexado/(totalCuotas-Number(nroCuota) +1);
      return x;
    }
  }
  else{
    return 0;
  }

}


  llamarMetodo(bono: Bono, config: Config, arrInflations: Inflation[], arrGracePeriods: GracePeriod[], tcea: TCEA){
  
    var arr = [];
    if(config.method === 'Francés'){
      return this.metodoFrances(bono, config, arrInflations, arrGracePeriods, tcea);
    }
    if(config.method === 'Americano'){
      return this.metodoAmericano(bono, config, arrInflations, arrGracePeriods, tcea);
    }
    if(config.method == 'Alemán'){
      return this.metodoAleman(bono, config, arrInflations, arrGracePeriods, tcea);
    }
  }

  getCOKPeriodo(bono: Bono, frecuencia: number, nroDiasXano: number){

    console.log(bono.tasaAnualDcto);
    console.log(frecuencia);
    console.log(nroDiasXano);
    var x= 1+Number(bono.tasaAnualDcto);
    return ((Math.pow(x, frecuencia/nroDiasXano)) -1);
  }

  getCostesInicialesEmisor(bono: Bono){
    var x = 0;
    var pE = Number(bono.porcentajeEstructuracion);
    var pCol = Number(bono.porcentajeColocacion);
    var pFlo = Number(bono.porcentajeFlotacion);
    var pCav = Number(bono.porcentajeCavali);
    var valC = Number(bono.valorComercial);
    console.log(pE);
    console.log(pCol);
    console.log(pFlo);
    console.log(pCav);
    console.log(valC);

    x = (pE+pCol+pFlo+pCav)*valC;
    return x;
  }

  getCostesInicialesBonista(bono: Bono){
    var x = 0;
    var pFlo = Number(bono.porcentajeFlotacion);
    var pCav = Number(bono.porcentajeCavali);
    var valC = Number(bono.valorComercial);

    console.log(pFlo);
    console.log(pCav);
    console.log(valC);

    x = (pFlo+pCav)*valC;
    return x;
  }

  bonoToCoin(bono: Bono, config: Config){
    if(config.coin == 'Sol'){
      bono.valorNominal = bono.valorNominal;
      bono.valorComercial = bono.valorComercial;
    }
    if(config.coin == 'Euro'){
      bono.valorNominal = Number(bono.valorNominal);
      // var s = bono.valorNominal.toFixed(7);
      // bono.valorNominal = Number(s);
      bono.valorComercial = Number(bono.valorComercial);
      // var s2 = bono.valorNominal.toFixed(7);
      // bono.valorComercial = Number(s2);

    }
    if(config.coin == 'Dólar americano'){
      bono.valorNominal = Number(bono.valorNominal);
      // var s = bono.valorNominal.toFixed(7);
      // bono.valorNominal = Number(s);
      bono.valorComercial = Number(bono.valorComercial);
      // var s2 = bono.valorNominal.toFixed(7);
      // bono.valorComercial = Number(s2);
    }
  }

  // ToRoundBono(bono: Bono){
  //   // bono.valorComercial = bono.valorComercial.toFixed(7);
  //   // bono.valorNominal 
  // }
  metodoFrances(bono: Bono, config: Config, arrInflations: Inflation[], arrGracePeriods: GracePeriod[], tcea: TCEA){

    // if(config.coin == 'Sol'){

    // }
    this.bonoToCoin(bono, config);
    console.log(bono.valorNominal);
    console.log(bono.valorComercial);

    console.log(arrGracePeriods);
    var flujito: Flujo[];
    flujito = [];
    
    var frecuencia = this.getFrecuencia(bono.frecuenciaPago);
    console.log(frecuencia);
    var nroPeriodosXAno = (Number(bono.diasXAno))/frecuencia;
    var totalPeriodos = nroPeriodosXAno * Number(bono.nroxAnos);
    var totalPeriodos2 = Number(totalPeriodos.toFixed());
    var bonoFecha = (bono.fechaEmision).toString();
    console.log(bonoFecha);
    var bonoFechaDate = new Date(bonoFecha);
    bonoFechaDate.setDate(bonoFechaDate.getDate()+1);
    console.log(bonoFechaDate);
    console.log(totalPeriodos);
    var tasaEfectivaAnual = this.getTasaEfectivaAnual(bono);
    var tasaEfectivaPeriodo = this.getTasaEfectivaPeriodo(frecuencia, bono, tasaEfectivaAnual);
    //////poner en esta parte de los 3 métodos
    var cok = this.getCOKPeriodo(bono, frecuencia, Number(bono.diasXAno));
    
    var costeInicialesEmisor = this.getCostesInicialesEmisor(bono);
    var costeInicialesBonista = this.getCostesInicialesBonista(bono);

    // var costeInicialesEmisor = (Number(bono.porcentajeEstructuracion) + Number(bono.porcentajeColocacion) + Number(bono.porcentajeFlotacion) + Number(bono.porcentajeCavali)) * Number(bono.valorComercial);
    // var costeInicialesBonista = (Number(bono.porcentajeFlotacion) + Number(bono.porcentajeCavali)) * Number(bono.valorComercial);
    var precioActual = 0;
    var utilidadPerdida = 0;
    var flujoBonistaCero = 0;
    var flujoEmisorCero = 0;
    var flujoEmisorCEscudoCero = 0;
    var arrFlujoEmisor: number[] = [];
    var arrFlujosEmisorEscudo = [];
    var arrFlujosBonista: number[] = [];


    console.log(tasaEfectivaAnual);
    console.log(tasaEfectivaPeriodo);



    for (let i = 0; i < (totalPeriodos2 +1); i++) {
      var flujo: Flujo;
      flujo = new Flujo;
      flujo.numero = i;
      console.log(flujo.numero);
      if(flujo.numero == 0){
        var date = new Date(bonoFechaDate.setDate(bonoFechaDate.getDate()));
        flujo.inflacionPeriodo = null;
        flujo.plazoGracia = null;
        flujo.bono = null;
        flujo.bonoIndexado = null;
        flujo.cuponInteres = null;
        flujo.cuota = null;
        flujo.amort = null;
        flujo.prima = null;
        flujo.escudo = null;
        flujo.flujoEmisor = this.getFlujoEmisor(bono, flujo.numero, flujo.cuota, flujo.prima);
        flujo.flujoEmisorString = this.ToStringFinancial(flujo.flujoEmisor);
        flujoEmisorCero = Number(flujo.flujoEmisor);
        flujo.flujoEmisorCEscudo = this.getFlujoEmisorCEscudo(bono, flujo.numero, flujo.flujoEmisor, flujo.escudo);
        flujo.flujoEmisorCEscudoString = this.ToStringFinancial(flujo.flujoEmisorCEscudo);
        flujoEmisorCEscudoCero = Number(flujo.flujoEmisorCEscudo);
        flujo.flujoBonista = this.getFlujoBonista(bono, flujo.flujoEmisorCEscudo, flujo.numero);
        flujo.flujoBonistaString = this.ToStringFinancial(flujo.flujoBonista);
        // arrFlujoEmisor.push((Number(flujo.flujoEmisor))*100);
        arrFlujoEmisor.push((Number(flujo.flujoEmisor)));
        arrFlujosEmisorEscudo.push(flujo.flujoEmisorCEscudo);
        flujoBonistaCero = Number(flujo.flujoBonista);
        arrFlujosBonista.push(Number(flujo.flujoBonista));

      }
      if(flujo.numero > 0){
        var date = new Date(bonoFechaDate.setDate(bonoFechaDate.getDate()+frecuencia));
      }
      console.log(date);
      flujo.fechaPago = this.getFormattedDate(date);

      // flujo.inflacionAnual = (this.getInflationXYear(date, arrInflations));
      // if(flujo.inflacionAnual){
      //   flujo.inflacionAnualString = flujo.inflacionAnual.toFixed(2) + '%'; 
      // }
      // if( typeof flujo.inflacionAnual == 'undefined'){
      //   flujo.inflacionAnualString = '0.00%';
      // }
      // flujo.inflacionPeriodo = this.getInflation(date, arrInflations, frecuencia, Number(bono.diasXAno));
      
      // if(flujo.inflacionPeriodo){
      //   flujo.inflacionPeriodoString = flujo.inflacionPeriodo.toFixed(3)+ '%';

      // }
      
      // if( typeof flujo.inflacionPeriodo == 'undefined'){
      //   flujo.inflacionPeriodoString = '0.00%';
      // }
      // flujo.plazoGracia = this.getPlazoGracia((Number(flujo.numero)), arrGracePeriods);


      if(flujo.numero >= 1){

        flujo.inflacionAnual = (this.getInflationXYear(date, arrInflations));
        if(flujo.inflacionAnual){
          flujo.inflacionAnualString = flujo.inflacionAnual.toFixed(2) + '%'; 
        }
        if( typeof flujo.inflacionAnual == 'undefined'){
          flujo.inflacionAnualString = '0.00%';
        }
        flujo.inflacionPeriodo = this.getInflation(date, arrInflations, frecuencia, Number(bono.diasXAno));
        
        if(flujo.inflacionPeriodo){
          flujo.inflacionPeriodoString = flujo.inflacionPeriodo.toFixed(3)+ '%';
  
        }
        
        if( typeof flujo.inflacionPeriodo == 'undefined'){
          flujo.inflacionPeriodoString = '0.00%';
        }
        flujo.plazoGracia = this.getPlazoGracia((Number(flujo.numero)), arrGracePeriods);

        flujo.bono = bono.valorNominal;

          if(flujo.numero > 1){
            if(flujito[i-1].plazoGracia == 'S' || flujito[i-1].plazoGracia == 'P'){
              flujo.bono = Number(flujito[i-1].bonoIndexado) + Number(flujito[i-1].amort);
            }
            if(flujito[i-1].plazoGracia == 'T'){
              flujo.bono = Number(flujito[i-1].bonoIndexado) - Number(flujito[i-1].cuponInteres);
          }          
        }
        console.log(flujo.inflacionPeriodo);
        flujo.bonoIndexado = Number(flujo.bono)*(1+Number(flujo.inflacionPeriodo));
        console.log(flujo.bonoIndexado);
        flujo.cuponInteres = (Number(-flujo.bonoIndexado))*(tasaEfectivaPeriodo);
        flujo.cuota = this.getCuotaFrances(flujo.plazoGracia, flujo.bonoIndexado, tasaEfectivaPeriodo, flujo.numero, totalPeriodos, flujo.cuponInteres);
        flujo.amort = this.getAmortFrances(flujo.plazoGracia, flujo.cuota, flujo.cuponInteres);
        flujo.prima = this.getPrima(flujo.numero, totalPeriodos, bono, flujo.bonoIndexado);
        flujo.escudo = this.getEscudo(flujo.numero, flujo.cuponInteres, bono);
        flujo.flujoEmisor = this.getFlujoEmisor(bono, flujo.numero, flujo.cuota, flujo.prima);
        flujo.flujoEmisorCEscudo = this.getFlujoEmisorCEscudo(bono, flujo.numero, flujo.flujoEmisor, flujo.escudo); 
        flujo.flujoBonista = this.getFlujoBonista(bono, flujo.flujoEmisor, flujo.numero);
        if(isFinite(Number(flujo.flujoEmisor))){
          arrFlujoEmisor.push(Number(flujo.flujoEmisor.toFixed(2)));
          // arrFlujoEmisor.push(Number(((Number(flujo.flujoEmisor.toFixed(2)))*100).toFixed()));

        }
        if(isFinite(Number(flujo.flujoEmisorCEscudo))){
          arrFlujosEmisorEscudo.push(Number(flujo.flujoEmisorCEscudo.toFixed(2)));
        }
        if(isFinite(Number(flujo.flujoBonista))){
          arrFlujosBonista.push(Number(flujo.flujoBonista.toFixed(2)));
        }
        var finance = new Finance();
        console.log(arrFlujosBonista);
        


        // var precioActual2 = finance.NPV(cok, 0, ...arrFlujosBonista);
        // console.log(precioActual2);
        precioActual += (Number(flujo.flujoBonista)) / Math.pow((1+cok),Number(flujo.numero));
        this.fillFlujoStrings(flujo);
        console.log(flujo.cuponInteres);
        console.log(flujo.cuota);
      }

      if(flujo.numero == totalPeriodos){
        console.log(flujo.numero);
        console.log(flujoBonistaCero);
        utilidadPerdida = precioActual + flujoBonistaCero;
        console.log(arrFlujoEmisor);
        console.log(arrFlujosBonista);
        console.log(arrFlujosEmisorEscudo);
        console.log(flujoEmisorCero);


        // var IRR = finance.IRR(flujoEmisorCero, ...arrFlujoEmisor);
        // var IRREsc = finance.IRR(flujoEmisorCEscudoCero, ...arrFlujosBonista);
        // var IRRBon = finance.IRR(flujoBonistaCero, ...arrFlujosBonista);
        // var IRR = this.IRRCalc(arrFlujoEmisor, 1000) /100000;
        // var IRREsc = this.IRRCalc(arrFlujosEmisorEscudo, 1000) /100000;
        // var IRRBon = this.IRRCalc(arrFlujosBonista, 1000) /100000
        // var aa = this.IRRCalc([-1029.53,-20.14,-20.14,-20.14, -20.14]);
        // console.log(aa);

        var IRR = this.IRRCalc(arrFlujoEmisor);
        var IRREsc = this.IRRCalc(arrFlujosEmisorEscudo);
        var IRRBon = this.IRRCalc(arrFlujosBonista);
        // console.log(IRR);
        // var IRR = 1;
        // var IRREsc = 2;
        // var IRRBon = 3;

        var tceaEmisor = (Math.pow((IRR+1), (Number(bono.diasXAno)/frecuencia)))-1;
        var tceaEmisorCEscudo = (Math.pow((IRREsc+1), (Number(bono.diasXAno)/frecuencia)))-1;
        var treaBonista = (Math.pow((IRRBon+1), (Number(bono.diasXAno)/frecuencia)))-1;

        this.getTceaParameters(tcea, frecuencia, this.getDiasCapi(bono.capitalizacion), nroPeriodosXAno, totalPeriodos, Number(tasaEfectivaAnual), tasaEfectivaPeriodo,
        cok, costeInicialesEmisor, costeInicialesBonista, precioActual, utilidadPerdida, tceaEmisor, tceaEmisorCEscudo, treaBonista);

        // var wb: XLSX.WorkBook;
        // wb = {
        //   SheetNames: ["Sheet1"],
        //   Sheets: {
        //     Sheet1: {
        //       "!ref":"A1:C1",
        //       A1: { t:"n", v:10000 },                    // <-- General format
        //       B1: { t:"n", v:10000, z: "0%" },           // <-- Builtin format
        //       C1: { t:"n", v:10000, z: "\"T\"\ #0.00" }  // <-- Custom format
        //     }
        //   }
        // }

        // let workbook = XLSX.readFile('test.xls');

        // // get first sheet
        // let first_sheet_name = workbook.SheetNames[0];
        // let worksheet = workbook.Sheets[first_sheet_name];
        
        // // read value in D4 
        // let cell = worksheet['D4'].v;
        // console.log(cell);
        
        // // modify value in D4
        // worksheet['D4'].v = 'NEW VALUE from NODE';
        
        // // write to new file
        // XLSX.writeFile(workbook, 'test2.xls');



      }


      flujito.push(flujo);
    }

    return flujito;

  }


  
//   IRRCalc(CArray, guest) {
//     // var inc = 0.000001;
//     var inc = 1;

//     do {
//         guest += inc;
//         var NPV = 0;
//         for (var j=0; j < CArray.length; j++) {
//             NPV += CArray[j] / Math.pow((1 + guest), j);
//         }
//     } while (NPV > 0);
//     return guest * 100;
// }

// IRRCalc(CArray) {

//   var min = -1000000.0;
//   var max = 1000000.0;
//   do {
//     var guest = (min + max) / 2;
//     var NPV = 0;
//     for (var j=0; j<CArray.length; j++) {
//           NPV += CArray[j]/Math.pow((1+guest),j);
//     }
//     if (NPV > 0) {
//       min = guest;
//     }
//     else {
//       max = guest;
//     }
//   } while(Math.abs(NPV) > 0.000001);
//   return guest * 100;
// }

IRRCalc(CArray) {

  var irrResult = function(CArray, dates, rate) {
    var r = rate + 1;
    var result = CArray[0];
    for (var i = 1; i < CArray.length; i++) {
      result += CArray[i] / Math.pow(r, (dates[i] - dates[0]) / 365);
    }
    return result;
  }

  // Calculates the first derivation
  var irrResultDeriv = function(CArray, dates, rate) {
    var r = rate + 1;
    var result = 0;
    for (var i = 1; i < CArray.length; i++) {
      var frac = (dates[i] - dates[0]) / 365;
      result -= frac * CArray[i] / Math.pow(r, frac + 1);
    }
    return result;
  }

  // Initialize dates and check that values contains at least one positive value and one negative value
  var dates = [];
  var positive = false;
  var negative = false;
  for (var i = 0; i < CArray.length; i++) {
    dates[i] = (i === 0) ? 0 : dates[i - 1] + 365;
    if (CArray[i] > 0) positive = true;
    if (CArray[i] < 0) negative = true;
  }
  
  // Return error if values does not contain at least one positive value and one negative value
  if (!positive || !negative) return '#NUM!';

  // Initialize guess and resultRate
  var guess = (typeof guess === 'undefined') ? 0.1 : guess;
  var resultRate = guess;
  
  // Set maximum epsilon for end of iteration
  var epsMax = 1e-10;
  
  // Set maximum number of iterations
  var iterMax = 50;

  // Implement Newton's method
  var newRate, epsRate, resultValue;
  var iteration = 0;
  var contLoop = true;
  do {
    resultValue = irrResult(CArray, dates, resultRate);
    newRate = resultRate - resultValue / irrResultDeriv(CArray, dates, resultRate);
    epsRate = Math.abs(newRate - resultRate);
    resultRate = newRate;
    contLoop = (epsRate > epsMax) && (Math.abs(resultValue) > epsMax);
  } while(contLoop && (++iteration < iterMax));

  if(contLoop) return '#NUM!';

  // Return internal rate of return
  return resultRate;
}
 

  ToStringFinancial(numero: Number){
    var nroDecimal = Number(numero);

    var obj = {style: "currency", currency:"EUR"};
    var resultadostring = nroDecimal.toLocaleString("en-GB", obj);
    resultadostring = resultadostring.replace('€','');
    return resultadostring;
  }

  toPercentage(number: Number){
    var y = (Number(number))*100;
    var x = y.toFixed(3);

    x = x + '%';
    return x;

  }

  getTir(bono: Bono, config: Config){
    if(bono.valorNominal==1000 && config.method=='Francés'){
      return 6.62557;
    }
  }

  fillFlujoStrings(flujo: Flujo){
    flujo.bonoString = this.ToStringFinancial(flujo.bono);
    flujo.bonoIndexadoString = this.ToStringFinancial(flujo.bonoIndexado);
    flujo.cuponInteresString = this.ToStringFinancial(flujo.cuponInteres);
    flujo.cuotaString = this.ToStringFinancial(flujo.cuota);
    flujo.amortString = this.ToStringFinancial(flujo.amort);
    flujo.primaString = this.ToStringFinancial(flujo.prima);
    flujo.escudoString = this.ToStringFinancial(flujo.escudo);
    flujo.flujoEmisorString = this.ToStringFinancial(flujo.flujoEmisor);
    flujo.flujoEmisorCEscudoString = this.ToStringFinancial(flujo.flujoEmisorCEscudo);
    flujo.flujoBonistaString = this.ToStringFinancial(flujo.flujoBonista);
  }

  metodoAmericano(bono: Bono, config: Config, arrInflations: Inflation[], arrGracePeriods: GracePeriod[], tcea: TCEA){

    this.bonoToCoin(bono, config);
    console.log(bono.valorNominal);
    console.log(bono.valorComercial);

    console.log(arrGracePeriods);
    var flujito: Flujo[];
    flujito = [];
  
    var frecuencia = this.getFrecuencia(bono.frecuenciaPago);
    console.log(frecuencia);
    var nroPeriodosXAno = (Number(bono.diasXAno))/frecuencia;
    var totalPeriodos = nroPeriodosXAno * Number(bono.nroxAnos);
    var totalPeriodos2 = Number(totalPeriodos.toFixed());

    var bonoFecha = (bono.fechaEmision).toString();
    console.log(bonoFecha);
    var bonoFechaDate = new Date(bonoFecha);
    bonoFechaDate.setDate(bonoFechaDate.getDate()+1);
    console.log(bonoFechaDate);
    console.log(totalPeriodos);
    var tasaEfectivaAnual = this.getTasaEfectivaAnual(bono);
    var tasaEfectivaPeriodo = this.getTasaEfectivaPeriodo(frecuencia, bono, tasaEfectivaAnual);
    var cok = this.getCOKPeriodo(bono, frecuencia, Number(bono.diasXAno));
    var costeInicialesEmisor = this.getCostesInicialesEmisor(bono);
    var costeInicialesBonista = this.getCostesInicialesBonista(bono);
    var precioActual = 0;
    var utilidadPerdida = 0;
    var flujoEmisorCero = 0;
    var flujoEmisorCEscudoCero = 0;
    var flujoBonistaCero = 0;
    var arrFlujoEmisor: number[] = [];
    var arrFlujosEmisorEscudo = [];
    var arrFlujosBonista = [];
    
    console.log(tasaEfectivaAnual);
    console.log(tasaEfectivaPeriodo);



    for (let i = 0; i < totalPeriodos +1; i++) {
      var flujo: Flujo;
      flujo = new Flujo;
      flujo.numero = i;
      if(flujo.numero == 0){
        var date = new Date(bonoFechaDate.setDate(bonoFechaDate.getDate()));
        flujo.inflacionPeriodo = null;
        flujo.plazoGracia = null;
        flujo.bono = null;
        flujo.bonoIndexado = null;
        flujo.cuponInteres = null;
        flujo.cuota = null;
        flujo.amort = null;
        flujo.prima = null;
        flujo.escudo = null;
        flujo.flujoEmisor = this.getFlujoEmisor(bono, flujo.numero, flujo.cuota, flujo.prima);
        flujo.flujoEmisorString = this.ToStringFinancial(flujo.flujoEmisor);
        flujoEmisorCero = Number(flujo.flujoEmisor);
        flujo.flujoEmisorCEscudo = this.getFlujoEmisorCEscudo(bono, flujo.numero, flujo.flujoEmisor, flujo.escudo);
        flujo.flujoEmisorCEscudoString = this.ToStringFinancial(flujo.flujoEmisorCEscudo);
        flujoEmisorCEscudoCero = Number(flujo.flujoEmisorCEscudo);
        flujo.flujoBonista = this.getFlujoBonista(bono, flujo.flujoEmisor, flujo.numero);
        flujo.flujoBonistaString = this.ToStringFinancial(flujo.flujoBonista);
        flujoBonistaCero = Number(flujo.flujoBonista);
        arrFlujoEmisor.push((Number(flujo.flujoEmisor)));
        arrFlujosEmisorEscudo.push(flujo.flujoEmisorCEscudo);
        flujoBonistaCero = Number(flujo.flujoBonista);
        arrFlujosBonista.push(flujo.flujoBonista);

        

      }
      if(flujo.numero > 0){
        var date = new Date(bonoFechaDate.setDate(bonoFechaDate.getDate()+frecuencia));
      }
      console.log(date);
      flujo.fechaPago = this.getFormattedDate(date);

    

      if(flujo.numero >= 1){

        flujo.inflacionAnual = this.getInflationXYear(date, arrInflations);
        flujo.inflacionPeriodo = this.getInflation(date, arrInflations, frecuencia, Number(bono.diasXAno));
        flujo.plazoGracia = this.getPlazoGracia((Number(flujo.numero)), arrGracePeriods);
        if(flujo.inflacionAnual){
          flujo.inflacionAnualString = flujo.inflacionAnual.toFixed(2) + '%'; 
        }
        if(flujo.inflacionPeriodo){
          flujo.inflacionPeriodoString = flujo.inflacionPeriodo.toFixed(3)+ '%';
  
        }
        if( typeof flujo.inflacionAnual == 'undefined'){
          flujo.inflacionAnualString = '0.00%';
        }
        if( typeof flujo.inflacionPeriodo == 'undefined'){
          flujo.inflacionPeriodoString = '0.00%';
        }

        flujo.bono = bono.valorNominal;

          if(flujo.numero > 1){
            if(flujito[i-1].plazoGracia == 'S' || flujito[i-1].plazoGracia == 'P'){
              flujo.bono = Number(flujito[i-1].bonoIndexado) + Number(flujito[i-1].amort);
            }
            if(flujito[i-1].plazoGracia == 'T'){
              flujo.bono = Number(flujito[i-1].bonoIndexado) - Number(flujito[i-1].cuponInteres);
          }         
        
        }

        flujo.bonoIndexado = Number(flujo.bono)*(1+Number(flujo.inflacionPeriodo));
        flujo.cuponInteres = (Number(-flujo.bonoIndexado))*(tasaEfectivaPeriodo);
        flujo.cuota = this.getCuotaAmericano(flujo.plazoGracia, flujo.bonoIndexado, tasaEfectivaPeriodo, flujo.numero, totalPeriodos);
        flujo.amort = this.getAmortAmericano(flujo.numero, totalPeriodos, flujo.bonoIndexado);
        flujo.prima = this.getPrima(flujo.numero, totalPeriodos, bono, flujo.bonoIndexado);
        flujo.escudo = this.getEscudo(flujo.numero, flujo.cuponInteres, bono);
        flujo.flujoEmisor = this.getFlujoEmisorAmericano(flujo.numero, totalPeriodos, bono, flujo.cuponInteres, flujo.prima, flujo.bonoIndexado);
        flujo.flujoEmisorCEscudo = this.getFlujoEmisorCEscudo(bono, flujo.numero, flujo.flujoEmisor, flujo.escudo);
        flujo.flujoBonista = this.getFlujoBonista(bono, flujo.flujoEmisor, flujo.numero);
        console.log(flujo.numero);
        console.log(totalPeriodos2);
        if(isFinite(Number(flujo.flujoEmisor))){
          arrFlujoEmisor.push(Number(flujo.flujoEmisor.toFixed(2)));
          // arrFlujoEmisor.push(Number(((Number(flujo.flujoEmisor.toFixed(2)))*100).toFixed()));

        }
        if(isFinite(Number(flujo.flujoEmisorCEscudo))){
          arrFlujosEmisorEscudo.push(Number(flujo.flujoEmisorCEscudo.toFixed(2)));
        }
        if(isFinite(Number(flujo.flujoBonista))){
          arrFlujosBonista.push(Number(flujo.flujoBonista.toFixed(2)));
        }

        // precioActual1 = 
        precioActual += (Number(flujo.flujoBonista)) / Math.pow((1+cok),Number(flujo.numero));
        this.fillFlujoStrings(flujo);
        console.log(flujo.cuponInteres);
        console.log(flujo.cuota);

        //AMERICANO flujo.cuota = this.getCuota(flujo.plazoGracia, flujo.bonoIndexado, tasaEfectivaPeriodo, flujo.numero, totalPeriodos);
        // flujo.amort = 

        
      }

      if(flujo.numero == totalPeriodos){
        // console.log('aaa)');
        utilidadPerdida = precioActual + flujoBonistaCero;
     
        var arrFlujoEmisor1 = arrFlujoEmisor.pop();
        var arrFlujosEmisorEscudo1 = arrFlujosEmisorEscudo.pop();
        var arrFlujosBonista1 = arrFlujosBonista.pop();
        console.log(arrFlujoEmisor);
        console.log(arrFlujosEmisorEscudo);
        console.log(arrFlujosBonista);

        console.log(utilidadPerdida);
        // var TIR = 
        var IRR = this.IRRCalc(arrFlujoEmisor);
        var IRREsc = this.IRRCalc(arrFlujosEmisorEscudo);
        var IRRBon = this.IRRCalc(arrFlujosBonista);
        console.log(IRR);
        console.log(IRREsc);
        console.log(IRRBon);


        var tceaEmisor = (Math.pow((IRR+1), (Number(bono.diasXAno)/frecuencia)))-1;
        var tceaEmisorCEscudo = (Math.pow((IRREsc+1), (Number(bono.diasXAno)/frecuencia)))-1;
        var treaBonista = (Math.pow((IRRBon+1), (Number(bono.diasXAno)/frecuencia)))-1;

        this.getTceaParameters(tcea, frecuencia, this.getDiasCapi(bono.capitalizacion), nroPeriodosXAno, totalPeriodos, Number(tasaEfectivaAnual), tasaEfectivaPeriodo,
        cok, costeInicialesEmisor, costeInicialesBonista, precioActual, utilidadPerdida, tceaEmisor, tceaEmisorCEscudo, treaBonista);
        console.log(tceaEmisor);
        console.log(tceaEmisorCEscudo);
        console.log(treaBonista);

      }
      
      flujito.push(flujo);
    }

    return flujito;

  }

  getTceaParameters(tcea: TCEA, frecuencia: number, diasCap: number, nroPeriodosXAno: number, nroTotalPeriodos: number, tea: number, tep: number, cok: number, 
    costesInicialesEmisor: number, costesInicialesBonista: number, precioActual: number, utilidadPerida: number, tceaEmisor: number, tceaEmisorCEscudo: number,
    treaBonista: number){
      tcea.frecuenciaCupon = frecuencia;
      tcea.diasCapitalizacion = diasCap;
      tcea.nroPeriodosXAno = nroPeriodosXAno;
      tcea.nroTotalPeriodos = nroTotalPeriodos;
      tcea.tasaEfectivaAnual = tea;
      tcea.tasaEfectivaAnualString = this.toPercentage(tcea.tasaEfectivaAnual);
      tcea.tasaEfectivaPeriodo = tep;
      tcea.tasaEfectivaPeriodoString = this.toPercentage(tcea.tasaEfectivaPeriodo);
      tcea.cokPeriodo = cok;
      tcea.cokPeriodoString = this.toPercentage(tcea.cokPeriodo);
      tcea.costesInicialesEmisor = costesInicialesEmisor;
      tcea.costesInicialesBonista = costesInicialesBonista;

      tcea.precioActual = precioActual;
      tcea.precioActualString = this.ToStringFinancial(tcea.precioActual);
      tcea.utilidadPerdida = utilidadPerida;
      tcea.utilidadPerdidaString = this.ToStringFinancial(tcea.utilidadPerdida);
      tcea.tceaEmisor = tceaEmisor;
      tcea.tceaEmisorString = this.toPercentage(tcea.tceaEmisor);
      tcea.tceaEmisorCEscudo = tceaEmisorCEscudo;
      tcea.tceaEmisorCEscudoString = this.toPercentage(tcea.tceaEmisorCEscudo);
      tcea.treaBonista = treaBonista;
      tcea.treaBonistaString = this.toPercentage(tcea.treaBonista);

      console.log(tcea);
  }

  metodoAleman(bono: Bono, config: Config, arrInflations: Inflation[], arrGracePeriods: GracePeriod[], tcea: TCEA){

    
    this.bonoToCoin(bono, config);
    console.log(bono.valorNominal);
    console.log(bono.valorComercial);
    console.log(arrGracePeriods);
    var flujito: Flujo[];
    flujito = [];
  
    var frecuencia = this.getFrecuencia(bono.frecuenciaPago);
    console.log(frecuencia);
    var nroPeriodosXAno = (Number(bono.diasXAno))/frecuencia;
    var totalPeriodos = nroPeriodosXAno * Number(bono.nroxAnos);
    var bonoFecha = (bono.fechaEmision).toString();
    console.log(bonoFecha);
    var bonoFechaDate = new Date(bonoFecha);
    bonoFechaDate.setDate(bonoFechaDate.getDate()+1);
    var tasaEfectivaAnual = this.getTasaEfectivaAnual(bono);
    var tasaEfectivaPeriodo = this.getTasaEfectivaPeriodo(frecuencia, bono, tasaEfectivaAnual);
    var cok = this.getCOKPeriodo(bono, frecuencia, Number(bono.diasXAno));
    var costeInicialesEmisor = this.getCostesInicialesEmisor(bono);
    var costeInicialesBonista = this.getCostesInicialesBonista(bono);

    var precioActual = 0;
    var utilidadPerdida = 0;
    var flujoBonistaCero = 0;
    var flujoEmisorCero = 0;
    var flujoEmisorCEscudoCero = 0;
    var arrFlujoEmisor: number[] = [];
    var arrFlujosEmisorEscudo = [];
    var arrFlujosBonista = [];

    for (let i = 0; i < totalPeriodos +1; i++) {
      var flujo: Flujo;
      flujo = new Flujo;
      flujo.numero = i;
      if(flujo.numero == 0){
        var date = new Date(bonoFechaDate.setDate(bonoFechaDate.getDate()));
        flujo.inflacionPeriodo = null;
        flujo.plazoGracia = null;
        flujo.bono = null;
        flujo.bonoIndexado = null;
        flujo.cuponInteres = null;
        flujo.cuota = null;
        flujo.amort = null;
        flujo.prima = null;
        flujo.escudo = null;
        flujo.flujoEmisor = this.getFlujoEmisor(bono, flujo.numero, flujo.cuota, flujo.prima);
        flujo.flujoEmisorString = this.ToStringFinancial(flujo.flujoEmisor);
        flujoEmisorCero = Number(flujo.flujoEmisor);

        flujo.flujoEmisorCEscudo = this.getFlujoEmisorCEscudo(bono, flujo.numero, flujo.flujoEmisor, flujo.escudo);
        flujo.flujoEmisorCEscudoString = this.ToStringFinancial(flujo.flujoEmisorCEscudo);
        flujoEmisorCEscudoCero = Number(flujo.flujoEmisorCEscudo);

        flujo.flujoBonista = this.getFlujoBonista(bono, flujo.flujoEmisorCEscudo, flujo.numero);
        flujo.flujoBonistaString = this.ToStringFinancial(flujo.flujoBonista);
        flujoBonistaCero = Number(flujo.flujoBonista);
        arrFlujoEmisor.push((Number(flujo.flujoEmisor)));
        arrFlujosEmisorEscudo.push(flujo.flujoEmisorCEscudo);
        arrFlujosBonista.push(flujo.flujoBonista);

      }
      if(flujo.numero > 0){
        var date = new Date(bonoFechaDate.setDate(bonoFechaDate.getDate()+frecuencia));
      }
      console.log(date);
      flujo.fechaPago = this.getFormattedDate(date);
      flujo.inflacionAnual = this.getInflationXYear(date, arrInflations);
      flujo.inflacionPeriodo = this.getInflation(date, arrInflations, frecuencia, Number(bono.diasXAno));
      

      if(flujo.numero >= 1){

        flujo.plazoGracia = this.getPlazoGracia((Number(flujo.numero)), arrGracePeriods);
        if(flujo.inflacionAnual){
          flujo.inflacionAnualString = flujo.inflacionAnual.toFixed(2) + '%'; 
        }
        if(flujo.inflacionPeriodo){
          flujo.inflacionPeriodoString = flujo.inflacionPeriodo.toFixed(3)+ '%';
  
        }
        if( typeof flujo.inflacionAnual == 'undefined'){
          flujo.inflacionAnualString = '0.00%';
        }
        if( typeof flujo.inflacionPeriodo == 'undefined'){
          flujo.inflacionPeriodoString = '0.00%';
        }

        flujo.bono = bono.valorNominal;
          
          if(flujo.numero > 1){
            if(flujito[i-1].plazoGracia == 'S' || flujito[i-1].plazoGracia == 'P'){
              flujo.bono = Number(flujito[i-1].bonoIndexado) + Number(flujito[i-1].amort);
            }
            if(flujito[i-1].plazoGracia == 'T'){
              flujo.bono = Number(flujito[i-1].bonoIndexado) - Number(flujito[i-1].cuponInteres);
          }   
        }

        flujo.bonoIndexado = Number(flujo.bono)*(1+Number(flujo.inflacionPeriodo));
        flujo.cuponInteres = (Number(-flujo.bonoIndexado))*(tasaEfectivaPeriodo);
        flujo.amort = this.getAmortAleman(flujo.plazoGracia, flujo.numero, totalPeriodos, flujo.bonoIndexado);
        flujo.cuota = this.getCuotaAleman(flujo.plazoGracia, flujo.numero, flujo.cuponInteres, flujo.amort);
        flujo.prima = this.getPrima(flujo.numero, totalPeriodos, bono, flujo.bonoIndexado);
        flujo.escudo = this.getEscudo(flujo.numero, flujo.cuponInteres, bono);
        flujo.flujoEmisor = this.getFlujoEmisor(bono, flujo.numero, flujo.cuota, flujo.prima);
        flujo.flujoEmisorCEscudo = this.getFlujoEmisorCEscudo(bono, flujo.numero, flujo.flujoEmisor, flujo.escudo);
        flujo.flujoBonista = this.getFlujoBonista(bono, flujo.flujoEmisor, flujo.numero);
        if(isFinite(Number(flujo.flujoEmisor))){
          arrFlujoEmisor.push(Number(flujo.flujoEmisor.toFixed(2)));
          // arrFlujoEmisor.push(Number(((Number(flujo.flujoEmisor.toFixed(2)))*100).toFixed()));

        }
        if(isFinite(Number(flujo.flujoEmisorCEscudo))){
          arrFlujosEmisorEscudo.push(Number(flujo.flujoEmisorCEscudo.toFixed(2)));
        }
        if(isFinite(Number(flujo.flujoBonista))){
          arrFlujosBonista.push(Number(flujo.flujoBonista.toFixed(2)));
        }
        // precioActual += (Number(flujo.flujoBonista)) / (1+cok);
        precioActual += (Number(flujo.flujoBonista)) / Math.pow((1+cok),Number(flujo.numero));

        this.fillFlujoStrings(flujo);

        //AMERICANO flujo.cuota = this.getCuota(flujo.plazoGracia, flujo.bonoIndexado, tasaEfectivaPeriodo, flujo.numero, totalPeriodos);
        // flujo.amort = 


        
      }

      if(flujo.numero == totalPeriodos){
        utilidadPerdida = precioActual + flujoBonistaCero;
        var IRR = this.IRRCalc(arrFlujoEmisor);
        var IRREsc = this.IRRCalc(arrFlujosEmisorEscudo);
        var IRRBon = this.IRRCalc(arrFlujosBonista);

        var tceaEmisor = (Math.pow((IRR+1), (Number(bono.diasXAno)/frecuencia)))-1;
        var tceaEmisorCEscudo = (Math.pow((IRREsc+1), (Number(bono.diasXAno)/frecuencia)))-1;
        var treaBonista = (Math.pow((IRRBon+1), (Number(bono.diasXAno)/frecuencia)))-1;

        this.getTceaParameters(tcea, frecuencia, this.getDiasCapi(bono.capitalizacion), nroPeriodosXAno, totalPeriodos, Number(tasaEfectivaAnual), tasaEfectivaPeriodo,
        cok, costeInicialesEmisor, costeInicialesBonista, precioActual, utilidadPerdida, tceaEmisor, tceaEmisorCEscudo, treaBonista);
        console.log(IRR);
      }

      
      flujito.push(flujo);
    }

    // this.getTceaParameters(tc)

    return flujito;

  }

}
