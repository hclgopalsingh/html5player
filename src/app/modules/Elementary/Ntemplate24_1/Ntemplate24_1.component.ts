import { Component, OnInit, ViewChild, AfterViewChecked, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { Subscription } from 'rxjs'
import 'jquery';
import { PlayerConstants } from '../../../common/playerconstants';
import { ThemeConstants } from '../../../common/themeconstants';
import { SharedserviceService } from '../../../common/services/sharedservice.service';
import { timer } from 'rxjs/observable/timer';
import { take } from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'ntemp24_1',
  templateUrl: './Ntemplate24_1.component.html',
  styleUrls: ['./Ntemplate24_1.component.scss'],

})

export class Ntemplate24V1Component implements OnInit, AfterViewChecked, OnDestroy {
  private appModel: ApplicationmodelService;
  constructor(appModel: ApplicationmodelService, private Sharedservice: SharedserviceService) {
    this.appModel = appModel;
    this.assetsPath = this.appModel.assetsfolderpath;
    this.appModel.navShow = 2;
    this.appModel.setLoader(true);
    // if error occured during image loading loader wil stop after 5 seconds 
    this.loaderTimer = setTimeout(() => {
      this.appModel.setLoader(false);
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

  @ViewChild('quesVORef') quesVORef: any;
  @ViewChild('instructionVO') instructionVO: any;
  @ViewChild('mainContainer') mainContainer: any;
  @ViewChild('confirmModalRef') confirmModalRef: any;
  @ViewChild('infoModalRef') infoModalRef: any;
  @ViewChild('modalRef') modalRef: any;
  @ViewChild('confirmReplayRef') confirmReplayRef: any;
  @ViewChild('mainVideo') mainVideo: any;
  @ViewChild('confirmSubmitRef') confirmSubmitRef: any;
  @ViewChild('partialFeedbackRef') partialFeedbackRef: any;
  @ViewChild('feedbackPopupRef') feedbackPopupRef: any;
  @ViewChild('feedbackOption') feedbackOption: any;
  @ViewChild('feedbackAudio') feedbackAudio: any;
  @ViewChild('options') options: any;

  audio = new Audio();
  commonAssets: any = "";
  feedback: any = "";
  narratorAudio: any;
  checked: boolean = false;
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
  confirmAssets: any;
  infoPopupAssets: any;
  confirmSubmitAssets: any;
  confirmReplayAssets: any;
  rightanspopUp: any;
  wronganspopUp: any;
  quesObj: any;
  isPlayVideo: boolean = true;
  videoReplayd: boolean = false;
  questionObj: any;
  isVideoLoaded: boolean = false;
  optionObjCopy: any;
  feedbackAssets: any;
  isAllRight: boolean = false;
  assetsFeedback: any = [];
  answerFeedback: string = "";
  postCompleteTimer: any;
  rightanspopUpheader_img: boolean = false;
  wronganspopUpheader_img: boolean = false;
  showanspopUpheader_img: boolean = false;
  partialCorrectheaderTxt_img: boolean = false;
  styleHeaderPopup: any;
  styleBodyPopup: any;
  popupType: string = "";
  PlayPauseFlag: boolean = true;
  controlHandler = {
    isShowAns: true,
    isSubmitRequired: true,
    isReplayRequired: true
  };
  themePath: any;
  fetchedcontent: any;
  functionalityType: any;
  bgSubscription: Subscription;
  showAnsTimeout: number;
  autoClosePopupTimer: number;
  quesSkip: boolean = false;
  disableInstruction: boolean = true;
  disableOpt: boolean = true;
  greyOutInstruction: boolean = false;
  greyOutOpt: boolean = false;
  isPartialPopup: boolean = false;
  animating : boolean = false;
  timerSubscription: Subscription;
  isLastQuestion: boolean;
  actComplete : boolean = false;
  confirmPopupSubscription: any;
  tempSubscription: any;
  
  ngOnInit() {
    let that = this;
    // $("#navBlock").click(function () {
    //   if (!that.instructionVO.nativeElement.paused) {
    //     that.instructionVO.nativeElement.pause();
    //     that.instructionVO.nativeElement.currentTime = 0;
    //   }
    // });

    if (this.appModel.isNewCollection) {
      this.appModel.event = { 'action': 'segmentBegins' };
    }
    this.containgFolderPath = this.getBasePath();
    let fetchedData: any = this.appModel.content.contentData.data;
    this.fetchedcontent = JSON.parse(JSON.stringify(fetchedData));
    this.functionalityType = this.appModel.content.contentLogic.functionalityType;
    this.themePath = ThemeConstants.THEME_PATH + this.fetchedcontent.productType + '/' + this.fetchedcontent.theme_name;
    this.Sharedservice.imagePath(this.fetchedcontent, this.containgFolderPath, this.themePath, this.functionalityType);
    this.checkquesTab();
    this.appModel.globalJsonData.subscribe(data => {
      this.showAnsTimeout = data.showAnsTimeout;
    });
    this.setData();
    this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
      if (mode == "manual") {
        console.log("manual mode ", mode);
      } else if (mode == "auto") {
        console.log("auto mode", mode);
        this.closeModel();
        this.getAnswer('showAnswer');
        this.popupType = "showanswer";
        this.setPopupAssets();
      }
    })
    this.confirmPopupSubscription = this.appModel.getConfirmationPopup().subscribe((val) => {
      if (!this.instructionVO.nativeElement.paused) {
        this.instructionVO.nativeElement.pause();
        this.instructionVO.nativeElement.currentTime = 0;
        this.disableInstruction = false;
      }
      if (!this.audio.paused) {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.afterOptionVOends();
      }
      if (val == "uttarDikhayein") {
        clearTimeout(this.postCompleteTimer);
        if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
          this.confirmModalRef.nativeElement.classList = "displayPopup modal";
          this.appModel.notifyUserAction();
        }
        this.checkForAutoClose();
      } else if (val == "submitAnswer") {
        if (this.confirmSubmitRef && this.confirmSubmitRef.nativeElement) {
          this.confirmSubmitRef.nativeElement.classList = "displayPopup modal";
          this.appModel.notifyUserAction();
        }
      } else if (val == "replayVideo") {
        this.confirmReplayAssets.confirm_btn = this.confirmReplayAssets.confirm_btn_original;
        if (this.confirmReplayRef && this.confirmReplayRef.nativeElement) {
          this.confirmReplayRef.nativeElement.classList = "displayPopup modal";
          this.appModel.notifyUserAction();
          this.PlayPauseFlag = true;
          this.quesObj.quesPlayPause = this.quesObj.quesPause;
          this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
        }
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
      this.postWrongAttemplt();
    })
    this.appModel.handleController(this.controlHandler);
    this.appModel.resetBlinkingTimer();
  }

  ngAfterViewChecked() {
    this.templatevolume(this.appModel.volumeValue, this);
  }

  ngOnDestroy() {
    clearInterval(this.postCompleteTimer);
    if (this.bgSubscription != undefined) {
      this.bgSubscription.unsubscribe();
    }
    if (!this.audio.paused) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.afterOptionVOends();
    }
    if (this.confirmPopupSubscription != undefined) {
      this.confirmPopupSubscription.unsubscribe();
    }
    if (this.tempSubscription != undefined) {
      this.tempSubscription.unsubscribe();
    }
  }

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
        this.sendFeedback(this.confirmModalRef.nativeElement,'no','resetActivity');
        this.timerSubscription.unsubscribe();
      }
    )
  }
  removeSubscription(timer) {
    console.log("waiting for autoClose", timer / 1000);
  }

  /* To load the question tabs */
  checkquesTab() {
    if (this.fetchedcontent.commonassets.ques_control != undefined) {
      this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
    } else {
      this.appModel.getJson();
    }
  }

  /* To blink next after correct attempt or show answer */
  blinkOnLastQues() {
    this.actComplete = true;
    if (this.appModel.isLastSectionInCollection) {
      if (this.popupType == "correct") {
        this.appModel.blinkForLastQues("manual");
      } else {
        this.appModel.blinkForLastQues();
      }
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
      if (this.popupType == "correct") {
        this.appModel.moveNextQues("manual");
      }
      else {
        this.appModel.moveNextQues();
      }
    }
  }

  /* To close all popups */
  closeModel() {
    //infoModalRef, confirmReplayRef, feedbackPopupRef, confirmSubmitRef, confirmModalRef,
    this.infoModalRef.nativeElement.classList = "modal";
    this.confirmReplayRef.nativeElement.classList = "modal";
    this.feedbackPopupRef.nativeElement.classList = "modal";
    this.confirmSubmitRef.nativeElement.classList = "modal";
    this.confirmModalRef.nativeElement.classList = "modal";
    this.confirmReplayRef.nativeElement.classList = "modal";
  }

  /* To show feedback or show answer popup */
  getAnswer(flag) {
    if (flag == 'showAnswer') {
      this.appModel.resetBlinkingTimer();
      this.isAllRight = true;
      this.answerFeedback = 'showAnswer';
      this.assetsFeedback.splice(0, this.assetsFeedback.length);
      for (let i in this.feedback.correct_sequence) {
        this.assetsFeedback.push(this.optionObj.optionArray[this.feedback.correct_sequence[i]])
      }
    } else if (flag == 'submitAnswer') {
      this.answerFeedback = 'submitAnswer';
      let rightAnswerCount = 0;
      for (let i in this.feedback.correct_sequence) {
        if (this.optionObjCopy.optionArray[i].index == this.optionObj.optionArray[this.feedback.correct_sequence[i]].index) {
          rightAnswerCount++;
        }
      }

      if (rightAnswerCount == this.feedback.correct_sequence.length) {
        this.isAllRight = true;
        this.popupType = "correct"
        this.appModel.feedbackType = "fullyCorrect";
      }
      if (rightAnswerCount == 0) {
        this.isAllRight = false;
        this.popupType = "wrong"
        this.appModel.feedbackType = "fullyIncorrect";
      }
      if (rightAnswerCount > 0 && rightAnswerCount < this.feedback.correct_sequence.length) {
        this.popupType = "partialCorrect";
        this.appModel.feedbackType = "partialIncorrect";
      }
      this.assetsFeedback = this.optionObjCopy.optionArray;
    }
    this.setPopupAssets();
    this.appModel.stopAllTimer();
    this.feedbackPopupRef.nativeElement.classList = "modal displayPopup";
    let checkDom = setInterval(() => {
      if (this.feedbackOption.nativeElement.children.length == this.feedback.correct_sequence.length) {
        clearInterval(checkDom);
        this.playFeedbackAudio(0);
      }
    }, 100)
  }

  /* To control vol of each audio in template */
  templatevolume(vol, obj) {
    if (obj.quesVORef && obj.quesVORef.nativeElement) {
      obj.quesVORef.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.instructionVO && obj.instructionVO.nativeElement) {
      obj.instructionVO.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackAudio && obj.feedbackAudio.nativeElement) {
      obj.feedbackAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.audio) {
      obj.audio.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.mainVideo && obj.mainVideo.nativeElement) {
      this.mainVideo.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }

  }

  close() {
    //this.appModel.event = { 'action': 'exit', 'currentPosition': this.currentVideoTime };
    this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
  }

  /* To show loader before loading the images */
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

  /* To check for instruction audio and start the template */
  checkforQVO() {
    this.isVideoLoaded = true;
    if (this.questionObj && this.questionObj.quesInstruction && this.questionObj.quesInstruction.url && this.questionObj.quesInstruction.autoPlay) {
      this.quesVORef.nativeElement.src = this.questionObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
      this.mainContainer.nativeElement.classList = "bodyContent disableDiv";
      this.quesVORef.nativeElement.play();
      this.appModel.enableReplayBtn(false);
      this.appModel.enableSubmitBtn(false);
      this.appModel.handlePostVOActivity(true);
      this.quesVORef.nativeElement.onended = () => {
        this.mainContainer.nativeElement.classList = "bodyContent";
        this.disableInstruction = false;
        setTimeout(()=>{
          this.disableOpt=false;
        },500)
        this.appModel.handlePostVOActivity(false);
        this.appModel.enableReplayBtn(true);
        this.appModel.enableSubmitBtn(true);
      }
    } else {
      this.appModel.handlePostVOActivity(false);
      this.appModel.enableReplayBtn(true);
    }
  }

  /* To fetch the json values */
  setData() {
    if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
      this.feedback = this.fetchedcontent.feedback;
      this.commonAssets = this.fetchedcontent.commonassets;
      this.narratorAudio = this.fetchedcontent.commonassets.narrator;
      this.noOfImgs = this.commonAssets.imgCount;
      this.isFirstQues = this.commonAssets.isFirstQues;
      this.isLastQuestion = this.commonAssets.isLastQues;
      this.isLastQues = this.appModel.isLastSection;
      this.questionObj = this.fetchedcontent.quesObj;
      this.feedbackAssets = this.fetchedcontent.feedback_popup;
      if (this.questionObj && this.questionObj.quesVideo && this.questionObj.quesVideo.autoPlay && !this.appModel.isVideoPlayed) {
        this.isPlayVideo = true;
      } else {
        this.isPlayVideo = false;
      }
      this.isLastQuesAct = this.appModel.isLastSectionInCollection;
      if (this.isLastQuesAct || this.isLastQues) {
        this.appModel.setlastQuesNT();
      }
      this.optionObj = this.fetchedcontent.optionObj;
      this.optionObjCopy = JSON.parse(JSON.stringify(this.optionObj));
      this.optionCommonAssets = this.fetchedcontent.option_common_assets;
      console.log(this.optionCommonAssets);
      this.infoPopupAssets = this.fetchedcontent.info_popup;
      this.confirmAssets = this.fetchedcontent.show_answer_confirm;
      this.confirmSubmitAssets = this.fetchedcontent.submit_confirm;
      this.confirmReplayAssets = this.fetchedcontent.replay_confirm;
      this.quesObj = this.fetchedcontent.quesObj;
      if (this.quesObj.quesVideo && this.quesObj.quesVideo.autoPlay && !this.appModel.isVideoPlayed) {
        this.isPlayVideo = true;
      } else {
        this.isPlayVideo = false;
      }
      this.controlHandler = {
        isShowAns: true,
        isSubmitRequired: this.quesObj.submitRequired,
        isReplayRequired: this.quesObj.replayRequired
      }
      for (let i = 0; i < this.optionObjCopy.optionArray.length; i++) {
        this.optionObjCopy.optionArray[i].isAuto = true;
      }
    }
  }

  /* To show loader before loading the video */
  checkVideoLoaded() {
    if (!this.videoReplayd) {
      this.isVideoLoaded = true;
      this.appModel.setLoader(false);
      this.appModel.navShow = 1;
      this.isPlayVideo = true;
      this.appModel.isVideoPlayed = true;
    } else {
      this.isVideoLoaded = true;
    }
  }

  /* To rehear instruction VO */
  playInstruction() {
    this.appModel.notifyUserAction();
    if (this.instructionVO.nativeElement && this.instructionVO.nativeElement.src) {
      this.instructionVO.nativeElement.play();
      this.disableInstruction = true;
      //this.mainContainer.nativeElement.style.pointerEvents = "none";
      this.instructionVO.nativeElement.onended = () => {
        this.mainContainer.nativeElement.style.pointerEvents = "";
        this.disableInstruction = false;
      }
    }
  }

  getBasePath() {
    if (this.appModel && this.appModel.content) {
      return this.appModel.content.id + '';
    }
  }

  /* To replay video */
  replayVideo() {
    this.videoReplayd = true;
    this.isPlayVideo = true;
    this.appModel.stopAllTimer();
    this.disableOpt=true;
    setTimeout(() => {
      this.mainVideo.nativeElement.play();
      this.mainVideo.nativeElement.onended = () => {
        this.loadTemplateAfterVideo();
      }
    }, 500)
  }

  loadTemplateAfterVideo() {
    this.isPlayVideo = false;
    this.appModel.videoStraming(false);
    this.appModel.startPreviousTimer();
    this.appModel.notifyUserAction();
    setTimeout(()=>{
      this.disableOpt=false;
    },1000)
  }

  /* Function on video ends */
  endedHandler() {
    if (!this.videoReplayd) {
      this.isPlayVideo = false;
      this.appModel.navShow = 2;
      this.appModel.enableReplayBtn(true);
    }
  }

  /* Function on video ends on skip*/
  endedHandleronSkip() {
    this.appModel.navShow = 2;
    this.loadTemplateAfterVideo();
  }

  /* Toggle play and pause for video */
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

  /*Hover in and out event handlers for different controls*/
  leavePlayPause() {
    if (this.PlayPauseFlag) {
      this.quesObj.quesPlayPause = this.quesObj.quesPauseOriginal;
    } else {
      this.quesObj.quesPlayPause = this.quesObj.quesPlayOriginal;
    }
  }

  hoverPlayPause() {
    if (this.PlayPauseFlag) {
      this.quesObj.quesPlayPause = this.quesObj.quesPauseHover;
    } else {
      this.quesObj.quesPlayPause = this.quesObj.quesPlayHover;
    }
  }

  optionHover(idx, opt) {
    opt.imgsrc = opt.imgsrc_hover;
    this.mainContainer.nativeElement.children[0].children[0].children[idx].children[0].style.cursor="pointer";
  }
  playOptionHover(idx, opt) {
    this.appModel.notifyUserAction();
    if (opt && opt.mouse_over_audio && opt.mouse_over_audio.url) {
      this.playSound(opt.mouse_over_audio, idx);
    }
  }

  /* To play option mouse over audio if any */
  playSound(soundAssets, idx) {
    this.disableInstruction = true;
    this.instructionVO.nativeElement.pause();
    this.instructionVO.nativeElement.currentTime = 0;
    if (this.audio && this.audio.paused) {
      this.audio.src = soundAssets.url;
      this.audio.play();
      for (let i = 0; i < this.mainContainer.nativeElement.children[0].children[0].children.length; i++) {
        if (i != idx) {
          this.mainContainer.nativeElement.children[0].children[0].children[i].classList.add("disableDiv");
        }
      }
      this.audio.onended = () => {
        this.afterOptionVOends();
      }
    }
  }

  /*To enable options after roll over sound ends */
  afterOptionVOends() {
    this.disableInstruction = false;
    for (let i = 0; i < this.mainContainer.nativeElement.children[0].children[0].children.length; i++) {
      this.mainContainer.nativeElement.children[0].children[0].children[i].classList.remove("disableDiv");
    }
  }

  optionLeave(idx, opt) {
    opt.imgsrc = opt.imgsrc_original;
    this.mainContainer.nativeElement.children[0].children[0].children[idx].children[0].style.cursor="";
  }

  hoverSkip() {
    // this.skipFlag = false;
    this.quesObj.quesSkip = this.quesObj.quesSkipHover;
  }
  houtSkip() {
    this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
  }
  hoverPre(opt, idx) {
    this.options.nativeElement.children[0].children[idx].children[0].children[1].children[0].src = this.optionObjCopy.moveUpBtn_hover.url + "?someRandomSeed=" + Math.random().toString(36);
    this.options.nativeElement.children[0].children[idx].children[0].children[1].children[0].style.cursor = 'pointer';
    this.options.nativeElement.children[0].children[idx].children[0].children[1].children[0].style.pointerEvents = 'auto';
  }
  hleavePre(opt, idx) {
    this.options.nativeElement.children[0].children[idx].children[0].children[1].children[0].src = this.optionObjCopy.moveUpBtn_original.url + "?someRandomSeed=" + Math.random().toString(36);
    this.options.nativeElement.children[0].children[idx].children[0].children[1].children[0].style.cursor = "";
    this.options.nativeElement.children[0].children[idx].children[0].children[1].children[0].style.pointerEvents = 'none';
  }
  hoverNext(opt, idx) {
    this.options.nativeElement.children[0].children[idx].children[0].children[2].children[0].src = this.optionObjCopy.moveDownBtn_hover.url + "?someRandomSeed=" + Math.random().toString(36);
    this.options.nativeElement.children[0].children[idx].children[0].children[2].children[0].style.cursor = 'pointer';
    this.options.nativeElement.children[0].children[idx].children[0].children[2].children[0].style.pointerEvents = 'auto';
  }
  hleaveNext(opt, idx) {
    this.options.nativeElement.children[0].children[idx].children[0].children[2].children[0].src = this.optionObjCopy.moveDownBtn_original.url + "?someRandomSeed=" + Math.random().toString(36);
    this.options.nativeElement.children[0].children[idx].children[0].children[2].children[0].style.cursor = "";
    this.options.nativeElement.children[0].children[idx].children[0].children[2].children[0].style.pointerEvents = 'none';
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
  hoverSubmitCloseConfirm() {
    this.confirmSubmitAssets.close_btn = this.confirmSubmitAssets.close_btn_hover;
  }
  houtSubmitCloseSubmitConfirm() {
    this.confirmSubmitAssets.close_btn = this.confirmSubmitAssets.close_btn_original;
  }
  hoverFeedbackClose() {
    this.feedbackAssets.close_btn = this.feedbackAssets.close_btn_hover;
  }

  houtFeedbackClose() {
    this.feedbackAssets.close_btn = this.feedbackAssets.close_btn_original;
  }
  /*Hover in and out events ends*/

  /*On click up*/ 
  movePrevious(idx) {
    if(!this.animating){
      this.mainContainer.nativeElement.children[0].children[0].classList.add("disableDiv");
      this.postCompleteTimer = setTimeout(() => {
        this.mainContainer.nativeElement.children[0].children[0].classList.remove("disableDiv");
      }, 1000);
      this.mainContainer.nativeElement.children[0].children[0].classList.add("disableDiv");
      this.animating=true;
      if (!this.instructionVO.nativeElement.paused) {
        this.instructionVO.nativeElement.pause();
        this.instructionVO.nativeElement.currentTime = 0;
        this.disableInstruction = false;
      }
      this.appModel.notifyUserAction();
      if (idx - 1 != -1) {
        let from = this.mainContainer.nativeElement.children[0].children[0].children[idx].getBoundingClientRect();
        let to = this.mainContainer.nativeElement.children[0].children[0].children[idx - 1].getBoundingClientRect();
        $(this.mainContainer.nativeElement.children[0].children[0].children[idx]).animate({ left: (to.left - (from.left)), top: (to.top - (from.top)) }, 500);
        $(this.mainContainer.nativeElement.children[0].children[0].children[idx - 1]).animate({ left: (from.left - (to.left)), top: (from.top - (to.top)) }, 500, () => { this.reArrangeOpts(idx, 'left') });
      }
    }    
  }

    /*On click down*/ 
  moveNext(idx) {
    if(!this.animating){
      this.mainContainer.nativeElement.children[0].children[0].classList.add("disableDiv");
      this.postCompleteTimer = setTimeout(() => {
        this.mainContainer.nativeElement.children[0].children[0].classList.remove("disableDiv");
      }, 1000);
      this.animating=true;
      if (!this.instructionVO.nativeElement.paused) {
        this.instructionVO.nativeElement.pause();
        this.instructionVO.nativeElement.currentTime = 0;
        this.disableInstruction = false;
      }
      this.appModel.notifyUserAction();
      if (idx + 1 <= this.optionObj.optionArray.length - 1) {
        let from = this.mainContainer.nativeElement.children[0].children[0].children[idx].getBoundingClientRect();
        let to = this.mainContainer.nativeElement.children[0].children[0].children[idx + 1].getBoundingClientRect();
        $(this.mainContainer.nativeElement.children[0].children[0].children[idx]).animate({ left: (to.left - (from.left)), top: (to.top - (from.top)) }, 500);
        $(this.mainContainer.nativeElement.children[0].children[0].children[idx + 1]).animate({ left: (from.left - (to.left)), top: (from.top - (to.top)) }, 500, () => { this.reArrangeOpts(idx, 'right') });
      }
    }    
  }

  /*After animations swapping the options*/ 
  reArrangeOpts(idx, flag) {
    if (flag == "left") {
      $(this.mainContainer.nativeElement.children[0].children[0].children[idx]).css('top', 'auto').css('left', 'auto');
      $(this.mainContainer.nativeElement.children[0].children[0].children[idx - 1]).css('top', 'auto').css('left', 'auto');
      let optCurrent = this.optionObjCopy.optionArray[idx];
      let optLeft = this.optionObjCopy.optionArray[idx - 1];
      this.optionObjCopy.optionArray[idx] = optLeft;
      this.optionObjCopy.optionArray[idx - 1] = optCurrent;
      this.animating=false;
    } else if (flag == "right") {
      $(this.mainContainer.nativeElement.children[0].children[0].children[idx]).css('top', 'auto').css('left', 'auto');
      $(this.mainContainer.nativeElement.children[0].children[0].children[idx + 1]).css('top', 'auto').css('left', 'auto');
      let optCurrent = this.optionObjCopy.optionArray[idx];
      let optRight = this.optionObjCopy.optionArray[idx + 1];
      this.optionObjCopy.optionArray[idx] = optRight;
      this.optionObjCopy.optionArray[idx + 1] = optCurrent;
      this.animating=false;
    }
  }

  /*Handler for all popup event calls*/ 
  sendFeedback(ref, flag: string, action?: string) {
    if (this.timerSubscription != undefined) {
      this.timerSubscription.unsubscribe();
    }
    this.appModel.notifyUserAction();
    this.mainContainer.nativeElement.children[0].style.pointerEvents = "none";
    ref.classList = "modal";
    this.isPartialPopup = false;
    clearInterval(this.postCompleteTimer);
    setTimeout(
      () => {
        if (action == "noShowAnswer" || action == "resetActivity" || action == undefined) {
          this.mainContainer.nativeElement.children[0].style.pointerEvents = "";
        }
      }, 1000);
    if (action == "showAnswer") {
      this.popupType = "showanswer"
      this.getAnswer('showAnswer');
    } else if (action == "submitAnswer") {
      this.getAnswer('submitAnswer');
    } else if (action == "replay") {
      this.quesSkip = true;
      this.replayVideo();
    } else if (action == "resetActivity") {
      //this.resetActivity();
    } else if (action == "feedbackDone") {
      this.removeClassOptAnimate();
      if (this.feedbackAudio && this.feedbackAudio.nativeElement && !this.feedbackAudio.nativeElement.paused) {
        this.feedbackAudio.nativeElement.pause();
        this.feedbackAudio.nativeElement.currentTime = 0;
      } if (this.isAllRight) {
        this.disableScreen();
        this.blinkOnLastQues();
      } else {
        this.mainContainer.nativeElement.children[0].style.pointerEvents = "none ";
        setTimeout(
          () => {
            this.mainContainer.nativeElement.children[0].style.pointerEvents = "";
          }, 4000);
        this.appModel.wrongAttemptAnimation();
      }
    } else if (action == "partialFeedback") {
      this.popupType = "partialCorrect"
      if (this.partialFeedbackRef && this.partialFeedbackRef.nativeElement && !this.partialFeedbackRef.nativeElement.paused) {
        this.partialFeedbackRef.nativeElement.pause();
        this.partialFeedbackRef.nativeElement.currentTime = 0;
      }
    }
  }

  //infoModalRef, confirmReplayRef, feedbackPopupRef, confirmSubmitRef, confirmModalRef,
  
  resetActivity() {
    this.optionObjCopy = JSON.parse(JSON.stringify(this.optionObj));
    this.appModel.enableReplayBtn(true);
    this.appModel.enableSubmitBtn(true);
  }

    /*Playing feedback or show answer popup audios*/ 
  playFeedbackAudio(num) {
    let optionsAssets: any;
    if (this.answerFeedback == "showAnswer") {
      optionsAssets = this.assetsFeedback;
    } else if (this.answerFeedback == "submitAnswer") {
      optionsAssets = this.optionObjCopy.optionArray;
    }
    let feedbackVo;
    if (optionsAssets[num].index == this.optionObj.optionArray[this.feedback.correct_sequence[num]].index) {
      feedbackVo = optionsAssets[num].correct_vo;
    } else {
      feedbackVo = optionsAssets[num].incorrect_vo;
    }
    this.feedbackAudio.nativeElement.src = feedbackVo.url;
    this.feedbackAudio.nativeElement.play();
    this.feedbackOption.nativeElement.children[num].children[0].classList = "img-fluid optionAnimate";
    this.feedbackAudio.nativeElement.onended = () => {
      this.feedbackOption.nativeElement.children[num].children[0].classList = "img-fluid optionUnAnimate";
      if (this.feedbackOption.nativeElement.children[num + 1] && this.feedbackOption.nativeElement.children[num + 1].children[0] != undefined) {
        this.playFeedbackAudio(++num);
      } else {
        this.postCompleteTimer = setTimeout(() => {
          this.removeClassOptAnimate();
          this.feedbackPopupRef.nativeElement.classList = "modal";
          if (this.isAllRight) {
            this.disableScreen();
            this.blinkOnLastQues();
          } else {
            this.mainContainer.nativeElement.children[0].style.pointerEvents = "none ";
            setTimeout(
              () => {
                this.mainContainer.nativeElement.children[0].style.pointerEvents = "";
              }, 4000);
            this.appModel.wrongAttemptAnimation();
            this.resetActivity();
          }
        }, this.autoClosePopupTimer);
      }
    }
  }

  /*After wrong attempt reset the activity*/ 
  postWrongAttemplt() {
    this.resetActivity();
    this.appModel.startPreviousTimer();
    this.appModel.notifyUserAction();
  }

  /*After wrong attempt reset the activity*/
  removeClassOptAnimate() {
    if (this.feedbackOption.nativeElement && this.feedbackOption.nativeElement.children) {
      for (let i in this.feedbackOption.nativeElement.children) {
        if (this.feedbackOption.nativeElement.children[i] && this.feedbackOption.nativeElement.children[i].children && this.feedbackOption.nativeElement.children[i].children[0]) {
          this.feedbackOption.nativeElement.children[i].children[0].classList = "img-fluid";
        }
      }
    }
  }

  /*Disable the screen after show answer popup or correct feedback*/
  disableScreen() {
    this.greyOutOpt = true;
    this.greyOutInstruction = true;
    this.appModel.enableSubmitBtn(false);
    this.appModel.enableReplayBtn(false);
  }

  /*Load the popup assets for show answer and feedback popup*/
  setPopupAssets() {
    this.isPartialPopup = false;
    console.log(this.feedbackAssets);
    console.log("check pop up type", "this.attemptType:", "this.popupType:", this.popupType);
    this.autoClosePopupTimer = this.feedbackAssets.autoCloseSec * 1000;
    if (this.popupType == "wrong") {
      this.rightanspopUpheader_img = false;
      this.wronganspopUpheader_img = true;
      this.showanspopUpheader_img = false;
      this.partialCorrectheaderTxt_img = false;
      this.styleHeaderPopup = this.feedbackAssets.wrong_style_header;
      this.styleBodyPopup = this.feedbackAssets.wrong_style_body;
      this.feedbackAssets.popTitleTxt_img = this.feedbackAssets.wrong_style_title;
    }
    if (this.popupType == "partialCorrect") {
      this.isPartialPopup = true;
      this.rightanspopUpheader_img = false;
      this.wronganspopUpheader_img = false;
      this.showanspopUpheader_img = false;
      this.partialCorrectheaderTxt_img = true;
      this.styleHeaderPopup = this.feedbackAssets.partial_style_header;
      this.styleBodyPopup = this.feedbackAssets.partial_style_body;
      this.feedbackAssets.popTitleTxt_img = this.feedbackAssets.partial_style_title;
    }
    if (this.popupType == "correct") {
      this.rightanspopUpheader_img = true;
      this.wronganspopUpheader_img = false;
      this.showanspopUpheader_img = false;
      this.partialCorrectheaderTxt_img = false;
      this.styleHeaderPopup = this.feedbackAssets.style_header;
      this.styleBodyPopup = this.feedbackAssets.style_body;
      this.feedbackAssets.popTitleTxt_img = this.feedbackAssets.right_style_title;
    }
    if (this.popupType == "showanswer") {
      this.autoClosePopupTimer = this.showAnsTimeout;
      this.rightanspopUpheader_img = false;
      this.wronganspopUpheader_img = false;
      this.showanspopUpheader_img = true;
      this.partialCorrectheaderTxt_img = false;
      this.styleHeaderPopup = this.feedbackAssets.style_header;
      this.styleBodyPopup = this.feedbackAssets.style_body;
      this.feedbackAssets.popTitleTxt_img = this.feedbackAssets.showAns_style_title;
    }
    console.log(this.autoClosePopupTimer);

  }


}



