import { Component, OnInit, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { Subscription } from 'rxjs';
import 'jquery';
import { PlayerConstants } from '../../../common/playerconstants';
import { ThemeConstants } from '../../../common/themeconstants';
import { SharedserviceService } from '../../../services/sharedservice.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  AnimationEvent
} from '@angular/animations';

declare var $: any;

@Component({
  selector: 'ntemp19',
  animations: [
    trigger('openClose', [
        state('open', style({

      })),
        state('closed', style({
            'left': '{{leftPos}}',
            'top': '{{topPos}}',
            'pointer-events': 'none'

        }), { params: { leftPos: 'auto', topPos: 'auto' } }),
        transition('open => closed', [
            animate('0.5s')
        ]),
        transition('closed => open', [
            animate('0.5s')
        ]),
    ]),
],
  templateUrl: './Ntemplate19.component.html',
  styleUrls: ['./Ntemplate19.component.css']

})

export class Ntemplate19Component implements OnInit, OnDestroy {
  constructor(private appModel: ApplicationmodelService, private Sharedservice: SharedserviceService) {
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
            //console.log('VideoComponent: constructor - cmsPlayerClose');
            this.close();
            break;

          default:
            console.log('Component: constructor - default');
            break;
        }
      }
    );
  }

  @ViewChild("optionsBlock") optionsBlock: any;
  @ViewChild('narrator') narrator: any;
  // @ViewChild('instruction') instruction: any;
  @ViewChild('instructionBar') instructionBar: any;
    @ViewChild('instructionVO') instructionVO: any;
  @ViewChild('optionAudio') optionAudio: any;
  @ViewChild('maincontent') maincontent: any;
  @ViewChild('confirmModalRef') confirmModalRef: any;
  @ViewChild('submitModalRef') submitModalRef: any;
  @ViewChild('infoModalRef') infoModalRef: any;
  @ViewChild('modalRef') modalRef: any;
  @ViewChild('mainmodalRef') mainmodalRef: any;
  @ViewChild('popupRef') popupRef: any;
  @ViewChild('popupBodyRef') popupBodyRef: any;
  @ViewChild('popupImage') popupImage: any;
  @ViewChild('feedbackPopupAudio') feedbackPopupAudio: any;
  @ViewChild('feedbackpartialPopupAudio') feedbackpartialPopupAudio: any;
  @ViewChild('partialpopupBodyRef') partialpopupBodyRef: any;
  @ViewChild('confirmReplayRef') confirmReplayRef: any;
  @ViewChild('mainVideo') mainVideo: any;
  @ViewChild('feedbackInfoAudio') feedbackInfoAudio: any;
  @ViewChild('tabularBlock') tabularBlock: any; 
  @ViewChild('tabularBlockinModal') tabularBlockinModal: any;
  @ViewChild('placeholder') placeholder: any;



  audio = new Audio();
  blink: boolean = false;
  currentIdx = 0;
  commonAssets: any = "";
  optionslist: any = [];
  optionslist_main: any = "";
  myoption: any = [];
  question: any = "";
  feedback: any = "";
  narratorAudio: any;
  isLastActivity: any = "";
  checked: boolean = false;
  selected: boolean = false;
  bool: boolean = false;
  isQuesTypeImage: boolean = false;
  isQuesTypeVideo: boolean = false;
  showIntroScreen: boolean;
  isShow: boolean = false;
  helpAudio: any = "";
  correctOpt: any;
  idArray: any = [];
  noOfRightAnsClicked: number = 0;
  noOfWrongAnsClicked: number = 0;
  rightansArray: any = [];
  wrongansArray: any = [];
  AnsObj: any = [];
  ansArray1: any = [];
  Array2required: boolean = false;
  partialpopupRequired: boolean = false;
  isFirstQues: boolean;
  isLastQues: boolean = false;
  isAutoplayOn: boolean;
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
  disableHelpBtn: boolean = false;
  containgFolderPath: string = "";
  assetsPath: string = "";
  loadFlag: boolean = false;
  optionObj: any;
  optArr1: any;
  optArr2: any;
  optionCommonAssets: any;
  ques_control: any;
  feedbackObj: any;
  feedbackAudio: any;
  correctImg: any;
  incorrectImg: any;
  popupAssets: any;
  confirmPopupAssets: any;
  infoPopupAssets: any;
  submitPopupAssets: any;
  replayconfirmAssets: any;
  noOfRightAns: any;
  rightAnspopupAssets: any;
  tempSubscription: Subscription;
  rightanspopUp: any;
  wronganspopUp: any;
  quesObj: any;
  isPlayVideo: boolean = true;
  videoReplayd: boolean = false;
  tabularBlockObj: any;
  startCount: number = 0;
  countofAnimation: number = 0;
  blinkTimeInterval: any;
  blinkFlag: boolean = true;
  originalArray: any = [];
  refcpyArray: any = [];
  currentIndex: number;
  moveTo: any;
  moveFrom: any;
  moveleft: any;
  movetop: any;
  indexArray: any = [];
  index: any;
  fetchAnswer: any = [];
  index1: number = 0;
  prevIdx: number;
  curr: number;
  prevOptIdx: number = 0;
  matched: boolean = false;
  quesFlag: boolean = false;
  currentLeftValue: any;
  optionsAfterFive: number = 4;
  rightAnswerArray: any = [];
  rightanspopUpheader_img: boolean = false;
  wronganspopUpheader_img: boolean = false;
  showanspopUpheader_img: boolean = false;
  partialCorrectheaderTxt_img: boolean = false;
  styleHeaderPopup:any;
  styleBodyPopup:any;
  PlayPauseFlag:boolean = true;
  instructionDisable: boolean = false;
  clickedIndex: any;
  optionPlaceholders: any;
  showAnswerFeedbackArr: any;
  feedbackArr: any;
  rightFeedbackArr: any;
  wrongFeedbackArr: any;
  parentMatrixClass:any;
  displayconfirmPopup: boolean = false;
  displaymainPopup: boolean = false;
  showAnssetTimeout: any;
  bodyContentOpacity: boolean = false;
  bodyContentDisable: boolean = false;
  instructionOpacity: boolean = false;
  rightAnsTimeout:any;
  popupTxtRequired: any;
  manualClickedonCrossbtn:boolean=false;

 ngOnInit() {
  if (this.appModel.isNewCollection) {
    this.appModel.event = { 'action': 'segmentBegins' };
  }
  this.containgFolderPath = this.getBasePath();
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
    // for (let x = 0; x < this.optionsBlock.nativeElement.children[1].children.length; x++) {
    //   this.optionsBlock.nativeElement.children[1].children[x].src = 
    //     this.optionObj[x].imgsrc.url = this.optionObj[x].imgsrc.url + "?someRandomSeed=" + Math.random().toString(36);
    // }
    if (mode == "manual") {
      //show modal for manual
      this.appModel.notifyUserAction();
      this.instructionDisable = true;
      this.displaymainPopup = true;
        this.setFeedback();
      // }
    } else if (mode == "auto") {
      this.isShow = true;
      this.matched = true;
      this.startCount = 0;
      this.appModel.enableSubmitBtn(false);
      //show modal of auto
      this.appModel.notifyUserAction();
      if (this.popupRef && this.popupRef.nativeElement) {
        this.instructionDisable = true;
        this.instructionOpacity = true;
        this.bodyContentDisable = true;
        this.bodyContentOpacity = true;
        this.displaymainPopup = true;
        this.checked = true;
        this.rightanspopUpheader_img = false;
        this.wronganspopUpheader_img = false;
        this.showanspopUpheader_img = true;
        this.partialCorrectheaderTxt_img = false;
        this.attemptType = "showAnswer";
        this.styleHeaderPopup = this.feedbackObj.style_header;
        this.styleBodyPopup = this.feedbackObj.style_body;
        this.noOfRightAnsClicked = 0;
        this.noOfWrongAnsClicked = 0;
        this.setFeedback();
      }
    } 
  })


  this.appModel.getConfirmationPopup().subscribe((action) => {
    this.appModel.notifyUserAction();
      this.optionObj[this.index1].imgsrc=this.optionObj[this.index1].imgsrc_original;
      this.startCount=0;
      this.isShow = true;
      clearTimeout(this.showAnssetTimeout);
      if (action == "uttarDikhayein") {
        this.instructionDisable = false;
        if (!this.instructionVO.nativeElement.paused) {
          this.instructionVO.nativeElement.currentTime = 0;
          this.instructionVO.nativeElement.pause();
        }
        this.instructionDisable = true;
        this.displayconfirmPopup = true;
      }
  })

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
    this.postWrongAttempt()
  });
  this.appModel.resetBlinkingTimer();
  this.appModel.handleController(this.controlHandler);
}

  ngAfterViewChecked() {
    this.templatevolume(this.appModel.volumeValue, this);
  }

  ngOnDestroy() {
    clearInterval(this.rightAnsTimeout);
    clearInterval(this.blinkTimeInterval);
    this.startCount = 0;
    for (let i = 0; i < this.refcpyArray.length; i++) {
      //this.refQues.nativeElement.children[i].children[0].src = this.refcpyArray[i].imgsrc_original.location == "content" ? this.containgFolderPath + "/" + this.refcpyArray[i].imgsrc_original.url : this.assetsPath + "/" + this.refcpyArray[i].imgsrc_original.url;
    }
    this.index1 = 0;
  }

  playInstruction() {
    this.appModel.notifyUserAction();
    if (this.instructionVO.nativeElement && this.instructionVO.nativeElement.src) {
        this.instructionDisable = true;
        this.instructionVO.nativeElement.play();
        this.instructionVO.nativeElement.onended = () => {
            this.instructionDisable = false;
        }
    }
}

  playHoverOption(opt, i) {
    if (i == this.index1) {
      if (this.optionsBlock.nativeElement.children[2].paused && this.narrator.nativeElement.paused) {
        if (opt.imgsrc_audio && opt.imgsrc_audio.location == "content") {
          this.optionsBlock.nativeElement.children[2].src = this.containgFolderPath + "/" + opt.imgsrc_audio.url;
        } else {
          this.optionsBlock.nativeElement.children[2].src = this.assetsPath + "/" + opt.imgsrc_audio.url;
        }
        this.optionsBlock.nativeElement.children[2].load();
        if (!this.instructionVO.nativeElement.paused) {
          this.instructionVO.nativeElement.pause();
          this.tabularBlock.nativeElement.style.pointerEvents = "";
        }
        this.optionsBlock.nativeElement.children[2].play();
        //this.optionsBlock.nativeElement.children[1].children[i].style.cursor = "pointer";
        for (let x = 0; x < this.optionsBlock.nativeElement.children[1].children.length; x++) {
          if (x != i) {
            this.optionsBlock.nativeElement.children[1].children[x].style.pointerEvents = "none";
          }
        }
        //this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
        this.optionsBlock.nativeElement.children[2].onended = () => {
          for (let x = 0; x < this.optionsBlock.nativeElement.children[1].children.length; x++) {
            if (x != i) {
              this.optionsBlock.nativeElement.children[1].children[x].style.pointerEvents = "";
            }
          }
        }
        this.onHoverImgOption(opt,i);
      }
    }
  }

  onHoverImgOption(opt,i) {
    if (opt && opt != undefined && i == this.index1) {
      if (this.narrator.nativeElement.paused) {
        $(this.optionsBlock.nativeElement.children[1].children[i]).addClass("scaleInAnimation");
      }
    }
  }


  optionHover(opt, i) {
    if (i == this.index1) {
      // this.optionsBlock.nativeElement.children[1].children[i].style.cursor = 'pointer';
      $(this.optionsBlock.nativeElement.children[1].children[i]).addClass("scaleInAnimation");
    }
  }

  onHoverOption(opt, i) {
    if (opt && opt != undefined) {
      if (this.narrator.nativeElement.paused) {
        //this.optionsBlock.nativeElement.children[i].children[j].children[0].style.cursor = "pointer";
        if (opt.imgsrc && opt.imgsrc.location == "content") {
          this.optionsBlock.nativeElement.children[0].children[i].children[1].children[0].src = this.containgFolderPath + "/" + opt.dropBoxImgHover.url;
        }
        else {
          this.optionsBlock.nativeElement.children[0].children[i].children[1].children[0].src = this.assetsPath + "/" + opt.dropBoxImgHover.url;
        }
      }
    }
  }


  onHoverOptionOut(opt, i) {
    if (opt && opt != undefined) {
      if (opt.imgsrc && opt.imgsrc.location == "content") {
        //if (!opt.placed) {
          this.optionsBlock.nativeElement.children[0].children[i].children[1].children[0].src = this.containgFolderPath + "/" + opt.dropBoxImg_original.url;
        //}
      }
      else {
        //if (!opt.placed) {
          this.optionsBlock.nativeElement.children[0].children[i].children[1].children[0].src = this.assetsPath + "/" + opt.dropBoxImg_original.url;
        //}
      }
    }
  }

  optionHoverOut(opt, i, j) {
    if (opt && opt != undefined) {
      // this.optionsBlock.nativeElement.children[1].children[i].style.cursor = 'none';
      this.ZoomOutAnimationoption(opt, i);
    }
  }

  placeholderHover(idx, opt) {
    if (!opt.isAnswered) {
      opt.imgsrc = opt.imgsrc_hover;
    }
  }

  placeholderLeave(idx, opt) {
    if (!opt.isAnswered) {
      opt.imgsrc = opt.imgsrc_original;
    }
  }

  ZoomOutAnimationoption(opt, i) {
    if (this.narrator.nativeElement.paused && i == this.index1) {
      $(this.optionsBlock.nativeElement.children[1].children[i]).addClass("scaleOutAnimation");
      this.optionsBlock.nativeElement.children[1].children[i].style.cursor = "";
      setTimeout(() => {
        $(this.optionsBlock.nativeElement.children[1].children[i]).removeClass("scaleInAnimation");
        $(this.optionsBlock.nativeElement.children[1].children[i]).removeClass("scaleOutAnimation");
      }, 500);
    }
  }

  onClickPlaceholder(opt,idx) {
    this.clickedIndex = idx;
    this.appModel.handlePostVOActivity(true);
    this.bodyContentDisable = true;
    this.instructionDisable = true;

    if (!this.narrator.nativeElement.paused! || !this.instructionVO.nativeElement.paused) {
      console.log("narrator/instruction voice still playing");
    } else {
        opt['isAnswered'] = true;
        this.startCount = 0;
        this.moveFrom = this.optionsBlock.nativeElement.children[1].children[this.index1].getBoundingClientRect();
        this.moveTo = this.placeholder.nativeElement.children[idx].getBoundingClientRect();
        this.moveleft = this.moveTo.left - this.moveFrom.left;
        this.movetop = this.moveTo.top - this.moveFrom.top;
        this.optionsBlock.nativeElement.children[1].children[this.index1].style.pointerEvents = "none";
        this.optionObj[this.index1].isOpen = false;
        this.optionObj[this.index1].leftPos = this.moveleft + "px";
        this.optionObj[this.index1].topPos = this.movetop + "px";
        this.placeholder.nativeElement.children[idx].style.pointerEvents = "none";
        if(opt.correctOptionId && opt.correctOptionId === this.optionObj[this.index1].id) {
          this.noOfRightAnsClicked++;
          this.feedbackArr[idx].imgsrc = this.optionObj[this.index1].imgsrc_right;
        } else {
          this.noOfWrongAnsClicked++;
          this.feedbackArr[idx].imgsrc = this.optionObj[this.index1].imgsrc_wrong;
        }
        
        if(this.refcpyArray.length === 1) {
          this.rightAnsTimeout = setTimeout(() => {
            this.popupTxtRequired=this.feedbackObj.feedback_title.required;
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
        }
        this.appModel.notifyUserAction();
    }
    
    
  }

  onAnimationEvent(event: AnimationEvent, opt, idx) {
    if (event.fromState == "open" && event.toState == "closed" && event.phaseName == "done") {
      
      if (this.refcpyArray.length !== 1) {
        this.bodyContentDisable = false;
        this.instructionDisable = false;
        this.appModel.handlePostVOActivity(false);
      }

      clearInterval(this.blinkTimeInterval);
      this.optionsBlock.nativeElement.children[1].children[this.index1].style.pointerEvents = "";
      this.optionsBlock.nativeElement.children[1].children[this.index1].style.display = "none";
      this.optionsBlock.nativeElement.children[1].children[this.index1].style.pointerEvents = "none";
      const movedObj = this.refcpyArray.splice(this.index, 1);
      if (this.indexArray.length >= 1) {
        let newObj = this.indexArray.shift();
        this.refcpyArray.push(newObj);
      }
      this.countofAnimation++;
      this.optionsAfterFive++;
      if (this.optionsBlock.nativeElement && this.optionsBlock.nativeElement.children[1].children[this.optionsAfterFive]) {
        this.optionsBlock.nativeElement.children[1].children[this.optionsAfterFive].style.display = "flex";
      }
      this.optionPlaceholders[this.clickedIndex].imgsrc = movedObj[0].imgsrc_original;
      this.startCount = 1;
      if (this.refcpyArray.length == 5) {
        this.getRandomIndex(5);
      } else {
        this.getRandomIndex(this.refcpyArray.length);
      }
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

  /******Checking of existance of quesTab in content JSON *******/
  checkquesTab() {
    if (this.fetchedcontent.commonassets.ques_control != undefined) {
      this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
    }else {
      this.appModel.getJson();
    }
  }

  postWrongAttempt(){
    this.resetAttempt();
    this.appModel.notifyUserAction();
  }



  templatevolume(vol, obj) {
    if (obj.narrator && obj.narrator.nativeElement) {
      obj.narrator.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.mainVideo && obj.mainVideo.nativeElement) {
      obj.mainVideo.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.optionAudio && obj.optionAudio.nativeElement) {
      obj.optionAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackPopupAudio && obj.feedbackPopupAudio.nativeElement) {
      obj.feedbackPopupAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.instructionVO && obj.instructionVO.nativeElement) {
      obj.instructionVO.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackpartialPopupAudio && obj.feedbackpartialPopupAudio.nativeElement) {
      obj.feedbackpartialPopupAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }

  }

  close() {
    //this.appModel.event = { 'action': 'exit', 'currentPosition': this.currentVideoTime };
    this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
  }

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

  checkVideoLoaded() {
    if (!this.videoReplayd) {
      this.appModel.setLoader(false);
      this.appModel.navShow = 1;
      this.isPlayVideo = true;
      this.appModel.isVideoPlayed = true;
      this.appModel.stopAllTimer();
    }
  }

  endedHandler() {
    if (!this.videoReplayd) {
      this.isPlayVideo = false;
      this.appModel.navShow = 2;
      this.appModel.setLoader(true);
      this.appModel.startPreviousTimer();
    }
  }

  endedHandleronSkip() {    
    this.isPlayVideo = false;   
    this.appModel.navShow = 2;  
    this.appModel.videoStraming(false);
    this.appModel.notifyUserAction();   
}


PlayPauseVideo(){
  if(this.PlayPauseFlag)
  {
    this.mainVideo.nativeElement.pause();
    this.quesObj.quesPlayPause = this.quesObj.quesPlay;
    this.PlayPauseFlag = false;
  }
  else{
    this.mainVideo.nativeElement.play();
    this.quesObj.quesPlayPause = this.quesObj.quesPause;
    this.PlayPauseFlag = true;
  }
  
}

hoverSkip(){
 // this.skipFlag = false;
 this.quesObj.quesSkip = this.quesObj.quesSkipHover;
}
houtSkip(){
  this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
}

  checkforQVO() {
    if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
      this.narrator.nativeElement.src = this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
      this.appModel.handlePostVOActivity(true);
      this.bodyContentDisable = true;
      this.narrator.nativeElement.play();
      this.narrator.nativeElement.onended = () => {
        this.bodyContentDisable = false;
        this.startActivity();
        this.appModel.handlePostVOActivity(false);
      }
    } else {
      this.startActivity();
      this.appModel.handlePostVOActivity(false);
      this.appModel.enableReplayBtn(true);
    }
  }

  startActivity() {
    this.startCount = 1;
    if (this.optionObj.length === 4) {
      this.getRandomIndex(4);
    } else {
      this.getRandomIndex(5);
    }
  }

  getRandomIndex(no) {
    this.index = Math.floor(Math.random() * no);
    if (this.refcpyArray.length > 0) {
      let id = this.refcpyArray[this.index].id;
      for (let i = 0; i < this.optionObj.length; i++) {
        if (id == this.optionObj[i].id) {
          this.index1 = i;
          break;
        }
      }
      //this.currentIndex = this.indexArray[this.index];
      this.blinkHolder();
    }
  }

  blinkHolder() {
    this.blinkFlag = true;
    this.blinkTimeInterval = setInterval(() => {
      if (this.startCount == 1) {
        this.blinkHolderImg(this.index1);
      } else {
        clearInterval(this.blinkTimeInterval);
        for (let i = 0; i < this.refcpyArray.length; i++) {
          //this.refQues.nativeElement.children[i].children[0].src = this.refcpyArray[i].imgsrc_original.location == "content" ? this.containgFolderPath + "/" + this.refcpyArray[i].imgsrc_original.url : this.assetsPath + "/" + this.refcpyArray[i].imgsrc_original.url;
        }
        for (let i = 0; i < this.optionsBlock.nativeElement.children.length; i++) {
          if (this.optionObj[i] && this.optionObj[i].imgsrc_original) {
            this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_original;
          }
        }
      }
    }, 500);
  }



  blinkHolderImg(i) {
    if (this.optionObj[i] && this.optionObj[i].imgsrc_blink) {
      if (this.blinkFlag) {
        this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_blink;
        this.blinkFlag = false;
      } else {
        this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_original;
        this.blinkFlag = true;
      }
    }
    else {
      ++this.index1;
      //this.index2 = 0;
      if (this.optionObj.length == this.index1) {
        this.index1 = 0;

      }
    }
  }

  setData() {

    if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
      this.commonAssets = this.fetchedcontent.commonassets;
      // this.myoption = this.fetchedcontent.refOptionObj;
      this.noOfImgs = this.commonAssets.imgCount;
      this.isLastQues = this.appModel.isLastSection;
      this.isLastQuesAct = this.appModel.isLastSectionInCollection;
      if (this.isLastQuesAct || this.isLastQues) {
        this.appModel.setlastQuesNT();
      }
      this.tabularBlockObj = this.fetchedcontent.tabularBlockObj;
      this.optionObj = this.fetchedcontent.refOptionObj.options;
      for (let i = 0; i < this.optionObj.length; i++) {
        if (this.optionObj[i] && this.optionObj[i].imgsrc_original) {
          this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_original;
        }
      }
      let numberOfOptions = this.optionObj.length >= 5 ? 5 : this.optionObj.length;
      for (let x = 0; x < numberOfOptions; x++) {
        this.refcpyArray.push(this.optionObj[x]);
      }
      for (let x = 5; x < this.optionObj.length; x++) {
        this.indexArray.push(this.optionObj[x]);
      }
      for (let i = 0; i < this.optionObj.length; i++) {
        this.optionObj[i].isOpen = true;            
    }
      this.feedbackObj = this.fetchedcontent.feedback;
      this.confirmPopupAssets = this.fetchedcontent.feedback.confirm_popup;
      let refQuesObj = this.fetchedcontent.refQuesObj;
      if (refQuesObj.criteriaHeaders.length === 4 && refQuesObj.headers.length === 3) {
        this.parentMatrixClass = "matrix_5x3";
      } else if (refQuesObj.criteriaHeaders.length === 4 && refQuesObj.headers.length === 5) {
        this.parentMatrixClass = "matrix_5x5";
      } else if (refQuesObj.criteriaHeaders.length === 2 && refQuesObj.headers.length === 3) {
        this.parentMatrixClass = "matrix_3x3";
      } else if (refQuesObj.criteriaHeaders.length === 2 && refQuesObj.headers.length === 5) {
        this.parentMatrixClass = "matrix_3x5";
      } else if (refQuesObj.criteriaHeaders.length === 3 && refQuesObj.headers.length === 4) {
        this.parentMatrixClass = "matrix_4x4";
      }
      this.quesObj = this.fetchedcontent.quesObj;
      this.optionPlaceholders = JSON.parse(JSON.stringify(this.fetchedcontent.refQuesObj.optionPlaceHolders));
      this.showAnswerFeedbackArr = JSON.parse(JSON.stringify(this.fetchedcontent.refQuesObj.optionPlaceHolders));
      this.feedbackArr = JSON.parse(JSON.stringify(this.fetchedcontent.refQuesObj.optionPlaceHolders));
      this.showAnswerFeedbackArr.map(placeholderObj => {
        if (placeholderObj.correctOptionId) {
          placeholderObj.imgsrc = this.optionObj[placeholderObj.correctOptionId-1].imgsrc_right;
        }
      })
      if (this.quesObj.quesVideo && this.quesObj.quesVideo.autoPlay && !this.appModel.isVideoPlayed) {
        this.isPlayVideo = true;
        //sessionStorage.setItem("isPlayVideo", "true");
      } else {
        this.isPlayVideo = false;
      }
    }

  }

  getBasePath() {
    if (this.appModel && this.appModel.content) {
      return this.appModel.content.id + '';
    }
  }
  hoverConfirm() {
    this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_hover;
  }

  houtConfirm() {
    this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_original;
  }

  hoveronSubmitConfirm() {
    this.submitPopupAssets.confirm_btn = this.submitPopupAssets.confirm_btn_hover;
  }

  houtonSubmitConfirm() {
    this.submitPopupAssets.confirm_btn = this.submitPopupAssets.confirm_btn_original;
  }

  hoveronReplayConfirm() {
    this.replayconfirmAssets.confirm_btn = this.replayconfirmAssets.confirm_btn_hover;
  }

  houtonReplayConfirm() {
    this.replayconfirmAssets.confirm_btn = this.replayconfirmAssets.confirm_btn_original;
  }

  hoverDecline() {
    this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_hover;
  }

  houtDecline() {
    this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_original;
  }

  hoveronSubmitDecline() {
    this.submitPopupAssets.decline_btn = this.submitPopupAssets.decline_btn_hover;
  }

  houtonSubmitDecline() {
    this.submitPopupAssets.decline_btn = this.submitPopupAssets.decline_btn_original;
  }

  hoveronReplayDecline() {
    this.replayconfirmAssets.decline_btn = this.replayconfirmAssets.decline_btn_hover;
  }

  houtonReplayDecline() {
    this.replayconfirmAssets.decline_btn = this.replayconfirmAssets.decline_btn_original;
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

  hoverOK() {
    this.infoPopupAssets.ok_btn = this.infoPopupAssets.ok_btn_hover;
  }

  houtOK() {
    this.infoPopupAssets.ok_btn = this.infoPopupAssets.ok_btn_original;
  }

  // hoveronTable() {
  //       if (!this.instructionVO.nativeElement.paused) {
  //         this.instructionVO.nativeElement.pause();
  //         this.instructionVO.nativeElement.currentTime=0;
  //         this.tabularBlock.nativeElement.style.pointerEvents = "";
  //       }
  // }

  // showFeedback(id: string, flag: string) {
  //   if (id == "submit-modal-id") {
  //     this.submitModalRef.nativeElement.classList = "modal";
  //   }
  //   if (id == "info-modal-id") {
  //     this.infoModalRef.nativeElement.classList = "modal";
  //     if (this.feedbackInfoAudio && !this.feedbackInfoAudio.nativeElement.paused) {
  //       this.feedbackInfoAudio.nativeElement.pause();
  //       this.feedbackInfoAudio.nativeElement.currentTime = 0;
  //     }
  //   }
  //   if (flag == "yes") {
  //       setTimeout(() => {
  //         this.appModel.invokeTempSubject('showModal', 'submit');
  //       }, 100);
  //     //}
  //   } else {
  //     this.appModel.notifyUserAction();
  //   }
  // }

  // dontshowFeedback(id: string, flag: string) {
  //   if (id == "submit-modal-id") {
  //     this.submitModalRef.nativeElement.classList = "modal";
  //     //this.optionsBlock.nativeElement.classList = "row mx-0";
  //     $("#optionsBlock .options").removeClass("disable_div");
  //     $("#optionsBlock .options").css("opacity", "unset");
  //     if (this.countofAnimation != this.optionObj.length) {
  //       this.appModel.enableSubmitBtn(false);
  //     }
  //     this.appModel.notifyUserAction();
  //     //let i = 0;
  //     for (let i = 0; i < this.refcpyArray.length; i++) {
  //       //this.refQues.nativeElement.children[i].children[0].src = this.refcpyArray[i].imgsrc_original.location == "content" ? this.containgFolderPath + "/" + this.refcpyArray[i].imgsrc_original.url : this.assetsPath + "/" + this.refcpyArray[i].imgsrc_original.url;
  //     }
  //     //this.resetAttempt();
  //   }
  // }

  setFeedback() {
    if ((this.noOfRightAnsClicked > 0 && this.noOfWrongAnsClicked === 0) || this.isShow) {   //100% right answer feedback or show answer
      this.feedbackObj.style_header = this.feedbackObj.right_style_header;
      this.feedbackObj.style_body = this.feedbackObj.right_style_body;
      this.feedbackObj.feedback_title = this.isShow ? this.feedbackObj.showAnswer_style_title : this.feedbackObj.right_style_title;
    } else if (this.noOfRightAnsClicked === 0 && this.noOfWrongAnsClicked > 0) {   // 100% wrong answer feedback
      this.feedbackObj.style_header = this.feedbackObj.wrong_style_header;
      this.feedbackObj.style_body = this.feedbackObj.wrong_style_body;
      this.feedbackObj.feedback_title = this.feedbackObj.wrong_style_title;
    } else if (this.noOfRightAnsClicked > 0 && this.noOfWrongAnsClicked > 0) {   // partial correct answer feedback
      this.feedbackObj.style_header = this.feedbackObj.partial_style_header;
      this.feedbackObj.style_body = this.feedbackObj.partial_style_body;
      this.feedbackObj.feedback_title = this.feedbackObj.partial_style_title;
    }
    this.setplayFeedbackAudio();
  }

  attemptType:any;

  setplayFeedbackAudio() {
    if (this.isShow) {
      this.feedbackAudio = this.feedbackObj.right_ans_popup.showAnsfeedback_audio;
    } else if (this.noOfRightAnsClicked > 0 && this.noOfWrongAnsClicked == 0) {
        this.feedbackAudio = this.feedbackObj.right_ans_popup.rightfeedback_audio;
    } else if (this.noOfRightAnsClicked > 0 && this.noOfWrongAnsClicked > 0) {
      this.feedbackAudio = this.feedbackObj.partial_correct_popup;
      this.appModel.feedbackType = "partialIncorrect";
    } else if (this.noOfRightAnsClicked === 0 && this.noOfWrongAnsClicked > 0) {
      this.feedbackAudio = this.feedbackObj.wrong_ans_popup;
      this.appModel.feedbackType = "fullyIncorrect";
    }
        this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
      this.feedbackPopupAudio.nativeElement.play();


      //show right feedback animation





      this.feedbackPopupAudio.nativeElement.onended = () => {
        this.startCount = 0;
        this.showAnssetTimeout = setTimeout(() => {
          if(!this.manualClickedonCrossbtn) {
          this.closeModal();
          }
        }, this.showAnsTimeout);
        this.appModel.notifyUserAction();
        // $("#instructionBar").addClass("disable_div");
        // $("#instructionBar").css("opacity", "0.3");
        // $(".bodyContent").css("opacity", "0.3");
        // $(".bodyContent").addClass("disable_div");
        // this.appModel.enableSubmitBtn(false);
        // this.appModel.enableReplayBtn(false);
        }
      
    //  else if (this.noOfRightAnsClicked == 0 && this.noOfWrongAnsClicked > 0) {
    //   if (this.feedbackObj && this.feedbackObj.incorrectAudio) {
    //     this.feedbackAudio = this.feedbackObj.incorrectAudio;
    //     this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.location == "content" ? this.containgFolderPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
    //     console.log(this.feedbackPopupAudio.nativeElement.src);
    //   }
    //   this.feedbackPopupAudio.nativeElement.play();
    //   //wrong animation

    //   this.feedbackPopupAudio.nativeElement.onended = () => {
    //     this.closeModal();
    //   }
    // } else {
    //   if (this.feedbackObj && this.feedbackObj.partialIncorrect_sound) {
    //     this.feedbackAudio = this.feedbackObj.partialIncorrect_sound;
    //     this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.location == "content" ? this.containgFolderPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
    //     console.log(this.feedbackPopupAudio.nativeElement.src);
    //   }
    //   this.feedbackPopupAudio.nativeElement.play();
    //   this.feedbackPopupAudio.nativeElement.onended = () => {
    //     this.closeModal();
    //     //this.resetAttempt();
    //     this.appModel.notifyUserAction();

    //   }
    // }
  }




  playrightFeedbackAudioforPartialPopup(i) {
    let current = i;
    if (this.rightansArray[i] && this.rightansArray[i].imgrightfeedback_audio) {
      this.feedbackAudio = this.rightansArray[i].imgrightfeedback_audio;
      this.feedbackpartialPopupAudio.nativeElement.src = this.feedbackAudio.location == "content" ? this.containgFolderPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
      console.log(this.feedbackpartialPopupAudio.nativeElement.src);
      this.feedbackpartialPopupAudio.nativeElement.play();
      if (this.partialpopupBodyRef && this.partialpopupBodyRef.nativeElement && this.partialpopupBodyRef.nativeElement.children[0].children[1].children[i]) {
        //this.partialpopupBodyRef.nativeElement.children[0].children[1].children[i].classList = "options optionAnimate";
        this.partialpopupBodyRef.nativeElement.children[0].children[1].children[i].classList.value += " optionAnimate";
      }
      this.feedbackpartialPopupAudio.nativeElement.onended = () => {
        //this.partialpopupBodyRef.nativeElement.children[0].children[1].children[i].classList = "options";
        this.partialpopupBodyRef.nativeElement.children[0].children[1].children[i].classList.remove("optionAnimate");
        this.partialpopupBodyRef.nativeElement.children[0].children[1].children[i].classList.value += " nutralize";
        ++current;
        this.playrightFeedbackAudioforPartialPopup(current);
      }
    } else {
      setTimeout(() => {
        this.playwrongFeedbackAudioforPartialPopup(0);
      }, 1000);

    }
  }
  playwrongFeedbackAudioforPartialPopup(i) {
    let current = i;
    if (this.wrongansArray[i] && this.wrongansArray[i].imgwrongfeedback_audio) {
      this.feedbackAudio = this.wrongansArray[i].imgwrongfeedback_audio;
      this.feedbackpartialPopupAudio.nativeElement.src = this.feedbackAudio.location == "content" ? this.containgFolderPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
      console.log(this.feedbackpartialPopupAudio.nativeElement.src);
      this.feedbackpartialPopupAudio.nativeElement.play();
      if (this.partialpopupBodyRef && this.partialpopupBodyRef.nativeElement && this.partialpopupBodyRef.nativeElement.children[1].children[1].children[i]) {
        //this.partialpopupBodyRef.nativeElement.children[1].children[1].children[i].classList = "options optionAnimate";
        this.partialpopupBodyRef.nativeElement.children[1].children[1].children[i].classList.value += " optionAnimate";
      }
      this.feedbackpartialPopupAudio.nativeElement.onended = () => {
        //this.partialpopupBodyRef.nativeElement.children[1].children[1].children[i].classList = "options";
        this.partialpopupBodyRef.nativeElement.children[1].children[1].children[i].classList.remove("optionAnimate");
        this.partialpopupBodyRef.nativeElement.children[1].children[1].children[i].classList.value += " nutralize";
        ++current;
        this.playwrongFeedbackAudioforPartialPopup(current);
      }
    } else {
      setTimeout(() => {
        this.closeModal();
      }, 2000)
    }
  }
  resetAttempt() {
    this.optionPlaceholders = JSON.parse(JSON.stringify(this.fetchedcontent.refQuesObj.optionPlaceHolders));
    this.feedbackArr = JSON.parse(JSON.stringify(this.fetchedcontent.refQuesObj.optionPlaceHolders));
    
    for (let i = 0; i < this.optionObj.length; i++) {
      if (this.optionObj[i] && this.optionObj[i].imgsrc_original) {
        this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_original;
      }
    }
    let numberOfOptions = this.optionObj.length >= 5 ? 5 : this.optionObj.length;
      for (let x = 0; x < numberOfOptions; x++) {
        this.refcpyArray.push(this.optionObj[x]);
      }
    // for (let x = 0; x < 5; x++) {
    //   this.refcpyArray.push(this.optionObj[x]);
    // }
    for (let x = 5; x < this.optionObj.length; x++) {
      this.indexArray.push(this.optionObj[x]);
    }
    this.countofAnimation = 0;
    this.noOfRightAnsClicked = 0;
    this.noOfWrongAnsClicked = 0;
    this.rightansArray = [];
    this.wrongansArray = [];
    this.optionsAfterFive = 4;
    this.manualClickedonCrossbtn = false;
    this.appModel.handlePostVOActivity(false);
    //this.startCount = 0;
    clearInterval(this.blinkTimeInterval);
    //this.index1 = 0;
    this.startCount = 1;
    // setTimeout(() => {
      for (let x = 0; x < this.optionsBlock.nativeElement.children[1].children.length; x++) {
      this.optionsBlock.nativeElement.children[1].children[x].style.left = 0;
      this.optionsBlock.nativeElement.children[1].children[x].style.top = 0;
      this.optionsBlock.nativeElement.children[1].children[x].style.pointerEvents ="";
      this.optionsBlock.nativeElement.children[1].children[x].style.display = this.optionObj[x].style_display.display;
    }
      this.optionObj.forEach(option => {
        option.isOpen = true;
      })
      this.getRandomIndex(this.refcpyArray.length);
    // }, 2500);
  }

  sendFeedback(id: string, flag: string) {
    this.displayconfirmPopup = false;
    if (flag == "yes") {
      this.manualClickedonCrossbtn=false;
      this.isShow=true;
      this.noOfRightAnsClicked = 0;
      this.noOfWrongAnsClicked = 0;

      this.showAnssetTimeout = setTimeout(() => {
        this.feedbackArr = this.showAnswerFeedbackArr;
        this.popupTxtRequired=this.feedbackObj.showAnswer_style_title.required;
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
    } else {
      this.appModel.notifyUserAction();
      if(!this.checked){
        this.startCount=1;
        this.blinkHolder();
        this.instructionDisable = false;
        }
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

    this.displaymainPopup = false;
    
    this.appModel.notifyUserAction();
    // if (this.noOfRightAnsClicked === 0 && this.noOfWrongAnsClicked ===0)
    if(this.noOfWrongAnsClicked > 0) {
      this.instructionOpacity = false;
      this.bodyContentOpacity = false;
      this.bodyContentDisable = false;
      this.instructionDisable = false;
    // this.resetAttempt();
      this.appModel.wrongAttemptAnimation();
    } else {
      this.instructionOpacity = true;
      this.bodyContentOpacity = true;
      this.bodyContentDisable = true;
      this.appModel.handlePostVOActivity(false);
      this.blinkOnLastQues();
    }

    if (!this.checked) {
      setTimeout(() => {
        this.instructionDisable = false;
        // if (this.noOfBlocks == 4) {
        //   this.puzzleBlock4disabled = false;
        // }else if (this.noOfBlocks == 9) {
        //   this.puzzleBlock9disabled = false;
        // }else if (this.noOfBlocks == 12) {
        //   this.puzzleBlock12disabled = false;
        // }
      }, 1000);
    }
  }

  // closeModal() {
  //       this.appModel.enableReplayBtn(false);
  //   //for (let i = 0; i < this.popupBodyRef.nativeElement.children[0].children.length; i++) {
  //   //  this.popupBodyRef.nativeElement.children[0].children[i].children[0].classList.value = "";
  //   //}
  //   for (let x = 0; x < this.optionsBlock.nativeElement.children[1].children.length; x++) {
  //     this.optionsBlock.nativeElement.children[1].children[x].src =
  //       this.optionObj[x].imgsrc_original.location == "content" ? this.containgFolderPath + "/" + this.optionObj[x].imgsrc_original.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.optionObj[x].imgsrc_original.url + "?someRandomSeed=" + Math.random().toString(36);
  //   }
  //   if (this.countofAnimation == this.noOfRightAnsClicked) {
  //     this.matched = true;
  //     this.startCount = 0;
  //     $("#instructionBar").addClass("disable_div");
  //     $("#instructionBar").css("opacity", "0.3");
  //     $(".bodyContent").css("opacity", "0.3");
  //     $(".bodyContent").addClass("disable_div");
  //     this.appModel.enableSubmitBtn(false);
  //   }
  //   if (this.feedbackPopupAudio && !this.feedbackPopupAudio.nativeElement.paused) {
  //     this.feedbackPopupAudio.nativeElement.pause();
  //     this.feedbackPopupAudio.nativeElement.currentTime = 0;
  //     if (!this.matched) {
  //       this.resetAttempt();
  //       this.appModel.wrongAttemptAnimation();
  //     }
  //   } else {
  //           if (!this.matched) {
  //       this.resetAttempt();
  //       this.appModel.wrongAttemptAnimation();
  //     }
  //   }
  //   this.popupRef.nativeElement.classList = "modal";
  //   this.appModel.notifyUserAction();

  //   if (this.matched) {
  //     this.blinkOnLastQues();
  //   }

  //   if (!this.matched) {
  //     setTimeout(() => {
        
  //       $("#instructionBar").removeClass("disable_div");
  //       $("#optionsBlock .options").removeClass("disable_div");
  //     }, 1000);
  //   }

  // }
}


