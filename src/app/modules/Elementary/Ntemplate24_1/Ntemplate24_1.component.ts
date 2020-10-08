import { Component, OnInit, ViewChild, AfterViewChecked, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { Subscription } from 'rxjs'
import 'jquery';
import { PlayerConstants } from '../../../common/playerconstants';
import { ThemeConstants } from '../../../common/themeconstants';
import { SharedserviceService } from '../../../services/sharedservice.service';

declare var $: any;

@Component({
  selector: 'ntemp24_1',
  templateUrl: './Ntemplate24_1.component.html',
  styleUrls: ['./Ntemplate24_1.component.css', '../../../view/css/bootstrap.min.css'],

})

export class Ntemplate24_1 implements OnInit, AfterViewChecked, OnDestroy {
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
  @ViewChild('instructionBar') instructionBar: any;
  @ViewChild('instruction') instruction: any;
  @ViewChild('instructionVO') instructionVO: any;
  @ViewChild('mainContainer') mainContainer: any;
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
  @ViewChild('partialpopupRef') partialpopupRef: any;
  @ViewChild('feedbackpartialPopupAudio') feedbackpartialPopupAudio: any;
  @ViewChild('partialpopupBodyRef') partialpopupBodyRef: any;
  @ViewChild('confirmReplayRef') confirmReplayRef: any;
  @ViewChild('mainVideo') mainVideo: any;
  @ViewChild('feedbackInfoAudio') feedbackInfoAudio: any;
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
  showIntroScreen: boolean;
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
  optionObj: any;
  optArr1: any;
  optArr2: any;
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
  /*Start: Theme Implementation(Template Changes)*/
  themePath: any;
  fetchedcontent: any;
  functionalityType: any;
  bgSubscription: Subscription;
  /*End: Theme Implementation(Template Changes)*/
  showAnsTimeout: number;
  quesSkip: boolean = false;
  pointerCursor:boolean =true;

  // playHoverInstruction() {
  //   if (!this.instructionVO.nativeElement.paused) {
  //     console.log("narrator/instruction voice still playing");
  //   } else {
  //     console.log("play on Instruction");
  //     if (this.instruction.nativeElement.paused) {
  //       this.instruction.nativeElement.currentTime = 0;
  //       this.instruction.nativeElement.play();
  //       $(".instructionBase img").css("cursor", "pointer");        
  //     }
  //     if (!this.optionAudio.nativeElement.paused) {
  //       this.instruction.nativeElement.currentTime = 0;
  //       this.instruction.nativeElement.pause();        
  //     }
  //   }
  // }

  // playOptionHover(idx, opt) {
  //   if (opt && opt.mouse_over_audio && opt.mouse_over_audio.url) {
  //     this.playSound(opt, opt.mouse_over_audio, idx);
  //   }
  // }

  // optionHover(idx, opt) {
  //   $(this.mainContainer.nativeElement.children[0].children[0].children[idx].children[0]).addClass("scaleInAnimation");
  // }

  hoverPre(opt, idx) {
    this.options.nativeElement.children[0].children[idx].children[0].children[1].src = this.optionObjCopy.moveUpBtn_hover.url + "?someRandomSeed=" + Math.random().toString(36);
  }
  hleavePre(opt, idx) {
    this.options.nativeElement.children[0].children[idx].children[0].children[1].src = this.optionObjCopy.moveUpBtn_original.url + "?someRandomSeed=" + Math.random().toString(36);
  }
  hoverNext(opt, idx) {
    this.options.nativeElement.children[0].children[idx].children[0].children[2].src = this.optionObjCopy.moveDownBtn_hover.url + "?someRandomSeed=" + Math.random().toString(36);
  }
  hleaveNext(opt, idx) {
    this.options.nativeElement.children[0].children[idx].children[0].children[2].src = this.optionObjCopy.moveDownBtn_original.url + "?someRandomSeed=" + Math.random().toString(36);
  }

  // playSound(opt, soundAssets, idx) {
  //   if (this.audio && this.audio.paused) {
  //     this.audio.src = soundAssets.url
  //     this.audio.load();
  //     this.audio.play();
  //     for (let i = 0; i < this.mainContainer.nativeElement.children[0].children[0].children.length; i++) {
  //       if (i != idx) {
  //         $(this.mainContainer.nativeElement.children[0].children[0].children[i]).addClass("disableDiv");
  //       }
  //     }
  //     this.instructionBar.nativeElement.classList = "instructionBase disableDiv";
  //     this.instructionVO.nativeElement.pause();
  //     this.instructionVO.nativeElement.currentTime = 0;
  //     this.audio.onended = () => {
  //       this.instructionBar.nativeElement.classList = "instructionBase";
  //       for (let i = 0; i < this.mainContainer.nativeElement.children[0].children[0].children.length; i++) {
  //         if (i != idx) {
  //           $(this.mainContainer.nativeElement.children[0].children[0].children[i]).removeClass("disableDiv");
  //         }
  //       }

  //     }
  //   }
  // }

  movePrevious(idx, opt) {
    if (!this.instructionVO.nativeElement.paused) {
      this.instructionVO.nativeElement.pause();
      this.instructionVO.nativeElement.currentTime = 0;
    }
    this.appModel.notifyUserAction();
    if (idx - 1 != -1) {
      this.appModel.enableSubmitBtn(true);
      this.appModel.enableReplayBtn(false);
      let from = this.mainContainer.nativeElement.children[0].children[0].children[idx].getBoundingClientRect();
      let to = this.mainContainer.nativeElement.children[0].children[0].children[idx - 1].getBoundingClientRect();
      // $(this.mainContainer.nativeElement.children[0].children[0].children[idx]).animate({ left: (to.left - (from.left)), top: (to.top - (from.top)) }, 500);
      // $(this.mainContainer.nativeElement.children[0].children[0].children[idx - 1]).animate({ left: (from.left - (to.left)), top: (from.top - (to.top)) }, 500, () => { this.reArrangeOpts(idx, 'left') });
    }
  }
  moveNext(idx, opt) {
    if (!this.instructionVO.nativeElement.paused) {
      this.instructionVO.nativeElement.pause();
      this.instructionVO.nativeElement.currentTime = 0;
    }
    this.appModel.notifyUserAction();
    if (idx + 1 <= this.optionObj.optionArray.length - 1) {
      this.appModel.enableSubmitBtn(true);
      this.appModel.enableReplayBtn(false);
      let from = this.mainContainer.nativeElement.children[0].children[0].children[idx].getBoundingClientRect();
      let to = this.mainContainer.nativeElement.children[0].children[0].children[idx + 1].getBoundingClientRect();
      // $(this.mainContainer.nativeElement.children[0].children[0].children[idx]).animate({ left: (to.left - (from.left)), top: (to.top - (from.top)) }, 500);
      // $(this.mainContainer.nativeElement.children[0].children[0].children[idx + 1]).animate({ left: (from.left - (to.left)), top: (from.top - (to.top)) }, 500, () => { this.reArrangeOpts(idx, 'right') });
    }
  }
  reArrangeOpts(idx, flag) {
    if (flag == "left") {
      // $(this.mainContainer.nativeElement.children[0].children[0].children[idx]).css('top', 'auto').css('left', 'auto');
      // $(this.mainContainer.nativeElement.children[0].children[0].children[idx - 1]).css('top', 'auto').css('left', 'auto');
      let optCurrent = this.optionObjCopy.optionArray[idx];
      let optLeft = this.optionObjCopy.optionArray[idx - 1];
      this.optionObjCopy.optionArray[idx] = optLeft;
      this.optionObjCopy.optionArray[idx - 1] = optCurrent;
    } else if (flag == "right") {
      // $(this.mainContainer.nativeElement.children[0].children[0].children[idx]).css('top', 'auto').css('left', 'auto');
      // $(this.mainContainer.nativeElement.children[0].children[0].children[idx + 1]).css('top', 'auto').css('left', 'auto');
      let optCurrent = this.optionObjCopy.optionArray[idx];
      let optRight = this.optionObjCopy.optionArray[idx + 1];
      this.optionObjCopy.optionArray[idx] = optRight;
      this.optionObjCopy.optionArray[idx + 1] = optCurrent;
    }
  }

  optionLeave(idx, opt) {
    // $(this.mainContainer.nativeElement.children[0].children[0].children[idx].children[0]).addClass("scaleOutAnimation");
    opt.scaleInAnimation=false;
    setTimeout(() => {
      // $(this.mainContainer.nativeElement.children[0].children[0].children[idx].children[0]).removeClass("scaleOutAnimation");
      // $(this.mainContainer.nativeElement.children[0].children[0].children[idx].children[0]).removeClass("scaleInAnimation");
    }, 500)
  }

  ngAfterViewChecked() {
    this.templatevolume(this.appModel.volumeValue, this);
  }

  OptionZoomOutAnimation(opt, i, j) {
    if (!this.checked && this.instructionVO.nativeElement.paused) {
      opt.imgsrc = opt.imgsrc_original;
      if (opt.imgsrc && opt.imgsrc.location == "content") {
      } else {
      }
    }
  }

  onClickoption(opt, i, j) {

  }

  blinkOnLastQues() {
    if (this.appModel.isLastSectionInCollection) {
      if (this.popupType == "correct") {
        this.appModel.blinkForLastQues("manual");
      }
      else this.appModel.blinkForLastQues();
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
      else this.appModel.moveNextQues();
    }
  }

  closeModel() {
    //infoModalRef, confirmReplayRef, feedbackPopupRef, confirmSubmitRef, confirmModalRef,
    this.infoModalRef.nativeElement.classList = "modal"
    this.confirmReplayRef.nativeElement.classList == "modal"
    this.feedbackPopupRef.nativeElement.classList = "modal"
    this.confirmSubmitRef.nativeElement.classList = "modal"
    this.confirmModalRef.nativeElement.classList = "modal"
  }

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
    /*Start: Theme Implementation(Template Changes)*/
    let fetchedData: any = this.appModel.content.contentData.data;
    this.fetchedcontent = JSON.parse(JSON.stringify(fetchedData));
    this.functionalityType = this.appModel.content.contentLogic.functionalityType;
    this.themePath = ThemeConstants.THEME_PATH + this.fetchedcontent.productType + '/' + this.fetchedcontent.theme_name;
    this.Sharedservice.imagePath(this.fetchedcontent, this.containgFolderPath, this.themePath, this.functionalityType);
    this.checkquesTab();
    /*End: Theme Implementation(Template Changes)*/
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
      if (val == "uttarDikhayein") {
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
    this.appModel.resetBlinkingTimer();
  }

  ngOnDestroy() {
    clearInterval(this.postCompleteTimer);
    /*Start: Theme Implementation(Template Changes)*/
    if (this.bgSubscription != undefined) {
      this.bgSubscription.unsubscribe();
    }
    /*End: Theme Implementation(Template Changes)*/
  }
  /*Start: Theme Implementation(Template Changes)*/
  checkquesTab() {
    if (this.fetchedcontent.commonassets.ques_control != undefined) {
      this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
    } else {
      this.appModel.getJson();
    }
  }
  /*End: Theme Implementation(Template Changes)*/

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
          //  this.isAllRight = false;
          rightAnswerCount++

        }
        //       else {
        // 	this.isAllRight = true;
        // }
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

  checkforQVO() {
    this.isVideoLoaded = true;
    if (this.questionObj && this.questionObj.quesInstruction && this.questionObj.quesInstruction.url && this.questionObj.quesInstruction.autoPlay) {
      this.quesVORef.nativeElement.src = this.questionObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
      this.mainContainer.nativeElement.classList = "bodyContent disableDiv";
      this.instructionBar.nativeElement.classList = "instructionBase disableDiv";
      this.quesVORef.nativeElement.play();
      this.appModel.enableReplayBtn(false);
      this.appModel.enableSubmitBtn(false);
      this.appModel.handlePostVOActivity(true);
      this.quesVORef.nativeElement.onended = () => {
        this.mainContainer.nativeElement.classList = "bodyContent";
        this.instructionBar.nativeElement.classList = "instructionBase";
        this.appModel.handlePostVOActivity(false);
        this.appModel.enableReplayBtn(true);
        //  this.appModel.enableSubmitBtn(true);
      }
    } else {
      this.appModel.handlePostVOActivity(false);
      this.appModel.enableReplayBtn(true);
      // this.appModel.enableSubmitBtn(true);
    }
  }

  setData() {
    if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
      // let fetchedData: any = this.appModel.content.contentData.data;
      // console.log(fetchedData);
      this.feedback = this.fetchedcontent.feedback;
      this.commonAssets = this.fetchedcontent.commonassets;
      this.narratorAudio = this.fetchedcontent.commonassets.narrator;
      // this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
      // this.ques_control = this.fetchedcontent.commonassets.ques_control;
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
      /*Start: Theme Implementation(Template Changes)*/
      this.controlHandler = {
        isShowAns: true,
        isSubmitRequired: this.quesObj.submitRequired,
        isReplayRequired: this.quesObj.replayRequired
      }
      /*End: Theme Implementation(Template Changes)*/
    }
  }

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

  endedHandler() {
    if (!this.videoReplayd) {
      this.isPlayVideo = false;
      // this.appModel.setLoader(true);
      this.appModel.navShow = 2;
      this.appModel.enableReplayBtn(true);
    }
  }

  endedHandleronSkip() {
    this.isPlayVideo = false;
    this.appModel.navShow = 2;
    this.appModel.videoStraming(false);
    this.appModel.notifyUserAction();
  }


  PlayPauseVideo() {
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

  hoverSkip() {
    // this.skipFlag = false;
    this.quesObj.quesSkip = this.quesObj.quesSkipHover;
  }
  houtSkip() {
    this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
  }

  playInstruction() {
    if (this.instructionVO.nativeElement && this.instructionVO.nativeElement.src) {
      this.instructionVO.nativeElement.play();
      this.pointerCursor=false;
      //this.mainContainer.nativeElement.style.pointerEvents = "none";
      this.instructionVO.nativeElement.onended = () => {
        this.mainContainer.nativeElement.style.pointerEvents = "";
        this.pointerCursor=true;
      }
    }
  }
  getBasePath() {
    if (this.appModel && this.appModel.content) {
      return this.appModel.content.id + '';
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

  showFeedback(id: string, flag: string) {

  }

  resetAttempt() {

  }


  sendFeedback(ref, flag: string, action?: string) {
    this.appModel.notifyUserAction();
    ref.classList = "modal";
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


  showReplay(ref, flag: string, action?: string) {
    ref.classList = "modal";
    this.appModel.notifyUserAction();
    if (flag == "yes") {
      if (action == "replay") {
        this.replayVideo();
      }
    } else if (flag == "no") {
      this.appModel.videoStraming(false);
      setTimeout(() => {
        // $("#instructionBar").removeClass("disable_div");
        // $("#optionsBlock .options").removeClass("disable_div");
      }, 1000);
    }
  }

  replayVideo() {
    this.videoReplayd = true;
    this.isPlayVideo = true;
    // $("#optionsBlock .options").addClass("disable_div");
    // $(".instructionBase").addClass("disable_div");
    setTimeout(() => {
      this.mainVideo.nativeElement.play();
      this.mainVideo.nativeElement.onended = () => {
        // $("#optionsBlock .options").removeClass("disable_div");
        // $(".instructionBase").removeClass("disable_div");
        this.isPlayVideo = false;
        this.appModel.videoStraming(false);
        this.appModel.notifyUserAction();
      }
    }, 500)
  }


  resetActivity() {
    this.optionObjCopy = JSON.parse(JSON.stringify(this.optionObj));
    this.appModel.enableReplayBtn(true);
    this.appModel.enableSubmitBtn(true);
  }

  selectOpt(idx, opt) {
    this.appModel.notifyUserAction();
    this.appModel.enableReplayBtn(false);
    for (let i in this.optionObjCopy.optionArray) {
      this.optionObjCopy.optionArray[i].selected = false;
    }
    this.optionObjCopy.optionArray[idx].selected = true;
  }

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
            this.appModel.wrongAttemptAnimation();
            this.resetActivity();
          }
        }, 1000)
      }
    }
  }

  postWrongAttemplt() {
    setTimeout(() => {
      this.appModel.enableSubmitBtn(false);
    }, 200)
    this.resetActivity();
    this.appModel.startPreviousTimer();
    this.appModel.notifyUserAction();
  }

  removeClassOptAnimate() {
    if (this.feedbackOption.nativeElement && this.feedbackOption.nativeElement.children) {
      for (let i in this.feedbackOption.nativeElement.children) {
        if (this.feedbackOption.nativeElement.children[i] && this.feedbackOption.nativeElement.children[i].children && this.feedbackOption.nativeElement.children[i].children[0]) {
          this.feedbackOption.nativeElement.children[i].children[0].classList = "img-fluid";
        }
      }
    }
  }

  disableScreen() {
    for (let i in this.mainContainer.nativeElement.children[0].children[0].children) {
      // $(this.mainContainer.nativeElement.children[0].children[0].children[i]).addClass("greyOut");
    }
    this.instructionBar.nativeElement.classList = "instructionBase disableDiv greyOut";
    this.appModel.enableSubmitBtn(false);
    this.appModel.enableReplayBtn(false);
  }

  setPopupAssets() {
    console.log(this.feedbackAssets)
    console.log("check pop up type", "this.attemptType:", "this.popupType:", this.popupType)
    if (this.popupType == "wrong") {
      this.rightanspopUpheader_img = false;
      this.wronganspopUpheader_img = true;
      this.showanspopUpheader_img = false;
      this.partialCorrectheaderTxt_img = false;
      this.styleHeaderPopup = this.feedbackAssets.wrong_style_header;
      this.styleBodyPopup = this.feedbackAssets.wrong_style_body;
    }
    if (this.popupType == "partialCorrect") {
      this.rightanspopUpheader_img = false;
      this.wronganspopUpheader_img = false;
      this.showanspopUpheader_img = false;
      this.partialCorrectheaderTxt_img = true;
      this.styleHeaderPopup = this.feedbackAssets.style_header;
      this.styleBodyPopup = this.feedbackAssets.style_body;
    }
    if (this.popupType == "correct") {
      this.rightanspopUpheader_img = true;
      this.wronganspopUpheader_img = false;
      this.showanspopUpheader_img = false;
      this.partialCorrectheaderTxt_img = false;
      this.styleHeaderPopup = this.feedbackAssets.style_header;
      this.styleBodyPopup = this.feedbackAssets.style_body;
    }
    if (this.popupType == "showanswer") {
      this.rightanspopUpheader_img = false;
      this.wronganspopUpheader_img = false;
      this.showanspopUpheader_img = true;
      this.partialCorrectheaderTxt_img = false;
      this.styleHeaderPopup = this.feedbackAssets.style_header;
      this.styleBodyPopup = this.feedbackAssets.style_body;
    }


  }


}



