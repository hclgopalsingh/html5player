import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragulaModule } from 'ng2-dragula';
import { Ntemplate1Component } from './Ntemplate1/Ntemplate1.component';
import { ElementaryRoutingModule } from './ele-routing.module';

 
@NgModule({
  imports: [
    CommonModule,
    ElementaryRoutingModule,
    DragulaModule.forRoot()
  ],
  declarations: [
  Ntemplate1Component
  ],
  providers: []
})
export class ElementaryModule { }
