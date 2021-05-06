import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragulaModule } from 'ng2-dragula';
import { ElementaryRoutingModule } from './ele-routing.module';
import { FormsModule } from '@angular/forms';
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
import { Ntemplate17Component } from './ntemplate17/ntemplate17.component';
import { Ntemplate19Component } from './ntemplate19/ntemplate19.component';
import { Ntemplate11Component } from './ntemplate11/ntemplate11.component';
import { Ntemplate12Component } from './ntemplate12/ntemplate12.component';
import { Ntemplate23Component } from './Ntemplate23/Ntemplate23.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ntemplate23V1Component } from './Ntemplate23_1/Ntemplate23_1.component';
import { Ntemplate15Component } from './Ntemplate15/Ntemplate15.component';
import { Ntemplate16Component } from './Ntemplate16/Ntemplate16.component';
import { Ntemplate18Component } from './Ntemplate18/Ntemplate18.component';
import { Ntemplate18V1Component } from './Ntemplate18_1/Ntemplate18_1.component';
import { Ntemplate20Component } from './Ntemplate20/Ntemplate20.component';
import { Ntemplate24Component } from './ntemplate24/ntemplate24.component';
import { Ntemplate24V1Component } from './Ntemplate24_1/Ntemplate24_1.component';

 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
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
  NTemplate8Component,
  Ntemplate17Component,
  Ntemplate11Component,
  Ntemplate12Component,
  Ntemplate15Component,
  Ntemplate16Component,
  Ntemplate18Component,
  Ntemplate18V1Component,
  Ntemplate19Component,
  Ntemplate20Component,
  Ntemplate23Component,
  Ntemplate23V1Component,
  Ntemplate24Component,
  Ntemplate24V1Component
  ],
  providers: []
})
export class ElementaryModule { }
