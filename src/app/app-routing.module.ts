import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AracComponent } from './components/arac/arac.component';
import { GuzergahComponent } from './components/guzergah/guzergah.component';
import { LoginComponent } from './components/login/login.component';
import { SoforComponent } from './components/sofor/sofor.component';
import { UserComponent } from './components/user/user.component';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'araclar', component: AracComponent, canActivate: [LoginGuard] },
  {
    path: 'guzergahlar',
    component: GuzergahComponent,
    canActivate: [LoginGuard],
  },
  { path: 'soforler', component: SoforComponent, canActivate: [LoginGuard] },
  { path: 'users', component: UserComponent, canActivate: [LoginGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
