import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NTitleComponent} from './modules/Global/ntitle/ntitle.component';
import { ContainerComponent} from './modules/Global/container/container.component';
import { TemplateTenComponent } from './modules/EVA/template10/template10.component';
import { TemplateFourteenComponent } from './modules/EVA/template14/template14.component';

export const APP_ROUTES: Routes = [ 
  {path: '', component: ContainerComponent, children: [
    { path: 'ntitle', component: NTitleComponent, runGuardsAndResolvers: 'always' },
    { path: 'ntitleext', component: NTitleComponent, runGuardsAndResolvers: 'always' },
    { path: 'EVA', loadChildren: () => import(`./modules/EVA/eva.module`).then(m => m.EvaModule) },  
  ]}
 ];

 @NgModule({
	imports: [RouterModule.forRoot(APP_ROUTES, { onSameUrlNavigation: 'reload' })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
