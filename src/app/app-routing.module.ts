import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebrtcPageComponent } from './webrtc-pages/webrtc-page.component';


const routes: Routes = [{
  path: '',
  component: WebrtcPageComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
