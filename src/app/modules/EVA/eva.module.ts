import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragulaModule } from 'ng2-dragula';
import { Template15Component } from './template15/template15.component';
import { Template3Component } from './template3/template3.component';
import { Template1Component } from './template1/template1.component';
import { Template8Component } from './template8/template8.component';
import { QuestionBlockComponent } from './template8/question-block/question-block.component';
import { InstructionBarComponent } from './template8/instruction-bar/instruction-bar.component';
import { Template6Component } from './template6/template6.component';
import { Template2Component } from './template2/template2.component';
import { Template4Component } from './template4/template4.component';
import { TemplateTenComponent } from './template10/template10.component';
import { ShowanswerComponent } from '../commonmodules/showanswer/showanswer.component';
import { Template11Componenteva } from './template11/template11.component';
import { Template12ComponentEVA } from './template12/template12.component';
import { DataService } from '../../model/eva/template8/data.service';
import { GlobalspeakerComponent } from '../commonmodules/globalspeaker/globalspeaker.component';
import { TemplateFourteenComponent } from './template14/template14.component';
import { ConfirmationComponent } from '../commonmodules/confirmation/confirmation.component';
import { TemplateSevenComponent } from './template7/template7.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [
	CommonModule,
	FormsModule,
    DragulaModule.forRoot()
  ],
  declarations: [
    Template15Component,
		Template3Component,
		Template1Component,
		Template8Component,
		QuestionBlockComponent,
		InstructionBarComponent,
		Template6Component,
		Template2Component,
		Template4Component,
		TemplateTenComponent,
		ShowanswerComponent,
		Template11Componenteva,
		Template12ComponentEVA,
		GlobalspeakerComponent,
		TemplateFourteenComponent,
		ConfirmationComponent,
		TemplateSevenComponent
  ],
  providers: [DataService]
})
export class EvaModule { }
