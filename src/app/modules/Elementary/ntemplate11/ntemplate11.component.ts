import { Component, OnInit, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { PlayerConstants } from '../../../common/playerconstants';
import { Subscription } from 'rxjs'
import { ThemeConstants } from '../../../common/themeconstants';
import { SharedserviceService } from '../../../common/services/sharedservice.service';
import { timer } from 'rxjs/observable/timer';
import { take } from 'rxjs/operators';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  AnimationEvent
} from '@angular/animations';

@Component({
  selector: 'app-ntemplate11',
  templateUrl: './ntemplate11.component.html',
  styleUrls: ['./ntemplate11.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({

      })),
      state('closed', style({
        'left': '{{leftPos}}',
        'top': '{{topPos}}'
      }), { params: { leftPos: 'auto', topPos: 'auto' } }),
      transition('open => closed', [
        animate('0.5s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
  ],
})
export class Ntemplate11Component  implements OnInit, OnDestroy, AfterViewChecked {
  private appModel: ApplicationmodelService;
  @ViewChild('confirmModalRef') confirmModalRef: any;
  @ViewChild('confirmReplayRef') confirmReplayRef: any;
  @ViewChild('feedbackVoRef') feedbackVoRef: any;
  @ViewChild('narrator') narrator: any;
  @ViewChild('instruction') instruction: any;
  @ViewChild('mainVideo') mainVideo: any;
  @ViewChild('optionRef') optionRef: any;
 
  videoType:any;
  isOptionDisabled: boolean = true;
  instructionDisable: boolean = false;
  instructionOpacity: boolean = false;
  bodyContentOpacity: boolean = false;
  bodyContentDisable: boolean = true;
  isPlayVideo: boolean;
  audio = new Audio();
  timernextseg: any;
  myoption: any = [];
  question: any = "";
  feedback: any = "";
  isFirstQues: boolean;
  isLastQues: boolean = false;
  isAutoplayOn: boolean;
  isLastQuesAct: boolean;
  noOfImgs: number;
  noOfImgsLoaded: number = 0;
  loaderTimer: any;
  assetspath: any;
  common_assets: any = "";
  // hasEventFired: boolean = false;
  confirmPopupAssets: any;
  wrongPopup: any;
  rightPopup: any;
  feedbackObj: any;
  commonAssets: any = "";
  containgFolderPath: string = "";
  loadFlag: boolean = false;
  quesObj: any;
  tempSubscription: Subscription;
  attemptType: string = "";
  isAnsWrong: boolean = false;  
  itemid: any;
  videoReplayd: boolean;
  replayconfirmAssets: any;
  PlayPauseFlag: boolean = true;
  showAnsTimer: any;
  controlHandler = {
    isSubmitRequired: false,
    isReplayRequired: false,
  };
  themePath: any;
  fetchedcontent: any;
  functionalityType: any;
  showAnsTimeout: number;
  rightFeedbackTimer: any;
  wrongFeedbackTimer: any;
  isShowAnswer: boolean = false;
  quesSkip: boolean = false;
  timerSubscription: Subscription;
  isLastQuestion: boolean;
  confirmPopupSubscription:any;
  actComplete : boolean = false;
  /*Start-LifeCycle events*/
  constructor(appModel: ApplicationmodelService, private Sharedservice: SharedserviceService) {
    this.appModel = appModel;
    this.assetspath = this.appModel.assetsfolderpath;
    this.appModel.navShow = 2;
    this.appModel.setLoader(true);
    // if error occured during image loading loader wil stop after 5 seconds 
    this.loaderTimer = setTimeout(() => {
      this.appModel.setLoader(false);
      console.log("stopping loader")
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
    this.assetspath = "";
    if (this.appModel.isNewCollection) {
      this.appModel.event = { 'action': 'segmentBegins' };
    }
    this.containgFolderPath = this.getBasePath();
    this.appModel.functionone(this.templatevolume, this);
    console.log("init---->>>>>>>>>:", this.appModel.content.contentData.data);
    let fetchedData: any = this.appModel.content.contentData.data;
    this.fetchedcontent = JSON.parse(JSON.stringify(fetchedData));
    this.functionalityType = this.appModel.content.contentLogic.functionalityType;
    this.themePath = ThemeConstants.THEME_PATH + this.fetchedcontent.productType + '/' + this.fetchedcontent.theme_name;
    this.Sharedservice.imagePath(this.fetchedcontent, this.containgFolderPath, this.themePath, undefined);
    this.checkquesTab();
    this.appModel.globalJsonData.subscribe(data => {
      this.showAnsTimeout = data.showAnsTimeout;
    });
    this.setData();
    this.confirmPopupSubscription=this.appModel.getConfirmationPopup().subscribe((val) => {
      this.appModel.notifyUserAction();
      if (!this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.pause();
        this.instructionDisable = false;
      }
      if (this.audio && !this.audio.paused) {
        this.audio.pause();
        this.audio.currentTime = 0;
        for (let i = 0; i < this.optionRef.nativeElement.children[0].children.length; i++) {
          if (this.optionRef.nativeElement.children[0].children[i] && this.optionRef.nativeElement.children[0].children[i].classList.contains("disable_div")) {
            this.optionRef.nativeElement.children[0].children[i].classList.remove("disable_div");
          }
        }
      }
      if (val == "uttarDikhayein") {
        this.isOptionDisabled = true;
        if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
          this.confirmModalRef.nativeElement.classList = "displayPopup modal";
          this.checkForAutoClose();
        }
      }
      if (val == "replayVideo") {
        console.log("replaying video");
        this.isOptionDisabled = true;
        this.PlayPauseFlag = true;
        this.quesObj.quesPlayPause = this.quesObj.quesPause;
        this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
        if (this.confirmReplayRef && this.confirmReplayRef.nativeElement) {
          this.confirmReplayRef.nativeElement.classList = "displayPopup modal";
        }
      }
    })
    this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
      if (mode == "manual") {
        //show modal for manual
        this.appModel.notifyUserAction();
        console.log("mode manuall", mode)

      } else if (mode == "auto") {
        console.log("mode manual2", mode)
        //show modal of auto
        //show answer
        this.isShowAnswer = true;
        this.showAnswer();
      }
    })
    this.appModel.postWrongAttempt.subscribe(() => {
      this.postWrongAttemplt();
    });
    // this.appModel.lastQues.subscribe(() => {
    //   this.appModel.handlePostVOActivity(false);
    // })
    this.appModel.resetBlinkingTimer();
    this.appModel.handleController(this.controlHandler);
  }

  ngOnDestroy() {
    clearTimeout(this.timernextseg);
    clearTimeout(this.showAnsTimer);
    clearTimeout(this.rightFeedbackTimer);
    clearTimeout(this.wrongFeedbackTimer);
    setTimeout(() => {
      this.appModel.resetBlinkingTimer();
    }, 1000);
    if (this.narrator.nativeElement != undefined && !this.narrator.nativeElement.paused) {
      this.narrator.nativeElement.pause();
      this.narrator.nativeElement.currentTime = 0;
    }
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
      this.audio.currentTime = 0;
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
        this.sendFeedback('confirm-modal-id','no');
        this.timerSubscription.unsubscribe();
      }
    )
  }
  removeSubscription(timer) {
    console.log("waiting for autoClose", timer / 1000);
  }

  /*Start-Template click and hover events*/
  onHoverOptions(option, idx) {
    //console.log("in",option);
    this.appModel.notifyUserAction();
    if (!this.narrator.nativeElement.paused) {
      console.log("narrator voice still playing");
    } else {
      if (!this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.pause();
        this.instructionDisable = false;
      }
      // option.image = option.image_hover;
      this.optionRef.nativeElement.children[0].children[idx].classList.add("scaleInAnimation");
      this.optionRef.nativeElement.children[0].children[idx].classList.add("pointer");
    }
  }
  playOptionHover(idx, opt) {
    this.appModel.notifyUserAction();
    if (opt && opt.audio && opt.audio.url) {
      this.playSound(opt.audio, idx);
    }
  }

  playSound(soundAssets, idx) {
    if (this.audio && this.audio.paused) {
      this.audio.src = soundAssets.url;
      this.audio.load();
      this.audio.play();
      for (let i = 0; i < this.optionRef.nativeElement.children[0].children.length; i++) {
        if (i != idx && this.optionRef.nativeElement.children[0].children[i]) {
          this.optionRef.nativeElement.children[0].children[i].classList.add("disable_div");
        }
      }
      // if (this.instruction && this.instruction.nativeElement.play) {
      //   this.instruction.nativeElement.pause();
      //   this.instruction.nativeElement.currentTime = 0;
      // }
      // this.instructionDisable = true;
      this.audio.onended = () => {
        // this.instructionDisable = false;
        for (let i = 0; i < this.optionRef.nativeElement.children[0].children.length; i++) {
          if (i != idx && this.optionRef.nativeElement.children[0].children[i]) {
            this.optionRef.nativeElement.children[0].children[i].classList.remove("disable_div");
          }
        }

      }
    }
  }
  onHoveroutOptions(option, idx) {
    this.appModel.notifyUserAction();
    //console.log("out",option);
    // option.image = option.image_original;
    this.optionRef.nativeElement.children[0].children[idx].classList.add("scaleOutAnimation");
			setTimeout(() => {
				this.optionRef.nativeElement.children[0].children[idx].classList.remove("scaleInAnimation");
				this.optionRef.nativeElement.children[0].children[idx].classList.remove("scaleOutAnimation");
			}, 500);
    this.optionRef.nativeElement.children[0].children[idx].classList.remove("pointer");
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

  hoverCloseConfirm() {
    this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_hover;
  }

  houtonReplayDecline() {
    this.replayconfirmAssets.decline_btn = this.replayconfirmAssets.decline_btn_original;
  }

  hoveronReplayConfirm() {
    this.replayconfirmAssets.confirm_btn = this.replayconfirmAssets.confirm_btn_hover;
  }

  houtonReplayConfirm() {
    this.replayconfirmAssets.confirm_btn = this.replayconfirmAssets.confirm_btn_original;
  }

  hoveronReplayDecline() {
    this.replayconfirmAssets.decline_btn = this.replayconfirmAssets.decline_btn_hover;
  }

  houtDecline() {
    this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_original;
  }

  houtCloseConfirm() {
    this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_original;
  }

  hoverConfirm() {
    this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_hover;
  }

  hoverDecline() {
    this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_hover;
  }

  houtConfirm() {
    this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_original;
  }


  hoverSkip() {
    // this.skipFlag = false;
    this.quesObj.quesSkip = this.quesObj.quesSkipHover;
  }
  houtSkip() {
    this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
  }

  playHoverInstruction() {
    if (!this.narrator.nativeElement.paused) {
      console.log("narrator/instruction voice still playing");
    } else {
      console.log("play on Instruction");
      this.instruction.nativeElement.src = this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
      if (this.instruction.nativeElement.paused) {
        if (this.audio && !this.audio.paused) {
          this.audio.pause();
          this.audio.currentTime = 0;
          for (let i = 0; i < this.optionRef.nativeElement.children[0].children.length; i++) {
            if (this.optionRef.nativeElement.children[0].children[i] && this.optionRef.nativeElement.children[0].children[i].classList.contains("disable_div")) {
              this.optionRef.nativeElement.children[0].children[i].classList.remove("disable_div");
            }
          }
        }
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.play();
        this.instructionDisable = true;
        this.instruction.nativeElement.onended = () => {
          this.instructionDisable = false;
        }

      }
    }
  }

  /*Start-Template Functions*/
  checkquesTab() {
    if (this.fetchedcontent.commonassets.ques_control != undefined) {
      this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
    } else {
      this.appModel.getJson();
    }
  }

  /*** Data set from content JSON ***/
  setData() {
    if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
      console.log("fetchedDatafetchedDatafetchedData", this.fetchedcontent);
      this.common_assets = this.fetchedcontent.commonassets;
      this.myoption = JSON.parse(JSON.stringify(this.fetchedcontent.options));
      this.quesObj = this.fetchedcontent.quesObj;
      this.isLastQuestion = this.commonAssets.isLastQues;
      /*Start: Theme Implementation(Template Changes)*/
      this.controlHandler = {
        isSubmitRequired: this.quesObj.submitRequired,
        isReplayRequired: this.quesObj.replayRequired
      }
      /*End: Theme Implementation(Template Changes)*/

      this.question = this.fetchedcontent.ques;
      this.feedback = this.fetchedcontent.feedback;
      this.commonAssets = this.fetchedcontent.commonassets;
      this.isFirstQues = this.fetchedcontent.isFirstQues;
      this.isLastQuestion = this.commonAssets.isLastQues;
      this.isLastQues = this.appModel.isLastSection;
      this.isLastQuesAct = this.appModel.isLastSectionInCollection;
      this.isAutoplayOn = this.appModel.autoPlay;
      this.noOfImgs = this.fetchedcontent.imgCount;
      this.confirmPopupAssets = this.fetchedcontent.feedback.confirm_popup;
      this.feedbackObj = this.fetchedcontent.feedback;
      this.rightPopup = this.fetchedcontent.feedback.rightFeedback;
      this.wrongPopup = this.fetchedcontent.feedback.wrongFeedback;
      this.replayconfirmAssets = this.fetchedcontent.feedback.replay_confirm;
      if (this.quesObj.quesVideo && this.quesObj.quesVideo.autoPlay && !this.appModel.isVideoPlayed) {
        this.isPlayVideo = true;
      } else {
        this.isPlayVideo = false;
      }
      for (let i = 0; i < this.myoption.length; i++) {
        this.myoption[i].isOpen = true;
        this.myoption[i].isOptSelect = false;
        this.myoption[i].blurOptions = false;
        this.myoption[i].wrongSelected = false;
      }

    } else {
    }

  }

  stopAllSounds(e) {
    //console.log("Event", e);
    if (!this.narrator.nativeElement.paused) {
      e.stopPropagation();
      console.log("narrator voice still playing");
    }
    else { }
  }

  onAnimationEvent(event: AnimationEvent, opt, j) {
    if (event.fromState == "open" && event.toState == "closed" && event.phaseName == "done") {
      opt.isOptSelect = true;
      if (this.isShowAnswer == true) {
        this.playShowAnsFeedback();
      } else if (opt.id == this.feedback.correct_ans_index) {
        this.rightFeedbackTimer = setTimeout(() => {
          this.feedbackVoRef.nativeElement.src = this.commonAssets.right_sound.url + "?someRandomSeed=" + Math.random().toString(36);
          this.feedbackVoRef.nativeElement.play();
        }, 750)
        this.myoption.forEach((element, i) => {
          if (element.id != this.feedback.correct_ans_index) {
            element.blurOptions = true;
          }
        });
        this.feedbackVoRef.nativeElement.onended = () => {
          this.timernextseg = setInterval(() => {
            this.removeEvents();
            this.blinkOnLastQues()
            this.bodyContentOpacity = true;
            this.appModel.enableReplayBtn(false);
          }, 200)
          this.appModel.handlePostVOActivity(false);
        }
      } else {
        opt.wrongSelected = true;
        console.log("when wrong answer clicked");
        this.isAnsWrong = true;
        this.wrongFeedbackTimer = setTimeout(() => {
          this.feedbackVoRef.nativeElement.src = this.commonAssets.wrong_sound.url + "?someRandomSeed=" + Math.random().toString(36);
          this.feedbackVoRef.nativeElement.play();
        }, 750)
        this.feedbackVoRef.nativeElement.onended = () => {
          if (this.isAnsWrong) {
            this.appModel.handlePostVOActivity(false);
            this.appModel.enableReplayBtn(true);
            this.appModel.wrongAttemptAnimation();
          }
        }
      }
    } else if (event.fromState == "closed" && event.toState == "open" && event.phaseName == "done") {
      opt.isOptSelect = false;
    }
  }
  checkAnswer(option, event, idx) {
    this.itemid = idx;
    this.appModel.enableReplayBtn(false);
    this.appModel.handlePostVOActivity(true);
    if (!this.instruction.nativeElement.paused) {
      this.instruction.nativeElement.currentTime = 0;
      this.instruction.nativeElement.pause();
    }
    this.instructionDisable = true;
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
      this.audio.currentTime = 0;
      for (let i = 0; i < this.optionRef.nativeElement.children[0].children.length; i++) {
        if (this.optionRef.nativeElement.children[0].children[i] && this.optionRef.nativeElement.children[0].children[i].classList.contains("disable_div")) {
          this.optionRef.nativeElement.children[0].children[i].classList.remove("disable_div");
        }
      }
    }
    this.bodyContentDisable = true;
    this.isOptionDisabled = true;
    option.leftPos = this.question.styleArray[idx]['left'];
    option.topPos = this.question.styleArray[idx]['top'];
    option.isOpen = false;
    // logic to check what user has done is correct
    if (option.id == this.feedback.correct_ans_index) {
      this.isAnsWrong = false;
      this.attemptType = "manual";
    } else {
    }
  }

  sendFeedback(id: string, flag: string) {
    this.confirmModalRef.nativeElement.classList = "modal";
    this.confirmReplayRef.nativeElement.classList = "modal";
    // this.appModel.handlePostVOActivity(true);
    if (this.timerSubscription != undefined) {
      this.timerSubscription.unsubscribe();
    }
    this.feedbackVoRef.nativeElement.pause();
    // this.instructionDisable = false;
    if (flag == "yes") {
      this.isShowAnswer = true;
      this.showAnswer();
    } else {
      // this.appModel.handlePostVOActivity(false);
      console.log("closing modal");
      //close modal          
      this.appModel.notifyUserAction();
      setTimeout(() => {
        this.isOptionDisabled = false;
      }, 1000)
    }
  }


  isPaused() {
    return this.audio.paused;
  }

  removeEvents() {
    // remove event handlers for all clickable items in the dom
    // this.blink = false;
    clearTimeout(this.timernextseg);
  }

  close() {
    this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
  }

  templatevolume(vol, obj) {
    if (obj.narrator && obj.narrator.nativeElement) {
      obj.narrator.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.instruction && obj.instruction.nativeElement) {
      obj.instruction.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackVoRef && obj.feedbackVoRef.nativeElement) {
      obj.feedbackVoRef.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.mainVideo && obj.mainVideo.nativeElement) {
      obj.mainVideo.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.audio) {
      obj.audio.volume = obj.appModel.isMute ? 0 : vol;
    }
  }
  
  postWrongAttemplt() {
    this.myoption[this.itemid].wrongSelected = false;
    this.myoption[this.itemid].isOptSelect = false;
    this.myoption[this.itemid].isOpen = true;
    this.isAnsWrong = false
    this.bodyContentDisable = false;
    this.instructionDisable=false;
    setTimeout(() => {
      this.isOptionDisabled = false;
    }, 1000)
  }

  getBasePath() {
    if (this.appModel && this.appModel.content) {
      return this.appModel.content.id + '';
    }
  }

  checkImgLoaded() {
    if (!this.loadFlag) {
      this.noOfImgsLoaded++;
      console.log("this.noOfImgsLoaded", this.noOfImgsLoaded, this.noOfImgs)
      if (this.noOfImgsLoaded >= this.noOfImgs) {
        this.appModel.setLoader(false);
        this.loadFlag = true;
        this.checkforQVO();
        clearTimeout(this.loaderTimer);
      }
    }
  }

  checkforQVO() {
    if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
      this.narrator.nativeElement.src = this.quesObj.quesInstruction.url;
      this.appModel.enableReplayBtn(false);
      this.appModel.handlePostVOActivity(true);
      this.narrator.nativeElement.play();
      this.narrator.nativeElement.onended = () => {
        this.bodyContentDisable = false;
        setTimeout(() => {
          this.isOptionDisabled = false;
        }, 1000)
        this.appModel.enableReplayBtn(true);
        this.appModel.handlePostVOActivity(false);
      }
    } else {
      this.appModel.handlePostVOActivity(false);
      this.appModel.enableReplayBtn(false);
    }
  }

  blinkOnLastQues() {
    console.log("this.attemptType", this.attemptType);
    this.actComplete = true;
    if (this.appModel.isLastSectionInCollection) {
      this.appModel.blinkForLastQues(this.attemptType);
      this.appModel.stopAllTimer();
      if (!this.appModel.eventDone) {
        if (this.isLastQuesAct) {
          this.appModel.eventFired();
          this.appModel.event = { 'action': 'segmentEnds' };
        }
        if (this.isLastQues) {
          this.appModel.event = { 'action': 'exit' };
        }
      }
    } else {
      this.appModel.moveNextQues(this.attemptType);
    }
  }

  showReplay(ref, flag: string, action?: string) {
    ref.classList = "modal";
    this.appModel.notifyUserAction();
    if (flag == "yes") {
      if (action == "replay") {
        this.replayconfirmAssets.confirm_btn = this.replayconfirmAssets.confirm_btn_original;
        this.appModel.videoStraming(true);
        this.quesSkip = true;
        this.replayVideo();
      }
    } else if (flag == "no") {
      setTimeout(() => {
        this.isOptionDisabled = false;
      }, 1000)
      this.appModel.videoStraming(false);
      this.appModel.enableReplayBtn(true);
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
  replayVideo() {
    this.videoReplayd = true;
    this.isPlayVideo = true;
    this.appModel.enableSubmitBtn(false);
    this.appModel.stopAllTimer();
    this.appModel.navShow = 1;
    setTimeout(() => {
      this.mainVideo.nativeElement.play();
      this.mainVideo.nativeElement.onended = () => {
        this.videoEndedHandler();
      }
    }, 500)
  }

  endedHandler() {
    if (!this.videoReplayd) {
      this.isPlayVideo = false;
      this.appModel.navShow = 2;
      this.appModel.setLoader(true);
      this.appModel.startPreviousTimer();
    } else {
      this.videoEndedHandler();
    }
  }

  videoEndedHandler() {
    this.isPlayVideo = false;
    this.appModel.navShow = 2;
    this.appModel.enableReplayBtn(true);
    this.replayconfirmAssets.confirm_btn = this.replayconfirmAssets.confirm_btn_original;
    this.appModel.startPreviousTimer();
    this.appModel.videoStraming(false);
    this.appModel.notifyUserAction();
    setTimeout(() => {
      this.isOptionDisabled = false;
    }, 1000)
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
  playShowAnsFeedback() {
    this.appModel.resetBlinkingTimer();
    setTimeout(() => {
      this.feedbackVoRef.nativeElement.src = this.commonAssets.show_sound.url + "?someRandomSeed=" + Math.random().toString(36);
      this.feedbackVoRef.nativeElement.play();
      this.appModel.enableReplayBtn(false);
    }, 750)
    this.showAnsTimer = setTimeout(() => {
      this.bodyContentOpacity = true;
      this.bodyContentDisable = true;
      this.appModel.handlePostVOActivity(false);
      this.blinkOnLastQues();      
    }, this.showAnsTimeout);
  }

  showAnswer() {
    this.attemptType = "hideAnimation";
    this.appModel.handlePostVOActivity(true);
    this.appModel.enableReplayBtn(false);
    this.bodyContentDisable = true;
    this.bodyContentOpacity = false;
    this.confirmModalRef.nativeElement.classList = "modal";
    this.confirmReplayRef.nativeElement.classList = "modal";
    let id: any;
    this.myoption.forEach((element, i) => {
      if (element.id == this.feedback.correct_ans_index) {
        id = i;
      }
      if (element.id != this.feedback.correct_ans_index) {
        element.blurOptions = true;
      }
    });
    if (this.myoption[id].isOpen == true) {
      this.myoption[id].leftPos = this.question.styleArray[id]['left'];
      this.myoption[id].topPos = this.question.styleArray[id]['top'];
      this.myoption[id].isOpen = false;
    } else {
      this.playShowAnsFeedback();
    }
    this.appModel.resetBlinkingTimer();
  }
  /*End-Template Functions*/
}
