import { Component, OnInit, ViewChild, OnDestroy ,AfterViewChecked, AfterViewInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { SharedserviceService } from '../../../common/services/sharedservice.service';
import { PlayerConstants } from '../../../common/playerconstants';
import { EncodeUriPipe } from '../../../common/encode_uri.pipe';

@Component({
  selector: 'app-template5',
  templateUrl: './template5.component.html',
  styleUrls: ['./template5.component.scss']
})

export class Template5Component implements OnInit, AfterViewChecked, OnDestroy, AfterViewInit{
  blink: boolean = false;
  commonAssets: any = "";
  myoption: any = [];
  myoption_right_ans: any = [];
  feedback: any = "";
  isLastQues: boolean = false;
  isLastQuesAct: boolean;
  noOfImgs: number;
  noOfImgsLoaded: number = 0;
  containgFolderPath: string = "";
  assetsPath: string = "";
  quesObj: any;
  confirmAssets: any;
  feedbackAssets: any;
  attemptType: string = "";
  correctOpt: any = '';
  isVideoLoaded: boolean = false;
  optionArr: any = [];
  currentIdx: number = 0;
  wrongCounter: number = 0;
  instructiontext: string;
  idArray: any = [];
  speaker: any;
  speakerVolume: any;
  tempSubscription: Subscription;
  correct_ans_index: any = [];
  speakerTimer: any;
  showAnswerPopup: any;
  ifRightAns: boolean = false;
  popupAssets: any;
  showAnswerSubscription: any;
  popupIcon: any;
  popupIconLocation: any;
  lastQuestionCheck: any;
  popupclosedinRightWrongAns: boolean = false;
  ifWrongAns: boolean = false;
  popupTime: any;
  LastquestimeStart: boolean = false;
  correctAnswerCounter: number = 0;
  clappingTimer: any;
  multiCorrectTimer: any;
  rightFeedbackVO: any;
  rightTimer: any;
  audio = new Audio();
  answerHint = new Audio();
  selectedIndex: any;
  rightAnswerPopup: any;
  showAnswerTimer: any;
  videoonshowAnspopUp: any;
  showAnswerRef: any;
  showAnswerfeedback: any;
  disableMainContent: boolean = true;
  hightlightIndexes: any = {};
  isOverlay: boolean = false;
  optionCount: number;
  parentInputClass: any = "";
  selectedLetterCount: number = 0;
  rightAnsBackground: any;
  blinkInterval: any;
  feedbackAudioDelay: any;

  @ViewChild('instruction') instruction: any;
  @ViewChild('ansPopup') ansPopup: any;
  @ViewChild('wrongFeedback') wrongFeedback: any;
  @ViewChild('rightFeedback') rightFeedback: any;
  @ViewChild('optionsContainer') optionsContainer: any;
  @ViewChild('clapSound') clapSound: any;
  @ViewChild('feedbackPopupAudio') feedbackPopupAudio: any;
  @ViewChild('popupBodyRef') popupBodyRef: any;

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

  ngAfterViewInit() {
    this.appModel.setLoader(false);
    this.checkforQVO();
  }

  ngAfterViewChecked() {
    this.templatevolume(this.appModel.volumeValue, this);
  }

  ngOnDestroy() {
    this.showAnswerSubscription.unsubscribe();
    clearTimeout(this.clappingTimer);
    clearTimeout(this.rightTimer);
    clearTimeout(this.multiCorrectTimer);
    clearTimeout(this.feedbackAudioDelay);
    this.stopAllSounds();
  }

  /******On Hover option ********/
  onHoverOptions(option) {
    this.pauseSpeaker();
    option.image_bg = option.image_bg_hover;
  }

  /******Hover out option ********/
  onHoveroutOptions(option) {
    if (option.selected) {
      option.image_bg = this.feedback.correct_ans[this.correctAnswerCounter]["image_bg"];
    }
    else {
      option.image_bg = option.image_bg_original;
    }
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

  /****Set data for the Template****/
  setData() {
    this.appModel.notifyUserAction();
    let fetchedData: any = this.appModel.content.contentData.data;
    this.instructiontext = fetchedData.instructiontext;
    this.myoption = JSON.parse(JSON.stringify(fetchedData.options));
    this.myoption_right_ans = JSON.parse(JSON.stringify(fetchedData.options));
    this.commonAssets = fetchedData.commonassets;
    this.speaker = fetchedData.speaker;
    this.feedback = fetchedData.feedback;
    this.quesObj = JSON.parse(JSON.stringify(fetchedData.quesObj));
    this.noOfImgs = fetchedData.imgCount;
    this.popupAssets = fetchedData.feedback.popupassets;
    this.correct_ans_index = this.feedback.correct_ans_index;
    this.showAnswerPopup = this.feedback.show_ans_popup;
    this.rightAnswerPopup = this.feedback.right_ans_popup;
    this.lastQuestionCheck = this.commonAssets.ques_control.isLastQues;
    this.commonAssets.ques_control.blinkingStatus = false;
    this.isLastQues = this.appModel.isLastSection;
    this.isLastQuesAct = this.appModel.isLastSectionInCollection;
    this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);

    this.optionCount = this.myoption.optionsArr.length;
    if (this.optionCount === 16) {
      this.parentInputClass = "keypad4by4";
    }
    else if (this.optionCount === 9) {
      this.parentInputClass = "keypad3by3";
    }
    this.feedback.correct_ans.forEach(obj => {
      if (obj.correct_index[1] - obj.correct_index[0] == 1) {
        this.myoption_right_ans.optionsArr[obj.correct_index[0] - 1]["bg_class"] = "bg_horizontal";
      }
      else {
        this.myoption_right_ans.optionsArr[obj.correct_index[0] - 1]["bg_class"] = "bg_vertical";
      }
    });
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
    if (obj.answerHint) {
      obj.answerHint.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.videoonshowAnspopUp && obj.videoonshowAnspopUp.nativeElement) {
      obj.videoonshowAnspopUp.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackPopupAudio && obj.feedbackPopupAudio.nativeElement) {
      obj.feedbackPopupAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
  }

  /****Get base path****/
  getBasePath() {
    if (this.appModel && this.appModel.content) {
      return this.appModel.content.id + '';
    }
  }

  /****** sets clapping timer ********/
  setClappingTimer(feedback) {
    this.stopAllSounds();
    this.clapSound.nativeElement.play();
    this.clappingTimer = setTimeout(() => {
      this.clapSound.nativeElement.pause();
      this.clapSound.nativeElement.currentTime = 0;
      feedback.nativeElement.play();
    }, 2000);
  }

  /****** Play right answer VO for each correct word ********/
  playrightFeedbackAudioPopup(i) {
    let current = i;
    let highlightStartIndex = this.feedback.correct_ans[current].correct_index[0];
    let highlightedOption = this.myoption_right_ans.optionsArr[highlightStartIndex - 1];
    let feedbackAudio = this.feedback.right_ans_popup[current].rightfeedback_audio;
    this.feedbackPopupAudio.nativeElement.src = feedbackAudio.location == "content" ? this.containgFolderPath + "/" + feedbackAudio.url : this.assetsPath + "/" + feedbackAudio.url;
    this.feedbackPopupAudio.nativeElement.play();
    let flag = false;
    this.blinkInterval = setInterval(() => {
      if (flag) {
        highlightedOption.highlightWord.highlightWord_bg = highlightedOption.highlightWord.highlightWord_bg_original;
        this.quesObj.questionText[current].quesBackground.bg_image = this.quesObj.questionText[current].quesBackground.bg_image_original;
        flag = false;
      }
      else {
        highlightedOption.highlightWord.highlightWord_bg = highlightedOption.highlightWord.highlightWord_bg_border;
        this.quesObj.questionText[current].quesBackground.bg_image = this.quesObj.questionText[current].quesBackground.bg_image_border;
        flag = true;
      }
    }, 450);
    this.feedbackPopupAudio.nativeElement.onended = () => {
      highlightedOption.highlightWord.highlightWord_bg = highlightedOption.highlightWord.highlightWord_bg_original;
      this.quesObj.questionText[current].quesBackground.bg_image = this.quesObj.questionText[current].quesBackground.bg_image_original;
      clearInterval(this.blinkInterval);
      this.blinkInterval = undefined;
      ++current;
      if (this.feedback.correct_ans.length == current) {
        this.rightTimer = setTimeout(() => {
          this.closePopup('answerPopup');
        }, 10000);
        return;
      }
      this.playrightFeedbackAudioPopup(current);
    }
  }

  /****Check answer on option click*****/
  checkAnswer(option, index) {
    let currentIndexArr = this.feedback.correct_ans[this.correctAnswerCounter].correct_index;
    this.selectedIndex = index;
    this.disableMainContent = true;//Disable the mainContent when option is selected
    for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
      document.getElementsByClassName("ansBtn")[i].classList.add("disableDiv");
    }
    this.enableAllOptions();
    this.stopAllSounds();
    if (currentIndexArr[this.selectedLetterCount] == option.id) {
      option["selected"] = true;
      this.optionsContainer.nativeElement.children[this.selectedIndex].classList.add("disableDiv");
      if (this.selectedLetterCount == 0) {
        this.feedback.correct_ans[this.correctAnswerCounter]["image_bg"] = option.image_bg_selected;
        option.image_bg = option.image_bg_selected;
        this.rightAnsBackground = option.image_bg_original;
      }
      else {
        option.image_bg = this.feedback.correct_ans[this.correctAnswerCounter]["image_bg"];
        this.myoption_right_ans.optionsArr[index]["image_bg"] = this.rightAnsBackground;
      }
      this.selectedLetterCount++;
      if (this.selectedLetterCount == currentIndexArr.length) {
        this.quesObj.questionText[this.correctAnswerCounter]["image"] = this.feedback.correct_ans[this.correctAnswerCounter].correct_img;
      }
      this.appModel.stopAllTimer();
      this.ifRightAns = true;
      this.popupIcon = this.popupAssets.right_icon.url;
      this.popupIconLocation = this.popupAssets.right_icon.location;
      if (this.selectedLetterCount == currentIndexArr.length) {
        this.rightFeedbackVO = this.feedback.correct_ans[this.correctAnswerCounter].correct_word_audio;
      }
      else {
        this.rightFeedbackVO = option.isMatra ? this.feedback.right_ans_sound_matra : this.feedback.right_ans_sound_akshar;
      }
      if (this.correctAnswerCounter === this.feedback.correct_ans.length - 1 && this.selectedLetterCount == currentIndexArr.length) {
        this.myoption.optionsArr.forEach(option => {  // disable all other non selected keys on final word completion
          if (!option.selected) {
            option.image_bg = option.image_bg_disabled;
          }
        });
      }
      if (this.rightFeedback && this.rightFeedback.nativeElement) {
        this.setClappingTimer(this.rightFeedback);
        this.rightFeedback.nativeElement.onended = () => {
          if (this.selectedLetterCount == currentIndexArr.length) {  // if all correct letters/matra of a word are selected
            if (this.correctAnswerCounter === this.feedback.correct_ans.length - 1) {  //if all correct words are filled
              this.storeVisitedTabs();

              this.multiCorrectTimer = setTimeout(() => {
                let rightAnswerPopup: HTMLElement = this.ansPopup.nativeElement as HTMLElement;
                rightAnswerPopup.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
                this.feedbackAudioDelay =setTimeout(() => {
                  this.playrightFeedbackAudioPopup(0);
                }, 2000);
              }, 2000);
            }
            else {
              this.correctAnswerCounter++;
              this.selectedLetterCount = 0;
              setTimeout(() => {
                this.playAnsHintVO();
              }, 500);
            }
          }
          else {
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
        // Reset selected options to default
        this.feedback.correct_ans[this.correctAnswerCounter].correct_index.forEach(index => {
          this.optionsContainer.nativeElement.children[index - 1].classList.remove("disableDiv");
          this.myoption.optionsArr[index - 1].image_bg = this.myoption.optionsArr[index - 1].image_bg_original;
          this.myoption.optionsArr[index - 1]["selected"] = false;
          this.selectedLetterCount = 0;
        });
        for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {    //Enable Show Ans button
          document.getElementsByClassName("ansBtn")[i].classList.remove("disableDiv");
        }
        if (this.wrongCounter >= 3 && this.ifWrongAns) {
          this.Sharedservice.setShowAnsEnabled(true);
        }
      }
    }
  }

  /**** Store question id on sessionStorage *****/
  storeVisitedTabs() {
    if (sessionStorage.getItem("tabsVisited")) {
      let visitedArr = JSON.parse(sessionStorage.getItem("tabsVisited"));
      if (visitedArr.indexOf(this.commonAssets.ques_control.quesTabs.quesID) < 0) {   //If question is not already answered
        visitedArr.push(this.commonAssets.ques_control.quesTabs.quesID);
        sessionStorage.setItem("tabsVisited", JSON.stringify(visitedArr));
      }
    }
    else {
      let visitedTabsArr = [this.commonAssets.ques_control.quesTabs.quesID];
      sessionStorage.setItem("tabsVisited", JSON.stringify(visitedTabsArr));
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
    clearTimeout(this.multiCorrectTimer);
    clearTimeout(this.feedbackAudioDelay);
    if (this.blinkInterval) {
      clearInterval(this.blinkInterval);
      this.blinkInterval = undefined;
    }

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

    this.feedbackPopupAudio.nativeElement.pause();
    this.feedbackPopupAudio.nativeElement.currentTime = 0;

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
      if (this.correctAnswerCounter === this.feedback.correct_ans.length - 1 && this.selectedLetterCount == this.feedback.correct_ans[this.correctAnswerCounter].correct_index.length) {
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

  /**Disable all clickables until instruction VO ends**/
  checkforQVO() {
    if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
      this.instruction.nativeElement.src = this.quesObj.quesInstruction.location == "content"
        ? this.containgFolderPath + "/" + this.quesObj.quesInstruction.url : this.assetsPath + "/" + this.quesObj.quesInstruction.url
      this.appModel.handlePostVOActivity(true);
      this.disableMainContent = true;
      this.instruction.nativeElement.play();
      this.instruction.nativeElement.onended = () => {
        this.playAnsHintVO();
      }
    } else {
      this.appModel.handlePostVOActivity(false);
    }
  }

  /****** Play Answer Hint VO for each word to be filled ********/
  playAnsHintVO() {
    let currentAnswerObj = this.quesObj.questionText[this.correctAnswerCounter];
    if (currentAnswerObj.audio.location == 'content') {
      this.answerHint.src = this.containgFolderPath + '/' + currentAnswerObj.audio.url;
    } else {
      this.answerHint.src = currentAnswerObj.audio.url;
    }
    this.answerHint.load();
    this.answerHint.play();
    this.speakerVolume.nativeElement.src = currentAnswerObj.audio.location == "content"
      ? this.containgFolderPath + "/" + currentAnswerObj.audio.url : this.assetsPath + "/" + currentAnswerObj.audio.url;
    this.answerHint.onended = () => {
      this.appModel.handlePostVOActivity(false);
      this.disableMainContent = false;
      for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
        document.getElementsByClassName("ansBtn")[i].classList.remove("disableDiv");
      }
    }
  }

  /***** Enable all options and speaker on audio end *******/
  enableAllOptions() {
    for (let i = 0; i < this.optionsContainer.nativeElement.children.length; i++) {
      if (this.optionsContainer.nativeElement.children[i].classList.contains("disableDiv") && !this.myoption.optionsArr[i].selected) {
        this.optionsContainer.nativeElement.children[i].classList.remove("disableDiv");
      }
    }
  }

  /** Function to stop all sounds **/
  stopAllSounds() {
    this.audio.pause();
    this.audio.currentTime = 0;

    this.answerHint.pause();
    this.answerHint.currentTime = 0;

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
