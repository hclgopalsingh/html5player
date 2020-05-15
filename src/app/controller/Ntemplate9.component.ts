import { Component, OnInit, HostListener, ViewChild,OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../model/applicationmodel.service';
import { Subject, Observable, Subscription } from 'rxjs'
import 'jquery';
import { PlayerConstants } from '../common/playerconstants';


declare var $: any;

@Component({
  selector: 'ntemp1',
  templateUrl: '../view/layout/Ntemplate9.component.html',
  styleUrls: ['../view/css/Ntemplate9.component.css', '../view/css/bootstrap.min.css'],

})

export class Ntemplate9 implements OnInit {
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
  @ViewChild('puzzleSection') puzzleSection: any;
  @ViewChild('puzzleBlock') puzzleBlock: any;  
  @ViewChild('feedbackVO') feedbackVO: any;




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
  displayAnswerTimer: number = 2.5;
  timerSubscription: Subscription;

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
  noOfBlocks: any;
  blockcount: any;
  isBlock12: any;
  isBlock9: any;
  isBlock4: boolean;
  isPlayVideo: boolean = true;
  videoReplayd: boolean = false;
  startCount: number = 0;
  blinkFlag: boolean = true;
  blinkTimeInterval: any;
  index1: number = 0;
  index2: number = 0;
  selectableOpts: number;
  selectedOptList: any = [];
  selectedOpt: any = {
    "idx": undefined,
    "moveFrom": undefined,
    "moveTo": undefined
  };
  moveFrom: any;
  moveTo: any;
  quesBlockStart: any;
  quesBlockCenter: any;
  quesBlockEnd: any;
  quesIdx0: any;
  quesIdx1: any;
  quesIdx2: any;
  indexOfBlock: any;
  leftTo: any;
  topTo: any;
  attemptType: string = "";
  rightanspopUpheader_img = false;
  wronganspopUpheader_img = false;
  showanspopUpheader_img = false;
  tempOpt:any;
  tj:any;
  ngOnDestroy() {
    clearInterval(this.blinkTimeInterval);
    this.index1 = 0;
  }

  playHoverInstruction() {
    if (!this.narrator.nativeElement.paused!) {
      console.log("narrator/instruction voice still playing");
    } else {
      console.log("play on Instruction");
      this.appModel.notifyUserAction();
      if (this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.play();
        $(".instructionBase img").css("cursor", "pointer");
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
    if (this.optionAudio.nativeElement.paused && this.narrator.nativeElement.paused) {
      if (opt.imgsrc_audio && opt.imgsrc_audio.location == "content") {
        this.optionAudio.nativeElement.src = this.containgFolderPath + "/" + opt.imgsrc_audio.url;
      } else {
        this.optionAudio.nativeElement.src = this.assetsPath + "/" + opt.imgsrc_audio.url;
      }
      this.optionAudio.nativeElement.load();
      if (!this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.pause();
      }
      this.optionAudio.nativeElement.play();
      this.onHoverOption(opt, i, j);
    }
  }
  onHoverOptionOut(opt, i, j) {
    if (opt && opt != undefined) {
      this.OptionZoomOutAnimation(opt, i, j);
    }
  }

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

  onClickoption(opt, j) {
    if (!this.narrator.nativeElement.paused! || !this.instruction.nativeElement.paused) {
      console.log("narrator/instruction voice still playing");
    } else {
      this.appModel.notifyUserAction();
      let i = this.index1;
      this.indexOfBlock = this.optionsBlock.nativeElement.children[this.index1].id;
      //this.moveTo = this.optionsBlock.nativeElement.children[this.index1].getBoundingClientRect();
      if (opt.id == this.indexOfBlock) {
        this.checked = true;
        if (this.noOfBlocks == 4) {
          $("#puzzleBlock4").addClass("disable_div");
        } else if (this.noOfBlocks == 9) {
          $("#puzzleBlock9").addClass("disable_div");
        } else if (this.noOfBlocks == 12) {
          $("#puzzleBlock12").addClass("disable_div");
        }
        clearInterval(this.blinkTimeInterval);
        this.blinkTimeInterval = 0;
        this.onPlacePuzzle(opt, i, j);
        ++this.index2;
        this.blockcount--;
        if (this.blockcount < 1) {
          this.startCount = 0;
          //this.checked = true;
          setTimeout(() => {
            this.attemptType = "manual";
            this.rightanspopUpheader_img = true;
            this.showanspopUpheader_img = false;
            this.appModel.invokeTempSubject('showModal', 'manual');
            $(".bodyContent").css("opacity", "0.3");
            $("#instructionBar").css("opacity", "0.3");
            $(".bodyContent").addClass("disable_div");
            $(".instructionBase").addClass("disable_div");
          }, 3200);
          for (let i = 0; i < this.optionObj.length; i++) {
            if (this.optionObj[i] && this.optionObj[i].Matched) {
              this.optionObj[i].Matched = false;
            }
          }
        }

        this.blinkHolder();
      } else {
        if (this.noOfBlocks == 4) {
          $("#puzzleBlock4").addClass("disable_div");
        } else if (this.noOfBlocks == 9) {
          $("#puzzleBlock9").addClass("disable_div");
        } else if (this.noOfBlocks == 12) {
          $("#puzzleBlock12").addClass("disable_div");
        }
        this.onPlacePuzzle(opt, i, j);
      }
    }
  }

  
  onPlacePuzzle(opt, i, j) {
    this.tempOpt = opt;
    this.tj = j
    this.optionsBlock.nativeElement.children[j].src = this.optionObj[j].imgsrcOriginalSize.location == "content" ? this.containgFolderPath + "/" + this.optionObj[j].imgsrcOriginalSize.url : this.assetsPath + "/" + this.optionObj[j].imgsrcOriginalSize.url;
    console.log("Puzzle placed");
    this.moveFrom = this.optionObj[this.index1].style_block;
    let left = this.moveFrom.left;
    let top = this.moveFrom.top;
    let position = this.moveFrom.position;
    let width = this.moveFrom.width;
    if (opt.id == this.indexOfBlock) {
      this.optionObj[this.index1].Matched = true;
      $(this.optionsBlock.nativeElement.children[j]).animate({ left: left, top: top, position: position, width: width }, 800, () => {
        if (opt.imgrightfeedback_audio && opt.imgrightfeedback_audio.url) {
          this.feedbackVO.nativeElement.src = opt.imgrightfeedback_audio.location == "content" ? this.containgFolderPath + "/" + opt.imgrightfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + opt.imgrightfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36);
        }
        setTimeout(() => {
          this.feedbackVO.nativeElement.play();
          this.feedbackVO.nativeElement.onended = () => {
            console.log("audio end");
            this.checked = false;
            if (this.noOfBlocks == 4) {
              $("#puzzleBlock4").removeClass("disable_div");
            } else if (this.noOfBlocks == 9) {
              $("#puzzleBlock9").removeClass("disable_div");
            } else if (this.noOfBlocks == 12) {
              $("#puzzleBlock12").removeClass("disable_div");
            }
          }
        }, 300);
        this.optionsBlock.nativeElement.children[j].style.pointerEvents = "none";
      });
    }
    else {
      $(this.optionsBlock.nativeElement.children[j]).animate({ left: left, top: top, position: position, width: width }, 800, () => {
        if (opt.imgrightfeedback_audio && opt.imgrightfeedback_audio.url) {
          this.feedbackVO.nativeElement.src = opt.imgwrongfeedback_audio.location == "content" ? this.containgFolderPath + "/" + opt.imgwrongfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + opt.imgwrongfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36);
        }
        //setTimeout(() => {
          this.feedbackVO.nativeElement.play();
        this.feedbackVO.nativeElement.onended = () => {
          this.appModel.wrongAttemptAnimation();
          console.log("wrong option chosen")

          // this.moveFrom = opt.style_block;
          // let left = this.moveFrom.left;
          // let top = this.moveFrom.top;
          // let position = this.moveFrom.position;
          // let width = this.moveFrom.width;
          // $(this.optionsBlock.nativeElement.children[j]).animate({ left: left, top: top, position: position, width: width }, 800, () => {
          //   this.optionsBlock.nativeElement.children[j].src = this.optionObj[j].imgsrc.location == "content" ? this.containgFolderPath + "/" + this.optionObj[j].imgsrc.url : this.assetsPath + "/" + this.optionObj[j].imgsrc.url;
          //   if (this.noOfBlocks == 4) {
          //     $("#puzzleBlock4").removeClass("disable_div");
          //   } else if (this.noOfBlocks == 9) {
          //     $("#puzzleBlock9").removeClass("disable_div");
          //   } else if (this.noOfBlocks == 12) {
          //     $("#puzzleBlock12").removeClass("disable_div");
          //   }
          // });
          //if (this.noOfBlocks == 4) {
          //  $("#puzzleBlock4").removeClass("disable_div");
          //} else if (this.noOfBlocks == 9) {
          //  $("#puzzleBlock9").removeClass("disable_div");
          //} else if (this.noOfBlocks == 12) {
          //  $("#puzzleBlock12").removeClass("disable_div");
          //}
          }
        //}, 300);
      }); 
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
      console.log("Segment Ends");
    } else {
      this.appModel.moveNextQues(this.attemptType);
    }
  }


  ngOnInit() {
    if (this.appModel.isNewCollection) {
      this.appModel.event = { 'action': 'segmentBegins' };
    }
    this.containgFolderPath = this.getBasePath();
    clearInterval(this.blinkTimeInterval);
    this.startCount = 0;
    this.setData();
    this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
      if (mode == "manual") {
        //show modal for manual
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          $("#instructionBar").addClass("disable_div");
          this.popupRef.nativeElement.classList = "displayPopup modal";
          //this.setFeedbackAudio();
          if (this.rightAnspopupAssets && this.rightAnspopupAssets.imgrightfeedback_audio) {
            this.feedbackPopupAudio.nativeElement.src = this.rightAnspopupAssets.imgrightfeedback_audio.location == "content" ? this.containgFolderPath + "/" + this.rightAnspopupAssets.imgrightfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.rightAnspopupAssets.imgrightfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36);
          }
          this.feedbackPopupAudio.nativeElement.play();
          this.feedbackPopupAudio.nativeElement.onended = () => {
            this.checked = true;
          setTimeout(() => {
            this.closeModal();
          },2000);
        }
        }
      } else if (mode == "auto") {

        //show modal of auto
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          $("#instructionBar").addClass("disable_div");
          this.checked = true;
          this.attemptType = "auto";
          this.rightanspopUpheader_img = false;
          this.showanspopUpheader_img = true;
          this.confirmModalRef.nativeElement.classList="modal";
          this.popupRef.nativeElement.classList = "displayPopup modal";
          if (this.rightAnspopupAssets && this.rightAnspopupAssets.imgrightfeedback_audio) {
            this.feedbackPopupAudio.nativeElement.src = this.rightAnspopupAssets.imgrightfeedback_audio.location == "content" ? this.containgFolderPath + "/" + this.rightAnspopupAssets.imgrightfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.rightAnspopupAssets.imgrightfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36);
          }
          this.feedbackPopupAudio.nativeElement.play();
          this.feedbackPopupAudio.nativeElement.onended = () => {
            this.checked = true;
            setTimeout(() => {
              this.closeModal();
            }, 2000);
          }
        }
      }
    })


    this.appModel.getConfirmationPopup().subscribe((action) => {
      this.appModel.notifyUserAction();
      if (action == "uttarDikhayein") {
        if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
          $("#instructionBar").addClass("disable_div");
          this.confirmModalRef.nativeElement.classList = "displayPopup modal";
        }
      }
      if (action == "submitAnswer") {
        this.submitModalRef.nativeElement.classList = "displayPopup modal";
      }
      if (action == "replayVideo") {
        this.appModel.videoStraming(true);
        if (this.confirmReplayRef && this.confirmReplayRef.nativeElement) {
          $("#optionsBlock .options").addClass("disable_div");
          this.confirmReplayRef.nativeElement.classList = "displayPopup modal";
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
			//this.postWrongAttemplt();
			setTimeout(()=>{
				this.postWrongAttemplt()
				},750 )
		});
    this.appModel.resetBlinkingTimer();
  }

  postWrongAttemplt(){
    let j = this.tj
    let opt = this.tempOpt;
    this.moveFrom = opt.style_block;
          let left = this.moveFrom.left;
          let top = this.moveFrom.top;
          let position = this.moveFrom.position;
          let width = this.moveFrom.width;
          $(this.optionsBlock.nativeElement.children[j]).animate({ left: left, top: top, position: position, width: width }, 800, () => {
            this.optionsBlock.nativeElement.children[j].src = this.optionObj[j].imgsrc.location == "content" ? this.containgFolderPath + "/" + this.optionObj[j].imgsrc.url : this.assetsPath + "/" + this.optionObj[j].imgsrc.url;
            if (this.noOfBlocks == 4) {
              $("#puzzleBlock4").removeClass("disable_div");
            } else if (this.noOfBlocks == 9) {
              $("#puzzleBlock9").removeClass("disable_div");
            } else if (this.noOfBlocks == 12) {
              $("#puzzleBlock12").removeClass("disable_div");
            }
          });

    
  }



  ngOnDestory() {
    clearInterval(this.blinkTimeInterval);
    for (let i = 0; i < this.optionObj.length; i++) {
      if (this.optionObj[i] && this.optionObj[i].Matched) {
        this.optionObj[i].Matched = false;
      }
    }
  }


  templatevolume(vol, obj) {
    if (obj.narrator && obj.narrator.nativeElement) {
      obj.narrator.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.optionAudio && obj.optionAudio.nativeElement) {
      obj.optionAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
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

  checkforQVO() {
    if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
      this.narrator.nativeElement.src = this.quesObj.quesInstruction.location == "content" ? this.containgFolderPath + "/" + this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
      this.appModel.handlePostVOActivity(true);

      this.optionsBlock.nativeElement.classList = "row mx-0 disableDiv";
      this.puzzleSection.nativeElement.classList = "bodyContent disable_div";
      this.narrator.nativeElement.play();
      this.narrator.nativeElement.onended = () => {
        this.puzzleSection.nativeElement.classList = "bodyContent";
        this.optionsBlock.nativeElement.classList = "row mx-0";
        this.isQuesTypeImage = true;
        this.startActivity();
        this.appModel.handlePostVOActivity(false);

      }
    } else {
      this.startActivity();
      this.appModel.handlePostVOActivity(false);
    }
  }

  startActivity() {
    this.startCount = 1;
    this.blinkHolder();
  }

  blinkHolder() {
    this.blinkFlag = true;
    this.blinkTimeInterval = setInterval(() => {
      if (this.startCount == 1) {
        this.blinkHolderImg(this.index1);
      } else {
        clearInterval(this.blinkTimeInterval);
        console.log(this.optionsBlock.nativeElement);
        //console.log(this.optionObj);
        for (let i = 0; i < this.optionsBlock.nativeElement.children.length; i++) {
            if (this.optionObj[i] && this.optionObj[i].imgsrc_original) {
              this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_original;
            } 
        }
      }
    }, 300);
  }

  blinkHolderImg(i) {
    if (this.optionObj[i] && this.optionObj[i].imgsrc_hover && !this.optionObj[i].Matched) {
        if (this.blinkFlag) {
          this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_hover;
          this.blinkFlag = false;
        } else {
          this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_original;
          this.blinkFlag = true;
        }
    } else {
      ++this.index1;
      //this.index2 = 0;
      this.blinkHolderImg(this.index1);
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
      this.optionObj = fetchedData.optionObj;
      for (let i = 0; i < this.optionObj.length; i++) {
        this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_original;
        this.optionObj[i].Matched = false;
        }
      this.optionCommonAssets = fetchedData.option_common_assets;
      console.log(this.optionCommonAssets);
      this.feedbackObj = fetchedData.feedback;
      this.correctImg = this.feedbackObj.popup_commmon_imgs.correctimg;
      this.incorrectImg = this.feedbackObj.popup_commmon_imgs.incorrectimg;
      this.rightAnspopupAssets = this.feedbackObj.right_ans_popup;
      this.confirmPopupAssets = fetchedData.feedback.confirm_popup;
      this.infoPopupAssets = fetchedData.feedback.info_popup;
      this.quesObj = fetchedData.quesObj;
      this.noOfBlocks = this.quesObj.noOfBlocks;
      this.blockcount = this.noOfBlocks;
      if (this.noOfBlocks == 12) {
        this.isBlock12 = true;
        this.isBlock9 = false;
        this.isBlock4 = false;
      } else if (this.noOfBlocks == 9) {
        this.isBlock12 = false;
        this.isBlock9 = true;
        this.isBlock4 = false;
      } else if (this.noOfBlocks == 4) {
        this.isBlock12 = false;
        this.isBlock9 = false;
        this.isBlock4 = true;
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

  sendFeedback(id: string, flag: string) {
    this.confirmModalRef.nativeElement.classList = "modal";
    if (flag == "yes") {
      this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
      setTimeout(() => {
        this.attemptType = "auto";
        this.rightanspopUpheader_img = false;
        this.showanspopUpheader_img = true;
        this.appModel.invokeTempSubject('showModal', 'manual');
        this.appModel.resetBlinkingTimer();
      }, 100);

      $("#instructionBar").addClass("disable_div");
      $(".puzzleBlock").addClass("disable_div");
      $(".bodyContent").css("opacity", "0.3");
      $("#instructionBar").css("opacity", "0.3");
      this.checked = true;
    } else {
      this.appModel.notifyUserAction();
      $("#instructionBar").removeClass("disable_div");
    }
  }

  closeModal() {
    if (this.feedbackPopupAudio && !this.feedbackPopupAudio.nativeElement.paused) {
      this.feedbackPopupAudio.nativeElement.pause();
      this.feedbackPopupAudio.nativeElement.currentTime = 0;
    }
    this.startCount = 0;
    this.popupRef.nativeElement.classList = "modal";
    $("#instructionBar").css("opacity", "0.3");
    $(".bodyContent").css("opacity", "0.3");
    $(".bodyContent").addClass("disable_div");
    this.appModel.notifyUserAction();
      this.blinkOnLastQues();
    if (!this.checked) {
      setTimeout(() => {
        $("#instructionBar").removeClass("disable_div");
        $("#optionsBlock .options").removeClass("disable_div");
      }, 1000);
    }

  }
}


