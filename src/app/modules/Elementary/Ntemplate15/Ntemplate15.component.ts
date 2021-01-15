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
  @ViewChild('ans') ans: any;
  @ViewChild('feedbackVoRef') feedbackVoRef: any;
  @ViewChild('optionRef') optionRef: any;
  @ViewChild('confirmReplayRef') confirmReplayRef: any;
  @ViewChild('mainVideo') mainVideo: any;
  audio = new Audio();
  commonAssets: any = "";
  feedback: any = "";
  isFirstQues: boolean;
  isLastQues: boolean = false;
  isLastQuesAct: boolean;
  /*Start: Theme Implementation(Template Changes)*/
  controlHandler = {
    isSubmitRequired: true,
    isReplayRequired: true
  };
  themePath: any;
  fetchedcontent: any;
  functionalityType: any;
  showAnsTimeout: number;
  /*END: Theme Implementation(Template Changes)*/
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
  videoReplayd:boolean;
  PlayPauseFlag: boolean = true;
  SkipLoad: boolean = false;
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
    this.containgFolderPath = this.getBasePath();
    /*Start: Theme Implementation(Template Changes)*/
    let fetchedData: any = this.appModel.content.contentData.data;
    this.fetchedcontent = JSON.parse(JSON.stringify(fetchedData));;
    this.functionalityType = this.appModel.content.contentLogic.functionalityType;
    this.themePath = ThemeConstants.THEME_PATH + this.fetchedcontent.productType + '/' + this.fetchedcontent.theme_name;
    this.Sharedservice.imagePath(this.fetchedcontent, this.containgFolderPath, this.themePath, undefined);
    this.checkquesTab();
    this.appModel.globalJsonData.subscribe(data => {
      this.showAnsTimeout = data.showAnsTimeout;
    });
    /*End: Theme Implementation(Template Changes)*/
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
      if (this.audio && !this.audio.paused) {
        this.audio.pause();
        this.audio.currentTime = 0;
        for (let i = 0; i < this.optionRef.nativeElement.children[0].children.length; i++) {
          if (this.optionRef.nativeElement.children[0].children[i] && this.optionRef.nativeElement.children[0].children[i].classList.contains("disableDiv")) {
            this.optionRef.nativeElement.children[0].children[i].classList.remove("disableDiv");
          }
        }
      }
      if (action == "uttarDikhayein") {        
        this.displayconfirmPopup = true;
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
  onHoverOptions(option, idx) {
    if (!this.instruction.nativeElement.paused) {
      console.log("narrator voice still playing");
    }
    else {
      option.image = option.image_hover;
      this.optionCursorPointer = true;
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
          this.optionRef.nativeElement.children[0].children[i].classList.add("disableDiv");
        }
      }
      if (this.instruction && this.instruction.nativeElement.play) {
        this.instruction.nativeElement.pause();
        this.instruction.nativeElement.currentTime = 0;
      }
      this.instructionDisable = true;
      this.audio.onended = () => {
        this.instructionDisable = false;
        for (let i = 0; i < this.optionRef.nativeElement.children[0].children.length; i++) {
          if (i != idx && this.optionRef.nativeElement.children[0].children[i]) {
            this.optionRef.nativeElement.children[0].children[i].classList.remove("disableDiv");
          }
        }

      }
    }
  }
  onHoveroutOptions(option, idx) {
    option.image = option.image_original;
    this.optionCursorPointer = false;
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
    // console.log("stuffs to do after wornog answer pop-up")
    // this.myoption[this.itemid].isOpen = true;
    // this.bodyContentDisable = false;
    // this.instructionDisable = false;
    // setTimeout(() => {
    //   this.isOptionDisabled = false;
    // }, 1000);

    /*From old temp15 */
    // this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center ";
    this.appModel.notifyUserAction();
    this.myoption.forEach(element => {
      element.show = true;
    });
    // this.answers = this.appModel.content.contentData.data['answers'];
    this.tempAnswers.length = 0;
    // console.log("this.ansBlock.nativeElement", this.ansBlock.nativeElement);
    // this.i = 0;
    // this.j = 0;
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
    if (obj.narrator && obj.narrator.nativeElement) {
      obj.narrator.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.audio) {
      obj.audio.volume = obj.appModel.isMute ? 0 : vol;
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
        this.instructionDisable=false;
      }, 1000);
    }
  }

  replayVideo() {
    this.videoReplayd = true;
    this.isPlayVideo = true;
    this.appModel.enableSubmitBtn(false);
    this.appModel.stopAllTimer();
    this.instructionDisable=true;
    this.appModel.navShow = 1;
    setTimeout(() => {
      this.mainVideo.nativeElement.play();
      this.mainVideo.nativeElement.onended = () => {
        this.isPlayVideo = false;
        this.appModel.navShow = 2;
        this.instructionDisable=false;
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
    this.displayconfirmPopup = false;
    if (flag == "yes") {
      this.showAnswer();
    } else {
      this.appModel.notifyUserAction();
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
    this.attemptType = "hideAnimation";
    document.getElementById("ele_ansBtn").classList.add("disableBtn");
    this.instructionDisable = true;
    this.bodyContentDisable = true;
    this.bodyContentOpacity = false;
    this.instructionOpacity = false;
    this.ans.nativeElement.src = this.containgFolderPath + "/" + this.feedback.correct_ans_url;
    this.displayconfirmPopup = false;
    this.ans.nativeElement.style.visibility = 'visible';
    let id: any;
    this.myoption.forEach((element, i) => {
      if (element.id == this.feedback.correct_ans_index) {
        id = i;
      } else {
        element.showDisable = true;
      }
    });
    console.log("id", id)
    this.myoption[id].imgsrc.url = "";
    this.appModel.resetBlinkingTimer();
    setTimeout(() => {
      this.feedbackVoRef.nativeElement.src = this.commonAssets.show_sound.url + "?someRandomSeed=" + Math.random().toString(36);
      this.feedbackVoRef.nativeElement.play();
    }, 750)
    this.feedbackVoRef.nativeElement.onended = () => {
      this.blinkTimer = setTimeout(() => {
        this.bodyContentOpacity = true;
        this.instructionOpacity = true;
        document.getElementById("ele_ansBtn").classList.remove("disableBtn");
        this.blinkOnLastQues()
      }, this.showAnsTimeout)
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
  checkAnswer(option, event) {
    document.getElementById("ele_ansBtn").classList.add("disableBtn");
    if (!this.instruction.nativeElement.paused) {
      this.instruction.nativeElement.currentTime = 0;
      this.instruction.nativeElement.pause();
    }
    this.instructionDisable = true;
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
      this.audio.currentTime = 0;
      for (let i = 0; i < this.optionRef.nativeElement.children[0].children.length; i++) {
        if (this.optionRef.nativeElement.children[0].children[i] && this.optionRef.nativeElement.children[0].children[i].classList.contains("disableDiv")) {
          this.optionRef.nativeElement.children[0].children[i].classList.remove("disableDiv");
        }
      }
    }
    this.isOptionDisabled = true;
    this.bodyContentDisable = true;
    // Analytics called for attempt counter & first option is clicked
    this.appModel.notifyUserAction();
    if (!this.instruction.nativeElement.paused) {
      console.log("narrator voice still playing");
    }
    else {
      // logic to check what user has done is correct
      if (option.id == this.feedback.correct_ans_index) {
        let id = option.idx;
        this.attemptType = "manual";
        this.itemid = option.idx;
        this.bodyContentDisable = true;
        option.leftPos = this.quesObj.styleArray[option.idx]['left'];
        option.topPos = this.quesObj.styleArray[option.idx]['top'];
        option.optWidth = this.quesObj.styleArray[option.idx]['width'];
        option.optMaxWidth = this.quesObj.styleArray[option.idx]['max-width'];
        option.isOpen = false;
      }
      else {
        this.itemid = option.idx;
        this.bodyContentDisable = true;
        option.leftPos = this.quesObj.styleArray[option.idx]['left'];
        option.topPos = this.quesObj.styleArray[option.idx]['top'];
        option.optWidth = this.quesObj.styleArray[option.idx]['width'];
        option.optMaxWidth = this.quesObj.styleArray[option.idx]['max-width'];
        option.isOpen = false;
      }
    }
  }
  /*End-Template Functions*/
}

