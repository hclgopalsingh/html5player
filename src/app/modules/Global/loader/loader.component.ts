import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'loader-component',
  templateUrl: 'loader.component.html',
  styleUrls: ['loader.component.scss']
})
export class LoaderComponent implements OnInit {

  private appModel: ApplicationmodelService;
  minHeight: any = window.innerHeight;
  constructor(appModel: ApplicationmodelService) {
    this.appModel = appModel;
  }
  ngOnInit(): void {
  }

}
