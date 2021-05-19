import { Component, OnInit, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { PlayerConstants } from '../../../common/playerconstants';
import { ThemeConstants } from '../../../common/themeconstants';
import { SharedserviceService } from '../../../services/sharedservice.service';
import { timer } from 'rxjs/observable/timer';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import {
    trigger,
    state,
    style,
    animate,
    transition,
} from '@angular/animations';


@Component({
    selector: 'ntemp7',
    //angular animation to animate options from start to end position
    animations: [
        trigger('openClose', [
            state('open', style({
                'left': '{{leftPos}}',
                'top': '{{topPos}}'
            }), { params: { leftPos: 'auto', topPos: 'auto' } }),
            state('closed', style({
                'left': '{{leftPos}}',
                'top': '{{topPos}}'

            }), { params: { leftPos: 'auto', topPos: 'auto' } }),
            transition('open => closed', [
                animate('.5s')
            ]),
            transition('closed => open', [
                animate('.5s')
            ]),
        ]),
    ],
    templateUrl: './Ntemplate7.component.html',
    styleUrls: ['./Ntemplate7.component.css']

})

export class Ntemplate7 implements OnInit, OnDestroy, AfterViewChecked {
    private appModel: ApplicationmodelService;
    constructor(appModel: ApplicationmodelService, private Sharedservice: SharedserviceService) {
        this.appModel = appModel;
        if (!this.appModel.isVideoPlayed) {
            this.isVideoLoaded = false;
            this.appModel.setLoader(true);
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
    buttonClosed = false;
    destroy = true;
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
    AnswerpopupTxt: boolean = false;
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
    emptyOpt: any;
    isBlankImgLoaded: boolean = false;
    attemptType: string = "";
    isShowans: boolean = false;
    fetchedcontent: any;
    functionalityType: any;
    themePath: any;
    feedbackObj: any;
    styleHeaderPopup: any;
    styleBodyPopup: any;
    confirmPopupAssets: any;
    controlHandler = {
        isSubmitRequired: false,
        isReplayRequired: false
    };
    showAnsTimeout: any;
    InstructionVo: boolean = false;
    disableSection: boolean = false;
    disableOption: boolean = false;
    disableSpeaker: boolean = false;
    optionPlaying: boolean = false;
    popupHeader: any;
    disableAllOption = false;
    showAnswerPopup: boolean = false;
    confirmPopupSubscription: any;
    timerSubscription: Subscription;
    tempSubscription: Subscription;
    isLastQuestion: boolean;
    actComplete: boolean = false;

    @ViewChild('mainContainer') mainContainer: any;
    @ViewChild('instructionVO') instructionVO: any;
    @ViewChild('instructionBar') instructionBar: any;
    @ViewChild('quesVORef') quesVORef: any;
    @ViewChild('confirmModalRef') confirmModalRef: any;
    @ViewChild('feedbackAudio') feedbackAudio: any;
    @ViewChild('mainVideo') mainVideo: any;
    @ViewChild('confirmReplayRef') confirmReplayRef: any;
    @ViewChild('refQues') refQues: any;
    @ViewChild('optionRef') optionRef: any;
    @ViewChild('feedbackModalRef') feedbackModalRef: any;
    @ViewChild('feedbackVoRef') feedbackVoRef: any;
    @ViewChild('speakerRef') speakerRef: any;
    @ViewChild('speakerAudioRef') speakerAudioRef; any;
    ngOnInit() {
        if (this.appModel.isNewCollection) {
            this.appModel.event = { 'action': 'segmentBegins' };
        }
        this.appModel.functionone(this.templatevolume, this);//start end
        this.containgFolderPath = this.getBasePath();
        let fetchedData: any = this.appModel.content.contentData.data;
        //getting json data 
        this.fetchedcontent = JSON.parse(JSON.stringify(fetchedData));;
        this.functionalityType = this.appModel.content.contentLogic.functionalityType;
        this.themePath = ThemeConstants.THEME_PATH + this.fetchedcontent.productType + '/' + this.fetchedcontent.theme_name;
        this.Sharedservice.imagePath(this.fetchedcontent, this.containgFolderPath, this.themePath, this.functionalityType);
        this.appModel.globalJsonData.subscribe(data => {
            this.showAnsTimeout = data.showAnsTimeout;
        });
        this.checkquesTab();
        this.setData();
        this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
            if (mode == "manual") {
                console.log("manual mode ", mode);
            } else if (mode == "auto") {
                console.log("auto mode", mode);
                this.isShowans = true;
                this.getAnswer();
            }
        })
        this.confirmPopupSubscription = this.appModel.getConfirmationPopup().subscribe((val) => {
            if (val == "uttarDikhayein") {
                if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
                    this.instructionVO.nativeElement.pause();
                    this.instructionVO.nativeElement.currentTime = 0;
                    this.confirmModalRef.nativeElement.classList = "displayPopup modal";
                    this.checkForAutoClose();
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

        this.appModel.postWrongAttempt.subscribe(() => {
            //alert('animation close');
            this.optionRef.nativeElement.children[this.optionSelected].children[1].classList.remove('invisible');
            this.postWrongAttemplt();
        })
        this.appModel.handleController(this.controlHandler);
        this.appModel.resetBlinkingTimer();
    }
    checkquesTab() {
        if (this.fetchedcontent.commonassets.ques_control != undefined) {
            this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
        } else {
            this.appModel.getJson();
        }
    }
    ngOnDestroy() {
        this.destroy = true;
        if (this.confirmPopupSubscription != undefined) {
			this.confirmPopupSubscription.unsubscribe();
		}
		if (this.tempSubscription != undefined) {
			this.tempSubscription.unsubscribe();
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
        // this.sendFeedback(this.confirmModalRef.nativeElement,'no');
        this.confirmModalRef.nativeElement.classList = "modal";
			this.timerSubscription.unsubscribe();
		  }
		)
	  }
	  removeSubscription(timer) {
		console.log("waiting for autoClose", timer / 1000);
    }

    ngAfterViewChecked() {
        this.templatevolume(this.appModel.volumeValue, this);
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
                this.checkforQVO();

            }
        }
    }

    setData() {
        this.optionObj = JSON.parse(JSON.stringify(this.fetchedcontent.options));
        this.commonAssets = this.fetchedcontent.commonassets;
        this.questionObj = this.fetchedcontent.quesObj;
        this.quesObjCopy = JSON.parse(JSON.stringify(this.questionObj));
        for (let i = 0; i < this.questionObj.questionText.length; i++) {
            if (this.questionObj.questionText[i].isHide) {
                this.quesEmptyTxtIndx = i;
                break;
            }
        }
        this.feedbackObj = this.fetchedcontent.feedback;
        this.confirmPopupAssets = this.fetchedcontent.feedback.confirm_popup;
        this.confirmReplayAssets = this.fetchedcontent.feedback.replay_confirm;
        this.noOfImgs = this.commonAssets.imgCount;
        this.infoPopupAssets = this.fetchedcontent.info_popup;
        this.confirmSubmitAssets = this.fetchedcontent.submit_confirm;
        this.confirmReplayAssets = this.fetchedcontent.replay_confirm;
        this.isLastQues = this.appModel.isLastSection;
        this.isLastQuesAct = this.appModel.isLastSectionInCollection;
        this.isLastQuestion = this.commonAssets.isLastQues;
        if (this.isLastQuesAct || this.isLastQues) {
            this.appModel.setlastQuesNT();
        }
        this.controlHandler = {
            isSubmitRequired: this.fetchedcontent.quesObj.submitRequired,
            isReplayRequired: this.fetchedcontent.quesObj.replayRequired
        }

    }

    getBasePath() {
        if (this.appModel && this.appModel.content) {
            return this.appModel.content.id + '';
        }
    }

    optionHover(idx, opt) {
        this.InstructionVo = true;
        this.optionRef.nativeElement.children[idx].children[0].classList.add('scaleInAnimation');
        for (let j = 0; j < this.optionObj.opts.length; j++) {
            this.optionRef.nativeElement.children[j].classList.add('disable_div');
        }
        this.optionRef.nativeElement.children[idx].classList.remove('disable_div');
    }

    optionLeave(idx, opt) {

        this.optionRef.nativeElement.children[idx].children[0].classList.add('scaleOutAnimation');
        setTimeout(() => {
            this.optionRef.nativeElement.children[idx].children[0].classList.remove('scaleInAnimation');
            this.optionRef.nativeElement.children[idx].children[0].classList.remove('scaleOutAnimation');
        }, 500)
        if (!this.disableSpeaker) {
            for (let j = 0; j < this.optionObj.opts.length; j++) {
                this.optionRef.nativeElement.children[j].classList.remove('disable_div');
            }
        }
    }
    playOptionHover(idx, opt) {
        this.appModel.notifyUserAction();
        if (opt && opt.audio && opt.audio.url) {
            this.playSound(opt.audio, idx);
        }
    }

    playSound(soundAssets, idx) {

        if (this.audio && this.audio.paused) {
            if (soundAssets.location == 'content') {
                this.audio.src = soundAssets.url;
            } else {
                this.audio.src = soundAssets.url;
            }
            this.audio.load();
            this.audio.play();
            this.optionPlaying = true;
            for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
                if (i != idx) {
                    this.optionRef.nativeElement.children[i].classList.remove('scaleOutAnimation');
                    this.optionRef.nativeElement.children[i].classList.add('disable_div');
                }
            }
            this.disableSpeaker = true;
            this.instructionVO.nativeElement.pause();
            this.instructionVO.nativeElement.currentTime = 0;
            this.speakerRef.nativeElement.children[2].pause();
            this.speakerRef.nativeElement.children[2].currentTime = 0;
            this.speakerRef.nativeElement.children[1].style.display = "none";
            this.audio.onended = () => {
                this.optionPlaying = false;

                for (let j = 0; j < this.optionObj.opts.length; j++) {
                    this.optionRef.nativeElement.children[j].classList.remove('disable_div');
                }
                //this.optionRef.nativeElement.children[idx].classList.remove('disable_div');
                this.disableSpeaker = false;
                for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
                    if (i != idx) {
                        this.optionRef.nativeElement.children[i].classList.remove('disableDiv');
                    }
                }

            }
        }
    }

    checkforQVO() {
        this.isVideoLoaded = true;
        if (this.questionObj && this.questionObj.quesInstruction && this.questionObj.quesInstruction.url && this.questionObj.quesInstruction.autoPlay) {
            this.quesVORef.nativeElement.src = this.questionObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
            this.mainContainer.nativeElement.classList = "bodyContent disableDiv";
            this.instructionBar.nativeElement.classList = "instructionBase disableDiv";
            this.quesVORef.nativeElement.play();
            this.disableSection = true;
            this.disableSpeaker = true;
            this.disableOption = true;
            this.appModel.enableReplayBtn(false);
            this.appModel.enableSubmitBtn(false);
            this.appModel.handlePostVOActivity(true);
            this.quesVORef.nativeElement.onended = () => {
                this.InstructionVo = true;
                this.mainContainer.nativeElement.classList = "bodyContent";
                this.instructionBar.nativeElement.classList = "instructionBase";
                this.startActivity();
                this.appModel.handlePostVOActivity(false);
                this.appModel.enableReplayBtn(true);
                setTimeout(() => {
                    this.isBlankImgLoaded = true;
                }, 0);
                setTimeout(() => {
                    this.disableOption = false;
                    this.disableSpeaker = false;
                    this.disableSection = false;
                }, 1000);

            }
        } else {
            this.appModel.handlePostVOActivity(false);
            this.appModel.enableReplayBtn(true);
            setTimeout(() => {
                this.isBlankImgLoaded = true;
            }, 10)
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
            this.InstructionVo = false;
            this.instructionVO.nativeElement.onended = () => {
                this.InstructionVo = true;
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
        if (this.timerSubscription != undefined) {
			this.timerSubscription.unsubscribe();
        }
        ref.classList = "modal";
        
        if(this.isLastQuestion && flag==="no" && this.isRightSelected && this.actComplete) {
            this.blinkOnLastQues();
            return;
        }
        this.appModel.handlePostVOActivity(false);
        this.appModel.notifyUserAction();
        if (flag == 'no') {
            this.InstructionVo = true;
            this.disableOption = true;
            setTimeout(() => {
                this.disableOption = false;
            }, 1000);
        }
        if (action == "showAnswer") {
            this.showAnswerPopup = true;
            this.styleHeaderPopup = this.feedbackObj.style_header;
            this.styleBodyPopup = this.feedbackObj.style_body;
            if (this.feedbackObj.showAnswerpopupTxt.required) {
                this.AnswerpopupTxt = true;
                this.popupHeader = this.feedbackObj.showAnswerpopupTxt.url;
            } else {
                this.AnswerpopupTxt = false;
            }
            this.isShowans = true;
            this.appModel.resetBlinkingTimer();
            this.getAnswer();
            this.instructionVO.nativeElement.pause();
            this.instructionVO.nativeElement.currentTime = 0;
            this.appModel.stopAllTimer();



            // opt.isCorrect

            for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
                if (this.optionObj.opts[i].isCorrect) {

                    ////this.optionRef.nativeElement.children[i].children[1].classList.add('invisible');
                }
                this.optionRef.nativeElement.children[i].classList.add('disableDiv');
            }
        } else if (action == "feedbackDone") {
            if (this.feedbackAudio && this.feedbackAudio.nativeElement && !this.feedbackAudio.nativeElement.paused) {
                this.feedbackAudio.nativeElement.pause();
                this.feedbackAudio.nativeElement.currentTime = 0;
                this.feedbackAssets.feedback_next_btn = this.feedbackAssets.feedback_next_btn_original;
                this.feedbackAssets.feedback_back_btn = this.feedbackAssets.feedback_back_btn_original;
            }
        } else if (action == "replay") {
            //this.replayVideo();
        } else if (action == "feedbackClosed") {



            this.buttonClosed = true;
            this.postFeedBackVo();
            if (this.showAnswerPopup) {
                if (!this.isOptionSelected) {
                    this.refQues.nativeElement.children[this.quesEmptyTxtIndx].src = "";
                    this.refQues.nativeElement.children[this.quesEmptyTxtIndx].classList = "dark engTxtMargin ansSpace adjustBlink";

                    for (let i = 0; i < this.optionObj.opts.length; i++) {
                        if (this.optionObj.opts[i].isCorrect) {
                            this.optionRef.nativeElement.children[i].children[1].classList.remove('invisible');
                            this.optionRef.nativeElement.children[this.optionSelected].children[1].style.top = 'auto';
                            this.optionRef.nativeElement.children[this.optionSelected].children[1].style.left = 'auto';
                        }
                    }
                }

            } else {

            }
            this.showAnswerPopup = false;
        }
    }

    selectOpt(opt, idx) {
        this.buttonClosed = false;
        this.destroy = false;
        for (let i = 0; i < this.optionObj.opts.length; i++) {
            this.optionObj.opts[i].isOpen = false;
            this.optionObj.opts[i].leftPos = this.optionRef.nativeElement.children[i].children[1].offsetLeft + "px";
            this.optionObj.opts[i].topPos = this.optionRef.nativeElement.children[i].children[1].offsetTop + "px";
        }
        this.appModel.enableReplayBtn(false);
        this.appModel.handlePostVOActivity(true);
        //disable click
        this.mainContainer.nativeElement.classList = "bodyContent disableDiv";
        this.instructionBar.nativeElement.classList = "instructionBase disableDiv";
        this.appModel.stopAllTimer();
        this.optionSelected = idx;
        if (this.optionRef && this.optionRef.nativeElement && this.optionRef.nativeElement.children[this.optionSelected].children[1]) {
            this.boundingClientFrom = this.optionRef.nativeElement.children[this.optionSelected].children[1].getBoundingClientRect();
            this.boundingClientTo = this.refQues.nativeElement.children[this.quesEmptyTxtIndx].getBoundingClientRect();
            opt.isOpen = true;
            opt.leftPos = this.optionRef.nativeElement.children[this.optionSelected].children[1].offsetLeft + "px";
            opt.topPos = this.optionRef.nativeElement.children[this.optionSelected].children[1].offsetTop + "px";
            setTimeout(() => {
                opt.isOpen = false;
                opt.leftPos = this.boundingClientTo.left + this.boundingClientTo.width / 2 - this.boundingClientFrom.left + "px";
                opt.topPos = this.boundingClientTo.top - this.boundingClientFrom.top + "px";

                setTimeout(() => {
                    this.optionRef.nativeElement.children[this.optionSelected].children[1].classList.add('invisible');
                    this.emptyOpt = this.quesObjCopy.questionText[this.quesEmptyTxtIndx];
                    this.quesObjCopy.questionText[this.quesEmptyTxtIndx] = opt;
                    this.isOptionSelected = true;
                    opt.leftPos = "";
                    opt.topPos = "";
                }, 450)

            }, 450)


            if (opt && opt.isCorrect) {
                // handle for correct attempt
                this.isRightSelected = true;
                this.attemptType = "manual";
                setTimeout(() => {
                    this.styleHeaderPopup = this.feedbackObj.style_header;
                    this.styleBodyPopup = this.feedbackObj.style_body;
                    if (this.feedbackObj.rightAnswerpopupTxt.required) {
                        this.AnswerpopupTxt = true;
                        this.popupHeader = this.feedbackObj.rightAnswerpopupTxt.url;
                    } else {
                        this.AnswerpopupTxt = false;
                    }
                    this.feedbackModalRef.nativeElement.classList = "displayPopup modal";
                    this.instructionVO.nativeElement.pause();
                    this.instructionVO.nativeElement.currentTime = 0;
                    this.feedbackVoRef.nativeElement.src = this.commonAssets.rightfeedbackVo.url + "?someRandomSeed=" + Math.random().toString(36);
                    if (!this.destroy) {
                        this.feedbackVoRef.nativeElement.play();
                        this.feedbackVoRef.nativeElement.onended = () => {
                            setTimeout(() => {
                                this.feedbackModalRef.nativeElement.classList = "modal";
                                if (!this.buttonClosed) {
                                    this.sendFeedback(this.feedbackModalRef.nativeElement, 'no', 'feedbackClosed');
                                }
                            }, this.showAnsTimeout)
                        }
                    }

                }, 2000)
            } else {

                this.isRightSelected = false;

                //handle for wrong attempt
                setTimeout(() => {
                    this.disableAllOption = true;
                    this.styleHeaderPopup = this.feedbackObj.wrong_style_header;
                    this.styleBodyPopup = this.feedbackObj.wrong_style_body;
                    if (this.feedbackObj.wrongAnswerpopupTxt.required) {
                        this.AnswerpopupTxt = true;
                        this.popupHeader = this.feedbackObj.wrongAnswerpopupTxt.url;
                    } else {
                        this.AnswerpopupTxt = false;
                    }
                    this.feedbackModalRef.nativeElement.classList = "displayPopup modal";
                    this.instructionVO.nativeElement.pause();
                    this.instructionVO.nativeElement.currentTime = 0;
                    this.feedbackVoRef.nativeElement.src = this.commonAssets.wrongfeedbackVo.url + "?someRandomSeed=" + Math.random().toString(36);

                    if (!this.destroy) {
                        this.feedbackVoRef.nativeElement.play();
                        this.feedbackVoRef.nativeElement.onended = () => {
                            setTimeout(() => {
                                if (!this.buttonClosed) {
                                    this.sendFeedback(this.feedbackModalRef.nativeElement, 'no', 'feedbackClosed');
                                }
                                this.feedbackModalRef.nativeElement.classList = "modal";


                            }, this.showAnsTimeout);
                        }
                    }
                }, 2000)
            }
        }
    }
    postFeedBackVo() {
        this.feedbackVoRef.nativeElement.pause();
        this.feedbackVoRef.nativeElement.currentTime = 0;
        //disable speaker button 
        this.speakerRef.nativeElement.classList = "speaker disableDiv";
        this.instructionBar.nativeElement.classList = "instructionBase reduceOpacity";
        if (this.isRightSelected) {
            setTimeout(() => {
                this.mainContainer.nativeElement.classList.add('reduceOpacity');
                this.blinkOnLastQues();
            }, 500)
        } else {
            setTimeout(() => {
                /*setTimeout(() => {
                    this.optionRef.nativeElement.children[this.optionSelected].children[1].classList.remove('invisible');
                }, 50)*/
                this.optionRef.nativeElement.children[this.optionSelected].children[1].style.top = 'auto';
                this.optionRef.nativeElement.children[this.optionSelected].children[1].style.left = 'auto';
                this.appModel.wrongAttemptAnimation();
                setTimeout(() => {
                    this.disableAllOption = false;
                }, 4000);
            }, 200)
        }
    }
    postWrongAttemplt() {
        this.isOptionSelected = false;
        this.mainContainer.nativeElement.classList = "bodyContent";
        this.instructionBar.nativeElement.classList = "instructionBase";
        this.speakerRef.nativeElement.classList = "speaker";
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

        }
        this.speakerRef.nativeElement.children[1].style.display = "block";
        this.speakerRef.nativeElement.children[2].onended = () => {
            this.InstructionVo = true;
            this.speakerRef.nativeElement.children[1].style.display = "none";
            for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
                this.optionRef.nativeElement.children[i].classList.remove('disableDiv');
                this.instructionBar.nativeElement.classList = "instructionBase";
            }
        }
    }
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


    getAnswer() {
        this.attemptType = "auto";
        let correctOpt: any;
        for (let i = 0; i < this.optionObj.opts.length; i++) {
            if (this.optionObj.opts[i].isCorrect) {
                correctOpt = this.optionObj.opts[i];
                break;
            }
        }


        for (let i = 0; i < this.optionObj.opts.length; i++) {
            if (this.optionObj.opts[i].isCorrect) {
                if (this.showAnswerPopup) {

                } else {
                    this.optionRef.nativeElement.children[i].children[1].classList.add('invisible');
                }

            }
        }

        this.quesObjCopy.questionText[this.quesEmptyTxtIndx].url = correctOpt.url;
        this.quesObjCopy.questionText[this.quesEmptyTxtIndx].location = correctOpt.location;
        this.styleHeaderPopup = this.feedbackObj.style_header;
        this.styleBodyPopup = this.feedbackObj.style_body;
        if (this.feedbackObj.wrongAnswerpopupTxt.required) {
            this.AnswerpopupTxt = true;
            this.popupHeader = this.feedbackObj.showAnswerpopupTxt.url;
        } else {
            this.AnswerpopupTxt = false;
        }
        this.feedbackModalRef.nativeElement.classList = "displayPopup modal";
        this.confirmModalRef.nativeElement.classList = "modal";
        this.instructionVO.nativeElement.pause();
        this.instructionVO.nativeElement.currentTime = 0;
        if (this.isShowans) {
            this.feedbackVoRef.nativeElement.src = this.commonAssets.showansSound.url + "?someRandomSeed=" + Math.random().toString(36)
        }
        else {
            this.feedbackVoRef.nativeElement.src = this.commonAssets.rightfeedbackVo.url + "?someRandomSeed=" + Math.random().toString(36);
        }
        this.feedbackVoRef.nativeElement.play();
        if (this.showAnswerPopup) {
            this.isRightSelected = true;

        } else {
            this.isRightSelected = true;
            this.isOptionSelected = true;
        }


        ////this.isOptionSelected = true;
        this.appModel.enableReplayBtn(false);
        this.feedbackVoRef.nativeElement.onended = () => {
            setTimeout(() => {
                this.sendFeedback(this.feedbackModalRef.nativeElement, 'no', 'feedbackClosed');
            }, this.showAnsTimeout)
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
        if (obj.mainVideo && obj.mainVideo.nativeElement) {
            obj.mainVideo.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.speakerAudioRef && obj.speakerAudioRef.nativeElement) {
            obj.speakerAudioRef.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.feedbackVoRef && obj.feedbackVoRef.nativeElement) {
            obj.feedbackVoRef.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
    }


}
