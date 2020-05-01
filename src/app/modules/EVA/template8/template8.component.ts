import { Component, OnInit, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { PlayerConstants } from '../../../common/playerconstants';
import { ActivatedRoute } from '@angular/router';
import { SharedserviceService } from '../../../services/sharedservice.service';
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-template8',
    templateUrl: './template8.component.html',
    styleUrls: ['./template8.component.css']
})
export class Template8Component implements OnInit {
    blink: boolean = false;
    commonAssets: any = "";
    rightPopup: any;
    wrongPopup: any;
    wrongTimer: any;
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

    @ViewChild('instruction') instruction: any;
    @ViewChild('audioEl') audioEl: any;
    @ViewChild('sprite') sprite: any;
    @ViewChild('speakerNormal') speakerNormal: any;
    @ViewChild('ansPopup') ansPopup: any;
    @ViewChild('showAnswerfeedback') showAnswerfeedback: any;
    @ViewChild('showAnswerRef') showAnswerRef: any;
    @ViewChild('wrongFeedback') wrongFeedback: any;
    @ViewChild('rightFeedback') rightFeedback: any;
    @ViewChild('disableSpeaker') disableSpeaker: any;
    @ViewChild('myAudiospeaker') myAudiospeaker: any;
    @ViewChild('maincontent') maincontent: any;
    @ViewChild('footerNavBlock') footerNavBlock: any;
    @ViewChild('ansBlock') ansBlock: any;
    @ViewChild('mainContainer') mainContainer: any;
    @ViewChild('instructionBar') instructionBar: any;
    @ViewChild('clapSound') clapSound: any;
    @ViewChild('overlay') overlay: any;

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
                        this.close();
                        break;
                    default:
                        console.log('Component: constructor - default');
                        break;
                }
            }
        );
        this.assetsPath = this.appModel.assetsfolderpath;
        // this.appModel.navShow = 2;
    }

    ngOnInit() {
        //debugger;
        // this.Sharedservice.setLastQuesAageyBadheStatus(false); 
        this.Sharedservice.setShowAnsEnabled(false);
        this.sprite.nativeElement.style = "display:none";
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


        this.showAnswerSubscription = this.appModel.getConfirmationPopup().subscribe((val) => {
            this.appModel.stopAllTimer();
            let speakerEle = document.getElementsByClassName("speakerBtn")[0].children[2] as HTMLAudioElement;
            if (!speakerEle.paused) {
                speakerEle.pause();
                speakerEle.currentTime = 0;
                this.sprite.nativeElement.style = "display:none";
                (document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "";
                // this.speakerPlayed=false;
                this.speaker.imgsrc = this.speaker.imgorigional;
            }
            if (this.showAnswerRef && this.showAnswerRef.nativeElement) {
                // this.videoonshowAnspopUp.nativeElement.src=this.showAnswerPopup.videoAnimation.location=="content" ? this.contentgFolderPath +"/"+ this.showAnswerPopup.videoAnimation.url : this.assetsfolderlocation +"/"+ this.showAnswerPopup.videoAnimation.url;
                this.showAnswerRef.nativeElement.classList = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
                if (this.showAnswerfeedback && this.showAnswerfeedback.nativeElement) {
                    this.showAnswerfeedback.nativeElement.play();
                    this.showAnswerfeedback.nativeElement.onended = () => {
                        // this.closePopup("showAnswer");
                        setTimeout(() => {
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
                if (this.ansPopup && this.ansPopup.nativeElement) {
                    // $("#instructionBar").addClass("disableDiv");
                    this.ansPopup.nativeElement.classList = "displayPopup modal";
                    // this.setFeedbackAudio(mode);
                }

            } else if (mode == "auto") {
                // console.log("mode manual2 show answer working", mode)
                // this.showAnswers();
            }
        })

        this.appModel.postWrongAttempt.subscribe(() => {
            //this.appModel.startPreviousTimer();
            this.appModel.notifyUserAction();
        })
    }

    setTemplateType(): void {
        // send message to subscribers via observable subject
        this.ActivatedRoute.data.subscribe(data => {
            this.Sharedservice.sendData(data);
        })
    }
    ngOnDestroy() {
        this.showAnswerSubscription.unsubscribe();
    }

    ngAfterViewChecked() {
        // console.log(this.LastquestimeStart, 'timer jyoti');
        this.templatevolume(this.appModel.volumeValue, this);


    }

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


    checkAnswer(option) {
        this.popupclosedinRightWrongAns = false;
        // logic to check what user has done is correct
        if (option.id == this.feedback.correct_ans_index) {
            this.answerPopupType = 'right';
            this.blinkOnLastQues();
            this.correctOpt = option;
            this.attemptType = "manual";
            this.appModel.stopAllTimer();
            this.answerImageBase = option.image_original.url;
            this.answerImage = option.imgsrc.url;
            this.answerImagelocation = option.image_original.location;
            this.popupIcon = this.popupAssets.right_icon.url;
            this.popupIconLocation = this.popupAssets.right_icon.location;
            this.ifRightAns = true;
            let ansPopup: HTMLElement = this.ansPopup.nativeElement as HTMLElement

            setTimeout(() => {
                if (this.rightFeedback && this.rightFeedback.nativeElement) {
                    option.image = option.image_hover;
                    this.clapSound.nativeElement.play();

                    setTimeout(() => {
                        this.clapSound.nativeElement.pause();
                        this.clapSound.nativeElement.currentTime = 0;
                        ansPopup.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
                        if (!this.popupclosedinRightWrongAns) {
                            this.rightFeedback.nativeElement.play();
                        } else {
                            this.Sharedservice.setShowAnsEnabled(true);
                        }
                    }, 2000);


                    this.rightFeedback.nativeElement.onended = () => {
                        setTimeout(() => {
                            this.closePopup('answerPopup');
                        }, 10000)
                        //new code
                        setTimeout(() => {
                            this.attemptType = "manual";
                            //    this.blinkOnLastQues()
                        }, 200)
                    }
                }


                //disable option and question on right attempt
                this.maincontent.nativeElement.className = "disableDiv";
                this.ansBlock.nativeElement.className = "optionsBlock disableDiv disable-click";
            })

        } else if (option.id != this.feedback.correct_ans_index) {
            this.answerPopupType = 'wrong';
            this.ifWrongAns = true;
            this.idArray = [];
            for (let i of this.myoption) {
                this.idArray.push(i.id);
            }
            let ansPopup: HTMLElement = this.ansPopup.nativeElement as HTMLElement
            ansPopup.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
            option.image = option.image_original;
            this.answerImageBase = option.image.url;
            this.answerImage = option.imgsrc.url;
            this.answerImagelocation = option.image.location;
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


    removeEvents() {
        // remove event handlers for all clickable items in the dom
        this.blink = false;
        clearTimeout(this.timernextseg);
    }

    closePopup(Type) {
        this.showAnswerRef.nativeElement.classList = "modal";
        this.ansPopup.nativeElement.classList = "modal";
        this.wrongFeedback.nativeElement.pause();
        this.wrongFeedback.nativeElement.currentTime = 0;

        this.rightFeedback.nativeElement.pause();
        this.rightFeedback.nativeElement.currentTime = 0;

        this.showAnswerfeedback.nativeElement.pause();
        this.showAnswerfeedback.nativeElement.currentTime = 0;

        if (Type === "answerPopup") {
            this.popupclosedinRightWrongAns = true;
            if (this.ifRightAns) {
                this.Sharedservice.setShowAnsEnabled(true);
                this.overlay.nativeElement.classList.value = "fadeContainer";
                this.blinkOnLastQues();
                if (!this.lastQuestionCheck) {
                    this.popupTime = setTimeout(() => {
                        //   this.appModel.nextSection();
                        //  this.Sharedservice.setShowAnsEnabled(false); 
                    }, 10000)
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
        if (Type === 'showAnswer') {
            this.blinkOnLastQues();
        } else {

        }


    }

    checkSpeakerVoice(speaker) {
        if (!this.audioEl.nativeElement.paused) {
            // this.speakerNormal.nativeElement.style.display ="none";
            // this.sprite.nativeElement.style.display ="block";
        } else {
            speaker.imgsrc = speaker.imgorigional;
            this.sprite.nativeElement.style = "display:none";
            clearInterval(this.speakerTimer);
        }

    }

    stopAllSounds(e) {
        if (!this.instruction.nativeElement.paused) {
            e.stopPropagation();
        }
        else { }
    }


    getBasePath() {
        if (this.appModel && this.appModel.content) {
            return this.appModel.content.id + '';
        }
    }

    playSpeaker(el: HTMLAudioElement, speaker) {
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

        this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
    }

    checkforQVO() {
        if (this.questionObj && this.questionObj.quesInstruction && this.questionObj.quesInstruction.url && this.questionObj.quesInstruction.autoPlay) {
            this.instruction.nativeElement.src = this.questionObj.quesInstruction.location == "content"
                ? this.containgFolderPath + "/" + this.questionObj.quesInstruction.url : this.assetsPath + "/" + this.questionObj.quesInstruction.url
            this.appModel.handlePostVOActivity(true);
            this.maincontent.nativeElement.className = "disableDiv";
            // this.Sharedservice.setVoplayingStatus(true);  
            this.instruction.nativeElement.play();
            this.appModel.setLoader(false);
            this.instruction.nativeElement.onended = () => {
                // this.Sharedservice.setVoplayingStatus(false);
                this.appModel.handlePostVOActivity(false);
                this.maincontent.nativeElement.className = "";
            }
        } else {
            this.appModel.handlePostVOActivity(false);
        }
    }



    blinkOnLastQues() {
        // this.Sharedservice.setLastQuesAageyBadheStatus(false); 
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
    }

    /* HOVER CODE */

    hoverClosePopup() {
        this.popupAssets.close_button = this.popupAssets.close_button_hover;
    }
    houtClosePopup() {
        this.popupAssets.close_button = this.popupAssets.close_button_origional;
    }

    /**SPEAKER HOVER */
    onHoverSpeaker(speaker) {
        speaker.imgsrc = speaker.imghover;
        if (!this.instruction.nativeElement.paused) {
            this.disableSpeaker.nativeElement.className = "speakerBlock";
        }
        else {
            this.disableSpeaker.nativeElement.className = "speakerBlock pointer";
        }
    }


    onHoverOutSpeaker(speaker) {
        speaker.imgsrc = speaker.imgorigional;
        //  if(!this.instruction.nativeElement.paused){
        //    this.disableSpeaker.nativeElement.className="speakerBtn";
        //    console.log("instruction voice still playing");
        //   }
        //   else{
        //    this.disableSpeaker.nativeElement.className="speakerBtn pointer";
        //   }
    }

    onHoverOptions(option, index) {
        let speakerEle = document.getElementsByClassName("speakerBtn")[0].children[1] as HTMLAudioElement;
        if (!this.myAudiospeaker.nativeElement.paused) {
            this.myAudiospeaker.nativeElement.pause();
            this.myAudiospeaker.nativeElement.currentTime = 0;
            this.speaker.imgsrc = this.speaker.imgorigional;
        }
        option.image = option.image_hover;
    }


    onHoveroutOptions(option, index) {
        option.image = option.image_original;
    }

    // previous(){
    //     if(this.commonAssets && this.commonAssets.peechey_jayein){
    //     this.commonAssets.peechey_jayein = this.commonAssets.peechey_jayein_original;
    //     }
    //     if(this.commonAssets && this.commonAssets.aagey_badhein){
    //     this.commonAssets.aagey_badhein = this.commonAssets.aagey_badhein_original;
    //     }
    //     this.blink=false;

    //     this.currentIdx--;
    //     this.appModel.previousSection();
    //     this.appModel.setLoader(true);
    // }

    // next() {
    //     if (!this.hasEventFired) {
    //         if (this.isLastQuesAct) {
    //             this.hasEventFired = true;
    //             this.appModel.event = { 'action': 'segmentEnds' };
    //         }
    //         if (this.isLastQues) {
    //             this.appModel.event = { 'action': 'end' };
    //         }
    //     }
    //     if (this.commonAssets && this.commonAssets.peechey_jayein) {
    //         this.commonAssets.peechey_jayein = this.commonAssets.peechey_jayein_original;
    //     }
    //     if (this.commonAssets && this.commonAssets.aagey_badhein) {
    //         this.commonAssets.aagey_badhein = this.commonAssets.aagey_badhein_original;
    //     }

    //     if (!this.isLastQues) {
    //         setTimeout(()=>{
    //           if(this.footerNavBlock && this.footerNavBlock.nativeElement){
    //             this.footerNavBlock.nativeElement.className="d-flex flex-row align-items-center justify-content-around disableDiv";
    //           }
    //         },0)
    //         this.currentIdx++;

    //         this.appModel.nextSection();
    //         //this.setData();
    //         this.appModel.setLoader(true);
    //         this.removeEvents();
    //     }
    // }


}