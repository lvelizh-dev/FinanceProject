import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/////Components
import { BonosComponent } from './components/bonos/bonos.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';

import { AuthGuard } from './auth.guard';
import { ConfigComponent } from './components/config/config.component';
import { FlujoComponent } from './flujo/flujo.component';
import { ExtraComponent } from './extra/extra.component';



const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: '/bonos',
  //   pathMatch: 'full'
  // },
  {
    path: 'bonos',
  component: BonosComponent,
  canActivate: [AuthGuard]
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'signin',
    component: SigninComponent
  },
  {
    path: 'config',
    component: ConfigComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'flujo',
    component: FlujoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'extra',
    component: ExtraComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
