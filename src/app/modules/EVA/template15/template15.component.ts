
import { Component, OnInit, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { Base } from '../../../controller/base';
import { PlayerConstants } from '../../../common/playerconstants';
import { ActivatedRoute } from '@angular/router';
import { SharedserviceService } from '../../../services/sharedservice.service';
import { Subscription } from 'rxjs';

import 'jquery';
import { BrowserGetTestability } from '@angular/platform-browser/src/browser/testability';
declare var $: any;

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
    wrongTimer:any;
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
    closed:boolean = false;
    correct_ans_index: any;
    speakerTimer: any;
    showAnswerPopup:any;
    showAnswerVO:any;
    ifRightAns: boolean = false;
    popupAssets:any;
    showAnswerSubscription:any;
    answerImageBase:any;
    answerImage:any;
    answerImagelocation:any;
    popupIcon :any;
    popupIconLocation :any;
    isPopupClosed:boolean = false;
    answerPopupType:any;
    lastQuestionCheck:any;

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
     this.showAnswerSubscription =   this.appModel.getConfirmationPopup().subscribe((val) => {        
            if (val == "uttarDikhayein") {
                if (this.showAnswerRef && this.showAnswerRef.nativeElement) {
                    this.showAnswerRef.nativeElement.classList = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
            
                    if (this.showAnswerfeedback && this.showAnswerfeedback.nativeElement) {
                        console.log('show answer play jyoti');
                        this.showAnswerfeedback.nativeElement.play();
                    }
                    this.popupType = "showanswer";
                    this.blinkOnLastQues();
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
					$("#instructionBar").addClass("disableDiv");
					this.ansPopup.nativeElement.classList = "displayPopup modal";
					// this.setFeedbackAudio(mode);
				}

				console.log("mode manuall", mode)

			} else if (mode == "auto") {
				// console.log("mode manual2 show answer working", mode)
				// this.showAnswers();
			}
		})

        this.appModel.postWrongAttempt.subscribe(() => {
            //  this.resetActivity();
            //this.appModel.startPreviousTimer();
            this.appModel.notifyUserAction();
         //   this.blinkOnLastQues();

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
        this.templatevolume(this.appModel.volumeValue, this);
    }

    setData() {
        this.appModel.notifyUserAction();
        let fetchedData: any = this.appModel.content.contentData.data;
        // this.optionObj = JSON.parse(JSON.stringify(fetchedData.options));
        this.instructiontext = fetchedData.instructiontext;
        this.myoption = fetchedData.options;
        this.commonAssets = fetchedData.commonassets;
        this.speaker = fetchedData.speaker;
        this.feedback = fetchedData.feedback;
        this.questionObj = fetchedData.quesObj;
        // this.question = fetchedData.ques;
        this.noOfImgs = fetchedData.imgCount;
        this.popupAssets = fetchedData.feedback.popupassets;
        // this.confirmPopupAssets = fetchedData.feedback.confirm_popup;
		this.correct_ans_index = this.feedback.correct_ans_index;
		this.rightPopup = this.feedback.right_ans_sound;
        this.wrongPopup = this.feedback.wrong_ans_sound;
        this.showAnswerVO = this.feedback.show_ans_sound;
        this.showAnswerPopup = this.feedback.show_ans_popup;
        this.lastQuestionCheck = this.commonAssets.ques_control.isLastQues;
        this.commonAssets.ques_control.blinkingStatus=false;
        this.isLastQues = this.appModel.isLastSection;
        this.isLastQuesAct = this.appModel.isLastSectionInCollection;
        // this.rightAnsSoundUrl = this.myoption[this.feedback.correct_ans_index]
        this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);

        // this.appModel.setAttemptQues(0);
        // if (this.questionObj.quesVideo && this.questionObj.quesVideo.autoPlay && !this.appModel.isVideoPlayed) {
        //     this.isPlayVideo = true;	
        //   } else {     
        //     this.isPlayVideo = false;
        //      this.tempTimer = setTimeout(() => {
        //         this.noOfImgsLoaded = 0;
        //         this.appModel.setLoader(true);
        //         this.loaderTimer = setTimeout(() => {
        //             this.appModel.setLoader(false);
        //         }, 5000)
        //     }, this.quesInfo.formatTimeout)

        //   }

        setTimeout(() => {
            if (this.footerNavBlock && this.footerNavBlock.nativeElement) {
                this.footerNavBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around";
            }
        }, 200)
    
    }

    
    checkAnswer(option, event, idx) {   
        // logic to check what user has done is correct
        if (option.id == this.feedback.correct_ans_index) {
            this.answerPopupType = 'right';
            this.blinkOnLastQues();
            this.correctOpt = option;
            // this.wrongImgOption = option
			// this.feedbackPopup = this.rightPopup;
			this.attemptType = "manual";
			this.appModel.stopAllTimer();          
            this.answerImageBase = option.image_original.url;
            this.answerImage = option.imgsrc.url;
            this.answerImagelocation = option.image_original.location;
            this.popupIcon = this.popupAssets.right_icon.url;
            this.popupIconLocation = this.popupAssets.right_icon.location;

			this.ifRightAns = true;
			let ansPopup: HTMLElement = this.ansPopup.nativeElement as HTMLElement           
              ansPopup.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
              option.image = option.image_original;
            setTimeout(() => {
                if (this.rightFeedback && this.rightFeedback.nativeElement) {
                    this.clapSound.nativeElement.play();
                    setTimeout(() => {
                       this.clapSound.nativeElement.pause();     
                       this.clapSound.nativeElement.currentTime = 0;
                       if(!this.isPopupClosed){
                        this.rightFeedback.nativeElement.play();
                       }
                    }, 2000)
                }          
                //disable option and question on right attempt
                this.maincontent.nativeElement.className = "disableDiv";
                this.ansBlock.nativeElement.className = "optionsBlock disableDiv disable-click";
                
                        $("#optionsBlock ").addClass("disable-click disable-click");
                        $("#instructionBar").addClass("disableDiv disable-click");
                        $(".quesOptions .options").css("opacity", "0.3");
                         this.rightFeedback.nativeElement.onended = () => {
                            setTimeout(() => {
                                this.closePopup('answerPopup',this.answerPopupType);
                                console.log('popup closed');
                            }, 10000)
                    //new code
                    setTimeout(() => {
                        this.attemptType = "manual";
                        //disable option and question on right attempt
                        console.log("disable option and question on right attempt");
                        
                        this.blinkOnLastQues()
                    }, 200)
                }
            })
 
        } else {
            this.answerPopupType = 'wrong';
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
                    setTimeout(() => {
                        this.closePopup('answerPopup',this.answerPopupType);
                        console.log('popup closed');
                    }, 10000)


                    if(!this.closed){
                        this.wrongTimer = setTimeout(() => {
                            this.ansPopup.nativeElement.classList = "modal";
                            this.appModel.notifyUserAction();
                            // this.appModel.wrongAttemptAnimation();	
                        }, 2000);
                    }
                }
            
         },20);
            this.doRandomize(this.myoption);
		}
            
//}
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
        var flag=this.arraysIdentical(array,this.idArray);
        console.log(flag);
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


    // isPaused() {
    //     return this.audio.paused;
    // }

    removeEvents() {
        // remove event handlers for all clickable items in the dom
        this.blink = false;
        clearTimeout(this.timernextseg);
    }

   
    closePopup(Type,answerType){
        if(answerType === 'right'){
            this.Sharedservice.setShowAnsEnabled(true);
            this.maincontent.nativeElement.className = "fadeContainer";
        }

        if(answerType === 'wrong'){
            if(this.wrongCounter === 3){
                this.Sharedservice.setShowAnsEnabled(true); 
            }else{
                this.Sharedservice.setShowAnsEnabled(false);
            }
        }   
        this.isPopupClosed = true;
        this.showAnswerRef.nativeElement.classList = "modal";
        this.ansPopup.nativeElement.classList = "modal";
        
        this.clapSound.nativeElement.pause();
        this.clapSound.nativeElement.currentTime = 0;

        this.wrongFeedback.nativeElement.pause();    
        this.wrongFeedback.nativeElement.currentTime = 0;

        this.rightFeedback.nativeElement.pause();     
        this.rightFeedback.nativeElement.currentTime = 0;

        this.showAnswerfeedback.nativeElement.pause();      
        this.showAnswerfeedback.nativeElement.currentTime = 0;
       

        if(Type === 'showAnswer'){
        
            setTimeout(() => {
                this.showAnswerfeedback.nativeElement.pause();      
                this.showAnswerfeedback.nativeElement.currentTime = 0;
                if(!this.showAnswerfeedback.nativeElement.pause()){
                    this.appModel.nextSection(); 
                }else{
                    console.log('show answer voice still playing jyoti');
                }
                
			}, 1000);
        }else{
           
        }
     
    }

   
    
    checkNextActivities() {
        if (this.instruction.nativeElement.pause()) {
            this.removeEvents();

            var popup = document.getElementById("modalTemp17")
             popup.className = "d-flex align-items-center justify-content-center hideit";
            //disable click on options and speaker
            var optionsBlock = document.getElementById("optionsBlock")
            optionsBlock.className = optionsBlock.className.concat(" disable");
            if (!this.appModel.autoPlay && !this.isLastQues && this.isLastQuesAct) {
                this.blink = true;
            }

            if ((this.appModel.autoPlay && !this.isLastQues) || !((this.isLastQuesAct)) || ((this.isLastQuesAct && this.appModel.autoPlay && !this.isLastQues))) {
                this.next();
            } else {
                //disable all the option
                //this.optionBlock.nativeElement.className= "disableDiv";
            }
            if (!this.hasEventFired) {
                if (this.isLastQuesAct) {
                    this.hasEventFired = true;
                    this.appModel.event = { 'action': 'segmentEnds' };
                }
                if (this.isLastQues) {
                    this.appModel.event = { 'action': 'end' };
                }
            }

        }
        else {
            console.log("feedback_audio still playing");
        }
    }

  

    checkSpeakerVoice(speaker) {
        if(!this.audioEl.nativeElement.paused){
            // this.speakerNormal.nativeElement.style.display ="none";
            // this.sprite.nativeElement.style.display ="block";
        }else{
            // this.speakerNormal.nativeElement.style.display ="block";
            this.sprite.nativeElement.style.display ="none";
            speaker.imgsrc = speaker.imgorigional;
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
                }else{
                    el.currentTime = 0;
                    el.play();
                }
                this.speakerTimer = setInterval(() => {
                    speaker.imgsrc = speaker.imgactive;
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
                if(this.maincontent){
                    this.maincontent.nativeElement.className = "disableDiv";
                }
                el.onended = () => {
                    if (this.maincontent) {
                        this.maincontent.nativeElement.className = "";
                    }
                }

            }
        }
    }

	// playSound(sound) {
	// 	// plays a sound
	// 	if (this.myAudiospeaker && this.myAudiospeaker.nativeElement) {
	// 		this.myAudiospeaker.nativeElement.pause();
	// 	}
	// 	//stop instruction sound
	// 	this.audio.src = sound;
	// 	this.audio.load();
	// 	this.audio.play();
    // }
  
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
            ? this.containgFolderPath + "/" + this.questionObj.quesInstruction.url: this.assetsPath + "/" + this.questionObj.quesInstruction.url    
            this.appModel.handlePostVOActivity(true);
            this.maincontent.nativeElement.className = "disableDiv";   
            this.Sharedservice.setVoplayingStatus(true);  
            this.instruction.nativeElement.play();
			this.appModel.setLoader(false);
			this.instruction.nativeElement.onended = () => {
                this.Sharedservice.setVoplayingStatus(false);
                this.appModel.handlePostVOActivity(false);              
                this.maincontent.nativeElement.className = "";
			}
		} else {
			this.appModel.handlePostVOActivity(false);
		}
	}




    blinkOnLastQues() {

        if(this.lastQuestionCheck){
            setTimeout(()=>{                
                this.next();
              },10000);
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
        //   this.appModel.moveNextQues();
        }
      }
 

    templatevolume(vol, obj) {
        if(obj.instruction && obj.instruction.nativeElement){
            obj.instruction.nativeElement.volume = obj.appModel.isMute?0:vol;
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

        // if (obj.feedbackPopupAudio && obj.feedbackPopupAudio.nativeElement) {
        //     obj.feedbackPopupAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        // }
        // if (obj.audio) {
        //     obj.audio.volume = obj.appModel.isMute ? 0 : vol;
        // }
        // if (obj.mainVideo && obj.mainVideo.nativeElement) {
        //     this.mainVideo.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        // }
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
            this.disableSpeaker.nativeElement.className = "speakerBtn";
        }
        else {
            this.disableSpeaker.nativeElement.className = "speakerBtn pointer";
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
        let speakerEle= document.getElementsByClassName("speakerBtn")[0].children[1] as HTMLAudioElement ;
        if(!this.myAudiospeaker.nativeElement.paused) {
            this.myAudiospeaker.nativeElement.pause();
            this.myAudiospeaker.nativeElement.currentTime=0;
            this.speaker.imgsrc=this.speaker.imgorigional;
        }
            option.image = option.image_hover;
    }

    
    onHoveroutOptions(option, index) {     
        option.image = option.image_original;
    }

    previous(){
        if(this.commonAssets && this.commonAssets.peechey_jayein){
        this.commonAssets.peechey_jayein = this.commonAssets.peechey_jayein_original;
        }
        if(this.commonAssets && this.commonAssets.aagey_badhein){
        this.commonAssets.aagey_badhein = this.commonAssets.aagey_badhein_original;
        }
        this.blink=false;
        this.reset();     
        this.currentIdx--;
        this.appModel.previousSection();
        this.appModel.setLoader(true);
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
            setTimeout(()=>{
              if(this.footerNavBlock && this.footerNavBlock.nativeElement){
                this.footerNavBlock.nativeElement.className="d-flex flex-row align-items-center justify-content-around disableDiv";
              }
            },0)
            this.currentIdx++;

            this.appModel.nextSection();
            //this.setData();
            this.appModel.setLoader(true);
            this.removeEvents();
            this.reset();
        }
    }

    /**OPTION HOVER */
  
    //*********UNUSED CODE*************/

    	// playSpeaker() {
    //     //(document.getElementById("optionsBlock") as HTMLElement).style.pointerEvents="none";
    //     this.speakerPlayed=true;
    //     this.speaker.imgsrc=this.speaker.imgactive;
    //     let speakerEle= document.getElementsByClassName("speakerBtn")[0].children[1] as HTMLAudioElement ;
    //     speakerEle.play();
    //     speakerEle.onended=() => {
    //         this.speaker.imgsrc=this.speaker.imgorigional;
    //         //(document.getElementById("optionsBlock") as HTMLElement).style.pointerEvents="";
    //         this.speakerPlayed=false;
    //     }
    // }
    // startBlinkOption() {
    //     this.blinkInterval = setInterval(() => {
    //         if (this.blinkFlag) {
    //             this.blinkFlag = false;
    //             if (this.optionRef != undefined && this.submitButtonCounter != this.optionArr.length) {
    //                 this.optionRef.nativeElement.children[this.randomOptIndx].children[0].src = this.optionObj.option_commonAssets.blink_box.location == 'content' ? this.containgFolderPath + "/" + this.optionObj.option_commonAssets.blink_box.url : this.assetsPath + '/' + this.optionObj.option_commonAssets.blink_box.url;
    //             }
    //         } else {
    //             this.blinkFlag = true;
    //             if (this.optionRef != undefined && this.submitButtonCounter != this.optionArr.length) {
    //                 this.optionRef.nativeElement.children[this.randomOptIndx].children[0].src = this.optionObj.option_commonAssets.default_box_original.location == 'content' ? this.containgFolderPath + "/" + this.optionObj.option_commonAssets.default_box_original.url : this.assetsPath + '/' + this.optionObj.option_commonAssets.default_box_original.url;
    //             }
    //         }
    //     }, 500)
    // }


    // postWrongAttemptTask(){
	// 	this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center ";
	// 	this.appModel.notifyUserAction();
	// 	// for (this.j = 0; this.j < this.answers.length; this.j++) {
	// 	// 	document.getElementById("optimage" + this.j).className = "img-fluid"
	// 	// }
	// 	this.myoption.forEach(element => {
	// 		element.show = true;
	// 	});
	// 	this.answers = this.appModel.content.contentData.data['answers'];
	// 	this.tempAnswers.length = 0;
	// 	console.log("this.ansBlock.nativeElement",this.ansBlock.nativeElement);
	// 	this.i = 0 ;
	// 	this.j = 0;
	// 	this.appModel.enableSubmitBtn(false);

	// }

    // showAnsModal(opt) {
	// 	this.attemptType = "hideAnimation"
	// 	this.ifWrongAns = false;
	// 	this.ifRightAns = false;
	// 	this.wrongImgOption = this.rightAnsSoundUrl
	// 	this.feedbackPopup = this.rightPopup;
	// 	let ansPopup: HTMLElement = this.ansPopup.nativeElement as HTMLElement
	// 	ansPopup.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
	// 	//disable option and question on right attempt
	// 	this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disableDiv";
	// 	if (this.ansBlock && this.ansBlock.nativeElement) {
	// 		this.ansBlock.nativeElement.className = "disable-ansBlock";
	// 	}
	// 	$("#instructionBar").addClass("disableDiv");
	// 	$("#instructionBar").css("pointer-events", 'none');
	// //	$("#ansBlock .options").css("opacity", "0.3");
	// //	$("#instructionBar").css("opacity", "0.3");
	// 	// $("#quesImage").css("opacity", "0.3");
	// 	// $("#quesImage").css("pointer-events", 'none');
	// 	// this.showAnswer.nativeElement.src = this.containgFolderPath + "/" + this.feedback.show_Answer_sound.url + "?someRandomSeed=" + Math.random().toString(36) ;
	// 		//this.showAnswer.nativeElement.play();

	// 		setTimeout(() => {
	// 			this.showAnswer.nativeElement.play();
	// 		}, 50)
	// 	setTimeout(() => {
	// 		this.removeEvents();
	// 		this.blinkOnLastQues();
	// 	}, 5000);
    // }

    // showAnswers(){
    //     alert('showanswer');
	// 	this.attemptType = "no animation"
	// 	//show right answer pop up
	// 	this.feedbackPopup = this.rightPopup;
	// 	let ansPopup: HTMLElement = this.ansPopup.nativeElement as HTMLElement;
	// 	this.showAnswerRef.nativeElement.classList="modal";
	// 	// this.confirmReplayRef.nativeElement.classList="modal";
	// 	// this.submitModalRef.nativeElement.classList="modal";
	// 	ansPopup.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
	// 	this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disableDiv disable-click";
	// 	$("#instructionBar").css("pointer-events", 'none');
		
	// 	this.showAnswer.nativeElement.src = this.assetsPath + "/" + this.question.narrator_voice.url 
	// 	if(this.tempAnswers && this.tempAnswers.length > 0)
	// 	{
	// 		this.showAnsTempArray = JSON.parse(JSON.stringify(this.answers))
	// 	}
	// 	else{
	// 		this.tempAnswers = this.answers ;
	// 	}

	// 	// this.myoption.forEach(element => {
	// 	// 	element.show = false;
	// 	// });

	// 	setTimeout(() => {
	// 			if (this.showAnswer && this.showAnswer.nativeElement) {
	// 				this.showAnswer.nativeElement.play();
	// 			}
	// 		}, 50)
	// 		this.showAnswer.nativeElement.onended = () => {
	// 			if(!this.closed){
	// 				this.ansPopup.nativeElement.classList = "modal";
	// 				this.attemptType = "no animation"
	// 				this.blinkOnLastQues();
			
	// 			}
	// 		}


	// 	// setTimeout(() => {
	// 	// 	this.blinkOnLastQues();
	// 	// }, 3000);
			
		
    // }



      // wrongAnsClose(){
	// 	this.closed = true;
	// 	this.ansPopup.nativeElement.classList = "modal";
	// 	this.ansPopup.nativeElement.classList = "modal";
	// 	this.appModel.notifyUserAction();
	// 	// this.appModel.wrongAttemptAnimation();	
		
	// }

    // onHoverhelp(option){
    //  //console.log("in",option);
    //  if(!this.instruction.nativeElement.paused){
    //    this.helpbtn.nativeElement.className="";
    //    console.log("instruction voice still playing");
    //  }
    //  else{
    //    option.help =option.helphover;
    //    this.helpbtn.nativeElement.className="pointer"; 
    //  }
    // }

    // onHoverouthelp(option) {
    //     option.help = option.helpOriginal;
    // }


    reset() {
        // will reset all what user performed
        // this.audio.pause();
        // if(this.myAudiohelp && this.myAudiohelp.nativeElement)
        // this.myAudiohelp.nativeElement.pause();
        // if(this.myAudiospeaker && this.myAudiospeaker.nativeElement)
        // this.myAudiospeaker.nativeElement.pause();
        // if(this.myAudiohelp && this.myAudiohelp.nativeElement)
        // this.myAudiohelp.nativeElement.pause();
        // var popup=document.getElementById("ansPopup")
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

    
    // playSound(soundAssets, idx) {
    //     if (this.audio && this.audio.paused) {
    //         if (soundAssets.location == 'content') {
    //             this.audio.src = this.containgFolderPath + '/' + soundAssets.url;
    //         } else {
    //             this.audio.src = soundAssets.url;
    //         }
    //         for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
    //             if (i != idx) {
    //                 // this.optionRef.nativeElement.children[i].classList = "disableDiv";
    //             }
    //         }
    //         this.audio.load();
    //         this.audio.play();
    //         this.instructionBar.nativeElement.classList = "instructionBase disableDiv";
    //         this.instructionVO.nativeElement.pause();
    //         this.instructionVO.nativeElement.currentTime = 0;
    //         this.audio.onended = () => {
    //             this.instructionBar.nativeElement.classList = "instructionBase";
    //             for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
    //                 if (i != idx) {
    //                     //  this.optionRef.nativeElement.children[i].classList = "";
    //                 }
    //             }

    //         }
    //     }
    // }




    // playOptionHover(opt, idx, el) {
    //     if (opt && opt.audio && opt.audio.url) {
    //         this.OnHoverOptionAudio(el);
    //     }
    // }

    
	// ifEqual(a,b){
	// 	for (var i = 0; i < a.length; ++i) {
	// 		if (a[i] !== b[i]) return false;
	// 	  }
	// 	  return true;
	// }

    // OnHoverOptionAudio(el: HTMLAudioElement) {    
    //     if (el.id == "optionaudio") {
    //         this.OptionAudio.nativeElement.pause();
    //         if (el.paused) {
    //             el.currentTime = 0;
    //             el.play();
    //         }
    //         else {
    //             el.currentTime = 0;
    //             el.play();
    //         }
    //     } else {
    //         if (this.OptionAudio && this.OptionAudio.nativeElement) {
    //             this.OptionAudio.nativeElement.pause();
    //         }
    //         el.pause();
    //         el.currentTime = 0;
    //         el.play();
    //         // if(this.maincontent){
    //         //     this.maincontent.nativeElement.className = "disableDiv";
    //         // }
    //         el.onended = () => {
    //             if (this.maincontent) {
    //                 this.maincontent.nativeElement.className = "";
    //             }
    //         }

    //     }
    // }


    

    // checkAnswerOnSubmit() {
    
	// 	//check if the option in temanswer array are in right sequence or not
	// 	let tempCustomId = [];
	// 	this.tempAnswers.forEach(element => {
	// 		tempCustomId.push(element.custom_id)
	// 	});
        
        
    //     console.log(tempCustomId,'temp cust id');
	// 	if (this.ifEqual(tempCustomId ,this.correct_ans_index)) {
	// 		console.log("right answer pop")
	// 		this.feedbackPopup = this.rightPopup;
	// 		this.attemptType = "manual";
	// 		this.appModel.enableSubmitBtn(false);
	// 		//show right answer pop up
	// 		let ansPopup: HTMLElement = this.ansPopup.nativeElement as HTMLElement
	// 		ansPopup.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
	// 		this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disableDiv disable-click";
	// 		$("#instructionBar").css("pointer-events", 'none');
	// 		this.showAnswer.nativeElement.src = this.feedbackPopup.feedbackVo.location == "content" ? this.assetspath + "/" + this.feedbackPopup.feedbackVo.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackPopup.feedbackVo.url + "?someRandomSeed=" + Math.random().toString(36);
	// 		//this.showAnswer.nativeElement.play();

	// 		setTimeout(() => {
	// 			this.showAnswer.nativeElement.play();
	// 		}, 750)
	// 		this.showAnswer.nativeElement.onended=()=>{
	// 			if(!this.closed){
	// 				this.ansPopup.nativeElement.classList = "modal";
	// 				this.blinkOnLastQues();
	// 			}
	// 		}			
	// 	}
	// 	else {
	// 		console.log("wrong ans pop up")
	// 		//show wrongans popup
	// 		this.ifWrongAns = true;
	// 		this.feedbackPopup = this.wrongPopup;
	// 		let ansPopup: HTMLElement = this.ansPopup.nativeElement as HTMLElement
	// 		ansPopup.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
	// 		this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disableDiv disable-click";
		
	// 		setTimeout(() => {
	// 			if (this.wrongFeedback && this.wrongFeedback.nativeElement) {
	// 				this.wrongFeedback.nativeElement.play();
	// 			}
	// 		}, 50)
	// 		this.wrongFeedback.nativeElement.onended = () => {
	// 			if(!this.closed){
	// 				this.wrongTimer = setTimeout(() => {
	// 					this.ansPopup.nativeElement.classList = "modal";
	// 					this.appModel.notifyUserAction();
	// 					this.appModel.wrongAttemptAnimation();	
	// 				}, 2000);
	// 			}
	// 		}
	// 		// this.showAnswer.nativeElement.src = this.feedbackPopup.feedbackVo.location == "content" ? this.assetspath + "/" + this.feedbackPopup.feedbackVo.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetspath + "/" + this.feedbackPopup.feedbackVo.url + "?someRandomSeed=" + Math.random().toString(36);
	// 	}

    // }
    

    
	// checkAnswer(option, event, idx) {

	// 	// Analytics called for attempt counter & first option is clicked
	// 	if (this.myAudiohelp && this.myAudiohelp.nativeElement) {
	// 		this.myAudiohelp.nativeElement.pause();
	// 		this.myAudiohelp.nativeElement.currentTime = 0;
	// 	}

	// 	if (!this.instruction.nativeElement.paused) {
	// 		console.log("instruction voice still playing");
	// 	}
	// 	else {
	// 		this.disableHelpBtn = true;
	// 		// logic to check what user has done is correct
	// 		if (option.custom_id == this.answers[this.i].custom_id && this.i < this.answers.length) {

	// 			this.myAudiospeaker.nativeElement.pause();
	// 			this.myAudiohelp.nativeElement.pause();
	// 			console.log("when correct answer clicked", event.toElement);
	// 			// empty cloud
	// 			event.toElement.className = "img-fluid emptyoption"

	// 			console.log("i have hit correct sequence");
    //             this.Sharedservice.setShowAnsEnabled(true);	
	// 			//visibility true and call loadImage()
	// 			if (this.j < this.answers.length) {
	// 				console.log("loadImage would be called");
	// 				//this.loadImage(this.answers[this.j].imgsrc, document.getElementById("div"+this.j));
	// 				this.j++;
	// 			}
	// 			document.getElementById("div" + this.i).style.visibility = "visible";
	// 			this.i++;
	// 			console.log("check:", this.i, this.answers.length);
	// 			if (this.i == this.answers.length) {
	// 				//fireworks POC
	// 				// call to play answer sound and show popup
	// 				this.playSound(this.feedback.write_ans_sound.path.url);
	// 				//this.isLastQues = this.appModel.isLastSection;

	// 				let ansPopup: HTMLElement = this.ansPopup.nativeElement as HTMLElement
	// 				ansPopup.className = "d-flex align-items-center justify-content-center showit";
	// 				// let elfireworks: HTMLElement = this.fireworks.nativeElement as HTMLElement
	// 				// elfireworks.className = "d-flex align-items-center justify-content-center showit";


	// 				//disable click on options and speaker
	// 				var optionsBlock = document.getElementById("optionsBlock")
	// 				var disableSpeaker = document.getElementById("disableSpeaker")
	// 				optionsBlock.className = optionsBlock.className.concat(" disable");
	// 				disableSpeaker.className = disableSpeaker.className.concat(" disable");

	// 				// question next timeout

	// 				this.timernextseg = setInterval(() => {
	// 					this.checkNextActivities();
	// 				}, 500)
	// 			}


	// 		}


	// 		else {
	// 			this.myAudiospeaker.nativeElement.pause();
	// 			console.log("when wrong answer clicked");
	// 			//set all options again 

	// 			for (const { item, index } of this.myoption.map((item, index) => ({ item, index }))) {
	// 				console.log("index", index);
	// 				item.imgsrc = item.imgOriginal;
	// 				document.getElementById("div" + index).style.visibility = "hidden";
	// 				//this.UnloadImage(document.getElementById("div"+index));

	// 			}
	// 			for (this.j = 0; this.j < this.answers.length; this.j++) {
	// 				document.getElementById("optimage" + this.j).className = "img-fluid"
	// 			}
	// 			this.i = 0;
	// 			this.j = 0;
	// 			// call to play answer sound

    //             this.wrongCounter += 1;
    //                     if(this.wrongCounter === 3){
    //                         this.Sharedservice.setShowAnsEnabled(true); 
    //                     }else{
    //                         this.Sharedservice.setShowAnsEnabled(false);
    //                     }
                       
    //                     this.idArray = [];
    //                     for (let i of this.myoption) {
    //                         this.idArray.push(i.id);
    //                     }        
    //                     this.doRandomize(this.myoption);

	// 			// this.buzzerSound.nativeElement.onended = () => {
	// 			// 	$("#optblank" + idx).removeClass("animation-shake");
	// 			// 	$("#optimage" + idx).removeClass("animation-shake");

	// 			// 	this.idArray = [];
	// 			// 	for (let i of this.myoption) {
	// 			// 		this.idArray.push(i.id);
	// 			// 	}
	// 			// 	this.doRandomize(this.myoption);
	// 			// 	setTimeout(() => {
	// 			// 		this.ansBlock.nativeElement.className = "d-flex justify-content-around row1";
	// 			// 	}, 200)
	// 			// }


	// 		}
	// 	}


    // }
    

  // disableScreen() {
    //     // for (let i = 0; i < this.selectedOptList.length; i++) {
    //     //     $(this.mainContainer.nativeElement.children[this.selectedOptList[i].idx + 1].children[0]).animate({ left: (0), top: (0) }, 500).removeClass("shrink_it");
    //     // }
    //     // $(this.instructionBar.nativeElement).addClass('greyOut');
    //    // $(this.mainContainer.nativeElement.children[0]).addClass('greyOut');

    //     //$(this.mainContainer.nativeElement).addClass("greyOut");
    //     clearInterval(this.blinkTimeInterval);
    //     // if (this.optionHolder != undefined) {
    //     //     this.optionHolder.leftHolder = this.optionHolder.leftHolder_original;
    //     //     this.optionHolder.rightHolder = this.optionHolder.rightHolder_original;
    //     // }
    //     // if (this.categoryA && this.categoryA.correct && this.categoryA.correct.length) {
    //     //     this.categoryA.correct.splice(0, this.categoryA.correct.length);
    //     // }
    //     // if (this.categoryA && this.categoryA.incorrect && this.categoryA.incorrect.length) {
    //     //     this.categoryA.incorrect.splice(0, this.categoryA.incorrect.length);
    //     // }
    //     // if (this.categoryB && this.categoryB.correct && this.categoryB.correct.length) {
    //     //     this.categoryB.correct.splice(0, this.categoryB.correct.length);
    //     // }
    //     // if (this.categoryB && this.categoryB.incorrect && this.categoryB.incorrect.length) {
    //     //     this.categoryB.incorrect.splice(0, this.categoryA.incorrect.length);
    //     // }
    //     // if (this.category && this.category.correct && this.category.correct.length) {
    //     //     this.category.correct.splice(0, this.category.correct.length);
    //     // }
    //     // if (this.category && this.category.incorrect && this.category.incorrect.length) {
    //     //     this.category.incorrect.splice(0, this.category.incorrect.length);
    //     // }
    //     /* if (this.instructionBar && this.instructionBar.nativeElement) {
    //          this.instructionBar.nativeElement.classList = "instructionBase disableDiv";
    //      }*/
    //     // this.appModel.enableReplayBtn(false);
    // }


     // optionslist: any = [];
    // optionslist_main: any = "";  
    // showIntroScreen: boolean;  
    // disableHelpBtn: boolean = false; 
    // dummyImgs: any = []; 
    // randomArray: any;
    // leftSelectedIdx: number = 0;
    // rightSelectedIdx: number = 0;
    // maxRandomNo: number;
    // elemHolder: any;
    // moveFrom: any;
    // moveTo: any;
    // startCount: number = 0;
     // randomOptIndx: number;
    // blinkFlag: boolean = true;
    // optionObj: any;
    // blinkInterval: any;
    // feedbackPopup: any;
    // ifWrongAns:boolean = false;
     // question: any = "";
    // showAnsTempArray :any = [];
    // audio = new Audio();
    // confirmPopupAssets: any;
    // optionHolder: any = [];
    // isLastActivity: any = "";
    // isFirstQues: boolean;
    // helpAudio: any = "";
    // feedbackAudio: any;
    // rightanspopUpheader_img: boolean = false;
    // wronganspopUpheader_img: boolean = false;
    // showanspopUpheader_img: boolean = false;
    // styleHeaderPopup: any;
    // styleBodyPopup: any; 
    // submitButtonCounter: number = 0;
    // showAnswerCounter: number = 0;
    // answers: any = "";
    // tempAnswers: any = [];
     // tempTimer:any;
    // quesInfo: any = "";
    // popUpObj: any;
    // wrongImgOption: any;
    
	// rightAnsSoundUrl: string = "";
    // popUpClosed: boolean = false;
    
    // fixedOptions:any = [];
    // selectableOpts: number;
    // selectedOptList: any = [];
    // isAllRight: boolean = false;
    // categoryA: any = {
    //     "correct": [],
    //     "incorrect": []
    // };
    // categoryB: any = {
    //     "correct": [],
    //     "incorrect": []
    // };
    // infoPopupAssets: any;

    // confirmSubmitAssets: any;
    // confirmReplayAssets: any;
    // selectedOpt: any = {
    //     "idx": undefined,
    //     "moveFrom": undefined,
    //     "moveTo": undefined
    // };
    // selectedCopy: any;
    // leftRandomArray: any = [];
    // rightRandomArray: any = [];
    // completeRandomArr: any = [];
    // category: any;
    // currentFeedbackPlaying: string = "categoryA";
    // nextBtnInterval: any;
    // closeFeedbackmodalTimer: any;
    
    // maxOpotions: number = 7;
    // currentFeedbackElem: any;
    // timerDelayActs: any;
    // nextFeedbackTimer: any;
    // timerFeedback: any;
    // blinkCategory1: number = 0;
    // blinkCategory2: number = 0;
   


    // placeHolderArrUp: any = [];
    // placeHolderArrDown: any = [];
    // placeHolderArrUpPopup: any = [];
    // placeHolderArrDownPopup: any = [];
    // upPlaceHolderIndxs: any = [];
    // downPlaceHolderIndxs: any = [];
    // blinkingOpt: any;

    // optIndxArr: any = [];
    
    // optionCommonAssts: any;
    
    // submittedArr: any = [];
    // responseType: string = "";
    // popupTopAssts: any = [];
    // popupDownAssts: any = [];
   
    // resultType: string = "correct";
    // sortedOptArr: any;
    // currentIndxUp: number = 0;
    // currentIndxDown: number = 0;
    // currentComparison: any;
    // placeToPut: string = "up";
    // runningIndx: number = 0;
    // optionIndex: number;
    // valueOnce: any = [];
    // currentValue: number = 0;
    // idOfImage: number;
    // IdImageArr: any = [];
    // blinkCounter: number = 0;
    // blinkFlagReverse: boolean = false;
    // RandomIndexValue: any = [];
    // ResizeIndex: number = 0;
    // ResizePos: string = "";
    // RandomResizeIndex: number = 0;
    // ArrPlaceHolder: any = [];
    // Ccounter: number = 0;
  
    // Order: string = "";
    // optionReverseTopPosition: number = 0;
    // startActivityCounter: number = 0;
    // feedbackObj: any;   
    // partialCorrectheaderTxt_img: boolean = false;
    // submitPopupAssets: any;
 
    
	  
    
    // @ViewChild('OptionAudio') OptionAudio: any;
    // @ViewChild('confirmSubmitRef') confirmSubmitRef: any;
    // @ViewChild('infoModalRef') infoModalRef: any;
    // @ViewChild('feedbackPopupRef') feedbackPopupRef: any;
    // @ViewChild('feedbackAudio') feedbackAudio: any;
    // @ViewChild('correctCategory') correctCategory: any;
    // @ViewChild('incorrectCategory') incorrectCategory: any;
    // @ViewChild('mainVideo') mainVideo: any;
    // @ViewChild('confirmReplayRef') confirmReplayRef: any;
    // @ViewChild('partialFeedbackRef') partialFeedbackRef: any; 
	// @ViewChild('submitModalRef') submitModalRef: any;
    // @ViewChild('upPlaceHolder') upPlaceHolder: any;
    // @ViewChild('downPlaceHolder') downPlaceHolder: any;
    // @ViewChild('scaleBoxRef') scaleBoxRef: any;
    // @ViewChild('modalfeedback20') modalfeedback20: any;
    // @ViewChild('modalFeedbackContainer') modalFeedbackContainer: any; 
    // @ViewChild('PartialWrongSound') PartialWrongSound: any;
    // @ViewChild('feedbackInfoAudio') feedbackInfoAudio: any;
    // @ViewChild('feedbackPopupAudio') feedbackPopupAudio: any;
    // @ViewChild('myAudiohelp') myAudiohelp: any;
    
    // @ViewChild('ShowAnswerSound') showAnswerSound: any;
    // @ViewChild('instructionVO') instructionVO: any;
        // @ViewChild('quesVORef') quesVORef: any;

}