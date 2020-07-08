import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
// import {} from ''

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public authService: AuthService) {}
}
