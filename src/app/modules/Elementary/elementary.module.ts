import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragulaModule } from 'ng2-dragula';
import { ElementaryRoutingModule } from './ele-routing.module';
import { Ntemplate3 } from './Ntemplate3/Ntemplate3.component';

 
@NgModule({
  imports: [
    CommonModule,
    ElementaryRoutingModule,
    DragulaModule.forRoot()
  ],
  declarations: [
  Ntemplate3
  ],
  providers: []
})
export class ElementaryModule { }
