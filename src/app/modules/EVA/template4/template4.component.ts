
import { Component, OnInit, HostListener, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { PlayerConstants } from '../../../common/playerconstants';
import { ActivatedRoute } from '@angular/router';
import { SharedserviceService } from '../../../services/sharedservice.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-template4',
    templateUrl: './template4.component.html',
    styleUrls: ['./template4.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class Template4Component implements OnInit {
   
    blink: boolean = false;
    commonAssets: any = "";
	rightFeedbackVO: any;
    wrongFeedbackVO: any;
    rightPopupVO: any;
    rightTimer:any;
	showAnswerTimer:any;
    i = 0;
    j: number = 0;
    feedback: any = "";
    bool: boolean = false;
    popupType: string = "";
    isLastQues: boolean = false;
    isLastQuesAct: boolean;
    noOfImgs: number;
    noOfImgsLoaded: number = 0;
    loaderTimer: any;
    containgFolderPath: string = "";
    assetsPath: string = "";
    loadFlag: boolean = false;  
    blinkTimeInterval: any;    
    attemptType: string = "";
    isVideoLoaded: boolean = false;
    wrongCounter: number = 0; 
    instructiontext: string;
    timernextseg: any = "";
    idArray: any = [];
    hasEventFired: boolean = false;
    speaker: any;
    tempSubscription: Subscription;
    closed:boolean = false;
    speakerTimer: any;
    clapTimer:any;    
    ifRightAns: boolean = false;
    popupAssets:any;
    showAnswerSubscription:any;
    answerImage:any;
    popupIcon :any;
    popupIconLocation :any;
    isPopupClosed:boolean = false;
    answerPopupType:any;
    lastQuestionCheck:any;
    quesObj: any;
    optionSelected: number = -1;
    myoption: any = [];
    optionObj: any;
    questionObj: any;
    popupclosedinRightWrongAns:boolean=false;
    ifWrongAns:boolean= false;
    index: any;
    LastquestimeStart:boolean = false;
    audio = new Audio();
    saveOpt : any;
    option_order:any;
    place_order:any;
    quesBoxId: any;
    lastBlock: any;
    travellerid: any;
    hoverOptionTimer: any;
	showAnswerPopup:any;
	rightAnswerPopup:any;
	videoonshowAnspopUp: any;
    showAnswerRef: any;
    showAnswerfeedback: any;

    @ViewChild('instruction') instruction: any;
    @ViewChild('sprite') sprite: any;
    @ViewChild('speakerNormal') speakerNormal: any;
    @ViewChild('ansPopup') ansPopup: any;
    @ViewChild('rightPopupfeedback') rightPopupfeedback: any;
    // @ViewChild('showAnswerfeedback') showAnswerfeedback: any;
	// @ViewChild('showAnswerRef') showAnswerRef: any;
    @ViewChild('wrongFeedback') wrongFeedback: any;
    @ViewChild('rightFeedback') rightFeedback: any;
    @ViewChild('disableSpeaker') disableSpeaker: any;  
    @ViewChild('myAudiospeaker') myAudiospeaker: any;
    @ViewChild('maincontent') maincontent: any;
	@ViewChild('footerNavBlock') footerNavBlock: any;
    @ViewChild('clapSound') clapSound: any;
    @ViewChild('optionRef') optionRef: any;
    @ViewChild('overlay') overlay:any;
    
    



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
                switch (data) {
                    case PlayerConstants.CMS_PLAYER_CLOSE:
                        this.close();
                        break;
                    default:
                        break;
                }
            }
        );
        this.assetsPath = this.appModel.assetsfolderpath;
        this.appModel.navShow = 2;
    }



    ngOnInit() {        
        this.Sharedservice.setLastQuesAageyBadheStatus(true);
        this.sprite.nativeElement.style="display:none";
        this.ifRightAns = false;
        this.attemptType = "";
        this.setTemplateType();
        if (this.appModel.isNewCollection) {
            this.appModel.event = { 'action': 'segmentBegins' };
        }
        this.containgFolderPath = this.getBasePath();
        this.setData();
        this.appModel.getNotification().subscribe(mode => {
            if (mode == "manual") {

            } else if (mode == "auto") {
                this.attemptType = "uttarDikhayein";
                this.popupType = "showanswer"
            }
        })
     this.showAnswerSubscription =   this.appModel.getConfirmationPopup().subscribe((val) => {  
        this.appModel.stopAllTimer();
        if (this.showAnswerRef && this.showAnswerRef.nativeElement) {
           
            this.stopAllSounds();
            this.videoonshowAnspopUp.nativeElement.src = this.showAnswerPopup.video.location == "content" ? this.containgFolderPath + "/" + this.showAnswerPopup.video.url : this.assetsPath + "/" + this.showAnswerPopup.video.url;
            this.showAnswerRef.nativeElement.classList = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
            if (this.videoonshowAnspopUp && this.videoonshowAnspopUp.nativeElement) {
                this.videoonshowAnspopUp.nativeElement.play();
                this.videoonshowAnspopUp.nativeElement.onended = () => {
                    this.showAnswerTimer=setTimeout(() => {
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
			if(mode == "manual") {
				//show modal for manual
				this.appModel.notifyUserAction();
				if (this.ansPopup && this.ansPopup.nativeElement) {
					this.ansPopup.nativeElement.classList = "displayPopup modal";
				}
			}else if (mode == "auto") {
				// this.showAnswers();
			}
		})

        
    }

    /******Set template type for EVA******/
    setTemplateType(): void {
        this.ActivatedRoute.data.subscribe(data => {
            this.Sharedservice.sendData(data);
        })
    }
    ngOnDestroy() {
        this.stopAllSounds();
        this.showAnswerSubscription.unsubscribe();
        clearTimeout(this.rightTimer);
        clearTimeout(this.clapTimer);
    }

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

        this.rightPopupfeedback.nativeElement.pause();
        this.rightPopupfeedback.nativeElement.currentTime = 0;
        if(clickStatus) {
            this.enableAllOptions();
          }
       
        
    }

    ngAfterViewChecked() {
        this.templatevolume(this.appModel.volumeValue, this);
    }

    setData() {
        let fetchedData: any = this.appModel.content.contentData.data;
        this.optionObj = JSON.parse(JSON.stringify(fetchedData.options));
        this.instructiontext = fetchedData.instructiontext;
        this.commonAssets = fetchedData.commonassets;
        this.speaker = fetchedData.speaker;
        this.feedback = fetchedData.feedback;
        this.questionObj = fetchedData.quesObj;
        this.noOfImgs = fetchedData.imgCount;
        this.popupAssets = fetchedData.feedback.popupassets;
        this.rightFeedbackVO = this.feedback.right_ans_sound;
        this.rightPopupVO = this.feedback.right_ansPop_sound;
        this.wrongFeedbackVO = this.feedback.wrong_ans_sound;
		this.showAnswerPopup = this.feedback.show_ans_popup;
		this.rightAnswerPopup = this.feedback.right_ans_popup;
        this.lastQuestionCheck = this.commonAssets.ques_control.isLastQues;
        this.commonAssets.ques_control.blinkingStatus=false;
        this.isLastQues = this.appModel.isLastSection;
        this.isLastQuesAct = this.appModel.isLastSectionInCollection;
        this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
        this.quesObj = JSON.parse(JSON.stringify(this.questionObj));
        this.myoption = fetchedData.options.opts;
        
        setTimeout(() => {
            if (this.footerNavBlock && this.footerNavBlock.nativeElement) {
                this.footerNavBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around";
            }
        }, 200)
    
    }
    /** TO SHUFFLE OPTIONS ON WRONG ATTEMPT**/
        doRandomize(array) {        
        var currentIndex = array.length-1, temporaryValue, randomIndex;
       // While there remain elements to shuffle...
        while (0 !== currentIndex) {
           
            // Pick a remaining element...
            if(array[currentIndex] && array[currentIndex].isShow==false){
                currentIndex -= 1;
            }else{
                randomIndex = Math.floor(Math.random() * currentIndex);
                if(array[randomIndex] && array[randomIndex].isShow==true){                    
                    temporaryValue = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = temporaryValue;
                    currentIndex -= 1;
                }
                else{
                    continue;
                }
            }
          
        }
        var flag=this.arraysIdentical(array,this.idArray);
        if(flag){
            this.doRandomize(array);
        }
        else {
			
		}
    }
    
    arraysIdentical(a, b) {
        var i = a.length;
        while (i--) {           
            if (a[i].isShow==true && a[i].id == b[i]) {
                return true;
            }
        }
        return false;
    }

   /** CLOSE POPUP FUNCTIONALITY**/
    closePopup(Type){
		clearTimeout(this.rightTimer);
        clearTimeout(this.clapTimer);
        clearTimeout(this.showAnswerTimer);
        this.showAnswerRef.nativeElement.classList = "modal";
        this.ansPopup.nativeElement.classList = "modal";

        this.rightPopupfeedback.nativeElement.pause();     
        this.rightPopupfeedback.nativeElement.currentTime = 0;

        this.videoonshowAnspopUp.nativeElement.pause();
		this.videoonshowAnspopUp.nativeElement.currentTime = 0;
       
        if(Type=== "answerPopup") {
            this.popupclosedinRightWrongAns=true;   
            for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
                document.getElementsByClassName("ansBtn")[i].classList.remove("disableDiv");           
            }           
            if(this.ifRightAns) {
                this.Sharedservice.setShowAnsEnabled(true);
                this.overlay.nativeElement.classList.value="fadeContainer";
                this.blinkOnLastQues();
                if(!this.lastQuestionCheck){  
                                 
                }else if(this.lastQuestionCheck){              
                this.Sharedservice.setTimeOnLastQues(true);
                }
            } else if(this.ifWrongAns) {
                if(this.wrongCounter >= 3 && this.ifWrongAns) {
                    this.Sharedservice.setShowAnsEnabled(true);
                 } else {
                    this.Sharedservice.setShowAnsEnabled(false);
                 }
            }
        }
        if(Type === 'showAnswer'){
            if(this.ifRightAns) {
              this.blinkOnLastQues();
            }
        }else{

        }

     
    }

    
    checkSpeakerVoice(speaker) {
        if(!this.myAudiospeaker.nativeElement.paused){
        }else{
            speaker.imgsrc = speaker.imgorigional;          
             this.sprite.nativeElement.style="display:none";
			 (document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "";
			 this.disableSpeaker.nativeElement.children[0].style.cursor = "auto";
            clearInterval(this.speakerTimer);   
        }

    }
  

    getBasePath() {
        if (this.appModel && this.appModel.content) {
            return this.appModel.content.id + '';
        }
    }

    /**SPEAKER HOVER */
    onHoverSpeaker(speaker) {
        speaker.imgsrc = speaker.imghover;        
    }


    onHoverOutSpeaker(speaker) {
        speaker.imgsrc = speaker.imgorigional;        
    }

    /** SPEAKER SPRITE ON PLAY**/
    playSpeaker(el: HTMLAudioElement, speaker) {
        this.stopAllSounds();
        this.enableAllOptions();
        if (!this.instruction.nativeElement.paused) {
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
                if(this.maincontent){
                    this.maincontent.nativeElement.className = "disableDiv";
                }
                el.onended = () => {
                    if (this.maincontent) {
                        this.maincontent.nativeElement.className = "";
						(document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "";
                         this.sprite.nativeElement.style="display:none";
                    }
                }

            }
        }
    }
   

    /****function to check loaded image*****/
    checkImgLoaded() {
        if (!this.loadFlag) {          
            this.noOfImgsLoaded++;
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


  /**DISABLE CLICKABLES TILL VO IS PLAYING**/ 
	checkforQVO() {
		if (this.questionObj && this.questionObj.quesInstruction && this.questionObj.quesInstruction.url && this.questionObj.quesInstruction.autoPlay) {
            this.instruction.nativeElement.src = this.questionObj.quesInstruction.location == "content" 
            ? this.containgFolderPath + "/" + this.questionObj.quesInstruction.url: this.assetsPath + "/" + this.questionObj.quesInstruction.url    
            this.appModel.handlePostVOActivity(true);
            //this.maincontent.nativeElement.className = "disableDiv";  
            clearTimeout(this.rightTimer); 
            this.instruction.nativeElement.play();
			this.appModel.setLoader(false);
			this.instruction.nativeElement.onended = () => {
                this.appModel.handlePostVOActivity(false);              
                this.maincontent.nativeElement.className = "";
                document.getElementsByClassName("quesBox")[0].classList.add("blinkOn");
			}
		} else {
			this.appModel.handlePostVOActivity(false);
		}
	}


/**BLINK ON LAST QUESTION FUNCTIONALITY **/
    blinkOnLastQues() {
        this.Sharedservice.setLastQuesAageyBadheStatus(false);
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

  
      /**MUTE FUNCTIONALITY **/
    templatevolume(vol, obj) {

        if(obj.myAudiospeaker && obj.myAudiospeaker.nativeElement){
            obj.myAudiospeaker.nativeElement.volume = obj.appModel.isMute?0:vol;
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
        if (obj.videoonshowAnspopUp && obj.videoonshowAnspopUp.nativeElement) {
            obj.videoonshowAnspopUp.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
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
    
    

    /**OPTION HOVER */   
    playOptionHover(option, index){
        if (!this.myAudiospeaker.nativeElement.paused) {
            this.myAudiospeaker.nativeElement.pause();
            this.myAudiospeaker.nativeElement.currentTime = 0;
            this.speaker.imgsrc = this.speaker.imgorigional;
          }

        if (option && option.audio && option.audio.url) {
            this.playSound(option.audio, index);
        }
    }
    
    /**OPTION VO ON HOVER**/
    playSound(soundAssets, idx) {
        
        if(this.audio && this.audio.paused){
            if (soundAssets.location == 'content') {
                this.audio.src = this.containgFolderPath + '/' + soundAssets.url;
            } else {
                this.audio.src = soundAssets.url;
            }
            this.audio.load();
            this.audio.play();

            this.disableOtherOptions(idx, this.optionRef);


            // let i = 0; i < selectedBlock.nativeElement.parentElement.children.length
            // for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
            //     if (i != idx) {
            //         this.optionRef.nativeElement.children[i].classList.add("disableDiv");
            //     }
            // }
            // this.audio.onended = () => {
            //     for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
            //     if (i != idx && !this.optionRef.nativeElement.children[i].children[1].classList.contains("invisible")
            //         ) {
            //             this.optionRef.nativeElement.children[i].classList.remove("disableDiv");
            //         }
            //     }
            // }
            }
        
     }
    
   
    
    /** On selecting an option **/
    selectOpt(opt, idx) {    
        this.maincontent.nativeElement.className = "disableDiv";//Disable the mainContent when option is selected     
       this.popupclosedinRightWrongAns=false; 
       this.optionSelected = idx;
       this.quesBoxId=document.getElementsByClassName("blinkOn")[0];
       if (this.optionRef && this.optionRef.nativeElement && this.optionRef.nativeElement.children[this.optionSelected].children[1]) {           
           this.lastBlock=document.getElementsByClassName('blocks')[0].lastElementChild.id;
           this.option_order=this.myoption[this.optionSelected].correct_order;
           this.place_order=this.quesBoxId.id.split('_')[1];           
                      
            for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {   //Disable ShowansBtn
                document.getElementsByClassName("ansBtn")[i].classList.add("disableDiv");           
            }           

            this.stopAllSounds("clicked");

           this.quesBoxId.classList.remove("blinkOn");
            
               setTimeout(()=>{
                this.audio.pause();
                this.audio.currentTime = 0;
                if(this.option_order==this.place_order){// handle for correct attempt
                    this.answerPopupType = 'right';
                    this.attemptType = "manual";
                    this.appModel.stopAllTimer();
                    this.popupIcon = this.popupAssets.right_icon.url;
                    this.popupIconLocation = this.popupAssets.right_icon.location;
                    this.ifRightAns = true;
                    this.ifWrongAns = false;
    
                    /**Reset Wrong answer counter and show answer button */
                    // this.wrongCounter = 0;
                    // this.Sharedservice.setShowAnsEnabled(false);
                    if(this.quesObj.questype=="milestone"){ //For milestone type question adjusting traveller position
                        this.travellerid=document.getElementsByClassName("traveller")[0].id.split("_")[1];
                        this.quesObj.quesImage.stepImage[this.travellerid].url="markCrossed.png";
                        this.quesObj.quesImage.stepImage[this.travellerid].currentStep=false;
                        let i=this.quesObj.quesImage.stepImage[this.travellerid].step;
                        let stepLength=this.quesObj.quesImage.stepImage.length;
                        for(i;i<=this.quesObj.quesImage.stepImage[stepLength-1].step;i++){
                            if(this.quesObj.quesImage.stepImage[i].stepOn==true){
                                this.quesObj.quesImage.stepImage[i].url="traveller.png";
                                this.quesObj.quesImage.stepImage[i].currentStep=true;
                                break;
                            }                          
                        }                        
                    }
                    if (this.clapSound && this.clapSound.nativeElement) {
                        this.clapSound.nativeElement.play();
                    }
                    this.clapSound.nativeElement.onended = () =>{                    
                        
                        if(this.quesBoxId.id==this.lastBlock){  // If last block then open Popup
                            let ansPopup: HTMLElement = this.ansPopup.nativeElement as HTMLElement           
                            ansPopup.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
                            if(!this.popupclosedinRightWrongAns) {
                                if (this.rightPopupfeedback && this.rightPopupfeedback.nativeElement) {
                                    this.rightPopupfeedback.nativeElement.play();
                                }                                                 
                            } else {
                                this.Sharedservice.setShowAnsEnabled(true);
                            } 
                            this.rightPopupfeedback.nativeElement.onended = () => {
                                this.rightTimer=setTimeout(() => {
                                    this.closePopup('answerPopup');
                                }, 10000)
                                setTimeout(() => {
                                    this.attemptType = "manual";                              
                                }, 200)
                            } 
                        }else{  //Else play feedback sound
                            if (this.rightFeedback && this.rightFeedback.nativeElement) {
                                this.rightFeedback.nativeElement.play();
                            }
                        }
                        
                    }              
                    this.optionRef.nativeElement.children[this.optionSelected].children[1].classList.add('invisible');
                    this.saveOpt= this.optionRef.nativeElement.children[this.optionSelected].children[1];
                    this.quesBoxId.insertAdjacentHTML("beforeend", '<img src='+this.saveOpt.src+'>');
                    
                    // this.quesBoxId.classList.remove("blinkOn");
                    
                    this.rightFeedback.nativeElement.onended = () =>{
                        if(this.quesBoxId.nextSibling){
                            this.quesBoxId.nextSibling.classList.add("blinkOn");
                        }
                        this.resetQuestion();
                    }                
               }else{
                    this.ifRightAns = false;
                    this.ifWrongAns=true;
                    this.wrongCounter += 1;
                    
                    if (this.wrongFeedback && this.wrongFeedback.nativeElement) {
                        this.wrongFeedback.nativeElement.play();
                    }
                    this.idArray = [];
                   for (let i of this.myoption) {
                       this.idArray.push(i.id);
                   }
                   
                   this.wrongFeedback.nativeElement.onended = () =>{ //Reset next empty block to blink after feedback VO
                        this.doRandomize(this.myoption);                        
                        this.quesBoxId.classList.add("blinkOn"); 
                        if(this.wrongCounter >= 3 && this.ifWrongAns) {
                            this.Sharedservice.setShowAnsEnabled(true);
                        }else{
                            this.Sharedservice.setShowAnsEnabled(false);
                        }
                        this.resetQuestion();               
                    }   
               } 
               },500)
            
             
       }
   }
   
   /*Reset Question and Option*/ 
   resetQuestion(){             

        /** Enable ShowAns Button**/
        for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
            document.getElementsByClassName("ansBtn")[i].classList.remove("disableDiv");           
        }
        this.maincontent.nativeElement.className = "";
        /** Disable Empty Questions**/        
        for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
            this.optionRef.nativeElement.children[i].classList.remove("disableDiv");
            if(this.optionRef.nativeElement.children[i].children[1] && this.optionRef.nativeElement.children[i].children[1].classList.contains("invisible")){
                this.optionRef.nativeElement.children[i].classList.add("disableDiv");
            }
        }
    
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
      if (this.optionRef.nativeElement.children[j].classList.contains("disableDiv")  && !this.optionRef.nativeElement.children[j].children[1].classList.contains("invisible")) {
        this.optionRef.nativeElement.children[j].classList.remove("disableDiv");
      }
    }
  }

}