import { Component, OnInit, HostListener, ViewChild, OnDestroy, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { Subject, Observable, Subscription } from 'rxjs'
import 'jquery';
import { ActivatedRoute } from '@angular/router';
import { SharedserviceService } from '../../../services/sharedservice.service';
import { element } from 'protractor';
import { getDiffieHellman } from 'crypto';
declare var $: any;

@Component({
  selector: 'app-template14',
  templateUrl: './template14.component.html',
  styleUrls: ['./template14.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class TemplateFourteenComponent implements OnInit {
  private appModel: ApplicationmodelService;

  constructor(appModel: ApplicationmodelService, private ActivatedRoute: ActivatedRoute, private Sharedservice: SharedserviceService) {
    this.appModel = appModel;
    this.assetsPath = this.appModel.assetsfolderpath;
    this.appModel.navShow = 2;
    this.appModel.setLoader(true);
    // if error occured during image loading loader wil stop after 5 seconds 
    this.loaderTimer = setTimeout(() => {
      this.appModel.setLoader(false);

      this.checkforQVO();
    }, 5000);

    //subscribing speaker from shared service to get the updated object of speaker
    this.Sharedservice.spriteElement.subscribe(imagesrc => {
      this.speaker = imagesrc;
    });
    this.Sharedservice.speakerVol.subscribe(speakerVol => {
      this.speakerVolume = speakerVol;
    });

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


    //this.rightFeedbackVO.nativeElement.currentTime = 0;
    //this.rightFeedbackVO.nativeElement.src = "";
    //this.wrongFeedbackVO.nativeElement.src = "";
    // this.wrongFeedbackVO.nativeElement.pause();
    //this.wrongFeedbackVO.nativeElement.currentTime = 0;
  }

  @ViewChild("optionsBlock") optionsBlock: any;
  @ViewChild('narrator') narrator: any;
  @ViewChild('instruction') instruction: any;
  @ViewChild('optionAudio') optionAudio: any;
  @ViewChild('maincontent') maincontent: any;
  @ViewChild('confirmModalRef') confirmModalRef: any;
  @ViewChild('popupRef') popupRef: any;
  @ViewChild('RightModal') RightModalRef: any;
  @ViewChild('WrongModal') WrongModalRef: any;
  @ViewChild('popupImage') popupImage: any;
  @ViewChild('rightFeedbackVO') rightFeedbackVO: any
  @ViewChild('wrongFeedbackVO') wrongFeedbackVO: any;
  @ViewChild('quesRef') QuesRef: any;
  @ViewChild('hoverquesRef') hoverQuesRef: any;
  @ViewChild('clickquesRef') clickQuesRef: any;
  @ViewChild('playerAudio') myAudio: any;
  @ViewChild('answerModalRef') answerModalRef: any;
  @ViewChild('QuestionAudio') questionAudio: any;
  @ViewChild('mytooltip') Tooltip: any;
  @ViewChild('myLine') Line: any;
  @ViewChild('stateId') StateId: any;
  @ViewChild('confirmSubmitRef') confirmSubmitRef: any;
  @ViewChild('mySelect') MySelect: any;
  @ViewChild('MyForm') MyFormVar: any;
  @ViewChild('imgRef') imgRef: any;
  @ViewChild('feedbackPopupAudio') feedbackPopupAudio: any;
  @ViewChild('infoModalRef') infoModalRef: any;
  @ViewChild('feedbackInfoAudio') feedbackInfoAudio: any;
  @ViewChild('monthDates') monthDates: any;
  @ViewChild('monthDatesinPopup') monthDatesinPopup: any;
  @ViewChild('footerNavBlock') footerNavBlock: any;
  @ViewChild('speakerNormal') speakerNormal: any;
  @ViewChild('disableSpeaker') disableSpeaker: any;
  @ViewChild('sprite') sprite: any;
  @ViewChild('overlay') overlay: any;
  @ViewChild('clapSound') clapSound: any;
  @ViewChild('wrongFeedback') wrongFeedback: any;
  @ViewChild('rightFeedback') rightFeedback: any;
  @ViewChild('showAnswerVideo') showAnswerVideo: any;


  LastquestimeStart: boolean = false;
  videoonshowAnspopUp: any;
  showAnswerRef: any;
  showAnswerfeedback: any;
  showAnswerTimer:any;
  wrongCounter: number = 0;
  rightPopup: any;
  wrongPopup: any;
  wrongTimer: any;
  rightTimer: any;
  audio = new Audio();
  commonAssets: any = "";
  feedback: any = "";
  narratorAudio: any;
  checked: boolean = false;
  selected: boolean = false;
  isFirstQues: boolean;
  isLastQues: boolean = false;
  isLastQuesAct: boolean;
  noOfImgs: number;
  noOfImgsLoaded: number = 0;
  loaderTimer: any;
  containgFolderPath: string = "";
  assetsPath: string = "";
  loadFlag: boolean = false;
  ques_control: any;
  feedbackObj: any;
  popupAssets: any;
  confirmPopupAssets: any;
  tempSubscription: Subscription;
  rightanspopUp: any;
  wronganspopUp: any;
  quesObj: any;
  popupIcon: any;
  popupIconLocation: any;
  Id: any;
  quesAudio: any;
  CorrectAudio: any;
  WrongAudio: any;
  partiallyCorrectAudio: any;
  myRightAnswer: any = [];
  rightAnswerCounter: number = 0;
  wrongAnswerCounter: number = 0;
  confirmSubmitAssets: any;
  showAnswerCounter: number = 0;
  showAnswerarray: any = [];
  attemptType: string = "";
  optionSelected: any;
  styleHeaderPopup: any;
  styleBodyPopup: any;
  instructiontext: string;
  monthsArr: any = [];
  ArrweekDays: any = [];
  Arryears: any = [];
  startIndex: number;
  datesArr: any = [];
  date: any;
  clickedID: any;
  previousItemevent: any;
  isCorrectMonth: boolean = true;
  isCorrectYear: boolean = true;
  isCorrectDate: boolean = true;
  isCorrectweekDay: boolean = true;
  yearSelected: boolean = false;
  monthSelected: boolean = false;
  dateSelected: boolean = false;
  weekDaySelected: boolean = false;
  monthfromLocalMachine: boolean = true;
  yearfromLocalMachine: boolean = true;
  selectedDaysId = [];
  selectedDatesId = [];
  selectedMonthsId = [];
  selectedYearID = [];
  speaker: any;
  speakerVolume: any;
  isRight:boolean = true;
  showAnswerPopup: any;
  showAnswerVO: any;
  lastQuestionCheck: any;

  playHoverInstruction() {
    if (!this.narrator.nativeElement.paused) {
      console.log("narrator/instruction voice still playing");
    } else {
      console.log("play on Instruction");
      this.instruction.nativeElement.load();
      if (this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.play();
        //this.QuesRef.nativeElement.style.pointerEvents = "none";
        $(".instructionBase img").css("cursor", "pointer");
        this.instruction.nativeElement.onended = () => {
          //this.QuesRef.nativeElement.style.pointerEvents = "";
        }
      }

    }
    // this.questionAudio.nativeElement.src = this.quesAudio.location=="content" ? this.containgFolderPath +"/"+ this.quesAudio.url : this.assetsPath +"/"+ this.quesAudio.url;
    //  this.questionAudio.nativeElement.load();
    //  this.questionAudio.nativeElement.play();
  }

  ngAfterViewChecked() {
    this.appModel.templatevolume(this.appModel.volumeValue, this);
  }

  templatevolume(vol, obj) {
        if (obj.quesVORef && obj.quesVORef.nativeElement) {
            obj.quesVORef.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.instructionVO && obj.instructionVO.nativeElement) {
            obj.instructionVO.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.feedbackAudio && obj.feedbackAudio.nativeElement) {
            obj.feedbackAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.audio) {
            obj.audio.volume = obj.appModel.isMute ? 0 : vol;
        }
        if(obj.showAnswerVideo && obj.showAnswerVideo.nativeElement){
            this.showAnswerVideo.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.wrongFeedback && obj.wrongFeedback.nativeElement) {
          obj.wrongFeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
         }
        if (obj.rightFeedback && obj.rightFeedback.nativeElement) {
            obj.rightFeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.videoonshowAnspopUp && obj.videoonshowAnspopUp.nativeElement) {
          obj.videoonshowAnspopUp.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
         }
        if (obj.clapSound && obj.clapSound.nativeElement) {
          obj.clapSound.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
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

  ngOnInit() {
    this.setTemplateType();
    this.setData();
    // this.sprite.nativeElement.style = "display:none";
    this.Sharedservice.setSubmitAnsEnabled(false);
    this.Sharedservice.setShowAnsEnabled(false);
    this.Sharedservice.setLastQuesAageyBadheStatus(false);
    if (this.appModel.isNewCollection) {
      this.appModel.event = { 'action': 'segmentBegins' };
    }
    this.appModel.functionone(this.templatevolume, this);//start end
    this.containgFolderPath = this.getBasePath();
    if (this.rightFeedbackVO != undefined || this.wrongFeedbackVO != undefined) {
      this.rightFeedbackVO.nativeElement.pause();
      this.rightFeedbackVO.nativeElement.currentTime = 0;
      this.rightFeedbackVO.nativeElement.src = "";
      this.wrongFeedbackVO.nativeElement.src = "";
      this.wrongFeedbackVO.nativeElement.pause();
      this.wrongFeedbackVO.nativeElement.currentTime = 0;
    }

    //this.setData();
    this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
      if (mode == "manual") {
        //show modal for manual
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          $("#instructionBar").addClass("disable_div");
          // this.popupRef.nativeElement.classList = "displayPopup modal";
          console.log("No-1");

          //this.setFeedbackAudio();
        }
      } else if (mode == "auto") {
        this.checked = true;
        //show modal of auto
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          $("#instructionBar").addClass("disable_div");
          //this.popupRef.nativeElement.classList = "displayPopup modal";
          console.log("No-2");
          this.showAnswerFeedback();
          this.styleHeaderPopup = this.feedbackObj.style_header;
          this.styleBodyPopup = this.feedbackObj.style_body;
          this.confirmModalRef.nativeElement.classList = "modal";
          this.confirmSubmitRef.nativeElement.classList = "modal";
          this.popupRef.nativeElement.classList = "displayPopup modal";
          //this.grayOverTimer();
          //this.showAnswer();		 
          this.feedbackPopupAudio.nativeElement.src = this.commonAssets.showAnsAudio.location == "content" ? this.containgFolderPath + "/" + this.commonAssets.showAnsAudio.url : this.assetsPath + "/" + this.commonAssets.showAnsAudio.url;
          this.feedbackPopupAudio.nativeElement.load();
          this.feedbackPopupAudio.nativeElement.play();
          this.feedbackPopupAudio.nativeElement.onended = () => {
            //this.closeModal();

          }
          $("#optionsBlock").css("opacity", "0.3");
          $("#instructionBar").css("opacity", "0.3");
          //this.appModel.handlePostVOActivity(true);
          this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
          $("#instructionBar").addClass("disable_div");
        }
      }
    })

    this.appModel.getConfirmationPopup().subscribe((val) => {
      if (val == "uttarDikhayein") {
        // this.instruction.nativeElement.currentTime = 0;
        // this.instruction.nativeElement.pause();
        // if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
        //   this.confirmModalRef.nativeElement.classList = "displayPopup modal";
        //   this.appModel.notifyUserAction();
        // }

        this.appModel.stopAllTimer();
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
                    this.videoonshowAnspopUp.nativeElement.play();
                    this.videoonshowAnspopUp.nativeElement.onended = () => {
                        this.showAnswerTimer=  setTimeout(() => {
                            this.closePopup('showAnswer');
                        }, 10000);
                    }
                }
            }

      } else if (val == "submitAnswer") {
        this.instruction.nativeElement.currentTime = 0;
        console.log("submit answer")
        this.instruction.nativeElement.pause();
        if (this.confirmSubmitRef && this.confirmSubmitRef.nativeElement) {
          this.confirmSubmitRef.nativeElement.classList = "displayPopup modal";
          this.appModel.notifyUserAction();
        }
      }
    })

    this.appModel.questionEvent.subscribe(() => {
      if (this.rightanspopUp) {
        console.log("timer still exist");
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
        this.appModel.event = { 'action': 'exit' };
      }
    });

    this.appModel.postWrongAttempt.subscribe(() => {
      this.postWrongAttemplt();
    });
    this.appModel.resetBlinkingTimer();
  }

  postWrongAttemplt() {
    this.setDatefromJSON();
    this.Sharedservice.setSubmitAnsEnabled(false);
    //resetting dates
    for (let i = this.startIndex; i >= 0; i--) {
      this.monthDatesinPopup.nativeElement.children[0].children[i].children[0].src = this.datesArr[0].base_original.location == "content" ? this.containgFolderPath + "/" + this.datesArr[0].base_original.url : this.assetsPath + "/" + this.datesArr[0].base_original.url;;
      this.monthDatesinPopup.nativeElement.children[0].children[i].children[0].style.pointerEvents = "";
    }
    //resetting months
    this.monthsArr.forEach(element => {
      element.ImginpopUp = element.ImginpopUp_original
    });
    //resetting years
    this.Arryears.forEach(element => {
      element.ImginpopUp = element.ImginpopUp_original
    });
    //resetting weeks
    this.ArrweekDays.forEach(element => {
      element.weekDayImginpopUp = element.weekDayImginpopUp_original
    });
  }

  checkImgLoaded() {
    if (!this.loadFlag) {
      this.noOfImgsLoaded++;
      if (this.noOfImgsLoaded >= this.noOfImgs) {
        this.appModel.setLoader(false);
        this.loadFlag = true;
        clearTimeout(this.loaderTimer);
        this.checkforQVO();
        this.Sharedservice.setShowAnsEnabled(false);
      }
    }
  }

  /******Set template type for EVA******/
  setTemplateType(): void {
    this.ActivatedRoute.data.subscribe(data => {
      this.Sharedservice.sendData(data);
    })
  }

  checkforQVO() {
    if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
      this.narrator.nativeElement.src = this.quesObj.quesInstruction.location == "content" ? this.containgFolderPath + "/" + this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
      //this.appModel.handlePostVOActivity(true);
      let instruction: HTMLElement = document.getElementsByClassName("instructionBase")[0] as HTMLElement;
      instruction.style.pointerEvents = "none"
      this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
      //this.appModel.handlePostVOActivity(true);
      this.narrator.nativeElement.play();
      this.narrator.nativeElement.onended = () => {
        // this.appModel.handlePostVOActivity(false);
        instruction.style.pointerEvents = "";
        this.optionsBlock.nativeElement.classList = "row mx-0";
      }
    } else {
      this.appModel.handlePostVOActivity(false);
    }
  }

  hoveronMonth(item) {
    //console.log(item);
    // this.appModel.notifyUserAction();
    // if (!this.instruction.nativeElement.paused) {
    //   this.instruction.nativeElement.currentTime=0;
    //   this.instruction.nativeElement.pause();
    // }
    item.base = item.base_hover;
  }

  houtonMonth(item) {
    item.base = item.base_original;
  }

  hoveronYear(item) {
    // this.appModel.notifyUserAction();
    // if (!this.instruction.nativeElement.paused) {
    //   this.instruction.nativeElement.currentTime=0;
    //   this.instruction.nativeElement.pause();
    // }
    item.year_base = item.base_hover;
  }

  houtonYear(item) {
    item.year_base = item.base_original;
  }

  hoveronWeekDays(item) {
    // this.appModel.notifyUserAction();
    // if (!this.instruction.nativeElement.paused) {
    //   this.instruction.nativeElement.currentTime=0;
    //   this.instruction.nativeElement.pause();
    // }
    item.base = item.base_hover;
  }

  houtonWeekDays(item) {
    // item.weekDayImg = item.weekDayOriginalImg;
    item.base = item.base_original
  }

  hoveronDate(ev) {
    if (ev != undefined && ev.target.id != "") {
      //this.appModel.notifyUserAction();
      if (!this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.pause();
      }
      if (!this.datesArr[ev.target.id].selected) {
        ev.target.src = this.datesArr[0].base_hover.location == "content" ? this.containgFolderPath + "/" + this.datesArr[0].base_hover.url : this.assetsPath + "/" + this.datesArr[0].base_hover.url;
      }
    }
  }

  houtonDate(ev) {
    //// console.log("ev",ev.target.src)
    // ev.target.src = this.datesArr[0].base_original.location=="content" ? this.containgFolderPath +"/"+ this.datesArr[0].base_original.url : this.assetsPath +"/"+ this.datesArr[0].base_original.url;
    //console.log("ev", ev.target.src)
    if (ev != undefined && ev.target.id != "") {
      //   //this.appModel.notifyUserAction();
      if (!this.datesArr[ev.target.id].selected) {
        ev.target.src = this.datesArr[0].base_original.location == "content" ? this.containgFolderPath + "/" + this.datesArr[0].base_original.url : this.assetsPath + "/" + this.datesArr[0].base_original.url;
      }
    }
  }

  setselectedDisableinCalender() {
    //resetting months
    this.selectedMonthsId.length = 0;
    if (this.monthsArr.filter((item) => item.selected == true)[0] != undefined) {
      // this.monthsArr.filter((item) => item.selected == true)[0].selected = false;
          this.monthsArr.forEach(element => {
            element.selected = false;
          });
    }
    //if you want given month to be show selected
    if(this.quesObj.monthSelected){
      this.monthsArr[this.date.getMonth()].selected = true;
    }
    // this.monthsArr[this.date.getMonth()].checkRightorWrong = true;
    if (this.quesObj.disablemonth) {
      if (this.monthsArr.filter((item) => item.selected != true) != undefined) {
        this.monthsArr.filter((item) => item.selected != true).map((item) => item.disabled = true);
      }
    }

    //resetting years
    this.selectedYearID.length = 0;
    if (this.Arryears.filter((item) => item.selected == true)[0] != undefined) {
      // this.Arryears.filter((item) => item.selected == true)[0].selected = false;
          this.Arryears.forEach(element => {
            element.selected = false;
          });
    }
    //if you want given year to appear selected
    if(this.quesObj.yearSelected){
      this.Arryears.find((item) => item.id == this.date.getFullYear()).selected = true;
    }

   // this.Arryears.find((item) => item.id == this.date.getFullYear()).checkRightorWrong = true;
    if (this.quesObj.disableyear) {
      if (this.Arryears.filter((item) => item.selected != true) != undefined) {
        this.Arryears.filter((item) => item.selected != true).map((item) => item.disabled = true);
      }
    }

    //resetting weekdays
    this.selectedDaysId.length = 0 ;
    if (this.ArrweekDays.filter((item) => item.selected == true)[0] != undefined) {
        this.ArrweekDays.forEach(element => {
          element.selected = false;
        });
    }
    if (this.quesObj.disableweekDay) {
      if (this.ArrweekDays.filter((item) => item.selected != true) != undefined) {
        this.ArrweekDays.filter((item) => item.selected != true).map((item) => item.disabled = true);
      }
    }

    //resetting dates
    this.selectedDatesId.length = 0;
    if (this.datesArr.filter((item) => item.selected == true)[0] != undefined) {
      // this.datesArr.filter((item) => item.selected == true)[0].selected = false;
      this.datesArr.forEach(element => {
        element.selected = false
      });
    }
    for (let i = this.startIndex; i >= 0; i--) {
      this.monthDates.nativeElement.children[0].children[i].children[0].src = this.datesArr[0].base_original.location == "content" ? this.containgFolderPath + "/" + this.datesArr[0].base_original.url : this.assetsPath + "/" + this.datesArr[0].base_original.url;;
      this.monthDates.nativeElement.children[0].children[i].classList.value = "img-fluid opacityZero";
      this.monthDates.nativeElement.children[0].children[i].children[0].style.pointerEvents = "";
    }
    if (this.quesObj.disableDate) {
      if (this.datesArr.filter((item) => item.selected != true) != undefined) {
        this.datesArr.filter((item) => item.selected != true).map((item) => item.disable = true);
      }
    }
  }

  setDatefromJSON() {
    if (this.quesObj.localMachineDate) {
      this.date = new Date();
      this.setselectedDisableinCalender();
      //this.monthsArr[date.getMonth()].selected = true;
      //this.datesArr.find((item) => item.id == date.getDate()).selected = true;
      this.setCalender('');
    } else {
      this.date = new Date();
      this.date.setFullYear(this.quesObj.givenDate.year);
      let indexofgivenmonth = this.monthsArr.findIndex((item) => item.id == this.quesObj.givenDate.month);
      this.date.setMonth(indexofgivenmonth);
      this.setselectedDisableinCalender();
      this.setCalender('');
    }
  }

  onClickCalender(item, flag) {
    this.stopAllSounds();
    console.log(this.date);
    //      this.appModel.notifyUserAction();
    if (flag == "month") {
      if (!item.selected) {
        this.monthfromLocalMachine = false;
        this.monthSelected = true;
        if (this.datesArr.filter((item) => item.selected == true)[0] != undefined) {
          this.datesArr.forEach(element => {
            element.selected = false;
          });
          // this.datesArr.filter((item) => item.selected == true)[0].selected = false;
        }
        //resetting weekdays
        this.selectedDaysId.length = 0 ;
        if (this.ArrweekDays.filter((item) => item.selected == true)[0] != undefined) {
            this.ArrweekDays.forEach(element => {
              element.selected = false;
            });
        }
        if (this.quesObj.disableweekDay) {
          if (this.ArrweekDays.filter((item) => item.selected != true) != undefined) {
            this.ArrweekDays.filter((item) => item.selected != true).map((item) => item.disabled = true);
          }
        }
        this.dateSelected = false;
        this.previousItemevent = undefined;
        this.selectedDatesId.length = 0;
        this.selectedDaysId.length = 0;
        for (let i = this.startIndex; i >= 0; i--) {
          this.monthDates.nativeElement.children[0].children[i].children[0].src = this.datesArr[0].base_original.location == "content" ? this.containgFolderPath + "/" + this.datesArr[0].base_original.url : this.assetsPath + "/" + this.datesArr[0].base_original.url;
          if (this.monthDates.nativeElement && this.monthDates.nativeElement.children[0] && this.monthDates.nativeElement.children[0].children[i])
            this.monthDates.nativeElement.children[0].children[i].classList.value = "img-fluid opacityZero";
        }
        let indexofMonth = this.monthsArr.findIndex((index) => index.id == item.id);

        if (this.monthsArr.filter((item) => item.selected == true)[0] != undefined) {
          //for multi month
          console.log("this.selectedMonthsId.indexOf(indexofMonth)", this.selectedMonthsId.indexOf(indexofMonth))
          if (this.quesObj.multi_month) {
            if (this.selectedMonthsId.indexOf(indexofMonth)) {
            }
            this.selectedMonthsId.push(indexofMonth);
          }
          else {
            this.monthsArr.filter((item) => item.selected == true)[0].selected = false;
            this.selectedMonthsId.length = 0;
            this.selectedMonthsId.push(indexofMonth)
          }
          console.log("this.selectedMonthsId", this.selectedMonthsId)
          //this.monthsArr.filter((item) => item.selected == true)[0].selected = false;
        }
        if (this.selectedMonthsId.length == 0) {
          this.selectedMonthsId.push(indexofMonth);
        }
        if (this.monthsArr.filter((item) => item.checkRightorWrong == true)[0] != undefined) {
          this.monthsArr.filter((item) => item.checkRightorWrong == true)[0].checkRightorWrong = false;
        }
        //let indexofMonth =this.monthsArr.findIndex((index) =>index.id==item.id);
        console.log("indexofMonth", indexofMonth)
        this.date.setMonth(indexofMonth);
        item.selected = true;
        this.setCalender('');
        // if(this.feedbackObj.correct_month!= "" && item.id == this.feedbackObj.correct_month) {
        //   this.isCorrectMonth = true;
        //   item.checkRightorWrong = true;
        //   item.ImginpopUp = item.rightmonthImg;
        // } else {
        //   this.isCorrectMonth = false;
        //   item.checkRightorWrong = true;
        //   item.ImginpopUp = item.wrongmonthImg;
        // }
      } else {
        item.selected = false
        let indexofMonth = this.monthsArr.findIndex((index) => index.id == item.id);
        this.selectedMonthsId.splice(this.selectedMonthsId.indexOf(indexofMonth), 1)
        console.log("this.selectedMonthsId", this.selectedMonthsId)
      }
    } else if (flag == "year") {
      if (!item.selected) {
        this.yearfromLocalMachine = false;
        this.yearSelected = true;
        // if (this.Arryears.filter((item) => item.checkRightorWrong == true)[0] != undefined) {
        //   this.Arryears.filter((item) => item.checkRightorWrong == true)[0].checkRightorWrong = false;
        // }
        //this.dateSelected=false;
        //this.weekDaySelected = false;
        this.selectedMonthsId.length = 0;
        this.selectedDatesId.length = 0 ;
        if (this.monthsArr.filter((item) => item.selected == true)[0] != undefined) {
      // this.monthsArr.filter((item) => item.selected == true)[0].selected = false;
          this.monthsArr.forEach(element => {
            element.selected = false;
          });
        }
        if (this.datesArr.filter((item) => item.selected == true)[0] != undefined) {
          this.datesArr.forEach(element => {
            element.selected = false;
          });
          // this.datesArr.filter((item) => item.selected == true)[0].selected = false;
        }
        this.previousItemevent = undefined;
        for (let i = this.startIndex; i >= 0; i--) {
          this.monthDates.nativeElement.children[0].children[i].children[0].src = this.datesArr[0].base_original.location == "content" ? this.containgFolderPath + "/" + this.datesArr[0].base_original.url : this.assetsPath + "/" + this.datesArr[0].base_original.url;;
          this.monthDates.nativeElement.children[0].children[i].classList.value = "img-fluid opacityZero";
          this.monthDates.nativeElement.children[0].children[i].children[0].style.pointerEvents = "";
        }
        if (this.Arryears.filter((item) => item.selected == true)[0] != undefined) {
          if (!this.quesObj.multi_year) {
            this.selectedYearID.push(item.id)
            this.Arryears.filter((item) => item.selected == true)[0].selected = false;
          }
          else {
            this.selectedYearID.push(item.id)
          }
        }
        if (this.selectedYearID.length == 0) {
          this.selectedYearID.push(item.id)
        }
        //let indexofYear =this.Arryears.findIndex((index) =>index.id==item.id);
        this.date.setFullYear(item.id);
        item.selected = true;
        this.setCalender('');
        if (this.feedbackObj.correct_year != "" && item.id == this.feedbackObj.correct_year) {
          this.isCorrectYear = true;
          item.checkRightorWrong = true;
          item.ImginpopUp = item.rightyearImg;
        } else {
          this.isCorrectYear = false;
          item.checkRightorWrong = true;
          item.ImginpopUp = item.wrongyearImg;
        }
      }
      else {
        item.selected = false
        this.selectedYearID.splice(this.selectedYearID.indexOf(item.id), 1)
        console.log("this.selectedYearID", this.selectedYearID)
      }
    } else if (flag == "date") {
      this.clickedID = Number(item.target.id) + 1;
      let itemDate = this.datesArr.find((index) => index.id == this.clickedID);
      if (!itemDate.selected) {
        this.dateSelected = true;
        //this.clickedID = Number(item.target.id)+1;
        let itemDate = this.datesArr.find((index) => index.id == this.clickedID);
        if (this.datesArr.filter((item) => item.selected == true)[0] != undefined) {
          if (!this.quesObj.multi_date) {
            let previousItem = this.datesArr.filter((item) => item.selected == true)[0];
            previousItem.selected = false;
            if (this.previousItemevent != undefined) {
              this.previousItemevent.src = this.datesArr[0].base_original.location == "content" ? this.containgFolderPath + "/" + this.datesArr[0].base_original.url : this.assetsPath + "/" + this.datesArr[0].base_original.url;
              this.previousItemevent.style.pointerEvents = "";
            }
          }
          else {
            console.log("this.selectedDatesId", this.selectedDatesId)

            this.selectedDatesId.push(this.clickedID)
            console.log("this.selectedDatesId", this.selectedDatesId)

          }
          //previousItem.dateImg = previousItem.dateOriginalImg;
        }
        if (this.selectedDatesId.length == 0) {
          this.selectedDatesId.push(this.clickedID)
        }
        //itemDate.dateImg = itemDate.selecteddateImg;
        item.target.src = this.datesArr[0].base_hover.location == "content" ? this.containgFolderPath + "/" + this.datesArr[0].base_selected.url : this.assetsPath + "/" + this.datesArr[0].base_selected.url;
        this.previousItemevent = item.target;
        if (!this.quesObj.multi_date) {
          item.target.style.pointerEvents = "none";
        }
        itemDate.selected = true;
        if (this.weekDaySelected) {
          this.date.setDate(this.clickedID);
          if (this.date.getDay() != 0) {
            var getDay = this.date.getDay() - 1;
          } else {
            var getDay = this.ArrweekDays.length - 1;
          }
          if (this.ArrweekDays[getDay].id == this.ArrweekDays.filter((item) => item.selected == true)[0].id && this.monthsArr[this.date.getMonth()].id == this.feedback.correct_month) {
            this.isCorrectweekDay = true;
            this.ArrweekDays.filter((item) => item.selected == true)[0].checkRightorWrong = true;
            this.ArrweekDays.filter((item) => item.selected == true)[0].weekDayImginpopUp = this.ArrweekDays.filter((item) => item.selected == true)[0].rightweekDayImg;
          } else if (this.ArrweekDays[getDay].id == this.ArrweekDays.filter((item) => item.selected == true)[0].id && this.feedback.correct_month == "") {
            this.isCorrectweekDay = true;
            this.ArrweekDays.filter((item) => item.selected == true)[0].checkRightorWrong = true;
            this.ArrweekDays.filter((item) => item.selected == true)[0].weekDayImginpopUp = this.ArrweekDays.filter((item) => item.selected == true)[0].rightweekDayImg;
          }
          else {
            this.isCorrectweekDay = false;
            this.ArrweekDays.filter((item) => item.selected == true)[0].checkRightorWrong = true;
            this.ArrweekDays.filter((item) => item.selected == true)[0].weekDayImginpopUp = this.ArrweekDays.filter((item) => item.selected == true)[0].wrongweekDayImg;
          }
        }
        if (this.feedbackObj.correct_date != "" && this.clickedID == this.feedbackObj.correct_date) {
          this.isCorrectDate = true;
          //this.monthDatesinPopup.nativeElement.children[0].children[item.target.getAttribute("id")].src = itemDate.rightdateImg.location=="content" ? this.containgFolderPath +"/"+ itemDate.rightdateImg.url : this.assetsPath +"/"+ itemDate.rightdateImg.url;
        } else {
          this.isCorrectDate = false;
          //this.monthDatesinPopup.nativeElement.children[0].children[item.target.getAttribute("id")].src = itemDate.wrongdateImg.location=="content" ? this.containgFolderPath +"/"+ itemDate.wrongdateImg.url : this.assetsPath +"/"+ itemDate.wrongdateImg.url;
        }

      } else {
        this.clickedID = Number(item.target.id) + 1;
        itemDate.selected = false
        this.selectedDatesId.splice(this.selectedDatesId.indexOf(this.clickedID), 1)
        console.log("this.selectedDATEsId", this.selectedDatesId)
        item.target.src = this.datesArr[0].base_hover.location == "content" ? this.containgFolderPath + "/" + this.datesArr[0].base_selected.url : this.assetsPath + "/" + this.datesArr[0].base.url;
      }
    }

    else if (flag == "weekDays") {
      if (!item.selected) {
        this.weekDaySelected = true;
        //this.dateSelected=false;
        //this.dateSelected=false;
        if (this.selectedDaysId.length == 0) {
          this.selectedDaysId.push(item.id);
        }
        if (this.ArrweekDays.filter((item) => item.selected == true)[0] != undefined) {
          if (this.quesObj.multi_day) {
            this.selectedDaysId.push(item.id);
            console.log("this.selectedDaysId", this.selectedDaysId, item.id)
          }
          else {
            this.ArrweekDays.filter((item) => item.selected == true)[0].selected = false;
          }
        }

        if (this.ArrweekDays.filter((item) => item.checkRightorWrong == true)[0] != undefined) {
          this.ArrweekDays.filter((item) => item.checkRightorWrong == true)[0].checkRightorWrong = false;
        }
        item.selected = true;
        // if(this.feedbackObj.correct_weekDay!= "") {
        //   if(item.id == this.feedbackObj.correct_weekDay) {
        //     this.isCorrectweekDay = true;
        //     item.checkRightorWrong = true;
        //     item.weekDayImginpopUp = item.rightweekDayImg;
        //   } else {
        //     this.isCorrectweekDay = false;
        //     item.checkRightorWrong = true;
        //     item.weekDayImginpopUp = item.wrongweekDayImg;
        //   }
        // } else {
        //    if(this.clickedID!=undefined) {
        //      this.date.setDate(this.clickedID);
        //      if(this.date.getDay() != 0) {
        //       var getDay= this.date.getDay()-1;
        //     } else {
        //       var getDay=this.ArrweekDays.length-1;
        //     }
        //     var copiedDate = new Date(this.date.getTime());
        //     if(this.feedbackObj.correct_month!="") {
        //       copiedDate.setMonth(this.monthsArr.findIndex((item)=> item.id == this.feedbackObj.correct_month));
        //     }
        //     if(this.feedbackObj.correct_date!="") {
        //       copiedDate.setDate(this.feedbackObj.correct_date);
        //     } 
        //     if(copiedDate.getDay() != 0) {
        //       var copiedgetDay= copiedDate.getDay()-1;
        //     } else {
        //       var copiedgetDay=this.ArrweekDays.length-1;
        //     }         
        //      if((this.ArrweekDays[getDay].id == item.id || this.ArrweekDays[copiedgetDay].id==item.id) && this.monthsArr[this.date.getMonth()].id==this.feedback.correct_month) {
        //       this.isCorrectweekDay = true;
        //       item.checkRightorWrong = true;
        //       item.weekDayImginpopUp = item.rightweekDayImg;
        //      } else if((this.ArrweekDays[getDay].id == item.id || this.ArrweekDays[copiedgetDay].id==item.id) && this.feedback.correct_month=="") {
        //       this.isCorrectweekDay = true;
        //       item.checkRightorWrong = true;
        //       item.weekDayImginpopUp = item.rightweekDayImg;
        //      } else {
        //       this.isCorrectweekDay = false;
        //       item.checkRightorWrong = true;
        //       item.weekDayImginpopUp = item.wrongweekDayImg;
        //      }
        //    }
        // }
      }
      else {
        //remove selected day
        item.selected = false
        this.selectedDaysId.splice(this.selectedDaysId.indexOf(item.id), 1)
        console.log("this.selectedDaysId", this.selectedDaysId)
      }
    }
    if (this.monthSelected && this.yearSelected && this.dateSelected && this.weekDaySelected) {
      this.appModel.enableSubmitBtn(true);
    } else {
      this.appModel.enableSubmitBtn(false);
    }
    this.checkforsubmitButton();
  }

  refreshDates() {
    //for resetting the base dates.
    this.previousItemevent.src = this.datesArr[0].base_original.location == "content" ? this.containgFolderPath + "/" + this.datesArr[0].base_original.url : this.assetsPath + "/" + this.datesArr[0].base_original.url;
  }

  setCalender(from) {
    //if(from !="showAnspopup") {
    this.date.setDate(1);
    //}
    if ((this.date.getFullYear() % 4 == 0 || this.date.getFullYear() % 400 == 0) && this.date.getMonth() == 1) {
      var days = this.monthsArr[this.date.getMonth()].days + 1;
    } else {
      var days = this.monthsArr[this.date.getMonth()].days;
    }
    if (this.date.getDay() == 0) {
      this.startIndex = this.date.getDay() + this.ArrweekDays.length - 1;
    } else {
      this.startIndex = this.date.getDay() - 1;
    }
    if (from == "popup") {
      for (let i = 0; i < this.monthDatesinPopup.nativeElement.children[0].children.length; i++) {
        this.monthDatesinPopup.nativeElement.children[0].children[i].src = "./assets/images/Template-22/English/Images English/Days/Days Normal/date01.png";
        this.monthDatesinPopup.nativeElement.children[0].children[i].classList.value = "img-fluid opacityZero";
      }
      // if (this.monthfromLocalMachine) {
      //   let monthInfo = this.monthsArr.filter((item) => item.checkRightorWrong == true)[0];
      //   if (monthInfo.id == this.feedbackObj.correct_month && this.feedbackObj.correct_month != "") {
      //     this.isCorrectMonth = true;
      //     monthInfo.ImginpopUp = monthInfo.rightmonthImg;
      //   } else if (this.feedbackObj.correct_month == "") {
      //     this.isCorrectMonth = true;
      //     monthInfo.ImginpopUp = monthInfo.selectedmonthImg;
      //   } else {
      //     this.isCorrectMonth = false;
      //     monthInfo.ImginpopUp = monthInfo.wrongmonthImg;
      //   }
      // }
      // if (this.yearfromLocalMachine) {
      //   let yearInfo = this.Arryears.filter((item) => item.checkRightorWrong == true)[0];
      //   if (yearInfo && yearInfo.id == this.feedbackObj.correct_year && this.feedbackObj.correct_year != "") {
      //     this.isCorrectYear = true;
      //     yearInfo.ImginpopUp = yearInfo.rightyearImg;
      //   } else if (this.feedbackObj.correct_year == "") {
      //     this.isCorrectYear = true;
      //     yearInfo.ImginpopUp = yearInfo.selectedyearsImg;
      //   } else {
      //     this.isCorrectYear = false;
      //     yearInfo.ImginpopUp = yearInfo.wrongyearImg;
      //   }
      // }
      for (let i = 0; i < days; i++) {
        this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].id = i;
        this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].classList.value = "img-fluid";
        if (this.datesArr[i].disable) {
          this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].classList.value = "img-fluid disable-state";
        }
        //this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].src = this.datesArr[i].dateImg.location=="content" ? this.containgFolderPath +"/"+ this.datesArr[i].dateImg.url : this.assetsPath +"/"+ this.datesArr[i].dateImg.url;
        if (i + 1 == this.clickedID && this.clickedID == this.feedbackObj.correct_date) {
          if (this.isCorrectYear && this.isCorrectMonth && this.isCorrectDate && this.isCorrectweekDay) {
            this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].src = this.datesArr[i].rightdateImg.location == "content" ? this.containgFolderPath + "/" + this.datesArr[i].rightdateImg.url : this.assetsPath + "/" + this.datesArr[i].rightdateImg.url;
          }
          else {
            this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].src = this.datesArr[i].wrongdateImg.location == "content" ? this.containgFolderPath + "/" + this.datesArr[i].wrongdateImg.url : this.assetsPath + "/" + this.datesArr[i].wrongdateImg.url;
          }
          this.startIndex++;
          continue;
        } else {
          this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].src = this.datesArr[i].dateImg.location == "content" ? this.containgFolderPath + "/" + this.datesArr[i].dateImg.url : this.assetsPath + "/" + this.datesArr[i].dateImg.url;
          //this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].src = this.datesArr[i].wrongdateImg.location=="content" ? this.containgFolderPath +"/"+ this.datesArr[i].wrongdateImg.url : this.assetsPath +"/"+ this.datesArr[i].wrongdateImg.url;
        }
        if (i == this.clickedID - 1 && this.clickedID != this.feedbackObj.correct_date) {
          this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].src = this.datesArr[i].wrongdateImg.location == "content" ? this.containgFolderPath + "/" + this.datesArr[i].wrongdateImg.url : this.assetsPath + "/" + this.datesArr[i].wrongdateImg.url;
        } else {
          this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].src = this.datesArr[i].dateImg.location == "content" ? this.containgFolderPath + "/" + this.datesArr[i].dateImg.url : this.assetsPath + "/" + this.datesArr[i].dateImg.url;
        }
        this.startIndex++;
      }
    } else if (from == "showAnspopup") {
      for (let i = 0; i < this.monthDatesinPopup.nativeElement.children[0].children.length; i++) {
        this.monthDatesinPopup.nativeElement.children[0].children[i].src = "./assets/images/Template-22/English/Images English/Days/Days Normal/date01.png";
        this.monthDatesinPopup.nativeElement.children[0].children[i].classList.value = "img-fluid opacityZero";
      }
      for (let i = 0; i < days; i++) {
        this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].id = i;
        this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].classList.value = "img-fluid";
        if (this.datesArr[i].disable) {
          this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].classList.value = "img-fluid disable-state";
        }
        //this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].src = this.datesArr[i].dateImg.location=="content" ? this.containgFolderPath +"/"+ this.datesArr[i].dateImg.url : this.assetsPath +"/"+ this.datesArr[i].dateImg.url;
        if (i + 1 == this.feedbackObj.correct_date) {
          this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].src = this.datesArr[i].rightdateImg.location == "content" ? this.containgFolderPath + "/" + this.datesArr[i].rightdateImg.url : this.assetsPath + "/" + this.datesArr[i].rightdateImg.url;
          //this.startIndex++;
          //continue;
        } else {
          this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].src = this.datesArr[i].dateImg.location == "content" ? this.containgFolderPath + "/" + this.datesArr[i].dateImg.url : this.assetsPath + "/" + this.datesArr[i].dateImg.url;
          //this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].src = this.datesArr[i].wrongdateImg.location=="content" ? this.containgFolderPath +"/"+ this.datesArr[i].wrongdateImg.url : this.assetsPath +"/"+ this.datesArr[i].wrongdateImg.url;
        }
        this.startIndex++;
        // if(i == this.clickedID-1 && this.clickedID-1 != this.feedbackObj.correct_date) {
        //   this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].src = this.datesArr[i].wrongdateImg.location=="content" ? this.containgFolderPath +"/"+ this.datesArr[i].wrongdateImg.url : this.assetsPath +"/"+ this.datesArr[i].wrongdateImg.url;
        // } else {
        //   this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].src = this.datesArr[i].dateImg.location=="content" ? this.containgFolderPath +"/"+ this.datesArr[i].dateImg.url : this.assetsPath +"/"+ this.datesArr[i].dateImg.url;
        // }
        // this.startIndex++;
      }
    }
    else {
      console.log("setting calendaer...--->>>")
      //resetting weekdays
      if (this.ArrweekDays.filter((item) => item.selected == true)[0] != undefined) {
        // this.ArrweekDays.filter((item)=>item.selected == true)[0].selected = false;
        this.ArrweekDays.forEach(element => {
          element.selected = false;
        });
        this.weekDaySelected = false;
      }

      for (let i = 0; i < days; i++) {
        this.monthDates.nativeElement.children[0].children[this.startIndex].children[0].id = i;
        this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].children[0].id = i;
        this.monthDates.nativeElement.children[0].children[this.startIndex].classList.value = "img-fluid";
        this.monthDates.nativeElement.children[0].children[this.startIndex].style.pointerEvents = "";
        if (this.datesArr[i].disable) {
          this.monthDates.nativeElement.children[0].children[this.startIndex].classList.value = "img-fluid disable-state";
        }

        this.monthDates.nativeElement.children[0].children[this.startIndex].children[1].textContent = this.datesArr[i].id;
        this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].children[1].textContent = this.datesArr[i].id;
        // this.monthDates.nativeElement.children[0].children[this.startIndex].src = this.datesArr[i].dateImg.location=="content" ? this.containgFolderPath +"/"+ this.datesArr[i].dateImg.url : this.assetsPath +"/"+ this.datesArr[i].dateImg.url;
        this.startIndex++;
      }
    }
  }

  setData() {
    this.appModel.enableSubmitBtn(false);
    if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
      let fetchedData: any = this.appModel.content.contentData.data;
      console.log(fetchedData);
      this.feedback = fetchedData.feedback;
      this.instructiontext = fetchedData.instructiontext;
      this.commonAssets = fetchedData.commonassets;
      let monthsArr = fetchedData.monthsArr;
      this.monthsArr = JSON.parse(JSON.stringify(monthsArr));
      let ArrweekDays = fetchedData.ArrweekDays;
      this.ArrweekDays = JSON.parse(JSON.stringify(ArrweekDays));
      let Arryears = fetchedData.Arryears;
      this.Arryears = JSON.parse(JSON.stringify(Arryears));
      let datesArr = fetchedData.datesArr;
      this.datesArr = JSON.parse(JSON.stringify(datesArr));
      this.narratorAudio = fetchedData.commonassets.narrator;
      this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
      this.ques_control = fetchedData.commonassets.ques_control;
      this.noOfImgs = this.commonAssets.imgCount;
      this.isFirstQues = this.commonAssets.isFirstQues;
      this.isLastQues = this.appModel.isLastSection;
      this.isLastQuesAct = this.appModel.isLastSectionInCollection;
      this.popupAssets = fetchedData.feedback.popupassets;
      this.showAnswerPopup = this.feedback.show_ans_popup;
      this.rightPopup = this.feedback.right_ans_sound;
      this.wrongPopup = this.feedback.wrong_ans_sound;
      this.lastQuestionCheck = this.commonAssets.ques_control.isLastQues;
      //need to be set acc. to the right or wrong answer.
      this.popupIcon = this.popupAssets.right_icon.url;
      this.popupIconLocation = this.popupAssets.right_icon.location;
      if (this.isLastQuesAct || this.isLastQues) {
        this.appModel.setlastQuesNT();
      }
      this.feedbackObj = fetchedData.feedback;
      this.confirmPopupAssets = fetchedData.feedback.confirm_popup;
      this.quesObj = fetchedData.quesObj[0];
      this.yearSelected = this.quesObj.yearSelected;
      this.monthSelected = this.quesObj.monthSelected;
      this.dateSelected = this.quesObj.dateSelected;
      this.weekDaySelected = this.quesObj.weekdaySelected;
      //var date = new Date();
      this.speaker = fetchedData.speaker;
      this.setDatefromJSON();
      this.confirmSubmitAssets = fetchedData.submit_confirm;
      this.quesAudio = this.commonAssets.QuestionAudio;
      this.CorrectAudio = this.commonAssets.CorrectAudio;
      this.WrongAudio = this.commonAssets.WrongAudio;
      this.partiallyCorrectAudio = this.commonAssets.PartiallyCorrectAudio;
      setTimeout(() => {
        if (this.footerNavBlock && this.footerNavBlock.nativeElement) {
          this.footerNavBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around";
        }
      }, 200)
    }

  }

  getBasePath() {
    if (this.appModel && this.appModel.content) {
      return this.appModel.content.id + '';
    }
  }
  hoverConfirm() {
    this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_hover;
  }

    /******On Hover close popup******/
    hoverClosePopup() {
      this.popupAssets.close_button = this.popupAssets.close_button_hover;
  }

    /******Hover out close popup******/
    houtClosePopup() {
        this.popupAssets.close_button = this.popupAssets.close_button_origional;
    }

  hoverSubmitConfirm() {
    this.confirmSubmitAssets.confirm_btn = this.confirmSubmitAssets.confirm_btn_hover;
  }
  houtSubmitConfirm() {
    this.confirmSubmitAssets.confirm_btn = this.confirmSubmitAssets.confirm_btn_original;
  }
  hoverSubmitDecline() {
    this.confirmSubmitAssets.decline_btn = this.confirmSubmitAssets.decline_btn_hover;
  }
  houtSubmitDecline() {
    this.confirmSubmitAssets.decline_btn = this.confirmSubmitAssets.decline_btn_original;
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

  // hoverClosePopup() {
  //   this.feedbackObj.popup_commmon_imgs.close_btn = this.feedbackObj.popup_commmon_imgs.close_btn_hover;
  // }

  // houtClosePopup() {
  //   this.feedbackObj.popup_commmon_imgs.close_btn = this.feedbackObj.popup_commmon_imgs.close_btn_original;
  // }

  hoverOK() {
    this.feedbackObj.ok_btn = this.feedbackObj.ok_btn_hover;
  }

  houtOK() {
    this.feedbackObj.ok_btn = this.feedbackObj.ok_btn_original;
  }

  playFeedback() {
    if (this.isCorrectMonth && this.isCorrectYear && this.isCorrectweekDay && this.isCorrectDate) {
      //fully correct
      this.checked = true;
      this.feedbackPopupAudio.nativeElement.src = this.commonAssets.CorrectAudio.location == "content" ? this.containgFolderPath + "/" + this.commonAssets.CorrectAudio.url : this.assetsPath + "/" + this.commonAssets.CorrectAudio.url;
      this.feedbackPopupAudio.nativeElement.load();
      this.feedbackPopupAudio.nativeElement.play();
      this.feedbackPopupAudio.nativeElement.onended = () => {
        //this.closeModal();
        $("#optionsBlock").css("opacity", "0.3");
        $("#optionsBlock").css("pointer-events", "none");
        //document.getElementById("mainques").style.pointerEvents = "none";
        $("#instructionBar").css("opacity", "0.3");
        $("#instructionBar").css("pointer-events", "none");
        this.appModel.enableSubmitBtn(false);
        //this.appModel.handlePostVOActivity(true);
      }
    } else {
      //fully incorrect
      this.feedbackPopupAudio.nativeElement.src = this.commonAssets.WrongAudio.location == "content" ? this.containgFolderPath + "/" + this.commonAssets.WrongAudio.url : this.assetsPath + "/" + this.commonAssets.WrongAudio.url;
      this.feedbackPopupAudio.nativeElement.load();
      this.feedbackPopupAudio.nativeElement.play();
      this.feedbackPopupAudio.nativeElement.onended = () => {
        //this.closeModal();
        //this.resetActivity();
      }
    }
  }


  showAnswerFeedback() {
    this.appModel.resetBlinkingTimer();
    if (this.feedbackObj.correct_month != "") {
      this.date.setDate(this.feedbackObj.correct_date);
      //let indexofRightdate = this.datesArr.findIndex((item)=> item.id == this.feedbackObj.correct_date);
      if (this.monthsArr.filter((item) => item.selected == true)[0] != undefined) {
        this.monthsArr.filter((item) => item.selected == true)[0].selected = false;
        this.monthsArr.filter((item) => item.checkRightorWrong == true)[0].checkRightorWrong = false;
      }
      // if(this.monthsArr.filter((item) => item.checkRightorWrong == true)[0] !=undefined) {
      //   //this.monthsArr.filter((item) => item.checkRightorWrong == true)[0].checkRightorWrong = false;
      //   this.monthsArr.filter((item) => item.checkRightorWrong == true)[0].monthImg = this.monthsArr.filter((item) => item.checkRightorWrong == true)[0].selectedmonthImg;
      //   this.monthsArr.filter((item) => item.checkRightorWrong == true)[0].checkRightorWrong = false;
      // }
      let indexofRightmonth = this.monthsArr.findIndex((item) => item.id == this.feedbackObj.correct_month);
      this.monthsArr[indexofRightmonth].checkRightorWrong = true;
      this.monthsArr[indexofRightmonth].ImginpopUp = this.monthsArr[indexofRightmonth].rightmonthImg;
      this.date.setMonth(indexofRightmonth);
    } else {
      if (this.monthsArr.filter((item) => item.selected == true)[0] != undefined) {
        this.monthsArr.filter((item) => item.selected == true)[0].selected = false;
        //this.monthsArr.filter((item) => item.checkRightorWrong == true)[0].checkRightorWrong = false;
      }
      if (this.monthsArr.filter((item) => item.checkRightorWrong == true)[0] != undefined) {
        //this.monthsArr.filter((item) => item.checkRightorWrong == true)[0].checkRightorWrong = false;
        this.monthsArr.filter((item) => item.checkRightorWrong == true)[0].monthImg = this.monthsArr.filter((item) => item.checkRightorWrong == true)[0].selectedmonthImg;
        this.monthsArr.filter((item) => item.checkRightorWrong == true)[0].checkRightorWrong = false;
      }
    }
    if (this.feedbackObj.correct_year != "") {
      this.date.setFullYear(this.feedbackObj.correct_year);
      if (this.Arryears.filter((item) => item.selected == true)[0] != undefined) {
        this.Arryears.filter((item) => item.selected == true)[0].selected = false;
        this.Arryears.filter((item) => item.checkRightorWrong == true)[0].checkRightorWrong = false;
      }
      let indexofRightyear = this.Arryears.findIndex((item) => item.id == this.feedbackObj.correct_year);
      this.Arryears[indexofRightyear].checkRightorWrong = true;
      this.Arryears[indexofRightyear].ImginpopUp = this.Arryears[indexofRightyear].rightyearImg;
    } else {
      if (this.Arryears.filter((item) => item.selected == true)[0] != undefined) {
        this.Arryears.filter((item) => item.selected == true)[0].yearsImg = this.Arryears.filter((item) => item.selected == true)[0].selectedyearsImg;
        this.Arryears.filter((item) => item.selected == true)[0].selected = false;
        this.Arryears.filter((item) => item.checkRightorWrong == true)[0].checkRightorWrong = false;
      }
      // if(this.Arryears.filter((item) => item.checkRightorWrong == true)[0] !=undefined) {
      //   //this.monthsArr.filter((item) => item.checkRightorWrong == true)[0].checkRightorWrong = false;
      //   this.Arryears.filter((item) => item.checkRightorWrong == true)[0].monthImg = this.Arryears.filter((item) => item.checkRightorWrong == true)[0].selectedmonthImg;
      //   this.Arryears.filter((item) => item.checkRightorWrong == true)[0].checkRightorWrong = false;
      // }
    }
    if (this.feedbackObj.correct_weekDay == "") {
      if (this.ArrweekDays.filter((item) => item.selected == true)[0] != undefined) {
        this.ArrweekDays.filter((item) => item.selected == true)[0].selected = false;
        this.ArrweekDays.filter((item) => item.checkRightorWrong == true)[0].checkRightorWrong = false;
      }
      if (this.feedbackObj.correct_date != "") {
        this.date.setDate(this.feedbackObj.correct_date);
        if (this.date.getDay() != 0) {
          this.ArrweekDays[this.date.getDay() - 1].checkRightorWrong = true;
          this.ArrweekDays[this.date.getDay() - 1].weekDayImginpopUp = this.ArrweekDays[this.date.getDay() - 1].rightweekDayImg;
        } else {
          this.ArrweekDays[this.ArrweekDays.length - 1].checkRightorWrong = true;
          this.ArrweekDays[this.ArrweekDays.length - 1].weekDayImginpopUp = this.ArrweekDays[this.ArrweekDays.length - 1].rightweekDayImg;
        }

      }
      else {
        if (this.ArrweekDays.filter((item) => item.selected == true)[0] != undefined) {
          this.ArrweekDays.filter((item) => item.selected == true)[0].selected = false;
          this.ArrweekDays.filter((item) => item.checkRightorWrong == true)[0].checkRightorWrong = false;
        }
      }
    } else {
      if (this.feedbackObj.correct_weekDay != "") {
        if (this.ArrweekDays.filter((item) => item.selected == true)[0] != undefined) {
          this.ArrweekDays.filter((item) => item.selected == true)[0].selected = false;
          this.ArrweekDays.filter((item) => item.checkRightorWrong == true)[0].checkRightorWrong = false;
        }
        let indexofRightweekday = this.ArrweekDays.findIndex((item) => item.id == this.feedbackObj.correct_weekDay);
        this.ArrweekDays[indexofRightweekday].checkRightorWrong = true;
        this.ArrweekDays[indexofRightweekday].weekDayImginpopUp = this.ArrweekDays[indexofRightweekday].rightweekDayImg;
      } else {
        if (this.ArrweekDays.filter((item) => item.selected == true)[0] != undefined) {
          this.ArrweekDays.filter((item) => item.selected == true)[0].selected = false;
          this.ArrweekDays.filter((item) => item.checkRightorWrong == true)[0].checkRightorWrong = false;
        }
      }
    }
    this.setCalender("showAnspopup");
  }

  onclickOK() {
    this.closeModal();    
  }

  showFeedback(id: string, flag: string) {
    if (id == "submit-modal-id") {
      this.confirmSubmitRef.nativeElement.classList = "modal";
    }
    if (id == "info-modal-id") {
      this.infoModalRef.nativeElement.classList = "modal";
      this.rightAnswerCounter = 0;
      if (this.feedbackInfoAudio && !this.feedbackInfoAudio.nativeElement.paused) {
        this.feedbackInfoAudio.nativeElement.pause();
        this.feedbackInfoAudio.nativeElement.currentTime = 0;
      }
    }
    if (id == "showAnswer-modal-id" && flag == "answer") {
      this.checked = true;
      this.attemptType = "auto";
      this.confirmModalRef.nativeElement.classList = "modal";
      this.showAnswerFeedback();
      this.styleHeaderPopup = this.feedbackObj.style_header;
      this.styleBodyPopup = this.feedbackObj.style_body;
      this.popupRef.nativeElement.classList = "displayPopup modal";
      this.appModel.notifyUserAction();
      this.feedbackPopupAudio.nativeElement.src = this.commonAssets.showAnsAudio.location == "content" ? this.containgFolderPath + "/" + this.commonAssets.showAnsAudio.url : this.assetsPath + "/" + this.commonAssets.showAnsAudio.url;
      this.feedbackPopupAudio.nativeElement.load();
      this.feedbackPopupAudio.nativeElement.play();
      this.feedbackPopupAudio.nativeElement.onended = () => {
        //this.closeModal();
      }
      $("#optionsBlock").css("opacity", "0.3");
      $("#optionsBlock").css("pointer-events", "none");
      //document.getElementById("mainques").style.pointerEvents = "none";
      $("#instructionBar").css("opacity", "0.3");
      $("#instructionBar").css("pointer-events", "none");
      //this.appModel.handlePostVOActivity(true);
      this.appModel.enableSubmitBtn(false);
    }
    if (id == "showAnswer-modal-id" && flag == "no") {
      this.confirmModalRef.nativeElement.classList = "modal";
      this.appModel.notifyUserAction();
    }
    if (flag == "yes") {
      //this.onSubmit();
      this.setCalender("popup");
      this.attemptType = "manual";
      if (this.isCorrectYear && this.isCorrectMonth && this.isCorrectDate && this.isCorrectweekDay) {
        this.styleHeaderPopup = this.feedbackObj.style_header;
        this.styleBodyPopup = this.feedbackObj.style_body;
        if (!this.quesObj.disableweekDay) {
          if (this.ArrweekDays.filter((item) => item.selected == true)[0] != undefined) {
            this.ArrweekDays.filter((item) => item.selected == true)[0].weekDayImginpopUp = this.ArrweekDays.filter((item) => item.selected == true)[0].rightweekDayImg;
          }
        }
        if (!this.quesObj.disablemonth) {
          if (this.monthsArr.filter((item) => item.selected == true)[0] != undefined) {
            this.monthsArr.filter((item) => item.selected == true)[0].ImginpopUp = this.monthsArr.filter((item) => item.selected == true)[0].rightmonthImg;
          }
        }
        if (!this.quesObj.disableyear) {
          if (this.Arryears.filter((item) => item.selected == true)[0] != undefined) {
            this.Arryears.filter((item) => item.selected == true)[0].ImginpopUp = this.Arryears.filter((item) => item.selected == true)[0].rightyearImg;
          }
        }
      } else {
        this.styleHeaderPopup = this.feedbackObj.wrong_style_header;
        this.styleBodyPopup = this.feedbackObj.wrong_style_body;
        // if(!this.quesObj.disableDate) {
        //   if(this.datesArr.filter((item)=>item.selected == true)[0]!=undefined) {
        //     this.datesArr.filter((item)=>item.selected == true)[0].weekDayImginpopUp = this.ArrweekDays.filter((item)=>item.selected == true)[0].wrongweekDayImg;
        //   }
        // }
        if (!this.quesObj.disableweekDay) {
          if (this.ArrweekDays.filter((item) => item.selected == true)[0] != undefined) {
            this.ArrweekDays.filter((item) => item.selected == true)[0].weekDayImginpopUp = this.ArrweekDays.filter((item) => item.selected == true)[0].wrongweekDayImg;
          }
        }
        if (!this.quesObj.disablemonth) {
          if (this.monthsArr.filter((item) => item.selected == true)[0] != undefined) {
            this.monthsArr.filter((item) => item.selected == true)[0].ImginpopUp = this.monthsArr.filter((item) => item.selected == true)[0].wrongmonthImg;
          }
        }
        if (!this.quesObj.disableyear) {
          if (this.Arryears.filter((item) => item.selected == true)[0] != undefined) {
            this.Arryears.filter((item) => item.selected == true)[0].ImginpopUp = this.Arryears.filter((item) => item.selected == true)[0].wrongyearImg;
          }
        }
      }
      this.popupRef.nativeElement.classList = "displayPopup modal";
      this.playFeedback();
      //}
    }
    //  else {
    //   this.appModel.notifyUserAction();
    // }
  }

  closeModal() {
    clearTimeout(this.wrongTimer);
    clearTimeout(this.rightTimer);
    if (!this.rightFeedback.nativeElement.paused) {
      this.rightFeedback.nativeElement.pause();
      this.rightFeedback.nativeElement.currentTime = 0;
    }
    if (!this.wrongFeedback.nativeElement.paused) {
      this.wrongFeedback.nativeElement.pause();
      this.wrongFeedback.nativeElement.currentTime = 0;
    }
    //this.showAnswerRef.nativeElement.classList="modal";
    this.popupRef.nativeElement.classList = "modal";
    if(this.isRight){
      this.Sharedservice.setShowAnsEnabled(true);
      this.blinkOnLastQues();
    }
    else{
      this.postWrongAttemplt();
    }

    //this.appModel.notifyUserAction();
    // if (this.checked) {
    //  // this.blinkOnLastQues();
    //   $("#optionsBlock").css("opacity", "0.3");
    //   $("#optionsBlock").css("pointer-events", "none");
    //   //document.getElementById("mainques").style.pointerEvents = "none";
    //   $("#instructionBar").css("opacity", "0.3");
    //   $("#instructionBar").css("pointer-events", "none");
    //   this.appModel.enableSubmitBtn(false);
    //   //this.appModel.handlePostVOActivity(true);
    // }
    // if (!this.checked) {
    //   //this.resetActivity();
    //   this.appModel.wrongAttemptAnimation();
    //   setTimeout(() => {
    //     // $("#instructionBar").removeClass("disable_div");
    //   }, 1000);
    // }
  }


  //After submit ans confirmation pop up clicked yes
  closePopup(type) {
    console.log("type", type)
    clearTimeout(this.wrongTimer);
    clearTimeout(this.rightTimer);
    clearTimeout(this.showAnswerTimer);
    this.showAnswerRef.nativeElement.classList = "modal";
    this.videoonshowAnspopUp.nativeElement.pause();
    this.videoonshowAnspopUp.nativeElement.currentTime = 0;
    if(type == "showAnswer"){
      //if (this.isRight) {
        this.overlay.nativeElement.classList.value = "fadeContainer";
        this.blinkOnLastQues();
        //}
    }

    //for type confirmation pop up
    if(type == "yes"){
    this.CheckAnswer();
    setTimeout(() => {
    if(this.isRight){
      if (this.rightFeedback && this.rightFeedback.nativeElement) {
      this.clapSound.nativeElement.play();
      setTimeout(() => {
      this.clapSound.nativeElement.pause();
      this.clapSound.nativeElement.currentTime = 0;
      this.popupRef.nativeElement.classList = "displayPopup modal";
      this.setCalender("popup");
      this.rightFeedback.nativeElement.play();
      this.rightFeedback.nativeElement.onended = () => {
            this.rightTimer = setTimeout(() => {
                this.closeModal();
            }, 10000);
        }
      // this.playFeedback();
    }, 2000);
      } 
   }
   else{
    this.popupRef.nativeElement.classList = "displayPopup modal";
    this.setCalender("popup");
    if (this.wrongFeedback && this.wrongFeedback.nativeElement) {
        this.wrongFeedback.nativeElement.play();
    }
    this.wrongFeedback.nativeElement.onended = () => {
      this.wrongTimer = setTimeout(() => {
          this.closeModal();
        }, 10000);
    }
  }
  }, 200);

  }
  }


  CheckAnswer() {
    console.log("right_date", this.feedback.right_date)
    console.log("right_month", this.feedback.right_month)
    console.log("right_weekDay", this.feedback.right_weekDay)
    console.log("right_year", this.feedback.right_year)
    //set right wrong for months
    if (this.feedback.right_month.length > 0) {
      for (let index1 = 0; index1 < this.selectedMonthsId.length; index1++) {
        const element1 = this.selectedMonthsId[index1];
        for (let index2 = 0; index2 < this.feedback.right_month.length; index2++) {
          const element2 = this.monthsArr.findIndex((item) => item.id == this.feedback.right_month[index2]);
          if (element1 == element2) {
            //put a green base 
            this.monthsArr[element1].ImginpopUp = this.monthsArr[element1].base_right
            break;
          }
          else {
            this.monthsArr[element1].ImginpopUp = this.monthsArr[element1].base_wrong
          }
          //put a red base 
        }
      }
    }
      //set right wrong for week days base
      if (this.feedback.right_weekDay.length > 0) {
        for (let index1 = 0; index1 < this.selectedDaysId.length; index1++) {
          const element1 = this.selectedDaysId[index1];
          for (let index2 = 0; index2 < this.feedback.right_weekDay.length; index2++) {
            const element2 = this.feedback.right_weekDay[index2]
            let id = this.ArrweekDays.findIndex((item) => item.id == element1);
            console.log("id", id)
            if (element1 == element2) {
              //put a green base
              this.ArrweekDays[id].weekDayImginpopUp = this.ArrweekDays[id].base_right
              break;
            }
            else {
              this.ArrweekDays[id].weekDayImginpopUp = this.ArrweekDays[id].base_wrong
            }
            //put a red base 
          }
        }
      }

      //set right and wrong year base 
      if (this.feedback.right_year.length > 0) {
        for (let index1 = 0; index1 < this.selectedYearID.length; index1++) {
          const element1 = this.selectedYearID[index1];
          for (let index2 = 0; index2 < this.feedback.right_year.length; index2++) {
            const element2 = this.feedback.right_year[index2]
            let id = this.Arryears.findIndex((item) => item.id == element1);
            console.log("id", id)
            if (element1 == element2) {
              //put a green base
              this.Arryears[id].ImginpopUp = this.Arryears[id].base_right
              break;
            }
            //put a red base 
            else {
              this.Arryears[id].ImginpopUp = this.Arryears[id].base_wrong
            }
          }
          this.setCalender('');
        }
      }

      //set right wrong base for dates
      if (this.feedback.right_date.length > 0) {
        for (let index1 = 0; index1 < this.selectedDatesId.length; index1++) {
          const element1 = this.selectedDatesId[index1];
          for (let index2 = 0; index2 < this.feedback.right_date.length; index2++) {
            const element2 = this.feedback.right_date[index2]
            //find ID of the element in #monthDatesinPopup to replace base url
            if (element1 == element2) {
              this.setRightWrongbaseDates(element1, "right")
              break;
            }
            else {
              this.setRightWrongbaseDates(element1, "wrong")
            }
          }
        }
      }
      this.onSubmitResult()
  }

  setRightWrongbaseDates(number, type) {
    console.log("number", number);
    number = number - 1;
    // this.monthDates.nativeElement.children[0].children[i].children[0].src
    let childElements = this.monthDates.nativeElement.children[0].children
    let PopUPElelements = this.monthDatesinPopup.nativeElement.children[0].children
    for (let i = 0; i < childElements.length; i++) {
      if (childElements[i].children[0].id == number) {
        if (type == "right") {
          //set green base
          console.log("number id matching", number)
          PopUPElelements[i].children[0].src = this.datesArr[0].base_right.location == "content" ? this.containgFolderPath + "/" + this.datesArr[0].base_right.url : this.assetsPath + "/" + this.datesArr[0].base_right.url;
        }
        if (type == "wrong") {
          // set redbase
          PopUPElelements[i].children[0].src = this.datesArr[0].base_wrong.location == "content" ? this.containgFolderPath + "/" + this.datesArr[0].base_wrong.url : this.assetsPath + "/" + this.datesArr[0].base_wrong.url;
        }
      }
    }
  }

  //check if ateempt is right or wrong
  onSubmitResult(){
    //const element2 = this.monthsArr.findIndex((item) => item.id == this.feedback.right_month[index2]);

    // console.log("this.feedback.right_date",this.feedback.right_date)
    // console.log("this.feedback.right_month",this.feedback.right_month)
    // console.log("this.feedback.right_date",this.feedback.right_weekDay)
    // console.log("this.feedback.right_date",this.feedback.right_year)
    // console.log("realAnsLength",realAnsLength)
    // console.log("this.feedback.selectedDatesId",this.selectedDatesId)
    // console.log("this.feedback.selectedDaysId",this.selectedDaysId)
    // console.log("this.feedback.selectedYearID",this.selectedYearID)
    // console.log("this.feedback.selectedMonthsId",this.selectedMonthsId)
    //
    //let realAnsLength = this.feedback.right_date.length + this.feedback.right_month.length + this.feedback.right_weekDay.length + this.feedback.right_year.length
    let RightMonthArray = JSON.parse(JSON.stringify(this.feedback.right_month))
    let that = this
    RightMonthArray.forEach(function(element1, i) {
      that.monthsArr.forEach(function(item,ind) {
        if(item.id == element1){
          RightMonthArray[i] = ind
        }
      });
    });

    let rightWeekDayArray = JSON.parse(JSON.stringify(this.feedback.right_weekDay))
    rightWeekDayArray.forEach(function(element1, i) {
      that.ArrweekDays.forEach(function(item,ind) {
        if(item.id == element1){
          rightWeekDayArray[i] = ind
        }
      });
    });
    console.log("rightWeekDayArray",rightWeekDayArray)

    let selectedWeekDayArray = JSON.parse(JSON.stringify(this.selectedDaysId))
    selectedWeekDayArray.forEach(function(element1, i) {
      that.ArrweekDays.forEach(function(item,ind) {
        if(item.id == element1){
          selectedWeekDayArray[i] = ind
        }
      });
    });
    console.log("selectedWeekDayArray",selectedWeekDayArray)

    console.log("feedback_minths",RightMonthArray)
    let finalRightArray = this.feedback.right_year.concat(RightMonthArray,rightWeekDayArray,this.feedback.right_date)
      console.log("finalRightArray",finalRightArray)
      finalRightArray.sort();
    let finalSelectedArray  = this.selectedYearID.concat(this.selectedMonthsId, selectedWeekDayArray, this.selectedDatesId)
      console.log("finalSelectedArray",finalSelectedArray)
      finalSelectedArray.sort();
    //let selectedAnsLength = this.selectedDatesId.length + this.selectedDaysId.length + 
    //this.selectedYearID.length + this.selectedMonthsId.length
    //console.log("selectedAnsLength",selectedAnsLength)

    if(finalRightArray.length == finalSelectedArray.length  && this.arrayEquals(finalRightArray, finalSelectedArray)){
      console.log("RIGHT ANSWER BY USER")
      this.isRight = true;
      this.popupIcon = this.popupAssets.right_icon.url;
      this.popupIconLocation = this.popupAssets.right_icon.location;
      this.Sharedservice.setSubmitAnsEnabled(false);
      this.overlay.nativeElement.classList.value = "fadeContainer";
    //   this.rightFeedback.nativeElement.onended = () => {
    //     this.rightTimer = setTimeout(() => {
    //         this.closeModal();
    //     }, 10000);
    // }
      //this.blinkOnLastQues();
    }
    else{ 
      console.log("WRONG ANSWER BY USER")
      this.wrongCounter += 1;
      this.isRight = false;
      this.popupIcon = this.popupAssets.wrong_icon.url;
      this.popupIconLocation = this.popupAssets.wrong_icon.location;
      console.log("this.wrongCounter",this.wrongCounter)
      if (this.wrongCounter >= 3) {
        this.Sharedservice.setShowAnsEnabled(true);
      } else {
          this.Sharedservice.setShowAnsEnabled(false);
      }
    //   this.wrongFeedback.nativeElement.onended = () => {
    //     this.wrongTimer = setTimeout(() => {
    //       this.closeModal();
    //     }, 10000);
    // }
    }

  console.log("this.arrayEquals(finalRightArray, finalSelectedArray)",this.arrayEquals(finalRightArray, finalSelectedArray))
    //this.arrayEquals(finalRightArray, finalSelectedArray)

  }


  //to check if two arrays are equal
   arrayEquals(a, b) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }


  checkforsubmitButton(){
    let realAnsLength = this.feedback.right_date.length + this.feedback.right_month.length + 
    this.feedback.right_weekDay.length + this.feedback.right_year.length
    let selectedAnsLength = this.selectedDatesId.length + this.selectedDaysId.length + 
    this.selectedYearID.length + this.selectedMonthsId.length
    console.log("realAnsLength",realAnsLength);
    console.log("selectedAnsLength",selectedAnsLength);
    if(selectedAnsLength >= realAnsLength){
      //enable submit button
      this.Sharedservice.setSubmitAnsEnabled(true)
    }
    else{
      this.Sharedservice.setSubmitAnsEnabled(false)
    }
  }

  //**Function to stop all sounds */
  stopAllSounds(clickStatus?) {
    
    this.audio.pause();
    this.audio.currentTime = 0;

    // this.myAudiospeaker.nativeElement.pause();
    // this.myAudiospeaker.nativeElement.currentTime=0;

    this.wrongFeedback.nativeElement.pause();
    this.wrongFeedback.nativeElement.currentTime = 0;

    this.rightFeedback.nativeElement.pause();
    this.rightFeedback.nativeElement.currentTime = 0;

    this.clapSound.nativeElement.pause();
    this.clapSound.nativeElement.currentTime = 0;


    let speakerEle = document.getElementsByClassName("speakerBtn")[0].children[2] as HTMLAudioElement;
    if (!speakerEle.paused) {
        speakerEle.pause();
        speakerEle.currentTime = 0;
        document.getElementById('waveAnimation').style.display = 'none';
        (document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "";
        this.speaker.imgsrc = this.speaker.imgorigional;
    }
}

ngOnDestroy() {
  clearTimeout(this.rightTimer);
  clearTimeout(this.wrongTimer);
  this.stopAllSounds();
  // this.checkAnswer(this.myoption);

}

}
