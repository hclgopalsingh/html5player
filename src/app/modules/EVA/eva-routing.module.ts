import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateTenComponent } from './template10/template10.component';
const routes: Routes = [
  { path: 'evatemp10', component: TemplateTenComponent, runGuardsAndResolvers: 'always' , data :{ TemplateType:'EVA'}},
  { path: 'evatemp10ext', component: TemplateTenComponent, runGuardsAndResolvers: 'always', data :{ TemplateType:'EVA'}},
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  
  exports: [RouterModule]  
})
export class EvaRoutingModule { }