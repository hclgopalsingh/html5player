import { Component, OnInit, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { Subscription } from 'rxjs';
import { PlayerConstants } from '../../../common/playerconstants';
import { ThemeConstants } from '../../../common/themeconstants';
import { SharedserviceService } from '../../../services/sharedservice.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  AnimationEvent
} from '@angular/animations';


@Component({
  selector: 'ntemp19',
  animations: [
    trigger('openClose', [
      state('open', style({

      })),
      state('closed', style({
        'left': '{{leftPos}}',
        'top': '{{topPos}}',
        'pointer-events': 'none'

      }), { params: { leftPos: 'auto', topPos: 'auto' } }),
      transition('open => closed', [
        animate('0.5s')
      ]),
      transition('closed => open', [
        animate('0s')
      ]),
    ]),
  ],
  templateUrl: './Ntemplate19.component.html',
  styleUrls: ['./Ntemplate19.component.css']

})

export class Ntemplate19Component implements OnInit, AfterViewChecked, OnDestroy {
  constructor(private appModel: ApplicationmodelService, private Sharedservice: SharedserviceService) {
    this.appModel = appModel;
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

  @ViewChild("optionsBlock") optionsBlock: any;
  @ViewChild('narrator') narrator: any;
  @ViewChild('instructionVO') instructionVO: any;
  @ViewChild('optionAudio') optionAudio: any;
  @ViewChild('feedbackPopupAudio') feedbackPopupAudio: any;
  @ViewChild('mainVideo') mainVideo: any;
  @ViewChild('placeholder') placeholder: any;
  @ViewChild('confirmReplayRef') confirmReplayRef: any;

  audio = new Audio();
  blink: boolean = false;
  currentIdx = 0;
  commonAssets: any = "";
  optionslist: any = [];
  optionslist_main: any = "";
  myoption: any = [];
  question: any = "";
  feedback: any = "";
  narratorAudio: any;
  isLastActivity: any = "";
  checked: boolean = false;
  selected: boolean = false;
  bool: boolean = false;
  isQuesTypeImage: boolean = false;
  isQuesTypeVideo: boolean = false;
  showIntroScreen: boolean;
  isShow: boolean = false;
  noOfRightAnsClicked: number = 0;
  noOfWrongAnsClicked: number = 0;
  isLastQues: boolean = false;
  isLastQuesAct: boolean;
  /*Start: Theme Implementation(Template Changes)*/
  controlHandler = {
    isSubmitRequired: false,
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
  loadFlag: boolean = false;
  optionObj: any;
  feedbackObj: any;
  feedbackAudio: any;
  confirmPopupAssets: any;
  rightAnspopupAssets: any;
  tempSubscription: Subscription;
  rightanspopUp: any;
  wronganspopUp: any;
  quesObj: any;
  isPlayVideo: boolean = true;
  videoReplayd: boolean = false;
  startCount: number = 0;
  blinkTimeInterval: any;
  blinkFlag: boolean = true;
  refcpyArray: any = [];
  moveTo: any;
  moveFrom: any;
  moveleft: any;
  movetop: any;
  indexArray: any = [];
  index: any;
  index1: number = 0;
  optionsAfterFive: number = 4;
  rightanspopUpheader_img: boolean = false;
  showanspopUpheader_img: boolean = false;
  PlayPauseFlag: boolean = true;
  instructionDisable: boolean = false;
  clickedIndex: any;
  optionPlaceholders: any;
  showAnswerFeedbackArr: any;
  feedbackArr: any;
  parentMatrixClass: any;
  displayconfirmPopup: boolean = false;
  displayReplayPopup: boolean = false;
  displaymainPopup: boolean = false;
  showAnssetTimeout: any;
  bodyContentOpacity: boolean = false;
  bodyContentDisable: boolean = false;
  instructionOpacity: boolean = false;
  rightAnsTimeout: any;
  popupTxtRequired: any;
  manualClickedonCrossbtn: boolean = false;
  attemptType: any;
  quesSkip: boolean = false;
  confirmReplayAssets: any;
  timerDelayActs: any;
  partialCorrectArr: any = [];
  partialIncorrectArr: any = [];

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
        this.instructionDisable = true;
        this.displaymainPopup = true;
        this.setFeedback();
      } else if (mode == "auto") {
        this.isShow = true;
        this.startCount = 0;
        //show modal of auto
        this.appModel.notifyUserAction();
        this.instructionDisable = true;
        this.instructionOpacity = true;
        this.bodyContentDisable = true;
        this.bodyContentOpacity = true;
        this.displaymainPopup = true;
        this.displayReplayPopup = false;
        this.displayconfirmPopup = false;
        this.rightanspopUpheader_img = false;
        this.showanspopUpheader_img = true;
        this.attemptType = "showAnswer";
        this.feedbackArr = this.showAnswerFeedbackArr;
        this.popupTxtRequired = this.feedbackObj.showAnswer_style_title.required;
        this.noOfRightAnsClicked = 0;
        this.noOfWrongAnsClicked = 0;
        this.partialCorrectArr = [];
        this.partialIncorrectArr = [];
        this.setFeedback();
      }
    })


    this.appModel.getConfirmationPopup().subscribe((action) => {
      this.appModel.notifyUserAction();
      this.optionObj[this.index1].imgsrc = this.optionObj[this.index1].imgsrc_original;
      this.startCount = 0;
      if (!this.instructionVO.nativeElement.paused) {
        this.instructionVO.nativeElement.currentTime = 0;
        this.instructionVO.nativeElement.pause();
      }
      if (this.audio && !this.audio.paused) {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.placeholder.nativeElement.classList.remove('disableDiv');
      }
      clearTimeout(this.showAnssetTimeout);
      if (action == "uttarDikhayein") {
        this.displayconfirmPopup = true;
        this.appModel.notifyUserAction();
      } else if (action == "replayVideo") {
        this.displayReplayPopup = true;
        this.appModel.notifyUserAction();
        this.PlayPauseFlag = true;
        this.quesObj.quesPlayPause = this.quesObj.quesPause;
        this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
      }
    })

    this.appModel.questionEvent.subscribe(() => {
      if (this.rightanspopUp) {
        clearTimeout(this.rightanspopUp);
      }
      if (this.wronganspopUp) {
        clearTimeout(this.wronganspopUp);
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
      this.resetAttempt();
      this.appModel.startPreviousTimer();
      this.appModel.notifyUserAction();
    });
    this.appModel.resetBlinkingTimer();
    this.appModel.handleController(this.controlHandler);
  }

  ngAfterViewChecked() {
    this.templatevolume(this.appModel.volumeValue, this);
  }

  ngOnDestroy() {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    clearInterval(this.blinkTimeInterval);
    clearInterval(this.rightAnsTimeout);
    clearInterval(this.showAnssetTimeout);
    clearInterval(this.timerDelayActs);
    this.startCount = 0;
    this.index1 = 0;
  }

  /****** Play Instruction VO on click on Instruction text ******/
  playInstruction() {
    this.appModel.notifyUserAction();
    if (this.instructionVO.nativeElement && this.instructionVO.nativeElement.src) {
      this.instructionDisable = true;
      this.instructionVO.nativeElement.play();
      this.instructionVO.nativeElement.onended = () => {
        this.instructionDisable = false;
      }
    }
  }

  /****** Option mouse hover functionality ******/
  optionHover(opt, i) {
    if (i == this.index1) {
      this.optionsBlock.nativeElement.children[1].children[i].style.cursor = "pointer";
      this.optionsBlock.nativeElement.children[1].children[i].classList.add('scaleInAnimation');
    }
  }

  /****** Play option VO on mouse hover ******/
  playOptionHover(opt, idx) {
    if (this.instructionVO && this.instructionVO.nativeElement.play && idx === this.index1) {
      this.instructionVO.nativeElement.pause();
      this.instructionVO.nativeElement.currentTime = 0;
      this.instructionDisable = false;
    }
    if (opt && opt.imgsrc_audio && opt.imgsrc_audio.url && idx === this.index1) {
      this.appModel.notifyUserAction();
      this.playSound(opt.imgsrc_audio, idx);
    }
  }

  playSound(soundAssets, idx) {
    if (this.audio && this.audio.paused) {
      this.audio.src = soundAssets.url;
      this.audio.load();
      this.audio.play();
      this.instructionDisable = true;
      this.placeholder.nativeElement.classList.add('disableDiv');
      this.audio.onended = () => {
        this.instructionDisable = false;
        this.placeholder.nativeElement.classList.remove('disableDiv');
      }
    }
  }

  /****** Option mouse out functionality ******/
  optionHoverOut(opt, i, j) {
    if (opt && opt != undefined) {
      this.ZoomOutAnimationoption(opt, i);
    }
  }

  /****** placeholder mouse hover functionality ******/
  placeholderHover(idx, opt) {
    if (!opt.isAnswered) {
      opt.imgsrc = opt.imgsrc_hover;
      this.placeholder.nativeElement.children[idx].style.cursor="pointer";
    }
  }

  /****** placeholder mouse leave functionality ******/
  placeholderLeave(idx, opt) {
    if (!opt.isAnswered) {
      opt.imgsrc = opt.imgsrc_original;
      this.placeholder.nativeElement.children[idx].style.cursor="";
    }
  }

  /****** mouse over on skip button ******/
  hoverSkip() {
    this.quesObj.quesSkip = this.quesObj.quesSkipHover;
  }

  /****** mouse out on skip button ******/
  houtSkip() {
    this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
  }

  /****** mouse over on play/pause button ******/
  hoverPlayPause() {
    if (this.PlayPauseFlag) {
      this.quesObj.quesPlayPause = this.quesObj.quesPauseHover;
    } else {
      this.quesObj.quesPlayPause = this.quesObj.quesPlayHover;
    }
  }

  /****** mouse out on play/pause button ******/
  leavePlayPause() {
    if (this.PlayPauseFlag) {
      this.quesObj.quesPlayPause = this.quesObj.quesPauseOriginal;
    } else {
      this.quesObj.quesPlayPause = this.quesObj.quesPlayOriginal;
    }
  }

  /****** hover over on yes button of confirmation popup ******/
  hoverConfirm() {
    this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_hover;
  }

  /****** hover out on yes button of confirmation popup ******/
  houtConfirm() {
    this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_original;
  }

  /****** hover over on no button of confirmation popup ******/
  hoverDecline() {
    this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_hover;
  }

  /****** hover out on no button of confirmation popup ******/
  houtDecline() {
    this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_original;
  }

  /****** hover over on close button of confirmation popup ******/
  hoverCloseConfirm() {
    this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_hover;
  }

  /****** hover out on close button of confirmation popup ******/
  houtCloseConfirm() {
    this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_original;
  }

  /****** hover over on close button of feedback popup ******/
  hoverClosePopup() {
    this.feedbackObj.popup_commmon_imgs.close_btn = this.feedbackObj.popup_commmon_imgs.close_btn_hover;
  }

  /****** hover out on close button of feedback popup ******/
  houtClosePopup() {
    this.feedbackObj.popup_commmon_imgs.close_btn = this.feedbackObj.popup_commmon_imgs.close_btn_original;
  }

  /****** hover over on ok button of replay confirm popup ******/
  hoverReplayConfirm() {
    this.confirmReplayAssets.confirm_btn = this.confirmReplayAssets.confirm_btn_hover;
  }

  /****** hover out on ok button of replay confirm popup ******/
  houtReplayConfirm() {
    this.confirmReplayAssets.confirm_btn = this.confirmReplayAssets.confirm_btn_original;
  }

  /****** hover over on cancel button of replay confirm popup ******/
  hoverReplayDecline() {
    this.confirmReplayAssets.decline_btn = this.confirmReplayAssets.decline_btn_hover;
  }

  /****** hover out on cancel button of replay confirm popup ******/
  houtReplayDecline() {
    this.confirmReplayAssets.decline_btn = this.confirmReplayAssets.decline_btn_original;
  }

  /****** hover over on close button of replay confirm popup ******/
  hoverReplayCloseConfirm() {
    this.confirmReplayAssets.close_btn = this.confirmReplayAssets.close_btn_hover;
  }

  /****** hover out on close button of replay confirm popup ******/
  houtReplayCloseConfirm() {
    this.confirmReplayAssets.close_btn = this.confirmReplayAssets.close_btn_original;
  }

  /****** option zoomout animation on mouse leave ******/
  ZoomOutAnimationoption(opt, i) {
    if (this.narrator.nativeElement.paused && i == this.index1) {
      this.optionsBlock.nativeElement.children[1].children[i].classList.add('scaleOutAnimation');
      this.optionsBlock.nativeElement.children[1].children[i].style.cursor = "";
      setTimeout(() => {
        this.optionsBlock.nativeElement.children[1].children[i].classList.remove('scaleInAnimation');
        this.optionsBlock.nativeElement.children[1].children[i].classList.remove('scaleOutAnimation');
      }, 500);
    }
  }

  /****** placeholder click functionality ******/
  onClickPlaceholder(opt, idx) {
    if (!this.instructionVO.nativeElement.paused) {
      this.instructionVO.nativeElement.currentTime = 0;
      this.instructionVO.nativeElement.pause();
    }
    this.clickedIndex = idx;
    this.appModel.handlePostVOActivity(true);
    this.appModel.enableReplayBtn(false);
    this.bodyContentDisable = true;
    this.instructionDisable = true;
    opt['isAnswered'] = true;
    this.startCount = 0;
    this.moveFrom = this.optionsBlock.nativeElement.children[1].children[this.index1].getBoundingClientRect();
    this.moveTo = this.placeholder.nativeElement.children[idx].getBoundingClientRect();
    this.moveleft = this.moveTo.left - this.moveFrom.left;
    this.movetop = this.moveTo.top - this.moveFrom.top;
    this.optionsBlock.nativeElement.children[1].children[this.index1].style.pointerEvents = "none";
    this.optionObj[this.index1].isOpen = false;
    this.optionObj[this.index1].leftPos = this.moveleft + "px";
    this.optionObj[this.index1].topPos = this.movetop + "px";
    this.placeholder.nativeElement.children[idx].style.pointerEvents = "none";
    if (opt.correctOptionId && opt.correctOptionId === this.optionObj[this.index1].id) {
      this.noOfRightAnsClicked++;
      this.partialCorrectArr.push(this.optionObj[this.index1].imgsrc_audio);
      this.partialCorrectArr[this.partialCorrectArr.length-1]["index"] = idx;
      this.feedbackArr[idx].imgsrc = this.optionObj[this.index1].imgsrc_right;
    } else {
      this.noOfWrongAnsClicked++;
      this.partialIncorrectArr.push(this.optionObj[this.index1].imgsrc_audio);
      this.partialIncorrectArr[this.partialIncorrectArr.length-1]["index"] = idx;
      this.feedbackArr[idx].imgsrc = this.optionObj[this.index1].imgsrc_wrong;
    }

    if (this.refcpyArray.length === 1) {
      this.rightAnsTimeout = setTimeout(() => {
        this.popupTxtRequired = this.feedbackObj.feedback_title.required;
        this.attemptType = "manual";
        this.rightanspopUpheader_img = true;
        this.showanspopUpheader_img = false;
        this.appModel.invokeTempSubject('showModal', 'manual');
        this.bodyContentOpacity = true;
        this.instructionOpacity = true;
        this.bodyContentDisable = true;
        this.instructionDisable = true;
      }, 2000);
    }
    this.appModel.notifyUserAction();
  }

  /****** animation on clicking placeholder ******/
  onAnimationEvent(event: AnimationEvent, opt, idx) {
    if (event.fromState == "open" && event.toState == "closed" && event.phaseName == "done") {
      if (this.refcpyArray.length !== 1) {
        this.bodyContentDisable = false;
        this.instructionDisable = false;
        this.appModel.handlePostVOActivity(false);
      }
      clearInterval(this.blinkTimeInterval);
      this.optionsBlock.nativeElement.children[1].children[this.index1].style.pointerEvents = "";
      this.optionsBlock.nativeElement.children[1].children[this.index1].style.display = "none";
      this.optionsBlock.nativeElement.children[1].children[this.index1].style.pointerEvents = "none";
      const movedObj = this.refcpyArray.splice(this.index, 1);
      if (this.indexArray.length >= 1) {
        let newObj = this.indexArray.shift();
        this.refcpyArray.push(newObj);
      }
      this.optionsAfterFive++;
      if (this.optionsBlock.nativeElement && this.optionsBlock.nativeElement.children[1].children[this.optionsAfterFive]) {
        this.optionsBlock.nativeElement.children[1].children[this.optionsAfterFive].style.display = "flex";
      }
      this.optionPlaceholders[this.clickedIndex].imgsrc = movedObj[0].imgsrc_original;
      this.startCount = 1;
      this.getRandomIndex(this.refcpyArray.length);

    }
  }

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

  /******Checking of existance of quesTab in content JSON *******/
  checkquesTab() {
    if (this.fetchedcontent.commonassets.ques_control != undefined) {
      this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
    } else {
      this.appModel.getJson();
    }
  }

  /****** template volume control ******/
  templatevolume(vol, obj) {
    if (obj.narrator && obj.narrator.nativeElement) {
      obj.narrator.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.mainVideo && obj.mainVideo.nativeElement) {
      obj.mainVideo.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.optionAudio && obj.optionAudio.nativeElement) {
      obj.optionAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackPopupAudio && obj.feedbackPopupAudio.nativeElement) {
      obj.feedbackPopupAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.instructionVO && obj.instructionVO.nativeElement) {
      obj.instructionVO.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.audio) {
      obj.audio.volume = obj.appModel.isMute ? 0 : vol;
    }
  }

  close() {
    this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
  }

  /****** Function to check if all images are loaded ******/
  checkImgLoaded() {
    if (!this.loadFlag) {
      this.noOfImgsLoaded++;
      if (this.noOfImgsLoaded >= this.noOfImgs) {
        this.appModel.setLoader(false);
        this.loadFlag = true;
        clearTimeout(this.loaderTimer);
        clearTimeout(this.blinkTimeInterval);
        this.startCount = 0;
        this.checkforQVO();
      }
    }
  }

  /****** Function to check if all video is loaded ******/
  checkVideoLoaded() {
    if (!this.videoReplayd) {
      this.appModel.setLoader(false);
      this.appModel.navShow = 1;
      this.isPlayVideo = true;
      this.appModel.isVideoPlayed = true;
      this.appModel.stopAllTimer();
    }
  }

  /****** event trigger on video end ******/
  endedHandler() {
    if (!this.videoReplayd) {
      this.isPlayVideo = false;
      this.appModel.navShow = 2;
      this.appModel.setLoader(true);
      this.appModel.startPreviousTimer();
    }
  }

  /****** click event on skip button ******/
  endedHandleronSkip() {
    this.startCount = 1;
    this.blinkHolder();
    this.isPlayVideo = false;
    this.appModel.navShow = 2;
    this.appModel.startPreviousTimer();
    this.appModel.videoStraming(false);
    this.appModel.notifyUserAction();
  }

  /****** click event on play/pause button ******/
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

  /****** check if instruction VO is loaded and question functionality starts on instruction VO over ******/
  checkforQVO() {
    if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
      this.narrator.nativeElement.src = this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
      this.appModel.handlePostVOActivity(true);
      this.bodyContentDisable = true;
      this.instructionDisable = true;
      this.appModel.enableReplayBtn(false);
      this.narrator.nativeElement.play();
      this.narrator.nativeElement.onended = () => {
        this.bodyContentDisable = false;
        this.instructionDisable = false;
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

  /****** start activity on Instruction VO over ******/
  startActivity() {
    this.startCount = 1;
    this.getRandomIndex(this.refcpyArray.length);
  }

  /****** get Random index for options ******/
  getRandomIndex(no) {
    this.index = Math.floor(Math.random() * no);
    if (this.refcpyArray.length > 0) {
      let id = this.refcpyArray[this.index].id;
      for (let i = 0; i < this.optionObj.length; i++) {
        if (id == this.optionObj[i].id) {
          this.index1 = i;
          break;
        }
      }
      this.blinkHolder();
    }
  }

  /****** option blinking functionality ******/
  blinkHolder() {
    this.blinkFlag = true;
    this.blinkTimeInterval = setInterval(() => {
      if (this.startCount == 1) {
        this.blinkHolderImg(this.index1);
      } else {
        clearInterval(this.blinkTimeInterval);
        for (let i = 0; i < this.optionsBlock.nativeElement.children.length; i++) {
          if (this.optionObj[i] && this.optionObj[i].imgsrc_original) {
            this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_original;
          }
        }
      }
    }, 500);
  }

  blinkHolderImg(i) {
    if (this.optionObj[i] && this.optionObj[i].imgsrc_blink) {
      if (this.blinkFlag) {
        this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_blink;
        this.blinkFlag = false;
      } else {
        this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_original;
        this.blinkFlag = true;
      }
    }
    else {
      ++this.index1;
      if (this.optionObj.length == this.index1) {
        this.index1 = 0;

      }
    }
  }

  /****** Set data coming from JSON ******/
  setData() {
    if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
      this.commonAssets = this.fetchedcontent.commonassets;
      this.noOfImgs = this.commonAssets.imgCount;
      this.isLastQues = this.appModel.isLastSection;
      this.isLastQuesAct = this.appModel.isLastSectionInCollection;
      if (this.isLastQuesAct || this.isLastQues) {
        this.appModel.setlastQuesNT();
      }
      this.optionObj = this.fetchedcontent.refOptionObj.options;
      for (let i = 0; i < this.optionObj.length; i++) {
        if (this.optionObj[i] && this.optionObj[i].imgsrc_original) {
          this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_original;
        }
      }
      let numberOfOptions = this.optionObj.length >= 5 ? 5 : this.optionObj.length;
      for (let x = 0; x < numberOfOptions; x++) {
        this.refcpyArray.push(this.optionObj[x]);
      }
      for (let x = 5; x < this.optionObj.length; x++) {
        this.indexArray.push(this.optionObj[x]);
      }
      for (let i = 0; i < this.optionObj.length; i++) {
        this.optionObj[i].isOpen = true;
      }
      this.feedbackObj = this.fetchedcontent.feedback;
      this.confirmPopupAssets = this.fetchedcontent.feedback.confirm_popup;
      let refQuesObj = this.fetchedcontent.refQuesObj;
      if (refQuesObj.criteriaHeaders.length === 4 && refQuesObj.headers.length === 3) {
        this.parentMatrixClass = "matrix_5x3";
      } else if (refQuesObj.criteriaHeaders.length === 4 && refQuesObj.headers.length === 5) {
        this.parentMatrixClass = "matrix_5x5";
      } else if (refQuesObj.criteriaHeaders.length === 2 && refQuesObj.headers.length === 3) {
        this.parentMatrixClass = "matrix_3x3";
      } else if (refQuesObj.criteriaHeaders.length === 2 && refQuesObj.headers.length === 5) {
        this.parentMatrixClass = "matrix_3x5";
      } else if (refQuesObj.criteriaHeaders.length === 3 && refQuesObj.headers.length === 4) {
        this.parentMatrixClass = "matrix_4x4";
      }
      this.quesObj = this.fetchedcontent.quesObj;
      this.optionPlaceholders = JSON.parse(JSON.stringify(this.fetchedcontent.refQuesObj.optionPlaceHolders));
      this.showAnswerFeedbackArr = JSON.parse(JSON.stringify(this.fetchedcontent.refQuesObj.optionPlaceHolders));
      this.feedbackArr = JSON.parse(JSON.stringify(this.fetchedcontent.refQuesObj.optionPlaceHolders));
      this.confirmReplayAssets = this.feedbackObj.replay_confirm;
      this.showAnswerFeedbackArr.map(placeholderObj => {
        if (placeholderObj.correctOptionId) {
          placeholderObj.imgsrc = this.optionObj[placeholderObj.correctOptionId - 1].imgsrc_right;
        }
      })
      if (this.quesObj.quesVideo && this.quesObj.quesVideo.autoPlay && !this.appModel.isVideoPlayed) {
        this.isPlayVideo = true;
      } else {
        this.isPlayVideo = false;
      }
    }
  }

  /****** get Base path for assets ******/
  getBasePath() {
    if (this.appModel && this.appModel.content) {
      return this.appModel.content.id + '';
    }
  }

  /****** set partial feedback individual options VO ******/
  setPartialFeedbackAudio(num, voType) {
    if (voType === "partialCorrectVO" && this.partialCorrectArr[num].url) {
      let no = num;
      this.feedbackPopupAudio.nativeElement.src = this.partialCorrectArr[num].url;
      this.feedbackPopupAudio.nativeElement.play();
      this.feedbackPopupAudio.nativeElement.onended = () => {
        no++;
        if (no >= this.partialCorrectArr.length) {
          this.setPartialFeedbackAudio(0, "partialIncorrectVO");
        } else {
          this.setPartialFeedbackAudio(no, "partialCorrectVO");
        }
      }
    } else {
      let no = num;
      if (this.partialIncorrectArr[num].url) {
        this.feedbackPopupAudio.nativeElement.src = this.partialIncorrectArr[num].url;
        this.feedbackPopupAudio.nativeElement.play();
        this.feedbackPopupAudio.nativeElement.onended = () => {
          no++;
          if (no === this.partialIncorrectArr.length) {
            this.startCount = 0;
            this.showAnssetTimeout = setTimeout(() => {
              if (!this.manualClickedonCrossbtn) {
                this.closeModal();
              }
            }, this.showAnsTimeout);
            this.appModel.notifyUserAction();
          }
          else {
            this.setPartialFeedbackAudio(no, "partialIncorrectVO");
          }
        }
      }
    }
  }

  /****** setting feedback ******/
  setFeedback() {
    let playGeneralizedOptVO = true;
    if (this.isShow) {   //Show answer feedback
      this.feedbackAudio = this.feedbackObj.right_ans_popup.showAnsfeedback_audio;
      this.feedbackObj.style_header = this.feedbackObj.right_style_header;
      this.feedbackObj.style_body = this.feedbackObj.right_style_body;
      this.feedbackObj.feedback_title = this.feedbackObj.showAnswer_style_title;
    } else if (this.noOfRightAnsClicked > 0 && this.noOfWrongAnsClicked == 0) {   //100% right answer feedback
      this.feedbackAudio = this.feedbackObj.right_ans_popup.rightfeedback_audio;
      this.feedbackObj.style_header = this.feedbackObj.right_style_header;
      this.feedbackObj.style_body = this.feedbackObj.right_style_body;
      this.feedbackObj.feedback_title = this.feedbackObj.right_style_title;
    } else if (this.noOfRightAnsClicked > 0 && this.noOfWrongAnsClicked > 0) {   // partial correct answer feedback
      if (this.optionObj[0].imgsrc_audio && this.optionObj[0].imgsrc_audio.url) {
        playGeneralizedOptVO = false;
        this.partialCorrectArr.sort((a, b) => (a.index < b.index ? -1 : 1));
        this.partialIncorrectArr.sort((a, b) => (a.index < b.index ? -1 : 1));
        this.partialCorrectArr.push(this.feedbackObj.correctVO_placeholder);
        this.partialIncorrectArr.push(this.feedbackObj.incorrectVO_placeholder);
        this.setPartialFeedbackAudio(0, "partialCorrectVO");
      } else {
        this.feedbackAudio = this.feedbackObj.partial_correct_popup;
      }
      this.feedbackObj.style_header = this.feedbackObj.partial_style_header;
      this.feedbackObj.style_body = this.feedbackObj.partial_style_body;
      this.feedbackObj.feedback_title = this.feedbackObj.partial_style_title;
      this.appModel.feedbackType = "partialIncorrect";
    } else if (this.noOfRightAnsClicked === 0 && this.noOfWrongAnsClicked > 0) {   // 100% wrong answer feedback
      this.feedbackAudio = this.feedbackObj.wrong_ans_popup;
      this.feedbackObj.style_header = this.feedbackObj.wrong_style_header;
      this.feedbackObj.style_body = this.feedbackObj.wrong_style_body;
      this.feedbackObj.feedback_title = this.feedbackObj.wrong_style_title;
      this.appModel.feedbackType = "fullyIncorrect";
    }
    if(playGeneralizedOptVO) {
      this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
      this.feedbackPopupAudio.nativeElement.play();

      this.feedbackPopupAudio.nativeElement.onended = () => {
        this.startCount = 0;
        this.showAnssetTimeout = setTimeout(() => {
          if (!this.manualClickedonCrossbtn) {
            this.closeModal();
          }
        }, this.showAnsTimeout);
        this.appModel.notifyUserAction();
      }
    }
  }

  /****** Reset all values on wrong attempt ******/
  resetAttempt() {
    this.optionPlaceholders = JSON.parse(JSON.stringify(this.fetchedcontent.refQuesObj.optionPlaceHolders));
    this.feedbackArr = JSON.parse(JSON.stringify(this.fetchedcontent.refQuesObj.optionPlaceHolders));

    for (let i = 0; i < this.optionObj.length; i++) {
      if (this.optionObj[i] && this.optionObj[i].imgsrc_original) {
        this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_original;
      }
    }
    let numberOfOptions = this.optionObj.length >= 5 ? 5 : this.optionObj.length;
    for (let x = 0; x < numberOfOptions; x++) {
      this.refcpyArray.push(this.optionObj[x]);
    }
    for (let x = 5; x < this.optionObj.length; x++) {
      this.indexArray.push(this.optionObj[x]);
    }
    this.appModel.enableReplayBtn(true);
    this.noOfRightAnsClicked = 0;
    this.noOfWrongAnsClicked = 0;
    this.partialCorrectArr = [];
    this.partialIncorrectArr = [];
    this.optionsAfterFive = 4;
    this.manualClickedonCrossbtn = false;
    this.bodyContentDisable = false;
    this.instructionDisable = false;
    this.appModel.handlePostVOActivity(false);
    clearInterval(this.blinkTimeInterval);
    this.startCount = 1;
    for (let x = 0; x < this.optionsBlock.nativeElement.children[1].children.length; x++) {
      this.optionsBlock.nativeElement.children[1].children[x].style.left = 0;
      this.optionsBlock.nativeElement.children[1].children[x].style.top = 0;
      this.optionsBlock.nativeElement.children[1].children[x].style.pointerEvents = "";
      this.optionsBlock.nativeElement.children[1].children[x].style.display = this.optionObj[x].style_display.display;
    }
    this.optionObj.forEach(option => {
      option.isOpen = true;
    })
    this.getRandomIndex(this.refcpyArray.length);
  }

  /****** Event on yes or no click of show answer or replay video confirmation popup ******/
  sendFeedback(flag: string, action?: string) {
    this.displayReplayPopup = false;
    this.displayconfirmPopup = false;
    // ref.classList = "modal";
    this.placeholder.nativeElement.classList.remove('disableDiv');
    if (action == "replay") {
      this.quesSkip = true;
      this.instructionDisable = false;
      this.confirmReplayAssets.confirm_btn = this.confirmReplayAssets.confirm_btn_original;
      this.replayVideo();
    } else if (action == "cancelReplay") {
      if(!this.bodyContentDisable) {
        this.appModel.videoStraming(false);
        this.appModel.enableReplayBtn(true);
        this.instructionDisable = false;
        this.startCount = 1;
        this.blinkHolder();
      }
      setTimeout(() => {
      }, 1000);

    } else if (flag == "yes") {
      this.manualClickedonCrossbtn = false;
      this.isShow = true;
      this.noOfRightAnsClicked = 0;
      this.noOfWrongAnsClicked = 0;
      this.partialIncorrectArr = [];
      this.partialCorrectArr = [];

      this.showAnssetTimeout = setTimeout(() => {
        this.feedbackArr = this.showAnswerFeedbackArr;
        this.popupTxtRequired = this.feedbackObj.showAnswer_style_title.required;
        this.attemptType = "auto";
        this.rightanspopUpheader_img = false;
        this.showanspopUpheader_img = true;
        this.appModel.invokeTempSubject('showModal', 'manual');
        this.appModel.resetBlinkingTimer();
      }, 100);
      this.instructionDisable = true;
      this.bodyContentOpacity = true;
      this.instructionOpacity = true;
    } else {
      this.appModel.notifyUserAction();
      if(!this.bodyContentDisable) {
        this.startCount = 1;
        this.blinkHolder();
        this.instructionDisable = false;
      }
    }
  }

  /******Popup close functionality *******/
  closeModal() {
    this.isShow = false;
    clearTimeout(this.showAnssetTimeout);
    this.manualClickedonCrossbtn = true;
    if (this.feedbackPopupAudio && !this.feedbackPopupAudio.nativeElement.paused) {
      this.feedbackPopupAudio.nativeElement.pause();
      this.feedbackPopupAudio.nativeElement.currentTime = 0;
    }
    this.startCount = 0;

    this.displaymainPopup = false;

    this.appModel.notifyUserAction();
    if (this.noOfWrongAnsClicked > 0) {
      this.instructionOpacity = false;
      this.bodyContentOpacity = false;
      this.appModel.wrongAttemptAnimation();
    } else {
      this.instructionDisable = true;
      this.instructionOpacity = true;
      this.bodyContentOpacity = true;
      this.bodyContentDisable = true;
      this.appModel.enableReplayBtn(false);
      this.appModel.handlePostVOActivity(false);
      this.blinkOnLastQues();
    }
    // setTimeout(() => {
    //   this.instructionDisable = false;
    // }, 1000);
  }

  /****** Replay video functionality *******/
  replayVideo() {
    this.videoReplayd = true;
    this.isPlayVideo = true;
    this.appModel.stopAllTimer();
    setTimeout(() => {
      this.mainVideo.nativeElement.play();
      this.mainVideo.nativeElement.onended = () => {
        this.isPlayVideo = false;
        this.startCount = 1;
        this.blinkHolder();
        this.appModel.startPreviousTimer();
        this.appModel.videoStraming(false);
        this.appModel.notifyUserAction();
        setTimeout(() => {
        }, 1000);
      }
    }, 500)
  }
}
