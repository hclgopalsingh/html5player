
import { Component, OnInit, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { Base } from '../../../controller/base';
import { PlayerConstants } from '../../../common/playerconstants';
import { ActivatedRoute } from '@angular/router';
import { SharedserviceService } from '../../../services/sharedservice.service';
import { Subscription } from 'rxjs';

import 'jquery';
declare var $: any;

@Component({
    selector: 'app-template15',
    templateUrl: './template15.component.html',
    styleUrls: ['./template15.component.css']
})
export class Template15Component implements OnInit {

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
    correctOpt: any = '';


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
    instructiontext: string;
    timernextseg: any = "";
    idArray: any = [];
    hasEventFired: boolean = false;
    speaker: any;

    @ViewChild('narrator_voice') narrator_voice: any;
    @ViewChild('audioEl') audioEl: any;
    @ViewChild('sprite') sprite: any;
    @ViewChild('speakerNormal') speakerNormal: any;

    @ViewChild('disableSpeaker') disableSpeaker: any;
    @ViewChild('myAudiohelp') myAudiohelp: any;
    @ViewChild('myAudiospeaker') myAudiospeaker: any;
    @ViewChild('maincontent') maincontent: any;
    @ViewChild('OptionAudio') OptionAudio: any;

    @ViewChild('ansBlock') ansBlock: any;
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


    constructor(private appModel: ApplicationmodelService, private ActivatedRoute: ActivatedRoute, private Sharedservice: SharedserviceService) {
   
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



    ngOnInit() {        
        this.attemptType = "";

        this.setTemplateType();
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
                // this.setPopupAssets();
                // this.getAnswer();
            }
        })
        this.appModel.getConfirmationPopup().subscribe((val) => {
            if (val == "uttarDikhayein") {
                if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
                    this.confirmModalRef.nativeElement.classList = "displayPopup modal";
                    this.appModel.notifyUserAction();
                    // this.setPopupAssets();
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
            //  this.resetActivity();
            //this.appModel.startPreviousTimer();
            this.appModel.notifyUserAction();
            //this.blinkOnLastQues();

        })
    }

    setTemplateType(): void {
        // send message to subscribers via observable subject
        this.ActivatedRoute.data.subscribe(data => {
            this.Sharedservice.sendData(data);
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
        this.optionObj = JSON.parse(JSON.stringify(fetchedData.options));
        this.instructiontext = fetchedData.instructiontext;
        this.myoption = fetchedData.options;
        this.commonAssets = fetchedData.commonassets;

        console.log(this.commonAssets, 'jyoti common assets');
        this.speaker = fetchedData.speaker;
        this.feedback = fetchedData.feedback;
        this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
    }

    checkAnswer(option, event, idx) {   
          // setShowAnsEnabled
        // logic to check what user has done is correct
        if (option.id == this.feedback.correct_ans_index) {
            alert('This is correct answer');
            this.Sharedservice.setShowAnsEnabled(true);
            this.correctOpt = option;
            var popup = document.getElementById("correctAns")
            if (popup)
                popup.className = "d-flex align-items-center justify-content-center showit";
            //disable click on options and speaker
            var optionsBlock = document.getElementById("optionsBlock")
            var disableSpeaker = document.getElementById("disableSpeaker")
            optionsBlock.className = optionsBlock.className.concat(" disable");
            disableSpeaker.className = disableSpeaker.className.concat(" disable");
            this.checkNextActivities();
 
        } else {
            this.wrongCounter += 1;
            if(this.wrongCounter === 3){
                this.Sharedservice.setShowAnsEnabled(true); 
            }else{
                this.Sharedservice.setShowAnsEnabled(false);
            }
           
            this.idArray = [];
            for (let i of this.myoption) {
                this.idArray.push(i.id);
            }        
            this.doRandomize(this.myoption);
        }
    }


    doRandomize(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
       // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;          
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;           
        }
        var flag=this.arraysIdentical(array,this.idArray);
        if(flag){
            this.doRandomize(array);
        }
        else{           
        }
    }
    
    arraysIdentical(a, b) {
        var i = a.length;
        while (i--) {           
            if (a[i].id == b[i]) {
                return true;
            }
        }
        return false;
    }


    isPaused() {
        return this.audio.paused;
    }

    removeEvents() {
        // remove event handlers for all clickable items in the dom
        this.blink = false;
        clearTimeout(this.timernextseg);
    }

    checkNextActivities() {
        // if (this.isPaused()) {
        //     this.removeEvents();

        //     var popup = document.getElementById("correctAns")
        //     popup.className = "d-flex align-items-center justify-content-center hideit";
        //     //disable click on options and speaker
        //     var optionsBlock = document.getElementById("optionsBlock")
        //     optionsBlock.className = optionsBlock.className.concat(" disable");
        //     if (!this.appModel.autoPlay && !this.isLastQues && this.isLastQuesAct) {
        //         this.blink = true;
        //     }
        //     if ((this.appModel.autoPlay && !this.isLastQues) || !((this.isLastQuesAct)) || ((this.isLastQuesAct && this.appModel.autoPlay && !this.isLastQues))) {
        //         this.next();
        //     } else {
        //         //disable all the option
        //         //this.optionBlock.nativeElement.className= "disableDiv";
        //     }
        //     //if(this.currentIdx == this.optionslist.length-1 && !this.isLastActivity && this._sharedService.autoplay_var==0){


        //     //}

        //     if (!this.hasEventFired) {
        //         if (this.isLastQuesAct) {
        //             this.hasEventFired = true;
        //             this.appModel.event = { 'action': 'segmentEnds' };
        //         }
        //         if (this.isLastQues) {
        //             this.appModel.event = { 'action': 'end' };
        //         }
        //     }

        // }
        // else {
        //     console.log("feedback_audio still playing");
        // }
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
        if (this.commonAssets && this.commonAssets.peechey_jayein) {
            this.commonAssets.peechey_jayein = this.commonAssets.peechey_jayein_original;
        }
        if (this.commonAssets && this.commonAssets.aagey_badhein) {
            this.commonAssets.aagey_badhein = this.commonAssets.aagey_badhein_original;
        }

        if (!this.isLastQues) {
            // setTimeout(()=>{
            //   if(this.navBlock && this.navBlock.nativeElement){
            //     this.navBlock.nativeElement.className="d-flex flex-row align-items-center justify-content-around disable_div";
            //   }
            // },0)
            this.currentIdx++;

            this.appModel.nextSection();
            //this.setData();
            this.appModel.setLoader(true);
            this.removeEvents();
            this.reset();
        }
    }

    reset() {
        // will reset all what user performed
        // this.audio.pause();
        // if(this.myAudiohelp && this.myAudiohelp.nativeElement)
        // this.myAudiohelp.nativeElement.pause();
        // if(this.myAudiospeaker && this.myAudiospeaker.nativeElement)
        // this.myAudiospeaker.nativeElement.pause();
        // if(this.myAudiohelp && this.myAudiohelp.nativeElement)
        // this.myAudiohelp.nativeElement.pause();
        // var popup=document.getElementById("correctAns")
        // if(popup){
        //   popup.className ="d-flex align-items-center justify-content-center hideit";
        // }

        // var optionsBlock=document.getElementById("optionsBlock");
        // if(optionsBlock){
        //   optionsBlock.className = "d-flex flex-row align-items-center justify-content-around row1";
        // }

        // var disableSpeaker=document.getElementById("disableSpeaker");
        // if(disableSpeaker){
        //   disableSpeaker.className = "speakerBtn pointer";
        // }

        //this.ans.nativeElement.src=this.question.img_sentence_org;



    }
    onHoverOptions(option, index) {
        option.image = option.image_hover;
    }

    playOptionHover(opt, idx, el) {
        if (opt && opt.audio && opt.audio.url) {
            this.OnHoverOptionAudio(el);
        }
    }


    OnHoverOptionAudio(el: HTMLAudioElement) {    
        if (el.id == "optionaudio") {
            this.OptionAudio.nativeElement.pause();
            if (el.paused) {
                el.currentTime = 0;
                el.play();
            }
            else {
                el.currentTime = 0;
                el.play();
            }
        } else {
            if (this.OptionAudio && this.OptionAudio.nativeElement) {
                this.OptionAudio.nativeElement.pause();
            }
            el.pause();
            el.currentTime = 0;
            el.play();
            // if(this.maincontent){
            //     this.maincontent.nativeElement.className = "disable_div";
            // }
            el.onended = () => {
                if (this.maincontent) {
                    this.maincontent.nativeElement.className = "";
                }
            }

        }
    }


    onHoveroutOptions(option, index) {
        option.image = option.image_original;
    }



    // onHoverhelp(option){
    //  //console.log("in",option);
    //  if(!this.narrator_voice.nativeElement.paused){
    //    this.helpbtn.nativeElement.className="";
    //    console.log("narrator voice still playing");
    //  }
    //  else{
    //    option.help =option.helphover;
    //    this.helpbtn.nativeElement.className="pointer"; 
    //  }
    // }

    onHoverouthelp(option) {
        option.help = option.helpOriginal;
    }

    public speakerTimer: any;

    checkSpeakerVoice() {
        if(!this.audioEl.nativeElement.paused){
            this.speakerNormal.nativeElement.style.display ="none";
            this.sprite.nativeElement.style.display ="block";
        }else{
            this.speakerNormal.nativeElement.style.display ="block";
            this.sprite.nativeElement.style.display ="none";
            clearInterval(this.speakerTimer);
        }

    }

    stopAllSounds(e) {
        if (!this.narrator_voice.nativeElement.paused) {
            e.stopPropagation();
        }
        else { }
    }

    onHoverSpeaker(speaker) {
        speaker.imgsrc = speaker.imghover;
        if (!this.narrator_voice.nativeElement.paused) {
            this.disableSpeaker.nativeElement.className = "speakerBtn";
        }
        else {
            this.disableSpeaker.nativeElement.className = "speakerBtn pointer";
        }
    }


    onHoverOutSpeaker(speaker) {
        speaker.imgsrc = speaker.imgorigional;
        //  if(!this.narrator_voice.nativeElement.paused){
        //    this.disableSpeaker.nativeElement.className="speakerBtn";
        //    console.log("narrator voice still playing");
        //   }
        //   else{
        //    this.disableSpeaker.nativeElement.className="speakerBtn pointer";
        //   }
    }


    getBasePath() {
        if (this.appModel && this.appModel.content) {
            return this.appModel.content.id + '';
        }
    }

    helpSpeaker(el: HTMLAudioElement, speaker) {

        if (!this.narrator_voice.nativeElement.paused) {
            console.log("narrator voice still playing");
        }
        else {

            if (el.id == "S") {
                this.myAudiospeaker.nativeElement.pause();
                if (el.paused) {
                    el.currentTime = 0;
                    el.play();
                }
                else {
                    el.currentTime = 0;
                    el.play();
                }
                this.speakerTimer = setInterval(() => {
                    speaker.imgsrc = speaker.imgactive;
                    this.checkSpeakerVoice();
                }, 100)

            }
            else {
                if (this.myAudiospeaker && this.myAudiospeaker.nativeElement) {
                    this.myAudiospeaker.nativeElement.pause();
                }
                el.pause();
                el.currentTime = 0;
                el.play();
                // if(this.maincontent){
                //     this.maincontent.nativeElement.className = "disable_div";
                // }
                el.onended = () => {
                    alert('voice end');
                    if (this.maincontent) {
                        this.maincontent.nativeElement.className = "";
                    }
                }

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
                // this.startActivity();
                this.appModel.handlePostVOActivity(false);
                this.appModel.enableReplayBtn(true);
            }
        } else {
            this.timerDelayActs = setTimeout(() => {
                // this.startActivity();
                this.appModel.handlePostVOActivity(false);
                this.appModel.enableReplayBtn(true);
            }, 1000)
        }
    }



    startBlinkOption() {
        this.blinkInterval = setInterval(() => {
            if (this.blinkFlag) {
                this.blinkFlag = false;
                if (this.optionRef != undefined && this.submitButtonCounter != this.optionArr.length) {
                    this.optionRef.nativeElement.children[this.randomOptIndx].children[0].src = this.optionObj.option_commonAssets.blink_box.location == 'content' ? this.containgFolderPath + "/" + this.optionObj.option_commonAssets.blink_box.url : this.assetsPath + '/' + this.optionObj.option_commonAssets.blink_box.url;
                }
            } else {
                this.blinkFlag = true;
                if (this.optionRef != undefined && this.submitButtonCounter != this.optionArr.length) {
                    this.optionRef.nativeElement.children[this.randomOptIndx].children[0].src = this.optionObj.option_commonAssets.default_box_original.location == 'content' ? this.containgFolderPath + "/" + this.optionObj.option_commonAssets.default_box_original.url : this.assetsPath + '/' + this.optionObj.option_commonAssets.default_box_original.url;
                }
            }
        }, 500)
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

    templatevolume(vol, obj) {

        if(obj.narrator_voice && obj.narrator_voice.nativeElement){
            obj.narrator_voice.nativeElement.volume = obj.appModel.isMute?0:vol;
        }

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



}