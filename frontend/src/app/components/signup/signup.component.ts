import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  user = {
    email: '',
    password: '',
    userType: '1'
  }

  constructor(
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit(): void {
  }



  signUp(){
    // console.log(this.user);
    this.authService.signUp(this.user)
    .subscribe(
      res=> {
        console.log(res.token);
        localStorage.setItem('token',res.token);
        localStorage.setItem('u_id',res.u_id);
        localStorage.setItem('u_Type',res.u_Type);
        console.log(localStorage.getItem('u_id'));
        console.log(localStorage.getItem('u_Type'));
        this.router.navigate(['/bonos']);
      },
      err => console.log(err)
    )
  }

}
