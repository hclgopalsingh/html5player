
import { Component, OnInit, HostListener, ViewChild, OnDestroy, ViewChildren } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { PlayerConstants } from '../../../common/playerconstants';
import { ActivatedRoute } from '@angular/router';
import { SharedserviceService } from '../../../services/sharedservice.service';
import { Subscription } from 'rxjs';



@Component({
    selector: 'app-template15',
    templateUrl: './template15.component.html',
    styleUrls: ['./template15.component.css']
})
export class Template15Component implements OnInit {
    blink: boolean = false;
    commonAssets: any = "";
    rightPopup: any;
    wrongPopup: any;
    wrongTimer: any;
    rightTimer: any;
    clapTimer: any;
    i = 0;
    j: number = 0;
    myoption: any = [];
    feedback: any = "";
    bool: boolean = false;
    popupType: string = "";
    isLastQues: boolean = false;
    isAutoplayOn: boolean;
    isLastQuesAct: boolean;
    noOfImgs: number;
    noOfImgsLoaded: number = 0;
    loaderTimer: any;
    containgFolderPath: string = "";
    assetsPath: string = "";
    loadFlag: boolean = false;
    questionObj: any;
    blinkTimeInterval: any;
    blinkSide: string = "";
    isWrongAttempted: boolean = false;
    confirmAssets: any;
    feedbackAssets: any;
    isPlayVideo: boolean;
    videoReplayd: boolean = false;
    attemptType: string = "";
    attemptTypeClose: string = "";
    correctOpt: any = '';
    isVideoLoaded: boolean = false;
    optionArr: any = [];
    currentIdx: number = 0;
    wrongCounter: number = 0;
    instructiontext: string;
    timernextseg: any = "";
    idArray: any = [];
    hasEventFired: boolean = false;
    speaker: any;
    tempSubscription: Subscription;
    closed: boolean = false;
    correct_ans_index: any;
    speakerTimer: any;
    showAnswerPopup: any;
    showAnswerVO: any;
    ifRightAns: boolean = false;
    popupAssets: any;
    showAnswerSubscription: any;
    answerImageBase: any;
    answerImage: any;
    answerImagelocation: any;
    popupIcon: any;
    popupIconLocation: any;
    isPopupClosed: boolean = false;
    answerPopupType: any;
    lastQuestionCheck: any;
    popupclosedinRightWrongAns: boolean = false;
    ifWrongAns: boolean = false;
    popupTime: any
    LastquestimeStart: boolean = false;
    audio = new Audio();
    showAnswerOptionBg: any;

    videoonshowAnspopUp: any;
    showAnswerRef: any;
    showAnswerfeedback: any;
    showAnswerTimer:any;

    @ViewChild('instruction') instruction: any;
    @ViewChild('audioEl') audioEl: any;
    @ViewChild('sprite') sprite: any;
    @ViewChild('speakerNormal') speakerNormal: any;
    @ViewChild('feedbackPopup') feedbackPopup: any;
    // @ViewChild('showAnswerfeedback') showAnswerfeedback: any;
    // @ViewChild('showAnswerRef') showAnswerRef: any;
    @ViewChild('wrongFeedback') wrongFeedback: any;
    @ViewChild('rightFeedback') rightFeedback: any;
    @ViewChild('disableSpeaker') disableSpeaker: any;
    @ViewChild('myAudiospeaker') myAudiospeaker: any;
    @ViewChild('maincontent') maincontent: any;
    @ViewChild('footerNavBlock') footerNavBlock: any;
    @ViewChild('ansBlock') ansBlock: any;
    @ViewChild('clapSound') clapSound: any;
    @ViewChild('overlay') overlay: any;
    @ViewChild('optionRef') optionRef: any;

    constructor(private appModel: ApplicationmodelService, private ActivatedRoute: ActivatedRoute, private Sharedservice: SharedserviceService) {

        //subscribing common popup from shared service to get the updated event and values of speaker
        this.Sharedservice.showAnsRef.subscribe(showansref => {
            this.showAnswerRef = showansref;
        })

        this.Sharedservice.showAnswerfeedback.subscribe(showanswerfeedback => {
            this.showAnswerfeedback = showanswerfeedback;
        });
        this.Sharedservice.videoonshowAnspopUp.subscribe(videoonsAnspopUp => {
            this.videoonshowAnspopUp = videoonsAnspopUp;
        });
        this.appModel = appModel;
        this.appModel.setLoader(true);
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
        this.Sharedservice.setLastQuesAageyBadheStatus(true);
        this.sprite.nativeElement.style = "display:none";
        this.ifRightAns = false;
        this.attemptType = "";
        this.setTemplateType();
        this.setData();
        this.containgFolderPath = this.getBasePath();

        console.log("this.attemptType = " + this.attemptType);
        if (this.appModel.isNewCollection) {
            this.appModel.event = { 'action': 'segmentBegins' };
        }

        this.appModel.getNotification().subscribe(mode => {
            if (mode == "manual") {
                console.log("manual mode ", mode);
            } else if (mode == "auto") {
                console.log("auto mode", mode);
                this.attemptType = "uttarDikhayein";
                this.popupType = "showanswer"
            }
        })


        this.showAnswerSubscription = this.appModel.getConfirmationPopup().subscribe((val) => {
            this.appModel.stopAllTimer();
            let speakerEle = document.getElementsByClassName("speakerBtn")[0].children[2] as HTMLAudioElement;
            if (!speakerEle.paused) {
                speakerEle.pause();
                speakerEle.currentTime = 0;
                this.sprite.nativeElement.style = "display:none";
                (document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "";
                this.speaker.imgsrc = this.speaker.imgorigional;
            }
            if (this.showAnswerRef && this.showAnswerRef.nativeElement) {
                this.videoonshowAnspopUp.nativeElement.src = this.showAnswerPopup.location == "content" ? this.containgFolderPath + "/" + this.showAnswerPopup.video : this.assetsPath + "/" + this.showAnswerPopup.video;
                this.showAnswerRef.nativeElement.classList = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
                if (this.videoonshowAnspopUp && this.videoonshowAnspopUp.nativeElement) {
                    this.videoonshowAnspopUp.nativeElement.play();
                    this.videoonshowAnspopUp.nativeElement.onended = () => {
                        this.showAnswerTimer=  setTimeout(() => {
                            this.closePopup('showAnswer');
                        }, 10000);
                    }
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

        this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
            if (mode == "manual") {
                //show modal for manual
                this.appModel.notifyUserAction();
                // if (this.ansPopup && this.ansPopup.nativeElement) {
                // 	this.ansPopup.nativeElement.classList = "displayPopup modal";
                // }
            } else if (mode == "auto") {
                // this.showAnswers();
            }
        })

        // this.appModel.postWrongAttempt.subscribe(() => { 
        //     this.appModel.notifyUserAction();
        // })
    }


    ngOnDestroy() {
        this.showAnswerSubscription.unsubscribe();
        clearTimeout(this.rightTimer);
        clearTimeout(this.clapTimer);
        this.stopAllSounds();
        // this.checkAnswer(this.myoption);

    }

    ngAfterViewChecked() {
        this.templatevolume(this.appModel.volumeValue, this);
    }

    //**Function to stop all sounds */
    stopAllSounds(clickStatus?) {
        this.audio.pause();
        this.audio.currentTime = 0;
		
		this.myAudiospeaker.nativeElement.pause();
        this.myAudiospeaker.nativeElement.currentTime=0;

        this.wrongFeedback.nativeElement.pause();
        this.wrongFeedback.nativeElement.currentTime = 0;

        this.rightFeedback.nativeElement.pause();
        this.rightFeedback.nativeElement.currentTime = 0;

        this.clapSound.nativeElement.pause();
        this.clapSound.nativeElement.currentTime = 0;

        if(clickStatus) {
            this.enableAllOptions();
          }
    }

    /******Set template type for EVA******/
    setTemplateType(): void {
        this.ActivatedRoute.data.subscribe(data => {
            this.Sharedservice.sendData(data);
        })
    }

    /****Get base path****/
    getBasePath() {
        if (this.appModel && this.appModel.content) {
            return this.appModel.content.id + '';
        }
    }

    /****Set data for the Template****/
    setData() {
        this.appModel.notifyUserAction();
        let fetchedData: any = this.appModel.content.contentData.data;
        this.instructiontext = fetchedData.instructiontext;
        this.myoption = fetchedData.options;
        this.commonAssets = fetchedData.commonassets;
        this.speaker = fetchedData.speaker;
        this.feedback = fetchedData.feedback;
        this.questionObj = fetchedData.quesObj;
        this.noOfImgs = fetchedData.imgCount;
        this.popupAssets = fetchedData.feedback.popupassets;
        this.correct_ans_index = this.feedback.correct_ans_index;
        this.rightPopup = this.feedback.right_ans_sound;
        this.wrongPopup = this.feedback.wrong_ans_sound;
        this.showAnswerVO = this.feedback.show_ans_sound;
        this.showAnswerPopup = this.feedback.show_ans_popup;
        this.lastQuestionCheck = this.commonAssets.ques_control.isLastQues;
        this.commonAssets.ques_control.blinkingStatus = false;
        this.isLastQues = this.appModel.isLastSection;
        this.isLastQuesAct = this.appModel.isLastSectionInCollection;
        this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
        setTimeout(() => {
            if (this.footerNavBlock && this.footerNavBlock.nativeElement) {
                this.footerNavBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around";
            }
        }, 200)

    }

    /****Check answer on option click*****/
    checkAnswer(option) {
        this.popupclosedinRightWrongAns = false;
        this.stopAllSounds("clicked"); 
        // logic to check what user has done is correct
        if (option.id == this.feedback.correct_ans_index) {
            this.answerPopupType = 'right';
            clearTimeout(this.wrongTimer);
            this.correctOpt = option;
            this.attemptType = "manual";
            this.appModel.stopAllTimer();
            this.answerImageBase = option.image_original.url;
            this.answerImage = option.imgsrc.url;
            this.answerImagelocation = option.image_original.location;
            this.showAnswerOptionBg = option.image_original.url;
            this.popupIcon = this.popupAssets.right_icon.url;
            this.popupIconLocation = this.popupAssets.right_icon.location;
            this.ifRightAns = true;
            let feedbackPopup: HTMLElement = this.feedbackPopup.nativeElement as HTMLElement

            for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
                document.getElementsByClassName("ansBtn")[i].classList.add("disableDiv");
            }
            setTimeout(() => {
                if (this.rightFeedback && this.rightFeedback.nativeElement) {
                    option.image = option.image_hover;
                    this.clapSound.nativeElement.play();
                    this.clapTimer = setTimeout(() => {
                        this.clapSound.nativeElement.pause();
                        this.clapSound.nativeElement.currentTime = 0;
                        feedbackPopup.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
                        if (!this.popupclosedinRightWrongAns) {
                            this.rightFeedback.nativeElement.play();
                        } else {
                            this.Sharedservice.setShowAnsEnabled(true);

                        }
                    }, 2000);
                    this.rightFeedback.nativeElement.onended = () => {
                        this.rightTimer = setTimeout(() => {
                            this.closePopup('answerPopup');
                        }, 10000)
                    }
                }
                //disable option and question on right attempt
                this.maincontent.nativeElement.className = "disableDiv";
                this.ansBlock.nativeElement.className = "optionsBlock disableDiv disable-click";
            })
        } else if (option.id != this.feedback.correct_ans_index) {
            clearTimeout(this.wrongTimer);
            this.answerPopupType = 'wrong';
            this.ifWrongAns = true;
            this.idArray = [];
            for (let i of this.myoption) {
                this.idArray.push(i.id);
            }
            let feedbackPopup: HTMLElement = this.feedbackPopup.nativeElement as HTMLElement
            feedbackPopup.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
            option.image = option.image_original;
            this.answerImageBase = option.image.url;
            this.answerImage = option.imgsrc.url;
            this.answerImagelocation = option.image.location;
            this.showAnswerOptionBg = option.image_original.url;
            this.popupIcon = this.popupAssets.wrong_icon.url;
            this.popupIconLocation = this.popupAssets.wrong_icon.location;
            //this.appModel.stopAllTimer();
            //play wrong feed back audio
            this.wrongCounter += 1;
            setTimeout(() => {
                if (this.wrongFeedback && this.wrongFeedback.nativeElement) {
                    this.wrongFeedback.nativeElement.play();
                }

                this.wrongFeedback.nativeElement.onended = () => {
                    this.wrongTimer = setTimeout(() => {
                        this.closePopup('answerPopup');
                    }, 10000);
                }

            });
            this.doRandomize(this.myoption);
        }
    }

    /****Randomize option on wrong selection*****/
    doRandomize(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            var img_hover1 = array[currentIndex].image_hover;
            var text1 = array[currentIndex].image;
            var text1copy = array[currentIndex].image_original;
            var optionBg1 = array[currentIndex].option_bg;

            var img_hover2 = array[randomIndex].image_hover;
            var text2 = array[randomIndex].image;
            var text2copy = array[randomIndex].image_original;
            var optionBg2 = array[randomIndex].option_bg;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;

            array[currentIndex].image_hover = img_hover1;
            array[currentIndex].image = text1;
            array[currentIndex].image_original = text1copy;
            array[currentIndex].option_bg = optionBg1;

            array[randomIndex].image_hover = img_hover2;
            array[randomIndex].image = text2;
            array[randomIndex].image_original = text2copy;
            array[randomIndex].option_bg = optionBg2;

        }
        var flag = this.arraysIdentical(array, this.idArray);
        if (flag) {
            this.doRandomize(array);
        }
        else {
            var Answerindex = array.find(x => x.id === this.correct_ans_index);
            this.showAnswerOptionBg = Answerindex.image.url;
        }

    }

    /*****Check if array is identical******/
    arraysIdentical(a, b) {
        var i = a.length;
        while (i--) {
            if (a[i].id == b[i]) {
                return true;
            }
        }
        return false;
    }

    /*****Close popup on click*****/
    closePopup(Type) {
        clearTimeout(this.wrongTimer);
        clearTimeout(this.rightTimer);
        clearTimeout(this.clapTimer);
        clearTimeout(this.showAnswerTimer);

        this.showAnswerRef.nativeElement.classList = "modal";
        this.feedbackPopup.nativeElement.classList = "modal";
        this.wrongFeedback.nativeElement.pause();
        this.wrongFeedback.nativeElement.currentTime = 0;

        this.rightFeedback.nativeElement.pause();
        this.rightFeedback.nativeElement.currentTime = 0;

        this.videoonshowAnspopUp.nativeElement.pause();
		this.videoonshowAnspopUp.nativeElement.currentTime = 0;
        if (Type === "answerPopup") {
            this.popupclosedinRightWrongAns = true;
            for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
                document.getElementsByClassName("ansBtn")[i].classList.remove("disableDiv");
            }
            if (this.ifRightAns) {
                this.Sharedservice.setShowAnsEnabled(true);
                this.overlay.nativeElement.classList.value = "fadeContainer";
                this.blinkOnLastQues();
                if (!this.lastQuestionCheck) {
                    //  this.popupTime = setTimeout(()=>{
                    //   this.appModel.nextSection();
                    //  this.Sharedservice.setShowAnsEnabled(false); 
                    // }, 10000)
                } else if (this.lastQuestionCheck) {
                    this.Sharedservice.setTimeOnLastQues(true);
                }
            } else if (this.ifWrongAns) {
                if (this.wrongCounter >= 3 && this.ifWrongAns) {
                    this.Sharedservice.setShowAnsEnabled(true);
                } else {
                    this.Sharedservice.setShowAnsEnabled(false);
                }
            }
        }
        else if (Type === 'showAnswer') {
            if (this.ifRightAns) {
                this.blinkOnLastQues();
            }
        }


    }

    /*****Check speaker voice*****/
    checkSpeakerVoice(speaker) {
        if (!this.audioEl.nativeElement.paused) {
        } else {
            speaker.imgsrc = speaker.imgorigional;
            this.sprite.nativeElement.style = "display:none";
            (document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "";
            clearInterval(this.speakerTimer);
        }

    }

    /*****Play speaker audio*****/
    playSpeaker(el: HTMLAudioElement, speaker) {
        this.stopAllSounds();
        this.enableAllOptions();
        if (!this.instruction.nativeElement.paused) {
            console.log("instruction voice still playing");
        } else {
            this.myAudiospeaker.nativeElement.currentTime = 0.0;
            if (el.id == "S") {
                this.myAudiospeaker.nativeElement.pause();
                if (el.paused) {
                    el.currentTime = 0;
                    el.play();
                } else {
                    el.currentTime = 0;
                    el.play();
                }
                this.speakerTimer = setInterval(() => {
                    speaker.imgsrc = speaker.imgactive;
                    this.sprite.nativeElement.style = "display:flex";
                    (document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "none";
                    this.checkSpeakerVoice(speaker);
                }, 10)
            }
            else {
                if (this.myAudiospeaker && this.myAudiospeaker.nativeElement) {
                    this.myAudiospeaker.nativeElement.pause();
                }
                el.pause();
                el.currentTime = 0;
                el.play();
                if (this.maincontent) {
                    this.maincontent.nativeElement.className = "disableDiv";
                }
                el.onended = () => {

                    if (this.maincontent) {
                        this.maincontent.nativeElement.className = "";
                        this.sprite.nativeElement.style = "display:none";
                        (document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "";
                    }
                }

            }
        }


    }

    /****function to check loaded image*****/
    checkImgLoaded() {
        if (!this.loadFlag) {
            this.noOfImgsLoaded++;
            console.log(this.noOfImgsLoaded);
            if (this.noOfImgsLoaded >= this.noOfImgs) {
                this.appModel.setLoader(false);
                this.Sharedservice.setShowAnsEnabled(false);
                this.loadFlag = true;
                clearTimeout(this.loaderTimer);
                this.checkforQVO();
            }
        }
    }

    close() {
        this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
    }

    /******Check for Question VO  *****/
    checkforQVO() {
        if (this.questionObj && this.questionObj.quesInstruction && this.questionObj.quesInstruction.url && this.questionObj.quesInstruction.autoPlay) {
            this.instruction.nativeElement.src = this.questionObj.quesInstruction.location == "content"
                ? this.containgFolderPath + "/" + this.questionObj.quesInstruction.url : this.assetsPath + "/" + this.questionObj.quesInstruction.url
            this.appModel.handlePostVOActivity(true);
            // this.maincontent.nativeElement.className = "disableDiv";   
            clearTimeout(this.rightTimer);
            this.instruction.nativeElement.play();
            this.appModel.setLoader(false);
            this.instruction.nativeElement.onended = () => {
                this.appModel.handlePostVOActivity(false);
                this.maincontent.nativeElement.className = "";
            }
        } else {
            this.appModel.handlePostVOActivity(false);
        }
    }


    /***** Blink on last question ******/
    blinkOnLastQues() {
        this.Sharedservice.setLastQuesAageyBadheStatus(false);
        if (this.lastQuestionCheck) {
            this.LastquestimeStart = true;
        }
        if (this.appModel.isLastSectionInCollection) {
            this.appModel.blinkForLastQues();
            this.appModel.stopAllTimer();
            if (!this.appModel.eventDone) {
                if (this.isLastQuesAct) {
                    this.appModel.eventFired();
                    this.appModel.event = { 'action': 'segmentEnds' };
                }
                if (this.isLastQues) {
                    this.appModel.event = { 'action': 'exit' };

                }
            }
        } else {
            this.appModel.moveNextQues("");
        }
    }


    /******* Volume control for all VO  *******/
    templatevolume(vol, obj) {
        if (obj.instruction && obj.instruction.nativeElement) {
            obj.instruction.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.myAudiospeaker && obj.myAudiospeaker.nativeElement) {
            obj.myAudiospeaker.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.wrongFeedback && obj.wrongFeedback.nativeElement) {
            obj.wrongFeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.rightFeedback && obj.rightFeedback.nativeElement) {
            obj.rightFeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.clapSound && obj.clapSound.nativeElement) {
            obj.clapSound.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.showAnswerfeedback && obj.showAnswerfeedback.nativeElement) {
            obj.showAnswerfeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.audio) {
            obj.audio.volume = obj.appModel.isMute ? 0 : vol;
        }
    }

    /* HOVER CODE */

    /******On Hover close popup******/
    hoverClosePopup() {
        this.popupAssets.close_button = this.popupAssets.close_button_hover;
    }

    /******Hover out close popup******/
    houtClosePopup() {
        this.popupAssets.close_button = this.popupAssets.close_button_origional;
    }

    /*********SPEAKER HOVER *********/
    onHoverSpeaker(speaker) {
        speaker.imgsrc = speaker.imghover;
        // if (!this.instruction.nativeElement.paused) {
        //     this.disableSpeaker.nativeElement.className = "speakerBlock";
        // }
        // else {
        //     this.disableSpeaker.nativeElement.className = "speakerBlock pointer";
        // }
    }

    /******Hover out speaker ********/
    onHoverOutSpeaker(speaker) {
        speaker.imgsrc = speaker.imgorigional;
    }

    /******On Hover option ********/
    onHoverOptions(option, index) {
        let speakerEle = document.getElementsByClassName("speakerBtn")[0].children[1] as HTMLAudioElement;
        if (!this.myAudiospeaker.nativeElement.paused) {
            this.myAudiospeaker.nativeElement.pause();
            this.myAudiospeaker.nativeElement.currentTime = 0;
            this.speaker.imgsrc = this.speaker.imgorigional;
        }
        option.image = option.image_hover;
        //  this.playOptionHover(option,index);
    }
    // on-mouseenter='playOptionHover(opts,idx)'
    /******Hover out option ********/
    onHoveroutOptions(option, index) {
        option.image = option.image_original;
    }

    /****** Option Hover VO  *******/
    playOptionHover(option, index) {
        if (option && option.audio && option.audio.url) {
            option.image = option.image_hover;
            this.playSound(option.audio, index);
        }
    }

    /***** Play sound on option roll over *******/
    playSound(soundAssets, idx) {
        if (this.audio && this.audio.paused) {
            if (soundAssets.location == 'content') {
                this.audio.src = this.containgFolderPath + '/' + soundAssets.url;
            } else {
                this.audio.src = soundAssets.url;
            }
            this.audio.load();
            this.audio.play();
            this.disableOtherOptions(idx, this.optionRef);
        }
    }

    clearData(): void {
        // clear message
        this.Sharedservice.clearData();
    }

              /***** Disable speaker and options other than hovered until audio end *******/
  disableOtherOptions(idx, selectedBlock) {
    for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
        if (i != idx) {
            this.optionRef.nativeElement.children[i].classList.add("disableDiv");
        }
    }
    this.audio.onended = () => {
      this.enableAllOptions();
    }
  }

  /***** Enable all options and speaker on audio end *******/
  enableAllOptions() {
    for (let j = 0; j < this.optionRef.nativeElement.children.length; j++) {
      if (this.optionRef.nativeElement.children[j].classList.contains("disableDiv")) {
        this.optionRef.nativeElement.children[j].classList.remove("disableDiv");
      }
    }
  }

}