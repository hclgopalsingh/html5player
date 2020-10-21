import { Component, OnInit, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { Subscription } from 'rxjs';
import 'jquery';
import { PlayerConstants } from '../../../common/playerconstants';
import { ThemeConstants } from '../../../common/themeconstants';
import { SharedserviceService } from '../../../services/sharedservice.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  AnimationEvent
} from '@angular/animations';

declare var $: any;

@Component({
  selector: 'ntemp19',
  animations: [
    trigger('openClose', [
        state('open', style({

        })),
        state('closed', style({
            'left': '{{leftPos}}',
            'top': '{{topPos}}',
            // 'width': '{{posWidth}}',
            'position': '{{optPos}}',
            'pointer-events': 'none'

        }), { params: { leftPos: 'auto', topPos: 'auto', optPos: 'relative' } }),
        transition('open => closed', [
            animate('0.5s')
        ]),
        transition('closed => open', [
            animate('0.5s')
        ]),
    ]),
],
  templateUrl: './Ntemplate19.component.html',
  styleUrls: ['./Ntemplate19.component.css']

})

export class Ntemplate19Component implements OnInit {
  constructor(private appModel: ApplicationmodelService, private Sharedservice: SharedserviceService) {
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
  // @ViewChild('instruction') instruction: any;
  @ViewChild('instructionBar') instructionBar: any;
    @ViewChild('instructionVO') instructionVO: any;
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
  @ViewChild('tabularBlock') tabularBlock: any; 
  @ViewChild('tabularBlockinModal') tabularBlockinModal: any; 



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
  isShow: boolean = false;
  helpAudio: any = "";
  correctOpt: any;
  idArray: any = [];
  noOfRightAnsClicked: number = 0;
  noOfWrongAnsClicked: number = 0;
  rightansArray: any = [];
  wrongansArray: any = [];
  AnsObj: any = [];
  ansArray1: any = [];
  Array2required: boolean = false;
  partialpopupRequired: boolean = false;
  isFirstQues: boolean;
  isLastQues: boolean = false;
  isAutoplayOn: boolean;
  isLastQuesAct: boolean;
   /*Start: Theme Implementation(Template Changes)*/
   controlHandler = {
    isSubmitRequired: false,
    isReplayRequired: false
  };
  themePath: any;
  fetchedcontent: any;
  functionalityType: any;
  showAnsTimeout: number;
  /*END: Theme Implementation(Template Changes)*/
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
  tabularBlockObj: any;
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
  currentLeftValue: any;
  optionsAfterFive: number = 4;
  rightAnswerArray: any = [];
  rightanspopUpheader_img: boolean = false;
  wronganspopUpheader_img: boolean = false;
  showanspopUpheader_img: boolean = false;
  partialCorrectheaderTxt_img: boolean = false;
  styleHeaderPopup:any;
  styleBodyPopup:any;
  PlayPauseFlag:boolean = true;
  instructionDisable: boolean = false;
  clickedIndex: any;
  optionPlaceholders: any;
  parentMatrixClass:any;
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
      //this.refQues.nativeElement.children[i].children[0].src = this.refcpyArray[i].imgsrc_original.location == "content" ? this.containgFolderPath + "/" + this.refcpyArray[i].imgsrc_original.url : this.assetsPath + "/" + this.refcpyArray[i].imgsrc_original.url;
    }
    this.index1 = 0;
  }

  // playHoverInstruction() {
  //   if (!this.narrator.nativeElement.paused!) {
  //     console.log("narrator/instruction voice still playing");
  //   } else {
  //     console.log("play on Instruction");
  //     if (this.instruction.nativeElement.paused) {
  //       this.instruction.nativeElement.currentTime = 0;
  //       this.instruction.nativeElement.play();
  //       //this.tabularBlock.nativeElement.style.pointerEvents = "none";
  //       this.instruction.nativeElement.onended = () => {
  //         //this.tabularBlock.nativeElement.style.pointerEvents = "";
  //       }
  //       $(".instructionBase img").css("cursor", "pointer");
  //     }
  //     //if (this.refQues.optionType == "image") {
  //     //  if (!this.optionAudio.nativeElement.paused) {
  //     //    this.instruction.nativeElement.currentTime = 0;
  //     //    this.instruction.nativeElement.pause();
  //     //  }
  //     //}
  //   }
  // }

  playInstruction() {
    this.appModel.notifyUserAction();
    if (this.instructionVO.nativeElement && this.instructionVO.nativeElement.src) {
        this.instructionDisable = true;
        this.instructionVO.nativeElement.play();
        this.instructionVO.nativeElement.onended = () => {
            this.instructionDisable = false;
        }
    }
}

  playHoverOption(opt, i) {
    if (i == this.index1) {
      if (this.optionsBlock.nativeElement.children[2].paused && this.narrator.nativeElement.paused) {
        if (opt.imgsrc_audio && opt.imgsrc_audio.location == "content") {
          this.optionsBlock.nativeElement.children[2].src = this.containgFolderPath + "/" + opt.imgsrc_audio.url;
        } else {
          this.optionsBlock.nativeElement.children[2].src = this.assetsPath + "/" + opt.imgsrc_audio.url;
        }
        this.optionsBlock.nativeElement.children[2].load();
        if (!this.instructionVO.nativeElement.paused) {
          this.instructionVO.nativeElement.pause();
          this.tabularBlock.nativeElement.style.pointerEvents = "";
        }
        this.optionsBlock.nativeElement.children[2].play();
        //this.optionsBlock.nativeElement.children[1].children[i].style.cursor = "pointer";
        for (let x = 0; x < this.optionsBlock.nativeElement.children[1].children.length; x++) {
          if (x != i) {
            this.optionsBlock.nativeElement.children[1].children[x].style.pointerEvents = "none";
          }
        }
        //this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
        this.optionsBlock.nativeElement.children[2].onended = () => {
          for (let x = 0; x < this.optionsBlock.nativeElement.children[1].children.length; x++) {
            if (x != i) {
              this.optionsBlock.nativeElement.children[1].children[x].style.pointerEvents = "";
            }
          }
        }
        this.onHoverImgOption(opt,i);
      }
    }
  }

  onHoverImgOption(opt,i) {
    if (opt && opt != undefined && i == this.index1) {
      if (this.narrator.nativeElement.paused) {
        $(this.optionsBlock.nativeElement.children[1].children[i]).addClass("scaleInAnimation");
      }
    }
  }


  optionHover(opt, i) {
    if (i == this.index1) {
      $(this.optionsBlock.nativeElement.children[1].children[i]).addClass("scaleInAnimation");
    }
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


  onHoverOptionOut(opt, i) {
    if (opt && opt != undefined) {
      if (opt.imgsrc && opt.imgsrc.location == "content") {
        //if (!opt.placed) {
          this.optionsBlock.nativeElement.children[0].children[i].children[1].children[0].src = this.containgFolderPath + "/" + opt.dropBoxImg_original.url;
        //}
      }
      else {
        //if (!opt.placed) {
          this.optionsBlock.nativeElement.children[0].children[i].children[1].children[0].src = this.assetsPath + "/" + opt.dropBoxImg_original.url;
        //}
      }
    }
  }

  optionHoverOut(opt, i, j) {
    if (opt && opt != undefined) {
      this.ZoomOutAnimationoption(opt, i);
    }
  }

  ZoomOutAnimationoption(opt, i) {
    if (!this.checked && this.narrator.nativeElement.paused && i == this.index1) {
      $(this.optionsBlock.nativeElement.children[1].children[i]).addClass("scaleOutAnimation");
      this.optionsBlock.nativeElement.children[1].children[i].style.cursor = "";
      setTimeout(() => {
        $(this.optionsBlock.nativeElement.children[1].children[i]).removeClass("scaleInAnimation");
        $(this.optionsBlock.nativeElement.children[1].children[i]).removeClass("scaleOutAnimation");
      }, 500);
    }
  }

  ngAfterViewChecked() {
    this.templatevolume(this.appModel.volumeValue, this);
  }

  onClickPlaceholder(opt,idx) {
    this.clickedIndex = idx;
    this.optionObj[this.index1].isOpen = false;
    this.optionObj[this.index1].leftPos = "40%";
    this.optionObj[this.index1].topPos = "-495%";
    this.optionObj[this.index1].optPos = "absolute";
    
    
  }

  onAnimationEvent(event: AnimationEvent, opt, j) {
    if (event.fromState == "open" && event.toState == "closed" && event.phaseName == "done") {
      this.refcpyArray.splice(this.index, 1);
    if (this.indexArray.length >= 1) {
      let newObj = this.indexArray.shift();
      this.refcpyArray.push(newObj);
    }
    this.optionsAfterFive++;
      clearInterval(this.blinkTimeInterval);
    if (this.optionsBlock.nativeElement && this.optionsBlock.nativeElement.children[1].children[this.optionsAfterFive]) {
      this.optionsBlock.nativeElement.children[1].children[this.optionsAfterFive].style.display = "flex";
    }
    // opt.style_display="none";
    this.optionPlaceholders[this.clickedIndex].imgsrc = opt.imgsrc_original;
    //this.optionPlaceholders[this.clickedIndex]
    // this.optionsBlock.nativeElement.children[1].children[this.index1].style.display = "none";
    // this.optionsBlock.nativeElement.children[1].children[this.index1].style.pointerEvents = "none";
    if (this.refcpyArray.length == 5) {
      this.getRandomIndex(5);
    } else {
      this.getRandomIndex(this.refcpyArray.length);
    }
    }
  }
 

  onClickoption(opt,idx,idxx) {
    if (!this.narrator.nativeElement.paused! || !this.instructionVO.nativeElement.paused) {
      console.log("narrator/instruction voice still playing");
    } else {
      if (opt.id != null && this.countofAnimation != this.optionObj.length) {
        this.startCount = 0;
        this.appModel.enableReplayBtn(false);
        this.moveFrom = this.optionsBlock.nativeElement.children[1].children[this.index1].getBoundingClientRect();
        this.moveTo = this.tabularBlock.nativeElement.children[0].children[idx].children[idxx].children[0].getBoundingClientRect();
        this.moveleft = this.moveTo.left - this.moveFrom.left;
        this.movetop = this.moveTo.top - this.moveFrom.top;
        this.optionsBlock.nativeElement.children[1].children[this.index1].style.pointerEvents = "none";
        this.tabularBlock.nativeElement.style.pointerEvents = "none";
        //this.appModel.enableReplayBtn(false);
        $(this.optionsBlock.nativeElement.children[1].children[this.index1]).animate({ left: this.moveleft, top: this.movetop, height: this.moveTo.height, width: this.moveTo.width }, 1000, () => {
          clearInterval(this.blinkTimeInterval);
          //this.appModel.enableReplayBtn(true);
          this.optionsBlock.nativeElement.children[1].children[this.index1].style.pointerEvents = "";
          setTimeout(() => {
            if (this.countofAnimation != this.optionObj.length) {
                this.tabularBlock.nativeElement.style.pointerEvents = "";
            }
        }, 50);
          this.tabularBlock.nativeElement.children[0].children[idx].children[idxx].children[0].classList.value = "fluid";
          this.optionsBlock.nativeElement.children[1].children[this.index1].style.display = "none";
          this.optionsBlock.nativeElement.children[1].children[this.index1].style.pointerEvents = "none";
          this.tabularBlock.nativeElement.children[0].children[idx].children[idxx].children[0].src = this.containgFolderPath + "/" + this.optionObj[this.index1].imgsrc_original.url;
          this.tabularBlock.nativeElement.children[0].children[idx].children[idxx].style.pointerEvents = "none";
          this.refcpyArray.splice(this.index, 1);
          if (this.indexArray.length >= 1) {
            let newObj = this.indexArray.shift();
            this.refcpyArray.push(newObj);
          }
          this.countofAnimation++;
          this.optionsAfterFive++;
          if (this.optionsBlock.nativeElement && this.optionsBlock.nativeElement.children[1].children[this.optionsAfterFive]) {
            this.optionsBlock.nativeElement.children[1].children[this.optionsAfterFive].style.display = "flex";
          }
          if (this.countofAnimation == this.optionObj.length) {
            this.appModel.enableSubmitBtn(true);
            this.tabularBlock.nativeElement.style.pointerEvents = "none";
          }
          this.optionObj[this.index1].cellID = opt.id;
          if (opt.id == this.optionObj[this.index1].id) {
            this.noOfRightAnsClicked++;
            this.rightansArray.push(this.optionObj[this.index1]);
          } else {
            this.noOfWrongAnsClicked++;
            this.wrongansArray.push(this.optionObj[this.index1]);
          }
          this.startCount = 1;
          //if (this.refcpyArray.length == this.index1) {
          //  this.index1 = 0;
          //}
          if (this.refcpyArray.length == 5) {
            this.getRandomIndex(5);
          } else {
            this.getRandomIndex(this.refcpyArray.length);
          }
        });
        this.appModel.notifyUserAction();
      }
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
      }

    }
  }

  /******Checking of existance of quesTab in content JSON *******/
  checkquesTab() {
    if (this.fetchedcontent.commonassets.ques_control != undefined) {
      this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
    }else {
      this.appModel.getJson();
    }
  }

  ngOnInit() {
    if (this.appModel.isNewCollection) {
      this.appModel.event = { 'action': 'segmentBegins' };
    }
    this.containgFolderPath = this.getBasePath();
    /*Start: Theme Implementation(Template Changes)*/
    let fetchedData: any = this.appModel.content.contentData.data;
    this.fetchedcontent = JSON.parse(JSON.stringify(fetchedData));;
    this.functionalityType = this.appModel.content.contentLogic.functionalityType;
    this.themePath = ThemeConstants.THEME_PATH + this.fetchedcontent.productType + '/' + this.fetchedcontent.theme_name;
    this.Sharedservice.imagePath(this.fetchedcontent, this.containgFolderPath, this.themePath, undefined);
    this.checkquesTab();
    this.appModel.globalJsonData.subscribe(data => {
      this.showAnsTimeout = data.showAnsTimeout;
    });
    /*End: Theme Implementation(Template Changes)*/
    this.setData();
    this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
      for (let x = 0; x < this.optionsBlock.nativeElement.children[1].children.length; x++) {
        this.optionsBlock.nativeElement.children[1].children[x].src = 
          this.optionObj[x].imgsrc.url = this.optionObj[x].imgsrc.url + "?someRandomSeed=" + Math.random().toString(36);
      }
      if (mode == "manual") {
        //show modal for manual
        this.matched = true;
        this.rightanspopUpheader_img = false;
        this.wronganspopUpheader_img = false;
        this.showanspopUpheader_img = true;
        this.partialCorrectheaderTxt_img = false;
        this.attemptType = "showAnswer"
        this.styleHeaderPopup = this.feedbackObj.style_header;
        this.styleBodyPopup = this.feedbackObj.style_body;
        this.startCount = 0;
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          $("#instructionBar").addClass("disable_div");
          this.confirmModalRef.nativeElement.classList = "modal";
          this.confirmReplayRef.nativeElement.classList = "modal";
          this.submitModalRef.nativeElement.classList = "modal";
          this.popupRef.nativeElement.classList = "displayPopup modal";
          this.setRightFeedback();
        }
      } else if (mode == "auto") {
        this.isShow = true;
        this.matched = true;
        this.startCount = 0;
        this.appModel.enableSubmitBtn(false);
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
          this.partialCorrectheaderTxt_img = false;
          this.attemptType = "showAnswer";
          this.styleHeaderPopup = this.feedbackObj.style_header;
          this.styleBodyPopup = this.feedbackObj.style_body;
          this.confirmModalRef.nativeElement.classList = "modal";
          this.confirmReplayRef.nativeElement.classList = "modal";
          this.submitModalRef.nativeElement.classList = "modal";
          this.popupRef.nativeElement.classList = "displayPopup modal";
          //this.appModel.enableReplayBtn(true);
          this.noOfRightAnsClicked = 0;
          this.noOfWrongAnsClicked = 0;
          this.setRightFeedback();
        }
      } else if (mode == "submit") {
        //this.isShow = true;
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          $("#instructionBar").addClass("disable_div");
          this.confirmModalRef.nativeElement.classList = "modal";
          this.confirmReplayRef.nativeElement.classList = "modal";
          this.submitModalRef.nativeElement.classList = "modal";
          this.popupRef.nativeElement.classList = "displayPopup modal";
          this.setFeedback();
        }
      }
    })


    this.appModel.getConfirmationPopup().subscribe((action) => {
      this.appModel.notifyUserAction();
      if (action == "uttarDikhayein") {
        if (!this.instructionVO.nativeElement.paused)
        {
          this.instructionVO.nativeElement.pause();
          this.instructionVO.nativeElement.currentTime = 0;
        }
        //this.isShow = true;
        if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
          $("#instructionBar").addClass("disable_div");
          this.confirmModalRef.nativeElement.classList = "displayPopup modal";
        }
      }
      if (action == "submitAnswer") {
        if (!this.instructionVO.nativeElement.paused)
            {
              this.instructionVO.nativeElement.pause();
              this.instructionVO.nativeElement.currentTime = 0;
            }
        //this.isShow = false;
        this.submitModalRef.nativeElement.classList = "displayPopup modal";
      }
      if (action == "replayVideo") {
        if (!this.instructionVO.nativeElement.paused)
            {
              this.instructionVO.nativeElement.pause();
              this.instructionVO.nativeElement.currentTime = 0;
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
    this.appModel.resetBlinkingTimer();
    this.appModel.handleController(this.controlHandler);
  }

  postWrongAttempt(){
    //this.resetAttempt();
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
    if (obj.instructionVO && obj.instructionVO.nativeElement) {
      obj.instructionVO.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackpartialPopupAudio && obj.feedbackpartialPopupAudio.nativeElement) {
      obj.feedbackpartialPopupAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }

  }

  close() {
    //this.appModel.event = { 'action': 'exit', 'currentPosition': this.currentVideoTime };
    this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
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

  checkforQVO() {
    if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
      this.narrator.nativeElement.src = this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
      this.appModel.handlePostVOActivity(true);
      this.appModel.enableSubmitBtn(false);
      // (document.getElementById("instructionBar") as HTMLElement).style.pointerEvents="none";
      $(".bodyContent").addClass("disable_div");
      this.narrator.nativeElement.play();
      this.narrator.nativeElement.onended = () => {
        // (document.getElementById("instructionBar") as HTMLElement).style.pointerEvents="";
        $(".bodyContent").removeClass("disable_div");
        this.isQuesTypeImage = true;
        this.startActivity();
        this.appModel.handlePostVOActivity(false);
        this.appModel.enableReplayBtn(true);
      }
    } else {
      this.startActivity();
      this.appModel.handlePostVOActivity(false);
      this.appModel.enableReplayBtn(true);
    }
  }

  startActivity() {
    this.startCount = 1;
    this.getRandomIndex(5);
    //this.blinkHolder();
    //this.blinkHolder();
  }

  getRandomIndex(no) {
    this.index = Math.floor(Math.random() * no);
    if (this.refcpyArray.length > 0) {
      let id = this.refcpyArray[this.index].id;
      for (let i = 0; i < this.optionObj.length; i++) {
        if (id == this.optionObj[i].id) {
          this.index1 = i;
          break;
        }
      }
      //this.currentIndex = this.indexArray[this.index];
      this.blinkHolder();
    }
  }

  blinkHolder() {
    this.blinkFlag = true;
    this.blinkTimeInterval = setInterval(() => {
      if (this.startCount == 1) {
        this.blinkHolderImg(this.index1);
      } else {
        clearInterval(this.blinkTimeInterval);
        for (let i = 0; i < this.refcpyArray.length; i++) {
          //this.refQues.nativeElement.children[i].children[0].src = this.refcpyArray[i].imgsrc_original.location == "content" ? this.containgFolderPath + "/" + this.refcpyArray[i].imgsrc_original.url : this.assetsPath + "/" + this.refcpyArray[i].imgsrc_original.url;
        }
        //console.log(this.optionsBlock.nativeElement);
        //console.log(this.optionObj);
        for (let i = 0; i < this.optionsBlock.nativeElement.children.length; i++) {
          if (this.optionObj[i] && this.optionObj[i].imgsrc_original) {
            this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_original;
          }
        }
      }
    }, 500);
  }



  blinkHolderImg(i) {
    if (this.optionObj[i] && this.optionObj[i].imgsrc_blink) {
      if (this.blinkFlag) {
        this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_blink;
        this.blinkFlag = false;
      } else {
        this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_original;
        this.blinkFlag = true;
      }
    }
    else {
      ++this.index1;
      //this.index2 = 0;
      if (this.optionObj.length == this.index1) {
        this.index1 = 0;

      }
    }
  }

  setData() {

    if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
      this.commonAssets = this.fetchedcontent.commonassets;
      // this.myoption = this.fetchedcontent.refOptionObj;
      this.noOfImgs = this.commonAssets.imgCount;
      this.isLastQues = this.appModel.isLastSection;
      this.isLastQuesAct = this.appModel.isLastSectionInCollection;
      if (this.isLastQuesAct || this.isLastQues) {
        this.appModel.setlastQuesNT();
      }
      this.tabularBlockObj = this.fetchedcontent.tabularBlockObj;
      this.optionObj = this.fetchedcontent.refOptionObj.options;
      for (let i = 0; i < this.optionObj.length; i++) {
        if (this.optionObj[i] && this.optionObj[i].imgsrc_original) {
          this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_original;
        }
      }
      for (let x = 0; x < 5; x++) {
        this.refcpyArray.push(this.optionObj[x]);
      }
      for (let x = 5; x < this.optionObj.length; x++) {
        this.indexArray.push(this.optionObj[x]);
      }
      for (let i = 0; i < this.optionObj.length; i++) {
        this.optionObj[i].isOpen = true;            
    }
      // this.optionCommonAssets = fetchedData.option_common_assets;
      // console.log(this.optionCommonAssets);
      // this.feedbackObj = fetchedData.feedback;
      // this.correctImg = this.feedbackObj.popup_commmon_imgs.correctimg;
      // this.incorrectImg = this.feedbackObj.popup_commmon_imgs.incorrectimg;
      // this.rightAnspopupAssets = this.feedbackObj.right_ans_popup;
      // this.confirmPopupAssets = fetchedData.feedback.confirm_popup;
      // this.infoPopupAssets = fetchedData.feedback.info_popup;
      // this.submitPopupAssets = fetchedData.feedback.submit_popup;
      // this.replayconfirmAssets = fetchedData.feedback.replay_confirm;
      let refQuesObj = this.fetchedcontent.refQuesObj;
      if (refQuesObj.criteriaHeaders.length === 4 && refQuesObj.headers.length === 3) {
        this.parentMatrixClass = "matrix_5x3";
      } else if (refQuesObj.criteriaHeaders.length === 4 && refQuesObj.headers.length === 5) {
        this.parentMatrixClass = "matrix_5x5";
      }
      this.quesObj = this.fetchedcontent.quesObj;
      this.optionPlaceholders = JSON.parse(JSON.stringify(this.fetchedcontent.refQuesObj.optionPlaceHolders));
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

  hoveronTable() {
        if (!this.instructionVO.nativeElement.paused) {
          this.instructionVO.nativeElement.pause();
          this.instructionVO.nativeElement.currentTime=0;
          this.tabularBlock.nativeElement.style.pointerEvents = "";
        }
  }

  showFeedback(id: string, flag: string) {
    if (id == "submit-modal-id") {
      this.submitModalRef.nativeElement.classList = "modal";
    }
    if (id == "info-modal-id") {
      this.infoModalRef.nativeElement.classList = "modal";
      if (this.feedbackInfoAudio && !this.feedbackInfoAudio.nativeElement.paused) {
        this.feedbackInfoAudio.nativeElement.pause();
        this.feedbackInfoAudio.nativeElement.currentTime = 0;
      }
    }
    if (flag == "yes") {
        setTimeout(() => {
          this.appModel.invokeTempSubject('showModal', 'submit');
        }, 100);
      //}
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
      if (this.countofAnimation != this.optionObj.length) {
        this.appModel.enableSubmitBtn(false);
      }
      this.appModel.notifyUserAction();
      //let i = 0;
      for (let i = 0; i < this.refcpyArray.length; i++) {
        //this.refQues.nativeElement.children[i].children[0].src = this.refcpyArray[i].imgsrc_original.location == "content" ? this.containgFolderPath + "/" + this.refcpyArray[i].imgsrc_original.url : this.assetsPath + "/" + this.refcpyArray[i].imgsrc_original.url;
      }
      //this.resetAttempt();
    }
  }

  setFeedback() {
    for (let x = 0; x < this.rightansArray.length; x++) {
      let indexFirst = +this.rightansArray[x].cellID.charAt(0);
      let indexSecond = +this.rightansArray[x].cellID.charAt(1);
      this.tabularBlockinModal.nativeElement.children[0].children[indexFirst].children[indexSecond].classList.value = "colBox correct";
      this.tabularBlockinModal.nativeElement.children[0].children[indexFirst].children[indexSecond].children[0].src = this.containgFolderPath + "/" + this.rightansArray[x].imgsrc_original.url;
      this.tabularBlockinModal.nativeElement.children[0].children[indexFirst].children[indexSecond].children[0].classList.value = "fluid";
    }
    for (let x = 0; x < this.wrongansArray.length; x++) {
      let indexFirst = +this.wrongansArray[x].cellID.charAt(0);
      let indexSecond = +this.wrongansArray[x].cellID.charAt(1);
      this.tabularBlockinModal.nativeElement.children[0].children[indexFirst].children[indexSecond].classList.value = "colBox incorrect";
      this.tabularBlockinModal.nativeElement.children[0].children[indexFirst].children[indexSecond].children[0].src = this.containgFolderPath + "/" + this.wrongansArray[x].imgsrc_original.url;
      this.tabularBlockinModal.nativeElement.children[0].children[indexFirst].children[indexSecond].children[0].classList.value = "fluid";
    }
    if (this.noOfWrongAnsClicked == 0) {
      this.rightanspopUpheader_img = true;
      this.wronganspopUpheader_img= false;
      this.showanspopUpheader_img = false;
      this.partialCorrectheaderTxt_img = false;
      this.attemptType = "manual";
      this.styleHeaderPopup = this.feedbackObj.style_header;
      this.styleBodyPopup = this.feedbackObj.style_body;
    } 
    else if (this.rightansArray.length == 0) {
      this.rightanspopUpheader_img = false;
      this.wronganspopUpheader_img = true;
      this.showanspopUpheader_img = false;
      this.partialCorrectheaderTxt_img = false;
      this.attemptType = "wrong";
      this.styleHeaderPopup = this.feedbackObj.wrong_style_header;
      this.styleBodyPopup = this.feedbackObj.wrong_style_body;
    } 
    else {
      this.rightanspopUpheader_img = false;
      this.wronganspopUpheader_img = false;
      this.showanspopUpheader_img = false;
      this.partialCorrectheaderTxt_img = true;
      this.attemptType = "partial";
      this.styleHeaderPopup = this.feedbackObj.style_header;
      this.styleBodyPopup = this.feedbackObj.style_body;
    }
    this.setplayFeedbackAudio();
  }

  setRightFeedback() {
    for (let x = 0; x < this.optionObj.length; x++) {
      let indexFirst = +this.optionObj[x].id.charAt(0);
      let indexSecond = +this.optionObj[x].id.charAt(1);
      this.tabularBlockinModal.nativeElement.children[0].children[indexFirst].children[indexSecond].classList.value = "colBox correct";
      this.tabularBlockinModal.nativeElement.children[0].children[indexFirst].children[indexSecond].children[0].src = this.containgFolderPath + "/" + this.optionObj[x].imgsrc_original.url;
      this.tabularBlockinModal.nativeElement.children[0].children[indexFirst].children[indexSecond].children[0].classList.value = "fluid";
    }
    this.setplayFeedbackAudio();
  }

  attemptType:any;

  setplayFeedbackAudio() {
    if ((this.noOfRightAnsClicked > 0 && this.noOfWrongAnsClicked == 0) || (this.noOfRightAnsClicked == 0 && this.noOfWrongAnsClicked == 0)) {
      if (this.feedbackObj && this.feedbackObj.correctAudio) {
        this.feedbackAudio = this.isShow ? this.feedbackObj.show_Answer_sound : this.feedbackObj.correctAudio;        
        this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.location == "content" ? this.containgFolderPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
          console.log(this.feedbackPopupAudio.nativeElement.src);
      }
      this.feedbackPopupAudio.nativeElement.play();


      //show right feedback animation





      this.feedbackPopupAudio.nativeElement.onended = () => {
        this.startCount = 0;
        this.closeModal();
        this.appModel.notifyUserAction();
        $("#instructionBar").addClass("disable_div");
        $("#instructionBar").css("opacity", "0.3");
        $(".bodyContent").css("opacity", "0.3");
        $(".bodyContent").addClass("disable_div");
        this.appModel.enableSubmitBtn(false);
        this.appModel.enableReplayBtn(false);
        }
      }
     else if (this.noOfRightAnsClicked == 0 && this.noOfWrongAnsClicked > 0) {
      if (this.feedbackObj && this.feedbackObj.incorrectAudio) {
        this.feedbackAudio = this.feedbackObj.incorrectAudio;
        this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.location == "content" ? this.containgFolderPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
        console.log(this.feedbackPopupAudio.nativeElement.src);
      }
      this.feedbackPopupAudio.nativeElement.play();
      //wrong animation

      this.feedbackPopupAudio.nativeElement.onended = () => {
        this.closeModal();
      }
    } else {
      if (this.feedbackObj && this.feedbackObj.partialIncorrect_sound) {
        this.feedbackAudio = this.feedbackObj.partialIncorrect_sound;
        this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.location == "content" ? this.containgFolderPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
        console.log(this.feedbackPopupAudio.nativeElement.src);
      }
      this.feedbackPopupAudio.nativeElement.play();
      this.feedbackPopupAudio.nativeElement.onended = () => {
        this.closeModal();
        //this.resetAttempt();
        this.appModel.notifyUserAction();

      }
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
    this.tabularBlock.nativeElement.style.pointerEvents = "";
    for (let x = 0; x < this.rightansArray.length; x++) {
      let indexFirst = +this.rightansArray[x].cellID.charAt(0);
      let indexSecond = +this.rightansArray[x].cellID.charAt(1);
      this.tabularBlock.nativeElement.children[0].children[indexFirst].children[indexSecond].style.pointerEvents = "";
      this.tabularBlock.nativeElement.children[0].children[indexFirst].children[indexSecond].children[0].classList.value = "fluidhidden";
      this.tabularBlockinModal.nativeElement.children[0].children[indexFirst].children[indexSecond].classList.value = "colBox";
      //this.tabularBlockinModal.nativeElement.children[0].children[indexFirst].children[indexSecond].children[0].src = this.containgFolderPath + "/" + this.rightansArray[x].imgsrc_original.url;
      this.tabularBlockinModal.nativeElement.children[0].children[indexFirst].children[indexSecond].children[0].classList.value = "fluidhidden";
    }
    for (let x = 0; x < this.wrongansArray.length; x++) {
      let indexFirst = +this.wrongansArray[x].cellID.charAt(0);
      let indexSecond = +this.wrongansArray[x].cellID.charAt(1);
      this.tabularBlock.nativeElement.children[0].children[indexFirst].children[indexSecond].style.pointerEvents = "";
      this.tabularBlock.nativeElement.children[0].children[indexFirst].children[indexSecond].children[0].classList.value = "fluidhidden";
      this.tabularBlockinModal.nativeElement.children[0].children[indexFirst].children[indexSecond].classList.value = "colBox";
      //this.tabularBlockinModal.nativeElement.children[0].children[indexFirst].children[indexSecond].children[0].src = this.containgFolderPath + "/" + this.wrongansArray[x].imgsrc_original.url;
      this.tabularBlockinModal.nativeElement.children[0].children[indexFirst].children[indexSecond].children[0].classList.value = "fluidhidden";
    }
    for (let x = 0; x < this.optionsBlock.nativeElement.children[1].children.length; x++) {
      //$(this.optionsBlock.nativeElement.children[1].children[x]).animate({ left: 0, top: 0 }, 0);
      this.optionsBlock.nativeElement.children[1].children[x].style.left = 0;
      this.optionsBlock.nativeElement.children[1].children[x].style.top = 0;
      this.optionsBlock.nativeElement.children[1].children[x].style.pointerEvents ="";
      this.optionsBlock.nativeElement.children[1].children[x].style.display = this.optionObj[x].style_display.display;
      this.optionsBlock.nativeElement.children[1].children[x].style.height = "auto";
      this.optionsBlock.nativeElement.children[1].children[x].style.width = "auto";
    }
    for (let i = 0; i < this.optionObj.length; i++) {
      if (this.optionObj[i] && this.optionObj[i].imgsrc_original) {
        this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_original;
      }
    }
    for (let x = 0; x < 5; x++) {
      this.refcpyArray.push(this.optionObj[x]);
    }
    for (let x = 5; x < this.optionObj.length; x++) {
      this.indexArray.push(this.optionObj[x]);
    }
    this.appModel.enableReplayBtn(true);
    this.appModel.enableSubmitBtn(false);
    this.countofAnimation = 0;
    this.noOfRightAnsClicked = 0;
    this.noOfWrongAnsClicked = 0;
    this.rightansArray = [];
    this.wrongansArray = [];
    this.optionsAfterFive = 4;
    //this.startCount = 0;
    clearInterval(this.blinkTimeInterval);
    //this.index1 = 0;
    //this.startCount = 1;
    this.getRandomIndex(5);
    //this.blinkHolder();
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
    if (flag == "yes") {
      this.isShow=true;
      this.noOfRightAnsClicked = 0;
      this.noOfWrongAnsClicked = 0;
      $(".bodyContent").css("opacity", "0.3");
      $(".bodyContent").addClass("disable_div");
      setTimeout(() => {
        this.appModel.invokeTempSubject('showModal', 'manual');
      }, 100);
      this.appModel.resetBlinkingTimer();
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
        this.appModel.enableReplayBtn(false);
    //for (let i = 0; i < this.popupBodyRef.nativeElement.children[0].children.length; i++) {
    //  this.popupBodyRef.nativeElement.children[0].children[i].children[0].classList.value = "";
    //}
    for (let x = 0; x < this.optionsBlock.nativeElement.children[1].children.length; x++) {
      this.optionsBlock.nativeElement.children[1].children[x].src =
        this.optionObj[x].imgsrc_original.location == "content" ? this.containgFolderPath + "/" + this.optionObj[x].imgsrc_original.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.optionObj[x].imgsrc_original.url + "?someRandomSeed=" + Math.random().toString(36);
    }
    if (this.countofAnimation == this.noOfRightAnsClicked) {
      this.matched = true;
      this.startCount = 0;
      $("#instructionBar").addClass("disable_div");
      $("#instructionBar").css("opacity", "0.3");
      $(".bodyContent").css("opacity", "0.3");
      $(".bodyContent").addClass("disable_div");
      this.appModel.enableSubmitBtn(false);
    }
    if (this.feedbackPopupAudio && !this.feedbackPopupAudio.nativeElement.paused) {
      this.feedbackPopupAudio.nativeElement.pause();
      this.feedbackPopupAudio.nativeElement.currentTime = 0;
      if (!this.matched) {
        this.resetAttempt();
        this.appModel.wrongAttemptAnimation();
      }
    } else {
            if (!this.matched) {
        this.resetAttempt();
        this.appModel.wrongAttemptAnimation();
      }
    }
    this.popupRef.nativeElement.classList = "modal";
    this.appModel.notifyUserAction();

    if (this.matched) {
      this.blinkOnLastQues();
    }

    if (!this.matched) {
      setTimeout(() => {
        
        $("#instructionBar").removeClass("disable_div");
        $("#optionsBlock .options").removeClass("disable_div");
      }, 1000);
    }

  }
}


