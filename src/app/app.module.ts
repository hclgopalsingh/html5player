import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SignalrCustomModule } from './modules/signalr';
import { AppRoutingModule } from './modules/routing';
import { NouisliderModule } from 'ng2-nouislider';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

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
import { SharedserviceService } from './services/sharedservice.service';
import { CommonloaderService } from './model/commonloader.service';
import { DataloaderService } from './model/dataloader.service';
import { HttphandlerService } from './model/httphandler.service';
import { ControlsComponent } from './controller/controls';
import { LoaderComponent } from './controller/loader.component';
import { Phase3T01V01 } from './controller/phase3/template01/variant01.component';
import { Ntemplate23_1 } from './controller/Ntemplate23_1.component';
import { Ntemplate18_1 } from './controller/Ntemplate18_1.component';
import { Ntemplate19 } from './controller/Ntemplate19.component';
import { Ntemplate21 } from './controller/Ntemplate21.component';
import { NTitleComponent } from './controller/NTitle.component';
import { QuesController } from './controller/quesController.component'
import { AnimationComponent } from './controller/animation.component'
import { InactivityTimerComponent } from './controller/inactivity-timer-component'
import { Ntemplate10 } from './modules/Elementary/Ntemplate10/Ntemplate10.component';
import { Ntemplate11 } from './controller/Ntemplate11.component';
import { Ntemplate17Component } from './modules/Elementary/Ntemplate17/Ntemplate17.component';
import { Ntemplate17_1 } from './controller/Ntemplate17_1.component';
import { Ntemplate12 } from './controller/Ntemplate12.component';
import { Ntemplate16 } from './controller/Ntemplate16.component';
import { Ntemplate23 } from './controller/Ntemplate23.component';
import { Ntemplate15 } from './controller/Ntemplate15.component';
import { Ntemplate22 } from './controller/Ntemplate22.component';
import { Ntemplate14 } from './controller/Ntemplate14.component';
import { NtemplateMap } from './controller/NtemplateMap.component';
import { EvaModule } from './modules/EVA/eva.module';
import { ElementaryModule } from './modules/Elementary/elementary.module';




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
		Ntemplate23_1,
		Ntemplate18_1,
		Ntemplate19,
		Ntemplate21,
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
		Ntemplate17Component,
		Ntemplate17_1,
		NtemplateMap
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
		EvaModule,
		ElementaryModule
	],
	providers: [DataloaderService, ApplicationmodelService, CommonloaderService, HttphandlerService, SharedserviceService],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor(appModel: ApplicationmodelService) { }
}
