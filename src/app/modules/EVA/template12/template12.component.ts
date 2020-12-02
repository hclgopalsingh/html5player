import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { SharedserviceService } from '../../../common/services/sharedservice.service';
import { PlayerConstants } from '../../../common/playerconstants';

@Component({
  selector: 'app-template12',
  templateUrl: './template12.component.html',
  styleUrls: ['./template12.component.scss']
})
export class Template12Component implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  blink: boolean = false;
  commonAssets: any = "";
  rightPopup: any;
  wrongPopup: any;
  myoption: any = [];
  feedback: any = "";
  isLastQues: boolean = false;
  isAutoplayOn: boolean;
  isLastQuesAct: boolean;
  noOfImgs: number;
  noOfImgsLoaded: number = 0;
  containgFolderPath: string = "";
  assetsPath: string = "";
  loadFlag: boolean = false;
  quesObj: any;
  confirmAssets: any;
  feedbackAssets: any;
  isPlayVideo: boolean;
  videoReplayd: boolean = false;
  attemptType: string = "";
  attemptTypeClose: string = "";
  correctOpt: any = '';
  isVideoLoaded: boolean = false;
  optionArr: any = [];
  currentIdx: number = 0;
  wrongCounter: number = 0;
  instructiontext: string;
  timernextseg: any = "";
  idArray: any = [];
  speaker: any;
  speakerVolume: any;
  tempSubscription: Subscription;
  correct_ans_index: any = [];
  speakerTimer: any;
  showAnswerPopup: any;
  showAnswerVO: any;
  ifRightAns: boolean = false;
  popupAssets: any;
  showAnswerSubscription: any;
  answerImageBase: any;
  answerImage: any;
  answerImagelocation: any;
  popupIcon: any;
  popupIconLocation: any;
  isPopupClosed: boolean = false;
  lastQuestionCheck: any;
  popupclosedinRightWrongAns: boolean = false;
  ifWrongAns: boolean = false;
  popupTime: any;
  LastquestimeStart: boolean = false;
  correctAnswerCounter: number = 0;
  correctAnswersArray: any = [];
  selectedAnswersArray: any = [];
  correctAnswerObj: any = {};
  correctAnswerCount: any = 0;
  clappingTimer: any;
  multiCorrectTimer: any;
  multiCorrectPopup: any;
  rightTimer: any;
  audio = new Audio();
  selectedIndex: any;
  rightAnswerPopup: any;
  showAnswerTimer: any;
  videoonshowAnspopUp: any;
  showAnswerRef: any;
  showAnswerfeedback: any;
  disableMainContent: boolean = true;
  hightlightIndexes: any = {};
  isOverlay: boolean = false;
  resultDigitCount: number;
  parentInputClass: any = "";

  @ViewChild('instruction') instruction: any;
  @ViewChild('ansPopup') ansPopup: any;
  @ViewChild('wrongFeedback') wrongFeedback: any;
  @ViewChild('rightFeedback') rightFeedback: any;
  @ViewChild('optionsContainer') optionsContainer: any;
  @ViewChild('clapSound') clapSound: any;
  @ViewChild('multiCorrectFeedback') multiCorrectFeedback: any;

  constructor(private appModel: ApplicationmodelService, private activatedRoute: ActivatedRoute, private Sharedservice: SharedserviceService) {

    //subscribing common popup from shared service to get the updated event and values of speaker
    this.Sharedservice.showAnsRef.subscribe(showansref => {
      this.showAnswerRef = showansref;
    })

    this.Sharedservice.showAnswerfeedback.subscribe(showanswerfeedback => {
      this.showAnswerfeedback = showanswerfeedback;
    });
    this.Sharedservice.videoonshowAnspopUp.subscribe(videoonsAnspopUp => {
      this.videoonshowAnspopUp = videoonsAnspopUp;
    });

    //subscribing speaker from shared service to get the updated object of speaker
    this.Sharedservice.spriteElement.subscribe(imagesrc => {
      this.speaker = imagesrc;
    });
    this.Sharedservice.speakerVol.subscribe(speakerVol => {
      this.speakerVolume = speakerVol;
    });

    this.appModel = appModel;
    if (!this.appModel.isVideoPlayed) {
      this.isVideoLoaded = false;
    } else {
      this.appModel.setLoader(true);
    }
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
    this.assetsPath = this.appModel.assetsfolderpath;
    this.appModel.navShow = 2;
  }

  ngOnInit() {
    this.Sharedservice.setShowAnsEnabled(false);
    this.Sharedservice.setLastQuesAageyBadheStatus(false);
    this.attemptType = "";
    this.setTemplateType();
    console.log("this.attemptType = " + this.attemptType);
    if (this.appModel.isNewCollection) {
      this.appModel.event = { 'action': 'segmentBegins' };
    }
    this.containgFolderPath = this.getBasePath();
    this.setData();
    this.appModel.getNotification().subscribe(mode => {
      if (mode == "manual") {
        console.log("manual mode ", mode);

      } else if (mode == "auto") {
        console.log("auto mode", mode);
        this.attemptType = "uttarDikhayein";
      }
    })


    this.showAnswerSubscription = this.appModel.getConfirmationPopup().subscribe((val) => {
      this.appModel.stopAllTimer();
      this.pauseSpeaker();
      this.stopAllSounds();
      this.enableAllOptions();
      clearTimeout(this.clappingTimer);

      if (this.showAnswerRef && this.showAnswerRef.nativeElement) {
        this.videoonshowAnspopUp.nativeElement.src = this.showAnswerPopup.video.location == "content" ? this.containgFolderPath + "/" + this.showAnswerPopup.video.url : this.assetsPath + "/" + this.showAnswerPopup.video.url;
        this.showAnswerRef.nativeElement.classList = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
        if (this.videoonshowAnspopUp && this.videoonshowAnspopUp.nativeElement) {
          this.videoonshowAnspopUp.nativeElement.play();
          this.videoonshowAnspopUp.nativeElement.onended = () => {
            this.showAnswerTimer = setTimeout(() => {
              this.closePopup('showanswer');
            }, 10000);
          }
        }
      }
    })


    this.appModel.nextBtnEvent().subscribe(() => {
      alert();
      if (this.appModel.isLastSectionInCollection) {
        this.appModel.event = { 'action': 'segmentEnds' };
      }
      if (this.appModel.isLastSection) {
        this.appModel.event = { 'action': 'end' };
      }
    })

    this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
      if (mode == "manual") {
        //show modal for manual
        this.appModel.notifyUserAction();
        if (this.ansPopup && this.ansPopup.nativeElement) {
          this.ansPopup.nativeElement.classList = "displayPopup modal";
        }
      }
    })

    this.appModel.postWrongAttempt.subscribe(() => {
      this.appModel.notifyUserAction();

    })
  }
  ngOnDestroy() {
    this.showAnswerSubscription.unsubscribe();
    clearTimeout(this.clappingTimer);
    clearTimeout(this.rightTimer);
    clearTimeout(this.multiCorrectTimer);
    this.audio.pause();
  }

  ngAfterViewChecked() {
    this.templatevolume(this.appModel.volumeValue, this);
  }

  /****Set data for the Template****/
  setData() {
    this.appModel.notifyUserAction();
    let fetchedData: any = this.appModel.content.contentData.data;
    this.instructiontext = fetchedData.instructiontext;
    this.myoption = JSON.parse(JSON.stringify(fetchedData.options));
    this.commonAssets = fetchedData.commonassets;
    this.speaker = fetchedData.speaker;
    this.feedback = fetchedData.feedback;
    this.quesObj = JSON.parse(JSON.stringify(fetchedData.quesObj));
    this.noOfImgs = fetchedData.imgCount;
    this.popupAssets = fetchedData.feedback.popupassets;
    this.correct_ans_index = this.feedback.correct_ans_index;
    this.rightPopup = this.feedback.right_ans_sound;
    this.wrongPopup = this.feedback.wrong_ans_sound;
    this.multiCorrectPopup = this.feedback.all_correct_sound;
    this.showAnswerVO = this.feedback.show_ans_sound;
    this.showAnswerPopup = this.feedback.show_ans_popup;
    this.rightAnswerPopup = this.feedback.right_ans_popup;
    this.lastQuestionCheck = this.commonAssets.ques_control.isLastQues;
    this.commonAssets.ques_control.blinkingStatus = false;
    this.isLastQues = this.appModel.isLastSection;
    this.isLastQuesAct = this.appModel.isLastSectionInCollection;
    this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
    this.quesObj.tablet.questionText.forEach(row => {
      row.rowValues.forEach(digit => {
        if (digit.correctValue != undefined) {
          this.correctAnswerCount++;
          this.hightlightIndexes[digit.blinkIndex] = { "rowId": row.rowid, "id": digit.id, "correctValue": digit.correctValue };   //object having details of all empty slots to be filled with answer
        }
      });
    });
    //logic to set different width based on last row length
    this.resultDigitCount = this.quesObj.tablet.questionText[this.quesObj.tablet.questionText.length-2].rowValues.length;
    if (this.quesObj.tablet.quesType === "add" || this.quesObj.tablet.quesType === "subt") {
      if(this.resultDigitCount === 5) {
        this.parentInputClass = "input_digits-5";
      }
      else if(this.resultDigitCount === 4) {
        this.parentInputClass = "input_digits-4";
      }
      else if(this.resultDigitCount === 3) {
        this.parentInputClass = "input_digits-3";
      }
      else if(this.resultDigitCount === 2) {
        this.parentInputClass = "input_digits-2";
      }
      else if(this.resultDigitCount === 1) {
        this.parentInputClass = "input_digits-1";
      }
    }
  }

  /******Set template type for EVA******/
  setTemplateType(): void {
    this.activatedRoute.data.subscribe(data => {
      this.Sharedservice.sendData(data);
    })
  }

  /******* Volume control for all VO  *******/
  templatevolume(vol, obj) {
    if (obj.instruction && obj.instruction.nativeElement) {
      obj.instruction.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.speakerVolume && obj.speakerVolume.nativeElement) {
      obj.speakerVolume.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.wrongFeedback && obj.wrongFeedback.nativeElement) {
      obj.wrongFeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.rightFeedback && obj.rightFeedback.nativeElement) {
      obj.rightFeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.clapSound && obj.clapSound.nativeElement) {
      obj.clapSound.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.showAnswerfeedback && obj.showAnswerfeedback.nativeElement) {
      obj.showAnswerfeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.audio) {
      obj.audio.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.multiCorrectFeedback && obj.multiCorrectFeedback.nativeElement) {
      obj.multiCorrectFeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.videoonshowAnspopUp && obj.videoonshowAnspopUp.nativeElement) {
      obj.videoonshowAnspopUp.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
  }

  /****Get base path****/
  getBasePath() {
    if (this.appModel && this.appModel.content) {
      return this.appModel.content.id + '';
    }
  }

  /****** sets clapping timer ********/
  setClappingTimer(feedback, popupRef?) {
    this.stopAllSounds();
    this.clapSound.nativeElement.play();
    this.clappingTimer = setTimeout(() => {
      this.clapSound.nativeElement.pause();
      this.clapSound.nativeElement.currentTime = 0;
      if (popupRef) {
        popupRef.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
      }
      feedback.nativeElement.play();
    }, 2000);
  }

  /****** Show right answer popup on all correct answer selection ********/
  showRightAnswerPopup() {
    if (this.multiCorrectFeedback && this.multiCorrectFeedback.nativeElement) {
      let rightAnswerPopup: HTMLElement = this.ansPopup.nativeElement as HTMLElement;
      this.setClappingTimer(this.multiCorrectFeedback, rightAnswerPopup);
    }
    this.multiCorrectFeedback.nativeElement.onended = () => {
      this.disableMainContent = true;
      for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
        document.getElementsByClassName("ansBtn")[i].classList.remove("disableDiv");
      }
      this.rightTimer = setTimeout(() => {
        this.closePopup('answerPopup');
      }, 10000);
    }
  }

  /****Check answer on option click*****/
  checkAnswer(option, index) {
    this.selectedIndex = index;
    option.image = option.image_original;//Reset Hover image to normal
    this.disableMainContent = true;//Disable the mainContent when option is selected
    for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
      document.getElementsByClassName("ansBtn")[i].classList.add("disableDiv");
    }
    this.stopAllSounds();
    this.enableAllOptions();
    let highLightDigitObj = this.getHighLightDigitDetails();
    let blinkingDigitRef = this.quesObj.tablet.questionText[Number(highLightDigitObj.rowId) - 1].rowValues[highLightDigitObj.digitId - 1];
    if (option.id === blinkingDigitRef["correctValue"]) {
      blinkingDigitRef["highlight"] = false;
      blinkingDigitRef["blink"] = false;
      this.correctAnswerCounter++;
      this.appModel.stopAllTimer();
      blinkingDigitRef.value = option.id;
      this.ifRightAns = true;
      this.popupIcon = this.popupAssets.right_icon.url;
      this.popupIconLocation = this.popupAssets.right_icon.location;

      if (this.rightFeedback && this.rightFeedback.nativeElement) {
        if (this.correctAnswerCounter === this.correctAnswerCount) {
          this.appModel.storeVisitedTabs();
          this.showRightAnswerPopup();
        }
        else {
          this.setClappingTimer(this.rightFeedback);
          this.rightFeedback.nativeElement.onended = () => {
            this.setBlink(); // set blinking on updated blinking digit index
            this.disableMainContent = false; //Enable main content
            for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
              document.getElementsByClassName("ansBtn")[i].classList.remove("disableDiv");
            }
          }
        }
      }
    }
    else {
      this.ifWrongAns = true;
      //play wrong feed back audio
      this.wrongCounter += 1;
      if (this.wrongFeedback && this.wrongFeedback.nativeElement) {
        this.wrongFeedback.nativeElement.play();
      }

      this.wrongFeedback.nativeElement.onended = () => {
        this.disableMainContent = false; //Enable main content
        for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {    //Enable Show Ans button
          document.getElementsByClassName("ansBtn")[i].classList.remove("disableDiv");
        }
        if (this.wrongCounter >= 3 && this.ifWrongAns) {
          this.Sharedservice.setShowAnsEnabled(true);
        }
      }
    }
  }

  close() {
    this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
  }

  /*****Close popup on click*****/
  closePopup(Type) {
    clearTimeout(this.rightTimer);
    clearTimeout(this.clappingTimer);
    clearTimeout(this.showAnswerTimer);

    this.showAnswerRef.nativeElement.classList = "modal";
    this.ansPopup.nativeElement.classList = "modal";

    this.wrongFeedback.nativeElement.pause();
    this.wrongFeedback.nativeElement.currentTime = 0;

    this.clapSound.nativeElement.pause();
    this.clapSound.nativeElement.currentTime = 0;

    this.rightFeedback.nativeElement.pause();
    this.rightFeedback.nativeElement.currentTime = 0;

    this.videoonshowAnspopUp.nativeElement.pause();
    this.videoonshowAnspopUp.nativeElement.currentTime = 0;

    this.multiCorrectFeedback.nativeElement.pause();
    this.multiCorrectFeedback.nativeElement.currentTime = 0;

    if (Type === "answerPopup") {
      this.popupclosedinRightWrongAns = true;
      for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
        document.getElementsByClassName("ansBtn")[i].classList.remove("disableDiv");
      }
      if (this.ifRightAns) {
        this.Sharedservice.setShowAnsEnabled(true);
        this.isOverlay = true;
        this.blinkOnLastQues();
        if (!this.lastQuestionCheck) {
          this.popupTime = setTimeout(() => {
          }, 10000)
        } else if (this.lastQuestionCheck) {
          this.Sharedservice.setTimeOnLastQues(true);
        }
      }
    }
    else if (Type === 'showanswer') {
      if (this.correctAnswerCounter === this.correctAnswerCount) {
        this.blinkOnLastQues();
      }
    }
  }

  /***** Blink on last question ******/
  blinkOnLastQues() {
    this.Sharedservice.setLastQuesAageyBadheStatus(false);
    if (this.lastQuestionCheck) {
      this.LastquestimeStart = true;
    }
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
    } else {
      this.appModel.moveNextQues("");
    }
  }

  ngAfterViewInit() {
    this.appModel.setLoader(false);
    this.checkforQVO();
  }

  /**Disable all clickables until instruction VO ends**/
  checkforQVO() {
    if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
      this.instruction.nativeElement.src = this.quesObj.quesInstruction.location == "content"
        ? this.containgFolderPath + "/" + this.quesObj.quesInstruction.url : this.assetsPath + "/" + this.quesObj.quesInstruction.url
      this.appModel.handlePostVOActivity(true);
      this.disableMainContent = true;
      this.instruction.nativeElement.play();
      this.instruction.nativeElement.onended = () => {
        this.appModel.handlePostVOActivity(false);
        this.disableMainContent = false;
        this.setBlink();
      }
    } else {
      this.appModel.handlePostVOActivity(false);
    }
  }

  /****** gets row and digit id of next blinking position ********/
  getHighLightDigitDetails() {
    return { "rowId": this.hightlightIndexes[this.correctAnswerCounter].rowId, "digitId": this.hightlightIndexes[this.correctAnswerCounter].id };
  }

  /****** sets blinking on digit ********/
  setBlink() {
    let highLightDigitObj = this.getHighLightDigitDetails();
    this.quesObj.tablet.questionText[Number(highLightDigitObj.rowId) - 1].rowValues[highLightDigitObj.digitId - 1]["blink"] = true;
    
  }

  /******On Hover option ********/
  onHoverOptions(option) {
    this.pauseSpeaker();
    option.image = option.image_hover;
  }

  /******Hover out option ********/
  onHoveroutOptions(option) {
    option.image = option.image_original;
  }

  /****** Option Hover VO  *******/
  playOptionHover(option, index) {
    if (option && option.audio && option.audio.url && !option.selected) {
      this.playSound(option.audio, index);
    }
  }
  /***** Play sound on option roll over *******/
  playSound(soundAssets, idx) {
    if (this.audio && this.audio.paused) {
      if (soundAssets.location == 'content') {
        this.audio.src = this.containgFolderPath + '/' + soundAssets.url;
      } else {
        this.audio.src = soundAssets.url;
      }
      this.audio.load();
      this.audio.play();
      for (let i = 0; i < this.optionsContainer.nativeElement.children.length; i++) {
        if (i != idx) {
          this.optionsContainer.nativeElement.children[i].classList.add("disableDiv");
        }
      }
      this.audio.onended = () => {
        this.enableAllOptions();
      }
    }
  }

  /******On Hover close popup******/
  hoverClosePopup() {
    this.popupAssets.close_button = this.popupAssets.close_button_hover;
  }

  /******Hover out close popup******/
  houtClosePopup() {
    this.popupAssets.close_button = this.popupAssets.close_button_origional;
  }

  /***** Enable all options and speaker on audio end *******/
  enableAllOptions() {
    for (let i = 0; i < this.optionsContainer.nativeElement.children.length; i++) {
      if (this.optionsContainer.nativeElement.children[i].classList.contains("disableDiv")) {
        this.optionsContainer.nativeElement.children[i].classList.remove("disableDiv");
      }
    }
  }

  /** Function to stop all sounds **/
  stopAllSounds(clicked?) {
    this.audio.pause();
    this.audio.currentTime = 0;

    this.speakerVolume.nativeElement.pause();
    this.speakerVolume.nativeElement.currentTime = 0;

    this.wrongFeedback.nativeElement.pause();
    this.wrongFeedback.nativeElement.currentTime = 0;

    this.rightFeedback.nativeElement.pause();
    this.rightFeedback.nativeElement.currentTime = 0;

    this.clapSound.nativeElement.pause();
    this.clapSound.nativeElement.currentTime = 0;
  }

  /** Function to pause the speaker **/
  pauseSpeaker() {
    let speakerEle = document.getElementsByClassName("speakerBtn")[0].children[2] as HTMLAudioElement;
    if (!speakerEle.paused) {
      speakerEle.pause();
      speakerEle.currentTime = 0;
      document.getElementById('waveAnimation').style.display = 'none';
      (document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "";
      this.speaker.imgsrc = this.speaker.imgorigional;
    }
  }

  /** Function called on click of speaker **/
  onSpeakerClicked() {
    this.stopAllSounds();
    this.enableAllOptions();
  }
}
