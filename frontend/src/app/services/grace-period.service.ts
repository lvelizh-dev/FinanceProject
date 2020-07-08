import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GracePeriod } from '../models/grace-period';

@Injectable({
  providedIn: 'root'
})
export class GracePeriodService {
  gracePeriods: GracePeriod[];
  private URL = 'http://localhost:3001/api/gracePeriods';
  private URL2 = 'http://localhost:3001/api/gracePeriods/updateManyGracePeriods';

  constructor(private http: HttpClient) { }

  getGracePeriodsByBonoID(bono_id: string) {
    console.log(bono_id);
    return this.http.get(this.URL,{"params":{"bono_id":bono_id}});
  }

  postGracePeriod(gracePeriod: GracePeriod) {
    return this.http.post(this.URL, gracePeriod);
  }

  putGracePeriod(gracePeriod: GracePeriod){
    return this.http.put(this.URL + `/${gracePeriod._id}`, gracePeriod);
  }

  deleteGracePeriod(_id: String){
    return this.http.delete(this.URL +`/${_id}`);
  }


  updateManyGracePeriods(arrGracePeriods: GracePeriod[]){
    console.log(arrGracePeriods);
    this.http.post(this.URL2, arrGracePeriods)
    .subscribe(res => {
      console.log(res);
    })
  }

}
