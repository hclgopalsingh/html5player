import { Component, OnInit, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { SharedserviceService } from '../../../common/services/sharedservice.service';

@Component({
  selector: 'app-showanswer',
  templateUrl: './showanswer.component.html',
  styleUrls: ['./showanswer.component.scss']
})
export class ShowanswerComponent implements OnInit {

  assetsfolderlocation: string = "";
  showAnswerSubscription: any;
  showAnswerPopup: any;
  contentgFolderPath: string = "";
  popupAssets: any;


  @ViewChild('showAnswerRef', {static: true}) showAnswerRef: any;
  @ViewChild('videoonshowAnspopUp', {static: true}) videoonshowAnspopUp: any;
  @Output("closePopupChild") closePopupChild: EventEmitter<any> = new EventEmitter();

  get basePath(): any {
    if (this.appModel && this.appModel.content) {
      return this.appModel.content.id + '';
    }
  }

  constructor(private appModel: ApplicationmodelService, private Sharedservice: SharedserviceService) {
    this.appModel = appModel;
    this.assetsfolderlocation = this.appModel.assetsfolderpath;
  }

  setData() {
    if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
      let fetchedData: any = this.appModel.content.contentData.data;
      this.popupAssets = fetchedData.feedback.popupassets;
    }
  }

  ngOnInit() {
    this.contentgFolderPath = this.basePath;
    this.setData();
    this.Sharedservice.showAnsRef.next(this.showAnswerRef);
    this.Sharedservice.videoonshowAnspopUp.next(this.videoonshowAnspopUp);

  }

  hoverClosePopup() {
    this.popupAssets.close_button = this.popupAssets.close_button_hover;
  }

  houtClosePopup() {
    this.popupAssets.close_button = this.popupAssets.close_button_origional;
  }

  closePopup() {
    this.closePopupChild.emit();
  }

}
