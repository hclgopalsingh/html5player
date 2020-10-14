import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Template1Component } from './template1/template1.component';
import { Template2Component } from './template2/template2.component';
import { Template3Component } from './template3/template3.component';
import { Template4Component } from './template4/template4.component';
import { Template5Component } from './template5/template5.component';
import { Template6Component } from './template6/template6.component';
import { TemplateSevenComponent } from './template7/template7.component';
import { Template8Component } from './template8/template8.component';
import { Template9Component } from './template9/template9.component';
import { TemplateTenComponent } from './template10/template10.component';
import { Template11Component } from './template11/template11.component';
import { Template12Component } from './template12/template12.component';
import { TemplateFourteenComponent } from './template14/template14.component';
import { Template15Component } from './template15/template15.component';
const routes: Routes = [
  { path: 'evatemp1', component: Template1Component, runGuardsAndResolvers: 'always' , data :{ TemplateType:'EVA'}},
  { path: 'evatemp1ext', component: Template1Component, runGuardsAndResolvers: 'always', data :{ TemplateType:'EVA'}},
  { path: 'evatemp2', component: Template2Component, runGuardsAndResolvers: 'always' , data :{ TemplateType:'EVA'}},
  { path: 'evatemp2ext', component: Template2Component, runGuardsAndResolvers: 'always', data :{ TemplateType:'EVA'}},
  { path: 'evatemp3', component: Template3Component, runGuardsAndResolvers: 'always' , data :{ TemplateType:'EVA'}},
  { path: 'evatemp3ext', component: Template3Component, runGuardsAndResolvers: 'always', data :{ TemplateType:'EVA'}},
  { path: 'evatemp4', component: Template4Component, runGuardsAndResolvers: 'always' , data :{ TemplateType:'EVA'}},
  { path: 'evatemp4ext', component: Template4Component, runGuardsAndResolvers: 'always', data :{ TemplateType:'EVA'}},
  { path: 'evatemp5', component: Template5Component, runGuardsAndResolvers: 'always' , data :{ TemplateType:'EVA'}},
  { path: 'evatemp5ext', component: Template5Component, runGuardsAndResolvers: 'always', data :{ TemplateType:'EVA'}},
  { path: 'evatemp6', component: Template6Component, runGuardsAndResolvers: 'always' , data :{ TemplateType:'EVA'}},
  { path: 'evatemp6ext', component: Template6Component, runGuardsAndResolvers: 'always', data :{ TemplateType:'EVA'}},
  { path: 'evatemp7', component: TemplateSevenComponent, runGuardsAndResolvers: 'always' , data :{ TemplateType:'EVA'}},
  { path: 'evatemp7ext', component: TemplateSevenComponent, runGuardsAndResolvers: 'always', data :{ TemplateType:'EVA'}},
  { path: 'evatemp8', component: Template8Component, runGuardsAndResolvers: 'always' , data :{ TemplateType:'EVA'}},
  { path: 'evatemp8ext', component: Template8Component, runGuardsAndResolvers: 'always', data :{ TemplateType:'EVA'}},
  { path: 'evatemp9', component: Template9Component, runGuardsAndResolvers: 'always' , data :{ TemplateType:'EVA'}},
  { path: 'evatemp9ext', component: Template9Component, runGuardsAndResolvers: 'always', data :{ TemplateType:'EVA'}},
  { path: 'evatemp10', component: TemplateTenComponent, runGuardsAndResolvers: 'always' , data :{ TemplateType:'EVA'}},
  { path: 'evatemp10ext', component: TemplateTenComponent, runGuardsAndResolvers: 'always', data :{ TemplateType:'EVA'}},
  { path: 'evatemp11', component: Template11Component, runGuardsAndResolvers: 'always' , data :{ TemplateType:'EVA'}},
  { path: 'evatemp11ext', component: Template11Component, runGuardsAndResolvers: 'always', data :{ TemplateType:'EVA'}},
  { path: 'evatemp12', component: Template12Component, runGuardsAndResolvers: 'always' , data :{ TemplateType:'EVA'}},
  { path: 'evatemp12ext', component: Template12Component, runGuardsAndResolvers: 'always', data :{ TemplateType:'EVA'}},
  { path: 'evatemp14', component: TemplateFourteenComponent, runGuardsAndResolvers: 'always' , data :{ TemplateType:'EVA'}},
  { path: 'evatemp14ext', component: TemplateFourteenComponent, runGuardsAndResolvers: 'always', data :{ TemplateType:'EVA'}},
  { path: 'evatemp15', component: Template15Component, runGuardsAndResolvers: 'always' , data :{ TemplateType:'EVA'}},
  { path: 'evatemp15ext', component: Template15Component, runGuardsAndResolvers: 'always', data :{ TemplateType:'EVA'}}
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  
  exports: [RouterModule]  
})
export class EvaRoutingModule { }
