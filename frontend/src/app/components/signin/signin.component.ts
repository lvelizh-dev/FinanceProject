import { Component, OnInit } from '@angular/core';
import { AuthService} from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  userError = '';

user = {
  email: '',
  password: ''
}

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  signIn(){
    console.log(this.user);
    this.authService.signIn(this.user)
    .subscribe(
      res => {
        console.log(res);
        console.log(res.token);
        localStorage.setItem('token',res.token);
        localStorage.setItem('u_id',res.u_id);
        localStorage.setItem('u_Type',res.u_Type);
        console.log(localStorage.getItem('u_id'));
        console.log(localStorage.getItem('u_Type'));
        console.log(this.authService.getToken());
        this.router.navigate(['/bonos']);
      },
      err => this.userError = err.error
      
    )
    console.log(this.userError);
  }


}
