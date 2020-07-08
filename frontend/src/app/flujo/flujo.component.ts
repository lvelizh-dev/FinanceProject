import { Component, OnInit } from '@angular/core';
import { Flujo, TCEA } from '../models/flujo';
import { BonosService } from '../services/bonos.service';
import { FlujoService } from '../services/flujo.service';
import { Bono } from '../models/bono';
import { Config } from '../models/config';
import { GracePeriod } from '../models/grace-period';
import { Inflation } from '../models/inflation';
import { config } from 'rxjs';

@Component({
  selector: 'app-flujo',
  templateUrl: './flujo.component.html',
  styleUrls: ['./flujo.component.css']
})
export class FlujoComponent implements OnInit {
  message: string;
  u_id: string;
  bono_id: string;
  flujos: Flujo[];
  bonoActual: Bono;
  configActual: Config;
  arrGracePeriod: GracePeriod[];
  arrInflations: Inflation[];
  coin: String;
  tcea: TCEA;

  constructor(private bonosService: BonosService,
    private flujoService: FlujoService) { }

  ngOnInit() {
    this.bono_id = localStorage.getItem('bono_id');
    this.u_id = localStorage.getItem('u_id');
    console.log(this.bono_id);
    console.log(this.u_id);
    this.bonosService.currentConfig.subscribe(config => this.configActual = config);
    console.log(this.configActual);
    if(this.configActual.coin == 'Euro'){
      // this.coin = '(Euros)'
            this.coin = '(€)'
      
    }
    if(this.configActual.coin == 'Sol'){
      this.coin = '(S/.)'
    }
    if(this.configActual.coin == 'Dólar americano'){
      this.coin = '($)'
    }
    this.bonosService.currentFlujos.subscribe(flujos => this.flujos = flujos);
    this.bonosService.currentTcea.subscribe(tcea => this.tcea = tcea);

    console.log(this.flujos);

  }


}
