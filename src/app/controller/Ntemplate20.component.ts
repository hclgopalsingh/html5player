import { Component, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../model/applicationmodel.service';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { timer } from 'rxjs/observable/timer';

import 'jquery';
import { defer } from 'rxjs/observable/defer';
import { interval } from 'rxjs/observable/interval';
import { PlayerConstants } from '../common/playerconstants';


declare var $: any;

@Component({
    selector: 'ntemp20',
    templateUrl: '../view/layout/Ntemplate20.component.html',
    styleUrls: ['../view/css/Ntemplate20.component.css', '../view/css/bootstrap.min.css']

})

export class Ntemplate20 implements OnInit {
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
            }, 5000);
        }
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
        this.assetsPath = this.appModel.assetsfolderpath;
        this.appModel.navShow = 2;
    }

    audio = new Audio();
    blink: boolean = false;
    commonAssets: any = "";
    optionslist: any = [];
    optionslist_main: any = "";
    myoption: any = [];
    question: any = "";
    feedback: any = "";
    isLastActivity: any = "";
    bool: boolean = false;
    showIntroScreen: boolean;
    popupType: string = "";
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
    optionObj: any;
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
    attemptTypeClose: string = "";



    placeHolderArrUp: any = [];
    placeHolderArrDown: any = [];
    placeHolderArrUpPopup: any = [];
    placeHolderArrDownPopup: any = [];
    upPlaceHolderIndxs: any = [];
    downPlaceHolderIndxs: any = [];
    blinkingOpt: any;
    randomOptIndx: number;
    optIndxArr: any = [];
    blinkFlag: boolean = true;
    optionArr: any = [];
    optionCommonAssts: any;
    blinkInterval: any;
    submittedArr: any = [];
    responseType: string = "";
    popupTopAssts: any = [];
    popupDownAssts: any = [];
    currentIdx: number = 0;
    resultType: string = "correct";
    sortedOptArr: any;
    currentIndxUp: number = 0;
    currentIndxDown: number = 0;
    currentComparison: any;
    placeToPut: string = "up";
    runningIndx: number = 0;
    optionIndex: number;
    valueOnce: any = [];
    currentValue: number = 0;
    idOfImage: number;
    IdImageArr: any = [];
    submitButtonCounter: number = 0;
    showAnswerCounter: number = 0;
    blinkCounter: number = 0;
    blinkFlagReverse: boolean = false;
    RandomIndexValue: any = [];
    ResizeIndex: number = 0;
    ResizePos: string = "";
    RandomResizeIndex: number = 0;
    ArrPlaceHolder: any = [];
    Ccounter: number = 0;
    wrongCounter: number = 0;
    Order: string = "";
    optionReverseTopPosition: number = 0;
    startActivityCounter: number = 0;
    feedbackObj: any;
    feedbackAudio: any;
    rightanspopUpheader_img: boolean = false;
    wronganspopUpheader_img: boolean = false;
    showanspopUpheader_img: boolean = false;
    partialCorrectheaderTxt_img: boolean = false;
    styleHeaderPopup: any;
    styleBodyPopup: any;



    @ViewChild('mainContainer') mainContainer: any;
    @ViewChild('instructionVO') instructionVO: any;
    @ViewChild('instructionBar') instructionBar: any;
    @ViewChild('quesVORef') quesVORef: any;
    @ViewChild('confirmModalRef') confirmModalRef: any;
    @ViewChild('confirmSubmitRef') confirmSubmitRef: any;
    @ViewChild('infoModalRef') infoModalRef: any;
    @ViewChild('feedbackPopupRef') feedbackPopupRef: any;
    // @ViewChild('feedbackAudio') feedbackAudio: any;
    @ViewChild('correctCategory') correctCategory: any;
    @ViewChild('incorrectCategory') incorrectCategory: any;
    @ViewChild('mainVideo') mainVideo: any;
    @ViewChild('confirmReplayRef') confirmReplayRef: any;
    @ViewChild('partialFeedbackRef') partialFeedbackRef: any;
    @ViewChild('optionRef') optionRef: any;
    @ViewChild('upPlaceHolder') upPlaceHolder: any;
    @ViewChild('downPlaceHolder') downPlaceHolder: any;
    @ViewChild('scaleBoxRef') scaleBoxRef: any;
    @ViewChild('modalfeedback20') modalfeedback20: any;
    @ViewChild('modalFeedbackContainer') modalFeedbackContainer: any;
    @ViewChild('clapSound') clapSound: any;
    @ViewChild('ShowAnswerSound') showAnswerSound: any;
    @ViewChild('WrongSound') WrongSound: any;
    @ViewChild('PartialWrongSound') PartialWrongSound: any;
    @ViewChild('feedbackInfoAudio') feedbackInfoAudio: any;
    @ViewChild('feedbackPopupAudio') feedbackPopupAudio: any;



    ngOnInit() {
        this.attemptType = "";
        console.log("this.attemptType = " + this.attemptType);
        if (this.appModel.isNewCollection) {
            this.appModel.event = { 'action': 'segmentBegins' };
        }
        this.containgFolderPath = this.getBasePath();
        this.setData();
        this.appModel.getNotification().subscribe(mode => {
            if (mode == "manual") {
                console.log("manual mode ", mode);

            } else if (mode == "auto") {
                console.log("auto mode", mode);
                this.attemptType = "uttarDikhayein";
                this.popupType = "showanswer"
                this.setPopupAssets();
                this.getAnswer();
            }
        })
        this.appModel.getConfirmationPopup().subscribe((val) => {
            if (val == "uttarDikhayein") {
                if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
                    this.confirmModalRef.nativeElement.classList = "displayPopup modal";
                    this.appModel.notifyUserAction();
                    this.setPopupAssets();
                    this.popupType = "showanswer";
                    //this.blinkOnLastQues();
                    this.instructionVO.nativeElement.pause();
                    this.instructionVO.nativeElement.currentTime = 0;

                }
            } else if (val == "submitAnswer") {
                if (this.confirmSubmitRef && this.confirmSubmitRef.nativeElement) {
                    this.confirmSubmitRef.nativeElement.classList = "displayPopup modal";
                    this.appModel.notifyUserAction();
                    //this.blinkOnLastQues();
                    this.instructionVO.nativeElement.pause();
                    this.instructionVO.nativeElement.currentTime = 0;
                }
            } else if (val == "replayVideo") {
                if (this.confirmReplayRef && this.confirmReplayRef.nativeElement) {
                    this.confirmReplayRef.nativeElement.classList = "displayPopup modal";
                    this.appModel.notifyUserAction();
                    //this.blinkOnLastQues();
                    this.instructionVO.nativeElement.pause();
                    this.instructionVO.nativeElement.currentTime = 0;
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
            this.resetActivity();
            //this.appModel.startPreviousTimer();
            this.appModel.notifyUserAction();
            //this.blinkOnLastQues();

        })
    }

    ngOnDestroy() {
    }

    ngAfterViewChecked() {
        this.templatevolume(this.appModel.volumeValue, this);
    }

    setData() {
        this.appModel.notifyUserAction();
        let fetchedData: any = this.appModel.content.contentData.data;
        this.timerFeedback = fetchedData.feedback_next_timer;
        this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
        console.log(fetchedData);
        this.optionHolder = fetchedData.option_holder;
        this.optionObj = JSON.parse(JSON.stringify(fetchedData.options_assts));
        this.optionArr = this.optionObj.option;
        this.optionCommonAssts = this.optionObj.option_common_assets;
        this.commonAssets = fetchedData.commonassets;
        this.questionObj = fetchedData.quesObj;
        this.ArrPlaceHolder = this.commonAssets.rightSequence;
        this.Order = this.commonAssets.order.orderType;
        this.feedbackObj = fetchedData.feedback;

        for (let i = 0; i < this.optionObj.place_holder.no_s; i++) {
            this.placeHolderArrUp.push(this.optionObj.place_holder);
            this.placeHolderArrDown.push(this.optionObj.place_holder);
            this.placeHolderArrUpPopup.push(this.optionObj.place_holder);
            this.placeHolderArrDownPopup.push(this.optionObj.place_holder);
        }

        for (let i in this.optionObj.given_values) {
            let opt = {
                imgsrc: '',
                place: '',
                value: ''
            }
            if (this.optionObj.given_values[i].place == "down") {
                opt.place = 'down';
                opt.imgsrc = this.optionObj.given_values[i].imgsrc;
                opt.value = this.optionObj.given_values[i].value
                this.placeHolderArrDown.splice(this.optionObj.given_values[i].index, 1, opt);
            } else if (this.optionObj.given_values[i].place == "up") {
                opt.place = 'up';
                opt.imgsrc = this.optionObj.given_values[i].imgsrc;
                opt.value = this.optionObj.given_values[i].value
                this.placeHolderArrUp.splice(this.optionObj.given_values[i].index, 1, opt);
            }
        }
        this.questionObj = fetchedData.quesObj;
        if (this.questionObj && this.questionObj.quesVideo && this.questionObj.quesVideo.autoPlay && !this.appModel.isVideoPlayed) {
            this.isPlayVideo = true;
        } else {
            this.isPlayVideo = false;
        }
        this.noOfImgs = this.commonAssets.imgCount;
        this.isLastQues = this.appModel.isLastSection;
        this.isLastQuesAct = this.appModel.isLastSectionInCollection;
        if (this.isLastQuesAct || this.isLastQues) {
            this.appModel.setlastQuesNT();
        }
        console.log(this.dummyImgs);
        for (let i = 0; i < this.questionObj.noOfOptions; i++) {
            this.randomArray[i] = i;
        }
        this.feedback = fetchedData.feedback;
        this.infoPopupAssets = fetchedData.info_popup;
        this.confirmAssets = fetchedData.confirm_popup;
        this.confirmSubmitAssets = fetchedData.submit_popup;
        this.confirmReplayAssets = fetchedData.replay_confirm;
    }

    getBasePath() {
        if (this.appModel && this.appModel.content) {
            return this.appModel.content.id + '';
        }
    }

    optionHover(idx, opt) {
        // this.optionRef.nativeElement.children[idx].children[0].src = this.optionCommonAssts.default_box_hover.location == 'content' ? this.containgFolderPath + "/" + this.optionCommonAssts.default_box_hover.url : this.assetsPath + '/' + this.optionCommonAssts.default_box_hover.url;
        $(this.optionRef.nativeElement.children[idx]).addClass("scaleInAnimation");
        $(this.optionRef.nativeElement.children[idx]).removeClass("scaleOutAnimation");
        this.optionRef.nativeElement.children[idx].style.zIndex = "100";
    }
    optionLeave(idx, opt) {
        // this.optionRef.nativeElement.children[idx].children[0].src = this.optionCommonAssts.default_box_hover.location == 'content' ? this.containgFolderPath + "/" + this.optionCommonAssts.default_box_original.url : this.assetsPath + '/' + this.optionCommonAssts.default_box_original.url;
        $(this.optionRef.nativeElement.children[idx]).addClass("scaleOutAnimation");
        $(this.optionRef.nativeElement.children[idx]).removeClass("scaleInAnimation");
        this.optionRef.nativeElement.children[idx].style.zIndex = "99";
    }

    playOptionHover(idx, opt) {
        if (opt && opt.mouse_over_audio && opt.mouse_over_audio.url) {
            if ($(this.optionRef.nativeElement.children[idx])[0].getBoundingClientRect().top != this.optionReverseTopPosition) {
                this.playSound(opt.mouse_over_audio, idx);
            }

        }
    }

    playSound(soundAssets, idx) {
        if (this.audio && this.audio.paused) {
            if (soundAssets.location == 'content') {
                this.audio.src = this.containgFolderPath + '/' + soundAssets.url;
            } else {
                this.audio.src = soundAssets.url;
            }
            for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
                if (i != idx) {
                    // this.optionRef.nativeElement.children[i].classList = "disableDiv";
                }
            }
            this.audio.load();
            this.audio.play();
            this.instructionBar.nativeElement.classList = "instructionBase disableDiv";
            this.instructionVO.nativeElement.pause();
            this.instructionVO.nativeElement.currentTime = 0;
            this.audio.onended = () => {
                this.instructionBar.nativeElement.classList = "instructionBase";
                for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
                    if (i != idx) {
                        //  this.optionRef.nativeElement.children[i].classList = "";
                    }
                }

            }
        }
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

    close() {
        //this.appModel.event = { 'action': 'exit', 'currentPosition': this.currentVideoTime };
        this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
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
        for (let i in this.optionObj.option) {
            this.optIndxArr.push(i);
        }
        this.getRandomIndxBlink();
    }

    getRandomIndxBlink() {
        let indx = this.getRandomIndx();
        this.optionIndex = indx;
        this.randomOptIndx = this.optIndxArr[indx];
        if (this.optionArr[this.randomOptIndx] && this.optionArr[this.randomOptIndx].imgsrc) {
            let opt = {
                imgsrc: this.optionArr[this.randomOptIndx].imgsrc,
                idImage: this.optionArr[this.randomOptIndx].imgsrc.idImage,
                selected: true,
                place: '',
                value: this.optionArr[this.randomOptIndx].value,
                index: this.optionArr[this.randomOptIndx].index,
                isAtCorrectPos: true,
                fromCord: $(this.optionRef.nativeElement.children[this.randomOptIndx])[0].getBoundingClientRect(),
                toCord: ''

            }
            this.blinkingOpt = opt;
            this.idOfImage = this.blinkingOpt.idImage;
            this.optIndxArr.splice(indx, 1);
            this.startBlinkOption();
        }

    }

    getRandomIndx() {
        var randomvalue = Math.floor(Math.random() * this.optIndxArr.length);
        return randomvalue;
    }


    startBlinkOption() {
        this.blinkInterval = setInterval(() => {
            if (this.blinkFlag) {
                this.blinkFlag = false;
                if (this.optionRef != undefined && this.submitButtonCounter != this.optionArr.length) {
                    this.optionRef.nativeElement.children[this.randomOptIndx].children[0].src = this.optionObj.option_common_assets.blink_box.location == 'content' ? this.containgFolderPath + "/" + this.optionObj.option_common_assets.blink_box.url : this.assetsPath + '/' + this.optionObj.option_common_assets.blink_box.url;
                }
            } else {
                this.blinkFlag = true;
                if (this.optionRef != undefined && this.submitButtonCounter != this.optionArr.length) {
                    this.optionRef.nativeElement.children[this.randomOptIndx].children[0].src = this.optionObj.option_common_assets.default_box_original.location == 'content' ? this.containgFolderPath + "/" + this.optionObj.option_common_assets.default_box_original.url : this.assetsPath + '/' + this.optionObj.option_common_assets.default_box_original.url;
                }
            }
        }, 500)
    }

    playInstruction() {
        if (this.instructionVO.nativeElement && this.instructionVO.nativeElement.src) {
            this.instructionVO.nativeElement.play();
            this.appModel.enableSubmitBtn(false);
            this.appModel.enableReplayBtn(false);
            //$(".placeholder").addClass("disable_div");
            //$(".instructionBar .instructionBase").addClass("disable_div");
            this.attemptType = "PlayInstruction";
            /* for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {                
                     this.optionRef.nativeElement.children[i].classList = "disableDiv";                
             }*/
            this.instructionVO.nativeElement.onended = () => {
                this.disableOnInstruction();
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
        //this.blinkOnLastQues();
        ref.classList = "modal";
        if (action == "showAnswer") {
            this.popupType = "showanswer"
            this.getAnswer();
            this.feedbackAudio = this.feedbackObj.show_Answer_sound;
            this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.location == "content" ? this.containgFolderPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
            this.feedbackPopupAudio.nativeElement.play();
            this.attemptType = "showAnswer";
            this.feedbackPopupAudio.nativeElement.onended = () => {
                setTimeout(() => {
                    this.appModel.notifyUserAction();
                    this.blinkOnLastQues();
                    //this.modalfeedback20.nativeElement.classList = "modal";	   
                    this.fadeEverything();
                }, 1000)
            }

        } else if (action == "submitAnswer") {
            if (this.submitButtonCounter != this.optionArr.length) {
                this.infoModalRef.nativeElement.classList = "displayPopup modal";
                let partialFeedbackAudio = this.infoPopupAssets.partialCorrectAudio;
                this.feedbackInfoAudio.nativeElement.src = partialFeedbackAudio.location == "content" ? this.containgFolderPath + "/" + partialFeedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + partialFeedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
                this.feedbackInfoAudio.nativeElement.play();
            }
            else {
                this.popupTopAssts = [];
                this.popupDownAssts = [];
                this.checkResponseType();
                this.appModel.enableSubmitBtn(false);
                this.appModel.enableReplayBtn(true);
            }
        }
        else if (action == "partialFeedback") {
            this.infoModalRef.nativeElement.classList = "modal";
            if (this.feedbackInfoAudio && !this.feedbackInfoAudio.nativeElement.paused) {
                this.feedbackInfoAudio.nativeElement.pause();
                this.feedbackInfoAudio.nativeElement.currentTime = 0;
            }
        }
        else if (action == "fadeEverything") {
            this.attemptTypeClose = "fadeEverything";
            this.fadeEverything();


        }
        else if (action == "feedbackDone") {
            if (this.responseType = "wrong") {
                this.appModel.wrongAttemptAnimation();
            } else if (this.responseType = "allcorrect") {
                this.disableScreen();
                // this.blinkOnLastQues();
            }
        } else if (action == "replay") {
            this.replayVideo();
        } else if (action == "resetActivity") {
            this.resetActivity();
        } else if (action == "partialFeedback") {
            if (this.partialFeedbackRef && this.partialFeedbackRef.nativeElement && !this.partialFeedbackRef.nativeElement.paused) {
                this.partialFeedbackRef.nativeElement.pause();
                this.partialFeedbackRef.nativeElement.currentTime = 0;
            }
        }

        if (flag == "no") {
            if (this.attemptType != "") {
                this.disableOnInstruction();
            }

        }
    }

    disableOnInstruction() {
        if (this.submitButtonCounter > 0) {
            this.appModel.enableSubmitBtn(true);
            this.appModel.enableReplayBtn(false);
        }
        else {
            this.appModel.enableSubmitBtn(false);
            this.appModel.enableReplayBtn(true);
        }

        $(".placeholder").removeClass("disable_div");
        $(".instructionBar .instructionBase").removeClass("disable_div");
        for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
            this.optionRef.nativeElement.children[i].classList = "";
        }
    }

    fadeEverything() {
        if (this.attemptTypeClose == "fadeEverything" || this.attemptTypeClose == "") {
            if (this.attemptType == "manual") {
                this.feedbackPopupAudio.nativeElement.pause();
                this.feedbackPopupAudio.nativeElement.currentTime = 0;
                this.appModel.blinkForLastQues(this.attemptType);
                this.resultType = "correct";
            }
            else if (this.attemptType == "wrong") {
                this.feedbackPopupAudio.nativeElement.pause();
                this.feedbackPopupAudio.nativeElement.currentTime = 0;
                this.appModel.wrongAttemptAnimation();
                this.resultType = "wrong";
                setTimeout(() => {
                    this.startActivityCounter = 0;
                    this.startActivityCounter += 1;
                    this.resetOptions();
                }, 3000)
                return;
            }
            else if (this.attemptType == "showAnswer") {
                this.feedbackPopupAudio.nativeElement.pause();
                this.feedbackPopupAudio.nativeElement.currentTime = 0;
            }
            else if (this.attemptType == "uttarDikhayein") {
            }
            else if (this.attemptType == "PartialWrong") {

                this.feedbackPopupAudio.nativeElement.pause();
                this.feedbackPopupAudio.nativeElement.currentTime = 0;
                this.appModel.wrongAttemptAnimation();
                this.resultType = "partialCorrect";
                setTimeout(() => {
                    this.startActivityCounter = 0;
                    this.startActivityCounter += 1;
                    this.resetOptions();
                }, 3000)
                return;
            }
            else { }
        }

        this.appModel.enableSubmitBtn(false);
        this.appModel.enableReplayBtn(false);
        $(".placeholder").addClass("disable_div");
        $(".instructionBar .instructionBase").addClass("disable_div");
        $(".options").css("opacity", "0.3");
        $(".blockBelowLine .placeholder .lowerimages .number_1").css("opacity", "0.3");
        $(".blockBelowLine .placeholder .lowerimages .number_2").css("opacity", "0.3");
        $(".blockAboveLine .placeholder .upperimages .number_1").css("opacity", "0.3");
        $(".blockAboveLine .placeholder .upperimages .number_2").css("opacity", "0.3");
        $(".optionBase").css("opacity", "0.3");

        $(".instructionBar").css("opacity", "0.3");
        $(".bodyContent .scaleBlock").css("opacity", "0.3");
        for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
            this.optionRef.nativeElement.children[i].classList = "disableDiv";
        }
        if (this.optionRef != undefined && this.attemptType == "showAnswer") {
            this.optionRef.nativeElement.children[this.randomOptIndx].children[0].src = this.optionObj.option_common_assets.default_box_original.location == 'content' ? this.containgFolderPath + "/" + this.optionObj.option_common_assets.default_box_original.url : this.assetsPath + '/' + this.optionObj.option_common_assets.default_box_original.url;
        }
        clearInterval(this.blinkInterval);
        this.attemptType = "";
    }


    checkResponseType() {
        clearInterval(this.blinkTimeInterval);
        this.attemptType = "manual";
        var count: number = 0;
        var kCount: number = 0;
        this.wrongCounter = 0;
        var Range: number = 0;

        this.submittedArr = this.getSelectedArr();


        for (let i = 0; i < this.submittedArr.length; i++) {

            for (let j = 0; j < 2; j++) {
                if (this.submittedArr[i][j] != undefined) {
                    if (this.Order == "ascending") {
                        if (this.submittedArr[i][j].selected != undefined) {
                            if (this.optionObj.given_values[1] != undefined) {
                                if (i >= this.optionObj.given_values[1].index) {
                                    kCount = 1;
                                }
                            }

                            if (i < this.optionObj.given_values[kCount].index) {
                                for (let m = i + 1; m < this.optionObj.given_values[kCount].index; m++) {
                                    if (this.submittedArr[m][0] == undefined && this.submittedArr[m][1] == undefined) {
                                        count = m + 1;
                                    }
                                    else {
                                        count = m;
                                    }



                                    if (this.submittedArr[count] && this.submittedArr[count][0]) {
                                        if (this.submittedArr[count][0].selected != undefined) {
                                            if (this.submittedArr[i][j].value > this.submittedArr[count][0].value) {
                                                if (this.submittedArr[count][0].value < this.optionObj.given_values[kCount].value) {
                                                    this.submittedArr[i][j].isAtCorrectPos = false;
                                                }
                                            }
                                        }


                                    }

                                    if (this.submittedArr[count] && this.submittedArr[count][1]) {
                                        if (this.submittedArr[count][1].selected != undefined) {
                                            if (this.submittedArr[i][j].value > this.submittedArr[count][1].value) {
                                                if (this.submittedArr[count][1].value < this.optionObj.given_values[kCount].value) {
                                                    this.submittedArr[i][j].isAtCorrectPos = false;
                                                }

                                            }
                                        }

                                    }

                                }

                                if (this.submittedArr[i][j].value > this.optionObj.given_values[kCount].value) {
                                    this.submittedArr[i][j].isAtCorrectPos = false;

                                }

                            }

                            if (i > this.optionObj.given_values[kCount].index) {
                                if (kCount == 1) {
                                    Range = this.submittedArr.length;
                                }
                                else {
                                    if (this.optionObj.given_values[1] != undefined) {
                                        Range = this.optionObj.given_values[1].index;
                                    }

                                }

                                for (let m = i + 1; m < Range; m++) {
                                    if (this.submittedArr[m][0] == undefined && this.submittedArr[m][1] == undefined) {
                                        count = m + 1;
                                    }
                                    else {
                                        count = m;
                                    }



                                    if (this.submittedArr[count] && this.submittedArr[count][0]) {
                                        if (this.submittedArr[count][0].selected != undefined) {
                                            if (this.submittedArr[i][j].value > this.submittedArr[count][0].value) {
                                                if (this.submittedArr[count][0].value > this.optionObj.given_values[kCount].value) {
                                                    this.submittedArr[i][j].isAtCorrectPos = false;
                                                }

                                            }
                                        }



                                    }

                                    if (this.submittedArr[count] && this.submittedArr[count][1]) {
                                        if (this.submittedArr[count][1].selected != undefined) {
                                            if (this.submittedArr[i][j].value > this.submittedArr[count][1].value) {
                                                if (this.submittedArr[count][1].value > this.optionObj.given_values[kCount].value) {
                                                    this.submittedArr[i][j].isAtCorrectPos = false;
                                                }

                                            }
                                        }

                                    }

                                }

                                if (this.submittedArr[i][j].value < this.optionObj.given_values[kCount].value) {
                                    this.submittedArr[i][j].isAtCorrectPos = false;
                                }



                            }

                            if (i == this.optionObj.given_values[kCount].index) {
                                if (this.submittedArr[i][j].value != this.optionObj.given_values[kCount].value) {
                                    this.submittedArr[i][j].isAtCorrectPos = false;

                                }
                            }
                            if (this.submittedArr[i][0] != undefined && this.submittedArr[i][1] != undefined) {
                                this.submittedArr[i][0].isAtCorrectPos = false;
                                this.submittedArr[i][1].isAtCorrectPos = false;
                                /*if(this.submittedArr[i][j].value == this.optionObj.given_values[kCount].value)
                                {					 
                               this.submittedArr[i][j].isAtCorrectPos = true;                                            
                                }	*/
                            }

                            if (i == this.optionObj.given_values[kCount].index) {
                                if (this.submittedArr[i][j].value == this.optionObj.given_values[kCount].value) {
                                    this.submittedArr[i][j].isAtCorrectPos = true;
                                }
                                //break;
                            }

                            if (this.submittedArr[i][j].isAtCorrectPos == false) {

                                if (this.submittedArr[i][0] != undefined && this.submittedArr[i][1] != undefined) {
                                    this.wrongCounter += 1;
                                }

                                else {
                                    this.wrongCounter += 1;
                                }

                            }




                        }


                    }

                    if (this.Order == "descending") {
                        if (this.submittedArr[i][j].selected != undefined) {
                            if (this.optionObj.given_values[1] != undefined) {
                                if (i >= this.optionObj.given_values[1].index) {
                                    kCount = 1;
                                }
                            }

                            if (i < this.optionObj.given_values[kCount].index) {
                                for (let m = i + 1; m < this.optionObj.given_values[kCount].index; m++) {
                                    if (this.submittedArr[m][0] == undefined && this.submittedArr[m][1] == undefined) {
                                        count = m + 1;
                                    }
                                    else {
                                        count = m;
                                    }



                                    if (this.submittedArr[count] && this.submittedArr[count][0]) {
                                        if (this.submittedArr[count][0].selected != undefined) {
                                            if (this.submittedArr[i][j].value < this.submittedArr[count][0].value) {
                                                if (this.submittedArr[count][0].value > this.optionObj.given_values[kCount].value) {
                                                    this.submittedArr[i][j].isAtCorrectPos = false;
                                                }
                                            }
                                        }



                                    }

                                    if (this.submittedArr[count] && this.submittedArr[count][1]) {
                                        if (this.submittedArr[count][1].selected != undefined) {
                                            if (this.submittedArr[i][j].value < this.submittedArr[count][1].value) {
                                                if (this.submittedArr[count][1].value > this.optionObj.given_values[kCount].value) {
                                                    this.submittedArr[i][j].isAtCorrectPos = false;
                                                }

                                            }
                                        }

                                    }

                                }

                                if (this.submittedArr[i][j].value < this.optionObj.given_values[kCount].value) {
                                    this.submittedArr[i][j].isAtCorrectPos = false;

                                }

                            }

                            if (i > this.optionObj.given_values[kCount].index) {
                                if (kCount == 1) {
                                    Range = this.submittedArr.length;
                                }
                                else {
                                    if (this.optionObj.given_values[1] != undefined) {
                                        Range = this.optionObj.given_values[1].index;
                                    }
                                }
                                for (let m = i + 1; m <= Range; m++) {
                                    if (this.submittedArr[m] != undefined) {
                                        if (this.submittedArr[m][0] == undefined && this.submittedArr[m][1] == undefined) {
                                            count = m + 1;
                                        }

                                        else {
                                            count = m;
                                        }
                                    }



                                    if (this.submittedArr[count] && this.submittedArr[count][0]) {

                                        if (this.submittedArr[i][j].value < this.submittedArr[count][0].value) {
                                            if (this.submittedArr[count][0].value < this.optionObj.given_values[kCount].value) {
                                                this.submittedArr[i][j].isAtCorrectPos = false;
                                            }

                                        }



                                    }

                                    if (this.submittedArr[count] && this.submittedArr[count][1]) {

                                        if (this.submittedArr[i][j].value < this.submittedArr[count][1].value) {
                                            if (this.submittedArr[count][1].value < this.optionObj.given_values[kCount].value) {
                                                this.submittedArr[i][j].isAtCorrectPos = false;
                                            }

                                        }


                                    }

                                }

                                if (this.submittedArr[i][j].value > this.optionObj.given_values[kCount].value) {
                                    this.submittedArr[i][j].isAtCorrectPos = false;
                                }



                            }

                            if (i == this.optionObj.given_values[kCount].index) {
                                if (this.submittedArr[i][j].value != this.optionObj.given_values[kCount].value) {
                                    this.submittedArr[i][j].isAtCorrectPos = false;

                                }
                            }
                            if (this.submittedArr[i][0] != undefined && this.submittedArr[i][1] != undefined) {
                                this.submittedArr[i][0].isAtCorrectPos = false;
                                this.submittedArr[i][1].isAtCorrectPos = false;
                                /*if(this.submittedArr[i][j].value == this.optionObj.given_values[kCount].value)
                                   {					 
                                      this.submittedArr[i][j].isAtCorrectPos = true;                                            
                                   }	*/
                            }

                            if (i == this.optionObj.given_values[kCount].index) {
                                if (this.submittedArr[i][j].value == this.optionObj.given_values[kCount].value) {
                                    this.submittedArr[i][j].isAtCorrectPos = true;
                                }
                                //break;
                            }

                            if (this.submittedArr[i][j].isAtCorrectPos == false) {

                                if (this.submittedArr[i][0] != undefined && this.submittedArr[i][1] != undefined) {
                                    this.wrongCounter += 1;
                                }

                                else {
                                    this.wrongCounter += 1;
                                }

                            }




                        }


                    }
                }

            }


        }



        if (this.wrongCounter == this.submitButtonCounter) {
            this.resultType = "wrong";
            this.popupType = "wrong"
            this.wrongCounter = 0;
            this.appModel.notifyUserAction();
        }
        else if (this.wrongCounter == 0) {
            this.resultType = "correct";
            this.wrongCounter = 0;
            this.popupType = "correct"
            this.appModel.notifyUserAction();
        }
        else {
            this.resultType = "partialCorrect";
            this.wrongCounter = 0;
            this.popupType = "partialCorrect"
            this.appModel.notifyUserAction();
        }

        if (this.resultType != "") {

            if (this.optIndxArr.length == 0 && this.resultType == "correct") {
                this.responseType = "allCorrect";
                console.log("all Correct congratessssss");
                this.feedbackAudio = this.feedbackObj.correctAudio;
                this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.location == "content" ? this.containgFolderPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);

                this.feedbackPopupAudio.nativeElement.play();
                this.attemptType = "manual";
                this.feedbackPopupAudio.nativeElement.onended = () => {
                    setTimeout(() => {
                        this.appModel.notifyUserAction();
                        this.blinkOnLastQues();
                        //this.modalfeedback20.nativeElement.classList = "modal";
                        //this.fadeEverything();	
                    }, 1000)
                }

                // this.feedback.headerTxt_img = this.feedback.wrong_headerTxt_img;
            } else if (this.resultType == "wrong") {
                this.responseType = "wrongAttempt";
                console.log("wrongggg oopppssssss");
                this.feedbackAudio = this.feedbackObj.incorrectAudio;
                this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.location == "content" ? this.containgFolderPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);

                this.feedbackPopupAudio.nativeElement.play();
                this.attemptType = "wrong";
                this.feedbackPopupAudio.nativeElement.onended = () => {
                    this.appModel.notifyUserAction();
                    //this.modalfeedback20.nativeElement.classList = "modal";
                    //this.fadeEverything();
                }

                //this.feedback.headerTxt_img = this.feedback.right_headerTxt_img;
            }
            else if (this.resultType == "partialCorrect") {
                this.responseType = "partialAttempt";
                this.attemptType = "PartialWrong";
                this.feedbackAudio = this.feedbackObj.partialIncorrect_sound;
                this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.location == "content" ? this.containgFolderPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);

                this.feedbackPopupAudio.nativeElement.play();
                this.feedbackPopupAudio.nativeElement.onended = () => {
                    setTimeout(() => {
                        this.appModel.notifyUserAction();
                        // this.blinkOnLastQues();
                        //this.modalfeedback20.nativeElement.classList = "modal";
                        //this.fadeEverything();	
                    }, 1000)
                }


                //this.feedback.headerTxt_img = this.feedback.right_headerTxt_img;
            }
            for (let i = 0; i < this.submittedArr.length; i++) {
                if (this.submittedArr[i][0] == undefined) {
                    let obj = {
                        url: this.optionObj.place_holder.url,
                        location: this.optionObj.place_holder.location
                    }
                    this.popupTopAssts.push(obj);
                } else {
                    this.popupTopAssts.push(this.submittedArr[i][0]);
                }
                if (this.submittedArr[i][1] == undefined) {
                    let obj = {
                        url: this.optionObj.place_holder.url,
                        location: this.optionObj.place_holder.location
                    }
                    this.popupDownAssts.push(obj);
                } else {
                    this.popupDownAssts.push(this.submittedArr[i][1]);
                }
            }

            this.confirmModalRef.nativeElement.classList = "modal";
            this.confirmSubmitRef.nativeElement.classList = "modal";
            this.modalfeedback20.nativeElement.classList = "modal displayPopup";
            this.setPopupAssets();
        }
    }



    getSelectedArr() {
        let arr = new Array();
        for (let i = 0; i < this.placeHolderArrUp.length; i++) {
            arr[i] = new Array();
            if (this.placeHolderArrUp[i].place) {
                arr[i][0] = this.placeHolderArrUp[i];
            } else {
                arr[i][0] = undefined;
            }
            if (this.placeHolderArrDown[i].place) {
                arr[i][1] = this.placeHolderArrDown[i];
            } else {
                arr[i][1] = undefined;
            }
        }
        return arr;
    }

    blinkOnLastQues() {
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
            this.appModel.moveNextQues();
            this.disableScreen();
        }
    }

    disableScreen() {
        for (let i = 0; i < this.selectedOptList.length; i++) {
            $(this.mainContainer.nativeElement.children[this.selectedOptList[i].idx + 1].children[0]).animate({ left: (0), top: (0) }, 500).removeClass("shrink_it");
        }
        $(this.instructionBar.nativeElement).addClass('greyOut');
        $(this.mainContainer.nativeElement.children[0]).addClass('greyOut');

        //$(this.mainContainer.nativeElement).addClass("greyOut");
        clearInterval(this.blinkTimeInterval);
        if (this.optionHolder != undefined) {
            this.optionHolder.leftHolder = this.optionHolder.leftHolder_original;
            this.optionHolder.rightHolder = this.optionHolder.rightHolder_original;
        }
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

        let addedArr = this.optionObj.given_values.concat(this.optionArr);
        let optCopy = JSON.parse(JSON.stringify(addedArr));
        this.sortedOptArr = optCopy.sort((a, b) => {
            if (this.Order == "ascending") {
                return a.value - b.value;
            }
            if (this.Order == "descending") {
                return b.value - a.value;
            }

        })
        this.setGivenValue();
        this.feedbackAudio = this.feedbackObj.show_Answer_sound;
        this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.location == "content" ? this.containgFolderPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);

        this.feedbackPopupAudio.nativeElement.play();
        this.feedbackPopupAudio.nativeElement.onended = () => {
            setTimeout(() => {
                this.appModel.notifyUserAction();
                this.blinkOnLastQues();
                //this.modalfeedback20.nativeElement.classList = "modal";
                this.fadeEverything();
            }, 1000)
        }


    }

    templatevolume(vol, obj) {
        if (obj.quesVORef && obj.quesVORef.nativeElement) {
            obj.quesVORef.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.instructionVO && obj.instructionVO.nativeElement) {
            obj.instructionVO.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        // if (obj.feedbackAudio && obj.feedbackAudio.nativeElement) {
        //     obj.feedbackAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        // }
        if (obj.feedbackPopupAudio && obj.feedbackPopupAudio.nativeElement) {
            obj.feedbackPopupAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.audio) {
            obj.audio.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.mainVideo && obj.mainVideo.nativeElement) {
            this.mainVideo.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
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
                this.appModel.notifyUserAction();
                this.blinkOnLastQues();
            }
        }, 500)
    }

    selectPosition(index, pos) {
        this.instructionVO.nativeElement.pause();
        this.instructionVO.nativeElement.currentTime = 0;
        this.disableOnInstruction();
        this.appModel.notifyUserAction();
        if (this.submitButtonCounter == this.optionArr.length) {
            return;
        }
        this.ResizeIndex = index;
        this.ResizePos = pos;
        console.log("index = " + index);
        //this.appModel.notifyUserAction();
        //this.blinkOnLastQues();
        this.appModel.enableReplayBtn(false);
        this.mainContainer.nativeElement.classList = "bodyContent disableDiv";
        clearInterval(this.blinkInterval);
        this.RandomResizeIndex = this.randomOptIndx;
        let from = this.optionRef.nativeElement.children[this.randomOptIndx].getBoundingClientRect();
        if (pos == 'up') {
            let to = this.upPlaceHolder.nativeElement.children[index].getBoundingClientRect();
            this.blinkingOpt.toCord = to;
            //$(this.optionRef.nativeElement.children[this.randomOptIndx]).addClass("setPosRelative");
            $(this.optionRef.nativeElement.children[this.randomOptIndx]).animate({ left: (to.left - (from.left)), top: (to.top - (from.top)) }, 500, () => { this.pushToUpPlaceHolder(index, from) });

        } else if (pos == 'down') {
            let to = this.downPlaceHolder.nativeElement.children[index].getBoundingClientRect();
            this.blinkingOpt.toCord = to;
            // $(this.optionRef.nativeElement.children[this.randomOptIndx]).addClass("setPosRelative");
            $(this.optionRef.nativeElement.children[this.randomOptIndx]).animate({ left: (to.left - (from.left)), top: (to.top - (from.top)) }, 500, () => { this.pushToDownPlaceHolder(index, from) });

        }

        if (index == this.idOfImage) {
            console.log("coorectMatch");
            this.IdImageArr.push(index);
        }
        else {
            console.log("WrongMatch");
        }

    }

    // onResize(event) {       
    // if (this.ResizePos == 'up') {
    // let to = this.upPlaceHolder.nativeElement.children[this.ResizeIndex].getBoundingClientRect();           
    // $(this.optionRef.nativeElement.children[this.RandomResizeIndex]).animate({ left: (to.left), top: (to.top) });

    // } else if (this.ResizePos == 'down') {
    // let to = this.optionRef.nativeElement.children[this.RandomResizeIndex].getBoundingClientRect();            
    // $(this.optionRef.nativeElement.children[this.RandomResizeIndex]).animate({ left: (to.left), top: (to.top) });

    // }


    // }

    pushToUpPlaceHolder(index, from) {
        this.submitButtonCounter += 1;
        // $(this.optionRef.nativeElement.children[this.randomOptIndx]).css('top', 'auto').css('left', 'auto');
        this.blinkingOpt.place = 'up';
        this.placeHolderArrUp.splice(index, 1, this.blinkingOpt)
        this.optionRef.nativeElement.children[this.randomOptIndx].style.visibility = "hidden";
        this.appModel.enableSubmitBtn(true);
        this.appModel.enableReplayBtn(false);
        this.getRandomIndxBlink();
        setTimeout(() => {
            this.mainContainer.nativeElement.classList = "bodyContent";
        }, 500)
        if (this.submitButtonCounter >= this.optionArr.length) {
            this.appModel.enableSubmitBtn(true);
            this.appModel.enableReplayBtn(false);
        }
        this.blinkCounter++;
        //console.log("this.blinkCounter = "+this.blinkCounter+" = this.optionArr.length = "+this.optionArr.length);
    }

    pushToDownPlaceHolder(index, from) {
        this.submitButtonCounter += 1;
        //$(this.optionRef.nativeElement.children[this.randomOptIndx]).css('top', 'auto').css('left', 'auto');
        this.blinkingOpt.place = 'down';
        this.placeHolderArrDown.splice(index, 1, this.blinkingOpt)
        this.optionRef.nativeElement.children[this.randomOptIndx].style.visibility = "hidden";
        //this.RandomIndexValue.push(this.randomOptIndx);
        this.appModel.enableSubmitBtn(true);
        this.appModel.enableReplayBtn(false);
        this.getRandomIndxBlink();
        setTimeout(() => {
            this.mainContainer.nativeElement.classList = "bodyContent";
        }, 500)
        if (this.submitButtonCounter >= this.optionArr.length) {
            this.appModel.enableSubmitBtn(true);
            this.appModel.enableReplayBtn(false);
        }
        this.blinkCounter++;
        //console.log("this.blinkCounter = "+this.blinkCounter+" = this.optionArr.length = "+this.optionArr.length);
    }

    reversePosition(opt, idx, pos) {
        this.instructionVO.nativeElement.pause();
        this.instructionVO.nativeElement.currentTime = 0;
        this.disableOnInstruction();
        if (opt.imgsrc.Bg != undefined) {
            return;
        }
        this.appModel.notifyUserAction();
        //this.blinkOnLastQues();
        if (pos == 'up') {
            /*let from = this.upPlaceHolder.nativeElement.children[idx].getBoundingClientRect();//opt.toCord;
            let to = this.optionRef.nativeElement.children[opt.index].getBoundingClientRect(); //opt.fromCord;*/
            this.optionRef.nativeElement.children[opt.index].style.zIndex = "5";
            this.optionRef.nativeElement.children[opt.index].style.visibility = "visible";
            this.placeHolderArrUp.splice(idx, 1, this.optionObj.place_holder);
            $(this.optionRef.nativeElement.children[opt.index]).animate({ left: 0, top: 0 }, 500, () => { this.deleteUpPlaceHolder(opt, idx) });
            this.optionReverseTopPosition = $(this.optionRef.nativeElement.children[opt.index])[0].getBoundingClientRect().top




        } else if (pos == 'down') {
            // /* let from = this.downPlaceHolder.nativeElement.children[idx].getBoundingClientRect();//opt.toCord;
            // let to = this.optionRef.nativeElement.children[opt.index].getBoundingClientRect(); //opt.fromCord;*/
            //$(this.optionRef.nativeElement.children[this.randomOptIndx]).addClass("setPosRelative");
            // this.downPlaceHolder.nativeElement.children[idx].style.zIndex = "5";
            this.optionRef.nativeElement.children[opt.index].style.zIndex = "5";
            this.optionRef.nativeElement.children[opt.index].style.visibility = "visible";
            this.placeHolderArrDown.splice(idx, 1, this.optionObj.place_holder);
            $(this.optionRef.nativeElement.children[opt.index]).animate({ left: 0, top: 0 }, 500, () => { this.deleteDownPlaceHolder(opt, idx) });
            this.optionReverseTopPosition = $(this.optionRef.nativeElement.children[opt.index])[0].getBoundingClientRect().top



        }
        this.IdImageArr.pop();



    }

    deleteUpPlaceHolder(opt, idx) {

        //this.appModel.enableSubmitBtn(false);
        // this.placeHolderArrUp.splice(idx, 1, this.optionObj.place_holder);
        //this.optionRef.nativeElement.children[opt.index].style.visibility = "visible";
        this.optIndxArr.push(opt.index);
        this.optionRef.nativeElement.children[opt.index].children[0].src = this.optionObj.option_common_assets.default_box_original.location == 'content' ? this.containgFolderPath + "/" + this.optionObj.option_common_assets.default_box_original.url : this.assetsPath + '/' + this.optionObj.option_common_assets.default_box_original.url;

        if (this.submitButtonCounter == this.optionArr.length) {
            this.getRandomIndxBlink();
        }

        this.blinkCounter--;
        this.submitButtonCounter -= 1;
        if (this.submitButtonCounter == 0) {
            this.appModel.enableSubmitBtn(false);
            this.appModel.enableReplayBtn(true);

        }

    }

    deleteDownPlaceHolder(opt, idx) {

        //this.appModel.enableSubmitBtn(false);        
        //this.optionRef.nativeElement.children[opt.index].style.visibility = "visible";
        this.optIndxArr.push(opt.index);
        this.optionRef.nativeElement.children[opt.index].children[0].src = this.optionObj.option_common_assets.default_box_original.location == 'content' ? this.containgFolderPath + "/" + this.optionObj.option_common_assets.default_box_original.url : this.assetsPath + '/' + this.optionObj.option_common_assets.default_box_original.url;

        if (this.submitButtonCounter == this.optionArr.length) {
            this.getRandomIndxBlink();
        }

        this.blinkCounter--;
        this.submitButtonCounter -= 1;
        if (this.submitButtonCounter == 0) {
            this.appModel.enableSubmitBtn(false);
            this.appModel.enableReplayBtn(true);

        }

    }

    resetOptions() {

        for (let i = 0; i < this.optionArr.length; i++) {
            this.optionRef.nativeElement.children[i].style.zIndex = "5";
            this.optionRef.nativeElement.children[i].style.visibility = "visible";
            $(this.optionRef.nativeElement.children[i]).animate({ left: 0, top: 0 }, 500);
            if (this.optionRef != undefined) {
                this.optionRef.nativeElement.children[i].children[0].src = this.optionObj.option_common_assets.default_box_original.location == 'content' ? this.containgFolderPath + "/" + this.optionObj.option_common_assets.default_box_original.url : this.assetsPath + '/' + this.optionObj.option_common_assets.default_box_original.url;
            }
        }
        for (let j = 0; j < this.placeHolderArrDown.length; j++) {
            this.placeHolderArrDown.splice(j, 1, this.optionObj.place_holder);
            this.placeHolderArrUp.splice(j, 1, this.optionObj.place_holder);
        }
        setTimeout(() => {
            if (this.startActivityCounter == 1) {
                this.optIndxArr = [];
                this.startActivity();
                this.startActivityCounter += 1;
            }

        }, 500)

        for (let i in this.optionObj.given_values) {
            let opt = {
                imgsrc: '',
                place: '',
                value: ''
            }
            if (this.optionObj.given_values[i].place == "down") {
                opt.place = 'down';
                opt.imgsrc = this.optionObj.given_values[i].imgsrc;
                opt.value = this.optionObj.given_values[i].value
                this.placeHolderArrDown.splice(this.optionObj.given_values[i].index, 1, opt);
            } else if (this.optionObj.given_values[i].place == "up") {
                opt.place = 'up';
                opt.imgsrc = this.optionObj.given_values[i].imgsrc;
                opt.value = this.optionObj.given_values[i].value
                this.placeHolderArrUp.splice(this.optionObj.given_values[i].index, 1, opt);
            }
        }
        this.submitButtonCounter = 0;
        //this.appModel.notifyUserAction();
    }



    setGivenValue() {
        this.showAnswerCounter = 0;
        for (let i = 0; i < this.sortedOptArr.length; i++) {
            let opt = {
                imgsrc: '',
                selected: true,
                place: '',
                value: '',
                index: '',
                BlueBg: false,
                isAtCorrectPos: true
            }
            opt.imgsrc = this.sortedOptArr[i].imgsrc;
            opt.value = this.sortedOptArr[i].value;
            opt.index = this.sortedOptArr[i].index;
            opt.BlueBg = this.sortedOptArr[i].BlueBg;
            opt.place = this.sortedOptArr[i].place;

            if (opt.BlueBg == false) {
                if (opt.place == 'down') {
                    this.placeHolderArrDownPopup.splice(this.showAnswerCounter, 1, opt);
                }
                else {
                    this.placeHolderArrUpPopup.splice(this.showAnswerCounter, 1, opt);
                }
                this.showAnswerCounter += 1;
            }
            else {
                if (opt.place == 'up') {
                    this.placeHolderArrUpPopup.splice(this.showAnswerCounter, 1, opt);
                }
                else {
                    this.placeHolderArrDownPopup.splice(this.showAnswerCounter, 1, opt);
                }
            }
        }
        this.popupTopAssts = this.placeHolderArrUpPopup;
        this.popupDownAssts = this.placeHolderArrDownPopup;
        this.confirmModalRef.nativeElement.classList = "modal";
        this.confirmSubmitRef.nativeElement.classList = "modal";
        this.modalfeedback20.nativeElement.classList = "modal displayPopup";
        this.setPopupAssets();
    }


    pushToUp() {
        if (this.currentComparison.value > this.sortedOptArr[this.currentIdx].value) {
            this.placeHolderArrUpPopup.splice(this.currentIndxUp, 1, this.sortedOptArr[this.currentIdx]);
            this.currentIndxUp++;
        } else if (this.currentComparison.value == this.sortedOptArr[this.currentIdx].value) {
            this.placeHolderArrDownPopup.splice(this.currentComparison.index, 1, this.sortedOptArr[this.currentIdx]);
            this.currentIndxDown++;
        } else if (this.currentComparison.value < this.sortedOptArr[this.currentIdx].value) {
            this.placeHolderArrUpPopup.splice(this.currentComparison.index + 1, 1, this.sortedOptArr[this.currentIdx]);
            this.currentIndxUp = this.currentComparison.index + 1;
        }
    }

    pushToDown() {
        if (this.currentComparison.value > this.sortedOptArr[this.currentIdx].value) {
            this.placeHolderArrDownPopup.splice(this.currentIndxUp, 1, this.sortedOptArr[this.currentIdx]);
            this.currentIndxDown++;
        } else if (this.currentComparison.value == this.sortedOptArr[this.currentIdx].value) {
            this.placeHolderArrUpPopup.splice(this.currentComparison.index, 1, this.sortedOptArr[this.currentIdx]);
            this.currentIndxUp++;
        } else if (this.currentComparison.value < this.sortedOptArr[this.currentIdx].value) {
            this.placeHolderArrDownPopup.splice(this.currentComparison.index + 1, 1, this.sortedOptArr[this.currentIdx]);
            this.currentIndxDown = this.currentComparison.index + 1;
        }
    }

    setPopupAssets() {
        console.log(this.feedbackObj)
        console.log("check pop up type", "this.attemptType:", this.attemptType, "this.resultType:", this.resultType, "this.popupType:", this.popupType)
        if (this.popupType == "wrong") {
            this.rightanspopUpheader_img = false;
            this.wronganspopUpheader_img = true;
            this.showanspopUpheader_img = false;
            this.partialCorrectheaderTxt_img = false;
            this.styleHeaderPopup = this.feedbackObj.wrong_style_header;
            this.styleBodyPopup = this.feedbackObj.wrong_style_body;
        }
        if (this.popupType == "partialCorrect") {
            this.rightanspopUpheader_img = false;
            this.wronganspopUpheader_img = false;
            this.showanspopUpheader_img = false;
            this.partialCorrectheaderTxt_img = true;
            this.styleHeaderPopup = this.feedbackObj.style_header;
            this.styleBodyPopup = this.feedbackObj.style_body;
        }
        if (this.popupType == "correct") {
            this.rightanspopUpheader_img = true;
            this.wronganspopUpheader_img = false;
            this.showanspopUpheader_img = false;
            this.partialCorrectheaderTxt_img = false;
            this.styleHeaderPopup = this.feedbackObj.style_header;
            this.styleBodyPopup = this.feedbackObj.style_body;
        }
        if (this.popupType == "showanswer") {
            this.rightanspopUpheader_img = false;
            this.wronganspopUpheader_img = false;
            this.showanspopUpheader_img = true;
            this.partialCorrectheaderTxt_img = false;
            this.styleHeaderPopup = this.feedbackObj.style_header;
            this.styleBodyPopup = this.feedbackObj.style_body;
        }


    }


}
