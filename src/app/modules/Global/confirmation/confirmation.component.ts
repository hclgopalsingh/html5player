import { Component, OnInit,Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { SharedserviceService } from '../../../common/services/sharedservice.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  assetsfolderlocation: string = "";
  showAnswerSubscription: any;
  showAnswerPopup: any;
  contentgFolderPath: string = "";
  popupAssets: any;
  enableConfirmation:boolean = false


  @ViewChild('showAnswerRef') showAnswerRef: any;
  @ViewChild('videoonshowAnspopUp') videoonshowAnspopUp: any;
  @Output("closeConfirmationChild") closeConfirmationChild: EventEmitter<any> = new EventEmitter();

  constructor(private appModel: ApplicationmodelService, private Sharedservice: SharedserviceService) {
    this.appModel = appModel;
		this.assetsfolderlocation = this.appModel.assetsfolderpath;
  } 
  
  get basePath(): any {
		if (this.appModel && this.appModel.content) {
			return this.appModel.content.id + '';
		}
  }
  
  setData() {
    if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
    let fetchedData: any = this.appModel.content.contentData.data;
    this.popupAssets = fetchedData.feedback.confirmation_popUp;
  }  
  }

  hoverClosePopup() {
		this.popupAssets.close_button = this.popupAssets.close_button_hover;
  }
  
	houtClosePopup() {
		this.popupAssets.close_button = this.popupAssets.close_button_origional;
  }
  
  closePopup(type){
    console.log("type",type)
    this.houtYes();
    this.houtNo();
    this.enableConfirmation = false;
    if(type == "yes"){
      this.closeConfirmationChild.emit(type);
    }
  }

  houtYes(){
    this.popupAssets.yes_btn_base = this.popupAssets.btn_base_original
  }

  hoverYes(){
    this.popupAssets.yes_btn_base = this.popupAssets.btn_base_hover
  }

  hoverNo(){
    this.popupAssets.no_btn_base = this.popupAssets.btn_base_hover
  }

  houtNo(){
    this.popupAssets.no_btn_base = this.popupAssets.btn_base_original
  }


  ngOnInit() {
    this.contentgFolderPath = this.basePath;
    this.setData();
    this.Sharedservice.showAnsRef.next(this.showAnswerRef);
    this.Sharedservice.videoonshowAnspopUp.next(this.videoonshowAnspopUp);
    this.Sharedservice.getsetShowHideConfirmation().subscribe((data) => {
    this.enableConfirmation = data;
    console.log(data)
  })
  }

}
