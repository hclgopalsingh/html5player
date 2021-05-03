import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NTemplate1Component } from './ntemplate1/ntemplate1.component';
import { NTemplate2Component } from './ntemplate2/ntemplate2.component';
import { NTemplate3Component } from './ntemplate3/ntemplate3.component';
import { NTemplate10Component } from './ntemplate10/ntemplate10.component';
import { NTemplate5Component } from './ntemplate5/ntemplate5.component';
import { NTemplate13Component } from './ntemplate13/ntemplate13.component';
import { NTemplate6Component } from './ntemplate6/ntemplate6.component';
import { NTemplate4Component } from './ntemplate4/ntemplate4.component';
import { NTemplate7Component } from './ntemplate7/ntemplate7.component';
import { NTemplate9Component } from './ntemplate9/ntemplate9.component';
import { NTemplate8Component } from './ntemplate8/ntemplate8.component';
import { Ntemplate12Component } from './ntemplate12/ntemplate12.component';
import { Ntemplate23Component } from './Ntemplate23/Ntemplate23.component';
import { Ntemplate23_1Component } from './Ntemplate23_1/Ntemplate23_1.component';
import { Ntemplate15Component } from './Ntemplate15/Ntemplate15.component';
import { Ntemplate16Component } from './Ntemplate16/Ntemplate16.component';

const routes: Routes = [
  { path: 'ntemp3', component: NTemplate3Component, runGuardsAndResolvers: 'always'},
  { path: 'ntemp3ext', component: NTemplate3Component, runGuardsAndResolvers: 'always'},
  { path: 'ntemp10', component: NTemplate10Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp10ext', component: NTemplate10Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp1', component: NTemplate1Component, runGuardsAndResolvers: 'always'},
  { path: 'ntemp1ext', component: NTemplate1Component, runGuardsAndResolvers: 'always'},
  { path: 'ntemp2', component: NTemplate2Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp2ext', component: NTemplate2Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp5', component: NTemplate5Component, runGuardsAndResolvers: 'always'},
  { path: 'ntemp5ext', component: NTemplate5Component, runGuardsAndResolvers: 'always'},
  { path: 'ntemp13', component: NTemplate13Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp13ext', component: NTemplate13Component, runGuardsAndResolvers: 'always' },

  { path: 'ntemp6', component: NTemplate6Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp6ext', component: NTemplate6Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp4', component: NTemplate4Component, runGuardsAndResolvers: 'always'},
  { path: 'ntemp4ext', component: NTemplate4Component, runGuardsAndResolvers: 'always'},
  { path: 'ntemp7', component: NTemplate7Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp7ext', component: NTemplate7Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp9', component: NTemplate9Component, runGuardsAndResolvers: 'always'},
  { path: 'ntemp9ext', component: NTemplate9Component, runGuardsAndResolvers: 'always'},
  { path: 'ntemp8', component: NTemplate8Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp8ext', component: NTemplate8Component, runGuardsAndResolvers: 'always' },

  { path: 'ntemp12', component: Ntemplate12Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp12ext', component: Ntemplate12Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp15', component: Ntemplate15Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp15ext', component: Ntemplate15Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp16', component: Ntemplate16Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp16ext', component: Ntemplate16Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp23', component: Ntemplate23Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp23ext', component: Ntemplate23Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp23_1', component: Ntemplate23_1Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp23_1ext', component: Ntemplate23_1Component, runGuardsAndResolvers: 'always' },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  
  exports: [RouterModule]  
})
export class ElementaryRoutingModule { }
