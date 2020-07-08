import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  users: User[];
  private URL = 'http://localhost:3001/api';
  private URL2 = 'http://localhost:3001/api/users/getByType';


  constructor(private http: HttpClient, private router: Router) { }



  signUp(user){
    return this.http.post<any>(this.URL + '/users/signup', user);
  }

  signIn(user){
    return this.http.post<any>(this.URL + '/users/signin', user);
  }

  loggedIn() {
    /////////doble signo admiracion devuelve true si existe o false si no
    return !!localStorage.getItem('token');

    }

    getUsersByType(user1: User) {
      console.log(user1);
      // return this.http.get(this.URL2,{"params": {"userType":userType}});
      return this.http.post<any>(this.URL2, user1);
    }

    // updateManyGracePeriods(arrGracePeriods: GracePeriod[]){
    //   console.log(arrGracePeriods);
    //   this.http.post(this.URL2, arrGracePeriods)
    //   .subscribe(res => {
    //     console.log(res);
    //   })
    // }
    
    getUsers(){
      return this.http.get(this.URL + '/users');
    }
    // getBonosByUserID(user_id: string) {
    //   console.log(user_id);
    //   return this.http.get(this.URL,{"params":{"user_id":user_id}});
    // }
  


  getToken() {
      return localStorage.getItem('token');
    }

    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('u_id');
      localStorage.removeItem('u_Type');
      this.router.navigate(['/signin']);
    }

  }

