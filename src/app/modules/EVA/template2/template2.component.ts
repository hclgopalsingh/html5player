import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlayerConstants } from '../../../common/playerconstants';
import { ActivatedRoute } from '@angular/router';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { SharedserviceService } from '../../../common/services/sharedservice.service';

@Component({
  selector: 'app-template2',
  templateUrl: './template2.component.html',
  styleUrls: ['./template2.component.scss']
})
export class Template2Component implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
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
  loaderTimer: any;
  containgFolderPath: string = "";
  assetsPath: string = "";
  loadFlag: boolean = false;
  questionObj: any;
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
  showAnswerTimer: any;
  videoonshowAnspopUp: any;
  showAnswerRef: any;
  showAnswerfeedback: any;
  disableMainContent: boolean = true;
  enableOptionsTimer: any;

  @ViewChild('instruction') instruction: any;
  @ViewChild('audioEl') audioEl: any;
  @ViewChild('sprite', {static: true}) sprite: any;
  @ViewChild('speakerNormal') speakerNormal: any;
  @ViewChild('ansPopup') ansPopup: any;
  // @ViewChild('showAnswerfeedback') showAnswerfeedback: any;
  // @ViewChild('showAnswerRef') showAnswerRef: any;
  @ViewChild('wrongFeedback') wrongFeedback: any;
  @ViewChild('rightFeedback') rightFeedback: any;
  @ViewChild('disableSpeaker') disableSpeaker: any;
  @ViewChild('myAudiospeaker') myAudiospeaker: any;
  @ViewChild('footerNavBlock') footerNavBlock: any;
  @ViewChild('ansBlock') ansBlock: any;
  @ViewChild('clapSound') clapSound: any;
  @ViewChild('overlay') overlay: any;
  @ViewChild('celebrationPopup') celebrationsPopup: any;
  @ViewChild('multiCorrectFeedback') multiCorrectFeedback: any;
  @ViewChild('leftOptRef') leftOptRef: any;
  @ViewChild('rightOptRef') rightOptRef: any;

  clappingTimer: any;
  celebrationTimer: any;
  multiCorrectPopup: any;
  rightTimer: any;
  audio = new Audio();

  constructor(private appModel: ApplicationmodelService, private ActivatedRoute: ActivatedRoute, private Sharedservice: SharedserviceService) {

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
    this.appModel = appModel;
    if (!this.appModel.isVideoPlayed) {
      this.isVideoLoaded = false;
    } else {
      this.appModel.setLoader(true);
      // if error occured during image loading loader wil stop after 5 seconds 
      this.loaderTimer = setTimeout(() => {
        this.appModel.setLoader(false);
      }, 5000);
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
      this.clapSound.nativeElement.pause();
      this.clapSound.nativeElement.currentTime = 0;
      this.rightFeedback.nativeElement.pause();
      this.rightFeedback.nativeElement.currentTime = 0;
      if (!this.wrongFeedback.nativeElement.paused) {
        this.wrongFeedback.nativeElement.pause();
        this.wrongFeedback.nativeElement.currentTime = 0;
        this.shuffleOptions();
      }
      if (!this.audio.paused) {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.enableAllOptions();
      }
      clearTimeout(this.clappingTimer);
      this.ansBlock.nativeElement.className = "optionsBlock";
      this.disableSpeaker.nativeElement.classList.remove("disableDiv");
      let speakerEle = document.getElementsByClassName("speakerBtn")[0].children[2] as HTMLAudioElement;
      if (!speakerEle.paused) {
        speakerEle.pause();
        speakerEle.currentTime = 0;
        this.sprite.nativeElement.style = "display:none";
        (document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "";
        this.speaker.imgsrc = this.speaker.imgorigional;
      }
      if (this.showAnswerRef && this.showAnswerRef.nativeElement) {
        this.videoonshowAnspopUp.nativeElement.src = this.showAnswerPopup.video.location == "content" ? this.containgFolderPath + "/" + this.showAnswerPopup.video.url : this.assetsPath + "/" + this.showAnswerPopup.video.url;
        this.showAnswerRef.nativeElement.classList = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
        if (this.videoonshowAnspopUp && this.videoonshowAnspopUp.nativeElement) {
          this.ansBlock.nativeElement.classList.add("disableDiv");
          this.videoonshowAnspopUp.nativeElement.play();
          this.videoonshowAnspopUp.nativeElement.onended = () => {
            this.showAnswerTimer = setTimeout(() => {
              this.closePopup('showAnswer');
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
    clearTimeout(this.celebrationTimer);
    clearTimeout(this.enableOptionsTimer);
    this.audio.pause();
  }

  ngAfterViewInit() {
    this.sprite.nativeElement.style = "display:none";
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
    this.questionObj = fetchedData.quesObj;
    this.noOfImgs = fetchedData.imgCount;
    this.popupAssets = fetchedData.feedback.popupassets;
    this.correct_ans_index = this.feedback.correct_ans_index;
    this.rightPopup = this.feedback.right_ans_sound;
    this.wrongPopup = this.feedback.wrong_ans_sound;
    this.multiCorrectPopup = this.feedback.all_correct_sound;
    this.lastQuestionCheck = this.commonAssets.ques_control.isLastQues;
    this.commonAssets.ques_control.blinkingStatus = false;
    this.isLastQues = this.appModel.isLastSection;
    this.isLastQuesAct = this.appModel.isLastSectionInCollection;
    this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
	this.showAnswerPopup = this.feedback.show_ans_popup;
    this.correctAnswersArray = [...this.myoption.leftoption, ...this.myoption.rightoption].filter(option => {
      return (this.correct_ans_index.indexOf(option.id) > -1);
    });
    setTimeout(() => {
      if (this.footerNavBlock && this.footerNavBlock.nativeElement) {
        this.footerNavBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around";
      }
    }, 200)

  }

  /******Set template type for EVA******/
  setTemplateType(): void {
    this.ActivatedRoute.data.subscribe(data => {
      this.Sharedservice.sendData(data);
    })
  }

  /******* Volume control for all VO  *******/
  templatevolume(vol, obj) {
    if (obj.instruction && obj.instruction.nativeElement) {
      obj.instruction.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.myAudiospeaker && obj.myAudiospeaker.nativeElement) {
      obj.myAudiospeaker.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
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

  /*****Play speaker audio*****/
  playSpeaker(el: HTMLAudioElement, speaker) {
    this.stopAllSounds();
    this.enableAllOptions();
    if (!this.instruction.nativeElement.paused) {
      console.log("instruction voice still playing");
    } else {
      this.myAudiospeaker.nativeElement.currentTime = 0.0;
      if (el.id == "S") {
        this.myAudiospeaker.nativeElement.pause();
        if (el.paused) {
          el.currentTime = 0;
          el.play();
        } else {
          el.currentTime = 0;
          el.play();
        }
        this.speakerTimer = setInterval(() => {
          speaker.imgsrc = speaker.imgactive;
          this.sprite.nativeElement.style = "display:flex";
          (document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "none";
          this.checkSpeakerVoice(speaker);
        }, 10)
      }
      else {
        if (this.myAudiospeaker && this.myAudiospeaker.nativeElement) {
          this.myAudiospeaker.nativeElement.pause();
        }
        el.pause();
        el.currentTime = 0;
        el.play();
        this.disableMainContent = true;
        el.onended = () => {
          this.disableMainContent = false;
          this.sprite.nativeElement.style = "display:none";
          (document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "";
        }

      }
    }
  }

  /*****Check speaker voice*****/
  checkSpeakerVoice(speaker) {
    if (!this.audioEl.nativeElement.paused) {
    } else {
      speaker.imgsrc = speaker.imgorigional;
      this.sprite.nativeElement.style = "display:none";
      (document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "";
      clearInterval(this.speakerTimer);
    }
  }

  /*********SPEAKER HOVER *********/
  onHoverSpeaker(speaker) {
    speaker.imgsrc = speaker.imghover;
  }

  /******Hover out speaker ********/
  onHoverOutSpeaker(speaker) {
    speaker.imgsrc = speaker.imgorigional;
  }

  /****** sets clapping timer ********/
  setClappingTimer(feedback) {
    this.clapSound.nativeElement.play();
    this.clappingTimer = setTimeout(() => {
      this.clapSound.nativeElement.pause();
      this.clapSound.nativeElement.currentTime = 0;
      feedback.nativeElement.play();
    }, 2000);
  }

  showCelebrations() {
    this.appModel.storeVisitedTabs();
    let celebrationsPopup: HTMLElement = this.celebrationsPopup.nativeElement as HTMLElement;
    this.celebrationTimer = setTimeout(() => {
      if (this.multiCorrectFeedback && this.multiCorrectFeedback.nativeElement) {
        celebrationsPopup.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
        this.setClappingTimer(this.multiCorrectFeedback);
      }
    }, 4000);
    this.multiCorrectFeedback.nativeElement.onended = () => {
      this.ansBlock.nativeElement.className = "optionsBlock";
      this.disableSpeaker.nativeElement.classList.remove("disableDiv");
      this.disableMainContent = true;
      this.ansBlock.nativeElement.className = "optionsBlock disableDiv";
      for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
        document.getElementsByClassName("ansBtn")[i].classList.remove("disableDiv");
      }
      this.rightTimer = setTimeout(() => {
        this.closePopup('answerPopup');
      }, 10000);
    }
  }

  /****Check answer on option click*****/
  checkAnswer(option, optRef, index) {
    this.popupclosedinRightWrongAns = false;
    let optRefEl;
    if (optRef && optRef.children[1] && optRef.children[1].children[0]) {
      optRefEl = optRef.children[1].children[0] as HTMLElement;
    }
    else {
      return;
    }
    for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
      document.getElementsByClassName("ansBtn")[i].classList.add("disableDiv");
    }
    this.stopAllSounds("clicked");
    // logic to check what user has done is correct
    if (this.feedback.correct_ans_index.indexOf(option.id) > -1) {
      this.correctAnswerCounter++;
      let ansRef = document.getElementById("answer" + this.correctAnswerCounter) as HTMLElement;
      ansRef.insertAdjacentElement("beforeend", optRefEl);
      this.attemptType = "manual";
      this.appModel.stopAllTimer();
      this.ansBlock.nativeElement.className = "optionsBlock disableDiv";
      this.disableSpeaker.nativeElement.classList.add("disableDiv");
      option.optBg = option.optBg_original;
      this.selectedAnswersArray.push(option); // saving correct answers to be shown in show answer popup
      this.ifRightAns = true;
      if (index <= 2) {
        this.myoption.leftoption[index].selected = true;
      }
      else {
        this.myoption.rightoption[index - 3].selected = true;
      }

      setTimeout(() => {
        if (this.rightFeedback && this.rightFeedback.nativeElement) {
          this.setClappingTimer(this.rightFeedback);
          this.rightFeedback.nativeElement.onended = () => {
            if (this.correctAnswerCounter === 4) {
              this.correctAnswersArray = this.selectedAnswersArray;
              this.showCelebrations();
            }
            else {
              this.ansBlock.nativeElement.className = "optionsBlock";
              this.disableSpeaker.nativeElement.classList.remove("disableDiv");
              for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
                document.getElementsByClassName("ansBtn")[i].classList.remove("disableDiv");
              }
            }
          }
        }
      })

    } else {
      this.ifWrongAns = true;
      this.disableMainContent = true;
      this.ansBlock.nativeElement.className = "optionsBlock disableDiv";
      this.disableSpeaker.nativeElement.classList.add("disableDiv");
      this.appModel.stopAllTimer();
      //play wrong feed back audio
      this.wrongCounter += 1;
      setTimeout(() => {
        if (this.wrongFeedback && this.wrongFeedback.nativeElement) {
          this.wrongFeedback.nativeElement.play();
        }

        this.wrongFeedback.nativeElement.onended = () => {
          option.optBg = option.optBg_original;
          this.ansBlock.nativeElement.classList.add("disableDiv");
          this.shuffleOptions();
          for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
            document.getElementsByClassName("ansBtn")[i].classList.remove("disableDiv");
          }
          this.disableMainContent = false;
        }
      });
    }
  }

  shuffleOptions() {
    let mainArray = [...this.myoption.leftoption, ...this.myoption.rightoption];
    this.idArray = [];
    for (let i of mainArray) {
      this.idArray.push(i.id);
    }
    this.doRandomize(mainArray);
    this.disableSpeaker.nativeElement.classList.remove("disableDiv");
    if (this.wrongCounter >= 3 && this.ifWrongAns) {
      this.Sharedservice.setShowAnsEnabled(true);
    }
    this.enableOptionsTimer = setTimeout(() => {
      this.ansBlock.nativeElement.classList.remove("disableDiv");
    }, 1000);
  }

  /****Randomize option on wrong selection*****/
  doRandomize(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      var optionBg1 = array[currentIndex].optBg;
      var img_hover1 = array[currentIndex].optBg_hover;
      var text1copy = array[currentIndex].optBg_original;

      var optionBg2 = array[randomIndex].optBg;
      var img_hover2 = array[randomIndex].optBg_hover;
      var text2copy = array[randomIndex].optBg_original;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;

      array[currentIndex].optBg = optionBg1;
      array[currentIndex].optBg_hover = img_hover1;
      array[currentIndex].optBg_original = text1copy;

      array[randomIndex].optBg = optionBg2;
      array[randomIndex].optBg_hover = img_hover2;
      array[randomIndex].optBg_original = text2copy;

    }
    var flag = this.arraysIdentical(array, this.idArray);
    if (flag) {
      this.doRandomize(array);
    }
    else {
      this.myoption.leftoption = array.slice(0, array.length / 2);
      this.myoption.rightoption = array.slice(array.length / 2, array.length);
    }
  }

  /*****Check if array is identical******/
  arraysIdentical(a, b) {
    var i = a.length;
    while (i--) {
      if (a[i].id == b[i]) {
        return true;
      }
    }
    return false;
  }

  close() {
    this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
  }

  /*****Close popup on click*****/
  closePopup(Type) {
    clearTimeout(this.rightTimer);
    clearTimeout(this.clappingTimer);
    clearTimeout(this.showAnswerTimer);
    clearTimeout(this.enableOptionsTimer);

    this.showAnswerRef.nativeElement.classList = "modal";
    this.celebrationsPopup.nativeElement.classList = "modal";
    this.wrongFeedback.nativeElement.pause();
    this.wrongFeedback.nativeElement.currentTime = 0;

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
        this.overlay.nativeElement.classList.value = "fadeContainer";
        this.blinkOnLastQues();
        if (!this.lastQuestionCheck) {
          this.popupTime = setTimeout(() => {
          }, 10000)
        } else if (this.lastQuestionCheck) {
          this.Sharedservice.setTimeOnLastQues(true);
        }
      }
    }
    else if (Type === 'showAnswer') {
      this.enableOptionsTimer = setTimeout(() => {
        this.ansBlock.nativeElement.classList.remove("disableDiv");
      }, 1000); 
      if (this.correctAnswerCounter === 4) {
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
    if (this.questionObj && this.questionObj.quesInstruction && this.questionObj.quesInstruction.url && this.questionObj.quesInstruction.autoPlay) {
      this.instruction.nativeElement.src = this.questionObj.quesInstruction.location == "content"
        ? this.containgFolderPath + "/" + this.questionObj.quesInstruction.url : this.assetsPath + "/" + this.questionObj.quesInstruction.url
      this.appModel.handlePostVOActivity(true);
      this.disableMainContent = true;
      this.instruction.nativeElement.play();
      this.appModel.setLoader(false);
      this.instruction.nativeElement.onended = () => {
        this.appModel.handlePostVOActivity(false);
        this.disableMainContent = false;
      }
    } else {
      this.appModel.handlePostVOActivity(false);
    }
  }

  /******On Hover option ********/
  onHoverOptions(option) {
    if (!this.myAudiospeaker.nativeElement.paused) {
      this.myAudiospeaker.nativeElement.pause();
      this.myAudiospeaker.nativeElement.currentTime = 0;
      this.speaker.imgsrc = this.speaker.imgorigional;
    }
    option.optBg = option.optBg_hover;
  }

  /******Hover out option ********/
  onHoveroutOptions(option) {
    option.optBg = option.optBg_original;
  }

  /****** Option Hover VO  *******/
  playOptionHover(option, index) {
    if (option && option.audio && option.audio.url && !option.selected) {
      this.playSound(option.audio, index);
    }
  }
  /***** Play sound on option roll over *******/
  playSound(soundAssets, idx) {
    let selectedOptionBlock, otherOptionBlock;
    if (this.audio && this.audio.paused) {
      if (soundAssets.location == 'content') {
        this.audio.src = this.containgFolderPath + '/' + soundAssets.url;
      } else {
        this.audio.src = soundAssets.url;
      }
      this.audio.load();
      this.audio.play();
      if (idx <= 2) {
        selectedOptionBlock = this.leftOptRef;
        otherOptionBlock = this.rightOptRef;
      }
      else {
        idx = idx - 3;
        selectedOptionBlock = this.rightOptRef;
        otherOptionBlock = this.leftOptRef;
      }
      this.disableOtherOptions(idx, selectedOptionBlock, otherOptionBlock);
    }
  }

  /***** Disable speaker and options other than hovered until audio end *******/
  disableOtherOptions(idx, selectedBlock, otherBlock) {
    for (let i = 0; i < selectedBlock.nativeElement.parentElement.children.length; i++) {
      if (i != idx) {
        selectedBlock.nativeElement.parentElement.children[i].classList.add("disableDiv");
      }
    }
    for (let j = 0; j < otherBlock.nativeElement.parentElement.children.length; j++) {
      otherBlock.nativeElement.parentElement.children[j].classList.add("disableDiv");
    }
    this.audio.onended = () => {
      this.enableAllOptions();
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
    for (let i = 0; i < this.leftOptRef.nativeElement.parentElement.children.length; i++) {
      if (this.leftOptRef.nativeElement.parentElement.children[i].classList.contains("disableDiv") && !this.myoption.leftoption[i].selected) {
        this.leftOptRef.nativeElement.parentElement.children[i].classList.remove("disableDiv");
      }
    }
    for (let j = 0; j < this.rightOptRef.nativeElement.parentElement.children.length; j++) {
      if (this.rightOptRef.nativeElement.parentElement.children[j].classList.contains("disableDiv") && !this.myoption.rightoption[j].selected) {
        this.rightOptRef.nativeElement.parentElement.children[j].classList.remove("disableDiv");
      }
    }
  }

  /** Function to stop all sounds **/
  stopAllSounds(clickStatus?) {
    this.audio.pause();
    this.audio.currentTime = 0;

    this.myAudiospeaker.nativeElement.pause();
    this.myAudiospeaker.nativeElement.currentTime = 0;

    this.wrongFeedback.nativeElement.pause();
    this.wrongFeedback.nativeElement.currentTime = 0;

    this.rightFeedback.nativeElement.pause();
    this.rightFeedback.nativeElement.currentTime = 0;

    this.clapSound.nativeElement.pause();
    this.clapSound.nativeElement.currentTime = 0;

    if(clickStatus) {
      this.enableAllOptions();
    }

  }
}
