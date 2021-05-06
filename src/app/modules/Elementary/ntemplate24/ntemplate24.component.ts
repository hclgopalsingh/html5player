import { Component, OnInit, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { Subscription } from 'rxjs'
import 'jquery';
import { ThemeConstants } from '../../../common/themeconstants';
import { PlayerConstants } from '../../../common/playerconstants';
import { SharedserviceService } from '../../../common/services/sharedservice.service';

declare var $: any;

@Component({
  selector: 'ntemp24',
  templateUrl: './Ntemplate24.component.html',
  styleUrls: ['./Ntemplate24.component.scss'],

})

export class Ntemplate24Component implements OnInit, OnDestroy, AfterViewChecked {
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

  @ViewChild('quesVORef') quesVORef: any;
  @ViewChild('instructionVO') instructionVO: any;
  @ViewChild('mainContainer') mainContainer: any;
  @ViewChild('optionAudio') optionAudio: any;
  @ViewChild('confirmModalRef') confirmModalRef: any;
  @ViewChild('infoModalRef') infoModalRef: any;
  @ViewChild('confirmReplayRef') confirmReplayRef: any;
  @ViewChild('mainVideo') mainVideo: any;
  @ViewChild('confirmSubmitRef') confirmSubmitRef: any;
  @ViewChild('partialFeedbackRef') partialFeedbackRef: any;
  @ViewChild('feedbackPopupRef') feedbackPopupRef: any;
  @ViewChild('feedbackOption') feedbackOption: any;
  @ViewChild('feedbackAudio') feedbackAudio: any;


  audio = new Audio();
  commonAssets: any = "";
  feedback: any = "";
  themePath: any;
  fetchedcontent: any;
  functionalityType: any;
  narratorAudio: any;
  popupType: string = "";
  isFirstQues: boolean;
  isLastQues: boolean = false;
  isAutoplayOn: boolean;
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
  correctImg: any;
  incorrectImg: any;
  popupAssets: any;
  confirmAssets: any;
  infoPopupAssets: any;
  confirmSubmitAssets: any;
  confirmReplayAssets: any;
  noOfRightAns: any;
  rightAnspopupAssets: any;
  tempSubscription: Subscription;
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
  isWrongAttempted: boolean = false;
  assetsFeedback: any = [];
  answerFeedback: string = "";
  postCompleteTimer: any;
  attemptType: string = "";
  rightanspopUpheader_img: boolean = false;
  wronganspopUpheader_img: boolean = false;
  showanspopUpheader_img: boolean = false;
  partialCorrectheaderTxt_img: boolean = false;
  styleHeaderPopup: any;
  styleBodyPopup: any;
  PlayPauseFlag: boolean = true;
  controlHandler = {
    isSubmitRequired: false,
    isReplayRequired: false
  };
  quesSkip: boolean = false;
  bgSubscription: Subscription;
  showAnsTimeout: number;
  autoClosePopupTimer: number;
  isPartialPopup: boolean = false;
  disableInstruction: boolean = true;
  disableOpt: boolean = true;
  greyOutInstruction: boolean = false;
  greyOutOpt: boolean = false;
  submitEnable:boolean = false;


  ngOnInit() {
    // let that = this;

    // $( "#navBlock" ).click(function() {
    //   if (!that.instructionVO.nativeElement.paused)
    //   {
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
    this.appModel.getNotification().subscribe(mode => {
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
    this.appModel.getConfirmationPopup().subscribe((val) => {
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
      this.setPopupAssets();
      if (val == "uttarDikhayein") {
        clearTimeout(this.postCompleteTimer);
        if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
          this.confirmModalRef.nativeElement.classList = "displayPopup modal";
          this.appModel.notifyUserAction();
        }
      } else if (val == "submitAnswer") {
        if (this.confirmSubmitRef && this.confirmSubmitRef.nativeElement) {
          this.confirmSubmitRef.nativeElement.classList = "displayPopup modal";
          this.appModel.notifyUserAction();
        }
      } else if (val == "replayVideo") {
        if (this.confirmReplayRef && this.confirmReplayRef.nativeElement) {
          this.confirmReplayAssets.confirm_btn = this.confirmReplayAssets.confirm_btn_original;
          this.confirmReplayAssets.decline_btn = this.confirmReplayAssets.decline_btn_original;
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
  }

  /*Data set from content JSON */
  setData() {
    if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
      console.log(this.fetchedcontent);
      this.feedback = this.fetchedcontent.feedback;
      this.commonAssets = this.fetchedcontent.commonassets;
      this.narratorAudio = this.fetchedcontent.commonassets.narrator;
      this.ques_control = this.fetchedcontent.commonassets.ques_control;
      this.noOfImgs = this.commonAssets.imgCount;
      this.isFirstQues = this.commonAssets.isFirstQues;
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
        isSubmitRequired: this.quesObj.submitRequired,
        isReplayRequired: this.quesObj.replayRequired
      }
    }
  }
  /*AutoPlay Instruction VO check as per content JSON */
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
        },1000)
        if(this.optionObjCopy.optionArray[0]){
          this.selectOpt(0,this.optionObjCopy.optionArray[0])
        }
        this.appModel.handlePostVOActivity(false);
        this.appModel.enableReplayBtn(true);
      }
    } else {
      this.appModel.handlePostVOActivity(false);
      this.appModel.enableReplayBtn(true);
    }
  }
  /*Mute Functionality handle*/
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

  /*close event call */
  close() {
    //this.appModel.event = { 'action': 'exit', 'currentPosition': this.currentVideoTime };
    this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
  }

  /* To show loader till all the images have loaded*/
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
      this.instructionVO.nativeElement.onended = () => {
        this.mainContainer.nativeElement.style.pointerEvents = "";
        this.disableInstruction = false;
      }
    }
  }
  /*content folder path set */
  getBasePath() {
    if (this.appModel && this.appModel.content) {
      return this.appModel.content.id + '';
    }
  }
  /*Blinking of next Button*/
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
    } else {
      this.appModel.moveNextQues(this.attemptType);
    }
  }
  /*To animate an option to previous position */
  movePrevious(idx) {
    if (!this.instructionVO.nativeElement.paused) {
      this.instructionVO.nativeElement.pause();
      this.instructionVO.nativeElement.currentTime = 0;
      this.disableInstruction = false;
    }
    this.appModel.enableSubmitBtn(true);
    this.submitEnable = true;
    this.appModel.notifyUserAction();
    if (idx - 1 != -1) {
      let from = this.mainContainer.nativeElement.children[0].children[0].children[idx].getBoundingClientRect();
      let to = this.mainContainer.nativeElement.children[0].children[0].children[idx - 1].getBoundingClientRect();
      $(this.mainContainer.nativeElement.children[0].children[0].children[idx]).animate({ left: (to.left - (from.left)), top: (to.top - (from.top)) }, 500);
      $(this.mainContainer.nativeElement.children[0].children[0].children[idx - 1]).animate({ left: (from.left - (to.left)), top: (from.top - (to.top)) }, 500, () => { this.reArrangeOpts(idx, 'left') });
    }
  }

  /*To animate an option to next position */
  moveNext(idx) {
    if (!this.instructionVO.nativeElement.paused) {
      this.instructionVO.nativeElement.pause();
      this.instructionVO.nativeElement.currentTime = 0;
      this.disableInstruction = false;
    }
    this.appModel.notifyUserAction();
    this.appModel.enableSubmitBtn(true);
    this.submitEnable = true;
    if (idx + 1 <= this.optionObj.optionArray.length - 1) {
      let from = this.mainContainer.nativeElement.children[0].children[0].children[idx].getBoundingClientRect();
      let to = this.mainContainer.nativeElement.children[0].children[0].children[idx + 1].getBoundingClientRect();
      $(this.mainContainer.nativeElement.children[0].children[0].children[idx]).animate({ left: (to.left - (from.left)), top: (to.top - (from.top)) }, 500);
      $(this.mainContainer.nativeElement.children[0].children[0].children[idx + 1]).animate({ left: (from.left - (to.left)), top: (from.top - (to.top)) }, 500, () => { this.reArrangeOpts(idx, 'right') });
    }
  }

  /*To rearrage options after next/previous animation completes */
  reArrangeOpts(idx, flag) {
    if (flag == "left") {
      $(this.mainContainer.nativeElement.children[0].children[0].children[idx]).css('top', 'auto').css('left', 'auto');
      $(this.mainContainer.nativeElement.children[0].children[0].children[idx - 1]).css('top', 'auto').css('left', 'auto');
      let optCurrent = this.optionObjCopy.optionArray[idx];
      let optLeft = this.optionObjCopy.optionArray[idx - 1];
      this.optionObjCopy.optionArray[idx] = optLeft;
      this.optionObjCopy.optionArray[idx - 1] = optCurrent;
    } else if (flag == "right") {
      $(this.mainContainer.nativeElement.children[0].children[0].children[idx]).css('top', 'auto').css('left', 'auto');
      $(this.mainContainer.nativeElement.children[0].children[0].children[idx + 1]).css('top', 'auto').css('left', 'auto');
      let optCurrent = this.optionObjCopy.optionArray[idx];
      let optRight = this.optionObjCopy.optionArray[idx + 1];
      this.optionObjCopy.optionArray[idx] = optRight;
      this.optionObjCopy.optionArray[idx + 1] = optCurrent;
    }
  }
  /*To check the correctness of user response */
  getAnswer(flag) {
    this.appModel.stopAllTimer();
    if (flag == 'showAnswer') {
      this.appModel.resetBlinkingTimer();
      this.isAllRight = true;
      this.attemptType = "auto";
      this.answerFeedback = 'showAnswer';
      this.assetsFeedback.splice(0, this.assetsFeedback.length);
      for (let i in this.feedback.correct_sequence) {
        this.assetsFeedback.push(this.optionObj.optionArray[this.feedback.correct_sequence[i]])
      }
    } else if (flag == 'submitAnswer') {
      this.answerFeedback = 'submitAnswer';
      this.attemptType = "manual";
      let rightAnswerCount = 0;
      for (let i in this.feedback.correct_sequence) {
        if (this.optionObjCopy.optionArray[i].index == this.optionObj.optionArray[this.feedback.correct_sequence[i]].index) {
          rightAnswerCount++;
        }
      }
      if (rightAnswerCount == this.feedback.correct_sequence.length) {
        this.isAllRight = true;
        this.popupType = "correct"
      }
      if (rightAnswerCount == 0) {
        this.isAllRight = false;
        this.popupType = "wrong"
      }
      if (rightAnswerCount > 0 && rightAnswerCount < this.feedback.correct_sequence.length) {
        this.popupType = "partialCorrect";
      }
      this.assetsFeedback = this.optionObjCopy.optionArray;
    }
    this.setPopupAssets();
    this.feedbackPopupRef.nativeElement.classList = "modal displayPopup";
    let checkDom = setInterval(() => {
      if (this.feedbackOption.nativeElement.children.length == this.feedback.correct_sequence.length) {
        clearInterval(checkDom);
        this.playFeedbackAudio(0);
      }
    }, 100)
  }
  /*To check user's feedback and perform action accordingly */
  sendFeedback(ref, flag: string, action?: string) {
    
    this.appModel.notifyUserAction();
    this.isPartialPopup = false;
    this.mainContainer.nativeElement.children[0].style.pointerEvents = "none";
    ref.classList = "modal";
    clearTimeout(this.postCompleteTimer);
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
        this.removeAnyAffect();
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
      this.setPopupAssets();
      if (this.partialFeedbackRef && this.partialFeedbackRef.nativeElement && !this.partialFeedbackRef.nativeElement.paused) {
        this.partialFeedbackRef.nativeElement.pause();
        this.partialFeedbackRef.nativeElement.currentTime = 0;
      }
    }
  }

  /* To replay video */
  replayVideo() {
    this.videoReplayd = true;
    this.isPlayVideo = true;
    this.appModel.enableSubmitBtn(false);
    this.disableOpt=true;
    setTimeout(() => {
      this.mainVideo.nativeElement.play();
      this.mainVideo.nativeElement.onended = () => {
        if(this.submitEnable){
          
          this.appModel.enableSubmitBtn(true);
        }
        this.loadTemplateAfterVideo();
      }
    }, 500)
  }

  /* Function on video ends */
  endedHandler() {
    if (!this.videoReplayd) {
      this.isPlayVideo = false;
      // this.appModel.setLoader(true);
      this.appModel.navShow = 2;
      this.appModel.enableReplayBtn(true);
    }
  }

  /* Function on video ends on skip*/
  endedHandleronSkip() {
    this.appModel.navShow = 2;
    if(this.submitEnable){
      
      this.appModel.enableSubmitBtn(true);
    }
    this.loadTemplateAfterVideo();
  }

  loadTemplateAfterVideo() {
    this.isPlayVideo = false;
    this.appModel.videoStraming(false);
    this.appModel.notifyUserAction();
    setTimeout(()=>{
      this.disableOpt=false;
    },1000)
  }

  /* Toggle play and pause for video */
  PlayPauseVideo() {
    this.appModel.notifyUserAction();
    if (this.PlayPauseFlag) {
      this.mainVideo.nativeElement.pause();
      this.quesObj.quesPlayPause = this.quesObj.quesPlay;
      this.PlayPauseFlag = false;
    }
    else {
      this.mainVideo.nativeElement.play();
      this.quesObj.quesPlayPause = this.quesObj.quesPause;
      this.PlayPauseFlag = true;
    }

  }
  /*Checking of existance of quesTab in content JSON */
  checkquesTab() {
    if (this.fetchedcontent.commonassets.ques_control != undefined) {
      this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
    } else {
      this.appModel.getJson();
    }
  }

  /*Close all popups */
  closeModel() {
    //infoModalRef, confirmReplayRef, feedbackPopupRef, confirmSubmitRef, confirmModalRef,
    this.infoModalRef.nativeElement.classList = "modal";
    this.confirmReplayRef.nativeElement.classList = "modal";
    this.feedbackPopupRef.nativeElement.classList = "modal";
    this.confirmSubmitRef.nativeElement.classList = "modal";
    this.confirmModalRef.nativeElement.classList = "modal";
    this.confirmReplayRef.nativeElement.classList = "modal";
  }

  /*Show disabled screen after activity is answered correctly or answer is seen*/
  disableScreen() {
    this.mainContainer.nativeElement.classList = "bodyContent greyOut";
    // this.instructionBar.nativeElement.classList = "instructionBase disableDiv disable-click";
    this.greyOutInstruction = true;
    this.appModel.enableSubmitBtn(false);
    this.appModel.enableReplayBtn(false);
  }
  /*Show wrong feedback animation and reset activity */
  postWrongAttemplt() {
    setTimeout(() => {
      this.appModel.enableSubmitBtn(false);
    }, 200)
    this.resetActivity();
    this.appModel.startPreviousTimer();
    this.appModel.notifyUserAction();
  }
  resetActivity() {
    this.submitEnable = false;
    this.optionObjCopy = JSON.parse(JSON.stringify(this.optionObj));
    this.appModel.enableReplayBtn(true);
    this.appModel.enableSubmitBtn(true);
    if(this.optionObjCopy.optionArray[0]){
      this.selectOpt(0,this.optionObjCopy.optionArray[0])
    }
  }

  /*On selecting an option make it active */
  selectOpt(idx, opt) {
    this.appModel.notifyUserAction();
    // this.appModel.enableReplayBtn(false);
    for (let i in this.optionObjCopy.optionArray) {
      this.optionObjCopy.optionArray[i].selected = false;
    }
    this.optionObjCopy.optionArray[idx].selected = true;
  }

  /*Play right or wrong Feedback audio */
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
            // this.optionObjCopy = JSON.parse(JSON.stringify(this.optionObj));
            this.removeAnyAffect();
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
        }, this.autoClosePopupTimer)
      }
    }
  }

  /*Make an option inactive */
  removeAnyAffect() {
    for (let i in this.optionObjCopy.optionArray) {
      if (this.optionObjCopy.optionArray[i].selected) {
        this.optionObjCopy.optionArray[i].selected = false;
        break;
      }
    }
  }

  /*Removing animation */
  removeClassOptAnimate() {
    if (this.feedbackOption.nativeElement && this.feedbackOption.nativeElement.children) {
      for (let i in this.feedbackOption.nativeElement.children) {
        if (this.feedbackOption.nativeElement.children[i] && this.feedbackOption.nativeElement.children[i].children && this.feedbackOption.nativeElement.children[i].children[0]) {
          this.feedbackOption.nativeElement.children[i].children[0].classList = "img-fluid";
        }
      }
    }
  }

  /*To set right, wrong, partial and show answer popup assets */
  setPopupAssets() {
    this.isPartialPopup=false;
    console.log(this.feedbackAssets)
    console.log("check pop up type", "this.attemptType:", this.attemptType, "this.popupType:", this.popupType)
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
      this.styleHeaderPopup = this.feedbackAssets.right_style_header;
      this.styleBodyPopup = this.feedbackAssets.right_style_body;
      this.feedbackAssets.popTitleTxt_img = this.feedbackAssets.right_style_title;
    }
    if (this.popupType == "showanswer") {
      this.autoClosePopupTimer = this.showAnsTimeout;
      this.rightanspopUpheader_img = false;
      this.wronganspopUpheader_img = false;
      this.showanspopUpheader_img = true;
      this.partialCorrectheaderTxt_img = false;
      this.styleHeaderPopup = this.feedbackAssets.show_style_header;
      this.styleBodyPopup = this.feedbackAssets.show_style_body;
      this.feedbackAssets.popTitleTxt_img = this.feedbackAssets.showAns_style_title;
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
    this.mainContainer.nativeElement.children[0].children[0].children[idx].children[0].style.cursor="pointer";
    this.mainContainer.nativeElement.children[0].children[0].children[idx].children[0].classList.add("scaleInAnimation");
  }
  playOptionHover(idx, opt) {
    this.appModel.notifyUserAction();
    if (opt && opt.mouse_over_audio && opt.mouse_over_audio.url) {
      this.playSound(opt.mouse_over_audio, idx);
    }
  }
  optionLeave(idx, opt) {
    this.mainContainer.nativeElement.children[0].children[0].children[idx].children[0].style.cursor="";
    this.mainContainer.nativeElement.children[0].children[0].children[idx].children[0].classList.add("scaleOutAnimation");
    setTimeout(() => {
      this.mainContainer.nativeElement.children[0].children[0].children[idx].children[0].classList.remove("scaleOutAnimation");
      this.mainContainer.nativeElement.children[0].children[0].children[idx].children[0].classList.remove("scaleInAnimation");
    }, 500)
  }
  hoverPre() {
    this.optionObjCopy.moveLeftBtn = this.optionObjCopy.moveLeftBtn_hover;
  }
  hleavePre() {
    this.optionObjCopy.moveLeftBtn = this.optionObjCopy.moveLeftBtn_original;
  }
  hoverNext() {
    this.optionObjCopy.moveRightBtn = this.optionObjCopy.moveRightBtn_hover;
  }
  hleaveNext() {
    this.optionObjCopy.moveRightBtn = this.optionObjCopy.moveRightBtn_original;
  }
  hoverSkip() {
    // this.skipFlag = false;
    this.quesObj.quesSkip = this.quesObj.quesSkipHover;
  }
  houtSkip() {
    this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
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

}



