import {ApplicationmodelService} from '../model/applicationmodel.service';
import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'loader-component',
  templateUrl: '../view/layout/loader.component.html',
  styleUrls: ['../view/css/loader.component.css', '../view/css/bootstrap.min.css']
})
export class LoaderComponent implements OnInit {

  private appModel: ApplicationmodelService;
  minHeight:any = window.innerHeight;
  constructor(appModel: ApplicationmodelService) {
    this.appModel = appModel;
  }
	
  ngOnInit() {
  }
 
}

