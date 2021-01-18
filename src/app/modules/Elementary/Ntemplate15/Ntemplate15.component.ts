import { Component, OnInit, ViewChild, AfterViewChecked, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { Subscription } from 'rxjs'
import { PlayerConstants } from '../../../common/playerconstants';
import { SharedserviceService } from '../../../services/sharedservice.service';
import { ThemeConstants } from '../../../common/themeconstants';


@Component({
  selector: 'Ntemplate15',
  templateUrl: './Ntemplate15.component.html',
  styleUrls: ['./Ntemplate15.component.css']
})
export class Ntemplate15 implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('narrator') narrator: any;
  @ViewChild('instruction') instruction: any;
  @ViewChild('allOpt') allOpt: any;
  @ViewChild('feedbackVoRef') feedbackVoRef: any;
  @ViewChild('confirmReplayRef') confirmReplayRef: any;
  @ViewChild('mainVideo') mainVideo: any;
  @ViewChild('ansBlock') ansBlock: any;
  @ViewChild('disableSpeaker') disableSpeaker: any;
  @ViewChild('sprite') sprite: any;
  @ViewChild('speakerNormal') speakerNormal: any;
  @ViewChild('audioEl') audioEl: any;
  @ViewChild('maincontent') maincontent: any;
  @ViewChild('submitModalRef') submitModalRef: any;
  @ViewChild('confirmModalRef') confirmModalRef: any;
  @ViewChild('correctAns') correctAns: any;
  @ViewChild('wrongFeedback') wrongFeedback: any;
  audio = new Audio();
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
  instructionOpacity: boolean = false;
  showAnssetTimeout: any;
  bodyContentOpacity: boolean = false;
  bodyContentDisable: boolean = true;
  displayconfirmPopup: boolean = false;
  initialDisableTimer: any;
  myoption: any = [];
  question: any = "";
  optionCursorPointer: boolean = false;
  itemid: any = 0;
  isOptionDisabled: boolean = false;
  blinkTimer: any;
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
  showAnsTempArray: any = [];
  assetspath: any;
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
        this.showAnswer();
      }
    });

    this.appModel.getConfirmationPopup().subscribe((action) => {
      this.appModel.notifyUserAction();
      clearTimeout(this.showAnssetTimeout);
      if (!this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.pause();
      }
      this.instructionDisable = false;
      // if (this.audio && !this.audio.paused) {
      //   this.audio.pause();
      //   this.audio.currentTime = 0;
      //   for (let i = 0; i < this.optionRef.nativeElement.children[0].children.length; i++) {
      //     if (this.optionRef.nativeElement.children[0].children[i] && this.optionRef.nativeElement.children[0].children[i].classList.contains("disableDiv")) {
      //       this.optionRef.nativeElement.children[0].children[i].classList.remove("disableDiv");
      //     }
      //   }
      // }
      if (action == "uttarDikhayein") {
        this.displayconfirmPopup = true;
      }
      if (action == "submitAnswer") {
        this.submitModalRef.nativeElement.classList = "displayPopup modal";
      }
      if (action == "replayVideo") {
        console.log("replaying video");
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
    this.appModel.resetBlinkingTimer();
    this.appModel.handleController(this.controlHandler);
  }


  ngOnDestroy() {
    clearInterval(this.showAnssetTimeout);
    clearInterval(this.initialDisableTimer);
    clearInterval(this.blinkTimer);
    if (this.narrator.nativeElement != undefined) {
      this.narrator.nativeElement.pause();
      this.narrator.nativeElement.currentTime = 0;
    }
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  ngAfterViewChecked() {
    this.templatevolume(this.appModel.volumeValue, this);
  }

  /*End-LifeCycle events*/

  /*Start-Template click and hover events*/
  playHoverInstruction() {
    if (!this.narrator.nativeElement.paused) {
      console.log("narrator/instruction voice still playing");
    } else {
      console.log("play on Instruction");
      this.appModel.notifyUserAction();
      if (this.instruction.nativeElement.paused) {
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

  onHoverSpeaker() {
    if (!this.narrator.nativeElement.paused) {
      this.disableSpeaker.nativeElement.className = "speakerBtn";
      console.log("narrator voice still playing");
    }
    else {
      this.disableSpeaker.nativeElement.className = "speakerBtn pointer";
    }
  }
  playSound_Speaker(el: HTMLAudioElement) {
    if (!this.instruction.nativeElement.paused) {
      this.instruction.nativeElement.currentTime = 0;
      this.instruction.nativeElement.pause();
    }
    if (!this.narrator.nativeElement.paused) {
      console.log("narrator voice still playing");
    }
    if (!this.narrator.nativeElement.paused) {
      console.log("narrator still playing");
    }
    else {
      if (el.id == "S") {
        //this._sharedService.speaker_counter++;
        // this._sharedService.speakerbutton();
        //console.log("speaker_counter:",this._sharedService.speaker_counter);
        this.speakerTimer = setInterval(() => {
          this.checkSpeakerVoice();
        }, 100)

        if (el.paused) {
          el.currentTime = 0;
          el.play();
        }
        else {
          el.currentTime = 0;
          el.play();
        }
      }
      else {
        this.audioEl.nativeElement.pause();
        el.pause();
        el.currentTime = 0;
        el.play();
        if (this.maincontent) {
          this.maincontent.nativeElement.className = "disable_div";
        }
        el.onended = () => {
          if (this.maincontent) {
            this.maincontent.nativeElement.className = "";
          }
        }

      }

    }
  }

  checkSpeakerVoice() {
    if (!this.audioEl.nativeElement.paused) {
      //this.speakerNormal.nativeElement.style.display = "none";
      this.sprite.nativeElement.style.display = "block";
    } else {
      //this.speakerNormal.nativeElement.style.display = "block";
      this.sprite.nativeElement.style.display = "none";
      clearInterval(this.speakerTimer);
    }

  }

  onHoverOptions(option, idx) {
    if (!this.instruction.nativeElement.paused) {
      console.log("narrator voice still playing");
    }
    else {
      option.image = option.imagehover;
      this.ansBlock.nativeElement.children[idx].className = "options pointer";
    }
  }
  playOptionHover(opt) {
    this.appModel.notifyUserAction();
    if (!this.instruction.nativeElement.paused) {
			this.instruction.nativeElement.currentTime = 0;
			this.instruction.nativeElement.pause();
		}
		if (!this.audioEl.nativeElement.paused) {
			this.audioEl.nativeElement.pause();
			this.audioEl.nativeElement.currentTime = 0;
		}
		if (opt && opt.sound) {
			this.allOpt.nativeElement.src = this.assetspath + '/' + opt.sound + "?someRandomSeed=" + Math.random().toString(36);
		}
		this.allOpt.nativeElement.play()
  }

  playSound(soundAssets, idx) {
    if (this.audio && this.audio.paused) {
      this.audio.src = soundAssets.url;
      this.audio.load();
      this.audio.play();
      // for (let i = 0; i < this.optionRef.nativeElement.children[0].children.length; i++) {
      //   if (i != idx && this.optionRef.nativeElement.children[0].children[i]) {
      //     this.optionRef.nativeElement.children[0].children[i].classList.add("disableDiv");
      //   }
      // }
      if (this.instruction && this.instruction.nativeElement.play) {
        this.instruction.nativeElement.pause();
        this.instruction.nativeElement.currentTime = 0;
      }
      this.instructionDisable = true;
      this.audio.onended = () => {
        this.instructionDisable = false;
        // for (let i = 0; i < this.optionRef.nativeElement.children[0].children.length; i++) {
        //   if (i != idx && this.optionRef.nativeElement.children[0].children[i]) {
        //     this.optionRef.nativeElement.children[0].children[i].classList.remove("disableDiv");
        //   }
        // }

      }
    }
  }
  onHoveroutOptions(option, idx) {
    option.image = option.imageorg;
    this.ansBlock.nativeElement.children[idx].className = "options";
  }

  /*End-Template click and hover events*/


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
    } else {
      this.appModel.moveNextQues(this.attemptType);
    }
  }

  /******Wrong or Partial Incorrect post anmination functionality *******/
  postWrongAttemplt() {
    // this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center ";
    this.appModel.notifyUserAction();
    this.myoption.forEach(element => {
      element.show = true;
    });
    this.answers = this.appModel.content.contentData.data['answers'];
    this.tempAnswers.length = 0;
    console.log("this.ansBlock.nativeElement", this.ansBlock.nativeElement);
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
    if (obj.audio) {
      obj.audio.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackVoRef && obj.feedbackVoRef.nativeElement) {
      obj.feedbackVoRef.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.wrongFeedback && obj.wrongFeedback.nativeElement) {
			obj.wrongFeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
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
        this.instructionDisable = false;
      }, 1000);
    }
  }

  replayVideo() {
    this.videoReplayd = true;
    this.isPlayVideo = true;
    this.appModel.enableSubmitBtn(false);
    this.appModel.stopAllTimer();
    this.instructionDisable = true;
    this.appModel.navShow = 1;
    setTimeout(() => {
      this.mainVideo.nativeElement.play();
      this.mainVideo.nativeElement.onended = () => {
        this.isPlayVideo = false;
        this.appModel.navShow = 2;
        this.instructionDisable = false;
        this.appModel.enableReplayBtn(true);
        this.replayconfirmAssets.confirm_btn = this.replayconfirmAssets.confirm_btn_original;
        this.appModel.startPreviousTimer();
        this.appModel.videoStraming(false);
        this.appModel.notifyUserAction();
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
      this.appModel.startPreviousTimer();
    } else {
      this.appModel.videoStraming(false);
      this.appModel.startPreviousTimer();
      this.appModel.notifyUserAction();
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
  /******Question Auto Instruction check as per content JSON *******/
  checkforQVO() {
    if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
      this.appModel.handlePostVOActivity(true);
      this.appModel.enableReplayBtn(false);
      this.instructionDisable = true;
      this.isOptionDisabled = true;
      this.narrator.nativeElement.play();
      this.narrator.nativeElement.onended = () => {
        this.initialDisableTimer = setTimeout(() => {
          this.instructionDisable = false;
          this.bodyContentDisable = false;
          setTimeout(() => {
            this.isOptionDisabled = false;
          }, 1000);
          this.startActivity();
          this.appModel.enableReplayBtn(true);
          this.appModel.handlePostVOActivity(false);
        }, 1000)
      }
    } else {
      this.startActivity();
      this.appModel.enableReplayBtn(true);
      this.appModel.handlePostVOActivity(false);
    }
  }

  /******After completion of Auto Instruction Activity start functionality *******/
  startActivity() {

  }


  /******Data set from content JSON *******/
  setData() {
    if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
      this.speaker = this.fetchedcontent.speaker;
      this.myoption = JSON.parse(JSON.stringify(this.fetchedcontent.options))
      this.question = this.fetchedcontent.ques;
      this.feedback = this.fetchedcontent.feedback;
      this.answers = this.fetchedcontent.answers;
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
    this.confirmModalRef.nativeElement.classList = "modal";
    this.correctAns.nativeElement.classList = "modal";
    this.feedbackVoRef.nativeElement.pause();
    this.instructionDisable = false;
    // if (!this.instruction.nativeElement.paused) {
    // 	this.instruction.nativeElement.currentTime = 0;
    // 	this.instruction.nativeElement.pause();
    // }			
    if (id == "submit-modal-id") {
      if (flag == "yes") {
        console.log("do this")
        this.checkAnswerOnSubmit();
      }

      this.submitModalRef.nativeElement.classList = "modal";
    }
    if (id == "confirm-modal-id") {
      if (flag == "yes") {
        console.log("do this")
        this.showAnswer();
      }

      this.confirmModalRef.nativeElement.classList = "modal";
    }
  }

  /******Popup close functionality *******/
  closeModal() {
    this.instructionDisable = true;
    this.instructionOpacity = true;
    this.bodyContentOpacity = true;
    this.bodyContentDisable = true;
    this.appModel.notifyUserAction();
    this.blinkOnLastQues();
  }
  showAnswer() {
    this.attemptType = "no animation"
    this.appModel.enableSubmitBtn(false)
    // show right answer pop up
    this.feedbackPopup = this.rightPopup;
    let correctAns: HTMLElement = this.correctAns.nativeElement as HTMLElement;
    this.confirmModalRef.nativeElement.classList = "modal";
    this.confirmReplayRef.nativeElement.classList = "modal";
    this.submitModalRef.nativeElement.classList = "modal";
    correctAns.className = "modal d-flex align-items-center justify-content-center showit correctAns dispFlex";
    this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div disable-click";
    this.instructionDisable = true;
    this.feedbackVoRef.nativeElement.src = this.question.narrator_voice.url
    this.showAnsTempArray = JSON.parse(JSON.stringify(this.answers))
    this.appModel.resetBlinkingTimer();
    setTimeout(() => {
      if (this.feedbackVoRef && this.feedbackVoRef.nativeElement) {
        this.feedbackVoRef.nativeElement.play();
      }
    }, 50)
    this.feedbackVoRef.nativeElement.onended = () => {
      if (!this.closed) {
        this.correctAns.nativeElement.classList = "modal";
        this.attemptType = "no animation"
        this.blinkOnLastQues();

      }
    }
  }
  stopAllSounds(e) {
    //console.log("Event", e);
    if (!this.instruction.nativeElement.paused) {
      e.stopPropagation();
      console.log("narrator voice still playing");
    }
    else { }
  }
  clickAnswer(option, event, idx) {
    option.image = option.imageorg;
    this.appModel.notifyUserAction();
    this.ansBlock.nativeElement.children[idx].className = "options";
    this.tempAnswers.push(option)
    if (!this.instruction.nativeElement.paused) {
      this.instruction.nativeElement.currentTime = 0;
      this.instruction.nativeElement.pause();
    }

    if (!this.narrator.nativeElement.paused) {
      console.log("narrator voice still playing");
    }
    else {

      //doesn't matter if the option chosen is right or not, insert it into that sequence.
      // this.audioEl.nativeElement.pause();
      console.log("when correct answer clicked", event.toElement);
      // empty cloud
      this.myoption[idx].show = false;
      if (this.j < this.answers.length) {
        console.log("loadImage would be called");
        this.j++;
      }
      if (this.tempAnswers.length == this.myoption.length) {
        this.appModel.enableSubmitBtn(true);
      }
      else {
        this.appModel.enableSubmitBtn(false);
      }
      console.log("check:", this.i, this.answers.length);

    }
  }
  revertAction(option, event, idx) {
    if (!this.instruction.nativeElement.paused) {
      this.instruction.nativeElement.currentTime = 0;
      this.instruction.nativeElement.pause();
    }
    // this.audioEl.nativeElement.pause();
    // this.audioEl.nativeElement.currentTime = 0;
    console.log("option", option)
    this.tempAnswers.splice(idx, 1)
    option.show = true;
    this.appModel.enableSubmitBtn(false);

  }
  ifEqual(a, b) {
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  checkAnswerOnSubmit() {
    //check if the option in temanswer array are in right sequence or not

    let tempCustomId = [];
    this.tempAnswers.forEach(element => {
      tempCustomId.push(element.custom_id)
    });

    if (this.ifEqual(tempCustomId, this.correct_ans_index)) {
      console.log("right answer pop")
      this.feedbackPopup = this.rightPopup;
      this.attemptType = "manual";
      this.appModel.enableSubmitBtn(false);
      //show right answer pop up

      let correctAns: HTMLElement = this.correctAns.nativeElement as HTMLElement
      correctAns.className = "modal d-flex align-items-center justify-content-center showit correctAns dispFlex";
      this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div disable-click";
      this.instructionDisable = true;
      this.feedbackVoRef.nativeElement.src = this.feedbackPopup.feedbackVo.url + "?someRandomSeed=" + Math.random().toString(36);
      //this.feedbackVoRef.nativeElement.play();

      setTimeout(() => {
        this.feedbackVoRef.nativeElement.play();
      }, 750)
      this.feedbackVoRef.nativeElement.onended = () => {
        if (!this.closed) {
          this.correctAns.nativeElement.classList = "modal";
          this.blinkOnLastQues();
        }
      }


    }
    else {
      console.log("wrong ans pop up")
      //show wrongans popup
      this.ifWrongAns = true;
      this.feedbackPopup = this.wrongPopup;
      let correctAns: HTMLElement = this.correctAns.nativeElement as HTMLElement
      correctAns.className = "modal d-flex align-items-center justify-content-center showit correctAns dispFlex";
      this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div disable-click";
      this.instructionDisable = true;
      setTimeout(() => {
        if (this.wrongFeedback && this.wrongFeedback.nativeElement) {
          this.wrongFeedback.nativeElement.play();
        }
      }, 50)
      this.wrongFeedback.nativeElement.onended = () => {
        if (!this.closed) {
          this.wrongTimer = setTimeout(() => {
            this.correctAns.nativeElement.classList = "modal";
            this.appModel.notifyUserAction();
            this.appModel.wrongAttemptAnimation();
          }, 2000);
        }
      }
    }

  }
  wrongAnsClose() {
    this.closed = true;
    this.correctAns.nativeElement.classList = "modal";
    this.appModel.notifyUserAction();
    this.wrongFeedback.nativeElement.pause();
    this.wrongFeedback.nativeElement.currentTime = 0;
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

