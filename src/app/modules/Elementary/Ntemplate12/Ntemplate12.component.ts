import { Component, OnInit, ViewChild,AfterViewChecked, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { Subscription } from 'rxjs'
import { PlayerConstants } from '../../../common/playerconstants';
import { SharedserviceService } from '../../../services/sharedservice.service';
import { ThemeConstants } from '../../../common/themeconstants';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  AnimationEvent
} from '@angular/animations';


@Component({
  selector: 'app-ntemplate12',
  animations: [
    trigger('openClose', [
      state('open', style({
        'left': '{{leftPos}}',
        'top': '{{topPos}}',
        'position': '{{optPos}}',
        'width': '{{optWidth}}'
      }), { params: { leftPos: 'auto', topPos: 'auto', optPos: 'absolute', optWidth: 'auto' } }),
      state('closed', style({
        'left': '{{leftPos}}',
        'top': '{{topPos}}',
        'position': '{{optPos}}',
        'width': '{{optWidth}}'

      }), { params: { leftPos: 'auto', topPos: 'auto', optPos: 'absolute', optWidth: 'auto' } }),
      transition('open => closed', [
        animate('0.8s')
      ]),
      transition('closed => open', [
        animate('0.8s')
      ]),
    ]),
  ],
  templateUrl: './Ntemplate12.component.html',
  styleUrls: ['./Ntemplate12.component.css']
})
export class Ntemplate12 implements OnInit, OnDestroy,AfterViewChecked {


  @ViewChild('narrator') narrator: any;
  @ViewChild('instruction') instruction: any;
  @ViewChild("optionsBlock") optionsBlock: any;
  @ViewChild('feedbackPopupAudio') feedbackPopupAudio: any;
  @ViewChild('feedbackVO') feedbackVO: any;
  @ViewChild('instructionBarFeedback') instructionBarFeedback: any;


  audio = new Audio();
  commonAssets: any = "";
  feedback: any = "";
  checked: boolean = false;
  isLastQues: boolean = false;
  isLastQuesAct: boolean;
  /*Start: Theme Implementation(Template Changes)*/
  controlHandler = {
    isSubmitRequired: false,
    isReplayRequired: false
  };
  themePath: any;
  fetchedcontent: any;
  functionalityType: any;
  showAnsTimeout: number;
  /*END: Theme Implementation(Template Changes)*/
  noOfImgs: number;
  noOfImgsLoaded: number = 0;
  loaderTimer: any;
  containgFolderPath: string = "";
  assetsPath: string = "";
  loadFlag: boolean = false;
  optionObj: any;
  feedbackObj: any;
  confirmPopupAssets: any;
  rightAnspopupAssets: any;
  tempSubscription: Subscription;
  rightanspopUp: any;
  wronganspopUp: any;
  quesObj: any;
  index1: number = 0;
  index2: number = 0;
  moveFrom: any;
  moveTo: any;
  leftTo: any;
  topTo: any;
  attemptType: string = "";
  rightanspopUpheader_img = false;
  wronganspopUpheader_img = false;
  showanspopUpheader_img = false;
  tempOpt: any;
  tj: any;
  instructionDisable: boolean = false;
  instructionOpacity: boolean = false;
  rightAnsTimeout: any;
  showAnssetTimeout: any;
  bodyContentOpacity: boolean = false;
  bodyContentDisable: boolean = true;
  displayconfirmPopup: boolean = false;
  displaymainPopup: boolean = false;
  disableremovalTimer:any;
  initialDisableTimer:any;
  popupTxtRequired:boolean=false;
  manualClickedonCrossbtn:boolean=false
  /*Start-LifeCycle events*/
  private appModel: ApplicationmodelService;
  constructor(appModel: ApplicationmodelService, private Sharedservice: SharedserviceService) {
    this.appModel = appModel;
    this.assetsPath = this.appModel.assetsfolderpath;
    this.appModel.navShow = 2;
    this.appModel.setLoader(true);
    // if error occured during image loading loader wil stop after 5 seconds 
    this.loaderTimer = setTimeout(() => {
      this.appModel.setLoader(false);
      //this.checkforQVO();
    }, 5000);

    this.appModel.notification.subscribe(
      (data) => {
        console.log('Component: constructor - data=', data);
        switch (data) {
          case PlayerConstants.CMS_PLAYER_CLOSE:
            this.close();
            break;

          default:
            console.log('Component: constructor - default');
            break;
        }
      }
    );
  }
  ngOnInit() {
    if (this.appModel.isNewCollection) {
      this.appModel.event = { 'action': 'segmentBegins' };
    }
    this.containgFolderPath = this.getBasePath();
    clearInterval(this.disableremovalTimer);
    /*Start: Theme Implementation(Template Changes)*/
    let fetchedData: any = this.appModel.content.contentData.data;
    this.fetchedcontent = JSON.parse(JSON.stringify(fetchedData));;
    this.functionalityType = this.appModel.content.contentLogic.functionalityType;
    this.themePath = ThemeConstants.THEME_PATH + this.fetchedcontent.productType + '/' + this.fetchedcontent.theme_name;
    this.Sharedservice.imagePath(this.fetchedcontent, this.containgFolderPath, this.themePath, undefined);
    this.checkquesTab();
    this.appModel.globalJsonData.subscribe(data => {
      this.showAnsTimeout = data.showAnsTimeout;
    });
    /*End: Theme Implementation(Template Changes)*/
    this.setData();
    this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
      if (mode == "manual") {
        //show modal for manual
        this.appModel.notifyUserAction();
        this.instructionDisable = true;
        this.displaymainPopup = true;
        if (this.attemptType == "manual" && this.rightAnspopupAssets && this.rightAnspopupAssets.imgrightfeedback_audio) {
          this.feedbackPopupAudio.nativeElement.src = this.rightAnspopupAssets.imgrightfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36);
        }else {
          this.feedbackPopupAudio.nativeElement.src = this.rightAnspopupAssets.imgshowAnsfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36);
        }
        this.feedbackPopupAudio.nativeElement.play();
        this.feedbackPopupAudio.nativeElement.onended = () => {
          this.checked = true;
          this.showAnssetTimeout = setTimeout(() => {
            if(!this.manualClickedonCrossbtn) {
            this.closeModal();
            }
          }, this.showAnsTimeout);
        }
        //}
      }else if (mode == "auto") {

        //show modal of auto
        this.appModel.notifyUserAction();
        this.popupTxtRequired=this.feedbackObj.showAnswerpopupTxt.required;
        this.instructionBarFeedback.nativeElement.children[0].children[0].src=this.feedbackObj.showAnswerpopupTxt.url;
        this.instructionDisable = true;
        this.checked = true;
        this.attemptType = "auto";
        this.rightanspopUpheader_img = false;
        this.showanspopUpheader_img = true;
        this.displayconfirmPopup = false;
        this.displaymainPopup = true;
        if (this.rightAnspopupAssets && this.rightAnspopupAssets.imgrightfeedback_audio) {
          this.feedbackPopupAudio.nativeElement.src = this.rightAnspopupAssets.imgshowAnsfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36);
        }
        this.feedbackPopupAudio.nativeElement.play();
        this.feedbackPopupAudio.nativeElement.onended = () => {
          this.checked = true;
          this.showAnssetTimeout = setTimeout(() => {
            this.closeModal();
          }, this.showAnsTimeout);
        }
      }
    });

    this.appModel.getConfirmationPopup().subscribe((action) => {
      this.appModel.notifyUserAction();
      this.optionObj[this.index1].imgsrc=this.optionObj[this.index1].imgsrc_original;
      clearTimeout(this.showAnssetTimeout);
      if (action == "uttarDikhayein") {
        this.instructionDisable = false;
        if (!this.instruction.nativeElement.paused) {
          this.instruction.nativeElement.currentTime = 0;
          this.instruction.nativeElement.pause();
        }
        this.instructionDisable = true;
        this.displayconfirmPopup = true;
      }
    });

    this.appModel.questionEvent.subscribe(() => {
      if (this.rightanspopUp) {
        console.log("timer still exist");
        clearTimeout(this.rightanspopUp);
      }
      if (this.wronganspopUp) {
        clearTimeout(this.wronganspopUp);
      }
    });

    this.appModel.nextBtnEvent().subscribe(() => {
      if (this.appModel.isLastSectionInCollection) {
        this.appModel.event = { 'action': 'segmentEnds' };
      }
      if (this.appModel.isLastSection) {
        this.appModel.event = { 'action': 'end' };
      }
    })

    this.appModel.postWrongAttempt.subscribe(() => {
      setTimeout(() => {
        this.postWrongAttemplt()
      }, 750)
    });
    this.appModel.resetBlinkingTimer();
    this.appModel.handleController(this.controlHandler);
  }


  ngOnDestroy() {
    clearInterval(this.rightAnsTimeout);
    clearInterval(this.showAnssetTimeout);
    clearInterval(this.initialDisableTimer);
    this.index1 = 0;
    if(this.narrator.nativeElement!=undefined){
      this.narrator.nativeElement.pause();
      this.narrator.nativeElement.currentTime=0;
    }    
  }

  ngAfterViewChecked() {
    this.templatevolume(this.appModel.volumeValue, this);
  }

  /*End-LifeCycle events*/

  /*Start-Template click and hover events*/
  playHoverInstruction() {
    if (!this.narrator.nativeElement.paused) {
      console.log("narrator/instruction voice still playing");
    }else {
      console.log("play on Instruction");
      this.appModel.notifyUserAction();
      if (this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.play();
        this.instructionDisable = true;
        this.instruction.nativeElement.onended = () => {
          this.instructionDisable = false;
        }
      }
    }
  }

  
  hoverConfirm() {
    this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_hover;
  }

  houtConfirm() {
    this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_original;
  }

  hoverDecline() {
    this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_hover;
  }

  houtDecline() {
    this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_original;
  }

  hoverCloseConfirm() {
    this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_hover;
  }
  houtCloseConfirm() {
    this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_original;
  }

  hoverClosePopup() {
    this.feedbackObj.popup_commmon_imgs.close_btn = this.feedbackObj.popup_commmon_imgs.close_btn_hover;
  }

  houtClosePopup() {
    this.feedbackObj.popup_commmon_imgs.close_btn = this.feedbackObj.popup_commmon_imgs.close_btn_original;
  }

  hoveronOption(opt) {
    this.appModel.notifyUserAction();
    //if(this.a) {
    opt.imgsrc = opt.imgsrc_hover;
    let currentEle:HTMLElement=event.currentTarget as HTMLElement;
    currentEle.style.cursor="pointer";
    //this.a=true;
    //}else{
    //this.a=true;
    //}
  }

  hoverOptionOut(opt) {
  
  }
  onAnimationEvent(event: AnimationEvent, opt, j) {
  if (event.fromState == "open" && event.toState == "closed" && event.phaseName == "done") { 


  }else if (event.fromState == "closed" && event.toState == "open" && event.phaseName == "done") {
   
  }
}
  /*End-Template click and hover events*/


  
  /******Blinking of next Button *******/
  blinkOnLastQues() {
    if (this.appModel.isLastSectionInCollection) {
      this.appModel.blinkForLastQues(this.attemptType);
      this.appModel.stopAllTimer();
      if (!this.appModel.eventDone) {
        if (this.isLastQuesAct) {
          this.appModel.eventFired();
          this.appModel.event = { 'action': 'segmentEnds' };
        }
        if (this.isLastQues) {
          this.appModel.event = { 'action': 'end' };
        }
      }
      console.log("Segment Ends");
    }else {
      this.appModel.moveNextQues(this.attemptType);
    }
  }

/******Wrong or Partial Incorrect post anmination functionality *******/
  postWrongAttemplt() {
    let j = this.tj
    let opt = this.tempOpt;
    this.moveFrom = opt.style_block;
    let left = this.moveFrom.left;
    let top = this.moveFrom.top;
    let position = this.moveFrom.position;
    let width = this.moveFrom.width;
    opt.isOpen = true;
    opt.leftPos = left;
    opt.topPos = top;
    opt.optPos = position;
    opt.optWidth = width;  
  }
  /******Checking of existance of quesTab in content JSON *******/
  checkquesTab() {
    if (this.fetchedcontent.commonassets.ques_control != undefined) {
      this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
    }else {
      this.appModel.getJson();
    }
  }

  /******Mute Functionality handle *******/
  templatevolume(vol, obj) {
    if (obj.narrator && obj.narrator.nativeElement) {
      obj.narrator.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackPopupAudio && obj.feedbackPopupAudio.nativeElement) {
      obj.feedbackPopupAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackVO && obj.feedbackVO.nativeElement) {
      obj.feedbackVO.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.instruction && obj.instruction.nativeElement) {
      obj.instruction.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }

  }

  /******close event call *******/
  close() {
    this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
  }

/******loading of Templates *******/
  checkImgLoaded() {
    if (!this.loadFlag) {
      this.noOfImgsLoaded++;
      if (this.noOfImgsLoaded >= this.noOfImgs) {
        this.appModel.setLoader(false);
        this.loadFlag = true;
        clearTimeout(this.loaderTimer);
        this.checkforQVO();
      }
    }
  }
/******Question Auto Instruction check as per content JSON *******/
  checkforQVO() {
    if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
      this.appModel.handlePostVOActivity(true);      
      //this.bodyContentDisable = true;
      this.instructionDisable = true;
      this.narrator.nativeElement.play();
      this.narrator.nativeElement.onended = () => {
        this.initialDisableTimer=setTimeout(()=>{
        this.instructionDisable = false;
        this.bodyContentDisable = false;       
        this.startActivity();
        this.appModel.handlePostVOActivity(false);      
        }, 1000)
      }
    }else {
      this.startActivity();
      this.appModel.handlePostVOActivity(false);
    }
  }

/******After completion of Auto Instruction Activity start functionality *******/
  startActivity() {
    
  }


/******Data set from content JSON *******/
  setData() {
    if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
      this.commonAssets = this.fetchedcontent.commonassets;
      this.noOfImgs = this.commonAssets.imgCount;
      this.isLastQues = this.appModel.isLastSection;
      this.isLastQuesAct = this.appModel.isLastSectionInCollection;
      if (this.isLastQuesAct || this.isLastQues) {
        this.appModel.setlastQuesNT();
      }
      this.optionObj = this.fetchedcontent.optionObj;
      // for (let i = 0; i < this.optionObj.length; i++) {
      //   if (this.optionObj[i].imgsrc_original != undefined) {
      //     this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_original;
      //   }
      // }
      this.feedbackObj = this.fetchedcontent.feedback;
      this.rightAnspopupAssets = this.feedbackObj.right_ans_popup;
      this.confirmPopupAssets = this.fetchedcontent.feedback.confirm_popup;
      this.quesObj = this.fetchedcontent.quesObj;
      /*Start: Theme Implementation(Template Changes)*/
      this.controlHandler = {
        isSubmitRequired: this.quesObj.submitRequired,
        isReplayRequired: this.quesObj.replayRequired
      }
      /*End: Theme Implementation(Template Changes)*/
    }
  }

/******content folder path set *******/
  getBasePath() {
    if (this.appModel && this.appModel.content) {
      return this.appModel.content.id + '';
    }
  }


/******Show Answer Functionality after click on Yes *******/
  sendFeedback(id: string, flag: string) {
    this.displayconfirmPopup = false;
    if (flag == "yes") {
      this.manualClickedonCrossbtn=false;      
      this.showAnssetTimeout = setTimeout(() => {
        this.popupTxtRequired=this.feedbackObj.showAnswerpopupTxt.required;
        this.instructionBarFeedback.nativeElement.children[0].children[0].src=this.feedbackObj.showAnswerpopupTxt.url;
        this.attemptType = "auto";
        this.rightanspopUpheader_img = false;
        this.showanspopUpheader_img = true;
        this.appModel.invokeTempSubject('showModal', 'manual');
        this.appModel.resetBlinkingTimer();
      }, 100);

      this.instructionDisable = true;
      this.bodyContentOpacity = true;
      this.instructionOpacity = true;
      this.checked = true;
    }else {
      this.appModel.notifyUserAction();
      
    }
  }

/******Popup close functionality *******/
  closeModal() {
    this.manualClickedonCrossbtn=true;
    if (this.feedbackPopupAudio && !this.feedbackPopupAudio.nativeElement.paused) {
      this.feedbackPopupAudio.nativeElement.pause();
      this.feedbackPopupAudio.nativeElement.currentTime = 0;
    }
    this.displaymainPopup = false;
    this.instructionOpacity = true;
    this.bodyContentOpacity = true;
    this.bodyContentDisable = true;
    this.appModel.notifyUserAction();
    this.blinkOnLastQues();
    // if (!this.checked) {
    //   setTimeout(() => {
    //     this.instructionDisable = false;        
    //   }, 1000);
    // }
  }
  /*End-Template Functions*/
}

