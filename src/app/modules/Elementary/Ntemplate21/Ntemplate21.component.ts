import { Component, OnInit, ViewChild, AfterViewChecked, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { PlayerConstants } from '../../../common/playerconstants';
import { ThemeConstants } from '../../../common/themeconstants';
import { SharedserviceService } from '../../../services/sharedservice.service';
import { Subscription } from 'rxjs'
import { timer } from 'rxjs/observable/timer';
import { take } from 'rxjs/operators';

@Component({
    selector: 'ntemp21',
    templateUrl: './Ntemplate21.component.html',
    styleUrls: ['./Ntemplate21.component.css', '../../../view/css/bootstrap.min.css'],

})

export class Ntemplate21 implements OnInit, AfterViewChecked, OnDestroy {
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

    @ViewChild('quesVORef') quesVORef: any;
    @ViewChild('instructionBar') instructionBar: any;
    @ViewChild('instruction') instruction: any;
    @ViewChild('instructionVO') instructionVO: any;
    @ViewChild('mainContainer') mainContainer: any;
    @ViewChild('confirmModalRef') confirmModalRef: any;
    @ViewChild('modalRef') modalRef: any;
    @ViewChild('popupRef') popupRef: any;
    @ViewChild('popupBodyRef') popupBodyRef: any;
    @ViewChild('confirmReplayRef') confirmReplayRef: any;
    @ViewChild('mainVideo') mainVideo: any;
    @ViewChild('confirmSubmitRef') confirmSubmitRef: any;
    @ViewChild('feedbackPopupRef') feedbackPopupRef: any;
    @ViewChild('feedbackAudio') feedbackAudio: any;
    @ViewChild('operatorModal') operatorModal: any;
    @ViewChild('digitModalRef') digitModalRef: any;
    @ViewChild('operatorFeedback') operatorFeedback: any;
    @ViewChild('digitFeedback') digitFeedback: any;
    @ViewChild('showAnswerPopupRef') showAnswerPopupRef: any;
    @ViewChild('showAnswerVideo') showAnswerVideo: any;

    commonAssets: any = "";
    feedback: any = "";
    narratorAudio: any;
    isOn = true;
    isFirstQues: boolean;
    isLastQues: boolean = false;
    isLastQuesAct: boolean;
    noOfImgs: number;
    noOfImgsLoaded: number = 0;
    loaderTimer: any;
    containgFolderPath: string = "";
    assetsPath: string = "";
    loadFlag: boolean = false;
    confirmAssets: any;
    infoPopupAssets: any;
    confirmSubmitAssets: any;
    confirmReplayAssets: any;
    quesObj: any;
    isPlayVideo: boolean = true;
    videoReplayd: boolean = false;
    questionObj: any;
    isVideoLoaded: boolean = false;
    feedbackAssets: any;
    numbers: any = [];
    noOfDidgit: number = 0;
    waterLevel: any;
    popupType: any;
    number_options: any = [];
    digits: any = [];
    otherAssets: any = [];
    operators: any = [];
    operatorSelected: boolean = false;
    digitsSelected: boolean = false;
    selectedNos: any = [];
    firstNo: number;
    secondNo: number;
    operator: any;
    resultNo: number;
    firstNoAssets: any = [];
    secondNoAssets: any = [];
    resultNoAssets: any = [];
    requiredValue: number;
    isCorrect: boolean = false;
    isInsufficient: boolean = false;
    isExcess: boolean = false;
    feedbackVO: any;
    calValueContainer: any = [];
    givenValueAssets: any = [];
    percentageBase: any;
    opeartorModal: any;
    digitModal: any;
    mathOperator: string;
    calWaterLevel: any;
    noOfAttempt: number = 0;
    showAnswerAssets: any;
    instructionDisable: any;
    isLess: boolean = false;
    rightanspopUpheader_img: boolean = false;
    wronganspopUpheader_img: boolean = false;
    showanspopUpheader_img: boolean = false;
    partialCorrectheaderTxt_img: boolean = false;
    styleHeaderPopup: any;
    styleBodyPopup: any;
    PlayPauseFlag: boolean = true;
    fetchedcontent: any;
    functionalityType: any;
    themePath: any;
    showAnsTimeout: any;
    controlHandler = {
        isSubmitRequired: false,
        isReplayRequired: false
    };
    disableinstruction: boolean = false;
    AnswerpopupTxt: boolean = false;
    popupHeader: any;
    disableinstructionBar: boolean = false;
    SkipLoad: boolean = false;
    Instructionpointer: boolean = false;
    disableinputBlock: boolean = false;
    initialValue: any;
    destinationVal: any;
    initialVal: any;
    timerSubscription: Subscription;
    timerAutoCloseFeedback: Subscription;
    isLastQuestion: boolean;
    confirmPopupSubscription: any;
    actComplete: boolean = false;
    feedbackCloseMin: number;
    showAnssetTimeout: any;

    ngOnInit() {
        //  let that = this;

        if (this.appModel.isNewCollection) {
            this.appModel.event = { 'action': 'segmentBegins' };
        }
        this.containgFolderPath = this.getBasePath();
        let fetchedData: any = this.appModel.content.contentData.data;
        this.fetchedcontent = JSON.parse(JSON.stringify(fetchedData));;
        this.functionalityType = this.appModel.content.contentLogic.functionalityType;
        this.themePath = ThemeConstants.THEME_PATH + this.fetchedcontent.productType + '/' + this.fetchedcontent.theme_name;
        this.Sharedservice.imagePath(this.fetchedcontent, this.containgFolderPath, this.themePath, this.functionalityType);
        this.appModel.globalJsonData.subscribe(data => {
            this.showAnsTimeout = data.showAnsTimeout;
        });
        this.checkquesTab();
        this.setData();
        this.isOn = false;

        this.appModel.getNotification().subscribe(mode => {
            if (mode == "manual") {
                console.log("manual mode ", mode);
                this.isOn = false;

            } else if (mode == "auto") {
                console.log("auto mode", mode);
                this.showAnswer();
                this.popupType = "showanswer";
                this.isOn = false;

            }
        })
        this.confirmPopupSubscription = this.appModel.getConfirmationPopup().subscribe((val) => {
            if (!this.instructionVO.nativeElement.paused) {
                this.instructionVO.nativeElement.currentTime = 0;
                this.instructionVO.nativeElement.pause();
                this.disableinstruction = false;
                this.Instructionpointer = false;
                this.disableinstructionBar = false;
            }
            if (val == "uttarDikhayein") {
                // this.instructionVO.nativeElement.pause();
                // this.instructionVO.nativeElement.currentTime = 0;
                // this.disableinstruction = false;
                // this.Instructionpointer = false;
                // this.disableinstructionBar = false;

                if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
                    this.confirmModalRef.nativeElement.classList = "show modal";
                    this.isOn = false;
                    // this.instructionBar.nativeElement.classList = "instructionBase disableDiv";
                    this.appModel.notifyUserAction();
                    this.checkForAutoClose();
                }
            } else if (val == "submitAnswer") {
                // this.instructionVO.nativeElement.pause();
                // this.instructionVO.nativeElement.currentTime = 0;
                // this.disableinstruction = false;
                // this.Instructionpointer = false;
                // this.disableinstructionBar = false;
                if (this.confirmSubmitRef && this.confirmSubmitRef.nativeElement) {
                    this.confirmSubmitRef.nativeElement.classList = "show modal";
                    this.appModel.notifyUserAction();
                }
            } else if (val == "replayVideo") {
                // this.instructionVO.nativeElement.pause();
                // this.instructionVO.nativeElement.currentTime = 0;
                // this.disableinstruction = false;
                // this.Instructionpointer = false;
                // this.disableinstructionBar = false;
                this.isOn = false;
                if (this.confirmReplayRef && this.confirmReplayRef.nativeElement) {
                    this.confirmReplayRef.nativeElement.classList = "show modal";
                    this.appModel.notifyUserAction();
                    this.PlayPauseFlag = true;
                    this.SkipLoad = true;
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
            // this.appModel.enableReplayBtn(true);
            this.showAnswer();
        })
        this.appModel.handleController(this.controlHandler);
        this.appModel.resetBlinkingTimer();
    }
    ngAfterViewChecked() {
        this.templatevolume(this.appModel.volumeValue, this);
    }

    ngOnDestroy() {
        clearInterval(this.showAnssetTimeout);
        if (this.confirmPopupSubscription != undefined) {
            this.confirmPopupSubscription.unsubscribe();
        }
        if (this.timerSubscription != undefined) {
            this.timerSubscription.unsubscribe();
        }
        if (this.timerAutoCloseFeedback) {
            this.timerAutoCloseFeedback.unsubscribe();
        }
    }

    checkForAutoClose() {
        if (this.confirmModalRef.nativeElement.classList.contains("show")) {
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
                this.sendFeedback('confirm-modal-id', 'no');
                this.timerSubscription.unsubscribe();
            }
        )
    }
    removeSubscription(timer) {
        console.log("waiting for autoClose", timer / 1000);
    }
    checkquesTab() {
        if (this.fetchedcontent.commonassets.ques_control != undefined) {
            this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
        } else {
            this.appModel.getJson();
        }
    }
    getBasePath() {
        if (this.appModel && this.appModel.content) {
            return this.appModel.content.id + '';
        }
    }

    //this function is to run the waterlevel function
    getAnswer() {
        setTimeout(() => {
            this.setWaterLavel();
        }, 200)
    }

    setData() {
        if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
            this.feedback = this.fetchedcontent.feedback;
            this.commonAssets = this.fetchedcontent.commonassets;
            this.narratorAudio = this.fetchedcontent.commonassets.narrator;
            this.noOfImgs = this.commonAssets.imgCount;
            this.isLastQuestion = this.commonAssets.isLastQues;
            this.isFirstQues = this.commonAssets.isFirstQues;
            this.isLastQues = this.appModel.isLastSection;
            this.questionObj = this.fetchedcontent.quesObj;
            this.otherAssets = this.fetchedcontent.other_assets;
            this.firstNo = this.questionObj.initiallyValue;
            this.feedbackAssets = this.fetchedcontent.feedback;
            this.feedbackCloseMin = this.fetchedcontent.feedback.autoCloseMin;
            this.number_options = JSON.parse(JSON.stringify(this.fetchedcontent.number_options));
            this.digits = JSON.parse(JSON.stringify(this.fetchedcontent.digits));
            this.operators = JSON.parse(JSON.stringify(this.fetchedcontent.operators));
            this.numbers = this.fetchedcontent.numbers;
            this.getAssetsForNos(this.questionObj.initiallyValue);
            this.requiredValue = this.otherAssets.givenValue.value;
            this.opeartorModal = this.fetchedcontent.operator_modal;
            this.digitModal = this.fetchedcontent.digit_modal;
            this.showAnswerAssets = this.fetchedcontent.showAnswer_popup;
            if (this.questionObj && this.questionObj.quesVideo && this.questionObj.quesVideo.autoPlay && !this.appModel.isVideoPlayed) {
                this.isPlayVideo = true;
            } else {
                this.isPlayVideo = false;
            }
            this.isLastQuesAct = this.appModel.isLastSectionInCollection;
            if (this.isLastQuesAct || this.isLastQues) {
                this.appModel.setlastQuesNT();
            }

            this.infoPopupAssets = this.fetchedcontent.info_popup;
            this.confirmAssets = this.fetchedcontent.show_answer_confirm;
            this.confirmSubmitAssets = this.fetchedcontent.submit_confirm;
            this.confirmReplayAssets = this.fetchedcontent.replay_confirm;
            this.calValueContainer = this.getAssetsForNos(this.firstNo);
            this.initialValue = this.getAssetsForNos(this.questionObj.initiallyValue);
            this.givenValueAssets = this.getAssetsForNos(this.requiredValue);

            for (let i = 0; i < this.operators.length; i++) {
                if (this.operators[i].canUse) {
                    if (i % 2 == 0) {
                        this.percentageBase = JSON.parse(JSON.stringify(this.otherAssets.givenValue.value));
                        this.destinationVal = JSON.parse(JSON.stringify(this.otherAssets.givenValue.value));
                        if (this.destinationVal > 100 || this.destinationVal < 100) {
                            this.destinationVal = 100;
                        }
                        this.calWaterLevel = 100;
                        this.waterLevel = this.questionObj.initiallyValue * 100 / this.otherAssets.givenValue.value;
                        this.initialVal = this.questionObj.initiallyValue * 100 / this.otherAssets.givenValue.value;

                    } else {
                        this.percentageBase = JSON.parse(JSON.stringify(this.questionObj.initiallyValue));
                        this.destinationVal = (this.otherAssets.givenValue.value * 100) / (this.questionObj.initiallyValue)
                        if (this.destinationVal > 100) {
                            this.destinationVal = 100;
                        }
                        this.calWaterLevel = (this.otherAssets.givenValue.value * 100) / (this.questionObj.initiallyValue)
                        this.initialVal = 100;
                        this.waterLevel = 100;
                    }
                }
            }

            this.quesObj = this.fetchedcontent.quesObj;
            this.controlHandler = {
                isSubmitRequired: this.quesObj.submitRequired,
                isReplayRequired: this.quesObj.replayRequired
            }
            if (this.quesObj.quesVideo && this.quesObj.quesVideo.autoPlay && !this.appModel.isVideoPlayed) {
                this.isPlayVideo = true;
                //sessionStorage.setItem("isPlayVideo", "true");
            } else {
                this.isPlayVideo = false;
            }
        }
    }
    //thisfunction is to convert no in to images array
    getAssetsForNos(num) {
        let numStr = num.toString();
        let numStrFiltered: any;
        let assetsArr = [];
        let isNegativeNo = false;
        if (numStr.charAt(0) == "-") {
            isNegativeNo = true;
            numStrFiltered = numStr.substr(1);
        } else {
            numStrFiltered = numStr;
        }
        for (let i = 0; i < numStrFiltered.length; i++) {
            assetsArr.push(this.numbers[numStrFiltered.charAt(i)]);
        }
        if (isNegativeNo) {
            assetsArr.unshift(this.operators[1].operator);
        }
        return assetsArr;
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

    checkforQVO() {
        this.isVideoLoaded = true;
        if (this.questionObj && this.questionObj.quesInstruction && this.questionObj.quesInstruction.url && this.questionObj.quesInstruction.autoPlay) {
            this.quesVORef.nativeElement.src = this.questionObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
            this.mainContainer.nativeElement.classList = "bodyContent disableDiv";
            this.instructionBar.nativeElement.classList = "instructionBase disableDiv";
            this.quesVORef.nativeElement.load();
            this.quesVORef.nativeElement.play();
            this.appModel.enableReplayBtn(false);
            this.appModel.enableSubmitBtn(false);
            this.appModel.handlePostVOActivity(true);
            this.quesVORef.nativeElement.onended = () => {
                this.mainContainer.nativeElement.classList = "bodyContent";
                this.instructionBar.nativeElement.classList = "instructionBase";
                this.appModel.handlePostVOActivity(false);
                this.appModel.enableReplayBtn(true);
                this.isOn = true;
            }
        } else {
            this.isOn = true;
            this.appModel.handlePostVOActivity(false);
            this.appModel.enableReplayBtn(true);
        }
    }

    operatorMousemove(idx) {
        if (!this.operators[idx].selected) {
            this.operators[idx].imgsrc = this.operators[idx].imgsrc_hover;
        }
    }

    operatorMouseLeave(idx) {
        if (!this.operators[idx].selected) {
            this.operators[idx].imgsrc = this.operators[idx].imgsrc_original;
        }
    }

    operatorSelect(idx) {
        this.disableinstructionBar = false;
        this.deSelectDigits();
        this.deSelectNos();
        //disable replay btn
        // this.appModel.enableReplayBtn(false);
        if (this.instructionVO && this.instructionVO.nativeElement && !this.instructionVO.nativeElement.paused) {
            this.instructionVO.nativeElement.pause();
            this.instructionVO.nativeElement.currentTime = 0;
        }
        this.appModel.notifyUserAction();
        if (this.operators[idx].canUse) {
            this.operatorSelected = true;
            for (let i in this.operators) {
                if (idx != -i) {
                    if (this.operators[i].selected) {
                        this.operators[i].selected = false;
                        this.operators[i].imgsrc = this.operators[i].imgsrc_original;
                    }
                }
            }
            this.operators[idx].imgsrc = this.operators[idx].imgsrc_selected;
            this.operators[idx].selected = true;
            if (idx == 0) {
                this.mathOperator = "plus";
            } else if (idx == 1) {
                this.mathOperator = "minus";
            } else if (idx == 2) {
                this.mathOperator = "multiply";
            } else if (idx == 3) {
                this.mathOperator = "divide";
            }
            this.operator = this.operators[idx].operator;
        } else {
            setTimeout(() => {
                this.operatorModal.nativeElement.classList = "modal show";
                this.isOn = false
                if (this.operatorFeedback && this.operatorFeedback.nativeElement) {
                    this.operatorFeedback.nativeElement.src = this.opeartorModal.wrong_operator_vo.url;
                    this.operatorFeedback.nativeElement.play();
                }
                // let dom = setInterval(() => {
                //     if (this.operatorFeedback && this.operatorFeedback.nativeElement) {
                //         clearInterval(dom);
                //         this.operatorFeedback.nativeElement.src = this.opeartorModal.wrong_operator_vo.url;
                //         this.operatorFeedback.nativeElement.play();
                //         this.operatorFeedback.nativeElement.onended = () => {
                //             this.closeOperatorModal();
                //             this.isOn = true
                //         }
                //     }
                // }, 100)
            }, 500)
        }
    }

    closeOperatorModal() {
        this.appModel.notifyUserAction();
        this.operatorModal.nativeElement.classList = "modal";
        this.operatorFeedback.nativeElement.pause();
        this.operatorFeedback.nativeElement.currentTime = 0;
    }

    closeDigitModal() {
        this.appModel.notifyUserAction();
        this.digitModalRef.nativeElement.classList = "modal";
        this.digitFeedback.nativeElement.pause();
        this.digitFeedback.nativeElement.currentTime = 0;
    }

    digitMousemove(idx) {
        if (!this.digits[idx].selected) {
            this.digits[idx].imgsrc = this.digits[idx].imgsrc_hover;
        }
    }

    digitMouseLeave(idx) {
        if (!this.digits[idx].selected) {
            this.digits[idx].imgsrc = this.digits[idx].imgsrc_original;
        }
    }

    digitSelect(idx) {
        this.deSelectNos();
        this.appModel.notifyUserAction();
        this.digitsSelected = true;
        if (this.instructionVO && this.instructionVO.nativeElement && !this.instructionVO.nativeElement.paused) {
            this.instructionVO.nativeElement.pause();
            this.instructionVO.nativeElement.currentTime = 0;
        }
        for (let i in this.digits) {
            if (idx != -i) {
                if (this.digits[i].selected) {
                    this.digits[i].selected = false;
                    this.digits[i].imgsrc = this.digits[i].imgsrc_original;
                }
            }
        }
        this.digits[idx].imgsrc = this.digits[idx].imgsrc_selected;
        this.digits[idx].selected = true;
        this.noOfDidgit = idx + 1;
    }

    numberMousemove(idx) {
        if (!this.number_options[idx].selected) {
            this.number_options[idx].imgsrc = this.number_options[idx].imgsrc_hover;
        }
    }

    numberMouseLeave(idx) {
        if (!this.number_options[idx].selected) {
            this.number_options[idx].imgsrc = this.number_options[idx].imgsrc_original;
        }
    }

    numberSelect(idx) {
        this.appModel.notifyUserAction();
        if (this.instructionVO && this.instructionVO.nativeElement && !this.instructionVO.nativeElement.paused) {
            this.instructionVO.nativeElement.pause();
            this.instructionVO.nativeElement.currentTime = 0;
        }
        for (let i in this.number_options) {
            if (idx != -i) {
                if (this.number_options[i].selected) {
                    this.number_options[i].selected = false;
                    this.number_options[i].imgsrc = this.number_options[i].imgsrc_original;
                }
            }
        }
        if ((this.mathOperator == "multiply" && this.selectedNos.length == 0 && this.numbers[idx].value == 0)
            || (this.mathOperator == "divide" && this.selectedNos.length == 0 && this.numbers[idx].value == 0)) {
            setTimeout(() => {
                this.digitModalRef.nativeElement.classList = "modal show";
                this.isOn = false;
                if (this.digitFeedback && this.digitFeedback.nativeElement) {
                    this.digitFeedback.nativeElement.src = this.digitModal.wrong_digit_vo.url;
                    this.digitFeedback.nativeElement.play();
                }
            }, 500)
        } else {
            this.number_options[idx].imgsrc = this.number_options[idx].imgsrc_selected;
            this.number_options[idx].selected = true;
            if (this.selectedNos.length < this.noOfDidgit) {
                this.selectedNos.push(this.numbers[idx]);
            }
            if (this.selectedNos.length == this.noOfDidgit) {
                this.appModel.enableSubmitBtn(true);
            }
        }


    }

    // this function is to set the level of water
    setWaterLavel() {
        let i = 0;
        let num = 0;
        let pow = this.selectedNos.length - 1;
        while (pow >= 0) {
            num += this.selectedNos[i].value * Math.pow(10, pow);
            pow = pow - 1;
            i = i + 1;
        }
        this.secondNo = num;
        if (this.mathOperator == "plus") {
            this.waterLevel += num * 100 / this.percentageBase;
            this.resultNo = this.firstNo + this.secondNo;
        } else if (this.mathOperator == "minus") {
            this.waterLevel -= num * 100 / this.percentageBase;
            this.resultNo = this.firstNo - this.secondNo;
        } if (this.mathOperator == "multiply") {
            this.waterLevel = this.waterLevel * num;
            this.resultNo = this.firstNo * this.secondNo;
        } if (this.mathOperator == "divide") {
            this.waterLevel = this.waterLevel / num;
            this.resultNo = Math.floor(this.firstNo / this.secondNo);
        }
        this.calValueContainer = this.getAssetsForNos(this.resultNo);
        this.getAssetsForPopup();
        /* setTimeout(() => {
             this.getAssetsForPopup();
         }, 1000)*/
        /*
             if(this.waterLevel>100){
            this.getPreviousStage();
        }else{
            this.emptySelectedBox();
        }
         */
    }

    //this function drops the level of water to set the select box empty
    emptySelectedBox() {
        this.selectedNos.splice(0, this.selectedNos.length);
        this.operatorSelected = false;
        this.digitsSelected = false;
        for (let i in this.operators) {
            if (this.operators[i].selected) {
                this.operators[i].selected = false;
                this.operators[i].imgsrc = this.operators[i].imgsrc_original;
            }
        }
        for (let i in this.digits) {
            if (this.digits[i].selected) {
                this.digits[i].selected = false;
                this.digits[i].imgsrc = this.digits[i].imgsrc_original;
            }
        }
        for (let i in this.number_options) {
            if (this.number_options[i].selected) {
                this.number_options[i].selected = false;
                this.number_options[i].imgsrc = this.number_options[i].imgsrc_original;
            }
        }
    }

    // this popup set all the assets for popup like operator and equtions n all
    getAssetsForPopup() {
        this.appModel.stopAllTimer();
        this.firstNoAssets = this.getAssetsForNos(this.firstNo);
        this.secondNoAssets = this.getAssetsForNos(this.secondNo);
        this.resultNoAssets = this.getAssetsForNos(this.resultNo);
        let src: any;
        if (this.mathOperator == "plus" || this.mathOperator == "multiply") {
            if (this.resultNo == this.otherAssets.givenValue.value) {
                this.isCorrect = true;
                src = this.feedbackAssets.isCorerctFeed;
            } else if (this.resultNo < this.otherAssets.givenValue.value) {
                this.isInsufficient = true;
                src = this.feedbackAssets.isInsuffFeed;
            } else if ((this.resultNo > this.otherAssets.givenValue.value)) {
                this.isExcess = true;
                src = this.feedbackAssets.isExcessFeed;
            }
        } else if (this.mathOperator == "minus" || this.mathOperator == "divide") {
            if (this.resultNo == this.otherAssets.givenValue.value) {
                this.isCorrect = true;
                src = this.feedbackAssets.isCorerctFeed;
            } else if (this.resultNo > this.otherAssets.givenValue.value) {
                this.isInsufficient = true;
                src = this.feedbackAssets.isInsuffFeed;
            } else if (this.resultNo < this.otherAssets.givenValue.value) {
                src = this.feedbackAssets.isLess;
                this.isLess = true;
            }
        }

        this.feedbackPopupRef.nativeElement.classList = "modal show";
        this.setPopupAssets();
        this.feedbackVO = src;
        this.feedbackAudio.nativeElement.src = src.url;
        this.feedbackAudio.nativeElement.play();
        this.feedbackAudio.nativeElement.onended = () => {
            //no autoclose timer required hence removing function call
            // this.startTimerForAutoCloseFeedback(); 
            // setTimeout(() => {
            //     this.postFeedbackAction();
            // }, this.feedbackCloseMin * 60 * 1000)
        }
    }

    startTimerForAutoCloseFeedback() {
        if (this.timerAutoCloseFeedback) {
            this.timerAutoCloseFeedback.unsubscribe();
        }
        this.appModel.stopAllTimer();
        const interval = 1000;
        const closeFeedbackInterval = this.feedbackCloseMin * 60;
        this.timerAutoCloseFeedback = timer(0, interval).pipe(
            take(closeFeedbackInterval)
        ).subscribe(value =>
            this.removeAutoCloseFeedbackSubscription((closeFeedbackInterval - +value) * interval),
            err => {
                //console.log("error occuered....");
            },
            () => {
                this.sendFeedback(this.feedbackPopupRef, 'no', 'feedbackDone');;
                this.timerAutoCloseFeedback.unsubscribe();
            }
        )
    }
    removeAutoCloseFeedbackSubscription(timer) {
        console.log("waiting for autoClose feedback", timer / 1000);
    }
    postFeedbackAction() {
        this.appModel.enableSubmitBtn(false);
        this.feedbackPopupRef.nativeElement.classList = "modal";
        this.emptySelectedBox();
        this.noOfAttempt += 1;
        console.log("noOfAttempt------------>>>>", this.noOfAttempt)
        if (this.isExcess || this.isLess) {
            this.getPreviousStage()
        } else if (this.isCorrect) {
            this.disableScreen();
            this.blinkOnLastQues("manual");
        } else if (this.isInsufficient) {
            this.firstNo = this.resultNo;
            this.appModel.startPreviousTimer();
            this.appModel.notifyUserAction();
            this.isInsufficient = false;
        }
        if (this.noOfAttempt >= 5 && !this.isCorrect) {
            this.appModel.stopAllTimer();
            this.appModel.wrongAttemptAnimation();
            // this.showAnswer();
        }
    }


    // To open the show answer popup
    showAnswer() {
        this.popupType = "showanswer"
        this.appModel.resetBlinkingTimer();
        this.appModel.stopAllTimer();
        if (this.instructionVO && this.instructionVO.nativeElement && !this.instructionVO.nativeElement.paused) {
            this.instructionVO.nativeElement.pause();
            this.instructionVO.nativeElement.currentTime = 0;
        }

        this.confirmSubmitRef.nativeElement.classList = "modal";
        this.confirmReplayRef.nativeElement.classList = "modal";
        this.confirmModalRef.nativeElement.classList = "modal";
        this.digitModalRef.nativeElement.classList = "modal";
        this.operatorModal.nativeElement.classList = "modal";
        this.showAnswerPopupRef.nativeElement.classList = "modal show";
        this.showAnswerVideo.nativeElement.play();
        this.showAnswerVideo.nativeElement.onended = () => {

            this.showAnssetTimeout = setTimeout(() => {
                this.postShowAnswer();
            }, this.showAnsTimeout)

        }
    }

    //this function will give you previous stage in case if uou exceed the limit
    getPreviousStage() {
        this.resultNo = this.firstNo;
        this.calValueContainer = this.getAssetsForNos(this.resultNo);
        this.waterLevel = this.resultNo * 100 / this.percentageBase;
        this.isExcess = false;
        this.isLess = false;
        this.appModel.startPreviousTimer();
        this.appModel.notifyUserAction();
    }

    playInstruction() {
        if (this.instructionVO.nativeElement && this.instructionVO.nativeElement.src) {
            this.appModel.notifyUserAction();
            this.instructionVO.nativeElement.play();
            this.disableinstructionBar = true;
            this.Instructionpointer = true;
            this.instructionVO.nativeElement.onended = () => {
                this.disableinstructionBar = false;
                this.Instructionpointer = false;
            }
        }
    }
    attemptNo: any = 5;
    sendFeedback(ref, flag: string, action?: string) {
        if (this.instructionVO && this.instructionVO.nativeElement && !this.instructionVO.nativeElement.paused) {
            this.instructionVO.nativeElement.pause();
            this.instructionVO.nativeElement.currentTime = 0;
        }
        ref.classList = "modal";
        this.appModel.notifyUserAction();
        if (this.timerSubscription != undefined) {
            this.timerSubscription.unsubscribe();
        }
        if (this.timerAutoCloseFeedback) {
            this.timerAutoCloseFeedback.unsubscribe();
        }
        if (flag == "no" && !this.actComplete) {
            this.isOn = true;

            // this.instructionDisable = setTimeout(() => {
            //     if (this.instructionBar && this.instructionBar.nativeElement) {
            //         this.instructionBar.nativeElement.classList = "instructionBase";
            //     }
            // }, 1000)
        }
        if (action == "showAnswer") {
            this.showAnswer();
            this.popupType = "showanswer";
        } else if (action == "replay") {
            this.feedbackAssets.replay_confirm.confirm_btn = this.feedbackAssets.replay_confirm.confirm_btn_original;
            this.feedbackAssets.replay_confirm.decline_btn = this.feedbackAssets.replay_confirm.decline_btn_original;
            this.replayVideo();
        } else if (action == "feedbackDone") {
            if (this.feedbackAudio && this.feedbackAudio.nativeElement && !this.feedbackAudio.nativeElement.paused) {
                this.feedbackAudio.nativeElement.pause();
                this.feedbackAudio.nativeElement.currentTime = 0;
            }
            this.postFeedbackAction();
        } else if (action == "operatorModal") {
            this.closeOperatorModal();
            this.isOn = true

        } else if (action == "digitModal") {
            this.closeDigitModal();
            this.isOn = true

        } else if (action == "submitAnswer") {
            //if(this.attemptNo < 5){
            this.attemptNo -= 1
            //}
            console.log("attemptNo", this.attemptNo)
            this.getAnswer();
            if (this.attemptNo == 4) {
                setTimeout(() => {
                    (document.getElementById('Line4') as HTMLElement).style.bottom = this.waterLevel + '%';
                    if (this.waterLevel <= 100 && this.waterLevel > 0) {
                        (document.getElementById('Line4') as HTMLElement).style.display = 'block';
                    }

                }, 300)

            } else if (this.attemptNo == 3) {
                setTimeout(() => {
                    (document.getElementById('Line3') as HTMLElement).style.bottom = this.waterLevel + '%';
                    if (this.waterLevel <= 100 && this.waterLevel > 0) {
                        (document.getElementById('Line3') as HTMLElement).style.display = 'block';
                    }

                }, 300)

            } else if (this.attemptNo == 2) {
                setTimeout(() => {
                    (document.getElementById('Line2') as HTMLElement).style.bottom = this.waterLevel + '%';
                    if (this.waterLevel <= 100 && this.waterLevel > 0) {
                        (document.getElementById('Line2') as HTMLElement).style.display = 'block';
                    }

                }, 300)

            } else if (this.attemptNo == 1) {
                setTimeout(() => {
                    (document.getElementById('Line1') as HTMLElement).style.bottom = this.waterLevel + '%';
                    if (this.waterLevel <= 100 && this.waterLevel > 0) {
                        (document.getElementById('Line1') as HTMLElement).style.display = 'block';
                    }

                }, 300)

            } else if (this.attemptNo == 0) {
                setTimeout(() => {
                    (document.getElementById('Line0') as HTMLElement).style.bottom = this.waterLevel + '%';
                    if (this.waterLevel <= 100 && this.waterLevel > 0) {
                        (document.getElementById('Line0') as HTMLElement).style.display = 'block';
                    }

                }, 300)

            }

        } else if (action == "showAnswerFeedback") {
            this.postShowAnswer();
        }
    }

    postShowAnswer() {
        this.showAnswerVideo.nativeElement.pause();
        this.showAnswerVideo.nativeElement.currentTime = 0;
        this.showAnswerPopupRef.nativeElement.classList = "modal";
        this.disableScreen();
        this.blinkOnLastQues("auto");
    }

    disableScreen() {
        this.isOn = false;
        this.mainContainer.nativeElement.classList = "bodyContent disableDiv reduceOpacity"
        // if (this.instructionDisable) {
        //     clearTimeout(this.instructionDisable);
        // }
        this.instructionBar.nativeElement.classList = "instructionBase disableDiv reduceOpacity";
        this.appModel.enableSubmitBtn(false);
        this.appModel.enableReplayBtn(false);
    }
    blinkOnLastQues(flag?: string) {
        this.actComplete = true;
        if (this.appModel.isLastSectionInCollection) {
            this.appModel.blinkForLastQues(flag);
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
            this.appModel.moveNextQues(flag);
        }
    }


    //These are hover related function on icon
    hoverOperatorCloseConfirm() {
        this.opeartorModal.close_btn = this.opeartorModal.close_btn_hover;
    }

    houtOperatorCloseConfirm() {
        this.opeartorModal.close_btn = this.opeartorModal.close_btn_original;
    }

    hoverOK() {
        this.opeartorModal.ok_btn = this.opeartorModal.ok_btn_hover;
    }

    houtOK() {
        this.opeartorModal.ok_btn = this.opeartorModal.ok_btn_original;
    }
    hoverDigitCloseConfirm() {
        this.digitModal.close_btn = this.digitModal.close_btn_hover;
    }

    houtDigitCloseConfirm() {
        this.digitModal.close_btn = this.digitModal.close_btn_original;
    }

    hoverDigitOK() {
        this.digitModal.ok_btn = this.digitModal.ok_btn_hover;
    }

    houtDigitOK() {
        this.digitModal.ok_btn = this.opeartorModal.ok_btn_original;
    }

    hoverokPopup() {
        this.feedbackAssets.popup_commmon_imgs.ok_btn = this.feedbackAssets.popup_commmon_imgs.ok_btn_hover;
    }

    houtokPopup() {
        this.feedbackAssets.popup_commmon_imgs.ok_btn = this.feedbackAssets.popup_commmon_imgs.ok_btn_original;
    }

    hoverSubmitConfirm() {
        this.feedbackAssets.submit_popup.confirm_btn = this.feedbackAssets.submit_popup.confirm_btn_hover;
    }
    houtSubmitConfirm() {
        this.feedbackAssets.submit_popup.confirm_btn = this.feedbackAssets.submit_popup.confirm_btn_original;
    }
    hoverSubmitDecline() {
        this.feedbackAssets.submit_popup.decline_btn = this.feedbackAssets.submit_popup.decline_btn_hover;
    }
    houtSubmitDecline() {
        this.feedbackAssets.submit_popup.decline_btn = this.feedbackAssets.submit_popup.decline_btn_original;
    }

    hoverConfirm() {
        this.feedbackAssets.confirm_popup.confirm_btn = this.feedbackAssets.confirm_popup.confirm_btn_hover;
    }

    houtConfirm() {
        this.feedbackAssets.confirm_popup.confirm_btn = this.feedbackAssets.confirm_popup.confirm_btn_original;
    }

    hoverDecline() {
        this.feedbackAssets.confirm_popup.decline_btn = this.feedbackAssets.confirm_popup.decline_btn_hover;
    }

    houtDecline() {
        this.feedbackAssets.confirm_popup.decline_btn = this.feedbackAssets.confirm_popup.decline_btn_original;
    }

    hoverCloseConfirm() {
        this.feedbackAssets.confirm_popup.close_btn = this.feedbackAssets.confirm_popup.close_btn_hover;
    }
    houtCloseConfirm() {
        this.feedbackAssets.confirm_popup.close_btn = this.feedbackAssets.confirm_popup.close_btn_original;
    }
    hoverFeedbackClose() {
        this.feedbackAssets.popup_commmon_imgs.close_btn = this.feedbackAssets.popup_commmon_imgs.close_btn_hover;
    }
    houtFeedbackClose() {
        this.feedbackAssets.popup_commmon_imgs.close_btn = this.feedbackAssets.popup_commmon_imgs.close_btn_original;
    }
    hoverShowAnswerClose() {
        this.feedbackAssets.popup_commmon_imgs.close_btn = this.feedbackAssets.popup_commmon_imgs.close_btn_hover;
    }
    houtShowAnswerClose() {
        this.feedbackAssets.popup_commmon_imgs.close_btn = this.feedbackAssets.popup_commmon_imgs.close_btn_original;
    }
    hoverReplayConfirm() {
        this.feedbackAssets.replay_confirm.confirm_btn = this.feedbackAssets.replay_confirm.confirm_btn_hover;
    }

    houtReplayConfirm() {
        this.feedbackAssets.replay_confirm.confirm_btn = this.feedbackAssets.replay_confirm.confirm_btn_original;
    }

    hoverReplayDecline() {
        this.feedbackAssets.replay_confirm.decline_btn = this.feedbackAssets.replay_confirm.decline_btn_hover;
    }

    houtReplayDecline() {
        this.feedbackAssets.replay_confirm.decline_btn = this.feedbackAssets.replay_confirm.decline_btn_original;
    }

    hoverReplayCloseConfirm() {
        this.feedbackAssets.replay_confirm.close_btn = this.feedbackAssets.replay_confirm.close_btn_hover;
    }
    houtReplayCloseConfirm() {
        this.feedbackAssets.replay_confirm.close_btn = this.feedbackAssets.replay_confirm.close_btn_original;
    }
    hoverRefresh() {
        this.otherAssets.refresh_btn.refresh_normal = this.otherAssets.refresh_btn.refresh_hover;
    }
    hleaveRefresh() {
        this.otherAssets.refresh_btn.refresh_normal = this.otherAssets.refresh_btn.refresh_original;
    }

    clearSelected() {
        this.appModel.notifyUserAction();
        this.otherAssets.refresh_btn.refresh_normal = this.otherAssets.refresh_btn.refresh_original;
        for (let i in this.number_options) {
            if (this.number_options[i].selected) {
                this.number_options[i].selected = false;
                this.number_options[i].imgsrc = this.number_options[i].imgsrc_original;
            }
        }
        this.selectedNos.splice(0, this.selectedNos.length);
        this.appModel.enableSubmitBtn(false);
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
    replayVideo() {
        this.appModel.stopAllTimer();
        this.videoReplayd = true;
        this.isPlayVideo = true;
        // this.appModel.enableSubmitBtn(false);
        this.disableinstruction = true;
        setTimeout(() => {
            this.mainVideo.nativeElement.play();
            this.disableinputBlock = true;
            this.mainVideo.nativeElement.onended = () => {
                // setTimeout(() => {
                //     this.appModel.setLoader(false);
                //     this.disableinputBlock = false;
                // }, 1000);

                // this.disableinstruction = false;
                // this.isPlayVideo = false;
                // this.appModel.videoStraming(false);
                // this.appModel.startPreviousTimer();
                // this.appModel.notifyUserAction();
                this.endedHandleronSkip();
            }
        }, 500)
    }
    endedHandler() {
        if (!this.videoReplayd) {
            this.isPlayVideo = false;
            this.appModel.navShow = 2;
            this.appModel.enableReplayBtn(true);
        }
    }

    endedHandleronSkip() {
        // this.isPlayVideo = false;
        // this.appModel.navShow = 2;
        // this.appModel.videoStraming(false);
        // this.appModel.notifyUserAction();
        this.isOn = true;
        setTimeout(() => {
            this.appModel.setLoader(false);
            this.disableinputBlock = false;
        }, 1000);

        this.disableinstruction = false;
        this.isPlayVideo = false;
        this.appModel.videoStraming(false);
        this.appModel.startPreviousTimer();
        this.appModel.notifyUserAction();
    }

    //Video play pause functanality
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
        if (obj.showAnswerVideo && obj.showAnswerVideo.nativeElement) {
            this.showAnswerVideo.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.operatorFeedback && obj.operatorFeedback.nativeElement) {
            this.operatorFeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.digitFeedback && obj.digitFeedback.nativeElement) {
            this.digitFeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }

    }

    deSelectNos() {
        this.Instructionpointer = false;
        this.selectedNos.splice(0, this.selectedNos.length);
        for (let i in this.number_options) {
            if (this.number_options[i].selected) {
                this.number_options[i].selected = false;
                this.number_options[i].imgsrc = this.number_options[i].imgsrc_original;
            }
        }
        this.appModel.enableSubmitBtn(false);
    }

    SelectOperator() {
        this.operatorSelected = false;
        this.Instructionpointer = false;
        for (let i in this.operators) {
            if (this.operators[i].selected) {
                this.operators[i].selected = false;
                this.operators[i].imgsrc = this.operators[i].imgsrc_original;
            }
        }
    }

    //deselect the selected degits
    deSelectDigits() {
        this.digitsSelected = false;
        this.Instructionpointer = false;
        for (let i in this.digits) {
            if (this.digits[i].selected) {
                this.digits[i].selected = false;
                this.digits[i].imgsrc = this.digits[i].imgsrc_original;
            }
        }
    }

    setPopupAssets() {
        this.popupType = this.isCorrect ? "correct" : "wrong";
        console.log("this.isCorrect", this.isCorrect, "this.popupType" + this.popupType);

        if (this.popupType == "wrong") {
            this.rightanspopUpheader_img = false;
            this.wronganspopUpheader_img = true;
            this.showanspopUpheader_img = false;
            this.partialCorrectheaderTxt_img = false;
            this.styleHeaderPopup = this.feedbackAssets.wrong_style_header;
            this.styleBodyPopup = this.feedbackAssets.wrong_style_body;
            if (this.feedbackAssets.wrongAnswerpopupTxt.required) {
                this.AnswerpopupTxt = true;
                this.popupHeader = this.feedbackAssets.wrongAnswerpopupTxt.url;

            } else {
                this.AnswerpopupTxt = false;

            }
        }

        if (this.popupType == "correct") {
            this.rightanspopUpheader_img = true;
            this.wronganspopUpheader_img = false;
            this.showanspopUpheader_img = false;
            this.partialCorrectheaderTxt_img = false;
            this.styleHeaderPopup = this.feedbackAssets.style_header;
            this.styleBodyPopup = this.feedbackAssets.style_body;
            if (this.feedbackAssets.rightAnswerpopupTxt.required) {
                this.AnswerpopupTxt = true;
                this.popupHeader = this.feedbackAssets.rightAnswerpopupTxt.url;

            } else {
                this.AnswerpopupTxt = false;

            }
        }
        if (this.popupType == "showanswer") {
            this.rightanspopUpheader_img = false;
            this.wronganspopUpheader_img = false;
            this.showanspopUpheader_img = true;
            this.partialCorrectheaderTxt_img = false;
            this.styleHeaderPopup = this.feedbackAssets.style_header;
            this.styleBodyPopup = this.feedbackAssets.style_body;
            if (this.feedbackAssets.showAnswerpopupTxt.required) {
                this.AnswerpopupTxt = true;
                this.popupHeader = this.feedbackAssets.showAnswerpopupTxt.url;
            } else {
                this.AnswerpopupTxt = false;
            }
        }
    }

}



