import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MultiFactorAuthComponent } from './multi-factor-auth/multi-factor-auth.component';
import { WeatherComponent } from './weather/weather.component';
import { RegisterComponent } from './register/register.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { RegistrationSuccessComponent } from './registration-success/registration-success.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'mfa', component:MultiFactorAuthComponent},
  {path: '', redirectTo:"/home",pathMatch:'full'},
  { path: 'weather', component: WeatherComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'preferences', component: PreferencesComponent },
  { path: 'registration-success', component: RegistrationSuccessComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
