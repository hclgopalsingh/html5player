import { Component, OnInit, HostListener, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { Subscription } from 'rxjs';
// import 'jquery';
import { PlayerConstants } from '../../../common/playerconstants';
import { SharedserviceService } from '../../../services/sharedservice.service';
import { ThemeConstants } from '../../../common/themeconstants';
import { InactivityTimerComponent } from '../../../controller/inactivity-timer-component';

import Keyboard from "simple-keyboard";
import hindiLayout from "simple-keyboard-layouts/build/layouts/hindi";

import {
  trigger,
  state,
  style,
  animate,
  transition,
  AnimationEvent
} from '@angular/animations';

// declare var $: any;


@Component({
  selector: 'ntemp17',
  animations: [
    trigger('wordActionbox', [
      state('wordBox', style({
        'transform': 'scale(1.0)'
      })
      ),
      state('actionBox', style({
        'left': '43%',
        'top': '-116%',
        'transform': 'scale(1.8)'
      })
      ),
      transition('wordBox => actionBox', [
        animate('0.4s')
      ]),
    ]),
    trigger('wordTestbox', [
      state('actionBox', style({

      })
      ),
      state('testBox', style({
        'left': '{{toTestBoxleft}}',
        'top': '{{toTestBoxtop}}',
        'transform': 'scale(.3)',

      }), { params: { toTestBoxleft: 'auto', toTestBoxtop: 'auto' } }
      ),
      transition('actionBox => testBox', [
        animate('0.4s')
      ]),
    ])
  ],
  //todo
  encapsulation: ViewEncapsulation.None,
  templateUrl: './Ntemplate17.component.html',
  styleUrls: ['./Ntemplate17.component.css', '../../../view/css/bootstrap.min.css', "../../../../../node_modules/simple-keyboard/build/css/index.css"]
  //todo
})
export class Ntemplate17Component implements OnInit {

  private appModel: ApplicationmodelService;
  constructor(appModel: ApplicationmodelService, public _InactivityTimerComponent: InactivityTimerComponent, private Sharedservice: SharedserviceService) {
    this.appModel = appModel;
    this.assetsPath = this.appModel.assetsfolderpath;
    this.appModel.navShow = 1;
    this.appModel.setLoader(true);

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
  @ViewChild('confirmSubmitRef') confirmSubmitRef: any;
  @ViewChild('mainVideo') mainVideo: any;
  @ViewChild('feedbackInfoAudio') feedbackInfoAudio: any;
  @ViewChild('quesContainer') quesContainer: any;
  @ViewChild('testContainer') testContainer: any;
  @ViewChild('wordBlockRef') wordBlockRef: any;
  @ViewChild('refques') refques: any;
  @ViewChild('optionPlaceRef') optionPlaceRef: any;
  // @ViewChild('selectedRightListRef') selectedRightListRef: any;
  @ViewChild('DummyRightListRef') DummyRightListRef: any;
  @ViewChild('DummyWrongListRef') DummyWrongListRef: any;
  // @ViewChild('selectedOptionRef') selectedOptionRef: any;
  @ViewChild('selectedWrongListRef') selectedWrongListRef: any;
  @ViewChild('feedbackModal') feedbackModal: any;
  @ViewChild('addBtnRef') addBtnRef: any;
  @ViewChild('inputDivRef') inputDivRef: any;
  // @ViewChild('simpleKeyboardRef') simpleKeyboardRef: any;
  @ViewChild('quesVORef') quesVORef: any;
  @ViewChild('instructionBar') instructionBar: any;
  @ViewChild('mathKeyboardRef') mathKeyboardRef: any;
  // @ViewChild('modalfeedback17') modalfeedback17: any;
  @ViewChild('bodyContent') bodyContent: any;
  @ViewChild('skipBtn') skipBtn: any;

  // @ViewChild('row1') Row1: any;
  // @ViewChild('row2') Row2: any;
  // @ViewChild('row3') Row3: any;
  // @ViewChild('btmRow') BtmRow: any;
  // @ViewChild('numPad') NumPad: any;
  @ViewChild('feedbackPopupAudio') feedbackPopupAudio: any;
  @ViewChild('infoModalRef') InfoModalRef: any;
  @ViewChild('questionVideo') QuestionVideo: any;
  @ViewChild('questionAudio') QuestionAudio: any;
  @ViewChild('fullImage') fullImage: any;


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
  charLeft: number = 17;
  noOfImgs: number;
  noOfImgsLoaded: number = 0;
  loaderTimer: any;
  containgFolderPath: string = "";
  assetsPath: string = "";
  loadFlag: boolean = false;
  feedbackObj: any;
  confirmPopupAssets: any;
  submitPopupAssets: any;
  submitConfirmPopupAssets: any;
  replayconfirmAssets: any;
  tempSubscription: Subscription;
  quesObj: any;
  isPlayVideo: boolean = false;
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
  popupTxtRequired: boolean = false;
  isSecondScreen: boolean = false;
  keyboard: Keyboard;
  selectedIdx: number = -1;
  currentRightListIdx: number = 0;
  currentWrongListIdx: number = 0;
  selectedOptionArr: any = {};
  rightListArr: any = [];
  wrongListArr: any = [];
  selectedListArr: any = [];
  videoStartTimer: any;
  btnPressed: number = 0;
  prevEntry: string = "";
  maxLength: number = 17;
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
  maxCharacter: number = 17;
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
  btnCounting: number = 0;
  _addWordFlag: boolean = false;
  _playInstructionFlag: boolean = false;
  currentPlaying: any;
  everythingenabled:boolean = true;
  disablebtnarrEng = ['{tab}', '{enter}', '[', ']', '{', '}', '|', '>', '<', '?', '/', '\\', '{space}', "{shift}"];
  /*Start: Theme Implementation(Template Changes)*/
  controlHandler = {
    isSubmitRequired: false,
    isReplayRequired: false,
    isShowAns :false
  };
  themePath: any;
  fetchedcontent: any;
  functionalityType: any;
  showAnsTimeout: number;
  /*END: Theme Implementation(Template Changes)*/
  videoPlaytimer: any;
  instructionDisable: boolean;
  toTestBoxleft: any;
  toTestBoxtop: any;
  midstate: any = "actionBox";
  counter: any = 0
  listtype: string = "";
  displayWave: boolean;
  speakerdisable: boolean = false;
  testContainerDisable: boolean = false;
  keyBoardOpen: boolean = false
  disableaddbtnPointer: any = false
  questAreaDisable: boolean = true;
  nextFeedbackBlinkTimer:any;
  nextBtnInterval: any;
  handleClose: boolean= true;
  firstLoad: boolean = true;
  isDisableClass:boolean = false
  rightPosArray: any = [
    {
      "left": "-2%",
      "top": "2%"
    },
    {
      "left": "9%",
      "top": "2%"
    },
    {
      "left": "-2%",
      "top": "16%"
    },
    {
      "left": "9%",
      "top": "16%"
    },
    {
      "left": "-2%",
      "top": "30%"
    },
    {
      "left": "9%",
      "top": "30%"
    },
    {
      "left": "-2%",
      "top": "45%"
    },
    {
      "left": "9%",
      "top": "45%"
    },
    {
      "left": "-2%",
      "top": "60%"
    },
    {
      "left": "9%",
      "top": "60%"
    },
    {
      "left": "-2%",
      "top": "75%"
    },
    {
      "left": "9%",
      "top": "75%"
    },
  ]

  wrongPosArray: any = [
    {
      "left": "64%",
      "top": "2%"
    },
    {
      "left": "76%",
      "top": "2%"
    },
    {
      "left": "64%",
      "top": "16%"
    },
    {
      "left": "76%",
      "top": "16%"
    },
    {
      "left": "64%",
      "top": "30%"
    },
    {
      "left": "76%",
      "top": "30%"
    },
    {
      "left": "64%",
      "top": "45%"
    },
    {
      "left": "76%",
      "top": "45%"
    },
    {
      "left": "64%",
      "top": "60%"
    },
    {
      "left": "76%",
      "top": "60%"
    },
    {
      "left": "64%",
      "top": "75%"
    },
    {
      "left": "76%",
      "top": "75%"
    },
  ]
  totalChar: any = 17;
  currentChar: any = 0;
  loadQuestionInterval:any;
  closeFeedbackmodalTimer: any;


  //angular life-cycle funtions
  ngOnInit() {
    this.attemptType = "auto";
    this.appModel.notifyUserAction();
    this.addBtnRef.nativeElement.style.opacity = "0.5";
    this.disableaddbtnPointer = true
    this.appModel.functionone(this.appModel.templatevolume, this);//start end
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
        if (this.popupRef && this.popupRef.nativeElement) {
          //$("#instructionBar").addClass("disable_div");
          this.instruction = true;
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
          // $("#instructionBar").addClass("disable_div");
          this.instructionDisable = true

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
          // $("#instructionBar").addClass("disable_div");
          this.instructionDisable = true

          this.confirmModalRef.nativeElement.classList = "displayPopup modal";
        }
      }
      if (action == "submitAnswer") {
        this.stopInstructionVO();
        //this.appModel.stopAllTimer();
        if(this.inputVal !=''){
          this.confirmSubmitRef.nativeElement.classList = "displayPopup modal";
          // SubmitConfirmModalRef
        }else{
          this.submitModalRef.nativeElement.classList = "displayPopup modal";
        }
        if (this.QuestionVideo != undefined && this._questionAreaVideoFlag == true) {
          this.QuestionVideo.nativeElement.pause();
          this.QuestionVideo.nativeElement.currentTime = 0;
          //this.QuestionVideo.nativeElement.load();      
        }
      }
      if (action == "replayVideo") {
        this.appModel.videoStraming(true);
        if (this.confirmReplayRef && this.confirmReplayRef.nativeElement) {
          //this.instructionBar.nativeElement.classList = "instructionBase";
          this.stopInstructionVO();
          this.confirmReplayRef.nativeElement.classList = "displayPopup modal";
          this.PlayPauseFlag = true;
          this.quesObj.quesPlayPause = this.quesObj.quesPause;
          this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
          if (this.QuestionVideo != undefined && this._questionAreaVideoFlag == true) {
            this.QuestionVideo.nativeElement.pause();
            this.QuestionVideo.nativeElement.currentTime = 0;
            //this.QuestionVideo.nativeElement.load();
            // this.instructionBar.nativeElement.style.pointerEvents="";
            this.instructionDisable = false;
          }
        }
      }
    })

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
    this.appModel.resetBlinkingTimer();
    /*Start: Theme Implementation(Template Changes)*/
    this.appModel.handleController(this.controlHandler);
    /*End: Theme Implementation(Template Changes)*/
  }

  ngOnDestroy() {    
    if (this.mainVideo && this.mainVideo.nativeElement && !this.mainVideo.nativeElement.paused) {
      this.mainVideo.nativeElement.pause();
      this.mainVideo.nativeElement.currentTime = 0;
      clearTimeout(this.videoStartTimer);
    }
    clearInterval(this.loadQuestionInterval);
    clearInterval(this.blinkTimer);
    clearInterval(this.feedbackTimer);
    clearTimeout(this.videoPlaytimer);
    if(this.nextFeedbackBlinkTimer !== undefined) {
      clearTimeout(this.nextFeedbackBlinkTimer);
    }
    if(this.closeFeedbackmodalTimer !== undefined) {
      clearTimeout(this.closeFeedbackmodalTimer);
    }
    this.inputDivRef.nativeElement.children[0].style.border = "4px solid #8e7c7c";
    if (this.QuestionAudio && this.QuestionAudio.nativeElement) {
      this.QuestionAudio.nativeElement.src = "";
      this.QuestionAudio.nativeElement.pause();
      this.QuestionAudio.nativeElement.currentTime = 0;
    }
    if(!this.quesVORef.nativeElement.paused){
      this.quesVORef.nativeElement.src="";
      this.quesVORef.nativeElement.pause();
      this.quesVORef.nativeElement.currentTime=0;
    }
    if(!this.instruction.nativeElement.paused){
      this.instruction.nativeElement.src="";
      this.instruction.nativeElement.pause();
      this.instruction.nativeElement.currentTime=0;
    }
    this.displayWave = false;
    this.speakerdisable = false;
    this.questAreaDisable = false
  }

  ngDoCheck() {
    if (this.inputVal.length > this.prevEntry.length) {
      this.prevEntry = this.inputVal;
      this.stopInstructionVO();
    }
  }

  ngAfterViewChecked() {
    this.appModel.templatevolume(this.appModel.volumeValue, this);
    if (this.inputVal == "") {
      this.addBtnRef.nativeElement.style.opacity = "0.5";
      this.disableaddbtnPointer = true
    }
  }

  onChange = (input: string) => {
    console.log("Input changed", input);
    this.inputVal = input;
    this.addBtnRef.nativeElement.style.opacity = "1";
    this.disableaddbtnPointer = false;
    if (this.QuestionVideo != undefined && this._questionAreaVideoFlag == true) {
      this.QuestionVideo.nativeElement.pause();
      this.QuestionVideo.nativeElement.currentTime = 0;
      //this.QuestionVideo.nativeElement.load();
    }

  };


  //checking max length
  // checkMaxLength() {
  //   if (this.inputVal.length == 12 || this.inputVal.length > 12) {
  //     this.inputVal = this.inputVal.substr(0, 12);
  //     this.inputDivRef.nativeElement.children[0].value = this.inputVal;
  //   }
  // }

  //event on key press
  onKeyPress = (button: string) => {
    console.log("keypressedddd")
    // this.inputDivRef.nativeElement.children[0].click();
    console.log("Button pressed", button);
    clearInterval(this.blinkTimer);
    this.stopInstructionVO();
    this.instructionDisable = false;
    if (button === "{tab}" || button === "{enter}" || button === ".com") {
      return;
    }
    if (this.QuestionAudio && this.QuestionAudio.nativeElement) {
      this.QuestionAudio.nativeElement.pause();
      this.QuestionAudio.nativeElement.currentTime = 0;
    }
    this.displayWave = false;
    this.speakerdisable = false;
    this.questAreaDisable = false;
    this.appModel.notifyUserAction();
    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === "{shift}" || button === "{lock}") {
      this.handleShift();
      if (button === "{lock}") {
        for (let i = 0; i < this.disablebtnarrEng.length; i++) {
          if (this.disablebtnarrEng[i] == "{space}") {
            (this.keyboard.getButtonElement(this.disablebtnarrEng[i]) as HTMLElement).children[0].innerHTML = "Space bar";
          } else if (this.disablebtnarrEng[i] == "{shift}") {
            if (this.keyboard.getButtonElement(this.disablebtnarrEng[i]) != undefined) {
              for (var j = 0; j < 2; j++) {
                (this.keyboard.getButtonElement(this.disablebtnarrEng[i])[j] as HTMLElement).classList.add("disableDiv");
              }
            }
          } else {
            if (this.keyboard.getButtonElement(this.disablebtnarrEng[i]) != undefined) {
              (this.keyboard.getButtonElement(this.disablebtnarrEng[i]) as HTMLElement).classList.add("disableDiv");
            }
          }
        }
        // if(this.keyboard.options.layoutName=="shift") {
        // (document.getElementsByClassName("simple-keyboard hg-theme-default hg-layout-shift ")[0].lastChild.children[1].children[0] as HTMLElement).innerHTML="Space bar";
        // } else {
        // (document.getElementsByClassName("simple-keyboard hg-theme-default hg-layout-default")[0].lastChild.children[1].children[0] as HTMLElement).innerHTML="Space bar";
        // }
      }
    } else if (button === "{bksp}") {
      this.btnSelected = "{bksp}";
      if (this.charLeft < this.totalChar) {
        this.currentChar = this.currentChar - 1;
        this.charLeft = this.charLeft + 1
        this.onBlurMethod();
      }
      if (this.quesObj.lang == 'eng') {
        if (this.currentChar > 0) {
          //this.currentChar -= 1;
        }
        this.inputVal = this.inputVal.substring(0, this.inputVal.length - 1);
        //this.btnCounting-=1;
      }
      if (this.quesObj.lang == 'hindi') {
        // if(this.btnCounting && this.btnCounting >0){
        //   this.btnCounting -= 1;
        // }
        this.checkForSpecial(this.inputVal);
        this.inputVal = this.inputVal.substring(0, this.inputVal.length - 1);
      }

    }
    else if (this.currentChar < this.totalChar) {
      if (button == "{space}" && this.inputVal != " ") {
        this.inputVal += " ";
      }
      else {
        if (button != "{space}") {
          this.inputVal += button;
        }
      }
      this.btnCounting += 1;
      if (this.inputVal != " ") {
        this.addBtnRef.nativeElement.style.opacity = "1";
        this.disableaddbtnPointer = false;
      }
    }
    else {

    }

    if (this.QuestionVideo != undefined && this._questionAreaVideoFlag == true) {
      this.QuestionVideo.nativeElement.pause();
      this.QuestionVideo.nativeElement.currentTime = 0;
      //this.QuestionVideo.nativeElement.load();
    }
    console.log("this.inputVal.lengthr", this.inputVal.length, this.inputVal.trim(), this.inputVal.trim().length)
    if (button != "{bksp}" && button != "{lock}" && this.charLeft > 0) {
      if (this.inputVal.trim().length == 0) {
        this.inputVal = "";
      }
      if (this.inputVal.trim().length > 0) {
        this.charLeft = this.charLeft - 1
        this.currentChar = this.currentChar + 1;
      }
    }
  };


  checkForSpecial(val) {
    let L = val.length
    let lastChar: any
    if (L > 2) {
      lastChar = val[L - 3] + val[L - 2] + val[L - 1]
      console.log(lastChar, "lastChar")
      if (lastChar == "त्र" || lastChar == "ज्ञ" || lastChar == "श्र" || lastChar == "क्ष") {
        this.inputVal = this.inputVal.substring(0, this.inputVal.length - 2);
      }
    }
    if (L > 1) {
      lastChar = val[L - 2] + val[L - 1]
      console.log(lastChar, "lastChar")

      if (lastChar == "र्" || lastChar == "्र") {
        this.inputVal = this.inputVal.substring(0, this.inputVal.length - 1);
      }
    }
  }


  onBlurMethod() {
    console.log("this.wordArr.length", this.wordArr.length)
    if (this.charLeft > 0 && this.wordArr.length < 12 && this.everythingenabled) {
      document.getElementById("inputKeyboard").focus();
      console.log("focussing....")
    }
    else {
      document.getElementById("inputKeyboard").blur();
    }
  }

  //to check on keyboard press
  onInputChange = (event: any) => {
    /* console.log(event);
     if(this.btnPressed<12){
       this.keyboard.setInput(event.target.value);
     }*/
  };


  handleShift = () => {
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    this.keyboard.setOptions({
      layoutName: shiftToggle
    });
  };

  //play instruction on instr click
  playHoverInstruction() {
    if (!this.instruction.nativeElement.paused) {
      console.log("narrator/instruction voice still playing");
    } else {
      console.log("play on Instruction");
      if (this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        if (this.QuestionAudio && this.QuestionAudio.nativeElement) {
          this.QuestionAudio.nativeElement.pause();
          this.QuestionAudio.nativeElement.currentTime = 0;
        }
        this.displayWave = false;
        this.speakerdisable = false;
        this.questAreaDisable = false;
        this.instruction.nativeElement.play();
        this.instructionDisable = true;
        this.appModel.handlePostVOActivity(false);
        this._playInstructionFlag = true;
        // $(".instructionBase img").css("cursor", "pointer");
        this.instruction.nativeElement.onended = () => {
          this.instructionDisable = false
          if (this.QuestionVideo != undefined && this._questionAreaVideoFlag == true) {
            this.QuestionVideo.nativeElement.play();
            this.instructionDisable = false
            this.appModel.handlePostVOActivity(false);
            // this.instructionBar.nativeElement.style.pointerEvents="none";
            this.QuestionVideo.nativeElement.onended = () => {
              this.appModel.handlePostVOActivity(false);
              //this.QuestionVideo.nativeElement.load();
              this.QuestionVideo.nativeElement.pause();
              this.QuestionVideo.nativeElement.currentTime = 0;
              // this.instructionBar.nativeElement.style.pointerEvents="";
            }
          }
        }
      }
    }
  }

  blinkOnLastQues() {
    this.appModel.eventFired();
    this.appModel.event = { 'action': 'segmentEnds' };
    if (this.InfoModalRef != undefined) {
      // this.appModel.moveNextQues();
      if (this.testContainerDisable) {
        console.log('on keyboard screen')
      }
      else {
        console.log('on test screen')

      }
      this.submitModalRef.nativeElement.classList = "modal";
      this.confirmSubmitRef.nativeElement.classList = "modal";
      this.InfoModalRef.nativeElement.classList = "displayPopup modal";
      this.feedbackInfoAudio.nativeElement.src = this.infoPopupAssets.info_sound.url ;
      this.feedbackInfoAudio.nativeElement.play();
      clearInterval(this.blinkTimer);

      if (this.appModel.isLastSectionInCollection) {
        // this.appModel.blinkForLastQues();
        //this.appModel.stopAllTimer();
        if (!this.appModel.eventDone) {
          if (this.isLastQuesAct) {
            this.appModel.eventFired();
            this.appModel.event = { 'action': 'segmentEnds' };
            if (this.InfoModalRef != undefined) {
              // this.appModel.moveNextQues();
              ////add check
              this.submitModalRef.nativeElement.classList = "modal";
              this.confirmSubmitRef.nativeElement.classList = "modal";
              this.InfoModalRef.nativeElement.classList = "displayPopup modal";
              this.feedbackInfoAudio.nativeElement.src = this.infoPopupAssets.info_sound.url ;
              this.feedbackInfoAudio.nativeElement.play();
            }

          }
          if (this.isLastQues) {
            this.appModel.event = { 'action': 'end' };
          }
        }
      }
    }
  }



  close() {
    //this.appModel.event = { 'action': 'exit', 'currentPosition': this.currentVideoTime };
    this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
  }

  checkquesTab() {
    if (this.fetchedcontent.commonassets.ques_control != undefined) {
      this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
    } else {
      this.appModel.getJson();
    }
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
        this.instructionDisable = true;

        this.isQuesTypeVideo = false;
        this.appModel.navShow = 2;
        this.loadQuestionInterval=setTimeout(() => {
          this.isPlayVideo = false;
          //if (this.quesObj.quesInstruction && this.quesObj.quesInstruction.autoPlay) {
          this.quesVORef.nativeElement.src = this.quesObj.quesInstruction.location == "content" ? this.containgFolderPath + "/" + this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.quesObj.quesInstruction.url + "? someRandomSeed=" + Math.random().toString(36);
          this.QuestionLoaded();
        }, 200)
        //}
        // }, 500);
      }
    }
  }

  //gather data and assign to variables
  setData() {
    if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
      //let fetchedData: any = this.appModel.content.contentData.data;
      //console.log(fetchedData);
      this.feedback = this.fetchedcontent.feedback;
      this.commonAssets = this.fetchedcontent.commonassets;
      this.narratorAudio = this.fetchedcontent.commonassets.narrator;
      // this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
      this.noOfImgs = this.commonAssets.imgCount;
      this.isFirstQues = this.commonAssets.isFirstQues;
      this.isLastQues = this.appModel.isLastSection;
      this.isLastQuesAct = this.appModel.isLastSectionInCollection;
      if (this.isLastQuesAct || this.isLastQues) {
        this.appModel.setlastQuesNT();
      }
      this.feedbackObj = this.fetchedcontent.feedback;
      this.confirmPopupAssets = this.fetchedcontent.feedback;
      this.submitPopupAssets = this.fetchedcontent.submit_popup;
      this.replayconfirmAssets = this.fetchedcontent.replay_confirm;
      this.submitConfirmPopupAssets = this.fetchedcontent.submit_confirm_popup;
      this.quesObj = this.fetchedcontent.quesObj;
      /*Start: Theme Implementation(Template Changes)*/
      this.controlHandler = {
        isSubmitRequired: this.quesObj.submitRequired,
        isReplayRequired: this.quesObj.replayRequired,
        isShowAns: false
      }
      /*End: Theme Implementation(Template Changes)*/
      this.addBtn = this.fetchedcontent.other_assets.addBtn;
      this.refBase = this.fetchedcontent.other_assets.ref_base;
      this.wordBox = this.fetchedcontent.other_assets.word_box;
      this.testAssts = this.fetchedcontent.test_assets;
      this.inputFieldText = this.commonAssets.inputFieldText.info;
      this.playMyVideo = this.quesObj.quesVideo.PlayVideo;
      this.infoPopupAssets = this.fetchedcontent.info_popup;
      this._questionAreaImage = this.commonAssets.questionArea[0].image;
      this._questionAreaVideo = this.commonAssets.questionArea[0].video;
      this._questionAreaText = this.commonAssets.questionArea[0].text.txt;
      this._questionAreaAudio = this.commonAssets.questionArea[0].audio;
      this.popupTxtRequired = this.feedbackObj.AnswerpopupTxt.required
      this._questionAreaVideoFlag = this.commonAssets.questionArea[0].video.flag;
      this._questionAreaImageFlag = this.commonAssets.questionArea[0].image.flag;
      // if(this._questionAreaImageFlag){
      //   this._questionAreaImage = this.commonAssets.questionArea[0].video
      // }
      this._questionAreaTextFlag = this.commonAssets.questionArea[0].text.flag;
      this._questionAreaAudioFlag = this.commonAssets.questionArea[0].audio.flag;
      // alert(this._questionAreaFlag);
      if (this.quesObj.lang == "hindi") {
        this.totalChar = 17;
        this.charLeft = 17;
        console.log("hindi", hindiLayout)
        const newHindiLayout = { default: ["1 2 3 4 5 6 7 8 9 0 - . | {bksp}", "a ् ा ि ी ु ू े ै ो ौ ं ँ ः ़ ्र ृ र्", , "अ आ इ ई उ ऊ ए ऐ ओ औ ऍ ऑ", "क ख ग घ ङ च छ ज झ ञ ट ठ ड ढ ण", "त थ द ध न प फ ब भ म य र ल व श", "ष स ह क्ष {space} त्र ज्ञ श्र ॠ ॅ ॉ"] }
        // const newHindiLayout = {default:["ƒ „ … † ‡ ˆ ‰ Š & - | {bksp}","a ~ k f h q w s S ks kS a ¡ % z `",,"v vk b bZ m Å , ,s vks vkS va v%","d [k x ?k ³ p N t > ¥ V B M < .k","r Fk n /k u i Q c Hk e ; j y o 'k",'"k l g {k {space} = J K _ ऍ W ‚']} 
        this.layout = newHindiLayout;
        this.inputDivRef.nativeElement.children[0].classList.add("nonHindiInput");
        this.inputDivRef.nativeElement.children[0].classList.remove("nonHindiInput");
      } else if (this.quesObj.lang == "eng") {
        this.totalChar = 14;
        this.charLeft = 14;
        this.optionPlaceRef.nativeElement.children[0].style.fontSize = "2.2vmax"
        const newenglishLayout = { default: ["` 1 2 3 4 5 6 7 8 9 0 - = {bksp}", "{tab} q w e r t y u i o p [ ] \\", "{lock} a s d f g h j k l ; ' {enter}", "{shift} z x c v b n m , . / {shift}", "@ {space}"], shift: ["` 1 2 3 4 5 6 7 8 9 0 - = {bksp}", "{tab} Q W E R T Y U I O P { } |", '{lock} A S D F G H J K L : " {enter}', "{shift} Z X C V B N M < > ? {shift}", "@ {space}"] };
        this.layout = newenglishLayout;
        this.inputDivRef.nativeElement.children[0].classList.add("nonHindiInput");
        this.inputDivRef.nativeElement.children[0].classList.remove("inputHindiDiv");
      } else if (this.quesObj.lang == "math") {
        this.totalChar = 14;
        this.charLeft = 14;
        this.optionPlaceRef.nativeElement.children[0].style.fontSize = "2.2vmax"
        this.layout = "mathLayout";
        this.inputDivRef.nativeElement.children[0].classList.add("nonHindiInput");
        this.inputDivRef.nativeElement.children[0].classList.remove("inputHindiDiv");
      }

    }

    for (let i = 0; i < this.totalChar; i++) {
      this.rightListArr.push("");
      this.wrongListArr.push("");
    }
    //this.selectedOptionArr.push("");
    this.selectedOptionArr = {};
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

  //button hover events
  hoverFeedbackOK() {
    this.feedbackObj.ok_btn = this.feedbackObj.ok_btn_hover;
  }
  houtFeedbackOK() {
    this.feedbackObj.ok_btn = this.feedbackObj.ok_btn_original;
  }
  hoverFeedbackNxt() {
    this.feedbackObj.feedback_next_btn = this.feedbackObj.feedback_next_btn_hover;
  }
  hoverFeedbackPre() {
    this.feedbackObj.feedback_back_btn = this.feedbackObj.feedback_back_btn_hover;
  }
  hleaveFeedbackNxt() {
    this.feedbackObj.feedback_next_btn = this.feedbackObj.feedback_next_btn_original;
  }
  hleaveFeedbackPre() {
    this.feedbackObj.feedback_back_btn = this.feedbackObj.feedback_back_btn_original;
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

  hoverCloseSubmitConfirmPopup() {
    this.submitConfirmPopupAssets.close_btn = this.submitConfirmPopupAssets.close_btn_hover;
  }
  houtCloseSubmitConfirmPopup() {
    this.submitConfirmPopupAssets.close_btn = this.submitConfirmPopupAssets.close_btn_original;
  }

  hoverCloseSubmitConfirm() {
    this.submitPopupAssets.close_btn = this.submitPopupAssets.close_btn_hover;
  }
  houtCloseSubmitConfirm() {
    this.submitPopupAssets.close_btn = this.submitPopupAssets.close_btn_original;
  }

  hoverClosePopup() {
    this.feedbackObj.close_btn = this.feedbackObj.close_btn_hover;
  }

  houtClosePopup() {
    this.feedbackObj.close_btn = this.feedbackObj.close_btn_original;
  }

  leavePlayPause() {
    if (this.PlayPauseFlag) {
      this.quesObj.quesPlayPause = this.quesObj.quesPauseOriginal;
    }
    else {
      this.quesObj.quesPlayPause = this.quesObj.quesPlayOriginal;
    }
  }

  hoverOK() {
    this.infoPopupAssets.ok_btn = this.infoPopupAssets.ok_btn_hover;
  }

  houtOK() {
    this.infoPopupAssets.ok_btn = this.infoPopupAssets.ok_btn_original;
  }

  hoverOKPop() {
    this.feedbackObj.ok_btn = this.feedbackObj.ok_btn_hover;
  }

  houtOKpop() {
    this.feedbackObj.ok_btn = this.feedbackObj.ok_btn_original;
  }

  hoverSubmitConfirmOKPop() {
    this.submitConfirmPopupAssets.ok_btn = this.submitConfirmPopupAssets.ok_btn_hover;
  }

  houtSubmitConfirmOKpop() {
    this.submitConfirmPopupAssets.ok_btn = this.submitConfirmPopupAssets.ok_btn_original;
  }

  hoverCloseOk() {
    this.infoPopupAssets.close_btn = this.infoPopupAssets.close_btn_hover;
  }
  houtCloseOk() {
    this.infoPopupAssets.close_btn = this.infoPopupAssets.close_btn_original;
  }

  hoverClosePic() {
    this.quesObj.close_btn = this.quesObj.close_btn_hover;
  }
  houtClosePic() {
    this.quesObj.close_btn = this.quesObj.close_btn_original;
  }


  //onclicking the popup buttons
  sendFeedback(ref, flag: string, action?: string) {
    this.appModel.notifyUserAction();
    this.appModel.handlePostVOActivity(false);
    ref.classList = "modal";
    this.instructionDisable = false;
    if(this.nextFeedbackBlinkTimer !== undefined) {
      clearTimeout(this.nextFeedbackBlinkTimer);
    }
    if(this.closeFeedbackmodalTimer !== undefined) {
      clearTimeout(this.closeFeedbackmodalTimer);
    }
    if (action == "replay") {
      this.replayVideo();
    } else if (action == "feedbackDone") {
      console.log("feedback done......");
      if (this.appModel.isLastSectionInCollection) {
        this.appModel.blinkForLastQues();
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
      }
      else {
        this.appModel.moveNextQues();
      }
      this.disableScreen();
      // this.postFeedbackAction();
    } else if (action == "submitAnswer") {
      this.showTestScreen();
      setTimeout(() => {
        this.moveToBox(0, undefined);
      }, 1000);
      // $("#instructionBar").addClass("disable_div");
      this.instructionDisable = true
      this.appModel.enableReplayBtn(false);

    } else if (action == "showAnswerFeedback") {
      //this.postShowAnswer();
    }
    else if (action == 'partialFeedback') {
      this.feedbackInfoAudio.nativeElement.pause();
      this.feedbackInfoAudio.nativeElement.currentTime = 0;
      if (this.charLeft == this.totalChar
        && this.wordArr.length < 12) {
        this.blinkTextBox();
      }
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
        //$("#instructionBar").removeClass("disable_div");
        this.instructionDisable = true;
        // $("#optionsBlock .options").removeClass("disable_div");
      }, 1000);
    }
  }

  replayVideo() {
    this.videoReplayd = true;
    this.isPlayVideo = true;
    this.appModel.navShow = 1;
    //this.appModel.enableSubmitBtn(false);
    this.inputDivRef.nativeElement.classList = "inputDiv";
    //this.instructionBar.nativeElement.classList = "instructionBase";
    clearInterval(this.blinkTimer);
    this.inputDivRef.nativeElement.children[0].style.border = "4px solid #8e7c7c";

    let interval = setInterval(() => {
      if (this.mainVideo && this.mainVideo.nativeElement) {
        clearInterval(interval);
        this.mainVideo.nativeElement.play();
        if (this.QuestionVideo != undefined) {
          this.QuestionVideo.nativeElement.pause();
          this.QuestionVideo.nativeElement.currentTime = 0;
          this.QuestionVideo.nativeElement.load();
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
          //this.instructionBar.nativeElement.classList = "instructionBase";
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
          if (this.videoReplayd) {
            this.QuestionVideo.nativeElement.pause();
            this.QuestionVideo.nativeElement.currentTime = 0;
          }
        }
      }
    }, 100)
    this.instruction.nativeElement.pause();
    this.instruction.nativeElement.currentTime = 0;
  }

  //open Keyboard 
  openKeyBoard() {
    this.inputDivRef.nativeElement.children[0].classList.add("inputKeyboard");
    this.keyBoardOpen = true;
    this.appModel.enableSubmitBtn(false);
    clearInterval(this.blinkTimer);
    // this.instructionBar.nativeElement.style.pointerEvents="";
    this.instructionDisable = false
    // this.inputDivRef.nativeElement.classList = "inputDiv disablePointer";
    this.appModel.notifyUserAction();
    this.appModel.handlePostVOActivity(false);
    this.inputDivRef.nativeElement.children[0].style.border = "4px solid #8e7c7c";
    this.inputFieldText = "";
    if (this.quesObj.lang != 'hindi') {
      //this.inputDivRef.nativeElement.children[0].maxLength = "17";
      this.quesContainer.nativeElement.style.marginTop = 0 + "%";
      this.testContainer.nativeElement.style.marginTop = 0 + "%";
    }
    if (this.quesObj.lang == 'hindi') {
      // this.inputDivRef.nativeElement.children[0].maxLength = "17";
      // this.keyBoardVersion = this.commonAssets.keyboard.New;
      this.quesContainer.nativeElement.style.marginTop = 0 + "%";
      this.testContainer.nativeElement.style.marginTop = 0 + "%";
      this.keyboard = new Keyboard({
        onKeyPress: button => this.onKeyPress(button), layout: this.layout, display: {
          '{bksp}': 'Backspace',
          '{space}': 'Space bar',
          'ॅ': '&nbsp;ॅ',
          '्': '&nbsp;्',
          'ु': '&nbsp;ु',
          '्र': '&nbsp;्र',
          'ौ': '&nbsp;ौ',
          'ै': '&nbsp;ै',
          'ा': '&nbsp;ा',
          'ू': '&nbsp;ू',
          'ः': '&nbsp;ः',
          'ी': '&nbsp;ी',
          'ँ': '&nbsp;ँ',
          '़': '&nbsp;़',
          'ॉ': '&nbsp;ॉ',
          'ो': '&nbsp;ो',
          'े': '&nbsp;े',
          'ि': '&nbsp;ि',
          'ं': '&nbsp;ं',
          'ृ': '&nbsp;ृ',
        },
        buttonTheme:
          [
            {
              class: "hg-red",
              buttons: "क ख ग घ ङ च छ ज झ ञ ट ठ ड ढ ण अ आ इ ई उ ऊ ए ऐ ऑ औ ओ अं अः ऋ ड़ ढ़ त थ द ध न प फ ब भ म य र ल व श स ष ह क्ष श्र त्र ज्ञ ॠ ऍ  ॅ  ॉ"
            },
            {
              class: "hideBtn",
              buttons: "a"
            },
            {
              class: "hg-color_number",
              buttons: "1 2 3 4 5 6 7 8 9 0 - . |"
            },
            {
              class: "hg-color_matra",
              buttons: "् ा ि ी ु ू े ै ो ौ ं ँ ः ्र ृ ़ र्"
            },
            {
              class: "hg-color_spaces",
              buttons: "{bksp} {space}"
            },


          ],
      });
    }
    if (this.layout == "mathLayout") {
      this.mathKeyboardRef.nativeElement.classList = "simple-keyboard hg-theme-default hg-layout-default mathTop";
    } else {
      if (this.quesObj.lang != 'hindi') {

        this.keyboard = new Keyboard({ onKeyPress: button => this.onKeyPress(button), layout: this.layout });
      }
      if (this.quesObj.lang == "eng") {
        for (let i = 0; i < this.disablebtnarrEng.length; i++) {
          if (this.disablebtnarrEng[i] == "{space}") {
            (this.keyboard.getButtonElement(this.disablebtnarrEng[i]) as HTMLElement).children[0].innerHTML = "Space bar";
          } else if (this.disablebtnarrEng[i] == "{shift}") {
            if (this.keyboard.getButtonElement(this.disablebtnarrEng[i]) != undefined) {
              for (var j = 0; j < 2; j++) {
                (this.keyboard.getButtonElement(this.disablebtnarrEng[i])[j] as HTMLElement).classList.add("disableDiv");
              }
            }
          } else {
            if (this.keyboard.getButtonElement(this.disablebtnarrEng[i]) != undefined) {
              (this.keyboard.getButtonElement(this.disablebtnarrEng[i]) as HTMLElement).classList.add("disableDiv");
            }
          }
        }
      }

    }
    //this.appModel.enableReplayBtn(this.playMyVideo);
    console.log(this.inputDivRef.nativeElement.children[0]);
    this.stopInstructionVO();
    if (this.QuestionVideo != undefined && this._questionAreaVideoFlag == true) {
      this.QuestionVideo.nativeElement.pause();
      this.QuestionVideo.nativeElement.currentTime = 0;
      //this.QuestionVideo.nativeElement.load();
    }
    // if(this.quesObj.lang == "eng") {
    // (document.getElementsByClassName("simple-keyboard hg-theme-default hg-layout-default")[0].lastChild.children[1].children[0] as HTMLElement).innerHTML="Space bar";
    // //spacebarText.innerHTML="Space bar";
    // }
    let inp = this.inputVal;
    this.inputVal = "";
    setTimeout(() => {
      this.inputVal = inp
      if (inp && inp.length > 0) {
        this.addBtnRef.nativeElement.style.opacity = "1";
      }
    }, 10);
  }

  //adding a word
  addWord() {
    // this.instructionBar.nativeElement.style.pointerEvents="";
    // for (let i = 0; i < document.getElementsByClassName("submitBtn").length; i++) {
    //   document.getElementsByClassName("submitBtn")[i].classList.remove("FakedisableDiv");
    //   }
    this.instructionDisable = false;
    this.appModel.notifyUserAction();
    this.charLeft = this.totalChar;
    this.currentChar = 0;
    this.appModel.handlePostVOActivity(false);
    this.inputDivRef.nativeElement.classList = "inputDiv";
    this.inputFieldText = this.commonAssets.inputFieldText.info;
    this._addWordFlag = true;
    if (this.quesObj.lang != 'math') {
      let wordObj = {
        time: new Date().getTime(),
        word: this.inputVal,
        state: "wordBox"
      }
      this.wordArr.push(wordObj);

      if (this.keyboard != undefined) {
        this.keyboard.clearInput();
        this.keyboard.destroy();
      }

      this.inputVal = "";
      this.btnCounting = 0;
      this.addBtnRef.nativeElement.style.opacity = "0.5";
      this.disableaddbtnPointer = true;
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
          state: "wordBox",
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
    if (this.QuestionVideo != undefined && this._questionAreaVideoFlag == true) {
      this.QuestionVideo.nativeElement.pause();
      this.QuestionVideo.nativeElement.currentTime = 0;
      //this.QuestionVideo.nativeElement.load();
    }
    this.onBlurMethod();
    if (this.wordArr.length == 12) {
      this.inputDivRef.nativeElement.classList = "inputDiv disablePointer";
      this.inputDivRef.nativeElement.children[1].classList = "charleft d-none";
      this.inputFieldText = "";
    }
    this.keyBoardOpen = false;
  }

  //showing second test screen
  showTestScreen() {
    this.controlHandler.isSubmitRequired = false;
    this.appModel.handleController(this.controlHandler);
    this.isSecondScreen = true;
    this.noAttempts = this.wordArr.length;
    this.testContainerDisable = true;
    this.testContainer.nativeElement.classList = "testContainer d-flex flex-row justify-content-center align-items-center";
    this.quesContainer.nativeElement.classList = "quesContainer flex-row justify-content-center align-items-center";
    this.quesContainer.nativeElement.classList = "quesContainer flex-row justify-content-center align-items-center hideTestScreen";
    this.wordBlockRef.nativeElement.classList = "wordBlock";
    this.appModel.enableSubmitBtn(false);
  }

  //moving boxes
  moveToBox(idx, word) {
    this.selectedIdx = idx;
    this.wordArr[this.selectedIdx].state = "actionBox";
    this.wordBlockRef.nativeElement.classList = "wordBlock disableIt";
    this.appModel.notifyUserAction();
    this.appModel.handlePostVOActivity(false);
    this.instructionDisable = true;
  }

  //on animation finish function
  onAnimationEvent(event: AnimationEvent) {
    console.log(event, "yhi par hun--------->.>>>>>>");
    if (event.fromState == "wordBox" && event.toState == "actionBox" && event.phaseName == "done") {
      this.testContainerDisable = false;
      this.instructionDisable = false;
      this.pushToTestBox(this.selectedIdx, this.wordArr[this.selectedIdx].word);
    }
    if (event.fromState == "actionBox" && event.toState == "testBox" && event.phaseName == "done") {
      if (this.listtype == "rightList") {
        this.pushToRightList();
      }
      if (this.listtype == "wrongList") {
        this.pushToWrongList();
      }
      this.counter++;
      setTimeout(() => {
        this.testContainerDisable = false;
        if (this.wordArr.length !== this.counter) {
          this.moveToBox(this.counter, undefined);
        }
      }, 500);
    }
  }

  focussing() {
    console.log("wrongList...............--------->>>>>>>>>>>>..")
    let inp = this.inputVal;
    this.inputVal = "";
    this.inputVal = inp
  }

  //adding word to wrong list
  addToWrongList() {
    this.stopInstructionVO();
    this.instructionDisable = true
    this.listtype = "wrongList";
    this.testContainerDisable = true;
    this.selectedOptionArr.state = "testBox";
    let from = this.optionPlaceRef.nativeElement.getBoundingClientRect();
    let to = this.selectedWrongListRef.nativeElement.children[this.currentWrongListIdx].getBoundingClientRect();
    this.optionPlaceRef.nativeElement.style.zIndex = "100";
    this.selectedOptionArr.toTestBoxleft = this.wrongPosArray[this.currentWrongListIdx].left;
    this.selectedOptionArr.toTestBoxtop = this.wrongPosArray[this.currentWrongListIdx].top;
    //$(this.optionPlaceRef.nativeElement).animate({ left: (to.left - (from.left)+22), top: (to.top - (from.top)+10), width: to.width }, 500, () => this.pushToWrongList());
    //$(this.optionPlaceRef.nativeElement.children[1]).animate({"font-size": "0.9vmax"}, 500);
    this.wordBlockRef.nativeElement.classList = "wordBlock";
    this.appModel.notifyUserAction();
    this.appModel.handlePostVOActivity(false);
  }

  //adding word to right list
  addToRightList() {
    this.stopInstructionVO();
    this.instructionDisable = true
    this.listtype = "rightList";
    this.testContainerDisable = true;
    this.selectedOptionArr.state = "testBox";
    let from = this.optionPlaceRef.nativeElement.getBoundingClientRect();
    // let to = this.selectedRightListRef.nativeElement.children[this.currentRightListIdx].getBoundingClientRect();
    let to = this.DummyRightListRef.nativeElement.children[this.currentRightListIdx].getBoundingClientRect();
    this.selectedOptionArr.toTestBoxleft = this.rightPosArray[this.currentRightListIdx].left;
    this.selectedOptionArr.toTestBoxtop = this.rightPosArray[this.currentRightListIdx].top;
    //this.toTestBoxwidth = to.width;
    //$(this.optionPlaceRef.nativeElement).animate({ left: (to.left - (from.left)+22), top: (to.top - (from.top)+10), width: to.width }, 500, () => this.pushToRightList());
    //$(this.optionPlaceRef.nativeElement.children[1]).animate({"font-size": "0.9vmax"}, 500);
    this.wordBlockRef.nativeElement.classList = "wordBlock";
    this.appModel.notifyUserAction();
    this.appModel.handlePostVOActivity(false);
  }

  pushToTestBox(idx, word) {
    this.wordArr[idx].word = "";
    this.selectedOptionArr.text = word;
    this.selectedOptionArr.state = this.wordArr[idx].state;
    this.noAttempts--;
    // $("#optionPlaceId").addClass("animateWidth");
  }

  pushToRightList() {
    let copyTxt = JSON.parse(JSON.stringify(this.selectedOptionArr.text));
    this.selectedOptionArr.text = "";
    this.rightListArr[this.currentRightListIdx] = copyTxt;
    this.currentRightListIdx++;
    if (this.noAttempts == 0) {
      this.testContainerDisable = true;
      this.feedbackTimer = setTimeout(() => {
        this.openModal();
      }, 3000)

    }

    // this.feedbackAudio = this.feedbackObj.right_sound;
    // this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
    // this.feedbackPopupAudio.nativeElement.play();

  }

  pushToWrongList() {
    let copyTxt = JSON.parse(JSON.stringify(this.selectedOptionArr.text));
    this.selectedOptionArr.text = "";
    this.wrongListArr[this.currentWrongListIdx] = copyTxt;
    this.currentWrongListIdx++;
    if (this.noAttempts == 0) {
      this.testContainerDisable = true;
      this.feedbackTimer = setTimeout(() => {
        this.openModal();
      }, 3000)
    }
    // this.feedbackAudio = this.feedbackObj.wrong_sound;
    // this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
    // this.feedbackPopupAudio.nativeElement.play();

  }

  openModal() {
    this.appModel.stopAllTimer();
    if (this.rightListArr && this.rightListArr[0] == "") {
      this.currentPlaying = "wrongList";
      this.selectedListArr = this.wrongListArr;
      this.feedbackObj.showBox = this.feedbackObj.incorrect_box;
    } else {
      this.currentPlaying = "rightList";
      this.selectedListArr = this.rightListArr;
      this.feedbackObj.showBox = this.feedbackObj.corect_box;
    }
    this.feedbackModal.nativeElement.classList = "modal displayPopup";
    if((this.rightListArr[0] == "" && this.wrongListArr[0] != "") || (this.wrongListArr[0] == "" && this.rightListArr[0] != "")) {
      this.startCloseFeedbackTimer();
    } else {
      this.startNextFeedbackTimer();
    }
    this.infoModal = false;
    this.stopInstructionVO();
  }

  //on clicking numbers
  numberClick(num) {
    this.appModel.notifyUserAction();
    this.stopInstructionVO();
    if (this.currentChar < this.totalChar) {
      this.charLeft = this.charLeft - 1
      this.currentChar = this.currentChar + 1;
    }

    // this.instructionBar.nativeElement.style.pointerEvents="";
    this.instructionDisable = false;
    let editedStr = this.inputVal + "" + num;
    if (this.btnCounting < this.totalChar) {
      this.onChange(editedStr);
      this.btnCounting += 1;
    }

    this.addBtnRef.nativeElement.style.opacity = "1";
    this.disableaddbtnPointer = false;
  }

  //on clicking operator
  operatorClick(operator) {
    this.appModel.notifyUserAction();
    if (this.currentChar < this.totalChar) {
      this.charLeft = this.charLeft - 1
      this.currentChar = this.currentChar + 1;
    }
    this.stopInstructionVO();
    let editedStr = this.inputVal + "" + operator;
    if (this.btnCounting < this.totalChar) {
      this.onChange(editedStr);
      this.btnCounting += 1;
    }

    this.addBtnRef.nativeElement.style.opacity = "1";
    this.disableaddbtnPointer = false;

  }

  /*
    spaceClick() {
      let editedStr = this.inputVal + " ";
      this.onChange(editedStr);
    }
  */

  //on clicking tab
  tabClick() {
    let editedStr = this.inputVal + " ";
    if (this.btnCounting < this.totalChar) {
      this.onChange(editedStr);
      this.btnCounting += 1;
    }

  }

  //deleting a word
  deleteElement() {
    this.stopInstructionVO();
    if (this.charLeft < this.totalChar) {
      this.currentChar = this.currentChar - 1;
      this.charLeft = this.charLeft + 1
    }
    if (this.btnCounting > 0) {
      this.btnCounting -= 1;
      let editedStr = this.inputVal.substr(0, this.inputVal.length - 1);
      this.onChange(editedStr);

    }
    this.onBlurMethod();
  }

  //to disable screen
  disableScreen() {
    //this.inputDivRef.nativeElement.children[0].setSelectionRange(this.inputVal.length-1,0);
    this.bodyContent.nativeElement.classList = "bodyContent disableDiv";
    this.instructionBar.nativeElement.classList = "instructionBase disableDiv";
    this.appModel.enableReplayBtn(false);
    clearInterval(this.blinkTimer);
    this.everythingenabled = false;
    this.inputDivRef.nativeElement.classList = "inputDiv disablePointer"
    this.onBlurMethod();
    this.appModel.notifyUserAction();
  }

  blinkTextBox() {
    if (!this.keyBoardOpen) {
      document.getElementById("instructionBarFeedback").focus();
      this.blinkTimer = setInterval(() => {
        if (this.blinkFlag) {
          this.inputDivRef.nativeElement.children[0].style.border = "4px solid #8e7c7c";
          this.blinkFlag = false;
        } else {
          this.inputDivRef.nativeElement.children[0].style.border = "4px solid yellow";
          this.blinkFlag = true;
        }
      }, 500)
    }

  }

  stopInstructionVO() {
    if (!this.instruction.nativeElement.paused) {
      this.instruction.nativeElement.currentTime = 0;
      this.instruction.nativeElement.pause();
    }
  }

  //for old keyboard
  // hoverRow1(event) {
  //   for (let i = 0; i < this.keyBoard1[0].row1.length; i++) {
  //     this.Row1.nativeElement.children[i].style.left = this.keyBoard1[0].row1[i].left + "%";
  //   }
  // }

  // hoverRow2(event) {
  //   for (let i = 0; i < this.keyBoard1[0].row2.length; i++) {
  //     this.Row2.nativeElement.children[i].style.left = this.keyBoard1[0].row2[i].left + "%";
  //   }
  // }

  // hoverRow3(event) {
  //   for (let i = 0; i < this.keyBoard1[0].row3.length; i++) {
  //     this.Row3.nativeElement.children[i].style.left = this.keyBoard1[0].row3[i].left + "%";
  //     this.Row3.nativeElement.children[i].style.top = this.keyBoard1[0].row3[i].top + "%";
  //   }
  // }


  // hoverbtmRow(event) {
  //   for (let i = 0; i < this.keyBoard1[0].btmRow.length; i++) {
  //     this.BtmRow.nativeElement.children[i].style.left = this.keyBoard1[0].btmRow[i].left + "%";
  //     this.BtmRow.nativeElement.children[i].style.width = this.keyBoard1[0].btmRow[i].width + "%";
  //   }
  // }

  // hovernumPad(event) {
  //   for (let i = 0; i < this.keyBoard1[0].numPadArray.length; i++) {
  //     this.NumPad.nativeElement.children[i].style.left = this.keyBoard1[0].numPadArray[i].left + "%";
  //     this.NumPad.nativeElement.children[i].style.top = this.keyBoard1[0].numPadArray[i].top + "%";
  //     this.NumPad.nativeElement.children[i].style.width = this.keyBoard1[0].numPadArray[i].width + "%";
  //   }
  // }


  //click event to capture what btn was clicked old keyboard
  // clickBtn(id, opt) {
  //   this.appModel.notifyUserAction();
  //   this.appModel.handlePostVOActivity(false);
  //   if (id == "Normal") {
  //     this.matraBtnOn = false;
  //     this.matraRepeatArr = [];
  //     this.matraCounter = 0;
  //     for (let y = 0; y < this.rowIndex2.length; y++) {
  //       document.getElementById("index" + y).style.display = "none";
  //     }
  //     for (let y = 0; y < this.rowIndex3.length; y++) {
  //       document.getElementById("consonent" + y).style.display = "none";
  //     }

  //     for (let i = 0; i < this.rowIndex1.length; i++) {
  //       this.Row1.nativeElement.children[i].classList.remove("highlight");
  //     }
  //   }
  //   else if (id == "Spacebar") {
  //     if (this.CharacterCounter >= this.maxCharacter) {
  //        return;
  //      }
  //     this.inputDivRef.nativeElement.children[0].value += " ";
  //     this.hindiKeyboardArray.push(" ");
  //     this.CharacterCounter += 1;
  //   }
  //   else if (id == "Clear") {
  //     this.inputFieldText = this.commonAssets.inputFieldText.info;
  //     this.inputDivRef.nativeElement.children[0].value = this.inputFieldText;
  //     this.hindiKeyboardArray = [];
  //     this.CharacterCounter = 0;
  //     this.inputVal = "";
  //   }
  //   else if (id == "Backspace") {
  //     this.hindiKeyboardArray.splice(this.hindiKeyboardArray.length - 1, 1);
  //     this.inputDivRef.nativeElement.children[0].value = this.hindiKeyboardArray.join("");
  //     this.inputVal = String(this.hindiKeyboardArray.join(""));
  //     console.log("this.inputVal = " + this.inputVal);
  //     if (this.CharacterCounter > 0) {
  //       this.CharacterCounter -= 1;
  //     }

  //   }
  //   else {
  //     if (this.CharacterCounter >= this.maxCharacter) {
  //       return;
  //     }
  //     if (this.matraBtnOn == true) {

  //       this.inputDivRef.nativeElement.children[0].value += opt.matras[this.currentMatraNumber].matra;
  //       this.hindiKeyboardArray.push(opt.matras[this.currentMatraNumber].matra);
  //       this.addBtnRef.nativeElement.style.opacity = "1";
  //       this.disableaddbtnPointer = false;

  //     }
  //     else {
  //       this.inputDivRef.nativeElement.children[0].value += id;
  //       this.hindiKeyboardArray.push(id);
  //       this.addBtnRef.nativeElement.style.opacity = "1";
  //       this.disableaddbtnPointer = false;

  //     }
  //     this.inputVal = String(this.hindiKeyboardArray.join(""));
  //     console.log("this.inputVal = " + this.inputVal);
  //     this.CharacterCounter += 1;

  //   }

  //   if (this.QuestionVideo != undefined && this._questionAreaVideoFlag == true) {
  //     this.QuestionVideo.nativeElement.pause();
  //     this.QuestionVideo.nativeElement.currentTime = 0;
  //   }

  // }

  // old hindi keyboard
  // clickBtnMatra(id, opt, evnt) {

  //   this.currentMatraNumber = id;
  //   this.appModel.notifyUserAction();
  //   this.appModel.handlePostVOActivity(false);

  //   for (let y = 0; y < this.rowIndex2.length; y++) {
  //     document.getElementById("index" + y).style.display = "block";
  //     document.getElementById("index" + y).style.left = this.rowIndex2[y].left + "%";
  //   }

  //   for (let y = 0; y < this.rowIndex3.length; y++) {

  //     if (this.rowIndex3[y].matras[this.currentMatraNumber].matra == "") {
  //       document.getElementById("consonent" + y).style.display = "block";
  //       document.getElementById("consonent" + y).style.left = this.rowIndex3[y].left + "%";
  //       document.getElementById("consonent" + y).style.top = this.rowIndex3[y].top + "%";
  //     }
  //     else {
  //       document.getElementById("consonent" + y).style.display = "none";
  //     }

  //   }


  //   for (let i = 0; i < this.rowIndex1.length; i++) {
  //     this.Row1.nativeElement.children[i].classList.remove("highlight");
  //   }
  //   this.Row1.nativeElement.children[id].classList.add("highlight");

  //   this.matraBtnOn = true;
  //   this.matraRepeatArr.push(id);
  //   this.matraCounter += 1;
  //   if (this.matraRepeatArr[0] == this.matraRepeatArr[1]) {
  //     this.matraBtnOn = false;
  //     this.matraRepeatArr = [];
  //     this.matraCounter = 0;
  //     this.Row1.nativeElement.children[id].classList.remove("highlight");
  //     for (let y = 0; y < this.rowIndex2.length; y++) {
  //       document.getElementById("index" + y).style.display = "none";
  //     }
  //     for (let y = 0; y < this.rowIndex3.length; y++) {
  //       document.getElementById("consonent" + y).style.display = "none";
  //     }
  //   }
  //   else {
  //     if (this.matraCounter > 1) {
  //       this.matraRepeatArr.shift();
  //     }
  //   }
  //   if (this.QuestionVideo != undefined && this._questionAreaVideoFlag == true) {
  //     this.QuestionVideo.nativeElement.pause();
  //     this.QuestionVideo.nativeElement.currentTime = 0;
  //   }
  // }


  //video related funtions
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
    this.mainVideo.nativeElement.parentElement.style.visibility = "hidden";
    this.appModel.navShow = 2;
    this.appModel.setLoader(false);
    this.appModel.startPreviousTimer();
  }

  endedHandleronSkip() {
    this.isDisableClass = true;
    document.getElementById("navBlock").style.pointerEvents = "none";
    this.mainVideo.nativeElement.parentElement.style.visibility = "hidden";
    setTimeout(() => {
      document.getElementById("navBlock").style.pointerEvents = "";
    }, 500);
    // this.videoReplayd = false;
    if (this.mainVideo && this.mainVideo.nativeElement) {
      this.mainVideo.nativeElement.currentTime = 0;
      this.mainVideo.nativeElement.pause();
    }
    this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
    this.appModel.startPreviousTimer();
    this.appModel.notifyUserAction();
  }

  endedHandleronClose() {
    this.isDisableClass = true;
    document.getElementById("navBlock").style.pointerEvents = "none";
    setTimeout(() => {
      this.fullImage.nativeElement.parentElement.style.visibility = "hidden";
    }, 200);
    setTimeout(() => {
      document.getElementById("navBlock").style.pointerEvents = "";
    }, 500);
    if(this.firstLoad){
      console.log("first time wala h")
      this.firstLoad = false;
      clearTimeout(this.videoPlaytimer)
      this.appModel.handlePostVOActivity(false);
      this.blinkTextBox();
      this.firstLoad = false;
      this.instructionDisable = false;
      this.questAreaDisable = false;
      // this.fullImage.nativeElement.parentElement.style.visibility = "hidden";
      this.inputDivRef.nativeElement.classList = "inputDiv";
    }
    clearTimeout(this.videoPlaytimer)
    this.appModel.startPreviousTimer();
    this.appModel.notifyUserAction();
    this.quesObj.close_btn = this.quesObj.close_btn_original;
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
    this.skipBtn.nativeElement.style.cursor="pointer";
  }
  
  houtSkip() {
    this.skipBtn.nativeElement.style.cursor="default";
    console.log("yeaaaaaahhhhnnnnn")
    this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;

  }

  keyPress() {
    return false;
  }

  onKeydownMain(ev) {
    ev.preventDefault();
  }

  QuestionLoaded() {
    if (this.inputVal == "" && !this.videoReplayd) {
      if (this.quesObj.quesInstruction && this.quesObj.quesInstruction.autoPlay) {        
        //this.quesContainer.nativeElement.style.pointerEvents="none";
        this.instruction.nativeElement.play();
        this.questAreaDisable = true;

        this.instruction.nativeElement.onended = () => {
          this.checkinputnull();
        }
      } else {
        //this.quesContainer.nativeElement.style.pointerEvents="none";
        this.questAreaDisable = true;

        this.checkinputnull();
      }
    }
    else {
      this.checkinputnull();
    }

  }

  //initialising a question
  checkinputnull() {
    this.appModel.handlePostVOActivity(true);
    this.appModel.enableReplayBtn(this.playMyVideo);
    //this.inputDivRef.nativeElement.classList = "inputDiv";
    this.appModel.notifyUserAction();
    this.appModel.handlePostVOActivity(false);
    if (this.mainVideo != undefined && this._playInstructionFlag == false && this._questionAreaVideoFlag == true && this.videoReplayd == false) {
      this.inputDivRef.nativeElement.classList = "inputDiv disablePointer";
      this.videoPlaytimer = setTimeout(() => {
        this.mainVideo.nativeElement.parentElement.style.visibility = "visible";
        this.mainVideo.nativeElement.play();
        this.appModel.handlePostVOActivity(false);
        this.alldisabledwhilequestionVideoPlay();
        this.appModel.stopAllTimer();
        this.mainVideo.nativeElement.onended = () => {
          this.appModel.notifyUserAction();
          this.hoverControl();
          //this.mainVideo.nativeElement.parentElement.style.visibility = "hidden";
          this.instructionDisable = false;
          this.isPlayVideo = false;
          this.blinkTextBox();
          //this.quesContainer.nativeElement.style.pointerEvents="";
          this.questAreaDisable = false;
          this.appModel.handlePostVOActivity(false);
          this.inputDivRef.nativeElement.classList = "inputDiv";
          this.allEnabledwhilequestionVideoPlay();
          this.mainVideo.nativeElement.pause();
          this.mainVideo.nativeElement.currentTime = 0;
          this.quesContainer.nativeElement.style.pointerEvents = "none";      

          //this.QuestionVideo.nativeElement.load();
        }
      }, this.quesObj.timegap);
    }
    if (this._questionAreaAudioFlag) {
      this._setQuestionAudio = this._questionAreaAudio;
      this.QuestionAudio.nativeElement.src = this._questionAreaAudio.img_audio.url + "?someRandomSeed=" + Math.random().toString(36);
      setTimeout(() => {
        this.displayWave = true;
        this.QuestionAudio.nativeElement.play();
        this.inputDivRef.nativeElement.classList = "inputDiv disablePointer";
        this.QuestionAudio.nativeElement.onended = () => {
          this.displayWave = false;
          this.blinkTextBox();
          this.instructionDisable = false;
          this.inputDivRef.nativeElement.classList = "inputDiv";
          this.quesContainer.nativeElement.style.pointerEvents = "none";      
          //this.instructionBar.nativeElement.classList = "instructionBase";
          //this.quesContainer.nativeElement.style.pointerEvents="";
          this.questAreaDisable = false;

        }
      }, this.quesObj.timegap);
    } else if (this.QuestionVideo != undefined && this.videoReplayd == false && this._playInstructionFlag == false) {
      this.QuestionVideo.nativeElement.play();
      this.appModel.handlePostVOActivity(false);
      this.alldisabledwhilequestionVideoPlay();
      this.inputDivRef.nativeElement.classList = "inputDiv disablePointer";
      this.QuestionVideo.nativeElement.onended = () => {
        this.inputDivRef.nativeElement.classList = "inputDiv";
        this.quesContainer.nativeElement.style.pointerEvents = "none";      
      }
    } else if (this._questionAreaImageFlag || this._questionAreaTextFlag) {
      //this.quesContainer.nativeElement.style.pointerEvents="";
      this.appModel.stopAllTimer();
      this.fullImage.nativeElement.parentElement.style.visibility = "visible";
      this.instruction.nativeElement.pause();
      this.instruction.nativeElement.currentTime = 0;
      this.inputDivRef.nativeElement.classList = "inputDiv disablePointer";
      this.videoPlaytimer = setTimeout(() => {
        this.appModel.handlePostVOActivity(false);
        this.blinkTextBox();
        this.firstLoad = false;
        this.instructionDisable = false;
        this.questAreaDisable = false;
        //this.fullImage.nativeElement.parentElement.style.visibility = "hidden";
        this.hoverControlImage();
        this.inputDivRef.nativeElement.classList = "inputDiv";
        this.quesContainer.nativeElement.style.pointerEvents = "none";      
      }, this.quesObj.timegapImage);

      // this.inputDivRef.nativeElement.classList = "inputDiv";
      // this.questAreaDisable = false;
      // this.instructionDisable = false;
      // this.blinkTextBox();
    }
    //this.blinkOnLastQues();
    this.appModel.handlePostVOActivity(false);
    if (this.inputVal == "" && this._questionAreaVideoFlag != true && !this.videoReplayd) {
      //this.blinkTextBox();
    }
    this.appModel.notifyUserAction();
    this.appModel.handlePostVOActivity(false);
    if (this._addWordFlag == true) {
      this.appModel.enableSubmitBtn(true);
    }
  }

  onclickImageorVideo() {
    if (this._questionAreaVideoFlag) {
      this.isDisableClass = false;
      this.appModel.stopAllTimer();
      console.log("show video")
      this.quesObj.quesPlayPause = this.quesObj.quesPause;
      this.mainVideo.nativeElement.parentElement.style.visibility = "visible";
      this.videoReplayd = true;
      this.instruction.nativeElement.pause();
      this.instruction.nativeElement.currentTime = 0;
      this.instructionDisable = false;
      this.mainVideo.nativeElement.play();
      this.mainVideo.nativeElement.onended = () => {
        this.videoReplayd = false;
        this.appModel.notifyUserAction();
        this.mainVideo.nativeElement.currentTime = 0;
        //this.mainVideo.nativeElement.parentElement.style.visibility = "hidden";
        this.hoverControl();
        this.quesContainer.nativeElement.style.pointerEvents = "none";      

      }
    }
    else {
      this.instructionDisable = false
      this.isDisableClass = false;
      this.appModel.stopAllTimer();
      this.fullImage.nativeElement.parentElement.style.visibility = "visible";
      this.instruction.nativeElement.pause();
      this.instruction.nativeElement.currentTime = 0;
      this.videoPlaytimer = setTimeout(() => {
        this.appModel.startPreviousTimer();
        this.appModel.notifyUserAction();
        // this.fullImage.nativeElement.parentElement.style.visibility = "hidden";
        this.hoverControlImage();
        this.quesContainer.nativeElement.style.pointerEvents = "none";      
      }, this.quesObj.timegapImage);
    }
  }


  hoverPlayPause() {
    if (this.PlayPauseFlag) {
      this.quesObj.quesPlayPause = this.quesObj.quesPauseHover;
    }
    else {
      this.quesObj.quesPlayPause = this.quesObj.quesPlayHover;
    }
  }



  questionAudioPlay() {
    if (this.QuestionAudio != undefined) {
      this.stopInstructionVO();
      this.appModel.notifyUserAction();
      this.instructionDisable = false;
      this._setQuestionAudio = this._questionAreaAudio;
      this.QuestionAudio.nativeElement.src = this._questionAreaAudio.img_audio.url + "?someRandomSeed=" + Math.random().toString(36);
      this.displayWave = true;
      this.speakerdisable = true;
      this.questAreaDisable = true;
      this.QuestionAudio.nativeElement.play();
      this.questAreaDisable = true
      this.QuestionAudio.nativeElement.onended = () => {
        this.hoverquesArea();
        this.questAreaDisable = false
        this.displayWave = false;
        this.speakerdisable = false;
        this.questAreaDisable = false;
      }
    }
  }

  //disable screen functions
  alldisabledwhilequestionVideoPlay() {
    // $("#instructionBar").addClass("disable_div");
    this.instructionDisable = true
    this.appModel.enableReplayBtn(false);
  }
  allEnabledwhilequestionVideoPlay() {
    // $("#instructionBar").removeClass("disable_div");
    this.instructionDisable = false;
    this.appModel.enableReplayBtn(true);
  }

  closeKeyboard() {
    this.stopInstructionVO();
    this.instructionDisable = false
    if (this.QuestionAudio && this.QuestionAudio.nativeElement) {
      this.QuestionAudio.nativeElement.pause();
      this.QuestionAudio.nativeElement.currentTime = 0;
    }
    this.displayWave = false;
    this.speakerdisable = false;
    this.questAreaDisable = false;
    this.quesObj.close_btn = this.quesObj.close_btn_original;
    this.mathKeyboardRef.nativeElement.classList = "simple-keyboard hg-theme-default hg-layout-default hideKeyboard";
    this.keyBoardOpen = false;
    if (this.wordArr && this.wordArr.length > 0) {
      this.appModel.enableSubmitBtn(true);
    }
  }

  hoverquesArea() {
    if (this.questAreaDisable) {
      this.refques.nativeElement.style.pointerEvents = "none";
      this.refques.nativeElement.style.cursor = "default";

    }
    else {
      this.refques.nativeElement.style.pointerEvents = "";
      this.refques.nativeElement.style.cursor = "pointer";
    }
  }

  hoverInputArea(){
    console.log("hovering input area")
    this.quesContainer.nativeElement.style.pointerEvents = "";
  }

  prevFeedback() {
    this.currentPlaying = "rightList";
    this.selectedListArr = this.rightListArr;
    this.feedbackObj.showBox = this.feedbackObj.corect_box;
    clearTimeout(this.closeFeedbackmodalTimer);
    this.startNextFeedbackTimer();
    this.feedbackObj.feedback_next_btn = this.feedbackObj.feedback_next_btn_original;
    this.feedbackObj.feedback_back_btn = this.feedbackObj.feedback_back_btn_original;
  }
  nextFeedback() {
    this.currentPlaying = "wrongList";
    this.selectedListArr = this.wrongListArr;
    this.feedbackObj.showBox = this.feedbackObj.incorrect_box;
    clearTimeout(this.nextFeedbackBlinkTimer);
    clearInterval(this.nextBtnInterval);
    this.startCloseFeedbackTimer();
    this.feedbackObj.feedback_next_btn = this.feedbackObj.feedback_next_btn_original;
    this.feedbackObj.feedback_back_btn = this.feedbackObj.feedback_back_btn_original;
  }

  /******** Timer for moving to next feedback popup screen ********/
  startNextFeedbackTimer() {
    this.setBlinkOnNextBtn();
    this.nextFeedbackBlinkTimer = setTimeout(() => {
      console.log("nextfeedbacktimer",this.feedbackObj.feedbackNextBlinkDelayInSec * 1000);
      this.nextFeedback();
    }, this.feedbackObj.feedbackNextBlinkDelayInSec * 1000);
  }

  /******** Timer for closing feedback popup ********/
  startCloseFeedbackTimer() {
    this.closeFeedbackmodalTimer = setTimeout(() => {
      console.log("closetimer", this.feedbackObj.feedbackCloseInSec * 1000);
      this.sendFeedback(this.feedbackModal.nativeElement,'no','feedbackDone');
    }, this.feedbackObj.feedbackCloseInSec * 1000);
  }

  setBlinkOnNextBtn() {
    let flag = true;
    this.nextBtnInterval = setInterval(() => {
        if (flag) {
            this.feedbackObj.feedback_next_btn = this.feedbackObj.feedback_next_btn_blink2;
            flag = false;
        } else {
            this.feedbackObj.feedback_next_btn = this.feedbackObj.feedback_next_btn_blink1;
            flag = true;
        }
    }, 300)
}

hoverInput(){
  if(this.keyBoardOpen){
    this.inputDivRef.nativeElement.classList = "inputDiv disablePointer";
  }
  else{
    this.inputDivRef.nativeElement.classList = "inputDiv ";
  }
}

  hoverControl() {
    this.isDisableClass = true;
    document.getElementById("navBlock").style.pointerEvents = "none";
    setTimeout(() => {
      document.getElementById("navBlock").style.pointerEvents = "";
    }, 1000);
    setTimeout(() => {
      this.mainVideo.nativeElement.parentElement.style.visibility = "hidden";
      this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
    }, 200);
  }

  hoverControlImage() {
    this.isDisableClass = true;
    document.getElementById("navBlock").style.pointerEvents = "none";
    setTimeout(() => {
      document.getElementById("navBlock").style.pointerEvents = "";
    }, 1000);
    setTimeout(() => {
      this.fullImage.nativeElement.parentElement.style.visibility = "hidden"
      this.quesObj.close_btn = this.quesObj.close_btn_original;
    }, 200);
  }

}
