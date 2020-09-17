import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragulaModule } from 'ng2-dragula';
import { Ntemplate2 } from './Ntemplate2/Ntemplate2.component';
import { Ntemplate3 } from './Ntemplate3/Ntemplate3.component';
import { Ntemplate4 } from './Ntemplate4/Ntemplate4.component';
import { Ntemplate5 } from './Ntemplate5/Ntemplate5.component';
import { Ntemplate6 } from './Ntemplate6/Ntemplate6.component';
import { Ntemplate7 } from './Ntemplate7/Ntemplate7.component';
import { Ntemplate8 } from './Ntemplate8/Ntemplate8.component';
import { Ntemplate13 } from './Ntemplate13/Ntemplate13.component';
import { Ntemplate1Component } from './Ntemplate1/Ntemplate1.component';
import { Ntemplate9Component } from './Ntemplate9/Ntemplate9.component';

 
@NgModule({
  imports: [
    CommonModule,
    DragulaModule.forRoot()
  ],
  declarations: [
  Ntemplate2,
  Ntemplate3,
  Ntemplate4,
  Ntemplate5,
  Ntemplate6,
  Ntemplate7,
  Ntemplate8,
  Ntemplate13,
  Ntemplate1Component,
	Ntemplate9Component
  ],
  providers: []
})
export class ElementaryModule { }
