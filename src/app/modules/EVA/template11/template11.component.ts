
import { Component, OnInit, HostListener, ViewChild, OnDestroy, ViewEncapsulation, AfterViewInit, AfterViewChecked } from '@angular/core';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { PlayerConstants } from '../../../common/playerconstants';
import { ActivatedRoute } from '@angular/router';
import { SharedserviceService } from '../../../common/services/sharedservice.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-template11',
    templateUrl: './template11.component.html',
    styleUrls: ['./template11.component.scss'],
})
export class Template11Component implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
   
    blink: boolean = false;
    commonAssets: any = "";
    rightFeedbackVO: any;
    wrongFeedbackVO: any;
    rightPopupVO: any;
    wrongTimer:any;
    rightTimer:any;
    i = 0;
    j: number = 0;
    feedback: any = "";
    popupType: string = "";
    isLastQues: boolean = false;
    isLastQuesAct: boolean;
    // noOfImgs: number;
    // noOfImgsLoaded: number = 0;
    // loaderTimer: any;
    containgFolderPath: string = "";
    assetsPath: string = "";
    // loadFlag: boolean = false;  
    blinkTimeInterval: any;    
    attemptType: string = "";
    correctOpt: any = '';  
    isVideoLoaded: boolean = false;
    wrongCounter: number = 0; 
    instructiontext: string;
    timernextseg: any = "";
    idArray: any = [];
    hasEventFired: boolean = false;
    speaker: any;
    speakerTimer: any;
    clapTimer:any;
    ifRightAns: boolean = false;
    popupAssets:any;
    showAnswerSubscription:any;    
    popupIcon :any;
    popupIconLocation :any;
    isPopupClosed:boolean = false;
    answerPopupType:any;
    lastQuestionCheck:any;
    quesObj: any;
    myoption: any = [];
    questionObj: any;
    popupclosedinRightWrongAns:boolean=false;
    ifWrongAns:boolean= false;
    index: any;
    LastquestimeStart:boolean = false;
    audio = new Audio();
    speech=new Audio();
    rightSelectTimer:any;
    wrongSelectTimer:any;
    showAnswerTimer:any;
    quesBoxId: any;
    option_order: any;
    rowsfilled: number = 0;
    videoonshowAnspopUp: any;
    showAnswerRef: any;
    showAnswerfeedback: any;
    showAnswerPopup:any;
    disableMainContent:boolean=true;
    isOverlay:boolean=false;
    isSpriteHide:boolean=true;
    isPointerNone:boolean=false;
    validOptCount: number=0;
    mainArray:any=[];

    @ViewChild('instruction') instruction: any;
    @ViewChild('audioEl') audioEl: any;    
    @ViewChild('wrongFeedback') wrongFeedback: any;
    @ViewChild('rightFeedback') rightFeedback: any;
    @ViewChild('rightPopupfeedback') rightPopupfeedback: any;
    @ViewChild('myAudiospeaker') myAudiospeaker: any;
    @ViewChild('clapSound') clapSound: any;
    @ViewChild('ansPopup') ansPopup: any;
    @ViewChild('leftOptRef') leftOptRef: any;
    @ViewChild('rightOptRef') rightOptRef: any;
    
    
    constructor(private appModel: ApplicationmodelService, private activatedRoute: ActivatedRoute, private Sharedservice: SharedserviceService) {
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
            // this.loaderTimer = setTimeout(() => {
            //     this.appModel.setLoader(false);
            // }, 5000);
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
        this.appModel.navShow = 1;
    }



    ngOnInit() {
        this.Sharedservice.setShowAnsEnabled(false);
		this.Sharedservice.setLastQuesAageyBadheStatus(true);
        this.isSpriteHide=true;
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
                this.enableAllOptions();
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

               
    }
    

    /******Set template type for EVA******/
    setTemplateType(): void {
        this.activatedRoute.data.subscribe(data => {
            this.Sharedservice.sendData(data);
        })
    }
    
    ngOnDestroy() {
        this.showAnswerSubscription.unsubscribe();
		this.stopAllSounds();
        clearTimeout(this.rightTimer);
        clearTimeout(this.clapTimer);
        clearTimeout(this.rightSelectTimer);
        clearTimeout(this.wrongSelectTimer);
    }
    
    /** To stop all the sounds**/
	stopAllSounds() {
        this.audio.pause();
        this.audio.currentTime = 0;

        this.speech.pause();
        this.speech.currentTime = 0;
		
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

        this.videoonshowAnspopUp.nativeElement.pause();
		this.videoonshowAnspopUp.nativeElement.currentTime = 0;
    }
	
    ngAfterViewChecked() {
        this.templatevolume(this.appModel.volumeValue, this);
    }
    

    setData() {
        const fetchedData: any = this.appModel.content.contentData.data;
        this.instructiontext = fetchedData.instructiontext;
        this.commonAssets = fetchedData.commonassets;
        this.speaker = fetchedData.speaker;
        this.feedback = fetchedData.feedback;
        this.questionObj = fetchedData.quesObj;
        // this.noOfImgs = fetchedData.imgCount;
        this.popupAssets = fetchedData.feedback.popupassets;
		this.rightFeedbackVO = this.feedback.right_ans_sound;
        this.rightPopupVO = this.feedback.right_ansPop_sound;
        this.wrongFeedbackVO = this.feedback.wrong_ans_sound;
        this.showAnswerPopup = this.feedback.show_ans_popup;
        this.lastQuestionCheck = this.commonAssets.ques_control.isLastQues;
        this.commonAssets.ques_control.blinkingStatus=false;
        this.isLastQues = this.appModel.isLastSection;
        this.isLastQuesAct = this.appModel.isLastSectionInCollection;
        this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
        this.quesObj = JSON.parse(JSON.stringify(this.questionObj));
        this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
        this.myoption = JSON.parse(JSON.stringify(fetchedData.options));

        for(let i=0; i<this.quesObj.questionText.length;i++){
            if(this.quesObj.questionText[i].isfilled){
                this.rowsfilled++;
            }
        }
        this.mainArray = [...this.myoption.leftoption, ...this.myoption.rightoption];
        for(let i=0;i<this.mainArray.length;i++){
            if(this.mainArray[i].isShow){
                this.validOptCount++;
            }
        }
        
		
    
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
                this.isOverlay=true;
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
            if(this.rowsfilled==10) {
              this.blinkOnLastQues();
            }
        }else{

        }

     
    }

    
    checkSpeakerVoice(speaker) {
        if(!this.audioEl.nativeElement.paused){
        }else{
             speaker.imgsrc = speaker.imgorigional;          
             this.isSpriteHide=true;
             this.isPointerNone=false;
            clearInterval(this.speakerTimer);   
        }

    }
  

    getBasePath() {
        if (this.appModel && this.appModel.content) {
            return this.appModel.content.id + '';
        }
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
                    this.isSpriteHide=false;
                    this.isPointerNone=true;
                    this.checkSpeakerVoice(speaker);					
                }, 10)
            } else {
                if (this.myAudiospeaker && this.myAudiospeaker.nativeElement) {
                    this.myAudiospeaker.nativeElement.pause();
                }
                el.pause();
                el.currentTime = 0;
                el.play();                
                this.disableMainContent=true;
                el.onended = () => {
                    this.disableMainContent=false;
                    this.isPointerNone=false;
                    this.isSpriteHide=true;
                }

            }
        }
    }
   

    /****function to check loaded image*****/
    checkImgLoaded() {
        // if (!this.loadFlag) {          
        //     this.noOfImgsLoaded++;
        //     if (this.noOfImgsLoaded >= this.noOfImgs) {
        //         this.appModel.setLoader(false);   
        //         this.Sharedservice.setShowAnsEnabled(false); 
        //         this.loadFlag = true;
        //         clearTimeout(this.loaderTimer);
        //         this.checkforQVO();
        //     }
        // }
    }
    ngAfterViewInit(){
        this.appModel.setLoader(false);
        this.checkforQVO();
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
            clearTimeout(this.rightTimer); 
            this.instruction.nativeElement.play();
			// this.appModel.setLoader(false);
			this.instruction.nativeElement.onended = () => {
                this.appModel.handlePostVOActivity(false);              
                this.playRandomQues();
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
        if (obj.videoonshowAnspopUp && obj	.videoonshowAnspopUp.nativeElement) {
            obj.videoonshowAnspopUp.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.rightPopupfeedback && obj.rightPopupfeedback.nativeElement) {
            obj.rightPopupfeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }  
        if (obj.audio) {
            obj.audio.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.speech) {
            obj.speech.volume = obj.appModel.isMute ? 0 : vol;
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
    }


    onHoverOutSpeaker(speaker) {
        speaker.imgsrc = speaker.imgorigional;
    }

    
      /******On Hover option ********/
  onHoverOptions(option) {
    if (!this.myAudiospeaker.nativeElement.paused) {
      this.myAudiospeaker.nativeElement.pause();
      this.myAudiospeaker.nativeElement.currentTime = 0;
      this.speaker.imgsrc = this.speaker.imgorigional;
    }
    option.optBg = option.optBg_hover;    
  }

  /******Hover out option ********/
  onHoveroutOptions(option) {
    option.optBg = option.optBg_original;
  }


  /****** Option Hover VO  *******/
  playOptionHover(option, index) {
    if (option && option.audio && option.audio.url && !option.selected) {
      this.playSound(option.audio, index);
    }
  }
  /***** Play sound on option roll over *******/
  playSound(soundAssets, idx) {
    let selectedOptionBlock, otherOptionBlock;
    if (this.audio && this.audio.paused) {
      if (soundAssets.location == 'content') {
        this.audio.src = this.containgFolderPath + '/' + soundAssets.url;
      } else {
        this.audio.src = soundAssets.url;
      }
      this.audio.load();
      this.audio.play();
      if (idx <= 4) {
        selectedOptionBlock = this.leftOptRef;
        otherOptionBlock = this.rightOptRef;
      } else {
        idx = idx - 5;
        selectedOptionBlock = this.rightOptRef;
        otherOptionBlock = this.leftOptRef;
      }
      this.disableOtherOptions(idx, selectedOptionBlock, otherOptionBlock);
    }
  }

  /***** Disable speaker and options other than hovered until audio end *******/
  disableOtherOptions(idx, selectedBlock, otherBlock) {
    for (let i = 0; i < selectedBlock.nativeElement.parentElement.children.length; i++) {
      if (i != idx) {
        selectedBlock.nativeElement.parentElement.children[i].classList.add("disableDiv");
      }
    }
    for (let j = 0; j < otherBlock.nativeElement.parentElement.children.length; j++) {
      otherBlock.nativeElement.parentElement.children[j].classList.add("disableDiv");
    }
    this.audio.onended = () => {
      this.enableAllOptions();
    }
  }

 

  /***** Enable all options on audio end *******/
  enableAllOptions() {
    for (let i = 0; i < this.leftOptRef.nativeElement.parentElement.children.length; i++) {
      if (this.leftOptRef.nativeElement.parentElement.children[i].classList.contains("disableDiv") 
            && !this.myoption.leftoption[i].selected) {
        this.leftOptRef.nativeElement.parentElement.children[i].classList.remove("disableDiv");
      }
    }
    for (let j = 0; j < this.rightOptRef.nativeElement.parentElement.children.length; j++) {
      if (this.rightOptRef.nativeElement.parentElement.children[j].classList.contains("disableDiv")
            && !this.myoption.rightoption[j].selected) {
        this.rightOptRef.nativeElement.parentElement.children[j].classList.remove("disableDiv");
      }
    }
  }
    
       
    
     /** On selecting an option **/
     selectOpt(opt, optRef, idx) {   
       
        if (!optRef || !optRef.children[1] || !optRef.children[1].children[0]) {
            return;
        }      
        opt.optBg = opt.optBg_original;//Reset Hover image to normal
        this.disableMainContent=true;//Disable the mainContent when option is selected  
        
        for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {// Disable ShowAns Button
            document.getElementsByClassName("ansBtn")[i].classList.add("disableDiv");           
        }
        this.stopAllSounds();
        this.enableAllOptions();   
        this.popupclosedinRightWrongAns=false; 
        this.quesBoxId=document.getElementsByClassName("blinkBox")[0].parentElement.id.split('_')[1];
        
        /* Get correct answer id*/
        if (idx < 5) {
            this.option_order=this.myoption.leftoption[idx].correct_order;
        } else {
            this.option_order=this.myoption.rightoption[idx-5].correct_order;
        }
        
        if((this.option_order-1)==this.quesBoxId){
            this.rowsfilled++;

            this.quesObj.questionText[this.quesBoxId].isfilled=true;
            /*Hide Selected Option and populate in table*/
            if (idx < 5) {
                this.myoption.leftoption[idx].selected = true;
                this.quesObj.questionText[this.quesBoxId].answer.image=this.myoption.leftoption[idx].image;
                this.quesObj.questionText[this.quesBoxId].totalDigits=this.myoption.leftoption[idx].totalDigits;
            } else {
                this.myoption.rightoption[idx-5].selected = true;
                this.quesObj.questionText[this.quesBoxId].answer.image=this.myoption.rightoption[idx-5].image;
                this.quesObj.questionText[this.quesBoxId].totalDigits=this.myoption.rightoption[idx-5].totalDigits;
            }
            this.answerPopupType = 'right';
            this.attemptType = "manual";
            this.appModel.stopAllTimer();
            this.popupIcon = this.popupAssets.right_icon.url;
            this.popupIconLocation = this.popupAssets.right_icon.location;
            this.ifRightAns = true;
            this.ifWrongAns = false;
         
            if (this.clapSound && this.clapSound.nativeElement) {
                this.clapSound.nativeElement.play();
            }
            this.clapSound.nativeElement.onended = () =>{                    
                if(this.rowsfilled==10){  // If last block then open Popup
                    this.appModel.storeVisitedTabs();
                    this.quesObj.questionText[this.quesBoxId].highlight=false;
                    this.quesObj.questionText[this.quesBoxId].blinkBox=false;
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
            
            this.rightFeedback.nativeElement.onended = () =>{               
                this.resetQuestion(this.quesBoxId);
            }
        } else{
            this.ifRightAns = false;
            this.ifWrongAns=true;
            this.wrongCounter += 1;
            
            if (this.wrongFeedback && this.wrongFeedback.nativeElement) {
                this.wrongFeedback.nativeElement.play();
            }
            this.mainArray = [...this.myoption.leftoption, ...this.myoption.rightoption];
            
            this.idArray = [];
            for (let i of this.mainArray) {
            this.idArray.push(i.id);
            }
            
            this.wrongFeedback.nativeElement.onended = () =>{ 
                this.doRandomize(this.mainArray);
                if(this.wrongCounter >= 3 && this.ifWrongAns) {
                    this.Sharedservice.setShowAnsEnabled(true);
                }else{
                    this.Sharedservice.setShowAnsEnabled(false);
                }
                this.disableMainContent=false; //Enable main content
                
                for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {    //Enable ShowAns Button
                    document.getElementsByClassName("ansBtn")[i].classList.remove("disableDiv");           
                }                              
            }   
        }  
   }
   /** TO SHUFFLE OPTIONS ON WRONG ATTEMPT**/
   doRandomize(array) {
    var currentIndex = array.length-1, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...      
      if(array[currentIndex] && array[currentIndex].isShow==false){//If index does not exists and option is invalid move to next index
        currentIndex -= 1;
      }else{        
        randomIndex = Math.floor(Math.random() * currentIndex);
        if(array[randomIndex] && array[randomIndex].isShow==true){ //If index exists and option is valid           
            var optionBg1 = array[currentIndex].optBg;
            var img_hover1 = array[currentIndex].optBg_hover;
            var text1copy = array[currentIndex].optBg_original;

            var optionBg2 = array[randomIndex].optBg;
            var img_hover2 = array[randomIndex].optBg_hover;
            var text2copy = array[randomIndex].optBg_original;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;

            array[currentIndex].optBg = optionBg1;
            array[currentIndex].optBg_hover = img_hover1;
            array[currentIndex].optBg_original = text1copy;

            array[randomIndex].optBg = optionBg2;
            array[randomIndex].optBg_hover = img_hover2;
            array[randomIndex].optBg_original = text2copy;
            
            if(this.validOptCount==2){// If there are only 2 option then exit to avoid double swap
                break;
            }else{
                currentIndex -= 1;
            }
        } else{
            continue;
        }       
      }
    }
    var flag = this.arraysIdentical(array, this.idArray);
    if (flag) {
      this.doRandomize(array);
    } else {
      this.myoption.leftoption = array.slice(0, array.length / 2);
      this.myoption.rightoption = array.slice(array.length / 2, array.length);
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
   /*Reset Question and Option*/ 
   resetQuestion(highlightOn){           
             
        this.quesObj.questionText[highlightOn].highlight=false;
        this.quesObj.questionText[highlightOn].blinkBox=false;        
        this.playRandomQues();
   }

   /** Higlighting a random row **/
   playRandomQues(){
     
        while(this.rowsfilled!=10){
            let nextHighlight=Math.floor(Math.random() * this.quesObj.questionText.length)
            if(this.quesObj.questionText[nextHighlight] && !this.quesObj.questionText[nextHighlight].isfilled){
                this.quesObj.questionText[nextHighlight].highlight=true;
                this.quesObj.questionText[nextHighlight].blinkBox=true;           
                if (this.quesObj.questionText[nextHighlight].audio.location == 'content') {
                    this.speech.src = this.containgFolderPath + '/' + this.quesObj.questionText[nextHighlight].audio.url;
                } else {
                    this.speech.src = this.quesObj.questionText[nextHighlight].audio.url;
                }
                this.speech.load();
                this.speech.play();
                this.myAudiospeaker.nativeElement.src= this.quesObj.questionText[nextHighlight].audio.location == "content" 
                        ? this.containgFolderPath + "/" + this.quesObj.questionText[nextHighlight].audio.url: this.assetsPath + "/" + this.quesObj.questionText[nextHighlight].audio.url
                this.speech.onended= () =>{
                    this.disableMainContent=false;
                    /** Enable ShowAns Button**/
                    for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
                        if(document.getElementsByClassName("ansBtn")[i].classList.contains("disableDiv")){
                            document.getElementsByClassName("ansBtn")[i].classList.remove("disableDiv");
                        }                                       
                    }                     
                }
                break;
            }
        }               
   }	
}
