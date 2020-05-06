
import { Component, OnInit, HostListener, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { Base } from '../../../controller/base';
import { PlayerConstants } from '../../../common/playerconstants';
import { ActivatedRoute } from '@angular/router';
import { SharedserviceService } from '../../../services/sharedservice.service';
import { Subscription } from 'rxjs';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
    selector: 'app-template1',
    templateUrl: './template1.component.html',
    styleUrls: ['./template1.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class Template1Component implements OnInit {
   
    blink: boolean = false;
    commonAssets: any = "";
	rightPopup: any;
	wrongPopup: any;
    wrongTimer:any;
    i = 0;
    j: number = 0;
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
    fixedOptions:any = [];
    quesEmptyTxtIndx: number = -1;
    quesMatraTxtIndx: number = -1;
    quesMatraName:any=[];
    isOptionSelected: boolean = false;
    quesObj: any;
    quesObjCopy: any;
    optionSelected: number = -1;
    boundingClientFrom: any;
    boundingClientTo: any;
    emptyOpt:any;
    isRightSelected: boolean = false;
    isWrongSelected: boolean = false;
    myoption: any = [];
    optionObj: any;
    questionObj: any;
    correct_opt_index: any;
    popupclosedinRightWrongAns:boolean=false;
    ifWrongAns:boolean= false;
    index: any;
    aksharQuestion:boolean=false;
    LastquestimeStart:boolean = false;

    // @ViewChild('narrator') narrator: any;
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
    // @ViewChild('correctAns') correctAns: any;
    // @ViewChild('feedbackVoRef') feedbackVoRef: any;
    @ViewChild('optionRef') optionRef: any;
    @ViewChild('refQues') refQues: any;
    @ViewChild('overlay') overlay:any;



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
        // this.appModel.navShow = 2;
    }



    ngOnInit() {        

        this.sprite.nativeElement.style="display:none";
        if(this.isLastQues){
            this.next();
            console.log('last question move');
        }
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
                    //Saving correct option for showing in Popup 
                    if(this.aksharQuestion){
                        this.quesObj.questionText[this.quesEmptyTxtIndx] = this.correct_opt_index; 
                    }else{
                        this.quesObj.questionText[this.quesMatraTxtIndx].hasmatra=true;
                        this.quesObj.questionText[this.quesMatraTxtIndx].matravalue=this.correct_opt_index.url.split('.')[0].split('/').pop();
                        this.quesObj.questionText[this.quesMatraTxtIndx].matra.url=this.correct_opt_index.url;
                        this.quesObj.questionText[this.quesMatraTxtIndx].matra.location=this.correct_opt_index.location;
                    }
                    this.showAnswerRef.nativeElement.classList = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
            
                    if (this.showAnswerfeedback && this.showAnswerfeedback.nativeElement) {
                        this.showAnswerfeedback.nativeElement.play();
                    }
                    this.popupType = "showanswer";
                    //this.blinkOnLastQues();
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
				//this.appModel.notifyUserAction();
				if (this.ansPopup && this.ansPopup.nativeElement) {
					//$("#instructionBar").addClass("disableDiv");
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
            //this.appModel.notifyUserAction();
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
        //this.appModel.notifyUserAction();
        let fetchedData: any = this.appModel.content.contentData.data;
        this.optionObj = JSON.parse(JSON.stringify(fetchedData.options));
        this.instructiontext = fetchedData.instructiontext;
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
        this.commonAssets.ques_control.blinkingStatus=false;
        this.isLastQues = this.appModel.isLastSection;
        this.isLastQuesAct = this.appModel.isLastSectionInCollection;
        this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
        this.quesObj = JSON.parse(JSON.stringify(this.questionObj));
        this.quesObjCopy = JSON.parse(JSON.stringify(this.questionObj));
        this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
        this.myoption = fetchedData.options.opts;
        for (let i = 0; i < this.optionObj.opts.length; i++) {
            if (this.optionObj.opts[i].isCorrect) {
                this.correct_opt_index = this.optionObj.opts[i];
                break;
            }
        }
        for (let i = 0; i < this.questionObj.questionText.length; i++) {
            if(this.questionObj.questionText[i].hasmatra) {
                this.questionObj.questionText[i].matravalue = this.questionObj.questionText[i].matra.url.split('.')[0].split('/').pop();
                continue;
            }
            if (this.questionObj.questionText[i].isBlank) {
                this.quesEmptyTxtIndx = i;
                continue;
            }
            if (this.questionObj.questionText[i].addMatra) {
                this.quesMatraTxtIndx = i;
                continue;
            }
        }

        setTimeout(() => {
            if (this.footerNavBlock && this.footerNavBlock.nativeElement) {
                this.footerNavBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around";
            }
        }, 200)
    
    }

        doRandomize(array) {        
        var currentIndex = array.length, temporaryValue, randomIndex;
       // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            // randomIndex = Math.floor(Math.random() * currentIndex);
            // currentIndex -= 1;          
            // And swap it with the current element.
            // temporaryValue = array[currentIndex];
            // array[currentIndex] = array[randomIndex];
            // array[randomIndex] = temporaryValue;

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            var img_hover1 = array[currentIndex].optBgHover;
            //var text1 = array[currentIndex].url;
            var text1copy = array[currentIndex].optBgOriginal;
            var optionBg1 = array[currentIndex].optBg;
            
            var img_hover2 = array[randomIndex].optBgHover;
            //var text2 = array[randomIndex].url;
            var text2copy = array[randomIndex].optBgOriginal;
            var optionBg2 = array[randomIndex].optBg;
            //And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
            
            array[currentIndex].optBgHover = img_hover1;
            //array[currentIndex].url = text1;
            array[currentIndex].optBgOriginal = text1copy;
            array[currentIndex].optBg = optionBg1;
            
            array[randomIndex].optBgHover = img_hover2;
            //array[randomIndex].url = text2;
            array[randomIndex].optBgOriginal = text2copy;
            array[randomIndex].optBg = optionBg2;
        }
        var flag=this.arraysIdentical(array,this.idArray);
        console.log(flag);
        if(flag){
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


    // isPaused() {
    //     return this.audio.paused;
    // }

    removeEvents() {
        // remove event handlers for all clickable items in the dom
        this.blink = false;
        clearTimeout(this.timernextseg);
    }

    // closePopup(Type,answerType){
    //     if(this.answerPopupType === 'right'){
    //         this.Sharedservice.setShowAnsEnabled(true);
    //         this.maincontent.nativeElement.className = "fadeContainer";
    //     }

    //     if(this.answerPopupType  === 'wrong'){
    //         if(this.wrongCounter >= 3){
    //             this.Sharedservice.setShowAnsEnabled(true); 
    //         }else{
    //             this.Sharedservice.setShowAnsEnabled(false);
    //         }            
    //     }   
    //     this.isPopupClosed = true;
    //     this.showAnswerRef.nativeElement.classList = "modal";
    //     this.ansPopup.nativeElement.classList = "modal";
        
    //     this.clapSound.nativeElement.pause();
    //     this.clapSound.nativeElement.currentTime = 0;

    //     this.wrongFeedback.nativeElement.pause();    
    //     this.wrongFeedback.nativeElement.currentTime = 0;

    //     this.rightFeedback.nativeElement.pause();     
    //     this.rightFeedback.nativeElement.currentTime = 0;

    //     this.showAnswerfeedback.nativeElement.pause();      
    //     this.showAnswerfeedback.nativeElement.currentTime = 0;
       

    //     if(Type === 'showAnswer'){
        
    //         setTimeout(() => {
    //             this.showAnswerfeedback.nativeElement.pause();      
    //             this.showAnswerfeedback.nativeElement.currentTime = 0;
    //             if(!this.showAnswerfeedback.nativeElement.pause()){
    //                 //this.appModel.nextSection(); 
    //             }else{
    //                 console.log('show answer voice still playing jyoti');
    //             }
                
	// 		}, 1000);
    //     }else{
           
    //     }
     
    // }

    closePopup(Type){
        this.showAnswerRef.nativeElement.classList = "modal";
        this.ansPopup.nativeElement.classList = "modal";
        this.wrongFeedback.nativeElement.pause();    
        this.wrongFeedback.nativeElement.currentTime = 0;

        this.rightFeedback.nativeElement.pause();     
        this.rightFeedback.nativeElement.currentTime = 0;

        this.showAnswerfeedback.nativeElement.pause();      
        this.showAnswerfeedback.nativeElement.currentTime = 0;
        
        console.log(Type);
        if(Type=== "answerPopup") {
            this.popupclosedinRightWrongAns=true;
            if(this.ifRightAns) {
                this.Sharedservice.setShowAnsEnabled(true);
                this.overlay.nativeElement.classList.value="fadeContainer";
                this.blinkOnLastQues();
                        setTimeout(()=>{
                this.appModel.nextSection();
                this.Sharedservice.setShowAnsEnabled(false); 
            }, 10000)
            } else {
                if(this.wrongCounter >= 3 && this.ifWrongAns) {
                    this.Sharedservice.setShowAnsEnabled(true);
                 } else {
                    this.Sharedservice.setShowAnsEnabled(false);
                 }
            }
        }
        if(Type === 'showAnswer'){
        
            // setTimeout(() => {
            //     this.showAnswerfeedback.nativeElement.pause();      
            //     this.showAnswerfeedback.nativeElement.currentTime = 0;
            //     if(!this.showAnswerfeedback.nativeElement.pause()){
            //         this.appModel.nextSection(); 
            //     }else{
            //     }
                
            // }, 1000);
            if(this.ifRightAns) {
                this.blinkOnLastQues();
            }
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
            speaker.imgsrc = speaker.imgorigional;          
             this.sprite.nativeElement.style="display:none";
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
                    this.sprite.nativeElement.style="display:flex";
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
                         this.sprite.nativeElement.style="display:none";
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
		if (this.questionObj && this.questionObj.quesInstruction && this.questionObj.quesInstruction.url && this.questionObj.quesInstruction.autoPlay) {
            this.instruction.nativeElement.src = this.questionObj.quesInstruction.location == "content" 
            ? this.containgFolderPath + "/" + this.questionObj.quesInstruction.url: this.assetsPath + "/" + this.questionObj.quesInstruction.url    
            this.appModel.handlePostVOActivity(true);
            this.maincontent.nativeElement.className = "disableDiv";   
            //this.Sharedservice.setVoplayingStatus(true);  
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
        if(this.lastQuestionCheck){
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

        if(obj.audioEl && obj.audioEl.nativeElement){
            obj.audioEl.nativeElement.volume = obj.appModel.isMute?0:vol;
        }
        if (obj.quesVORef && obj.quesVORef.nativeElement) {
            obj.quesVORef.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.instruction && obj.instruction.nativeElement) {
            obj.instruction.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
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
        //  if(!this.narrator.nativeElement.paused){
        //    this.disableSpeaker.nativeElement.className="speakerBtn";
        //    console.log("narrator voice still playing");
        //   }
        //   else{
        //    this.disableSpeaker.nativeElement.className="speakerBtn pointer";
        //   }
    }

    /**OPTION HOVER */
    onHoverOptions(option, index) {
        option.optBg = option.optBgHover;
    }

    
    onHoveroutOptions(option, index) {
        option.optBg = option.optBgOriginal;
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
    /** On selecting a Matra option **/
    saveOpt : any;
    selectOptMatra(opt,idx){
        document.getElementById('refQuesId').style.width=document.getElementById('refQuesId').offsetWidth+'px';
        this.aksharQuestion=false;
        this.popupclosedinRightWrongAns=false; 
        this.optionSelected = idx;
        this.emptyOpt = this.quesObjCopy.questionText[this.quesEmptyTxtIndx];
        this.optionRef.nativeElement.children[this.optionSelected].children[1].classList.add('invisible');
        for(let x=0; x<this.refQues.nativeElement.children.length;x++){
            if(this.refQues.nativeElement.children[x].classList.value=='quesBox'){
                this.saveOpt=this.refQues.nativeElement.children[x];
            }
        }
        this.saveOpt.classList.remove('quesBox');
        let optionURL=opt.url;
        let matraName=optionURL.split('.')[0].split('/').pop();
        this.saveOpt.classList.add('matra_'+matraName);
        let showMatra=opt.location == "content" ? this.containgFolderPath + "/" + opt.url: this.assetsPath + "/" + opt.url;        
        this.saveOpt.insertAdjacentHTML("beforeend", '<img id="ansImg" style="position: absolute;filter: grayscale(100%) brightness(0) saturate(0);height: 100%;" src='+showMatra+'>');
        //let aksharURL=this.questionObj.questionText[this.quesMatraTxtIndx].url;
        // let aksharName=aksharURL.split('.')[0].split('/').pop();        
        // if((aksharName=='ka' && matraName=='rBtmLeft.png') || (aksharName=='fa' && matraName=='rBtmLeft.png')){
        //     document.getElementById("ansImg").style.left='1vmax';
        // }else if(matraName=='i'){
        //     document.getElementById("ansImg").style.left='-3vmax';
        // }else if(matraName=='ee' || matraName=='au'){
        //     document.getElementById("ansImg").style.right='-3vmax';
        // }else if(matraName=='aa'){
        //     document.getElementById("ansImg").style.right='-3vmax';
        // }else if(matraName=='o'){
        //     document.getElementById("ansImg").style.right='-2.9vmax';
        // }else if(matraName=='u'){
        //     document.getElementById("ansImg").style.right='.1vmax';
        // }else if(matraName=='oo'){
        //     document.getElementById("ansImg").style.right='-1.7vmax';
        // }else if(matraName=='an'){
        //     document.getElementById("ansImg").style.right='1.1vmax';
        // }else if(matraName=='rTopRight.png'||matraName=='rBtmRight.png'){
        //     document.getElementById("ansImg").style.right='.5vmax';
        // }
        
        //Saving selected matra in questionObject to show in popup
        this.quesObj.questionText[this.quesMatraTxtIndx].hasmatra=true;
        this.quesObj.questionText[this.quesMatraTxtIndx].matravalue=matraName;
        this.quesObj.questionText[this.quesMatraTxtIndx].matra.url=opt.url;
        this.quesObj.questionText[this.quesMatraTxtIndx].matra.location=opt.location;
        
        if (opt && opt.isCorrect) { 
            // handle for correct attempt           
            this.isRightSelected=true;
            this.isWrongSelected=false;
            this.answerPopupType = 'right';
             //this.blinkOnLastQues();
             this.correctOpt = opt;
             this.attemptType = "manual";
             this.appModel.stopAllTimer();
             this.popupIcon = this.popupAssets.right_icon.url;
             this.popupIconLocation = this.popupAssets.right_icon.location;

             this.ifRightAns = true;
             setTimeout(()=>{
                 let ansPopup: HTMLElement = this.ansPopup.nativeElement as HTMLElement           
                 ansPopup.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
                 if (this.rightFeedback && this.rightFeedback.nativeElement) {
                     this.clapSound.nativeElement.play();
                     setTimeout(() => {
                        this.clapSound.nativeElement.pause();     
                        this.clapSound.nativeElement.currentTime = 0;
                        if(!this.popupclosedinRightWrongAns) {
                         this.rightFeedback.nativeElement.play();
                         
                        } else {
                         this.Sharedservice.setShowAnsEnabled(true);
                        } 
                     }, 2000)
                 }
             },1000)                
        
         } else {          
            //handle for wrong attempt
            this.isRightSelected=false;
            this.isWrongSelected=true;
            this.answerPopupType = 'wrong';
            this.wrongCounter += 1;
            this.ifWrongAns=true;               
            this.idArray = [];
            for (let i of this.myoption) {
                this.idArray.push(i.id);
            } 
            setTimeout(()=>{
             let ansPopup: HTMLElement = this.ansPopup.nativeElement as HTMLElement
             ansPopup.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
             this.popupIcon = this.popupAssets.wrong_icon.url;
             this.popupIconLocation = this.popupAssets.wrong_icon.location;
             this.appModel.stopAllTimer();
             //play wrong feed back audio
             
             if (this.wrongFeedback && this.wrongFeedback.nativeElement) {
                 this.wrongFeedback.nativeElement.play();
             }		
             this.wrongFeedback.nativeElement.onended = () => {
                 setTimeout(() => {
                     this.closePopup('answerPopup');
                     console.log('Wrong popup closed');                                                   
                 }, 10000)                    
             }
            this.resetQuestion();//To reset question on wrong attempt
            document.getElementById("ansImg").remove();//Remove existing matra
            this.saveOpt.classList="quesBox";            
           },1000)
        }
    }
    /** On selecting an akshar **/
    selectOpt(opt, idx) {
        //this.appModel.enableReplayBtn(false);
       //disable click
       //this.mainContainer.nativeElement.classList = "bodyContent disableDiv";
       //this.instructionBar.nativeElement.classList = "instructionBase disableDiv";
       //this.appModel.stopAllTimer();
       document.getElementById('refQuesId').style.width=document.getElementById('refQuesId').offsetWidth+'px';
       this.aksharQuestion=true;
       this.popupclosedinRightWrongAns=false; 
       this.optionSelected = idx;       
       if (this.optionRef && this.optionRef.nativeElement && this.optionRef.nativeElement.children[this.optionSelected].children[1]) {
           setTimeout(() => {
               this.optionRef.nativeElement.children[this.optionSelected].children[1].classList.add('invisible');
               this.emptyOpt = this.quesObjCopy.questionText[this.quesEmptyTxtIndx];
               this.quesObjCopy.questionText[this.quesEmptyTxtIndx] = opt;
               this.isOptionSelected = true;               
           }, 50)
           this.quesObj.questionText[this.quesEmptyTxtIndx] = opt;//Saving selected option for showing in Popup         
           
           if (opt && opt.isCorrect) {
               // handle for correct attempt
               this.isRightSelected=true;
               this.isWrongSelected=false;
               this.answerPopupType = 'right';
                //this.blinkOnLastQues();
                this.correctOpt = opt;
                this.attemptType = "manual";
                this.appModel.stopAllTimer();          
                // this.answerImageBase = opt.image_original.url;
                // this.answerImage = opt.imgsrc.url;
                // this.answerImagelocation = opt.image_original.location;
                this.popupIcon = this.popupAssets.right_icon.url;
                this.popupIconLocation = this.popupAssets.right_icon.location;

                this.ifRightAns = true;
                setTimeout(()=>{
                    let ansPopup: HTMLElement = this.ansPopup.nativeElement as HTMLElement           
                    ansPopup.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
                    //opt.image = opt.image_original;
                    if (this.rightFeedback && this.rightFeedback.nativeElement) {
                        this.clapSound.nativeElement.play();
                        setTimeout(() => {
                           this.clapSound.nativeElement.pause();     
                           this.clapSound.nativeElement.currentTime = 0;
                           if(!this.popupclosedinRightWrongAns) {
                            this.rightFeedback.nativeElement.play();
                            
                           } else {
                            this.Sharedservice.setShowAnsEnabled(true);
                           } 
                        }, 2000)
                    }
                    //this.disableQuestion();   //Disable Question on Right Attempt  
                },1000)                
           
            } else {          
               //handle for wrong attempt
               this.isRightSelected=false;
               this.isWrongSelected=true;
               this.answerPopupType = 'wrong';
               this.ifWrongAns=true;
               this.wrongCounter += 1;               
               this.idArray = [];
               for (let i of this.myoption) {
                   this.idArray.push(i.id);
               } 
               setTimeout(()=>{
                let ansPopup: HTMLElement = this.ansPopup.nativeElement as HTMLElement
                ansPopup.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
                this.popupIcon = this.popupAssets.wrong_icon.url;
                this.popupIconLocation = this.popupAssets.wrong_icon.location;
                this.appModel.stopAllTimer();
                //play wrong feed back audio
                
                if (this.wrongFeedback && this.wrongFeedback.nativeElement) {
                    this.wrongFeedback.nativeElement.play();
                }		
                this.wrongFeedback.nativeElement.onended = () => {
                    setTimeout(() => {
                        this.closePopup('answerPopup');
                        console.log('Wrong popup closed');                                                   
                    }, 10000)                    
                }
                this.resetQuestion();//To reset question on wrong attempt
               },1000)
           }
       }
   }
   disableQuestion(){
        this.maincontent.nativeElement.className = "disableDiv";
        this.ansBlock.nativeElement.className = "optionsBlock disableDiv disable-click";
        
        // $("#optionsBlock ").addClass("disable-click disable-click");
        // $("#instructionBar").addClass("disableDiv disable-click");
        // $(".quesOptions .options").css("opacity", "0.3");
        this.rightFeedback.nativeElement.onended = () => {
            setTimeout(() => {
                this.closePopup('answerPopup');
                console.log('Right popup closed');
            }, 10000)
            //new code
            setTimeout(() => {
                this.attemptType = "manual";
                //disable option and question on right attempt
                console.log("disable option and question on right attempt");
                
                //this.blinkOnLastQues()
            }, 200)
        }
   }
   resetQuestion(){
    /*Reset Question and Option*/            
    setTimeout(()=>{
        this.optionRef.nativeElement.children[this.optionSelected].children[1].classList.remove('invisible');
        },50)
        setTimeout(()=>{
            this.doRandomize(this.myoption)
        },200) 
    this.isOptionSelected = false;
    this.quesObjCopy.questionText[this.quesEmptyTxtIndx] = this.emptyOpt;
    document.getElementById('refQuesId').style.width='auto';
    /*Reset Question and Option Complete*/
   }
    //*********UNUSED CODE*************/

       reset() {       
        //Code to reset
    }  
    
	

}