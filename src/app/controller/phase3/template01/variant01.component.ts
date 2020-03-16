import 'jquery';
import { BaseTemplate } from '../basetemplate';
import { Component } from '@angular/core';
 
declare var $: any;

@Component({
	selector: 'Phase3T01V01',
	templateUrl: '../../../view/layout/phase3/template01/variant01.component.html', 
	styleUrls: ['../../../view/css/phase3/template01/variant01.component.css',
				'../../../view/css/bootstrap.min.css'],
}) 

export class Phase3T01V01 extends BaseTemplate  {
	ngOnInit() {
		super.ngOnInit();
	}
} 