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
  selector: 'ntemp18',
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
  templateUrl: './Ntemplate18.component.html',
  styleUrls: ['./Ntemplate18.component.css', '../../../view/css/bootstrap.min.css'],

})

export class Ntemplate18 implements OnInit, OnDestroy, AfterViewChecked {
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
  @ViewChild('instruction') instruction: any;
  @ViewChild('optionAudio') optionAudio: any;
  @ViewChild('confirmModalRef') confirmModalRef: any;
  @ViewChild('submitModalRef') submitModalRef: any;
  @ViewChild('infoModalRef') infoModalRef: any;
  @ViewChild('popupRef') popupRef: any;
  @ViewChild('popupBodyRef') popupBodyRef: any;
  @ViewChild('feedbackPopupAudio') feedbackPopupAudio: any;
  @ViewChild('feedbackpartialPopupAudio') feedbackpartialPopupAudio: any;
  @ViewChild('partialpopupBodyRef') partialpopupBodyRef: any;
  @ViewChild('confirmReplayRef') confirmReplayRef: any;
  @ViewChild('mainVideo') mainVideo: any;
  @ViewChild('feedbackInfoAudio') feedbackInfoAudio: any;
  @ViewChild('refQues') refQues: any;
  @ViewChild('instructionBarTop') instructionBar: any
  @ViewChild('bodyContent') bodyContentSection: any;
  @ViewChild('onlyOneAttemptModalRef') onlyOneAttemptModalRef: any;
  @ViewChild('feedbackoneAttemptAudio') feedbackoneAttemptAudio: any;
  @ViewChild('modaldialog') modaldialog: any;
  
  attemptType: any;
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
  isAllowed: boolean = true;
  ifStopped: boolean = false;
  helpAudio: any = "";
  correctOpt: any;
  idArray: any = [];
  noOfRightAnsClicked: number = 0;
  noOfWrongAnsClicked: number = 0;
  rightansArray: any = [];
  rightansArray1: any = [];
  rightansArray2: any = [];
  wrongansArray1: any = [];
  wrongansArray2: any = [];
  AnsObj: any = [];
  ansArray1: any = [];
  Array2required: boolean = false;
  partialpopupRequired: boolean = false;
  wrongansArray: any = [];
  isFirstQues: boolean;
  isLastQues: boolean = false;
  isAutoplayOn: boolean;
  isLastQuesAct: boolean;

  noOfImgs: number;
  noOfImgsLoaded: number = 0;
  loaderTimer: any;
  disableHelpBtn: boolean = false;
  containgFolderPath: string = "";
  assetsPath: string = "";
  loadFlag: boolean = false;
  optionObject: any;
  optionObjOriginal: any;
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
  refQuesObj: any;
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
  rightanspopUpheader_img: boolean = false;
  wronganspopUpheader_img: boolean = false;
  showanspopUpheader_img: boolean = false;
  partialCorrectheaderTxt_img: boolean = false;
  styleHeaderPopup: any;
  styleBodyPopup: any;
  PlayPauseFlag: boolean = true;
  fetchedcontent: any;
  functionalityType: any;
  themePath: any;
  showAnsTimeout: any;
  InstructionVo: boolean = false;
  disableSection: boolean = false;
  disableBody: boolean = false;
  controlHandler = {
    isSubmitRequired: false,
    isReplayRequired: false
  };
  showAnsTimer: any;

  showAnsModalPopup: boolean = false
  AnswerpopupTxt: boolean = false;
  SkipLoad: boolean = false;
  disableoptions: boolean = false;
  disableoptionsBlock: boolean = false;
  disableinstructionBar: boolean = false;
  popupHeader: any;
  openWrong: any;
  oneAttemptPopupAssets: any;
  partialCase: boolean = false;
  feedbackaudioTimeout: any;
  ngOnDestroy() {
    clearTimeout(this.showAnsTimer);
    clearInterval(this.blinkTimeInterval);
    clearInterval(this.feedbackaudioTimeout);
    this.startCount = 0;
    for (let i = 0; i < this.refcpyArray.length; i++) {
      this.refQues.nativeElement.children[i].children[0].src = this.refcpyArray[i].imgsrc_original.url;
    }
    this.index1 = 0;
  }

  ngAfterViewChecked() {
    this.templatevolume(this.appModel.volumeValue, this);
  }

  ngOnInit() {
    if (this.appModel.isNewCollection) {
      this.appModel.event = { 'action': 'segmentBegins' };
    }
    this.containgFolderPath = this.getBasePath();
    this.appModel.functionone(this.templatevolume, this);
    this.appModel.functionone(this.templatevolume, this);//start end
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
      if (mode == 'manual') {
        //show modal for manual
        this.matched = true;

        this.rightanspopUpheader_img = false;
        this.wronganspopUpheader_img = false;
        this.showanspopUpheader_img = true;
        this.partialCorrectheaderTxt_img = false;
        this.styleHeaderPopup = this.feedbackObj.style_header;
        this.styleBodyPopup = this.feedbackObj.style_body;
        this.startCount = 0;
        this.attemptType = 'showAnswer';
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          this.disableSection = true;
          this.popupRef.nativeElement.classList = 'displayPopup modal';
          this.setRightFeedback();
        }
      } else if (mode == 'auto') {
        this.appModel.enableSubmitBtn(false);
        this.matched = true;
        for (let x = 0; x < this.fetchAnswer.length; x++) {
          this.popupBodyRef.nativeElement.children[0].children[x].children[0].children[0].src = this.optionObject[x].imgsrc_original.url;
          //// this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[1].src = this.fetchAnswer[x].imgsrc_original.url;
        }
        if (this.feedbackObj.showAnswerpopupTxt.required) {
          this.AnswerpopupTxt = true;
          this.popupHeader = this.feedbackObj.showAnswerpopupTxt.url;
        } else {
          this.AnswerpopupTxt = false;
        }
        //show modal of auto
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          this.disableSection = true;
          this.instructionBar.nativeElement.style.opacity = 0.3;
          this.disableinstructionBar = true;
          this.disableBody = true;
          this.bodyContentSection.nativeElement.style.opacity = 0.3;
          this.checked = true;
          this.rightanspopUpheader_img = false;
          this.wronganspopUpheader_img = false;
          this.showanspopUpheader_img = true;
          this.startCount = 0;
          this.attemptType = 'showAnswer';
          this.partialCorrectheaderTxt_img = false;
          this.styleHeaderPopup = this.feedbackObj.style_header;
          this.styleBodyPopup = this.feedbackObj.style_body;
          this.confirmModalRef.nativeElement.classList = 'modal';
          this.confirmReplayRef.nativeElement.classList = 'modal';
          this.onlyOneAttemptModalRef.nativeElement.classList = 'modal';
          this.submitModalRef.nativeElement.classList = 'modal';
          this.popupRef.nativeElement.classList = 'displayPopup modal';
          this.noOfRightAnsClicked = 0;
          this.noOfWrongAnsClicked = 0;
          this.setRightFeedback();
        }
      } else if (mode == 'submit') {
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          this.disableSection = true;
          ////this.setFeedback();
          this.popupRef.nativeElement.classList = 'displayPopup modal';
        }
      }
    })


    this.appModel.getConfirmationPopup().subscribe((action) => {
      this.appModel.notifyUserAction();
      if (action == 'uttarDikhayein') {
        this.resetBlinker();
        ////this.appModel.resetReplayBtn(true);
        for (let x = 0; x < this.optionsBlock.nativeElement.children[0].children.length; x++) {
          this.optionsBlock.nativeElement.children[0].children[x].children[0].children[1].pause();
          this.optionsBlock.nativeElement.children[0].children[x].children[0].children[1].currentTime = 0;
        }
        for (let x = 0; x < this.optionsBlock.nativeElement.children[0].children.length; x++) {
          this.optionsBlock.nativeElement.children[0].children[x].children[0].children[0].style.pointerEvents = '';
        }
        if (!this.instruction.nativeElement.paused) {
          this.instruction.nativeElement.pause();
          this.instruction.nativeElement.currentTime = 0;
          this.ifStopped = true;
        }
        if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
          this.disableSection = true;
          this.confirmModalRef.nativeElement.classList = 'displayPopup modal';
        }
      }
      if (action == 'submitAnswer') {
        this.resetBlinker();
        for (let x = 0; x < this.optionsBlock.nativeElement.children[0].children.length; x++) {
          this.optionsBlock.nativeElement.children[0].children[x].children[0].children[1].pause();
          this.optionsBlock.nativeElement.children[0].children[x].children[0].children[1].currentTime = 0;
        }
        for (let x = 0; x < this.optionsBlock.nativeElement.children[0].children.length; x++) {
          this.optionsBlock.nativeElement.children[0].children[x].children[0].children[0].style.pointerEvents = '';
        }
        if (!this.instruction.nativeElement.paused) {
          this.ifStopped = true;
          this.instruction.nativeElement.pause();
          this.instruction.nativeElement.currentTime = 0;
        }
        this.submitModalRef.nativeElement.classList = 'displayPopup modal';
      }
      if (action == 'replayVideo') {
        this.resetBlinker();
        //// this.appModel.resetReplayBtn(true);
        for (let x = 0; x < this.optionsBlock.nativeElement.children[0].children.length; x++) {
          this.optionsBlock.nativeElement.children[0].children[x].children[0].children[1].pause();
          this.optionsBlock.nativeElement.children[0].children[x].children[0].children[1].currentTime = 0;
        }
        for (let x = 0; x < this.optionsBlock.nativeElement.children[0].children.length; x++) {
          this.optionsBlock.nativeElement.children[0].children[x].children[0].children[0].style.pointerEvents = '';
        }
        this.SkipLoad = true;
        if (!this.instruction.nativeElement.paused) {
          this.ifStopped = true;
          this.instruction.nativeElement.pause();
          this.instruction.nativeElement.currentTime = 0;
        }

        if (this.confirmReplayRef && this.confirmReplayRef.nativeElement) {
          this.disableoptions = true;
          this.confirmReplayRef.nativeElement.classList = 'displayPopup modal';
          this.PlayPauseFlag = true;
          this.quesObj.quesPlayPause = this.quesObj.quesPause;
          this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
        }
      }
    })

    this.appModel.questionEvent.subscribe(() => {
      if (this.rightanspopUp) {
        console.log('timer still exist');
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
    this.appModel.resetBlinkingTimer()
  }

  resetBlinker() {
    clearInterval(this.blinkTimeInterval);
    this.refcpyArray[this.index1].imgsrc = this.refcpyArray[this.index1].imgsrc_original;
  }

  //click instruction bar to play instruction
  playHoverInstruction() {

    for (let x = 0; x < this.optionsBlock.nativeElement.children[0].children.length; x++) {

      this.optionsBlock.nativeElement.children[0].children[x].children[0].children[1].currentTime = 0;
      this.optionsBlock.nativeElement.children[0].children[x].children[0].children[1].pause();
      this.optionsBlock.nativeElement.children[0].children[x].children[0].children[0].style.pointerEvents = '';

    }

    if (!this.narrator.nativeElement.paused!) {
      console.log('narrator/instruction voice still playing');
    } else {
      this.appModel.notifyUserAction();
      ////clearInterval(this.blinkTimeInterval);
      this.refcpyArray[this.index1].imgsrc = this.refcpyArray[this.index1].imgsrc_original;
      //this.startCount = 0;
      console.log("play on Instruction");
      if (this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.play();
        this.disableSection = true;
        this.instruction.nativeElement.onended = () => {
          clearInterval(this.blinkTimeInterval);
          this.startActivity();
          this.disableSection = false;
        }
        this.InstructionVo = true;
      }
      if (this.refQues.optionType == 'image') {
        if (!this.optionAudio.nativeElement.paused) {
          this.instruction.nativeElement.currentTime = 0;
          this.instruction.nativeElement.pause();
        }
      }
    }
  }

  //Hover options to run the hover functanality 
  playHoverOption(opt, i) {
    //this.disableSection = false;
    if (!this.instruction.nativeElement.paused) {
      this.instruction.nativeElement.pause();
      this.instruction.nativeElement.currentTime = 0;
      ////this.startActivity();
      this.startCount = 1;
    }
    this.appModel.notifyUserAction();
    if (this.optionsBlock.nativeElement.children[0].children[i].children[0].children[1].paused && this.narrator.nativeElement.paused) {
      if (opt.imgsrc_audio && opt.imgsrc_audio.location == 'content') {
        this.optionsBlock.nativeElement.children[0].children[i].children[0].children[1].src = opt.imgsrc_audio.url;
      } else {
        this.optionsBlock.nativeElement.children[0].children[i].children[0].children[1].src = opt.imgsrc_audio.url;
      }
      this.optionsBlock.nativeElement.children[0].children[i].children[0].children[1].load();
      if (!this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.pause();
      }
      this.optionsBlock.nativeElement.children[0].children[i].children[0].children[1].volume = this.appModel.isMute ? 0 : this.appModel.volumeValue;
      this.optionsBlock.nativeElement.children[0].children[i].children[0].children[1].play();
      this.disableSection = false;

      for (let x = 0; x < this.optionsBlock.nativeElement.children[0].children.length; x++) {
        if (x != i) {
          this.optionsBlock.nativeElement.children[0].children[x].children[0].children[0].style.pointerEvents = 'none';
        }
      }
      this.optionsBlock.nativeElement.children[0].children[i].children[0].children[1].onended = () => {
        //this.disableSection = false;
        for (let x = 0; x < this.optionsBlock.nativeElement.children[0].children.length; x++) {
          if (x != i) {
            this.optionsBlock.nativeElement.children[0].children[x].children[0].children[0].style.pointerEvents = '';
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
    this.optionsBlock.nativeElement.children[0].children[i].children[0].children[0].classList.add('scaleInAnimation');
  }

  onHoverOption(opt, i) {
    if (opt && opt != undefined) {
      if (this.narrator.nativeElement.paused) {
        if (opt.imgsrc && opt.imgsrc.location == 'content') {
          this.optionsBlock.nativeElement.children[0].children[i].children[1].children[0].src = opt.dropBoxImgHover.url;
        } else {
          this.optionsBlock.nativeElement.children[0].children[i].children[1].children[0].src = opt.dropBoxImgHover.url;
        }
      }
    }
  }

  //for hover out from option functanality
  onHoverOptionOut(opt, i) {
    if (opt && opt != undefined) {
      if (opt.imgsrc && opt.imgsrc.location == 'content') {
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

  //this is animation zoom functanality to zoom option on hover
  ZoomOutAnimationoption(opt, i) {
    if (!this.checked && this.narrator.nativeElement.paused) {
      this.optionsBlock.nativeElement.children[0].children[i].children[0].children[0].classList.add('scaleOutAnimation');
      setTimeout(() => {
        this.optionsBlock.nativeElement.children[0].children[i].children[0].children[0].classList.remove('scaleInAnimation');
        this.optionsBlock.nativeElement.children[0].children[i].children[0].children[0].classList.remove('scaleOutAnimation');
      }, 500);

    }
  }

  checkAllowed(idx, placed, opt) {
    this.onClickoption(idx, placed, opt)
  }


  // execute this function on option click
  onClickoption(idx, placed, opt) {

    this.disableoptionsBlock = true;
    setTimeout(() => {
      this.disableoptionsBlock = false;
    }, 1000);
    for (let i = 0; i < this.refQuesObj.length; i++) {

      if (this.refQuesObj[i].position != "top" && opt.placed && this.refQuesObj[i].sequenceNo == opt.sequenceNo) {
        //console.log('action1');
        this.refQuesObj[i].isOpen = !this.refQuesObj[i].isOpen;
        console.log('this is ' + this.refQuesObj[i]);
        this.refQuesObj[i].leftPos = 0 + 'px';
        this.refQuesObj[i].topPos = 0 + 'px';

      } else if (this.refQuesObj[i].position != "top") {
        //console.log('action3');
        this.refQuesObj[i].isOpen = true;
      } else {
        //console.log('action2');
        this.refQuesObj[i].isOpen = true;
        this.refQuesObj[i].leftPos = 0 + 'px';
        this.refQuesObj[i].topPos = 0 + 'px';
      }

    }


    if (!this.narrator.nativeElement.paused! || !this.instruction.nativeElement.paused) {
      console.log('narrator/instruction voice still playing');
    } else {
      this.startCount = 0;
      (document.getElementsByClassName('bodyContent')[0] as HTMLElement).style.pointerEvents = 'none';
      this.refcpyArray[this.index1].imgsrc = this.refcpyArray[this.index1].imgsrc_original;
      if (placed) {
        this.optionsBlock.nativeElement.children[0].children[idx].children[1].children[1].classList.value = 'img-fluid optItem';
        this.refQues.nativeElement.children[this.optionObject[idx].sequenceNo - 1].children[0].style.visibility = '';
        this.isAllowed = false;
      
        setTimeout(() => {
        clearInterval(this.blinkTimeInterval);
          this.isAllowed = true
          this.countofAnimation--;
          if (this.countofAnimation == 0) {
            this.appModel.enableSubmitBtn(false);
            this.appModel.enableReplayBtn(true);
          }
          this.optionObject[idx].placed = false;
          this.optionsBlock.nativeElement.children[0].children[idx].children[1].children[0].src = this.optionObject[idx].dropBoxImg_original.url;
          this.refcpyArray[this.optionObject[idx].sequenceNo - 1].position = 'top';
          this.prevIdx = this.index1;
          this.startCount = 1;
          this.blinkHolder();
          setTimeout(() => {
            (document.getElementsByClassName('bodyContent')[0] as HTMLElement).style.pointerEvents = '';
          }, 200);
        }, 400);
        //// });


      } else {
        var a = this.index1;
        this.moveFrom = this.refQues.nativeElement.children[this.index1].children[0].getBoundingClientRect();
        this.moveTo = this.optionsBlock.nativeElement.children[0].children[idx].children[1].children[1].getBoundingClientRect();
        this.moveleft = this.moveTo.left - this.moveFrom.left;
        this.movetop = this.moveTo.top - this.moveFrom.top;
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
          this.optionObject[idx].placed = true;
          this.refcpyArray[this.index1].placedInOption = idx;
          this.optionObject[idx].sequenceNo = this.refcpyArray[this.index1].sequenceNo;
          this.refQues.nativeElement.children[this.index1].children[0].style.cursor = 'pointer';
          this.optionsBlock.nativeElement.children[0].children[idx].children[1].children[0].src = this.optionObject[idx].dropBoxImgHover.url;
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
      this.appModel.notifyUserAction();
    }
  }

  endedHandleronSkip() {
    this.isPlayVideo = false;
    this.disableoptions = false;
    for (let i = 0; i < this.refQuesObj.length; i++) {

      if (this.refQuesObj[i].position == "down") {
        this.appModel.enableSubmitBtn(true);
      }
    }

    this.appModel.navShow = 2;
    this.appModel.videoStraming(false);
    this.appModel.notifyUserAction();

  }

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
  hoverSkip() {
    this.quesObj.quesSkip = this.quesObj.quesSkipHover;
  }
  houtSkip() {
    this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
  }

  hoverPlayPause() {
    if (this.PlayPauseFlag) {
      this.quesObj.quesPlayPause = this.quesObj.quesPauseHover;
    }
    else {
      this.quesObj.quesPlayPause = this.quesObj.quesPlayHover;
    }
  }
  leavePlayPause() {
    if (this.PlayPauseFlag) {
      this.quesObj.quesPlayPause = this.quesObj.quesPauseOriginal;
    }
    else {
      this.quesObj.quesPlayPause = this.quesObj.quesPlayOriginal;
    }
  }

  //this is function to execute the blink
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
      if (this.attemptType == 'manual') {
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
    if (obj.instruction && obj.instruction.nativeElement) {
      obj.instruction.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackpartialPopupAudio && obj.feedbackpartialPopupAudio.nativeElement) {
      obj.feedbackpartialPopupAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackInfoAudio && obj.feedbackInfoAudio.nativeElement) {
      obj.feedbackInfoAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
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

  close() {
    this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
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

  checkforQVO() {

    if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
      this.narrator.nativeElement.src = this.quesObj.quesInstruction.url + '?someRandomSeed=' + Math.random().toString(36);
      this.appModel.handlePostVOActivity(true);
      this.appModel.enableSubmitBtn(false);
      this.appModel.enableReplayBtn(false);
      this.disableBody = true;
      this.narrator.nativeElement.play();
      this.disableoptions = true;
      this.disableinstructionBar = true;
      this.narrator.nativeElement.onended = () => {
        this.InstructionVo = true;
        this.disableBody = false;
        this.disableinstructionBar = false;
        this.isQuesTypeImage = true;
        this.startActivity();
        this.appModel.handlePostVOActivity(false);
        this.appModel.enableReplayBtn(true);
        setTimeout(() => {
          this.disableoptions = false;
        }, 1000);

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
    if (this.refcpyArray[i] && this.refcpyArray[i].imgsrc_blink && this.refcpyArray[i].position == 'top') {
      if (this.blinkFlag) {
        this.refcpyArray[i].imgsrc = this.refcpyArray[i].imgsrc_blink;
        this.blinkFlag = false;
      } else {
        this.refcpyArray[i].imgsrc = this.refcpyArray[i].imgsrc_original;
        this.blinkFlag = true;
      }
    } else {
      ++this.index1;
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
        this.refQuesObj[x].position = 'top';
      }
      for (let i = 0; i < this.refQuesObj.length; i++) {
        this.originalArray.push(this.refQuesObj[i]);
      }
      this.refcpyArray = this.originalArray.slice();
      for (var i = 0; i < this.refcpyArray.length; i++) {
        this.indexArray.push(i);
        this.fetchAnswer.push(i);
      }

      this.optionObjOriginal = JSON.parse(JSON.stringify(this.fetchedcontent.optionObj));
      this.optionObject = JSON.parse(JSON.stringify(this.fetchedcontent.optionObj));
      for (let x = 0; x < this.optionObject.length; x++) {
        this.optionObject[x].placed = false;
      }
      this.optionCommonAssets = this.fetchedcontent.option_common_assets;
      console.log(this.optionCommonAssets);
      this.feedbackObj = this.fetchedcontent.feedback;
      this.correctImg = this.feedbackObj.popup_commmon_imgs.correctimg;
      this.incorrectImg = this.feedbackObj.popup_commmon_imgs.incorrectimg;
      this.rightAnspopupAssets = this.feedbackObj.right_ans_popup;
      this.confirmPopupAssets = this.fetchedcontent.feedback.confirm_popup;
      this.infoPopupAssets = this.fetchedcontent.feedback.info_popup;
      this.submitPopupAssets = this.fetchedcontent.feedback.submit_popup;
      this.replayconfirmAssets = this.fetchedcontent.feedback.replay_confirm;
      this.oneAttemptPopupAssets = this.fetchedcontent.feedback.oneAttempt_popup;
      this.quesObj = this.fetchedcontent.quesObj;
      this.controlHandler = {
        isSubmitRequired: this.quesObj.submitRequired,
        isReplayRequired: this.quesObj.replayRequired
      }
      if (this.quesObj.questype == 'image') {
        this.quesFlag = true;
      } else {
        this.quesFlag = false;
      }
      if (this.quesObj.quesVideo && this.quesObj.quesVideo.autoPlay && !this.appModel.isVideoPlayed) {
        this.isPlayVideo = true;
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
  hoveroneAttemptClosePopup() {
    this.oneAttemptPopupAssets.close_btn = this.oneAttemptPopupAssets.close_btn_hover;
  }

  houtoneAttemptClosePopup() {
    this.oneAttemptPopupAssets.close_btn = this.oneAttemptPopupAssets.close_btn_original;
  }
  hoveroneAttemptOK() {
    this.oneAttemptPopupAssets.ok_btn = this.oneAttemptPopupAssets.ok_btn_hover;
  }

  houtoneAttemptOK() {
    this.oneAttemptPopupAssets.ok_btn = this.oneAttemptPopupAssets.ok_btn_original;
  }
  showFeedback(id: string, flag: string) {
    this.noOfRightAnsClicked = 0;
    this.noOfWrongAnsClicked = 0;

    if (id == "oneAttempt-modal-id") {
      this.onlyOneAttemptModalRef.nativeElement.classList = "modal";
      document.getElementById('optionsBlock').style.pointerEvents = 'none';
      setTimeout(() => {
        document.getElementById('optionsBlock').style.pointerEvents = 'auto';
      }, 1000);
      if (this.feedbackoneAttemptAudio && !this.feedbackoneAttemptAudio.nativeElement.paused) {
        this.feedbackoneAttemptAudio.nativeElement.pause();
        this.feedbackoneAttemptAudio.nativeElement.currentTime = 0;
      }
      this.disableoptionsBlock = false;
      this.disableoptions = false;
      this.blinkHolder();
     // document.getElementById('optionsBlock').style.pointerEvents = 'auto';
    }
    if (flag == 'yes') {
      this.noOfRightAnsClicked = 0;
      this.noOfWrongAnsClicked = 0;

      for (let x = 0; x < this.fetchAnswer.length; x++) {

        if (this.fetchAnswer[x].id == undefined) {
          console.log('noooooooooo setFeedback');
        } else if (this.fetchAnswer[x].id == this.feedbackObj.correct_ans_index[x].id && this.fetchAnswer[x].position == "down") {
          console.log('RIGHT ANSWER');
          this.noOfRightAnsClicked++;
          this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[0].src = this.correctImg.url;
          this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[1].src = this.fetchAnswer[x].imgsrc.url;
          this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[1].classList.value = 'img-fluid optItempopUp';
        } else if (this.fetchAnswer[x].position == "down") {
          console.log('WRONG ANSWER');
          this.noOfWrongAnsClicked++;
          this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[0].src = this.incorrectImg.url;
          this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[1].src = this.fetchAnswer[x].imgsrc.url;
          this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[1].classList.value = 'img-fluid optItempopUp';
        }
      }
      for (let x = 0; x < this.fetchAnswer.length; x++) {
        if (this.fetchAnswer[x].id == undefined) {
          console.log('');
        } else if (this.feedbackObj.correct_ans_index[x].id == this.fetchAnswer[x].id && this.fetchAnswer[x].position == "down") {
           this.fetchAnswer[x].status = "right";
        } else if (this.fetchAnswer[x].position == "down") {
           this.fetchAnswer[x].status = "wrong";
        }
      } 
      if (this.noOfRightAnsClicked == this.feedbackObj.correct_ans_index.length && this.noOfWrongAnsClicked == 0) {
        //modaldialog
        //this.openWrong = true
        this.setFeedback();
        this.popupRef.nativeElement.classList = 'displayPopup modal';
      }
      if (this.noOfRightAnsClicked == 0 && this.noOfWrongAnsClicked >= 2) {
        if(this.noOfWrongAnsClicked == 2){
          this.modaldialog.nativeElement.classList.add('twoCount');
        }
        this.openWrong = true
        this.setFeedback();
        this.popupRef.nativeElement.classList = 'displayPopup modal';
      }
      if (this.noOfRightAnsClicked > 0 && this.noOfWrongAnsClicked > 0) {
        if(this.noOfRightAnsClicked==1 && this.noOfWrongAnsClicked ==1){
          this.modaldialog.nativeElement.classList.add('twoCount');
        }
        //this.openWrong = true
        this.setFeedback();
        this.popupRef.nativeElement.classList = 'displayPopup modal';
      }
 
      if ((this.noOfRightAnsClicked + this.noOfWrongAnsClicked) >= 0 && (this.noOfRightAnsClicked + this.noOfWrongAnsClicked) < 2) {
        this.onlyOneAttemptModalRef.nativeElement.classList = "displayPopup modal";
        let oneAttemptFeedbackAudio = this.oneAttemptPopupAssets.oneAttemptAudio;
        // this.feedbackoneAttemptAudio.nativeElement.src = oneAttemptFeedbackAudio.location == "content" ? this.containgFolderPath + "/" + oneAttemptFeedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + oneAttemptFeedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
        this.feedbackoneAttemptAudio.nativeElement.src = oneAttemptFeedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
        this.feedbackoneAttemptAudio.nativeElement.play();
        this.appModel.notifyUserAction();

      } else if (this.noOfWrongAnsClicked == 0 && this.noOfRightAnsClicked < this.feedbackObj.correct_ans_index.length) {
        this.infoModalRef.nativeElement.classList = 'displayPopup modal';
        let partialFeedbackAudio = this.infoPopupAssets.partialCorrectAudio;
        this.feedbackInfoAudio.nativeElement.src = partialFeedbackAudio.url + '?someRandomSeed=' + Math.random().toString(36);
        this.feedbackInfoAudio.nativeElement.play();
        this.appModel.notifyUserAction();
      }
    } else {
      this.appModel.notifyUserAction();
    }
    if (id == 'submit-modal-id') {
      document.getElementById('optionsBlock').style.pointerEvents = 'none';
      this.submitModalRef.nativeElement.classList = 'modal';
    }
    if (id == 'info-modal-id') {
      this.blinkHolder();
      document.getElementById('optionsBlock').style.pointerEvents = 'none';
      this.infoModalRef.nativeElement.classList = 'modal';
      if (this.feedbackInfoAudio && !this.feedbackInfoAudio.nativeElement.paused) {
        this.feedbackInfoAudio.nativeElement.pause();
        this.feedbackInfoAudio.nativeElement.currentTime = 0;
      }
      setTimeout(() => {
        document.getElementById('optionsBlock').style.pointerEvents = '';
      }, 1000);
    }

  }

  dontshowFeedback(id: string, flag: string) {
    this.blinkHolder();
    if (this.ifStopped) {
      this.startActivity();
    }
    this.ifStopped = false;
    if (id == 'submit-modal-id') {
      document.getElementById('optionsBlock').style.pointerEvents = 'none';
      this.submitModalRef.nativeElement.classList = 'modal';
      setTimeout(() => {
        document.getElementById('optionsBlock').style.pointerEvents = '';
      }, 1000);
      this.disableoptions = false;
      this.disableSection = false;
      ////$("#optionsBlock .options").css("opacity", "unset");
      this.appModel.enableSubmitBtn(true);
      this.appModel.notifyUserAction();
      //let i = 0;
      for (let i = 0; i < this.refcpyArray.length; i++) {
        this.refQues.nativeElement.children[i].children[0].src = this.refcpyArray[i].imgsrc_original.url;
      }
      //this.resetAttempt();
    }
  }

  setFeedback() {

    if (this.noOfRightAnsClicked > 0 && this.noOfWrongAnsClicked > 0) {
      for (let x = 0; x < this.fetchAnswer.length; x++) {
        delete this.optionObject[x]['status'];
        if (this.fetchAnswer[x].id == undefined) {
          console.log('noooooooooo setFeedback');
        } else if (this.feedbackObj.correct_ans_index[x].id == this.fetchAnswer[x].id && this.fetchAnswer[x].position == "down") {
          console.log('RIGHT ANSWER');
          this.popupBodyRef.nativeElement.children[0].children[x].children[0].children[0].src = this.optionObject[x].imgsrc_right.url;
          this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[1].src = this.fetchAnswer[x].imgsrc_right.url;
          this.optionObject[x].status = "right";
        } else if (this.fetchAnswer[x].position == "down") {
          console.log('WRONG ANSWER');
          this.popupBodyRef.nativeElement.children[0].children[x].children[0].children[0].src = this.optionObject[x].imgsrc_wrong.url;
          this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[1].src = this.fetchAnswer[x].imgsrc_wrong.url;
          this.optionObject[x].status = "wrong";
        }
      }
 
      for (let x = this.optionObject.length - 1; x >= 0; x--) {
        if (!this.optionObject[x].sequenceNo || !this.optionObject[x].status) {
          this.optionObject.splice(x, 1);
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
        this.popupBodyRef.nativeElement.children[0].children[x].children[0].children[0].src = this.optionObject[x].imgsrc_original.url;
        this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[1].src = this.fetchAnswer[x].imgsrc_original.url;
        this.optionObject[x].status = "right";
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
    } else if (this.noOfRightAnsClicked == 0 && this.noOfWrongAnsClicked > 0) {
      ////else if (this.fetchAnswer.length == this.noOfWrongAnsClicked) {
      for (let x = 0; x < this.fetchAnswer.length; x++) {
        if (this.fetchAnswer[x].id == undefined) {
          //alert();
        } else if (this.fetchAnswer[x].position == "down") {
          this.popupBodyRef.nativeElement.children[0].children[x].children[0].children[0].src = this.optionObject[x].imgsrc_original.url;
          this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[1].src = this.fetchAnswer[x].imgsrc_original.url;
          this.optionObject[x].status = "wrong";
        }
      }
      for (let x = this.optionObject.length - 1; x >= 0; x--) {
        if (!this.optionObject[x].sequenceNo || !this.optionObject[x].status) {
          this.optionObject.splice(x, 1);
        }
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
      this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[1].classList.value = 'img-fluid optItempopUp';
    }
    this.setplayrightFeedbackAudio(0);
  }

  setplayFeedbackAudio(i: number) {
    this.feedbackaudioTimeout = setTimeout(() => {
      this.partialCase = false;
      let current = i;

      if (this.fetchAnswer && i < this.feedbackObj.correct_ans_index.length && current < this.optionObject.length) {

        if (this.optionObject[i].status == "right") {

          for (var j = 0; j < this.fetchAnswer.length; j++) {
            if (this.fetchAnswer[j].sequenceNo == this.optionObject[i].sequenceNo) {
              this.feedbackAudio = this.fetchAnswer[j].correctAudio;
            }
          }

          this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.url + '?someRandomSeed=' + Math.random().toString(36);
          console.log(this.feedbackPopupAudio.nativeElement.src);

          this.feedbackPopupAudio.nativeElement.play();
          if (this.popupBodyRef && this.popupBodyRef.nativeElement && this.popupBodyRef.nativeElement.children[0].children[i].children[0]) {
            this.popupBodyRef.nativeElement.children[0].children[i].children[0].classList = 'optionAnimate';
          }
          this.feedbackPopupAudio.nativeElement.onended = () => {
            this.popupBodyRef.nativeElement.children[0].children[i].children[0].classList = ' ';
            ++current;
            this.setplayFeedbackAudio(current);
          }
        } else if (this.optionObject[i].status == "wrong") {

          for (var j = 0; j < this.fetchAnswer.length; j++) {
            if (this.fetchAnswer[j].sequenceNo == this.optionObject[i].sequenceNo) {
              this.feedbackAudio = this.fetchAnswer[j].incorrectAudio;
            }
          }
          this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.url + '?someRandomSeed=' + Math.random().toString(36);
          console.log(this.feedbackPopupAudio.nativeElement.src);

          this.feedbackPopupAudio.nativeElement.play();
          if (this.popupBodyRef && this.popupBodyRef.nativeElement && this.popupBodyRef.nativeElement.children[0].children[i].children[0]) {
            this.popupBodyRef.nativeElement.children[0].children[i].children[0].classList = 'optionAnimate';
          }
          this.feedbackPopupAudio.nativeElement.onended = () => {
            this.popupBodyRef.nativeElement.children[0].children[i].children[0].classList = ' ';
            ++current;
            this.setplayFeedbackAudio(current);

          }
        }
      } else {
        if (this.countofAnimation > 0) {
          this.showAnsTimer = setTimeout(() => {
            if (this.countofAnimation == this.noOfRightAnsClicked) {
              this.startCount = 0;
              this.matched = true;
              this.closeModal();
              this.appModel.notifyUserAction();
              this.disableSection = true;

              this.instructionBar.nativeElement.style.opacity = 0.3;
              this.disableinstructionBar = true;
              this.bodyContentSection.nativeElement.style.opacity = 0.3;
              this.disableBody = true;
              this.appModel.enableSubmitBtn(false);
            } else {
              this.closeModal();
            }
          }, this.showAnsTimeout)
        }
      }
    }, 1000)
  }

  setplayrightFeedbackAudio(i: number) {
    let current = i;
    if (this.feedbackObj.correct_ans_index[i] && this.feedbackObj.correct_ans_index[i].correctAudio) {
      this.feedbackAudio = this.feedbackObj.correct_ans_index[i].correctAudio;
      this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.url + '?someRandomSeed=' + Math.random().toString(36);
      console.log(this.feedbackPopupAudio.nativeElement.src);
      this.feedbackPopupAudio.nativeElement.play();
      if (this.popupBodyRef && this.popupBodyRef.nativeElement && this.popupBodyRef.nativeElement.children[0].children[i].children[0]) {
        this.popupBodyRef.nativeElement.children[0].children[i].children[0].classList = 'optionAnimate';
      }
      this.feedbackPopupAudio.nativeElement.onended = () => {
        this.popupBodyRef.nativeElement.children[0].children[i].children[0].classList = ' ';
        ++current;
        this.setplayrightFeedbackAudio(current);
      }
    } else {
      setTimeout(() => {
        this.appModel.enableReplayBtn(false);
        this.startCount = 0;
        this.closeModal();
      }, this.showAnsTimeout)
    }
  }

  playrightFeedbackAudioPopup(i) {
    let current = i;
    if (this.rightansArray1.length > 0) {
      if (this.rightansArray1[i] && this.rightansArray1[i].imgrightfeedback_audio) {
        this.feedbackAudio = this.rightansArray1[i].imgrightfeedback_audio;
        this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.url + '?someRandomSeed=' + Math.random().toString(36);
        console.log(this.feedbackPopupAudio.nativeElement.src);
        this.feedbackPopupAudio.nativeElement.play();
        if (this.popupBodyRef && this.popupBodyRef.nativeElement && this.popupBodyRef.nativeElement.children[0].children[i]) {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += ' optionAnimate';
        }
        this.feedbackPopupAudio.nativeElement.onended = () => {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.remove('optionAnimate');
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += ' nutralize';
          ++current;
          this.playrightFeedbackAudioPopup(current);
        }
      } else {
        this.playrightFeedbackAudioPopupforSecondrow(0);
      }
    } else {
      if (this.ansArray1[i] && this.ansArray1[i].imgrightfeedback_audio) {
        this.feedbackAudio = this.ansArray1[i].imgrightfeedback_audio;
        this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.url + '?someRandomSeed=' + Math.random().toString(36);
        console.log(this.feedbackPopupAudio.nativeElement.src);
        this.feedbackPopupAudio.nativeElement.play();
        if (this.popupBodyRef && this.popupBodyRef.nativeElement && this.popupBodyRef.nativeElement.children[0].children[i]) {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += ' optionAnimate';
        }
        this.feedbackPopupAudio.nativeElement.onended = () => {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.remove('optionAnimate');
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += ' nutralize';
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
      this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.url + '?someRandomSeed=' + Math.random().toString(36);
      console.log(this.feedbackPopupAudio.nativeElement.src);
      this.feedbackPopupAudio.nativeElement.play();
      if (this.popupBodyRef && this.popupBodyRef.nativeElement && this.popupBodyRef.nativeElement.children[1].children[i]) {
        this.popupBodyRef.nativeElement.children[1].children[i].classList.value += ' optionAnimate';
      }
      this.feedbackPopupAudio.nativeElement.onended = () => {
        this.popupBodyRef.nativeElement.children[1].children[i].classList.remove('optionAnimate');
        this.popupBodyRef.nativeElement.children[1].children[i].classList.value += ' nutralize';
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
      this.feedbackpartialPopupAudio.nativeElement.src = this.feedbackAudio.url + '?someRandomSeed=' + Math.random().toString(36);
      console.log(this.feedbackpartialPopupAudio.nativeElement.src);
      this.feedbackpartialPopupAudio.nativeElement.play();
      if (this.partialpopupBodyRef && this.partialpopupBodyRef.nativeElement && this.partialpopupBodyRef.nativeElement.children[0].children[1].children[i]) {
        this.partialpopupBodyRef.nativeElement.children[0].children[1].children[i].classList.value += ' optionAnimate';
      }
      this.feedbackpartialPopupAudio.nativeElement.onended = () => {
        this.partialpopupBodyRef.nativeElement.children[0].children[1].children[i].classList.remove('optionAnimate');
        this.partialpopupBodyRef.nativeElement.children[0].children[1].children[i].classList.value += ' nutralize';
        ++current;
        this.playrightFeedbackAudioforPartialPopup(current);
      };
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
      this.feedbackpartialPopupAudio.nativeElement.src = this.feedbackAudio.url + '?someRandomSeed=' + Math.random().toString(36);
      console.log(this.feedbackpartialPopupAudio.nativeElement.src);
      this.feedbackpartialPopupAudio.nativeElement.play();
      if (this.partialpopupBodyRef && this.partialpopupBodyRef.nativeElement && this.partialpopupBodyRef.nativeElement.children[1].children[1].children[i]) {
        this.partialpopupBodyRef.nativeElement.children[1].children[1].children[i].classList.value += ' optionAnimate';
      }
      this.feedbackpartialPopupAudio.nativeElement.onended = () => {
        this.partialpopupBodyRef.nativeElement.children[1].children[1].children[i].classList.remove('optionAnimate');
        this.partialpopupBodyRef.nativeElement.children[1].children[1].children[i].classList.value += ' nutralize';
        ++current;
        this.playwrongFeedbackAudioforPartialPopup(current);
      };
    } else {
      setTimeout(() => {
        this.closeModal();
      }, 2000);
    }
  }
  resetAttempt() {
    this.optionObject = [...this.optionObjOriginal];
     this.fetchAnswer = [];
      for (var i = 0; i < this.refcpyArray.length; i++) {
        this.fetchAnswer.push(i);
      }
      for (let i = 0; i < this.refQuesObj.length; i++) {
        delete this.optionObject[i]['sequenceNo'];
      }
      for (let i = 0; i < this.refcpyArray.length; i++) {
        this.optionObject[i].placed = false;
        this.refcpyArray[i].position = 'top';
        this.refQues.nativeElement.children[i].children[0].style.visibility = '';
        this.optionsBlock.nativeElement.children[0].children[i].children[1].children[1].classList.value = 'img-fluid optItem';
        this.optionsBlock.nativeElement.children[0].children[i].children[1].children[0].src = this.optionObject[i].dropBoxImg_original.url;
         for (let i = 0; i < this.refQuesObj.length; i++) {
          this.refQuesObj[i].isOpen = true;
          this.refQuesObj[i].leftPos = 0 + 'px';
          this.refQuesObj[i].topPos = 0 + 'px';
        }
      }
      this.appModel.enableReplayBtn(true);
      this.appModel.enableSubmitBtn(false);
      this.countofAnimation = 0;
      this.noOfRightAnsClicked = 0;
      clearInterval(this.blinkTimeInterval);
      this.index1 = 0;
      this.startCount = 1;
      this.blinkHolder();  
  }

  playFeedbackAudio(i, j, flag) {
    if (this.popupBodyRef.nativeElement.children[0].children[i] !== undefined && !flag) {
      if ((this.noOfRightAnsClicked === this.feedback.correct_ans_index.length) && this.noOfWrongAnsClicked === 0) {
        if (this.ansArray1.length > 0) {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += ' optionAnimate optionsWidth';
          this.popupBodyRef.nativeElement.children[0].children[i].children[1].src = this.ansArray1[i].imgrightfeedback_audio.url;
        }

        if (this.AnsObj.length > 0) {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += ' optionAnimate';
          this.popupBodyRef.nativeElement.children[0].children[i].children[1].src = this.AnsObj[0][i].imgrightfeedback_audio.url;
        }
        this.popupBodyRef.nativeElement.children[0].children[i].children[1].load();
        this.popupBodyRef.nativeElement.children[0].children[i].children[1].play();
        this.popupBodyRef.nativeElement.children[0].children[i].children[1].onended = () => {
          if (this.ansArray1.length > 0) {
            this.popupBodyRef.nativeElement.children[0].children[i].classList.remove('optionAnimate');
            this.popupBodyRef.nativeElement.children[0].children[i].classList.value += 'nutralize';
          }
          if (this.AnsObj.length > 0) {
            this.popupBodyRef.nativeElement.children[0].children[i].classList.remove('optionAnimate');
            this.popupBodyRef.nativeElement.children[0].children[i].classList.value += 'nutralize';
          }
          i++;
          this.playFeedbackAudio(i, undefined, false);
        };
      }
      if (this.noOfRightAnsClicked === 0 && this.noOfWrongAnsClicked > 0) {

        this.disableoptionsBlock = false;
        if (this.ansArray1.length > 0) {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += 'optionAnimate optionsWidth';
          this.popupBodyRef.nativeElement.children[0].children[i].children[1].src = this.ansArray1[i].imgwrongfeedback_audio.url;
        }
        if (this.AnsObj.length > 0) {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += 'optionAnimate';
          this.popupBodyRef.nativeElement.children[0].children[i].children[1].src = this.AnsObj[0][i].imgwrongfeedback_audio.url;
        }

        this.popupBodyRef.nativeElement.children[0].children[i].children[1].load();
        this.popupBodyRef.nativeElement.children[0].children[i].children[1].play();
        this.popupBodyRef.nativeElement.children[0].children[i].children[1].onended = () => {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.remove('optionAnimate');
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += 'nutralize';
          i++;
          this.playFeedbackAudio(i, undefined, false);
        };
      }
    } else if (this.noOfRightAnsClicked > 4 || this.noOfWrongAnsClicked > 4) {
      flag = true;
      if (j === undefined) {
        j = 0;
      }
      this.disableoptionsBlock = false;
      if (this.popupBodyRef.nativeElement.children[1].children[j] !== undefined && flag) {
        this.popupBodyRef.nativeElement.children[1].children[j].classList.value += 'optionAnimate';
        if ((this.noOfRightAnsClicked === this.feedback.correct_ans_index.length) && this.noOfWrongAnsClicked == 0) {
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].src = this.AnsObj[1][j].imgrightfeedback_audio.url;
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].load();
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].play();
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].onended = () => {
            this.popupBodyRef.nativeElement.children[1].children[j].classList.remove('optionAnimate');
            this.popupBodyRef.nativeElement.children[1].children[j].classList.value += 'nutralize';
            j++;
            this.playFeedbackAudio(j, j, true);
          };
        }
        if (this.noOfRightAnsClicked === 0 && this.noOfWrongAnsClicked > 0) {
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].src = this.AnsObj[1][j].imgwrongfeedback_audio.url;
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].load();
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].play();
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].onended = () => {
            this.popupBodyRef.nativeElement.children[1].children[j].classList.remove('optionAnimate');
            this.popupBodyRef.nativeElement.children[1].children[j].classList.value += 'nutralize';
            j++;
            this.playFeedbackAudio(j, j, true);
          };
        }
      } else {
        setTimeout(() => {
          this.closeModal();
        }, 2000);
      }

    } else {
      setTimeout(() => {
        if (!(this.noOfRightAnsClicked === 0 && this.noOfWrongAnsClicked > 0)) {
          this.blinkOnLastQues();
        }
        this.closeModal();
      }, 2000);
    }
  }
  sendFeedback(id: string, flag: string) {

    if (flag === 'yes') {
      this.appModel.enableSubmitBtn(false);
      this.bodyContentSection.nativeElement.style.opacity = 0.3;
      this.disableBody = true;

      this.appModel.resetBlinkingTimer();
      this.appModel.invokeTempSubject('showModal', 'manual');


      this.disableSection = true;
      this.instructionBar.nativeElement.style.opacity = 0.3;
      this.disableinstructionBar = true;
      this.checked = true;
      if (this.feedbackObj.showAnswerpopupTxt.required) {
        this.AnswerpopupTxt = true;
        this.popupHeader = this.feedbackObj.showAnswerpopupTxt.url;
      } else {
        this.AnswerpopupTxt = false;
      }
      for (let x = 0; x < this.fetchAnswer.length; x++) {
        this.popupBodyRef.nativeElement.children[0].children[x].children[0].children[0].src = this.optionObject[x].imgsrc_original.url;
        //this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[1].src = this.fetchAnswer[x].imgsrc_original.url;
      }
    } else {
      this.appModel.notifyUserAction();
      this.disableSection = false;
      setTimeout(() => {
        document.getElementById('optionsBlock').style.pointerEvents = '';
      }, 1000);
    }
    this.blinkHolder();
    document.getElementById('optionsBlock').style.pointerEvents = 'none';
    this.confirmModalRef.nativeElement.classList = 'modal';
    if (this.ifStopped) {
      this.startActivity();
    }
    this.ifStopped = false;
    this.noOfRightAnsClicked = 0;
    this.noOfWrongAnsClicked = 0;
  }

  // this function is for to show the confirmation popup for video replay
  showReplay(ref, flag: string, action?: string) {
    this.blinkHolder();
    if (this.ifStopped) {
      this.startActivity();
    }
    this.replayconfirmAssets.confirm_btn = this.replayconfirmAssets.confirm_btn_original;
    this.ifStopped = false;
    ref.classList = 'modal';
    this.appModel.navShow = 1;
    this.appModel.notifyUserAction();
    if (flag === 'yes') {
      if (action === 'replay') {
        this.appModel.videoStraming(true);
        this.replayVideo();

      }
    } else if (flag === 'no') {
      this.appModel.videoStraming(false);
      this.appModel.navShow = 2;
      setTimeout(() => {
        this.disableSection = false;
        this.disableoptions = false;
      }, 1000);
    }
  }

  // this function is used to replay the video af template using the replay icon
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
        document.getElementById('outer').style.pointerEvents = 'none';
        setTimeout(() => {
          document.getElementById('outer').style.pointerEvents = 'auto';
        }, 1000);
        
        this.appModel.videoStraming(false);
        this.appModel.notifyUserAction();       
      };
    }, 500);
  }

  // this function we use to close the modal popup this is a common function which we call to close all the popup based on conditions
  closeModal() {
    this.modaldialog.nativeElement.classList.remove('twoCount');
    if (this.feedbackPopupAudio && !this.feedbackPopupAudio.nativeElement.paused) {
      this.feedbackPopupAudio.nativeElement.pause();
      this.feedbackPopupAudio.nativeElement.currentTime = 0;
    }
    ////this.optionObject = [...this.optionObjOriginal];

    for (let i = 0; i < this.refQuesObj.length; i++) {
      this.refQuesObj[i].isOpen = true;
      this.refQuesObj[i].leftPos = 0 + 'px';
      this.refQuesObj[i].topPos = 0 + 'px';
    }
    for (let i = 0; i < this.popupBodyRef.nativeElement.children[0].children.length; i++) {
      this.popupBodyRef.nativeElement.children[0].children[i].children[0].classList.value = '';
    }
    if (this.countofAnimation === this.noOfRightAnsClicked) {
      this.matched = true;
      this.disableSection = true;
      this.instructionBar.nativeElement.style.opacity = 0.3;
      this.disableinstructionBar = true;
      this.bodyContentSection.nativeElement.style.opacity = 0.3;
      this.disableBody = true;
      this.appModel.enableSubmitBtn(false);
      this.appModel.enableReplayBtn(false);
    }
    if (this.feedbackPopupAudio && !this.feedbackPopupAudio.nativeElement.paused) {
      this.feedbackPopupAudio.nativeElement.pause();
      this.feedbackPopupAudio.nativeElement.currentTime = 0;
      if (!this.matched) {
        this.appModel.wrongAttemptAnimation();
        setTimeout(() => {
          this.resetAttempt();
        }, 3000);
        setTimeout(() => {
          document.getElementById('optionsBlock').style.pointerEvents = '';
        }, 3000);
      }
    }
    this.popupRef.nativeElement.classList = 'modal';
    this.infoModalRef.nativeElement.classList = 'modal';
    this.appModel.notifyUserAction();

    if (this.matched) {
      this.blinkOnLastQues();
    }

    if (!this.matched) {
      this.optionObject = [...this.optionObjOriginal];
      this.appModel.wrongAttemptAnimation();
      setTimeout(() => {
        //this.resetAttempt();

      }, 5000);
      setTimeout(() => {
        document.getElementById('optionsBlock').style.pointerEvents = '';
      }, 3000);
      setTimeout(() => {
        this.disableSection = false;
        this.disableoptions = false;
      }, 1000);
    }
    this.appModel.enableReplayBtn(false);
  }
}


