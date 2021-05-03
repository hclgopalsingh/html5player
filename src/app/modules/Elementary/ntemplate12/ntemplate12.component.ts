import { Component, OnInit, ViewChild, AfterViewChecked, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { Subscription } from 'rxjs'
import { PlayerConstants } from '../../../common/playerconstants';
import { SharedserviceService } from '../../../common/services/sharedservice.service';
import { ThemeConstants } from '../../../common/themeconstants';
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
  selector: 'app-ntemplate12',
  templateUrl: './ntemplate12.component.html',
  styleUrls: ['./ntemplate12.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({

      })),
      state('closed', style({
        'left': '{{leftPos}}',
        'top': '{{topPos}}',
        'width': '{{optWidth}}',
        'max-width': '{{optMaxWidth}}'
      }), { params: { leftPos: 'auto', topPos: 'auto', optWidth: 'auto', optMaxWidth: 'auto' } }),
      transition('open => closed', [
        animate('0.5s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
  ],
})
export class Ntemplate12Component implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('narrator') narrator: any;
  @ViewChild('instruction') instruction: any;
  @ViewChild('ans') ans: any;
  @ViewChild('feedbackVoRef') feedbackVoRef: any;
  @ViewChild('optionRef') optionRef: any;

  audio = new Audio();
  commonAssets: any = "";
  feedback: any = "";
  isLastQues: boolean = false;
  isLastQuesAct: boolean;
  /*Start: Theme Implementation(Template Changes)*/
  controlHandler = {
    isSubmitRequired: false,
    isReplayRequired: false
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
  timerSubscription: Subscription;
  isLastQuestion: boolean;
  confirmPopupSubscription: any;
  actComplete : boolean = false;
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

    this.confirmPopupSubscription = this.appModel.getConfirmationPopup().subscribe((action) => {
      this.appModel.notifyUserAction();
      clearTimeout(this.showAnssetTimeout);
      if (action == "uttarDikhayein") {
        if (!this.instruction.nativeElement.paused) {
          this.instruction.nativeElement.currentTime = 0;
          this.instruction.nativeElement.pause();
          this.instructionDisable = false;
        }
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
        this.displayconfirmPopup = true;
        this.checkForAutoClose();
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
    clearInterval(this.showAnssetTimeout);
    clearInterval(this.initialDisableTimer);
    clearInterval(this.blinkTimer);
    if (this.timerSubscription != undefined) {
      this.timerSubscription.unsubscribe();
    }
    if (this.confirmPopupSubscription != undefined) {
      this.confirmPopupSubscription.unsubscribe();
    }
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
  checkForAutoClose() {
    if (this.displayconfirmPopup == true) {
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
        if (this.audio && !this.audio.paused) {
          this.audio.pause();
          this.audio.currentTime = 0;
          for (let i = 0; i < this.optionRef.nativeElement.children[0].children.length; i++) {
            if (this.optionRef.nativeElement.children[0].children[i] && this.optionRef.nativeElement.children[0].children[i].classList.contains("disableDiv")) {
              this.optionRef.nativeElement.children[0].children[i].classList.remove("disableDiv");
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

  onHoverOptions(option, idx) {
    if (this.instruction && this.instruction.nativeElement.play) {
      this.instruction.nativeElement.pause();
      this.instruction.nativeElement.currentTime = 0;
    }
    this.instructionDisable = false;
    // option.image = option.image_hover;
    this.optionRef.nativeElement.children[0].children[idx].classList.add("scaleInAnimation");
    this.optionCursorPointer = true;
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
      // this.instructionDisable = true;
      this.audio.onended = () => {
        // this.instructionDisable = false;
        for (let i = 0; i < this.optionRef.nativeElement.children[0].children.length; i++) {
          if (i != idx && this.optionRef.nativeElement.children[0].children[i]) {
            this.optionRef.nativeElement.children[0].children[i].classList.remove("disableDiv");
          }
        }

      }
    }
  }
  onHoveroutOptions(option, idx) {
    // option.image = option.image_original;
    this.optionCursorPointer = false;
    this.optionRef.nativeElement.children[0].children[idx].classList.add("scaleOutAnimation");
    setTimeout(() => {
      this.optionRef.nativeElement.children[0].children[idx].classList.remove("scaleInAnimation");
      this.optionRef.nativeElement.children[0].children[idx].classList.remove("scaleOutAnimation");
    }, 500);
  }
  onAnimationEvent(event: AnimationEvent, opt, j) {
    if (event.fromState == "open" && event.toState == "closed" && event.phaseName == "done") {
      opt.optFilter = true;
      if (opt.id == this.feedback.correct_ans_index) {
        for (let i = 0; i < this.myoption.length; i++) {
          if (this.myoption[i].id != opt.id) {
            this.myoption[i].showDisable = true;
          }
        }
        this.feedbackVoRef.nativeElement.src = this.commonAssets.right_sound.url + "?someRandomSeed=" + Math.random().toString(36);
        this.feedbackVoRef.nativeElement.play();

        this.feedbackVoRef.nativeElement.onended = () => {
          this.blinkTimer = setTimeout(() => {
            this.bodyContentOpacity = true;
            this.instructionOpacity = true;
            this.blinkOnLastQues()
            this.appModel.handlePostVOActivity(false);
          }, 2000)
        }
      }
      else {
        this.feedbackVoRef.nativeElement.src = this.commonAssets.wrong_sound.url + "?someRandomSeed=" + Math.random().toString(36);
        this.feedbackVoRef.nativeElement.play();
        this.feedbackVoRef.nativeElement.onended = () => {
          this.appModel.wrongAttemptAnimation();
          this.appModel.handlePostVOActivity(false);
        }
      }
    } else if (event.fromState == "closed" && event.toState == "open" && event.phaseName == "done") {
      opt.optFilter = false;
    }
  }
  /*End-Template click and hover events*/



  /******Blinking of next Button *******/
  blinkOnLastQues() {
    this.actComplete=true;
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
    console.log("stuffs to do after wornog answer pop-up")
    this.myoption[this.itemid].isOpen = true;
    this.bodyContentDisable = false;
    this.instructionDisable = false;
    setTimeout(() => {
      this.isOptionDisabled = false;
    }, 1000);
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
  /******Question Auto Instruction check as per content JSON *******/
  checkforQVO() {
    if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
      this.appModel.handlePostVOActivity(true);
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
          this.appModel.handlePostVOActivity(false);
        }, 1000)
      }
    } else {
      this.startActivity();
      this.appModel.handlePostVOActivity(false);
    }
  }

  /******After completion of Auto Instruction Activity start functionality *******/
  startActivity() {

  }


  /******Data set from content JSON *******/
  setData() {
    if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
      this.commonAssets = this.fetchedcontent.commonassets;
      this.noOfImgs = this.commonAssets.imgCount;
      this.isLastQuestion = this.commonAssets.isLastQues;
      this.isLastQues = this.appModel.isLastSection;
      this.isLastQuesAct = this.appModel.isLastSectionInCollection;
      if (this.isLastQuesAct || this.isLastQues) {
        this.appModel.setlastQuesNT();
      }
      this.myoption = JSON.parse(JSON.stringify(this.fetchedcontent.options));
      console.log("myoption : " + this.myoption);
      this.question = this.fetchedcontent.ques;
      this.feedback = this.fetchedcontent.feedback;
      this.confirmPopupAssets = this.fetchedcontent.feedback.confirm_popup;
      this.quesObj = this.fetchedcontent.quesObj;
      /*Start: Theme Implementation(Template Changes)*/
      this.controlHandler = {
        isSubmitRequired: this.quesObj.submitRequired,
        isReplayRequired: this.quesObj.replayRequired
      }
      /*End: Theme Implementation(Template Changes)*/
      for (let i = 0; i < this.myoption.length; i++) {
        this.myoption[i].isOpen = true;
        this.myoption[i].optFilter = false;
        this.myoption[i].showDisable = false;
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
    if (this.timerSubscription != undefined) {
      this.timerSubscription.unsubscribe();
    }
    if (flag == "yes") {
      this.showAnswer();
    } else {
      setTimeout(() => {
        this.isOptionDisabled = false;
      }, 1000)
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
    this.appModel.handlePostVOActivity(true);
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
        this.appModel.handlePostVOActivity(false);
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
