import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from '../models/config';
import { ConfigComponent } from '../components/config/config.component';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  selectedConfig: Config;
  configs: Config[];
  private URL = 'http://localhost:3001/api/config';


  constructor(private http: HttpClient) {
    this.selectedConfig = new Config();
   }

   getConfigsByUserID(user_id: string) {
    console.log(user_id);
    return this.http.get(this.URL,{"params":{"user_id":user_id}});
  }

  postConfig(config: Config) {
    return this.http.post(this.URL, config);
  }

  putConfig(config: Config){
    return this.http.put(this.URL + `/${config._id}`, config);
  }




}
