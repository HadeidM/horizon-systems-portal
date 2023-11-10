import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { InfoBoxComponent } from './info-box/info-box.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MultiFactorAuthComponent } from './multi-factor-auth/multi-factor-auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WeatherComponent } from './weather/weather.component';
import { RegisterComponent } from './register/register.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { RegistrationSuccessComponent } from './registration-success/registration-success.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    InfoBoxComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    MultiFactorAuthComponent,
    WeatherComponent,
    RegisterComponent,
    PreferencesComponent,
    RegistrationSuccessComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [NavbarComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
