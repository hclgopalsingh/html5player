import { Component, OnInit, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../model/applicationmodel.service';
import { Subject, Observable, Subscription } from 'rxjs'
import 'jquery';
import { PlayerConstants } from '../common/playerconstants';


declare var $: any;

@Component({
  selector: 'ntemp18',
  templateUrl: '../view/layout/Ntemplate18.component.html',
  styleUrls: ['../view/css/Ntemplate18.component.css', '../view/css/bootstrap.min.css'],

})

export class Ntemplate18 implements OnInit {
  private appModel: ApplicationmodelService;
  constructor(appModel: ApplicationmodelService) {
    this.appModel = appModel;
    this.assetsPath = this.appModel.assetsfolderpath;
    this.appModel.navShow = 2;
    this.appModel.setLoader(true);
    // if error occured during image loading loader wil stop after 5 seconds 
    this.loaderTimer = setTimeout(() => {
      this.appModel.setLoader(false);
      //this.checkforQVO();
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
  @ViewChild('optionAudio') optionAudio: any;
  @ViewChild('maincontent') maincontent: any;
  @ViewChild('confirmModalRef') confirmModalRef: any;
  @ViewChild('submitModalRef') submitModalRef: any;
  @ViewChild('infoModalRef') infoModalRef: any;
  @ViewChild('modalRef') modalRef: any;
  @ViewChild('mainmodalRef') mainmodalRef: any;
  @ViewChild('popupRef') popupRef: any;
  @ViewChild('popupBodyRef') popupBodyRef: any;
  @ViewChild('popupImage') popupImage: any;
  @ViewChild('feedbackPopupAudio') feedbackPopupAudio: any;
  @ViewChild('feedbackpartialPopupAudio') feedbackpartialPopupAudio: any;
  @ViewChild('partialpopupBodyRef') partialpopupBodyRef: any;
  @ViewChild('confirmReplayRef') confirmReplayRef: any;
  @ViewChild('mainVideo') mainVideo: any;
  @ViewChild('feedbackInfoAudio') feedbackInfoAudio: any;
  @ViewChild('refQues') refQues: any;



  attemptType:any;
  audio = new Audio();
  blink: boolean = false;
  currentIdx = 0;
  commonAssets: any = "";
  optionslist: any = [];
  optionslist_main: any = "";
  myoption: any = [];
  question: any = "";
  feedback: any = "";
  narratorAudio: any;
  isLastActivity: any = "";
  checked: boolean = false;
  selected: boolean = false;
  bool: boolean = false;
  isQuesTypeImage: boolean = false;
  isQuesTypeVideo: boolean = false;
  showIntroScreen: boolean;
  isAllowed:boolean = true;

  helpAudio: any = "";
  correctOpt: any;
  idArray: any = [];
  noOfRightAnsClicked: number = 0;
  noOfWrongAnsClicked: number = 0;
  rightansArray: any = [];
  rightansArray1: any = [];
  rightansArray2: any = [];
  wrongansArray1: any = [];
  wrongansArray2: any = [];
  AnsObj: any = [];
  ansArray1: any = [];
  Array2required: boolean = false;
  partialpopupRequired: boolean = false;
  wrongansArray: any = [];
  isFirstQues: boolean;
  isLastQues: boolean = false;
  isAutoplayOn: boolean;
  isLastQuesAct: boolean;

  noOfImgs: number;
  noOfImgsLoaded: number = 0;
  loaderTimer: any;
  disableHelpBtn: boolean = false;
  containgFolderPath: string = "";
  assetsPath: string = "";
  loadFlag: boolean = false;
  optionObj: any;
  optArr1: any;
  optArr2: any;
  optionCommonAssets: any;
  ques_control: any;
  feedbackObj: any;
  feedbackAudio: any;
  correctImg: any;
  incorrectImg: any;
  popupAssets: any;
  confirmPopupAssets: any;
  infoPopupAssets: any;
  submitPopupAssets: any;
  replayconfirmAssets: any;
  noOfRightAns: any;
  rightAnspopupAssets: any;
  tempSubscription: Subscription;
  rightanspopUp: any;
  wronganspopUp: any;
  quesObj: any;
  isPlayVideo: boolean = true;
  videoReplayd: boolean = false;
  refQuesObj: any;
  startCount: number = 0;
  countofAnimation: number = 0;
  blinkTimeInterval: any;
  blinkFlag: boolean = true;
  originalArray: any = [];
  refcpyArray: any = [];
  currentIndex: number;
  moveTo: any;
  moveFrom: any;
  moveleft: any;
  movetop: any;
  indexArray: any = [];
  index: any;
  fetchAnswer: any = [];
  index1: number = 0;
  prevIdx: number;
  curr: number;
  prevOptIdx: number = 0;
  matched: boolean = false;
  quesFlag: boolean = false;
  rightanspopUpheader_img: boolean = false;
  wronganspopUpheader_img: boolean = false;
  showanspopUpheader_img: boolean = false;
  partialCorrectheaderTxt_img: boolean = false;
  styleHeaderPopup:any;
  styleBodyPopup:any;
  PlayPauseFlag:boolean = true;
  /*
    hasEventFired:boolean = false;
    	if(!this.hasEventFired){
						if(this.isLastQuesAct){
							this.hasEventFired = true;
							this.appModel.event = {'action': 'segmentEnds'};
						}
						if(this.isLastQues){
							this.appModel.event = {'action': 'exit'};	
						}
					}
  */

  ngOnDestroy() {
    clearInterval(this.blinkTimeInterval);
    this.startCount = 0;
    for (let i = 0; i < this.refcpyArray.length; i++) {
      this.refQues.nativeElement.children[i].children[0].src = this.refcpyArray[i].imgsrc_original.location == "content" ? this.containgFolderPath + "/" + this.refcpyArray[i].imgsrc_original.url : this.assetsPath + "/" + this.refcpyArray[i].imgsrc_original.url;
    }
    this.index1 = 0;
  }

  playHoverInstruction() {
    if (!this.narrator.nativeElement.paused!) {
      console.log("narrator/instruction voice still playing");
    } else {
      this.appModel.notifyUserAction();
      console.log("play on Instruction");
      if (this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.play();
        //$("#optionsBlock").css("pointer-events", "none");
        this.instruction.nativeElement.onended = () => {
          $("#optionsBlock").css("pointer-events", "");
        }
        $(".instructionBase img").css("cursor", "pointer");
      }
      if (this.refQues.optionType == "image") {
        if (!this.optionAudio.nativeElement.paused) {
          this.instruction.nativeElement.currentTime = 0;
          this.instruction.nativeElement.pause();
        }
      }
    }
  }

  playHoverOption(opt, i) {
    if (!this.instruction.nativeElement.paused)
    {
      this.instruction.nativeElement.pause();
      this.instruction.nativeElement.currentTime = 0;
    }
    this.appModel.notifyUserAction();
    if (this.optionsBlock.nativeElement.children[0].children[i].children[0].children[1].paused && this.narrator.nativeElement.paused) {
      if (opt.imgsrc_audio && opt.imgsrc_audio.location == "content") {
        this.optionsBlock.nativeElement.children[0].children[i].children[0].children[1].src = this.containgFolderPath + "/" + opt.imgsrc_audio.url;
      } else {
        this.optionsBlock.nativeElement.children[0].children[i].children[0].children[1].src = this.assetsPath + "/" + opt.imgsrc_audio.url;
      }
      this.optionsBlock.nativeElement.children[0].children[i].children[0].children[1].load();
      if (!this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.pause();
      }
      this.optionsBlock.nativeElement.children[0].children[i].children[0].children[1].volume = this.appModel.isMute ? 0 : this.appModel.volumeValue;
      this.optionsBlock.nativeElement.children[0].children[i].children[0].children[1].play();
      //if (i == 0) {
      //  this.optionsBlock.nativeElement.children[0].children[i].children[0].children[0].style.pointerEvents = "none";
      //} else {
      //  this.optionsBlock.nativeElement.children[0].children[i].children[0].children[0].style.pointerEvents = "none";
      //}
      for (let x = 0; x < this.optionsBlock.nativeElement.children[0].children.length; x++) {
        if (x != i) {
          this.optionsBlock.nativeElement.children[0].children[x].children[0].children[0].style.pointerEvents = "none";
        }
      }
      //this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
      this.optionsBlock.nativeElement.children[0].children[i].children[0].children[1].onended = () => {
        //if (i == 0) {
        //  this.optionsBlock.nativeElement.children[1].style.pointerEvents = "";
        //} else {
        //  this.optionsBlock.nativeElement.children[0].style.pointerEvents = "";
        //}
        for (let x = 0; x < this.optionsBlock.nativeElement.children[0].children.length; x++) {
          if (x != i) {
            this.optionsBlock.nativeElement.children[0].children[x].children[0].children[0].style.pointerEvents = "";
          }
        }
      }
      this.onHoverImgOption(opt, i);
    }
  }

  onHoverImgOption(opt, i) {
    if (opt && opt != undefined) {
      if (this.narrator.nativeElement.paused) {
        $(this.optionsBlock.nativeElement.children[0].children[i].children[0].children[0]).addClass("scaleInAnimation");
      }
    }
  }


  optionHover(opt, i) {
    $(this.optionsBlock.nativeElement.children[0].children[i].children[0].children[0]).addClass("scaleInAnimation");
  }

  onHoverOption(opt, i) {
    if (opt && opt != undefined) {
      if (this.narrator.nativeElement.paused) {
        //this.optionsBlock.nativeElement.children[i].children[j].children[0].style.cursor = "pointer";
        if (opt.imgsrc && opt.imgsrc.location == "content") {
          this.optionsBlock.nativeElement.children[0].children[i].children[1].children[0].src = this.containgFolderPath + "/" + opt.dropBoxImgHover.url;
        }
        else {
          this.optionsBlock.nativeElement.children[0].children[i].children[1].children[0].src = this.assetsPath + "/" + opt.dropBoxImgHover.url;
        }
      }
    }
  }

  //playHoverOption(opt, i, j) {
  //  if (this.optionAudio.nativeElement.paused && this.narrator.nativeElement.paused) {
  //    if (opt.imgsrc_audio && opt.imgsrc_audio.location == "content") {
  //      this.optionAudio.nativeElement.src = this.containgFolderPath + "/" + opt.imgsrc_audio.url;
  //    } else {
  //      this.optionAudio.nativeElement.src = this.assetsPath + "/" + opt.imgsrc_audio.url;
  //    }
  //    this.optionAudio.nativeElement.load();
  //    if (!this.instruction.nativeElement.paused) {
  //      this.instruction.nativeElement.pause();
  //    }
  //    this.optionAudio.nativeElement.play();
  //    this.onHoverOption(opt, i, j);
  //  }
  //}
  onHoverOptionOut(opt, i) {
    if (opt && opt != undefined) {
      if (opt.imgsrc && opt.imgsrc.location == "content") {
        if (!opt.placed) {
          this.optionsBlock.nativeElement.children[0].children[i].children[1].children[0].src = this.containgFolderPath + "/" + opt.dropBoxImg_original.url;
        }
      }
      else {
        if (!opt.placed) {
          this.optionsBlock.nativeElement.children[0].children[i].children[1].children[0].src = this.assetsPath + "/" + opt.dropBoxImg_original.url;
        }
      }
    }
  }

  optionHoverOut(opt, i, j) {
    if (opt && opt != undefined) {
      this.ZoomOutAnimationoption(opt, i);
    }
  }

  ZoomOutAnimationoption(opt, i) {
    if (!this.checked && this.narrator.nativeElement.paused) {
      $(this.optionsBlock.nativeElement.children[0].children[i].children[0].children[0]).addClass("scaleOutAnimation");
      setTimeout(() => {
        $(this.optionsBlock.nativeElement.children[0].children[i].children[0].children[0]).removeClass("scaleInAnimation");
        $(this.optionsBlock.nativeElement.children[0].children[i].children[0].children[0]).removeClass("scaleOutAnimation");
      }, 500);
      //opt.imgsrc = opt.imgsrc_original;
      //if (opt.imgsrc && opt.imgsrc.location == "content") {
      //  this.optionsBlock.nativeElement.children[i].children[j].children[0].src = this.containgFolderPath + "/" + opt.imgsrc.url;
      //} else {
      //  this.optionsBlock.nativeElement.children[i].children[j].children[0].src = this.assetsPath + "/" + opt.imgsrc.url;
      //}
      //this.optionsBlock.nativeElement.children[i].children[j].children[0].style.transform = "none";
      //this.optionsBlock.nativeElement.children[i].children[j].children[0].style.cursor = "";
    }
  }

  ngAfterViewChecked() {
    this.templatevolume(this.appModel.volumeValue, this);
  }

  //OptionZoomOutAnimation(opt, i, j) {
  //  if (!this.checked && this.narrator.nativeElement.paused) {
  //    opt.imgsrc = opt.imgsrc_original;
  //    if (opt.imgsrc && opt.imgsrc.location == "content") {
  //      this.optionsBlock.nativeElement.children[i].children[j].children[0].src = this.containgFolderPath + "/" + opt.imgsrc.url;
  //    } else {
  //      this.optionsBlock.nativeElement.children[i].children[j].children[0].src = this.assetsPath + "/" + opt.imgsrc.url;
  //    }
  //    this.optionsBlock.nativeElement.children[i].children[j].children[0].style.transform = "none";
  //    this.optionsBlock.nativeElement.children[i].children[j].children[0].style.transition = " ";
  //    this.optionsBlock.nativeElement.children[i].children[j].children[0].style.cursor = " ";
  //  }
  //}

  //onClickoption(idx,placed) {
  //  if (!this.narrator.nativeElement.paused! || !this.instruction.nativeElement.paused) {
  //    console.log("narrator/instruction voice still playing");
  //  } else {
  //    this.startCount = 0;
  //    //this.refcpyArray[this.currentIndex].imgsrc = this.refcpyArray[this.currentIndex].imgsrc_original;
  //    this.refcpyArray[this.index1].imgsrc = this.refcpyArray[this.index1].imgsrc_original;
  //    this.appModel.enableSubmitBtn(true);
  //    this.appModel.enableReplayBtn(false);
  //    if (placed) {
  //      //this.moveFrom = this.optionsBlock.nativeElement.children[0].children[idx].children[1].children[1].getBoundingClientRect();
  //      //this.moveTo = this.refQues.nativeElement.children[this.prevIdx].children[0].getBoundingClientRect();
  //      //this.moveleft = this.moveFrom.left - this.moveTo.left;
  //      //this.movetop = this.moveFrom.top - this.moveTo.top;
  //      $(this.refQues.nativeElement.children[this.optionObj[idx].sequenceNo-1].children[0]).animate({ left: 0, top: 0 }, 1000, () => {
  //        clearInterval(this.blinkTimeInterval);
  //        this.countofAnimation--;
  //        this.optionObj[idx].placed = false;
  //        this.refcpyArray[this.prevIdx].position = "top";
  //        this.refcpyArray[this.prevIdx].previousIndex = this.prevIdx;
  //        this.refcpyArray.push(this.refcpyArray[this.prevIdx]);
  //        this.prevIdx = this.index1;
  //        //this.index1++;
  //        this.startCount = 1;
  //        this.blinkHolder();
  //        //this.optionsBlock.nativeElement.children[0].children[idx].children[1].style.pointerEvents = "none";
  //        //this.indexArray.splice(this.index, 1);
  //        //this.fetchAnswer.splice(idx, 1, this.refcpyArray[this.currentIndex]);
  //        //if (this.indexArray.length > 0) {

  //        //  //this.getRandomIndex(this.indexArray.length);
  //        //}
  //      });
  //    } else {
  //      if (this.refcpyArray.length > this.originalArray.length) {
  //        //console.log("something");
  //        this.curr = this.index1;
  //        if (this.refcpyArray[this.index1].position != "top" || this.refcpyArray[this.index1].previousIndex != undefined) {
  //          this.index1 = this.refcpyArray[this.index1].previousIndex
  //        }
  //      }
  //      this.moveFrom = this.refQues.nativeElement.children[this.index1].children[0].getBoundingClientRect();
  //      this.moveTo = this.optionsBlock.nativeElement.children[0].children[idx].children[1].children[1].getBoundingClientRect();
  //      this.moveleft = this.moveTo.left - this.moveFrom.left;
  //      this.movetop = this.moveTo.top - this.moveFrom.top;
  //      $(this.refQues.nativeElement.children[this.index1].children[0]).animate({ left: this.moveleft, top: this.movetop }, 1000, () => {
  //        clearInterval(this.blinkTimeInterval);
  //        this.fetchAnswer.splice(idx, 1, this.refcpyArray[this.index1]);
  //        this.optionObj[idx].placed = true;
  //        this.optionObj[idx].sequenceNo = this.refcpyArray[this.index1].sequenceNo;
  //        //if (this.countofAnimation != undefined) {
  //        //if (this.countofAnimation != 0 && this.optionObj[this.prevOptIdx].placed) {
  //        //  this.optionsBlock.nativeElement.children[0].children[this.prevOptIdx].children[1].style.pointerEvents = "none";
  //        //}
  //        //if (this.countofAnimation == this.originalArray.length-1) {
  //        //  this.optionsBlock.nativeElement.children[0].children[idx].children[1].style.pointerEvents = "none";
  //        //}
  //        this.countofAnimation++;
  //          this.prevOptIdx = idx;
  //        //}

  //        this.refcpyArray[this.index1].position = "down";
  //        this.prevIdx = this.index1;
  //        if (this.refcpyArray.length > this.originalArray.length) {
  //          this.curr++;
  //          this.index1 = this.curr;
  //        } else {
  //          this.index1++;
  //        }
  //        this.startCount = 1;
  //        this.blinkHolder();

  //        //this.optionsBlock.nativeElement.children[0].children[idx].children[1].style.pointerEvents = "none";
  //        //this.indexArray.splice(this.index, 1);
  //        //this.fetchAnswer.splice(idx, 1, this.refcpyArray[this.currentIndex]);
  //        //if (this.indexArray.length > 0) {

  //        //  //this.getRandomIndex(this.indexArray.length);
  //        //}
  //      });
  //    }
  //    //if (this.feedback.correct_ans_index.includes(opt.id)) {
  //    //  this.noOfRightAnsClicked++;
  //    //  this.rightansArray.push(opt);
  //    //} else {
  //    //  this.noOfWrongAnsClicked++;
  //    //  this.wrongansArray.push(opt);
  //    //}
  //    //this.optionsBlock.nativeElement.children[i].children[j].className += " disable_div";
  //    //this.optionsBlock.nativeElement.children[i].children[j].style = "opacity:0.3";
  //    this.appModel.notifyUserAction();
  //  }
  //}

  checkAllowed(idx,placed){
    if(this.isAllowed){
      this.onClickoption(idx, placed)
    }
    else {console.log("animation in progress")}
  }

  onClickoption(idx, placed) {
    if (!this.narrator.nativeElement.paused! || !this.instruction.nativeElement.paused ) {
      console.log("narrator/instruction voice still playing");
    } else {
      this.startCount = 0;
      for (let x = 0; x < this.optionObj.length; x++) {
        this.optionsBlock.nativeElement.children[0].children[x].children[1].children[0].style.pointerEvents = "none";
      }
      //this.refcpyArray[this.currentIndex].imgsrc = this.refcpyArray[this.currentIndex].imgsrc_original;
      this.refcpyArray[this.index1].imgsrc = this.refcpyArray[this.index1].imgsrc_original;
      if (placed) {
        this.optionsBlock.nativeElement.children[0].children[idx].children[1].children[1].classList.value = "img-fluid optItem";
        this.refQues.nativeElement.children[this.optionObj[idx].sequenceNo - 1].children[0].style.visibility = "";
        //this.moveFrom = this.optionsBlock.nativeElement.children[0].children[idx].children[1].children[1].getBoundingClientRect();
        //this.moveTo = this.refQues.nativeElement.children[this.prevIdx].children[0].getBoundingClientRect();
        //this.moveleft = this.moveFrom.left - this.moveTo.left;
        //this.movetop = this.moveFrom.top - this.moveTo.top;
        this.isAllowed = false;
        $(this.refQues.nativeElement.children[this.optionObj[idx].sequenceNo - 1].children[0]).animate({ left: 0, top: 0 }, 1000, () => {
          clearInterval(this.blinkTimeInterval);
          this.isAllowed = true
          for (let x = 0; x < this.optionObj.length; x++) {
            this.optionsBlock.nativeElement.children[0].children[x].children[1].children[0].style.pointerEvents = "";
          }
          this.countofAnimation--;
          if (this.countofAnimation == 0) {
            this.appModel.enableSubmitBtn(false);
            this.appModel.enableReplayBtn(true);
          }
          this.optionObj[idx].placed = false;
          this.optionsBlock.nativeElement.children[0].children[idx].children[1].children[0].src = this.containgFolderPath + "/" + this.optionObj[idx].dropBoxImg_original.url;
          this.refcpyArray[this.optionObj[idx].sequenceNo - 1].position = "top";
          //this.refcpyArray[this.prevIdx].previousIndex = this.prevIdx;
          //this.refcpyArray.push(this.refcpyArray[this.prevIdx]);
          this.prevIdx = this.index1;
          //this.index1++;
          this.startCount = 1;
          this.blinkHolder();
          //this.optionsBlock.nativeElement.children[0].children[idx].children[1].style.pointerEvents = "none";
          //this.indexArray.splice(this.index, 1);
          //this.fetchAnswer.splice(idx, 1, this.refcpyArray[this.currentIndex]);
          //if (this.indexArray.length > 0) {

          //  //this.getRandomIndex(this.indexArray.length);
          //}
        });
      } else {
        //if (this.refcpyArray.length > this.originalArray.length) {
        //  //console.log("something");
        //  this.curr = this.index1;
        //  if (this.refcpyArray[this.index1].position != "top" || this.refcpyArray[this.index1].previousIndex != undefined) {
        //    this.index1 = this.refcpyArray[this.index1].previousIndex
        //  }
        //}
        this.moveFrom = this.refQues.nativeElement.children[this.index1].children[0].getBoundingClientRect();
        this.moveTo = this.optionsBlock.nativeElement.children[0].children[idx].children[1].children[1].getBoundingClientRect();
        this.moveleft = this.moveTo.left - this.moveFrom.left;
        this.movetop = this.moveTo.top - this.moveFrom.top;
        this.isAllowed = false;
        $(this.refQues.nativeElement.children[this.index1].children[0]).animate({ left: this.moveleft, top: this.movetop }, 1000, () => {
          clearInterval(this.blinkTimeInterval);
          this.isAllowed = true;
          this.optionsBlock.nativeElement.children[0].children[idx].children[1].children[1].src = this.containgFolderPath + "/" + this.refQuesObj[this.index1].imgsrc_original.url;
          this.refQues.nativeElement.children[this.index1].children[0].style.visibility = "hidden";
          this.optionsBlock.nativeElement.children[0].children[idx].children[1].children[1].classList.value = "img-fluid optItemVisible";
          for (let x = 0; x < this.optionObj.length; x++) {
            this.optionsBlock.nativeElement.children[0].children[x].children[1].children[0].style.pointerEvents = "";
          }
          this.fetchAnswer.splice(idx, 1, this.refcpyArray[this.index1]);
          this.optionObj[idx].placed = true;
          this.refcpyArray[this.index1].placedInOption = idx;
          this.optionObj[idx].sequenceNo = this.refcpyArray[this.index1].sequenceNo;
          this.refQues.nativeElement.children[this.index1].children[0].style.cursor = "pointer";
          this.optionsBlock.nativeElement.children[0].children[idx].children[1].children[0].src = this.containgFolderPath + "/" + this.optionObj[idx].dropBoxImgHover.url;
          //if (this.countofAnimation != undefined) {
          //if (this.countofAnimation != 0 && this.optionObj[this.prevOptIdx].placed) {
          //  this.optionsBlock.nativeElement.children[0].children[this.prevOptIdx].children[1].style.pointerEvents = "none";
          //}
          //if (this.countofAnimation == this.originalArray.length-1) {
          //  this.optionsBlock.nativeElement.children[0].children[idx].children[1].style.pointerEvents = "none";
          //}
          this.countofAnimation++;
          if (this.countofAnimation > 0) {
            this.appModel.enableSubmitBtn(true);
            this.appModel.enableReplayBtn(false);
          }
          this.prevOptIdx = idx;
          //}

          this.refcpyArray[this.index1].position = "down";
          //this.prevIdx = this.index1;
          //if (this.refcpyArray.length > this.originalArray.length) {
          //  this.curr++;
          //  this.index1 = this.curr;
          //} else {
          this.index1++;
          //}
          this.startCount = 1;
          if (this.refcpyArray.length == this.index1) {
            this.index1 = 0;
          }
          this.blinkHolder();


          //this.optionsBlock.nativeElement.children[0].children[idx].children[1].style.pointerEvents = "none";
          //this.indexArray.splice(this.index, 1);
          //this.fetchAnswer.splice(idx, 1, this.refcpyArray[this.currentIndex]);
          //if (this.indexArray.length > 0) {

          //  //this.getRandomIndex(this.indexArray.length);
          //}
        });
      }
      //if (this.feedback.correct_ans_index.includes(opt.id)) {
      //  this.noOfRightAnsClicked++;
      //  this.rightansArray.push(opt);
      //} else {
      //  this.noOfWrongAnsClicked++;
      //  this.wrongansArray.push(opt);
      //}
      //this.optionsBlock.nativeElement.children[i].children[j].className += " disable_div";
      //this.optionsBlock.nativeElement.children[i].children[j].style = "opacity:0.3";
      this.appModel.notifyUserAction();
    }
  }

  endedHandleronSkip() {    
    this.isPlayVideo = false;   
    this.appModel.navShow = 2;  
    this.appModel.videoStraming(false);
    this.appModel.notifyUserAction();   
}


PlayPauseVideo(){
  if(this.PlayPauseFlag)
  {
    this.mainVideo.nativeElement.pause();
    this.quesObj.quesPlayPause = this.quesObj.quesPlay;
    this.PlayPauseFlag = false;
  }
  else{
    this.mainVideo.nativeElement.play();
    this.quesObj.quesPlayPause = this.quesObj.quesPause;
    this.PlayPauseFlag = true;
  }
  
}

hoverSkip(){
 // this.skipFlag = false;
 this.quesObj.quesSkip = this.quesObj.quesSkipHover;
}
houtSkip(){
  this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
}

  onClickquesFromOpt(idx, opt) {
    console.log("click on ques");
    this.optionsBlock.nativeElement.children[0].children[idx].children[1].children[1].classList.value = "img-fluid optItem";
    this.refQues.nativeElement.children[this.optionObj[idx].sequenceNo - 1].children[0].style.visibility = "";
    if (opt.placed) {
      this.startCount = 0;
      //this.moveFrom = this.optionsBlock.nativeElement.children[0].children[idx].children[1].children[1].getBoundingClientRect();
      //this.moveTo = this.refQues.nativeElement.children[this.prevIdx].children[0].getBoundingClientRect();
      //this.moveleft = this.moveFrom.left - this.moveTo.left;
      //this.movetop = this.moveFrom.top - this.moveTo.top;
      $(this.refQues.nativeElement.children[this.optionObj[idx].sequenceNo - 1].children[0]).animate({ left: 0, top: 0 }, 1000, () => {
        clearInterval(this.blinkTimeInterval);
        this.countofAnimation--;
        this.optionsBlock.nativeElement.children[0].children[idx].children[1].children[0].src = this.containgFolderPath + "/" + this.optionObj[idx].dropBoxImg_original.url;
        this.optionObj[idx].placed = false;
        this.refcpyArray[this.optionObj[idx].sequenceNo - 1].position = "top";
        //this.refcpyArray[this.prevIdx].previousIndex = this.prevIdx;
        //this.refcpyArray.push(this.refcpyArray[this.prevIdx]);
        this.prevIdx = this.index1;
        //this.index1++;
        this.startCount = 1;
        this.blinkHolder();
        //this.optionsBlock.nativeElement.children[0].children[idx].children[1].style.pointerEvents = "none";
        //this.indexArray.splice(this.index, 1);
        //this.fetchAnswer.splice(idx, 1, this.refcpyArray[this.currentIndex]);
        //if (this.indexArray.length > 0) {

        //  //this.getRandomIndex(this.indexArray.length);
        //}
      });
    }
  }

  blinkOnLastQues() {
    if (this.appModel.isLastSectionInCollection) {
      this.appModel.blinkForLastQues();
      this.appModel.stopAllTimer();
      if (!this.appModel.eventDone) {
        if (this.isLastQuesAct) {
          this.appModel.eventFired();
          this.appModel.event = { 'action': 'segmentEnds' };
        }
        if (this.isLastQues) {
          this.appModel.event = { 'action': 'end' };
        }
      }
    } else {
      if(this.attemptType == "manual"){
        this.appModel.moveNextQues(this.attemptType);
        }
        else{
          this.appModel.moveNextQues();
        }    }
  }


  ngOnInit() {
    if (this.appModel.isNewCollection) {
      this.appModel.event = { 'action': 'segmentBegins' };
    }
    this.containgFolderPath = this.getBasePath();
    this.appModel.functionone(this.templatevolume,this);

    this.setData();
    this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
      if (mode == "manual") {
        //show modal for manual
        this.matched = true;
        this.rightanspopUpheader_img = false;
        this.wronganspopUpheader_img = false;
        this.showanspopUpheader_img = true;
        this.partialCorrectheaderTxt_img = false;
        this.styleHeaderPopup = this.feedbackObj.style_header;
        this.styleBodyPopup = this.feedbackObj.style_body;
        this.startCount = 0;
        this.attemptType = "showAnswer";
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          $("#instructionBar").addClass("disable_div");
          this.popupRef.nativeElement.classList = "displayPopup modal";
          this.setRightFeedback();
        }
      } else if (mode == "auto") {
        this.matched = true;
        //show modal of auto
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          $("#instructionBar").addClass("disable_div");
          $("#instructionBar").css("opacity", "0.3");
          $(".bodyContent").addClass("disable_div");
          $(".bodyContent").css("opacity", "0.3");
          this.checked = true;
          this.rightanspopUpheader_img = false;
          this.wronganspopUpheader_img = false;
          this.showanspopUpheader_img = true;
          this.startCount=0;
          this.attemptType = "showAnswer";
          this.partialCorrectheaderTxt_img = false;
          this.styleHeaderPopup = this.feedbackObj.style_header;
          this.styleBodyPopup = this.feedbackObj.style_body;
          this.confirmModalRef.nativeElement.classList="modal";
          this.confirmReplayRef.nativeElement.classList="modal";
          this.submitModalRef.nativeElement.classList="modal";
          this.popupRef.nativeElement.classList = "displayPopup modal";
          //this.appModel.enableReplayBtn(true);
          this.noOfRightAnsClicked = 0;
          this.noOfWrongAnsClicked = 0;
          this.setRightFeedback();
        }
      } else if (mode == "submit") {
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          $("#instructionBar").addClass("disable_div");         
          this.setFeedback();
          this.popupRef.nativeElement.classList = "displayPopup modal";
        }
      }
    })


    this.appModel.getConfirmationPopup().subscribe((action) => {
      this.appModel.notifyUserAction();
      if (action == "uttarDikhayein") {
        
        if (!this.instruction.nativeElement.paused)
        {
          this.instruction.nativeElement.pause();
          this.instruction.nativeElement.currentTime = 0;
        }
        if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
          $("#instructionBar").addClass("disable_div");
          this.confirmModalRef.nativeElement.classList = "displayPopup modal";
        }
      }
      if (action == "submitAnswer") {
        if (!this.instruction.nativeElement.paused)
            {
              this.instruction.nativeElement.pause();
              this.instruction.nativeElement.currentTime = 0;
            }
        this.submitModalRef.nativeElement.classList = "displayPopup modal";
      }
      if (action == "replayVideo") {
        if (!this.instruction.nativeElement.paused)
            {
              this.instruction.nativeElement.pause();
              this.instruction.nativeElement.currentTime = 0;
            }
        this.appModel.videoStraming(true);
        if (this.confirmReplayRef && this.confirmReplayRef.nativeElement) {
          $("#optionsBlock .options").addClass("disable_div");
          this.confirmReplayRef.nativeElement.classList = "displayPopup modal";
          this.PlayPauseFlag = true;
          this.quesObj.quesPlayPause = this.quesObj.quesPause;
          this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
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
        this.appModel.event = { 'action': 'end' };
      }
    })

    this.appModel.postWrongAttempt.subscribe(() => {
			this.postWrongAttempt()
		});
    this.appModel.resetBlinkingTimer()
  }

  postWrongAttempt(){
    this.resetAttempt();
    this.appModel.notifyUserAction();
  }

  templatevolume(vol, obj) {
    if (obj.narrator && obj.narrator.nativeElement) {
      obj.narrator.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.mainVideo && obj.mainVideo.nativeElement) {
      obj.mainVideo.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.optionAudio && obj.optionAudio.nativeElement) {
      obj.optionAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackPopupAudio && obj.feedbackPopupAudio.nativeElement) {
      obj.feedbackPopupAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.instruction && obj.instruction.nativeElement) {
      obj.instruction.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackpartialPopupAudio && obj.feedbackpartialPopupAudio.nativeElement) {
      obj.feedbackpartialPopupAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackInfoAudio && obj.feedbackInfoAudio.nativeElement) {
      obj.feedbackInfoAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
  }

  checkImgLoaded() {
    if (!this.loadFlag) {
      this.noOfImgsLoaded++;
      if (this.noOfImgsLoaded >= this.noOfImgs) {
        this.appModel.setLoader(false);
        this.loadFlag = true;
        clearTimeout(this.loaderTimer);
        clearTimeout(this.blinkTimeInterval);
        this.startCount = 0;
        this.checkforQVO();
      }
    }
  }

  close() {
    //this.appModel.event = { 'action': 'exit', 'currentPosition': this.currentVideoTime };
    this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
  }

  checkVideoLoaded() {
    if (!this.videoReplayd) {
      this.appModel.setLoader(false);
      this.appModel.navShow = 1;
      this.isPlayVideo = true;
      this.appModel.isVideoPlayed = true;
      this.appModel.stopAllTimer();
    }
  }

  endedHandler() {
    if (!this.videoReplayd) {
      this.isPlayVideo = false;
      this.appModel.navShow = 2;
      this.appModel.setLoader(true);
      this.appModel.startPreviousTimer();
    }
  }

  checkforQVO() {
    if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
      this.narrator.nativeElement.src = this.quesObj.quesInstruction.location == "content" ? this.containgFolderPath + "/" + this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
      this.appModel.handlePostVOActivity(true);
      this.appModel.enableSubmitBtn(false);
      
      $(".bodyContent").addClass("disable_div");
      this.narrator.nativeElement.play();
      this.narrator.nativeElement.onended = () => {
        $(".instructionBar").css("cursor", "pointer");
        $(".bodyContent").removeClass("disable_div");
        this.isQuesTypeImage = true;
        this.startActivity();
        this.appModel.handlePostVOActivity(false);
        this.appModel.enableReplayBtn(true);
      }
    } else {
      this.startActivity();
      this.appModel.handlePostVOActivity(false);
      this.appModel.enableSubmitBtn(false);
      this.appModel.enableReplayBtn(true);
    }
  }

  startActivity() {
    this.startCount = 1;
    //this.getRandomIndex(this.indexArray.length);
    //this.blinkHolder();
    this.blinkHolder();
  }

  //getRandomIndex(no) {
  //  this.index = Math.floor(Math.random() * no);
  //  this.currentIndex = this.indexArray[this.index];
  //  this.blinkHolder(this.currentIndex);
  //}

  blinkHolder() {
    this.blinkFlag = true;
    this.blinkTimeInterval = setInterval(() => {
      if (this.startCount == 1) {
        this.blinkHolderImg(this.index1);
      } else {
        clearInterval(this.blinkTimeInterval);
        for (let i = 0; i < this.refcpyArray.length; i++) {
          this.refQues.nativeElement.children[i].children[0].src = this.refcpyArray[i].imgsrc_original.location == "content" ? this.containgFolderPath + "/" + this.refcpyArray[i].imgsrc_original.url : this.assetsPath + "/" + this.refcpyArray[i].imgsrc_original.url;
        }
        //console.log(this.optionsBlock.nativeElement);
        //console.log(this.optionObj);
        //for (let i = 0; i < this.optionsBlock.nativeElement.children.length; i++) {
        //  if (this.optionObj[i] && this.optionObj[i].imgsrc_original) {
        //    this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_original;
        //  }
        //}
      }
    }, 300);
  }

  //blinkHolder(idx) {
  //  this.blinkFlag = true;
  //  this.blinkTimeInterval = setInterval(() => {
  //    if (this.startCount == 1) {
  //      this.blinkHolderImg(idx);
  //    } else {
  //      clearInterval(this.blinkTimeInterval);
  //      //console.log(this.optionsBlock.nativeElement);
  //      //console.log(this.optionObj);
  //      //for (let i = 0; i < this.optionsBlock.nativeElement.children.length; i++) {
  //      //  if (this.optionObj[i] && this.optionObj[i].imgsrc_original) {
  //      //    this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_original;
  //      //  }
  //      //}
  //    }
  //  }, 300);
  //}

  //blinkHolderImg(i) {
  //  if (this.refcpyArray[i] && this.refcpyArray[i].imgsrc_blink) {
  //    if (this.blinkFlag) {
  //      this.refcpyArray[i].imgsrc = this.refcpyArray[i].imgsrc_blink;
  //      this.blinkFlag = false;
  //    } else {
  //      this.refcpyArray[i].imgsrc = this.refcpyArray[i].imgsrc_original;
  //      this.blinkFlag = true;
  //    }
  //    }
  //  //} else {
  //  //  //++this.index1;
  //  //  //this.index2 = 0;
  //  //  this.blinkHolderImg(this.index1);
  //  //}
  //}

  blinkHolderImg(i) {
    if (this.refcpyArray[i] && this.refcpyArray[i].imgsrc_blink && this.refcpyArray[i].position == "top") {
      if (this.blinkFlag) {
        this.refcpyArray[i].imgsrc = this.refcpyArray[i].imgsrc_blink;
        this.blinkFlag = false;
      } else {
        this.refcpyArray[i].imgsrc = this.refcpyArray[i].imgsrc_original;
        this.blinkFlag = true;
      }
    }
    else {
      ++this.index1;
      //this.index2 = 0;
      if (this.refcpyArray.length == this.index1) {
        this.index1 = 0;

      }
      if (this.countofAnimation < this.refcpyArray.length) {
        this.blinkHolderImg(this.index1);
      }
    }
  }

  setData() {

    if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
      let fetchedData: any = this.appModel.content.contentData.data;
      console.log(fetchedData);
      this.feedback = fetchedData.feedback;
      this.commonAssets = fetchedData.commonassets;
      this.narratorAudio = fetchedData.commonassets.narrator;
      this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
      this.ques_control = fetchedData.commonassets.ques_control;
      this.noOfImgs = this.commonAssets.imgCount;
      this.isFirstQues = this.commonAssets.isFirstQues;
      this.isLastQues = this.appModel.isLastSection;
      this.isLastQuesAct = this.appModel.isLastSectionInCollection;
      if (this.isLastQuesAct || this.isLastQues) {
        this.appModel.setlastQuesNT();
      }
      this.refQuesObj = fetchedData.refQuesObj;
      for (let x = 0; x < this.refQuesObj.length; x++) {
        this.refQuesObj[x].imgsrc = this.refQuesObj[x].imgsrc_original;
        this.refQuesObj[x].position = "top";
      }
      //this.orginalArray = [];
      for (let i = 0; i < this.refQuesObj.length; i++) {
        this.originalArray.push(this.refQuesObj[i]);
      }
      this.refcpyArray = this.originalArray.slice();
      for (var i = 0; i < this.refcpyArray.length; i++) {
        this.indexArray.push(i);
        this.fetchAnswer.push(i);
      }
      this.optionObj = fetchedData.optionObj;
      for (let x = 0; x < this.optionObj.length; x++) {
        this.optionObj[x].placed = false;
      }
      this.optionCommonAssets = fetchedData.option_common_assets;
      console.log(this.optionCommonAssets);
      this.feedbackObj = fetchedData.feedback;
      this.correctImg = this.feedbackObj.popup_commmon_imgs.correctimg;
      this.incorrectImg = this.feedbackObj.popup_commmon_imgs.incorrectimg;
      this.rightAnspopupAssets = this.feedbackObj.right_ans_popup;
      this.confirmPopupAssets = fetchedData.feedback.confirm_popup;
      this.infoPopupAssets = fetchedData.feedback.info_popup;
      this.submitPopupAssets = fetchedData.feedback.submit_popup;
      this.replayconfirmAssets = fetchedData.feedback.replay_confirm;
      this.quesObj = fetchedData.quesObj;
      if (this.quesObj.questype == "image") {
        this.quesFlag = true;
      } else {
        this.quesFlag = false;
      }
      if (this.quesObj.quesVideo && this.quesObj.quesVideo.autoPlay && !this.appModel.isVideoPlayed) {
        this.isPlayVideo = true;
        //sessionStorage.setItem("isPlayVideo", "true");
      } else {
        this.isPlayVideo = false;
      }
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

  showFeedback(id: string, flag: string) {
    if (id == "submit-modal-id") {
      this.submitModalRef.nativeElement.classList = "modal";
      //this.optionsBlock.nativeElement.classList = "row mx-0";
      //$("#optionsBlock .options").css("opacity", "unset");
      //$("#optionsBlock .options").removeClass("disable_div");
    }
    if (id == "info-modal-id") {
      this.infoModalRef.nativeElement.classList = "modal";
      if (this.feedbackInfoAudio && !this.feedbackInfoAudio.nativeElement.paused) {
        this.feedbackInfoAudio.nativeElement.pause();
        this.feedbackInfoAudio.nativeElement.currentTime = 0;
      }
    }
    if (flag == "yes") {
      if (this.countofAnimation != this.originalArray.length) {
        this.infoModalRef.nativeElement.classList = "displayPopup modal";
        let partialFeedbackAudio = this.infoPopupAssets.partialCorrectAudio;
        this.feedbackInfoAudio.nativeElement.src = partialFeedbackAudio.location == "content" ? this.containgFolderPath + "/" + partialFeedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + partialFeedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
        this.feedbackInfoAudio.nativeElement.play();
        this.appModel.notifyUserAction();
      } else {
        //$("#optionsBlock .options").css("pointer-events", "none");
        setTimeout(() => {
          this.appModel.invokeTempSubject('showModal', 'submit');
        }, 100);
      }
    } else {
      this.appModel.notifyUserAction();
    }
  }

  dontshowFeedback(id: string, flag: string) {
    if (id == "submit-modal-id") {
      this.submitModalRef.nativeElement.classList = "modal";
      //this.optionsBlock.nativeElement.classList = "row mx-0";
      $("#optionsBlock .options").removeClass("disable_div");
      $("#optionsBlock .options").css("opacity", "unset");
      this.appModel.enableSubmitBtn(true);
      this.appModel.notifyUserAction();
      //let i = 0;
      for (let i = 0; i < this.refcpyArray.length; i++) {
        this.refQues.nativeElement.children[i].children[0].src = this.refcpyArray[i].imgsrc_original.location == "content" ? this.containgFolderPath + "/" + this.refcpyArray[i].imgsrc_original.url : this.assetsPath + "/" + this.refcpyArray[i].imgsrc_original.url;
      }
      //this.resetAttempt();
    }
  }

  setFeedback() {
    for (let x = 0; x < this.fetchAnswer.length; x++) {
      if (this.feedbackObj.correct_ans_index[x].id == this.fetchAnswer[x].id) {
        console.log("RIGHT ANSWER");
        this.noOfRightAnsClicked++;
        this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[0].src = this.correctImg.location == "content" ? this.containgFolderPath + "/" + this.correctImg.url : this.assetsPath + "/" + this.correctImg.url;
        this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[1].src = this.fetchAnswer[x].imgsrc.location == "content" ? this.containgFolderPath + "/" + this.fetchAnswer[x].imgsrc.url : this.assetsPath + "/" + this.fetchAnswer[x].imgsrc.url;
        this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[1].classList.value = "img-fluid optItempopUp";
      } else {
        console.log("WRONG ANSWER");
        this.noOfWrongAnsClicked++;
        this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[0].src = this.incorrectImg.location == "content" ? this.containgFolderPath + "/" + this.incorrectImg.url : this.assetsPath + "/" + this.incorrectImg.url;
        this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[1].src = this.fetchAnswer[x].imgsrc.location == "content" ? this.containgFolderPath + "/" + this.fetchAnswer[x].imgsrc.url : this.assetsPath + "/" + this.fetchAnswer[x].imgsrc.url;
        this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[1].classList.value = "img-fluid optItempopUp";
      }
    }
    if (this.fetchAnswer.length == this.noOfRightAnsClicked) {
      this.rightanspopUpheader_img = true;
      this.wronganspopUpheader_img= false;
      this.showanspopUpheader_img = false;
      this.partialCorrectheaderTxt_img = false;
      this.attemptType = "manual";
      this.styleHeaderPopup = this.feedbackObj.style_header;
      this.styleBodyPopup = this.feedbackObj.style_body;
    } else if (this.fetchAnswer.length == this.noOfWrongAnsClicked) {
      this.rightanspopUpheader_img = false;
      this.wronganspopUpheader_img = true;
      this.showanspopUpheader_img = false;
      this.partialCorrectheaderTxt_img = false;
      this.attemptType = "wrong";
      this.styleHeaderPopup = this.feedbackObj.wrong_style_header;
      this.styleBodyPopup = this.feedbackObj.wrong_style_body;
    } else {
      this.rightanspopUpheader_img = false;
      this.wronganspopUpheader_img = false;
      this.showanspopUpheader_img = false;
      this.partialCorrectheaderTxt_img = true;
      this.attemptType = "partial";
      this.styleHeaderPopup = this.feedbackObj.style_header;
      this.styleBodyPopup = this.feedbackObj.style_body;
    }
    this.setplayFeedbackAudio(0);
  }

  setRightFeedback() {
    for (let x = 0; x < this.feedbackObj.correct_ans_index.length; x++) {
      this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[0].src = this.correctImg.location == "content" ? this.containgFolderPath + "/" + this.correctImg.url : this.assetsPath + "/" + this.correctImg.url;
      this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[1].src = this.feedbackObj.correct_ans_index[x].correctimg.location == "content" ? this.containgFolderPath + "/" + this.feedbackObj.correct_ans_index[x].imgsrc.url : this.assetsPath + "/" + this.feedbackObj.correct_ans_index[x].imgsrc.url;
      this.popupBodyRef.nativeElement.children[0].children[x].children[1].children[1].classList.value = "img-fluid optItempopUp";
    }
    this.setplayrightFeedbackAudio(0);
  }

  setplayFeedbackAudio(i: number) {
    let current = i;
    if (this.fetchAnswer[i] && (this.fetchAnswer[i].correctAudio || this.fetchAnswer[i].incorrectAudio)) {
      if (this.feedbackObj.correct_ans_index[i].id == this.fetchAnswer[i].id) {
        if (this.fetchAnswer[i] && this.fetchAnswer[i].correctAudio) {
          this.feedbackAudio = this.fetchAnswer[i].correctAudio;
          this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.location == "content" ? this.containgFolderPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
          console.log(this.feedbackPopupAudio.nativeElement.src);
        }
      }
      else {
        if (this.fetchAnswer[i] && this.fetchAnswer[i].incorrectAudio) {
          this.feedbackAudio = this.fetchAnswer[i].incorrectAudio;
          this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.location == "content" ? this.containgFolderPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
          console.log(this.feedbackPopupAudio.nativeElement.src);
        }
      }
      this.feedbackPopupAudio.nativeElement.play();
      if (this.popupBodyRef && this.popupBodyRef.nativeElement && this.popupBodyRef.nativeElement.children[0].children[i].children[0]) {
        this.popupBodyRef.nativeElement.children[0].children[i].children[0].classList = "optionAnimate";
      }
      this.feedbackPopupAudio.nativeElement.onended = () => {
        this.popupBodyRef.nativeElement.children[0].children[i].children[0].classList = " ";
        ++current;
        this.setplayFeedbackAudio(current);
      }
    }
    else {
      setTimeout(() => {
        if (this.countofAnimation == this.noOfRightAnsClicked) {
          this.startCount = 0;
          this.matched = true;
          this.closeModal();
          this.appModel.notifyUserAction();
          $("#instructionBar").addClass("disable_div");
          $("#instructionBar").css("opacity", "0.3");
          $(".bodyContent").css("opacity", "0.3");
          $(".bodyContent").addClass("disable_div");
          this.appModel.enableSubmitBtn(false);
        } else {
		  this.closeModal();
          this.resetAttempt();

        }
      }, 200)
    }
  }

  setplayrightFeedbackAudio(i: number) {
    let current = i;
    if (this.feedbackObj.correct_ans_index[i] && this.feedbackObj.correct_ans_index[i].correctAudio) {
      this.feedbackAudio = this.feedbackObj.correct_ans_index[i].correctAudio;
      this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.location == "content" ? this.containgFolderPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
      console.log(this.feedbackPopupAudio.nativeElement.src);
      this.feedbackPopupAudio.nativeElement.play();
      if (this.popupBodyRef && this.popupBodyRef.nativeElement && this.popupBodyRef.nativeElement.children[0].children[i].children[0]) {
        this.popupBodyRef.nativeElement.children[0].children[i].children[0].classList = "optionAnimate";
      }
      this.feedbackPopupAudio.nativeElement.onended = () => {
        this.popupBodyRef.nativeElement.children[0].children[i].children[0].classList = " ";
        ++current;
        this.setplayrightFeedbackAudio(current);
      }
    } else {
      setTimeout(() => {
        this.appModel.enableReplayBtn(false);
        this.startCount = 0;
        this.closeModal();
      }, 200)
    }
  }

  playrightFeedbackAudioPopup(i) {
    let current = i;
    if (this.rightansArray1.length > 0) {
      if (this.rightansArray1[i] && this.rightansArray1[i].imgrightfeedback_audio) {
        this.feedbackAudio = this.rightansArray1[i].imgrightfeedback_audio;
        this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.location == "content" ? this.containgFolderPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
        console.log(this.feedbackPopupAudio.nativeElement.src);
        this.feedbackPopupAudio.nativeElement.play();
        if (this.popupBodyRef && this.popupBodyRef.nativeElement && this.popupBodyRef.nativeElement.children[0].children[i]) {
          //this.popupBodyRef.nativeElement.children[0].children[i].classList = "options optionAnimate";
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " optionAnimate";
        }
        this.feedbackPopupAudio.nativeElement.onended = () => {
          //this.popupBodyRef.nativeElement.children[0].children[i].classList = "options";
          this.popupBodyRef.nativeElement.children[0].children[i].classList.remove("optionAnimate");
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " nutralize";
          ++current;
          this.playrightFeedbackAudioPopup(current);
        }
      } else {
        this.playrightFeedbackAudioPopupforSecondrow(0);
      }
    } else {
      if (this.ansArray1[i] && this.ansArray1[i].imgrightfeedback_audio) {
        this.feedbackAudio = this.ansArray1[i].imgrightfeedback_audio;
        this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.location == "content" ? this.containgFolderPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
        console.log(this.feedbackPopupAudio.nativeElement.src);
        this.feedbackPopupAudio.nativeElement.play();
        if (this.popupBodyRef && this.popupBodyRef.nativeElement && this.popupBodyRef.nativeElement.children[0].children[i]) {
          //this.popupBodyRef.nativeElement.children[0].children[i].classList = "options optionAnimate optionsWidth";
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " optionAnimate";
        }
        this.feedbackPopupAudio.nativeElement.onended = () => {
          //this.popupBodyRef.nativeElement.children[0].children[i].classList = "options optionsWidth";
          this.popupBodyRef.nativeElement.children[0].children[i].classList.remove("optionAnimate");
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " nutralize";
          ++current;
          this.playrightFeedbackAudioPopup(current);
        }
      } else {
        setTimeout(() => {
          this.closeModal();
        }, 2000);
        this.blinkOnLastQues();
        this.appModel.moveNextQues();
      }
    }

  }
  playrightFeedbackAudioPopupforSecondrow(i) {
    let current = i;
    if (this.rightansArray2[i] && this.rightansArray2[i].imgrightfeedback_audio) {
      this.feedbackAudio = this.rightansArray2[i].imgrightfeedback_audio;
      this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.location == "content" ? this.containgFolderPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
      console.log(this.feedbackPopupAudio.nativeElement.src);
      this.feedbackPopupAudio.nativeElement.play();
      if (this.popupBodyRef && this.popupBodyRef.nativeElement && this.popupBodyRef.nativeElement.children[1].children[i]) {
        this.popupBodyRef.nativeElement.children[1].children[i].classList.value += " optionAnimate";
      }
      this.feedbackPopupAudio.nativeElement.onended = () => {
        this.popupBodyRef.nativeElement.children[1].children[i].classList.remove("optionAnimate");
        this.popupBodyRef.nativeElement.children[1].children[i].classList.value += " nutralize";
        ++current;
        this.playrightFeedbackAudioPopupforSecondrow(current);
      }
    } else {
      setTimeout(() => {
        this.closeModal();
      }, 2000);
      this.blinkOnLastQues();
      this.appModel.moveNextQues();
    }
  }
  playrightFeedbackAudioforPartialPopup(i) {
    let current = i;
    if (this.rightansArray[i] && this.rightansArray[i].imgrightfeedback_audio) {
      this.feedbackAudio = this.rightansArray[i].imgrightfeedback_audio;
      this.feedbackpartialPopupAudio.nativeElement.src = this.feedbackAudio.location == "content" ? this.containgFolderPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
      console.log(this.feedbackpartialPopupAudio.nativeElement.src);
      this.feedbackpartialPopupAudio.nativeElement.play();
      if (this.partialpopupBodyRef && this.partialpopupBodyRef.nativeElement && this.partialpopupBodyRef.nativeElement.children[0].children[1].children[i]) {
        //this.partialpopupBodyRef.nativeElement.children[0].children[1].children[i].classList = "options optionAnimate";
        this.partialpopupBodyRef.nativeElement.children[0].children[1].children[i].classList.value += " optionAnimate";
      }
      this.feedbackpartialPopupAudio.nativeElement.onended = () => {
        //this.partialpopupBodyRef.nativeElement.children[0].children[1].children[i].classList = "options";
        this.partialpopupBodyRef.nativeElement.children[0].children[1].children[i].classList.remove("optionAnimate");
        this.partialpopupBodyRef.nativeElement.children[0].children[1].children[i].classList.value += " nutralize";
        ++current;
        this.playrightFeedbackAudioforPartialPopup(current);
      }
    } else {
      setTimeout(() => {
        this.playwrongFeedbackAudioforPartialPopup(0);
      }, 1000);

    }
  }
  playwrongFeedbackAudioforPartialPopup(i) {
    let current = i;
    if (this.wrongansArray[i] && this.wrongansArray[i].imgwrongfeedback_audio) {
      this.feedbackAudio = this.wrongansArray[i].imgwrongfeedback_audio;
      this.feedbackpartialPopupAudio.nativeElement.src = this.feedbackAudio.location == "content" ? this.containgFolderPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
      console.log(this.feedbackpartialPopupAudio.nativeElement.src);
      this.feedbackpartialPopupAudio.nativeElement.play();
      if (this.partialpopupBodyRef && this.partialpopupBodyRef.nativeElement && this.partialpopupBodyRef.nativeElement.children[1].children[1].children[i]) {
        //this.partialpopupBodyRef.nativeElement.children[1].children[1].children[i].classList = "options optionAnimate";
        this.partialpopupBodyRef.nativeElement.children[1].children[1].children[i].classList.value += " optionAnimate";
      }
      this.feedbackpartialPopupAudio.nativeElement.onended = () => {
        //this.partialpopupBodyRef.nativeElement.children[1].children[1].children[i].classList = "options";
        this.partialpopupBodyRef.nativeElement.children[1].children[1].children[i].classList.remove("optionAnimate");
        this.partialpopupBodyRef.nativeElement.children[1].children[1].children[i].classList.value += " nutralize";
        ++current;
        this.playwrongFeedbackAudioforPartialPopup(current);
      }
    } else {
      setTimeout(() => {
        this.closeModal();
      }, 2000)
    }
  }
  resetAttempt() {
    for (var i = 0; i < this.refcpyArray.length; i++) {
      this.optionObj[i].placed = false;
      this.refcpyArray[i].position = "top";
      this.refQues.nativeElement.children[i].children[0].style.visibility = "";
      this.optionsBlock.nativeElement.children[0].children[i].children[1].children[1].classList.value = "img-fluid optItem";
      this.optionsBlock.nativeElement.children[0].children[i].children[1].children[0].src = this.containgFolderPath + "/" + this.optionObj[i].dropBoxImg_original.url;
      $(this.refQues.nativeElement.children[i].children[0]).animate({ left: 0, top: 0 }, 1000);
    }
    this.appModel.enableReplayBtn(true);
    this.countofAnimation = 0;
    this.noOfRightAnsClicked = 0;
    clearInterval(this.blinkTimeInterval);
    this.index1 = 0;
    this.startCount = 1;
    this.blinkHolder();
    //this.appModel.enableReplayBtn(true);
  }
  playFeedbackAudio(i, j, flag) {
    if (this.popupBodyRef.nativeElement.children[0].children[i] != undefined && !flag) {
      if ((this.noOfRightAnsClicked == this.feedback.correct_ans_index.length) && this.noOfWrongAnsClicked == 0) {
        if (this.ansArray1.length > 0) {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " optionAnimate optionsWidth";
          this.popupBodyRef.nativeElement.children[0].children[i].children[1].src = this.containgFolderPath + "/" + this.ansArray1[i].imgrightfeedback_audio.url;
        }

        if (this.AnsObj.length > 0) {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " optionAnimate";
          this.popupBodyRef.nativeElement.children[0].children[i].children[1].src = this.containgFolderPath + "/" + this.AnsObj[0][i].imgrightfeedback_audio.url;
        }
        this.popupBodyRef.nativeElement.children[0].children[i].children[1].load();
        this.popupBodyRef.nativeElement.children[0].children[i].children[1].play();
        this.popupBodyRef.nativeElement.children[0].children[i].children[1].onended = () => {
          if (this.ansArray1.length > 0) {
            //this.popupBodyRef.nativeElement.children[0].children[i].classList = "options optionsWidth";
            this.popupBodyRef.nativeElement.children[0].children[i].classList.remove("optionAnimate");
            this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " nutralize";
          }
          if (this.AnsObj.length > 0) {
            this.popupBodyRef.nativeElement.children[0].children[i].classList.remove("optionAnimate");
            this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " nutralize";
          }
          i++;
          this.playFeedbackAudio(i, undefined, false);
        }
      }
      if (this.noOfRightAnsClicked == 0 && this.noOfWrongAnsClicked > 0) {
        $("#optionsBlock").removeClass("disableDiv");
        $("#optionsBlock .options").css("pointer-events", "unset");
        if (this.ansArray1.length > 0) {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " optionAnimate optionsWidth";
          this.popupBodyRef.nativeElement.children[0].children[i].children[1].src = this.containgFolderPath + "/" + this.ansArray1[i].imgwrongfeedback_audio.url;
        }
        if (this.AnsObj.length > 0) {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " optionAnimate";
          this.popupBodyRef.nativeElement.children[0].children[i].children[1].src = this.containgFolderPath + "/" + this.AnsObj[0][i].imgwrongfeedback_audio.url;
        }

        this.popupBodyRef.nativeElement.children[0].children[i].children[1].load();
        this.popupBodyRef.nativeElement.children[0].children[i].children[1].play();
        this.popupBodyRef.nativeElement.children[0].children[i].children[1].onended = () => {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.remove("optionAnimate");
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " nutralize";
          i++;
          this.playFeedbackAudio(i, undefined, false);
        }
      }
    }
    else if (this.noOfRightAnsClicked > 4 || this.noOfWrongAnsClicked > 4) {
      flag = true;
      if (j == undefined) {
        j = 0;
      }
      $("#optionsBlock").removeClass("disableDiv");
      if (this.popupBodyRef.nativeElement.children[1].children[j] != undefined && flag) {
        //this.popupBodyRef.nativeElement.children[1].children[j].classList = "options optionAnimate";
        this.popupBodyRef.nativeElement.children[1].children[j].classList.value += " optionAnimate";
        if ((this.noOfRightAnsClicked == this.feedback.correct_ans_index.length) && this.noOfWrongAnsClicked == 0) {
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].src = this.containgFolderPath + "/" + this.AnsObj[1][j].imgrightfeedback_audio.url;
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].load();
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].play();
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].onended = () => {
            //this.popupBodyRef.nativeElement.children[1].children[j].classList = "options";
            this.popupBodyRef.nativeElement.children[1].children[j].classList.remove("optionAnimate");
            this.popupBodyRef.nativeElement.children[1].children[j].classList.value += " nutralize";
            j++;
            this.playFeedbackAudio(j, j, true);
          }
        }
        if (this.noOfRightAnsClicked == 0 && this.noOfWrongAnsClicked > 0) {
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].src = this.containgFolderPath + "/" + this.AnsObj[1][j].imgwrongfeedback_audio.url;
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].load();
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].play();
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].onended = () => {
            this.popupBodyRef.nativeElement.children[1].children[j].classList.remove("optionAnimate");
            this.popupBodyRef.nativeElement.children[1].children[j].classList.value += " nutralize";
            j++;
            this.playFeedbackAudio(j, j, true);
          }
        }
      } else {
        setTimeout(() => {
          this.closeModal();
        }, 2000);
      }

    } else {
      setTimeout(() => {
        if (!(this.noOfRightAnsClicked == 0 && this.noOfWrongAnsClicked > 0)) {
          this.blinkOnLastQues();
        }
        this.closeModal();
      }, 2000);
      //this.blinkOnLastQues();
    }
  }
  sendFeedback(id: string, flag: string) {
    this.confirmModalRef.nativeElement.classList = "modal";
    
    this.noOfRightAnsClicked = 0;
    this.noOfWrongAnsClicked = 0;
    if (flag == "yes") {
      this.appModel.enableSubmitBtn(false);
      $(".bodyContent").css("opacity", "0.3");
      $(".bodyContent").addClass("disable_div");
      setTimeout(() => {
        this.appModel.resetBlinkingTimer();
        this.appModel.invokeTempSubject('showModal', 'manual');
      }, 100);

      $("#instructionBar").addClass("disable_div");
      //$(".modal-body .options .img-fluid").css("pointer-events", "none");
      $("#instructionBar").css("opacity", "0.3");
      this.checked = true;
    } else {
      this.appModel.notifyUserAction();
      $("#instructionBar").removeClass("disable_div");
    }
  }

  showReplay(ref, flag: string, action?: string) {
    ref.classList = "modal";
    this.appModel.navShow = 1;
    this.appModel.notifyUserAction();
    if (flag == "yes") {
      if (action == "replay") {
        this.replayVideo();
      }
    } else if (flag == "no") {
      this.appModel.videoStraming(false);
      this.appModel.navShow = 2;
      setTimeout(() => {
        $("#instructionBar").removeClass("disable_div");
        $("#optionsBlock .options").removeClass("disable_div");
      }, 1000);
    }
  }

  replayVideo() {
    this.appModel.navShow = 1;
    this.videoReplayd = true;
    this.isPlayVideo = true;
    this.appModel.enableSubmitBtn(false);
    $("#optionsBlock .options").addClass("disable_div");
    $(".instructionBase").addClass("disable_div");
    setTimeout(() => {
      this.mainVideo.nativeElement.play();
      //this.appModel.stopAllTimer();
      this.mainVideo.nativeElement.onended = () => {
        //this.appModel.enableSubmitBtn(true);
        $("#optionsBlock .options").removeClass("disable_div");
        $(".instructionBase").removeClass("disable_div");
        this.appModel.navShow = 2;
        this.isPlayVideo = false;
        this.appModel.videoStraming(false);
        this.appModel.notifyUserAction();
      }
    }, 500)
  }

  closeModal() {
    for (let i = 0; i < this.popupBodyRef.nativeElement.children[0].children.length; i++) {
      this.popupBodyRef.nativeElement.children[0].children[i].children[0].classList.value = "";
    }
    if (this.countofAnimation == this.noOfRightAnsClicked) {
      this.matched = true;
      $("#instructionBar").addClass("disable_div");
      $("#instructionBar").css("opacity", "0.3");
      $(".bodyContent").css("opacity", "0.3");
      $(".bodyContent").addClass("disable_div");
      this.appModel.enableSubmitBtn(false);
      this.appModel.enableReplayBtn(false);
    }
    if (this.feedbackPopupAudio && !this.feedbackPopupAudio.nativeElement.paused) {
      this.feedbackPopupAudio.nativeElement.pause();
      this.feedbackPopupAudio.nativeElement.currentTime = 0;
      if (!this.matched) {
        this.resetAttempt();
      }
    }
    //this.startCount = 0;
    this.popupRef.nativeElement.classList = "modal";
    //this.partialpopupRef.nativeElement.classList = "modal";
    this.infoModalRef.nativeElement.classList = "modal";
    //this.confirmReplayRef.nativeElement.classList = "modal";
    //if (!this.matched) {
    //  this.resetAttempt();
    //}
    this.appModel.notifyUserAction();

    if (this.matched) {
      this.blinkOnLastQues();
    }

    if (!this.matched) {
      setTimeout(() => {
        this.appModel.wrongAttemptAnimation();
        $("#instructionBar").removeClass("disable_div");
        $("#optionsBlock .options").removeClass("disable_div");
      }, 1000);
    }

  }
}


