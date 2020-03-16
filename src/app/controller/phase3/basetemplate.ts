import { Component, OnInit, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../../model/applicationmodel.service';

import 'jquery';

declare var $: any;


export class BaseTemplate implements OnInit {

	ngOnInit() {
		console.log("Gopal");
	}
}