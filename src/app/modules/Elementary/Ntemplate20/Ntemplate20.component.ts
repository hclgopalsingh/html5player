import { Component, OnInit, ViewChild, OnDestroy, Renderer2, ElementRef, AfterViewChecked } from '@angular/core';
import { PlayerConstants } from '../../../common/playerconstants';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { ThemeConstants } from '../../../common/themeconstants';
import { SharedserviceService } from '../../../common/services/sharedservice.service';
import { trigger, state, style, animate, transition, AnimationEvent } from '@angular/animations';
import { timer } from 'rxjs/observable/timer';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ntemplate20',
  templateUrl: './Ntemplate20.component.html',
  styleUrls: ['./Ntemplate20.component.scss'],

  animations: [
    trigger('openClose', [
      state('open', style({
      })),
      state('closed', style({
        'left': '{{leftPos}}',
        'top': '{{topPos}}',
        // 'width': '{{optWidth}}',
      }), { params: { leftPos: 0, topPos: 0, optWidth: 0 } }),
      transition('open => closed', [
        animate('0.5s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
  ],
})
export class Ntemplate20Component implements OnInit, AfterViewChecked, OnDestroy {

  @ViewChild('mainContainer') mainContainer: any;
  @ViewChild('instructionVO') instructionVO: any;
  @ViewChild('instructionBar') instructionBar: any;
  @ViewChild('quesVORef') quesVORef: any;
  @ViewChild('confirmModalRef') confirmModalRef: any;
  @ViewChild('confirmSubmitRef') confirmSubmitRef: any;
  @ViewChild('infoModalRef') infoModalRef: any;
  @ViewChild('mainVideo') mainVideo: any;
  @ViewChild('confirmReplayRef') confirmReplayRef: any;
  @ViewChild('partialFeedbackRef') partialFeedbackRef: any;
  @ViewChild('optionRef') optionRef: any;
  @ViewChild('upPlaceHolder') upPlaceHolder: any;
  @ViewChild('downPlaceHolder') downPlaceHolder: any;
  @ViewChild('scaleBoxRef') scaleBoxRef: any;
  @ViewChild('modalfeedback20') modalfeedback20: any;
  @ViewChild('feedbackInfoAudio') feedbackInfoAudio: any;
  @ViewChild('feedbackPopupAudio') feedbackPopupAudio: any;
  @ViewChild('onlyOneAttemptModalRef') onlyOneAttemptModalRef: any;
  @ViewChild('feedbackoneAttemptAudio') feedbackoneAttemptAudio: any;

  optionBase: boolean = false;
  mouseMoveFlag: boolean = false;
  oneAttemptPopupAssets: any;
  isDisablePlaceholder: boolean = false;
  blinkingFlag: boolean = true;
  partialCorrectCase: boolean = false;
  audio = new Audio();
  isDisableDiv: boolean = false;
  commonAssets: any = "";
  feedback: any = "";
  popupType: string = "";
  isLastQues: boolean = false;
  isLastQuesAct: boolean;
  noOfImgs: number;
  noOfImgsLoaded: number = 0;
  loaderTimer: any;
  containgFolderPath: string = "";
  assetsPath: string = "";
  loadFlag: boolean = false;
  optionHolder: any = [];
  optionObj: any;
  questionObj: any;
  randomArray: any;
  blinkTimeInterval: any;
  categoryA: any = {
    "correct": [],
    "incorrect": []
  };
  categoryB: any = {
    "correct": [],
    "incorrect": []
  };
  popUpFeedbackMsgUrl: string;
  infoPopupAssets: any;
  confirmAssets: any;
  confirmSubmitAssets: any;
  confirmReplayAssets: any;
  feedbackAssets: any;
  category: any;
  isPlayVideo: boolean;
  attemptType: string = "";
  attemptTypeClose: string = "";
  timerDelayActs: any;
  placeHolderArrUp: any = [];
  placeHolderArrDown: any = [];
  blinkingOpt: any;
  placeHolderArrUpPopup: any = [];
  placeHolderArrDownPopup: any = [];
  randomOptIndx: number;
  optIndxArr: any = [];
  blinkFlag: boolean = true;
  optionArr: any = [];
  optionCommonAssts: any;
  blinkInterval: any;
  submittedArr: any = [];
  responseType: string = "";
  popupTopAssts: any = [];
  popupDownAssts: any = [];
  currentIdx: number = 0;
  resultType: string = "correct";
  sortedOptArr: any;
  currentIndxUp: number = 0;
  currentIndxDown: number = 0;
  currentComparison: any;
  optionIndex: number;
  idOfImage: number;
  IdImageArr: any = [];
  submitButtonCounter: number = 0;
  showAnswerCounter: number = 0;
  blinkCounter: number = 0;
  RandomResizeIndex: number = 0;
  ArrPlaceHolder: any = [];
  wrongCounter: number = 0;
  rightCounter: number = 0;
  Order: string = "";
  optionReverseTopPosition: number = 0;
  startActivityCounter: number = 0;
  feedbackObj: any;
  feedbackAudio: any;
  rightanspopUpheader_img: boolean = false;
  wronganspopUpheader_img: boolean = false;
  showanspopUpheader_img: boolean = false;
  partialCorrectheaderTxt_img: boolean = false;
  styleHeaderPopup: any;
  styleBodyPopup: any;
  from: any;
  actionType: any;
  popup_commmon_imgs: any;
  upperImagesNo1: boolean = false;
  upperImagesNo2: boolean = false;
  lowerImagesNo1: boolean = false;
  lowerImagesNo2: boolean = false;
  resetCounterFlag: boolean = true;
  animationFlag: boolean = false;
  tabLoadAnimationFlag: boolean = false;
  /*Start: Theme Implementation(Template Changes)*/
  controlHandler = {
    isSubmitRequired: false,
    isReplayRequired: false
  };
  themePath: any;
  fetchedcontent: any;
  functionalityType: any;
  showAnsTimeout: number;
  selectedPositionIndex: number;
  selectedPosition: string = "";
  reverseOption: any;
  reverseOptionIndex: number;
  lookformore:boolean = false;
  /*END: Theme Implementation(Template Changes)*/
  timerSubscription: Subscription;
  isLastQuestion: boolean;
  confirmPopupSubscription: any;
  actComplete : boolean = false;
  screenFaded: boolean = false;
  givenIndexes: any = [];
  givenValues: any = [];
  resetOptionsFlag: boolean = false;

  /*Start-LifeCycle events*/
  private appModel: ApplicationmodelService;
  constructor(appModel: ApplicationmodelService, private Sharedservice: SharedserviceService, private renderer: Renderer2, private elementRef: ElementRef) {
    this.appModel = appModel;
    this.appModel.setLoader(true);
    // if error occured during image loading loader wil stop after 5 seconds 
    this.loaderTimer = setTimeout(() => {
      this.appModel.setLoader(false);
    }, 5000);
    this.assetsPath = this.appModel.assetsfolderpath;
    this.appModel.navShow = 2;
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
    this.tabLoadAnimationFlag = true;
  }

  ngOnInit() {
    if (this.appModel.isNewCollection) {
      this.appModel.event = { 'action': 'segmentBegins' };
    }
    this.blinkingFlag = true;
    this.attemptType = "";
    console.log("this.attemptType = " + this.attemptType);
    this.containgFolderPath = this.getBasePath();

    /*Start: Theme Implementation(Template Changes)*/
    let fetchedData: any = this.appModel.content.contentData.data;
    this.fetchedcontent = JSON.parse(JSON.stringify(fetchedData));
    this.functionalityType = this.appModel.content.contentLogic.functionalityType;
    this.themePath = ThemeConstants.THEME_PATH + this.fetchedcontent.productType + '/' + this.fetchedcontent.theme_name;
    this.Sharedservice.imagePath(this.fetchedcontent, this.containgFolderPath, this.themePath, undefined);
    this.checkquesTab();
    this.appModel.globalJsonData.subscribe(data => {
      this.showAnsTimeout = data.showAnsTimeout;
    });
    /*End: Theme Implementation(Template Changes)*/


    this.setData();
    this.appModel.getNotification().subscribe(mode => {
      if (mode == "manual") {
        console.log("manual mode ", mode);
      } else if (mode == "auto") {
        console.log("auto mode", mode);
        this.infoModalRef.nativeElement.classList = "modal";
        this.onlyOneAttemptModalRef.nativeElement.classList = "modal";
        this.attemptType = "uttarDikhayein";
        this.responseType = "";
        this.popupType = "showanswer"
        this.setPopupAssets();
        this.getAnswer();
      }
    })
    this.confirmPopupSubscription = this.appModel.getConfirmationPopup().subscribe((val) => {
      clearInterval(this.blinkInterval);
      this.instructionVO.nativeElement.pause();
      this.instructionVO.nativeElement.currentTime = 0;
      this.appModel.notifyUserAction();
      if (val == "uttarDikhayein") {
        if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
          this.confirmModalRef.nativeElement.classList = "displayPopup modal";
          this.popupType = "showanswer";
          this.setPopupAssets();
          this.responseType = "";
          this.attemptType = "uttarDikhayein";
          this.checkForAutoClose();
        }
      } else if (val == "submitAnswer") {
        if (this.confirmSubmitRef && this.confirmSubmitRef.nativeElement) {
          this.confirmSubmitRef.nativeElement.classList = "displayPopup modal";
        }
      } else if (val == "replayVideo") {

      }
    })
    this.appModel.nextBtnEvent().subscribe(() => {
      if (this.appModel.isLastSectionInCollection) {
        this.appModel.event = { 'action': 'segmentEnds' };
      }
      if (this.appModel.isLastSection) {
        this.appModel.event = { 'action': 'end' };
      }
    })
    this.appModel.postWrongAttempt.subscribe(() => {
      this.appModel.notifyUserAction();
    })
    this.appModel.resetBlinkingTimer();
    this.appModel.handleController(this.controlHandler);
  }

  ngOnDestroy() {
    clearTimeout(this.blinkTimeInterval);
    this.appModel.resetBlinkingTimer();
    if (this.instructionVO.nativeElement != undefined) {
      this.instructionVO.nativeElement.pause();
      this.instructionVO.nativeElement.currentTime = 0;
    }
    if (this.timerSubscription != undefined) {
      this.timerSubscription.unsubscribe();
    }
    if (this.confirmPopupSubscription != undefined) {
      this.confirmPopupSubscription.unsubscribe();
    }
  }

  ngAfterViewChecked() {
    this.templatevolume(this.appModel.volumeValue, this);
  }
  /*End-LifeCycle events*/
  checkForAutoClose() {
    if (this.confirmModalRef.nativeElement.classList.contains("displayPopup")) {
      if (this.isLastQuestion && this.actComplete) {
        this.resetTimerForAutoClose();
      } else {
        if (this.timerSubscription != undefined) {
          this.timerSubscription.unsubscribe();
        }
      }
    }
  }

  resetTimerForAutoClose() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.appModel.stopAllTimer();
    const interval = 1000;
    const closeConfirmInterval = 2 * 60;
    this.timerSubscription = timer(0, interval).pipe(
      take(closeConfirmInterval)
    ).subscribe(value =>
      this.removeSubscription((closeConfirmInterval - +value) * interval),
      err => {
        //console.log("error occuered....");
      },
      () => {
        this.sendFeedback(this.confirmModalRef.nativeElement,'no');
        this.timerSubscription.unsubscribe();
      }
    )
  }
  removeSubscription(timer) {
    console.log("waiting for autoClose", timer / 1000);
  }

  /*Start-Template click and hover events*/
  checkquesTab() {
    if (this.fetchedcontent.commonassets.ques_control != undefined) {
      this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
    } else {
      this.appModel.getJson();
    }
  }

  /*** Data set from content JSON ***/
  setData() {
    this.appModel.notifyUserAction();
    this.optionHolder = this.fetchedcontent.option_holder;
    this.optionObj = JSON.parse(JSON.stringify(this.fetchedcontent.options_assts));
    this.optionArr = this.optionObj.option;
    this.optionCommonAssts = this.optionObj.option_common_assets;
    this.commonAssets = this.fetchedcontent.commonassets;
    this.isLastQuestion = this.commonAssets.isLastQues;
    this.questionObj = this.fetchedcontent.quesObj;
    this.optionObj.given_values.forEach(givenValue => {
      this.givenIndexes.push(givenValue.index);
      this.givenValues.push(givenValue.value);
    });

    /*Start: Theme Implementation(Template Changes)*/
    this.controlHandler = {
      isSubmitRequired: this.questionObj.submitRequired,
      isReplayRequired: this.questionObj.replayRequired
    }
    /*End: Theme Implementation(Template Changes)*/
    this.ArrPlaceHolder = this.commonAssets.rightSequence;
    this.Order = this.commonAssets.order.orderType;
    this.feedbackObj = this.fetchedcontent.feedback;

    for (let i = 0; i < this.optionArr.length; i++) {
      this.optionArr[i]['isOpen'] = true;
    }

    for (let i = 0; i < this.optionObj.place_holder.no_s; i++) {
      this.placeHolderArrUp.push(this.optionObj.place_holder);
      this.placeHolderArrDown.push(this.optionObj.place_holder);
      this.placeHolderArrUpPopup.push(this.optionObj.place_holder);
      this.placeHolderArrDownPopup.push(this.optionObj.place_holder);
    }

    for (let i in this.optionObj.given_values) {
      let opt = {
        imgsrc: '',
        imgsrc_partial: '',
        place: '',
        value: ''
      }
      if (this.optionObj.given_values[i].place == "down") {
        opt.place = 'down';
        opt.imgsrc = this.optionObj.given_values[i].imgsrc;
        opt.imgsrc_partial = this.optionObj.given_values[i].imgsrc_partial;
        opt.value = this.optionObj.given_values[i].value
        this.placeHolderArrDown.splice(this.optionObj.given_values[i].index, 1, opt);

      } else if (this.optionObj.given_values[i].place == "up") {
        opt.place = 'up';
        opt.imgsrc = this.optionObj.given_values[i].imgsrc;
        opt.imgsrc_partial = this.optionObj.given_values[i].imgsrc_partial;
        opt.value = this.optionObj.given_values[i].value
        this.placeHolderArrUp.splice(this.optionObj.given_values[i].index, 1, opt);
      }
    }
    this.questionObj = this.fetchedcontent.quesObj;
    this.noOfImgs = this.commonAssets.imgCount;
    this.isLastQues = this.appModel.isLastSection;
    this.isLastQuesAct = this.appModel.isLastSectionInCollection;
    if (this.isLastQuesAct || this.isLastQues) {
      this.appModel.setlastQuesNT();
    }
    for (let i = 0; i < this.questionObj.noOfOptions; i++) {
      this.randomArray[i] = i;
    }
    this.feedback = this.fetchedcontent.feedback;
    this.popup_commmon_imgs = this.feedback.popup_commmon_imgs;
    this.infoPopupAssets = this.feedback.info_popup;
    this.confirmAssets = this.feedback.confirm_popup;
    this.confirmSubmitAssets = this.feedback.submit_popup;
    this.confirmReplayAssets = this.feedback.replay_confirm;
    this.oneAttemptPopupAssets = this.feedback.oneAttempt_popup;
  }

  /***Set the content folder path ***/
  getBasePath() {
    if (this.appModel && this.appModel.content) {
      return this.appModel.content.id + '';
    }
  }

  upPlaceholderHover(idx, placeholder) {
    this.upPlaceHolder.nativeElement.children[idx].style.cursor = "pointer";
    if(placeholder && !(placeholder.place) && (!placeholder.value || this.givenIndexes.indexOf(idx)<0)) {
      this.upPlaceHolder.nativeElement.children[idx].classList.add("opacity-1");
      this.upPlaceHolder.nativeElement.children[idx].classList.remove("opacity-0");
    }
  }
  upPlaceholderLeave(idx, placeholder) {
    this.upPlaceHolder.nativeElement.children[idx].style.cursor = "";
    if(placeholder && !(placeholder.place) && (!placeholder.value || this.givenIndexes.indexOf(idx)<0)) {
      this.upPlaceHolder.nativeElement.children[idx].classList.add("opacity-0");
      this.upPlaceHolder.nativeElement.children[idx].classList.remove("opacity-1");
    }
  }
  downPlaceholderHover(idx, placeholder) {
    this.downPlaceHolder.nativeElement.children[idx].style.cursor = "pointer";
    if(placeholder && !(placeholder.place)  && (!placeholder.value || this.givenIndexes.indexOf(idx)<0)) {
      this.downPlaceHolder.nativeElement.children[idx].classList.add("opacity-1");
      this.downPlaceHolder.nativeElement.children[idx].classList.remove("opacity-0");
    }
  }
  downPlaceholderLeave(idx, placeholder) {
    this.downPlaceHolder.nativeElement.children[idx].style.cursor = "";
    if(placeholder && !(placeholder.place)  && (!placeholder.value || this.givenIndexes.indexOf(idx)<0)) {
      this.downPlaceHolder.nativeElement.children[idx].classList.add("opacity-0");
      this.downPlaceHolder.nativeElement.children[idx].classList.remove("opacity-1");
    }
  }
  /***  On option hover functionality ***/
  optionHover(idx, opt) {
    this.mouseMoveFlag = true;
    this.appModel.notifyUserAction();
    this.optionRef.nativeElement.children[idx].className = "scaleInAnimation";
    this.renderer.removeClass(this.optionRef.nativeElement.children[idx], 'scaleOutAnimation');
    this.optionRef.nativeElement.children[idx].style.zIndex = "100";
    this.optionRef.nativeElement.children[idx].style.cursor = "pointer";
  }

  /***  On option leave functionality ***/
  optionLeave(idx, opt) {
    this.optionRef.nativeElement.children[idx].className = "scaleOutAnimation";
    this.renderer.removeClass(this.optionRef.nativeElement.children[idx], 'scaleInAnimation');
    this.optionRef.nativeElement.children[idx].style.zIndex = "99";
    this.optionRef.nativeElement.children[idx].style.cursor = "pointer";

  }

  /*** Play VO on option hover ***/
  playOptionHover(idx, opt) {
    if (this.animationFlag) {
      return
    }
    if (this.mouseMoveFlag == true) {
      this.optionRef.nativeElement.children[idx].style.cursor = "pointer";
      if (opt && opt.mouse_over_audio && opt.mouse_over_audio.url) {
        if (this.optionRef.nativeElement.children[idx].getBoundingClientRect().top != this.optionReverseTopPosition) {
          this.playSound(opt.mouse_over_audio, idx);
        }
      }
    }


  }

  playSound(soundAssets, idx) {
    if (this.audio && this.audio.paused) {
      this.audio.src = soundAssets.url;
      this.audio.load();
      this.audio.play();
      this.instructionBar.nativeElement.classList = "instructionBase disableDiv";
      this.optionRef.nativeElement.children[idx].style.cursor = "pointer";
      this.instructionVO.nativeElement.pause();
      this.instructionVO.nativeElement.currentTime = 0;
      for (let i = 0; i < this.mainContainer.nativeElement.children[1].children[1].children.length; i++) {
        if (i != idx) {
          this.mainContainer.nativeElement.children[1].children[1].children[i].classList.add("disableDiv");
        }
      }

      this.audio.onended = () => {
        this.instructionBar.nativeElement.classList = "instructionBase";
        for (let i = 0; i < this.mainContainer.nativeElement.children[1].children[1].children.length; i++) {
          if (i != idx) {
            this.mainContainer.nativeElement.children[1].children[1].children[i].classList.remove("disableDiv")
          }
        }
        this.optionRef.nativeElement.children[idx].style.cursor = "pointer";
        // this.mouseMoveFlag = false;
      }
    }
  }

  /*** loading of Templates ***/
  checkImgLoaded() {
    if (!this.loadFlag) {
      this.noOfImgsLoaded++;
      if (this.noOfImgsLoaded >= this.noOfImgs) {
        setTimeout(() => {
          this.appModel.setLoader(false);
        }, 200);
        this.loadFlag = true;
        clearTimeout(this.loaderTimer);
        clearTimeout(this.blinkTimeInterval);
        this.checkforQVO();
      }
    }
  }

  /*** close event call ***/
  close() {
    this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
  }

  /*** Question Auto Instruction check as per content JSON ***/
  checkforQVO() {
    if (this.questionObj && this.questionObj.quesInstruction && this.questionObj.quesInstruction.url && this.questionObj.quesInstruction.autoPlay) {
      this.quesVORef.nativeElement.src = this.questionObj.quesInstruction.url;
      this.mainContainer.nativeElement.classList = "bodyContent disableDiv";
      this.instructionBar.nativeElement.classList = "instructionBase disableDiv";
      this.quesVORef.nativeElement.play();
      this.appModel.enableReplayBtn(false);
      this.appModel.enableSubmitBtn(false);
      this.appModel.handlePostVOActivity(true);
      this.quesVORef.nativeElement.onended = () => {
        this.mainContainer.nativeElement.classList = "bodyContent";
        this.instructionBar.nativeElement.classList = "instructionBase";
        this.startActivity();
        this.appModel.handlePostVOActivity(false);
        this.appModel.enableReplayBtn(true);
      }
    } else {
      this.timerDelayActs = setTimeout(() => {
        this.startActivity();
        this.appModel.handlePostVOActivity(true);
        this.appModel.enableReplayBtn(true);
      }, 1000)
    }
  }

  /*** After completion of Auto Instruction Activity start functionality ***/
  startActivity() {
    for (let i in this.optionObj.option) {
      this.optIndxArr.push(i);
    }
    this.getRandomIndxBlink();
  }

  /*** get random number blocks index and start blinking***/
  getRandomIndxBlink(index?) {
    // let indx; 
    // if(index !== undefined) {
    //   indx = index;
    // } else {
    //   indx = this.getRandomIndx();
    // }
    let indx = this.getRandomIndx();
    this.optionIndex = indx;
    this.randomOptIndx = this.optIndxArr[indx];
    if (this.optionArr[this.randomOptIndx] && this.optionArr[this.randomOptIndx].imgsrc) {
      let opt = {
        imgsrc: this.optionArr[this.randomOptIndx].imgsrc,
        imgsrc_partial: this.optionArr[this.randomOptIndx].imgsrc_partial,
        idImage: this.optionArr[this.randomOptIndx].imgsrc.idImage,
        selected: true,
        place: '',
        value: this.optionArr[this.randomOptIndx].value,
        index: this.optionArr[this.randomOptIndx].index,
        isAtCorrectPos: true,
        fromCord: this.optionRef.nativeElement.children[this.randomOptIndx].getBoundingClientRect(),
        toCord: ''
      }
      this.blinkingOpt = opt;
      this.idOfImage = this.blinkingOpt.idImage;
      this.optIndxArr.splice(indx, 1);
      this.startBlinkOption();
    }
  }

  /*** Get random number for blinking block ***/
  getRandomIndx() {
    var randomvalue = Math.floor(Math.random() * this.optIndxArr.length);
    return randomvalue;
  }

  /***  Starts blinking random option ***/
  startBlinkOption() {
    this.blinkInterval = setInterval(() => {
      if (this.blinkFlag) {
        this.blinkFlag = false;
        if (this.optionRef != undefined && this.submitButtonCounter != this.optionArr.length) {
          this.optionRef.nativeElement.children[this.randomOptIndx].children[0].src = this.optionObj.option_common_assets.blink_box.url;
        }
      } else {
        this.blinkFlag = true;
        if (this.optionRef != undefined && this.submitButtonCounter != this.optionArr.length) {
          this.optionRef.nativeElement.children[this.randomOptIndx].children[0].src = this.optionObj.option_common_assets.default_box_original.url;
        }
      }
    }, 500)
  }

  /***  Instruction VO plays ***/
  playInstruction() {
    this.appModel.notifyUserAction();
    // this.appModel.handlePostVOActivity(true);
    if (this.instructionVO.nativeElement && this.instructionVO.nativeElement.src) {
      this.instructionVO.nativeElement.play();
      this.appModel.enableReplayBtn(false);
      // this.isDisableDiv = true;
      this.instructionBar.nativeElement.classList = "instructionBase disable_div";
      this.attemptType = "PlayInstruction";
      this.instructionVO.nativeElement.onended = () => {
        this.disableOnInstruction();
        // this.isDisableDiv = false;
        this.instructionBar.nativeElement.classList = "instructionBase";
        // this.appModel.handlePostVOActivity(false);
      }
    }
  }

  hoverConfirm() {
    this.confirmAssets.confirm_btn = this.confirmAssets.confirm_btn_hover;
  }

  houtConfirm() {
    this.confirmAssets.confirm_btn = this.confirmAssets.confirm_btn_original;
  }

  hoverDecline() {
    this.confirmAssets.decline_btn = this.confirmAssets.decline_btn_hover;
  }

  houtDecline() {
    this.confirmAssets.decline_btn = this.confirmAssets.decline_btn_original;
  }

  hoverCloseConfirm() {
    this.confirmAssets.close_btn = this.confirmAssets.close_btn_hover;
  }
  houtCloseConfirm() {
    this.confirmAssets.close_btn = this.confirmAssets.close_btn_original;
  }

  hoverCloseConfirmSubmit() {
    this.confirmSubmitAssets.close_btn = this.confirmSubmitAssets.close_btn_hover;
  }
  houtCloseConfirmSubmit() {
    this.confirmSubmitAssets.close_btn = this.confirmSubmitAssets.close_btn_original;
  }

  hoverOK() {
    this.infoPopupAssets.ok_btn = this.infoPopupAssets.ok_btn_hover;
  }

  houtOK() {
    this.infoPopupAssets.ok_btn = this.infoPopupAssets.ok_btn_original;
  }

  hoverCloseOk() {
    this.infoPopupAssets.close_btn = this.infoPopupAssets.close_btn_hover;
  }
  houtCloseOk() {
    this.infoPopupAssets.close_btn = this.infoPopupAssets.close_btn_original;
  }

  hoverReplayConfirm() {
    this.confirmReplayAssets.confirm_btn = this.confirmReplayAssets.confirm_btn_hover;
  }

  houtReplayConfirm() {
    this.confirmReplayAssets.confirm_btn = this.confirmReplayAssets.confirm_btn_original;
  }

  hoverReplayDecline() {
    this.confirmReplayAssets.decline_btn = this.confirmReplayAssets.decline_btn_hover;
  }

  houtReplayDecline() {
    this.confirmReplayAssets.decline_btn = this.confirmReplayAssets.decline_btn_original;
  }

  hoverReplayCloseConfirm() {
    this.confirmReplayAssets.close_btn = this.confirmReplayAssets.close_btn_hover;
  }
  houtReplayCloseConfirm() {
    this.confirmReplayAssets.close_btn = this.confirmReplayAssets.close_btn_original;
  }


  hoveroneAttemptOK() {
    this.oneAttemptPopupAssets.ok_btn = this.oneAttemptPopupAssets.ok_btn_hover;
  }

  houtoneAttemptOK() {
    this.oneAttemptPopupAssets.ok_btn = this.oneAttemptPopupAssets.ok_btn_original;
  }

  hoveroneAttemptClosePopup() {
    this.oneAttemptPopupAssets.close_btn = this.oneAttemptPopupAssets.close_btn_hover;
  }

  houtoneAttemptClosePopup() {
    this.oneAttemptPopupAssets.close_btn = this.oneAttemptPopupAssets.close_btn_original;
  }

  /*** Show Answer and submit Functionality after click on Yes ***/
  sendFeedback(ref, flag: string, action?: string) {
    this.feedbackInfoAudio.nativeElement.pause();
    this.feedbackInfoAudio.nativeElement.currentTime = 0;
    this.actionType = "";
    this.actionType = action;
    this.popUpFeedbackMsgUrl = '';
    this.instructionVO.nativeElement.pause();
    this.instructionVO.nativeElement.currentTime = 0;
    console.log("action", action);
    if (this.timerSubscription != undefined) {
      this.timerSubscription.unsubscribe();
    }
    this.appModel.notifyUserAction();
    ref.classList = "modal";
    if (action == "showAnswer") {
      this.popupType = "showanswer"
      this.appModel.resetBlinkingTimer();
      this.getAnswer();
      this.feedbackAudio = this.commonAssets.show_Answer_sound;
      this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.url;
      this.feedbackPopupAudio.nativeElement.play();
      this.attemptType = "showAnswer";
      this.popUpFeedbackMsgUrl = this.feedbackObj.showAnswerpopupTxt.url;
      this.feedbackPopupAudio.nativeElement.onended = () => {
        setTimeout(() => {
          this.appModel.notifyUserAction();
          if (flag == "ok") {
            this.blinkOnLastQues();
            this.fadeEverything();
          }
        }, 1000)
      }
    } else if (action == "submitAnswer") {
      if (this.submitButtonCounter == 1) {
        this.onlyOneAttemptModalRef.nativeElement.classList = "displayPopup modal";
        let feedbackoneAttemptAudio = this.oneAttemptPopupAssets.oneAttemptAudio;
        this.feedbackoneAttemptAudio.nativeElement.src = feedbackoneAttemptAudio.url;
        this.feedbackoneAttemptAudio.nativeElement.play();
      } else if (this.submitButtonCounter > 1 && (this.submitButtonCounter != this.optionArr.length)
        && (this.wrongCounter == 0) && this.responseType != "partialAttempt" && this.responseType != "" && this.responseType != "wrongAttempt") {
        //look for more option

        this.infoModalRef.nativeElement.classList = "displayPopup modal";
        let partialFeedbackAudio = this.infoPopupAssets.partialCorrectAudio;
        this.feedbackInfoAudio.nativeElement.src = partialFeedbackAudio.url;
        this.feedbackInfoAudio.nativeElement.play();
        // this.resultType = "";
        // this.appModel.stopAllTimer();
      } else {
        this.popupTopAssts = [];
        this.popupDownAssts = [];
        this.checkResponseType();
        if(!this.lookformore){
          this.appModel.enableSubmitBtn(false);
        }
        
        this.appModel.enableReplayBtn(true);
      }
    } else if (action == "oneAttempt-modal-id") {
      this.infoModalRef.nativeElement.classList = "modal";
      if (this.onlyOneAttemptModalRef && this.feedbackoneAttemptAudio.nativeElement && !this.feedbackoneAttemptAudio.nativeElement.paused) {
        this.feedbackoneAttemptAudio.nativeElement.pause();
        this.feedbackoneAttemptAudio.nativeElement.currentTime = 0;
        this.appModel.notifyUserAction();
      }
    } else if (action == "partialFeedback") {
      if (this.partialFeedbackRef && this.partialFeedbackRef.nativeElement && !this.partialFeedbackRef.nativeElement.paused) {
        this.partialFeedbackRef.nativeElement.pause();
        this.partialFeedbackRef.nativeElement.currentTime = 0;
        this.appModel.notifyUserAction();
      }
    } else if (action == "fadeEverything") {
      this.attemptTypeClose = "fadeEverything";
      this.fadeEverything();
      if (flag == "ok" && this.responseType != "partialAttempt" && this.responseType != "wrongAttempt") {
        this.blinkOnLastQues();
      }
    } else if (action == "feedbackDone") {
      if (this.responseType == "wrong") {
        this.appModel.feedbackType = "fullyIncorrect";
        this.appModel.wrongAttemptAnimation();
      } else if (this.responseType == "allcorrect") {
        this.disableScreen();
        if (flag != "yes") {
          if (flag == "ok") {

            this.blinkOnLastQues();
          }
        }
      }
    }
    if (flag == "no") {
      this.lookformore = false;
      if (this.blinkingFlag) {
        this.startBlinkOption();
      }
      if (this.attemptType != "") {
        this.disableOnInstruction();
      }
      if (action == "fadeEverything") {
        this.appModel.notifyUserAction();
        if (this.responseType != "partialAttempt" && this.responseType != "wrongAttempt") {
          this.blinkOnLastQues();
        }
      }
      if (action === undefined || action == "undefined") {
        if(flag === "no" && !this.screenFaded) {
          this.instructionBar.nativeElement.classList = "instructionBase";
        }
        this.appModel.notifyUserAction();
      }
    }
    // if (flag == "ok" && action == "fadeEverything" && this.responseType != "partialAttempt" && this.responseType != "wrongAttempt") {
    //   this.blinkOnLastQues();
    // }

  }

  /*** Instruction block Disable/Enable functionality ***/
  disableOnInstruction() {
    if (this.submitButtonCounter > 0) {
      this.appModel.enableReplayBtn(false);
    } else {
      this.appModel.enableReplayBtn(true);
    }
    if(!this.screenFaded) {
      this.renderer.removeClass(this.elementRef.nativeElement, 'disable_div');
      this.renderer.removeClass(this.instructionBar.nativeElement, 'disable_div');
      for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
        this.optionRef.nativeElement.children[i].classList = "";
      }
    }
  }

  /*** To Fade the screen functionality ***/
  fadeEverything() {
    this.blinkingFlag = false;
    this.screenFaded = true;
    this.feedbackPopupAudio.nativeElement.pause();
    this.feedbackPopupAudio.nativeElement.currentTime = 0;
    if (this.attemptTypeClose == "fadeEverything" || this.attemptTypeClose == "") {
      if (this.attemptType == "manual") {
        // this.appModel.blinkForLastQues(this.attemptType);
        this.resultType = "correct";
      } else if (this.attemptType == "wrong") {
        this.appModel.wrongAttemptAnimation();
        this.resultType = "wrong";
        this.mainContainer.nativeElement.classList.add("disableDiv");
        setTimeout(() => {
          this.startActivityCounter = 0;
          this.startActivityCounter += 1;
          this.resetOptions();
        }, 3000)
        return;
      }
      else if (this.attemptType == "showAnswer") {
        this.blinkOnLastQues();
      }
      else if (this.attemptType == "uttarDikhayein") {
      }
      else if (this.attemptType == "PartialWrong") {
        this.appModel.wrongAttemptAnimation();
        this.resultType = "partialCorrect";
        this.mainContainer.nativeElement.classList.add("disableDiv");
        setTimeout(() => {
          this.startActivityCounter = 0;
          this.startActivityCounter += 1;
          this.resetOptions();
        }, 3000)
        return;
      }
      else { }
    }
    this.appModel.enableSubmitBtn(false);
    this.appModel.enableReplayBtn(false);
    this.isDisableDiv = true;
    this.renderer.setStyle(this.optionRef.nativeElement, 'opacity', '0.3');
    this.upperImagesNo1 = true;
    this.upperImagesNo2 = true;
    this.lowerImagesNo1 = true;
    this.lowerImagesNo2 = true;
    this.optionBase = true;
    this.renderer.setStyle(this.instructionBar.nativeElement, 'opacity', '0.3');
    this.renderer.setStyle(this.scaleBoxRef.nativeElement, 'opacity', '0.3');
    for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
      this.optionRef.nativeElement.children[i].classList = "disableDiv";
    }
    if (this.optionRef != undefined && this.attemptType == "showAnswer") {
      // clearInterval(this.blinkInterval);
    }
    // this.attemptType = "";
    // this.instructionBar.nativeElement.classList = "greyOut instructionBase disableDiv";
    // this.instructionBar.nativeElement.classList = "greyOut instructionBase disable_div";
    clearInterval(this.blinkInterval);
  }

  checkAscendingOrder(i, j) {
    if(this.submittedArr[i][j][""]) {
      
    }
  }

  getkCountValue(j) {
    let returnValue = "";
    if (j>this.optionObj.given_values[this.optionObj.given_values.length-1].index) {
      return this.optionObj.given_values.length-1;
    }
    else {
      for(let i=0; i< this.optionObj.given_values.length; i++) {
        if(j<=this.optionObj.given_values[i].index) {
          return i;
        }
      }
    }
  }

  setNeglectedValue(i) {
    if(this.submittedArr[i][0] !== undefined && this.submittedArr[i][1] !== undefined && this.submittedArr[i][0].value !== this.submittedArr[i][1].value) {
      this.submittedArr[i][0]["neglectedVal"] = true;
      this.submittedArr[i][1]["neglectedVal"] = true;
    }
  }
  /*** Checks the response with input ***/

  checkResponseType() {
    clearInterval(this.blinkTimeInterval);
    this.attemptType = "manual";
    var count: number = 0;
    var prevCount: number = 0;
    var nextCount: number = 0;
    var prevLastCount: number = 0;
    var nextLastCount: number = 0;
    var kCount: number = 0;
    this.wrongCounter = 0;
    var Range: number = 0;
    var minVal: number = this.questionObj.min_val;
    var maxVal: number = this.questionObj.max_val;
    this.submittedArr = this.getSelectedArr();

    for (let i = 0; i < this.submittedArr.length; i++) {
      kCount = this.getkCountValue(i);
      for (let j = 0; j < 2; j++) {
        if (this.submittedArr[i][j] != undefined) {
          if (this.Order == "ascending") {
            if (this.submittedArr[i][j].selected != undefined) {
              if (i < this.optionObj.given_values[kCount].index) {
                let m;
                for (m = i + 1; m < this.optionObj.given_values[kCount].index; m++) {
                  this.setNeglectedValue(m);
                  if ((this.submittedArr[m][0] == undefined && this.submittedArr[m][1] == undefined) || (this.submittedArr[m][0] && this.submittedArr[m][0].neglectedVal) || (this.submittedArr[m][1] && this.submittedArr[m][1].neglectedVal)) {
                    // nextCount = m + 1;
                  } else {
                    nextCount = m;
                    break;
                  }
                }
                if (this.givenIndexes.indexOf(i + 1) > -1) {
                  nextCount = i + 1;
                }
                if (this.givenIndexes.indexOf(m) > -1) {
                  nextCount = m;
                }
                let leftValIndex, leftVal;
                if (kCount - 1 >= 0) {
                  leftValIndex = this.optionObj.given_values[kCount - 1].index;
                  leftVal = this.optionObj.given_values[kCount - 1].value;
                } else {
                  leftValIndex = 0;
                  leftVal = this.submittedArr[i][j].value;
                }
                for (let n = i - 1; n >= leftValIndex; n--) {
                  this.setNeglectedValue(n);
                  if ((this.submittedArr[n][0] == undefined && this.submittedArr[n][1] == undefined) || (this.submittedArr[n][0] && this.submittedArr[n][0].neglectedVal) || (this.submittedArr[n][1] && this.submittedArr[n][1].neglectedVal)) {
                    // prevCount = n - 1;
                  } else {
                    prevCount = n;
                    break;
                  }
                }
                if (this.submittedArr[nextCount] && this.submittedArr[nextCount][0]) {
                  if (this.submittedArr[nextCount][0].selected != undefined || nextCount === this.optionObj.given_values[kCount].index) {
                    if (this.submittedArr[i][j].value > this.submittedArr[nextCount][0].value || this.submittedArr[i][j].value > this.optionObj.given_values[kCount].value) {
                      this.submittedArr[i][j].isAtCorrectPos = false;
                    }
                  }
                }
                if (this.submittedArr[nextCount] && this.submittedArr[nextCount][1]) {
                  if (this.submittedArr[nextCount][1].selected != undefined || nextCount === this.optionObj.given_values[kCount].index) {
                    if (this.submittedArr[i][j].value > this.submittedArr[nextCount][1].value || this.submittedArr[i][j].value > this.optionObj.given_values[kCount].value) {
                      this.submittedArr[i][j].isAtCorrectPos = false;
                    }
                  }
                }
                if (this.submittedArr[prevCount] && this.submittedArr[prevCount][0]) {
                  if (this.submittedArr[i][j].value < this.submittedArr[prevCount][0].value || this.submittedArr[i][j].value < leftVal) {
                    this.submittedArr[i][j].isAtCorrectPos = false;
                  }
                }
                if (this.submittedArr[prevCount] && this.submittedArr[prevCount][1]) {
                  if (this.submittedArr[i][j].value < this.submittedArr[prevCount][1].value || this.submittedArr[i][j].value < leftVal) {
                    this.submittedArr[i][j].isAtCorrectPos = false;
                  }
                }
              }
              if (i > this.optionObj.given_values[kCount].index) {
                if (kCount == 1) {
                  Range = this.submittedArr.length;
                } else {
                  if (this.optionObj.given_values[1] != undefined) {
                    Range = this.optionObj.given_values[1].index;
                  }
                }
                for (let m = i + 1; m < Range; m++) {
                  this.setNeglectedValue(m);
                  if ((this.submittedArr[m][0] == undefined && this.submittedArr[m][1] == undefined) || (this.submittedArr[m][0] && this.submittedArr[m][0].neglectedVal) || (this.submittedArr[m][1] && this.submittedArr[m][1].neglectedVal)) {
                    // count = m + 1;
                    if (m === this.submittedArr.length - 1) {
                      nextLastCount = m + 1;
                    }
                  } else {
                    nextLastCount = m;
                    break;
                  }
                }
                for (let n = i - 1; n >= this.optionObj.given_values[this.optionObj.given_values.length - 1].index; n--) {
                  this.setNeglectedValue(n);
                  if ((this.submittedArr[n][0] == undefined && this.submittedArr[n][1] == undefined) || (this.submittedArr[n][0] && this.submittedArr[n][0].neglectedVal) || (this.submittedArr[n][1] && this.submittedArr[n][1].neglectedVal)) {
                    // count = m + 1;
                  } else {
                    prevLastCount = n;
                    break;
                  }
                }
                if (this.submittedArr[nextLastCount] && this.submittedArr[nextLastCount][0]) {
                  if (this.submittedArr[nextLastCount][0].selected != undefined || nextLastCount === this.optionObj.given_values[kCount].index) {
                    if (this.submittedArr[i][j].value > this.submittedArr[nextLastCount][0].value || this.submittedArr[i][j].value < this.optionObj.given_values[kCount].value) {
                      this.submittedArr[i][j].isAtCorrectPos = false;
                    }
                  }
                }
                if (this.submittedArr[nextLastCount] && this.submittedArr[nextLastCount][1]) {
                  if (this.submittedArr[nextLastCount][1].selected != undefined || nextLastCount === this.optionObj.given_values[kCount].index) {
                    if (this.submittedArr[i][j].value > this.submittedArr[nextLastCount][1].value || this.submittedArr[i][j].value < this.optionObj.given_values[kCount].value) {
                      this.submittedArr[i][j].isAtCorrectPos = false;
                    }
                  }
                }
                if (this.submittedArr[prevLastCount] && this.submittedArr[prevLastCount][0]) {
                  if (this.submittedArr[prevLastCount][0].selected != undefined) {
                    if (this.submittedArr[i][j].value < this.submittedArr[prevLastCount][0].value) {
                      this.submittedArr[i][j].isAtCorrectPos = false;
                    }
                  }
                }
                if (this.submittedArr[prevLastCount] && this.submittedArr[prevLastCount][1]) {
                  if (this.submittedArr[prevLastCount][1].selected != undefined) {
                    if (this.submittedArr[i][j].value < this.submittedArr[prevLastCount][1].value) {
                      this.submittedArr[i][j].isAtCorrectPos = false;
                    }
                  }
                }
                if (this.submittedArr[i][j].value < this.optionObj.given_values[kCount].value) {
                  this.submittedArr[i][j].isAtCorrectPos = false;
                } else if (i !== this.optionObj.given_values[kCount].index && this.submittedArr[i][j].value === this.optionObj.given_values[kCount].value) {
                  this.submittedArr[i][j].isAtCorrectPos = false;
                }
              }
              if (this.givenIndexes.indexOf(i) < 0 && this.givenValues.indexOf(this.submittedArr[i][j].value) > -1) {
                this.submittedArr[i][j].isAtCorrectPos = false;
              }
              if (i == this.optionObj.given_values[kCount].index) {
                if (this.submittedArr[i][j].value != this.optionObj.given_values[kCount].value) {
                  this.submittedArr[i][j].isAtCorrectPos = false;

                }
              }
              if (this.submittedArr[i][0] != undefined && this.submittedArr[i][1] != undefined) {
                this.submittedArr[i][0].isAtCorrectPos = false;
                this.submittedArr[i][1].isAtCorrectPos = false;
              }
              if (i == this.optionObj.given_values[kCount].index) {
                if (this.submittedArr[i][j].value == this.optionObj.given_values[kCount].value) {
                  this.submittedArr[i][j].isAtCorrectPos = true;
                }
              }
              if (this.submittedArr[i][j].isAtCorrectPos == false) {
                if (this.submittedArr[i][0] != undefined && this.submittedArr[i][1] != undefined) {
                  this.wrongCounter += 1;
                } else {
                  this.wrongCounter += 1;
                }
              }
            }
          }
          if (this.Order == "descending") {
            if (this.submittedArr[i][j].selected != undefined) {
              if (i < this.optionObj.given_values[kCount].index) {
                let m;
                for (m = i + 1; m < this.optionObj.given_values[kCount].index; m++) {
                  this.setNeglectedValue(m);
                  if ((this.submittedArr[m][0] == undefined && this.submittedArr[m][1] == undefined) || (this.submittedArr[m][0] && this.submittedArr[m][0].neglectedVal) || (this.submittedArr[m][1] && this.submittedArr[m][1].neglectedVal)) {
                    // count = m + 1;
                  } else {
                    nextCount = m;
                    break;
                  }
                }
                if (this.givenIndexes.indexOf(i + 1) > -1) {
                  nextCount = i + 1;
                }
                if (this.givenIndexes.indexOf(m) > -1) {
                  nextCount = m;
                }
                let leftValIndex, leftVal;
                if (kCount - 1 >= 0) {
                  leftValIndex = this.optionObj.given_values[kCount - 1].index;
                  leftVal = this.optionObj.given_values[kCount - 1].value;
                } else {
                  leftValIndex = 0;
                  leftVal = this.submittedArr[i][j].value;
                }
                for (let n = i - 1; n >= leftValIndex; n--) {
                  this.setNeglectedValue(n);
                  if ((this.submittedArr[n][0] == undefined && this.submittedArr[n][1] == undefined) || (this.submittedArr[n][0] && this.submittedArr[n][0].neglectedVal) || (this.submittedArr[n][1] && this.submittedArr[n][1].neglectedVal)) {
                    // prevCount = n - 1;
                  } else {
                    prevCount = n;
                    break;
                  }
                }
                if (this.submittedArr[nextCount] && this.submittedArr[nextCount][0]) {
                  if (this.submittedArr[nextCount][0].selected != undefined || nextCount === this.optionObj.given_values[kCount].index) {
                    if (this.submittedArr[i][j].value < this.submittedArr[nextCount][0].value || this.submittedArr[i][j].value < this.optionObj.given_values[kCount].value) {
                      this.submittedArr[i][j].isAtCorrectPos = false;
                    }
                  }
                }
                if (this.submittedArr[nextCount] && this.submittedArr[nextCount][1]) {
                  if (this.submittedArr[nextCount][1].selected != undefined || nextCount === this.optionObj.given_values[kCount].index) {
                    if (this.submittedArr[i][j].value < this.submittedArr[nextCount][1].value || this.submittedArr[i][j].value < this.optionObj.given_values[kCount].value) {
                      this.submittedArr[i][j].isAtCorrectPos = false;
                    }
                  }
                }
                if (this.submittedArr[prevCount] && this.submittedArr[prevCount][0]) {
                  if (this.submittedArr[i][j].value > this.submittedArr[prevCount][0].value || this.submittedArr[i][j].value > leftVal) {
                    this.submittedArr[i][j].isAtCorrectPos = false;
                  }
                }
                if (this.submittedArr[prevCount] && this.submittedArr[prevCount][1]) {
                  if (this.submittedArr[i][j].value > this.submittedArr[prevCount][1].value || this.submittedArr[i][j].value > leftVal) {
                    this.submittedArr[i][j].isAtCorrectPos = false;
                  }
                }
              }
              if (i > this.optionObj.given_values[kCount].index) {
                if (kCount == this.optionObj.given_values.length - 1) {
                  Range = this.submittedArr.length - 1;
                }
                else {
                  if (this.optionObj.given_values[kCount] != undefined) {
                    Range = this.optionObj.given_values[kCount].index;
                  }
                }
                for (let m = i + 1; m <= Range; m++) {
                  this.setNeglectedValue(m);
                  if ((this.submittedArr[m][0] == undefined && this.submittedArr[m][1] == undefined) || (this.submittedArr[m][0] && this.submittedArr[m][0].neglectedVal) || (this.submittedArr[m][1] && this.submittedArr[m][1].neglectedVal)) {
                    // count = m + 1;
                    if (m === this.submittedArr.length - 1) {
                      nextLastCount = m + 1;
                    }
                  }
                  else {
                    nextLastCount = m;
                    break;
                  }
                }
                if(i === this.submittedArr.length - 1) {
                  nextLastCount = Infinity;
                }
                for (let n = i - 1; n >= this.optionObj.given_values[this.optionObj.given_values.length - 1].index; n--) {
                  this.setNeglectedValue(n);
                  if ((this.submittedArr[n][0] == undefined && this.submittedArr[n][1] == undefined) || (this.submittedArr[n][0] && this.submittedArr[n][0].neglectedVal) || (this.submittedArr[n][1] && this.submittedArr[n][1].neglectedVal)) {
                    // count = m + 1;
                  } else {
                    prevLastCount = n;
                    break;
                  }
                }
                // }
                if (this.submittedArr[nextLastCount] && this.submittedArr[nextLastCount][0]) {
                  if (this.submittedArr[nextLastCount][0].selected != undefined || nextLastCount === this.optionObj.given_values[kCount].index) {
                    if (this.submittedArr[i][j].value < this.submittedArr[nextLastCount][0].value || this.submittedArr[i][j].value > this.optionObj.given_values[kCount].value) {
                      this.submittedArr[i][j].isAtCorrectPos = false;
                    }
                  }
                }
                if (this.submittedArr[nextLastCount] && this.submittedArr[nextLastCount][1]) {
                  if (this.submittedArr[nextLastCount][1].selected != undefined || nextLastCount === this.optionObj.given_values[kCount].index) {
                    if (this.submittedArr[i][j].value < this.submittedArr[nextLastCount][1].value || this.submittedArr[i][j].value > this.optionObj.given_values[kCount].value) {
                      this.submittedArr[i][j].isAtCorrectPos = false;
                    }
                  }
                }
                if (this.submittedArr[prevLastCount] && this.submittedArr[prevLastCount][0]) {
                  if (this.submittedArr[prevLastCount][0].selected != undefined) {
                    if (this.submittedArr[i][j].value > this.submittedArr[prevLastCount][0].value) {
                      // if (this.submittedArr[i - 1][0].value > this.optionObj.given_values[kCount].value) {
                      this.submittedArr[i][j].isAtCorrectPos = false;
                      // }
                    }
                  }
                }
                if (this.submittedArr[prevLastCount] && this.submittedArr[prevLastCount][1]) {
                  if (this.submittedArr[prevLastCount][1].selected != undefined) {
                    if (this.submittedArr[i][j].value > this.submittedArr[prevLastCount][1].value) {
                      this.submittedArr[i][j].isAtCorrectPos = false;
                    }
                  }
                }
                if (this.submittedArr[i][j].value > this.optionObj.given_values[kCount].value) {
                  this.submittedArr[i][j].isAtCorrectPos = false;
                } else if (i !== this.optionObj.given_values[kCount].index && this.submittedArr[i][j].value === this.optionObj.given_values[kCount].value) {
                  this.submittedArr[i][j].isAtCorrectPos = false;
                }
              }
              if (this.givenIndexes.indexOf(i) < 0 && this.givenValues.indexOf(this.submittedArr[i][j].value) > -1) {
                this.submittedArr[i][j].isAtCorrectPos = false;
              }
              if (i == this.optionObj.given_values[kCount].index) {
                if (this.submittedArr[i][j].value != this.optionObj.given_values[kCount].value) {
                  this.submittedArr[i][j].isAtCorrectPos = false;
                }
              }
              if (this.submittedArr[i][0] != undefined && this.submittedArr[i][1] != undefined) {
                this.submittedArr[i][0].isAtCorrectPos = false;
                this.submittedArr[i][1].isAtCorrectPos = false;
              }
              if (i == this.optionObj.given_values[kCount].index) {
                if (this.submittedArr[i][j].value == this.optionObj.given_values[kCount].value) {
                  this.submittedArr[i][j].isAtCorrectPos = true;
                }
              }
              if (this.submittedArr[i][j].isAtCorrectPos == false) {
                if (this.submittedArr[i][0] != undefined && this.submittedArr[i][1] != undefined) {
                  this.wrongCounter += 1;
                } else {
                  this.wrongCounter += 1;
                }
              }
            }
          }
        }
      }
    }

    if (this.wrongCounter == this.submitButtonCounter) {
      this.resultType = "wrong";
      this.popupType = "wrong";
      this.wrongCounter = 0;
      this.appModel.notifyUserAction();
    }
    else if (this.wrongCounter == 0) {
      this.resultType = "correct";
      this.wrongCounter = 0;
      this.popupType = "correct";
      this.appModel.notifyUserAction();
    }
    else {
      this.resultType = "partialCorrect";
      this.wrongCounter = 0;
      this.popupType = "partialCorrect"
      this.appModel.notifyUserAction();
    }

    if (this.resultType != "") {

      if (this.optIndxArr.length == 0 && this.resultType == "correct" && this.submitButtonCounter == this.optionArr.length) {
        this.responseType = "allCorrect";
        console.log("all Correct congratessssss");
        this.feedbackAudio = this.feedbackObj.correctAudio;
        this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.url;

        this.feedbackPopupAudio.nativeElement.play();
        this.attemptType = "manual";
        this.feedbackPopupAudio.nativeElement.onended = () => {
          setTimeout(() => {
            this.appModel.notifyUserAction();
          }, 1000)
        }

        // this.feedback.headerTxt_img = this.feedback.wrong_headerTxt_img;
      } else if (this.resultType == "wrong") {
        this.responseType = "wrongAttempt";
        console.log("wrongggg oopppssssss");
        this.feedbackAudio = this.feedbackObj.incorrectAudio;
        this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.url;

        this.feedbackPopupAudio.nativeElement.play();
        this.attemptType = "wrong";
        this.feedbackPopupAudio.nativeElement.onended = () => {
          this.appModel.notifyUserAction();
        }
      }
      else if (this.resultType == "partialCorrect") {
        this.responseType = "partialAttempt";
        this.attemptType = "PartialWrong";
        this.feedbackAudio = this.feedbackObj.partialIncorrect_sound;
        this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.url;

        this.feedbackPopupAudio.nativeElement.play();
        this.feedbackPopupAudio.nativeElement.onended = () => {
          setTimeout(() => {
            this.appModel.notifyUserAction();
          }, 1000)
        }


        //this.feedback.headerTxt_img = this.feedback.right_headerTxt_img;
      }
      for (let i = 0; i < this.submittedArr.length; i++) {
        if (this.submittedArr[i][0] == undefined) {
          let obj = {
            url: this.optionObj.place_holder.url,
            location: this.optionObj.place_holder.location
          }
          this.popupTopAssts.push(obj);
        } else {
          this.popupTopAssts.push(this.submittedArr[i][0]);
        }
        if (this.submittedArr[i][1] == undefined) {
          let obj = {
            url: this.optionObj.place_holder.url,
            location: this.optionObj.place_holder.location
          }
          this.popupDownAssts.push(obj);
        } else {
          this.popupDownAssts.push(this.submittedArr[i][1]);
        }
      }

      this.confirmModalRef.nativeElement.classList = "modal";
      this.confirmSubmitRef.nativeElement.classList = "modal";
      this.modalfeedback20.nativeElement.classList = "modal displayPopup";
      this.setPopupAssets();
    }
  }

  /***  Selected options array ***/
  getSelectedArr() {
    let arr = new Array();
    for (let i = 0; i < this.placeHolderArrUp.length; i++) {
      arr[i] = new Array();
      if (this.placeHolderArrUp[i].place) {
        arr[i][0] = this.placeHolderArrUp[i];
      } else {
        arr[i][0] = undefined;
      }
      if (this.placeHolderArrDown[i].place) {
        arr[i][1] = this.placeHolderArrDown[i];
      } else {
        arr[i][1] = undefined;
      }
    }
    return arr;
  }

  blinkOnLastQues() {
    this.actComplete = true;
    if (this.appModel.isLastSectionInCollection) {
      this.appModel.blinkForLastQues(this.attemptType);
      this.appModel.stopAllTimer();
      this.disableScreen();
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
      this.appModel.moveNextQues(this.attemptType);
      this.disableScreen();
    }
    this.instructionBar.nativeElement.classList = "greyOut instructionBase disable_div";
  }

  /*** Screen disable functionality ***/
  disableScreen() {
    this.instructionBar.nativeElement.classList = "greyOut instructionBase";
    // this.instructionBar.nativeElement.classList = "greyOut instructionBase disableDiv";

    //remove $(this.mainContainer.nativeElement.children[0]).addClass('greyOut');
    // this.elementRef.nativeElement.children[0].className = "greyOut";

    if (this.optionHolder != undefined) {
      this.optionHolder.leftHolder = this.optionHolder.leftHolder_original;
      this.optionHolder.rightHolder = this.optionHolder.rightHolder_original;
    }
    if (this.categoryA && this.categoryA.correct && this.categoryA.correct.length) {
      this.categoryA.correct.splice(0, this.categoryA.correct.length);
    }
    if (this.categoryA && this.categoryA.incorrect && this.categoryA.incorrect.length) {
      this.categoryA.incorrect.splice(0, this.categoryA.incorrect.length);
    }
    if (this.categoryB && this.categoryB.correct && this.categoryB.correct.length) {
      this.categoryB.correct.splice(0, this.categoryB.correct.length);
    }
    if (this.categoryB && this.categoryB.incorrect && this.categoryB.incorrect.length) {
      this.categoryB.incorrect.splice(0, this.categoryA.incorrect.length);
    }
    if (this.category && this.category.correct && this.category.correct.length) {
      this.category.correct.splice(0, this.category.correct.length);
    }
    if (this.category && this.category.incorrect && this.category.incorrect.length) {
      this.category.incorrect.splice(0, this.category.incorrect.length);
    }
    clearInterval(this.blinkTimeInterval);
    this.appModel.enableReplayBtn(false);
  }

  hoverSubmitConfirm() {
    this.confirmSubmitAssets.confirm_btn = this.confirmSubmitAssets.confirm_btn_hover;
  }
  houtSubmitConfirm() {
    this.confirmSubmitAssets.confirm_btn = this.confirmSubmitAssets.confirm_btn_original;
  }
  hoverSubmitDecline() {
    this.confirmSubmitAssets.decline_btn = this.confirmSubmitAssets.decline_btn_hover;
  }
  houtSubmitDecline() {
    this.confirmSubmitAssets.decline_btn = this.confirmSubmitAssets.decline_btn_original;
  }




  /***  Get answer and match the response based on ascending/descending order ***/
  getAnswer() {
    let addedArr = this.optionObj.given_values.concat(this.optionArr);
    let optCopy = JSON.parse(JSON.stringify(addedArr));
    this.sortedOptArr = optCopy.sort((a, b) => {
      if (this.Order == "ascending") {
        return a.value - b.value;
      }
      if (this.Order == "descending") {
        return b.value - a.value;
      }
    })
    this.setGivenValue();
    this.feedbackAudio = this.feedbackObj.show_Answer_sound;
    this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.url;
    this.feedbackPopupAudio.nativeElement.play();
    this.feedbackPopupAudio.nativeElement.onended = () => {
      setTimeout(() => {
        this.fadeEverything();
      }, 1000)
    }
  }

  templatevolume(vol, obj) {
    if (obj.quesVORef && obj.quesVORef.nativeElement) {
      obj.quesVORef.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.instructionVO && obj.instructionVO.nativeElement) {
      obj.instructionVO.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackPopupAudio && obj.feedbackPopupAudio.nativeElement) {
      obj.feedbackPopupAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackInfoAudio && obj.feedbackInfoAudio.nativeElement) {
      obj.feedbackInfoAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.audio) {
      obj.audio.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.mainVideo && obj.mainVideo.nativeElement) {
      this.mainVideo.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
  }

  /***  Click on placeholder to set blinking option ***/
  selectPosition(index, pos) {
    this.resetCounterFlag = true;
    if (!this.isDisablePlaceholder) {
      this.instructionVO.nativeElement.pause();
      this.instructionVO.nativeElement.currentTime = 0;
    }
    this.disableOnInstruction();
    this.appModel.notifyUserAction();
    if (this.submitButtonCounter == this.optionArr.length) {
      return;
    }
    this.selectedPositionIndex = index;
    this.selectedPosition = pos;
    console.log("index = " + index);
    this.appModel.enableReplayBtn(false);
    this.mainContainer.nativeElement.classList = "bodyContent disableDiv";
    clearInterval(this.blinkInterval);
    this.RandomResizeIndex = this.randomOptIndx;
    this.from = this.optionRef.nativeElement.children[this.randomOptIndx].getBoundingClientRect();
    if (pos == 'up') {
      let to = this.upPlaceHolder.nativeElement.children[index].getBoundingClientRect();
      this.blinkingOpt.toCord = to;
      this.optionArr[this.randomOptIndx]['isOpen'] = false;
      this.optionArr[this.randomOptIndx]['leftPos'] = (to.left - (this.from.left)) + "px";
      this.optionArr[this.randomOptIndx]['topPos'] = (to.top - (this.from.top)) + "px";
      this.optionArr[this.randomOptIndx]['optWidth'] = to.width + "px";
    } else if (pos == 'down') {
      let to = this.downPlaceHolder.nativeElement.children[index].getBoundingClientRect();
      this.blinkingOpt.toCord = to;
      this.optionArr[this.randomOptIndx]['isOpen'] = false;
      this.optionArr[this.randomOptIndx]['leftPos'] = (to.left - (this.from.left)) + "px";
      this.optionArr[this.randomOptIndx]['topPos'] = (to.top - (this.from.top)) + "px";
      this.optionArr[this.randomOptIndx]['optWidth'] = to.width + "px";
    }
    if (index == this.idOfImage) {
      console.log("correctMatch");
      this.IdImageArr.push(index);
    }
    else {
      console.log("WrongMatch");
    }
  }

  onAnimationEvent(event: AnimationEvent, opt, j) {
    this.animationFlag = true;
    if (event.fromState == "open" && event.toState == "closed" && event.phaseName == "done") {
      this.tabLoadAnimationFlag = false;
      // this.appModel.enableSubmitBtn(true);
      this.appModel.handlePostVOActivity(true);
      if (this.selectedPosition == 'down') {
        this.pushToDownPlaceHolder(this.selectedPositionIndex, this.from);
      } else if (this.selectedPosition == 'up') {
        this.pushToUpPlaceHolder(this.selectedPositionIndex, this.from);
      }
      setTimeout(() => {
        if (this.submitButtonCounter == this.optionArr.length) {
          this.isDisablePlaceholder = true
        } else {
          this.isDisablePlaceholder = false
        }
      },500);
      this.instructionBar.nativeElement.classList = "instructionBase";

    } else if (event.fromState == "closed" && event.toState == "open" && event.phaseName == "done" && this.resetCounterFlag == true) {
      this.tabLoadAnimationFlag = false;
      // this.isDisablePlaceholder = false;
      this.appModel.handlePostVOActivity(true);
      if (this.selectedPosition == 'down') {
        this.deleteDownPlaceHolder(this.reverseOption, this.reverseOptionIndex);
      } else if (this.selectedPosition == 'up') {
        this.deleteUpPlaceHolder(this.reverseOption, this.reverseOptionIndex);
      }
      setTimeout(() => {
        this.isDisablePlaceholder = false;
      },500);
      this.mainContainer.nativeElement.classList = "bodyContent";
      this.instructionBar.nativeElement.classList = "instructionBase";
      // clearInterval(this.blinkInterval);
      // this.getRandomIndxBlink(this.reverseOption.index);
    }
    if(this.resetOptionsFlag) {
      setTimeout(() => {
        this.mainContainer.nativeElement.classList.remove("disableDiv");
        this.resetOptionsFlag = false;
      },500);
    }
    setTimeout(() => {
      this.animationFlag = false;
      if (!this.tabLoadAnimationFlag) {
        this.appModel.handlePostVOActivity(false);
      }
      // this.appModel.enableSubmitBtn(true);
    }, 600);
  }
  /*End-Template click and hover events*/


  /*Start-Template Functions*/
  pushToUpPlaceHolder(index, from) {
    this.submitButtonCounter += 1;
    this.blinkingOpt.place = 'up';
    let tempArr = JSON.parse(JSON.stringify(this.placeHolderArrUp))
    tempArr.splice(index, 1, this.blinkingOpt);
    setTimeout(() => {
      this.placeHolderArrUp = JSON.parse(JSON.stringify(tempArr))
    }, 10)
    this.optionRef.nativeElement.children[this.randomOptIndx].style.visibility = "hidden";
    this.appModel.enableSubmitBtn(true);
    this.appModel.enableReplayBtn(false);
    this.getRandomIndxBlink();
    setTimeout(() => {
      this.mainContainer.nativeElement.classList = "bodyContent";
    }, 500)
    if (this.submitButtonCounter >= this.optionArr.length) {
      this.appModel.enableSubmitBtn(true);
      this.appModel.enableReplayBtn(false);
    }
    this.blinkCounter++;
  }

  pushToDownPlaceHolder(index, from) {
    this.submitButtonCounter += 1;
    this.blinkingOpt.place = 'down';
    this.placeHolderArrDown.splice(index, 1, this.blinkingOpt)
    let tempArr = JSON.parse(JSON.stringify(this.placeHolderArrDown))
    tempArr.splice(index, 1, this.blinkingOpt);
    setTimeout(() => {
      this.placeHolderArrDown = JSON.parse(JSON.stringify(tempArr))
    }, 10)
    this.optionRef.nativeElement.children[this.randomOptIndx].style.visibility = "hidden";
    this.appModel.enableSubmitBtn(true);
    this.appModel.enableReplayBtn(false);
    this.getRandomIndxBlink();
    setTimeout(() => {
      this.mainContainer.nativeElement.classList = "bodyContent";
    }, 500)
    if (this.submitButtonCounter >= this.optionArr.length) {
      this.appModel.enableSubmitBtn(true);
      this.appModel.enableReplayBtn(false);
    }
    this.blinkCounter++;
  }

  reversePosition(opt, idx, pos) {
    let isGivenValue = false;
    this.optionObj.given_values.forEach(givenValue => {
      if(givenValue.index === idx && givenValue.place === pos) {
        isGivenValue = true;
      }
    })
    if(isGivenValue) {
      return;
    }
    this.reverseOption = opt;
    this.reverseOptionIndex = idx;
    this.instructionVO.nativeElement.pause();
    this.instructionVO.nativeElement.currentTime = 0;
    if (opt.imgsrc.Bg != undefined) {
      return;
    }
    this.appModel.notifyUserAction();
    this.disableOnInstruction();
    this.mainContainer.nativeElement.classList = "bodyContent disableDiv";
    if (pos == 'up') {
      this.optionRef.nativeElement.children[opt.index].style.zIndex = "5";
      this.optionRef.nativeElement.children[opt.index].style.visibility = "visible";
      this.placeHolderArrUp.splice(idx, 1, this.optionObj.place_holder);
      this.optionArr[opt.index]['isOpen'] = true;
      this.optionArr[opt.index]['leftPos'] = 0 + "px";
      this.optionArr[opt.index]['topPos'] = 0 + "px";
      this.optionReverseTopPosition = this.optionRef.nativeElement.children[opt.index].getBoundingClientRect().top;
    } else if (pos == 'down') {
      this.optionRef.nativeElement.children[opt.index].style.zIndex = "5";
      this.optionRef.nativeElement.children[opt.index].style.visibility = "visible";
      this.placeHolderArrDown.splice(idx, 1, this.optionObj.place_holder);
      this.optionArr[opt.index]['isOpen'] = true;
      this.optionArr[opt.index]['leftPos'] = 0 + "px";
      this.optionArr[opt.index]['topPos'] = 0 + "px";
      this.optionReverseTopPosition = this.optionRef.nativeElement.children[opt.index].getBoundingClientRect().top;
    }
    this.IdImageArr.pop();
  }

  deleteUpPlaceHolder(opt, idx) {
    if (opt != undefined && opt.index != undefined) {
      this.optIndxArr.push(opt.index);
      this.optionRef.nativeElement.children[opt.index].children[0].src = this.optionObj.option_common_assets.default_box_original.url;
    }
    if (this.submitButtonCounter == this.optionArr.length) {
      this.getRandomIndxBlink();
    }
    this.blinkCounter--;
    this.submitButtonCounter -= 1;
    if (this.submitButtonCounter == 0) {
      this.appModel.enableSubmitBtn(false);
      this.appModel.enableReplayBtn(true);
    }
  }

  deleteDownPlaceHolder(opt, idx) {
    if (opt != undefined && opt.index != undefined) {
      this.optIndxArr.push(opt.index);
      this.optionRef.nativeElement.children[opt.index].children[0].src = this.optionObj.option_common_assets.default_box_original.url;
    }
    if (this.submitButtonCounter == this.optionArr.length) {
      this.getRandomIndxBlink();
    }
    this.blinkCounter--;
    this.submitButtonCounter -= 1;
    if (this.submitButtonCounter == 0) {
      this.appModel.enableSubmitBtn(false);
      this.appModel.enableReplayBtn(true);
    }
  }

  resetOptions() {
    this.resetOptionsFlag = true;
    this.lookformore = false;
    this.appModel.enableSubmitBtn(false);
    this.animationFlag = true;
    this.isDisablePlaceholder = false;
    for (let i = 0; i < this.optionArr.length; i++) {
      this.optionRef.nativeElement.children[i].style.zIndex = "5";
      this.optionRef.nativeElement.children[i].style.visibility = "visible";
      this.optionArr[i]['isOpen'] = true;
      this.optionArr[i]['leftPos'] = 0 + "px";
      this.optionArr[i]['topPos'] = 0 + "px";
      if (this.optionRef != undefined) {
        this.optionRef.nativeElement.children[i].children[0].src = this.optionObj.option_common_assets.default_box_original.url;
      }
    }
    for (let j = 0; j < this.placeHolderArrDown.length; j++) {
      this.placeHolderArrDown.splice(j, 1, this.optionObj.place_holder);
      this.placeHolderArrUp.splice(j, 1, this.optionObj.place_holder);
    }
    setTimeout(() => {
      if (this.startActivityCounter == 1) {
        this.optIndxArr = [];
        this.startActivity();
        this.startActivityCounter += 1;
      }
    }, 500)
    for (let i in this.optionObj.given_values) {
      let opt = {
        imgsrc: '',
        imgsrc_partial: '',
        place: '',
        value: ''
      }
      if (this.optionObj.given_values[i].place == "down") {
        opt.place = 'down';
        opt.imgsrc = this.optionObj.given_values[i].imgsrc;
        opt.imgsrc_partial = this.optionObj.given_values[i].imgsrc_partial;
        opt.value = this.optionObj.given_values[i].value
        this.placeHolderArrDown.splice(this.optionObj.given_values[i].index, 1, opt);
      } else if (this.optionObj.given_values[i].place == "up") {
        opt.place = 'up';
        opt.imgsrc = this.optionObj.given_values[i].imgsrc;
        opt.imgsrc_partial = this.optionObj.given_values[i].imgsrc_partial;
        opt.value = this.optionObj.given_values[i].value
        this.placeHolderArrUp.splice(this.optionObj.given_values[i].index, 1, opt);
      }
    }
    this.submitButtonCounter = 0;
    this.resetCounterFlag = false;
    clearInterval(this.blinkTimeInterval);
    this.partialCorrectCase = false;
    this.blinkingFlag = true;

  }

  setGivenValue() {
    this.showAnswerCounter = 0;
    for (let i = 0; i < this.sortedOptArr.length; i++) {
      let opt = {
        imgsrc: '',
        imgsrc_partial: '',
        selected: true,
        place: '',
        value: '',
        index: '',
        BlueBg: false,
        isAtCorrectPos: true
      }
      opt.imgsrc = this.sortedOptArr[i].imgsrc;
      opt.imgsrc_partial = this.sortedOptArr[i].imgsrc_partial;
      opt.value = this.sortedOptArr[i].value;
      opt.index = this.sortedOptArr[i].index;
      opt.BlueBg = this.sortedOptArr[i].BlueBg;
      opt.place = this.sortedOptArr[i].place;

      if (opt.BlueBg == false) {
        if (opt.place == 'down') {
          this.placeHolderArrDownPopup.splice(this.showAnswerCounter, 1, opt);
        }
        else {
          this.placeHolderArrUpPopup.splice(this.showAnswerCounter, 1, opt);
        }
        this.showAnswerCounter += 1;
      }
      else {
        if (opt.place == 'up') {
          this.placeHolderArrUpPopup.splice(this.showAnswerCounter, 1, opt);
        }
        else {
          this.placeHolderArrDownPopup.splice(this.showAnswerCounter, 1, opt);
        }
      }
    }
    this.popupTopAssts = this.placeHolderArrUpPopup;
    this.popupDownAssts = this.placeHolderArrDownPopup;
    this.confirmModalRef.nativeElement.classList = "modal";
    this.confirmSubmitRef.nativeElement.classList = "modal";
    this.modalfeedback20.nativeElement.classList = "modal displayPopup";
    this.setPopupAssets();
  }

  setPopupAssets() {
    console.log(this.feedbackObj);
    console.log("check pop up type", "this.attemptType:", this.attemptType, "this.resultType:", this.resultType, "this.popupType:", this.popupType)
    if (this.popupType == "wrong") {
      this.partialCorrectCase = false;
      this.rightanspopUpheader_img = false;
      this.wronganspopUpheader_img = true;
      this.showanspopUpheader_img = false;
      this.partialCorrectheaderTxt_img = false;
      this.styleHeaderPopup = this.feedbackObj.wrong_style_header;
      this.styleBodyPopup = this.feedbackObj.wrong_style_body;
      this.popUpFeedbackMsgUrl = this.feedbackObj.wrongAnswerpopupTxt.url;
      // this.appModel.stopAllTimer();
    }
    if (this.popupType == "partialCorrect") {
      this.rightanspopUpheader_img = false;
      this.partialCorrectCase = true;
      this.wronganspopUpheader_img = false;
      this.showanspopUpheader_img = false;
      this.partialCorrectheaderTxt_img = true;
      this.styleHeaderPopup = this.feedbackObj.partial_style_header;
      this.styleBodyPopup = this.feedbackObj.partial_style_body;
      this.popUpFeedbackMsgUrl = this.feedbackObj.partialIncorrAnswerpopupTxt.url;
      // this.appModel.stopAllTimer();
    }
    if (this.popupType == "correct" && this.submitButtonCounter == this.optionArr.length) {
      this.partialCorrectCase = false;
      this.rightanspopUpheader_img = true;
      this.wronganspopUpheader_img = false;
      this.showanspopUpheader_img = false;
      this.partialCorrectheaderTxt_img = false;
      this.styleHeaderPopup = this.feedbackObj.style_header;
      this.styleBodyPopup = this.feedbackObj.style_body;
      this.popUpFeedbackMsgUrl = this.feedbackObj.rightAnswerpopupTxt.url;
      // this.appModel.stopAllTimer();
    }
    if (this.popupType == "correct" && this.submitButtonCounter != this.optionArr.length) {
      this.modalfeedback20.nativeElement.classList = "modal";
      this.infoModalRef.nativeElement.classList = "displayPopup modal";
      this.lookformore = true;
      let partialFeedbackAudio = this.infoPopupAssets.partialCorrectAudio;
      this.feedbackInfoAudio.nativeElement.src = partialFeedbackAudio.url;
      this.feedbackInfoAudio.nativeElement.play();
      // lookFOrMore case
    }

    if (this.popupType == "showanswer") {
      this.rightanspopUpheader_img = false;
      this.wronganspopUpheader_img = false;
      this.showanspopUpheader_img = true;
      this.partialCorrectCase = false;
      this.partialCorrectheaderTxt_img = false;
      this.styleHeaderPopup = this.feedbackObj.style_header;
      this.styleBodyPopup = this.feedbackObj.style_body;
      this.popUpFeedbackMsgUrl = this.feedbackObj.showAnswerpopupTxt.url;

      if (this.actionType == "showAnswer") {
        this.appModel.stopAllTimer();
      } else {
        this.appModel.notifyUserAction();
      }
    }
    if (this.actionType == "submitAnswer") {
      if(!this.lookformore){
        this.appModel.stopAllTimer();
      }
      
    } else {
      this.appModel.notifyUserAction();
    }
    // clearInterval(this.blinkTimeInterval);
  }


}
