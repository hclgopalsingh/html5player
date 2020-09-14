import { Component, OnInit, ViewChild,AfterViewChecked, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { Subject, Observable, Subscription } from 'rxjs'
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
  selector: 'app-ntemplate9',
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
  templateUrl: './Ntemplate9.component.html',
  styleUrls: ['./Ntemplate9.component.css', '../../../view/css/bootstrap.min.css']
})
export class Ntemplate9Component implements OnInit, OnDestroy,AfterViewChecked {


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
  noOfBlocks: any;
  blockcount: any;
  isBlock12: any;
  isBlock9: any;
  isBlock4: boolean;
  startCount: number = 0;
  blinkFlag: boolean = true;
  blinkTimeInterval: any;
  index1: number = 0;
  index2: number = 0;
  moveFrom: any;
  moveTo: any;
  indexOfBlock: any;
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
  puzzleBlockclicked: boolean = false;
  puzzleBlock4disabled: boolean = false;
  puzzleBlock9disabled: boolean = false;
  puzzleBlock12disabled: boolean = false;
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
    clearInterval(this.blinkTimeInterval);
    clearInterval(this.disableremovalTimer);
    this.startCount = 0;
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
    clearInterval(this.blinkTimeInterval);
    clearInterval(this.rightAnsTimeout);
    clearInterval(this.showAnssetTimeout);
    clearInterval(this.initialDisableTimer);
    this.index1 = 0;
    if(this.narrator.nativeElement!=undefined){
      this.narrator.nativeElement.pause();
      this.narrator.nativeElement.currentTime=0;
    }
    for (let i = 0; i < this.optionObj.length; i++) {
      if (this.optionObj[i] && this.optionObj[i].Matched) {
        this.optionObj[i].Matched = false;
      }
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

  onClickoption(opt, j) {
    this.puzzleBlockclicked = true;
    this.instructionDisable = true;
    this.appModel.handlePostVOActivity(true);
    if (!this.instruction.nativeElement.paused) {
      this.instruction.nativeElement.currentTime = 0;
      this.instruction.nativeElement.pause();
    }
    this.appModel.notifyUserAction();
    let i = this.index1;
    this.indexOfBlock = this.optionsBlock.nativeElement.children[this.index1 + 1].id;
    if (opt.id == this.indexOfBlock) {
      this.checked = true;
      if (this.noOfBlocks == 4) {
        this.puzzleBlock4disabled = true;
      }else if (this.noOfBlocks == 9) {
        this.puzzleBlock9disabled = true;
      }else if (this.noOfBlocks == 12) {
        this.puzzleBlock12disabled = true;
      }
      clearInterval(this.blinkTimeInterval);
      this.blinkTimeInterval = 0;
      this.onPlacePuzzle(opt, i, j);
      ++this.index2;
      this.blockcount--;
      if (this.blockcount < 1) {
        this.startCount = 0;
        this.rightAnsTimeout = setTimeout(() => {
          this.popupTxtRequired=this.feedbackObj.rightAnswerpopupTxt.required;
          this.attemptType = "manual";
          this.rightanspopUpheader_img = true;
          this.showanspopUpheader_img = false;
          this.checked = true;
          this.appModel.invokeTempSubject('showModal', 'manual');
          this.bodyContentOpacity = true;
          this.instructionOpacity = true;
          this.bodyContentDisable = true;
          this.instructionDisable = true;
        }, 3200);
        for (let i = 0; i < this.optionObj.length; i++) {
          if (this.optionObj[i] && this.optionObj[i].Matched) {
            this.optionObj[i].Matched = false;
          }
        }
      }
    }else {
      if (this.noOfBlocks == 4) {
        this.puzzleBlock4disabled = true;
      }else if (this.noOfBlocks == 9) {
        this.puzzleBlock9disabled = true;
      }else if (this.noOfBlocks == 12) {
        this.puzzleBlock12disabled = true;
      }
      this.onPlacePuzzle(opt, i, j);
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
    if (!this.puzzleBlockclicked) {
      opt.imgsrc = opt.imgsrc_original;
      //this.a=false;
    }
  }
  onAnimationEvent(event: AnimationEvent, opt, j) {
  if (event.fromState == "open" && event.toState == "closed" && event.phaseName == "done") {
    if (opt.id == this.indexOfBlock) {
      this.feedbackVO.nativeElement.src = undefined;
      if (opt.imgrightfeedback_audio && opt.imgrightfeedback_audio.url != "") {
        this.feedbackVO.nativeElement.src = opt.imgrightfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36);
      }else {
        this.puzzleBlockclicked = false;
        this.appModel.handlePostVOActivity(false)
        this.checked = false;
        if (this.blockcount > 0){
        this.instructionDisable=false;
        }
        this.disableremovalTimer=setTimeout(()=> {
        if (this.noOfBlocks == 4) {
          this.puzzleBlock4disabled = false;
        }else if (this.noOfBlocks == 9) {
          this.puzzleBlock9disabled = false;
        }else if (this.noOfBlocks == 12) {
          this.puzzleBlock12disabled = false;
        }
        }, 650);
        this.startCount = 1;
        this.blinkHolder();
      }
      setTimeout(() => {
        this.feedbackVO.nativeElement.play();
        this.feedbackVO.nativeElement.onended = () => {
          console.log("audio end");
          this.puzzleBlockclicked = false;
          this.appModel.handlePostVOActivity(false)
          this.checked = false;
          this.startCount = 1;
          this.blinkHolder();
          if (this.blockcount > 0){
          this.instructionDisable=false;
          }
          this.disableremovalTimer=setTimeout(()=> {
            if (this.noOfBlocks == 4) {
              this.puzzleBlock4disabled = false;
            }else if (this.noOfBlocks == 9) {
              this.puzzleBlock9disabled = false;
            }else if (this.noOfBlocks == 12) {
              this.puzzleBlock12disabled = false;
            }
          }, 650);
        }
      }, 300);
      this.optionsBlock.nativeElement.children[j + 1].style.pointerEvents = "none";
    }else {
      this.feedbackVO.nativeElement.src = undefined;
      if (opt.imgwrongfeedback_audio && opt.imgwrongfeedback_audio.url != "") {
        this.feedbackVO.nativeElement.src = opt.imgwrongfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36);
      }
      this.feedbackVO.nativeElement.play();
      this.feedbackVO.nativeElement.onended = () => {
        this.appModel.wrongAttemptAnimation();
        console.log("wrong option chosen")
      }
    }


  }else if (event.fromState == "closed" && event.toState == "open" && event.phaseName == "done") {
    this.optionsBlock.nativeElement.children[j + 1].src = this.optionObj[j].imgsrc.url;
    this.appModel.handlePostVOActivity(false);
    this.startCount = 1;
    this.blinkHolder();
    this.instructionDisable=false;
    if (this.noOfBlocks == 4) {
      this.puzzleBlock4disabled = false;
    }else if (this.noOfBlocks == 9) {
      this.puzzleBlock9disabled = false;
    }else if (this.noOfBlocks == 12) {
      this.puzzleBlock12disabled = false;
    }
  }
}
  /*End-Template click and hover events*/





  /*Start-Template Functions*/
  /******Puzzle Placement from options block to empty block *******/
  onPlacePuzzle(opt, i, j) {
    this.tempOpt = opt;
    this.tj = j
    this.optionsBlock.nativeElement.children[j + 1].src = this.optionObj[j].imgsrcOriginalSize.url;
    console.log("Puzzle placed");
    this.moveFrom = this.optionObj[this.index1].style_block;
    let left = this.moveFrom.left;
    let top = this.moveFrom.top;
    let position = this.moveFrom.position;
    let width = this.moveFrom.width;
    if (opt.id == this.indexOfBlock) {
      this.optionObj[this.index1].Matched = true;
      this.startCount = 0;
      opt.isOpen = false;
      opt.leftPos = left;
      opt.topPos = top;
      opt.optPos = position;
      opt.optWidth = width;
    }else {
      this.puzzleBlockclicked = false;
      this.startCount = 0;
      opt.isOpen = false;
      opt.leftPos = left;
      opt.topPos = top;
      opt.optPos = position;
      opt.optWidth = width; 
    }
  }

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
        clearTimeout(this.blinkTimeInterval);
        this.startCount = 0;
        this.checkforQVO();
      }
    }
  }
/******Question Auto Instruction check as per content JSON *******/
  checkforQVO() {
    if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
      this.appModel.handlePostVOActivity(true);
      if (this.noOfBlocks == 4) {
        this.puzzleBlock4disabled = true;
      }else if (this.noOfBlocks == 9) {
        this.puzzleBlock9disabled = true;
      }else if (this.noOfBlocks == 12) {
        this.puzzleBlock12disabled = true;
      }
      //this.bodyContentDisable = true;
      this.instructionDisable = true;
      this.narrator.nativeElement.play();
      this.narrator.nativeElement.onended = () => {
        this.initialDisableTimer=setTimeout(()=>{
        this.instructionDisable = false;
        this.bodyContentDisable = false;
        if (this.noOfBlocks == 4) {
          this.puzzleBlock4disabled = false;
        }else if (this.noOfBlocks == 9) {
          this.puzzleBlock9disabled = false;
        }else if (this.noOfBlocks == 12) {
          this.puzzleBlock12disabled = false;
        }
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
    this.startCount = 1;
    this.blinkHolder();
  }

/******Blinking of Empty blocks *******/
  blinkHolder() {
    this.blinkFlag = true;
    this.blinkTimeInterval = setInterval(() => {
      if (this.startCount == 1) {
        this.blinkHolderImg(this.index1);
      }else {
        clearInterval(this.blinkTimeInterval);
      }
    }, 300);
  }

/******Image blinking of Empty block *******/
  blinkHolderImg(i) {
    if (this.optionObj[i] && this.optionObj[i].imgsrc_blink && !this.optionObj[i].Matched) {
      if (this.blinkFlag) {
        this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_blink;
        this.blinkFlag = false;
      }else {
        if (this.optionObj[i].imgsrc_original != undefined) {
          this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_original;
        }
        this.blinkFlag = true;
      }
    }else {
      ++this.index1;
      this.blinkHolderImg(this.index1);
    }
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
      for (let i = 0; i < this.optionObj.length; i++) {
        if (this.optionObj[i].imgsrc_original != undefined) {
          this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_original;
        }
        this.optionObj[i].Matched = false;
      }
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
      this.noOfBlocks = this.quesObj.noOfBlocks;
      this.blockcount = this.noOfBlocks;
      if (this.noOfBlocks == 12) {
        this.isBlock12 = true;
        this.isBlock9 = false;
        this.isBlock4 = false;
      }else if (this.noOfBlocks == 9) {
        this.isBlock12 = false;
        this.isBlock9 = true;
        this.isBlock4 = false;
      }else if (this.noOfBlocks == 4) {
        this.isBlock12 = false;
        this.isBlock9 = false;
        this.isBlock4 = true;
      }
      for (let i = 0; i < this.optionObj.length; i++) {
        this.optionObj[i].isOpen = true;
        this.optionObj[i].leftPos = this.optionObj[i].style_block.left;
        this.optionObj[i].topPos = this.optionObj[i].style_block.top;
        this.optionObj[i].optPos = this.optionObj[i].style_block.position;
        this.optionObj[i].optWidth = this.optionObj[i].style_block.width;
      }
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
      if (this.noOfBlocks == 4) {
        this.puzzleBlock4disabled = true;
      }else if (this.noOfBlocks == 9) {
        this.puzzleBlock9disabled = true;
      }else if (this.noOfBlocks == 12) {
        this.puzzleBlock12disabled = true;
      }
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
      this.instructionDisable = false;
    }
  }

/******Popup close functionality *******/
  closeModal() {
    this.manualClickedonCrossbtn=true;
    if (this.feedbackPopupAudio && !this.feedbackPopupAudio.nativeElement.paused) {
      this.feedbackPopupAudio.nativeElement.pause();
      this.feedbackPopupAudio.nativeElement.currentTime = 0;
    }
    this.startCount = 0;
    for (let i = 0; i < this.noOfBlocks; i++) {
      if (this.optionObj[i] && this.optionObj[i].imgsrc_original && this.optionObj[i]) {
        this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_original;
      }
    }
    this.displaymainPopup = false;
    this.instructionOpacity = true;
    this.bodyContentOpacity = true;
    this.bodyContentDisable = true;
    this.appModel.notifyUserAction();
    this.blinkOnLastQues();
    if (!this.checked) {
      setTimeout(() => {
        this.instructionDisable = false;
        if (this.noOfBlocks == 4) {
          this.puzzleBlock4disabled = false;
        }else if (this.noOfBlocks == 9) {
          this.puzzleBlock9disabled = false;
        }else if (this.noOfBlocks == 12) {
          this.puzzleBlock12disabled = false;
        }
      }, 1000);
    }
  }
  /*End-Template Functions*/
}

