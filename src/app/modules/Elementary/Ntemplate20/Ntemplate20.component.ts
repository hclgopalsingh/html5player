import { Component, OnInit, ViewChild, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { PlayerConstants } from '../../../common/playerconstants';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { ThemeConstants } from '../../../common/themeconstants';
import { SharedserviceService } from '../../../services/sharedservice.service';
import { trigger, state, style, animate, transition, AnimationEvent } from '@angular/animations';

@Component({
  selector: 'app-ntemplate20',
  templateUrl: './Ntemplate20.component.html',
  styleUrls: ['./Ntemplate20.component.css'],

  animations: [
    trigger('openClose', [
      state('open', style({
      })),
      state('closed', style({
        'left': '{{leftPos}}',
        'top': '{{topPos}}',
        'width': '{{optWidth}}',
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
export class Ntemplate20Component implements OnInit, OnDestroy {

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

  optionBase: boolean = false;
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
  popup_commmon_imgs: any;
  upperImagesNo1: boolean = false;
  upperImagesNo2: boolean = false;
  lowerImagesNo1: boolean = false;
  lowerImagesNo2: boolean = false;
  resetCounterFlag: boolean = true;
  animationFlag: boolean = false;

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
  /*END: Theme Implementation(Template Changes)*/


  /*Start-LifeCycle events*/
  private appModel: ApplicationmodelService;
  constructor(appModel: ApplicationmodelService, private Sharedservice: SharedserviceService, private renderer: Renderer2, private elementRef: ElementRef) {
    this.appModel = appModel;
    if (!this.appModel.isVideoPlayed) {

    } else {
      this.appModel.setLoader(true);
      // if error occured during image loading loader will stop after 5 seconds 
      this.loaderTimer = setTimeout(() => {
        this.appModel.setLoader(false);
      }, 5000);
    }
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
    this.assetsPath = this.appModel.assetsfolderpath;
    this.appModel.navShow = 2;
  }

  ngOnInit() {
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
        this.attemptType = "uttarDikhayein";
        this.popupType = "showanswer"
        this.setPopupAssets();
        this.getAnswer();
      }
    })
    this.appModel.getConfirmationPopup().subscribe((val) => {
      clearInterval(this.blinkInterval);
      if (val == "uttarDikhayein") {
        if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
          this.confirmModalRef.nativeElement.classList = "displayPopup modal";
          this.appModel.notifyUserAction();
          this.setPopupAssets();
          this.popupType = "showanswer";
          this.instructionVO.nativeElement.pause();
          this.instructionVO.nativeElement.currentTime = 0;
        }
      } else if (val == "submitAnswer") {
        if (this.confirmSubmitRef && this.confirmSubmitRef.nativeElement) {
          this.confirmSubmitRef.nativeElement.classList = "displayPopup modal";
          this.appModel.notifyUserAction();
          this.instructionVO.nativeElement.pause();
          this.instructionVO.nativeElement.currentTime = 0;
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
      // this.resetActivity();
      this.appModel.notifyUserAction();
    })
    this.appModel.resetBlinkingTimer();
    this.appModel.handleController(this.controlHandler);
  }

  ngOnDestroy() {
    clearInterval(this.blinkTimeInterval);
    if (this.instructionVO.nativeElement != undefined) {
      this.instructionVO.nativeElement.pause();
      this.instructionVO.nativeElement.currentTime = 0;
    }
  }

  ngAfterViewChecked() {
    this.templatevolume(this.appModel.volumeValue, this);
  }
  /*End-LifeCycle events*/


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
    this.questionObj = this.fetchedcontent.quesObj;

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
    if (this.questionObj && this.questionObj.quesVideo && this.questionObj.quesVideo.autoPlay && !this.appModel.isVideoPlayed) {
      this.isPlayVideo = true;
    } else {
      this.isPlayVideo = false;
    }
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
  }

  /***Set the content folder path ***/
  getBasePath() {
    if (this.appModel && this.appModel.content) {
      return this.appModel.content.id + '';
    }
  }

  /***  On option hover functionality ***/
  optionHover(idx, opt) {
    this.optionRef.nativeElement.children[idx].className = "scaleInAnimation";
    this.renderer.removeClass(this.optionRef.nativeElement.children[idx], 'scaleOutAnimation');
    this.optionRef.nativeElement.children[idx].style.zIndex = "100";
  }

  /***  On option leave functionality ***/
  optionLeave(idx, opt) {
    this.optionRef.nativeElement.children[idx].className = "scaleOutAnimation";
    this.renderer.removeClass(this.optionRef.nativeElement.children[idx], 'scaleInAnimation');
    this.optionRef.nativeElement.children[idx].style.zIndex = "99";
  }

  /*** Play VO on option hover ***/
  playOptionHover(idx, opt) {
    if (this.animationFlag) {
      return
    }
    if (opt && opt.mouse_over_audio && opt.mouse_over_audio.url) {
      if (this.optionRef.nativeElement.children[idx].getBoundingClientRect().top != this.optionReverseTopPosition) {
        this.playSound(opt.mouse_over_audio, idx);
      }
    }

  }

  playSound(soundAssets, idx) {
    if (this.audio && this.audio.paused) {
      this.audio.src = soundAssets.url;
      this.audio.load();
      this.audio.play();
      this.instructionBar.nativeElement.classList = "instructionBase disableDiv";
      this.instructionVO.nativeElement.pause();
      this.instructionVO.nativeElement.currentTime = 0;
      this.audio.onended = () => {
        this.instructionBar.nativeElement.classList = "instructionBase";
      }
    }
  }

  /*** loading of Templates ***/
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
        this.appModel.handlePostVOActivity(false);
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
  getRandomIndxBlink() {
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
    if (this.instructionVO.nativeElement && this.instructionVO.nativeElement.src) {
      this.instructionVO.nativeElement.play();
      this.appModel.enableReplayBtn(false);
      this.isDisableDiv = true;
      this.attemptType = "PlayInstruction";
      this.instructionVO.nativeElement.onended = () => {
        this.disableOnInstruction();
        this.isDisableDiv = false;
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

  /*** Show Answer and submit Functionality after click on Yes ***/
  sendFeedback(ref, flag: string, action?: string) {
    this.popUpFeedbackMsgUrl = '';
    console.log("action", action)
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
          this.blinkOnLastQues();
          this.fadeEverything();
        }, 1000)
      }
    } else if (action == "submitAnswer") {
      if (this.submitButtonCounter != this.optionArr.length) {
        this.infoModalRef.nativeElement.classList = "displayPopup modal";
        let partialFeedbackAudio = this.infoPopupAssets.partialCorrectAudio;
        this.feedbackInfoAudio.nativeElement.src = partialFeedbackAudio.url;
        this.feedbackInfoAudio.nativeElement.play();
      }
      else {
        this.popupTopAssts = [];
        this.popupDownAssts = [];
        this.checkResponseType();
        this.appModel.enableSubmitBtn(false);
        this.appModel.enableReplayBtn(true);
      }
    }
    else if (action == "partialFeedback") {
      this.infoModalRef.nativeElement.classList = "modal";
      if (this.feedbackInfoAudio && !this.feedbackInfoAudio.nativeElement.paused) {
        this.feedbackInfoAudio.nativeElement.pause();
        this.feedbackInfoAudio.nativeElement.currentTime = 0;
      }
    }
    else if (action == "fadeEverything") {
      this.attemptTypeClose = "fadeEverything";
      this.fadeEverything();
    }
    else if (action == "feedbackDone") {
      if (this.responseType = "wrong") {
        this.appModel.feedbackType = "fullyIncorrect";
        this.appModel.wrongAttemptAnimation();
      } else if (this.responseType = "allcorrect") {
        this.disableScreen();
      }
    } else if (action == "replay") {

    } else if (action == "resetActivity") {
      // this.resetActivity();
    } else if (action == "partialFeedback") {
      if (this.partialFeedbackRef && this.partialFeedbackRef.nativeElement && !this.partialFeedbackRef.nativeElement.paused) {
        this.partialFeedbackRef.nativeElement.pause();
        this.partialFeedbackRef.nativeElement.currentTime = 0;
      }
    }
    if (flag == "no") {
      this.startBlinkOption();
      if (this.attemptType != "") {
        this.disableOnInstruction();
      }
    }
  }

  /*** Instruction block Disable/Enable functionality ***/
  disableOnInstruction() {
    if (this.submitButtonCounter > 0) {
      this.appModel.enableReplayBtn(false);
    } else {
      this.appModel.enableReplayBtn(true);
    }
    this.renderer.removeClass(this.elementRef.nativeElement, 'disable_div');
    ;
    this.renderer.removeClass(this.instructionBar.nativeElement, 'disable_div');
    for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
      this.optionRef.nativeElement.children[i].classList = "";
    }
  }

  /*** To Fade the screen functionality ***/
  fadeEverything() {
    clearInterval(this.blinkInterval);
    if (this.attemptTypeClose == "fadeEverything" || this.attemptTypeClose == "") {
      if (this.attemptType == "manual") {
        this.feedbackPopupAudio.nativeElement.pause();
        this.feedbackPopupAudio.nativeElement.currentTime = 0;
        this.appModel.blinkForLastQues(this.attemptType);
        this.resultType = "correct";
      } else if (this.attemptType == "wrong") {
        this.feedbackPopupAudio.nativeElement.pause();
        this.feedbackPopupAudio.nativeElement.currentTime = 0;
        this.appModel.wrongAttemptAnimation();
        this.resultType = "wrong";
        setTimeout(() => {
          this.startActivityCounter = 0;
          this.startActivityCounter += 1;
          this.resetOptions();
        }, 3000)
        return;
      }
      else if (this.attemptType == "showAnswer") {
        this.feedbackPopupAudio.nativeElement.pause();
        this.feedbackPopupAudio.nativeElement.currentTime = 0;
        this.blinkOnLastQues();
      }
      else if (this.attemptType == "uttarDikhayein") {
      }
      else if (this.attemptType == "PartialWrong") {
        this.feedbackPopupAudio.nativeElement.pause();
        this.feedbackPopupAudio.nativeElement.currentTime = 0;
        this.appModel.wrongAttemptAnimation();
        this.resultType = "partialCorrect";
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
    this.attemptType = "";
  }

  /*** Checks the response with input ***/
  checkResponseType() {
    clearInterval(this.blinkTimeInterval);
    this.attemptType = "manual";
    var count: number = 0;
    var kCount: number = 0;
    this.wrongCounter = 0;
    var Range: number = 0;
    this.submittedArr = this.getSelectedArr();
    for (let i = 0; i < this.submittedArr.length; i++) {
      for (let j = 0; j < 2; j++) {
        if (this.submittedArr[i][j] != undefined) {
          if (this.Order == "ascending") {
            if (this.submittedArr[i][j].selected != undefined) {
              if (this.optionObj.given_values[1] != undefined) {
                if (i >= this.optionObj.given_values[1].index) {
                  kCount = 1;
                }
              }

              if (i < this.optionObj.given_values[kCount].index) {
                for (let m = i + 1; m < this.optionObj.given_values[kCount].index; m++) {
                  if (this.submittedArr[m][0] == undefined && this.submittedArr[m][1] == undefined) {
                    count = m + 1;
                  }
                  else {
                    count = m;
                  }

                  if (this.submittedArr[count] && this.submittedArr[count][0]) {
                    if (this.submittedArr[count][0].selected != undefined) {
                      if (this.submittedArr[i][j].value > this.submittedArr[count][0].value) {
                        if (this.submittedArr[count][0].value < this.optionObj.given_values[kCount].value) {
                          this.submittedArr[i][j].isAtCorrectPos = false;
                        }
                      }
                    }
                  }

                  if (this.submittedArr[count] && this.submittedArr[count][1]) {
                    if (this.submittedArr[count][1].selected != undefined) {
                      if (this.submittedArr[i][j].value > this.submittedArr[count][1].value) {
                        if (this.submittedArr[count][1].value < this.optionObj.given_values[kCount].value) {
                          this.submittedArr[i][j].isAtCorrectPos = false;
                        }
                      }
                    }
                  }
                }

                if (this.submittedArr[i][j].value > this.optionObj.given_values[kCount].value) {
                  this.submittedArr[i][j].isAtCorrectPos = false;
                }
              }

              if (i > this.optionObj.given_values[kCount].index) {
                if (kCount == 1) {
                  Range = this.submittedArr.length;
                }
                else {
                  if (this.optionObj.given_values[1] != undefined) {
                    Range = this.optionObj.given_values[1].index;
                  }
                }

                for (let m = i + 1; m < Range; m++) {
                  if (this.submittedArr[m][0] == undefined && this.submittedArr[m][1] == undefined) {
                    count = m + 1;
                  }
                  else {
                    count = m;
                  }

                  if (this.submittedArr[count] && this.submittedArr[count][0]) {
                    if (this.submittedArr[count][0].selected != undefined) {
                      if (this.submittedArr[i][j].value > this.submittedArr[count][0].value) {
                        if (this.submittedArr[count][0].value > this.optionObj.given_values[kCount].value) {
                          this.submittedArr[i][j].isAtCorrectPos = false;
                        }
                      }
                    }
                  }

                  if (this.submittedArr[count] && this.submittedArr[count][1]) {
                    if (this.submittedArr[count][1].selected != undefined) {
                      if (this.submittedArr[i][j].value > this.submittedArr[count][1].value) {
                        if (this.submittedArr[count][1].value > this.optionObj.given_values[kCount].value) {
                          this.submittedArr[i][j].isAtCorrectPos = false;
                        }
                      }
                    }
                  }
                }

                if (this.submittedArr[i][j].value < this.optionObj.given_values[kCount].value) {
                  this.submittedArr[i][j].isAtCorrectPos = false;
                }
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
                //break;
              }

              if (this.submittedArr[i][j].isAtCorrectPos == false) {
                if (this.submittedArr[i][0] != undefined && this.submittedArr[i][1] != undefined) {
                  this.wrongCounter += 1;
                }
                else {
                  this.wrongCounter += 1;
                }
              }
            }
          }

          if (this.Order == "descending") {
            if (this.submittedArr[i][j].selected != undefined) {
              if (this.optionObj.given_values[1] != undefined) {
                if (i >= this.optionObj.given_values[1].index) {
                  kCount = 1;
                }
              }

              if (i < this.optionObj.given_values[kCount].index) {
                for (let m = i + 1; m < this.optionObj.given_values[kCount].index; m++) {
                  if (this.submittedArr[m][0] == undefined && this.submittedArr[m][1] == undefined) {
                    count = m + 1;
                  }
                  else {
                    count = m;
                  }
                  if (this.submittedArr[count] && this.submittedArr[count][0]) {
                    if (this.submittedArr[count][0].selected != undefined) {
                      if (this.submittedArr[i][j].value < this.submittedArr[count][0].value) {
                        if (this.submittedArr[count][0].value > this.optionObj.given_values[kCount].value) {
                          this.submittedArr[i][j].isAtCorrectPos = false;
                        }
                      }
                    }
                  }

                  if (this.submittedArr[count] && this.submittedArr[count][1]) {
                    if (this.submittedArr[count][1].selected != undefined) {
                      if (this.submittedArr[i][j].value < this.submittedArr[count][1].value) {
                        if (this.submittedArr[count][1].value > this.optionObj.given_values[kCount].value) {
                          this.submittedArr[i][j].isAtCorrectPos = false;
                        }
                      }
                    }
                  }
                }

                if (this.submittedArr[i][j].value < this.optionObj.given_values[kCount].value) {
                  this.submittedArr[i][j].isAtCorrectPos = false;
                }
              }

              if (i > this.optionObj.given_values[kCount].index) {
                if (kCount == 1) {
                  Range = this.submittedArr.length;
                }
                else {
                  if (this.optionObj.given_values[1] != undefined) {
                    Range = this.optionObj.given_values[1].index;
                  }
                }
                for (let m = i + 1; m <= Range; m++) {
                  if (this.submittedArr[m] != undefined) {
                    if (this.submittedArr[m][0] == undefined && this.submittedArr[m][1] == undefined) {
                      count = m + 1;
                    }

                    else {
                      count = m;
                    }
                  }

                  if (this.submittedArr[count] && this.submittedArr[count][0]) {
                    if (this.submittedArr[i][j].value < this.submittedArr[count][0].value) {
                      if (this.submittedArr[count][0].value < this.optionObj.given_values[kCount].value) {
                        this.submittedArr[i][j].isAtCorrectPos = false;
                      }
                    }
                  }

                  if (this.submittedArr[count] && this.submittedArr[count][1]) {
                    if (this.submittedArr[i][j].value < this.submittedArr[count][1].value) {
                      if (this.submittedArr[count][1].value < this.optionObj.given_values[kCount].value) {
                        this.submittedArr[i][j].isAtCorrectPos = false;
                      }
                    }
                  }
                }

                if (this.submittedArr[i][j].value > this.optionObj.given_values[kCount].value) {
                  this.submittedArr[i][j].isAtCorrectPos = false;
                }
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
                //break;
              }

              if (this.submittedArr[i][j].isAtCorrectPos == false) {
                if (this.submittedArr[i][0] != undefined && this.submittedArr[i][1] != undefined) {
                  this.wrongCounter += 1;
                }
                else {
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
      this.popupType = "wrong"
      this.wrongCounter = 0;
      this.appModel.notifyUserAction();
    }
    else if (this.wrongCounter == 0) {
      this.resultType = "correct";
      this.wrongCounter = 0;
      this.popupType = "correct"
      this.appModel.notifyUserAction();
    }
    else {
      this.resultType = "partialCorrect";
      this.wrongCounter = 0;
      this.popupType = "partialCorrect"
      this.appModel.notifyUserAction();
    }

    if (this.resultType != "") {
      if (this.optIndxArr.length == 0 && this.resultType == "correct") {
        this.responseType = "allCorrect";
        console.log("all Correct congratessssss");
        this.feedbackAudio = this.feedbackObj.correctAudio;
        this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.url;
        this.feedbackPopupAudio.nativeElement.play();
        this.attemptType = "manual";
        this.feedbackPopupAudio.nativeElement.onended = () => {
          setTimeout(() => {
            this.appModel.notifyUserAction();
            this.blinkOnLastQues();
          }, 1000)
        }
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
        this.partialCorrectCase = true;
        this.appModel.feedbackType = "partialIncorrect";
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
    // alert(JSON.stringify(arr))
    return arr;
  }

  blinkOnLastQues() {
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
      this.appModel.moveNextQues();
      this.disableScreen();
    }
  }

  /*** Screen disable functionality ***/
  disableScreen() {
    clearInterval(this.blinkTimeInterval);
    this.instructionBar.nativeElement.classList = "greyOut instructionBase";
    this.elementRef.nativeElement.children[0].className = "greyOut";
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
        this.appModel.notifyUserAction();
        this.blinkOnLastQues();
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
    this.instructionVO.nativeElement.pause();
    this.instructionVO.nativeElement.currentTime = 0;
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
      // this.appModel.enableSubmitBtn(false);
      this.appModel.handlePostVOActivity(true);
      if (this.selectedPosition == 'down') {
        this.pushToDownPlaceHolder(this.selectedPositionIndex, this.from);
      } else if (this.selectedPosition == 'up') {
        this.pushToUpPlaceHolder(this.selectedPositionIndex, this.from);
      }
    } else if (event.fromState == "closed" && event.toState == "open" && event.phaseName == "done" && this.resetCounterFlag == true) {
      // this.appModel.enableSubmitBtn(false);
      this.appModel.handlePostVOActivity(true);
      if (this.selectedPosition == 'down') {
        this.deleteDownPlaceHolder(this.reverseOption, this.reverseOptionIndex);
      } else if (this.selectedPosition == 'up') {
        this.deleteUpPlaceHolder(this.reverseOption, this.reverseOptionIndex);
      }
      this.mainContainer.nativeElement.classList = "bodyContent";
    }
    setTimeout(() => {
      this.animationFlag = false;
      this.appModel.handlePostVOActivity(false);
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
    console.log(this.feedbackObj)
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
    }
    if (this.popupType == "correct") {
      this.partialCorrectCase = false;
      this.rightanspopUpheader_img = true;
      this.wronganspopUpheader_img = false;
      this.showanspopUpheader_img = false;
      this.partialCorrectheaderTxt_img = false;
      this.styleHeaderPopup = this.feedbackObj.style_header;
      this.styleBodyPopup = this.feedbackObj.style_body;
      this.popUpFeedbackMsgUrl = this.feedbackObj.rightAnswerpopupTxt.url;
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
    }
  }

}