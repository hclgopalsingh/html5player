import { Component, OnInit, ViewChild, AfterViewChecked, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { Subscription } from 'rxjs'
import { PlayerConstants } from '../../../common/playerconstants';
import { SharedserviceService } from '../../../services/sharedservice.service';
import { ThemeConstants } from '../../../common/themeconstants';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  AnimationEvent
} from '@angular/animations';
import 'jquery';

declare var $: any;

@Component({
  selector: 'app-ntemplate12',
  animations: [
    trigger('openClose', [
      state('open', style({

      })),
      state('closed', style({
        'position': '{{optPos}}',
        'left': '{{leftPos}}',
        'top': '{{topPos}}',
        'width': '{{optWidth}}',
        'max-width': '{{optMaxWidth}}'
      }), { params: { leftPos: 'auto', topPos: 'auto', optPos: 'absolute', optWidth: 'auto', optMaxWidth: 'auto' } }),
      transition('open => closed', [
        animate('0.8s')
      ]),
      transition('closed => open', [
        animate('0.8s')
      ]),
    ]),
  ],
  templateUrl: './Ntemplate12.component.html',
  styleUrls: ['./Ntemplate12.component.css']
})
export class Ntemplate12 implements OnInit, OnDestroy, AfterViewChecked {


  @ViewChild('narrator') narrator: any;
  @ViewChild('instruction') instruction: any;
  // @ViewChild("optionsBlock") optionsBlock: any;
  @ViewChild('ans') ans: any;
  @ViewChild('ansBlock') ansBlock: any;
  @ViewChild('answerBlock') answerBlock: any;
  @ViewChild('feedbackVoRef') feedbackVoRef: any;
  // @ViewChild('feedbackPopupAudio') feedbackPopupAudio: any;
  // @ViewChild('feedbackVO') feedbackVO: any;
  // @ViewChild('instructionBarFeedback') instructionBarFeedback: any;


  audio = new Audio();
  commonAssets: any = "";
  feedback: any = "";
  checked: boolean = false;
  isLastQues: boolean = false;
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
  containgFolderPath: string = "";
  assetsPath: string = "";
  loadFlag: boolean = false;
  confirmPopupAssets: any;
  tempSubscription: Subscription;
  rightanspopUp: any;
  wronganspopUp: any;
  quesObj: any;
  attemptType: string = "";
  instructionDisable: boolean = false;
  instructionOpacity: boolean = false;
  rightAnsTimeout: any;
  showAnssetTimeout: any;
  bodyContentOpacity: boolean = false;
  bodyContentDisable: boolean = true;
  displayconfirmPopup: boolean = false;
  displaymainPopup: boolean = false;
  initialDisableTimer: any;
  ansShow: boolean = false;
  myoption: any = [];
  question: any = "";
  optionCursorPointer: boolean = false;
  moveTo: any;
  moveFrom: any;
  moveleft: any;
  movetop: any;
  itemid: any = 0;
  manualClickedonCrossbtn: boolean = false;
  styleArray = [
    {'left': '-22.5%', 'top': '-256%', 'width': '130%', 'max-width': '130%'},
    {'left': '-144%', 'top': '-256%', 'width': '130%', 'max-width': '130%'},
    {'left': '-266%', 'top': '-256%', 'width': '130%', 'max-width': '130%'}
  ]
  /*Start-LifeCycle events*/
  private appModel: ApplicationmodelService;
  constructor(appModel: ApplicationmodelService, private Sharedservice: SharedserviceService) {
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
            this.close();
            break;

          default:
            console.log('Component: constructor - default');
            break;
        }
      }
    );
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
      if (mode == "manual") {
        //show modal for manual
        this.appModel.notifyUserAction();
        this.instructionDisable = true;
        this.displaymainPopup = true;
        // if (this.attemptType == "manual" && this.rightAnspopupAssets && this.rightAnspopupAssets.imgrightfeedback_audio) {
        //   this.feedbackPopupAudio.nativeElement.src = this.rightAnspopupAssets.imgrightfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36);
        // }else {
        //   this.feedbackPopupAudio.nativeElement.src = this.rightAnspopupAssets.imgshowAnsfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36);
        // }
        // this.feedbackPopupAudio.nativeElement.play();
        // this.feedbackPopupAudio.nativeElement.onended = () => {
        //   this.checked = true;
        //   this.showAnssetTimeout = setTimeout(() => {
        //     if(!this.manualClickedonCrossbtn) {
        //     this.closeModal();
        //     }
        //   }, this.showAnsTimeout);
        // }
      } else if (mode == "auto") {

        //show modal of auto
        this.appModel.notifyUserAction();
        // this.instructionBarFeedback.nativeElement.children[0].children[0].src=this.feedbackObj.showAnswerpopupTxt.url;
        this.instructionDisable = true;
        this.checked = true;
        this.attemptType = "auto";
        this.displayconfirmPopup = false;
        this.displaymainPopup = true;
        // if (this.rightAnspopupAssets && this.rightAnspopupAssets.imgrightfeedback_audio) {
        //   this.feedbackPopupAudio.nativeElement.src = this.rightAnspopupAssets.imgshowAnsfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36);
        // }
        // this.feedbackPopupAudio.nativeElement.play();
        // this.feedbackPopupAudio.nativeElement.onended = () => {
        //   this.checked = true;
        //   this.showAnssetTimeout = setTimeout(() => {
        //     this.closeModal();
        //   }, this.showAnsTimeout);
        // }
      }
    });

    this.appModel.getConfirmationPopup().subscribe((action) => {
      this.appModel.notifyUserAction();
      clearTimeout(this.showAnssetTimeout);
      if (action == "uttarDikhayein") {
        this.instructionDisable = false;
        if (!this.instruction.nativeElement.paused) {
          this.instruction.nativeElement.currentTime = 0;
          this.instruction.nativeElement.pause();
        }
        this.instructionDisable = true;
        this.displayconfirmPopup = true;
      }
    });

    this.appModel.questionEvent.subscribe(() => {
      // if (this.rightanspopUp) {
      //   console.log("timer still exist");
      //   clearTimeout(this.rightanspopUp);
      // }
      // if (this.wronganspopUp) {
      //   clearTimeout(this.wronganspopUp);
      // }
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
      setTimeout(() => {
        this.postWrongAttemplt()
      }, 750)
    });
    this.appModel.resetBlinkingTimer();
    this.appModel.handleController(this.controlHandler);
  }


  ngOnDestroy() {
    clearInterval(this.rightAnsTimeout);
    clearInterval(this.showAnssetTimeout);
    clearInterval(this.initialDisableTimer);
    if (this.narrator.nativeElement != undefined) {
      this.narrator.nativeElement.pause();
      this.narrator.nativeElement.currentTime = 0;
    }
  }

  ngAfterViewChecked() {
    this.templatevolume(this.appModel.volumeValue, this);
  }

  /*End-LifeCycle events*/

  /*Start-Template click and hover events*/
  playHoverInstruction() {
    if (!this.narrator.nativeElement.paused) {
      console.log("narrator/instruction voice still playing");
    } else {
      console.log("play on Instruction");
      this.appModel.notifyUserAction();
      if (this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.play();
        this.instructionDisable = true;
        this.instruction.nativeElement.onended = () => {
          this.instructionDisable = false;
        }
      }
    }
  }


  hoverConfirm() {
    this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_hover;
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
    this.feedback.popup_commmon_imgs.close_btn = this.feedback.popup_commmon_imgs.close_btn_hover;
  }

  houtClosePopup() {
    this.feedback.popup_commmon_imgs.close_btn = this.feedback.popup_commmon_imgs.close_btn_original;
  }

  onHoverOptions(option, idx) {
    //console.log("in",option);
    if (!this.instruction.nativeElement.paused) {
      console.log("narrator voice still playing");
    }
    else {
      option.image = option.image_hover;
      // this.ansBlock.nativeElement.children[idx].className = "options pointer";
      this.optionCursorPointer = true;
    }
  }

  onHoveroutOptions(option, idx) {
    //console.log("out",option);
    option.image = option.image_original;
    // this.ansBlock.nativeElement.children[idx].className = "options";
    this.optionCursorPointer = false;
  }
  onAnimationEvent(event: AnimationEvent, opt, j) {
    if (event.fromState == "open" && event.toState == "closed" && event.phaseName == "done") {


    } else if (event.fromState == "closed" && event.toState == "open" && event.phaseName == "done") {

    }
  }
  /*End-Template click and hover events*/



  /******Blinking of next Button *******/
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
          this.appModel.event = { 'action': 'end' };
        }
      }
      console.log("Segment Ends");
    } else {
      this.appModel.moveNextQues(this.attemptType);
    }
  }

  /******Wrong or Partial Incorrect post anmination functionality *******/
  postWrongAttemplt() {
    this.ansBlock.nativeElement.children[this.itemid].children[1].style.visibility = 'visible'
    this.answerBlock.nativeElement.children[0].children[2].style.visibility = 'hidden';
    // $(this.ansBlock.nativeElement.children[this.itemid].children[1]).animate({ left: 0, top: 0 }, 1000, () => {
    console.log("stuffs to do after wornog answer pop-up")
    this.myoption[this.itemid].isOpen = true;
    // this.ansBlock.nativeElement.children[this.itemid].children[1].style.height = 'auto'
    // this.ansBlock.nativeElement.children[this.itemid].children[1].style.width = 'auto'
    this.bodyContentDisable = false;
    // })  
  }
  /******Checking of existance of quesTab in content JSON *******/
  checkquesTab() {
    if (this.fetchedcontent.commonassets.ques_control != undefined) {
      this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
    } else {
      this.appModel.getJson();
    }
  }

  /******Mute Functionality handle *******/
  templatevolume(vol, obj) {
    if (obj.narrator && obj.narrator.nativeElement) {
      obj.narrator.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackPopupAudio && obj.feedbackPopupAudio.nativeElement) {
      obj.feedbackPopupAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackVO && obj.feedbackVO.nativeElement) {
      obj.feedbackVO.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.instruction && obj.instruction.nativeElement) {
      obj.instruction.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }

  }

  /******close event call *******/
  close() {
    this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
  }

  /******loading of Templates *******/
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
  /******Question Auto Instruction check as per content JSON *******/
  checkforQVO() {
    if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
      this.appModel.handlePostVOActivity(true);
      //this.bodyContentDisable = true;
      this.instructionDisable = true;
      this.narrator.nativeElement.play();
      this.narrator.nativeElement.onended = () => {
        this.initialDisableTimer = setTimeout(() => {
          this.instructionDisable = false;
          this.bodyContentDisable = false;
          this.startActivity();
          this.appModel.handlePostVOActivity(false);
        }, 1000)
      }
    } else {
      this.startActivity();
      this.appModel.handlePostVOActivity(false);
    }
  }

  /******After completion of Auto Instruction Activity start functionality *******/
  startActivity() {

  }


  /******Data set from content JSON *******/
  setData() {
    if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
      this.commonAssets = this.fetchedcontent.commonassets;
      this.noOfImgs = this.commonAssets.imgCount;
      this.isLastQues = this.appModel.isLastSection;
      this.isLastQuesAct = this.appModel.isLastSectionInCollection;
      if (this.isLastQuesAct || this.isLastQues) {
        this.appModel.setlastQuesNT();
      }
      this.myoption = JSON.parse(JSON.stringify(this.fetchedcontent.options));
      console.log("myoption : " + this.myoption);
      this.question = this.fetchedcontent.ques;
      this.feedback = this.fetchedcontent.feedback;
      this.confirmPopupAssets = this.fetchedcontent.feedback.confirm_popup;
      this.quesObj = this.fetchedcontent.quesObj;
      /*Start: Theme Implementation(Template Changes)*/
      this.controlHandler = {
        isSubmitRequired: this.quesObj.submitRequired,
        isReplayRequired: this.quesObj.replayRequired
      }
      /*End: Theme Implementation(Template Changes)*/
      for (let i = 0; i < this.myoption.length; i++) {
        this.myoption[i].isOpen = true;
      }
    }
  }

  /******content folder path set *******/
  getBasePath() {
    if (this.appModel && this.appModel.content) {
      return this.appModel.content.id + '';
    }
  }


  /******Show Answer Functionality after click on Yes *******/
  sendFeedback(id: string, flag: string) {
    this.displayconfirmPopup = false;
    if (flag == "yes") {
      this.showAnswer();
      // this.manualClickedonCrossbtn=false;      
      // this.showAnssetTimeout = setTimeout(() => {
      //   this.instructionBarFeedback.nativeElement.children[0].children[0].src=this.feedbackObj.showAnswerpopupTxt.url;
      //   this.attemptType = "auto";
      //   this.appModel.invokeTempSubject('showModal', 'manual');
      //   this.appModel.resetBlinkingTimer();
      // }, 100);

      // this.instructionDisable = true;
      // this.bodyContentOpacity = true;
      // this.instructionOpacity = true;
      // this.checked = true;
    } else {
      this.appModel.notifyUserAction();

    }
  }

  /******Popup close functionality *******/
  closeModal() {
    this.manualClickedonCrossbtn = true;
    // if (this.feedbackPopupAudio && !this.feedbackPopupAudio.nativeElement.paused) {
    //   this.feedbackPopupAudio.nativeElement.pause();
    //   this.feedbackPopupAudio.nativeElement.currentTime = 0;
    // }
    this.displaymainPopup = false;
    this.instructionOpacity = true;
    this.bodyContentOpacity = true;
    this.bodyContentDisable = true;
    this.appModel.notifyUserAction();
    this.blinkOnLastQues();
  }
  showAnswer() {
    this.attemptType = "hideAnimation";
    this.ansShow = true;
    // this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div";
    this.bodyContentDisable = true;
    //this.checkAnswer(obj,obj)
    this.ans.nativeElement.src = this.containgFolderPath + "/" + this.feedback.correct_ans_url;
    // this.confirmModalRef.nativeElement.classList="modal";
    this.displayconfirmPopup = false;
    this.ans.nativeElement.style.visibility = 'visible';
    let id: any;
    this.myoption.forEach((element, i) => {
      if (element.id == this.feedback.correct_ans_index) {
        id = i;
      }
    });
    console.log("id", id)
    this.myoption[id].imgsrc.url = "";
    this.appModel.resetBlinkingTimer();
    setTimeout(() => {
      this.feedbackVoRef.nativeElement.src = this.commonAssets.show_sound.url + "?someRandomSeed=" + Math.random().toString(36);
      this.feedbackVoRef.nativeElement.play();
    }, 750)
    this.feedbackVoRef.nativeElement.onended = () => {
      setTimeout(() => {
        // this.checkNextActivities();
        this.bodyContentOpacity = true;
        // this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div disable-click";
        // this.removeEvents();
        this.blinkOnLastQues()
      }, 3000)
    }

  }
  stopAllSounds(e) {
    //console.log("Event", e);
    if (!this.instruction.nativeElement.paused) {
      e.stopPropagation();
      console.log("narrator voice still playing");
    }
    else { }
  }
  checkAnswer(option, event) {
    // $( "#navBlock" ).addClass("disableNavBtn")
    // this.controlHandler.isTab = false;
    // this.appModel.handleController(this.controlHandler);
    if (!this.instruction.nativeElement.paused) {
      this.instruction.nativeElement.currentTime = 0;
      this.instruction.nativeElement.pause();
      this.instructionDisable = false;
    }
    // Analytics called for attempt counter & first option is clicked
    this.appModel.notifyUserAction();
    if (!this.instruction.nativeElement.paused) {
      console.log("narrator voice still playing");
    }
    else {
      // this.disableHelpBtn = true;
      // logic to check what user has done is correct
      if (option.id == this.feedback.correct_ans_index) {
        let id = option.idx;
        this.attemptType = "manual";
        // this.moveTo = this.answerBlock.nativeElement.children[0].children[2].getBoundingClientRect();
        // this.moveFrom = this.ansBlock.nativeElement.children[id].children[1].getBoundingClientRect();
        console.log("this.moveTo", this.moveTo)
        this.itemid = option.idx;
        // this.moveleft = this.moveTo.left - this.moveFrom.left + 25;
        // this.movetop = this.moveTo.top - this.moveFrom.top;
        this.bodyContentDisable = true;
        // $(this.ansBlock.nativeElement.children[id].children[1]).animate({ left: this.moveleft, top: this.movetop, height: this.moveTo.height, width: this.moveTo.width }, 1000, () => {
        // this.ansBlock.nativeElement.children[id].children[1].style.visibility = 'hidden'
        // this.answerBlock.nativeElement.children[0].children[2].style.visibility = 'visible';
        option.optPos = this.styleArray[option.idx]['position'];
        option.leftPos = this.styleArray[option.idx]['left'];
        option.topPos = this.styleArray[option.idx]['top'];
        option.optWidth = this.styleArray[option.idx]['width'];
        option.optMaxWidth = this.styleArray[option.idx]['max-width'];
        option.isOpen = false;
        setTimeout(() => {
          this.feedbackVoRef.nativeElement.src = this.commonAssets.right_sound.url + "?someRandomSeed=" + Math.random().toString(36);
          this.feedbackVoRef.nativeElement.play();
        }, 750)

        this.feedbackVoRef.nativeElement.onended = () => {
          setTimeout(() => {
            // this.checkNextActivities();
            // this.controlHandler.isTab = true;
            // 	this.appModel.handleController(this.controlHandler);
            // this.removeEvents();
            this.blinkOnLastQues()
            // $( "#navBlock" ).removeClass("disableNavBtn")
          }, 200)
          setTimeout(() => {
            this.bodyContentOpacity = true;
          }, 5000)
        }
        // });
      }
      else {
        this.itemid = option.idx;
        this.bodyContentDisable = true;
        // this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div ";
        // this.moveTo = this.answerBlock.nativeElement.children[0].children[2].getBoundingClientRect();
        // this.moveFrom = this.ansBlock.nativeElement.children[this.itemid].children[1].getBoundingClientRect();
        // this.moveleft = this.moveTo.left - this.moveFrom.left + 25;
        // this.movetop = this.moveTo.top - this.moveFrom.top;
        let id = option.idx;
        // $(this.ansBlock.nativeElement.children[id].children[1]).animate({ left: this.moveleft, top: this.movetop, height: this.moveTo.height, width: this.moveTo.width }, 1000, () => {
        // this.ansBlock.nativeElement.children[id].children[1].style.visibility = 'hidden'
        // this.answerBlock.nativeElement.children[0].children[2].style.visibility = 'visible';
        option.optPos = this.styleArray[option.idx]['position'];
        option.leftPos = this.styleArray[option.idx]['left'];
        option.topPos = this.styleArray[option.idx]['top'];
        option.optWidth = this.styleArray[option.idx]['width'];
        option.optMaxWidth = this.styleArray[option.idx]['max-width'];
        option.isOpen = false;
        setTimeout(() => {
          this.feedbackVoRef.nativeElement.src = this.commonAssets.wrong_sound.url + "?someRandomSeed=" + Math.random().toString(36);
          this.feedbackVoRef.nativeElement.play();
        }, 750)
        this.feedbackVoRef.nativeElement.onended = () => {
          this.appModel.wrongAttemptAnimation();
        }

        // });

      }
    }
  }
  /*End-Template Functions*/
}

