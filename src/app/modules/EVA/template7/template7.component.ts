import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { Base } from '../../../controller/base';
import { SharedserviceService } from '../../../services/sharedservice.service';
import { PlayerConstants } from '../../../common/playerconstants';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-template7',
  templateUrl: './template7.component.html',
  styleUrls: ['./template7.component.css']
})
export class TemplateSevenComponent extends Base implements OnInit {

	constructor(private appModel: ApplicationmodelService, private ActivatedRoute: ActivatedRoute, private Sharedservice: SharedserviceService) {
		super();
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
		this.assetsfolderlocation = this.appModel.assetsfolderpath;
		this.appModel.navShow = 1;
		this.appModel.setLoader(true);
		// if error occured during image loading loader wil stop after 5 seconds 
		this.loaderTimer = setTimeout(() => {
			this.appModel.setLoader(false);
		}, 5000);

		this.appModel.notification.subscribe(
			(data) => {
				switch (data) {
					case PlayerConstants.CMS_PLAYER_CLOSE:
						console.log('VideoComponent: constructor - cmsPlayerClose');
						this.close();
						break;

					default:
						console.log('Component: constructor - default');
						break;
				}
			}
		);

	}

	@ViewChild('narrator_voice') narrator_voice: any;
	@ViewChild('myAudiohelp') myAudiohelp: any;
	@ViewChild('myAudiospeaker') myAudiospeaker: any;
	@ViewChild('audioEl') audioEl: any;
	@ViewChild('titleNavBtn') titleNavBtn: any;
	@ViewChild('container') containerBlock: any;
	@ViewChild('fireworks') fireworks: any;
	@ViewChild('ansBlock') ansBlock: any;
	@ViewChild('helpbtn') helpbtn: any;
	@ViewChild('sprite') sprite: any;
	@ViewChild('speakerNormal') speakerNormal: any;
	@ViewChild('disableSpeaker') disableSpeaker: any;
	@ViewChild('navBlock') navBlock: any;
	@ViewChild('titleAudio') titleAudio: any;
	@ViewChild('autoPlayOnOffContainer') autoPlayOnOffContainer: any;
	@ViewChild('maincontent') maincontent: any;
	@ViewChild('clapSound') clapSound: any;
	@ViewChild('buzzerSound') buzzerSound: any;
	@ViewChild('videoStage') videoStage: any;
	@ViewChild('optionsBlock') optionsBlock: any;
	@ViewChild('showAnswerfeedback') showAnswerfeedback: any;
	@ViewChild('showAnswerRef') showAnswerRef: any;
	@ViewChild('ansPopup') ansPopup: any;
	@ViewChild('rightFeedback') rightFeedback: any;
	@ViewChild('wrongFeedback') wrongFeedback: any;
	@ViewChild('speakerVolume') speakerVolume: any;
	@ViewChild('videoStageonpopUp') videoStageonpopUp: any;
	@ViewChild('showAnswerVO') showAnswerVO: any;
	@ViewChild('videoonshowAnspopUp') videoonshowAnspopUp: any;
	@ViewChild('overlay') overlay: any;
	@ViewChild('optionRef') optionRef: any;


	assetsfolderlocation: string = "";
	disableHelpBtn: boolean = false;
	optimage: any;
	lastQuestionCheck:any;
	assetspath: any;
	//opttext:any;
	currentIdx = 0;
	blink: boolean = false;
	showIntroScreen: boolean;
	audio = new Audio();
	bool: boolean = false;
	timernextseg: any = "";
	idArray: any = [];
	speakerTimer: any = "";
	speaker: any = "";
	myoption: any = [];
	question: any = "";
	feedback: any = "";
	answers: any = "";
	optionBlank: any = "";
	Instruction: any = "";
	quesInfo: any = "";
	correctOpt: any;
	isFirstQues: boolean;
	isLastQues: boolean = false;
	isAutoplayOn: boolean;
	isLastQuesAct: boolean;
	autoplay_text: string = "";
	resizeFlag: boolean = false;
	noOfImgs: number;
	noOfImgsLoaded: number = 0;
	loaderTimer: any;
	common_assets: any = "";
	LoadFlag: boolean = false;
	hasEventFired: boolean = false;
	contentgFolderPath: string = "";
	videoPlayed = false;
	speakerPlayed = false;
	instructiontext: string;
	wrongCount: number = 0;
	showAnswerSubscription: any;
	videoBase: any;
	popupIcon: any;
	popupIconLocation: any;
	popupType: string = "";
	attemptType: string = "";
	ifRightAns: boolean = false;
	popupAssets: any;
	rightPopup: any;
	wrongPopup: any;
	popUpObj: any;
	ifWrongAns: boolean = false;
	wrongImgOption: any;
	closed: boolean = false;
	wrongTimer: any;
	showAnswerPopup: any;
	popupclosedinRightWrongAns: boolean = false;
	rightTimer:any;   
    clapTimer:any;
	LastquestimeStart:boolean = false;
	showAnswerTimer :any;
	isRight: boolean = true;

	//new vars
	firstWord:string = '';
	seconWord:string = '';
	thirdWord:string = '';
	ansArray:any;
	disableOption:boolean = false;
	activeId:any =0;
	autofocus:boolean = true;
	get basePath(): any {
		if (this.appModel && this.appModel.content) {

			return this.appModel.content.id + '';
		}
	}
	setData() {
		if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
			let fetchedData: any = this.appModel.content.contentData.data;
			this.instructiontext = fetchedData.instructiontext;
			this.common_assets = fetchedData.commonassets;
			this.speaker = JSON.parse(JSON.stringify(fetchedData.speaker));
			this.myoption = JSON.parse(JSON.stringify(fetchedData.optionArray));
			this.question = fetchedData.quesObj;
			this.feedback = fetchedData.feedback;
			this.popupAssets = fetchedData.feedback.popupassets;
			this.rightPopup = this.feedback.right_ans_sound;
			this.wrongPopup = this.feedback.wrong_ans_sound;
			this.showAnswerVO = this.feedback.show_ans_sound;
			this.showAnswerPopup = this.feedback.show_ans_popup;
			this.noOfImgs = fetchedData.imgCount;
			this.isLastQues = this.appModel.isLastSection;			
			this.lastQuestionCheck = this.common_assets.ques_control.isLastQues;
			this.isLastQuesAct = this.appModel.isLastSectionInCollection;
			this.ansArray = fetchedData.ansArray;
			//this.isAutoplayOn = this.appModel.autoPlay;
			this.common_assets.ques_control.blinkingStatus = false;
			this.common_assets.ques_control.uttar_dikhayein = this.common_assets.ques_control.uttar_dikhayein_disable;
			this.appModel.setQuesControlAssets(this.common_assets.ques_control);
		} else {

		}
	}


	onHoverOptions(option, index) {
		let speakerEle = document.getElementsByClassName("speakerBtn")[0].children[2] as HTMLAudioElement;
		if (!speakerEle.paused) {
			speakerEle.pause();
			speakerEle.currentTime = 0;
			this.sprite.nativeElement.style = "display:none";
			(document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "";
			this.speakerPlayed = false;
			this.speaker.imgsrc = this.speaker.imgorigional;
		}
		this.myoption[index].imgsrc = this.myoption[index].imgsrc_hover;
	}

	onHoveroutOptions(option, index) {
		this.myoption[index].imgsrc = this.myoption[index].image_original;
	}
	onHoverPlay(option, index) {
		if (!this.videoPlayed) {
			this.myoption[index].play_button_normal = this.myoption[index].play_button_hover;
		}
	}
	onHoveroutPlay(option, index) {
		if (!this.videoPlayed) {
			this.myoption[index].play_button_normal = this.myoption[index].play_button_original;
		}
	}

	onHoverSpeaker() {
		if (!this.videoPlayed) {
			this.speaker.imgsrc = this.speaker.imghover;
		}
	}
	onHoveroutSpeaker() {
		if (!this.videoPlayed && !this.speakerPlayed) {
			this.speaker.imgsrc = this.speaker.imgorigional;
		}
	}

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

	// blinkOnLastQues() {
	// 	if (this.appModel.isLastSectionInCollection) {
	// 		this.appModel.blinkForLastQues("");
	// 		this.Sharedservice.moveNext();
	// 		//this.appModel.stopAllTimer();
	// 		if (!this.appModel.eventDone) {
	// 			if (this.isLastQuesAct) {
	// 				this.appModel.eventFired();
	// 				this.appModel.event = { 'action': 'segmentEnds' };
	// 			}
	// 			if (this.isLastQues) {
	// 				this.appModel.event = { 'action': 'exit' };
	// 			}
	// 		}
	// 	}
	// 	else {
	// 		this.appModel.moveNextQues("");
	// 	}
	// }

	playSpeaker() {
		this.stopAllSounds();
		this.enableAllOptions();
		
		this.speakerPlayed = true;
		this.speaker.imgsrc = this.speaker.imgactive;
		this.speakerVolume.nativeElement.play();
		this.sprite.nativeElement.style = "display:flex";
		(document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "none";
		this.speakerVolume.nativeElement.onended = () => {
			this.speaker.imgsrc = this.speaker.imgorigional;
			this.sprite.nativeElement.style = "display:none";
			(document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "";
			this.speakerPlayed = false;
		}
	}


	doRandomize(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;
		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			var img_hover1 = array[currentIndex].imgsrc_hover;
			var text1 = array[currentIndex].imgsrc_letter;
			var text1copy = array[currentIndex].image_original;
			var optionBg1 = array[currentIndex].image_original;

			var img_hover2 = array[randomIndex].imgsrc_hover;
			var text2 = array[randomIndex].imgsrc_letter;
			var text2copy = array[randomIndex].image_original;
			var optionBg2 = array[randomIndex].image_original;
			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;

			array[currentIndex].imgsrc_hover = img_hover1;
			array[currentIndex].imgsrc_letter = text1;
			array[currentIndex].image_original = text1copy;
			array[currentIndex].imgsrc = optionBg1;

			array[randomIndex].imgsrc_hover = img_hover2;
			array[randomIndex].imgsrc_letter = text2;
			array[randomIndex].image_original = text2copy;
			array[randomIndex].imgsrc = optionBg2;

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

	hoverClosePopup() {
		this.popupAssets.close_button = this.popupAssets.close_button_hover;
	}
	houtClosePopup() {
		this.popupAssets.close_button = this.popupAssets.close_button_origional;
	}

	isPaused() {
		return this.audio.paused;
	}

	close() {
		//this.appModel.event = { 'action': 'exit', 'currentPosition': this.currentVideoTime };
		this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
	}

	templatevolume(vol, obj) {
		if (obj.narrator_voice && obj.narrator_voice.nativeElement) {
			obj.narrator_voice.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.clapSound && obj.clapSound.nativeElement) {
			obj.clapSound.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.speakerVolume && obj.speakerVolume.nativeElement) {
			obj.speakerVolume.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.rightFeedback && obj.rightFeedback.nativeElement) {
			obj.rightFeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.wrongFeedback && obj.wrongFeedback.nativeElement) {
			obj.wrongFeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.videoonshowAnspopUp && obj.videoonshowAnspopUp.nativeElement) {
            obj.videoonshowAnspopUp.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
	}
	//end



	ngOnInit() {
		// document.getElementById("firstWord").focus();
		this.Sharedservice.setLastQuesAageyBadheStatus(true); 
		this.attemptType = "";
		this.setTemplateType();
		this.sprite.nativeElement.style = "display:none";
		this.contentgFolderPath = this.basePath;
		this.appModel.functionone(this.templatevolume, this);//start end

		if (this.appModel.isNewCollection) {
			this.appModel.event = { 'action': 'segmentBegins' };
		}
		let fetchedData: any = this.appModel.content.contentData.data;
		if (fetchedData.titleScreen) {
			this.quesInfo = fetchedData;
			this.showIntroScreen = true;
			this.noOfImgs = this.quesInfo.imgCount;
		}
		else {
			this.showIntroScreen = false;
			this.setData();
		}
		this.appModel.getNotification().subscribe(mode => {
			if (mode == "manual") {

			} else if (mode == "auto") {
				this.attemptType = "uttarDikhayein";
				this.popupType = "showanswer"
			}
		})
		this.showAnswerSubscription = this.appModel.getConfirmationPopup().subscribe((val) => {
			if (val == "uttarDikhayein") {
				this.appModel.stopAllTimer();
				let speakerEle = document.getElementsByClassName("speakerBtn")[0].children[2] as HTMLAudioElement;
				if (!speakerEle.paused) {
					speakerEle.pause();
					speakerEle.currentTime = 0;
					this.sprite.nativeElement.style = "display:none";
					(document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "";
					this.speakerPlayed = false;
					this.speaker.imgsrc = this.speaker.imgorigional;
				}
				if (this.showAnswerRef && this.showAnswerRef.nativeElement) {
					this.videoonshowAnspopUp.nativeElement.src = this.showAnswerPopup.video.location == "content" ? this.contentgFolderPath + "/" + this.showAnswerPopup.video.url : this.assetsfolderlocation + "/" + this.showAnswerPopup.video.url;
					this.showAnswerRef.nativeElement.classList = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
					if (this.videoonshowAnspopUp && this.videoonshowAnspopUp.nativeElement) {
						this.videoonshowAnspopUp.nativeElement.play();
						this.videoonshowAnspopUp.nativeElement.onended = () => {
							this.showAnswerTimer =  setTimeout(() => {
								this.closePopup('showAnswer');
							}, 10000);
						// this.videoonshowAnspopUp.nativeElement.play();
					}
					//this.popupType = "showanswer";
					// if(this.ifRightAns) {
					// 	this.blinkOnLastQues();
					// }
				}
			}
		}
		})
	}

	ngOnDestroy() {
		this.showAnswerSubscription.unsubscribe();
		clearTimeout(this.rightTimer);
		clearTimeout(this.clapTimer);
		this.stopAllSounds();
	}

	
	ngAfterViewChecked() {
		if (this.titleAudio && this.titleAudio.nativeElement) {
			this.titleAudio.nativeElement.onended = () => {
				this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeInAnimation";
			}
		}
		this.templatevolume(this.appModel.volumeValue, this);
	}

	  //**Function to stop all sounds */
	  stopAllSounds(clickStatus?) {
        this.audio.pause();
        this.audio.currentTime = 0;
		
		this.speakerVolume.nativeElement.pause();
        this.speakerVolume.nativeElement.currentTime=0;

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

	ngAfterViewInit(){
		this.appModel.setLoader(false);
		this.checkforQVO();
	}

	checkforQVO() {
		if (this.question && this.question.quesInstruction && this.question.quesInstruction.url && this.question.quesInstruction.autoPlay) {
			//this.narrator_voice.nativeElement.src = this.question.quesInstruction.location=="content" ? this.contentgFolderPath+ "/" + this.question.quesInstruction.url+"?someRandomSeed="+ Math.random().toString(36):this.assetsfolderlocation + "/" + this.question.quesInstruction.url+"?someRandomSeed="+ Math.random().toString(36);
			this.appModel.handlePostVOActivity(true);
			this.optionsBlock.nativeElement.classList = "disable_div";
			(document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "none";
			// let nxtBtndiv=(document.getElementsByClassName("nextBtn")[0] as HTMLElement);
			// nxtBtndiv.classList.value ="img-fluid nextBtn disableBtn";
			this.narrator_voice.nativeElement.play();
			document.getElementById("container").style.opacity = "1";
			//this.Sharedservice.setVoplayingStatus(true); 
			this.narrator_voice.nativeElement.onended = () => {
				//this.appModel.handlePostVOActivity(false);
				//   nxtBtndiv.classList.value="img-fluid nextBtn";
				//this.Sharedservice.setVoplayingStatus(false); 
				document.getElementById(this.ansArray[0].id).focus();
				this.optionsBlock.nativeElement.classList = "";
				(document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "";
			}
		}
	}


	setTemplateType(): void {
		// send message to subscribers via observable subject
		this.ActivatedRoute.data.subscribe(data => {
			this.Sharedservice.sendData(data);
		})

	}


	clearData(): void {
		// clear message
		this.Sharedservice.clearData();
	}

	closePopup(Type) {

		clearTimeout(this.wrongTimer);
        clearTimeout(this.rightTimer);
        clearTimeout(this.clapTimer);
		clearTimeout(this.showAnswerTimer);
		

		this.showAnswerRef.nativeElement.classList = "modal";
		this.ansPopup.nativeElement.classList = "modal";
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
				if(!this.lastQuestionCheck){  
                                 
                }else if(this.lastQuestionCheck){              
                this.Sharedservice.setTimeOnLastQues(true);
                }
			} else {
				if (this.wrongCount >= 3 && this.ifWrongAns) {
					this.Sharedservice.setShowAnsEnabled(true);
				} else {
					this.Sharedservice.setShowAnsEnabled(false);
				}
			}
		}
		else if (Type === 'showanswer') {
			if (this.ifRightAns) {
				this.blinkOnLastQues();
			}
		} 
		else if (Type == 'yes'){
			this.checkAnswer();
			this.ansPopup.nativeElement.classList = "displayPopup modal";

			//this.CheckAnswer();
    //   setTimeout(() => {
    //     if (this.isRight) {
    //       if (this.rightFeedback && this.rightFeedback.nativeElement) {
    //         this.clapSound.nativeElement.play();
    //         setTimeout(() => {Fcheck
    //           this.rightFeedback.nativeElement.play();
    //           this.rightFeedback.nativeElement.onended = () => {
    //             this.rightTimer = setTimeout(() => {
    //               this.closeModal();
    //             }, 10000);
    //           }
    //         }, 2000);
    //       }
    //     }
    //     else {
    //       if (this.wrongFeedback && this.wrongFeedback.nativeElement) {
    //         this.wrongFeedback.nativeElement.play();
    //       }
    //       this.wrongFeedback.nativeElement.onended = () => {
    //         this.wrongTimer = setTimeout(() => {
    //           //this.closeModal();
    //         }, 10000);
    //       }
    //     }
    //   }, 200);
		}
	}

	// on answer pop up close event
	closeModal() {
		clearTimeout(this.wrongTimer);
		clearTimeout(this.rightTimer);
		if (!this.rightFeedback.nativeElement.paused) {
		  this.rightFeedback.nativeElement.pause();
		  this.rightFeedback.nativeElement.currentTime = 0;
		}
		if (!this.wrongFeedback.nativeElement.paused) {
		  this.wrongFeedback.nativeElement.pause();
		  this.wrongFeedback.nativeElement.currentTime = 0;
		}
		//this.popupRef.nativeElement.classList = "modal";		
	  }




	/****** Option Hover VO  *******/
	playOptionHover(option, index) {
		if (option && option.audio && option.audio.url) {
			this.playSound(option.audio, index);
		}
	}

	/***** Play sound on option roll over *******/
	playSound(soundAssets, idx) {
		if (this.audio && this.audio.paused) {
			if (soundAssets.location == 'content') {
				this.audio.src = this.contentgFolderPath + '/' + soundAssets.url;
			} else {
				this.audio.src = soundAssets.url;
			}
			this.audio.load();
			this.audio.play();
			this.disableOtherOptions(idx, this.optionRef);
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
		if (this.optionRef.nativeElement.children[j].classList.contains("disableDiv")) {
		this.optionRef.nativeElement.children[j].classList.remove("disableDiv");
		}
	}
	}

	clickAkshar(aksharObj){
		// let activefieldId = this.ansArray.findIndex((item) => (!item.disabled));
		this.ansArray[this.activeId].value = this.ansArray[this.activeId].value + aksharObj.value
		document.getElementById(this.ansArray[this.activeId].id).focus();
		let wordArr = this.stringToChars({'word':this.ansArray[this.activeId].value})
		console.log(this.stringToChars({'word':this.ansArray[this.activeId].value}));
		if(wordArr.length >= 6){
			//disable options
			this.autofocus = false;
			document.getElementById(this.ansArray[this.activeId].id).blur();
			this.ansArray[this.activeId].disable_ip = true;
			this.disableOption = true;
		}
	}


	// to find the hindi word Length ignoring the matras
	stringToChars(args) {
		var word = args.word;
		var chars = [];
		var endings = this.getEndWordGroupings();
		var incluster = false;
		var cluster = '';
		var whitespace = new RegExp("\\s+");
		for(var i = word.length - 1; i >= 0; i--) {
			var character = word.charAt(i);
			var charactercode = word.charCodeAt(i);
			
			if(incluster) {
				if(whitespace.test(character)) {
					incluster = false;
					chars.push(cluster);
					cluster = '';
				} else if(endings[charactercode]) {
					chars.push(cluster);
					cluster = character;
				} else {
					incluster = false;
					cluster = character + cluster;
					chars.push(cluster);
					cluster = '';
				}
			} else if(endings[charactercode]) {
				incluster = true;
				cluster = character;
			} else if(whitespace.test(character)) {
				incluster = false;
				chars.push(cluster);
				cluster = '';
			} else {
				chars.push(character);
			}
		}
		if(cluster.length > 0) {
			chars.push(cluster);
		}
		return chars.reverse();
	}

	getEndWordGroupings() {return {'2304':true,'2305':true,'2306':true,'2307':true,'2362':true,'2363':true,'2364':true,'2365':true,'2366':true,'2367':true,'2368':true,'2369':true,'2370':true,'2371':true,'2372':true,'2373':true,'2374':true,'2375':true,'2376':true,'2377':true,'2378':true,'2379':true,'2380':true,'2381':true,'2382':true,'2383':true,'2385':true,'2386':true,'2389':true,'2390':true,'2391':true,'2402':true,'2403':true,'2416':true,'2417':true,};}

	onHoverRefresh(item,i){
		item.refresh = item.refresh_hover
	}

	onHoverOutRefresh(item,i){
		item.refresh = item.refresh_original;
	}

	onHoverLock(item,i){
		item.unlock = item.unlock_hover
	}

	onHoverOutLock(item,i){
		item.unlock = item.unlock_original;
	}

	refreshClicked(item,i){
		item.value = "";
		this.disableOption = false
		this.autofocus = true;
		document.getElementById(this.ansArray[this.activeId].id).focus();
	}

	lockClicked(item,i){
		item.locked = true;
		item.disabled = true;
		if(this.activeId < 2){
			this.activeId = this.activeId + 1;
			this.ansArray[this.activeId].disabled = false;
			document.getElementById(this.ansArray[this.activeId].id).focus();
			this.autofocus =true ;
			this.disableOption = false
			}
			else{
				this.disableOption = true;
				this.autofocus =false ;
				document.getElementById(this.ansArray[this.activeId].id).blur();
				this.Sharedservice.setSubmitAnsEnabled(true)
			}
	}

	focusAuto(){
		console.log("auto focusssing")
		if (this.autofocus){
			document.getElementById(this.ansArray[this.activeId].id).focus();		
		}
	}

	checkAnswer(){
		let rightCounter = 0;
		console.log(this.feedback.answer_key)
		console.log(this.ansArray)
		this.ansArray.forEach(element => {
			console.log((this.feedback.answer_key).indexOf(element.value))
			if((this.feedback.answer_key).indexOf(element.value)>-1){
				element.isRight = true
				rightCounter = rightCounter + 1;
			}
			else{
				element.isRight = false
			}
		});

		if(rightCounter == this.ansArray.length){
			console.log("right answer")
		}
		else{
			console.log("wrong answer")
		}

	}


}

