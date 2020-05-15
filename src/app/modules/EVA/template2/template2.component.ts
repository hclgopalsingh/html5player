import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { PlayerConstants } from '../../../common/playerconstants';
import { ActivatedRoute } from '@angular/router';
import { SharedserviceService } from '../../../services/sharedservice.service';

@Component({
  selector: 'app-template2',
  templateUrl: './template2.component.html',
  styleUrls: ['./template2.component.css']
})
export class Template2Component implements OnInit {
  blink: boolean = false;
  commonAssets: any = "";
  rightPopup: any;
  wrongPopup: any;
  wrongTimer: any;
  i = 0;
  j: number = 0;
  myoption: any = [];
  feedback: any = "";
  bool: boolean = false;
  popupType: string = "";
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
  blinkTimeInterval: any;
  blinkSide: string = "";
  isWrongAttempted: boolean = false;
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
  hasEventFired: boolean = false;
  speaker: any;
  tempSubscription: Subscription;
  closed: boolean = false;
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
  answerPopupType: any;
  lastQuestionCheck: any;
  popupclosedinRightWrongAns: boolean = false;
  ifWrongAns: boolean = false;
  popupTime: any;
  LastquestimeStart: boolean = false;
  correctAnswerCounter: number = 0;

  @ViewChild('instruction') instruction: any;
  @ViewChild('audioEl') audioEl: any;
  @ViewChild('sprite') sprite: any;
  @ViewChild('speakerNormal') speakerNormal: any;
  @ViewChild('ansPopup') ansPopup: any;
  @ViewChild('showAnswerfeedback') showAnswerfeedback: any;
  @ViewChild('showAnswerRef') showAnswerRef: any;
  @ViewChild('wrongFeedback') wrongFeedback: any;
  @ViewChild('rightFeedback') rightFeedback: any;
  @ViewChild('disableSpeaker') disableSpeaker: any;
  @ViewChild('myAudiospeaker') myAudiospeaker: any;
  @ViewChild('maincontent') maincontent: any;
  @ViewChild('footerNavBlock') footerNavBlock: any;
  @ViewChild('ansBlock') ansBlock: any;
  @ViewChild('mainContainer') mainContainer: any;
  @ViewChild('instructionBar') instructionBar: any;
  @ViewChild('clapSound') clapSound: any;
  @ViewChild('overlay') overlay: any;
  @ViewChild('celebrationPopup') celebrationsPopup: any;
  @ViewChild('multiCorrectFeedback') multiCorrectFeedback: any;
  clappingTimer: any;
  multiCorrectPopup: any;
  rightTimer: any;

  constructor(private appModel: ApplicationmodelService, private ActivatedRoute: ActivatedRoute, private Sharedservice: SharedserviceService) {
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
  }

  ngOnInit() {
    this.sprite.nativeElement.style = "display:none";
    this.Sharedservice.setShowAnsEnabled(false);
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
        this.popupType = "showanswer"
        // this.setPopupAssets();
        // this.getAnswer();
      }
    })


    this.showAnswerSubscription = this.appModel.getConfirmationPopup().subscribe((val) => {
      if (val == "uttarDikhayein") {
        // this.appModel.stopAllTimer(); 

        clearTimeout(this.popupTime);

        if (this.showAnswerRef && this.showAnswerRef.nativeElement) {

          this.showAnswerRef.nativeElement.classList = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";

          if (this.showAnswerfeedback && this.showAnswerfeedback.nativeElement) {
            this.showAnswerfeedback.nativeElement.play();

          }
          this.popupType = "showanswer";

          this.showAnswerfeedback.nativeElement.onended = () => {
            setTimeout(() => {
              this.closePopup('showAnswer');
            }, 10000);
          }

          this.blinkOnLastQues();
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
          // $("#instructionBar").addClass("disableDiv");
          this.ansPopup.nativeElement.classList = "displayPopup modal";
          // this.setFeedbackAudio(mode);
        }

      } else if (mode == "auto") {
        // console.log("mode manual2 show answer working", mode)
        // this.showAnswers();
      }
    })

    this.appModel.postWrongAttempt.subscribe(() => {
      //  this.resetActivity();
      //this.appModel.startPreviousTimer();
      this.appModel.notifyUserAction();
      //   this.blinkOnLastQues();

    })
  }
  ngOnDestroy() {
    this.showAnswerSubscription.unsubscribe();
    clearTimeout(this.clappingTimer);
  }

  ngAfterViewChecked() {
    // console.log(this.LastquestimeStart, 'timer jyoti');
    this.templatevolume(this.appModel.volumeValue, this);

  }

  setData() {
    this.appModel.notifyUserAction();
    let fetchedData: any = this.appModel.content.contentData.data;
    this.instructiontext = fetchedData.instructiontext;
    this.myoption = fetchedData.options;
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
    this.showAnswerVO = this.feedback.show_ans_sound;
    this.showAnswerPopup = this.feedback.show_ans_popup;
    this.lastQuestionCheck = this.commonAssets.ques_control.isLastQues;
    this.commonAssets.ques_control.blinkingStatus = false;
    this.isLastQues = this.appModel.isLastSection;
    this.isLastQuesAct = this.appModel.isLastSectionInCollection;
    this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
    setTimeout(() => {
      if (this.footerNavBlock && this.footerNavBlock.nativeElement) {
        this.footerNavBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around";
      }
    }, 200)

  }

  setTemplateType(): void {
    // send message to subscribers via observable subject
    this.ActivatedRoute.data.subscribe(data => {
      this.Sharedservice.sendData(data);
    })
  }

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
    if (obj.showAnswerfeedback && obj.showAnswerfeedback.nativeElement) {
      obj.showAnswerfeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
  }

  getBasePath() {
    if (this.appModel && this.appModel.content) {
      return this.appModel.content.id + '';
    }
  }

  playSpeaker(el: HTMLAudioElement, speaker) {
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
        if (this.maincontent) {
          this.maincontent.nativeElement.className = "disableDiv";
        }
        el.onended = () => {
          if (this.maincontent) {
            this.maincontent.nativeElement.className = "";
            this.sprite.nativeElement.style = "display:none";
          }
        }

      }
    }
  }

  checkSpeakerVoice(speaker) {
    if (!this.audioEl.nativeElement.paused) {
      // this.speakerNormal.nativeElement.style.display ="none";
      // this.sprite.nativeElement.style.display ="block";
    } else {
      speaker.imgsrc = speaker.imgorigional;
      this.sprite.nativeElement.style = "display:none";
      clearInterval(this.speakerTimer);
    }
  }

  /**SPEAKER HOVER */
  onHoverSpeaker(speaker) {
    speaker.imgsrc = speaker.imghover;
    if (!this.instruction.nativeElement.paused) {
      this.disableSpeaker.nativeElement.className = "speakerBlock";
    }
    else {
      this.disableSpeaker.nativeElement.className = "speakerBlock pointer";
    }
  }

  onHoverOutSpeaker(speaker) {
    speaker.imgsrc = speaker.imgorigional;
  }

  checkAnswer(option, optRef) {
    this.popupclosedinRightWrongAns = false;
    // logic to check what user has done is correct
    if (this.feedback.correct_ans_index.indexOf(option.id) > -1) {
      let optRefEl = optRef.children[1] as HTMLElement;
      if (!optRefEl) {
        return;
      }
      this.correctAnswerCounter++;
      let ansRef = document.getElementById("answer" + this.correctAnswerCounter) as HTMLElement;
      ansRef.insertAdjacentElement("beforeend", optRefEl);
      this.wrongCounter = 0; // Reset Wrong option attempt
      this.answerPopupType = 'right';
      clearTimeout(this.wrongTimer);
      //this.correctOpt = option;
      this.attemptType = "manual";
      this.appModel.stopAllTimer();
      this.ansBlock.nativeElement.className = "optionsBlock disableDiv";
      //this.ansBlock.nativeElement.className = "optionsBlock disableDiv disable-click";
      this.disableSpeaker.nativeElement.classList.add("disableDiv");
      // this.answerImageBase = option.image_original.url;
      // this.answerImage = option.imgsrc.url;
      // this.answerImagelocation = option.image_original.location;
      // this.popupIcon = this.popupAssets.right_icon.url;
      // this.popupIconLocation = this.popupAssets.right_icon.location;
      this.ifRightAns = true;

      let celebrationsPopup: HTMLElement = this.celebrationsPopup.nativeElement as HTMLElement

      setTimeout(() => {
        //if (this.rightFeedback && this.rightFeedback.nativeElement) {
        //option.image = option.image_hover;

        if (this.correctAnswerCounter === 4) {
          setTimeout(() => {
            if (this.multiCorrectFeedback && this.multiCorrectFeedback.nativeElement) {
              this.clapSound.nativeElement.play();
              celebrationsPopup.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";  
              this.clappingTimer = setTimeout(() => {
                this.clapSound.nativeElement.pause();
                this.clapSound.nativeElement.currentTime = 0;
                // if (this.correctAnswerCounter === 4) {
                //   setTimeout(() => {
                //     //celebrationsPopup.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";  
                //   },4000);

                // }
                //if (!this.popupclosedinRightWrongAns) {
                this.multiCorrectFeedback.nativeElement.play();
                //} else {
                //this.Sharedservice.setShowAnsEnabled(true);

                //}
              }, 2000);
            }
            //celebrationsPopup.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";  
          }, 4000);
          this.multiCorrectFeedback.nativeElement.onended = () => {
            //celebrationsPopup.style.visibility="hidden";
            this.ansBlock.nativeElement.className = "optionsBlock";
            this.disableSpeaker.nativeElement.classList.remove("disableDiv");
            this.maincontent.nativeElement.className = "disableDiv";
            this.ansBlock.nativeElement.className = "optionsBlock disableDiv";
            this.rightTimer = setTimeout(() => {
              this.closePopup('answerPopup');
          }, 10000)
          }
        }
        else if (this.rightFeedback && this.rightFeedback.nativeElement) {
          this.clapSound.nativeElement.play();
          this.clappingTimer = setTimeout(() => {
            this.clapSound.nativeElement.pause();
            this.clapSound.nativeElement.currentTime = 0;
            // if (this.correctAnswerCounter === 4) {
            //   setTimeout(() => {
            //     //celebrationsPopup.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";  
            //   },4000);

            // }
            //if (!this.popupclosedinRightWrongAns) {
            this.rightFeedback.nativeElement.play();
            //} else {
            //this.Sharedservice.setShowAnsEnabled(true);

            //}
          }, 2000);


          this.rightFeedback.nativeElement.onended = () => {
            this.ansBlock.nativeElement.className = "optionsBlock";
            this.disableSpeaker.nativeElement.classList.remove("disableDiv");
            // this.rightTimer=   setTimeout(() => {
            //     this.closePopup('answerPopup');
            // }, 10000)
            //new code
            // setTimeout(() => {
            //     this.attemptType = "manual";                              
            // //    this.blinkOnLastQues()
            // }, 200)
          }

        }


        //disable option and question on right attempt
        // if (this.correctAnswerCounter === 4) {
        //   this.maincontent.nativeElement.className = "disableDiv";
        //   this.ansBlock.nativeElement.className = "optionsBlock disableDiv";
        // }
      })

    } else {
      clearTimeout(this.wrongTimer);
      this.answerPopupType = 'wrong';
      this.ifWrongAns = true;
      this.idArray = [];
      for (let i of this.myoption) {
        this.idArray.push(i.id);
      }
      this.ansBlock.nativeElement.className = "optionsBlock disableDiv";
      this.disableSpeaker.nativeElement.classList.add("disableDiv");
      //let ansPopup: HTMLElement = this.ansPopup.nativeElement as HTMLElement
      //ansPopup.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
      // option.image = option.image_original;
      // this.answerImageBase = option.image.url;
      // this.answerImage = option.imgsrc.url;
      // this.answerImagelocation = option.image.location;
      // this.popupIcon = this.popupAssets.wrong_icon.url;
      // this.popupIconLocation = this.popupAssets.wrong_icon.location;
      //this.appModel.stopAllTimer();
      //play wrong feed back audio
      this.wrongCounter += 1;

      setTimeout(() => {
        if (this.wrongFeedback && this.wrongFeedback.nativeElement) {
          this.wrongFeedback.nativeElement.play();
        }

        this.wrongFeedback.nativeElement.onended = () => {
          this.ansBlock.nativeElement.className = "optionsBlock";
          this.disableSpeaker.nativeElement.classList.remove("disableDiv");
          if (this.wrongCounter >= 3 && this.ifWrongAns) {
            this.Sharedservice.setShowAnsEnabled(true);
          }
          // this.wrongTimer = setTimeout(() => {
          //   this.closePopup('answerPopup');
          // }, 10000);
        }

      });
      //this.doRandomize(this.myoption);
    }
  }

  doRandomize(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      var img_hover1 = array[currentIndex].image_hover;
      var text1 = array[currentIndex].image;
      var text1copy = array[currentIndex].image_original;
      var optionBg1 = array[currentIndex].option_bg;

      var img_hover2 = array[randomIndex].image_hover;
      var text2 = array[randomIndex].image;
      var text2copy = array[randomIndex].image_original;
      var optionBg2 = array[randomIndex].option_bg;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;

      array[currentIndex].image_hover = img_hover1;
      array[currentIndex].image = text1;
      array[currentIndex].image_original = text1copy;
      array[currentIndex].option_bg = optionBg1;

      array[randomIndex].image_hover = img_hover2;
      array[randomIndex].image = text2;
      array[randomIndex].image_original = text2copy;
      array[randomIndex].option_bg = optionBg2;

    }
    var flag = this.arraysIdentical(array, this.idArray);
    if (flag) {
      this.doRandomize(array);
    }
  }

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

  closePopup(Type) {
    this.showAnswerRef.nativeElement.classList = "modal";
    this.celebrationsPopup.nativeElement.classList = "modal";
    this.wrongFeedback.nativeElement.pause();
    this.wrongFeedback.nativeElement.currentTime = 0;

    this.rightFeedback.nativeElement.pause();
    this.rightFeedback.nativeElement.currentTime = 0;

    this.showAnswerfeedback.nativeElement.pause();
    this.showAnswerfeedback.nativeElement.currentTime = 0;

    this.multiCorrectFeedback.nativeElement.pause();
    this.multiCorrectFeedback.nativeElement.currentTime = 0;

    if (Type === "answerPopup") {
      this.popupclosedinRightWrongAns = true;
      if (this.ifRightAns) {
        this.Sharedservice.setShowAnsEnabled(true);
        this.overlay.nativeElement.classList.value = "fadeContainer";
        this.blinkOnLastQues();
        if (!this.lastQuestionCheck) {
          this.popupTime = setTimeout(() => {
            this.appModel.nextSection();
            this.Sharedservice.setShowAnsEnabled(false);
          }, 10000)
        } else if (this.lastQuestionCheck) {
          this.Sharedservice.setTimeOnLastQues(true);
        }
      }
    }
    if (Type === 'showAnswer') {

      this.popupTime = setTimeout(() => {
        this.showAnswerfeedback.nativeElement.pause();
        this.showAnswerfeedback.nativeElement.currentTime = 0;
        if (!this.showAnswerfeedback.nativeElement.pause()) {
          this.appModel.nextSection();
        } else {

        }

      }, 10000);
    } else {

    }

  }
  blinkOnLastQues() {
    this.Sharedservice.setLastQuesAageyBadheStatus(false);
    if (this.lastQuestionCheck) {
      this.LastquestimeStart = true;
      // setTimeout(()=>{                
      //     this.next();
      //   },5 * 60 * 1000);
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
      //   this.appModel.moveNextQues();
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
      this.maincontent.nativeElement.className = "disableDiv";
      // this.Sharedservice.setVoplayingStatus(true);  
      this.instruction.nativeElement.play();
      this.appModel.setLoader(false);
      this.instruction.nativeElement.onended = () => {
        // this.Sharedservice.setVoplayingStatus(false);
        this.appModel.handlePostVOActivity(false);
        this.maincontent.nativeElement.className = "";
      }
    } else {
      this.appModel.handlePostVOActivity(false);
    }
  }
}
