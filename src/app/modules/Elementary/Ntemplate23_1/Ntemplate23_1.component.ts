import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewChecked, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { ThemeConstants } from '../../../common/themeconstants';
import { Subscription } from 'rxjs';
import { SharedserviceService } from '../../../common/services/sharedservice.service';
import { timer } from 'rxjs/observable/timer';
import { take } from 'rxjs/operators';

@Component({
  selector: 'Ntemplate23_1',
  templateUrl: './Ntemplate23_1.component.html',
  styleUrls: ['./Ntemplate23_1.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class Ntemplate23V1Component implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild("optionsBlock") optionsBlock: any;
  @ViewChild('narrator') narrator: any;
  @ViewChild('instruction') instruction: any;
  @ViewChild('confirmModalRef') confirmModalRef: any;
  @ViewChild('popupRef') popupRef: any;
  @ViewChild('quesRef') QuesRef: any;
  @ViewChild('feedbackPopupAudio') feedbackPopupAudio: any;
  @ViewChild('infoModalRef') infoModalRef: any;
  @ViewChild('feedbackInfoAudio') feedbackInfoAudio: any;

  commonAssets: any = "";
  checked: boolean = false;
  isFirstQues: boolean;
  isLastQues: boolean = false;
  isLastQuesAct: boolean;
  /*Start: Theme Implementation(Template Changes)*/
  controlHandler = {
    isSubmitRequired: true,
    isReplayRequired: false
  };
  themePath: any;
  fetchedcontent: any;
  functionalityType: any;
  showAnsTimeout: number;
  /*END: Theme Implementation(Template Changes)*/

  loaderTimer: any;
  disableHelpBtn: boolean = false;
  containgFolderPath: string = "";
  assetsPath: string = "";
  loadFlag: boolean = false;
  optionObj: any;
  optionCommonAssets: any;
  feedbackObj: any;
  confirmPopupAssets: any;
  noOfRightAns: any;
  rightAnspopupAssets: any;
  tempSubscription: Subscription;
  mainSvgfile: any = "";
  Id: any;
  mySVGArr: any = [];
  submitFlag = true;
  quesAudio: any;
  rightAnswerCounter: number = 0;
  wrongAnswerCounter: number = 0;
  confirmSubmitAssets: any;
  infoPopupAssets: any;
  clickedId: string;
  categoryIndex: number;
  originalcolor: any = [];
  submittedArray: any = [];
  tempObj: any = {};
  p: number = 1;
  paginationArray: any = [];
  countofClick: number = 0;
  selectedCategoryinTooltip: any;
  showAnswerarray: any = [];
  copiedCategories: any = [];
  attemptType: string = "";
  styleHeaderPopup: any;
  styleBodyPopup: any;
  popupType: any = "";
  optionSelected: any;
  singleClicknotAllowed: boolean = false;
  listCategoryHeader: any;
  listSubCategoryHeader: any;
  DropDownTitleUpper: any;
  DropDownTitleLower: any;
  feedbackArr: any = [];
  currentPageNo: number = 1;
  endPage: boolean = false;
  endPageNo: number = Infinity;
  pageNo: number = 1;
  isShowAnsOpen: boolean = false;
  outOfScopeArr: any = [];
  correctIncorrectArr: any = [];
  noOfPages: number = 1;
  nextBtnInterval: any;
  timerFeedback: any;
  nextFeedbackTimer: any;
  closeFeedback: any;
  closeFeedbackmodalTimer: any;
  instructionDisable: boolean = true;
  bodyContentOpacity: boolean = false;
  bodyContentDisable: boolean = true;
  instructionOpacity: boolean = false;
  instructionVODelay: any;
  isReviewPopupOpen: boolean = false;
  confirmPopupSubscription: any;
  fileLoadSubscription: any;
  showAnsTimeoutSubscription: any;
  nextBtnSubscription: any;
  postWrongAttemptSubscription: any;
  timerSubscription: Subscription;
  isLastQuestion: boolean;
  actComplete : boolean = false;

  constructor(private appModel: ApplicationmodelService, private Sharedservice: SharedserviceService) {
    this.appModel = appModel;
    this.assetsPath = this.appModel.assetsfolderpath;
    this.appModel.navShow = 2;
    this.appModel.setLoader(true);
    // if error occured during image loading loader wil stop after 5 seconds 
    this.loaderTimer = setTimeout(() => {
      this.appModel.setLoader(false);
    }, 5000);
  }

  ngOnInit() {
    this.containgFolderPath = this.getBasePath();
    /*Start: Theme Implementation(Template Changes)*/
    let fetchedData: any = this.appModel.content.contentData.data;
    this.fetchedcontent = JSON.parse(JSON.stringify(fetchedData));;
    this.functionalityType = this.appModel.content.contentLogic.functionalityType;
    this.themePath = ThemeConstants.THEME_PATH + this.fetchedcontent.productType + '/' + this.fetchedcontent.theme_name;
    this.Sharedservice.imagePath(this.fetchedcontent, this.containgFolderPath, this.themePath, undefined);
    this.checkquesTab();
    this.showAnsTimeoutSubscription = this.appModel.globalJsonData.subscribe(data => {
      this.showAnsTimeout = data.showAnsTimeout;
    });
    /*End: Theme Implementation(Template Changes)*/
    this.setData();
    this.appModel.notifyUserAction();
    this.getFileLoaded(this.mainSvgfile);
    if (this.appModel.isNewCollection) {
      this.appModel.event = { 'action': 'segmentBegins' };
    }

    this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
      if (mode == "manual") {
        //show modal for manual
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          this.instructionDisable = true;
          console.log("No-1");
        }
      } else if (mode == "auto") {
        this.checked = true;
        this.attemptType = "auto";
        //show modal of auto
        this.closeModal();
        this.isShowAnsOpen = true;
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          this.instructionDisable = true;
          document.getElementById("dropdown").children[2].classList.remove("show");
          this.showAnswerFeedback();
          this.popupRef.nativeElement.classList = "displayPopup modal";
          this.popupType = "showanswer";
          this.setPopupAssets();
          this.appModel.stopAllTimer();
          this.playShowAnswerFeedback();
          this.bodyContentOpacity = true;
          this.instructionOpacity = true;
          this.bodyContentDisable = true;
          this.instructionDisable = true;
        }
      }
    })

    this.confirmPopupSubscription = this.appModel.getConfirmationPopup().subscribe((val) => {
      if (!this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.pause();
      }
      if (val == "uttarDikhayein") {
        if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
          this.confirmModalRef.nativeElement.classList = "displayPopup modal";
          this.appModel.notifyUserAction();
          this.popupType = "showanswer";
          this.setPopupAssets();
          this.checkForAutoClose();
        }
      } else if (val == "submitAnswer") {
        if (this.popupRef && this.popupRef.nativeElement) {
          this.appModel.stopAllTimer();
          this.isReviewPopupOpen = true;
          this.popupType = "review";
          this.onSubmit();
          this.appModel.feedbackType = "review";
          this.styleHeaderPopup = this.feedbackObj.review_style_header;
          this.styleBodyPopup = this.feedbackObj.review_style_body;
          this.feedbackObj.feedback_title = this.feedbackObj.review_style_title;
          if (this.currentPageNo === 1) {
            this.feedbackArr = this.paginationArray.slice(0, this.commonAssets.itemsperPage);
          }
          this.popupRef.nativeElement.classList = "displayPopup modal modalReviewTemp23";
          this.setReviewPopup();
          this.appModel.notifyUserAction();
        }
      }
    })

    this.nextBtnSubscription = this.appModel.nextBtnEvent().subscribe(() => {
      if (this.appModel.isLastSectionInCollection) {
        this.appModel.event = { 'action': 'segmentEnds' };
      }
      if (this.appModel.isLastSection) {
        this.appModel.event = { 'action': 'exit' };
      }
    });

    this.postWrongAttemptSubscription = this.appModel.postWrongAttempt.subscribe(() => {
      this.appModel.handlePostVOActivity(false);
      this.appModel.notifyUserAction();
    });
    this.appModel.handleController(this.controlHandler);
    this.appModel.resetBlinkingTimer();
  }

  ngAfterViewChecked() {
    this.appModel.templatevolume(this.appModel.volumeValue, this);
  }

  ngOnDestroy() {
    clearTimeout(this.loaderTimer);	
    clearTimeout(this.nextFeedbackTimer);	
    clearTimeout(this.closeFeedbackmodalTimer);	
    clearInterval(this.nextBtnInterval);
    this.nextBtnInterval = undefined;
    clearTimeout(this.instructionVODelay);
    if (this.confirmPopupSubscription != undefined) {
      this.confirmPopupSubscription.unsubscribe();
    }
    if (this.tempSubscription != undefined) {
      this.tempSubscription.unsubscribe();
    }
    if (this.fileLoadSubscription != undefined) {
      this.fileLoadSubscription.unsubscribe();
    }
    if (this.showAnsTimeoutSubscription != undefined) {
      this.showAnsTimeoutSubscription.unsubscribe();
    }
    if (this.postWrongAttemptSubscription != undefined) {
      this.postWrongAttemptSubscription.unsubscribe();
    }
    if (this.nextBtnSubscription != undefined) {
      this.nextBtnSubscription.unsubscribe();
    }
  }

  checkForAutoClose() {
    if (this.confirmModalRef.nativeElement.classList.contains("displayPopup")) {
      if (this.isLastQuestion && this.actComplete) {
        this.resetTimerForAutoClose();
      } else {
        if (this.timerSubscription != undefined) {
          this.timerSubscription.unsubscribe();
        }
      }
    }
  }

  resetTimerForAutoClose() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.appModel.stopAllTimer();
    const interval = 1000;
    const closeConfirmInterval = 2 * 60;
    this.timerSubscription = timer(0, interval).pipe(
      take(closeConfirmInterval)
    ).subscribe(value =>
      this.removeSubscription((closeConfirmInterval - +value) * interval),
      err => {
        //console.log("error occuered....");
      },
      () => {
        this.showFeedback('showAnswer-modal-id','no');
        this.timerSubscription.unsubscribe();
      }
    )
  }
  removeSubscription(timer) {
    console.log("waiting for autoClose", timer / 1000);
  }

  /****** Mouse hover on SVG image ******/
  MouseOver(event) {
    this.Id = event.target.getAttribute('xlink:href');
    console.log("this.Id = " + this.Id);
    if (this.Id == null) {
      if (this.categoryIndex != undefined && this.mySVGArr[this.categoryIndex] != undefined && !this.mySVGArr[this.categoryIndex].clicked) {
        for (let i = 0; i < document.querySelector(this.QuesRef.nativeElement.children[1].children[this.categoryIndex + 1].children[0].children[0].getAttribute("xlink:href")).children.length; i++) {
          document.querySelector(this.QuesRef.nativeElement.children[1].children[this.categoryIndex + 1].children[0].children[0].getAttribute("xlink:href")).children[i].setAttribute("fill", this.originalcolor[this.categoryIndex]);
        }
      }
    }
    let idFound = this.mySVGArr.find(element => element.id == this.Id || element.strokeId == this.Id);
    if (idFound && !idFound.clicked) {
      this.appModel.notifyUserAction();
      if (!this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.pause();
        this.instructionDisable = false;
      }
      if (this.originalcolor.length > 0 && this.mySVGArr[this.categoryIndex] != undefined && !this.mySVGArr[this.categoryIndex].clicked) {
        for (let i = 0; i < document.querySelector(this.QuesRef.nativeElement.children[1].children[this.categoryIndex + 1].children[0].children[0].getAttribute("xlink:href")).children.length; i++) {
          document.querySelector(this.QuesRef.nativeElement.children[1].children[this.categoryIndex + 1].children[0].children[0].getAttribute("xlink:href")).children[i].setAttribute("fill", this.originalcolor[this.categoryIndex]);
        }
      }
      this.categoryIndex = this.mySVGArr.findIndex(element => element.id == this.Id || element.strokeId == this.Id);
      if (this.categoryIndex != -1) {
        for (let i = 0; i < document.querySelector(this.QuesRef.nativeElement.children[1].children[this.categoryIndex + 1].children[0].children[0].getAttribute("xlink:href")).children.length; i++) {
          document.querySelector(this.QuesRef.nativeElement.children[1].children[this.categoryIndex + 1].children[0].children[0].getAttribute("xlink:href")).children[i].setAttribute("fill", this.mainSvgfile.hoverColor);
          document.querySelector(this.QuesRef.nativeElement.children[1].children[this.categoryIndex + 1].children[0].children[0].getAttribute("xlink:href")).children[i].style.cursor = "pointer";
        }
      }
    }
  }

  /****** Mouse out on SVG image ******/
  MouseOut(event) {
    if (this.categoryIndex != undefined && this.mySVGArr[this.categoryIndex] != undefined && !this.mySVGArr[this.categoryIndex].clicked) {
      for (let i = 0; i < document.querySelector(this.QuesRef.nativeElement.children[1].children[this.categoryIndex + 1].children[0].children[0].getAttribute("xlink:href")).children.length; i++) {
        document.querySelector(this.QuesRef.nativeElement.children[1].children[this.categoryIndex + 1].children[0].children[0].getAttribute("xlink:href")).children[i].setAttribute("fill", this.originalcolor[this.categoryIndex]);
      }
    }
  }

  /****** function call on tooltip close btn click ******/
  onTooltipclick() {
    console.log("tooltip closed");
    this.appModel.notifyUserAction();	
    if (!this.instruction.nativeElement.paused) {	
      this.instruction.nativeElement.pause();	
      this.instructionDisable = false;	
    }
    this.appModel.enableSubmitBtn(true);
    document.getElementById('dropdownviaTooltip').style.opacity = "0";
    document.getElementById('dropdownviaTooltip').style.left = "0%";
    document.getElementById('dropdownviaTooltip').style.top = "0%";
    document.getElementById("dropdownviaTooltip").style.pointerEvents = "none";
  }

  /****** function call on SVG image click ******/
  onClick(event) {
    if (!this.singleClicknotAllowed) {
      if (this.categoryIndex != undefined && this.mySVGArr[this.categoryIndex] != undefined && !this.mySVGArr[this.categoryIndex].clicked) {
        for (let i = 0; i < document.querySelector(this.QuesRef.nativeElement.children[1].children[this.categoryIndex + 1].children[0].children[0].getAttribute("xlink:href")).children.length; i++) {
          document.querySelector(this.QuesRef.nativeElement.children[1].children[this.categoryIndex + 1].children[0].children[0].getAttribute("xlink:href")).children[i].setAttribute("fill", this.originalcolor[this.categoryIndex]);
        }
      }
      this.clickedId = event.target.getAttribute('xlink:href');
      console.log("this.Id = " + this.clickedId);
      let idFound = this.mySVGArr.find(element => element.id == this.clickedId || element.strokeId == this.clickedId);
      if (idFound != undefined) {
        this.optionSelected = idFound.optionSelected;
        this.appModel.enableSubmitBtn(false);
      }
      this.categoryIndex = this.mySVGArr.findIndex(element => element.id == this.clickedId || element.strokeId == this.clickedId);
      if (idFound && !idFound.clicked) {
        this.appModel.notifyUserAction();
        this.countofClick++;
        document.getElementById("dropdown").style.opacity = "1";
        document.getElementById("dropdown").style.pointerEvents = "";
        document.getElementById('dropdownviaTooltip').style.opacity = "0";
        document.getElementById('dropdownviaTooltip').style.left = "0%";
        document.getElementById('dropdownviaTooltip').style.top = "0%";
        document.getElementById("dropdownviaTooltip").style.pointerEvents = "none";
        idFound.clicked = true;
        this.submittedArray.push(idFound);
        this.tempObj = {};
        this.tempObj.id = this.categoryIndex;
        this.tempObj.clickedId = this.clickedId;
        this.tempObj.category = idFound.categoryTxtimg;
        this.checkCategoryStatus(idFound);
        this.paginationArray.push(this.tempObj);
        if (this.countofClick > this.commonAssets.itemsperPage) {
          this.countofClick = 1;
          this.p++;
        }
        document.getElementById("tooltip" + (this.categoryIndex + 1)).classList.remove("tooltipHidden");
        document.getElementById("tooltip" + (this.categoryIndex + 1)).classList.add("tooltipshow");
        document.getElementById("tooltip" + (this.categoryIndex + 1)).style.pointerEvents = "none";
        document.getElementById("tooltip" + (this.categoryIndex + 1)).style.left = this.mySVGArr[this.categoryIndex].left + "%";
        document.getElementById("tooltip" + (this.categoryIndex + 1)).style.top = this.mySVGArr[this.categoryIndex].top + "%";
        for (let i = 0; i < document.querySelector(this.QuesRef.nativeElement.children[1].children[this.categoryIndex + 1].children[0].children[0].getAttribute("xlink:href")).children.length; i++) {
          document.querySelector(this.QuesRef.nativeElement.children[1].children[this.categoryIndex + 1].children[0].children[0].getAttribute("xlink:href")).children[i].setAttribute("fill", idFound.onclickColor);
          document.querySelector(this.QuesRef.nativeElement.children[1].children[this.categoryIndex + 1].children[0].children[0].getAttribute("xlink:href")).children[i].style.cursor = "";
        }
        document.getElementById('dropdown').style.pointerEvents = "";
        document.getElementById("dropdown").classList.remove("dropdownhidden");
        var statebound = document.getElementById("dropdown").children[0].getBoundingClientRect();
        let containerRef = document.getElementById("container");
        var stateboundX = statebound.left / (containerRef.clientWidth / 0.8) * 100;
        var stateboundY = statebound.top / (containerRef.clientHeight * 1.1) * 100;
        document.getElementById("line0").setAttribute("x1", (stateboundX * 1 + 2) + "%");
        document.getElementById("line0").setAttribute("y1", stateboundY * 0.8 + "%");
        document.getElementById("line0").setAttribute("x2", parseFloat(this.mySVGArr[this.categoryIndex].left + 0.6) + "%");	
        document.getElementById("line0").setAttribute("y2", parseFloat(this.mySVGArr[this.categoryIndex].top) + "%");
        document.getElementById("line0").style.opacity = "1";
        for (let i = 0; i < document.getElementById("mainques").children[1].children.length; i++) {
          if (i != (this.categoryIndex + 1)) {
            (document.getElementById("mainques").children[1].children[i] as HTMLElement).style.pointerEvents = "none";
          } else {
            this.singleClicknotAllowed = true;
          }
        }
      } else {
        if (idFound != undefined) {
          console.log("new dropdown will open");
          this.appModel.enableSubmitBtn(false);
          this.selectedCategoryinTooltip = this.commonAssets.isCategoryBased ? idFound.categoryName : idFound.textField;
          document.getElementById('dropdownviaTooltip').style.pointerEvents = "";
          document.getElementById('dropdownviaTooltip').style.opacity = "1";
          document.getElementById('dropdown').style.pointerEvents = "none";
          document.getElementById('dropdownviaTooltip').style.left = this.mySVGArr[this.categoryIndex].ddTooltipleft + "%";
          document.getElementById('dropdownviaTooltip').style.top = this.mySVGArr[this.categoryIndex].ddTooltiptop + "%";
        }
      }
    }
  }

  /******** Function call on double click on SVG ********/	
  ondropdownClick() {	
    if (!this.instruction.nativeElement.paused) {	
      this.instruction.nativeElement.pause();	
      this.instructionDisable = false;	
    }	
  }

  /******** Function call on double click on SVG ********/
  ondblClick(event) {
    this.Id = event.target.getAttribute('xlink:href');
    console.log("this.Id = " + this.Id);
    if (this.Id != null) {
      document.getElementById('dropdownviaTooltip').style.pointerEvents = "none";
      document.getElementById('dropdownviaTooltip').style.opacity = "0";
      document.getElementById('dropdownviaTooltip').style.left = "0%";
      document.getElementById('dropdownviaTooltip').style.top = "0%";
      document.getElementById("tooltip" + (this.categoryIndex + 1)).classList.remove("tooltipshow");
      document.getElementById("tooltip" + (this.categoryIndex + 1)).classList.add("tooltipHidden");
      let idFound = this.mySVGArr.find(element => element.id == this.Id || element.strokeId == this.Id);
      this.categoryIndex = this.mySVGArr.findIndex(element => element.id == this.Id || element.strokeId == this.Id);
      if (this.categoryIndex != -1) {
        document.getElementById("line0").style.opacity = "0";
        document.getElementById("dropdown").style.opacity = "0";
        document.getElementById("dropdown").style.pointerEvents = "none";
        for (let i = 0; i < document.getElementById("mainques").children[1].children.length; i++) {
          if (i != (this.categoryIndex + 1)) {
            (document.getElementById("mainques").children[1].children[i] as HTMLElement).style.pointerEvents = "";
          }
        }
        this.singleClicknotAllowed = false;
      }
      if (idFound) {
        this.countofClick--;
        for (let i = 0; i < document.querySelector(this.QuesRef.nativeElement.children[1].children[this.categoryIndex + 1].children[0].children[0].getAttribute("xlink:href")).children.length; i++) {
          if(this.originalcolor && this.originalcolor[this.categoryIndex]) {
            document.querySelector(this.QuesRef.nativeElement.children[1].children[this.categoryIndex + 1].children[0].children[0].getAttribute("xlink:href")).children[i].setAttribute("fill", this.originalcolor[this.categoryIndex]);
          }
        }
        idFound.clicked = false;
      }
      let indexinSubmitArr = this.submittedArray.findIndex(element => element.id == this.Id || element.strokeId == this.Id);
      if (indexinSubmitArr != -1) {
        this.submittedArray.splice(indexinSubmitArr, 1);
        this.paginationArray.splice(indexinSubmitArr, 1);
        if (this.paginationArray.length == 0) {
          this.appModel.enableSubmitBtn(false);
        } else {
          this.appModel.enableSubmitBtn(true);
        }
        if (this.countofClick == 0 && this.countofClick < this.commonAssets.itemsperPage) {
          this.countofClick = 12;
          this.p--;
        }
      }
      let correctIncorrectIndex = this.correctIncorrectArr.findIndex(element => element.clickedId == this.Id);	
      let outOfScopeIndex = this.outOfScopeArr.findIndex(element => element.clickedId == this.Id);	
      if(correctIncorrectIndex > -1) {	
        this.correctIncorrectArr.splice(correctIncorrectIndex, 1);	
      } else if(outOfScopeIndex > -1) {	
        this.outOfScopeArr.splice(outOfScopeIndex, 1);	
      }
    }
  }

  /****** Play Instruction VO on click on Instruction text ******/
  playHoverInstruction() {
    if (!this.narrator.nativeElement.paused) {
      console.log("narrator/instruction voice still playing");
    } else {
      console.log("play on Instruction");
      this.instruction.nativeElement.load();
      if (this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.appModel.notifyUserAction();
        this.instructionDisable = true;
        this.instruction.nativeElement.play();
        this.instruction.nativeElement.onended = () => {
          this.instructionDisable = false;
        }
      }
    }
  }

  /****** blink functionality on last question ******/
  blinkOnLastQues() {
    this.actComplete = true;
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

  /******** Function call to differentiate correct and incorrect category ********/
  checkCategoryStatus(category) {
    if (this.feedbackObj.correct_category.includes(category.textField)) {
      this.tempObj.categoryStatus = category.correctCategoryTxtimg;
      this.tempObj.subCatOfSelectedCategory = category.subCategory;
      this.tempObj.imgSubCatOfSelectedCategory = category.correctSubCategoryTxtimg;
      this.tempObj.isCategoryCorrect = true;
    } else {
      this.tempObj.categoryStatus = category.incorrectCategoryTxtimg;
      this.tempObj.subCatOfSelectedCategory = category.subCategory;
      this.tempObj.imgSubCatOfSelectedCategory = category.incorrectSubCategoryTxtimg;
      this.tempObj.isCategoryCorrect = false;
    }
  }

  /******** Function call to setup subcategory on basis of category selection ********/
  checkSubCategoryStatus(index) {
    if (this.paginationArray[index].isCategoryCorrect && this.paginationArray[index].subCatOfSelectedCategory !== this.paginationArray[index].subCategory) {
      console.log("incorrect capital");
      this.paginationArray[index].isSubCategorycorrect = false;
      this.paginationArray[index].subCategoryStatus = this.mySVGArr.find(element => element.subCategory == this.paginationArray[index].subCategory).incorrectSubCategoryTxtimg;
      let tempObjIndex = this.correctIncorrectArr.findIndex(element => element.id == this.paginationArray[index].id);
      if (tempObjIndex > -1) {
        this.correctIncorrectArr[tempObjIndex] = this.paginationArray[index];
      } else {
        this.correctIncorrectArr.push(this.paginationArray[index]);
      }

    } else if (!this.paginationArray[index].isCategoryCorrect && this.paginationArray[index].subCatOfSelectedCategory === this.paginationArray[index].subCategory) {
      console.log("out of scope correct ");
      this.paginationArray[index].isSubCategorycorrect = true;
      this.paginationArray[index].subCategoryStatus = this.mySVGArr.find(element => element.subCategory == this.paginationArray[index].subCatOfSelectedCategory).correctSubCategoryTxtimg;
      this.paginationArray[index]["isOutOfScopeAndCorrect"] = true;
      let idFound = this.mySVGArr.find(element => element.id == this.clickedId || element.strokeId == this.clickedId);
      this.paginationArray[index].categoryStatus = idFound.correctCategoryTxtimg;
      let tempObjIndex = this.outOfScopeArr.findIndex(element => element.id == this.paginationArray[index].id);
      if (tempObjIndex > -1) {
        this.outOfScopeArr[tempObjIndex] = this.paginationArray[index];
      } else {
        this.outOfScopeArr.push(this.paginationArray[index]);
      }
    } else if (!this.paginationArray[index].isCategoryCorrect && this.paginationArray[index].subCatOfSelectedCategory !== this.paginationArray[index].subCategory) {
      console.log("out of scope incorrect ");
      this.paginationArray[index].isSubCategorycorrect = false;
      this.paginationArray[index].subCategoryStatus = this.mySVGArr.find(element => element.subCategory == this.paginationArray[index].subCategory).incorrectSubCategoryTxtimg;
      this.paginationArray[index]["isOutOfScopeAndIncorrect"] = true;
      let tempObjIndex = this.outOfScopeArr.findIndex(element => element.id == this.paginationArray[index].id);
      if (tempObjIndex > -1) {
        this.outOfScopeArr[tempObjIndex] = this.paginationArray[index];
      } else {
        this.outOfScopeArr.push(this.paginationArray[index]);
      }
    }
    else if (this.paginationArray[index].isCategoryCorrect && this.paginationArray[index].subCatOfSelectedCategory === this.paginationArray[index].subCategory) {
      console.log("correct capital ");
      this.paginationArray[index].isSubCategorycorrect = true;
      this.paginationArray[index].subCategoryStatus = this.mySVGArr.find(element => element.subCategory == this.paginationArray[index].subCatOfSelectedCategory).correctSubCategoryTxtimg;
      let tempObjIndex = this.correctIncorrectArr.findIndex(element => element.id == this.paginationArray[index].id);
      if (tempObjIndex > -1) {
        this.correctIncorrectArr[tempObjIndex] = this.paginationArray[index];
      } else {
        this.correctIncorrectArr.push(this.paginationArray[index]);
      }
    }
  }

  /******** Function called on selecting subcategory from dropdown ********/
  categoryName(category) {
    this.appModel.notifyUserAction();
    let indexinSubmitArr: number = this.submittedArray.findIndex(element => element.id == this.clickedId || element.strokeId == this.clickedId);
    if (indexinSubmitArr != -1) {
      this.submittedArray[indexinSubmitArr]["optionSelected"] = category.text;
      this.optionSelected = this.submittedArray[indexinSubmitArr].optionSelected;
      this.paginationArray[indexinSubmitArr].imgSubCategory = this.mySVGArr.find(element => element.subCategory == category.text).subCategoryTxtimg;
      this.paginationArray[indexinSubmitArr].subCategory = this.mySVGArr.find(element => element.subCategory == category.text).subCategory;
      this.checkSubCategoryStatus(indexinSubmitArr);
    }
    this.submitFlag = false;
    for (let i = 0; i < document.getElementById("mainques").children[1].children.length; i++) {
      if (i != (this.categoryIndex + 1)) {
        (document.getElementById("mainques").children[1].children[i] as HTMLElement).style.pointerEvents = "";
      }
    }
    this.singleClicknotAllowed = false;
    document.getElementById("mainques").style.pointerEvents = " ";
    this.QuesRef.nativeElement.style.pointerEvents = "auto";
    this.appModel.enableSubmitBtn(true);
    document.getElementById("dropdown").style.opacity = "0";
    document.getElementById("dropdown").style.pointerEvents = "none";
    document.getElementById("line0").style.opacity = "0";
    document.getElementById('dropdownviaTooltip').style.opacity = "0";
    document.getElementById('dropdownviaTooltip').style.left = "0%";
    document.getElementById('dropdownviaTooltip').style.top = "0%";
    document.getElementById("dropdownviaTooltip").style.pointerEvents = "none";
  }

  /******** Function call on click of confirm in Review popup ********/
  onConfirmReview() {
    if (!this.submitFlag) {
      if ((this.correctIncorrectArr.length <= this.commonAssets.itemsperPage && this.outOfScopeArr.length === 0) || (this.correctIncorrectArr.length === 0 && this.outOfScopeArr.length <= this.commonAssets.itemsperPage)) {
        this.noOfPages = 1;
        this.endPage = true;
      }
      else {
        if (this.correctIncorrectArr.length > 0) {
          this.noOfPages = Math.ceil(this.correctIncorrectArr.length / this.commonAssets.itemsperPage);
        }
        if (this.outOfScopeArr.length > 0) {
          this.noOfPages = this.noOfPages + Math.ceil(this.outOfScopeArr.length / this.commonAssets.itemsperPage);
        }
      }
      if (this.noOfPages > 1) {
        this.endPage = false;
      }
    }
  }

  /******** Function call on click of submit button ********/
  onSubmit() {
    if (this.paginationArray.length <= this.commonAssets.itemsperPage) {
      this.noOfPages = 1;
      this.endPage = true;
    }
    else {
        this.noOfPages = Math.ceil(this.paginationArray.length / this.commonAssets.itemsperPage);
    }
    if (this.noOfPages > 1) {
      this.endPage = false;
    }
  }

  /******** Setting popup assets ********/
  setPopupAssets() {
    console.log("this.popupType------------->", this.popupType)
    if (this.popupType === "correct" && this.outOfScopeArr.length === 0) {
      this.checked = true;
      document.getElementById("mainques").style.pointerEvents = "none";
      this.bodyContentDisable = true;
      this.bodyContentOpacity = true;
      this.instructionDisable = true;
      this.instructionOpacity = true;
      this.appModel.enableSubmitBtn(false);
    }
    if (this.popupType === "wrong") {
      this.appModel.feedbackType = "fullyIncorrect";
      this.styleHeaderPopup = this.feedbackObj.wrong_style_header;
      this.styleBodyPopup = this.feedbackObj.wrong_style_body;
      this.feedbackObj.feedback_title = this.feedbackObj.wrong_style_title;
      if (this.currentPageNo === 1) {
        this.feedbackArr = this.correctIncorrectArr.slice(0, this.commonAssets.itemsperPage);
      }
      this.feedbackPopupAudio.nativeElement.src = this.commonAssets.WrongAudio.url;
      this.feedbackPopupAudio.nativeElement.load();
      this.feedbackPopupAudio.nativeElement.play();
      this.feedbackPopupAudio.nativeElement.onended = () => {
        if (this.noOfPages !== 1 && !this.endPage) {
          this.feedbackObj.feedback_next_btn = this.feedbackObj.feedback_next_btn_original;
          this.feedbackObj.feedback_back_btn = this.feedbackObj.feedback_back_btn_original;
          this.startNextFeedbackTimer();
        }
        else {
          this.startCloseFeedbackTimer();
        }
      }
    }
    if (this.popupType === "partialCorrect") {
      this.styleHeaderPopup = this.feedbackObj.partial_style_header;
      this.styleBodyPopup = this.feedbackObj.partial_style_body;
      this.feedbackObj.feedback_title = this.feedbackObj.partial_style_title;
      this.feedbackInfoAudio.nativeElement.src = this.commonAssets.PartiallyCorrectAudio.url;
      this.feedbackInfoAudio.nativeElement.load();
      this.feedbackInfoAudio.nativeElement.play();
    }
    if (this.popupType === "partialIncorrect") {
      this.appModel.feedbackType = "partialIncorrect";
      this.styleHeaderPopup = this.feedbackObj.partial_style_header;
      this.styleBodyPopup = this.feedbackObj.partial_style_body;
      this.feedbackObj.feedback_title = this.feedbackObj.partial_style_title;
      if (this.currentPageNo === 1) {
        this.feedbackArr = this.correctIncorrectArr.slice(0, this.commonAssets.itemsperPage);
      }
      this.feedbackPopupAudio.nativeElement.src = this.commonAssets.moreOptCorrectAudio.url;
      this.feedbackPopupAudio.nativeElement.load();
      this.feedbackPopupAudio.nativeElement.play();
      this.popupType = "partialIncorrect";
      this.feedbackPopupAudio.nativeElement.onended = () => {
        if (this.noOfPages !== 1 && !this.endPage) {
          this.feedbackObj.feedback_next_btn = this.feedbackObj.feedback_next_btn_original;
          this.feedbackObj.feedback_back_btn = this.feedbackObj.feedback_back_btn_original;
          this.startNextFeedbackTimer();
        }
        else {
          this.startCloseFeedbackTimer();
        }
      }
    }
    if (this.popupType === "correct") {
      this.styleHeaderPopup = this.feedbackObj.right_style_header;
      this.styleBodyPopup = this.feedbackObj.right_style_body;
      this.feedbackObj.feedback_title = this.feedbackObj.right_style_title;
      if (this.currentPageNo === 1) {
        this.feedbackArr = this.correctIncorrectArr.slice(0, this.commonAssets.itemsperPage);
      }
      this.feedbackPopupAudio.nativeElement.src = this.commonAssets.CorrectAudio.url;
      this.feedbackPopupAudio.nativeElement.load();
      this.feedbackPopupAudio.nativeElement.play();
      this.feedbackPopupAudio.nativeElement.onended = () => {
        if (this.noOfPages !== 1 && !this.endPage) {
          this.feedbackObj.feedback_next_btn = this.feedbackObj.feedback_next_btn_original;
          this.feedbackObj.feedback_back_btn = this.feedbackObj.feedback_back_btn_original;
          this.startNextFeedbackTimer();
        }
        else {
          this.startCloseFeedbackTimer();
        }
      }
    }
    if (this.popupType === "outOfScope") {
      this.appModel.feedbackType = "fullyIncorrect";
      this.styleHeaderPopup = this.feedbackObj.outofscope_style_header;
      this.styleBodyPopup = this.feedbackObj.outofscope_style_body;
      if (this.currentPageNo === 1) {
        this.feedbackArr = this.outOfScopeArr.slice(0, this.commonAssets.itemsperPage);
      }
      this.feedbackObj.feedback_title = this.feedbackObj.outofscope_style_title;
      this.feedbackPopupAudio.nativeElement.src = this.commonAssets.outOfScopeAudio.url;
      this.feedbackPopupAudio.nativeElement.load();
      this.feedbackPopupAudio.nativeElement.play();
      this.feedbackPopupAudio.nativeElement.onended = () => {
        if (this.noOfPages !== 1 && !this.endPage) {
          this.feedbackObj.feedback_next_btn = this.feedbackObj.feedback_next_btn_original;
          this.feedbackObj.feedback_back_btn = this.feedbackObj.feedback_back_btn_original;
          this.startNextFeedbackTimer();
        }
        else {
          this.startCloseFeedbackTimer();
        }
      }
    }
    if (this.popupType === "showanswer") {
      this.styleHeaderPopup = this.feedbackObj.right_style_header;
      this.styleBodyPopup = this.feedbackObj.right_style_body;
      this.feedbackObj.feedback_title = this.feedbackObj.showAnswer_style_title;
      if (this.currentPageNo === 1) {
        this.feedbackArr = this.showAnswerarray.slice(0, this.commonAssets.itemsperPage);
      }
    }
  }

  /******** Timer for moving to next feedback popup screen ********/
  startNextFeedbackTimer() {
    this.setBlinkOnNextBtn();
    if (this.isShowAnsOpen) {
      this.timerFeedback = this.feedbackObj.Showans_feedback_next_timer;
    } else {
      this.timerFeedback = this.feedbackObj.feedback_next_timer;
    }
    this.nextFeedbackTimer = setTimeout(() => {
      this.nextFeedback();
    }, this.timerFeedback * 1000);
  }

  /******** Timer for closing feedback popup ********/
  startCloseFeedbackTimer() {
    if (this.isShowAnsOpen) {
      this.closeFeedback = this.feedbackObj.Showans_feedback_close_timer * 1000;
    } else {
      this.closeFeedback = this.feedbackObj.close_feedback_timer * 1000;
    }
    this.closeFeedbackmodalTimer = setTimeout(() => {
      if(this.isReviewPopupOpen) {
        this.closeReviewPopup();
      } else {
        this.closeModal();
      }
    }, this.closeFeedback);
  }

  /******** Function call on next navigation button in popups ********/
  nextFeedback(noIncrement?) {
    clearTimeout(this.nextFeedbackTimer);
    clearTimeout(this.closeFeedbackmodalTimer);
    let currentContextArr = [];
    this.pageNo++;
    if (this.isShowAnsOpen) {
      currentContextArr = this.showAnswerarray;
      if (this.showAnswerarray.slice(this.commonAssets.itemsperPage * (this.currentPageNo), this.commonAssets.itemsperPage * this.currentPageNo + 1).length > 0) {
        this.currentPageNo++;
        this.feedbackArr = this.showAnswerarray.slice(this.commonAssets.itemsperPage * (this.currentPageNo - 1), this.commonAssets.itemsperPage * this.currentPageNo);
        if (this.currentPageNo === Math.ceil(this.showAnswerarray.length / this.commonAssets.itemsperPage)) {
          this.endPage = true;
        }
      } else {
        this.endPage = true;
      }
      this.playShowAnswerFeedback();
    } else if (this.popupType === "correct" || this.popupType === "wrong" || this.popupType === "partialIncorrect") {
      this.currentPageNo++;
      if (this.correctIncorrectArr.slice(this.commonAssets.itemsperPage * (this.currentPageNo - 1), this.commonAssets.itemsperPage * this.currentPageNo).length > 0) {
        this.feedbackArr = this.correctIncorrectArr.slice(this.commonAssets.itemsperPage * (this.currentPageNo - 1), this.commonAssets.itemsperPage * this.currentPageNo);
        if (this.correctIncorrectArr.slice(this.commonAssets.itemsperPage * (this.currentPageNo - 1), this.commonAssets.itemsperPage * this.currentPageNo).length === 0) {
          if (this.outOfScopeArr.length > 0) {
            this.popupType = "outOfScope";
            this.currentPageNo = 1;
            this.nextFeedback(true);
          } else {
            this.endPage = true;
          }
        }
      } else if (this.outOfScopeArr.length > 0) {
        this.popupType = "outOfScope";
        this.currentPageNo = 1;
        this.nextFeedback(true);
      }
      else {
        this.endPage = true;
      }
    } else if (this.popupType === "outOfScope") {
      if (!noIncrement) {
        this.currentPageNo++;
      }
      if (this.outOfScopeArr.slice(this.commonAssets.itemsperPage * (this.currentPageNo - 1), this.commonAssets.itemsperPage * this.currentPageNo).length > 0) {
        this.feedbackArr = this.outOfScopeArr.slice(this.commonAssets.itemsperPage * (this.currentPageNo - 1), this.commonAssets.itemsperPage * this.currentPageNo);
        if (this.outOfScopeArr.slice(this.commonAssets.itemsperPage * (this.currentPageNo), this.commonAssets.itemsperPage * this.currentPageNo + 1).length === 0) {
          this.endPage = true;
        }
      } else {
        this.endPage = true;
        this.currentPageNo = 1;
      }
    }
    clearInterval(this.nextBtnInterval);
    if(this.popupType === "review") {
      this.currentPageNo++;
      this.feedbackArr = this.paginationArray.slice(this.commonAssets.itemsperPage * (this.currentPageNo - 1), this.commonAssets.itemsperPage * this.currentPageNo);
      if(this.paginationArray.slice(this.commonAssets.itemsperPage * (this.currentPageNo), this.commonAssets.itemsperPage * this.currentPageNo+1).length === 0) {
        this.endPage = true;
      } else {
        this.endPage = false;
      }
      this.setReviewPopup();
    } else {
      this.feedbackObj.feedback_next_btn = this.feedbackObj.feedback_next_btn_original;
      this.feedbackObj.feedback_back_btn = this.feedbackObj.feedback_back_btn_original;
      this.setPopupAssets();
    }
  }

  /******** Function call on previous navigation button in popups ********/
  prevFeedback() {
    clearTimeout(this.closeFeedbackmodalTimer);
    clearTimeout(this.nextFeedbackTimer);
    this.pageNo--;
    let currentContextArr = [];
    if (this.isShowAnsOpen) {
      currentContextArr = this.showAnswerarray;
      if (this.showAnswerarray.slice(this.commonAssets.itemsperPage * (this.currentPageNo - 1), this.commonAssets.itemsperPage * this.currentPageNo).length > 0) {
        this.currentPageNo--;
        this.feedbackArr = this.showAnswerarray.slice(this.commonAssets.itemsperPage * (this.currentPageNo - 1), this.commonAssets.itemsperPage * this.currentPageNo);
      }
      if (this.showAnswerarray.slice(this.commonAssets.itemsperPage * (this.currentPageNo - 1), this.commonAssets.itemsperPage * this.currentPageNo).length === 0) {
        if (this.currentPageNo === 1) {
          this.endPage = false;
          this.pageNo = 1;
        }
      } else {
        if (this.currentPageNo === 1) {
          this.endPage = false;
          this.pageNo = 1;
        }
      }
      this.playShowAnswerFeedback();
    } else if (this.popupType === "correct" || this.popupType === "wrong" || this.popupType === "partialIncorrect") {
      if (this.correctIncorrectArr.slice(this.commonAssets.itemsperPage * (this.currentPageNo - 1), this.commonAssets.itemsperPage * this.currentPageNo).length > 0) {
        this.currentPageNo--;
        this.feedbackArr = this.correctIncorrectArr.slice(this.commonAssets.itemsperPage * (this.currentPageNo - 1), this.commonAssets.itemsperPage * this.currentPageNo);
      }
      if (this.correctIncorrectArr.slice(this.commonAssets.itemsperPage * (this.currentPageNo - 1), this.commonAssets.itemsperPage * this.currentPageNo).length === 0) {
        if (this.currentPageNo === 1) {
          this.endPage = false;
          this.pageNo = 1;
        }
      } else {
        if (this.currentPageNo === 1) {
          this.endPage = false;
          this.pageNo = 1;
        }
      }
    } else if (this.popupType === "outOfScope") {
      if (this.outOfScopeArr.slice(this.commonAssets.itemsperPage * (this.currentPageNo - 1), this.commonAssets.itemsperPage * this.currentPageNo).length > 0) {
        this.currentPageNo--;
        this.feedbackArr = this.outOfScopeArr.slice(this.commonAssets.itemsperPage * (this.currentPageNo - 1), this.commonAssets.itemsperPage * this.currentPageNo);
        this.endPage = false;
        if (this.outOfScopeArr.slice(this.commonAssets.itemsperPage * (this.currentPageNo - 1), this.commonAssets.itemsperPage * this.currentPageNo).length === 0) {
          if (this.rightAnswerCounter > 0 && this.wrongAnswerCounter === 0) {
            this.popupType = "correct";
          } else if (this.rightAnswerCounter === 0 && this.wrongAnswerCounter > 0) {
            this.popupType = "wrong";
          } else if (this.rightAnswerCounter > 0 && this.wrongAnswerCounter > 0) {
            this.popupType = "partialIncorrect";
          }
          this.currentPageNo = Math.ceil(this.correctIncorrectArr.length / this.commonAssets.itemsperPage);
          this.feedbackArr = this.correctIncorrectArr.slice(this.commonAssets.itemsperPage * (this.currentPageNo - 1), this.commonAssets.itemsperPage * this.currentPageNo);
          if (this.currentPageNo === 1) {
            this.endPage = false;
            this.pageNo = 1;
          }
        }
      } else {
        this.currentPageNo = Math.ceil(this.correctIncorrectArr.length / this.commonAssets.itemsperPage);
        this.feedbackArr = this.correctIncorrectArr.slice(this.commonAssets.itemsperPage * (this.currentPageNo - 1), this.commonAssets.itemsperPage * this.currentPageNo);
        this.endPage = false;
        this.pageNo = this.currentPageNo;
        if (this.rightAnswerCounter > 0 && this.wrongAnswerCounter === 0) {
          this.popupType = "correct";
        } else if (this.rightAnswerCounter === 0 && this.wrongAnswerCounter > 0) {
          this.popupType = "wrong";
        } else if (this.rightAnswerCounter > 0 && this.wrongAnswerCounter > 0) {
          this.popupType = "partialIncorrect";
        }
      }
    }
    if (this.isShowAnsOpen) {
      this.feedbackArr = currentContextArr.slice(this.commonAssets.itemsperPage * (this.currentPageNo - 1), this.commonAssets.itemsperPage * this.currentPageNo);
    }
    clearInterval(this.nextBtnInterval);
    this.nextBtnInterval = undefined;
    if(this.popupType === "review") {
      this.currentPageNo--;
      this.feedbackArr = this.paginationArray.slice(this.commonAssets.itemsperPage * (this.currentPageNo - 1), this.commonAssets.itemsperPage * this.currentPageNo);
      if(this.paginationArray.slice(this.commonAssets.itemsperPage * (this.currentPageNo), this.commonAssets.itemsperPage * this.currentPageNo+1).length === 0) {
        this.endPage = true;
      }
      else {
        this.endPage = false;
      }
      this.setReviewPopup();
    } else {
      this.feedbackObj.feedback_next_btn = this.feedbackObj.feedback_next_btn_original;
      this.feedbackObj.feedback_back_btn = this.feedbackObj.feedback_back_btn_original;
      this.setPopupAssets();
    }
  }

  /******Checking of existance of quesTab in content JSON *******/
  checkquesTab() {
    if (this.fetchedcontent.commonassets.ques_control != undefined) {
      this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
    } else {
      this.appModel.getJson();
    }
  }

  /******** Loading SVG image ********/
  getFileLoaded(filesData) {
    this.fileLoadSubscription = this.appModel.getFileString(filesData.url)
      .subscribe((data) => {
        var parser = new DOMParser();
        var newNode = parser.parseFromString(data, "text/xml");
        document.getElementById(filesData.svgId).appendChild(newNode.documentElement);
      });
    let loadImage = setInterval(() => {
      if (document.getElementById("mainques") && document.getElementById("mainques").children[1]) {
        var svgElement = document.getElementById("mainques").children[1];
        svgElement.setAttribute("width", "100%");
        svgElement.setAttribute("height", "100%");
        svgElement.classList.add("svgClass");
        if (this.quesAudio != undefined && this.quesAudio.url != "") {
          this.appModel.setLoader(false);
          this.loadFlag = true;
          clearTimeout(this.loaderTimer);
          this.instructionVODelay = setTimeout(() => {
          this.narrator.nativeElement.src = this.quesAudio.url;
          this.narrator.nativeElement.load();
          this.narrator.nativeElement.play();
          this.QuesRef.nativeElement.style.pointerEvents = "none";
          this.narrator.nativeElement.onended = () => {
            this.appModel.handlePostVOActivity(false);
            this.QuesRef.nativeElement.style.pointerEvents = "";
            this.instructionDisable = false;
            this.bodyContentDisable = false;
          }
          this.appModel.handlePostVOActivity(true);
          document.getElementById("mainCanvas").style.pointerEvents = "none";
        },500);
        } else {
          this.appModel.handlePostVOActivity(false);
          this.QuesRef.nativeElement.style.pointerEvents = "";
          document.getElementById('instructionBar').style.pointerEvents = "";
        }
        for (let i = 1; i < this.QuesRef.nativeElement.children[1].children.length; i++) {
          if (this.QuesRef.nativeElement.children[1].children[i].children[0].getAttribute("xlink:href")) {
            for (let j = 0; j < this.QuesRef.nativeElement.children[1].children[i].children.length; j++) {
              this.QuesRef.nativeElement.children[1].children[i].children[j].style.pointerEvents = "none";
            }
          } else {
            for (let j = 1; j < this.QuesRef.nativeElement.children[1].children[i].children.length; j++) {
              this.QuesRef.nativeElement.children[1].children[i].children[j].style.pointerEvents = "none";
            }
          }
        }
        for(let j=1; j <this.QuesRef.nativeElement.children[1].children.length; j++) {
          if(this.QuesRef.nativeElement.children[1].children[j].children[0].children[0] && this.QuesRef.nativeElement.children[1].children[j].children[0].children[0].getAttribute("xlink:href")) {
            this.originalcolor[j-1] = document.querySelector(this.QuesRef.nativeElement.children[1].children[j].children[0].children[0].getAttribute("xlink:href")).children[0].getAttribute("fill");
          }
        }
        console.log("SVG loaded");
        clearInterval(loadImage);
      }
      console.log("SVG not loaded");

    }, 100);
  }

  /******** setting all data on intial load ********/
  setData() {
    this.appModel.enableSubmitBtn(false);
    if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
      let fetchedData: any = this.fetchedcontent;
      console.log(fetchedData);
      this.commonAssets = fetchedData.commonassets;
      this.listCategoryHeader = this.commonAssets.listHeader.categoryHeader;
      this.listSubCategoryHeader = this.commonAssets.listHeader.subCategoryHeader;
      this.DropDownTitleUpper = this.commonAssets.listHeader.UpperTitle;
      this.DropDownTitleLower = this.commonAssets.listHeader.LowerTitle;
      this.isLastQuestion = this.commonAssets.isLastQues;
      this.isFirstQues = this.commonAssets.isFirstQues;
      this.isLastQues = this.appModel.isLastSection;
      this.isLastQuesAct = this.appModel.isLastSectionInCollection;
      if (this.isLastQuesAct || this.isLastQues) {
        this.appModel.setlastQuesNT();
      }
      this.optionObj = fetchedData.optionObj;
      this.optionCommonAssets = fetchedData.option_common_assets;
      console.log(this.optionCommonAssets);
      this.feedbackObj = fetchedData.feedback;
      this.rightAnspopupAssets = this.feedbackObj.right_ans_popup;
      this.confirmPopupAssets = fetchedData.feedback.confirm_popup;
      this.mySVGArr = fetchedData.mySVGArr;
      this.mySVGArr.map((element) => element.clicked = false);
      let arr = [];
      for (let i = 0; i < this.mySVGArr.length; i++) {
        arr.push(this.mySVGArr[i].subCategory);
      }
      let filteredarray = arr.filter((item, index) => arr.indexOf(item) === index);
      this.copiedCategories = filteredarray.filter(function(el) {
        return el != "";
      });
      this.copiedCategories.sort();
      this.confirmSubmitAssets = fetchedData.submit_confirm;
      this.infoPopupAssets = fetchedData.info_popup;
      this.mainSvgfile = fetchedData.svgInfo;
      this.quesAudio = this.commonAssets.QuestionAudio;
    }

  }

  getBasePath() {
    if (this.appModel && this.appModel.content) {
      return this.appModel.content.id + '';
    }
  }

  /******** setting show answer feedback popup audio ********/
  playShowAnswerFeedback() {
    this.feedbackPopupAudio.nativeElement.src = this.commonAssets.showAnsAudio.url;
    this.feedbackPopupAudio.nativeElement.load();
    this.feedbackPopupAudio.nativeElement.play();
    this.feedbackPopupAudio.nativeElement.onended = () => {
      if (this.noOfPages !== 1 && !this.endPage) {
        this.feedbackObj.feedback_next_btn = this.feedbackObj.feedback_next_btn_original;
        this.feedbackObj.feedback_back_btn = this.feedbackObj.feedback_back_btn_original;
        this.startNextFeedbackTimer();
      }
      else {
        this.startCloseFeedbackTimer();
      }
    }
  }

  /******** Function to reset all values on wrong answer ********/
  resetActivity() {
    for (let i = 0; i < this.submittedArray.length; i++) {
      this.submittedArray[i].clicked = false;
      document.getElementById(this.submittedArray[i].tooltipID).style.pointerEvents = "";
      document.getElementById(this.submittedArray[i].tooltipID).style.left = "0";
      document.getElementById(this.submittedArray[i].tooltipID).style.top = "0";
      document.getElementById(this.submittedArray[i].tooltipID).classList.remove("tooltipshow");
      document.getElementById(this.submittedArray[i].tooltipID).classList.add("tooltipHidden");
      let index = this.mySVGArr.findIndex(element => element.id == this.submittedArray[i].id);
      document.querySelector(this.QuesRef.nativeElement.children[1].children[index + 1].children[0].children[0].getAttribute("xlink:href")).children[0].setAttribute("fill", this.originalcolor[index]);
    }
    this.submittedArray = [];
    this.currentPageNo = 1;
    this.correctIncorrectArr = [];
    this.outOfScopeArr = [];
    this.pageNo = 1;
    this.endPage = false;
    document.getElementById('dropdownviaTooltip').style.opacity = "0";
    document.getElementById('dropdownviaTooltip').style.left = "0%";
    document.getElementById('dropdownviaTooltip').style.top = "0%";
    document.getElementById("dropdownviaTooltip").style.pointerEvents = "none";
    document.getElementById('dropdown').style.opacity = "0";
    for (let i = 0; i < document.getElementById("mainques").children[1].children.length; i++) {
      if (i != (this.categoryIndex + 1)) {
        (document.getElementById("mainques").children[1].children[i] as HTMLElement).style.pointerEvents = "";
      }
    }
    this.singleClicknotAllowed = false;
    this.countofClick = 0;
    this.p = 1;
    document.getElementById("line0").setAttribute("x1", "0");
    document.getElementById("line0").setAttribute("x2", "0");
    document.getElementById("line0").setAttribute("y1", "0");
    document.getElementById("line0").setAttribute("y2", "0");
    document.getElementById("dropdown").classList.add("dropdownhidden");
    this.appModel.enableSubmitBtn(false);
    this.paginationArray = [];
    this.rightAnswerCounter = 0;
    this.wrongAnswerCounter = 0;
  }

  /******** setting blink interval on next button ********/
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
    }, 300);
  }

  /******** funtion call on opening show answer popup ********/
  showAnswerFeedback() {
    this.showAnswerarray = [];
    this.appModel.resetBlinkingTimer();
    for (let i = 0; i < this.feedbackObj.correct_category.length; i++) {
      let findState = this.mySVGArr.find(element => element.textField == this.feedbackObj.correct_category[i]);
      this.showAnswerarray.push(findState);
    }
    this.endPageNo = Math.ceil(this.showAnswerarray.length / this.commonAssets.itemsperPage);
    if (this.showAnswerarray.length <= this.commonAssets.itemsperPage) {
      this.noOfPages = 1;
      this.endPage = true;
    } else {
      this.noOfPages = Math.ceil(this.showAnswerarray.length / this.commonAssets.itemsperPage);
    }
    if (this.showAnswerarray.length <= this.commonAssets.itemsperPage) {
      this.feedbackArr = JSON.parse(JSON.stringify(this.showAnswerarray));
    } else {
      this.feedbackArr = this.showAnswerarray.slice(0, this.commonAssets.itemsperPage);
    }
  }

  /******** Function call on closing of Review popup ********/
  closeReviewPopup() {
    this.popupRef.nativeElement.classList = "modal";
    if (!this.feedbackPopupAudio.nativeElement.paused) {
      this.feedbackPopupAudio.nativeElement.pause();
      this.feedbackPopupAudio.nativeElement.currentTime = 0;
    }
    this.currentPageNo = 1;
    this.endPage = false;
    this.pageNo = 1;
    this.popupType = "";
    this.instructionDisable = false;
    this.isReviewPopupOpen = false;
    clearTimeout(this.nextFeedbackTimer);
    clearTimeout(this.closeFeedbackmodalTimer);
    clearInterval(this.nextBtnInterval);
    this.nextBtnInterval = undefined;
    this.appModel.handlePostVOActivity(false);
    this.appModel.notifyUserAction();
  }

  /******** Function call on yes/no or ok/cancel button click of popups ********/
  showFeedback(id: string, flag: string, status?: string) {
    if (this.timerSubscription != undefined) {
      this.timerSubscription.unsubscribe();
    }
    if (status === "feedbackDone") {
      this.closeModal();
      this.appModel.notifyUserAction();
    }
    if(status === "cancelReview") {
      this.closeReviewPopup();
    }
    if (id == "submit-modal-id" && flag == "no") {	
      this.instructionDisable = false;
      this.appModel.notifyUserAction();
    }
    if (id == "info-modal-id") {
      this.infoModalRef.nativeElement.classList = "modal";
      this.rightAnswerCounter = 0;
      if (this.feedbackInfoAudio && !this.feedbackInfoAudio.nativeElement.paused) {
        this.feedbackInfoAudio.nativeElement.pause();
        this.feedbackInfoAudio.nativeElement.currentTime = 0;
      }
      this.appModel.notifyUserAction();
    }
    if (id == "showAnswer-modal-id" && flag == "answer") {
      this.checked = true;
      this.isShowAnsOpen = true;
      this.attemptType = "auto";
      this.confirmModalRef.nativeElement.classList = "modal";
      this.showAnswerFeedback();
      this.popupRef.nativeElement.classList = "displayPopup modal";
      this.popupType = "showanswer";
      this.setPopupAssets();
      this.appModel.stopAllTimer();
      this.playShowAnswerFeedback();
      this.bodyContentDisable = true;
      this.bodyContentOpacity = true;
      document.getElementById("mainques").style.pointerEvents = "none";
      this.instructionDisable = true;
      this.instructionOpacity = true;
      this.appModel.enableSubmitBtn(false);
    }
    if (id == "showAnswer-modal-id" && flag == "no") {
      this.confirmModalRef.nativeElement.classList = "modal";
      if(!this.checked) {	
        this.instructionDisable = false;	
      }
      this.appModel.notifyUserAction();
    }
    if (flag == "confirm" && status === "confirmReview") {
      this.closeReviewPopup();
      this.onConfirmReview();
      this.setPopupType();

      //}
    }
    else if (id == "showAnswer-modal-id" && flag == "no") {
      this.popupRef.nativeElement.classList = "modal";
      this.appModel.notifyUserAction();
    }
  }

  /******** set popup type ********/
  setPopupType() {
    for (let i = 0; i < this.paginationArray.length; i++) {
      if (this.paginationArray[i].isCategoryCorrect && this.paginationArray[i].isSubCategorycorrect) {
        this.rightAnswerCounter++;
      } else if (this.paginationArray[i].isCategoryCorrect && !this.paginationArray[i].isSubCategorycorrect && !this.paginationArray[i].isOutOfScopeAndCorrect && !this.paginationArray[i].isOutOfScopeAndIncorrect) {
        this.wrongAnswerCounter++;
      }
    }
    if ((this.rightAnswerCounter < this.feedbackObj.correct_category.length) && this.wrongAnswerCounter == 0 && this.outOfScopeArr.length === 0) {
      this.infoModalRef.nativeElement.classList = "displayPopup modal";
      this.popupType = "partialCorrect";
      this.setPopupAssets();
    } else {
      this.appModel.stopAllTimer();
      if (this.rightAnswerCounter > 0 && this.wrongAnswerCounter === 0) {
        this.popupType = "correct";
      } else if (this.rightAnswerCounter === 0 && this.wrongAnswerCounter > 0) {
        this.popupType = "wrong";
      } else if (this.rightAnswerCounter > 0 && this.wrongAnswerCounter > 0) {
        this.popupType = "partialIncorrect";
      } else {
        this.popupType = "outOfScope";
      }
      this.attemptType = "manual";
      this.setPopupAssets();
      this.popupRef.nativeElement.classList = "displayPopup modal";
    }
  }

  /******** Set Review Popup timer ********/
  setReviewPopupTimer() {
    if (this.noOfPages !== 1 && !this.endPage) {
      this.startNextFeedbackTimer();
    }
    else {
      this.startCloseFeedbackTimer();
    }
  }

  /******** Set Review Popup ********/
  setReviewPopup() {
    this.feedbackObj.feedback_next_btn = this.feedbackObj.feedback_next_btn_original;
      this.feedbackObj.feedback_back_btn = this.feedbackObj.feedback_back_btn_original;
    if(this.commonAssets.reviewPopupAudio && this.commonAssets.reviewPopupAudio.url) {
      this.feedbackPopupAudio.nativeElement.src = this.commonAssets.reviewPopupAudio.url;
      this.feedbackPopupAudio.nativeElement.load();
      setTimeout(() => {
        this.feedbackPopupAudio.nativeElement.play();
      }, 500);
      this.feedbackPopupAudio.nativeElement.onended = () => {
        this.setReviewPopupTimer();
      }
    } else {
      this.setReviewPopupTimer();
    }
    
  }

  /******** function call on modal popup close ********/
  closeModal() {
    if (!this.feedbackPopupAudio.nativeElement.paused) {
      this.feedbackPopupAudio.nativeElement.pause();
      this.feedbackPopupAudio.nativeElement.currentTime = 0;
    }
    this.popupRef.nativeElement.classList = "modal";
    this.popupRef.nativeElement.classList = "modal";
    this.infoModalRef.nativeElement.classList = "modal";
    this.confirmModalRef.nativeElement.classList = "modal";
    this.currentPageNo = 1;
    this.endPage = false;
    this.pageNo = 1;
    this.isShowAnsOpen = false;
    clearTimeout(this.nextFeedbackTimer);
    clearTimeout(this.closeFeedbackmodalTimer);
    clearInterval(this.nextBtnInterval);
    this.nextBtnInterval = undefined;
    this.appModel.notifyUserAction();
    if (this.checked) {
      this.blinkOnLastQues();
      document.getElementById("mainques").style.pointerEvents = "none";
      this.bodyContentDisable = true;
      this.bodyContentOpacity = true;
      this.instructionDisable = true;
      this.instructionOpacity = true;
      this.appModel.enableSubmitBtn(false);
    }
    if (!this.checked) {
      this.resetActivity();
      this.instructionDisable = false;	
      this.bodyContentDisable = false;
      this.appModel.wrongAttemptAnimation();
    }
  }

  /******** Popup buttons hover functionality started ********/
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
  hoverSubmitCloseConfirm() {
    this.confirmSubmitAssets.close_btn = this.confirmSubmitAssets.close_btn_hover;
  }
  houtSubmitCloseConfirm() {
    this.confirmSubmitAssets.close_btn = this.confirmSubmitAssets.close_btn_original;
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
    this.infoPopupAssets.close_btn = this.infoPopupAssets.close_btn_hover;
    this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_hover;
  }
  houtCloseConfirm() {
    this.infoPopupAssets.close_btn = this.infoPopupAssets.close_btn_original;
    this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_original;
  }

  hoverClosePopup() {
    this.feedbackObj.popup_commmon_imgs.close_btn = this.feedbackObj.popup_commmon_imgs.close_btn_hover;
  }

  houtClosePopup() {
    this.feedbackObj.popup_commmon_imgs.close_btn = this.feedbackObj.popup_commmon_imgs.close_btn_original;
  }

  hoverOK() {
    this.infoPopupAssets.ok_btn = this.infoPopupAssets.ok_btn_hover;
  }

  houtOK() {
    this.infoPopupAssets.ok_btn = this.infoPopupAssets.ok_btn_original;
  }

  hoverFeedbackConfirm() {
    this.feedbackObj.confirm_btn = this.feedbackObj.confirm_btn_hover;
  }

  houtFeedbackConfirm() {
    this.feedbackObj.confirm_btn = this.feedbackObj.confirm_btn_original;
  }

  houtFeedbackCancel() {
    this.feedbackObj.cancel_btn = this.feedbackObj.cancel_btn_original;
  }

  hoverFeedbackCancel() {
    this.feedbackObj.cancel_btn = this.feedbackObj.cancel_btn_hover;
  }

  hoverFeedbackOK() {
    this.feedbackObj.ok_btn = this.feedbackObj.ok_btn_hover;
  }

  houtFeedbackOK() {
    this.feedbackObj.ok_btn = this.feedbackObj.ok_btn_original;
  }

  hoverFeedbackClose() {
    this.feedbackObj.close_btn = this.feedbackObj.close_btn_hover;
  }

  houtFeedbackClose() {
    this.feedbackObj.close_btn = this.feedbackObj.close_btn_original;
  }

  hoverFeedbackNxt() {
    if(!this.nextBtnInterval) {
      this.feedbackObj.feedback_next_btn = this.feedbackObj.feedback_next_btn_hover;
    }
  }
  hoverFeedbackPre() {
    this.feedbackObj.feedback_back_btn = this.feedbackObj.feedback_back_btn_hover;
  }
  hleaveFeedbackNxt() {
    if(!this.nextBtnInterval) {
      this.feedbackObj.feedback_next_btn = this.feedbackObj.feedback_next_btn_original;
    }
  }
  hleaveFeedbackPre() {
    this.feedbackObj.feedback_back_btn = this.feedbackObj.feedback_back_btn_original;
  }
  /******** Popup buttons hover functionality ended ********/
}
