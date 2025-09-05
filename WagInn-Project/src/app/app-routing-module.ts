import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HostRegistration } from './components/host-registration/host-registration';

const routes: Routes = [{ path: '', component: HostRegistration }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
