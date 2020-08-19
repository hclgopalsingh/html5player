import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragulaModule } from 'ng2-dragula';
import { Ntemplate6 } from './Ntemplate6/Ntemplate6.component';

 
@NgModule({
  imports: [
    CommonModule,
    DragulaModule.forRoot()
  ],
  declarations: [
	Ntemplate6 
  ],
  providers: []
})
export class ElementaryModule { }
