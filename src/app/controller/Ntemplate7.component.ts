import { Component, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../model/applicationmodel.service';
import 'jquery';
import { PlayerConstants } from '../common/playerconstants';


declare var $: any;

@Component({
    selector: 'ntemp7',
    templateUrl: '../view/layout/Ntemplate7.component.html',
    styleUrls: ['../view/css/Ntemplate7.component.css', '../view/css/bootstrap.min.css']

})

export class Ntemplate7 implements OnInit {
    private appModel: ApplicationmodelService;
    constructor(appModel: ApplicationmodelService) {
        this.appModel = appModel;
        if (!this.appModel.isVideoPlayed) {
            this.isVideoLoaded = false;
        } else {
            this.appModel.setLoader(true);
            // if error occured during image loading loader wil stop after 5 seconds 
          this.loaderTimer = setTimeout(() => {
            this.appModel.setLoader(false);
            this.checkforQVO();
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
        this.assetsPath = this.appModel.assetsfolderpath;
        this.appModel.navShow = 2;
    }

    audio = new Audio();
    blink: boolean = false;
    currentIdx = 0;
    commonAssets: any = "";
    optionslist: any = [];
    optionslist_main: any = "";
    myoption: any = [];
    question: any = "";
    feedback: any = "";
    isLastActivity: any = "";
    bool: boolean = false;
    showIntroScreen: boolean;

    helpAudio: any = "";
    isFirstQues: boolean;
    isLastQues: boolean = false;
    isLastQuesAct: boolean;

    noOfImgs: number;
    noOfImgsLoaded: number = 0;
    loaderTimer: any;
    containgFolderPath: string = "";
    assetsPath: string = "";
    loadFlag: boolean = false;
    optionObj: any;
    questionObj: any;
    infoPopupAssets: any;
    confirmAssets: any;
    confirmSubmitAssets: any;
    confirmReplayAssets: any;
    feedbackAssets: any;
    nextBtnInterval: any;
    closeFeedbackmodalTimer: any;
    videoReplayd: boolean = false;
    isVideoLoaded: boolean = false;
    /*isPlayVideo: boolean;*/
    quesEmptyTxtIndx: number = -1;
    isOptionSelected: boolean = false;
    quesObjCopy: any;
    optionSelected: number = -1;
    boundingClientFrom: any;
    boundingClientTo: any;
    isTransition: boolean = false;
    rightPopup: any;
    wrongPopup: any;
    feedbackPopup: any;
    isRightSelected: boolean = false;
    emptyOpt:any;
    isBlankImgLoaded:boolean = false;
    attemptType:string = "";
    isShowans:boolean = false; 

    @ViewChild('mainContainer') mainContainer: any;
    @ViewChild('instructionVO') instructionVO: any;
    @ViewChild('instructionBar') instructionBar: any;
    @ViewChild('quesVORef') quesVORef: any;
    @ViewChild('confirmModalRef') confirmModalRef: any;
    @ViewChild('confirmSubmitRef') confirmSubmitRef: any;
    @ViewChild('infoModalRef') infoModalRef: any;
    @ViewChild('feedbackPopupRef') feedbackPopupRef: any;
    @ViewChild('feedbackAudio') feedbackAudio: any;
    @ViewChild('correctCategory') correctCategory: any;
    @ViewChild('incorrectCategory') incorrectCategory: any;
    @ViewChild('mainVideo') mainVideo: any;
    @ViewChild('confirmReplayRef') confirmReplayRef: any;
    @ViewChild('partialFeedbackRef') partialFeedbackRef: any;
    @ViewChild('refQues') refQues: any;
    @ViewChild('optionRef') optionRef: any;
    @ViewChild('feedbackModalRef') feedbackModalRef: any;
    @ViewChild('feedbackVoRef') feedbackVoRef: any;
    @ViewChild('speakerRef') speakerRef: any;
    @ViewChild('speakerAudioRef') speakerAudioRef; any ;
    ngOnInit() {
        if (this.appModel.isNewCollection) {
            this.appModel.event = { 'action': 'segmentBegins' };
        }
        this.appModel.functionone(this.templatevolume, this);//start end
        this.containgFolderPath = this.getBasePath();
        this.setData();
        this.appModel.getNotification().subscribe(mode => {
            if (mode == "manual") {
                console.log("manual mode ", mode);
            } else if (mode == "auto") {
                console.log("auto mode", mode);
                this.isShowans = true;
                this.getAnswer();
            }
        })
        this.appModel.getConfirmationPopup().subscribe((val) => {
            if (val == "uttarDikhayein") {
                if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
                    this.confirmModalRef.nativeElement.classList = "displayPopup modal";
                    this.appModel.notifyUserAction();
                }
            } else if (val == "replayVideo") {
                if (this.confirmReplayRef && this.confirmReplayRef.nativeElement) {
                    this.confirmReplayRef.nativeElement.classList = "displayPopup modal";
                    this.appModel.notifyUserAction();
                }
            }
        })
        this.appModel.nextBtnEvent().subscribe(() => {
            if (this.appModel.isLastSectionInCollection) {
                this.appModel.event = { 'action': 'segmentEnds' };
            }
            if (this.appModel.isLastSection) {
                this.appModel.event = { 'action': 'end' };
            }
        })

         this.appModel.postWrongAttempt.subscribe(() =>{
             this.postWrongAttemplt();
        })

        this.appModel.resetBlinkingTimer();
    }

    ngOnDestroy() {
    }

    ngAfterViewChecked() {
        this.templatevolume(this.appModel.volumeValue, this);
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
                    this.checkforQVO();
            }
        }
    }
/*
    checkVideoLoaded() {
        if (!this.videoReplayd) {
            this.isVideoLoaded = true;
            this.appModel.setLoader(false);
            this.appModel.navShow = 1;
            this.isPlayVideo = true;
            this.appModel.isVideoPlayed = true;
        } else {
            this.isVideoLoaded = true;
        }
    }
    */

    setData() {
        let fetchedData: any = this.appModel.content.contentData.data;
        this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
        this.optionObj = JSON.parse(JSON.stringify(fetchedData.options));
        this.commonAssets = fetchedData.commonassets;
        this.questionObj = fetchedData.quesObj;
        this.quesObjCopy = JSON.parse(JSON.stringify(this.questionObj));
        for (let i = 0; i < this.questionObj.questionText.length; i++) {
            if (this.questionObj.questionText[i].isHide) {
                this.quesEmptyTxtIndx = i;
                break;
            }
        }
        this.noOfImgs = this.commonAssets.imgCount;
        this.infoPopupAssets = fetchedData.info_popup;
        this.confirmAssets = fetchedData.show_answer_confirm;
        this.confirmSubmitAssets = fetchedData.submit_confirm;
        this.confirmReplayAssets = fetchedData.replay_confirm;
        this.isLastQues = this.appModel.isLastSection;
        this.isLastQuesAct = this.appModel.isLastSectionInCollection;
        if (this.isLastQuesAct || this.isLastQues) {
            this.appModel.setlastQuesNT();
        }
        this.rightPopup = fetchedData.rightFeedback;
        this.wrongPopup = fetchedData.wrongFeedback;
        /* if(this.questionObj && this.questionObj.quesVideo && this.questionObj.quesVideo.autoPlay && !this.appModel.isVideoPlayed){
            this.isPlayVideo = true;
        }else{
            this.isPlayVideo = false;
        }*/
    }
    

    getBasePath() {
        if (this.appModel && this.appModel.content) {
            return this.appModel.content.id + '';
        }
    }

    optionHover(idx, opt) {
        $(this.optionRef.nativeElement.children[idx].children[0]).addClass("scaleInAnimation");
    }

    optionLeave(idx, opt) {
        $(this.optionRef.nativeElement.children[idx].children[0]).addClass("scaleOutAnimation");
        setTimeout(() => {
            $(this.optionRef.nativeElement.children[idx].children[0]).removeClass("scaleInAnimation");
            $(this.optionRef.nativeElement.children[idx].children[0]).removeClass("scaleOutAnimation");
        }, 500)
    }

    playOptionHover(idx,opt){
        this.appModel.notifyUserAction();
        if (opt && opt.audio && opt.audio.url) {
            this.playSound(opt.audio, idx);
        }
    }

    playSound(soundAssets, idx) {
       if(this.audio && this.audio.paused){
        if (soundAssets.location == 'content') {
            this.audio.src = this.containgFolderPath + '/' + soundAssets.url;
        } else {
            this.audio.src = soundAssets.url;
        }
        this.audio.load();
        this.audio.play();
        for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
            if (i != idx) {
                $(this.optionRef.nativeElement.children[i]).addClass("disableDiv");
            }
        }
        this.instructionBar.nativeElement.classList = "instructionBase disableDiv";
        this.speakerRef.nativeElement.classList = "speaker disableDiv";
        this.instructionVO.nativeElement.pause();
        this.instructionVO.nativeElement.currentTime = 0;
         this.speakerRef.nativeElement.children[2].pause();
         this.speakerRef.nativeElement.children[2].currentTime = 0;
         this.speakerRef.nativeElement.children[1].style.display = "none";
        this.audio.onended = () => {
            this.instructionBar.nativeElement.classList = "instructionBase";
            for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
                if (i != idx) {
                    $(this.optionRef.nativeElement.children[i]).removeClass("disableDiv");
                }
            }
        this.instructionBar.nativeElement.classList = "instructionBase";
        this.speakerRef.nativeElement.classList = "speaker";
        }
       }
    }

   /* endedHandler() {
        if (!this.videoReplayd) {
            this.isPlayVideo = false;
            this.appModel.setLoader(true);
            this.appModel.navShow = 2;
            this.appModel.enableReplayBtn(true);
         }
    }*/
    checkforQVO() {
        this.isVideoLoaded = true;
        if (this.questionObj && this.questionObj.quesInstruction && this.questionObj.quesInstruction.url && this.questionObj.quesInstruction.autoPlay) {
            this.quesVORef.nativeElement.src = this.questionObj.quesInstruction.location == "content" ? this.containgFolderPath + "/" + this.questionObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.questionObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
            this.mainContainer.nativeElement.classList = "bodyContent disableDiv";
            this.instructionBar.nativeElement.classList = "instructionBase disableDiv";
            this.quesVORef.nativeElement.play();
            this.appModel.enableReplayBtn(false);
            this.appModel.enableSubmitBtn(false);
            this.appModel.handlePostVOActivity(true);
            this.quesVORef.nativeElement.onended = () => {
                this.mainContainer.nativeElement.classList = "bodyContent";
                this.instructionBar.nativeElement.classList = "instructionBase";
                this.startActivity();
                this.appModel.handlePostVOActivity(false);
                this.appModel.enableReplayBtn(true);
                setTimeout(() =>{
                    this.isBlankImgLoaded = true;
                },0)
            }
        } else {
             this.appModel.handlePostVOActivity(false);
             this.appModel.enableReplayBtn(true);
             setTimeout(() =>{
                    this.isBlankImgLoaded = true;
              },10)
        }
    }

    startActivity() {
    }

    blinkHolder() {
    }

    playInstruction() {
        this.appModel.notifyUserAction();
        if (this.instructionVO.nativeElement && this.instructionVO.nativeElement.src) {
            this.speakerRef.nativeElement.children[2].pause();
            this.speakerRef.nativeElement.children[2].currentTime = 0;
            this.speakerRef.nativeElement.children[1].style.display = "none";
            this.instructionVO.nativeElement.play();
            this.instructionVO.nativeElement.onended = () => {

            }
        }
    }

    hoverConfirm() {
        this.confirmAssets.confirm_btn = this.confirmAssets.confirm_btn_hover;
    }

    houtConfirm() {
        this.confirmAssets.confirm_btn = this.confirmAssets.confirm_btn_original;
    }

    hoverDecline() {
        this.confirmAssets.decline_btn = this.confirmAssets.decline_btn_hover;
    }

    houtDecline() {
        this.confirmAssets.decline_btn = this.confirmAssets.decline_btn_original;
    }

    hoverCloseConfirm() {
        this.confirmAssets.close_btn = this.confirmAssets.close_btn_hover;
    }
    houtCloseConfirm() {
        this.confirmAssets.close_btn = this.confirmAssets.close_btn_original;
    }

    hoverOK() {
        this.infoPopupAssets.ok_btn = this.infoPopupAssets.ok_btn_hover;
    }

    houtOK() {
        this.infoPopupAssets.ok_btn = this.infoPopupAssets.ok_btn_original;
    }

    hoverCloseOk() {
        this.infoPopupAssets.close_btn = this.infoPopupAssets.close_btn_hover;
    }
    houtCloseOk() {
        this.infoPopupAssets.close_btn = this.infoPopupAssets.close_btn_original;
    }

    hoverReplayConfirm() {
        this.confirmReplayAssets.confirm_btn = this.confirmReplayAssets.confirm_btn_hover;
    }

    houtReplayConfirm() {
        this.confirmReplayAssets.confirm_btn = this.confirmReplayAssets.confirm_btn_original;
    }

    hoverReplayDecline() {
        this.confirmReplayAssets.decline_btn = this.confirmReplayAssets.decline_btn_hover;
    }

    houtReplayDecline() {
        this.confirmReplayAssets.decline_btn = this.confirmReplayAssets.decline_btn_original;
    }

    hoverReplayCloseConfirm() {
        this.confirmReplayAssets.close_btn = this.confirmReplayAssets.close_btn_hover;
    }
    houtReplayCloseConfirm() {
        this.confirmReplayAssets.close_btn = this.confirmReplayAssets.close_btn_original;
    }

    sendFeedback(ref, flag: string, action?: string) {
        this.appModel.notifyUserAction();
        ref.classList = "modal";
        if (action == "showAnswer") {
            this.isShowans  = true;
            this.appModel.resetBlinkingTimer();
            this.getAnswer();
            this.appModel.stopAllTimer();
            for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {                
                    $(this.optionRef.nativeElement.children[i]).addClass("disableDiv");                
            }
        } else if (action == "feedbackDone")    {
            if (this.feedbackAudio && this.feedbackAudio.nativeElement && !this.feedbackAudio.nativeElement.paused) {
                this.feedbackAudio.nativeElement.pause();
                this.feedbackAudio.nativeElement.currentTime = 0;
                this.feedbackAssets.feedback_next_btn = this.feedbackAssets.feedback_next_btn_original;
                this.feedbackAssets.feedback_back_btn = this.feedbackAssets.feedback_back_btn_original;
            }
        } else if (action == "replay") {
            //this.replayVideo();
        } else if (action == "feedbackClosed") {
            this.postFeedBackVo();
        }
    }

    selectOpt(opt, idx) {
         this.appModel.enableReplayBtn(false);
        //disable click
        this.mainContainer.nativeElement.classList = "bodyContent disableDiv";
        this.instructionBar.nativeElement.classList = "instructionBase disableDiv";
         this.appModel.stopAllTimer();
        this.optionSelected = idx;
        if (this.optionRef && this.optionRef.nativeElement && this.optionRef.nativeElement.children[this.optionSelected].children[1]) {
            this.boundingClientFrom = this.optionRef.nativeElement.children[this.optionSelected].children[1].getBoundingClientRect();
            this.boundingClientTo = this.refQues.nativeElement.children[this.quesEmptyTxtIndx].getBoundingClientRect();
            $(this.optionRef.nativeElement.children[this.optionSelected].children[1]).animate({ left: (this.boundingClientTo.left + this.boundingClientTo.width/2 - this.boundingClientFrom.left), top: (this.boundingClientTo.top - this.boundingClientFrom.top) }, 500);
            setTimeout(() => {
               $(this.optionRef.nativeElement.children[this.optionSelected].children[1]).addClass('invisible');
            /*  this.quesObjCopy.questionText[this.quesEmptyTxtIndx].url = opt.url;
                this.quesObjCopy.questionText[this.quesEmptyTxtIndx].location = opt.location;*/
                this.emptyOpt = this.quesObjCopy.questionText[this.quesEmptyTxtIndx];
                this.quesObjCopy.questionText[this.quesEmptyTxtIndx] = opt;
                this.isOptionSelected = true;
            }, 450)

            if (opt && opt.isCorrect) {
                // handle for correct attempt
                this.isRightSelected = true;
                this.attemptType = "manual";
                setTimeout(() => {
                    this.feedbackPopup = this.rightPopup;
                    this.feedbackModalRef.nativeElement.classList = "displayPopup modal";
                    this.instructionVO.nativeElement.pause();
                    this.instructionVO.nativeElement.currentTime = 0;
                    this.feedbackVoRef.nativeElement.src = this.feedbackPopup.feedbackVo.location == "content" ? this.containgFolderPath + "/" + this.feedbackPopup.feedbackVo.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackPopup.feedbackVo.url + "?someRandomSeed=" + Math.random().toString(36);
                    this.feedbackVoRef.nativeElement.play();
                    this.feedbackVoRef.nativeElement.onended = () => {
                        setTimeout(() => {
                            this.feedbackModalRef.nativeElement.classList = "modal";
                            this.sendFeedback(this.feedbackModalRef.nativeElement, 'no', 'feedbackClosed');
                        }, 1000)
                    }
                }, 1000)
            } else {
                this.isRightSelected = false;
                //handle for wrong attempt
                setTimeout(() => {
                    this.feedbackPopup = this.wrongPopup;
                    this.feedbackModalRef.nativeElement.classList = "displayPopup modal";
                    this.instructionVO.nativeElement.pause();
                    this.instructionVO.nativeElement.currentTime = 0;
                    this.feedbackVoRef.nativeElement.src = this.feedbackPopup.feedbackVo.location == "content" ? this.containgFolderPath + "/" + this.feedbackPopup.feedbackVo.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackPopup.feedbackVo.url + "?someRandomSeed=" + Math.random().toString(36);
                    this.feedbackVoRef.nativeElement.play();
                    this.feedbackVoRef.nativeElement.onended = () => {
                        setTimeout(() => {
                            this.sendFeedback(this.feedbackModalRef.nativeElement, 'no', 'feedbackClosed');
                            /* this.feedbackModalRef.nativeElement.classList = "modal";
                             $(this.optionRef.nativeElement.children[this.optionSelected].children[1]).animate({ left: "35%", top:""});
                             this.isOptionSelected = false;
                             this.optionSelected = -1;
                              //$(this.refQues.nativeElement.children[this.quesEmptyTxtIndx]).addClass('isInvisible');
                             setTimeout(() =>{
                                   $(this.optionRef.nativeElement.children[idx].children[1]).removeClass('hideit');
                             },50)*/
                        }, 1000)
                    }
                }, 1000)
            }
        }
    }

    postFeedBackVo() {
        this.feedbackVoRef.nativeElement.pause();
        this.feedbackVoRef.nativeElement.currentTime = 0;
         //disable speaker button 
        this.speakerRef.nativeElement.classList="speaker disableDiv";
        this.instructionBar.nativeElement.classList = "instructionBase reduceOpacity";
        if (this.isRightSelected) {
            setTimeout(() => {
               /* for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
                    $(this.optionRef.nativeElement.children[i]).addClass("reduceOpacity");
                }*/
                $(this.mainContainer.nativeElement).addClass('reduceOpacity');
                 this.blinkOnLastQues();
            }, 500)
        } else {
            setTimeout(() =>{
             setTimeout(() => {
            $(this.optionRef.nativeElement.children[this.optionSelected].children[1]).removeClass('invisible');
        }, 50)
             $(this.optionRef.nativeElement.children[this.optionSelected].children[1]).css('top', 'auto').css('left', 'auto');
            this.appModel.wrongAttemptAnimation();
        },200)
        }
    }

    postWrongAttemplt(){
        this.isOptionSelected = false;
            this.mainContainer.nativeElement.classList = "bodyContent";
            this.instructionBar.nativeElement.classList = "instructionBase";
             this.speakerRef.nativeElement.classList="speaker";
            this.quesObjCopy.questionText[this.quesEmptyTxtIndx] = this.emptyOpt;
            this.appModel.startPreviousTimer();
            this.appModel.notifyUserAction();
    }

    playQVo() {
        this.appModel.notifyUserAction();
        this.instructionVO.nativeElement.pause();
        this.instructionVO.nativeElement.currentTime = 0;
        this.speakerRef.nativeElement.children[2].play();
        this.instructionBar.nativeElement.classList = "instructionBase disableDiv";
        for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
               // $(this.optionRef.nativeElement.children[i]).addClass("disableDiv");
        }
        this.speakerRef.nativeElement.children[1].style.display = "block";
        this.speakerRef.nativeElement.children[2].onended = () => {
            this.speakerRef.nativeElement.children[1].style.display = "none";
             for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
                $(this.optionRef.nativeElement.children[i]).removeClass("disableDiv");
                  this.instructionBar.nativeElement.classList = "instructionBase";
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
                    this.appModel.event = { 'action': 'end' };
                }
            }
        } else {
            this.appModel.moveNextQues(this.attemptType);
        }
    }

    setBlinkOnNextBtn() {
        let flag = true;
        this.nextBtnInterval = setInterval(() => {
            if (flag) {
                this.feedbackAssets.feedback_next_btn = this.feedbackAssets.feedback_next_btn_hover;
                flag = false;
            } else {
                this.feedbackAssets.feedback_next_btn = this.feedbackAssets.feedback_next_btn_original;
                flag = true;
            }
        }, 300)
    }

    resetActivity() {

    }

    hoverFeedbackClose() {
        this.feedbackAssets.close_btn = this.feedbackAssets.close_btn_hover;
    }

    houtFeedbackClose() {
        this.feedbackAssets.close_btn = this.feedbackAssets.close_btn_original;
    }

    hoverFeedbackNxt() {
        this.feedbackAssets.feedback_next_btn = this.feedbackAssets.feedback_next_btn_hover;
    }
    hoverFeedbackPre() {
        this.feedbackAssets.feedback_back_btn = this.feedbackAssets.feedback_back_btn_hover;
    }
    hleaveFeedbackNxt() {
        this.feedbackAssets.feedback_next_btn = this.feedbackAssets.feedback_next_btn_original;
    }
    hleaveFeedbackPre() {
        this.feedbackAssets.feedback_back_btn = this.feedbackAssets.feedback_back_btn_original;
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

    nextFeedback() {
    }

    prevFeedback() {
    }

    getAnswer() {
        this.attemptType = "auto";
        let correctOpt: any;
        for (let i = 0; i < this.optionObj.opts.length; i++) {
            if (this.optionObj.opts[i].isCorrect) {
                correctOpt = this.optionObj.opts[i];
                break;
            }
        }
       this.quesObjCopy.questionText[this.quesEmptyTxtIndx].url = correctOpt.url;
       this.quesObjCopy.questionText[this.quesEmptyTxtIndx].location = correctOpt.location;
        this.feedbackPopup = this.rightPopup;
        this.feedbackModalRef.nativeElement.classList = "displayPopup modal";
        this.confirmModalRef.nativeElement.classList="modal";
        //this.confirmReplayRef.nativeElement.classList="modal";
        this.instructionVO.nativeElement.pause();
        this.instructionVO.nativeElement.currentTime = 0;
        if(this.isShowans){
            this.feedbackVoRef.nativeElement.src = this.containgFolderPath + "/" + this.feedbackPopup.showansSound.url + "?someRandomSeed=" + Math.random().toString(36)
        }
        else{
            this.feedbackVoRef.nativeElement.src = this.feedbackPopup.feedbackVo.location == "content" ? this.containgFolderPath + "/" + this.feedbackPopup.feedbackVo.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackPopup.feedbackVo.url + "?someRandomSeed=" + Math.random().toString(36);
        }
        this.feedbackVoRef.nativeElement.play();
        this.isRightSelected = true;
        this.isOptionSelected = true;
         this.appModel.enableReplayBtn(false);
        this.feedbackVoRef.nativeElement.onended = () => {
            setTimeout(() => {
                this.sendFeedback(this.feedbackModalRef.nativeElement, 'no', 'feedbackClosed');
            }, 1000)
        }
    }

    templatevolume(vol, obj) {
        if (obj.quesVORef && obj.quesVORef.nativeElement) {
            obj.quesVORef.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.feedbackPopupAudio && obj.feedbackPopupAudio.nativeElement) {
            obj.feedbackPopupAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        } 
        if (obj.instructionVO && obj.instructionVO.nativeElement) {
            obj.instructionVO.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.feedbackAudio && obj.feedbackAudio.nativeElement) {
            obj.feedbackAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.audio) {
            obj.audio.volume = obj.appModel.isMute ? 0 : vol;
        }
        if(obj.mainVideo && obj.mainVideo.nativeElement){
            this.mainVideo.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if(obj.speakerAudioRef && obj.speakerAudioRef.nativeElement){
          this.speakerAudioRef.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if(obj.feedbackVoRef && obj.feedbackVoRef.nativeElement){
            this.feedbackVoRef.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
          }
    }

   /* replayVideo() {
        this.videoReplayd = true;
        this.isPlayVideo = true;
        this.appModel.stopAllTimer();
        setTimeout(() => {
            this.mainVideo.nativeElement.play();
            this.mainVideo.nativeElement.onended = () => {
                this.isPlayVideo = false;
                console.log("video eneded in replay function");
                this.appModel.startPreviousTimer();
                this.appModel.notifyUserAction();
            }
        }, 500)
    }*/

}
