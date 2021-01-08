import { Component, OnInit, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { PlayerConstants } from '../../../common/playerconstants';
import { Subscription } from 'rxjs'
import { ThemeConstants } from '../../../common/themeconstants';
import { SharedserviceService } from '../../../services/sharedservice.service';

declare var $: any;

@Component({
  selector: 'app-ntemplate11',
  templateUrl: './Ntemplate11.component.html',
  styleUrls: ['./Ntemplate11.component.css']
})

export class Ntemplate11Component implements OnInit, OnDestroy, AfterViewChecked {
  private appModel: ApplicationmodelService;

  @ViewChild('correctAns') correctAns: any;
  @ViewChild('instructionBar') instructionBar: any;
  @ViewChild('ans') ans: any;
  @ViewChild('myAudiohelp') myAudiohelp: any;
  @ViewChild('audioEl') audioEl: any;
  @ViewChild('titleNavBtn') titleNavBtn: any;
  @ViewChild('fireworks') fireworks: any;
  @ViewChild('helpbtn') helpbtn: any;
  @ViewChild('navBlock') navBlock: any;
  @ViewChild('buzzerSound') buzzerSound: any;
  @ViewChild('titleAudio') titleAudio: any;
  @ViewChild('maincontent') maincontent: any;
  @ViewChild('helpBtn') helpBtn: any;
  @ViewChild('titleHelpAudio') titleHelpAudio: any;
  @ViewChild('clapSound') clapSound: any;
  @ViewChild('wrongFeedback') wrongFeedback: any;
  @ViewChild('autoPlayOnOffContainer') autoPlayOnOffContainer: any;
  @ViewChild('confirmModalRef') confirmModalRef: any;
  @ViewChild('confirmReplayRef') confirmReplayRef: any;
  @ViewChild('submitModalRef') submitModalRef: any;
  @ViewChild('feedbackModalRef') feedbackModalRef: any;
  @ViewChild('partialpopupRef') partialpopupRef: any;
  @ViewChild('popupRef') popupRef: any;
  @ViewChild('feedbackPopupAudio') feedbackPopupAudio: any;
  @ViewChild('feedbackpartialPopupAudio') feedbackpartialPopupAudio: any;
  @ViewChild('infoModalRef') infoModalRef: any;
  @ViewChild('feedbackVoRef') feedbackVoRef: any;
  @ViewChild('narrator') narrator: any;
  @ViewChild('instruction') instruction: any;
  @ViewChild('optionAudio') optionAudio: any;
  @ViewChild('ansArrangeBlock') ansArrangeBlock: any;
  @ViewChild('ansBlock') ansBlock: any;
  @ViewChild('mainVideo') mainVideo: any;

  isPlayVideo: boolean;
  narratorAudio: any;
  disableHelpBtn: boolean = false;
  blurTwoOptions: boolean = false;
  currentIdx = 0;
  blink: boolean = false;
  showIntroScreen: boolean = true;
  audio = new Audio();
  bool: boolean = false;
  timernextseg: any;
  idArray: any;
  speaker: any = "";
  myoption: any = [];
  question: any = "";
  feedback: any = "";
  answers: any = "";
  optionBlank: any = "";
  Instruction: any = "";
  quesInfo: any = "";
  isFirstQues: boolean;
  isLastQues: boolean = false;
  isAutoplayOn: boolean;
  isLastQuesAct: boolean;
  noOfImgs: number;
  noOfImgsLoaded: number = 0;
  loaderTimer: any;
  assetspath: any;
  common_assets: any = "";
  hasEventFired: boolean = false;
  feedbackPopup: any;
  confirmPopupAssets: any;
  wrongPopup: any;
  rightPopup: any;
  feedbackObj: any;
  commonAssets: any = "";
  containgFolderPath: string = "";
  loadFlag: boolean = false;
  quesObj: any;
  tempSubscription: Subscription;
  attemptType: string = "";
  isSkip: boolean = false;
  isAnsWrong: boolean = false;
  moveTo: any;
  moveFrom: any;
  moveleft: any;
  movetop: any;
  itemid: any;
  correct_ans_url: any;
  videoReplayd: boolean;
  replayconfirmAssets: any;
  tempTimer: any;
  PlayPauseFlag: boolean = true;
  SkipLoad: boolean = false;
  showAnsTimer: any;

  /*Start: Theme Implementation(Template Changes)*/
  controlHandler = {
    isSubmitRequired: false,
    isReplayRequired: false,
  };
  themePath: any;
  fetchedcontent: any;
  functionalityType: any;
  showAnsTimeout: number;
  rightFeedbackTimer: any;
  wrongFeedbackTimer: any;
  /*END: Theme Implementation(Template Changes)*/


  /*Start-LifeCycle events*/
  constructor(appModel: ApplicationmodelService, private Sharedservice: SharedserviceService) {
    this.appModel = appModel;
    this.assetspath = this.appModel.assetsfolderpath;
    this.appModel.navShow = 2;
    this.appModel.setLoader(true);
    // if error occured during image loading loader wil stop after 5 seconds 
    this.loaderTimer = setTimeout(() => {
      this.appModel.setLoader(false);
      console.log("stopping loader")
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
    this.assetspath = "";
    if (this.appModel.isNewCollection) {
      this.appModel.event = { 'action': 'segmentBegins' };
    }
    this.containgFolderPath = this.getBasePath();
    this.appModel.functionone(this.templatevolume, this);
    console.log("init---->>>>>>>>>:", this.appModel.content.contentData.data);
    /*Start: Theme Implementation(Template Changes)*/
    let fetchedData: any = this.appModel.content.contentData.data;
    this.fetchedcontent = JSON.parse(JSON.stringify(fetchedData));
    this.functionalityType = this.appModel.content.contentLogic.functionalityType;
    this.themePath = ThemeConstants.THEME_PATH + this.fetchedcontent.productType + '/' + this.fetchedcontent.theme_name;
    this.Sharedservice.imagePath(this.fetchedcontent, this.containgFolderPath, this.themePath, undefined);
    this.checkquesTab();
    this.appModel.globalJsonData.subscribe(data => {
      this.showAnsTimeout = data.showAnsTimeout;
    });
    /*End: Theme Implementation(Template Changes)*/
    this.setData();
    if (this.fetchedcontent.titleScreen) {
      this.quesInfo = this.fetchedcontent;
      this.showIntroScreen = true;
      this.noOfImgs = this.quesInfo.imgCount;
    } else {
      this.showIntroScreen = false;
      this.setData();
    }
    setTimeout(() => {
      if (this.navBlock && this.navBlock.nativeElement) {
        this.navBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around disable_div";
      }
    }, 0)
    this.appModel.getConfirmationPopup().subscribe((val) => {
      if (!this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.pause();
        this.onInstructionEnd();
      }
      if (val == "uttarDikhayein") {
        if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
          this.confirmModalRef.nativeElement.classList = "displayPopup modal";
          this.appModel.notifyUserAction();
        }
      }
      if (val == "replayVideo") {
        console.log("replaying video");
        this.SkipLoad = true;
        this.appModel.enableReplayBtn(true);
        this.PlayPauseFlag = true;
        this.quesObj.quesPlayPause = this.quesObj.quesPause;
        this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
        this.appModel.videoStraming(true);
        if (this.confirmReplayRef && this.confirmReplayRef.nativeElement) {
          this.ansBlock.nativeElement.className = "d-flex align-items-center justify-content-around";
          this.confirmReplayRef.nativeElement.classList = "displayPopup modal";
        }
      }
    })
    this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
      if (mode == "manual") {
        //show modal for manual
        this.appModel.notifyUserAction();
        if (this.correctAns && this.correctAns.nativeElement) {
          this.instructionBar.nativeElement.classList = "instructionBase disableDiv";
          this.correctAns.nativeElement.classList = "displayPopup modal";
        }
        console.log("mode manuall", mode)

      } else if (mode == "auto") {
        console.log("mode manual2", mode)
        //show modal of auto
        //show answer
        this.showAnswer();
        this.isAnsWrong = false;
      }
    })
    this.appModel.postWrongAttempt.subscribe(() => {
      this.postWrongAttemplt();
    });
    this.appModel.resetBlinkingTimer();
    this.appModel.handleController(this.controlHandler);
  }

  ngOnDestroy() {
    clearTimeout(this.timernextseg);
    clearTimeout(this.showAnsTimer);
    clearTimeout(this.rightFeedbackTimer);
    clearTimeout(this.wrongFeedbackTimer);
    this.blurTwoOptions = false;
    setTimeout(() => {
      this.appModel.resetBlinkingTimer();
    }, 1000);
    if (this.narrator.nativeElement != undefined) {
      this.narrator.nativeElement.pause();
      this.narrator.nativeElement.currentTime = 0;
    }
  }

  ngAfterViewChecked() {
    if (this.titleAudio && this.titleAudio.nativeElement) {
      this.titleAudio.nativeElement.onended = () => {
        this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeInAnimation";
      }
    }
    this.templatevolume(this.appModel.volumeValue, this);
  }
  /*End-LifeCycle events*/


  /*Start-Template click and hover events*/
  onHoverOptions(option, idx) {
    //console.log("in",option);
    this.appModel.notifyUserAction();
    if (!this.narrator.nativeElement.paused) {
      console.log("narrator voice still playing");
    } else {
      if (!this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.pause();
      }
      option.image = option.image_hover;
      this.instructionBar.nativeElement.classList = "instructionBase";
      this.instructionBar.nativeElement.style.cursor = "pointer";
      this.ansBlock.nativeElement.children[idx].className = "options pointer";
    }
  }

  hoverPlayPause() {
    if (this.PlayPauseFlag) {
      this.quesObj.quesPlayPause = this.quesObj.quesPauseHover;
    }
    else {
      this.quesObj.quesPlayPause = this.quesObj.quesPlayHover;
    }
  }
  leavePlayPause() {
    if (this.PlayPauseFlag) {
      this.quesObj.quesPlayPause = this.quesObj.quesPauseOriginal;
    }
    else {
      this.quesObj.quesPlayPause = this.quesObj.quesPlayOriginal;
    }
  }



  onHoveroutOptions(option, idx) {
    this.appModel.notifyUserAction();
    //console.log("out",option);
    option.image = option.image_original;
    this.ansBlock.nativeElement.children[idx].className = "options";
  }

  onHoverhelp(option) {
    //console.log("in",option);
    this.appModel.notifyUserAction();
    if (!this.narrator.nativeElement.paused) {
      this.helpbtn.nativeElement.className = "";
      console.log("narrator voice still playing");
    }
    else {
      option.help = option.helphover;
      this.helpbtn.nativeElement.className = "pointer";
    }
  }
  onHoverouthelp(option) {
    //console.log("out",option);
    option.help = option.helpOriginal;
  }
  onHoverAageyBadheinBtn() {
    this.common_assets.aagey_badhein = this.common_assets.aagey_badhein_hover;
  }
  onLeaveAageyBadheinBtn() {
    this.common_assets.aagey_badhein = this.common_assets.aagey_badhein_original;
  }
  onHoverPeecheyBtn() {
    this.common_assets.peechey_jayein = this.common_assets.peechey_jayein_hover;
  }
  onLeavePeecheyBtn() {
    this.common_assets.peechey_jayein = this.common_assets.peechey_jayein_original;
  }
  onHoverZaariRakhein() {
    this.quesInfo.zaariRakhein = this.quesInfo.zaariRakhein_hover;
  }
  onHoverOutZaariRakhein() {
    this.quesInfo.zaariRakhein = this.quesInfo.zaariRakhein_original;
  }
  hoverCloseConfirm() {
    this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_hover;
  }

  houtonReplayDecline() {
    this.replayconfirmAssets.decline_btn = this.replayconfirmAssets.decline_btn_original;
  }

  hoveronReplayConfirm() {
    this.replayconfirmAssets.confirm_btn = this.replayconfirmAssets.confirm_btn_hover;
  }

  houtonReplayConfirm() {
    this.replayconfirmAssets.confirm_btn = this.replayconfirmAssets.confirm_btn_original;
  }

  hoveronReplayDecline() {
    this.replayconfirmAssets.decline_btn = this.replayconfirmAssets.decline_btn_hover;
  }

  houtDecline() {
    this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_original;
  }

  houtCloseConfirm() {
    this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_original;
  }

  hoverConfirm() {
    this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_hover;
  }

  hoverDecline() {
    this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_hover;
  }

  houtConfirm() {
    this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_original;
  }

  endedHandleronSkip() {
    this.isPlayVideo = false;
    this.appModel.navShow = 2;
    this.appModel.videoStraming(false);
    this.appModel.notifyUserAction();
  }

  PlayPauseVideo() {
    if (this.PlayPauseFlag) {
      this.mainVideo.nativeElement.pause();
      this.quesObj.quesPlayPause = this.quesObj.quesPlay;
      this.PlayPauseFlag = false;
    }
    else {
      this.mainVideo.nativeElement.play();
      this.quesObj.quesPlayPause = this.quesObj.quesPause;
      this.PlayPauseFlag = true;
    }
  }

  hoverSkip() {
    // this.skipFlag = false;
    this.quesObj.quesSkip = this.quesObj.quesSkipHover;
  }
  houtSkip() {
    this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
  }


  playSound(sound) {
    // plays a sound
    if (this.myAudiohelp && this.myAudiohelp.nativeElement) {
      this.myAudiohelp.nativeElement.pause();
    }
    this.audio.src = sound;
    this.audio.load();
    this.audio.play();
  }

  helpSpeaker(el: HTMLAudioElement) {
    if (!this.narrator.nativeElement.paused) {
      console.log("narrator voice still playing");
    }
    else {
      el.pause();
      el.currentTime = 0;
      el.play();
      if (this.maincontent) {
        this.maincontent.nativeElement.className = "disable_div";
      }
      el.onended = () => {
        if (this.maincontent) {
          this.maincontent.nativeElement.className = "";
        }
      }
    }
  }

  playHoverInstruction() {
    // this.appModel.handlePostVOActivity(true); 
    // this.appModel.enableReplayBtn(false);
    console.log("weare heree---------------------->>>>>>>>>>>>>>>>>>>");
    this.narrator.nativeElement.src = this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
    let that = this;
    if (!this.narrator.nativeElement.paused!) {
      console.log("narrator/instruction voice still playing");
    } else {
      console.log("play on Instruction");
      this.instruction.nativeElement.src = this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
      if (this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        setTimeout(() => {
          this.instruction.nativeElement.play();
          this.instructionBar.nativeElement.classList = "instructionBase disable_div";
          this.instructionBar.nativeElement.style.cursor = "default";
        }, 200)
        this.instruction.nativeElement.onended = () => {
          this.onInstructionEnd();
        }

      }
    }
  }
  /*End-Template click and hover events*/
  onInstructionEnd() {
    this.ansBlock.nativeElement.className = "d-flex flex-row justify-content-around";
    this.instructionBar.nativeElement.classList = "instructionBase";
    this.instructionBar.nativeElement.style.cursor = "pointer";
    for (let i = 0; i < this.myoption.length; i++) {
      this.ansBlock.nativeElement.children[i].className = "options";
    }
  }

  /*Start-Template Functions*/
  checkquesTab() {
    if (this.fetchedcontent.commonassets.ques_control != undefined) {
      this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
    } else {
      this.appModel.getJson();
    }
  }

  get basePath(): any {
    // console.log('temponeComponent: path=', this.appModel.content.id + '/' + this.appModel.content.contentData.data['path']);
    if (this.appModel && this.appModel.content) {
      return this.appModel.content.id + '';
    }
  }


  /*** Data set from content JSON ***/
  setData() {
    if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
      console.log("fetchedDatafetchedDatafetchedData", this.fetchedcontent);
      if (this.fetchedcontent && this.fetchedcontent.titleScreen) {
        this.showIntroScreen = true;
      } else {
        this.showIntroScreen = false;
      }
      this.speaker = this.fetchedcontent.speaker;
      this.common_assets = this.fetchedcontent.commonassets;
      this.myoption = JSON.parse(JSON.stringify(this.fetchedcontent.options));
      this.quesObj = this.fetchedcontent.quesObj;

      /*Start: Theme Implementation(Template Changes)*/
      this.controlHandler = {
        isSubmitRequired: this.quesObj.submitRequired,
        isReplayRequired: this.quesObj.replayRequired
      }
      /*End: Theme Implementation(Template Changes)*/

      // this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
      this.question = this.fetchedcontent.ques;
      this.feedback = this.fetchedcontent.feedback;
      this.correct_ans_url = this.feedback.correct_ans_url;
      this.commonAssets = this.fetchedcontent.commonassets;
      this.quesInfo = this.fetchedcontent.commonassets;
      this.answers = this.fetchedcontent.answers;
      this.optionBlank = this.fetchedcontent.optionsBlank;
      this.isFirstQues = this.fetchedcontent.isFirstQues;
      this.isLastQues = this.appModel.isLastSection;
      this.isLastQuesAct = this.appModel.isLastSectionInCollection;
      this.isAutoplayOn = this.appModel.autoPlay;
      this.noOfImgs = this.fetchedcontent.imgCount;
      this.confirmPopupAssets = this.fetchedcontent.feedback.confirm_popup;
      this.feedbackObj = this.fetchedcontent.feedback;
      this.rightPopup = this.fetchedcontent.feedback.rightFeedback;
      this.wrongPopup = this.fetchedcontent.feedback.wrongFeedback;
      this.narratorAudio = this.fetchedcontent.commonassets.narrator;
      this.replayconfirmAssets = this.fetchedcontent.feedback.replay_confirm;
      if (this.quesObj.quesVideo && this.quesObj.quesVideo.autoPlay && !this.appModel.isVideoPlayed) {
        this.isPlayVideo = true;
      } else {
        this.isPlayVideo = false;
        this.tempTimer = setTimeout(() => {
          let navTimer = setInterval(() => {
            if (this.navBlock && this.navBlock.nativeElement) {
              clearInterval(navTimer);
              setTimeout(() => {
                if (this.navBlock && this.navBlock.nativeElement) {
                  this.navBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around"
                }
              }, 500)
            }
          }, 100)
          this.noOfImgsLoaded = 0;
        }, this.quesInfo.formatTimeout)
      }

      setTimeout(() => {
        if (this.navBlock && this.navBlock.nativeElement) {
          this.navBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around";
        }
      }, 200)
    } else {
      /*this.speaker = "";
      this.myoption = [];
      this.question = "";
      this.feedback = "";
      this.answers = "";
      this.optionBlank = "";*/
    }

  }

  stopAllSounds(e) {
    //console.log("Event", e);
    if (!this.narrator.nativeElement.paused) {
      e.stopPropagation();
      console.log("narrator voice still playing");
    }
    else { }
  }

  checkAnswer(option, event, id) {
    this.disableHelpBtn = true;
    this.appModel.enableReplayBtn(false);
    this.appModel.handlePostVOActivity(true);
    // Analytics called for attempt counter & first option is clicked
    if (this.myAudiohelp && this.myAudiohelp.nativeElement) {
      this.myAudiohelp.nativeElement.pause();
      this.myAudiohelp.nativeElement.currentTime = 0;
    }
    if (!this.narrator.nativeElement.paused) {
      console.log("narrator voice still playing");
    }
    else {
      // logic to check what user has done is correct
      if (option.id == this.feedback.correct_ans_index) {
        this.ansBlock.nativeElement.classList = "d-flex flex-row justify-content-around";
        this.isAnsWrong = false;
        this.attemptType = "manual";
        console.log("i have hit correct sequence");
        //this.playSound(this.feedback.write_ans_sound.path.url);
        //initiate animation 
        this.moveTo = this.ansArrangeBlock.nativeElement.children[2].getBoundingClientRect();
        this.moveFrom = this.ansBlock.nativeElement.children[id].children[1].getBoundingClientRect();
        console.log("this.moveTo", this.moveTo)
        this.moveleft = this.moveTo.left - this.moveFrom.left;
        this.movetop = this.moveTo.top - this.moveFrom.top;

        this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div ";
        // this.appModel.enableReplayBtn(false);
        $(this.ansBlock.nativeElement.children[id].children[1]).animate({ left: this.moveleft, top: this.movetop }, 1000, () => {
          console.log("animation completed")
          this.blurTwoOptions = true;
          this.rightFeedbackTimer = setTimeout(() => {
            this.feedbackVoRef.nativeElement.src = this.commonAssets.right_sound.url + "?someRandomSeed=" + Math.random().toString(36);
            this.feedbackVoRef.nativeElement.play();
          }, 750)
          this.ansBlock.nativeElement.children[id].children[1].style.visibility = 'hidden';
          this.ansArrangeBlock.nativeElement.children[2].style.visibility = 'visible';
          this.ansArrangeBlock.nativeElement.children[2].src = option.imgsrc.url;
          this.feedbackVoRef.nativeElement.onended = () => {
            this.timernextseg = setInterval(() => {
              this.removeEvents();
              this.blinkOnLastQues()
              this.blurTwoOptions = false;
              this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div disable-click";
              // this.appModel.handleController(this.controlHandler);
              this.appModel.enableReplayBtn(false);
            }, 200)
            this.appModel.handlePostVOActivity(false);
          }
        });
      } else {
        this.ansBlock.nativeElement.classList = "d-flex flex-row justify-content-around";
        this.blurTwoOptions = false;
        console.log("when wrong answer clicked");
        this.itemid = id;
        this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div ";
        this.moveTo = this.ansArrangeBlock.nativeElement.children[2].getBoundingClientRect();
        this.moveFrom = this.ansBlock.nativeElement.children[id].children[1].getBoundingClientRect();
        console.log("this.moveTo", this.moveTo)
        this.moveleft = this.moveTo.left - this.moveFrom.left;
        this.movetop = this.moveTo.top - this.moveFrom.top;
        setTimeout(() => {
          this.isAnsWrong = true;
        }, 900)
        this.appModel.handlePostVOActivity(true);
        $(this.ansBlock.nativeElement.children[id].children[1]).animate({ left: this.moveleft, top: this.movetop }, 1000, () => {
          this.ansBlock.nativeElement.children[id].children[1].style.visibility = 'hidden';
          this.ansArrangeBlock.nativeElement.children[2].style.visibility = 'visible';
          this.ansArrangeBlock.nativeElement.children[2].src = option.imgsrc.url;
          this.wrongFeedbackTimer = setTimeout(() => {
            this.feedbackVoRef.nativeElement.src = this.commonAssets.wrong_sound.url + "?someRandomSeed=" + Math.random().toString(36);
            this.feedbackVoRef.nativeElement.play();
          }, 750)
          this.feedbackVoRef.nativeElement.onended = () => {
            if (this.isAnsWrong) {
              this.appModel.wrongAttemptAnimation();
              this.appModel.handlePostVOActivity(true);
            }
          }
        })
      }
    }
  }

  sendFeedback(id: string, flag: string) {
    this.confirmModalRef.nativeElement.classList = "modal";
    this.confirmReplayRef.nativeElement.classList = "modal";
    this.correctAns.nativeElement.classList = "modal";
    // this.appModel.enableReplayBtn(true);
    this.appModel.handlePostVOActivity(true);

    this.feedbackVoRef.nativeElement.pause();
    if (!this.instruction.nativeElement.paused) {
      this.instruction.nativeElement.currentTime = 0;
      this.instruction.nativeElement.pause();
    }
    if (flag == "yes") {
      this.showAnswer();
    } else {
      this.appModel.handlePostVOActivity(false);
      console.log("closing modal");
      //close modal
      if (this.clapSound && this.clapSound.nativeElement) {
        this.clapSound.nativeElement.pause()
      }
      if (this.wrongFeedback && this.wrongFeedback.nativeElement) {
        this.wrongFeedback.nativeElement.pause()
      }
      this.appModel.notifyUserAction();
      this.instructionBar.nativeElement.classList = "instructionBase";
      // this.appModel.handlePostVOActivity(true);
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

      var img_hover2 = array[randomIndex].image_hover;
      var text2 = array[randomIndex].image;
      var text2copy = array[randomIndex].image_original;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
      array[currentIndex].image_hover = img_hover1;
      array[currentIndex].image = text1;
      array[currentIndex].image_original = text1copy;
      array[randomIndex].image_hover = img_hover2;
      array[randomIndex].image = text2;
      array[randomIndex].image_original = text2copy;
    }
    var flag = this.arraysIdentical(array, this.idArray);
    console.log(flag);
    if (flag) {
      this.doRandomize(array);
    }
    else {
    }
  }

  arraysIdentical(a, b) {
    console.log("checking:", a, b);
    var i = a.length;
    //var bool = false;
    while (i--) {
      /*if (a[i].id !== b[i]) 
        return false;
      */
      if (a[i].id == b[i]) {
        return true;
      }
    }
    return false;
  }

  isPaused() {
    return this.audio.paused;
  }

  checkNextActivities() {
    if (this.isPaused()) {
      this.removeEvents();
      var popup = document.getElementById("correctAns")
      popup.className = "d-flex align-items-center justify-content-center hideit";
      //disable click on options and speaker
      var optionsBlock = document.getElementById("ansBlock");
      if (optionsBlock) {
        optionsBlock.className = optionsBlock.className.concat(" disable");
      }

      if (!this.isAutoplayOn && !this.isLastQues && this.isLastQuesAct) {
        this.blink = true;
      }
      if ((this.isAutoplayOn && !this.isLastQues) || !((this.isLastQuesAct)) || ((this.isLastQuesAct && this.isAutoplayOn && !this.isLastQuesAct))) {
        this.next();
      } else {
        //disable all the option
        //this.optionBlock.nativeElement.className= "disableDiv";
      }
      if (!this.hasEventFired) {
        if (this.isLastQuesAct) {
          this.hasEventFired = true;
          this.appModel.event = { 'action': 'segmentEnds' };
        }
        if (this.isLastQues) {
          this.appModel.event = { 'action': 'end' };
        }
      }
    }
    else {
      console.log("feedback_audio still playing");
    }
  }

  // previous function
  previous() {
    if (this.common_assets && this.common_assets.peechey_jayein) {
      this.common_assets.peechey_jayein = this.common_assets.peechey_jayein_original;
    }
    if (this.common_assets && this.common_assets.aagey_badhein) {
      this.common_assets.aagey_badhein = this.common_assets.aagey_badhein_original;
    }
    setTimeout(() => {
      if (this.navBlock && this.navBlock.nativeElement) {
        this.navBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around disable_div";
      }
    }, 0)
    //console.log("prev",this.currentIdx);	
    this.blink = false;
    this.reset();

    this.currentIdx--;
    this.appModel.previousSection();
    //this.setData();
    this.appModel.setLoader(true);
  }

  next() {
    if (!this.hasEventFired) {
      if (this.isLastQuesAct) {
        this.hasEventFired = true;
        this.appModel.event = { 'action': 'segmentEnds' };
      }
      if (this.isLastQues) {
        this.appModel.event = { 'action': 'end' };
      }
    }
    if (this.common_assets && this.common_assets.peechey_jayein) {
      this.common_assets.peechey_jayein = this.common_assets.peechey_jayein_original;
    }
    if (this.common_assets && this.common_assets.aagey_badhein) {
      this.common_assets.aagey_badhein = this.common_assets.aagey_badhein_original;
    }
    if (!this.isLastQues) {
      setTimeout(() => {
        if (this.navBlock && this.navBlock.nativeElement) {
          this.navBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around disable_div";
        }
      }, 0)
      this.currentIdx++;

      this.appModel.nextSection();
      this.appModel.setLoader(true);
      this.removeEvents();
      this.reset();
    }
  }

  removeEvents() {
    // remove event handlers for all clickable items in the dom
    this.blink = false;
    clearTimeout(this.timernextseg);
    if (this.fireworks && this.fireworks.nativeElement) {
      let elfireworks: HTMLElement = this.fireworks.nativeElement as HTMLElement
      elfireworks.className = "d-flex align-items-center justify-content-center hideit";
    }
  }

  close() {
    this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
  }

  reset() {
    // will reset all what user performed
    this.audio.pause();
    if (this.myAudiohelp && this.myAudiohelp.nativeElement)
      this.myAudiohelp.nativeElement.pause();
    var optionsBlock = document.getElementById("ansBlock");
    if (optionsBlock) {
      optionsBlock.className = "d-flex flex-row justify-content-around pointer";
    }
    var popup = document.getElementById("correctAns")
    if (popup) {
      popup.className = "d-flex align-items-center justify-content-center hideit";
    }
    if (this.ans && this.ans.nativeElement && this.ans.nativeElement.src)
      this.ans.nativeElement.src = this.assetspath + '/' + this.question.img_sentence_org.url;
  }

  closeTitleScreen() {
    this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeOutAnimation";
    setTimeout(() => {
      this.showIntroScreen = false;
      this.next();
    }, 200)
  }

  templatevolume(vol, obj) {
    if (obj.narrator && obj.narrator.nativeElement) {
      obj.narrator.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.narrator && obj.narrator.nativeElement) {
      obj.narrator.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (this.buzzerSound && this.buzzerSound.nativeElement) {
      this.buzzerSound.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.myAudiohelp && obj.myAudiohelp.nativeElement) {
      obj.myAudiohelp.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.audioEl && obj.audioEl.nativeElement) {
      obj.audioEl.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.instruction && obj.instruction.nativeElement) {
      obj.instruction.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackVoRef && obj.feedbackVoRef.nativeElement) {
      obj.feedbackVoRef.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.titleHelpAudio && obj.titleHelpAudio.nativeElement) {
      obj.titleHelpAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.mainVideo && obj.mainVideo.nativeElement) {
      obj.mainVideo.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
  }

  postWrongAttemplt() {
    //wrong-right ans
    //shake options
    // this.isAnsWrong = false;
    // $("#optimage"+this.itemid).removeClass('wrongImageStyle');
    this.appModel.enableReplayBtn(true);
    this.isAnsWrong = false
    this.ansBlock.nativeElement.children[this.itemid].children[1].style.visibility = 'visible';
    this.ansArrangeBlock.nativeElement.children[2].style.visibility = 'hidden';
    // $(this.ansBlock.nativeElement.children[this.itemid].children[1]).animate({ left: 15, top: 10 }, 1000, () => {
    $(this.ansBlock.nativeElement.children[this.itemid].children[1]).animate({ left: 0, top: 0 }, 1000, () => {
      console.log("stuffs to do wornog answer pop-up")
      this.appModel.enableReplayBtn(true);
      this.appModel.handlePostVOActivity(false);
      this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center";
      // this.appModel.handleController(this.controlHandler);
    })
  }

  getBasePath() {
    if (this.appModel && this.appModel.content) {
      return this.appModel.content.id + '';
    }
  }

  checkImgLoaded() {
    if (!this.loadFlag) {
      this.noOfImgsLoaded++;
      console.log("this.noOfImgsLoaded", this.noOfImgsLoaded, this.noOfImgs)
      if (this.noOfImgsLoaded >= this.noOfImgs) {
        this.appModel.setLoader(false);
        this.loadFlag = true;
        this.checkforQVO();
        // clearTimeout(this.loaderTimer);
      }
    }
  }

  checkforQVO() {
    if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
      this.narrator.nativeElement.src = this.quesObj.quesInstruction.url;
      this.appModel.enableReplayBtn(false);
      this.appModel.handlePostVOActivity(true);
      this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div";
      this.narrator.nativeElement.play();
      this.narrator.nativeElement.onended = () => {
        this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center";
        this.appModel.enableReplayBtn(true);
        this.appModel.handlePostVOActivity(false);
      }
    } else {
      this.appModel.handlePostVOActivity(false);
      this.appModel.enableReplayBtn(false);
    }
  }

  blinkOnLastQues() {
    console.log("this.attemptType", this.attemptType)
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

  showReplay(ref, flag: string, action?: string) {
    ref.classList = "modal";
    this.appModel.notifyUserAction();
    if (flag == "yes") {
      if (action == "replay") {
        //this.isPlayVideo = true;
        this.SkipLoad = true;
        this.replayconfirmAssets.confirm_btn = this.replayconfirmAssets.confirm_btn_original;
        this.appModel.videoStraming(true);
        this.replayVideo();
      }
    } else if (flag == "no") {
      this.appModel.videoStraming(false);
      this.appModel.enableReplayBtn(true);
      setTimeout(() => {
        this.instructionBar.nativeElement.classList = "instructionBase";
      }, 1000);
    }
  }

  replayVideo() {
    this.videoReplayd = true;
    this.isPlayVideo = true;
    this.appModel.enableSubmitBtn(false);
    this.appModel.stopAllTimer();
    this.instructionBar.nativeElement.classList = "instructionBase disable_div";
    this.appModel.navShow = 1;
    setTimeout(() => {
      this.mainVideo.nativeElement.play();
      this.mainVideo.nativeElement.onended = () => {
        this.isPlayVideo = false;
        this.appModel.navShow = 2;
        this.instructionBar.nativeElement.classList = "instructionBase";
        this.appModel.enableReplayBtn(true);
        this.replayconfirmAssets.confirm_btn = this.replayconfirmAssets.confirm_btn_original;
        this.appModel.startPreviousTimer();
        this.appModel.videoStraming(false);
        this.appModel.notifyUserAction();
      }
    }, 500)
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
      setTimeout(() => {
        let navTimer = setInterval(() => {
          if (this.navBlock && this.navBlock.nativeElement) {
            clearInterval(navTimer);
            setTimeout(() => {
              if (this.navBlock && this.navBlock.nativeElement) {
                this.navBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around";
              }
            }, 500)
          }
        }, 100)
        this.noOfImgsLoaded = 0;
        this.loaderTimer = setTimeout(() => {
          this.appModel.setLoader(false);
        }, 5000)

      }, this.quesInfo.formatTimeout)
    } else {
      // console.log("replay else=========");
      this.appModel.videoStraming(false);
      this.appModel.startPreviousTimer();
      this.appModel.notifyUserAction();
      this.appModel.enableReplayBtn(true);
    }
  }

  showAnswer() {
    this.attemptType = "hideAnimation"
    this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div";
    this.ans.nativeElement.src = this.containgFolderPath + '/' + this.feedback.correct_ans_url;
    this.confirmModalRef.nativeElement.classList = "modal";
    this.confirmReplayRef.nativeElement.classList = "modal";
    this.ans.nativeElement.style.visibility = 'visible';
    let id: any;
    this.myoption.forEach((element, i) => {
      if (element.id == this.feedback.correct_ans_index) {
        id = i;
      }
      if (element.id != this.feedback.correct_ans_index) {
        this.blurTwoOptions = true;
      }
    });
    console.log("id", id)
    this.myoption[id].imgsrc.url = "";
    this.appModel.resetBlinkingTimer();
    setTimeout(() => {
      this.feedbackVoRef.nativeElement.src = this.commonAssets.show_sound.url + "?someRandomSeed=" + Math.random().toString(36);
      this.feedbackVoRef.nativeElement.play();
      this.appModel.enableReplayBtn(false);

    }, 750)
    this.showAnsTimer = setTimeout(() => {
      this.blurTwoOptions = false;
      this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div disable-click";
      this.blinkOnLastQues();
      // this.appModel.handlePostVOActivity(false);
    }, 5000)
  }
  /*End-Template Functions*/


}
