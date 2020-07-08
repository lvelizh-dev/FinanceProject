import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inflation } from '../models/inflation';

@Injectable({
  providedIn: 'root'
})
export class InflationService {
  inflations: Inflation[];
  private URL = 'http://localhost:3001/api/inflations';
  private URL2 = 'http://localhost:3001/api/inflations/getInflations';
  private URL3 = 'http://localhost:3001/api/inflations/updateManyInflations';



  constructor(private http: HttpClient) {
   }

   getInflationsByBonoID(bono_id: string) {
    console.log(bono_id);
    return this.http.get(this.URL,{"params":{"bono_id":bono_id}})
    // return this.http.get(this.URL2);
  }
  
  postInflation(inflation: Inflation) {
    return this.http.post(this.URL, inflation);
  }

  putInflation(inflation: Inflation){
    return this.http.put(this.URL + `/${inflation._id}`, inflation);
  }

  deleteInflation(_id: String){
    return this.http.delete(this.URL +`/${_id}`);
  }


  updateManyInflations(arrInflation: Inflation[]){
    console.log(arrInflation);
    this.http.post(this.URL3, arrInflation)
    .subscribe(res => {
      console.log(res);
    })
  }
}
