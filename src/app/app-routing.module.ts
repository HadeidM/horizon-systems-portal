import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MultiFactorAuthComponent } from './multi-factor-auth/multi-factor-auth.component'; // Import the new component

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'multi-factor-auth', component: MultiFactorAuthComponent }, // Add this route
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
