import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragulaModule } from 'ng2-dragula';
import { Template15Component } from './template15/template15.component';
import { Template1Component } from './template1/template1.component';
import { Template2Component } from './template2/template2.component';
import { Template3Component } from './template3/template3.component';
import { Template6Component } from './template6/template6.component';
import { Template4Component } from './template4/template4.component';
import { ShowanswerComponent } from '../Global/showanswer/showanswer.component';
import { DataService } from '../../common/services/eva/template8/data.service';
import { GlobalspeakerComponent } from '../Global/globalspeaker/globalspeaker.component';
import { FormsModule } from '@angular/forms';
import { Template5Component } from './template5/template5.component';
import { EncodeUriPipe } from '../../common/encode_uri.pipe';
import { EvaRoutingModule } from './eva-routing.module';
import { Template8Component } from './template8/template8.component';
import { QuestionBlockComponent } from './template8/question-block/question-block.component';
import { InstructionBarComponent } from './template8/instruction-bar/instruction-bar.component';
import { TemplateSevenComponent } from './template7/template7.component';
import { Template9Component } from './template9/template9.component';
import { TemplateTenComponent } from './template10/template10.component';
import { Template11Component } from './template11/template11.component';
import { Template12Component } from './template12/template12.component';
import { TemplateFourteenComponent } from './template14/template14.component';
import { ConfirmationComponent } from '../Global/confirmation/confirmation.component';
@NgModule({
  imports: [
	CommonModule,
	FormsModule,
	EvaRoutingModule,
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
		Template9Component,
		TemplateTenComponent,
		ShowanswerComponent,
		Template11Component,
		Template12Component,
		GlobalspeakerComponent,
		TemplateFourteenComponent,
		ConfirmationComponent,
		TemplateSevenComponent,
		Template5Component,
		EncodeUriPipe
  ],
  providers: [DataService]
})
export class EvaModule { }
