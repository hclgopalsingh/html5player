import { Component, OnInit, HostListener, ViewChild, OnDestroy, EventEmitter, ViewEncapsulation, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs'
import { ActivatedRoute } from '@angular/router';
import { ApplicationmodelService } from 'src/app/common/services/applicationmodel.service';
import { SharedserviceService } from 'src/app/common/services/sharedservice.service';

@Component({
  selector: 'app-template14',
  templateUrl: './template14.component.html',
  styleUrls: ['./template14.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class TemplateFourteenComponent implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit {

  constructor(private appModel: ApplicationmodelService, private ActivatedRoute: ActivatedRoute, private Sharedservice: SharedserviceService) {
    this.appModel = appModel;
    this.assetsPath = this.appModel.assetsfolderpath;
    this.appModel.navShow = 2;
    this.appModel.setLoader(true);

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

  }


  @ViewChild("optionsBlock") optionsBlock: any;
  @ViewChild('narrator') narrator: any;
  @ViewChild('instruction') instruction: any;
  @ViewChild('confirmModalRef') confirmModalRef: any;
  @ViewChild('popupRef') popupRef: any;
  @ViewChild('rightFeedbackVO') rightFeedbackVO: any
  @ViewChild('wrongFeedbackVO') wrongFeedbackVO: any;
  @ViewChild('feedbackPopupAudio') feedbackPopupAudio: any;
  @ViewChild('monthDates', {static: true}) monthDates: any;
  @ViewChild('monthDatesinPopup', {static: true}) monthDatesinPopup: any;
  @ViewChild('footerNavBlock') footerNavBlock: any;
  @ViewChild('speakerNormal') speakerNormal: any;
  @ViewChild('disableSpeaker') disableSpeaker: any;
  @ViewChild('sprite') sprite: any;
  @ViewChild('overlay') overlay: any;
  @ViewChild('clapSound', {static: true}) clapSound: any;
  @ViewChild('wrongFeedback', {static: true}) wrongFeedback: any;
  @ViewChild('rightFeedback', {static: true}) rightFeedback: any;
  @ViewChild('showAnswerVideo') showAnswerVideo: any;

  LastquestimeStart: boolean = false;
  videoonshowAnspopUp: any;
  showAnswerRef: any;
  showAnswerfeedback: any;
  showAnswerTimer: any;
  Smart_Calendar: false;
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
  isRight: boolean = true;
  showAnswerPopup: any;
  showAnswerVO: any;
  lastQuestionCheck: any;
  clappingTimer: any;
  ifYearAnsCorrect =true;
  ifMonthAnsCorrect =true;
  previousItemeventArr = []


  ngOnInit() {
    this.setTemplateType();
    this.setData();
    // this.sprite.nativeElement.style = "display:none";
    this.Sharedservice.setSubmitAnsEnabled(false);
    this.Sharedservice.setShowAnsEnabled(false);
    this.Sharedservice.setLastQuesAageyBadheStatus(false);
    // if (this.appModel.isNewCollection) {
    //   this.appModel.event = { 'action': 'segmentBegins' };
    // }
    this.containgFolderPath = this.getBasePath();
    this.stopAllSounds()
    
    this.appModel.getConfirmationPopup().subscribe((val) => {
      if (val == "uttarDikhayein") {
        this.appModel.stopAllTimer();
        this.stopAllSounds()
        if (this.showAnswerRef && this.showAnswerRef.nativeElement) {
          this.videoonshowAnspopUp.nativeElement.src = this.showAnswerPopup.video.location == "content" ? this.containgFolderPath + "/" + this.showAnswerPopup.video.url : this.assetsPath + "/" + this.showAnswerPopup.video.url;
          this.showAnswerRef.nativeElement.classList = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
          if (this.videoonshowAnspopUp && this.videoonshowAnspopUp.nativeElement) {
            this.videoonshowAnspopUp.nativeElement.play();
            this.videoonshowAnspopUp.nativeElement.onended = () => {
              this.showAnswerTimer = setTimeout(() => {
                this.closePopup('showAnswer');
              }, 10000);
            }
          }
        }

      } 
    })

    this.Sharedservice.getsetShowHideConfirmation().subscribe((data) => {
      console.log(data,"changed")
      this.stopAllSounds()
    })

    this.appModel.nextBtnEvent().subscribe(() => {
      if (this.appModel.isLastSectionInCollection) {
        this.appModel.event = { 'action': 'segmentEnds' };
      }
      if (this.appModel.isLastSection) {
        this.appModel.event = { 'action': 'exit' };
      }
    });
  }

  ngAfterViewChecked() {
    this.templatevolume(this.appModel.volumeValue, this);
  }

  ngAfterViewInit(){
    this.appModel.setLoader(false);
    this.checkforQVO();
    if (this.appModel.isNewCollection) {
      this.appModel.event = { 'action': 'segmentBegins' };
    }
    // let that = this;
    // document.getElementById('submitAns').onclick = function(){
    //   console.log("submit clicked")
    //   that.stopAllSounds()
    // }
  }

  templatevolume(vol, obj) {
    if (obj.feedbackAudio && obj.feedbackAudio.nativeElement) {
      obj.feedbackAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.narrator && obj.narrator.nativeElement) {
      obj.narrator.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.showAnswerVideo && obj.showAnswerVideo.nativeElement) {
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
    if (obj.speakerVolume && obj.speakerVolume.nativeElement) {
      obj.speakerVolume.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.clapSound && obj.clapSound.nativeElement) {
      obj.clapSound.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.audio) {
      obj.audio.volume = obj.appModel.isMute ? 0 : vol;
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

  //to reset things after a wrong answer
  postWrongAttemplt() {
    this.Sharedservice.setSubmitAnsEnabled(false);
    this.selectedYearID.length = 0;
    this.selectedMonthsId.length = 0;
    this.selectedDaysId.length = 0;
    this.selectedDatesId.length = 0;
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
    this.setDatefromJSON();

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


  //hover on and out images events
  hoveronMonth(item) {
    item.base = item.base_hover;
  }

  houtonMonth(item) {
    item.base = item.base_original;
  }

  hoveronYear(item) {
    item.year_base = item.base_hover;
  }

  houtonYear(item) {
    item.year_base = item.base_original;
  }

  hoveronWeekDays(item) {
    item.base = item.base_hover;
  }

  houtonWeekDays(item) {
    item.base = item.base_original
  }

  /******On Hover close popup******/
  hoverClosePopup() {
    this.popupAssets.close_button = this.popupAssets.close_button_hover;
  }

  /******Hover out close popup******/
  houtClosePopup() {
    this.popupAssets.close_button = this.popupAssets.close_button_origional;
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
    if (ev != undefined && ev.target.id != "") {
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
    if (this.quesObj.monthSelected) {
      this.monthsArr[this.date.getMonth()].selected = true;
      this.monthsArr[this.date.getMonth()].ImginpopUp = this.monthsArr[this.date.getMonth()].slectedBaseImg
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
    if (this.quesObj.yearSelected) {
        let item = this.Arryears.find((item) => item.id == this.date.getFullYear())
        item.selected = true;
        item.ImginpopUp = item.base_selected;
    }

    // this.Arryears.find((item) => item.id == this.date.getFullYear()).checkRightorWrong = true;
    if (this.quesObj.disableyear) {
      if (this.Arryears.filter((item) => item.selected != true) != undefined) {
        this.Arryears.filter((item) => item.selected != true).map((item) => item.disabled = true);
      }
    }

    //resetting weekdays
    this.selectedDaysId.length = 0;
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
    this.previousItemeventArr.length =0
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

  //check if date from localmachine or json and setdate
  setDatefromJSON() {
    if (this.quesObj.localMachineDate) {
      this.date = new Date();
      this.setselectedDisableinCalender();
      if (this.quesObj.monthSelected) {
        this.monthsArr[this.date.getMonth()].selected = true;
      }
      if (this.quesObj.dateSelected) {
        this.datesArr.find((item) => item.id == this.date.getDate()).selected = true;
      }
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


  //on clicking various components of calendar
  onClickCalender(item, flag) {
    this.stopAllSounds();
    console.log(this.date);
    if (flag == "month") {
      if (!item.selected) {
        this.monthfromLocalMachine = false;
        this.monthSelected = true;
        if (this.datesArr.filter((item) => item.selected == true)[0] != undefined) {
          this.datesArr.forEach(element => {
            element.selected = false;
          });
        }
        //resetting weekdays
        this.selectedDaysId.length = 0;
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
        this.previousItemeventArr.length =0
        this.selectedDaysId.length = 0;
        for (let i = this.startIndex; i >= 0; i--) {
          this.monthDates.nativeElement.children[0].children[i].children[0].src = this.datesArr[0].base_original.location == "content" ? this.containgFolderPath + "/" + this.datesArr[0].base_original.url : this.assetsPath + "/" + this.datesArr[0].base_original.url;
          if (this.monthDates.nativeElement && this.monthDates.nativeElement.children[0] && this.monthDates.nativeElement.children[0].children[i]) {
            this.monthDates.nativeElement.children[0].children[i].classList.value = "img-fluid opacityZero";
          }
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
        }
        if (this.selectedMonthsId.length == 0) {
          this.selectedMonthsId.push(indexofMonth);
        }
        if (this.monthsArr.filter((item) => item.checkRightorWrong == true)[0] != undefined) {
          this.monthsArr.filter((item) => item.checkRightorWrong == true)[0].checkRightorWrong = false;
        }
        console.log("indexofMonth", indexofMonth)
        this.date.setMonth(indexofMonth);
        item.selected = true;
        if(this.quesObj.multi_month &&(this.selectedMonthsId.length > this.feedback.right_month.length)){
          this.CheckforUnselectMonth()
          }
        this.setCalender('');
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
        this.selectedMonthsId.length = 0;
        this.selectedDatesId.length = 0;
        this.previousItemeventArr.length =0
        if (this.monthsArr.filter((item) => item.selected == true)[0] != undefined) {
          this.monthsArr.forEach(element => {
            element.selected = false;
          });
        }
        if (this.datesArr.filter((item) => item.selected == true)[0] != undefined) {
          this.datesArr.forEach(element => {
            element.selected = false;
          });
        }
        this.previousItemevent = undefined;
        for (let i = this.startIndex; i >= 0; i--) {
          this.monthDates.nativeElement.children[0].children[i].children[0].src = this.datesArr[0].base_original.location == "content" ? this.containgFolderPath + "/" + this.datesArr[0].base_original.url : this.assetsPath + "/" + this.datesArr[0].base_original.url;;
          this.monthDates.nativeElement.children[0].children[i].classList.value = "img-fluid opacityZero";
          this.monthDates.nativeElement.children[0].children[i].children[0].style.pointerEvents = "";
          this.monthDates.nativeElement.children[0].children[i].style.pointerEvents = "";

        }
        if (this.Arryears.filter((item) => item.selected == true)[0] != undefined) {
          if (!this.quesObj.multi_year) {
            this.selectedYearID.length = 0;
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
        this.date.setFullYear(item.id);
        item.selected = true;
        this.setCalender('');
        if(this.quesObj.multi_year && this.selectedYearID.length > this.feedback.right_year.length){
        this.CheckforUnselctYear()
        }
      }
      else {
        item.selected = false
        this.selectedYearID.splice(this.selectedYearID.indexOf(item.id), 1)
        console.log("this.selectedYearID", this.selectedYearID)
      }
    } else if (flag == "date") {
      console.log("item",item)
      this.clickedID = Number(item.target.id) + 1;
      let itemDate = this.datesArr.find((index) => index.id == this.clickedID);
      if (!itemDate.selected) {
        this.dateSelected = true;
        let itemDate = this.datesArr.find((index) => index.id == this.clickedID);
        if (this.datesArr.filter((item) => item.selected == true)[0] != undefined) {
          if (!this.quesObj.multi_date) {
            let previousItem = this.datesArr.filter((item) => item.selected == true)[0];
            previousItem.selected = false;
            if (this.previousItemevent != undefined) {
              this.previousItemevent.src = this.datesArr[0].base_original.location == "content" ? this.containgFolderPath + "/" + this.datesArr[0].base_original.url : this.assetsPath + "/" + this.datesArr[0].base_original.url;
              this.previousItemevent.parentNode.style.pointerEvents = "";
            }
            this.selectedDatesId.length = 0;
            this.previousItemeventArr.length =0;
            this.selectedDatesId.push(this.clickedID)
            this.previousItemeventArr.push(item.target)

          }
          else {
            console.log("this.selectedDatesId", this.selectedDatesId)
            this.selectedDatesId.push(this.clickedID)
            this.previousItemeventArr.push(item.target)

            console.log("this.selectedDatesId", this.selectedDatesId)
            console.log("this.previousItemeventArr",this.previousItemeventArr)

          }
        }
        if (this.selectedDatesId.length == 0) {
          this.selectedDatesId.push(this.clickedID)
          this.previousItemeventArr.push(item.target)

        }
        console.log("this.selectedDatesId",this.selectedDatesId)
          console.log("this.previousItemeventArr",this.previousItemeventArr)

        item.target.src = this.datesArr[0].base_hover.location == "content" ? this.containgFolderPath + "/" + this.datesArr[0].base_selected.url : this.assetsPath + "/" + this.datesArr[0].base_selected.url;
        this.previousItemevent = item.target;
        if (!this.quesObj.multi_date) {
          item.target.parentNode.style.pointerEvents = "none";
          console.log("item",item.target)
        }
        itemDate.selected = true;
        if(this.quesObj.multi_date &&(this.selectedDatesId.length > this.feedback.right_date.length)){
          this.CheckforUnselect()
          }
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
        } else {
          this.isCorrectDate = false;
        }

      } else {
        this.clickedID = Number(item.target.id) + 1;
        itemDate.selected = false;
        let tempId = this.selectedDatesId.indexOf(this.clickedID)
        this.selectedDatesId.splice(this.selectedDatesId.indexOf(this.clickedID), 1)
        this.previousItemeventArr.splice(tempId, 1)
        console.log("this.selectedDATEsId", this.selectedDatesId)
        console.log("this.previousItemeventArr",this.previousItemeventArr)

        item.target.src = this.datesArr[0].base_hover.location == "content" ? this.containgFolderPath + "/" + this.datesArr[0].base_selected.url : this.assetsPath + "/" + this.datesArr[0].base.url;
      }
    }

    else if (flag == "weekDays") {
      if (!item.selected) {
        this.weekDaySelected = true;
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
        if(this.quesObj.multi_day && this.selectedDaysId.length > this.feedback.right_weekDay.length){
          this.CheckforUnselctWeekday()
          }
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

  CheckforUnselect(){
    let firstItem:any
    firstItem = this.selectedDatesId[0];
    //remove selected and set url for normal base
    let itemDate = this.datesArr.find((index) => index.id == (firstItem));
    itemDate.selected = false;
    this.previousItemeventArr[0].src = this.datesArr[0].base_original.location == "content" ? this.containgFolderPath + "/" + this.datesArr[0].base_original.url : this.assetsPath + "/" + this.datesArr[0].base_original.url;
    this.previousItemeventArr.shift();
    this.selectedDatesId.shift();
    console.log("this.selectedDATEsId", this.selectedDatesId)
    console.log("this.previousItemeventArr",this.previousItemeventArr)
  }

  CheckforUnselectMonth(){
    let firstItem:any
    firstItem = this.selectedMonthsId[0];
    this.monthsArr[firstItem].selected = false;
    this.selectedMonthsId.shift();
  }

  CheckforUnselctYear(){
    let firstItem:any
    firstItem = this.selectedYearID[0];
    let itemYear = this.Arryears.find((index) => index.id == (firstItem));
    itemYear.selected = false;
    this.selectedYearID.shift();
  }

  CheckforUnselctWeekday(){
    let firstItem:any
    firstItem = this.selectedDaysId[0];
    let itemWeekDay = this.ArrweekDays.find((index) => index.id == (firstItem));
    itemWeekDay.selected = false;
    this.selectedDaysId.shift();
  }


//set calendar for different purposes
  setCalender(from) {
    this.date.setDate(1);
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
      for (let i = 0; i < days; i++) {
        this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].id = i;
        this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].classList.value = "img-fluid";
        if (this.datesArr[i].disable) {
          this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].classList.value = "img-fluid disable-state";
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
        } else {
          this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].src = this.datesArr[i].dateImg.location == "content" ? this.containgFolderPath + "/" + this.datesArr[i].dateImg.url : this.assetsPath + "/" + this.datesArr[i].dateImg.url;
        }
        this.startIndex++;
       
      }
    }
    else {
      console.log("setting calendaer...--->>>")
      //resetting weekdays
      if (this.ArrweekDays.filter((item) => item.selected == true)[0] != undefined) {
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
        if (this.datesArr[i].selected) {
          this.monthDates.nativeElement.children[0].children[this.startIndex].children[0].src = this.datesArr[0].base_hover.location == "content" ? this.containgFolderPath + "/" + this.datesArr[0].base_selected.url : this.assetsPath + "/" + this.datesArr[0].base_selected.url;
        }
        this.monthDates.nativeElement.children[0].children[this.startIndex].children[1].textContent = this.datesArr[i].id;
        this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].children[1].textContent = this.datesArr[i].id;
        this.startIndex++;
      }
    }
  }

  //set initial data
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
      this.commonAssets.ques_control.blinkingStatus = false;
      //need to be set acc. to the right or wrong answer.
      this.popupIcon = this.popupAssets.right_icon.url;
      this.popupIconLocation = this.popupAssets.right_icon.location;
      if (this.isLastQuesAct || this.isLastQues) {
        this.appModel.setlastQuesNT();
      }
      this.feedbackObj = fetchedData.feedback;
      this.confirmPopupAssets = fetchedData.feedback.confirm_popup;
      this.quesObj = fetchedData.quesObj[0];
      this.Smart_Calendar = this.quesObj.smart_calendar
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

  onclickOK() {
    this.closeModal();
  }

  // on answer pop up close event
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
    if (this.isRight) {
      this.Sharedservice.setShowAnsEnabled(true);
      this.blinkOnLastQues();
      if (this.lastQuestionCheck) {
        this.Sharedservice.setTimeOnLastQues(true);
      }
    }
    else {
      if (this.wrongCounter >= 3) {
        this.Sharedservice.setShowAnsEnabled(true);
      } else {
        this.Sharedservice.setShowAnsEnabled(false);
      }
      this.postWrongAttemplt();
    }
  }


  //After submit ans confirmation pop up clicked yes
  closePopup(type) {
    console.log("type", type)
    clearTimeout(this.wrongTimer);
    clearTimeout(this.rightTimer);
    clearTimeout(this.showAnswerTimer);
    this.showAnswerRef.nativeElement.classList = "modal";
    if(this.videoonshowAnspopUp){
      this.videoonshowAnspopUp.nativeElement.pause();
      this.videoonshowAnspopUp.nativeElement.currentTime = 0;
    }
    if (type == "showAnswer") {
      if (this.isRight) {
      this.blinkOnLastQues();
      }
    }

    //for type confirmation pop up
    if (type == "yes") {
      this.CheckAnswer();
      setTimeout(() => {
        if (this.isRight) {
          this.appModel.storeVisitedTabs();
          if (this.rightFeedback && this.rightFeedback.nativeElement) {
            this.clapSound.nativeElement.play();
            for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
              document.getElementsByClassName("ansBtn")[i].classList.add("disableDiv");
            }
            this.clappingTimer = setTimeout(() => {
              this.clapSound.nativeElement.pause();
              this.clapSound.nativeElement.currentTime = 0;
              this.popupRef.nativeElement.classList = "displayPopup modal";
              this.setCalender("popup");
              this.rightFeedback.nativeElement.play();
              for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
                document.getElementsByClassName("ansBtn")[i].classList.remove("disableDiv");
              }
              this.rightFeedback.nativeElement.onended = () => {
                this.rightTimer = setTimeout(() => {
                  this.closeModal();
                }, 10000);
              }
            }, 2000);
          }
        }
        else {
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

  //use in case local machine answer
  checklocalAnswer(){
    // let date = new Date();
    // console.log(date)
    // // if(this.feedback.right_month[0]){
    // //   let elementID = this.monthsArr.findIndex((item) => item.id == this.feedback.right_month[0]);
    // //   console.log("elementID",elementID)
    // //   date = date.setMonth(elementID)
    // // }
    // if(this.feedback.right_date[0] == "today" ){
    //   date = new Date();
    // }
    // if(this.feedback.right_date[0]){
    //   date.setDate(this.feedback.right_date[0])
    // }
    // let tempDayId = date.getDay();



    // this.feedback.right_weekDay = 

    // console.log("date",date)

  }

  CheckAnswer() {
    this.ifYearAnsCorrect =true;
    this.ifMonthAnsCorrect =true;

    console.log("right_date", this.feedback.right_date)
    console.log("right_month", this.feedback.right_month)
    console.log("right_weekDay", this.feedback.right_weekDay)
    console.log("right_year", this.feedback.right_year)
    //set right wrong for months
    //set right and wrong year base 
    if (this.feedback.right_year.length > 0) {
      this.ifYearAnsCorrect =( this.feedback.right_year.length == this.selectedYearID.length && this.arrayEquals(this.feedback.right_year,this.selectedYearID))
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
        //this.setCalender('');
      }
    }
    //to check when localmachine is true
    // if (this.quesObj.localMachineDate && this.feedback.right_year.length == 0 && this.selectedYearID.length == 1) {
    //   //check selected month against current month
    //   let current_year = new Date().getFullYear();
    //   console.log(current_year)
    //   console.log(this.selectedYearID)
    //   let id = this.Arryears.findIndex((item) => item.id == this.selectedYearID);
    //   if (current_year == this.selectedYearID[0]) {
    //     this.Arryears[id].ImginpopUp = this.Arryears[id].base_right
    //   }
    //   else {
    //     this.Arryears[id].ImginpopUp = this.Arryears[id].base_wrong
    //   }
    // }




    if (this.feedback.right_month.length > 0 ) {
      
      let RightMonthArray = JSON.parse(JSON.stringify(this.feedback.right_month))
      let that = this
      RightMonthArray.forEach((element1, i)=> {
        that.monthsArr.forEach((item, ind)=> {
          if (item.id == element1) {
            RightMonthArray[i] = ind
          }
        });
      });

      this.ifMonthAnsCorrect = (this.selectedMonthsId.length == RightMonthArray.length &&  this.arrayEquals(this.selectedMonthsId,RightMonthArray))
      for (let index1 = 0; index1 < this.selectedMonthsId.length; index1++) {
        const element1 = this.selectedMonthsId[index1];
        for (let index2 = 0; index2 < this.feedback.right_month.length; index2++) {
          const element2 = this.monthsArr.findIndex((item) => item.id == this.feedback.right_month[index2]);
          if (element1 == element2) {
            //put a green base 
            this.monthsArr[element1].ImginpopUp = this.ifYearAnsCorrect ? this.monthsArr[element1].base_right : this.monthsArr[element1].base_wrong
            break;
          }
          else {
            this.monthsArr[element1].ImginpopUp = this.monthsArr[element1].base_wrong
          }
          //put a red base 
        }
      }
    }

    //to check when localmachine is true
    // if (this.quesObj.localMachineDate && this.feedback.right_month.length == 0 && this.selectedMonthsId.length == 1) {
    //   //check selected month against current month
    //   let current_month = new Date().getMonth();
    //   console.log(current_month)
    //   console.log(this.selectedMonthsId)
    //   if (current_month == this.selectedMonthsId[0]) {
    //     this.monthsArr[current_month].ImginpopUp = this.monthsArr[current_month].base_right
    //   }
    //   else {
    //     this.monthsArr[this.selectedMonthsId[0]].ImginpopUp = this.monthsArr[this.selectedMonthsId[0]].base_wrong
    //   }
    // }
    //set right wrong for week days base
    if (this.feedback.right_weekDay.length > 0 && !this.Smart_Calendar) {
      for (let index1 = 0; index1 < this.selectedDaysId.length; index1++) {
        const element1 = this.selectedDaysId[index1];
        for (let index2 = 0; index2 < this.feedback.right_weekDay.length; index2++) {
          const element2 = this.feedback.right_weekDay[index2]
          let id = this.ArrweekDays.findIndex((item) => item.id == element1);
          console.log("id", id)
          if (element1 == element2) {
            //put a green base
            this.ArrweekDays[id].weekDayImginpopUp = (this.ifYearAnsCorrect && this.ifMonthAnsCorrect) ? this.ArrweekDays[id].base_right : this.ArrweekDays[id].base_wrong;
            break;
          }
          else {
            this.ArrweekDays[id].weekDayImginpopUp = this.ArrweekDays[id].base_wrong
          }
          //put a red base 
        }
      }
    }
    //to check when localmachine is true
    // if (this.quesObj.localMachineDate && this.feedback.right_weekDay.length == 0 && this.selectedDaysId.length == 1) {
    //   //check selected month against current month
    //   let current_week = new Date().getDay();
    //   current_week = current_week - 1;
    //   console.log(current_week)
    //   console.log(this.selectedDaysId)
    //   if (this.ArrweekDays[current_week].id == this.selectedDaysId[0]) {
    //     this.ArrweekDays[current_week].weekDayImginpopUp = this.ArrweekDays[current_week].base_right
    //   }
    //   else {
    //     this.ArrweekDays[current_week].weekDayImginpopUp = this.ArrweekDays[current_week].base_wrong
    //   }
    // }
    

    //set right wrong base for dates
    if (this.feedback.right_date.length > 0 && !this.Smart_Calendar) {
      for (let index1 = 0; index1 < this.selectedDatesId.length; index1++) {
        const element1 = this.selectedDatesId[index1];
        for (let index2 = 0; index2 < this.feedback.right_date.length; index2++) {
          const element2 = this.feedback.right_date[index2]
          //find ID of the element in #monthDatesinPopup to replace base url
          if (element1 == element2 && ((this.ifYearAnsCorrect && this.ifMonthAnsCorrect))) {
            this.setRightWrongbaseDates(element1, "right")
            break;
          }
          else {
            this.setRightWrongbaseDates(element1, "wrong")
          }
        }
      }
    }

    //to check when localmachine is true
    // if (this.quesObj.localMachineDate && this.feedback.right_date.length == 0 && this.selectedDatesId.length == 1) {
    //   //check selected month against current month
    //   let current_date = new Date().getDate();
    //   console.log(current_date)
    //   console.log(this.selectedDatesId)
    //   if (current_date == this.selectedDatesId[0]) {
    //     this.setRightWrongbaseDates(this.selectedDatesId[0], "right")
    //   }
    //   else {
    //     this.setRightWrongbaseDates(this.selectedDatesId[0], "wrong")
    //   }

    // }
    this.onSubmitResult()
  }

  //set right/wrong base to dates
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

  //check if attempt is right or wrong
  onSubmitResult() {
    let RightMonthArray = JSON.parse(JSON.stringify(this.feedback.right_month))
    let that = this
    RightMonthArray.forEach((element1, i)=> {
      that.monthsArr.forEach((item, ind)=> {
        if (item.id == element1) {
          RightMonthArray[i] = ind
        }
      });
    });

    let rightWeekDayArray = JSON.parse(JSON.stringify(this.feedback.right_weekDay))
    rightWeekDayArray.forEach((element1, i)=> {
      that.ArrweekDays.forEach((item, ind)=> {
        if (item.id == element1) {
          rightWeekDayArray[i] = ind
        }
      });
    });
    console.log("rightWeekDayArray", rightWeekDayArray)

    let selectedWeekDayArray = JSON.parse(JSON.stringify(this.selectedDaysId))
    selectedWeekDayArray.forEach((element1, i)=> {
      that.ArrweekDays.forEach((item, ind)=> {
        if (item.id == element1) {
          selectedWeekDayArray[i] = ind
        }
      });
    });
    console.log("selectedWeekDayArray", selectedWeekDayArray)

    console.log("feedback_minths", RightMonthArray)
    let finalRightArray = this.feedback.right_year.concat(RightMonthArray, rightWeekDayArray, this.feedback.right_date)
    console.log("finalRightArray", finalRightArray)
    finalRightArray.sort();
    let finalSelectedArray = this.selectedYearID.concat(this.selectedMonthsId, selectedWeekDayArray, this.selectedDatesId)
    console.log("finalSelectedArray", finalSelectedArray)
    finalSelectedArray.sort();

    if (finalRightArray.length == finalSelectedArray.length && this.arrayEquals(finalRightArray, finalSelectedArray)) {
      console.log("RIGHT ANSWER BY USER")
      this.isRight = true;
      this.popupIcon = this.popupAssets.right_icon.url;
      this.popupIconLocation = this.popupAssets.right_icon.location;
      this.Sharedservice.setSubmitAnsEnabled(false);

      //remove viewchild
      this.overlay.nativeElement.classList.value = "fadeContainer";
    }
    else {
      console.log("WRONG ANSWER BY USER")
      this.wrongCounter += 1;
      this.isRight = false;
      this.popupIcon = this.popupAssets.wrong_icon.url;
      this.popupIconLocation = this.popupAssets.wrong_icon.location;
      console.log("this.wrongCounter", this.wrongCounter)
    }

    console.log("this.arrayEquals(finalRightArray, finalSelectedArray)", this.arrayEquals(finalRightArray, finalSelectedArray))

  }


  //to check if two arrays are equal
  arrayEquals(a, b) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }

  //to enable submit button after attempting a particular no. of options
  checkforsubmitButton() {
    let realAnsLength = this.feedback.right_date.length + this.feedback.right_month.length +
      this.feedback.right_weekDay.length + this.feedback.right_year.length
    let selectedAnsLength = this.selectedDatesId.length + this.selectedDaysId.length +
      this.selectedYearID.length + this.selectedMonthsId.length
    console.log("realAnsLength", realAnsLength);
    console.log("selectedAnsLength", selectedAnsLength);
    // if (selectedAnsLength >= realAnsLength) {
    //   //enable submit button
    //   this.Sharedservice.setSubmitAnsEnabled(true)
    // }
    // else {
    //   this.Sharedservice.setSubmitAnsEnabled(false)
    // }
    if(this.selectedDatesId.length >= this.feedback.right_date.length && this.selectedDaysId.length >=  this.feedback.right_weekDay.length && this.selectedMonthsId.length>= this.feedback.right_month.length &&  this.selectedYearID.length >= this.feedback.right_year.length)
    {
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

    if(this.speakerVolume && this.speakerVolume.nativeElement){
      this.speakerVolume.nativeElement.pause();
      this.speakerVolume.nativeElement.currentTime = 0;
    }

  }

  //clear timers stop sounds on destroy
  ngOnDestroy() {
    clearTimeout(this.rightTimer);
    clearTimeout(this.wrongTimer);
    clearTimeout(this.clappingTimer);
    this.stopAllSounds();
    this.appModel.stopAllTimer();
  }
  
  clickedChild(ev){
    console.log("ev",ev)
    
    let event = {target : ev.target.parentNode.children[0]}
    this.onClickCalender(event,'date')
  }

  NumberHover(ev){
    let event = {target : ev.target.parentNode.children[0]}
    this.hoveronDate(event)
  }

  NumberHoverOut(ev){
    let event = {target : ev.target.parentNode.children[0]}
    this.houtonDate(event)
  }

  /** Function called on click of speaker **/
  onSpeakerClicked() {
    this.stopAllSounds();
  }

}
