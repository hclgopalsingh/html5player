import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { Subscription } from 'rxjs'
import { HttphandlerService } from '../../../model/httphandler.service';
import { ThemeConstants } from '../../../common/themeconstants';
import { SharedserviceService } from '../../../services/sharedservice.service';

@Component({
  selector: 'Ntemplate22',
  templateUrl: './Ntemplate22.component.html',
  styleUrls: ['./Ntemplate22.component.css', '../../../view/css/bootstrap.min.css'],
  encapsulation: ViewEncapsulation.None
})

export class Ntemplate22 implements OnInit {
  private appModel: ApplicationmodelService;
  private httpHandler: HttphandlerService;
  constructor(appModel: ApplicationmodelService, httpHandler: HttphandlerService, private Sharedservice: SharedserviceService) {
    this.appModel = appModel;
    this.httpHandler = httpHandler;
    this.assetsPath = this.appModel.assetsfolderpath;
    this.appModel.navShow = 2;
    this.appModel.setLoader(true);
    // if error occured during image loading loader wil stop after 5 seconds 
    this.loaderTimer = setTimeout(() => {
      this.appModel.setLoader(false);

      this.checkforQVO();
    }, 5000);

  }

  @ViewChild("optionsBlock") optionsBlock: any;
  @ViewChild('narrator') narrator: any;
  @ViewChild('instruction') instruction: any;
  @ViewChild('confirmModalRef') confirmModalRef: any;
  @ViewChild('popupRef') popupRef: any;
  @ViewChild('rightFeedbackVO') rightFeedbackVO: any
  @ViewChild('wrongFeedbackVO') wrongFeedbackVO: any;
  @ViewChild('quesRef') QuesRef: any;
  @ViewChild('QuestionAudio') questionAudio: any;
  @ViewChild('confirmSubmitRef') confirmSubmitRef: any;
  @ViewChild('feedbackPopupAudio') feedbackPopupAudio: any;
  @ViewChild('infoModalRef') infoModalRef: any;
  @ViewChild('feedbackInfoAudio') feedbackInfoAudio: any;
  @ViewChild('monthDates') monthDates: any;
  @ViewChild('monthDatesinPopup') monthDatesinPopup: any;
  @ViewChild('instructionBar') instructionBar: any;


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
  attemptType: string = "";
  optionSelected: any;
  styleHeaderPopup: any;
  styleBodyPopup: any;
  holidayData: any = [];
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
  controlHandler = {
    isSubmitRequired: false,
    isReplayRequired: false
  };
  filterData: any;
  filterObj: any;
  QueScenarioData: any;
  fetchedcontent: any;
  functionalityType: any;
  themePath: any;
  showAnsTimeout: any;
  currentYear: any;
  currentMonth: any;
  holidayCal: any;
  AnswerpopupTxt: boolean = false;
  popupHeader: any;
  rightanspopUpheader_img: boolean = false;
  wronganspopUpheader_img: boolean = false;
  showanspopUpheader_img: boolean = false;
  partialCorrectheaderTxt_img: boolean = false;
  MonthNames: any = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  DayNames: any = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


  ngAfterViewChecked() {
    this.appModel.templatevolume(this.appModel.volumeValue, this);
  }

  ngAfterViewInit() {
    //this.getJson();
  }

  ngOnInit() {
    this.containgFolderPath = this.getBasePath();
    this.containgFolderPath = this.getBasePath();
    let fetchedData: any = this.appModel.content.contentData.data;
    this.fetchedcontent = JSON.parse(JSON.stringify(fetchedData));;
    this.functionalityType = this.appModel.content.contentLogic.functionalityType;
    this.themePath = ThemeConstants.THEME_PATH + this.fetchedcontent.productType + '/' + this.fetchedcontent.theme_name;
    this.Sharedservice.imagePath(this.fetchedcontent, this.containgFolderPath, this.themePath, this.functionalityType);
    this.appModel.globalJsonData.subscribe(data => {
      this.showAnsTimeout = data.showAnsTimeout;
    });
    this.checkquesTab();


    this.setData();

    if (this.appModel.isNewCollection) {
      this.appModel.event = { 'action': 'segmentBegins' };
    }
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
        this.rightanspopUpheader_img = false;
        this.wronganspopUpheader_img = false;
        this.showanspopUpheader_img = true;
        this.partialCorrectheaderTxt_img = false;
        this.styleHeaderPopup = this.feedbackObj.style_header;
        this.styleBodyPopup = this.feedbackObj.style_body;
        //show modal for manual
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          // $("#instructionBar").addClass("disable_div");
          this.instructionBar.nativeElement.classList = "instructionBase disable_div";
          console.log("No-1");

          //this.setFeedbackAudio();
        }
      } else if (mode == "auto") {
        if (this.feedbackObj.rightAnswerpopupTxt.required) {
          this.AnswerpopupTxt = true;
          this.popupHeader = this.feedbackObj.rightAnswerpopupTxt.url;

        } else {
          this.AnswerpopupTxt = false;
        }
        this.checked = true;
        //show modal of auto
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          //$("#instructionBar").addClass("disable_div");
          this.instructionBar.nativeElement.classList = "instructionBase disable_div";

          //this.popupRef.nativeElement.classList = "displayPopup modal";
          console.log("No-2");
          this.showAnswerFeedback();
          this.rightanspopUpheader_img = false;
          this.wronganspopUpheader_img = false;
          this.showanspopUpheader_img = true;
          this.partialCorrectheaderTxt_img = false;
          this.styleHeaderPopup = this.feedbackObj.style_header;
          this.styleBodyPopup = this.feedbackObj.style_body;
          this.confirmModalRef.nativeElement.classList = "modal";
          this.confirmSubmitRef.nativeElement.classList = "modal";
          this.popupRef.nativeElement.classList = "displayPopup modal";	 
          this.feedbackPopupAudio.nativeElement.src = this.commonAssets.showAnsAudio.url;
          this.feedbackPopupAudio.nativeElement.load();
          this.feedbackPopupAudio.nativeElement.play();
          this.feedbackPopupAudio.nativeElement.onended = () => {
            //this.closeModal();

          }
          this.optionsBlock.nativeElement.style.opacity = "0.3"
          this.instructionBar.nativeElement.style.opacity = "0.3"
          this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
          this.instructionBar.nativeElement.classList = "instructionBase disable_div";

        }
      }
    })

    this.appModel.getConfirmationPopup().subscribe((val) => {
      if (val == "uttarDikhayein") {

        this.rightanspopUpheader_img = false;
        this.wronganspopUpheader_img = false;
        this.showanspopUpheader_img = true;
        this.partialCorrectheaderTxt_img = false;
        this.styleHeaderPopup = this.feedbackObj.style_header;
        this.styleBodyPopup = this.feedbackObj.style_body;
        if (this.feedbackObj.ShowAnsHeader && this.feedbackObj.ShowAnsHeader.required) {
          this.AnswerpopupTxt = true;
          this.popupHeader = this.feedbackObj.ShowAnsHeader.url;
        } else {
          this.AnswerpopupTxt = false;
        }
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.pause();
        if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
          this.confirmModalRef.nativeElement.classList = "displayPopup modal";
          this.appModel.notifyUserAction();
        }
      } else if (val == "submitAnswer") {
        this.instruction.nativeElement.currentTime = 0;
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
    this.appModel.handleController(this.controlHandler);
    this.appModel.resetBlinkingTimer();

  }
  playHoverInstruction() {
    if (!this.narrator.nativeElement.paused) {
      console.log("narrator/instruction voice still playing");
    } else {
      console.log("play on Instruction");
      this.instruction.nativeElement.load();
      if (this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.play();
        this.instructionBar.nativeElement.classList = "instructionBase disable_div";
        this.instruction.nativeElement.onended = () => {
          this.instructionBar.nativeElement.classList = "instructionBase";

        }
      }

    }
  }

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
          this.appModel.event = { 'action': 'exit' };
        }
      }
    } else {
      this.appModel.moveNextQues(this.attemptType);
    }
  }

  //for seting question tabs
  checkquesTab() {
    if (this.fetchedcontent.commonassets.ques_control != undefined) {
      this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
    } else {
      this.appModel.getJson();
    }
  }

  //to get the holiday json
  //declare in service and import
  getJson() {
    this.httpHandler.get("./assets/Holiday/holiday_data.json", this.holiday_json.bind(this), this.holiday_json_error.bind(this));
  }

  //success on getting holiday list
  holiday_json(data) {
    this.holidayData = data.Holidays
    console.log("./assets/Holiday/holiday_data", data)
    if (this.quesObj.Ques_scenario.type != "") {
      this.handleScenario(this.quesObj.Ques_scenario.type, this.quesObj.Ques_scenario[this.quesObj.Ques_scenario.type])
    }
  }

  holiday_json_error(error) {
    console.log("Json_Error", error)
  }

  findHolidayInJsonTodisplay(id, year) {
    this.filterData = this.holidayData[year]
    console.log(this.holidayData, "this.holidayData")
    return this.filterData[id];
  }

  // to show current month holidays
  showCurrentMonthHolidays() {
    console.log("this.date", this.date, this.date.getMonth(), this.date.getFullYear());
    var abc = [];
    var a = this.holidayData[this.date.getFullYear()];
    var objectLenght = Object.keys(a).length;
    for (var i = 0; i < objectLenght; i++) {
      var aa = Object.keys(a)[i];
      var bb = a[aa];
      if (bb.month == this.date.getMonth() + 1) {
        abc.push({ 'date': bb.date, 'name': bb.name });
      }
      this.holidayCal = abc;

    }
    if (this.holidayCal.length && this.holidayCal.length > 5) {
      this.holidayCal.splice(5)
    }
    console.log("CurrentMonhtHolidays", abc)

  }

  postWrongAttemplt() {

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

//
  checkforQVO() {
    if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
      this.narrator.nativeElement.src = this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
      let instruction: HTMLElement = document.getElementsByClassName("instructionBase")[0] as HTMLElement;
      instruction.style.pointerEvents = "none"
      this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
      this.appModel.handlePostVOActivity(true);
      this.narrator.nativeElement.play();
      this.narrator.nativeElement.onended = () => {
        this.appModel.handlePostVOActivity(false);
        instruction.style.pointerEvents = "";
        this.optionsBlock.nativeElement.classList = "row mx-0";
      }
    } else {
      this.appModel.handlePostVOActivity(false);
    }
  }

  //HOVER EVENTS
  hoveronMonth(item) {
    //console.log(item);
    this.appModel.notifyUserAction();
    if (!this.instruction.nativeElement.paused) {
      this.instruction.nativeElement.currentTime = 0;
      this.instruction.nativeElement.pause();
    }
    item.monthImg = item.hovermonthImg;
  }

  houtonMonth(item) {
    item.monthImg = item.monthOriginalImg;
  }

  hoveronYear(item) {
    //if(!item.selected) {
    this.appModel.notifyUserAction();
    if (!this.instruction.nativeElement.paused) {
      this.instruction.nativeElement.currentTime = 0;
      this.instruction.nativeElement.pause();
    }
    item.yearsImg = item.hoveryearsImg;
    //}
  }

  houtonYear(item) {
    //if(!item.selected) {
    item.yearsImg = item.yearsOriginalImg;
    // }
  }

  hoveronWeekDays(item) {
    this.appModel.notifyUserAction();
    if (!this.instruction.nativeElement.paused) {
      this.instruction.nativeElement.currentTime = 0;
      this.instruction.nativeElement.pause();
    }
    item.weekDayImg = item.hoverweekDayImg;
  }

  houtonWeekDays(item) {
    item.weekDayImg = item.weekDayOriginalImg;
  }

  hoveronDate(ev) {
    if (ev != undefined && ev.target.id != "") {
      this.appModel.notifyUserAction();
      if (!this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.pause();
      }
      if (!this.datesArr[ev.target.id].selected) {
        ev.target.src = this.datesArr[ev.target.id].hoverdateImg.url;
      }
    }
  }

  houtonDate(ev) {
    if (ev != undefined && ev.target.id != "") {
      this.appModel.notifyUserAction();
      if (!this.datesArr[ev.target.id].selected) {
        ev.target.src = this.datesArr[ev.target.id].dateOriginalImg.url;
      }
    }
  }

  hoverConfirm() {
    this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_hover;
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

  hoverClosePopup() {
    this.feedbackObj.popup_commmon_imgs.close_btn = this.feedbackObj.popup_commmon_imgs.close_btn_hover;
  }

  houtClosePopup() {
    this.feedbackObj.popup_commmon_imgs.close_btn = this.feedbackObj.popup_commmon_imgs.close_btn_original;
  }

  hoverOK() {
    this.feedbackObj.ok_btn = this.feedbackObj.ok_btn_hover;
  }

  houtOK() {
    this.feedbackObj.ok_btn = this.feedbackObj.ok_btn_original;
  }


  // set disabled in calendar
  setselectedDisableinCalender() {
    if (this.monthsArr.filter((item) => item.selected == true)[0] != undefined) {
      this.monthsArr.filter((item) => item.selected == true)[0].selected = false;
    }
    this.monthsArr[this.date.getMonth()].selected = true;
    this.monthsArr[this.date.getMonth()].checkRightorWrong = true;
    if (this.quesObj.disablemonth) {
      if (this.monthsArr.filter((item) => item.selected != true) != undefined) {
        this.monthsArr.filter((item) => item.selected != true).map((item) => item.disabled = true);
      }
    }
    if (this.Arryears.filter((item) => item.selected == true)[0] != undefined) {
      this.Arryears.filter((item) => item.selected == true)[0].selected = false;
    }
    this.Arryears.find((item) => item.id == this.date.getFullYear()).selected = true;
    this.Arryears.find((item) => item.id == this.date.getFullYear()).checkRightorWrong = true;
    if (this.quesObj.disableyear) {
      if (this.Arryears.filter((item) => item.selected != true) != undefined) {
        this.Arryears.filter((item) => item.selected != true).map((item) => item.disabled = true);
      }
    }
    if (this.ArrweekDays.filter((item) => item.selected == true)[0] != undefined) {
      this.ArrweekDays.filter((item) => item.selected == true)[0].selected = false;
    }
    if (this.quesObj.disableweekDay) {
      if (this.ArrweekDays.filter((item) => item.selected != true) != undefined) {
        this.ArrweekDays.filter((item) => item.selected != true).map((item) => item.disabled = true);
      }
    }
    if (this.datesArr.filter((item) => item.selected == true)[0] != undefined) {
      this.datesArr.filter((item) => item.selected == true)[0].selected = false;
    }
    if (this.quesObj.disableDate) {
      if (this.datesArr.filter((item) => item.selected != true) != undefined) {
        this.datesArr.filter((item) => item.selected != true).map((item) => item.disable = true);
      }
    }
    this.getCurrentMonth();
  }
  getCurrentMonth() {
    // currentYear:any;
    //currentMonth:any;
    this.Arryears.filter((years) => {
      if (years.selected == true) {
        this.currentYear = years.id;
      }
    });
    this.monthsArr.filter((months) => {
      if (months.selected == true) {
        this.currentMonth = months.id;
      }
    });
    console.log('current selected Year is ->' + this.currentYear);
    console.log('current selected Month is ->' + this.currentMonth);

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

  //set right answer
  setCorrectAnswer() {
    console.log(new Date().getFullYear())
    console.log("this.feedback.yearAdjustment", this.feedback.yearAdjustment)
    this.feedback.correct_year = new Date().getFullYear() + this.quesObj.yearAdjustment
    console.log(this.feedback.correct_year, "this.feedback.correct_year")
  }

  //handle click event of calendar
  onClickCalender(item, flag) {
    console.log(this.date);
    this.appModel.notifyUserAction();
    if (flag == "month" && !item.selected) {
      this.monthfromLocalMachine = false;
      this.monthSelected = true;
      if (this.datesArr.filter((item) => item.selected == true)[0] != undefined) {
        this.datesArr.filter((item) => item.selected == true)[0].selected = false;
      }
      //this.dateSelected=false;
      this.previousItemevent = undefined;
      for (let i = this.startIndex; i >= 0; i--) {
        this.monthDates.nativeElement.children[0].children[i].src = "./assets/images/Template-22/English/Images English/Days/Days Normal/date01.png";
        this.monthDates.nativeElement.children[0].children[i].classList.value = "img-fluid opacityZero";
      }
      if (this.monthsArr.filter((item) => item.selected == true)[0] != undefined) {
        this.monthsArr.filter((item) => item.selected == true)[0].selected = false;
      }
      if (this.monthsArr.filter((item) => item.checkRightorWrong == true)[0] != undefined) {
        this.monthsArr.filter((item) => item.checkRightorWrong == true)[0].checkRightorWrong = false;
      }
      let indexofMonth = this.monthsArr.findIndex((index) => index.id == item.id);
      this.date.setMonth(indexofMonth);
      item.selected = true;
      this.setCalender('');
      if (this.feedbackObj.correct_month != "" && item.id == this.feedbackObj.correct_month) {
        this.isCorrectMonth = true;
        item.checkRightorWrong = true;
        item.ImginpopUp = item.rightmonthImg;
      } else {
        this.isCorrectMonth = false;
        item.checkRightorWrong = true;
        item.ImginpopUp = item.wrongmonthImg;
      }
    } else if (flag == "year" && !item.selected) {
      this.yearfromLocalMachine = false;
      this.yearSelected = true;
      if (this.Arryears.filter((item) => item.checkRightorWrong == true)[0] != undefined) {
        this.Arryears.filter((item) => item.checkRightorWrong == true)[0].checkRightorWrong = false;
      }
      //this.dateSelected=false;
      //this.weekDaySelected = false;
      this.previousItemevent = undefined;
      for (let i = this.startIndex; i >= 0; i--) {
        this.monthDates.nativeElement.children[0].children[i].src = "./assets/images/Template-22/English/Images English/Days/Days Normal/date01.png";
        this.monthDates.nativeElement.children[0].children[i].classList.value = "img-fluid opacityZero";
      }
      if (this.Arryears.filter((item) => item.selected == true)[0] != undefined) {
        this.Arryears.filter((item) => item.selected == true)[0].selected = false;
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
    } else if (flag == "date") {
      this.dateSelected = true;
      this.clickedID = Number(item.target.id) + 1;
      let itemDate = this.datesArr.find((index) => index.id == this.clickedID);
      if (this.datesArr.filter((item) => item.selected == true)[0] != undefined) {
        let previousItem = this.datesArr.filter((item) => item.selected == true)[0];
        previousItem.selected = false;
        if (this.previousItemevent != undefined) {
          this.previousItemevent.src = previousItem.dateImg.url;
          this.previousItemevent.style.pointerEvents = "";
        }
        //previousItem.dateImg = previousItem.dateOriginalImg;
      }
      //itemDate.dateImg = itemDate.selecteddateImg;
      item.target.src = itemDate.selecteddateImg.url;
      this.previousItemevent = item.target;
      item.target.style.pointerEvents = "none";
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
    } else if (flag == "weekDays") {
      this.weekDaySelected = true;
      //this.dateSelected=false;
      //this.dateSelected=false;
      if (this.ArrweekDays.filter((item) => item.selected == true)[0] != undefined) {
        this.ArrweekDays.filter((item) => item.selected == true)[0].selected = false;
      }
      if (this.ArrweekDays.filter((item) => item.checkRightorWrong == true)[0] != undefined) {
        this.ArrweekDays.filter((item) => item.checkRightorWrong == true)[0].checkRightorWrong = false;
      }
      item.selected = true;
      if (this.feedbackObj.correct_weekDay != "") {
        if (item.id == this.feedbackObj.correct_weekDay) {
          this.isCorrectweekDay = true;
          item.checkRightorWrong = true;
          item.weekDayImginpopUp = item.rightweekDayImg;
        } else {
          this.isCorrectweekDay = false;
          item.checkRightorWrong = true;
          item.weekDayImginpopUp = item.wrongweekDayImg;
        }
      } else {
        if (this.clickedID != undefined) {
          this.date.setDate(this.clickedID);
          if (this.date.getDay() != 0) {
            var getDay = this.date.getDay() - 1;
          } else {
            var getDay = this.ArrweekDays.length - 1;
          }
          var copiedDate = new Date(this.date.getTime());
          if (this.feedbackObj.correct_month != "") {
            copiedDate.setMonth(this.monthsArr.findIndex((item) => item.id == this.feedbackObj.correct_month));
          }
          if (this.feedbackObj.correct_date != "") {
            copiedDate.setDate(this.feedbackObj.correct_date);
          }
          if (copiedDate.getDay() != 0) {
            var copiedgetDay = copiedDate.getDay() - 1;
          } else {
            var copiedgetDay = this.ArrweekDays.length - 1;
          }
          if ((this.ArrweekDays[getDay].id == item.id || this.ArrweekDays[copiedgetDay].id == item.id) && this.monthsArr[this.date.getMonth()].id == this.feedback.correct_month) {
            this.isCorrectweekDay = true;
            item.checkRightorWrong = true;
            item.weekDayImginpopUp = item.rightweekDayImg;
          } else if ((this.ArrweekDays[getDay].id == item.id || this.ArrweekDays[copiedgetDay].id == item.id) && this.feedback.correct_month == "") {
            this.isCorrectweekDay = true;
            item.checkRightorWrong = true;
            item.weekDayImginpopUp = item.rightweekDayImg;
          } else {
            this.isCorrectweekDay = false;
            item.checkRightorWrong = true;
            item.weekDayImginpopUp = item.wrongweekDayImg;
          }
        }
      }
    }
    if (this.yearSelected && this.dateSelected && this.weekDaySelected) {
      this.appModel.enableSubmitBtn(true);
    } else {
      this.appModel.enableSubmitBtn(false);
    }
    this.showCurrentMonthHolidays();
  }

  //set calendar with dates
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
      if (this.monthfromLocalMachine) {
        let monthInfo = this.monthsArr.filter((item) => item.checkRightorWrong == true)[0];
        if (monthInfo.id == this.feedbackObj.correct_month && this.feedbackObj.correct_month != "") {
          this.isCorrectMonth = true;
          monthInfo.ImginpopUp = monthInfo.rightmonthImg;
        } else if (this.feedbackObj.correct_month == "") {
          this.isCorrectMonth = true;
          monthInfo.ImginpopUp = monthInfo.selectedmonthImg;
        } else {
          this.isCorrectMonth = false;
          monthInfo.ImginpopUp = monthInfo.wrongmonthImg;
        }
      }
      if (this.yearfromLocalMachine) {
        let yearInfo = this.Arryears.filter((item) => item.checkRightorWrong == true)[0];
        if (yearInfo && yearInfo.id == this.feedbackObj.correct_year && this.feedbackObj.correct_year != "") {
          this.isCorrectYear = true;
          yearInfo.ImginpopUp = yearInfo.rightyearImg;
        } else if (this.feedbackObj.correct_year == "") {
          this.isCorrectYear = true;
          yearInfo.ImginpopUp = yearInfo.selectedyearsImg;
        } else {
          this.isCorrectYear = false;
          yearInfo.ImginpopUp = yearInfo.wrongyearImg;
        }
      }
      for (let i = 0; i < days; i++) {
        this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].id = i;
        this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].classList.value = "img-fluid";
        if (this.datesArr[i].disable) {
          this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].classList.value = "img-fluid disable-state";
        }
        //this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].src = this.datesArr[i].dateImg.location=="content" ? this.containgFolderPath +"/"+ this.datesArr[i].dateImg.url : this.assetsPath +"/"+ this.datesArr[i].dateImg.url;
        if (i + 1 == this.clickedID && this.clickedID == this.feedbackObj.correct_date) {
          if (this.isCorrectYear && this.isCorrectMonth && this.isCorrectDate && this.isCorrectweekDay) {
            this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].src = this.datesArr[i].rightdateImg.url;
          }
          else {
            this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].src = this.datesArr[i].wrongdateImg.url;
          }
          this.startIndex++;
          continue;
        } else {
          this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].src = this.datesArr[i].dateImg.url;
          //this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].src = this.datesArr[i].wrongdateImg.location=="content" ? this.containgFolderPath +"/"+ this.datesArr[i].wrongdateImg.url : this.assetsPath +"/"+ this.datesArr[i].wrongdateImg.url;
        }
        if (i == this.clickedID - 1 && this.clickedID != this.feedbackObj.correct_date) {
          this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].src = this.datesArr[i].wrongdateImg.url;
        } else {
          this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].src = this.datesArr[i].dateImg.url;
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
          this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].src = this.datesArr[i].rightdateImg.url;
          //this.startIndex++;
          //continue;
        } else {
          this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].src = this.datesArr[i].dateImg.url;
          //this.monthDatesinPopup.nativeElement.children[0].children[this.startIndex].src = this.datesArr[i].wrongdateImg.location=="content" ? this.containgFolderPath +"/"+ this.datesArr[i].wrongdateImg.url : this.assetsPath +"/"+ this.datesArr[i].wrongdateImg.url;
        }
        this.startIndex++;
      }
    }
    else {
      if (this.ArrweekDays.filter((item) => item.selected == true)[0] != undefined) {
        this.ArrweekDays.filter((item) => item.selected == true)[0].selected = false;
        this.weekDaySelected = false;
      }
      for (let i = 0; i < days; i++) {
        this.monthDates.nativeElement.children[0].children[this.startIndex].id = i;
        this.monthDates.nativeElement.children[0].children[this.startIndex].classList.value = "img-fluid";
        this.monthDates.nativeElement.children[0].children[this.startIndex].style.pointerEvents = "";
        if (this.datesArr[i].disable) {
          this.monthDates.nativeElement.children[0].children[this.startIndex].classList.value = "img-fluid disable-state";
        }
        this.monthDates.nativeElement.children[0].children[this.startIndex].src = this.datesArr[i].dateImg.url;
        this.startIndex++;
      }
    }
  }

  //set data that we get from content
  setData() {
    this.appModel.enableSubmitBtn(false);
    if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
      // let fetchedData: any = this.appModel.content.contentData.data;
      console.log(this.fetchedcontent);
      this.feedback = this.fetchedcontent.feedback;
      this.commonAssets = this.fetchedcontent.commonassets;
      let monthsArr = this.fetchedcontent.monthsArr;
      this.monthsArr = JSON.parse(JSON.stringify(monthsArr));
      let ArrweekDays = this.fetchedcontent.ArrweekDays;
      this.ArrweekDays = JSON.parse(JSON.stringify(ArrweekDays));
      let Arryears = this.fetchedcontent.Arryears;
      this.Arryears = JSON.parse(JSON.stringify(Arryears));
      let datesArr = this.fetchedcontent.datesArr;
      this.datesArr = JSON.parse(JSON.stringify(datesArr));
      this.narratorAudio = this.fetchedcontent.commonassets.narrator;
      //// this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
      this.ques_control = this.fetchedcontent.commonassets.ques_control;
      this.noOfImgs = this.commonAssets.imgCount;
      this.isFirstQues = this.commonAssets.isFirstQues;
      this.isLastQues = this.appModel.isLastSection;
      this.isLastQuesAct = this.appModel.isLastSectionInCollection;
      if (this.isLastQuesAct || this.isLastQues) {
        this.appModel.setlastQuesNT();
      }
      this.feedbackObj = this.fetchedcontent.feedback;
      this.confirmPopupAssets = this.fetchedcontent.feedback.confirm_popup;
      this.quesObj = this.fetchedcontent.quesObj[0];
      this.yearSelected = this.quesObj.yearSelected;
      this.monthSelected = this.quesObj.monthSelected;
      this.dateSelected = this.quesObj.dateSelected;
      this.weekDaySelected = this.quesObj.weekdaySelected;
      this.controlHandler = {
        isSubmitRequired: this.quesObj.submitRequired,
        isReplayRequired: this.quesObj.replayRequired
      }
      //var date = new Date();
      this.setDatefromJSON();
      if (this.quesObj.yearAdjustment) {
        this.setCorrectAnswer();
      }
      this.confirmSubmitAssets = this.fetchedcontent.submit_confirm;
      this.quesAudio = this.commonAssets.QuestionAudio;
      this.CorrectAudio = this.commonAssets.CorrectAudio;
      this.WrongAudio = this.commonAssets.WrongAudio;
      this.partiallyCorrectAudio = this.commonAssets.PartiallyCorrectAudio;
      this.getJson();
      setTimeout(() => {
        this.showCurrentMonthHolidays();
      }, 1000);

      if (this.quesObj.Ques_scenario && this.quesObj.Ques_scenario.type == "type_2") {
        this.getJson();
      } else if (this.quesObj.Ques_scenario && this.quesObj.Ques_scenario.type == "type_3") {
        this.QueScenarioData = this.quesObj.Ques_scenario.type_3;
        this.handleScenario(this.quesObj.Ques_scenario.type, this.QueScenarioData);
      } else if (this.quesObj.Ques_scenario && this.quesObj.Ques_scenario.type == "type_4") {
        this.handleScenario(this.quesObj.Ques_scenario.type, this.quesObj.Ques_scenario.type_4);
      } else if (this.quesObj.Ques_scenario && this.quesObj.Ques_scenario.type == "type_5") {
        this.handleScenario(this.quesObj.Ques_scenario.type, this.quesObj.Ques_scenario.type_5);
      }
      else if (this.quesObj.Ques_scenario && this.quesObj.Ques_scenario.type == "type_6") {
        this.handleScenario(this.quesObj.Ques_scenario.type, this.quesObj.Ques_scenario.type_6);
      }
      else if (this.quesObj.Ques_scenario && this.quesObj.Ques_scenario.type == "type_7") {
        this.handleScenario(this.quesObj.Ques_scenario.type, this.quesObj.Ques_scenario.type_7);
      }
    }
  }

  //Handling all special scenarios
  handleScenario(typ, qObj) {
    if (typ == "type_2") {
      console.log(qObj)
      if (qObj.year_type == "localMachine") {
        var Holiday_year = new Date().getFullYear() + Number(qObj.yearAdjustment);
        let holiday_obj = this.findHolidayInJsonTodisplay(qObj.holiday_id, Holiday_year)
        console.log(holiday_obj, "setFeedbacksetFeedback")
        this.setFeedback(holiday_obj)
      }
      else {
        if (qObj.year && qObj.year.length > 0) {
          let holiday_obj = this.findHolidayInJsonTodisplay(qObj.holiday_id, qObj.year)
          console.log(holiday_obj, "holiday_obj")
          this.setFeedback(holiday_obj)
        }
      }
    } else if (typ == "type_3") {
      let Day = this.QueScenarioData.day;
      let n = this.QueScenarioData.weekNumber;
      let Month = new Array();
      Month[0] = "January";
      Month[1] = "February";
      Month[2] = "March";
      Month[3] = "April";
      Month[4] = "May";
      Month[5] = "June";
      Month[6] = "July";
      Month[7] = "August";
      Month[8] = "September";
      Month[9] = "October";
      Month[10] = "November";
      Month[11] = "December";

      let DayName = new Array();
      DayName[0] = "Sunday";
      DayName[1] = "Monday";
      DayName[2] = "Tuesday";
      DayName[3] = "Wednesday";
      DayName[4] = "Thursday";
      DayName[5] = "Friday";
      DayName[5] = "Saturday";
      let date;

      if (this.QueScenarioData.year_type == "localMachineDate") {
        date = new Date();
        if (qObj.yearAdjustment && qObj.yearAdjustment.length) {
          date.setFullYear(Number(date.getFullYear()) + Number(qObj.yearAdjustment))
        }
        date.setMonth(this.QueScenarioData.month);

      } else {
        date = new Date();
        date.setYear(this.QueScenarioData.year);
        date.setMonth(this.QueScenarioData.month);

      }


      date.setDate(1)
      let currentDate = date.getDate();
      let currentWeekDay = date.getDay();
      let currentYear = date.getFullYear();
      let currentMonth = date.getMonth();
      let factor = Day - currentWeekDay;
      let dateArrayOfReqDay = [];
      currentDate = (currentDate + factor);

      for (currentDate; currentDate < 30; currentDate = currentDate + 7) {
        if (currentDate > 0 && currentDate < 30) {
          dateArrayOfReqDay.push(currentDate)
        }
      }

      // dateArrayOfReqDay.sort(function(a, b){return a - b})
      console.log(dateArrayOfReqDay, 'dateArrayOfReqDay');
      let Year = currentYear;
      let month = Month[currentMonth];
      let day = DayName[Day];
      let AnsDate = dateArrayOfReqDay[n - 1];

      let feedbackObj = {};
      feedbackObj['year'] = Year;
      feedbackObj['month_name'] = month;
      feedbackObj['day'] = day;
      feedbackObj['date'] = AnsDate;
      this.setFeedback(feedbackObj);
    }
    else if (typ == "type_4") {
      //leap year type, cal
      this.feedbackObj.correct_year = ""
      this.feedbackObj.correct_month = ""
      this.feedbackObj.correct_weekDay = ""
      this.feedbackObj.correct_date = ""
      console.log('qobj', qObj)
      let leapYear = [];
      this.Arryears.forEach(element => {
        let year = element.id;
        if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
          leapYear.push(year)
        }
      });
      console.log('leapYear', leapYear);
      if (qObj.graterThn && qObj.graterThn.length) {
        if (qObj.graterThn == "localMachineDate") {
          qObj.graterThn = (new Date().getFullYear()).toString();
        }
        leapYear.forEach(element => {
          if (element > qObj.graterThn) {
            this.feedbackObj.correct_year = element
          }
        });
      }
      else if (qObj.lessThn && qObj.lessThn.length) {
        if (qObj.lessThn == "localMachineDate") {
          qObj.lessThn = new Date().getFullYear().toString();;
        }
        leapYear.forEach(element => {
          if (element < qObj.lessThn) {
            this.feedbackObj.correct_year = element
          }
        });

      }
      else {
        this.feedbackObj.correct_year = leapYear[0];

      }
    }
    else if (typ == "type_5") {
      //for fixed type date
      let date = new Date();
      let after_days = qObj.after_days
      if (qObj.year !== "localMachine") {
        date.setFullYear(qObj.year);
      }
      if (qObj.year == "localMachine") {
        let y = date.getFullYear();
        if (qObj.yearAdjustment && qObj.yearAdjustment != "") {
          date.setFullYear(Number(y) + Number(qObj.yearAdjustment));
        }
      }
      //set month
      if (qObj.month !== "localMachine") {
        date.setMonth(qObj.month)
      }
      if (qObj.month == "localMachine") {
        if (qObj.monthAdjustment && qObj.monthAdjustment != "") {
          date.setMonth(date.getMonth() + Number(qObj.monthAdjustment))
        }
      }
      if (qObj.date !== "localMachine") {
        date.setDate(Number(qObj.date) + Number(after_days));
      }
      else {
        if (qObj.dateAdjustment && qObj.dateAdjustment != "") {
          date.setDate(Number(date.getDate()) + Number(qObj.dateAdjustment))
        }
        date.setDate(Number(date.getDate()) + Number(after_days));
      }
      console.log(date, "type_5_date")

      let Year = date.getFullYear();
      let month = this.MonthNames[date.getMonth()];
      let day = this.DayNames[date.getDay()];
      let AnsDate = date.getDate();

      let feedbackObj = {};
      feedbackObj['year'] = Year;
      feedbackObj['month_name'] = month;
      feedbackObj['day'] = day;
      feedbackObj['date'] = AnsDate;
      this.setFeedback(feedbackObj);
    }
    else if (typ == "type_6") {
      let date = new Date();
      if (qObj.yearAdjustment && qObj.yearAdjustment != "") {
        let y = date.getFullYear();
        date.setFullYear(Number(y) + Number(qObj.yearAdjustment));
      }

      //set month

      if (qObj.monthAdjustment && qObj.monthAdjustment != "") {
        date.setMonth(date.getMonth() + Number(qObj.monthAdjustment))
      }

      //set date

      if (qObj.dateAdjustment && qObj.dateAdjustment != "") {
        date.setDate(Number(date.getDate()) + Number(qObj.dateAdjustment))
      }

      console.log(date, "type_5_date")

      let Year = date.getFullYear();
      let month = this.MonthNames[date.getMonth()];
      let day = this.DayNames[date.getDay()];
      let AnsDate = date.getDate();

      let feedbackObj = {};
      feedbackObj['year'] = Year;
      feedbackObj['month_name'] = month;
      feedbackObj['day'] = day;
      feedbackObj['date'] = AnsDate;
      this.setFeedback(feedbackObj);
    }
    else if (typ == "type_7") {
      //to find next month with 31/30 days
      this.feedbackObj.correct_year = ""
      this.feedbackObj.correct_month = ""
      this.feedbackObj.correct_weekDay = ""
      this.feedbackObj.correct_date = ""
      let currentMonth = new Date().getMonth();
      let c1 = currentMonth + 1;
      let c2 = currentMonth + 2;
      if (c1 > 11) {
        c1 = c1 - 12
      }
      if (c2 > 11) {
        c2 = c2 - 12
      }
      let monthWith30Days = [3, 5, 8, 10];
      let monthWith31Days = [0, 2, 4, 6, 7, 9, 11];
      let arrTopick = (qObj.findNextMonths == "30") ? monthWith30Days : monthWith31Days;

      if (arrTopick.indexOf(c1) > -1) {
        console.log("ans is c1")
        this.feedbackObj.correct_month = this.MonthNames[c1]
      }
      if (arrTopick.indexOf(c2) > -1) {
        console.log("ans is c2")
        this.feedbackObj.correct_month = this.MonthNames[c2]
      }
    }
  }

  //setting answer
  setFeedback(holiday_obj) {
    if (!this.yearSelected) {
      this.feedbackObj.correct_year = holiday_obj.year
    }
    if (!this.monthSelected) {
      this.feedbackObj.correct_month = holiday_obj.month_name
    }
    if (!this.weekDaySelected) {
      this.feedbackObj.correct_weekDay = holiday_obj.day
    }
    if (!this.dateSelected)
      this.feedbackObj.correct_date = holiday_obj.date
  }

  getBasePath() {
    if (this.appModel && this.appModel.content) {
      return this.appModel.content.id + '';
    }
  }
  
  //setting audio feedback
  playFeedback() {
    if (this.isCorrectMonth && this.isCorrectYear && this.isCorrectweekDay && this.isCorrectDate) {
      //fully correct
      this.checked = true;
      this.feedbackPopupAudio.nativeElement.src = this.commonAssets.CorrectAudio.url;
      this.feedbackPopupAudio.nativeElement.load();
      this.feedbackPopupAudio.nativeElement.play();
      this.feedbackPopupAudio.nativeElement.onended = () => {
        //this.closeModal();
        this.optionsBlock.nativeElement.style.opacity = "0.3"
        this.optionsBlock.nativeElement.classList = "row mx-0 disable_div"
        this.instructionBar.nativeElement.style.opacity = "0.3"
        this.instructionBar.nativeElement.classList = "instructionBase disable_div";
        this.appModel.enableSubmitBtn(false);
        //this.appModel.handlePostVOActivity(true);
      }
    } else {
      //fully incorrect
      this.feedbackPopupAudio.nativeElement.src = this.commonAssets.WrongAudio.url;
      this.feedbackPopupAudio.nativeElement.load();
      this.feedbackPopupAudio.nativeElement.play();
      this.feedbackPopupAudio.nativeElement.onended = () => {
        //this.closeModal();
        //this.resetActivity();
      }
    }
  }

  //show ans feedback
  showAnswerFeedback() {
    this.appModel.resetBlinkingTimer();
    if (this.feedbackObj.correct_month != "") {
      this.date.setDate(this.feedbackObj.correct_date);
      //let indexofRightdate = this.datesArr.findIndex((item)=> item.id == this.feedbackObj.correct_date);
      if (this.monthsArr.filter((item) => item.selected == true)[0] != undefined) {
        this.monthsArr.filter((item) => item.selected == true)[0].selected = false;
        this.monthsArr.filter((item) => item.checkRightorWrong == true)[0].checkRightorWrong = false;
      }
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


  //for handling different pop-up events
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
      this.rightanspopUpheader_img = false;
      this.wronganspopUpheader_img = false;
      this.showanspopUpheader_img = true;
      this.partialCorrectheaderTxt_img = false;
      this.popupHeader = this.feedbackObj.showAnswerpopupTxt.url;
      this.checked = true;
      this.attemptType = "auto";
      this.confirmModalRef.nativeElement.classList = "modal";
      this.showAnswerFeedback();
      this.styleHeaderPopup = this.feedbackObj.style_header;
      this.styleBodyPopup = this.feedbackObj.style_body;
      this.popupRef.nativeElement.classList = "displayPopup modal";
      this.appModel.notifyUserAction();
      this.feedbackPopupAudio.nativeElement.src = this.commonAssets.showAnsAudio.url;
      this.feedbackPopupAudio.nativeElement.load();
      this.feedbackPopupAudio.nativeElement.play();
      this.feedbackPopupAudio.nativeElement.onended = () => {
        //this.closeModal();
      }
      this.optionsBlock.nativeElement.style.opacity = "0.3"
      this.optionsBlock.nativeElement.classList = "row mx-0 disable_div"
      this.instructionBar.nativeElement.style.opacity = "0.3"
      this.instructionBar.nativeElement.classList = "instructionBase disable_div";
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
        this.rightanspopUpheader_img = false;
        this.wronganspopUpheader_img = false;
        this.showanspopUpheader_img = true;
        this.partialCorrectheaderTxt_img = false;
        this.styleHeaderPopup = this.feedbackObj.style_header;
        this.styleBodyPopup = this.feedbackObj.style_body;
        if (this.feedbackObj.rightAnswerpopupTxt.required) {
          this.AnswerpopupTxt = true;
          this.popupHeader = this.feedbackObj.rightAnswerpopupTxt.url;

        } else {
          this.AnswerpopupTxt = false;
        }
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
        if (this.feedbackObj.wrongAnswerpopupTxt.required) {
          this.AnswerpopupTxt = true;
          this.popupHeader = this.feedbackObj.wrongAnswerpopupTxt.url;

        } else {
          this.AnswerpopupTxt = false;

        }
        this.rightanspopUpheader_img = false;
        this.wronganspopUpheader_img = true;
        this.showanspopUpheader_img = false;
        this.partialCorrectheaderTxt_img = false;
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

  // on diff modal cloase event
  closeModal() {
    if (!this.feedbackPopupAudio.nativeElement.paused) {
      this.feedbackPopupAudio.nativeElement.pause();
      this.feedbackPopupAudio.nativeElement.currentTime = 0;
    }
    //this.showAnswerRef.nativeElement.classList="modal";
    this.popupRef.nativeElement.classList = "modal";
    //this.appModel.notifyUserAction();
    if (this.checked) {
      this.blinkOnLastQues();
      this.optionsBlock.nativeElement.classList = "row mx-0 disable_div"
      this.optionsBlock.nativeElement.style.opacity = "0.3"
      this.instructionBar.nativeElement.style.opacity = "0.3"
      this.instructionBar.nativeElement.classList = "instructionBase disable_div";
      this.appModel.enableSubmitBtn(false);
    }
    if (!this.checked) {
      //this.resetActivity();
      this.appModel.wrongAttemptAnimation();
      setTimeout(() => {
        // $("#instructionBar").removeClass("disable_div");
      }, 1000);
    }
  }
}


