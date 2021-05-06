import { Component, OnInit, ViewChild, AfterViewChecked, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { Subscription } from 'rxjs'
import { PlayerConstants } from '../../../common/playerconstants';
import { SharedserviceService } from '../../../common/services/sharedservice.service';
import { ThemeConstants } from '../../../common/themeconstants';
import { timer } from 'rxjs/observable/timer';
import { take } from 'rxjs/operators';

@Component({
  selector: 'Ntemplate15',
  templateUrl: './Ntemplate15.component.html',
  styleUrls: ['./Ntemplate15.component.scss']
})
export class Ntemplate15Component implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('narrator') narrator: any;
  @ViewChild('instruction') instruction: any;
  @ViewChild('allOpt') allOpt: any;
  @ViewChild('feedbackVoRef') feedbackVoRef: any;
  @ViewChild('mainVideo') mainVideo: any;
  @ViewChild('optionBlock1') optionBlock1: any;
  @ViewChild('optionBlock2') optionBlock2: any;
  @ViewChild('sprite') sprite: any;
  @ViewChild('audioEl') audioEl: any;
  @ViewChild('confirmReplayRef') confirmReplayRef: any;
  @ViewChild('maincontent') maincontent: any;
  @ViewChild('submitModalRef') submitModalRef: any;
  @ViewChild('confirmModalRef') confirmModalRef: any;
  @ViewChild('correctAns') correctAns: any;
  commonAssets: any = "";
  feedback: any = "";
  isFirstQues: boolean;
  isLastQues: boolean = false;
  isLastQuesAct: boolean;
  controlHandler = {
    isSubmitRequired: true,
    isReplayRequired: true
  };
  themePath: any;
  fetchedcontent: any;
  functionalityType: any;
  showAnsTimeout: number;
  noOfImgs: number;
  noOfImgsLoaded: number = 0;
  loaderTimer: any;
  containgFolderPath: string = "";
  assetsPath: string = "";
  loadFlag: boolean = false;
  confirmPopupAssets: any;
  tempSubscription: Subscription;
  quesObj: any;
  attemptType: string = "";
  instructionDisable: boolean = false;
  showAnssetTimeout: any;
  myoption_line1 = [];
  myoption_line2 = [];
  question: any = "";
  tempAnswers: any = [];
  speaker: any = "";
  answers: any = "";
  replayconfirmAssets: any;
  submitPopupAssets: any;
  correct_ans_index: any;
  rightPopup: any;
  wrongPopup: any;
  isPlayVideo: boolean;
  videoReplayd: boolean;
  PlayPauseFlag: boolean = true;
  SkipLoad: boolean = false;
  i = 0;
  j: number = 0;
  speakerTimer: any;
  feedbackPopup: any;
  closed: boolean = false;
  ifWrongAns: boolean = false;
  wrongTimer: any;
  rightTimer: any;
  showAnsTempArray: any = [];
  assetspath: any;
  save: number;
  openShowAns: boolean = false;
  speakerDisable: boolean = false;
  optionDisable: boolean = false;
  showLine2: boolean = true;
  totalOptionCount: any;
  timerSubscription: Subscription;
  isLastQuestion: boolean;
  confirmPopupSubscription: any;
  actComplete : boolean = false;
  showAnsClosed : boolean = false;
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
    this.assetspath = this.appModel.assetsfolderpath;
    this.containgFolderPath = this.getBasePath();
    let fetchedData: any = this.appModel.content.contentData.data;
    this.fetchedcontent = JSON.parse(JSON.stringify(fetchedData));;
    this.functionalityType = this.appModel.content.contentLogic.functionalityType;
    this.themePath = ThemeConstants.THEME_PATH + this.fetchedcontent.productType + '/' + this.fetchedcontent.theme_name;
    this.Sharedservice.imagePath(this.fetchedcontent, this.containgFolderPath, this.themePath, undefined);
    this.checkquesTab();
    this.appModel.globalJsonData.subscribe(data => {
      this.showAnsTimeout = data.showAnsTimeout;
    });
    this.setData();
    this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
      if (mode == "manual") {
        //show modal for manual
        this.appModel.notifyUserAction();
      } else if (mode == "auto") {
        //show modal of auto
        this.openShowAns = true;
        this.showAnswer();
      }
    });
    this.confirmPopupSubscription = this.appModel.getConfirmationPopup().subscribe((action) => {
      this.appModel.notifyUserAction();
      clearTimeout(this.showAnssetTimeout);
      this.stopAllAudios();
      this.optionDisable = true;
      if (action == "uttarDikhayein") {
        if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
          this.confirmModalRef.nativeElement.classList = "displayPopup modal";
          this.checkForAutoClose();
        }
      }
      if (action == "submitAnswer") {
        if (this.submitModalRef && this.submitModalRef.nativeElement) {
          this.submitModalRef.nativeElement.classList = "displayPopup modal";
        }
      }
      if (action == "replayVideo") {
        this.SkipLoad = true;
        this.appModel.enableReplayBtn(true);
        this.PlayPauseFlag = true;
        this.quesObj.quesPlayPause = this.quesObj.quesPause;
        this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
        if (this.confirmReplayRef && this.confirmReplayRef.nativeElement) {
          this.confirmReplayRef.nativeElement.classList = "displayPopup modal";
        }
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
    // this.appModel.lastQues.subscribe(() => {
    //   this.appModel.handlePostVOActivity(false);
    // })
    this.appModel.resetBlinkingTimer();
    this.appModel.handleController(this.controlHandler);
  }


  ngOnDestroy() {
    clearTimeout(this.rightTimer);
    clearTimeout(this.wrongTimer);
    clearInterval(this.showAnssetTimeout);
    if (this.confirmPopupSubscription != undefined) {
      this.confirmPopupSubscription.unsubscribe();
    }
    if (this.narrator.nativeElement != undefined) {
      this.narrator.nativeElement.pause();
      this.narrator.nativeElement.currentTime = 0;
    }
    if (this.allOpt.nativeElement != undefined) {
      this.allOpt.nativeElement.currentTime = 0;
      this.allOpt.nativeElement.pause();
    }
    if (this.timerSubscription != undefined) {
      this.timerSubscription.unsubscribe();
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
        this.sendFeedback('confirm-modal-id', 'no');
        this.timerSubscription.unsubscribe();
      }
    )
  }
  removeSubscription(timer) {
    console.log("waiting for autoClose", timer / 1000);
  }
  /*Start-Template click and hover events*/
  playHoverInstruction() {
    if (!this.narrator.nativeElement.paused) {
      console.log("narrator/instruction voice still playing");
    } else {
      console.log("play on Instruction");
      this.appModel.notifyUserAction();
      if (this.instruction.nativeElement.paused) {
        if (!this.allOpt.nativeElement.paused) {
          this.allOpt.nativeElement.currentTime = 0;
          this.allOpt.nativeElement.pause();
          this.stopOptionSound(this.save);
        }
        if (!this.audioEl.nativeElement.paused) {
          this.audioEl.nativeElement.pause();
          this.audioEl.nativeElement.currentTime = 0;
          this.speakerDisable = false;
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

  hoverCloseFeedback() {
    this.feedbackPopup.close_btn = this.feedbackPopup.close_btn_hover;
  }
  houtCloseFeedback() {
    this.feedbackPopup.close_btn = this.feedbackPopup.close_btn_original;
  }

  hoverClosePopup() {
    this.feedback.popup_commmon_imgs.close_btn = this.feedback.popup_commmon_imgs.close_btn_hover;
  }

  houtClosePopup() {
    this.feedback.popup_commmon_imgs.close_btn = this.feedback.popup_commmon_imgs.close_btn_original;
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
  hoveronSubmitConfirm() {
    this.submitPopupAssets.confirm_btn = this.submitPopupAssets.confirm_btn_hover;
  }
  houtonSubmitConfirm() {
    this.submitPopupAssets.confirm_btn = this.submitPopupAssets.confirm_btn_original;
  }
  houtonSubmitDecline() {
    this.submitPopupAssets.decline_btn = this.submitPopupAssets.decline_btn_original;
  }
  hoveronSubmitDecline() {
    this.submitPopupAssets.decline_btn = this.submitPopupAssets.decline_btn_hover;
  }
  hoverCloseSubmit() {
    this.submitPopupAssets.close_btn = this.submitPopupAssets.close_btn_hover;
  }
  houtCloseSubmit() {
    this.submitPopupAssets.close_btn = this.submitPopupAssets.close_btn_original;
  }

  playSound_Speaker(el: HTMLAudioElement) {
    this.appModel.notifyUserAction();
    if (!this.audioEl.nativeElement.paused) {
      console.log("speaker still playing");
    } else {
      if (!this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.pause();
        this.instructionDisable = false;
      }
      if (!this.allOpt.nativeElement.paused) {
        this.allOpt.nativeElement.currentTime = 0;
        this.allOpt.nativeElement.pause();
        this.stopOptionSound(this.save);
      }
      this.speakerTimer = setInterval(() => {
        this.checkSpeakerVoice();
      }, 100)
      if (el.paused) {
        el.currentTime = 0;
        el.play();
        this.speakerDisable = true;
        el.onended = () => {
          this.speakerDisable = false;
        }
      }
    }
  }
  checkSpeakerVoice() {
    if (!this.audioEl.nativeElement.paused) {
      this.sprite.nativeElement.style.display = "block";
    } else {
      this.sprite.nativeElement.style.display = "none";
      clearInterval(this.speakerTimer);
    }
  }
  onHoverOptions(option, idx, order) {
    if (!this.instruction.nativeElement.paused) {
      this.instruction.nativeElement.currentTime = 0;
      this.instruction.nativeElement.pause();
      this.instructionDisable = false;
    }
    if (!this.audioEl.nativeElement.paused) {
      this.audioEl.nativeElement.pause();
      this.audioEl.nativeElement.currentTime = 0;
      this.speakerDisable = false;
    }
    this.appModel.notifyUserAction();
    option.image = option.imagehover;
    if (order == 'line1') {
      this.optionBlock1.nativeElement.children[idx].children[1].classList.add("pointer");
      this.optionBlock1.nativeElement.children[idx].classList.add("scaleInAnimation");
    } else {
      if (this.optionBlock2 && this.optionBlock2.nativeElement) {
        this.optionBlock2.nativeElement.children[idx].children[1].classList.add("pointer");
        this.optionBlock2.nativeElement.children[idx].classList.add("scaleInAnimation");
      }
    }
  }
  playOptionHover(opt, idx, order) {
    if (this.allOpt.nativeElement.paused) {
      if (opt && opt.sound) {
        this.allOpt.nativeElement.src = opt.sound.url + "?someRandomSeed=" + Math.random().toString(36);
      }
      this.allOpt.nativeElement.play();
      for (let x = 0; x < this.optionBlock1.nativeElement.children.length; x++) {
        if (order == 'line1' && x == idx && this.optionBlock1.nativeElement.children[x]) {
          this.save = x;
        } else {
          this.optionBlock1.nativeElement.children[x].classList.add("disable_div");
        }
      }
      if (this.optionBlock2 && this.optionBlock2.nativeElement) {
        for (let x = 0; x < this.optionBlock2.nativeElement.children.length; x++) {
          if (order == 'line2' && x == idx && this.optionBlock2.nativeElement.children[x]) {
            this.save = x;
          } else {
            this.optionBlock2.nativeElement.children[x].classList.add("disable_div");
          }
        }
      }
      this.allOpt.nativeElement.onended = () => {
        this.stopOptionSound(this.save);
      }
    }
  }
  stopOptionSound(save) {
    for (let x = 0; x < this.optionBlock1.nativeElement.children.length; x++) {
      if (this.optionBlock1.nativeElement.children[x].classList.contains("disable_div")) {
        this.optionBlock1.nativeElement.children[x].classList.remove("disable_div");
      }
    }
    if (this.optionBlock2 && this.optionBlock2.nativeElement) {
      for (let x = 0; x < this.optionBlock2.nativeElement.children.length; x++) {
        if (this.optionBlock2.nativeElement.children[x].classList.contains("disable_div")) {
          this.optionBlock2.nativeElement.children[x].classList.remove("disable_div");
        }
      }
    }
  }
  onHoveroutOptions(option, idx, order) {
    option.image = option.imageorg;
    if (order == 'line1') {
      this.optionBlock1.nativeElement.children[idx].children[1].classList.remove("pointer");
      this.optionBlock1.nativeElement.children[idx].classList.add("scaleOutAnimation");
      setTimeout(() => {
        this.optionBlock1.nativeElement.children[idx].classList.remove("scaleInAnimation");
        this.optionBlock1.nativeElement.children[idx].classList.remove("scaleOutAnimation");
      }, 500);
    } else {
      if (this.optionBlock2 && this.optionBlock2.nativeElement) {
        this.optionBlock2.nativeElement.children[idx].children[1].classList.remove("pointer");
        this.optionBlock2.nativeElement.children[idx].classList.add("scaleOutAnimation");
        setTimeout(() => {
          this.optionBlock2.nativeElement.children[idx].classList.remove("scaleInAnimation");
          this.optionBlock2.nativeElement.children[idx].classList.remove("scaleOutAnimation");
        }, 500);
      }
    }
  }

  /*End-Template click and hover events*/
  stopAllAudios() {
    if (!this.instruction.nativeElement.paused) {
      this.instruction.nativeElement.currentTime = 0;
      this.instruction.nativeElement.pause();
      this.instructionDisable = false;
    }
    if (!this.allOpt.nativeElement.paused) {
      this.allOpt.nativeElement.currentTime = 0;
      this.allOpt.nativeElement.pause();
      this.stopOptionSound(this.save);
    }
    if (!this.audioEl.nativeElement.paused) {
      this.audioEl.nativeElement.pause();
      this.audioEl.nativeElement.currentTime = 0;
      this.speakerDisable = false;
    }
  }

  /******Blinking of next Button *******/
  blinkOnLastQues() {
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
          this.appModel.event = { 'action': 'end' };
        }
      }
      console.log("Segment Ends");
    } else {
      this.appModel.moveNextQues(this.attemptType);
    }
  }

  /******Wrong or Partial Incorrect post anmination functionality *******/
  postWrongAttemplt() {
    // this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center ";
    setTimeout(() => {
      this.optionDisable = false;
    }, 1000)
    this.appModel.notifyUserAction();
    this.myoption_line1.forEach(element => {
      element.show = true;
    });
    this.myoption_line2.forEach(element => {
      element.show = true;
    });
    this.answers = this.appModel.content.contentData.data['answers'];
    this.tempAnswers.length = 0;
    this.i = 0;
    this.j = 0;
    this.appModel.enableSubmitBtn(false);
  }
  /******Checking of existance of quesTab in content JSON *******/
  checkquesTab() {
    if (this.fetchedcontent.commonassets.ques_control != undefined) {
      this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
    } else {
      this.appModel.getJson();
    }
  }

  /******Mute Functionality handle *******/
  templatevolume(vol, obj) {
    if (obj.allOpt && obj.allOpt.nativeElement) {
      obj.allOpt.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.mainVideo && obj.mainVideo.nativeElement) {
      obj.mainVideo.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.audioEl && obj.audioEl.nativeElement) {
      obj.audioEl.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.narrator && obj.narrator.nativeElement) {
      obj.narrator.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackVoRef && obj.feedbackVoRef.nativeElement) {
      obj.feedbackVoRef.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
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
        this.checkforQVO();
      }
    }
  }

  replayVideo() {
    this.videoReplayd = true;
    this.isPlayVideo = true;
    this.appModel.stopAllTimer();
    this.instructionDisable = true;
    this.appModel.navShow = 1;
    setTimeout(() => {
      this.mainVideo.nativeElement.play();
      this.mainVideo.nativeElement.onended = () => {
        this.endedHandleronSkip();
      }
    }, 500)
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
      this.noOfImgsLoaded = 0;
      this.loaderTimer = setTimeout(() => {
        this.appModel.setLoader(false);
      }, 5000)
    }
  }
  endedHandleronSkip() {
    setTimeout(() => {
      this.optionDisable = false;
    }, 1000)
    this.isPlayVideo = false;
    this.appModel.navShow = 2;
    this.instructionDisable = false;
    this.appModel.enableReplayBtn(true);
    this.replayconfirmAssets.confirm_btn = this.replayconfirmAssets.confirm_btn_original;
    this.appModel.videoStraming(false);
    this.appModel.startPreviousTimer();
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
  /******Question Auto Instruction check as per content JSON *******/
  checkforQVO() {
    if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
      this.appModel.handlePostVOActivity(true);
      this.appModel.enableReplayBtn(false);
      this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div";
      this.optionDisable = true;
      this.narrator.nativeElement.play();
      this.narrator.nativeElement.onended = () => {
        if (this.audioEl && this.audioEl.nativeElement) {
          this.audioEl.nativeElement.play();
          this.speakerTimer = setInterval(() => {
            this.checkSpeakerVoice();
          }, 100)
          this.audioEl.nativeElement.onended = () => {
            this.startActivity();
          }
        }
      }
    } else {
      this.startActivity();
    }
  }

  startActivity() {
    setTimeout(() => {
      this.optionDisable = false;
    }, 1000)
    this.appModel.enableReplayBtn(true);
    this.appModel.handlePostVOActivity(false);
    this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center";
  }
  /******Data set from content JSON *******/
  setData() {
    if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
      this.speaker = this.fetchedcontent.speaker;
      this.myoption_line1 = JSON.parse(JSON.stringify(this.fetchedcontent.options.line1));
      this.myoption_line2 = JSON.parse(JSON.stringify(this.fetchedcontent.options.line2));
      if (this.myoption_line2.length < 1) {
        this.showLine2 = false;
      }
      this.totalOptionCount = (this.myoption_line1.length + this.myoption_line2.length);
      this.question = this.fetchedcontent.ques;
      this.feedback = this.fetchedcontent.feedback;
      this.answers = this.fetchedcontent.answers;
      this.showAnsTempArray = JSON.parse(JSON.stringify(this.answers));
      this.tempAnswers = [];
      this.isFirstQues = this.fetchedcontent.isFirstQues;
      this.submitPopupAssets = this.fetchedcontent.feedback.submit_popup;
      this.confirmPopupAssets = this.fetchedcontent.feedback.confirm_popup;
      this.correct_ans_index = this.feedback.correct_ans_index;
      this.rightPopup = this.feedback.rightFeedback;
      this.wrongPopup = this.feedback.wrongFeedback;
      this.replayconfirmAssets = this.fetchedcontent.feedback.replay_confirm;
      this.commonAssets = this.fetchedcontent.commonassets;
      this.noOfImgs = this.commonAssets.imgCount;
      this.isLastQuestion = this.commonAssets.isLastQues;
      this.isLastQues = this.appModel.isLastSection;
      this.isLastQuesAct = this.appModel.isLastSectionInCollection;
      if (this.isLastQuesAct || this.isLastQues) {
        this.appModel.setlastQuesNT();
      }

      this.quesObj = this.fetchedcontent.quesObj;
      this.controlHandler = {
        isSubmitRequired: this.quesObj.submitRequired,
        isReplayRequired: this.quesObj.replayRequired
      }
      if (this.quesObj.quesVideo && this.quesObj.quesVideo.autoPlay && !this.appModel.isVideoPlayed) {
        this.isPlayVideo = true;
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
    this.appModel.notifyUserAction();
    this.confirmModalRef.nativeElement.classList = "modal";
    this.submitModalRef.nativeElement.classList = "modal";
    this.correctAns.nativeElement.classList = "modal";
    if (this.timerSubscription != undefined) {
      this.timerSubscription.unsubscribe();
    }
    this.feedbackVoRef.nativeElement.pause();
    this.feedbackVoRef.nativeElement.currentTime = 0;
    this.instructionDisable = false;
    if (id == "submit-modal-id") {
      if (flag == "yes") {
        this.checkAnswerOnSubmit();
      } else if (flag == "no") {
        setTimeout(() => {
          this.optionDisable = false;
        }, 1000)
      }
    }
    if (id == "confirm-modal-id") {
      if (flag == "yes") {
        this.openShowAns = true;
        this.showAnswer();
      } else if (flag == "no") {
        setTimeout(() => {
          this.optionDisable = false;
        }, 1000)
      }
    }
  }
  showReplay(ref, flag: string, action?: string) {
    ref.classList = "modal";
    this.appModel.notifyUserAction();
    if (flag == "yes") {
      if (action == "replay") {
        //this.isPlayVideo = true;
        this.SkipLoad = true;
        this.replayconfirmAssets.confirm_btn = this.replayconfirmAssets.confirm_btn_original;
        this.appModel.videoStraming(true);
        this.replayVideo();
      }
    } else if (flag == "no") {
      this.appModel.videoStraming(false);
      this.appModel.enableReplayBtn(true);
      setTimeout(() => {
        this.optionDisable = false;
      }, 1000);
    }
  }
  showAnswer() {
    this.showAnsClosed=false;
    this.attemptType = "no animation"
    this.appModel.enableSubmitBtn(false);
    this.appModel.enableReplayBtn(false);
    // show right answer pop up
    this.feedbackPopup = this.feedback.showAnswer;
    let correctAns: HTMLElement = this.correctAns.nativeElement as HTMLElement;
    this.confirmModalRef.nativeElement.classList = "modal";
    this.confirmReplayRef.nativeElement.classList = "modal";
    this.submitModalRef.nativeElement.classList = "modal";
    correctAns.className = "modal d-flex align-items-center justify-content-center showit correctAns dispFlex";
    this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div disable-click";
    this.instructionDisable = true;
    this.feedbackVoRef.nativeElement.src = this.speaker.sound.url
    this.appModel.resetBlinkingTimer();
    setTimeout(() => {
      if (this.feedbackVoRef && this.feedbackVoRef.nativeElement) {
        this.feedbackVoRef.nativeElement.play();
      }
    }, 50)
    this.feedbackVoRef.nativeElement.onended = () => {
      if (!this.showAnsClosed) {
        this.showAnssetTimeout = setTimeout(() => {
          this.correctAns.nativeElement.classList = "modal";
          this.attemptType = "no animation"
          this.blinkOnLastQues();
        }, this.showAnsTimeout)
      }
    }
  }

  clickAnswer(option, event, idx, order) {
    this.onHoveroutOptions(option, idx, order)
    this.appModel.notifyUserAction();
    this.tempAnswers.push(option)
    this.stopAllAudios();
    //doesn't matter if the option chosen is right or not, insert it into that sequence.
    console.log("when correct answer clicked", event.toElement);
    // empty cloud
    option.show = false;
    if (this.tempAnswers.length == this.myoption_line1.length + this.myoption_line2.length) {
      this.appModel.enableSubmitBtn(true);
    }
    else {
      this.appModel.enableSubmitBtn(false);
    }
    console.log("check:", this.i, this.answers.length);

  }
  revertAction(option, event, idx) {
    this.appModel.notifyUserAction();
    this.stopAllAudios();
    this.tempAnswers.splice(idx, 1)
    option.show = true;
    this.appModel.enableSubmitBtn(false);

  }
  ifEqual(a, b) {
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }
  checkAnswerOnSubmit() {
    //check if the option in temanswer array are in right sequence or not
    this.closed = false;
    this.showAnsClosed = false;
    let tempCustomId = [];
    this.tempAnswers.forEach(element => {
      tempCustomId.push(element.custom_id)
    });

    if (this.ifEqual(tempCustomId, this.correct_ans_index)) {
      console.log("right answer pop")
      this.feedbackPopup = this.rightPopup;
      this.attemptType = "manual";
      this.appModel.enableSubmitBtn(false);
      this.appModel.enableReplayBtn(false);
      //show right answer pop up

      let correctAns: HTMLElement = this.correctAns.nativeElement as HTMLElement
      correctAns.className = "modal d-flex align-items-center justify-content-center showit correctAns dispFlex";
      this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div disable-click";
      this.feedbackVoRef.nativeElement.src = this.feedbackPopup.feedbackVo.url + "?someRandomSeed=" + Math.random().toString(36);
      //this.feedbackVoRef.nativeElement.play();

      setTimeout(() => {
        this.feedbackVoRef.nativeElement.play();
      }, 750)
      this.feedbackVoRef.nativeElement.onended = () => {
        this.rightTimer = setTimeout(() => {
          if (!this.closed) {
            this.correctAns.nativeElement.classList = "modal";
            this.blinkOnLastQues();
          }
        }, this.question.RightAnimationSec*1000);
      }


    }
    else {
      console.log("wrong ans pop up")
      //show wrongans popup
      this.ifWrongAns = true;
      this.feedbackPopup = this.wrongPopup;
      let correctAns: HTMLElement = this.correctAns.nativeElement as HTMLElement
      correctAns.className = "modal d-flex align-items-center justify-content-center showit correctAns dispFlex";
      // this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div";
      this.feedbackVoRef.nativeElement.src = this.feedbackPopup.feedbackVo.url + "?someRandomSeed=" + Math.random().toString(36);

      setTimeout(() => {
        this.feedbackVoRef.nativeElement.play();
      }, 750)
      this.feedbackVoRef.nativeElement.onended = () => {
        this.wrongTimer = setTimeout(() => {
          if (!this.closed) {
            this.correctAns.nativeElement.classList = "modal";
            this.appModel.notifyUserAction();
            this.appModel.wrongAttemptAnimation();
          }
        }, this.question.WrongAnimationSec*1000);
      }
    }

  }
  wrongAnsClose() {
    this.closed = true;
    this.correctAns.nativeElement.classList = "modal";
    this.appModel.notifyUserAction();
    this.feedbackVoRef.nativeElement.pause();
    this.feedbackVoRef.nativeElement.currentTime = 0;
    if (this.ifWrongAns) {
      this.appModel.wrongAttemptAnimation();
      this.ifWrongAns = false;
    }
    else {
      this.blinkOnLastQues();
    }
  }
  /*End-Template Functions*/
}

