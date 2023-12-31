import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MultiFactorAuthComponent } from './multi-factor-auth/multi-factor-auth.component';
import { RegisterComponent } from './register/register.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { RegistrationSuccessComponent } from './registration-success/registration-success.component';
import { AuthGuard } from './auth.guard';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetComponent } from './reset/reset.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'mfa', component:MultiFactorAuthComponent},
  {path: '', redirectTo:"/home",pathMatch:'full'},
  { path: 'register', component: RegisterComponent },
  { path: 'preferences', component: PreferencesComponent, canActivate: [AuthGuard]},
  { path: 'registration-success', component: RegistrationSuccessComponent },
  { path: 'reset', component:ResetComponent},
  { path: 'password-reset', component:ResetPasswordComponent},
  {path: 'user-profile', component: UserProfileComponent}

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
