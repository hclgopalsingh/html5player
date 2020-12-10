import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Ntemplate3 } from './Ntemplate3/Ntemplate3.component';
const routes: Routes = [
  { path: 'ntemp3', component: Ntemplate3, runGuardsAndResolvers: 'always'},
  { path: 'ntemp3ext', component: Ntemplate3, runGuardsAndResolvers: 'always'}
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  
  exports: [RouterModule]  
})
export class ElementaryRoutingModule { }
