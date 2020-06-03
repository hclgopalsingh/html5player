import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { Base } from '../../../controller/base';
import { SharedserviceService } from '../../../services/sharedservice.service';
import { PlayerConstants } from '../../../common/playerconstants';
import { ActivatedRoute } from '@angular/router';


@Component({
	selector: 'app-template3',
	templateUrl: './template3.component.html',
	styleUrls: ['./template3.component.css']
})
export class Template3Component extends Base implements OnInit {

	constructor(private appModel: ApplicationmodelService, private ActivatedRoute: ActivatedRoute, private Sharedservice: SharedserviceService) {
		super();
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

	checkAnswer(option) {
		this.popupclosedinRightWrongAns = false;
		if (option.id == this.feedback.correct_answer) {
			clearTimeout(this.wrongTimer);
			this.correctOpt = option;
			this.attemptType = "manual";
			this.appModel.stopAllTimer();
			this.videoBase = option.videosrc;
			this.videoStageonpopUp.nativeElement.src = this.videoBase.location == "content" ? this.contentgFolderPath + "/" + this.videoBase.url : this.assetsfolderlocation + "/" + this.videoBase.url;
			this.popupIcon = this.popupAssets.right_icon.url;
			this.popupIconLocation = this.popupAssets.right_icon.location;
			this.ifRightAns = true;
			option.image = option.image_original;
			for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
                document.getElementsByClassName("ansBtn")[i].classList.add("disableDiv");           
            }
			setTimeout(() => {
				if (this.rightFeedback && this.rightFeedback.nativeElement) {
					this.clapSound.nativeElement.play();
					this.clapTimer=	setTimeout(() => {
						this.clapSound.nativeElement.pause();
						this.clapSound.nativeElement.currentTime = 0;
						let ansPopup: HTMLElement = this.ansPopup.nativeElement as HTMLElement
						ansPopup.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
						if (!this.popupclosedinRightWrongAns) {
							this.rightFeedback.nativeElement.play();
							this.videoStageonpopUp.nativeElement.play();
						} else {
							this.Sharedservice.setShowAnsEnabled(true);
						}
					}, 2000)
				}
				//disable option and question on right attempt
				this.maincontent.nativeElement.className = "disableDiv";			
				this.rightFeedback.nativeElement.onended = () => {
					this.rightTimer = setTimeout(() => {
						this.closePopup('answerPopup');
						//this.Sharedservice.setShowAnsEnabled(true);
					}, 10000)
					//new code
					setTimeout(() => {
						this.attemptType = "manual";
						//disable option and question on right attempt
					}, 200)
				}
			})

		} else {
			this.wrongCount++;
			clearTimeout(this.wrongTimer);
			this.idArray = [];
			for (let i of this.myoption) {
				this.idArray.push(i.id);
			}
			this.popUpObj = option;
			this.ifWrongAns = true;
			this.wrongImgOption = option  //setting wrong image options
			let ansPopup: HTMLElement = this.ansPopup.nativeElement as HTMLElement
			ansPopup.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
			option.image = option.image_original;
			this.videoBase = option.videosrc;
			this.popupIcon = this.popupAssets.wrong_icon.url;
			this.popupIconLocation = this.popupAssets.wrong_icon.location;
			this.videoStageonpopUp.nativeElement.src = this.videoBase.location == "content" ? this.contentgFolderPath + "/" + this.videoBase.url : this.assetsfolderlocation + "/" + this.videoBase.url;
			setTimeout(() => {
				if (this.wrongFeedback && this.wrongFeedback.nativeElement) {
					this.wrongFeedback.nativeElement.play();
				}
				this.videoStageonpopUp.nativeElement.play();
				this.wrongFeedback.nativeElement.onended = () => {
					this.wrongTimer = setTimeout(() => {
						this.closePopup('answerPopup');
					}, 10000);
				}

			}, 20);
			this.doRandomize(this.myoption);
		}
	}
	playSpeaker() {
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

	playVideo(option, index) {
		this.videoPlayed = true;
		this.myoption[index].play_button_normal = this.myoption[index].play_button_selected;
		this.videoStage.nativeElement.style.opacity = 1;
		this.videoStage.nativeElement.src = this.myoption[index].videosrc.location == "content" ? this.contentgFolderPath + "/" + this.myoption[index].videosrc.url : this.assetsfolderlocation + "/" + this.myoption[index].videosrc.url;
		this.videoStage.nativeElement.play();
		let optionBlock = document.getElementById("optionsBlock") as HTMLElement;
		optionBlock.style.pointerEvents = "none";
		(document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "none";
		this.videoStage.nativeElement.onended = () => {
			this.videoPlayed = false;
			this.videoStage.nativeElement.style.opacity = 0;
			this.myoption[index].play_button_normal = this.myoption[index].play_button_original;
			optionBlock.style.pointerEvents = "";
			(document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "";
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
		if (obj.showAnswerfeedback && obj.showAnswerfeedback.nativeElement) {
			obj.showAnswerfeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
	}
	//end



	ngOnInit() {
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
					this.videoonshowAnspopUp.nativeElement.src = this.showAnswerPopup.videoAnimation.location == "content" ? this.contentgFolderPath + "/" + this.showAnswerPopup.videoAnimation.url : this.assetsfolderlocation + "/" + this.showAnswerPopup.videoAnimation.url;
					this.showAnswerRef.nativeElement.classList = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
					if (this.showAnswerfeedback && this.showAnswerfeedback.nativeElement) {
						this.showAnswerfeedback.nativeElement.play();
						this.showAnswerfeedback.nativeElement.onended = () => {
							this.closePopup("showanswer");
						}
						this.videoonshowAnspopUp.nativeElement.play();
					}
					//this.popupType = "showanswer";
					// if(this.ifRightAns) {
					// 	this.blinkOnLastQues();
					// }
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

        this.showAnswerfeedback.nativeElement.pause();
        this.showAnswerfeedback.nativeElement.currentTime = 0;
    }
	
	checkImgLoaded() {
		if (!this.LoadFlag) {
			this.noOfImgsLoaded++;
			if (this.noOfImgsLoaded >= this.noOfImgs) {
				this.appModel.setLoader(false);
				this.Sharedservice.setShowAnsEnabled(false);
				//this.Sharedservice.setShowAnsEnabled(false);
				document.getElementById("container").style.opacity = "1";
				clearTimeout(this.loaderTimer);
				this.LoadFlag = true;
				// this.optionsBlock.nativeElement.style.opacity="1";
				// document.getElementById("footerNavBlock").style.opacity="1";
				this.checkforQVO();
				// if(this.narrator_voice && this.narrator_voice.nativeElement){
				// 	this.narrator_voice.nativeElement.play();
				// }
			}
		}
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
			//this.Sharedservice.setVoplayingStatus(true); 
			this.narrator_voice.nativeElement.onended = () => {
				//this.appModel.handlePostVOActivity(false);
				//   nxtBtndiv.classList.value="img-fluid nextBtn";
				//this.Sharedservice.setVoplayingStatus(false); 
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
		} else {

		}

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
}
