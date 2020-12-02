import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Ntemplate1Component } from './Ntemplate1/Ntemplate1.component';
const routes: Routes = [
  { path: 'ntemp1', component: Ntemplate1Component, runGuardsAndResolvers: 'always' , data :{ TemplateType:'EVA'}},
  { path: 'ntemp1ext', component: Ntemplate1Component, runGuardsAndResolvers: 'always', data :{ TemplateType:'EVA'}}
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  
  exports: [RouterModule]  
})
export class ElementaryRoutingModule { }
