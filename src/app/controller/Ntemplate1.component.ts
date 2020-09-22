import { Component, OnInit, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../model/applicationmodel.service';
import { Subject, Observable, Subscription } from 'rxjs'
import 'jquery';
import { PlayerConstants } from '../common/playerconstants';


declare var $: any;

@Component({
  selector: 'ntemp1',
  templateUrl: '../view/layout/Ntemplate1.component.html',
  styleUrls: ['../view/css/Ntemplate1.component.css', '../view/css/bootstrap.min.css'],

})

export class Ntemplate1 implements OnInit {
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
  @ViewChild('partialpopupRef') partialpopupRef: any;
  @ViewChild('feedbackpartialPopupAudio') feedbackpartialPopupAudio: any;
  @ViewChild('partialpopupBodyRef') partialpopupBodyRef: any;
  @ViewChild('confirmReplayRef') confirmReplayRef: any;
  @ViewChild('mainVideo') mainVideo: any;
  @ViewChild('feedbackInfoAudio') feedbackInfoAudio: any;





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
  count: number = 0;
  attemptType: string = "";
  rightanspopUpheader_img: boolean = false;
  wronganspopUpheader_img: boolean = false;
  showanspopUpheader_img: boolean = false;
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

  playHoverInstruction() {
    if (!this.narrator.nativeElement.paused!) {
      console.log("narrator/instruction voice still playing");
    } else {
      this.appModel.notifyUserAction();
      console.log("play on Instruction");
      if (this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.play();
        $(".instructionBase img").css("cursor", "pointer");
      }
      if (!this.optionAudio.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.pause();
      }
    }
  }

  onHoverOption(opt, i, j) {
    if (opt && opt != undefined) {
      if (this.narrator.nativeElement.paused) {
        this.optionsBlock.nativeElement.children[i].children[j].children[0].style.cursor = "pointer";
        if (opt.imgsrc && opt.imgsrc.location == "content") {
          this.optionsBlock.nativeElement.children[i].children[j].children[0].src = this.containgFolderPath + "/" + opt.imgsrc.url;
        }
        else {
          this.optionsBlock.nativeElement.children[i].children[j].children[0].src = this.assetsPath + "/" + opt.imgsrc.url;
        }
        this.optionsBlock.nativeElement.children[i].children[j].children[0].style.transform = "scale(1.1)";
        this.optionsBlock.nativeElement.children[i].children[j].children[0].style.transition = "transform .5s";
      }
    }
  }

  playHoverOption(opt, i, j) {
    this.appModel.notifyUserAction();
    // for(var x =0;x<this.optionsBlock.nativeElement.children.length;x++) {
    //   for(var y=0;y<this.optionsBlock.nativeElement.children[x].children.length;y++) {
    //     console.log("audio");
    //     if(!this.optionsBlock.nativeElement.children[x].children[y].children[1].paused) {
    //       this.optionsBlock.nativeElement.children[x].children[y].children[1].currentTime=0;
    //       this.optionsBlock.nativeElement.children[x].children[y].children[1].pause();
    //     }
    //   }
    //   }
    if (this.optionsBlock.nativeElement.children[i].children[j].children[1].paused && this.narrator.nativeElement.paused) {
      if (opt.imgsrc_audio && opt.imgsrc_audio.location == "content") {
        this.optionsBlock.nativeElement.children[i].children[j].children[1].src = this.containgFolderPath + "/" + opt.imgsrc_audio.url;
      } else {
        this.optionsBlock.nativeElement.children[i].children[j].children[1].src = this.assetsPath + "/" + opt.imgsrc_audio.url;
      }
      this.optionsBlock.nativeElement.children[i].children[j].children[1].load();
      if (!this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.pause();
      }
      this.optionsBlock.nativeElement.children[i].children[j].children[1].volume = this.appModel.isMute ? 0 : this.appModel.volumeValue;
      this.optionsBlock.nativeElement.children[i].children[j].children[1].play();
      if (i == 0) {
        if (this.optionsBlock.nativeElement.children[1] != undefined) {
          this.optionsBlock.nativeElement.children[1].style.pointerEvents = "none";
        }
        if (this.optionsBlock.nativeElement.children[2] != undefined) {
          this.optionsBlock.nativeElement.children[2].style.pointerEvents = "none";
        }
      } else if(i == 1) {
        if (this.optionsBlock.nativeElement.children[0] != undefined) {
          this.optionsBlock.nativeElement.children[0].style.pointerEvents = "none";
        }
        if (this.optionsBlock.nativeElement.children[2] != undefined) {
          this.optionsBlock.nativeElement.children[2].style.pointerEvents = "none";
        }
      } else {
        if (this.optionsBlock.nativeElement.children[0] != undefined) {
          this.optionsBlock.nativeElement.children[0].style.pointerEvents = "none";
        }
        if (this.optionsBlock.nativeElement.children[1] != undefined) {
          this.optionsBlock.nativeElement.children[1].style.pointerEvents = "none";
        }
      }
      for (let x = 0; x < this.optionsBlock.nativeElement.children[i].children.length; x++) {
        if (x != j) {
          this.optionsBlock.nativeElement.children[i].children[x].style.pointerEvents = "none";
        }
      }
      //this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
      this.optionsBlock.nativeElement.children[i].children[j].children[1].onended = () => {
        if (i == 0) {
          if (this.optionsBlock.nativeElement.children[1] != undefined) {
            this.optionsBlock.nativeElement.children[1].style.pointerEvents = "";
          }
          if (this.optionsBlock.nativeElement.children[2] != undefined) {
            this.optionsBlock.nativeElement.children[2].style.pointerEvents = "";
          }
        } else if(i==1) {
          if (this.optionsBlock.nativeElement.children[0] != undefined) {
            this.optionsBlock.nativeElement.children[0].style.pointerEvents = "";
          }
          if (this.optionsBlock.nativeElement.children[2] != undefined) {
            this.optionsBlock.nativeElement.children[2].style.pointerEvents = "";
          }
        } else {
          if (this.optionsBlock.nativeElement.children[0] != undefined) {
            this.optionsBlock.nativeElement.children[0].style.pointerEvents = "";
          }
          if (this.optionsBlock.nativeElement.children[1] != undefined) {
            this.optionsBlock.nativeElement.children[1].style.pointerEvents = "";
          }
        }
        for (let x = 0; x < this.optionsBlock.nativeElement.children[i].children.length; x++) {
          if (x != j) {
            this.optionsBlock.nativeElement.children[i].children[x].style.pointerEvents = "";
          }
        }
      } 
      
    }
  }
  onHoverOptionOut(opt, i, j) {
    if (opt && opt != undefined) {
      this.OptionZoomOutAnimation(opt, i, j);
    }
  }

  optionHover(opt, i, j) {
    //$(this.optionsBlock.nativeElement.children[i].children[j].children[0]).addClass("scaleInAnimation");
    this.onHoverOption(opt, i, j);
    //this.optionsBlock.nativeElement.children[i].children[j].children[1].play();
  }

  // playHoverOption(opt, i, j) {
  //   if (this.optionAudio.nativeElement.paused && this.narrator.nativeElement.paused) {
  //     if (opt.imgsrc_audio && opt.imgsrc_audio.location == "content") {
  //       this.optionAudio.nativeElement.src = this.containgFolderPath + "/" + opt.imgsrc_audio.url;
  //     } else {
  //       this.optionAudio.nativeElement.src = this.assetsPath + "/" + opt.imgsrc_audio.url;
  //     }
  //     this.optionAudio.nativeElement.load();
  //     if (!this.instruction.nativeElement.paused) {
  //       this.instruction.nativeElement.pause();
  //     }
  //     this.optionAudio.nativeElement.play();
  //     this.onHoverOption(opt, i, j);
  //   }
  // }
  // onHoverOptionOut(opt, i, j) {
  //   if (opt && opt != undefined) {
  //     this.OptionZoomOutAnimation(opt, i, j);
  //   }
  // }

  ngAfterViewChecked() {
    this.templatevolume(this.appModel.volumeValue, this);
  }

  OptionZoomOutAnimation(opt, i, j) {
    if (!this.checked && this.narrator.nativeElement.paused) {
      opt.imgsrc = opt.imgsrc_original;
      if (opt.imgsrc && opt.imgsrc.location == "content") {
        this.optionsBlock.nativeElement.children[i].children[j].children[0].src = this.containgFolderPath + "/" + opt.imgsrc.url;
      } else {
        this.optionsBlock.nativeElement.children[i].children[j].children[0].src = this.assetsPath + "/" + opt.imgsrc.url;
      }
      this.optionsBlock.nativeElement.children[i].children[j].children[0].style.transform = "none";
      this.optionsBlock.nativeElement.children[i].children[j].children[0].style.transition = " ";
      this.optionsBlock.nativeElement.children[i].children[j].children[0].style.cursor = " ";
    }
  }

  onClickoption(opt, i, j) {
    if (!this.narrator.nativeElement.paused! || !this.instruction.nativeElement.paused) {
      console.log("narrator/instruction voice still playing");
    } else {
      //this.count = 0;
      this.appModel.enableSubmitBtn(true);
      this.appModel.enableReplayBtn(false);
      if (this.feedback.correct_ans_index.includes(opt.id)) {
        this.noOfRightAnsClicked++;
        this.rightansArray.push(opt);
      } else {
        this.noOfWrongAnsClicked++;
        this.wrongansArray.push(opt);
      }
      this.optionsBlock.nativeElement.children[i].children[j].className += " disable_div";
      this.optionsBlock.nativeElement.children[i].children[j].style = "opacity:0.3";
      this.appModel.notifyUserAction();
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
          this.appModel.event = { 'action': 'end' };
        }
      }
    } else {
      this.appModel.moveNextQues(this.attemptType);
    }
  }


  ngOnInit() {
    if (this.appModel.isNewCollection) {
      this.appModel.event = { 'action': 'segmentBegins' };
    }
    this.containgFolderPath = this.getBasePath();

    this.setData();
    this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
      if (mode == "manual") {
        //show modal for manual
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          $("#instructionBar").addClass("disable_div");
          this.popupRef.nativeElement.classList = "displayPopup modal";
          this.appModel.resetBlinkingTimer();
          this.setFeedbackAudio();
        }
      } else if (mode == "auto") {

        //show modal of auto
        this.styleHeaderPopup = this.feedbackObj.style_header;
        this.styleBodyPopup = this.feedbackObj.style_body;
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          $("#instructionBar").addClass("disable_div");
          this.checked = true;
          this.popupRef.nativeElement.classList = "displayPopup modal";
          this.confirmModalRef.nativeElement.classList = "modal";
          this.submitModalRef.nativeElement.classList = "modal";
          this.confirmReplayRef.nativeElement.classList = "modal";
          this.infoModalRef.nativeElement.classList="modal";
          //this.appModel.enableReplayBtn(true);
          this.noOfRightAnsClicked = 0;
          this.noOfWrongAnsClicked = 0;
          this.attemptType = "auto";
          this.setFeedbackAudio();
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
        this.appModel.handlePostVOActivity(true);
        if (this.confirmReplayRef && this.confirmReplayRef.nativeElement) {
          $("#optionsBlock .options").addClass("disable_div");
          this.confirmReplayRef.nativeElement.classList = "displayPopup modal";
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

    this.appModel.nextBtnEvent().subscribe(() =>{
			if(this.appModel.isLastSectionInCollection){
				this.appModel.event = {'action': 'segmentEnds'};	
			}
			if(this.appModel.isLastSection){
					this.appModel.event = {'action': 'end'};
				}
		})

    this.appModel.postWrongAttempt.subscribe(() => {
      this.postWrongAttemplt();
    })
    this.appModel.resetBlinkingTimer();
  }

  postWrongAttemplt() {
    this.resetAttempt();
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
    if (obj.feedbackInfoAudio && obj.feedbackInfoAudio.nativeElement) {
      obj.feedbackInfoAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    // if(obj.optionsBlock && obj.optionsBlock.nativeElement)
    // {
    //   obj.optionsBlock.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    // }
    if (obj.feedbackPopupAudio && obj.feedbackPopupAudio.nativeElement) {
      obj.feedbackPopupAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.instruction && obj.instruction.nativeElement) {
      obj.instruction.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
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
        this.appModel.handlePostVOActivity(true);
          this.appModel.enableReplayBtn(false);
          $("#optionsBlock .options").addClass("disable_div");
        $(".instructionBase").addClass("disable_div");
        this.appModel.enableSubmitBtn(false);
          setTimeout(() => {
            this.mainVideo.nativeElement.play();
            this.mainVideo.nativeElement.onended = () => {
              //this.appModel.enableSubmitBtn(true);
              this.isPlayVideo = false;
              $(".videoExpand")[0].classList.value="bodyContent";
              this.instruction.nativeElement.play();
              this.instruction.nativeElement.onended = () => {
                this.appModel.videoStraming(false);
                this.appModel.enableReplayBtn(true);
                this.appModel.handlePostVOActivity(false);
                $("#optionsBlock .options").removeClass("disable_div");
                $(".instructionBase").removeClass("disable_div");
                this.isQuesTypeVideo = false;
                //setTimeout(() => {
                //this.isPlayVideo = false;
              }
                //this.startActivity();
              //}, 200)
            }
          }, 500);
      }
    }
  }

  //checkforQVO() {
  //  if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
  //    this.narrator.nativeElement.src = this.quesObj.quesInstruction.location == "content" ? this.containgFolderPath + "/" + this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
  //    this.appModel.handlePostVOActivity(true);
  //    this.optionsBlock.nativeElement.classList = "row mx-0 disableDiv";
  //    this.narrator.nativeElement.play();
  //    this.narrator.nativeElement.onended = () => {
  //      this.isQuesTypeImage = true;
  //      this.appModel.handlePostVOActivity(false);

  //    }
  //  } else {
  //    this.appModel.handlePostVOActivity(false);
  //  }
  //}

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
      this.optionObj = fetchedData.optionObj;
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
    this.count = 0;
    this.attemptType = "manual";
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
      if ((this.noOfRightAnsClicked == this.feedback.correct_ans_index.length) && this.noOfWrongAnsClicked == 0) {
        $("#optionsBlock .options").css("pointer-events", "none");
        this.styleHeaderPopup = this.feedbackObj.style_header;
        this.styleBodyPopup = this.feedbackObj.style_body;
        setTimeout(() => {
          this.appModel.invokeTempSubject('showModal', 'manual');
          this.appModel.resetBlinkingTimer();
        }, 100);
      }
      if ((this.noOfRightAnsClicked < this.feedback.correct_ans_index.length) && this.noOfWrongAnsClicked == 0) {
        console.log(this.noOfRightAnsClicked);
        console.log(this.noOfWrongAnsClicked);
        this.infoModalRef.nativeElement.classList = "displayPopup modal";
        let partialFeedbackAudio = this.infoPopupAssets.partialCorrectAudio;
        this.feedbackInfoAudio.nativeElement.src = partialFeedbackAudio.location == "content" ? this.containgFolderPath + "/" + partialFeedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + partialFeedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
        this.feedbackInfoAudio.nativeElement.play();
        this.appModel.notifyUserAction();
      }
      if (this.noOfRightAnsClicked == 0 && this.noOfWrongAnsClicked > 0) {
        $("#optionsBlock .options").css("pointer-events", "none");
        this.styleHeaderPopup = this.feedbackObj.wrong_style_header;
        this.styleBodyPopup = this.feedbackObj.wrong_style_body;
        setTimeout(() => {
          this.appModel.invokeTempSubject('showModal', 'manual');
        }, 100);
      }
      if (this.noOfRightAnsClicked > 0 && this.noOfWrongAnsClicked > 0) {
        this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
        this.styleHeaderPopup = this.feedbackObj.style_header;
        this.styleBodyPopup = this.feedbackObj.style_body;
        setTimeout(() => {
          $("#instructionBar").addClass("disable_div");
          this.partialpopupRef.nativeElement.classList = "displayPopup modal";
          this.setFeedbackAudio();
        }, 100);
      }
    } else {
      this.appModel.notifyUserAction();
    }
  }

  dontshowFeedback(id: string, flag: string) {
    if (id == "submit-modal-id") {
      this.submitModalRef.nativeElement.classList = "modal";
      this.optionsBlock.nativeElement.classList = "row mx-0";
      //$("#optionsBlock .options").removeClass("disable_div");
      //$("#optionsBlock .options").css("opacity", "unset");
      //this.appModel.enableSubmitBtn(false);
      //this.appModel.enableReplayBtn(true);
      this.appModel.notifyUserAction();
      //this.resetAttempt();
    }
  }

  endedHandleronSkip() {    
    this.isPlayVideo = false;
    $(".bodyContent")[0].classList.value="bodyContent";
    if(this.videoReplayd) {
          $("#optionsBlock .options").css("pointer-events", "unset");
          $("#optionsBlock .options").removeClass("disable_div");
          $(".instructionBase").removeClass("disable_div");   
          this.appModel.navShow = 2;
          this.appModel.enableReplayBtn(true);  
          this.appModel.videoStraming(false);
          this.appModel.notifyUserAction();
          this.appModel.handlePostVOActivity(false);
    } else{
              this.instruction.nativeElement.play();
    this.instruction.nativeElement.onended=() => {
          
          $("#optionsBlock .options").css("pointer-events", "unset");
          $("#optionsBlock .options").removeClass("disable_div");
          $(".instructionBase").removeClass("disable_div");   
          this.appModel.navShow = 2;
          this.appModel.enableReplayBtn(true);  
          this.appModel.videoStraming(false);
          this.appModel.notifyUserAction();
          this.appModel.handlePostVOActivity(false);
    }
    }
    //document.getElementById("playPauseBtn").children[0].src = this.containgFolderPath + "/" + this.quesObj.quesPlay.url; 
}


PlayPauseVideo(){
  this.appModel.notifyUserAction();
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

  setFeedbackAudio() {
    console.log(this.rightansArray);
    console.log(this.wrongansArray);
    if ((this.noOfRightAnsClicked == this.feedback.correct_ans_index.length) && this.noOfWrongAnsClicked == 0) {
      this.checked = true;
      this.rightanspopUpheader_img = true;
      this.wronganspopUpheader_img = false;
      this.showanspopUpheader_img = false;
      //this.mainmodalRef.nativeElement.src = this.containgFolderPath + "/" + this.feedbackObj.headerTxt_img.url;
      this.rightansArray.sort((a, b) => { return a.id - b.id; });
      if (this.noOfRightAnsClicked > 4) {
        this.rightansArray1 = this.rightansArray.slice(0, 4);
        this.rightansArray2 = this.rightansArray.slice(4, this.rightansArray.length);
        this.AnsObj = [this.rightansArray1, this.rightansArray2];
        this.Array2required = true;
      } else {
        this.ansArray1 = this.rightansArray.slice(0, this.rightansArray.length);
        this.Array2required = false;
      }
      let checkDom = setInterval(() => {
        clearInterval(checkDom);
        this.playFeedbackAudio(0, undefined, false);
      }, 100);
      this.appModel.enableSubmitBtn(false);
      this.appModel.enableReplayBtn(false);
      $(".refQues").css("opacity", "0.3");
      $("#optionsBlock .options").css("opacity", "0.3");
      $("#instructionBar").css("pointer-events", "none");
      $("#instructionBar").css("opacity", "0.3");
    }
    if (this.noOfRightAnsClicked == 0 && this.noOfWrongAnsClicked > 0) {
      this.rightanspopUpheader_img = false;
      this.wronganspopUpheader_img = true;
      this.showanspopUpheader_img = false;
      this.wrongansArray.sort((a, b) => { return a.id - b.id; });
      if (this.noOfWrongAnsClicked > 4) {
        this.wrongansArray1 = this.wrongansArray.slice(0, 4);
        this.wrongansArray2 = this.wrongansArray.slice(4, this.wrongansArray.length);
        this.AnsObj = [this.wrongansArray1, this.wrongansArray2]
        this.Array2required = true;
      } else {
        this.ansArray1 = this.wrongansArray.slice(0, this.wrongansArray.length);
        this.Array2required = false;
      }
      let checkDom = setInterval(() => {
        clearInterval(checkDom);
        this.playFeedbackAudio(0, undefined, false);
      }, 100);
      this.appModel.enableSubmitBtn(false);
      this.appModel.enableReplayBtn(true);
      $("#optionsBlock .options").css("opacity", "unset");
      $("#optionsBlock .options").removeClass("disable_div");
    }
    if (this.noOfRightAnsClicked == 0 && this.noOfWrongAnsClicked == 0) {
      console.log(this.rightAnspopupAssets);
      this.rightanspopUpheader_img = false;
      this.wronganspopUpheader_img = false;
      this.showanspopUpheader_img = true;
      this.rightAnspopupAssets.sort((a, b) => { return a.id - b.id; });
      if (this.rightAnspopupAssets.length > 4) {
        this.rightansArray1 = this.rightAnspopupAssets.slice(0, 4);
        this.rightansArray2 = this.rightAnspopupAssets.slice(4, this.rightAnspopupAssets.length);
        this.AnsObj = [this.rightansArray1, this.rightansArray2]
        this.Array2required = true;
      } else {
        this.ansArray1 = this.rightAnspopupAssets.slice(0, this.rightAnspopupAssets.length);
        this.Array2required = false;
      }
      let checkDom = setInterval(() => {
        clearInterval(checkDom);
        this.playrightFeedbackAudioPopup(0);
      }, 100);
      this.appModel.enableSubmitBtn(false);
      this.appModel.enableReplayBtn(false);
      $(".refQues").css("opacity", "0.3");
      $("#optionsBlock .options").css("opacity", "0.3");
      $("#optionsBlock .options").css("pointer-events", "none");
      $("#instructionBar").css("pointer-events", "none");
      $("#instructionBar").css("opacity", "0.3");
    }
    if (this.noOfRightAnsClicked > 0 && this.noOfWrongAnsClicked > 0) {
      this.partialpopupRequired = true;
      this.rightansArray.sort((a, b) => { return a.id - b.id; });
      this.wrongansArray.sort((a, b) => { return a.id - b.id; });
      let checkDom = setInterval(() => {
        clearInterval(checkDom);
        this.playrightFeedbackAudioforPartialPopup(0);
      }, 100);
      this.appModel.enableSubmitBtn(false);
      this.appModel.enableReplayBtn(true);
      $("#optionsBlock .options").css("opacity", "unset");
      $("#optionsBlock .options").removeClass("disable_div");
      this.optionsBlock.nativeElement.classList = "row mx-0";
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
          this.blinkOnLastQues();
          this.appModel.moveNextQues();
        }, 2000);
        
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
        this.blinkOnLastQues();
        this.appModel.moveNextQues();
      }, 2000);
      
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
        if (this.count == 0) {
          this.closeModal();
        }
        //this.closeModal();
      }, 2000)
    }
  }
  resetAttempt() {
    this.count = 1;
    this.noOfRightAnsClicked = 0;
    this.noOfWrongAnsClicked = 0;
    this.rightansArray = [];
    this.wrongansArray = [];
    this.rightansArray1 = [];
    this.rightansArray2 = [];
    this.wrongansArray1 = [];
    this.wrongansArray2 = [];
    this.ansArray1 = [];
    this.AnsObj = [];
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
          if (this.count == 0) {
            this.closeModal();
          }
        }, 2000);
      }

    } else {
      setTimeout(() => {
        if (!(this.noOfRightAnsClicked == 0 && this.noOfWrongAnsClicked > 0)) {
          if (!this.checked) {
            this.attemptType = "";
          }
          this.blinkOnLastQues();
        }
        if (this.count == 0) {
          this.closeModal();
        }
      }, 2000);
      //this.blinkOnLastQues();
    }
  }
  sendFeedback(id: string, flag: string) {
    this.attemptType = "auto";
    this.confirmModalRef.nativeElement.classList = "modal";
    if(flag != "no") {
      this.noOfRightAnsClicked = 0;
      this.noOfWrongAnsClicked = 0;
    }
    if (flag == "yes") {
      this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
      this.styleHeaderPopup = this.feedbackObj.style_header;
        this.styleBodyPopup = this.feedbackObj.style_body;
      setTimeout(() => {
        this.appModel.invokeTempSubject('showModal', 'manual');
      }, 100);

      $("#instructionBar").addClass("disable_div");
      $("#optionsBlock .options").css("opacity", "0.3");
      $("#instructionBar").css("opacity", "0.3");
      this.checked = true;
    } else {
      this.appModel.notifyUserAction();
      $("#instructionBar").removeClass("disable_div");
    }
  }

  showReplay(ref, flag: string, action?: string) {
    ref.classList = "modal";
    this.appModel.notifyUserAction();
    this.quesObj.quesPlayPause= this.quesObj.quesPause;
    this.PlayPauseFlag=true;
    if (flag == "yes") {
      if (action == "replay") {
        $(".bodyContent")[0].classList.value="bodyContent videoExpand";
        this.replayVideo();
      }
    } else if (flag == "no") {
      this.appModel.videoStraming(false);
      this.appModel.handlePostVOActivity(false);
      setTimeout(() => {
        $("#instructionBar").removeClass("disable_div");
        $("#optionsBlock .options").removeClass("disable_div");
      }, 1000);
    }
  }

  replayVideo() {
    this.videoReplayd = true;
    this.isPlayVideo = true; 
    this.appModel.enableSubmitBtn(false);
    $("#optionsBlock .options").css("pointer-events", "none");
    $("#optionsBlock .options").addClass("disable_div");
    $(".instructionBase").addClass("disable_div");
    setTimeout(() => {
      //$("#playPauseBtn")[0].children[0].src =  this.containgFolderPath + "/" + this.quesObj.quesPause.url;
      //this.PlayPauseFlag = true;
      this.mainVideo.nativeElement.play();
      //this.appModel.stopAllTimer();
      this.mainVideo.nativeElement.onended = () => {
        //this.appModel.enableSubmitBtn(true);
        $(".bodyContent")[0].classList.value="bodyContent";
        this.appModel.handlePostVOActivity(false);
        $("#optionsBlock .options").css("pointer-events", "unset");
        $("#optionsBlock .options").removeClass("disable_div");
        $(".instructionBase").removeClass("disable_div");
        this.isPlayVideo = false;
        this.appModel.videoStraming(false);
        this.appModel.notifyUserAction();
      }
    }, 500)
  }

  closeModal() {
    for(let i=0;i<this.popupBodyRef.nativeElement.children[0].children.length;i++) {
      if(!this.popupBodyRef.nativeElement.children[0].children[i].children[1].paused) {
        this.popupBodyRef.nativeElement.children[0].children[i].children[1].pause();
        this.popupBodyRef.nativeElement.children[0].children[i].children[1].currentTime=0;
      }
    }
    if (this.feedbackPopupAudio && !this.feedbackPopupAudio.nativeElement.paused) {
      this.feedbackPopupAudio.nativeElement.pause();
      this.feedbackPopupAudio.nativeElement.currentTime = 0;
    }
    if (this.feedbackpartialPopupAudio && !this.feedbackpartialPopupAudio.nativeElement.paused) {
      this.feedbackpartialPopupAudio.nativeElement.pause();
      this.feedbackpartialPopupAudio.nativeElement.currentTime = 0;
    }
    this.popupRef.nativeElement.classList = "modal";
    this.partialpopupRef.nativeElement.classList = "modal";
    this.infoModalRef.nativeElement.classList = "modal";
    this.confirmReplayRef.nativeElement.classList = "modal";
    if (!this.checked) {
      this.appModel.wrongAttemptAnimation();
    }
    if (!(this.noOfRightAnsClicked > 0 && this.noOfWrongAnsClicked == 0)) {
      this.resetAttempt();
    }
    this.appModel.notifyUserAction();

    if (this.checked) {
      this.blinkOnLastQues();
    }

    if (!this.checked) {
      setTimeout(() => {
        $("#instructionBar").removeClass("disable_div");
        $("#optionsBlock .options").removeClass("disable_div");
      }, 1000);
    }

  }
}


