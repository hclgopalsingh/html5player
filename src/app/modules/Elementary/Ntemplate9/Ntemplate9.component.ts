import { Component, OnInit, HostListener, ViewChild,OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { Subject, Observable, Subscription } from 'rxjs'
import 'jquery';
import { PlayerConstants } from '../../../common/playerconstants';
import { SharedserviceService } from '../../../services/sharedservice.service';
import { ThemeConstants } from '../../../common/themeconstants';

declare var $: any;

@Component({
  selector: 'app-ntemplate9',
  templateUrl: './Ntemplate9.component.html',
  styleUrls: ['./Ntemplate9.component.css','../../../view/css/bootstrap.min.css']
})
export class Ntemplate9Component implements OnInit {

  private appModel: ApplicationmodelService;
  constructor(appModel: ApplicationmodelService,private Sharedservice: SharedserviceService) {
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
  commonAssets: any = "";
  feedback: any = "";
  checked: boolean = false;

  isLastQues: boolean = false;
  isLastQuesAct: boolean;
  /*Start: Theme Implementation(Template Changes)*/
  controlHandler = {
		isSubmitRequired:false,
    isReplayRequired:false
  };
  themePath:any;
  fetchedcontent:any;
  functionalityType:any;
  showAnsTimeout:number;
  /*END: Theme Implementation(Template Changes)*/
  noOfImgs: number;
  noOfImgsLoaded: number = 0;
  loaderTimer: any;
  containgFolderPath: string = "";
  assetsPath: string = "";
  loadFlag: boolean = false;
  optionObj: any;
  feedbackObj: any;
  confirmPopupAssets: any;
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
  startCount: number = 0;
  blinkFlag: boolean = true;
  blinkTimeInterval: any;
  index1: number = 0;
  index2: number = 0;
  moveFrom: any;
  moveTo: any;
  indexOfBlock: any;
  leftTo: any;
  topTo: any;
  attemptType: string = "";
  rightanspopUpheader_img = false;
  wronganspopUpheader_img = false;
  showanspopUpheader_img = false;
  tempOpt:any;
  tj:any;
  instructionDisable:boolean=false;
  rightAnsTimeout:any;
  puzzleBlockclicked:boolean=false;

  ngOnDestroy() {
    clearInterval(this.blinkTimeInterval);
    clearInterval(this.rightAnsTimeout);
    this.index1 = 0;
  }

  playHoverInstruction() {
    if (!this.narrator.nativeElement.paused) {
      console.log("narrator/instruction voice still playing");
    } else {
      console.log("play on Instruction");
      this.appModel.notifyUserAction();
      if (this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.play();
        this.instructionDisable=true;
        this.instruction.nativeElement.onended=() => {
          this.instructionDisable=false;
        }
      }
    }
  }


ngAfterViewChecked() {
    this.templatevolume(this.appModel.volumeValue, this);
  }


  onClickoption(opt, j) {
    this.puzzleBlockclicked=true;
    this.instructionDisable=false;
    this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div disable-click";
    this.appModel.handlePostVOActivity(true);
      if (!this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.pause();}
      this.appModel.notifyUserAction();
      let i = this.index1;
      this.indexOfBlock = this.optionsBlock.nativeElement.children[this.index1].id;
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
         this.rightAnsTimeout= setTimeout(() => {
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

  
  onPlacePuzzle(opt, i, j) {
    this.tempOpt = opt;
    this.tj = j
    this.optionsBlock.nativeElement.children[j].src = this.optionObj[j].imgsrcOriginalSize.url;
    console.log("Puzzle placed");
    this.moveFrom = this.optionObj[this.index1].style_block;
    let left = this.moveFrom.left;
    let top = this.moveFrom.top;
    let position = this.moveFrom.position;
    let width = this.moveFrom.width;
    if (opt.id == this.indexOfBlock) {
      this.optionObj[this.index1].Matched = true;
      this.startCount=0;
      $(this.optionsBlock.nativeElement.children[j]).animate({ left: left, top: top, position: position, width: width }, 800, () => {
        if (opt.imgrightfeedback_audio && opt.imgrightfeedback_audio.url) {
          this.feedbackVO.nativeElement.src = opt.imgrightfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36);
        }
        setTimeout(() => {
          this.feedbackVO.nativeElement.play();
          this.feedbackVO.nativeElement.onended = () => {
            console.log("audio end");
            this.puzzleBlockclicked=false;
            this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center";
            this.appModel.handlePostVOActivity(false)
            this.checked = false;
            if (this.noOfBlocks == 4) {
              $("#puzzleBlock4").removeClass("disable_div");
            } else if (this.noOfBlocks == 9) {
              $("#puzzleBlock9").removeClass("disable_div");
            } else if (this.noOfBlocks == 12) {
              $("#puzzleBlock12").removeClass("disable_div");
            }
            this.startCount=1;
            this.blinkHolder();
          }
        }, 300);
        this.optionsBlock.nativeElement.children[j].style.pointerEvents = "none";
      });
    }
    else {
      this.puzzleBlockclicked=false;
      $(this.optionsBlock.nativeElement.children[j]).animate({ left: left, top: top, position: position, width: width }, 800, () => {
        if (opt.imgrightfeedback_audio && opt.imgrightfeedback_audio.url) {
          this.feedbackVO.nativeElement.src = opt.imgwrongfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36);
        }
          this.feedbackVO.nativeElement.play();
        this.feedbackVO.nativeElement.onended = () => {
          this.appModel.wrongAttemptAnimation();
          console.log("wrong option chosen")
          }
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
    /*Start: Theme Implementation(Template Changes)*/
    let fetchedData: any = this.appModel.content.contentData.data;
    this.fetchedcontent = JSON.parse(JSON.stringify(fetchedData));;
    this.functionalityType = this.appModel.content.contentLogic.functionalityType;
    this.themePath = ThemeConstants.THEME_PATH + this.fetchedcontent.productType + '/'+ this.fetchedcontent.theme_name ; 
    this.Sharedservice.imagePath(this.fetchedcontent, this.containgFolderPath, this.themePath, undefined);
    this.checkquesTab();
    this.appModel.globalJsonData.subscribe(data=>{
      this.showAnsTimeout = data.showAnsTimeout;
    });
    /*End: Theme Implementation(Template Changes)*/
    this.setData();
    this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
      if (mode == "manual") {
        //show modal for manual
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          $("#instructionBar").addClass("disable_div");
          this.popupRef.nativeElement.classList = "displayPopup modal";
          if (this.attemptType=="manual" && this.rightAnspopupAssets && this.rightAnspopupAssets.imgrightfeedback_audio) {
            this.feedbackPopupAudio.nativeElement.src = this.rightAnspopupAssets.imgrightfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36);
          } else {
            this.feedbackPopupAudio.nativeElement.src = this.rightAnspopupAssets.imgshowAnsfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36);
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
            this.feedbackPopupAudio.nativeElement.src = this.rightAnspopupAssets.imgshowAnsfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36);
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
        this.instructionDisable=false;
        if (!this.instruction.nativeElement.paused) {
          this.instruction.nativeElement.currentTime = 0;
          this.instruction.nativeElement.pause();}
        if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
          $("#instructionBar").addClass("disable_div");
          this.confirmModalRef.nativeElement.classList = "displayPopup modal";
        }
      }
    });

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
			setTimeout(()=>{
				this.postWrongAttemplt()
				},750 )
		});
    this.appModel.resetBlinkingTimer();
    this.appModel.handleController(this.controlHandler);
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
            this.optionsBlock.nativeElement.children[j].src = this.optionObj[j].imgsrc.url;
            if (this.noOfBlocks == 4) {
              $("#puzzleBlock4").removeClass("disable_div");
            } else if (this.noOfBlocks == 9) {
              $("#puzzleBlock9").removeClass("disable_div");
            } else if (this.noOfBlocks == 12) {
              $("#puzzleBlock12").removeClass("disable_div");
            }
            this.appModel.handlePostVOActivity(false)
            this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center";
          });   
  }

  checkquesTab() {
    if(this.fetchedcontent.commonassets.ques_control!=undefined) {
      this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
    } else {
      this.appModel.getJson();      
    }
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
      this.appModel.handlePostVOActivity(true);
      this.optionsBlock.nativeElement.classList = "row mx-0 disableDiv";
      this.puzzleSection.nativeElement.classList = "bodyContent disable_div";
      this.narrator.nativeElement.play();
      this.narrator.nativeElement.onended = () => {
        this.puzzleSection.nativeElement.classList = "bodyContent";
        this.optionsBlock.nativeElement.classList = "row mx-0";
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
        for (let i = 0; i < this.optionsBlock.nativeElement.children.length; i++) {
            if (this.optionObj[i] && this.optionObj[i].imgsrc_original) {
              this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_original;
            } 
        }
      }
    }, 300);
  }

  blinkHolderImg(i) {
    if (this.optionObj[i] && this.optionObj[i].imgsrc_blink && !this.optionObj[i].Matched) {
        if (this.blinkFlag) {
          this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_blink;
          this.blinkFlag = false;
        } else {
          if(this.optionObj[i].imgsrc_original!=undefined) {
          this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_original;
          }
          this.blinkFlag = true;
        }
    } else {
      ++this.index1;
      this.blinkHolderImg(this.index1);
    }


  }

  setData() {

    if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
      this.commonAssets = this.fetchedcontent.commonassets;
      this.noOfImgs = this.commonAssets.imgCount;
      this.isLastQues = this.appModel.isLastSection;
      this.isLastQuesAct = this.appModel.isLastSectionInCollection;
      if (this.isLastQuesAct || this.isLastQues) {
        this.appModel.setlastQuesNT();
      }
      this.optionObj = this.fetchedcontent.optionObj;
      for (let i = 0; i < this.optionObj.length; i++) {
        if(this.optionObj[i].imgsrc_original!=undefined) {
          this.optionObj[i].imgsrc = this.optionObj[i].imgsrc_original;
        }
        this.optionObj[i].Matched = false;
        }
      this.feedbackObj = this.fetchedcontent.feedback;
      this.rightAnspopupAssets = this.feedbackObj.right_ans_popup;
      this.confirmPopupAssets = this.fetchedcontent.feedback.confirm_popup;
      this.quesObj = this.fetchedcontent.quesObj;
      /*Start: Theme Implementation(Template Changes)*/
        this.controlHandler={
              isSubmitRequired:this.quesObj.submitRequired,
              isReplayRequired:this.quesObj.replayRequired
        }
      /*End: Theme Implementation(Template Changes)*/
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

  hoveronOption(opt) {
    opt.imgsrc=opt.imgsrc_hover;
  }

  hoverOptionOut(opt) {
    if(!this.puzzleBlockclicked) {
       opt.imgsrc=opt.imgsrc_original;
    }
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
