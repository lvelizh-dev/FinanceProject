import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { Config } from 'src/app/models/config';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {
  u_id = '';
  constructor(public configService: ConfigService) {
   }

  ngOnInit(): void {
    this.u_id = localStorage.getItem('u_id');
    // this.getConfigsByUserID()
    // .then( (c: any) => {

    // })
    this.getConfigsByUserID()
    .then(() => {
      console.log(this.configService.selectedConfig);
      this.configService.selectedConfig = new Config();

      if(this.configService.configs.length >0){
        this.configService.selectedConfig = this.configService.configs[0];
        console.log(this.configService.configs);

      }
    })

    // if(this.configService.configs.length >0){
    //   this.configService.selectedConfig = this.configService.configs[0];
    // }

    
  }

  getConfigsByUserID(){
    return new Promise((resolve,reject) => {
      console.log(this.u_id);
      console.log(this.configService.selectedConfig);
      this.configService.getConfigsByUserID(this.u_id)
      .subscribe(res => {
        console.log(res);
        this.configService.configs = res as Config[];
        console.log(this.configService.configs);
        resolve(this.configService.configs);
      });
    })
   

  }

  editConfig(config: Config){
    this.configService.selectedConfig = config;
    console.log(this.configService.selectedConfig);
  }

  addEditConfig(form: NgForm){
    console.log(form.value._id);
    form.value.user_id = this.u_id;
    if(form.value._id){
      this.configService.putConfig(form.value)
      .subscribe(res => {
        this.getConfigsByUserID();
        console.log(res);
        console.log('updated');
      })
    }
    else{
      console.log(form.value);
      this.configService.postConfig(form.value)
      .subscribe(res => {
        this.getConfigsByUserID();
        console.log(res);
        console.log('added');
      })
    }
  }

  // addBono(form: NgForm){
  //   form.value.user_id = this.u_id;

  //   if(form.value._id){
  //     this.bonosService.putBono(form.value)
  //     .subscribe(res => {
  //       this.resetForm(form);
  //       this.getBonosByUserID();
  //       console.log(res);
  //       console.log('updated');
  //     })
  //   }
  //   else {
  //     console.log(form.value);
  //     this.bonosService.postBono(form.value)
  //     .subscribe(res => {
  //       this.resetForm(form);
  //       this.getBonosByUserID();
  //       console.log(res);
  //       console.log('added');
  //       ////navigate to calculo
  //     })
  //   }
  // }


}
