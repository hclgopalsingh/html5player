
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
    selector: 'app-template1',
    templateUrl: './template1.component.html',
    styleUrls: ['./template1.component.css']
})
export class Template1Component implements OnInit {

    audio = new Audio();
    blink: boolean = false;
    commonAssets: any = "";
    confirmPopupAssets: any;
	rightPopup: any;
	wrongPopup: any;
    feedbackPopup: any;
    ifWrongAns:boolean = false;
    wrongTimer:any;
    showAnsTempArray :any = [];
    i = 0;
    j: number = 0;
    //myoption: any = [];
    question: any = "";
    feedback: any = "";
    isLastActivity: any = "";
    bool: boolean = false;
    popupType: string = "";
    helpAudio: any = "";
    isFirstQues: boolean;
    isLastQues: boolean = false;
    isAutoplayOn: boolean;
    isLastQuesAct: boolean;
    noOfImgs: number;
    noOfImgsLoaded: number = 0;
    loaderTimer: any;
    containgFolderPath: string = "";
    assetsPath: string = "";
    loadFlag: boolean = false;
    optionHolder: any = [];
    optionObj: any;
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
    randomOptIndx: number;
    blinkFlag: boolean = true;
    optionArr: any = [];
    blinkInterval: any;
    currentIdx: number = 0;  
    submitButtonCounter: number = 0;
    showAnswerCounter: number = 0;
    wrongCounter: number = 0;
    feedbackAudio: any;
    rightanspopUpheader_img: boolean = false;
    wronganspopUpheader_img: boolean = false;
    showanspopUpheader_img: boolean = false;
    styleHeaderPopup: any;
    styleBodyPopup: any;
    instructiontext: string;
    timernextseg: any = "";
    idArray: any = [];
    hasEventFired: boolean = false;
    speaker: any;
    tempTimer:any;
    quesInfo: any = "";
    tempSubscription: Subscription;
    answers: any = "";
    tempAnswers: any = [];
    closed:boolean = false;
    correct_ans_index: any;
    speakerTimer: any;
    popUpObj: any;
    wrongImgOption: any;   
	rightAnsSoundUrl: string = "";
    popUpClosed: boolean = false;
    ifRightAns: boolean = false;
    fixedOptions:any = [];
    quesEmptyTxtIndx: number = -1;
    isOptionSelected: boolean = false;
    quesObjCopy: any;
    optionSelected: number = -1;
    boundingClientFrom: any;
    boundingClientTo: any;
    emptyOpt:any;
    isRightSelected: boolean = false;
    myoption: any = [];

    @ViewChild('narrator') narrator: any;
    @ViewChild('audioEl') audioEl: any;
    @ViewChild('sprite') sprite: any;
    @ViewChild('speakerNormal') speakerNormal: any;
    @ViewChild('correctAns') correctAns: any;
    @ViewChild('feedbackVoRef') feedbackVoRef: any;
    @ViewChild('optionRef') optionRef: any;
	@ViewChild('confirmModalRef') confirmModalRef: any;
    @ViewChild('wrongFeedback') wrongFeedback: any;
    @ViewChild('rightFeedback') rightFeedback: any;
    @ViewChild('ShowAnswerSound') showAnswerSound: any;
    @ViewChild('disableSpeaker') disableSpeaker: any;  
    @ViewChild('myAudiospeaker') myAudiospeaker: any;
    @ViewChild('maincontent') maincontent: any;
	@ViewChild('footerNavBlock') footerNavBlock: any;
    //@ViewChild('ansBlock') ansBlock: any;
    @ViewChild('mainContainer') mainContainer: any;
    @ViewChild('instructionVO') instructionVO: any;
    @ViewChild('instructionBar') instructionBar: any;
    @ViewChild('quesVORef') quesVORef: any;
    @ViewChild('refQues') refQues: any;
    



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
            }
            // } else if (val == "submitAnswer") {
            //     if (this.confirmSubmitRef && this.confirmSubmitRef.nativeElement) {
            //         this.confirmSubmitRef.nativeElement.classList = "displayPopup modal";
            //         this.appModel.notifyUserAction();
            //         //this.blinkOnLastQues();
            //         this.instructionVO.nativeElement.pause();
            //         this.instructionVO.nativeElement.currentTime = 0;
            //     }
            // } else if (val == "replayVideo") {
            //     if (this.confirmReplayRef && this.confirmReplayRef.nativeElement) {
            //         this.confirmReplayRef.nativeElement.classList = "displayPopup modal";
            //         this.appModel.notifyUserAction();
            //         //this.blinkOnLastQues();
            //         this.instructionVO.nativeElement.pause();
            //         this.instructionVO.nativeElement.currentTime = 0;
            //     }
            // }
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
				if (this.correctAns && this.correctAns.nativeElement) {
					$("#instructionBar").addClass("disable_div");
					this.correctAns.nativeElement.classList = "displayPopup modal";
					// this.setFeedbackAudio(mode);
				}

				console.log("mode manuall", mode)

			} else if (mode == "auto") {
				console.log("mode manual2 show answer working", mode)
				this.showAnswers();
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
        //this.myoption = fetchedData.options;
        this.commonAssets = fetchedData.commonassets;
        this.speaker = fetchedData.speaker;
        this.feedback = fetchedData.feedback;
        this.questionObj = fetchedData.quesObj;
        this.question = fetchedData.ques;
        this.noOfImgs = fetchedData.imgCount;
        this.confirmPopupAssets = fetchedData.feedback.confirm_popup;
		this.correct_ans_index = this.feedback.correct_ans_index;
		this.rightPopup = this.feedback.rightFeedback;
        this.wrongPopup = this.feedback.wrongFeedback;
        this.isLastQues = this.appModel.isLastSection;
        this.isLastQuesAct = this.appModel.isLastSectionInCollection;
        //this.rightAnsSoundUrl = this.myoption[this.feedback.correct_ans_index]
        this.quesObjCopy = JSON.parse(JSON.stringify(this.questionObj));
        this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
        this.myoption = fetchedData.options.opts;
        for (let i = 0; i < this.questionObj.questionText.length; i++) {
            if (this.questionObj.questionText[i].isblank) {
                this.quesEmptyTxtIndx = i;
                break;
            }
        }

        if (this.questionObj.quesVideo && this.questionObj.quesVideo.autoPlay && !this.appModel.isVideoPlayed) {
            this.isPlayVideo = true;	
          } else {     
            this.isPlayVideo = false;
             this.tempTimer = setTimeout(() => {
                this.noOfImgsLoaded = 0;
                this.appModel.setLoader(true);
                this.loaderTimer = setTimeout(() => {
                    this.appModel.setLoader(false);
                }, 5000)
            }, this.quesInfo.formatTimeout)

          }

        setTimeout(() => {
            if (this.footerNavBlock && this.footerNavBlock.nativeElement) {
                this.footerNavBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around";
            }
        }, 200)
    
    }

    checkAnswer(option, event, idx) {   
          // setShowAnsEnabled
        // logic to check what user has done is correct
        if (option.id == this.feedback.correct_ans_index) {
            alert('This is correct answer');
            this.Sharedservice.setShowAnsEnabled(true);
            this.correctOpt = option;
            this.wrongImgOption = option
			this.feedbackPopup = this.rightPopup;
			this.attemptType = "manual";
			this.appModel.stopAllTimer();
			//Analytics
			//fireworks 
			this.ifRightAns = true;
			let correctAns: HTMLElement = this.correctAns.nativeElement as HTMLElement
			correctAns.className = "modal d-flex align-items-center justify-content-center showit correctAns dispFlex";

			this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div";
			$("#instructionBar").css("pointer-events", 'none');
			this.feedbackVoRef.nativeElement.src = this.feedbackPopup.feedbackVo.location == "content" ? this.containgFolderPath + "/" + this.feedbackPopup.feedbackVo.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackPopup.feedbackVo.url + "?someRandomSeed=" + Math.random().toString(36);
			//this.feedbackVoRef.nativeElement.play();

			setTimeout(() => {
				this.feedbackVoRef.nativeElement.play();
			}, 50)

			
			setTimeout(()=>{
				if(!this.popUpClosed){
				this.removeEvents();
				this.ifRightAns = false;
				$("#instructionBar").addClass("disable_div");
				// $("#optionsBlock .options").css("opacity", "0.3");
				// $("#instructionBar").css("opacity", "0.3");
				this.blinkOnLastQues();
				}
                },6000 )
                


            // var popup = document.getElementById("correctAns");
            // if (popup)
            //     popup.className = "d-flex align-items-center justify-content-center showit";
            // //disable click on options and speaker
            // var optionsBlock = document.getElementById("optionsBlock")
            // var disableSpeaker = document.getElementById("disableSpeaker")
            // optionsBlock.className = optionsBlock.className.concat(" disable");
            // disableSpeaker.className = disableSpeaker.className.concat(" disable");
            // this.checkNextActivities();
 
        } else {
            this.wrongCounter += 1;
            if(this.wrongCounter === 3){
                this.Sharedservice.setShowAnsEnabled(true); 
            }else{
                this.Sharedservice.setShowAnsEnabled(false);
            }
           
            this.idArray = [];
            // for (let i of this.myoption) {
            //     this.idArray.push(i.id);
            // } 
            
            
            this.popUpObj = option;
			this.ifWrongAns = true;
			this.feedbackPopup = this.wrongPopup;
			this.appModel.enableReplayBtn(false);
			this.wrongImgOption = option  //setting wrong image options
			//this.ansBlock.nativeElement.className = "optionsBlock disable_div";
			let correctAns: HTMLElement = this.correctAns.nativeElement as HTMLElement
			correctAns.className = "modal d-flex align-items-center justify-content-center showit correctAns dispFlex";

			//this.appModel.stopAllTimer();
			//play wrong feed back audio

			setTimeout(() => {
				if (this.wrongFeedback && this.wrongFeedback.nativeElement) {
					this.wrongFeedback.nativeElement.play();
				}
			}, 50)

			
			this.wrongFeedback.nativeElement.onended = () => {
				if(!this.closed){
					this.wrongTimer = setTimeout(() => {
						this.correctAns.nativeElement.classList = "modal";
						this.appModel.notifyUserAction();
						// this.appModel.wrongAttemptAnimation();	
					}, 2000);
				}
			}
		}



           // this.doRandomize(this.myoption);
//}
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
            var text1 = array[currentIndex].url;
            var text1copy = array[currentIndex].optBgOriginal;
            var optionBg1 = array[currentIndex].optBg;
            
            var img_hover2 = array[randomIndex].optBgHover;
            var text2 = array[randomIndex].url;
            var text2copy = array[randomIndex].optBgOriginal;
            var optionBg2 = array[randomIndex].optBg;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
            
            array[currentIndex].optBgHover = img_hover1;
            array[currentIndex].url = text1;
            array[currentIndex].optBgOriginal = text1copy;
            array[currentIndex].optBg = optionBg1;
            
            array[randomIndex].optBgHover = img_hover2;
            array[randomIndex].url = text2;
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


    isPaused() {
        return this.audio.paused;
    }

    removeEvents() {
        // remove event handlers for all clickable items in the dom
        this.blink = false;
        clearTimeout(this.timernextseg);
    }

    postWrongAttemptTask(){
		this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center ";
		this.appModel.notifyUserAction();
		// for (this.j = 0; this.j < this.answers.length; this.j++) {
		// 	document.getElementById("optimage" + this.j).className = "img-fluid"
		// }
		// this.myoption.forEach(element => {
		// 	element.show = true;
		// });
		this.answers = this.appModel.content.contentData.data['answers'];
		this.tempAnswers.length = 0;
		//console.log("this.ansBlock.nativeElement",this.ansBlock.nativeElement);
		this.i = 0 ;
		this.j = 0;
		this.appModel.enableSubmitBtn(false);

	}

    wrongAnsClose(){
		this.closed = true;
		this.correctAns.nativeElement.classList = "modal";
		this.correctAns.nativeElement.classList = "modal";
		this.appModel.notifyUserAction();
		// this.appModel.wrongAttemptAnimation();	
		
	}



    showAnsModal(opt) {
		this.attemptType = "hideAnimation"
		this.ifWrongAns = false;
		this.ifRightAns = false;
		this.wrongImgOption = this.rightAnsSoundUrl
		this.feedbackPopup = this.rightPopup;
		let correctAns: HTMLElement = this.correctAns.nativeElement as HTMLElement
		correctAns.className = "modal d-flex align-items-center justify-content-center showit correctAns dispFlex";
		//disable option and question on right attempt
		this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div";
		// if (this.ansBlock && this.ansBlock.nativeElement) {
		// 	this.ansBlock.nativeElement.className = "disable-ansBlock";
		// }
		$("#instructionBar").addClass("disable_div");
		$("#instructionBar").css("pointer-events", 'none');
		//$("#ansBlock .options").css("opacity", "0.3");
		$("#instructionBar").css("opacity", "0.3");
		// $("#quesImage").css("opacity", "0.3");
		// $("#quesImage").css("pointer-events", 'none');
		// this.feedbackVoRef.nativeElement.src = this.containgFolderPath + "/" + this.feedback.show_Answer_sound.url + "?someRandomSeed=" + Math.random().toString(36) ;
			//this.feedbackVoRef.nativeElement.play();

			setTimeout(() => {
				this.feedbackVoRef.nativeElement.play();
			}, 50)
		setTimeout(() => {
			this.removeEvents();
			this.blinkOnLastQues();
		}, 5000);
    }
    


	sendFeedback(id: string, flag: string) {
		console.log(id);
		console.log(flag);
		this.confirmModalRef.nativeElement.classList = "modal";
		this.correctAns.nativeElement.classList = "modal";
		// this.wrongOptAudio.nativeElement.pause();
		this.feedbackVoRef.nativeElement.pause();
		// if (!this.instruction.nativeElement.paused) {
		// 	this.instruction.nativeElement.currentTime = 0;
		// 	this.instruction.nativeElement.pause();
		// }
		// this.noOfRightAnsClicked = 0;
		// this.noOfWrongAnsClicked = 0;
		if (flag == "yes") {
			//show answer
			this.showAnsModal(this.fixedOptions[this.feedback.correct_ans_index])
			//this.checkAnswer(this.myoption[this.feedback.correct_ans_index],1)

			// if(this.ansBlock)
			// {
			// 	this.ansBlock.nativeElement.classList = "row mx-0 disable_div";
			// }
			
			setTimeout(() => {
				this.appModel.invokeTempSubject('showModal', 'manual');
			}, 100);

			$("#instructionBar").addClass("disable_div");
			//$("#optionsBlock .options").css("opacity", "0.3");
		//	$("#instructionBar").css("opacity", "0.3");
			//   this.checked = true;
		} else {

			console.log("closing modal")
			this.popUpClosed = true ;
			//close modal
			// if (this.instruction.nativeElement) {
			// 	this.clapSound.nativeElement.pause()
			// }
			if (this.wrongFeedback.nativeElement) {
				this.wrongFeedback.nativeElement.pause()
			}
			console.log("this.ifWrongAns", this.ifWrongAns)
			if (this.ifWrongAns) {
				this.removeEvents();
				// this.appModel.wrongAttemptAnimation();
				// this.idArray = [];
				// for (let i of this.myoption) {
				// 	this.idArray.push(i.id);
				// }
				//this.doRandomize(this.myoption);
				setTimeout(() => {
					///this.ansBlock.nativeElement.className = "";
				}, 200)
				// for (let i in this.myoption) {
				// 	this.ansBlock.nativeElement.children[i].children[1].className = "speaker";
				// }
				this.ifWrongAns = false;
			}

			if (this.ifRightAns) {
				this.removeEvents();
				this.ifRightAns = false;
				$("#instructionBar").addClass("disable_div");
			//	$("#optionsBlock .options").css("opacity", "0.3");
				//$("#instructionBar").css("opacity", "0.3");
				// $("#quesImage").css("opacity", "0.3");
				// $("#quesImage").css("pointer-events", 'none');
				this.blinkOnLastQues();
			}
			this.appModel.notifyUserAction();
			$("#instructionBar").removeClass("disable_div");
		}
	}
    
    showAnswers(){
		this.attemptType = "no animation"
		//show right answer pop up
		this.feedbackPopup = this.rightPopup;
		let correctAns: HTMLElement = this.correctAns.nativeElement as HTMLElement;
		this.confirmModalRef.nativeElement.classList="modal";
		// this.confirmReplayRef.nativeElement.classList="modal";
		// this.submitModalRef.nativeElement.classList="modal";
		correctAns.className = "modal d-flex align-items-center justify-content-center showit correctAns dispFlex";
		this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div disable-click";
		$("#instructionBar").css("pointer-events", 'none');
		
		this.feedbackVoRef.nativeElement.src = this.assetsPath + "/" + this.question.narrator_voice.url 
		if(this.tempAnswers && this.tempAnswers.length > 0)
		{
			this.showAnsTempArray = JSON.parse(JSON.stringify(this.answers))
		}
		else{
			this.tempAnswers = this.answers ;
		}

		// this.myoption.forEach(element => {
		// 	element.show = false;
		// });

		setTimeout(() => {
				if (this.feedbackVoRef && this.feedbackVoRef.nativeElement) {
					this.feedbackVoRef.nativeElement.play();
				}
			}, 50)
			this.feedbackVoRef.nativeElement.onended = () => {
				if(!this.closed){
					this.correctAns.nativeElement.classList = "modal";
					this.attemptType = "no animation"
					this.blinkOnLastQues();
			
				}
			}


		// setTimeout(() => {
		// 	this.blinkOnLastQues();
		// }, 3000);
			
		
    }
    


    checkNextActivities() {
        if (this.isPaused()) {
            this.removeEvents();

            var popup = document.getElementById("correctAns")

            // this.correctAns.nativeElement.className = "d-flex align-items-center justify-content-center hideit";   

             popup.className = "d-flex align-items-center justify-content-center hideit";
            //disable click on options and speaker
            //var optionsBlock = document.getElementById("optionsBlock")
            //optionsBlock.className = optionsBlock.className.concat(" disable");
            if (!this.appModel.autoPlay && !this.isLastQues && this.isLastQuesAct) {
                this.blink = true;
            }
            if ((this.appModel.autoPlay && !this.isLastQues) || !((this.isLastQuesAct)) || ((this.isLastQuesAct && this.appModel.autoPlay && !this.isLastQues))) {
                this.next();
            } else {
                //disable all the option
                //this.optionBlock.nativeElement.className= "disableDiv";
            }
            //if(this.currentIdx == this.optionslist.length-1 && !this.isLastActivity && this._sharedService.autoplay_var==0){


            //}

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
            //   if(this.footerNavBlock && this.footerNavBlock.nativeElement){
            //     this.footerNavBlock.nativeElement.className="d-flex flex-row align-items-center justify-content-around disable_div";
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
        if (!this.narrator.nativeElement.paused) {
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
        if (!this.narrator.nativeElement.paused) {
            console.log("narrator voice still playing");
        }
        else {
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
                if(this.maincontent){
                    this.maincontent.nativeElement.className = "disable_div";
                }
                el.onended = () => {
                    alert('voice end');
                    if (this.maincontent) {
                        this.maincontent.nativeElement.className = "";
                    }
                }

            }
        }
    }

	playSound(sound) {
		// plays a sound
		if (this.myAudiospeaker && this.myAudiospeaker.nativeElement) {
			this.myAudiospeaker.nativeElement.pause();
			// this.myAudiohelp.nativeElement.pause();
		}
		//stop instruction sound
		this.audio.src = sound;
		this.audio.load();
		this.audio.play();
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
            this.narrator.nativeElement.src = this.questionObj.quesInstruction.location == "content" 
            ? this.containgFolderPath + "/" + this.questionObj.quesInstruction.url: this.assetsPath + "/" + this.questionObj.quesInstruction.url    
            this.appModel.handlePostVOActivity(true);
            this.maincontent.nativeElement.className = "disable_div";   
            this.Sharedservice.setVoplayingStatus(true);  
            this.narrator.nativeElement.play();
			this.appModel.setLoader(false);
			this.narrator.nativeElement.onended = () => {
                this.Sharedservice.setVoplayingStatus(false);
                this.appModel.handlePostVOActivity(false);              
                this.maincontent.nativeElement.className = "";
			}
		} else {
			this.appModel.handlePostVOActivity(false);
			// this.appModel.enableReplayBtn(true);
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
            // this.disableScreen();
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
            // this.disableScreen();
        }
    }

  

    templatevolume(vol, obj) {

        if(obj.narrator && obj.narrator.nativeElement){
            obj.narrator.nativeElement.volume = obj.appModel.isMute?0:vol;
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
        // if (obj.mainVideo && obj.mainVideo.nativeElement) {
        //     this.mainVideo.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        // }
    }

    /* HOVER CODE */

    hoverCloseConfirm() {
		this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_hover;
	}
	houtCloseConfirm() {
		this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_original;
    }
    
/**SPEAKER HOVER */
    onHoverSpeaker(speaker) {
        speaker.imgsrc = speaker.imghover;
        if (!this.narrator.nativeElement.paused) {
            this.disableSpeaker.nativeElement.className = "speakerBtn";
        }
        else {
            this.disableSpeaker.nativeElement.className = "speakerBtn pointer";
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

    /** On selecting an option **/
    selectOpt(opt, idx) {
        //this.appModel.enableReplayBtn(false);
       //disable click
       //this.mainContainer.nativeElement.classList = "bodyContent disableDiv";
       //this.instructionBar.nativeElement.classList = "instructionBase disableDiv";
       this.appModel.stopAllTimer();
       this.optionSelected = idx;       
       if (this.optionRef && this.optionRef.nativeElement && this.optionRef.nativeElement.children[this.optionSelected].children[1]) {
        this.boundingClientFrom = this.optionRef.nativeElement.children[this.optionSelected].children[1].getBoundingClientRect();
        this.boundingClientTo = this.refQues.nativeElement.children[this.quesEmptyTxtIndx].getBoundingClientRect();
           $(this.optionRef.nativeElement.children[this.optionSelected].children[1]).animate({ left: (this.boundingClientTo.left + this.boundingClientTo.width - this.boundingClientFrom.left), top: (this.boundingClientTo.top - this.boundingClientFrom.top) }, 500);
           setTimeout(() => {
              $(this.optionRef.nativeElement.children[this.optionSelected].children[1]).addClass('invisible');
              $(this.refQues.nativeElement).addClass('onselectopt');
               this.emptyOpt = this.quesObjCopy.questionText[this.quesEmptyTxtIndx];
               this.quesObjCopy.questionText[this.quesEmptyTxtIndx] = opt;
               this.isOptionSelected = true;               
           }, 450)

           if (opt && opt.isCorrect) {
               // handle for correct attempt
               this.isRightSelected = true;
               setTimeout(() => {
                    if (this.rightFeedback && this.rightFeedback.nativeElement) {
                        this.rightFeedback.nativeElement.play();
                    }
			    }, 50)
               //this.attemptType = "manual";
            //    setTimeout(() => {
            //        this.feedbackPopup = this.rightPopup;
            //        this.feedbackModalRef.nativeElement.classList = "displayPopup modal";
            //        this.instructionVO.nativeElement.pause();
            //        this.instructionVO.nativeElement.currentTime = 0;
            //        this.feedbackVoRef.nativeElement.src = this.feedbackPopup.feedbackVo.location == "content" ? this.containgFolderPath + "/" + this.feedbackPopup.feedbackVo.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackPopup.feedbackVo.url + "?someRandomSeed=" + Math.random().toString(36);
            //        this.feedbackVoRef.nativeElement.play();
            //        this.feedbackVoRef.nativeElement.onended = () => {
            //            setTimeout(() => {
            //                this.feedbackModalRef.nativeElement.classList = "modal";
            //                this.sendFeedback(this.feedbackModalRef.nativeElement, 'no', 'feedbackClosed');
            //            }, 1000)
            //        }
            //    }, 1000)
           } else {
               this.isRightSelected = false;               
               this.wrongCounter += 1;
                if(this.wrongCounter === 3){
                    this.Sharedservice.setShowAnsEnabled(true); 
                }else{
                    this.Sharedservice.setShowAnsEnabled(false);
                }
               //handle for wrong attempt
            //    setTimeout(() => {
            //        this.feedbackPopup = this.wrongPopup;
            //        this.feedbackModalRef.nativeElement.classList = "displayPopup modal";
            //        this.instructionVO.nativeElement.pause();
            //        this.instructionVO.nativeElement.currentTime = 0;
            //        this.feedbackVoRef.nativeElement.src = this.feedbackPopup.feedbackVo.location == "content" ? this.containgFolderPath + "/" + this.feedbackPopup.feedbackVo.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackPopup.feedbackVo.url + "?someRandomSeed=" + Math.random().toString(36);
            //        this.feedbackVoRef.nativeElement.play();
            //        this.feedbackVoRef.nativeElement.onended = () => {
            //            setTimeout(() => {
            //                this.sendFeedback(this.feedbackModalRef.nativeElement, 'no', 'feedbackClosed');
                           
            //            }, 1000)
            //        }
            //    }, 1000)
               this.idArray = [];
               for (let i of this.myoption) {
                  this.idArray.push(i.id);
                }
               this.doRandomize(this.myoption);
               this.optionObj.opts=this.myoption;
           }
       }
   }
   
    //*********UNUSED CODE*************/

    

    // onHoverhelp(option){
    //  //console.log("in",option);
    //  if(!this.narrator.nativeElement.paused){
    //    this.helpbtn.nativeElement.className="";
    //    console.log("narrator voice still playing");
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
    //         //     this.maincontent.nativeElement.className = "disable_div";
    //         // }
    //         el.onended = () => {
    //             if (this.maincontent) {
    //                 this.maincontent.nativeElement.className = "";
    //             }
    //         }

    //     }
    // }


    

    // checkAnswerOnSubmit() {
    //     alert();
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
	// 		let correctAns: HTMLElement = this.correctAns.nativeElement as HTMLElement
	// 		correctAns.className = "modal d-flex align-items-center justify-content-center showit correctAns dispFlex";
	// 		this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div disable-click";
	// 		$("#instructionBar").css("pointer-events", 'none');
	// 		this.feedbackVoRef.nativeElement.src = this.feedbackPopup.feedbackVo.location == "content" ? this.assetspath + "/" + this.feedbackPopup.feedbackVo.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackPopup.feedbackVo.url + "?someRandomSeed=" + Math.random().toString(36);
	// 		//this.feedbackVoRef.nativeElement.play();

	// 		setTimeout(() => {
	// 			this.feedbackVoRef.nativeElement.play();
	// 		}, 750)
	// 		this.feedbackVoRef.nativeElement.onended=()=>{
	// 			if(!this.closed){
	// 				this.correctAns.nativeElement.classList = "modal";
	// 				this.blinkOnLastQues();
	// 			}
	// 		}			
	// 	}
	// 	else {
	// 		console.log("wrong ans pop up")
	// 		//show wrongans popup
	// 		this.ifWrongAns = true;
	// 		this.feedbackPopup = this.wrongPopup;
	// 		let correctAns: HTMLElement = this.correctAns.nativeElement as HTMLElement
	// 		correctAns.className = "modal d-flex align-items-center justify-content-center showit correctAns dispFlex";
	// 		this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div disable-click";
		
	// 		setTimeout(() => {
	// 			if (this.wrongFeedback && this.wrongFeedback.nativeElement) {
	// 				this.wrongFeedback.nativeElement.play();
	// 			}
	// 		}, 50)
	// 		this.wrongFeedback.nativeElement.onended = () => {
	// 			if(!this.closed){
	// 				this.wrongTimer = setTimeout(() => {
	// 					this.correctAns.nativeElement.classList = "modal";
	// 					this.appModel.notifyUserAction();
	// 					this.appModel.wrongAttemptAnimation();	
	// 				}, 2000);
	// 			}
	// 		}
	// 		// this.feedbackVoRef.nativeElement.src = this.feedbackPopup.feedbackVo.location == "content" ? this.assetspath + "/" + this.feedbackPopup.feedbackVo.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetspath + "/" + this.feedbackPopup.feedbackVo.url + "?someRandomSeed=" + Math.random().toString(36);
	// 	}

    // }
    

    
	// checkAnswer(option, event, idx) {

	// 	// Analytics called for attempt counter & first option is clicked
	// 	if (this.myAudiohelp && this.myAudiohelp.nativeElement) {
	// 		this.myAudiohelp.nativeElement.pause();
	// 		this.myAudiohelp.nativeElement.currentTime = 0;
	// 	}

	// 	if (!this.narrator.nativeElement.paused) {
	// 		console.log("narrator voice still playing");
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

	// 				let correctAns: HTMLElement = this.correctAns.nativeElement as HTMLElement
	// 				correctAns.className = "d-flex align-items-center justify-content-center showit";
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

}