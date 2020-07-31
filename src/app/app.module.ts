import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SignalrCustomModule } from './modules/signalr';
import { AppRoutingModule } from './modules/routing';
import { NouisliderModule } from 'ng2-nouislider';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { DragulaModule } from 'ng2-dragula';

import { AppComponent } from './app.component';
import { ContainerComponent } from './controller/container.component';
import { VideoComponent } from './controller/video.component';
import { TemplatefourComponent } from './controller/templatefour.component';
import { TemplatefiveComponent } from './controller/templatefive.component';
import { TemplatethreeComponent } from './controller/template3.component';
import { Template7Component } from './controller/template7.component';
import { TemplatetwoComponent } from './controller/templatetwo.component';
import { TemplateeightComponent } from './controller/templateeight.component';
import { Template10Component } from './controller/template10.component';
import { Template11Component } from './controller/template11.component';
import { Template12Component } from './controller/template12.component';
import { Template14Component } from './controller/template14.component';
import { TemplatenineComponent } from './controller/templatenine.component';
import { TemplatefifteenComponent } from './controller/templatefifteen.component';
import { TemplatesixComponent } from './controller/templatesix.component';
import { TemplateoneComponent } from './controller/templateone.component';
import { TemplatethirteenComponent } from './controller/templatethirteen.component';
import { Template16Component } from './controller/template16.component';
import { ApplicationmodelService } from './model/applicationmodel.service';
import { CommonloaderService } from './model/commonloader.service';
import { DataloaderService } from './model/dataloader.service';
import { HttphandlerService } from './model/httphandler.service'
import { ControlsComponent } from './controller/controls';
import { LoaderComponent } from './controller/loader.component';
import { Phase3T01V01 } from './controller/phase3/template01/variant01.component';
import { Ntemplate2 } from './modules/Elementary/Ntemplate2/Ntemplate2.component';
import { Ntemplate8 } from './controller/Ntemplate8.component';
import { Ntemplate3 } from './modules/Elementary/Ntemplate3/Ntemplate3.component';
import { Ntemplate1 } from './controller/Ntemplate1.component';
import { Ntemplate4 } from './controller/Ntemplate4.component';
import { Ntemplate9 } from './controller/Ntemplate9.component';
import { Ntemplate6 } from './controller/Ntemplate6.component';
import { Ntemplate7 } from './controller/Ntemplate7.component';
import { Ntemplate5 } from './modules/Elementary/Ntemplate5/Ntemplate5.component';
import { Ntemplate23_1 } from './controller/Ntemplate23_1.component';
import { Ntemplate18 } from './controller/Ntemplate18.component';
import { Ntemplate18_1 } from './controller/Ntemplate18_1.component';
import { Ntemplate19 } from './controller/Ntemplate19.component';
import { Ntemplate24 } from './controller/Ntemplate24.component';
import { Ntemplate17 } from './controller/Ntemplate17.component';
import { Ntemplate21 } from './controller/Ntemplate21.component';
import { Ntemplate24_1 } from './controller/Ntemplate24_1.component'
import { Ntemplate20 } from './controller/Ntemplate20.component'
import { NTitleComponent } from './controller/NTitle.component';
import { QuesController } from './controller/quesController.component'
import { AnimationComponent } from './controller/animation.component'
import { InactivityTimerComponent } from './controller/inactivity-timer-component'
import { Ntemplate13 } from './controller/Ntemplate13.component';
import { Ntemplate10 } from './modules/Elementary/Ntemplate10/Ntemplate10.component';
import { Ntemplate11 } from './controller/Ntemplate11.component';
import { Ntemplate17_1 } from './controller/Ntemplate17_1.component';
import { Ntemplate12 } from './controller/Ntemplate12.component';
import { Ntemplate16 } from './controller/Ntemplate16.component';
import { Ntemplate23 } from './controller/Ntemplate23.component';
import { Ntemplate15 } from './controller/Ntemplate15.component';
import { Ntemplate22 } from './controller/Ntemplate22.component';
import { Ntemplate14 } from './controller/Ntemplate14.component';
import { NtemplateMap } from './controller/NtemplateMap.component';
import { Template15Component } from './modules/EVA/template15/template15.component';
import { SharedserviceService } from '../app/services/sharedservice.service';
import { Template3Component } from './modules/EVA/template3/template3.component';
import { Template1Component } from './modules/EVA/template1/template1.component';
import { Template8Component } from './modules/EVA/template8/template8.component';
import { QuestionBlockComponent } from './modules/EVA/template8/question-block/question-block.component';
import { InstructionBarComponent } from './modules/EVA/template8/instruction-bar/instruction-bar.component';
import { Template6Component } from './modules/EVA/template6/template6.component';
import { DataService } from './model/eva/template8/data.service';
import { Template2Component } from './modules/EVA/template2/template2.component';
import { Template4Component } from './modules/EVA/template4/template4.component';
import { TemplateTenComponent } from './modules/EVA/template10/template10.component';
import { ShowanswerComponent } from './modules/commonmodules/showanswer/showanswer.component';
import { Template11Componenteva } from './modules/EVA/template11/template11.component';


@NgModule({
	declarations: [
		AppComponent,
		ContainerComponent,
		VideoComponent,
		TemplatefourComponent,
		TemplatefiveComponent,
		TemplatethreeComponent,
		Template7Component,
		TemplatetwoComponent,
		Template10Component,
		TemplatetwoComponent,
		TemplatetwoComponent,
		TemplateeightComponent,
		TemplatenineComponent,
		TemplatesixComponent,
		TemplateoneComponent,
		Template11Component,
		TemplateoneComponent,
		TemplatefifteenComponent,
		Template14Component,
		TemplatethirteenComponent,
		Template12Component,
		Template16Component,
		ControlsComponent,
		LoaderComponent,
		Phase3T01V01,
		Ntemplate2,
		Ntemplate5,
		Ntemplate23_1,
		Ntemplate8,
		Ntemplate3,
		Ntemplate1,
		Ntemplate4,
		Ntemplate9,
		Ntemplate6,
		Ntemplate7,
		Ntemplate18,
		Ntemplate17,
		Ntemplate24,
		Ntemplate18_1,
		Ntemplate19,
		Ntemplate21,
		Ntemplate24_1,
		Ntemplate13,
		Ntemplate20,
		Ntemplate10,
		Ntemplate11,
		Ntemplate12,
		Ntemplate16,
		Ntemplate23,
		Ntemplate15,
		Ntemplate22,
		Ntemplate14,
		NTitleComponent,
		QuesController,
		InactivityTimerComponent,
		AnimationComponent,
		Ntemplate17_1,
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
		NtemplateMap,
		ShowanswerComponent,
		Template11Componenteva
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		AppRoutingModule,
		FormsModule,
		SignalrCustomModule.forRoot(),
		NouisliderModule,
		NgxPaginationModule,
		DragulaModule.forRoot()
	],
	providers: [DataloaderService, ApplicationmodelService, CommonloaderService, HttphandlerService, SharedserviceService, DataService],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor(appModel: ApplicationmodelService) { }
}
