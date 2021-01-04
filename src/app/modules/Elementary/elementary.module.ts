import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragulaModule } from 'ng2-dragula';
import { ElementaryRoutingModule } from './ele-routing.module';
import { NTemplate10Component } from './ntemplate10/ntemplate10.component';
import { NTemplate5Component } from './ntemplate5/ntemplate5.component';
import { NTemplate3Component } from './ntemplate3/ntemplate3.component';
import { NTemplate1Component } from './ntemplate1/ntemplate1.component';
import { NTemplate2Component } from './ntemplate2/ntemplate2.component';
import { NTemplate13Component } from './ntemplate13/ntemplate13.component';
import { NTemplate6Component } from './ntemplate6/ntemplate6.component';
import { NTemplate4Component } from './ntemplate4/ntemplate4.component';
import { NTemplate7Component } from './ntemplate7/ntemplate7.component';
import { NTemplate9Component } from './ntemplate9/ntemplate9.component';
import { NTemplate8Component } from './ntemplate8/ntemplate8.component';

 
@NgModule({
  imports: [
    CommonModule,
    ElementaryRoutingModule,
    DragulaModule.forRoot()
  ],
  declarations: [
    NTemplate3Component,
  NTemplate10Component,
  NTemplate5Component,
  NTemplate1Component,
  NTemplate2Component,
  NTemplate13Component,
  NTemplate6Component,
  NTemplate4Component,
  NTemplate7Component,
  NTemplate9Component,
  NTemplate8Component
  ],
  providers: []
})
export class ElementaryModule { }
