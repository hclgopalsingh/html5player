
import { Component, OnInit, HostListener, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { PlayerConstants } from '../../../common/playerconstants';
import { ActivatedRoute } from '@angular/router';
import { SharedserviceService } from '../../../services/sharedservice.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-template11',
    templateUrl: './template11.component.html',
    styleUrls: ['./template11.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class Template11Componenteva implements OnInit {
   
    blink: boolean = false;
    commonAssets: any = "";
    rightFeedbackVO: any;
    wrongFeedbackVO: any;
    rightPopupVO: any;
    showAnswerVO:any;
    wrongTimer:any;
    rightTimer:any;
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
    correctOpt: any = '';  
    isVideoLoaded: boolean = false;
    currentIdx: number = 0;  
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
    answerImageBase:any;
    answerImage:any;
    answerImagelocation:any;
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
    rightSelectTimer:any;
    wrongSelectTimer:any;
    showAnswerTimer:any;
    quesBoxId: any;
    option_order: any;
    rowsfilled: number = 0;

    @ViewChild('instruction') instruction: any;
    @ViewChild('audioEl') audioEl: any;
    @ViewChild('sprite') sprite: any;
    @ViewChild('speakerNormal') speakerNormal: any;
    @ViewChild('ansPopup') ansPopup: any;
    @ViewChild('wrongFeedback') wrongFeedback: any;
    @ViewChild('rightFeedback') rightFeedback: any;
    @ViewChild('showAnswerfeedback') showAnswerfeedback: any;
	@ViewChild('showAnswerRef') showAnswerRef: any;
    @ViewChild('rightPopupfeedback') rightPopupfeedback: any;
    @ViewChild('disableSpeaker') disableSpeaker: any;  
    @ViewChild('myAudiospeaker') myAudiospeaker: any;
    @ViewChild('maincontent') maincontent: any;
	@ViewChild('footerNavBlock') footerNavBlock: any;
    @ViewChild('clapSound') clapSound: any;
    @ViewChild('refQues') refQues: any;
    @ViewChild('overlay') overlay:any;
    @ViewChild('leftOptRef') leftOptRef: any;
    @ViewChild('rightOptRef') rightOptRef: any;
    
    
    
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
            this.showAnswerRef.nativeElement.classList = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
            if (this.showAnswerfeedback && this.showAnswerfeedback.nativeElement) {
                this.showAnswerfeedback.nativeElement.play();
                this.showAnswerfeedback.nativeElement.onended=() => {
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
        this.showAnswerSubscription.unsubscribe();
		this.stopAllSounds();
        clearTimeout(this.rightTimer);
        clearTimeout(this.clapTimer);
        clearTimeout(this.rightSelectTimer);
        clearTimeout(this.wrongSelectTimer);
    }
	
	stopAllSounds() {
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

        this.showAnswerfeedback.nativeElement.pause();
        this.showAnswerfeedback.nativeElement.currentTime = 0;
    }
	
    ngAfterViewChecked() {
        this.templatevolume(this.appModel.volumeValue, this);
    }

    setData() {
        let fetchedData: any = this.appModel.content.contentData.data;
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
        this.showAnswerVO = this.feedback.show_ans_sound;
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
        
        setTimeout(() => {
            if (this.footerNavBlock && this.footerNavBlock.nativeElement) {
                this.footerNavBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around";
            }
        }, 200)
		
    
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

        this.showAnswerfeedback.nativeElement.pause();      
        this.showAnswerfeedback.nativeElement.currentTime = 0;
       
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
        if(!this.audioEl.nativeElement.paused){
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

    /** SPEAKER SPRITE ON PLAY**/
    playSpeaker(el: HTMLAudioElement, speaker) {
        this.stopAllSounds();
        this.enableAllOptions(); 
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
            clearTimeout(this.rightTimer); 
            this.instruction.nativeElement.play();
			this.appModel.setLoader(false);
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
        if (obj.showAnswerfeedback && obj.showAnswerfeedback.nativeElement) {
            obj.showAnswerfeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.rightPopupfeedback && obj.rightPopupfeedback.nativeElement) {
            obj.rightPopupfeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
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
      }
      else {
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
    //this.disableSpeaker.nativeElement.classList.add("disableDiv");
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
       
       let optRefEl;
        if (optRef && optRef.children[1] && optRef.children[1].children[0]) {
            optRefEl = optRef.children[1].children[0] as HTMLElement;
        }
        else {
            return;
        }
        
        this.maincontent.nativeElement.className = "disableDiv";//Disable the mainContent when option is selected  
        /** Disable ShowAns Button**/
        for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
            document.getElementsByClassName("ansBtn")[i].classList.add("disableDiv");           
        }
        this.stopAllSounds();
        this.enableAllOptions();   
        this.popupclosedinRightWrongAns=false; 
        this.quesBoxId=document.getElementsByClassName("blinkBox")[0].parentElement.id.split('_')[1];
        
        /* Get correct answer id*/
        if (idx < 5) {
            this.option_order=this.myoption.leftoption[idx].correct_order;
        }
        else {
            this.option_order=this.myoption.rightoption[idx-5].correct_order;
        }
        
        if((this.option_order-1)==this.quesBoxId){
            this.rowsfilled++;
            opt.optBg = opt.optBg_original;

            this.quesObj.questionText[this.quesBoxId].isfilled=true;
            /*Hide Selected Option and populate in table*/
            if (idx < 5) {
                this.myoption.leftoption[idx].selected = true;
                this.quesObj.questionText[this.quesBoxId].answer.image=this.myoption.leftoption[idx].image;
            }
            else {
                this.myoption.rightoption[idx-5].selected = true;
                this.quesObj.questionText[this.quesBoxId].answer.image=this.myoption.rightoption[idx-5].image;
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
        }
        else{
            this.ifRightAns = false;
            this.ifWrongAns=true;
            this.wrongCounter += 1;
            
            if (this.wrongFeedback && this.wrongFeedback.nativeElement) {
                this.wrongFeedback.nativeElement.play();
            }
            let mainArray = [...this.myoption.leftoption, ...this.myoption.rightoption];
            this.idArray = [];
            for (let i of mainArray) {
            this.idArray.push(i.id);
            }
            
            this.wrongFeedback.nativeElement.onended = () =>{ 
                this.doRandomize(mainArray);
                if(this.wrongCounter >= 3 && this.ifWrongAns) {
                    this.Sharedservice.setShowAnsEnabled(true);
                }else{
                    this.Sharedservice.setShowAnsEnabled(false);
                }
                this.maincontent.nativeElement.className = ""; 
                /** Enable ShowAns Button**/
                for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
                    document.getElementsByClassName("ansBtn")[i].classList.remove("disableDiv");           
                }                              
            }   
        }  
   }
   /** TO SHUFFLE OPTIONS ON WRONG ATTEMPT**/
   doRandomize(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
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

    }
    var flag = this.arraysIdentical(array, this.idArray);
    if (flag) {
      this.doRandomize(array);
    }
    else {
      this.myoption.leftoption = array.slice(0, array.length / 2);
      this.myoption.rightoption = array.slice(array.length / 2, array.length);
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
   /*Reset Question and Option*/ 
   resetQuestion(highlightOn){           
        /** Enable ShowAns Button**/
        for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
            document.getElementsByClassName("ansBtn")[i].classList.remove("disableDiv");           
        }       
        this.quesObj.questionText[highlightOn].highlight=false;
        this.quesObj.questionText[highlightOn].blinkBox=false;        
        this.playRandomQues();
    
   }
   playRandomQues(){
    while(1)
    {   
        if(this.rowsfilled==10){
            break;
        }
        let nextHighlight=Math.floor(Math.random() * this.quesObj.questionText.length)
        if(this.quesObj.questionText[nextHighlight] && !this.quesObj.questionText[nextHighlight].isfilled){
            this.quesObj.questionText[nextHighlight].highlight=true;
            this.quesObj.questionText[nextHighlight].blinkBox=true;
            if(this.refQues.nativeElement && this.refQues.nativeElement.children[nextHighlight].getElementsByTagName('audio')[0]){
                this.refQues.nativeElement.children[nextHighlight].getElementsByTagName('audio')[0].play();
                this.myAudiospeaker.nativeElement.src= this.quesObj.questionText[nextHighlight].audio.location == "content" 
                    ? this.containgFolderPath + "/" + this.quesObj.questionText[nextHighlight].audio.url: this.assetsPath + "/" + this.quesObj.questionText[nextHighlight].audio.url
                this.refQues.nativeElement.children[nextHighlight].getElementsByTagName('audio')[0].onended= () =>{
                    this.maincontent.nativeElement.className = ""; 
                }
            }
            break;
        }else{
            continue;
        }
    }
   }
  
	

}