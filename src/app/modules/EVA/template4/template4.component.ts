
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
	rightPopup: any;
	wrongPopup: any;
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
    correct_ans_index: any;
    speakerTimer: any;
    clapTimer:any;
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
    // quesEmptyTxtIndx: number = -1;
    // quesMatraTxtIndx: number = -1;
    isOptionSelected: boolean = false;
    quesObj: any;
    // quesObjCopy: any;
    optionSelected: number = -1;
    isRightSelected: boolean = false;
    isWrongSelected: boolean = false;
    myoption: any = [];
    optionObj: any;
    questionObj: any;
    correct_opt_index: any;
    popupclosedinRightWrongAns:boolean=false;
    ifWrongAns:boolean= false;
    index: any;
    LastquestimeStart:boolean = false;
    audio = new Audio();
    saveOpt : any;
    rightSelectTimer:any;
    wrongSelectTimer:any;
    option_order:any;
    place_order:any;

    @ViewChild('instruction') instruction: any;
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
    @ViewChild('clapSound') clapSound: any;
    @ViewChild('optionRef') optionRef: any;
    @ViewChild('overlay') overlay:any;
    quesBoxId: any;
    lastBlock: any;



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
            //Saving correct option for showing in Popup 
            // if(this.aksharQuestion){
            //     this.quesObj.questionText[this.quesEmptyTxtIndx] = this.correct_opt_index; 
            // }else{
            //     this.quesObj.questionText[this.quesMatraTxtIndx].hasmatra=true;
            //     this.quesObj.questionText[this.quesMatraTxtIndx].matravalue=this.correct_opt_index.url.split('.')[0].split('/').pop();
            //     this.quesObj.questionText[this.quesMatraTxtIndx].matra.url=this.correct_opt_index.url;
            //     this.quesObj.questionText[this.quesMatraTxtIndx].matra.location=this.correct_opt_index.location;
            // }
            this.showAnswerRef.nativeElement.classList = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
            if (this.showAnswerfeedback && this.showAnswerfeedback.nativeElement) {
                this.showAnswerfeedback.nativeElement.play();
                this.showAnswerfeedback.nativeElement.onended=() => {
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
        clearTimeout(this.rightTimer);
        clearTimeout(this.clapTimer);
        clearTimeout(this.rightSelectTimer);
        clearTimeout(this.wrongSelectTimer);
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
        this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
        this.myoption = fetchedData.options.opts;
        
        setTimeout(() => {
            if (this.footerNavBlock && this.footerNavBlock.nativeElement) {
                this.footerNavBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around";
            }
        }, 200)
    
    }
    /** TO SHUFFLE OPTIONS ON WRONG ATTEMPT**/
        doRandomize(array) {        
        var currentIndex = array.length, temporaryValue, randomIndex;
       // While there remain elements to shuffle...
        while (0 !== currentIndex) {
           
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            var img_hover1 = array[currentIndex].optBgHover;
            var text1copy = array[currentIndex].optBgOriginal;
            var optionBg1 = array[currentIndex].optBg;
            
            var img_hover2 = array[randomIndex].optBgHover;
            var text2copy = array[randomIndex].optBgOriginal;
            var optionBg2 = array[randomIndex].optBg;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
            
            array[currentIndex].optBgHover = img_hover1;
            array[currentIndex].optBgOriginal = text1copy;
            array[currentIndex].optBg = optionBg1;
            
            array[randomIndex].optBgHover = img_hover2;
            array[randomIndex].optBgOriginal = text2copy;
            array[randomIndex].optBg = optionBg2;
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
            if (a[i].id == b[i]) {
                return true;
            }
        }
        return false;
    }

   /** CLOSE POPUP FUNCTIONALITY**/
    closePopup(Type){
        this.showAnswerRef.nativeElement.classList = "modal";
        this.ansPopup.nativeElement.classList = "modal";
        this.wrongFeedback.nativeElement.pause();    
        this.wrongFeedback.nativeElement.currentTime = 0;

        this.rightFeedback.nativeElement.pause();     
        this.rightFeedback.nativeElement.currentTime = 0;

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
        if(!this.myAudiospeaker.nativeElement.paused){
        }else{
            speaker.imgsrc = speaker.imgorigional;          
             this.sprite.nativeElement.style="display:none";
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
            this.maincontent.nativeElement.className = "disableDiv";  
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
    }

    /**OPTION HOVER */
    // onHoverOptions(option, index) {
    //     option.optBg = option.optBgHover;        
    // }
    playOptionHover(option, index){
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
         for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
             if (i != idx) {
                 this.optionRef.nativeElement.children[i].classList.add("disableDiv");
             }
         }
         this.audio.onended = () => {
             for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
                 if (i != idx) {
                     this.optionRef.nativeElement.children[i].classList.remove("disableDiv");
                 }
             }
         }
        }
     }
    
    // onHoveroutOptions(option, index) {
    //     option.optBg = option.optBgOriginal;
    // }
    
    /** On selecting an akshar **/
    selectOpt(opt, idx) {        
    //    this.popupclosedinRightWrongAns=false; 
       this.optionSelected = idx;
       this.quesBoxId=document.getElementsByClassName("blinkOn")[0];
       if (this.optionRef && this.optionRef.nativeElement && this.optionRef.nativeElement.children[this.optionSelected].children[1]) {           
           this.lastBlock=document.getElementsByClassName('blocks')[0].lastElementChild.id;
           this.option_order=this.myoption[this.optionSelected].correct_order;
           this.place_order=this.quesBoxId.id.split('_')[1];
           
           this.maincontent.nativeElement.className = "disableDiv";//Disable the mainContent when option is selected           
           this.quesBoxId.classList.remove("blinkOn");

           if(this.option_order==this.place_order){// handle for correct attempt
                this.ifRightAns = true;
                this.ifWrongAns = false;
                this.wrongCounter = 0;
                // if (this.clapSound && this.clapSound.nativeElement) {
                //     this.clapSound.nativeElement.play();
                // }
                // this.clapSound.nativeElement.onended = () =>{
                    if(this.quesObj.questype=="milestone"){
                        this.quesObj.quesImage.stepImage[this.place_order-1].url="markCrossed.png";
                        this.quesObj.quesImage.stepImage[this.place_order].url="traveller.png";
                    }
                    console.log(this.quesBoxId.id);
                    console.log(this.lastBlock);
                    if(this.quesBoxId.id==this.lastBlock){
                        let ansPopup: HTMLElement = this.ansPopup.nativeElement as HTMLElement           
                        ansPopup.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
                    }else{
                        // if (this.rightFeedback && this.rightFeedback.nativeElement) {
                        //     this.rightFeedback.nativeElement.play();
                        // }
                        console.log("Else");
                    }
                    
                // }              
                this.optionRef.nativeElement.children[this.optionSelected].children[1].classList.add('invisible');
                //this.emptyOpt = this.quesObj.questionText[this.quesEmptyTxtIndx];
                this.saveOpt= this.optionRef.nativeElement.children[this.optionSelected].children[1];
                this.quesBoxId.insertAdjacentHTML("beforeend", '<img src='+this.saveOpt.src+'>');
                
                // this.quesBoxId.classList.remove("blinkOn");
                
                // this.rightFeedback.nativeElement.onended = () =>{
                    this.maincontent.nativeElement.className = "";
                    if(this.quesBoxId.nextSibling){
                        this.quesBoxId.nextSibling.classList.add("blinkOn");
                    }
                // }                
                // this.isOptionSelected = true;               
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
               
               this.wrongFeedback.nativeElement.onended = () =>{
                    this.doRandomize(this.myoption);
                    this.maincontent.nativeElement.className = "";
                    this.quesBoxId.classList.add("blinkOn"); 
                    if(this.wrongCounter >= 3 && this.ifWrongAns) {
                        this.Sharedservice.setShowAnsEnabled(true);
                    }               
                }   
           }
           
        this.resetQuestion();
        //    this.quesObj.questionText[this.quesEmptyTxtIndx] = opt;//Saving selected option for showing in Popup 
           
           /*Disable Other options,speaker and ShowansBtn*/
        // for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
		// 	this.optionRef.nativeElement.children[i].classList.add("disableDiv");
        // }
        // this.speakerNormal.nativeElement.classList.add("disableDiv");
        // for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
		// 	document.getElementsByClassName("ansBtn")[i].classList.add("disableDiv");           
        // }     
           if (opt && opt.isCorrect) {
               // handle for correct attempt
            //    this.isRightSelected=true;
            //    this.isWrongSelected=false;
            //    this.answerPopupType = 'right';
            //     this.correctOpt = opt;
            //     this.attemptType = "manual";
            //     this.appModel.stopAllTimer(); 
            //     this.popupIcon = this.popupAssets.right_icon.url;
            //     this.popupIconLocation = this.popupAssets.right_icon.location;

            //     this.ifRightAns = true;
            //     this.rightSelectTimer=setTimeout(()=>{                    
            //         if (this.rightFeedback && this.rightFeedback.nativeElement) {
            //             this.clapSound.nativeElement.play();
            //             this.clapTimer=setTimeout(() => {
            //                this.clapSound.nativeElement.pause();     
            //                this.clapSound.nativeElement.currentTime = 0;
            //                let ansPopup: HTMLElement = this.ansPopup.nativeElement as HTMLElement           
            //             ansPopup.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
                    
            //                if(!this.popupclosedinRightWrongAns) {
            //                 this.rightFeedback.nativeElement.play();
                            
            //                } else {
            //                 this.Sharedservice.setShowAnsEnabled(true);
            //                } 
            //             }, 2000);
                        
            //         }
            //         this.rightFeedback.nativeElement.onended = () => {
            //             this.rightTimer=setTimeout(() => {
            //                 this.closePopup('answerPopup');
            //             }, 10000)
            //                 setTimeout(() => {
            //                     this.attemptType = "manual";                              
            //                 }, 200)
            //             }
            //     },1000)                
           
            } else {          
               //handle for wrong attempt
        //        this.isRightSelected=false;
        //        this.isWrongSelected=true;
        //        this.answerPopupType = 'wrong';
        //        this.ifWrongAns=true;
        //        this.wrongCounter += 1;               
        //        this.idArray = [];
        //        for (let i of this.myoption) {
        //            this.idArray.push(i.id);
        //        } 
        //        this.wrongSelectTimer=setTimeout(()=>{
        //         let ansPopup: HTMLElement = this.ansPopup.nativeElement as HTMLElement
        //         ansPopup.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
        //         this.popupIcon = this.popupAssets.wrong_icon.url;
        //         this.popupIconLocation = this.popupAssets.wrong_icon.location;
        //         this.appModel.stopAllTimer();
                
        //         if (this.wrongFeedback && this.wrongFeedback.nativeElement) {
        //             this.wrongFeedback.nativeElement.play();
        //         }		
        //         this.wrongFeedback.nativeElement.onended = () => {
        //             setTimeout(() => {
        //                 this.closePopup('answerPopup');
        //             }, 10000)                    
        //         }
        //         this.resetQuestion();//To reset question on wrong attempt               
                
        //        },1000)
           }
       }
   }
   
   /*Reset Question and Option*/ 
   resetQuestion(){               
    
    /** Disable Empty Questions**/
    for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
        if(this.optionRef.nativeElement.children[i].children[1].classList.contains("invisible")){
            this.optionRef.nativeElement.children[i].classList.add("disableDiv");
        }
        
    }
    
   }
    
	

}