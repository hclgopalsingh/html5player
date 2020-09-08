import { Component, OnInit, ViewChild, OnDestroy, AfterViewChecked, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { SharedserviceService } from '../../../services/sharedservice.service';
import { PlayerConstants } from '../../../common/playerconstants';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-template9',
  templateUrl: './template9.component.html',
  styleUrls: ['./template9.component.css']
})
export class Template9Component implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  commonAssets: any = '';
  rightPopup: any;
  wrongPopup: any;
  myoption: any = [];
  feedback: any = '';
  isLastQues = false;
  isLastQuesAct: boolean;
  noOfImgs: number;
  containgFolderPath = '';
  assetsPath = '';
  quesObj: any;
  attemptType = '';
  isVideoLoaded = false;
  wrongCounter = 0;
  instructiontext: string;
  idArray: any = [];
  speaker: any;
  speakerVolume: any;
  tempSubscription: Subscription;
  correct_ans_index: any = [];
  showAnswerPopup: any;
  showAnswerVO: any;
  ifRightAns = false;
  popupAssets: any;
  showAnswerSubscription: any;
  popupIcon: any;
  popupIconLocation: any;
  lastQuestionCheck: any;
  popupclosedinRightWrongAns = false;
  ifWrongAns = false;
  popupTime: any;
  LastquestimeStart = false;
  correctAnswerCounter = 0;
  clappingTimer: any;
  multiCorrectTimer: any;
  multiCorrectPopup: any;
  rightTimer: any;
  audio = new Audio();
  selectedIndex: any;
  showAnswerTimer: any;
  videoonshowAnspopUp: any;
  showAnswerRef: any;
  showAnswerfeedback: any;
  disableMainContent = true;
  isOverlay = false;
  parentOptionsClass: any = '';
  mainSvgfile: any = '';
  correctAnsArr: any = [];
  questionIndex: any;
  selectedId: any;
  originalcolor = '';
  disableOptions = true;
  rightAnsVODelay: any;

  @ViewChild('instruction') instruction: any;
  @ViewChild('ansPopup') ansPopup: any;
  @ViewChild('wrongFeedback') wrongFeedback: any;
  @ViewChild('rightFeedback') rightFeedback: any;
  @ViewChild('optionsContainer') optionsContainer: any;
  @ViewChild('clapSound') clapSound: any;
  @ViewChild('multiCorrectFeedback') multiCorrectFeedback: any;
  @ViewChild('quesRef') QuesRef: any;

  constructor(private appModel: ApplicationmodelService, private route: ActivatedRoute, private Sharedservice: SharedserviceService) {

    // subscribing common popup from shared service to get the updated event and values of speaker
    this.Sharedservice.showAnsRef.subscribe(showansref => {
      this.showAnswerRef = showansref;
    });

    this.Sharedservice.showAnswerfeedback.subscribe(showanswerfeedback => {
      this.showAnswerfeedback = showanswerfeedback;
    });
    this.Sharedservice.videoonshowAnspopUp.subscribe(videoonsAnspopUp => {
      this.videoonshowAnspopUp = videoonsAnspopUp;
    });

    // subscribing speaker from shared service to get the updated object of speaker
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
    this.attemptType = '';
    this.setTemplateType();
    console.log('this.attemptType = ' + this.attemptType);
    if (this.appModel.isNewCollection) {
      this.appModel.event = { 'action': 'segmentBegins' };
    }
    this.containgFolderPath = this.getBasePath();
    this.setData();
    this.appModel.getNotification().subscribe(mode => {
      if (mode === 'manual') {
        console.log('manual mode ', mode);

      } else if (mode === 'auto') {
        console.log('auto mode', mode);
        this.attemptType = 'uttarDikhayein';
      }
    });


    this.showAnswerSubscription = this.appModel.getConfirmationPopup().subscribe((val) => {
      this.appModel.stopAllTimer();
      this.pauseSpeaker();
      this.stopAllSounds();
      this.enableAllOptions();
      clearTimeout(this.clappingTimer);

      if (this.showAnswerRef && this.showAnswerRef.nativeElement) {
        this.videoonshowAnspopUp.nativeElement.src = this.showAnswerPopup.video.location === 'content' ? this.containgFolderPath + '/' + this.showAnswerPopup.video.url : this.assetsPath + '/' + this.showAnswerPopup.video.url;
        this.showAnswerRef.nativeElement.classList = 'modal d-flex align-items-center justify-content-center showit ansPopup dispFlex';
        if (this.videoonshowAnspopUp && this.videoonshowAnspopUp.nativeElement) {
          this.videoonshowAnspopUp.nativeElement.play();
          this.videoonshowAnspopUp.nativeElement.onended = () => {
            this.showAnswerTimer = setTimeout(() => {
              this.closePopup('showanswer');
            }, 10000);
          };
        }
      }
    });


    this.appModel.nextBtnEvent().subscribe(() => {
      alert();
      if (this.appModel.isLastSectionInCollection) {
        this.appModel.event = { 'action': 'segmentEnds' };
      }
      if (this.appModel.isLastSection) {
        this.appModel.event = { 'action': 'end' };
      }
    });

    this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
      if (mode === 'manual') {
        // show modal for manual
        this.appModel.notifyUserAction();
        if (this.ansPopup && this.ansPopup.nativeElement) {
          this.ansPopup.nativeElement.classList = 'displayPopup modal';
        }
      }
    });

    this.appModel.postWrongAttempt.subscribe(() => {
      this.appModel.notifyUserAction();

    });
    this.getSVGLoaded(this.mainSvgfile);
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
    clearTimeout(this.rightAnsVODelay);
    this.audio.pause();
  }

  /****** On hover SVG image ********/
  mouseOverSVG(event) {
    const id = event.target.getAttribute('xlink:href');
    const idFound = this.quesObj.tablet.questionText.find(element => element.id === id || element.symbolFillId === id || element.symbolStrokeId === id || element.symbol2FillId === id);
    if (idFound) {
      if (!idFound['selected']) {
        if (this.originalcolor !== undefined && this.quesObj.tablet.questionText[this.questionIndex] !== undefined && !this.quesObj.tablet.questionText[this.questionIndex]['selected']) {
          document.querySelector(this.QuesRef.nativeElement.children[0].children[this.questionIndex + 1].children[0].children[0].getAttribute('xlink:href')).setAttribute('fill', this.originalcolor);
        }
        this.questionIndex = this.quesObj.tablet.questionText.findIndex(element => element.id === id || element.symbolFillId === id || element.symbolStrokeId === id || element.symbol2FillId === id);
        this.originalcolor = document.querySelector(this.QuesRef.nativeElement.children[0].children[this.questionIndex + 1].children[0].children[0].getAttribute('xlink:href')).getAttribute('fill');
        if (this.questionIndex !== -1) {
          this.pauseSpeaker();
          document.querySelector(this.QuesRef.nativeElement.children[0].children[this.questionIndex + 1].children[0].children[0].getAttribute('xlink:href')).setAttribute('fill', this.mainSvgfile.hoverColor);
        }
      } else {
        this.pauseSpeaker();
      }

    }
  }

  /****** On mouse out SVG image ********/
  mouseOutSVG(event) {
    if (this.questionIndex !== undefined && this.quesObj.tablet.questionText[this.questionIndex] !== undefined && !this.quesObj.tablet.questionText[this.questionIndex]['selected']) {
      document.querySelector(this.QuesRef.nativeElement.children[0].children[this.questionIndex + 1].children[0].children[0].getAttribute('xlink:href')).setAttribute('fill', this.originalcolor);
    }
  }

  /****** On click SVG image ********/
  onSVGClick(event) {
    const id = event.target.getAttribute('xlink:href');
    const questionIndex = this.quesObj.tablet.questionText.findIndex(element => element.id === id || element.symbolFillId === id || element.symbolStrokeId === id || element.symbol2FillId === id);
    if (questionIndex !== -1) {
      this.quesObj.tablet.questionText.forEach((ques, index) => {
        if (!ques['answered']) {
          document.querySelector(this.QuesRef.nativeElement.children[0].children[index + 1].children[0].children[0].getAttribute('xlink:href')).setAttribute('fill', 'white');
        }
        this.quesObj.tablet.questionText[index]['selected'] = false;
      });
      document.querySelector(this.QuesRef.nativeElement.children[0].children[questionIndex + 1].children[0].children[0].getAttribute('xlink:href')).setAttribute('fill', '#e6e8fa');
      this.quesObj.tablet.questionText[questionIndex]['selected'] = true;
      this.selectedIndex = questionIndex;
      this.selectedId = id;
      this.disableOptions = false;
    }
  }

  /******On Hover option ********/
  onHoverOptions(option) {
    this.pauseSpeaker();
    option.image_bg = option.image_bg_hover;
  }

  /******Hover out option ********/
  onHoveroutOptions(option) {
    if (!option.selected) {
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
      if (soundAssets.location === 'content') {
        this.audio.src = this.containgFolderPath + '/' + soundAssets.url;
      } else {
        this.audio.src = soundAssets.url;
      }
      this.audio.load();
      this.audio.play();
      for (let i = 0; i < this.optionsContainer.nativeElement.children.length; i++) {
        if (i !== idx) {
          this.optionsContainer.nativeElement.children[i].classList.add('disableDiv');
        }
      }
      this.audio.onended = () => {
        this.enableAllOptions();
      };
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
      if (this.optionsContainer.nativeElement.children[i].classList.contains('disableDiv') && !this.myoption.optionsArr[i]["selected"]) {
        this.optionsContainer.nativeElement.children[i].classList.remove('disableDiv');
      }
    }
  }

  /** Function to stop all sounds **/
  stopAllSounds() {
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

    this.videoonshowAnspopUp.nativeElement.pause();
    this.videoonshowAnspopUp.nativeElement.currentTime = 0;

    this.multiCorrectFeedback.nativeElement.pause();
    this.multiCorrectFeedback.nativeElement.currentTime = 0;
  }

  /** Function to pause the speaker **/
  pauseSpeaker() {
    const speakerEle = document.getElementsByClassName('speakerBtn')[0].children[2] as HTMLAudioElement;
    if (!speakerEle.paused) {
      speakerEle.pause();
      speakerEle.currentTime = 0;
      document.getElementById('waveAnimation').style.display = 'none';
      (document.getElementById('spkrBtn') as HTMLElement).style.pointerEvents = '';
      this.speaker.imgsrc = this.speaker.imgorigional;
    }
  }

  /** Function called on click of speaker **/
  onSpeakerClicked() {
    this.stopAllSounds();
    this.enableAllOptions();
  }

  /**** Load SVG image ****/
  getSVGLoaded(fileData) {
    const fileUrl = fileData.location === 'content'
      ? this.containgFolderPath + '/' + fileData.url : this.assetsPath + '/' + fileData.url;
    this.appModel.getFileString(fileUrl)
      .subscribe((data) => {
        const parser = new DOMParser();
        const newNode = parser.parseFromString(data, 'text/xml');
        newNode.documentElement.style.maxWidth = '100%';
        newNode.documentElement.style.maxHeight = '100%';
        document.getElementById('svgContainer').appendChild(newNode.documentElement);
      });
  }

  /**** Set data for the Template ****/
  setData() {
    this.appModel.notifyUserAction();
    const fetchedData: any = this.appModel.content.contentData.data;
    this.instructiontext = fetchedData.instructiontext;
    this.myoption = JSON.parse(JSON.stringify(fetchedData.options));
    this.commonAssets = fetchedData.commonassets;
    this.speaker = fetchedData.speaker;
    this.feedback = fetchedData.feedback;
    this.mainSvgfile = fetchedData.svgInfo;
    this.quesObj = JSON.parse(JSON.stringify(fetchedData.quesObj));
    this.noOfImgs = fetchedData.imgCount;
    this.popupAssets = fetchedData.feedback.popupassets;
    this.correct_ans_index = this.feedback.correct_ans_index;
    this.rightPopup = this.feedback.right_ans_sound;
    this.wrongPopup = this.feedback.wrong_ans_sound;
    this.multiCorrectPopup = this.feedback.all_correct_sound;
    this.showAnswerVO = this.feedback.show_ans_sound;
    this.showAnswerPopup = this.feedback.show_ans_popup;
    this.lastQuestionCheck = this.commonAssets.ques_control.isLastQues;
    this.commonAssets.ques_control.blinkingStatus = false;
    this.isLastQues = this.appModel.isLastSection;
    this.isLastQuesAct = this.appModel.isLastSectionInCollection;
    this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);

    // parent class for pencil based on number of options
    if (this.myoption.optionsArr.length === 6) {
      this.parentOptionsClass = 'pencil_option_6';
    } else if (this.myoption.optionsArr.length === 5) {
      this.parentOptionsClass = 'pencil_option_5';
    }
  }

  /******Set template type for EVA******/
  setTemplateType(): void {
    this.route.data.subscribe(data => {
      this.Sharedservice.sendData(data);
    });
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
        popupRef.className = 'modal d-flex align-items-center justify-content-center showit ansPopup dispFlex';
        this.rightAnsVODelay = setTimeout(() => {
          feedback.nativeElement.play();
        }, 1000);
      }
      else {
        feedback.nativeElement.play();
      }
    }, 2000);
  }

  /****** Show right answer popup on all correct answer selection ********/
  showRightAnswerPopup() {
    if (this.multiCorrectFeedback && this.multiCorrectFeedback.nativeElement) {
      const svgElement = this.QuesRef.nativeElement.children[0].cloneNode(true);
      const rightAnswerPopup: HTMLElement = this.ansPopup.nativeElement as HTMLElement;
      document.getElementById('rightAnsPopup').appendChild(svgElement);
      this.setClappingTimer(this.multiCorrectFeedback, rightAnswerPopup);
    }
    this.multiCorrectFeedback.nativeElement.onended = () => {
      this.disableMainContent = true;
      this.Sharedservice.setShowAnsClickDisabled(false);
      this.rightTimer = setTimeout(() => {
        this.closePopup('answerPopup');
      }, 10000);
    };
  }

  /**** Check answer on option click *****/
  checkAnswer(option, index) {
    option.image_bg = option.image_bg_original; // Reset Hover image to normal
    this.disableOptions = true;
    this.disableCursorOnSVG();
    this.enableAllOptions();
    this.disableMainContent = true; // Disable the mainContent when option is selected
    this.Sharedservice.setShowAnsClickDisabled(true);
    this.stopAllSounds();
    if (option.id === this.quesObj.tablet.questionText[this.selectedIndex].correctAnsId) {
      this.correctAnswerCounter++;
      option['selected'] = true;
      this.correctAnsArr.push(option.id);
      this.quesObj.tablet.questionText[this.selectedIndex]['answered'] = true;
      document.querySelector(this.QuesRef.nativeElement.children[0].children[this.selectedIndex + 1].children[0].children[0].getAttribute('xlink:href')).setAttribute('fill', option.image_bg_color);
      this.QuesRef.nativeElement.children[0].children[this.selectedIndex + 1].style.pointerEvents = 'none';
      option.image_bg = option.image_bg_disabled;  // show disabled background image
      option.image = option.image_disabled;  // show disabled background image
      this.optionsContainer.nativeElement.children[index].classList.add('disableDiv');  // disable option on correct answer
      this.appModel.stopAllTimer();
      this.ifRightAns = true;
      this.popupIcon = this.popupAssets.right_icon.url;
      this.popupIconLocation = this.popupAssets.right_icon.location;

      if (this.rightFeedback && this.rightFeedback.nativeElement) {
        if (this.correctAnswerCounter === this.quesObj.tablet.questionText.length) {
          this.appModel.storeVisitedTabs();
          this.showRightAnswerPopup();
        } else {
          this.setClappingTimer(this.rightFeedback);
          this.rightFeedback.nativeElement.onended = () => {
            this.disableMainContent = false; // Enable main content
            this.enableCursorOnSVG();
            this.Sharedservice.setShowAnsClickDisabled(false);
          };
        }
      }
    } else {
      this.ifWrongAns = true;
      // play wrong feed back audio
      this.wrongCounter += 1;
      if (this.wrongFeedback && this.wrongFeedback.nativeElement) {
        this.wrongFeedback.nativeElement.play();
      }

      this.wrongFeedback.nativeElement.onended = () => {
        this.disableMainContent = false; // Enable main content
        document.querySelector(this.QuesRef.nativeElement.children[0].children[this.selectedIndex + 1].children[0].children[0].getAttribute('xlink:href')).setAttribute('fill', this.originalcolor);
        this.quesObj.tablet.questionText[this.selectedIndex]['selected'] = false;
        this.enableCursorOnSVG();
        this.shuffleOptions();
        this.Sharedservice.setShowAnsClickDisabled(false);
      };
    }
  }

  shuffleOptions() {
    this.idArray = [];
    const filteredArray = this.myoption.optionsArr.filter(arr => !arr['selected']);
    for (const i of filteredArray) {
      this.idArray.push(i.image_bg_color);
    }
    this.doRandomize(filteredArray);
    if (this.wrongCounter >= 3 && this.ifWrongAns) {
      this.Sharedservice.setShowAnsEnabled(true);
    }
  }

  /****Randomize option on wrong selection*****/
  doRandomize(array) {

    let currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      const option1 = array[currentIndex].image;
      const img_hover1 = array[currentIndex].image_hover;
      const img_disabled1 = array[currentIndex].image_disabled;
      const img_original1 = array[currentIndex].image_original;
      const img_id1 = array[currentIndex].id;

      const option2 = array[randomIndex].image;
      const img_hover2 = array[randomIndex].image_hover;
      const img_disabled2 = array[randomIndex].image_disabled;
      const img_original2 = array[randomIndex].image_original;
      const img_id2 = array[randomIndex].id;

      // And swap it with the current element.

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;

      array[currentIndex].image = option1;
      array[currentIndex].image_hover = img_hover1;
      array[currentIndex].image_disabled = img_disabled1;
      array[currentIndex].image_original = img_original1;
      array[currentIndex].id = img_id1;

      array[randomIndex].image = option2;
      array[randomIndex].image_hover = img_hover2;
      array[randomIndex].image_disabled = img_disabled2;
      array[randomIndex].image_original = img_original2;
      array[randomIndex].id = img_id2;

    }
    const flag = this.arraysIdentical(array, this.idArray);
    if (flag) {
      this.doRandomize(array);
    }
  }

  /*****Check if array is identical******/
  arraysIdentical(a, b) {
    let i = a.length;
    while (i--) {
      if (a[i].image_bg_color === b[i]) {
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
    clearTimeout(this.multiCorrectTimer);
    clearTimeout(this.rightAnsVODelay);

    this.showAnswerRef.nativeElement.classList = 'modal';
    this.ansPopup.nativeElement.classList = 'modal';
    this.stopAllSounds();

    if (Type === 'answerPopup') {
      this.popupclosedinRightWrongAns = true;
      if (this.ifRightAns) {
        this.Sharedservice.setShowAnsEnabled(true);
        this.isOverlay = true;
        this.blinkOnLastQues();
        if (!this.lastQuestionCheck) {
          this.popupTime = setTimeout(() => {
          }, 10000);
        } else if (this.lastQuestionCheck) {
          this.Sharedservice.setTimeOnLastQues(true);
        }
      }
    } else if (Type === 'showanswer') {
      if (this.correctAnswerCounter === this.quesObj.tablet.questionText.length) {
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
      this.appModel.moveNextQues('');
    }
  }

  /** Disable all clickables until instruction VO ends **/
  checkforQVO() {
    if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
      this.instruction.nativeElement.src = this.quesObj.quesInstruction.location === 'content'
        ? this.containgFolderPath + '/' + this.quesObj.quesInstruction.url : this.assetsPath + '/' + this.quesObj.quesInstruction.url;
      this.appModel.handlePostVOActivity(true);
      this.disableMainContent = true;
      this.instruction.nativeElement.play();
      this.instruction.nativeElement.onended = () => {
        this.appModel.handlePostVOActivity(false);
        this.disableMainContent = false;
        this.enableCursorOnSVG();
      };
    } else {
      this.appModel.handlePostVOActivity(false);
    }
  }

  /** Enable cursor on SVG image **/
  enableCursorOnSVG() {
    for (let i = 1; i < this.QuesRef.nativeElement.children[0].children.length; i++) {
      if (this.quesObj.tablet.questionText[i - 1] && !this.quesObj.tablet.questionText[i - 1]['answered']) {
        this.QuesRef.nativeElement.children[0].children[i].style.pointerEvents = 'fill';
        this.QuesRef.nativeElement.children[0].children[i].style.cursor = 'pointer';
      }
    }
  }

  /** Disable cursor on SVG image **/
  disableCursorOnSVG() {
    for (let i = 1; i < this.QuesRef.nativeElement.children[0].children.length; i++) {
      if (this.quesObj.tablet.questionText[i - 1] && !this.quesObj.tablet.questionText[i - 1]['answered']) {
        this.QuesRef.nativeElement.children[0].children[i].style.pointerEvents = 'none';
      }
    }
  }
}

