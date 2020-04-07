import { Component, OnInit, HostListener, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ApplicationmodelService } from '../model/applicationmodel.service';
import { Subject, Observable, Subscription } from 'rxjs';
import { timer } from 'rxjs/observable/timer';
import { defer } from 'rxjs/observable/defer';
import { interval } from 'rxjs/observable/interval';

import Keyboard from "simple-keyboard";
import hindiLayout from "simple-keyboard-layouts/build/layouts/hindi";
import englishLayout from "simple-keyboard-layouts/build/layouts/english";
import { PlayerConstants } from '../common/playerconstants';

import 'jquery';
import { InactivityTimerComponent } from './inactivity-timer-component';
import { retry } from 'rxjs/operators/retry';


declare var $: any;




@Component({
  selector: 'ntemp17',
  encapsulation: ViewEncapsulation.None,
  templateUrl: '../view/layout/Ntemplate17.component.html',
  styleUrls: ['../view/css/Ntemplate17.component.css', '../view/css/bootstrap.min.css', "../../../node_modules/simple-keyboard/build/css/index.css",],

})

export class Ntemplate17 implements OnInit {
  private appModel: ApplicationmodelService;
  constructor(appModel: ApplicationmodelService, public _InactivityTimerComponent: InactivityTimerComponent) {
    this.appModel = appModel;
    this.assetsPath = this.appModel.assetsfolderpath;
    this.appModel.navShow = 1;
    this.appModel.setLoader(true);
    this.nextQuestionTimerForLastQuestioninSec = _InactivityTimerComponent.moveNextQuesTimer;

    // if error occured during image loading loader wil stop after 5 seconds 
    this.loaderTimer = setTimeout(() => {
      this.appModel.setLoader(false);
      // this.checkforQVO();
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

  @ViewChild("optionsBlock") optionsBlock: any;
  @ViewChild('narrator') narrator: any;
  @ViewChild('instruction') instruction: any;
  @ViewChild('confirmModalRef') confirmModalRef: any;
  @ViewChild('submitModalRef') submitModalRef: any;
  @ViewChild('popupRef') popupRef: any;
  @ViewChild('confirmReplayRef') confirmReplayRef: any;
  @ViewChild('mainVideo') mainVideo: any;
  @ViewChild('feedbackInfoAudio') feedbackInfoAudio: any;
  @ViewChild('quesContainer') quesContainer: any;
  @ViewChild('testContainer') testContainer: any;
  @ViewChild('wordBlockRef') wordBlockRef: any;
  @ViewChild('optionPlaceRef') optionPlaceRef: any;
  @ViewChild('selectedRightListRef') selectedRightListRef: any;
  @ViewChild('selectedOptionRef') selectedOptionRef: any;
  @ViewChild('selectedWrongListRef') selectedWrongListRef: any;
  @ViewChild('feedbackModal') feedbackModal: any;
  @ViewChild('addBtnRef') addBtnRef: any;
  @ViewChild('inputDivRef') inputDivRef: any;
  @ViewChild('simpleKeyboardRef') simpleKeyboardRef: any;
  @ViewChild('quesVORef') quesVORef: any;
  @ViewChild('instructionBar') instructionBar: any;
  @ViewChild('mathKeyboardRef') mathKeyboardRef: any;
  @ViewChild('modalfeedback17') modalfeedback17: any;
  @ViewChild('bodyContent') bodyContent: any;
  @ViewChild('row1') Row1: any;
  @ViewChild('row2') Row2: any;
  @ViewChild('row3') Row3: any;
  @ViewChild('btmRow') BtmRow: any;
  @ViewChild('numPad') NumPad: any;
  @ViewChild('feedbackPopupAudio') feedbackPopupAudio: any;
  @ViewChild('infoModalRef') InfoModalRef: any;
  @ViewChild('questionVideo') QuestionVideo: any;
  @ViewChild('questionAudio') QuestionAudio: any;






  @HostListener('document:click', ['$event'])
  clickout(event) {
    let openFlag: boolean = false;
    if (!this.keyBoardVersion) {
      if (((!this.inputDivRef.nativeElement.contains(event.target))) && ((!this.simpleKeyboardRef.nativeElement.contains(event.target)))) {
        if (this.keyboard) {
          //this.keyboard.destroy();
        }
      }

      if (!(this.mathKeyboardRef && this.mathKeyboardRef.nativeElement.contains(event.target)) && !(this.inputDivRef.nativeElement.contains(event.target))) {
        // this.mathKeyboardRef.nativeElement.classList = "simple-keyboard hg-theme-default hg-layout-default hideKeyboard";
      }
    }

  }

  audio = new Audio();
  blink: boolean = false;
  commonAssets: any = "";
  feedback: any = "";
  narratorAudio: any;
  isQuesTypeImage: boolean = false;
  isQuesTypeVideo: boolean = false;
  isFirstQues: boolean;
  isLastQues: boolean = false;
  isLastQuesAct: boolean;

  noOfImgs: number;
  noOfImgsLoaded: number = 0;
  loaderTimer: any;
  containgFolderPath: string = "";
  assetsPath: string = "";
  loadFlag: boolean = false;
  feedbackObj: any;
  confirmPopupAssets: any;
  submitPopupAssets: any;
  replayconfirmAssets: any;
  tempSubscription: Subscription;
  quesObj: any;
  isPlayVideo: boolean = true;
  videoReplayd: boolean = false;
  addBtn: any;
  refBase: any;
  layout;
  wordBox: any;
  wordArr: any = [];
  inputVal: string = "";
  testAssts: any;
  noAttempts: number = 0;
  stringArr: any = [];
  feedbackTimer: any;


  value = "";
  keyboard: Keyboard;
  selectedIdx: number = -1;
  currentRightListIdx: number = 0;
  currentWrongListIdx: number = 0;
  selectedOptionArr: any = [];
  rightListArr: any = [];
  wrongListArr: any = [];
  videoStartTimer: any;
  btnPressed: number = 0;
  prevEntry: string = "";
  maxLength: number = 12;
  btnSelected: string = "";
  blinkFlag: boolean = false;
  blinkTimer: any;
  keyBoard1: any;
  rowIndex1: any;
  rowIndex2: any;
  rowIndex3: any;
  btmRowIndex: any;
  numPadIndex: any;
  hindiKeyboardArray: any = [];
  matraBtnOn: boolean = false;
  currentMatraNumber: any;
  matraRepeatArr: any = [];
  matraCounter: number = 0;
  keyBoardVersion: boolean;
  maxCharacter: number = 12;
  CharacterCounter: number = 0;
  PlayPauseFlag: boolean = true;
  attemptType: string = "";
  inputFieldText: string = "";
  feedbackAudio: any;
  playMyVideo: boolean;
  infoPopupAssets: any;
  _questionAreaImage: any;
  _questionAreaImageFlag: boolean = false;
  _questionAreaVideo: any;
  _questionAreaVideoFlag: boolean = false;
  _questionAreaText: any;
  _questionAreaTextFlag: boolean = false;
  _questionAreaAudio: any;
  _questionAreaAudioFlag: boolean = false;
  _setQuestionAudio: any;
  infoModal: boolean = true;
  nextQuestionTimerForLastQuestioninSec: any;
  nextQuestionTimerForLastQuestioninMiliSec: any;
  nextQuestionTimeronLast: any;
  btnCounting: number = 0;
  _addWordFlag: boolean = false;
  _playInstructionFlag:boolean = false;



  ngAfterViewInit() {
  }

  onChange = (input: string) => {
    console.log("Input changed", input);
    this.inputVal = input;
    this.addBtnRef.nativeElement.style.opacity = "1";

  };

  checkMaxLength() {
    if (this.inputVal.length == 12 || this.inputVal.length > 12) {
      this.inputVal = this.inputVal.substr(0, 12);
      this.inputDivRef.nativeElement.children[0].value = this.inputVal;
    }
  }

  onKeyPress = (button: string) => {
    console.log("Button pressed", button);
    this.stopInstructionVO();

    if (button === "{tab}" || button === "{space}" || button === "{enter}" || button === ".com") {
      return;
    }
    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === "{shift}" || button === "{lock}") {
      this.handleShift();
    } else if (button === "{bksp}") {
      this.btnSelected = "{bksp}";
      if (this.quesObj.lang == 'eng') {
        if (this.btnCounting > 0) {
          this.btnCounting -= 1;
          this.inputVal = this.inputVal.substring(0, this.inputVal.length - 1);
        }


        //this.btnCounting-=1;
      }


    } else if (this.btnCounting < this.maxCharacter) {
      this.inputVal += button;
      this.btnCounting += 1;
      this.addBtnRef.nativeElement.style.opacity = "1";
    }
    else {

    }
  };

  onInputChange = (event: any) => {
    /* console.log(event);
     if(this.btnPressed<12){
       this.keyboard.setInput(event.target.value);
     }*/
  };

  /*test() {
    if (this.inputVal.length > this.prevEntry.length && (this.btnPressed == 11 || this.btnPressed < 11)) {
      this.stringArr.push(this.inputVal.length - this.prevEntry.length);
      this.prevEntry = this.inputVal;
      this.btnPressed++;
      console.log("normal case");
    } else if (this.btnPressed > 12 && this.btnSelected != "{bksp}") {
      let copy = JSON.parse(JSON.stringify(this.prevEntry));
      this.inputVal = "";
      this.inputVal = copy;
      console.log("more than 12 case");
      // this.keyboard.setInput(copy);
      this.inputDivRef.nativeElement.children[0].value = copy;
    } else if (this.btnSelected == "{bksp}" && this.inputVal.length < this.prevEntry.length && (this.prevEntry.length - this.inputVal.length == this.stringArr[this.stringArr.length - 1])) {
      this.stringArr.splice(this.stringArr.length - 1, 1);
      this.prevEntry = this.inputVal;
      this.btnPressed--;
      this.btnSelected = "";
      console.log("backspace");
    } else if (this.btnSelected != "{bksp}" && this.btnPressed == 12) {
      this.btnPressed++;
      console.log("added 12 plus");
    }
  }*/

  handleShift = () => {
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    this.keyboard.setOptions({
      layoutName: shiftToggle
    });
  };

  playHoverInstruction() {
    if (!this.instruction.nativeElement.paused!) {
      console.log("narrator/instruction voice still playing");
    } else {
      console.log("play on Instruction");
      if (this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.play();
        this._playInstructionFlag = true;
        $(".instructionBase img").css("cursor", "pointer");
      }
    }
  }

  ngAfterViewChecked() {
    this.templatevolume(this.appModel.volumeValue, this);
    if (this.inputVal == "") {
      this.addBtnRef.nativeElement.style.opacity = "0.5";
    }
  }

  blinkOnLastQues() {
    this.appModel.eventFired();
    this.appModel.event = { 'action': 'segmentEnds' };
    if (this.InfoModalRef != undefined) {
      // this.appModel.moveNextQues();
      this.InfoModalRef.nativeElement.classList = "displayPopup modal";


      if (this.quesObj.lang != 'math') {
        this.appModel.moveNextQues();
      }
      console.log("==BlinkOnLastQuestion==");
      this.nextQuestionTimerForLastQuestioninMiliSec = (this.nextQuestionTimerForLastQuestioninSec * 60) * 1000;
      this.nextQuestionTimeronLast = setTimeout(() => {
        if (this.quesObj.lang == 'math') {
          this.disableScreen();
          this.InfoModalRef.nativeElement.classList = "modal";
          console.log("inMiliSecond = " + this.nextQuestionTimerForLastQuestioninMiliSec);
        }
      }, this.nextQuestionTimerForLastQuestioninMiliSec)


      /*if (this.appModel.isLastSectionInCollection) {
  // this.appModel.blinkForLastQues();
  //this.appModel.stopAllTimer();
  if (!this.appModel.eventDone) {
    if (this.isLastQuesAct) {
      this.appModel.eventFired();
      this.appModel.event = { 'action': 'segmentEnds' };
      if (this.InfoModalRef != undefined) {
       // this.appModel.moveNextQues();
        this.InfoModalRef.nativeElement.classList = "displayPopup modal";
        
      }

    }
    if (this.isLastQues) {
      this.appModel.event = { 'action': 'end' };
    }
  }
} else {
  if (this.InfoModalRef != undefined) {
    this.InfoModalRef.nativeElement.classList = "displayPopup modal";
  }
  this.appModel.moveNextQues();
  console.log("==BlinkOnLastQuestion==");
}*/
    }
  }


  ngOnInit() {
    this.attemptType = "auto";
    this.appModel.notifyUserAction();
    this.addBtnRef.nativeElement.style.opacity = "0.5";
    this.appModel.functionone(this.templatevolume, this);//start end
    if (this.appModel.isNewCollection) {
      this.appModel.event = { 'action': 'segmentBegins' };
    }
    this.containgFolderPath = this.getBasePath();

    this.setData();
    this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
      if (mode == "manual") {
        //show modal for manual
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          $("#instructionBar").addClass("disable_div");
          this.popupRef.nativeElement.classList = "displayPopup modal";
          // this.setFeedbackAudio();
        }
      } else if (mode == "auto") {

        //show modal of auto
        // this.appModel.notifyUserAction();
        // this.appModel.notifyUserAction();
        this.appModel.notifyUserAction();
        this.blinkOnLastQues();
        //this.InfoModalRef.nativeElement.classList = "displayPopup modal";
        // this.appModel.moveNextQues();
        if (this.popupRef && this.popupRef.nativeElement) {
          $("#instructionBar").addClass("disable_div");
          this.popupRef.nativeElement.classList = "displayPopup modal";
          //this.appModel.enableReplayBtn(true);
          //this.setFeedbackAudio();
        }
      }
    })


    this.appModel.getConfirmationPopup().subscribe((action) => {
      this.appModel.notifyUserAction();
      if (action == "uttarDikhayein") {
        if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
          $("#instructionBar").addClass("disable_div");
          this.confirmModalRef.nativeElement.classList = "displayPopup modal";
        }
      }
      if (action == "submitAnswer") {
        this.stopInstructionVO();
        this.submitModalRef.nativeElement.classList = "displayPopup modal";
      }
      if (action == "replayVideo") {
        this.appModel.videoStraming(true);
        if (this.confirmReplayRef && this.confirmReplayRef.nativeElement) {
          this.instructionBar.nativeElement.classList = "instructionBase";
          this.stopInstructionVO();
          this.confirmReplayRef.nativeElement.classList = "displayPopup modal";
          this.PlayPauseFlag = true;
          this.quesObj.quesPlayPause = this.quesObj.quesPause;
          this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
        }
      }
    })

    this.appModel.questionEvent.subscribe(() => {

    });

    this.appModel.nextBtnEvent().subscribe(() => {
      if (this.appModel.isLastSectionInCollection) {
        this.appModel.event = { 'action': 'segmentEnds' };
        //this.InfoModalRef.nativeElement.classList = "displayPopup modal";
      }
      if (this.appModel.isLastSection) {
        this.appModel.event = { 'action': 'end' };
      }
    })

    this.inputDivRef.nativeElement.children[0].onkeydown = (event) => {
      var key = event.keyCode || event.charCode;
      if (key == 8 || key == 46) {
        this.btnSelected = "{bksp}";
      }

      setTimeout(() => {
        if (this.quesObj.lang == 'hindi') {
          // this.test();
        }
      }, 200)
    }
  }

  ngOnDestroy() {
    if (this.mainVideo && this.mainVideo.nativeElement && !this.mainVideo.nativeElement.paused) {
      this.mainVideo.nativeElement.pause();
      this.mainVideo.nativeElement.currentTime = 0;
      clearTimeout(this.videoStartTimer);
    }
    clearInterval(this.blinkTimer);
    clearInterval(this.feedbackTimer);
    this.inputDivRef.nativeElement.children[0].style.border = "2px solid black";
  }




  templatevolume(vol, obj) {
    if (obj.mainVideo && obj.mainVideo.nativeElement) {
      obj.mainVideo.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.instruction && obj.instruction.nativeElement) {
      obj.instruction.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.quesVORef && obj.quesVORef.nativeElement) {
      obj.quesVORef.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
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
        this.appModel.handlePostVOActivity(true);
        // this.appModel.enableReplayBtn(this.playMyVideo);
        this.inputDivRef.nativeElement.classList = "inputDiv disablePointer";
        this.instructionBar.nativeElement.classList = "instructionBase disablePointer";
        // this.videoStartTimer = setTimeout(() => {
        this.mainVideo.nativeElement.play();
       // this.appModel.enableSubmitBtn(false);
        this.mainVideo.nativeElement.onended = () => {
          this.isQuesTypeVideo = false;
          setTimeout(() => {
            this.isPlayVideo = false;
            if (this.quesObj.quesInstruction && this.quesObj.quesInstruction.autoPlay) {
              this.quesVORef.nativeElement.src = this.quesObj.quesInstruction.location == "content" ? this.containgFolderPath + "/" + this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.quesObj.quesInstruction.url + "? someRandomSeed=" + Math.random().toString(36);
              this.QuestionLoaded();
            } else {
              this.appModel.handlePostVOActivity(true);
              // this.appModel.enableReplayBtn(true);
              this.inputDivRef.nativeElement.classList = "inputDiv";
              this.instructionBar.nativeElement.classList = "instructionBase";
              if (this.QuestionVideo != undefined && this._playInstructionFlag == false && this._questionAreaVideoFlag == true && this.videoReplayd == false) {
                this.inputDivRef.nativeElement.classList = "inputDiv disablePointer";
                this.QuestionVideo.nativeElement.play();
                this.alldisabledwhilequestionVideoPlay();
                this.QuestionVideo.nativeElement.onended = () => {
                  this.blinkTextBox();
                  this.inputDivRef.nativeElement.classList = "inputDiv";
                  this.allEnabledwhilequestionVideoPlay();
                }
              }
              if (this._questionAreaVideoFlag != true) {
                this.blinkTextBox();
              }
            }
            //this.startActivity();
          }, 200)
        }
        // }, 500);
      }
    }
  }

  setData() {
    if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
      let fetchedData: any = this.appModel.content.contentData.data;
      console.log(fetchedData);
      this.feedback = fetchedData.feedback;
      this.commonAssets = fetchedData.commonassets;
      this.narratorAudio = fetchedData.commonassets.narrator;
      this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
      this.noOfImgs = this.commonAssets.imgCount;
      this.isFirstQues = this.commonAssets.isFirstQues;
      this.isLastQues = this.appModel.isLastSection;
      this.isLastQuesAct = this.appModel.isLastSectionInCollection;
      if (this.isLastQuesAct || this.isLastQues) {
        this.appModel.setlastQuesNT();
      }
      this.feedbackObj = fetchedData.feedback;
      this.confirmPopupAssets = fetchedData.feedback;
      this.submitPopupAssets = fetchedData.submit_popup;
      this.replayconfirmAssets = fetchedData.replay_confirm;
      this.quesObj = fetchedData.quesObj;
      this.addBtn = fetchedData.other_assets.addBtn;
      this.refBase = fetchedData.other_assets.ref_base;
      this.wordBox = fetchedData.other_assets.word_box;
      this.testAssts = fetchedData.test_assets;
      this.inputFieldText = this.commonAssets.inputFieldText.info;
      this.playMyVideo = this.quesObj.quesVideo.PlayVideo;
      this.infoPopupAssets = fetchedData.info_popup;
      this._questionAreaImage = this.commonAssets.questionArea[0].image;
      this._questionAreaVideo = this.commonAssets.questionArea[0].video;
      this._questionAreaText = this.commonAssets.questionArea[0].text.txt;
      this._questionAreaAudio = this.commonAssets.questionArea[0].audio;

      this._questionAreaVideoFlag = this.commonAssets.questionArea[0].video.flag;
      this._questionAreaImageFlag = this.commonAssets.questionArea[0].image.flag;
      this._questionAreaTextFlag = this.commonAssets.questionArea[0].text.flag;
      this._questionAreaAudioFlag = this.commonAssets.questionArea[0].audio.flag;

      // alert(this._questionAreaFlag);
      if (this.quesObj.lang == "hindi") {
        this.layout = hindiLayout;
        this.keyBoard1 = fetchedData.Keyboard;
        this.rowIndex1 = fetchedData.Keyboard[0].row1;
        this.rowIndex2 = fetchedData.Keyboard[0].row2;
        this.rowIndex3 = fetchedData.Keyboard[0].row3;
        this.btmRowIndex = fetchedData.Keyboard[0].btmRow;
        this.numPadIndex = fetchedData.Keyboard[0].numPadArray;
        this.inputDivRef.nativeElement.children[0].classList.add("inputHindiDiv");
        this.inputDivRef.nativeElement.children[0].classList.remove("nonHindiInput");
      } else if (this.quesObj.lang == "eng") {
        this.layout = englishLayout;
        this.inputDivRef.nativeElement.children[0].classList.add("nonHindiInput");
        this.inputDivRef.nativeElement.children[0].classList.remove("inputHindiDiv");
      } else if (this.quesObj.lang == "math") {
        this.layout = "mathLayout";
        this.inputDivRef.nativeElement.children[0].classList.add("nonHindiInput");
        this.inputDivRef.nativeElement.children[0].classList.remove("inputHindiDiv");
      }

    }

    for (let i = 0; i < 12; i++) {
      this.rightListArr.push("");
      this.wrongListArr.push("");
    }
    this.selectedOptionArr.push("");
    if (this.QuestionVideo != undefined) {
      this.QuestionVideo.nativeElement.pause();
      this.QuestionVideo.nativeElement.currentTime = 0;
    }
    this.appModel.enableReplayBtn(false);
    this.appModel.enableSubmitBtn(false);
  }

  getBasePath() {
    if (this.appModel && this.appModel.content) {
      return this.appModel.content.id + '';
    }
  }
  hoverConfirm() {
    this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_hover;
  }

  houtConfirm() {
    this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_original;
  }

  hoveronSubmitConfirm() {
    this.submitPopupAssets.confirm_btn = this.submitPopupAssets.confirm_btn_hover;
  }

  houtonSubmitConfirm() {
    this.submitPopupAssets.confirm_btn = this.submitPopupAssets.confirm_btn_original;
  }

  hoveronReplayConfirm() {
    this.replayconfirmAssets.confirm_btn = this.replayconfirmAssets.confirm_btn_hover;
  }

  houtonReplayConfirm() {
    this.replayconfirmAssets.confirm_btn = this.replayconfirmAssets.confirm_btn_original;
  }

  hoverDecline() {
    this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_hover;
  }

  houtDecline() {
    this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_original;
  }

  hoveronSubmitDecline() {
    this.submitPopupAssets.decline_btn = this.submitPopupAssets.decline_btn_hover;
  }

  houtonSubmitDecline() {
    this.submitPopupAssets.decline_btn = this.submitPopupAssets.decline_btn_original;
  }

  hoveronReplayDecline() {
    this.replayconfirmAssets.decline_btn = this.replayconfirmAssets.decline_btn_hover;
  }

  houtonReplayDecline() {
    this.replayconfirmAssets.decline_btn = this.replayconfirmAssets.decline_btn_original;
  }

  hoverCloseConfirm() {
    this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_hover;
  }
  houtCloseConfirm() {
    this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_original;
  }

  hoverClosePopup() {
    this.feedbackObj.close_btn = this.feedbackObj.close_btn_hover;
  }

  houtClosePopup() {
    this.feedbackObj.close_btn = this.feedbackObj.close_btn_original;
  }
  sendFeedback(ref, flag: string, action?: string) {
    this.appModel.notifyUserAction();
    this.appModel.handlePostVOActivity(false);
    clearTimeout(this.nextQuestionTimeronLast);
    ref.classList = "modal";
    if (action == "replay") {
      this.replayVideo();
    } else if (action == "feedbackDone") {
      console.log("feedback done......");
      if (this.quesObj.lang == 'math') {
        this.appModel.blinkForLastQues();
      }
      this.disableScreen();
      // this.postFeedbackAction();
    } else if (action == "submitAnswer") {
      this.showTestScreen();
      $("#instructionBar").addClass("disable_div");
      this.appModel.enableReplayBtn(false);
    } else if (action == "showAnswerFeedback") {
      //this.postShowAnswer();
    }
  }

  showReplay(ref, flag: string, action?: string) {
    ref.classList = "modal";
    this.appModel.notifyUserAction();
    this.appModel.handlePostVOActivity(false);
    if (flag == "yes") {
      if (action == "replay") {
        this.replayVideo();
      }
    } else if (flag == "no") {
      this.appModel.videoStraming(false);
      setTimeout(() => {
        $("#instructionBar").removeClass("disable_div");
        $("#optionsBlock .options").removeClass("disable_div");
      }, 1000);
    }
  }

  replayVideo() {
    this.videoReplayd = true;
    this.isPlayVideo = true;
    this.appModel.navShow = 1;
    //this.appModel.enableSubmitBtn(false);
    this.inputDivRef.nativeElement.classList = "inputDiv";
    this.instructionBar.nativeElement.classList = "instructionBase";
    clearInterval(this.blinkTimer);
    this.inputDivRef.nativeElement.children[0].style.border = "2px solid black";

    let interval = setInterval(() => {
      if (this.mainVideo && this.mainVideo.nativeElement) {
        clearInterval(interval);
        this.mainVideo.nativeElement.play();
        if (this.QuestionVideo != undefined) {
          this.QuestionVideo.nativeElement.pause();
          this.QuestionVideo.nativeElement.currentTime = 0;
        }
        // this.QuestionVideo.nativeElement.pause();
        //this.QuestionVideo.nativeElement.currentTime = 0;      

        this.mainVideo.nativeElement.onended = () => {
         // this.appModel.enableSubmitBtn(true);
          this.isPlayVideo = false;
          this.appModel.videoStraming(false);
          this.appModel.notifyUserAction();
          this.appModel.handlePostVOActivity(false);
          this.inputDivRef.nativeElement.classList = "inputDiv";
          this.instructionBar.nativeElement.classList = "instructionBase";
        /*  if (this.QuestionVideo != undefined && this._questionAreaVideoFlag == true) {
            this.inputDivRef.nativeElement.classList = "inputDiv disablePointer";
            this.QuestionVideo.nativeElement.play();
            this.alldisabledwhilequestionVideoPlay();
            this.QuestionVideo.nativeElement.onended = () => {
              this.blinkTextBox();
              this.inputDivRef.nativeElement.classList = "inputDiv";
              this.allEnabledwhilequestionVideoPlay();
            }
          }*/
          if (this._questionAreaVideoFlag != true) {
            //this.blinkTextBox();
          }
        }
      }
    }, 100)
    this.instruction.nativeElement.pause();
    this.instruction.nativeElement.currentTime = 0;

  }

  openKeyBoard() {
    clearInterval(this.blinkTimer);
    this.inputDivRef.nativeElement.classList = "inputDiv disablePointer";
    this.appModel.notifyUserAction();
    this.appModel.handlePostVOActivity(false);
    this.inputDivRef.nativeElement.children[0].style.border = "2px solid black";
    this.inputFieldText = "";
    if (this.quesObj.lang != 'hindi') {
      this.inputDivRef.nativeElement.children[0].maxLength = "12";
      this.quesContainer.nativeElement.style.marginTop = 0 + "%";
      this.testContainer.nativeElement.style.marginTop = 0 + "%";
    }
    if (this.quesObj.lang == 'hindi') {
      this.keyBoardVersion = this.commonAssets.keyboard.New;
      this.quesContainer.nativeElement.style.marginTop = 0 + "%";
      this.testContainer.nativeElement.style.marginTop = 0 + "%";
    }
    if (this.layout == "mathLayout") {
      this.mathKeyboardRef.nativeElement.classList = "simple-keyboard hg-theme-default hg-layout-default";
    } else {
      if (this.quesObj.lang != 'hindi') {

        this.keyboard = new Keyboard({ onKeyPress: button => this.onKeyPress(button), layout: this.layout });
      }

    }
    //this.appModel.enableReplayBtn(this.playMyVideo);
    console.log(this.inputDivRef.nativeElement.children[0]);
    this.stopInstructionVO();
  }

  addWord() {
    this.appModel.notifyUserAction();
    this.appModel.handlePostVOActivity(false);
    this.inputDivRef.nativeElement.classList = "inputDiv";
    this.inputFieldText = this.commonAssets.inputFieldText.info;
    this._addWordFlag = true;
    if (this.quesObj.lang != 'math') {
      let wordObj = {
        time: new Date().getTime(),
        word: this.inputVal
      }
      this.wordArr.push(wordObj);

      if (this.keyboard != undefined) {
        this.keyboard.clearInput();
        this.keyboard.destroy();
      }

      this.inputVal = "";
      this.btnCounting = 0;
      this.addBtnRef.nativeElement.style.opacity = "0.5";

      this.keyBoardVersion = false;
      this.appModel.enableSubmitBtn(true);
      this.btnPressed = 0;
      this.CharacterCounter = 0;
      this.matraBtnOn = false;
      this.matraRepeatArr = [];
      this.matraCounter = 0;
      this.hindiKeyboardArray = [];
      this.optionsBlock.nativeElement.style.opacity = 1;
    } else if (this.quesObj.lang == 'math') {
      this.optionsBlock.nativeElement.style.opacity = 1;
      this.addBtnRef.nativeElement.style.opacity = "0.5";
      this.btnCounting = 0;
      this.mathKeyboardRef.nativeElement.classList = "simple-keyboard hg-theme-default hg-layout-default hideKeyboard";
      if (this.inputVal != '') {
        let wordObj = {
          time: new Date().getTime(),
          word: this.inputVal
        }
        this.wordArr.push(wordObj);
        this.inputVal = "";
        this.appModel.enableSubmitBtn(true);
      }
    }
    this.stopInstructionVO();
    //this.wordBlockRef.nativeElement.children[0].classList.add("inputDiv");
  }

  showTestScreen() {
    this.noAttempts = this.wordArr.length;
    this.testContainer.nativeElement.classList = "testContainer d-flex flex-row justify-content-center align-items-center";
    this.quesContainer.nativeElement.classList = "quesContainer flex-row justify-content-center align-items-center";
    this.quesContainer.nativeElement.classList = "quesContainer flex-row justify-content-center align-items-center hideTestScreen";
    this.wordBlockRef.nativeElement.classList = "wordBlock";
    this.appModel.enableSubmitBtn(false);
  }

  moveToBox(idx, word) {
    this.selectedIdx = idx;
    let t_left = this.optionPlaceRef.nativeElement.getBoundingClientRect().left;
    let t_top = this.optionPlaceRef.nativeElement.getBoundingClientRect().top;
    let f_left = this.wordBlockRef.nativeElement.children[idx].getBoundingClientRect().left;
    let f_top = this.wordBlockRef.nativeElement.children[idx].getBoundingClientRect().top;
    /*$(this.wordBlockRef.nativeElement.children[idx]).addClass('absolutePosition');
    this.wordBlockRef.nativeElement.children[idx].style.left = f_left;
    this.wordBlockRef.nativeElement.children[idx].style.top = f_top;*/
    $(this.wordBlockRef.nativeElement.children[idx]).animate({ left: '32%', top: '-125%', width: '36%' }, 500, () => { this.pushToTestBox(idx, word) });
    this.wordBlockRef.nativeElement.classList = "wordBlock disableIt";
    this.appModel.notifyUserAction();
    this.appModel.handlePostVOActivity(false);
  }

  addToWrongList() {
    let from = this.optionPlaceRef.nativeElement.getBoundingClientRect();
    let to = this.selectedWrongListRef.nativeElement.children[this.currentWrongListIdx].getBoundingClientRect();
    this.optionPlaceRef.nativeElement.style.zIndex = "100";
    $(this.optionPlaceRef.nativeElement).animate({ left: (to.left - (from.left)), top: (to.top - (from.top)), width: '25%' }, 500, () => this.pushToWrongList());
    this.wordBlockRef.nativeElement.classList = "wordBlock";
    this.appModel.notifyUserAction();
    this.appModel.handlePostVOActivity(false);
  }

  addToRightList() {
    let from = this.optionPlaceRef.nativeElement.getBoundingClientRect();
    let to = this.selectedRightListRef.nativeElement.children[this.currentRightListIdx].getBoundingClientRect();
    $(this.optionPlaceRef.nativeElement).animate({ left: (to.left - (from.left)), top: (to.top - (from.top)), width: '25%' }, 500, () => this.pushToRightList());
    this.wordBlockRef.nativeElement.classList = "wordBlock";
    this.appModel.notifyUserAction();
    this.appModel.handlePostVOActivity(false);
  }

  pushToTestBox(idx, word) {
    this.wordArr[idx].word = "";
    this.selectedOptionArr[0] = word;
    this.noAttempts--;
    $("#optionPlaceId").addClass("animateWidth");
  }

  pushToRightList() {
    let copyTxt = JSON.parse(JSON.stringify(this.selectedOptionArr[0]));
    this.selectedOptionArr[0] = "";
    this.rightListArr[this.currentRightListIdx] = copyTxt;
    this.currentRightListIdx++;
    if (this.noAttempts == 0) {
      this.feedbackTimer = setTimeout(() => {
        this.openModal();
      }, 3000)

    }

    this.feedbackAudio = this.feedbackObj.right_sound;
    this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.location == "content" ? this.containgFolderPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
    this.feedbackPopupAudio.nativeElement.play();

  }

  pushToWrongList() {
    let copyTxt = JSON.parse(JSON.stringify(this.selectedOptionArr[0]));
    this.selectedOptionArr[0] = "";
    this.wrongListArr[this.currentWrongListIdx] = copyTxt;
    this.currentWrongListIdx++;
    if (this.noAttempts == 0) {
      this.feedbackTimer = setTimeout(() => {
        this.openModal();
      }, 3000)
    }
    this.feedbackAudio = this.feedbackObj.wrong_sound;
    this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.location == "content" ? this.containgFolderPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
    this.feedbackPopupAudio.nativeElement.play();


  }

  openModal() {
    this.feedbackModal.nativeElement.classList = "modal displayPopup";
    this.infoModal = false;
    this.stopInstructionVO();    
  }

  hoverRightTick() {
    this.testAssts.right_tick = this.testAssts.right_tick_hover;
  }

  houtRightTick() {
    this.testAssts.right_tick = this.testAssts.right_tick_original;
  }
  hoverWrongTick() {
    this.testAssts.wrong_tick = this.testAssts.wrong_tick_hover;
  }

  houtWrongTick() {
    this.testAssts.wrong_tick = this.testAssts.wrong_tick_original;
  }

  addBtnHover() {
    this.addBtn.add_btn = this.addBtn.add_btn_hover;
  }
  addBtnLeave() {
    this.addBtn.add_btn = this.addBtn.add_btn_original;
  }

  numberClick(num) {
    this.stopInstructionVO();
    let editedStr = this.inputVal + "" + num;
    if (this.btnCounting < this.maxCharacter) {
      this.onChange(editedStr);
      this.btnCounting += 1;
    }

    this.addBtnRef.nativeElement.style.opacity = "1";
  }

  operatorClick(operator) {
    this.stopInstructionVO();
    let editedStr = this.inputVal + "" + operator;
    if (this.btnCounting < this.maxCharacter) {
      this.onChange(editedStr);
      this.btnCounting += 1;
    }

    this.addBtnRef.nativeElement.style.opacity = "1";
  }

  /*
    spaceClick() {
      let editedStr = this.inputVal + " ";
      this.onChange(editedStr);
    }
  */
  tabClick() {
    let editedStr = this.inputVal + " ";
    if (this.btnCounting < this.maxCharacter) {
      this.onChange(editedStr);
      this.btnCounting += 1;
    }

  }

  deleteElement() {
    this.stopInstructionVO();
    if (this.btnCounting > 0) {
      this.btnCounting -= 1;
      let editedStr = this.inputVal.substr(0, this.inputVal.length - 1);
      this.onChange(editedStr);

    }

  }

  ngDoCheck() {
    /* if(this.inputVal.length > this.prevEntry.length && (this.btnPressed == 11 || this.btnPressed < 11)){
       this.stringArr.push(this.inputVal.length - this.prevEntry.length);
       this.prevEntry = this.inputVal;
       this.btnPressed++;
       console.log("normal case");
     }else if( this.btnPressed > 12 && this.btnSelected!="{bksp}"){
       let copy  = JSON.parse(JSON.stringify(this.prevEntry));
       this.inputVal = "";
       this.inputVal = copy;
        console.log("more than 12 case");
      // this.keyboard.setInput(copy);
      this.inputDivRef.nativeElement.children[0].value = copy;
     }else if(this.btnSelected=="{bksp}" && this.inputVal.length < this.prevEntry.length && (this.prevEntry.length - this.inputVal.length  == this.stringArr[this.stringArr.length-1])){
         this.stringArr.splice(this.stringArr.length-1,1);
         this.prevEntry = this.inputVal;
          this.btnPressed--;
          this.btnSelected="";
          console.log("backspace");
     }else if(this.btnSelected!="{bksp}" && this.btnPressed==12){
       this.btnPressed++;
        console.log("added 12 plus");
     }*/
    if (this.inputVal.length > this.prevEntry.length) {
      this.prevEntry = this.inputVal;
      this.stopInstructionVO();
    }
  }

  disableScreen() {
    //this.inputDivRef.nativeElement.children[0].setSelectionRange(this.inputVal.length-1,0);
    this.bodyContent.nativeElement.classList = "bodyContent disableDiv";
    this.instructionBar.nativeElement.classList = "instructionBase disableDiv";
    this.appModel.enableReplayBtn(false);
    clearInterval(this.blinkTimer);

  }

  blinkTextBox() {
    this.blinkTimer = setInterval(() => {
      if (this.blinkFlag) {
        this.inputDivRef.nativeElement.children[0].style.border = "2px solid black";
        this.blinkFlag = false;
      } else {
        this.inputDivRef.nativeElement.children[0].style.border = "2px solid yellow";
        this.blinkFlag = true;
      }
    }, 500)
  }

  stopInstructionVO() {
    if (!this.instruction.nativeElement.paused) {
      this.instruction.nativeElement.currentTime = 0;
      this.instruction.nativeElement.pause();
    }
  }

  hoverRow1(event) {
    for (let i = 0; i < this.keyBoard1[0].row1.length; i++) {
      this.Row1.nativeElement.children[i].style.left = this.keyBoard1[0].row1[i].left + "%";
    }
  }

  hoverRow2(event) {
    for (let i = 0; i < this.keyBoard1[0].row2.length; i++) {
      this.Row2.nativeElement.children[i].style.left = this.keyBoard1[0].row2[i].left + "%";
    }
  }

  hoverRow3(event) {
    for (let i = 0; i < this.keyBoard1[0].row3.length; i++) {
      this.Row3.nativeElement.children[i].style.left = this.keyBoard1[0].row3[i].left + "%";
      this.Row3.nativeElement.children[i].style.top = this.keyBoard1[0].row3[i].top + "%";
    }
  }


  hoverbtmRow(event) {
    for (let i = 0; i < this.keyBoard1[0].btmRow.length; i++) {
      this.BtmRow.nativeElement.children[i].style.left = this.keyBoard1[0].btmRow[i].left + "%";
      this.BtmRow.nativeElement.children[i].style.width = this.keyBoard1[0].btmRow[i].width + "%";
    }
  }

  hovernumPad(event) {
    for (let i = 0; i < this.keyBoard1[0].numPadArray.length; i++) {
      this.NumPad.nativeElement.children[i].style.left = this.keyBoard1[0].numPadArray[i].left + "%";
      this.NumPad.nativeElement.children[i].style.top = this.keyBoard1[0].numPadArray[i].top + "%";
      this.NumPad.nativeElement.children[i].style.width = this.keyBoard1[0].numPadArray[i].width + "%";
    }
  }


  clickBtn(id, opt) {
    this.appModel.notifyUserAction();
    this.appModel.handlePostVOActivity(false);
    if (id == "Normal") {
      this.matraBtnOn = false;
      this.matraRepeatArr = [];
      this.matraCounter = 0;
      for (let y = 0; y < this.rowIndex2.length; y++) {
        document.getElementById("index" + y).style.display = "none";
      }
      for (let y = 0; y < this.rowIndex3.length; y++) {
        document.getElementById("consonent" + y).style.display = "none";
      }

      for (let i = 0; i < this.rowIndex1.length; i++) {
        this.Row1.nativeElement.children[i].classList.remove("highlight");
      }
    }
    else if (id == "Spacebar") {
      if (this.CharacterCounter >= this.maxCharacter) {
        return;
      }
      this.inputDivRef.nativeElement.children[0].value += " ";
      this.hindiKeyboardArray.push(" ");
      this.CharacterCounter += 1;
    }
    else if (id == "Clear") {
      this.inputFieldText = this.commonAssets.inputFieldText.info;
      this.inputDivRef.nativeElement.children[0].value = this.inputFieldText;
      this.hindiKeyboardArray = [];
      this.CharacterCounter = 0;
      this.inputVal = "";
    }
    else if (id == "Backspace") {
      this.hindiKeyboardArray.splice(this.hindiKeyboardArray.length - 1, 1);
      this.inputDivRef.nativeElement.children[0].value = this.hindiKeyboardArray.join("");
      this.inputVal = String(this.hindiKeyboardArray.join(""));
      console.log("this.inputVal = " + this.inputVal);
      if (this.CharacterCounter > 0) {
        this.CharacterCounter -= 1;
      }

    }
    else {
      if (this.CharacterCounter >= this.maxCharacter) {
        return;
      }
      if (this.matraBtnOn == true) {

        this.inputDivRef.nativeElement.children[0].value += opt.matras[this.currentMatraNumber].matra;
        this.hindiKeyboardArray.push(opt.matras[this.currentMatraNumber].matra);
        this.addBtnRef.nativeElement.style.opacity = "1";
      }
      else {
        this.inputDivRef.nativeElement.children[0].value += id;
        this.hindiKeyboardArray.push(id);
        this.addBtnRef.nativeElement.style.opacity = "1";
      }
      this.inputVal = String(this.hindiKeyboardArray.join(""));
      console.log("this.inputVal = " + this.inputVal);
      this.CharacterCounter += 1;

    }

  }


  clickBtnMatra(id, opt, evnt) {

    this.currentMatraNumber = id;
    this.appModel.notifyUserAction();
    this.appModel.handlePostVOActivity(false);

    for (let y = 0; y < this.rowIndex2.length; y++) {
      document.getElementById("index" + y).style.display = "block";
      document.getElementById("index" + y).style.left = this.rowIndex2[y].left + "%";
    }

    for (let y = 0; y < this.rowIndex3.length; y++) {

      if (this.rowIndex3[y].matras[this.currentMatraNumber].matra == "") {
        document.getElementById("consonent" + y).style.display = "block";
        document.getElementById("consonent" + y).style.left = this.rowIndex3[y].left + "%";
        document.getElementById("consonent" + y).style.top = this.rowIndex3[y].top + "%";
      }
      else {
        document.getElementById("consonent" + y).style.display = "none";
      }

    }


    for (let i = 0; i < this.rowIndex1.length; i++) {
      this.Row1.nativeElement.children[i].classList.remove("highlight");
    }
    this.Row1.nativeElement.children[id].classList.add("highlight");

    this.matraBtnOn = true;
    this.matraRepeatArr.push(id);
    this.matraCounter += 1;
    if (this.matraRepeatArr[0] == this.matraRepeatArr[1]) {
      this.matraBtnOn = false;
      this.matraRepeatArr = [];
      this.matraCounter = 0;
      this.Row1.nativeElement.children[id].classList.remove("highlight");
      for (let y = 0; y < this.rowIndex2.length; y++) {
        document.getElementById("index" + y).style.display = "none";
      }
      for (let y = 0; y < this.rowIndex3.length; y++) {
        document.getElementById("consonent" + y).style.display = "none";
      }
    }
    else {
      if (this.matraCounter > 1) {
        this.matraRepeatArr.shift();
      }
    }
  }

  checkVideoLoaded() {
    if (this.videoReplayd) {
      this.appModel.setLoader(false);
      this.appModel.videoStraming(false);
      this.appModel.navShow = 1;
      this.isPlayVideo = this.playMyVideo;
      if (this.playMyVideo == false) {
        this.appModel.navShow = 2;
        this.appModel.setLoader(false);
        this.appModel.videoStraming(false);
        this.QuestionLoaded();
      }
      else {
        this.appModel.isVideoPlayed = true;
        this.appModel.stopAllTimer();
      }

    }
  }

  endedHandler() {
    this.isPlayVideo = false;
    this.appModel.navShow = 2;
    this.appModel.setLoader(false);
    this.appModel.startPreviousTimer();
  }

  endedHandleronSkip() {
    this.isPlayVideo = false;
    this.appModel.navShow = 2;
    this.appModel.videoStraming(false);
    this.QuestionLoaded();

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

  keyPress() {
    return false;
  }

  QuestionLoaded() {
    if (this.inputVal == "" && !this.videoReplayd) {
      this.instruction.nativeElement.play();
      this.instruction.nativeElement.onended = () => {
        this.checkinputnull();
      }
    }
    else {
      this.checkinputnull();
    }

  }

  checkinputnull() {
    this.appModel.handlePostVOActivity(true);
    this.appModel.enableReplayBtn(this.playMyVideo);
    this.inputDivRef.nativeElement.classList = "inputDiv";
    this.instructionBar.nativeElement.classList = "instructionBase";
    this.appModel.notifyUserAction();
    this.appModel.handlePostVOActivity(false);
    if (this.QuestionVideo != undefined && this._playInstructionFlag == false && this._questionAreaVideoFlag == true && this.videoReplayd == false) {
      this.inputDivRef.nativeElement.classList = "inputDiv disablePointer";
      this.QuestionVideo.nativeElement.play();
      this.alldisabledwhilequestionVideoPlay();
      this.QuestionVideo.nativeElement.onended = () => {
        this.blinkTextBox();
        this.inputDivRef.nativeElement.classList = "inputDiv";
        this.allEnabledwhilequestionVideoPlay();
      }
    }
    if (this.QuestionAudio != undefined) {
      this._setQuestionAudio = this._questionAreaAudio;
      this.QuestionAudio.nativeElement.src = this._questionAreaAudio.location == "content" ? this.containgFolderPath + "/" + this._questionAreaAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this._questionAreaAudio.url + "?someRandomSeed=" + Math.random().toString(36);
      this.QuestionAudio.nativeElement.play();
    }

    if (this.QuestionVideo != undefined  && this.videoReplayd == false && this._playInstructionFlag == false) {
      this.QuestionVideo.nativeElement.play();
      this.alldisabledwhilequestionVideoPlay();
    }
    //this.blinkOnLastQues();
    this.appModel.handlePostVOActivity(false);
    if (this.inputVal == "" && this._questionAreaVideoFlag != true && !this.videoReplayd) {
      this.blinkTextBox();
    }
    this.appModel.notifyUserAction();
    this.appModel.handlePostVOActivity(false);
    if (this._addWordFlag == true) {
      this.appModel.enableSubmitBtn(true);
    }
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

  questionAudioPlay() {
    if (this.QuestionAudio != undefined) {
      this._setQuestionAudio = this._questionAreaAudio;
      this.QuestionAudio.nativeElement.src = this._questionAreaAudio.location == "content" ? this.containgFolderPath + "/" + this._questionAreaAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this._questionAreaAudio.url + "?someRandomSeed=" + Math.random().toString(36);
      this.QuestionAudio.nativeElement.play();
    }
  }

  alldisabledwhilequestionVideoPlay() {
    $("#instructionBar").addClass("disable_div");
    this.appModel.enableReplayBtn(false);
  }
  allEnabledwhilequestionVideoPlay() {
    $("#instructionBar").removeClass("disable_div");
    this.appModel.enableReplayBtn(true);
  }
}





