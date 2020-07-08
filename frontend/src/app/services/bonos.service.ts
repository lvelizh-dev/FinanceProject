import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Bono } from '../models/bono';
import { BehaviorSubject, Subject } from 'rxjs';
import { Flujo, TCEA } from '../models/flujo';
import { Config } from '../models/config';
import { ConfigService } from '../services/config.service';
import { Inflation } from '../models/inflation';
import { GracePeriod } from '../models/grace-period';


@Injectable({
  providedIn: 'root'
})
export class BonosService {
  private messageSource = new BehaviorSubject<string>("default message");
  currentMessage = this.messageSource.asObservable();
  private flujosSource = new BehaviorSubject<Flujo[]>([]);
  currentFlujos = this.flujosSource.asObservable();
  private tceaSource = new BehaviorSubject<TCEA>(new TCEA);
  currentTcea = this.tceaSource.asObservable();
  ///////bono, config, inflaciones y plazosGracia que se pasarán
  private bonoSource = new BehaviorSubject<Bono>(new Bono);
  currentBono = this.bonoSource.asObservable();
  private configSource = new BehaviorSubject<Config>(new Config);
  currentConfig = this.configSource.asObservable();
  private inflationsSource = new BehaviorSubject<Inflation[]>([]);
  currentInflations = this.inflationsSource.asObservable();
  private gracePeriodsSource = new BehaviorSubject<GracePeriod[]>([]);
  currentGracePeriods = this.gracePeriodsSource.asObservable();

  selectedBono: Bono;
  bonos: Bono[];
  private URL = 'http://localhost:3001/api/bonos';
  private URL2 = 'http://localhost:3001/api/bonos/getByBonista';

  
  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.selectedBono = new Bono();
  }

  changeBono(bono: Bono){
    this.bonoSource.next(bono);
  }

  changeInflations(inflations: Inflation[]){
    
    this.inflationsSource.next(inflations);
  }

  changeGracePeriods(gracePeriods: GracePeriod[]){
    this.gracePeriodsSource.next(gracePeriods);
  }

  

  changeMessage(message: string){
    this.messageSource.next(message);
  }

  changeConfig(config: Config){
    this.configSource.next(config);
  }

  changeGetConfig(user_id: string){
    this.configService.getConfigsByUserID(user_id).subscribe(res => {
      this.configService.configs = res as Config[];
      console.log(this.configService.configs);
      this.configSource.next(this.configService.configs[0]);
    })
   
  }

  changeFlujos(flujos: Flujo[]){
    this.flujosSource.next(flujos);
  }

  changeTCEA(tcea: TCEA){
    this.tceaSource.next(tcea);
  }

  // getBonos() {
  //   return this.http.get(this.URL);
  // }

  getBonosByUserID(user_id: string) {
    console.log(user_id);
    return this.http.get(this.URL,{"params":{"user_id":user_id}});
  }

  getBonosByBonistaID(user_id: string) {
    console.log(user_id);
    return this.http.get(this.URL2,{"params":{"user_id":user_id}});
  }

  postBono(bono: Bono) {
    return this.http.post<any>(this.URL, bono);
  }

  putBono(bono: Bono){
    return this.http.put(this.URL + `/${bono._id}`, bono);
  }

  deleteBono(_id: string){
    return this.http.delete(this.URL +`/${_id}`);
  }



}
