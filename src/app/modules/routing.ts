/**
 * Routing Module
 */
import { ContainerComponent } from '../controller/container.component';
import { VideoComponent } from '../controller/video.component';
import { TemplatefourComponent } from '../controller/templatefour.component';
import { TemplatefiveComponent } from '../controller/templatefive.component';
import { TemplatethreeComponent } from '../controller/template3.component';
import { Template7Component } from '../controller/template7.component';
import { TemplateeightComponent } from '../controller/templateeight.component';
import { TemplatetwoComponent } from '../controller/templatetwo.component';
import { TemplatenineComponent } from '../controller/templatenine.component';
import { TemplatefifteenComponent } from '../controller/templatefifteen.component';
import { Template10Component } from '../controller/template10.component';
import { TemplatesixComponent } from '../controller/templatesix.component';
import { TemplateoneComponent } from '../controller/templateone.component';
import { Template11Component } from '../controller/template11.component';
import { Template14Component } from '../controller/template14.component';
import { Template16Component } from '../controller/template16.component';
import { TemplatethirteenComponent } from '../controller/templatethirteen.component';
import {Template12Component} from '../controller/template12.component';
import {Ntemplate2} from '../controller/Ntemplate2.component';
import { Ntemplate18 } from '../controller/Ntemplate18.component';
import { Ntemplate18_1 } from '../controller/Ntemplate18_1.component';
import {Ntemplate8} from '../controller/Ntemplate8.component';
import { Ntemplate3 } from '../controller/Ntemplate3.component';
import { Ntemplate1 } from '../controller/Ntemplate1.component';
import {Ntemplate4} from '../controller/Ntemplate4.component';
import {Ntemplate5} from '../controller/Ntemplate5.component';
import {Ntemplate23_1} from '../controller/Ntemplate23_1.component';
import { Ntemplate6 } from '../controller/Ntemplate6.component';
import { Ntemplate9 } from '../controller/Ntemplate9.component';
import {Ntemplate7} from '../controller/Ntemplate7.component';
import {Ntemplate17} from '../controller/Ntemplate17.component';
import { Ntemplate24 } from '../controller/Ntemplate24.component';
import { Ntemplate24_1 } from '../controller/Ntemplate24_1.component';
import { Ntemplate19 } from '../controller/Ntemplate19.component';
import {Ntemplate21} from '../controller/Ntemplate21.component';
import { NTitleComponent} from '../controller/NTitle.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Phase3T01V01 } from '../controller/phase3/template01/variant01.component';
import { Ntemplate13 } from '../controller/Ntemplate13.component';
import { Ntemplate20 } from '../controller/Ntemplate20.component';
import { Ntemplate10 } from '../controller/Ntemplate10.component';
import { Ntemplate11 } from '../controller/Ntemplate11.component';
import { Ntemplate12 } from '../controller/Ntemplate12.component';
import { Ntemplate16 } from '../controller/Ntemplate16.component';
import { Ntemplate23 } from '../controller/Ntemplate23.component';
import { Ntemplate15 } from '../controller/Ntemplate15.component';
import { Ntemplate22 } from '../controller/Ntemplate22.component';
import { Ntemplate14 } from '../controller/Ntemplate14.component';

import {Template15Component } from '../modules/EVA/template15/template15.component';
import { Template3Component } from './EVA/template3/template3.component';
import { Template1Component } from '../modules/EVA/template1/template1.component';
import { Template8Component } from '../modules/EVA/template8/template8.component';
import { Template6Component } from '../modules/EVA/template6/template6.component';
import { Template2Component } from './EVA/template2/template2.component';
import { Template4Component } from './EVA/template4/template4.component';

export const APP_ROUTES: Routes = [
	{ path: '', component: ContainerComponent },
	{
		path: '', component: ContainerComponent, children: [
			{ path: '', redirectTo: 'tempfive', pathMatch: 'full' },
			{ path: 'tempfour', component: TemplatefourComponent, runGuardsAndResolvers: 'always' },
			{ path: 'tempfourext', component: TemplatefourComponent, runGuardsAndResolvers: 'always' },
			{ path: 'tempfive', component: TemplatefiveComponent, runGuardsAndResolvers: 'always' },
			{ path: 'tempseven', component: Template7Component, runGuardsAndResolvers: 'always' },
			{ path: 'tempsevenext', component: Template7Component, runGuardsAndResolvers: 'always' },
			{ path: 'tempfiveext', component: TemplatefiveComponent, runGuardsAndResolvers: 'always' },
			{ path: 'video', component: VideoComponent, runGuardsAndResolvers: 'always' },
			{ path: 'videoext', component: VideoComponent, runGuardsAndResolvers: 'always' },
			{ path: 'tempthree', component: TemplatethreeComponent, runGuardsAndResolvers: 'always' },
			{ path: 'tempthreeext', component: TemplatethreeComponent, runGuardsAndResolvers: 'always' },
			{ path: 'temptwo', component: TemplatetwoComponent, runGuardsAndResolvers: 'always' },
			{ path: 'temptwoext', component: TemplatetwoComponent, runGuardsAndResolvers: 'always' },
			{ path: 'tempnine', component: TemplatenineComponent, runGuardsAndResolvers: 'always' },
			{ path: 'tempnineext', component: TemplatenineComponent, runGuardsAndResolvers: 'always' },
			{ path: 'tempten', component: Template10Component, runGuardsAndResolvers: 'always' },
			{ path: 'temptenext', component: Template10Component, runGuardsAndResolvers: 'always' },
			{ path: 'tempsix', component: TemplatesixComponent, runGuardsAndResolvers: 'always' },
			{ path: 'tempsixext', component: TemplatesixComponent, runGuardsAndResolvers: 'always' },
			{ path: 'tempeight', component: TemplateeightComponent, runGuardsAndResolvers: 'always' },
			{ path: 'tempeightext', component: TemplateeightComponent, runGuardsAndResolvers: 'always' },
			{ path: 'tempone', component: TemplateoneComponent, runGuardsAndResolvers: 'always' },
			{ path: 'temponeext', component: TemplateoneComponent, runGuardsAndResolvers: 'always' },
			{ path: 'temp11', component: Template11Component, runGuardsAndResolvers: 'always' },
			{ path: 'temp11ext', component: Template11Component, runGuardsAndResolvers: 'always' },
			{ path: 'tempfifteen', component: TemplatefifteenComponent, runGuardsAndResolvers: 'always' },
			{ path: 'tempfifteenext', component: TemplatefifteenComponent, runGuardsAndResolvers: 'always' },
			{ path: 'temp14', component: Template14Component, runGuardsAndResolvers: 'always' },
			{ path: 'temp14ext', component: Template14Component, runGuardsAndResolvers: 'always' },
			{ path: 'temptwelve', component: Template12Component, runGuardsAndResolvers: 'always' },
			{ path: 'temptwelveext', component: Template12Component, runGuardsAndResolvers: 'always' },
			{ path: 'temp13', component: TemplatethirteenComponent, runGuardsAndResolvers: 'always' },
			{ path: 'temp13ext', component: TemplatethirteenComponent, runGuardsAndResolvers: 'always' },
			{ path: 'temp16', component: Template16Component, runGuardsAndResolvers: 'always' },
			{ path: 'temp16ext', component: Template16Component, runGuardsAndResolvers: 'always' },
			{ path: 'phase3template01v01', component: Phase3T01V01, runGuardsAndResolvers: 'always' },
			{ path: 'phase3template01v01ext', component: Phase3T01V01, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp5', component: Ntemplate5, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp23_1', component: Ntemplate23_1, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp5ext', component: Ntemplate5, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp23_1ext', component: Ntemplate23_1, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp2', component: Ntemplate2, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp2ext', component: Ntemplate2, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp8', component: Ntemplate8, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp8ext', component: Ntemplate8, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp9', component: Ntemplate9, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp9ext', component: Ntemplate9, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp3', component: Ntemplate3, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp3ext', component: Ntemplate3, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp1', component: Ntemplate1, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp1ext', component: Ntemplate1, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp4', component: Ntemplate4, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp4ext', component: Ntemplate4, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp6', component: Ntemplate6, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp6ext', component: Ntemplate6, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp7', component: Ntemplate7, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp7ext', component: Ntemplate7, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp17', component: Ntemplate17, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp17ext', component: Ntemplate17, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp24', component: Ntemplate24, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp24ext', component: Ntemplate24, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp18', component: Ntemplate18, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp18ext', component: Ntemplate18, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp18_1', component: Ntemplate18_1, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp18_1ext', component: Ntemplate18_1, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp19', component: Ntemplate19, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp19ext', component: Ntemplate19, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp21', component: Ntemplate21, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp21ext', component: Ntemplate21, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp24_1', component: Ntemplate24_1, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp24_1ext', component: Ntemplate24_1, runGuardsAndResolvers: 'always' },
			{ path: 'ntitle', component: NTitleComponent, runGuardsAndResolvers: 'always' },
			{ path: 'ntitleext', component: NTitleComponent, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp13', component: Ntemplate13, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp13ext', component: Ntemplate13, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp10', component: Ntemplate10, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp10ext', component: Ntemplate10, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp20', component: Ntemplate20, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp20ext', component: Ntemplate20, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp11', component: Ntemplate11, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp11ext', component: Ntemplate11, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp12', component: Ntemplate12, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp12ext', component: Ntemplate12, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp16', component: Ntemplate16, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp16ext', component: Ntemplate16, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp23', component: Ntemplate23, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp23ext', component: Ntemplate23, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp15', component: Ntemplate15, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp15ext', component: Ntemplate15, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp22', component: Ntemplate22, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp22ext', component: Ntemplate22, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp14', component: Ntemplate14, runGuardsAndResolvers: 'always' },
			{ path: 'ntemp14ext', component: Ntemplate14, runGuardsAndResolvers: 'always' },
			{ path: 'evatemp15', component: Template15Component, runGuardsAndResolvers: 'always' , data :{ TemplateType:'EVA'}},
			{ path: 'evatemp15ext', component: Template15Component, runGuardsAndResolvers: 'always', data :{ TemplateType:'EVA'} },
			{ path: 'evatemp3', component: Template3Component, runGuardsAndResolvers: 'always' , data :{ TemplateType:'EVA'}},
			{ path: 'evatemp3ext', component: Template3Component, runGuardsAndResolvers: 'always', data :{ TemplateType:'EVA'}},
			{ path: 'evatemp1', component: Template1Component, runGuardsAndResolvers: 'always' , data :{ TemplateType:'EVA'}},
			{ path: 'evatemp1ext', component: Template1Component, runGuardsAndResolvers: 'always', data :{ TemplateType:'EVA'}},
			{ path: 'evatemp8', component: Template8Component, runGuardsAndResolvers: 'always' , data :{ TemplateType:'EVA'}},
			{ path: 'evatemp8ext', component: Template8Component, runGuardsAndResolvers: 'always', data :{ TemplateType:'EVA'}},
			{ path: 'evatemp6', component: Template6Component, runGuardsAndResolvers: 'always' , data :{ TemplateType:'EVA'}},
			{ path: 'evatemp6ext', component: Template6Component, runGuardsAndResolvers: 'always', data :{ TemplateType:'EVA'}},
			{ path: 'evatemp2', component: Template2Component, runGuardsAndResolvers: 'always' , data :{ TemplateType:'EVA'}},
			{ path: 'evatemp2ext', component: Template2Component, runGuardsAndResolvers: 'always', data :{ TemplateType:'EVA'}},
			{ path: 'evatemp4', component: Template4Component, runGuardsAndResolvers: 'always' , data :{ TemplateType:'EVA'}},
			{ path: 'evatemp4ext', component: Template4Component, runGuardsAndResolvers: 'always', data :{ TemplateType:'EVA'}}
			
		]
	}
];


/**
 * Main module routing
 *
 * contains code related to routing
 */
@NgModule({
	imports: [RouterModule.forRoot(APP_ROUTES, { onSameUrlNavigation: 'reload' })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
