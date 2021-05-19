import { Component, OnInit, ViewChild, OnDestroy, AfterViewChecked, ViewEncapsulation } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { Subscription } from 'rxjs';
import { PlayerConstants } from '../../../common/playerconstants';
import { ThemeConstants } from '../../../common/themeconstants';
import { SharedserviceService } from '../../../services/sharedservice.service';
import { timer } from 'rxjs/observable/timer';
import { take } from 'rxjs/operators';
import {
    trigger,
    state,
    style,
    animate,
    transition,
} from '@angular/animations';



@Component({
    selector: 'ntemp4',
    animations: [
        trigger('openClose', [
            state('open', style({

            })),
            state('closed', style({
                'left': '{{leftPos}}',
                'top': '{{topPos}}',
                'width': '{{posWidth}}',
                'pointer-events': 'none'

            }), { params: { leftPos: 0, topPos: 0, posWidth: 0 } }),
            transition('open => closed', [
                animate('0.5s')
            ]),
            transition('closed => open', [
                animate('0.5s')
            ]),
        ]),
    ],
    templateUrl: './Ntemplate4.component.html',
    styleUrls: ['./Ntemplate4.component.css', '../../../view/css/bootstrap.min.css']

})

export class Ntemplate4 implements OnInit, OnDestroy, AfterViewChecked {
    private appModel: ApplicationmodelService;    
    constructor(appModel: ApplicationmodelService, private Sharedservice: SharedserviceService) {
        this.appModel = appModel;
        if (!this.appModel.isVideoPlayed) {
            this.isVideoLoaded = false;
        } else {
            this.appModel.setLoader(true);
            // if error occured during image loading loader wil stop after 5 seconds 
            this.loaderTimer = setTimeout(() => {
                this.appModel.setLoader(false);
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
    commonAssets: any = "";
    question: any = "";
    feedback: any = "";
    isLastActivity: any = "";
    bool: boolean = false;
    showIntroScreen: boolean;
    helpAudio: any = "";
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
    optionHolder: any = [];
    options: any = [];
    dummyImgs: any = [];
    questionObj: any;
    randomArray: any;
    leftSelectedIdx: number = 0;
    rightSelectedIdx: number = 0;
    maxRandomNo: number;
    elemHolder: any;
    moveFrom: any;
    moveTo: any;
    blinkTimeInterval: any;
    startCount: number = 0;
    blinkFlag: boolean = true;
    blinkSide: string = "";
    selectableOpts: number;
    selectedOptList: any = [];
    isAllRight: boolean = false;
    isWrongAttempted: boolean = false;
    categoryA: any = {
        "correct": [],
        "incorrect": []
    };
    categoryB: any = {
        "correct": [],
        "incorrect": []
    };
    infoPopupAssets: any;
    commonfeedbackAssets: any;
    confirmAssets: any;
    confirmSubmitAssets: any;
    confirmReplayAssets: any;
    selectedOpt: any = {
        "idx": undefined,
        "moveFrom": undefined,
        "moveTo": undefined
    };
    selectedCopy: any;
    leftRandomArray: any = [];
    rightRandomArray: any = [];
    completeRandomArr: any = [];
    feedbackAssets: any;
    category: any;
    currentFeedbackPlaying: string = "categoryA";
    nextBtnInterval: any;
    closeFeedbackmodalTimer: any;
    isPlayVideo: boolean;
    videoReplayd: boolean = false;
    maxOpotions: number = 7;
    currentFeedbackElem: any;
    timerDelayActs: any;
    nextFeedbackTimer: any;
    timerFeedback: any;
    isVideoLoaded: boolean = false;
    blinkCategory1: number = 0;
    blinkCategory2: number = 0;
    attemptType: string = "";
    quesObj: any;
    PlayPauseFlag: boolean = true;
    skipFlag: boolean = true;
    showAnswerClicked: boolean = false;
    controlHandler = {
        isShowAns: true,
        isSubmitRequired: true,
        isReplayRequired: true
    };
    /*Start: Theme Implementation(Template Changes)*/
    themePath: any;
    fetchedcontent: any;
    functionalityType: any;
    bgSubscription: Subscription;
    /*End: Theme Implementation(Template Changes)*/
    quesSkip: boolean = false;
    instructionDisable: boolean = false;
    isRightWrong: boolean = true;
    isPartial: boolean = false;
    isOptionDisabled: boolean = true;
    showAnsTimeout: number;
    closeFeedback: any;
    zIndexvalue: number = 1;
    isShowOk: boolean = false;
    placeholderWidth = "7%";
    popupTxtRequired:boolean=false;
    closeFeedbackPopup: NodeJS.Timer;
    closeFeedbackPopup2: NodeJS.Timer;
    confirmPopupSubscription: any;
	timerSubscription: Subscription;
    isLastQuestion: boolean;
    tempSubscription: Subscription;
	actComplete: boolean = false;
    styleblockLeft = [
        { 'top': '33%', 'left': '24.8%' },
        { 'top': '33%', 'left': '32.8%' },
        { 'top': '33%', 'left': '40.8%' },
        { 'top': '46.5%', 'left': '24.8%' },
        { 'top': '46.5%', 'left': '32.8%' },
        { 'top': '46.5%', 'left': '40.8%' },
        { 'top': '60%', 'left': '24.8%' },
        { 'top': '60%', 'left': '32.8%' },
        { 'top': '60%', 'left': '40.8%' }
    ]
    styleblockRight = [
        { 'top': '33%', 'left': '52.3%' },
        { 'top': '33%', 'left': '60.3%' },
        { 'top': '33%', 'left': '68.3%' },
        { 'top': '46.5%', 'left': '52.3%' },
        { 'top': '46.5%', 'left': '60.3%' },
        { 'top': '46.5%', 'left': '68.3%' },
        { 'top': '60%', 'left': '52.3%' }
    ]
    @ViewChild('mainContainer') mainContainer: any;
    @ViewChild('optionRef') optionRef: any;
    @ViewChild('placeholderRefLeft') placeholderRefLeft: any;
    @ViewChild('placeholderRefRight') placeholderRefRight: any;
    @ViewChild('confirmModalRef') confirmModalRef: any;
    @ViewChild('confirmSubmitRef') confirmSubmitRef: any;
    @ViewChild('infoModalRef') infoModalRef: any;
    @ViewChild('feedbackPopupRef') feedbackPopupRef: any;
    @ViewChild('correctCategory') correctCategory: any;
    @ViewChild('incorrectCategory') incorrectCategory: any;
    @ViewChild('confirmReplayRef') confirmReplayRef: any;
    @ViewChild('partialFeedbackRef') partialFeedbackRef: any;
    @ViewChild('instructionBar') instructionBar: any;
    @ViewChild('instructionVO') instructionVO: any;
    @ViewChild('quesVORef') quesVORef: any;
    @ViewChild('mainVideo') mainVideo: any;
    @ViewChild('feedbackAudio') feedbackAudio: any;


    ngOnInit() {
        if (this.appModel.isNewCollection) {
            this.appModel.event = { 'action': 'segmentBegins' };
        }
        let that = this;
        // $( "#navBlock" ).click(function() {
        //     if (!that.instructionVO.nativeElement.paused)
        //     {
        //       that.instructionVO.nativeElement.pause();
        //       that.instructionVO.nativeElement.currentTime = 0;
        //       this.instructionDisable=false;
        //     }
        //   });

        this.containgFolderPath = this.getBasePath();
        /*Start: Theme Implementation(Template Changes)*/
        let fetchedData: any = this.appModel.content.contentData.data;
        this.fetchedcontent = JSON.parse(JSON.stringify(fetchedData));;
        this.functionalityType = this.appModel.content.contentLogic.functionalityType;
        this.themePath = ThemeConstants.THEME_PATH + this.fetchedcontent.productType + '/' + this.fetchedcontent.theme_name;
        this.Sharedservice.imagePath(this.fetchedcontent, this.containgFolderPath, this.themePath, this.functionalityType);
        this.checkquesTab();
        /*End: Theme Implementation(Template Changes)*/
        this.appModel.globalJsonData.subscribe(data => {
            this.showAnsTimeout = data.showAnsTimeout;
        });
        this.setData();
        this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
            if (mode == "manual") {
                console.log("manual mode ", mode);
            } else if (mode == "auto") {
                console.log("auto mode", mode);
                this.showAnswerClicked = true;
                this.isShowOk = false;
                this.getAnswer();
            }
        })
        this.confirmPopupSubscription = this.appModel.getConfirmationPopup().subscribe((val) => {
            this.appModel.notifyUserAction(); 
            if(this.audio && !this.audio.paused){
                this.audio.pause();
                this.audio.currentTime = 0;
                for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
                    if (this.optionRef.nativeElement.children[i].children[0] && this.optionRef.nativeElement.children[i].children[0].classList.contains("disableDiv")) {
                        this.optionRef.nativeElement.children[i].children[0].classList.remove("disableDiv");
                    }
                }
            }            
              
            if (this.instructionVO && this.instructionVO.nativeElement.play) {
                this.instructionVO.nativeElement.pause();
                this.instructionVO.nativeElement.currentTime = 0;
                this.instructionDisable=false;
            }       
            
            this.isOptionDisabled = true;
            if (val == "uttarDikhayein") {
                clearTimeout(this.showAnsTimeout);
                if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
                    this.confirmModalRef.nativeElement.classList = "displayPopup modal";
                    this.checkForAutoClose();
                    this.appModel.notifyUserAction();
                }
            } else if (val == "submitAnswer") {
                if (this.confirmSubmitRef && this.confirmSubmitRef.nativeElement) {
                    this.confirmSubmitRef.nativeElement.classList = "displayPopup modal";
                    this.appModel.notifyUserAction();
                }
            } else if (val == "replayVideo") {
                if (this.confirmReplayRef && this.confirmReplayRef.nativeElement) {
                    this.confirmReplayRef.nativeElement.classList = "displayPopup modal";
                    this.appModel.notifyUserAction();
                    this.PlayPauseFlag = true;
                    this.quesObj.quesPlayPause = this.quesObj.quesPause;
                    this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
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
            if (this.appModel.feedbackType == "fullyIncorrect" || this.appModel.feedbackType == "partialIncorrect") {
                this.resetActivity();
            }else if(this.appModel.feedbackType = "partialCorrect"){
                if (this.selectableOpts > 0) {
                    this.getRandomIndxBlink(this.selectableOpts);
                } 
            }
            this.appModel.startPreviousTimer();
            this.appModel.notifyUserAction();
        })
        this.appModel.resetBlinkingTimer();
        this.appModel.handleController(this.controlHandler);
    }


    ngAfterViewChecked() {
        this.templatevolume(this.appModel.volumeValue, this);
    }

    ngOnDestroy() {        
        if(this.audio && !this.audio.paused){
            this.audio.pause();
		    this.audio.currentTime = 0;
        }
        clearTimeout(this.timerDelayActs);
        clearTimeout(this.nextFeedbackTimer);
        clearTimeout(this.showAnsTimeout);
        clearInterval(this.blinkTimeInterval);
        if (this.tempSubscription != undefined) {
			this.tempSubscription.unsubscribe();
        }
        if (this.confirmPopupSubscription != undefined) {
			this.confirmPopupSubscription.unsubscribe();
		}
		if (this.tempSubscription != undefined) {
			this.tempSubscription.unsubscribe();
		}
        this.optionHolder.leftHolder = this.optionHolder.leftHolder_original;
        this.optionHolder.rightHolder = this.optionHolder.rightHolder_original;
        /*Start: Theme Implementation(Template Changes)*/
        if (this.bgSubscription != undefined) {
            this.bgSubscription.unsubscribe();
        }
        /*End: Theme Implementation(Template Changes)*/
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
        this.sendFeedback(this.confirmModalRef.nativeElement,'no')
			this.timerSubscription.unsubscribe();
		  }
		)
	  }
	  removeSubscription(timer) {
		console.log("waiting for autoClose", timer / 1000);
    }

    /*Start: Theme Implementation(Template Changes)*/
    checkquesTab() {
        if (this.fetchedcontent.commonassets.ques_control != undefined) {
            this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
        } else {
            this.appModel.getJson();
        }
    }
    /*End: Theme Implementation(Template Changes)*/

    endedHandleronSkip() {
        this.isPlayVideo = false;
        this.appModel.navShow = 2;
        this.appModel.videoStraming(false);
        this.appModel.startPreviousTimer();
        this.appModel.notifyUserAction();
        setTimeout(() => {
            this.isOptionDisabled = false;
        }, 1000);        
    }


    PlayPauseVideo() {
        if (this.PlayPauseFlag) {
            this.mainVideo.nativeElement.pause();
            this.quesObj.quesPlayPause = this.quesObj.quesPlay;
            this.PlayPauseFlag = false;
        } else {
            this.mainVideo.nativeElement.play();
            this.quesObj.quesPlayPause = this.quesObj.quesPause;
            this.PlayPauseFlag = true;
        }

    }
    hoverPlayPause() {
        if (this.PlayPauseFlag) {
            this.quesObj.quesPlayPause = this.quesObj.quesPauseHover;
        } else {
            this.quesObj.quesPlayPause = this.quesObj.quesPlayHover;
        }
    }

    leavePlayPause() {
        if (this.PlayPauseFlag) {
            this.quesObj.quesPlayPause = this.quesObj.quesPauseOriginal;
        } else {
            this.quesObj.quesPlayPause = this.quesObj.quesPlayOriginal;
        }
    }
    hoverSkip() {
        // this.skipFlag = false;
        this.quesObj.quesSkip = this.quesObj.quesSkipHover;
    }
    houtSkip() {
        this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
    }

    setData() {
        this.timerFeedback = this.fetchedcontent.feedback_next_timer;
        console.log(this.fetchedcontent);
        this.optionHolder = this.fetchedcontent.option_holder;
        this.options = JSON.parse(JSON.stringify(this.fetchedcontent.options));
        this.commonAssets = this.fetchedcontent.commonassets;
        for (let i = 0; i < this.maxOpotions; i++) {
            this.dummyImgs.push(this.fetchedcontent.options[0]);
        }
        this.questionObj = this.fetchedcontent.quesObj;
        this.selectableOpts = JSON.parse(JSON.stringify(this.questionObj.noOfOptions));
        if (this.questionObj && this.questionObj.quesVideo && this.questionObj.quesVideo.autoPlay && !this.appModel.isVideoPlayed) {
            this.isPlayVideo = true;
        } else {
            this.isPlayVideo = false;
        }
        this.leftRandomArray = JSON.parse(JSON.stringify(this.optionHolder.left_random_index));
        this.rightRandomArray = JSON.parse(JSON.stringify(this.optionHolder.right_random_index));
        this.completeRandomArr = this.leftRandomArray.concat(this.rightRandomArray);
        this.randomArray = new Array(this.questionObj.noOfOptions);
        this.maxRandomNo = JSON.parse(JSON.stringify(this.questionObj.noOfOptions));
        this.noOfImgs = this.commonAssets.imgCount;
        this.infoPopupAssets = this.fetchedcontent.info_popup;
        this.confirmAssets = this.fetchedcontent.show_answer_confirm;
        this.commonfeedbackAssets = this.fetchedcontent.feedback;
        this.confirmSubmitAssets = this.fetchedcontent.submit_confirm;
        this.confirmReplayAssets = this.fetchedcontent.replay_confirm;
        this.isLastQues = this.appModel.isLastSection;
        this.isLastQuesAct = this.appModel.isLastSectionInCollection;
        this.isLastQuestion = this.commonAssets.isLastQues;
        if (this.isLastQuesAct || this.isLastQues) {
            this.appModel.setlastQuesNT();
        }
        for (let i = 0; i < this.questionObj.noOfOptions; i++) {
            this.randomArray[i] = i;
        }
        this.quesObj = this.fetchedcontent.quesObj;
        for (let i = 0; i < this.options.length; i++) {
            this.options[i].isOpen = true;            
        }
        /*Start: Theme Implementation(Template Changes)*/
        this.controlHandler = {
            isShowAns: true,
            isSubmitRequired: this.quesObj.submitRequired,
            isReplayRequired: this.quesObj.replayRequired
        }
        /*End: Theme Implementation(Template Changes)*/
    }

    getBasePath() {
        if (this.appModel && this.appModel.content) {
            return this.appModel.content.id + '';
        }
    }

    optionHover(idx, opt) {
        this.optionRef.nativeElement.children[idx].children[0].classList.add("scaleInAnimation");
        this.optionRef.nativeElement.children[idx].children[0].style.cursor = "pointer";
    }
    playOptionHover(idx, opt) {
        this.appModel.notifyUserAction();
        if (opt && opt.mouse_over_audio && opt.mouse_over_audio.url) {
            this.playSound(opt.mouse_over_audio, idx);
        }
    }

    playSound(soundAssets, idx) {
        if (this.audio && this.audio.paused) {
            this.audio.src = soundAssets.url;
            this.audio.load();
            this.audio.play();
            for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
                if (i != idx && this.optionRef.nativeElement.children[i].children[0]) {
                    this.optionRef.nativeElement.children[i].children[0].classList.add("disableDiv");
                }
            }
            if (this.instructionVO && this.instructionVO.nativeElement.play) {
                this.instructionVO.nativeElement.pause();
                this.instructionVO.nativeElement.currentTime = 0;
            }
            this.instructionDisable = true;
            this.audio.onended = () => {
                this.instructionDisable = false;
                for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
                    if (i != idx && this.optionRef.nativeElement.children[i].children[0]) {
                        this.optionRef.nativeElement.children[i].children[0].classList.remove("disableDiv");
                    }
                }

            }
        }
    }
    optionLeave(idx, opt) {
        this.optionRef.nativeElement.children[idx].children[0].classList.add("scaleOutAnimation");
        setTimeout(() => {
            this.optionRef.nativeElement.children[idx].children[0].classList.remove("scaleInAnimation");
            this.optionRef.nativeElement.children[idx].children[0].classList.remove("scaleOutAnimation");
        }, 500)

    }
    submitAttempt(idx, opt) {
        this.appModel.notifyUserAction();
        this.appModel.enableReplayBtn(false);
        this.startCount = 0;
        clearInterval(this.blinkTimeInterval);
        this.optionHolder.leftHolder = this.optionHolder.leftHolder_original;
        this.optionHolder.rightHolder = this.optionHolder.rightHolder_original;
        this.blinkTimeInterval = 0;       
        this.selectedOpt.idx = idx;
        let copyOpt: any = JSON.parse(JSON.stringify(this.selectedOpt));
        this.selectedOptList.push(copyOpt);
        this.zIndexvalue = this.zIndexvalue + 1;
        this.optionRef.nativeElement.children[idx].classList.add("controlCursor");
        this.optionRef.nativeElement.children[idx].classList.add("disableDiv");
        this.optionRef.nativeElement.children[idx].children[0].style.zIndex = this.zIndexvalue;
        opt.isOpen = false;
        opt.leftPos = this.moveTo.left;
        opt.topPos = this.moveTo.top;
        opt.posWidth = this.placeholderWidth;
        this.startCount = 0;
        setTimeout(() => {
            // this.optionHolder.leftHolder = this.optionHolder.leftHolder_original;
            // this.optionHolder.rightHolder = this.optionHolder.rightHolder_original;
            if (this.blinkSide == "left") {
                if (this.placeholderRefLeft.nativeElement.children[this.leftSelectedIdx]) {
                    this.leftSelectedIdx++;
                }
                if ((this.optionHolder.left_random_index).includes(opt.index)) {
                    console.log("correct opt index-------", opt.index);
                    this.categoryA.correct.push(opt);
                } else {
                    this.categoryA.incorrect.push(opt);
                }
            }
            if (this.blinkSide == "right") {
                if (this.placeholderRefRight.nativeElement.children[this.rightSelectedIdx]) {
                    this.rightSelectedIdx++;
                }
                if ((this.optionHolder.right_random_index).includes(opt.index)) {
                    this.categoryB.correct.push(opt);
                } else {
                    this.categoryB.incorrect.push(opt);
                }
            }
            if (this.categoryA.incorrect.length > 0 || this.categoryB.incorrect.length > 0) {
                this.isWrongAttempted = true;
            }
            this.appModel.enableSubmitBtn(true);
            console.log("category A");
            console.log(this.categoryA);
            console.log("category B");
            console.log(this.categoryB);
            if (this.selectableOpts > 0) {
                this.getRandomIndxBlink(this.selectableOpts);
            } else {
                if (this.blinkTimeInterval) {
                    clearInterval(this.blinkTimeInterval);
                    this.optionHolder.leftHolder = this.optionHolder.leftHolder_original;
                    this.optionHolder.rightHolder = this.optionHolder.rightHolder_original;
                }
                this.mainContainer.nativeElement.classList = "bodyContent disableDiv";
                for (let i = 0; i < this.options.length; i++) {
                    let optFound = false;
                    for (let j = 0; j < this.selectedOptList.length; j++) {
                        if (i == this.selectedOptList[j].idx) {
                            optFound = true;
                            break;
                        }
                    }
                    if (!optFound) {
                        this.optionRef.nativeElement.children[i].classList.add('greyOut');
                    }
                }

                if (this.categoryA.incorrect.length == 0 && this.categoryB.incorrect.length == 0) {
                    this.isAllRight = true;
                } else {
                    this.isWrongAttempted = true;
                }
            }
        }, 500)
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

    endedHandler() {
        if (!this.videoReplayd) {
            this.isPlayVideo = false;
            this.appModel.setLoader(true);
            this.appModel.navShow = 2;
            this.appModel.enableReplayBtn(true);
        }
    }
    checkforQVO() {
        this.isVideoLoaded = true;
        if (this.questionObj && this.questionObj.quesInstruction && this.questionObj.quesInstruction.url && this.questionObj.quesInstruction.autoPlay) {
            this.quesVORef.nativeElement.src = this.questionObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
            this.mainContainer.nativeElement.classList = "bodyContent disableDiv";
            this.instructionDisable=true;
            this.quesVORef.nativeElement.play();
            this.appModel.enableReplayBtn(false);
            this.appModel.enableSubmitBtn(false);
            this.appModel.handlePostVOActivity(true);
            this.quesVORef.nativeElement.onended = () => {
                this.mainContainer.nativeElement.classList = "bodyContent";
                this.instructionDisable=false;
                this.startActivity();
                this.appModel.handlePostVOActivity(false);
                this.appModel.enableReplayBtn(true);
                setTimeout(() => {
                    this.isOptionDisabled = false;
                }, 1000);
            }
        } else {
            this.timerDelayActs = setTimeout(() => {
                this.startActivity();
                this.appModel.handlePostVOActivity(false);
                this.appModel.enableReplayBtn(true);
            }, 1000)
        }
    }

    startActivity() {
        this.getRandomIndxBlink(this.selectableOpts);
    }

    getRandomIndxBlink(no) {
        let randomIdx = Math.floor((Math.random() * no));
        console.log("random index ", randomIdx);
        if (this.optionHolder.left_random_index.includes(this.completeRandomArr[randomIdx]) && this.blinkCategory1 < 3) {
            this.blinkCategoryA(randomIdx);
        } else if (this.optionHolder.right_random_index.includes(this.completeRandomArr[randomIdx]) && this.blinkCategory2 < 3) {
            this.blinkCategoryB(randomIdx);
        } else if (this.blinkCategory1 == 3) {
            let flagFound = false;
            for (let i = 0; i < this.completeRandomArr.length; i++) {
                if (this.optionHolder.right_random_index.includes(this.completeRandomArr[i])) {
                    flagFound = true;
                    this.blinkCategoryB(i);
                    break;
                }
            }
            if (!flagFound) {
                this.blinkCategory1 = 0;
                this.getRandomIndxBlink(this.selectableOpts);
            }

        } else if (this.blinkCategory2 == 3) {
            let flagFound = false;
            for (let i = 0; i < this.completeRandomArr.length; i++) {
                if (this.optionHolder.left_random_index.includes(this.completeRandomArr[i])) {
                    flagFound = true
                    this.blinkCategoryA(i);
                    break;
                }
            }
            if (!flagFound) {
                this.blinkCategory2 = 0;
                this.getRandomIndxBlink(this.selectableOpts);
            }
        }

    }

    blinkCategoryA(randomIdx) {
        this.completeRandomArr.splice(randomIdx, 1);
        // this.moveTo = this.placeholderRefLeft.nativeElement.children[this.leftSelectedIdx].getBoundingClientRect();
        this.moveTo = this.styleblockLeft[this.leftSelectedIdx];
        console.log(this.moveTo);
        this.blinkSide = "left";
        this.startCount = 1;
        this.blinkHolder();
        this.selectableOpts--;
        this.blinkCategory1++;
        this.blinkCategory2 = 0;
    }

    blinkCategoryB(randomIdx) {
        this.completeRandomArr.splice(randomIdx, 1);
        // this.moveTo = this.placeholderRefRight.nativeElement.children[this.rightSelectedIdx].getBoundingClientRect();
        this.moveTo = this.styleblockRight[this.rightSelectedIdx];
        console.log(this.moveTo);
        this.blinkSide = "right";
        this.startCount = 1;
        this.blinkHolder();
        this.selectableOpts--;
        this.blinkCategory2++;
        this.blinkCategory1 = 0;
    }

    blinkHolder() {
        this.blinkFlag = true;
        this.blinkTimeInterval = setInterval(() => {
            if (this.startCount == 1) {
                this.blinkHolderImg();
            } else {
                clearInterval(this.blinkTimeInterval)
            }
        }, 300);

    }

    blinkHolderImg = () => {
        if (this.blinkSide == 'left') {
            if (this.blinkFlag) {
                this.optionHolder.leftHolder = this.optionHolder.leftHolder_blink;
                this.blinkFlag = false;
            } else {
                this.optionHolder.leftHolder = this.optionHolder.leftHolder_original;
                this.blinkFlag = true;
            }
        } else if (this.blinkSide == 'right') {
            if (this.blinkFlag) {
                this.optionHolder.rightHolder = this.optionHolder.rightHolder_blink;
                this.blinkFlag = false;
            } else {
                this.optionHolder.rightHolder = this.optionHolder.rightHolder_original;
                this.blinkFlag = true;
            }
        }
    }

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

    hoverFeedbackOK() {
        this.feedbackAssets.ok_btn = this.feedbackAssets.ok_btn_hover;
    }

    houtFeedbackOK() {
        this.feedbackAssets.ok_btn = this.feedbackAssets.ok_btn_original;
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
        this.appModel.notifyUserAction();
        ref.classList = "modal";
        clearTimeout(this.closeFeedbackPopup);
        clearTimeout(this.closeFeedbackPopup2);
        this.isShowOk = false;
        if (action == "showAnswer") {
            this.showAnswerClicked = true;
            this.isRightWrong = true;
            this.appModel.resetBlinkingTimer();
            this.getAnswer();
        } else if (action == "submitAnswer") {
            this.checkResponseType();
        } else if (action == "feedbackDone") {
            if (this.feedbackAudio && this.feedbackAudio.nativeElement && !this.feedbackAudio.nativeElement.paused) {
                this.feedbackAudio.nativeElement.pause();
                this.feedbackAudio.nativeElement.currentTime = 0;
                this.feedbackAssets.feedback_next_btn = this.feedbackAssets.feedback_next_btn_original;
                this.feedbackAssets.feedback_back_btn = this.feedbackAssets.feedback_back_btn_original;
            }
            if (this.isWrongAttempted) {
                this.appModel.wrongAttemptAnimation();
            } else if (this.isAllRight) {
                this.disableScreen();
                this.blinkOnLastQues();
            }
        } else if (action == "replay") {
            this.quesSkip = true;
            this.confirmReplayAssets.confirm_btn = this.confirmReplayAssets.confirm_btn_original;
            this.replayVideo();
        } else if (action == "partialFeedback") {
            if (this.partialFeedbackRef && this.partialFeedbackRef.nativeElement && !this.partialFeedbackRef.nativeElement.paused) {
                this.partialFeedbackRef.nativeElement.pause();
                this.partialFeedbackRef.nativeElement.currentTime = 0;
            }
            setTimeout(() => {
                this.isOptionDisabled = false;
            }, 1000);
            this.appModel.wrongAttemptAnimation();            
        } else if (action == "cancelReplay") {
            this.appModel.videoStraming(false);
            this.appModel.enableReplayBtn(true);
            setTimeout(() => {
                this.isOptionDisabled = false;
            }, 1000);
            
        } else if (flag == "no") {
            console.log(this.selectableOpts);
            setTimeout(() => {
                this.isOptionDisabled = false;
            }, 1000);
            
        }

    }

    checkResponseType() {
        this.attemptType = "manual";
        // let fetchedData: any = this.appModel.content.contentData.data;
        if (this.isAllRight) {            
            clearInterval(this.blinkTimeInterval);
            this.optionHolder.leftHolder = this.optionHolder.leftHolder_original;
            this.optionHolder.rightHolder = this.optionHolder.rightHolder_original;
            this.appModel.stopAllTimer();
            console.log("show both category A and category B modal for all right");
            if (this.categoryA && this.categoryA.correct.length) {
                this.feedbackAssets = this.fetchedcontent.category_1;
                this.currentFeedbackPlaying = "categoryA";
                this.category = JSON.parse(JSON.stringify(this.categoryA));
                if (this.categoryA.correct.length == this.optionHolder.left_random_index.length) {
                    this.feedbackAssets.style_header = this.fetchedcontent.category_1.right_style_header;
                    this.feedbackAssets.style_body = this.fetchedcontent.category_1.right_style_body;
                    this.feedbackAssets.popTitleTxt_img = this.fetchedcontent.category_1.right_style_title;
                    this.popupTxtRequired=this.fetchedcontent.category_1.right_style_title.required;
                    this.isRightWrong = true;
                    this.isPartial = false;
                }
            } else if (this.categoryB && this.categoryB.correct.length) {
                this.feedbackAssets = this.fetchedcontent.category_2;
                this.currentFeedbackPlaying = "categoryB";
                this.category = JSON.parse(JSON.stringify(this.categoryB));
                if (this.categoryB.correct.length == this.optionHolder.right_random_index.length) {
                    this.feedbackAssets.style_header = this.fetchedcontent.category_2.right_style_header;
                    this.feedbackAssets.style_body = this.fetchedcontent.category_2.right_style_body;
                    this.feedbackAssets.popTitleTxt_img = this.fetchedcontent.category_2.right_style_title;
                    this.popupTxtRequired=this.fetchedcontent.category_2.right_style_title.required;
                    this.isRightWrong = true;
                    this.isPartial = false;
                }
            }
            setTimeout(() => {
                this.feedbackPopupRef.nativeElement.classList = "modal displayPopup";
                this.closeFeedbackPopup=setTimeout(() => {
                    this.appModel.enableSubmitBtn(false);
                    this.setFeedbackAndPlayCorrect(0);
                }, 0)
            }, 0)
        } else {
            if (this.isWrongAttempted) {
                
                /*Set Feedback Type for animation*/
                this.appModel.feedbackType = "partialIncorrect";
                if (this.categoryA.correct.length == 0 && this.categoryB.correct.length == 0) {
                    this.appModel.feedbackType = "fullyIncorrect";
                }/*Set Feedback Type for animation Complete*/

                clearInterval(this.blinkTimeInterval);
                this.optionHolder.leftHolder = this.optionHolder.leftHolder_original;
                this.optionHolder.rightHolder = this.optionHolder.rightHolder_original;
                this.appModel.stopAllTimer();
                console.log("show category A and category B modal for both right and wrong");
                if (this.categoryA && (this.categoryA.correct.length || this.categoryA.incorrect.length)) {
                    this.feedbackAssets = this.fetchedcontent.category_1;
                    this.currentFeedbackPlaying = "categoryA";
                    this.category = JSON.parse(JSON.stringify(this.categoryA));
                    if (this.categoryA.correct.length == this.optionHolder.left_random_index.length) {
                        this.feedbackAssets.style_header = this.fetchedcontent.category_1.right_style_header;
                        this.feedbackAssets.style_body = this.fetchedcontent.category_1.right_style_body;
                        this.feedbackAssets.popTitleTxt_img = this.fetchedcontent.category_1.right_style_title;
                        this.popupTxtRequired=this.fetchedcontent.category_1.right_style_title.required;
                        this.isRightWrong = true;
                        this.isPartial = false;
                    } else if (this.categoryA.correct.length == 0) {
                        this.feedbackAssets.style_header = this.fetchedcontent.category_1.wrong_style_header;
                        this.feedbackAssets.style_body = this.fetchedcontent.category_1.wrong_style_body;
                        this.feedbackAssets.popTitleTxt_img = this.fetchedcontent.category_1.wrong_style_title;
                        this.popupTxtRequired=this.fetchedcontent.category_1.wrong_style_title.required;
                        this.isRightWrong = true;
                        this.isPartial = false;
                    } else {
                        this.feedbackAssets.style_header = this.fetchedcontent.category_1.partial_style_header;
                        this.feedbackAssets.style_body = this.fetchedcontent.category_1.partial_style_body;
                        this.feedbackAssets.popTitleTxt_img = this.fetchedcontent.category_1.partial_style_title;
                        this.popupTxtRequired=this.fetchedcontent.category_1.partial_style_title.required;
                        this.isRightWrong = false;
                        this.isPartial = true;
                    }
                } else if (this.categoryB && (this.categoryB.correct.length || this.categoryB.incorrect.length)) {
                    this.feedbackAssets = this.fetchedcontent.category_2;
                    this.currentFeedbackPlaying = "categoryB";
                    this.category = JSON.parse(JSON.stringify(this.categoryB));
                    if (this.categoryB.correct.length == this.optionHolder.right_random_index.length) {
                        this.feedbackAssets.style_header = this.fetchedcontent.category_2.right_style_header;
                        this.feedbackAssets.style_body = this.fetchedcontent.category_2.right_style_body;
                        this.feedbackAssets.popTitleTxt_img = this.fetchedcontent.category_2.right_style_title;
                        this.popupTxtRequired=this.fetchedcontent.category_2.right_style_title.required;
                        this.isRightWrong = true;
                        this.isPartial = false;
                    } else if (this.categoryB.correct.length == 0) {
                        this.feedbackAssets.style_header = this.fetchedcontent.category_2.wrong_style_header;
                        this.feedbackAssets.style_body = this.fetchedcontent.category_2.wrong_style_body;
                        this.feedbackAssets.popTitleTxt_img = this.fetchedcontent.category_2.wrong_style_title;
                        this.popupTxtRequired=this.fetchedcontent.category_2.wrong_style_title.required;
                        this.isRightWrong = true;
                        this.isPartial = false;
                    } else {
                        this.feedbackAssets.style_header = this.fetchedcontent.category_2.partial_style_header;
                        this.feedbackAssets.style_body = this.fetchedcontent.category_2.partial_style_body;
                        this.feedbackAssets.popTitleTxt_img = this.fetchedcontent.category_2.partial_style_title;
                        this.popupTxtRequired=this.fetchedcontent.category_2.partial_style_title.required;
                        this.isRightWrong = false;
                        this.isPartial = true;
                    }
                }

                setTimeout(() => {
                    this.feedbackPopupRef.nativeElement.classList = "modal displayPopup";
                    this.closeFeedbackPopup=setTimeout(() => {
                        this.setFeedbackAndPlayCorrect(0);
                    }, 0)
                }, 0)
            } else {
                this.appModel.feedbackType = "partialCorrect";
                this.infoModalRef.nativeElement.classList = "modal displayPopup";
                clearInterval(this.blinkTimeInterval);
                this.optionHolder.leftHolder = this.optionHolder.leftHolder_original;
                this.optionHolder.rightHolder = this.optionHolder.rightHolder_original;
                if (this.partialFeedbackRef && this.partialFeedbackRef.nativeElement) {
                    this.partialFeedbackRef.nativeElement.play();
                }
            }

        }

    }

    setFeedbackAndPlayCorrect(num: number) {
        clearTimeout(this.blinkTimeInterval);
        this.blinkSide = "";
        let no = num;
        if (this.correctCategory && this.correctCategory.nativeElement && this.correctCategory.nativeElement.children[num]) {
            if (this.category.correct[num].correct_vo) {
                this.feedbackAudio.nativeElement.src = this.category.correct[num].correct_vo.url;
                this.feedbackAudio.nativeElement.play();
                this.correctCategory.nativeElement.children[num].classList = "img-fluid optionAnimate";
                this.currentFeedbackElem = this.correctCategory.nativeElement.children[num];
                this.feedbackAudio.nativeElement.onended = () => {
                    this.correctCategory.nativeElement.children[num].classList = "img-fluid";
                    no++;
                    this.setFeedbackAndPlayCorrect(no);
                }
            }
        } else {
            this.setFeedbackAndPlayIncorrect(0);
        }
    }

    showCorrectAns(num: number) {
        clearTimeout(this.blinkTimeInterval);
        this.blinkSide = "";
        let no = num;
        if (this.correctCategory && this.correctCategory.nativeElement && this.correctCategory.nativeElement.children[num]) {
            if (this.category.correct[num].showAns_vo) {
                this.feedbackAudio.nativeElement.src = this.category.correct[num].showAns_vo.url;
                this.feedbackAudio.nativeElement.play();
                this.correctCategory.nativeElement.children[num].classList = "img-fluid optionAnimate";
                this.currentFeedbackElem = this.correctCategory.nativeElement.children[num];
                this.feedbackAudio.nativeElement.onended = () => {
                    this.correctCategory.nativeElement.children[num].classList = "img-fluid";
                    no++;
                    this.showCorrectAns(no);
                }
            }
        } else {
            this.setFeedbackAndPlayIncorrect(0);
        }
    }


    setFeedbackAndPlayIncorrect(num: number) {
        let no = num;
        if (this.incorrectCategory && this.incorrectCategory.nativeElement && this.incorrectCategory.nativeElement.children[num]) {
            if (this.category.incorrect[num].correct_vo) {
                this.feedbackAudio.nativeElement.src = this.category.incorrect[num].incorrect_vo.url;
                this.feedbackAudio.nativeElement.play();
                this.incorrectCategory.nativeElement.children[num].classList = "img-fluid optionAnimate";
                this.currentFeedbackElem = this.incorrectCategory.nativeElement.children[num];
                this.feedbackAudio.nativeElement.onended = () => {
                    this.incorrectCategory.nativeElement.children[num].classList = "img-fluid";
                    no++;
                    this.setFeedbackAndPlayIncorrect(no);
                }
            }
        } else {
            console.log("start blinking next button");
            if (this.currentFeedbackPlaying == "categoryA") {
                if (this.categoryB && (this.categoryB.correct.length > 0 || this.categoryB.incorrect.length > 0)) {
                    this.setBlinkOnNextBtn();
                    if (this.showAnswerClicked) {
                        this.timerFeedback = this.fetchedcontent.Showans_feedback_next_timer;
                    } else {
                        this.timerFeedback = this.fetchedcontent.feedback_next_timer;
                    }
                    this.nextFeedbackTimer = setTimeout(() => {
                        this.nextFeedback();
                    }, this.timerFeedback * 1000)
                } else {
                    if (this.showAnswerClicked) {
                        this.closeFeedback = this.showAnsTimeout;
                    } else {
                        this.closeFeedback = this.fetchedcontent.close_feedback_timer * 1000;
                    }
                    this.closeFeedbackmodalTimer = setTimeout(() => {
                        this.feedbackPopupRef.nativeElement.classList = "modal";
                        if (this.isWrongAttempted) {
                            this.appModel.wrongAttemptAnimation();
                        } else if (this.isAllRight) {
                            this.disableScreen();
                            this.blinkOnLastQues();
                        }
                    }, this.closeFeedback)
                }

            } else if (this.currentFeedbackPlaying == "categoryB") {
                if (this.showAnswerClicked) {
                    this.closeFeedback = this.showAnsTimeout;
                } else {
                    this.closeFeedback = this.fetchedcontent.close_feedback_timer * 1000;
                }
                this.closeFeedbackmodalTimer = setTimeout(() => {
                    this.feedbackPopupRef.nativeElement.classList = "modal";
                    if (this.isWrongAttempted) {
                        this.appModel.wrongAttemptAnimation();
                    } else if (this.isAllRight) {
                        this.disableScreen();
                        this.blinkOnLastQues();
                    }
                }, this.closeFeedback)
            }
        }
    }

    blinkOnLastQues() {
        this.actComplete = true;
        if (this.appModel.isLastSectionInCollection) {
            this.appModel.blinkForLastQues(this.attemptType);
            this.appModel.stopAllTimer();
            this.disableScreen();
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
            this.disableScreen();
        }
    }

    disableScreen() {
        if (!this.showAnswerClicked) {
            for (let i = 0; i < this.selectedOptList.length; i++) {
                this.options[this.selectedOptList[i].idx].isOpen = true;
                // this.optionRef.nativeElement.children[this.selectedOptList[i].idx].classList.remove("shrink_it");
                this.optionRef.nativeElement.children[this.selectedOptList[i].idx].children[0].style.zIndex = 1;
                this.zIndexvalue = 1;
            }
        }

        for (let i = 0; i < this.options.length; i++) {
            this.optionRef.nativeElement.children[i].classList.add('greyOut');
        }
        this.instructionBar.nativeElement.classList.add('greyOut');
        this.mainContainer.nativeElement.children[0].classList.add('greyOut');
        clearInterval(this.blinkTimeInterval);
        this.optionHolder.leftHolder = this.optionHolder.leftHolder_original;
        this.optionHolder.rightHolder = this.optionHolder.rightHolder_original;

        if (this.categoryA && this.categoryA.correct && this.categoryA.correct.length) {
            this.categoryA.correct.splice(0, this.categoryA.correct.length);
        }
        if (this.categoryA && this.categoryA.incorrect && this.categoryA.incorrect.length) {
            this.categoryA.incorrect.splice(0, this.categoryA.incorrect.length);
        }
        if (this.categoryB && this.categoryB.correct && this.categoryB.correct.length) {
            this.categoryB.correct.splice(0, this.categoryB.correct.length);
        }
        if (this.categoryB && this.categoryB.incorrect && this.categoryB.incorrect.length) {
            this.categoryB.incorrect.splice(0, this.categoryA.incorrect.length);
        }
        if (this.category && this.category.correct && this.category.correct.length) {
            this.category.correct.splice(0, this.category.correct.length);
        }
        if (this.category && this.category.incorrect && this.category.incorrect.length) {
            this.category.incorrect.splice(0, this.category.incorrect.length);
        }
        /* if (this.instructionBar && this.instructionBar.nativeElement) {
             this.instructionBar.nativeElement.classList = "instructionBase disableDiv";
         }*/
        this.appModel.enableReplayBtn(false);
    }

    setBlinkOnNextBtn() {
        let flag = true;
        this.nextBtnInterval = setInterval(() => {
            if (flag) {
                this.feedbackAssets.feedback_next_btn = this.feedbackAssets.feedback_next_btn_blink2;
                flag = false;
            } else {
                this.feedbackAssets.feedback_next_btn = this.feedbackAssets.feedback_next_btn_blink1;
                flag = true;
            }
        }, 300)
    }

    resetActivity() {
        this.isWrongAttempted = false;
        this.isAllRight = false;
        for (let i = 0; i < this.selectedOptList.length; i++) {
            this.options[this.selectedOptList[i].idx].isOpen = true;
            this.optionRef.nativeElement.children[this.selectedOptList[i].idx].children[0].style.zIndex = 1;
            this.zIndexvalue = 1;
        }

        for (let i = 0; i < this.options.length; i++) {
            this.optionRef.nativeElement.children[i].classList.remove('greyOut');
            this.optionRef.nativeElement.children[i].classList.remove('controlCursor');
            this.optionRef.nativeElement.children[i].classList.remove("disableDiv");
        }
        this.selectedOptList.splice(0, this.selectedOptList.length);
        this.leftSelectedIdx = 0;
        this.rightSelectedIdx = 0;
        this.selectableOpts = JSON.parse(JSON.stringify(this.questionObj.noOfOptions));
        clearInterval(this.blinkTimeInterval);
        this.optionHolder.leftHolder = this.optionHolder.leftHolder_original;
        this.optionHolder.rightHolder = this.optionHolder.rightHolder_original;
        this.completeRandomArr = this.leftRandomArray.concat(this.rightRandomArray);
        if (this.categoryA && this.categoryA.correct && this.categoryA.correct.length) {
            this.categoryA.correct.splice(0, this.categoryA.correct.length);
        }
        if (this.categoryA && this.categoryA.incorrect && this.categoryA.incorrect.length) {
            this.categoryA.incorrect.splice(0, this.categoryA.incorrect.length);
        }
        if (this.categoryB && this.categoryB.correct && this.categoryB.correct.length) {
            this.categoryB.correct.splice(0, this.categoryB.correct.length);
        }
        if (this.categoryB && this.categoryB.incorrect && this.categoryB.incorrect.length) {
            this.categoryB.incorrect.splice(0, this.categoryB.incorrect.length);
        }
        if (this.category && this.category.correct && this.category.correct.length) {
            this.category.correct.splice(0, this.category.correct.length);
        }
        if (this.category && this.category.incorrect && this.category.incorrect.length) {
            this.category.incorrect.splice(0, this.category.incorrect.length);
        }
        setTimeout(() => {
            this.mainContainer.nativeElement.classList = "bodyContent";
            this.getRandomIndxBlink(this.selectableOpts);
        }, 500)
        this.appModel.enableSubmitBtn(false);
        this.appModel.enableReplayBtn(true);
        setTimeout(() => {
            this.isOptionDisabled = false;
        }, 1000);
        this.optionHolder.leftHolder = this.optionHolder.leftHolder_original;
        this.optionHolder.rightHolder = this.optionHolder.rightHolder_original;
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
    hoverSubmitClose() {
        this.confirmSubmitAssets.close_btn = this.confirmSubmitAssets.close_btn_hover;
    }
    houtSubmitClose() {
        this.confirmSubmitAssets.close_btn = this.confirmSubmitAssets.close_btn_original;
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
        clearTimeout(this.nextFeedbackTimer);
        if (this.feedbackAudio && this.feedbackAudio.nativeElement && !this.feedbackAudio.nativeElement.paused) {
            this.feedbackAudio.nativeElement.pause();
            this.feedbackAudio.nativeElement.currentTime = 0;
            if (this.currentFeedbackElem) {
                this.currentFeedbackElem.classList = "img-fluid";
            }
        }
        this.currentFeedbackPlaying = "categoryB";
        this.category = JSON.parse(JSON.stringify(this.categoryB));
        if (this.showAnswerClicked) {
            this.popupTxtRequired=this.fetchedcontent.showans_2.popTitleTxt_img.required;
            this.isShowOk = false;
            this.feedbackAssets = this.fetchedcontent.showans_2
            this.isRightWrong = true;
            this.isPartial = false;
        }
        else {
            this.isShowOk = true;
            this.feedbackAssets = this.fetchedcontent.category_2;
            if (this.categoryB.correct.length == this.optionHolder.right_random_index.length) {
                this.feedbackAssets.style_header = this.fetchedcontent.category_2.right_style_header;
                this.feedbackAssets.style_body = this.fetchedcontent.category_2.right_style_body;
                this.feedbackAssets.popTitleTxt_img = this.fetchedcontent.category_2.right_style_title;
                this.popupTxtRequired=this.fetchedcontent.category_2.right_style_title.required;
                this.isRightWrong = true;
                this.isPartial = false;
                
            } else if (this.categoryB.correct.length == 0) {
                this.feedbackAssets.style_header = this.fetchedcontent.category_2.wrong_style_header;
                this.feedbackAssets.style_body = this.fetchedcontent.category_2.wrong_style_body;
                this.feedbackAssets.popTitleTxt_img = this.fetchedcontent.category_2.wrong_style_title;
                this.popupTxtRequired=this.fetchedcontent.category_2.wrong_style_title.required;
                this.isRightWrong = true;
                this.isPartial = false;
            } else {
                this.feedbackAssets.style_header = this.fetchedcontent.category_2.partial_style_header;
                this.feedbackAssets.style_body = this.fetchedcontent.category_2.partial_style_body;
                this.feedbackAssets.popTitleTxt_img = this.fetchedcontent.category_2.partial_style_title;
                this.popupTxtRequired=this.fetchedcontent.category_2.partial_style_title.required;
                this.isRightWrong = false;
                this.isPartial = true;
            }
        }
        clearInterval(this.nextBtnInterval);
        this.closeFeedbackPopup2=setTimeout(() => {
            this.setFeedbackAndPlayCorrect(0);
        }, 500)
        this.feedbackAssets.feedback_next_btn = this.feedbackAssets.feedback_next_btn_original;
        this.feedbackAssets.feedback_back_btn = this.feedbackAssets.feedback_back_btn_original;
    }

    prevFeedback() {
        this.isShowOk = false;
        clearTimeout(this.closeFeedbackmodalTimer);
        if (this.feedbackAudio && this.feedbackAudio.nativeElement && !this.feedbackAudio.nativeElement.paused) {
            this.feedbackAudio.nativeElement.pause();
            this.feedbackAudio.nativeElement.currentTime = 0;
            if (this.currentFeedbackElem) {
                this.currentFeedbackElem.classList = "img-fluid";
            }
        }
        this.currentFeedbackPlaying = "categoryA";
        this.category = JSON.parse(JSON.stringify(this.categoryA));

        if (this.showAnswerClicked) {
            this.feedbackAssets = this.fetchedcontent.showans_1
            this.popupTxtRequired=this.fetchedcontent.showans_1.popTitleTxt_img.required;
            this.isRightWrong = true;
            this.isPartial = false;
        }
        else {
            this.feedbackAssets = this.fetchedcontent.category_1;
            if (this.categoryA.correct.length == this.optionHolder.left_random_index.length) {
                this.feedbackAssets.style_header = this.fetchedcontent.category_1.right_style_header;
                this.feedbackAssets.style_body = this.fetchedcontent.category_1.right_style_body;
                this.feedbackAssets.popTitleTxt_img = this.fetchedcontent.category_1.right_style_title;
                this.popupTxtRequired=this.fetchedcontent.category_1.right_style_title.required;
                this.isRightWrong = true;
                this.isPartial = false;

            } else if (this.categoryA.correct.length == 0) {
                this.feedbackAssets.style_header = this.fetchedcontent.category_1.wrong_style_header;
                this.feedbackAssets.style_body = this.fetchedcontent.category_1.wrong_style_body;
                this.feedbackAssets.popTitleTxt_img = this.fetchedcontent.category_1.wrong_style_title;
                this.popupTxtRequired=this.fetchedcontent.category_1.wrong_style_title.required;
                this.isRightWrong = true;
                this.isPartial = false;

            } else {
                this.feedbackAssets.style_header = this.fetchedcontent.category_1.partial_style_header;
                this.feedbackAssets.style_body = this.fetchedcontent.category_1.partial_style_body;
                this.feedbackAssets.popTitleTxt_img = this.fetchedcontent.category_1.partial_style_title;
                this.popupTxtRequired=this.fetchedcontent.category_1.partial_style_title.required;
                this.isRightWrong = false;
                this.isPartial = true;

            }
        }
        setTimeout(() => {
            this.setFeedbackAndPlayCorrect(0);
        }, 500)
        this.feedbackAssets.feedback_next_btn = this.feedbackAssets.feedback_next_btn_original;
        this.feedbackAssets.feedback_back_btn = this.feedbackAssets.feedback_back_btn_original;
    }

    getAnswer() {
        clearInterval(this.blinkTimeInterval);
        this.optionHolder.leftHolder = this.optionHolder.leftHolder_original;
        this.optionHolder.rightHolder = this.optionHolder.rightHolder_original;
        this.attemptType = "auto";
        this.appModel.enableSubmitBtn(false);
        this.categoryA.correct.splice(0, this.categoryA.correct.length);
        this.categoryB.correct.splice(0, this.categoryB.correct.length);
        this.categoryA.incorrect.splice(0, this.categoryA.incorrect.length);
        this.categoryB.incorrect.splice(0, this.categoryB.incorrect.length);
        this.isWrongAttempted = false;
        this.isAllRight = true;
        if (this.category && this.category.correct && this.category.correct.length) {
            this.category.correct.splice(0, this.category.correct.length);
        }
        if (this.category && this.category.incorrect && this.category.incorrect.length) {
            this.category.incorrect.splice(0, this.category.incorrect.length);
        }
        for (let i = 0; i < this.options.length; i++) {
            if (this.options[i].category == "A") {
                this.categoryA.correct.push(this.options[i]);
            } else if (this.options[i].category == "B") {
                this.categoryB.correct.push(this.options[i]);
            }
        }

        this.appModel.stopAllTimer();
        // let fetchedData: any = this.appModel.content.contentData.data;
        if (this.showAnswerClicked) {
            this.feedbackAssets = this.fetchedcontent.showans_1
            this.popupTxtRequired=this.fetchedcontent.showans_1.popTitleTxt_img.required;
        } else {
            this.feedbackAssets = this.fetchedcontent.category_1;
        }
        this.currentFeedbackPlaying = "categoryA";
        this.category = JSON.parse(JSON.stringify(this.categoryA));
        this.isAllRight = true;
        setTimeout(() => {
            this.feedbackAssets.feedback_next_btn = this.feedbackAssets.feedback_next_btn_original;
            this.feedbackAssets.feedback_back_btn = this.feedbackAssets.feedback_back_btn_original;
            this.feedbackPopupRef.nativeElement.classList = "modal displayPopup";
            this.confirmModalRef.nativeElement.classList = "modal";
            this.infoModalRef.nativeElement.classList = "modal";
            this.confirmReplayRef.nativeElement.classList = "modal";
            this.confirmSubmitRef.nativeElement.classList = "modal";
            setTimeout(() => {
                this.showCorrectAns(0);
            }, 200)
        }, 200)
    }

    templatevolume(vol, obj) {
        if (obj.quesVORef && obj.quesVORef.nativeElement) {
            obj.quesVORef.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
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
            this.mainVideo.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.partialFeedbackRef && obj.partialFeedbackRef.nativeElement) {
            this.partialFeedbackRef.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }

    }

    replayVideo() {
        this.videoReplayd = true;
        this.isPlayVideo = true;
        this.appModel.stopAllTimer();
        setTimeout(() => {
            this.mainVideo.nativeElement.play();
            this.mainVideo.nativeElement.onended = () => {
                this.isPlayVideo = false;
                console.log("video eneded in replay function");
                this.appModel.startPreviousTimer();
                this.appModel.videoStraming(false);
                this.appModel.notifyUserAction();
                setTimeout(() => {
                    this.isOptionDisabled = false;
                }, 1000);
            }
        }, 500)
    }

}

