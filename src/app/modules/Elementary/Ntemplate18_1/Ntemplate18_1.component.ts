import { Component, OnInit, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { Subscription } from 'rxjs'
import { PlayerConstants } from '../../../common/playerconstants';
import { ThemeConstants } from '../../../common/themeconstants';
import { SharedserviceService } from '../../../services/sharedservice.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';


@Component({
  selector: 'ntemp18_1',
  animations: [
    trigger('openClose', [
      state('open', style({
        'left': '{{leftPos}}',
        'top': '{{topPos}}'
      }), { params: { leftPos: 'auto', topPos: 'auto' } }),
      state('closed', style({
        'left': '{{leftPos}}',
        'top': '{{topPos}}'

      }), { params: { leftPos: 'auto', topPos: 'auto' } }),
      transition('open => closed', [
        animate('.5s')
      ]),
      transition('closed => open', [
        animate('.5s')
      ]),
    ]),
  ],
  templateUrl: './Ntemplate18_1.component.html',
  styleUrls: ['./Ntemplate18_1.component.css', '../../../view/css/bootstrap.min.css'],

})

export class Ntemplate18_1 implements OnInit, OnDestroy, AfterViewChecked {
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

  @ViewChild("optionsBlock") optionsBlock: any;
  @ViewChild('narrator') narrator: any;
  @ViewChild('instruction') instruction: any;
  @ViewChild('optionAudio') optionAudio: any;
  @ViewChild('confirmModalRef') confirmModalRef: any;
  @ViewChild('submitModalRef') submitModalRef: any;
  @ViewChild('infoModalRef') infoModalRef: any;
  @ViewChild('modalRef') modalRef: any;
  @ViewChild('popupRef') popupRef: any;
  @ViewChild('popupBodyRef') popupBodyRef: any;
  @ViewChild('feedbackPopupAudio') feedbackPopupAudio: any;
  @ViewChild('feedbackpartialPopupAudio') feedbackpartialPopupAudio: any;
  @ViewChild('partialpopupBodyRef') partialpopupBodyRef: any;
  @ViewChild('confirmReplayRef') confirmReplayRef: any;
  @ViewChild('mainVideo') mainVideo: any;
  @ViewChild('feedbackInfoAudio') feedbackInfoAudio: any;
  @ViewChild('refQues') refQues: any;
  @ViewChild('instructionBarTop') instructionBar: any;
  @ViewChild('bodyContent') bodyContentSection: any;

  audio = new Audio();
  blink: boolean = false;
  commonAssets: any = "";
  feedback: any = "";
  narratorAudio: any;
  checked: boolean = false;
  isQuesTypeImage: boolean = false;
  attemptType: any;
  noOfRightAnsClicked: number = 0;
  noOfWrongAnsClicked: number = 0;
  rightansArray: any = [];
  rightansArray1: any = [];
  rightansArray2: any = [];
  AnsObj: any = [];
  ansArray1: any = [];
  wrongansArray: any = [];
  isFirstQues: boolean;
  isLastQues: boolean = false;
  isLastQuesAct: boolean;

  noOfImgs: number;
  noOfImgsLoaded: number = 0;
  loaderTimer: any;
  containgFolderPath: string = "";
  assetsPath: string = "";
  loadFlag: boolean = false;
  optionObj: any;
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
  refQuesObj: any;
  startCount: number = 0;
  countofAnimation: number = 0;
  blinkTimeInterval: any;
  blinkFlag: boolean = true;
  originalArray: any = [];
  refcpyArray: any = [];
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
  rightanspopUpheader_img: boolean = false;
  wronganspopUpheader_img: boolean = false;
  showanspopUpheader_img: boolean = false;
  partialCorrectheaderTxt_img: boolean = false;
  styleHeaderPopup: any;
  styleBodyPopup: any; quesFlag: boolean = false;
  PlayPauseFlag: boolean = true;
  fetchedcontent: any;
  functionalityType: any;
  themePath: any;
  showAnsTimeout: any;
  AnswerpopupTxt: boolean = false;
  popupHeader: any;
  disableSection: boolean = false;
  disableBody: boolean = false;
  SkipLoad: boolean = false;
  disableoptions: boolean = false;
  disableoptionsBlock: boolean = false;
  isAllowed: boolean = true;
  showAnsTimer: any;
  controlHandler = {
    isSubmitRequired: false,
    isReplayRequired: false
  };
  disableinstructionBar:boolean = true;
  closeClicked:boolean = false;
  ngOnDestroy() {
    clearTimeout(this.showAnsTimer);
    clearInterval(this.blinkTimeInterval);
    this.startCount = 0;
    for (let i = 0; i < this.refcpyArray.length; i++) {
      this.refQues.nativeElement.children[i].children[0].src = this.refcpyArray[i].imgsrc_original.url;
    }
    this.index1 = 0;
  }

  ngOnInit() {
    let that = this;
    if (this.appModel.isNewCollection) {
      this.appModel.event = { 'action': 'segmentBegins' };
    }
    //getting path
    this.containgFolderPath = this.getBasePath();
    let fetchedData: any = this.appModel.content.contentData.data;
    this.fetchedcontent = JSON.parse(JSON.stringify(fetchedData));;
    this.functionalityType = this.appModel.content.contentLogic.functionalityType;
    this.themePath = ThemeConstants.THEME_PATH + this.fetchedcontent.productType + '/' + this.fetchedcontent.theme_name;
    this.Sharedservice.imagePath(this.fetchedcontent, this.containgFolderPath, this.themePath, this.functionalityType);
    this.appModel.globalJsonData.subscribe(data => {
      this.showAnsTimeout = data.showAnsTimeout;
    });
    this.checkquesTab();

    this.setData();
    this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
      if (mode == "manual") {
        //show modal for manual
        this.matched = true;

        this.rightanspopUpheader_img = false;
        this.wronganspopUpheader_img = false;
        this.showanspopUpheader_img = true;
        this.partialCorrectheaderTxt_img = false;
        this.attemptType = "showAnswer";
        this.styleHeaderPopup = this.feedbackObj.style_header;
        this.styleBodyPopup = this.feedbackObj.style_body;
        this.startCount = 0;
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          this.disableSection = true;
          this.confirmModalRef.nativeElement.classList = "modal";
          this.confirmReplayRef.nativeElement.classList = "modal";
          this.popupRef.nativeElement.classList = "displayPopup modal";
          this.setRightFeedback();
        }
      } else if (mode == "auto" && !this.isPlayVideo) {
        this.submitModalRef.nativeElement.classList = "modal";
        this.matched = true;
        for (let x = 0; x < this.fetchAnswer.length; x++) {
          this.popupBodyRef.nativeElement.children[0].children[x].children[0].children[0].src = this.optionObj[x].imgsrc_original.url;
        }
        if (this.feedbackObj.showAnswerpopupTxt.required) {
          this.AnswerpopupTxt = true;
          this.popupHeader = this.feedbackObj.showAnswerpopupTxt.url;
        } else {
          this.AnswerpopupTxt = false;
        }
        this.startCount = 0;
        //show modal of auto
        this.bodyContentSection.nativeElement.style.opacity = 0.3;
        this.instructionBar.nativeElement.style.opacity = 0.3;
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          this.disableSection = true;
          this.disableBody = true;
          this.rightanspopUpheader_img = false;
          this.wronganspopUpheader_img = false;
          this.showanspopUpheader_img = true;
          this.partialCorrectheaderTxt_img = false;
          this.attemptType = "showAnswer";
          this.appModel.enableSubmitBtn(false)
          this.styleHeaderPopup = this.feedbackObj.style_header;
          this.styleBodyPopup = this.feedbackObj.style_body;
          this.startCount = 0;


          this.checked = true;
          this.confirmModalRef.nativeElement.classList = "modal";
          this.confirmReplayRef.nativeElement.classList = "modal";
          this.popupRef.nativeElement.classList = "displayPopup modal";
          this.noOfRightAnsClicked = 0;
          this.noOfWrongAnsClicked = 0;
          this.setRightFeedback();
        }
      } else if (mode == "submit") {
        if (!this.instruction.nativeElement.paused) {
          this.instruction.nativeElement.pause();
          this.instruction.nativeElement.currentTime = 0;
        }
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          this.disableSection = true;
          this.confirmModalRef.nativeElement.classList = "modal";
          this.confirmReplayRef.nativeElement.classList = "modal";
          this.popupRef.nativeElement.classList = "displayPopup modal";
          this.setFeedback();
        }
      }
    })


    this.appModel.getConfirmationPopup().subscribe((action) => {
      this.appModel.notifyUserAction();
      if (action == "uttarDikhayein") {
        this.resetBlinker();
        this.closeClicked = false;
         this.disableinstructionBar = true;
        if (!this.instruction.nativeElement.paused) {
          this.instruction.nativeElement.pause();
          this.instruction.nativeElement.currentTime = 0;
        }
        if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
          this.disableSection = true;
          this.confirmModalRef.nativeElement.classList = "displayPopup modal";
        }
      }
      if (action == "submitAnswer") {
        this.resetBlinker();
        this.closeClicked = false;
        if (!this.instruction.nativeElement.paused) {
          this.instruction.nativeElement.pause();
          this.instruction.nativeElement.currentTime = 0;
        }
        this.submitModalRef.nativeElement.classList = "displayPopup modal";
      }
      if (action == "replayVideo") {
        this.resetBlinker();
        this.closeClicked = false;
        this.houtonReplayConfirm();
        this.SkipLoad = true;
        if (!this.instruction.nativeElement.paused) {
          this.instruction.nativeElement.pause();
          this.instruction.nativeElement.currentTime = 0;
        }
        
        if (this.confirmReplayRef && this.confirmReplayRef.nativeElement) {
          this.disableoptions = true;
          this.confirmReplayRef.nativeElement.classList = "displayPopup modal";
          this.PlayPauseFlag = true;
          this.quesObj.quesPlayPause = this.quesObj.quesPause;
          this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
        }
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
    this.appModel.handleController(this.controlHandler);
    this.appModel.resetBlinkingTimer();
  }

  ngAfterViewChecked() {
    this.appModel.templatevolume(this.appModel.volumeValue, this);
  }

  //Play instruction on click on question instruction
  playHoverInstruction() {
    if (!this.narrator.nativeElement.paused!) {
      console.log("narrator/instruction voice still playing");
    } else {
      this.appModel.notifyUserAction();
      clearInterval(this.blinkTimeInterval);
      console.log("play on Instruction");
      if (this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.play();
        this.disableSection = true;
        this.instruction.nativeElement.onended = () => {
          this.startActivity();
          this.disableSection = false;
        }
      }
      if (this.refQues.optionType == "image") {
        if (!this.optionAudio.nativeElement.paused) {
          this.instruction.nativeElement.currentTime = 0;
          this.instruction.nativeElement.pause();
        }
      }
    }
  }

  playHoverOption(opt, i) {
    if (this.optionsBlock.nativeElement.children[0].children[i].children[0].children[1].paused && this.narrator.nativeElement.paused) {
      if (opt.imgsrc_audio && opt.imgsrc_audio.location == "content") {
        this.optionsBlock.nativeElement.children[0].children[i].children[0].children[1].src = opt.imgsrc_audio.url;
      } else {
        this.optionsBlock.nativeElement.children[0].children[i].children[0].children[1].src = opt.imgsrc_audio.url;
      }
      this.optionsBlock.nativeElement.children[0].children[i].children[0].children[1].load();
      if (!this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.pause();
      }
      this.optionsBlock.nativeElement.children[0].children[i].children[0].children[1].play();
      for (let x = 0; x < this.optionsBlock.nativeElement.children[0].children.length; x++) {
        if (x != i) {
          this.optionsBlock.nativeElement.children[0].children[x].children[0].children[0].style.pointerEvents = "none";
        }
      }
      this.optionsBlock.nativeElement.children[0].children[i].children[0].children[1].onended = () => {
        for (let x = 0; x < this.optionsBlock.nativeElement.children[0].children.length; x++) {
          if (x != i) {
            this.optionsBlock.nativeElement.children[0].children[x].children[0].children[0].style.pointerEvents = "";
          }
        }
      }
      this.onHoverImgOption(opt, i);
    }
  }

  onHoverImgOption(opt, i) {
    if (opt && opt != undefined) {
      if (this.narrator.nativeElement.paused) {
        this.optionsBlock.nativeElement.children[0].children[i].children[0].children[0].classList.add('scaleInAnimation');
      }
    }
  }

  optionHover(opt, i) {
    this.disableSection = false;
    this.optionsBlock.nativeElement.children[0].children[i].children[0].children[0].classList.add('scaleInAnimation');
    if (!this.instruction.nativeElement.paused) {
      this.instruction.nativeElement.currentTime = 0;
      this.instruction.nativeElement.pause();
    }
    this.appModel.notifyUserAction();
    clearInterval(this.blinkTimeInterval);
    this.startActivity();
  }
  optionHoverO(opt, i) {
    this.optionsBlock.nativeElement.children[0].children[i].children[0].children[0].classList.remove('scaleInAnimation');
  }

  onHoverOption(opt, i) {
    if (!this.instruction.nativeElement.paused) {
      this.instruction.nativeElement.currentTime = 0;
      this.instruction.nativeElement.pause();
    }

    if (opt && opt != undefined) {
      if (this.narrator.nativeElement.paused) {
        if (opt.imgsrc && opt.imgsrc.location == "content") {
          this.optionsBlock.nativeElement.children[0].children[i].children[1].children[0].src = opt.dropBoxImgHover.url;
        } else {
          this.optionsBlock.nativeElement.children[0].children[i].children[1].children[0].src = opt.dropBoxImgHover.url;
        }
      }
    }
  }


  onHoverOptionOut(opt, i) {
    if (opt && opt != undefined) {
      if (opt.imgsrc && opt.imgsrc.location == "content") {
        if (!opt.placed) {
          this.optionsBlock.nativeElement.children[0].children[i].children[1].children[0].src = opt.dropBoxImg_original.url;
        }
      } else {
        if (!opt.placed) {
          this.optionsBlock.nativeElement.children[0].children[i].children[1].children[0].src = opt.dropBoxImg_original.url;
        }
      }
    }
  }

  optionHoverOut(opt, i, j) {
    if (opt && opt != undefined) {
      this.ZoomOutAnimationoption(opt, i);
    }
  }

  ZoomOutAnimationoption(opt, i) {
    if (!this.checked && this.narrator.nativeElement.paused) {
      this.optionsBlock.nativeElement.children[0].children[i].children[0].children[0].classList.add('scaleOutAnimation');
      setTimeout(() => {
        this.optionsBlock.nativeElement.children[0].children[i].children[0].children[0].classList.remove('scaleInAnimation');
        this.optionsBlock.nativeElement.children[0].children[i].children[0].children[0].classList.remove('scaleOutAnimation');
      }, 500);
    }
  }



  //this is option click function
  onClickoption(idx, placed, opt) {
    this.disableoptionsBlock = true;

    for (let i = 0; i < this.refQuesObj.length; i++) {

      if (this.refQuesObj[i].position != "top" && opt.placed && this.refQuesObj[i].sequenceNo == opt.sequenceNo) {
        this.refQuesObj[i].isOpen = !this.refQuesObj[i].isOpen;
        this.refQuesObj[i].leftPos = 0 + 'px';
        this.refQuesObj[i].topPos = 0 + 'px';

      } else if (this.refQuesObj[i].position != "top") {
        this.refQuesObj[i].isOpen = true;
      } else {
        this.refQuesObj[i].isOpen = true;
        this.refQuesObj[i].leftPos = 0 + 'px';
        this.refQuesObj[i].topPos = 0 + 'px';
      }

    }

    if (!this.narrator.nativeElement.paused! || !this.instruction.nativeElement.paused) {
      console.log("narrator/instruction voice still playing");
    } else {
      this.startCount = 0;
      for (let x = 0; x < this.optionObj.length; x++) {
        this.optionsBlock.nativeElement.children[0].children[x].children[1].children[0].style.pointerEvents = "none";
      }
      this.refcpyArray[this.index1].imgsrc = this.refcpyArray[this.index1].imgsrc_original;
      if (placed) {
        this.optionsBlock.nativeElement.children[0].children[idx].children[1].children[1].classList.value = "img-fluid optItem";
        this.refQues.nativeElement.children[this.optionObj[idx].sequenceNo - 1].children[0].style.visibility = "";
        ////this.disableoptions = true;
        this.isAllowed = false;

        setTimeout(() => {
          this.refQuesObj[this.index1].isOpen = false;
          this.refQuesObj[this.index1].leftPos = 0 + 'px';
          this.refQuesObj[this.index1].topPos = 0 + 'px';
          clearInterval(this.blinkTimeInterval);
          this.isAllowed = true
          this.countofAnimation--;
          if (this.countofAnimation == 0) {
            this.appModel.enableSubmitBtn(false);
            this.appModel.enableReplayBtn(true);
          }
          this.optionObj[idx].placed = false;
          this.optionsBlock.nativeElement.children[0].children[idx].children[1].children[0].src = this.optionObj[idx].dropBoxImg_original.url;
          this.refcpyArray[this.optionObj[idx].sequenceNo - 1].position = 'top';
          this.prevIdx = this.index1;
          this.startCount = 1;
          this.blinkHolder();
          setTimeout(() => {
            (document.getElementsByClassName('bodyContent')[0] as HTMLElement).style.pointerEvents = '';
          }, 200);
        }, 400);
      } else {
        var a = this.index1;
        this.moveFrom = this.refQues.nativeElement.children[this.index1].children[0].getBoundingClientRect();
        this.moveTo = this.optionsBlock.nativeElement.children[0].children[idx].children[1].children[1].getBoundingClientRect();
        this.moveleft = this.moveTo.left - this.moveFrom.left;
        this.movetop = this.moveTo.top - this.moveFrom.top;
        ////this.disableoptions = true;
        this.isAllowed = false;
        opt.isOpen = true;
        opt.leftPos = 0 + 'px';
        opt.topPos = 0 + 'px';


        setTimeout(() => {
          this.refQuesObj[this.index1].isOpen = false;
          this.refQuesObj[this.index1].leftPos = this.moveleft + 'px';
          this.refQuesObj[this.index1].topPos = this.movetop + 'px';

          clearInterval(this.blinkTimeInterval);
          this.isAllowed = true;
          this.optionsBlock.nativeElement.children[0].children[idx].children[1].children[1].src = this.refQuesObj[this.index1].imgsrc_original.url;

          this.fetchAnswer.splice(idx, 1, this.refcpyArray[this.index1]);
          this.optionObj[idx].placed = true;
          this.refcpyArray[this.index1].placedInOption = idx;
          this.optionObj[idx].sequenceNo = this.refcpyArray[this.index1].sequenceNo;
          this.refQues.nativeElement.children[this.index1].children[0].style.cursor = 'pointer';
          this.optionsBlock.nativeElement.children[0].children[idx].children[1].children[0].src = this.optionObj[idx].dropBoxImgHover.url;
          this.countofAnimation++;
          if (this.countofAnimation > 0) {
            this.appModel.enableSubmitBtn(true);
            ////this.appModel.enableReplayBtn(false);
          }
          this.prevOptIdx = idx;

          this.refcpyArray[this.index1].position = 'down';
          this.index1++;
          this.startCount = 1;
          if (this.refcpyArray.length == this.index1) {
            this.index1 = 0;
          }
          this.blinkHolder();

          setTimeout(() => {
            (document.getElementsByClassName('bodyContent')[0] as HTMLElement).style.pointerEvents = '';
            this.refQues.nativeElement.children[a].children[0].style.visibility = 'hidden';
            this.optionsBlock.nativeElement.children[0].children[idx].children[1].children[1].classList.value = 'img-fluid optItemVisible';
          }, 500);

        }, 400)
      }
      setTimeout(() => {
        this.disableoptionsBlock = false;
      }, 1000);
      this.appModel.notifyUserAction();
    }
  }


  blinkOnLastQues() {
    if (this.appModel.isLastSectionInCollection) {
      this.appModel.blinkForLastQues();
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
    } else {
      if (this.attemptType == "manual") {
        this.appModel.moveNextQues(this.attemptType);
      } else {
        this.appModel.moveNextQues();
      }
    }
  }



  checkquesTab() {
    if (this.fetchedcontent.commonassets.ques_control != undefined) {
      this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
    } else {
      this.appModel.getJson();
    }
  }
  postWrongAttempt() {
    this.disableoptionsBlock = true;
    this.resetAttempt();
    this.appModel.notifyUserAction();
    this.appModel.enableSubmitBtn(false)
    setTimeout(() => {
      this.disableoptionsBlock = false;
      
    }, 1000);
    

  }

  //this function checks all images has been loaded on screen
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

  close() {
    this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
  }

  //this checks loading status of video
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
    for (let i = 0; i < this.refQuesObj.length; i++) {
      if (this.refQuesObj[i].position == "down") {
          this.appModel.enableSubmitBtn(true);
      }
    }
    this.disableoptions = false;
    this.disableSection =
      this.isPlayVideo = false;
    this.appModel.navShow = 2;
    this.appModel.videoStraming(false);
    this.appModel.notifyUserAction();
  }

  //these for play pause on video screen
  PlayPauseVideo() {
    if (this.PlayPauseFlag) {
      this.mainVideo.nativeElement.pause();
      this.quesObj.quesPlayPause = this.quesObj.quesPlay;
      this.PlayPauseFlag = false;
    } else {
      this.mainVideo.nativeElement.play();
      this.quesObj.quesPlayPause = this.quesObj.quesPause;
      this.PlayPauseFlag = true;
    }

  }
  hoverPlayPause() {
    if (this.PlayPauseFlag) {
      this.quesObj.quesPlayPause = this.quesObj.quesPauseHover;
    } else {
      this.quesObj.quesPlayPause = this.quesObj.quesPlayHover;
    }
  }
  leavePlayPause() {
    if (this.PlayPauseFlag) {
      this.quesObj.quesPlayPause = this.quesObj.quesPauseOriginal;
    } else {
      this.quesObj.quesPlayPause = this.quesObj.quesPlayOriginal;
    }
  }
  hoverSkip() {
    // this.skipFlag = false;
    this.quesObj.quesSkip = this.quesObj.quesSkipHover;
  }
  houtSkip() {
    this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
  }

  checkforQVO() {
    if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
      this.narrator.nativeElement.src = this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
      this.appModel.handlePostVOActivity(true);
      this.appModel.enableSubmitBtn(false);
      this.disableBody = true;
      this.narrator.nativeElement.play();
      this.disableoptions = true;
      this.appModel.enableReplayBtn(false);
      this.disableSection = true;
      this.narrator.nativeElement.onended = () => {
        this.disableSection = false;
        this.disableinstructionBar = false;
        this.disableBody = false;
        this.isQuesTypeImage = true;
        this.startActivity();
        this.appModel.handlePostVOActivity(false);
        this.appModel.enableReplayBtn(true);
         setTimeout(() => {
          this.disableoptions = false;
         }, 500)
      }
    } else {
      this.startActivity();
      this.appModel.handlePostVOActivity(false);
      this.appModel.enableSubmitBtn(false);
      this.appModel.enableReplayBtn(true);
    }
  }

  startActivity() {
    this.startCount = 1;
    this.blinkHolder();
  }

  blinkHolder() {
    this.blinkFlag = true;
    this.blinkTimeInterval = setInterval(() => {
      if (this.startCount == 1) {
        this.blinkHolderImg(this.index1);
      } else {
        clearInterval(this.blinkTimeInterval);
        for (let i = 0; i < this.refcpyArray.length; i++) {
          this.refQues.nativeElement.children[i].children[0].src = this.refcpyArray[i].imgsrc_original.url;
        }
      }
    }, 300);
  }

  blinkHolderImg(i) {
    if (this.refcpyArray[i] && this.refcpyArray[i].imgsrc_blink && this.refcpyArray[i].position == "top") {
      if (this.blinkFlag) {
        this.refcpyArray[i].imgsrc = this.refcpyArray[i].imgsrc_blink;
        this.blinkFlag = false;
      } else {
        this.refcpyArray[i].imgsrc = this.refcpyArray[i].imgsrc_original;
        this.blinkFlag = true;
      }
    } else {
      ++this.index1;
      //this.index2 = 0;
      if (this.refcpyArray.length == this.index1) {
        this.index1 = 0;

      }
      if (this.countofAnimation < this.refcpyArray.length) {
        this.blinkHolderImg(this.index1);
      }
    }
  }

  setData() {

    if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
      let fetchedData: any = this.appModel.content.contentData.data;
      console.log(fetchedData);
      this.feedback = this.fetchedcontent.feedback;
      this.commonAssets = this.fetchedcontent.commonassets;
      this.narratorAudio = this.fetchedcontent.commonassets.narrator;
      this.ques_control = this.fetchedcontent.commonassets.ques_control;
      this.noOfImgs = this.commonAssets.imgCount;
      this.isFirstQues = this.commonAssets.isFirstQues;
      this.isLastQues = this.appModel.isLastSection;
      this.isLastQuesAct = this.appModel.isLastSectionInCollection;
      if (this.isLastQuesAct || this.isLastQues) {
        this.appModel.setlastQuesNT();
      }
      this.refQuesObj = this.fetchedcontent.refQuesObj;
      for (let x = 0; x < this.refQuesObj.length; x++) {
        this.refQuesObj[x].imgsrc = this.refQuesObj[x].imgsrc_original;
        this.refQuesObj[x].position = "top";
      }
      //this.orginalArray = [];
      for (let i = 0; i < this.refQuesObj.length; i++) {
        this.originalArray.push(this.refQuesObj[i]);
      }
      this.refcpyArray = this.originalArray.slice();
      for (var i = 0; i < this.refcpyArray.length; i++) {
        this.indexArray.push(i);
        this.fetchAnswer.push(i);
      }
      this.optionObj = this.fetchedcontent.optionObj;
      for (let x = 0; x < this.optionObj.length; x++) {
        this.optionObj[x].placed = false;
      }
      this.optionCommonAssets = this.fetchedcontent.option_common_assets;
      console.log(this.optionCommonAssets);
      this.feedbackObj = this.fetchedcontent.feedback;
      this.correctImg = this.feedbackObj.popup_commmon_imgs.correctimg;
      this.incorrectImg = this.feedbackObj.popup_commmon_imgs.incorrectimg;
       this.confirmPopupAssets = this.fetchedcontent.feedback.confirm_popup;
      this.infoPopupAssets = this.fetchedcontent.feedback.info_popup;
      this.submitPopupAssets = this.fetchedcontent.feedback.submit_popup;
      this.replayconfirmAssets = this.fetchedcontent.feedback.replay_confirm;
      this.quesObj = this.fetchedcontent.quesObj;
      this.controlHandler = {
        isSubmitRequired: this.quesObj.submitRequired,
        isReplayRequired: this.quesObj.replayRequired
      }
      if (this.quesObj.questype == "image") {
        this.quesFlag = true;
      } else {
        this.quesFlag = false;
      }
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

  /*hoveronSubmitDecline() {
    this.submitPopupAssets.decline_btn = this.submitPopupAssets.decline_btn_hover;
  }

  houtonSubmitDecline() {
    this.submitPopupAssets.decline_btn = this.submitPopupAssets.decline_btn_original;
  }*/

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

  //this function triggers on to show the popup 
  showFeedback(id: string, flag: string) {
    if (id == "submit-modal-id") {
      this.submitModalRef.nativeElement.classList = "modal";
    }
    if (id == "info-modal-id") {
      this.blinkHolder();
      this.infoModalRef.nativeElement.classList = "modal";
      if (this.feedbackInfoAudio && !this.feedbackInfoAudio.nativeElement.paused) {
        this.feedbackInfoAudio.nativeElement.pause();
        this.feedbackInfoAudio.nativeElement.currentTime = 0;
      }
    }
    if (flag == "yes") {
      if (this.countofAnimation != this.originalArray.length) {
        this.infoModalRef.nativeElement.classList = "displayPopup modal";
        let partialFeedbackAudio = this.infoPopupAssets.partialCorrectAudio;
        this.feedbackInfoAudio.nativeElement.src = partialFeedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
        this.feedbackInfoAudio.nativeElement.play();
        this.appModel.notifyUserAction();
      } else {
        //setTimeout(() => {
        this.appModel.invokeTempSubject('showModal', 'submit');
        //}, 10);
      }
    } else {
      this.appModel.notifyUserAction();
    }
  }

  dontshowFeedback(id: string, flag: string) {
    this.blinkHolder();
    if (id == "submit-modal-id") {
      this.submitModalRef.nativeElement.classList = "modal";
      this.disableoptions = false;
      this.appModel.enableSubmitBtn(true);
      this.appModel.notifyUserAction();
      for (let i = 0; i < this.refcpyArray.length; i++) {
        this.refQues.nativeElement.children[i].children[0].src = this.refcpyArray[i].imgsrc_original.url;
      }
     }
  }

  //with the use of set feedback function we assign all the images in popup according to submit option we assign header image in popup 
  setFeedback() {
    this.noOfRightAnsClicked = 0
    this.noOfWrongAnsClicked = 0
    for (let x = 0; x < this.fetchAnswer.length; x++) {
      if (this.feedbackObj.correct_ans_index[x].id == this.fetchAnswer[x].id) {
        console.log("RIGHT ANSWER");
        this.noOfRightAnsClicked++;
        this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[0].src = this.correctImg.url;
        this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[1].src = this.fetchAnswer[x].imgsrc.url;
        this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[1].classList.value = "img-fluid optItempopUp";
      } else {
        console.log("WRONG ANSWER");
        this.appModel.enableSubmitBtn(false)
        this.noOfWrongAnsClicked++;
        this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[0].src = this.incorrectImg.url;
        this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[1].src = this.fetchAnswer[x].imgsrc.url;
        this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[1].classList.value = "img-fluid optItempopUp";
      }
    }
    if (this.noOfRightAnsClicked > 0 && this.noOfWrongAnsClicked > 0) {
      for (let x = 0; x < this.fetchAnswer.length; x++) {
        if (this.feedbackObj.correct_ans_index[x].id == this.fetchAnswer[x].id) {
          console.log('RIGHT ANSWER');
          this.popupBodyRef.nativeElement.children[0].children[x].children[0].children[0].src = this.optionObj[x].imgsrc_right.url;
          this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[1].src = this.fetchAnswer[x].imgsrc_right.url;
        } else {
          console.log('WRONG ANSWER');
          this.popupBodyRef.nativeElement.children[0].children[x].children[0].children[0].src = this.optionObj[x].imgsrc_wrong.url;
          this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[1].src = this.fetchAnswer[x].imgsrc_wrong.url;
        }
      }
    }

    if (this.noOfRightAnsClicked > 0 && this.noOfWrongAnsClicked > 0) {
      if (this.feedbackObj.partialIncorrAnswerpopupTxt.required) {
        this.AnswerpopupTxt = true;
        this.popupHeader = this.feedbackObj.partialIncorrAnswerpopupTxt.url;

      } else {
        this.AnswerpopupTxt = false;

      }
      this.rightanspopUpheader_img = true;
      this.wronganspopUpheader_img = false;
      this.showanspopUpheader_img = false;
      this.partialCorrectheaderTxt_img = false;
      this.attemptType = 'manual';
      this.styleHeaderPopup = this.feedbackObj.partial_style_header;
      this.styleBodyPopup = this.feedbackObj.partial_style_body;
    } else if (this.fetchAnswer.length == this.noOfRightAnsClicked) {
      for (let x = 0; x < this.fetchAnswer.length; x++) {
        this.popupBodyRef.nativeElement.children[0].children[x].children[0].children[0].src = this.optionObj[x].imgsrc_original.url;
        this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[1].src = this.fetchAnswer[x].imgsrc_original.url;
      }
      if (this.feedbackObj.rightAnswerpopupTxt.required) {
        this.AnswerpopupTxt = true;
        this.popupHeader = this.feedbackObj.rightAnswerpopupTxt.url;

      } else {
        this.AnswerpopupTxt = false;

      }
      this.rightanspopUpheader_img = true;
      this.wronganspopUpheader_img = false;
      this.showanspopUpheader_img = false;
      this.partialCorrectheaderTxt_img = false;
      this.attemptType = 'manual';
      this.styleHeaderPopup = this.feedbackObj.style_header;
      this.styleBodyPopup = this.feedbackObj.style_body;
    } else if (this.fetchAnswer.length == this.noOfWrongAnsClicked) {
      for (let x = 0; x < this.fetchAnswer.length; x++) {
        this.popupBodyRef.nativeElement.children[0].children[x].children[0].children[0].src = this.optionObj[x].imgsrc_original.url;
        this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[1].src = this.fetchAnswer[x].imgsrc_original.url;
      }
      if (this.feedbackObj.wrongAnswerpopupTxt.required) {
        this.AnswerpopupTxt = true;
        this.popupHeader = this.feedbackObj.wrongAnswerpopupTxt.url;

      } else {
        this.AnswerpopupTxt = false;

      }
      this.rightanspopUpheader_img = false;
      this.wronganspopUpheader_img = true;
      this.showanspopUpheader_img = false;
      this.partialCorrectheaderTxt_img = false;
      this.attemptType = 'wrong';
      this.styleHeaderPopup = this.feedbackObj.wrong_style_header;
      this.styleBodyPopup = this.feedbackObj.wrong_style_body;
    } else {
      this.rightanspopUpheader_img = false;
      this.wronganspopUpheader_img = false;
      this.showanspopUpheader_img = false;
      this.partialCorrectheaderTxt_img = true;
      this.attemptType = 'partial';
      this.styleHeaderPopup = this.feedbackObj.style_header;
      this.styleBodyPopup = this.feedbackObj.style_body;
    }
    this.setplayFeedbackAudio(0);
  }

  setRightFeedback() {
    for (let x = 0; x < this.feedbackObj.correct_ans_index.length; x++) {
      this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[0].src = this.correctImg.url;
      this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[1].src = this.feedbackObj.correct_ans_index[x].imgsrc.url;
      this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[1].classList.value = "img-fluid optItempopUp";
    }
    this.setplayrightFeedbackAudio(0);
  }

  setplayFeedbackAudio(i: number) {
    let current = i;
    if (this.fetchAnswer[i] && (this.fetchAnswer[i].correctAudio || this.fetchAnswer[i].incorrectAudio)) {
      if (this.feedbackObj.correct_ans_index[i].id == this.fetchAnswer[i].id) {
        if (this.fetchAnswer[i] && this.fetchAnswer[i].correctAudio) {
          this.feedbackAudio = this.fetchAnswer[i].correctAudio;
          this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
          console.log(this.feedbackPopupAudio.nativeElement.src);
        }
      } else {
        if (this.fetchAnswer[i] && this.fetchAnswer[i].incorrectAudio) {
          this.feedbackAudio = this.fetchAnswer[i].incorrectAudio;
          this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
          console.log(this.feedbackPopupAudio.nativeElement.src);
        }
      }
      this.feedbackPopupAudio.nativeElement.play();
      if (this.popupBodyRef && this.popupBodyRef.nativeElement && this.popupBodyRef.nativeElement.children[0].children[i].children[0]) {
        this.popupBodyRef.nativeElement.children[0].children[i].children[0].classList = "optionAnimate";
      }
      this.feedbackPopupAudio.nativeElement.onended = () => {
        this.popupBodyRef.nativeElement.children[0].children[i].children[0].classList = " ";
        ++current;
        this.setplayFeedbackAudio(current);
      }
    } else {
      this.showAnsTimer = setTimeout(() => {
        if (this.countofAnimation == this.noOfRightAnsClicked) {
          if(!this.closeClicked){
          this.matched = true;
          console.log('happy animation' + this.closeClicked);
          this.closeModal();
          this.appModel.notifyUserAction();
          this.disableSection = true;
          this.disableBody = true;
          this.appModel.enableSubmitBtn(false);
          }
        } else {
          if(!this.closeClicked){
            console.log('Sad animation 1' + this.closeClicked);
            this.closeModal();
          }
         
        }
      }, this.showAnsTimeout)
    }
  }

  setplayrightFeedbackAudio(i: number) {
    let current = i;
    if (this.feedbackObj.correct_ans_index[i] && this.feedbackObj.correct_ans_index[i].correctAudio) {
      this.feedbackAudio = this.feedbackObj.correct_ans_index[i].correctAudio;
      this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
      console.log(this.feedbackPopupAudio.nativeElement.src);
      this.feedbackPopupAudio.nativeElement.play();
      if (this.popupBodyRef && this.popupBodyRef.nativeElement && this.popupBodyRef.nativeElement.children[0].children[i].children[0]) {
        this.popupBodyRef.nativeElement.children[0].children[i].children[0].classList = "optionAnimate";
      }
      this.feedbackPopupAudio.nativeElement.onended = () => {
        this.popupBodyRef.nativeElement.children[0].children[i].children[0].classList = " ";
        ++current;
        this.setplayrightFeedbackAudio(current);
      }
    } else {
      setTimeout(() => {
        this.appModel.enableReplayBtn(false);
        this.closeModal();
      }, this.showAnsTimeout)
    }
  }

  playrightFeedbackAudioPopup(i) {
    let current = i;
    if (this.rightansArray1.length > 0) {
      if (this.rightansArray1[i] && this.rightansArray1[i].imgrightfeedback_audio) {
        this.feedbackAudio = this.rightansArray1[i].imgrightfeedback_audio;
        this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
        console.log(this.feedbackPopupAudio.nativeElement.src);
        this.feedbackPopupAudio.nativeElement.play();
        if (this.popupBodyRef && this.popupBodyRef.nativeElement && this.popupBodyRef.nativeElement.children[0].children[i]) {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " optionAnimate";
        }
        this.feedbackPopupAudio.nativeElement.onended = () => {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.remove("optionAnimate");
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " nutralize";
          ++current;
          this.playrightFeedbackAudioPopup(current);
        }
      } else {
        this.playrightFeedbackAudioPopupforSecondrow(0);
      }
    } else {
      if (this.ansArray1[i] && this.ansArray1[i].imgrightfeedback_audio) {
        this.feedbackAudio = this.ansArray1[i].imgrightfeedback_audio;
        this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
        console.log(this.feedbackPopupAudio.nativeElement.src);
        this.feedbackPopupAudio.nativeElement.play();
        if (this.popupBodyRef && this.popupBodyRef.nativeElement && this.popupBodyRef.nativeElement.children[0].children[i]) {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " optionAnimate";
        }
        this.feedbackPopupAudio.nativeElement.onended = () => {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.remove("optionAnimate");
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " nutralize";
          ++current;
          this.playrightFeedbackAudioPopup(current);
        }
      } else {
        setTimeout(() => {
          this.closeModal();
        }, 2000);
        this.blinkOnLastQues();
        this.appModel.moveNextQues();
      }
    }

  }
  playrightFeedbackAudioPopupforSecondrow(i) {
    let current = i;
    if (this.rightansArray2[i] && this.rightansArray2[i].imgrightfeedback_audio) {
      this.feedbackAudio = this.rightansArray2[i].imgrightfeedback_audio;
      this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
      console.log(this.feedbackPopupAudio.nativeElement.src);
      this.feedbackPopupAudio.nativeElement.play();
      if (this.popupBodyRef && this.popupBodyRef.nativeElement && this.popupBodyRef.nativeElement.children[1].children[i]) {
        this.popupBodyRef.nativeElement.children[1].children[i].classList.value += " optionAnimate";
      }
      this.feedbackPopupAudio.nativeElement.onended = () => {
        this.popupBodyRef.nativeElement.children[1].children[i].classList.remove("optionAnimate");
        this.popupBodyRef.nativeElement.children[1].children[i].classList.value += " nutralize";
        ++current;
        this.playrightFeedbackAudioPopupforSecondrow(current);
      }
    } else {
      setTimeout(() => {
        this.closeModal();
      }, 2000);
      this.blinkOnLastQues();
      this.appModel.moveNextQues();
    }
  }
  playrightFeedbackAudioforPartialPopup(i) {
    let current = i;
    if (this.rightansArray[i] && this.rightansArray[i].imgrightfeedback_audio) {
      this.feedbackAudio = this.rightansArray[i].imgrightfeedback_audio;
      this.feedbackpartialPopupAudio.nativeElement.src = this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
      console.log(this.feedbackpartialPopupAudio.nativeElement.src);
      this.feedbackpartialPopupAudio.nativeElement.play();
      if (this.partialpopupBodyRef && this.partialpopupBodyRef.nativeElement && this.partialpopupBodyRef.nativeElement.children[0].children[1].children[i]) {
        this.partialpopupBodyRef.nativeElement.children[0].children[1].children[i].classList.value += " optionAnimate";
      }
      this.feedbackpartialPopupAudio.nativeElement.onended = () => {
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
      this.feedbackpartialPopupAudio.nativeElement.src = this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
      console.log(this.feedbackpartialPopupAudio.nativeElement.src);
      this.feedbackpartialPopupAudio.nativeElement.play();
      if (this.partialpopupBodyRef && this.partialpopupBodyRef.nativeElement && this.partialpopupBodyRef.nativeElement.children[1].children[1].children[i]) {
        this.partialpopupBodyRef.nativeElement.children[1].children[1].children[i].classList.value += " optionAnimate";
      }
      this.feedbackpartialPopupAudio.nativeElement.onended = () => {
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

  //Post submit we reset all the options using this function
  resetAttempt() {
    for (var i = 0; i < this.refcpyArray.length; i++) {
      this.optionObj[i].placed = false;
      this.refcpyArray[i].position = "top";
      this.refQues.nativeElement.children[i].children[0].style.visibility = "";
      this.optionsBlock.nativeElement.children[0].children[i].children[1].children[1].classList.value = "img-fluid optItem";
      this.optionsBlock.nativeElement.children[0].children[i].children[1].children[0].src = this.optionObj[i].dropBoxImg_original.url;
      for (let i = 0; i < this.refQuesObj.length; i++) {
        this.refQuesObj[i].isOpen = true;
        this.refQuesObj[i].leftPos = 0 + 'px';
        this.refQuesObj[i].topPos = 0 + 'px';
      }
    }
    this.appModel.enableReplayBtn(true);
    this.countofAnimation = 0;
    this.noOfRightAnsClicked = 0;
    clearInterval(this.blinkTimeInterval);
    this.index1 = 0;
    this.startCount = 1;
    this.blinkHolder();
    //this.appModel.enableReplayBtn(true);
  }

  //this is for playing feedback audio after submitting the options 
  playFeedbackAudio(i, j, flag) {
    if (this.popupBodyRef.nativeElement.children[0].children[i] != undefined && !flag) {
      if ((this.noOfRightAnsClicked == this.feedback.correct_ans_index.length) && this.noOfWrongAnsClicked == 0) {
        if (this.ansArray1.length > 0) {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " optionAnimate optionsWidth";
          this.popupBodyRef.nativeElement.children[0].children[i].children[1].src = this.ansArray1[i].imgrightfeedback_audio.url;
        }

        if (this.AnsObj.length > 0) {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " optionAnimate";
          this.popupBodyRef.nativeElement.children[0].children[i].children[1].src = this.AnsObj[0][i].imgrightfeedback_audio.url;
        }
        this.popupBodyRef.nativeElement.children[0].children[i].children[1].load();
        this.popupBodyRef.nativeElement.children[0].children[i].children[1].play();
        this.popupBodyRef.nativeElement.children[0].children[i].children[1].onended = () => {
          if (this.ansArray1.length > 0) {
            this.popupBodyRef.nativeElement.children[0].children[i].classList.remove("optionAnimate");
            this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " nutralize";
          }
          if (this.AnsObj.length > 0) {
            this.popupBodyRef.nativeElement.children[0].children[i].classList.remove("optionAnimate");
            this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " nutralize";
          }
          i++;
          this.playFeedbackAudio(i, undefined, false);
        }
      }
      if (this.noOfRightAnsClicked == 0 && this.noOfWrongAnsClicked > 0) {
        this.disableoptionsBlock = false;
        if (this.ansArray1.length > 0) {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " optionAnimate optionsWidth";
          this.popupBodyRef.nativeElement.children[0].children[i].children[1].src = this.ansArray1[i].imgwrongfeedback_audio.url;
        }
        if (this.AnsObj.length > 0) {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " optionAnimate";
          this.popupBodyRef.nativeElement.children[0].children[i].children[1].src = this.AnsObj[0][i].imgwrongfeedback_audio.url;
        }

        this.popupBodyRef.nativeElement.children[0].children[i].children[1].load();
        this.popupBodyRef.nativeElement.children[0].children[i].children[1].play();
        this.popupBodyRef.nativeElement.children[0].children[i].children[1].onended = () => {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.remove("optionAnimate");
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " nutralize";
          i++;
          this.playFeedbackAudio(i, undefined, false);
        }
      }
    } else if (this.noOfRightAnsClicked > 4 || this.noOfWrongAnsClicked > 4) {
      flag = true;
      if (j == undefined) {
        j = 0;
      }
      this.disableoptionsBlock = false;
      if (this.popupBodyRef.nativeElement.children[1].children[j] != undefined && flag) {
        this.popupBodyRef.nativeElement.children[1].children[j].classList.value += " optionAnimate";
        if ((this.noOfRightAnsClicked == this.feedback.correct_ans_index.length) && this.noOfWrongAnsClicked == 0) {
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].src = this.AnsObj[1][j].imgrightfeedback_audio.url;
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].load();
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].play();
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].onended = () => {
            this.popupBodyRef.nativeElement.children[1].children[j].classList.remove("optionAnimate");
            this.popupBodyRef.nativeElement.children[1].children[j].classList.value += " nutralize";
            j++;
            this.playFeedbackAudio(j, j, true);
          }
        }
        if (this.noOfRightAnsClicked == 0 && this.noOfWrongAnsClicked > 0) {
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].src = this.AnsObj[1][j].imgwrongfeedback_audio.url;
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].load();
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].play();
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].onended = () => {
            this.popupBodyRef.nativeElement.children[1].children[j].classList.remove("optionAnimate");
            this.popupBodyRef.nativeElement.children[1].children[j].classList.value += " nutralize";
            j++;
            this.playFeedbackAudio(j, j, true);
          }
        }
      } else {
        setTimeout(() => {
          this.closeModal();
        }, 2000);
      }

    } else {
      setTimeout(() => {
        if (!(this.noOfRightAnsClicked == 0 && this.noOfWrongAnsClicked > 0)) {
          this.appModel.enableSubmitBtn(false)
          this.blinkOnLastQues();
        }
        this.closeModal();
      }, 2000);
      //this.blinkOnLastQues();
    }
  }

  //this function triggers on close button and yes no from confirmation popups
  sendFeedback(id: string, flag: string) {
    this.confirmModalRef.nativeElement.classList = "modal";
    this.noOfRightAnsClicked = 0;
    this.noOfWrongAnsClicked = 0;
    if (flag == "yes") {
      this.bodyContentSection.nativeElement.style.opacity = 0.3;
      this.instructionBar.nativeElement.style.opacity = 0.3;

      this.disableBody = true;
      setTimeout(() => {
        this.appModel.invokeTempSubject('showModal', 'manual');
        this.appModel.resetBlinkingTimer();
      }, 100);

      this.disableSection = true;
      this.appModel.enableSubmitBtn(false);
      this.checked = true;
      if (this.feedbackObj.showAnswerpopupTxt.required) {
        this.AnswerpopupTxt = true;
        this.popupHeader = this.feedbackObj.showAnswerpopupTxt.url;
      } else {
        this.AnswerpopupTxt = false;
      }
      for (let x = 0; x < this.fetchAnswer.length; x++) {
        this.popupBodyRef.nativeElement.children[0].children[x].children[0].children[0].src = this.optionObj[x].imgsrc_original.url;
      }
    } else {
      this.appModel.notifyUserAction();
      this.disableSection = false;
    }
    this.blinkHolder();
  }

  //this will trigger on replay confirmation yes and No button
  showReplay(ref, flag: string, action?: string) {
    this.blinkHolder();
    ref.classList = "modal";
    this.appModel.navShow = 1;
    this.appModel.notifyUserAction();
    if (flag == "yes") {
      if (action == "replay") {
          this.appModel.videoStraming(true);
        this.replayVideo();
      }
    } else if (flag == "no") {
      this.appModel.videoStraming(false);
      this.appModel.navShow = 2;
      setTimeout(() => {
        this.disableSection = false;
        this.disableoptions = false;
      }, 1000);
    }
  }

  //this will trigger once user will click replay video button 
  replayVideo() {
    this.appModel.navShow = 1;
    this.videoReplayd = true;
    this.isPlayVideo = true;
    this.appModel.enableSubmitBtn(false);
    this.disableoptions = true;
    this.disableSection = true;
    setTimeout(() => {
      this.mainVideo.nativeElement.play();
      this.mainVideo.nativeElement.onended = () => {
        for (let i = 0; i < this.refQuesObj.length; i++) {
          if (this.refQuesObj[i].position == "down") {
              this.appModel.enableSubmitBtn(true);
          }
        }
        this.disableoptions = false;
        this.disableSection = false;
        this.appModel.navShow = 2;
        this.isPlayVideo = false;
        this.appModel.videoStraming(false);
        this.appModel.notifyUserAction();
        this.disableoptions = true;
        this.disableinstructionBar = true;
        setTimeout(() => {
        this.disableoptions = false;
        this.disableinstructionBar = false;
      }, 500)
      }
    }, 500)
  }

  resetBlinker() {
    clearInterval(this.blinkTimeInterval);
    this.refcpyArray[this.index1].imgsrc = this.refcpyArray[this.index1].imgsrc_original;
  }

  //this function will trigger every time whwn any modal will close
  closeModal() {
    
  this.closeClicked = true;
  console.log('Sad animation 2' + this.closeClicked);
    //this loop will assign initial position of numbers after closing the popup
    for (let i = 0; i < this.refQuesObj.length; i++) {
      this.refQuesObj[i].isOpen = true;
      this.refQuesObj[i].leftPos = 0 + 'px';
      this.refQuesObj[i].topPos = 0 + 'px';
    }
    this.appModel.enableReplayBtn(false);
    for (let i = 0; i < this.popupBodyRef.nativeElement.children[0].children.length; i++) {
      this.popupBodyRef.nativeElement.children[0].children[i].children[0].classList.value = "";
    }
    if (this.countofAnimation == this.noOfRightAnsClicked) {
      this.matched = true;
      this.disableSection = true;
      this.instructionBar.nativeElement.style.opacity = 0.3;
      this.bodyContentSection.nativeElement.style.opacity = 0.3;

      this.disableBody = true;
      this.appModel.enableSubmitBtn(false);
    }
    if (this.feedbackPopupAudio && !this.feedbackPopupAudio.nativeElement.paused) {
      this.feedbackPopupAudio.nativeElement.pause();
      this.feedbackPopupAudio.nativeElement.currentTime = 0;

    }
    this.popupRef.nativeElement.classList = "modal";

    this.infoModalRef.nativeElement.classList = "modal";

    this.appModel.notifyUserAction();

    if (this.matched) {
      this.blinkOnLastQues();
    }

    if (!this.matched) {
      setTimeout(() => {
        this.appModel.wrongAttemptAnimation();
        this.disableSection = false;
        this.disableoptions = false;
      }, 10);
    }

  }
}


