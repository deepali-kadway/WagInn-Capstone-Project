import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { HostRegistration } from './components/host-registration/host-registration';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    App,
    HostRegistration,
    Header,
    Footer
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
