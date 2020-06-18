import { Component, OnInit, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../model/applicationmodel.service';
import { Subject, Observable, Subscription } from 'rxjs'
import 'jquery';
import { PlayerConstants } from '../common/playerconstants';


declare var $: any;

@Component({
    selector: 'ntemp21',
    templateUrl: '../view/layout/Ntemplate21.component.html',
    styleUrls: ['../view/css/Ntemplate21.component.css', '../view/css/bootstrap.min.css'],

})

export class Ntemplate21 implements OnInit {
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

    @ViewChild('quesVORef') quesVORef: any;
    @ViewChild('instructionBar') instructionBar: any;
    @ViewChild('instruction') instruction: any;
    @ViewChild('instructionVO') instructionVO: any;
    @ViewChild('mainContainer') mainContainer: any;
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
    @ViewChild('confirmSubmitRef') confirmSubmitRef: any;
    @ViewChild('partialFeedbackRef') partialFeedbackRef: any;
    @ViewChild('feedbackPopupRef') feedbackPopupRef: any;
    @ViewChild('feedbackOption') feedbackOption: any;
    @ViewChild('feedbackAudio') feedbackAudio: any;
    @ViewChild('operatorModal') operatorModal:any;
    @ViewChild('operatorFeedback') operatorFeedback:any;
     @ViewChild('showAnswerPopupRef') showAnswerPopupRef:any;
     @ViewChild('showAnswerVideo') showAnswerVideo: any;

    audio = new Audio();
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
    assetsFeedback: any = [];
    answerFeedback: string = "";
    postCompleteTimer: any;
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
    calValueContainer:any = [];
    givenValueAssets:any = [];
    percentageBase:any;
    opeartorModal:any;
    mathOperator:string;
    calWaterLevel:any;
    noOfAttempt:number = 0;
    showAnswerAssets:any;
    instructionDisable:any;
    isLess:boolean = false;
    rightanspopUpheader_img: boolean = false;
    wronganspopUpheader_img: boolean = false;
    showanspopUpheader_img: boolean = false;
    partialCorrectheaderTxt_img: boolean = false;
    styleHeaderPopup:any;
    styleBodyPopup:any;
    PlayPauseFlag:boolean = true;
    //wrongAnimationAssts:any;



    ngOnInit() {
        let that = this;
        $( "#navBlock" ).click(function() {
            if (!that.instructionVO.nativeElement.paused)
            {
              that.instructionVO.nativeElement.pause();
              that.instructionVO.nativeElement.currentTime = 0;
            }
          });

        if (this.appModel.isNewCollection) {
            this.appModel.event = { 'action': 'segmentBegins' };
        }
        this.containgFolderPath = this.getBasePath();
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
        this.appModel.getConfirmationPopup().subscribe((val) => {
            if (val == "uttarDikhayein") {
                if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
                    this.confirmModalRef.nativeElement.classList = "show modal";
                    this.isOn = false;
                    this.instructionBar.nativeElement.classList = "instructionBase disableDiv";
                    this.appModel.notifyUserAction();
                }
            } else if (val == "submitAnswer") {
                if (this.confirmSubmitRef && this.confirmSubmitRef.nativeElement) {
                    this.confirmSubmitRef.nativeElement.classList = "show modal";
                    this.appModel.notifyUserAction();
                }
            } else if (val == "replayVideo") {
                this.isOn = false;
                if (this.confirmReplayRef && this.confirmReplayRef.nativeElement) {
                    this.confirmReplayRef.nativeElement.classList = "show modal";
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
        this.appModel.postWrongAttempt.subscribe(() =>{
            this.showAnswer();
        })
        this.appModel.resetBlinkingTimer();
    }

     ngAfterViewChecked() {
    this.templatevolume(this.appModel.volumeValue, this);
  }

    getBasePath() {
        if (this.appModel && this.appModel.content) {
            return this.appModel.content.id + '';
        }
    }

    getAnswer() {
        setTimeout(() => {
            this.setWaterLavel();
        }, 200)
    }

    setData() {
        if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
            let fetchedData: any = this.appModel.content.contentData.data;
            console.log(fetchedData);
            this.feedback = fetchedData.feedback;
            this.commonAssets = fetchedData.commonassets;
            this.narratorAudio = fetchedData.commonassets.narrator;
            this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
            this.noOfImgs = this.commonAssets.imgCount;
            this.isFirstQues = this.commonAssets.isFirstQues;
            this.isLastQues = this.appModel.isLastSection;
            this.questionObj = fetchedData.quesObj;
            this.otherAssets = fetchedData.other_assets;
            this.firstNo = this.questionObj.initiallyValue;
            this.feedbackAssets = fetchedData.feedback_popup;
            this.number_options = JSON.parse(JSON.stringify(fetchedData.number_options));
            this.digits = JSON.parse(JSON.stringify(fetchedData.digits));
            this.operators = JSON.parse(JSON.stringify(fetchedData.operators));
            this.numbers = fetchedData.numbers;
            this.getAssetsForNos(this.questionObj.initiallyValue);
            this.requiredValue = this.otherAssets.givenValue.value;
            this.opeartorModal = fetchedData.operator_modal;
            this.showAnswerAssets = fetchedData.showAnswer_popup;
           //this.wrongAnimationAssts = this.commonAssets.wrongAnimationAssts;

            if (this.questionObj && this.questionObj.quesVideo && this.questionObj.quesVideo.autoPlay && !this.appModel.isVideoPlayed) {
                this.isPlayVideo = true;
            } else {
                this.isPlayVideo = false;
            }
            this.isLastQuesAct = this.appModel.isLastSectionInCollection;
            if (this.isLastQuesAct || this.isLastQues) {
                this.appModel.setlastQuesNT();
            }

            this.infoPopupAssets = fetchedData.info_popup;
            this.confirmAssets = fetchedData.show_answer_confirm;
            this.confirmSubmitAssets = fetchedData.submit_confirm;
            this.confirmReplayAssets = fetchedData.replay_confirm;
            this.calValueContainer = this.getAssetsForNos(this.firstNo);
            this.givenValueAssets = this.getAssetsForNos(this.requiredValue);
            
            for(let i=0;i<this.operators.length;i++){
                if(this.operators[i].canUse){
                    if(i%2==0){
                        this.percentageBase = JSON.parse(JSON.stringify(this.otherAssets.givenValue.value));
                        this.calWaterLevel = 100;
                         this.waterLevel = this.questionObj.initiallyValue*100/this.otherAssets.givenValue.value;
                    }else{
                       this.percentageBase = JSON.parse(JSON.stringify(this.questionObj.initiallyValue)); 
                       this.calWaterLevel = (this.otherAssets.givenValue.value*100)/(this.questionObj.initiallyValue)
                        this.waterLevel = 100;
                    }
                }
            }

            this.quesObj = fetchedData.quesObj;
            if (this.quesObj.quesVideo && this.quesObj.quesVideo.autoPlay && !this.appModel.isVideoPlayed) {
              this.isPlayVideo = true;
              //sessionStorage.setItem("isPlayVideo", "true");
            } else {
              this.isPlayVideo = false;
            }
        }
    }

    getAssetsForNos(num) {
        let numStr = num.toString();
        let numStrFiltered:any;
        let assetsArr = [];
        let isNegativeNo = false;
        if(numStr.charAt(0)=="-"){
            isNegativeNo = true;
           numStrFiltered =  numStr.substr(1);
        }else{
            numStrFiltered = numStr;
        }
        for (let i = 0; i < numStrFiltered.length; i++) {
            assetsArr.push(this.numbers[numStrFiltered.charAt(i)]);
        }
        if(isNegativeNo){
            assetsArr.unshift(this.operators[1].operator);
        }
        return assetsArr;
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

    checkforQVO() {
        this.isVideoLoaded = true;
        if (this.questionObj && this.questionObj.quesInstruction && this.questionObj.quesInstruction.url && this.questionObj.quesInstruction.autoPlay) {
            this.quesVORef.nativeElement.src = this.questionObj.quesInstruction.location == "content" ? this.containgFolderPath + "/" + this.questionObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.questionObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
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
        this.deSelectDigits();
        this.deSelectNos();
        this.appModel.enableReplayBtn(false);
        if(this.instructionVO && this.instructionVO.nativeElement && !this.instructionVO.nativeElement.paused){
            this.instructionVO.nativeElement.pause();
            this.instructionVO.nativeElement.currentTime = 0; 
        }
         this.appModel.notifyUserAction();
        if( this.operators[idx].canUse){
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
        if(idx==0){
            this.mathOperator = "plus";
        }else if(idx==1){
            this.mathOperator = "minus";
        }else if(idx==2){
            this.mathOperator = "multiply";
        }else if(idx==3){
            this.mathOperator = "divide";
        }
        this.operator = this.operators[idx].operator;
        }else {
            setTimeout(() =>{
                 this.operatorModal.nativeElement.classList = "modal show";
                 this.isOn = false
                let dom =  setInterval(() =>{
                    if(this.operatorFeedback && this.operatorFeedback.nativeElement){
                        clearInterval(dom);
                        this.operatorFeedback.nativeElement.src = this.opeartorModal.wrong_operator_vo.location=="content" ? this.containgFolderPath + "/"+ this.opeartorModal.wrong_operator_vo.url :this.assetsPath + "/"+ this.opeartorModal.wrong_operator_vo.url;
                        this.operatorFeedback.nativeElement.play();
                        this.operatorFeedback.nativeElement.onended = () =>{
                            this.closeOperatorModal();
                            this.isOn =true
                        }
                    }
                 },100)
            },500)
        }
    }

    closeOperatorModal(){
       this.appModel.notifyUserAction();
       this.operatorModal.nativeElement.classList = "modal"; 
       this.operatorFeedback.nativeElement.pause();
       this.operatorFeedback.nativeElement.currentTime = 0;
       this.appModel.notifyUserAction();
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
        if(this.instructionVO && this.instructionVO.nativeElement && !this.instructionVO.nativeElement.paused){
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
       if(this.instructionVO && this.instructionVO.nativeElement && !this.instructionVO.nativeElement.paused){
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
        if (this.selectedNos.length < this.noOfDidgit) {
            this.selectedNos.push(this.numbers[idx]);
        }
        if (this.selectedNos.length == this.noOfDidgit) {
             this.appModel.enableSubmitBtn(true);
        }
        this.number_options[idx].imgsrc = this.number_options[idx].imgsrc_selected;
        this.number_options[idx].selected = true;
    }

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
        if(this.mathOperator=="plus"){
            this.waterLevel += num*100/this.percentageBase;
            this.resultNo = this.firstNo + this.secondNo;
        }else if(this.mathOperator=="minus"){
            this.waterLevel -= num*100/this.percentageBase;
            this.resultNo = this.firstNo - this.secondNo;
        }if(this.mathOperator=="multiply"){
            this.waterLevel = this.waterLevel * num;
            this.resultNo = this.firstNo*this.secondNo;
        }if(this.mathOperator=="divide"){
            this.waterLevel = this.waterLevel/num;
            this.resultNo = Math.floor(this.firstNo/this.secondNo);
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

    getAssetsForPopup() {
        this.appModel.stopAllTimer();
        this.firstNoAssets = this.getAssetsForNos(this.firstNo);
        this.secondNoAssets = this.getAssetsForNos(this.secondNo);
        this.resultNoAssets = this.getAssetsForNos(this.resultNo);
        let src: any;
        if(this.mathOperator=="plus" || this.mathOperator=="multiply"){
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
        }else  if(this.mathOperator=="minus" || this.mathOperator=="divide"){
            if (this.resultNo == this.otherAssets.givenValue.value) {
            this.isCorrect = true;
            src = this.feedbackAssets.isCorerctFeed;
            } else if (this.resultNo > this.otherAssets.givenValue.value) {
                this.isInsufficient = true;
                src = this.feedbackAssets.isInsuffFeed;
            } else if(this.resultNo < this.otherAssets.givenValue.value){
                src= this.feedbackAssets.isLess;
                this.isLess = true;
            }
        }

        this.feedbackPopupRef.nativeElement.classList = "modal show";
        this.setPopupAssets();
        this.feedbackVO = src;
        this.feedbackAudio.nativeElement.src = src.location == "content" ? this.containgFolderPath + "/" + src.url : this.assetsPath + "/" + src.url;
        this.feedbackAudio.nativeElement.play();
        // this.feedbackAudio.nativeElement.onended = () => {
        //     setTimeout(() => {
        //         this.postFeedbackAction();
        //     }, 2000)
        // }
    }
    
    postFeedbackAction(){
        this.appModel.enableSubmitBtn(false);
        this.feedbackPopupRef.nativeElement.classList = "modal";
        this.emptySelectedBox();
        this.noOfAttempt+=1;
        console.log("noOfAttempt------------>>>>",this.noOfAttempt)
        if(this.isExcess || this.isLess){
            this.getPreviousStage()
        }else if(this.isCorrect){
            this.disableScreen();
            this.blinkOnLastQues("manual");
        }else if(this.isInsufficient){
            this.firstNo = this.resultNo;
             this.appModel.startPreviousTimer();
             this.appModel.notifyUserAction();
             this.isInsufficient = false;
        }
        if(this.noOfAttempt>=5 && !this.isCorrect){
            this.appModel.stopAllTimer();
             this.appModel.wrongAttemptAnimation();
            // this.showAnswer();
        }
    }

    showAnswer(){
        this.popupType = "showanswer"
        this.appModel.resetBlinkingTimer();
         this.appModel.stopAllTimer();
        if(this.instructionVO && this.instructionVO.nativeElement && !this.instructionVO.nativeElement.paused){
            this.instructionVO.nativeElement.pause();
            this.instructionVO.nativeElement.currentTime = 0; 
        }

        this.confirmSubmitRef.nativeElement.classList = "modal";
        this.confirmReplayRef.nativeElement.classList = "modal";
        this.confirmModalRef.nativeElement.classList = "modal";
        this.showAnswerPopupRef.nativeElement.classList = "modal show";
        this.showAnswerVideo.nativeElement.play();
        this.showAnswerVideo.nativeElement.onended = () =>{
           this.postShowAnswer();
        }
    }

    getPreviousStage() {
        this.resultNo = this.firstNo;
         this.calValueContainer = this.getAssetsForNos(this.resultNo);
        this.waterLevel = this.resultNo*100/this.percentageBase;
        this.isExcess = false;
        this.isLess = false;
        this.appModel.startPreviousTimer();
        this.appModel.notifyUserAction();
    }

    playInstruction() {
        if (this.instructionVO.nativeElement && this.instructionVO.nativeElement.src) {
            this.instructionVO.nativeElement.play();
            this.instructionVO.nativeElement.onended = () => {
            }
        }
    }
    attemptNo : any = 5;
    sendFeedback(ref, flag: string, action?: string) {
        if(this.instructionVO && this.instructionVO.nativeElement && !this.instructionVO.nativeElement.paused){
            this.instructionVO.nativeElement.pause();
            this.instructionVO.nativeElement.currentTime = 0; 
        }
        if(flag == "no"){
            this.isOn = true;
        }
        this.appModel.notifyUserAction();
        ref.classList = "modal";
       this.instructionDisable  = setTimeout(()=>{
           if(this.instructionBar && this.instructionBar.nativeElement){
                this.instructionBar.nativeElement.classList = "instructionBase";
           }
        },1000)
        if (action == "showAnswer") {
            this.showAnswer();
            this.popupType = "showanswer";
        } else if (action == "replay") {
            this.replayVideo();
        } else if (action == "feedbackDone") {
            if (this.feedbackAudio && this.feedbackAudio.nativeElement && !this.feedbackAudio.nativeElement.paused) {
                this.feedbackAudio.nativeElement.pause();
                this.feedbackAudio.nativeElement.currentTime = 0;
            } 
             this.postFeedbackAction();
        }else if(action=="operatorModal"){
            this.closeOperatorModal();
            this.isOn =true

        } else if(action=="submitAnswer"){
            //if(this.attemptNo < 5){
                this.attemptNo -=1
            //}
            console.log("attemptNo",this.attemptNo)
            this.getAnswer();
        }else if(action=="showAnswerFeedback"){
            this.postShowAnswer();
        }
    }

    postShowAnswer(){
        this.showAnswerVideo.nativeElement.pause();
        this.showAnswerVideo.nativeElement.currentTime = 0;
        this.showAnswerPopupRef.nativeElement.classList = "modal";
        this.disableScreen();
        this.blinkOnLastQues("auto");
    }

    disableScreen() {
        this.isOn = false;
        this.mainContainer.nativeElement.classList = "bodyContent disableDiv reduceOpacity"
        if(this.instructionDisable){
             clearTimeout(this.instructionDisable);
        }
        this.instructionBar.nativeElement.classList = "instructionBase disableDiv reduceOpacity";
        this.appModel.enableSubmitBtn(false);
        this.appModel.enableReplayBtn(false);
    }

    blinkOnLastQues(flag?:string) {
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

    replayVideo() {
        this.appModel.stopAllTimer();
        this.videoReplayd = true;
        this.isPlayVideo = true;
        this.appModel.enableSubmitBtn(false);
        $(".instructionBase").addClass("disable_div");
        setTimeout(() => {
            this.mainVideo.nativeElement.play();
            //this.appModel.stopAllTimer();
            this.mainVideo.nativeElement.onended = () => {
                //this.appModel.enableSubmitBtn(true);
                $("#optionsBlock .options").removeClass("disable_div");
                $(".instructionBase").removeClass("disable_div");
                this.isPlayVideo = false;
                this.appModel.videoStraming(false);
                this.appModel.startPreviousTimer();
                this.appModel.notifyUserAction();
            }
        }, 500)
    }

    hoverOperatorCloseConfirm(){
        this.opeartorModal.close_btn = this.opeartorModal.close_btn_hover;
    }

    houtOperatorCloseConfirm(){
        this.opeartorModal.close_btn = this.opeartorModal.close_btn_original;
    }

    hoverOK(){
        this.opeartorModal.ok_btn = this.opeartorModal.ok_btn_hover;
    }

    houtOK(){
        this.opeartorModal.ok_btn = this.opeartorModal.ok_btn_original;
    }
     hoverSubmitConfirm(){
        this.confirmSubmitAssets.confirm_btn = this.confirmSubmitAssets.confirm_btn_hover;
    }
    houtSubmitConfirm(){
        this.confirmSubmitAssets.confirm_btn = this.confirmSubmitAssets.confirm_btn_original;
    }
    hoverSubmitDecline(){
        this.confirmSubmitAssets.decline_btn = this.confirmSubmitAssets.decline_btn_hover;
    }
    houtSubmitDecline(){
        this.confirmSubmitAssets.decline_btn = this.confirmSubmitAssets.decline_btn_original;
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
    hoverFeedbackClose(){
        this.feedbackAssets.close_btn = this.feedbackAssets.close_btn_hover;
    }
    houtFeedbackClose(){
        this.feedbackAssets.close_btn = this.feedbackAssets.close_btn_original;
    }
    hoverShowAnswerClose(){
        this.showAnswerAssets.close_btn = this.showAnswerAssets.close_btn_hover;
    }
    houtShowAnswerClose(){
        this.showAnswerAssets.close_btn = this.showAnswerAssets.close_btn_original;
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
    hoverRefresh(){
        this.otherAssets.refresh_btn.refresh_normal = this.otherAssets.refresh_btn.refresh_hover;
    }
    hleaveRefresh(){
         this.otherAssets.refresh_btn.refresh_normal = this.otherAssets.refresh_btn.refresh_original;
    }

    clearSelected(){
        this.appModel.notifyUserAction();
     this.otherAssets.refresh_btn.refresh_normal = this.otherAssets.refresh_btn.refresh_original;
       for (let i in this.number_options) {
                if (this.number_options[i].selected) {
                    this.number_options[i].selected = false;
                    this.number_options[i].imgsrc = this.number_options[i].imgsrc_original;
                }
            }
            this.selectedNos.splice(0,this.selectedNos.length);
             this.appModel.enableSubmitBtn(false);
    }
     checkVideoLoaded(){
        if (!this.videoReplayd) {
            this.isVideoLoaded = true;
            this.appModel.setLoader(false);
            this.appModel.navShow = 1;
            this.isPlayVideo = true;
            this.appModel.isVideoPlayed = true;
          }else{
            this.isVideoLoaded = true;
          }
    }

    endedHandler(){
        if (!this.videoReplayd) {
            this.isPlayVideo = false;
            this.appModel.navShow = 2;
            this.appModel.enableReplayBtn(true);
        }
    }

    endedHandleronSkip() {    
        this.isPlayVideo = false;   
        this.appModel.navShow = 2;  
        this.appModel.videoStraming(false);
        this.appModel.notifyUserAction();   
    }
  
  
    PlayPauseVideo(){
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
        if(obj.mainVideo && obj.mainVideo.nativeElement){
            this.mainVideo.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if(obj.showAnswerVideo && obj.showAnswerVideo.nativeElement){
            this.showAnswerVideo.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if(obj.operatorFeedback && obj.operatorFeedback.nativeElement){
            this.operatorFeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }

  }

    deSelectNos(){
        this.selectedNos.splice(0,this.selectedNos.length);
         for (let i in this.number_options) {
                if (this.number_options[i].selected) {
                    this.number_options[i].selected = false;
                    this.number_options[i].imgsrc = this.number_options[i].imgsrc_original;
            }
        }
        this.appModel.enableSubmitBtn(false);
    }

    deSelectOperator(){
             this.operatorSelected = false;
        for (let i in this.operators) {
                if (this.operators[i].selected) {
                    this.operators[i].selected = false;
                    this.operators[i].imgsrc = this.operators[i].imgsrc_original;
                }
            }
    }

    deSelectDigits(){
        this.digitsSelected = false;
        for (let i in this.digits) {
                if (this.digits[i].selected) {
                    this.digits[i].selected = false;
                    this.digits[i].imgsrc = this.digits[i].imgsrc_original;
                }
        }
    }



    setPopupAssets(){
        this.popupType = this.isCorrect ? "correct" : "wrong" ;
        console.log("this.isCorrect", this.isCorrect, "this.popupType"+this.popupType);

        if(this.popupType == "wrong"){
            this.rightanspopUpheader_img = false;
            this.wronganspopUpheader_img = true;
            this.showanspopUpheader_img = false;
            this.partialCorrectheaderTxt_img = false;
            this.styleHeaderPopup = this.feedbackAssets.wrong_style_header;
            this.styleBodyPopup = this.feedbackAssets.wrong_style_body;
        }
        // if(this.popupType == "partialCorrect"){
        //     this.rightanspopUpheader_img = false;
        //     this.wronganspopUpheader_img = false;
        //     this.showanspopUpheader_img = false;
        //     this.partialCorrectheaderTxt_img = true;
        //     this.styleHeaderPopup = this.feedbackAssets.style_header;
        //     this.styleBodyPopup = this.feedbackAssets.style_body;
        // }
        if(this.popupType == "correct"){
            this.rightanspopUpheader_img = true;
            this.wronganspopUpheader_img = false;
            this.showanspopUpheader_img = false;
            this.partialCorrectheaderTxt_img = false;
            this.styleHeaderPopup = this.feedbackAssets.style_header;
            this.styleBodyPopup = this.feedbackAssets.style_body;
        }
        if(this.popupType == "showanswer"){
            this.rightanspopUpheader_img = false;
            this.wronganspopUpheader_img = false;
            this.showanspopUpheader_img = true;
            this.partialCorrectheaderTxt_img = false;
            this.styleHeaderPopup = this.feedbackAssets.style_header;
            this.styleBodyPopup = this.feedbackAssets.style_body;
        }


    }





}



