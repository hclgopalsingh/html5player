import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Template1Component } from './template1/template1.component';
import { Template2Component } from './template2/template2.component';
import { Template3Component } from './template3/template3.component';
import { Template4Component } from './template4/template4.component';
import { Template5Component } from './template5/template5.component';
import { Template6Component } from './template6/template6.component';
import { Template7Component } from './template7/template7.component';
import { Template8Component } from './template8/template8.component';
import { Template9Component } from './template9/template9.component';
import { Template10Component } from './template10/template10.component';
import { Template11Component } from './template11/template11.component';
import { Template12Component } from './template12/template12.component';
import { Template13Component } from './template13/template13.component';
import { Template14Component } from './template14/template14.component';
import { Template15Component } from './template15/template15.component';
import { Template16Component } from './template16/template16.component';

const routes: Routes = [
  { path: 'tempone', component: Template1Component, runGuardsAndResolvers: 'always' },
  { path: 'temponeext', component: Template1Component, runGuardsAndResolvers: 'always' },
  { path: 'temptwo', component: Template2Component, runGuardsAndResolvers: 'always' },
  { path: 'temptwoext', component: Template2Component, runGuardsAndResolvers: 'always' },
  { path: 'tempthree', component: Template3Component, runGuardsAndResolvers: 'always' },
  { path: 'tempthreeext', component: Template3Component, runGuardsAndResolvers: 'always' },
  { path: 'tempfour', component: Template4Component, runGuardsAndResolvers: 'always' },
  { path: 'tempfourext', component: Template4Component, runGuardsAndResolvers: 'always' },
  { path: 'tempfive', component: Template5Component, runGuardsAndResolvers: 'always' },
  { path: 'tempfiveext', component: Template5Component, runGuardsAndResolvers: 'always' },
  { path: 'tempsix', component: Template6Component, runGuardsAndResolvers: 'always' },
  { path: 'tempsixext', component: Template6Component, runGuardsAndResolvers: 'always' },
  { path: 'tempseven', component: Template7Component, runGuardsAndResolvers: 'always' },
  { path: 'tempsevenext', component: Template7Component, runGuardsAndResolvers: 'always' },
  { path: 'tempeight', component: Template8Component, runGuardsAndResolvers: 'always' },
  { path: 'tempeightext', component: Template8Component, runGuardsAndResolvers: 'always' },
  { path: 'tempnine', component: Template9Component, runGuardsAndResolvers: 'always' },
  { path: 'tempnineext', component: Template9Component, runGuardsAndResolvers: 'always' },
  { path: 'tempten', component: Template10Component, runGuardsAndResolvers: 'always' },
  { path: 'temptenext', component: Template10Component, runGuardsAndResolvers: 'always' },
  { path: 'temp11', component: Template11Component, runGuardsAndResolvers: 'always' },
  { path: 'temp11ext', component: Template11Component, runGuardsAndResolvers: 'always' },
  { path: 'temptwelve', component: Template12Component, runGuardsAndResolvers: 'always' },
  { path: 'temptwelveext', component: Template12Component, runGuardsAndResolvers: 'always' },
  { path: 'temp13', component: Template13Component, runGuardsAndResolvers: 'always' },
  { path: 'temp13ext', component: Template13Component, runGuardsAndResolvers: 'always' },
  { path: 'temp14', component: Template14Component, runGuardsAndResolvers: 'always' },
  { path: 'temp14ext', component: Template14Component, runGuardsAndResolvers: 'always' },
  { path: 'tempfifteen', component: Template15Component, runGuardsAndResolvers: 'always' },
  { path: 'tempfifteenext', component: Template15Component, runGuardsAndResolvers: 'always' },
  { path: 'temp16', component: Template16Component, runGuardsAndResolvers: 'always' },
  { path: 'temp16ext', component: Template16Component, runGuardsAndResolvers: 'always' },

 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  
  exports: [RouterModule]  
})
export class BKRoutingModule { }
