import { Component, OnInit, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../model/applicationmodel.service';
import { PlayerConstants } from '../common/playerconstants';
import { Subscription } from 'rxjs'

import 'jquery';
import { debug } from 'util';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


declare var $: any;

@Component({
	selector: 'Ntemplate11',
	templateUrl: '../view/layout/Ntemplate11.component.html',
	styleUrls: ['../view/css/Ntemplate11.component.css', '../view/css/bootstrap.min.css'],

})

export class Ntemplate11 implements OnInit {
	private appModel: ApplicationmodelService;
	constructor(appModel: ApplicationmodelService) {
		this.appModel = appModel;
		this.assetsfolderlocation = this.appModel.assetsfolderpath;
		this.appModel.navShow = 2;
		this.appModel.setLoader(false);
		// if error occured during image loading loader wil stop after 5 seconds 
		this.loaderTimer = setTimeout(() => {
			this.appModel.setLoader(false);
			console.log("stopping loader")
		}, 500);
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
	}

	@ViewChild('correctAns') correctAns: any;
	@ViewChild('wrongAns') wrongAns: any;
	@ViewChild('ans') ans: any;
	@ViewChild('narrator_voice') narrator_voice: any;
	@ViewChild('myAudiohelp') myAudiohelp: any;
	@ViewChild('audioEl') audioEl: any;
	@ViewChild('titleNavBtn') titleNavBtn: any;
	@ViewChild('container') containerBlock: any;
	@ViewChild('fireworks') fireworks: any;
	@ViewChild('helpbtn') helpbtn: any;
	@ViewChild('navBlock') navBlock: any;
	@ViewChild('buzzerSound') buzzerSound: any;
	@ViewChild('titleAudio') titleAudio: any;
	@ViewChild('maincontent') maincontent: any;
	@ViewChild('helpBtn') helpBtn: any;
	@ViewChild('titleHelpAudio') titleHelpAudio: any;
	@ViewChild('clapSound') clapSound: any;
	@ViewChild('wrongFeedback') wrongFeedback: any;
	@ViewChild('autoPlayOnOffContainer') autoPlayOnOffContainer: any;
	@ViewChild('confirmModalRef') confirmModalRef: any;
	@ViewChild('confirmReplayRef') confirmReplayRef: any;
	@ViewChild('submitModalRef') submitModalRef: any;
	@ViewChild('feedbackModalRef') feedbackModalRef: any;
	@ViewChild('partialpopupRef') partialpopupRef: any;
	@ViewChild('popupRef') popupRef: any;
	@ViewChild('feedbackPopupAudio') feedbackPopupAudio: any;
	@ViewChild('feedbackpartialPopupAudio') feedbackpartialPopupAudio: any;
	@ViewChild('infoModalRef') infoModalRef: any;
	@ViewChild('feedbackVoRef') feedbackVoRef: any;
	@ViewChild('narrator') narrator: any;
	@ViewChild('instruction') instruction: any;
	@ViewChild('optionAudio') optionAudio: any;
	@ViewChild('ansArrangeBlock') ansArrangeBlock: any;
	@ViewChild('ansBlock') ansBlock: any;
	@ViewChild('mainVideo') mainVideo: any;

	isPlayVideo: boolean;
	narratorAudio: any;
	disableHelpBtn: boolean = false;
	optimage: any;
	opttext: any;
	currentIdx = 0;
	blink: boolean = false;
	showIntroScreen: boolean = true;
	audio = new Audio();
	bool: boolean = false;
	timernextseg: any;
	idArray: any;
	speaker: any = "";
	myoption: any = [];
	question: any = "";
	feedback: any = "";
	answers: any = "";
	optionBlank: any = "";
	Instruction: any = "";
	quesInfo: any = "";
	isFirstQues: boolean;
	isLastQues: boolean = false;
	isAutoplayOn: boolean;
	isLastQuesAct: boolean;
	resizeFlag: boolean;
	noOfImgs: number;
	noOfImgsLoaded: number = 0;
	loaderTimer: any;
	assetspath: any;
	assetsfolderlocation: string = "";
	common_assets: any = "";
	hasEventFired: boolean = false;
	feedbackPopup: any;
	confirmPopupAssets: any;
	wrongPopup: any;
	rightPopup: any;
	feedbackObj: any;
	commonAssets: any = "";
	containgFolderPath: string = "";
	loadFlag: boolean = false;
	quesObj: any;
	tempSubscription: Subscription;
	attemptType: string = "";
	isSkip: boolean = false;
	isAnsWrong: boolean = false;
	moveTo : any;
	moveFrom : any;
	moveleft: any;
	movetop: any;
	itemid: any;
	correct_ans_url: any;
	videoReplayd: boolean;
	replayconfirmAssets: any;
	tempTimer:any;
	PlayPauseFlag:boolean = true;





	//Instruction=this._sharedService.navigatetoroute.Instruction;
	//optionslist = this._sharedService.navigatetoroute.main;
	//optionslist_main = this._sharedService.navigatetoroute.main[this.currentIdx];
	//speaker = this.optionslist[this.currentIdx].speaker;
	//myoption = this.optionslist[this.currentIdx].options;
	//question = this.optionslist[this.currentIdx].ques;
	//feedback = this.optionslist[this.currentIdx].feedback;
	//answers = this.optionslist[this.currentIdx].answers;
	//optionBlank =this.optionslist[this.currentIdx].optionsBlank;

	//disable next on last activity last question
	//isLastActivity = this._sharedService.isLastActivity;

	get basePath(): any {
		console.log('temponeComponent: path=', this.appModel.content.id + '/' + this.appModel.content.contentData.data['path']);
		if (this.appModel && this.appModel.content) {

			return this.appModel.content.id + '';
		}
	}
	setData() {
		if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
			let fetchedData: any = this.appModel.content.contentData.data;
			console.log("fetchedDatafetchedDatafetchedData", fetchedData);
			if (fetchedData && fetchedData.titleScreen) {
				this.showIntroScreen = true;
			} else {
				this.showIntroScreen = false;
			}
			this.speaker = fetchedData.speaker;
			this.common_assets = fetchedData.commonassets;
			this.myoption = JSON.parse(JSON.stringify(fetchedData.options));
			this.quesObj = fetchedData.quesObj;
			this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
			this.question = fetchedData.ques;
			this.feedback = fetchedData.feedback;
			this.correct_ans_url = fetchedData.feedback.correct_ans_url;
			this.commonAssets = fetchedData.commonassets;
			this.quesInfo = fetchedData.commonassets;
			this.answers = fetchedData.answers;
			this.optionBlank = fetchedData.optionsBlank;
			this.isFirstQues = fetchedData.isFirstQues;
			this.isLastQues = this.appModel.isLastSection;
			this.isLastQuesAct = this.appModel.isLastSectionInCollection;
			this.isAutoplayOn = this.appModel.autoPlay;
			this.noOfImgs = fetchedData.imgCount;
			this.confirmPopupAssets = fetchedData.feedback.confirm_popup;
			this.feedbackObj = fetchedData.feedback;
			this.rightPopup = fetchedData.feedback.rightFeedback;
			this.wrongPopup = fetchedData.feedback.wrongFeedback;
			this.narratorAudio = fetchedData.commonassets.narrator;
			this.replayconfirmAssets = fetchedData.feedback.replay_confirm;


			if (this.quesObj.quesVideo && this.quesObj.quesVideo.autoPlay && !this.appModel.isVideoPlayed) {
				this.isPlayVideo = true;	
			  } else {
				this.isPlayVideo = false;
				 this.tempTimer = setTimeout(() => {
					let navTimer = setInterval(() => {
						if (this.navBlock && this.navBlock.nativeElement) {
							clearInterval(navTimer);
							setTimeout(() => {
								if (this.navBlock && this.navBlock.nativeElement) {
									this.navBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around"
								}
							}, 500)
						}
					}, 100)
					this.noOfImgsLoaded = 0;
					this.appModel.setLoader(true);
					this.loaderTimer = setTimeout(() => {
						this.appModel.setLoader(false);
					}, 5000)
	
				}, this.quesInfo.formatTimeout)

			  }






			setTimeout(() => {
				if (this.navBlock && this.navBlock.nativeElement) {
					this.navBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around";
				}
			}, 200)
		} else {
			/*this.speaker = "";
			this.myoption = [];
			this.question = "";
			this.feedback = "";
			this.answers = "";
			this.optionBlank = "";*/
		}

	}
	onHoverOptions(option, idx) {
		//console.log("in",option);
		this.appModel.notifyUserAction();
		if (!this.narrator_voice.nativeElement.paused) {
			console.log("narrator voice still playing");
		}
		else {
			if (!this.instruction.nativeElement.paused) {
				this.instruction.nativeElement.currentTime = 0;
				this.instruction.nativeElement.pause();
			}
			option.image = option.image_hover;
			//this.ansBlock.nativeElement.className="pointer";
			this.ansBlock.nativeElement.children[idx].className = "options pointer";
		}
	}

	onHoveroutOptions(option, idx) {
		this.appModel.notifyUserAction();
		//console.log("out",option);
		option.image = option.image_original;
		//this.ansBlock.nativeElement.className="";
		this.ansBlock.nativeElement.children[idx].className = "options";



	}
	onHoverhelp(option) {
		//console.log("in",option);
		this.appModel.notifyUserAction();
		if (!this.narrator_voice.nativeElement.paused) {
			this.helpbtn.nativeElement.className = "";
			console.log("narrator voice still playing");
		}
		else {
			option.help = option.helphover;
			this.helpbtn.nativeElement.className = "pointer";
		}
	}

	onHoverouthelp(option) {
		//console.log("out",option);
		option.help = option.helpOriginal;

	}
	onHoverAageyBadheinBtn() {
		this.common_assets.aagey_badhein = this.common_assets.aagey_badhein_hover;
	}
	onLeaveAageyBadheinBtn() {
		this.common_assets.aagey_badhein = this.common_assets.aagey_badhein_original;
	}
	onHoverPeecheyBtn() {
		this.common_assets.peechey_jayein = this.common_assets.peechey_jayein_hover;
	}
	onLeavePeecheyBtn() {
		this.common_assets.peechey_jayein = this.common_assets.peechey_jayein_original;
	}
	onHoverZaariRakhein() {
		this.quesInfo.zaariRakhein = this.quesInfo.zaariRakhein_hover;
	}
	onHoverOutZaariRakhein() {
		this.quesInfo.zaariRakhein = this.quesInfo.zaariRakhein_original;
	}
	hoverCloseConfirm() {
		this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_hover;
  }

  houtonReplayDecline() {
	this.replayconfirmAssets.decline_btn = this.replayconfirmAssets.decline_btn_original;
  }

hoveronReplayConfirm() {
	this.replayconfirmAssets.confirm_btn = this.replayconfirmAssets.confirm_btn_hover;
  }

  houtonReplayConfirm() {
	this.replayconfirmAssets.confirm_btn = this.replayconfirmAssets.confirm_btn_original;
  }

  hoveronReplayDecline() {
	this.replayconfirmAssets.decline_btn = this.replayconfirmAssets.decline_btn_hover;
  }

  houtDecline() {
	this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_original;
}

	houtCloseConfirm() {
		this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_original;
	}

  hoverConfirm() {
	this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_hover;
}

hoverDecline() {
	this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_hover;
}

houtConfirm() {
	this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_original;
}

  endedHandleronSkip() {    
	this.isPlayVideo = false;   
	this.appModel.navShow = 2;  
	this.appModel.videoStraming(false);
	this.appModel.notifyUserAction();   
}


PlayPauseVideo(){
  if(this.PlayPauseFlag)
  {
	this.mainVideo.nativeElement.pause();
	this.quesObj.quesPlayPause = this.quesObj.quesPlay;
	this.PlayPauseFlag = false;
  }
  else{
	this.mainVideo.nativeElement.play();
	this.quesObj.quesPlayPause = this.quesObj.quesPause;
	this.PlayPauseFlag = true;
  }
  
}

hoverSkip(){
 // this.skipFlag = false;
 this.quesObj.quesSkip = this.quesObj.quesSkipHover;
}
houtSkip(){
  this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
}


	playSound(sound) {
		// plays a sound
		if (this.myAudiohelp && this.myAudiohelp.nativeElement) {
			this.myAudiohelp.nativeElement.pause();
		}
		this.audio.src = sound;
		this.audio.load();
		this.audio.play();
	}

	helpSpeaker(el: HTMLAudioElement) {
		if (!this.narrator_voice.nativeElement.paused) {
			console.log("narrator voice still playing");
		}
		else {
			el.pause();
			el.currentTime = 0;
			el.play();
			if (this.maincontent) {
				this.maincontent.nativeElement.className = "disable_div";
			}
			el.onended = () => {
				if (this.maincontent) {
					this.maincontent.nativeElement.className = "";
				}
			}
		}
	}

	playHoverInstruction() {
		console.log("weare heree---------------------->>>>>>>>>>>>>>>>>>>");
		this.narrator.nativeElement.src = this.quesObj.quesInstruction.location == "content" ? this.containgFolderPath + "/" + this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetspath + "/" + this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
		let that = this;
		if (!this.narrator.nativeElement.paused!) {
			console.log("narrator/instruction voice still playing");
		} else {
			console.log("play on Instruction");
			this.instruction.nativeElement.src = this.quesObj.quesInstruction.location == "content" ? this.containgFolderPath + "/" + this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetspath + "/" + this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
			if (this.instruction.nativeElement.paused) {
				this.instruction.nativeElement.currentTime = 0;
				setTimeout(() => {
					this.instruction.nativeElement.play();
					$(".instructionBase img").css("cursor", "pointer");
				}, 350)
			}
			if (!this.optionAudio.nativeElement.paused) {
				this.instruction.nativeElement.currentTime = 0;
				this.instruction.nativeElement.pause();
			}
			// if (this.questionSound && this.questionSound.nativeElement) {
			// that.questionSound.nativeElement.pause();
			// that.questionSound.nativeElement.currentTime = 0;
			// that.speakerBtn.nativeElement.children[1].className = "speaker";
			//}
		}
	}

	stopAllSounds(e) {
		//console.log("Event", e);
		if (!this.narrator_voice.nativeElement.paused) {
			e.stopPropagation();
			console.log("narrator voice still playing");
		}
		else { }
	}

	checkAnswer(option, event, id) {
		this.disableHelpBtn = true;
		// Analytics called for attempt counter & first option is clicked
		if (this.myAudiohelp && this.myAudiohelp.nativeElement) {
			this.myAudiohelp.nativeElement.pause();
			this.myAudiohelp.nativeElement.currentTime = 0;
		}
		if (!this.narrator_voice.nativeElement.paused) {
			console.log("narrator voice still playing");
		}
		else {
			// logic to check what user has done is correct
			if (option.id == this.feedback.correct_ans_index) {
				this.isAnsWrong = false;
				// this.ansBlock.nativeElement.children[id].children[1].removeClass('wrongImageStyle')
				// $("#optimage"+id).removeClass('wrongImageStyle')

				this.attemptType = "manual";
				console.log("i have hit correct sequence");
				//this.playSound(this.feedback.write_ans_sound.path.url);
				//initiate animation 
				this.moveTo = this.ansArrangeBlock.nativeElement.children[2].getBoundingClientRect();
				this.moveFrom = this.ansBlock.nativeElement.children[id].children[1].getBoundingClientRect();
				console.log("this.moveTo",this.moveTo)
				this.moveleft = this.moveTo.left - this.moveFrom.left;
				this.movetop = this.moveTo.top - this.moveFrom.top;
				this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div ";
				
				// setTimeout(() => {
				// 	this.feedbackVoRef.nativeElement.src = this.commonAssets.right_sound.location == "content" ? this.containgFolderPath + "/" + this.commonAssets.right_sound.url + "?someRandomSeed=" + Math.random().toString(36) : this.containgFolderPath + "/" + this.commonAssets.right_sound.url + "?someRandomSeed=" + Math.random().toString(36);
				// 	this.feedbackVoRef.nativeElement.play();
				// }, 750)
				this.appModel.enableReplayBtn(false)
				$(this.ansBlock.nativeElement.children[id].children[1]).animate({ left: this.moveleft, top: this.movetop}, 1000, () => {
					console.log("animation completed")
					setTimeout(() => {
						this.feedbackVoRef.nativeElement.src = this.commonAssets.right_sound.location == "content" ? this.containgFolderPath + "/" + this.commonAssets.right_sound.url + "?someRandomSeed=" + Math.random().toString(36) : this.containgFolderPath + "/" + this.commonAssets.right_sound.url + "?someRandomSeed=" + Math.random().toString(36);
						this.feedbackVoRef.nativeElement.play();
					}, 750)
					this.ansBlock.nativeElement.children[id].children[1].style.visibility = 'hidden';
					this.ansArrangeBlock.nativeElement.children[2].style.visibility = 'visible' ;
					this.ansArrangeBlock.nativeElement.children[2].src  = this.containgFolderPath + "/" + option.imgsrc.url;
					this.feedbackVoRef.nativeElement.onended=()=>{					
					this.timernextseg = setInterval(() => {
						// this.checkNextActivities();
						this.removeEvents();
						this.blinkOnLastQues()
						this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div disable-click";

					}, 200)
					// this.ansBlock.nativeElement.children[id].children[1].style.visibility = 'hidden'
					// this.ansArrangeBlock.nativeElement.children[2].style.visibility = 'visible'


				}
					
				  });

				
			}


			else {
				console.log("when wrong answer clicked");
				this.itemid = id;
				this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div ";
				this.moveTo = this.ansArrangeBlock.nativeElement.children[2].getBoundingClientRect();
				this.moveFrom = this.ansBlock.nativeElement.children[id].children[1].getBoundingClientRect();
				console.log("this.moveTo",this.moveTo)
				this.moveleft = this.moveTo.left - this.moveFrom.left;
				this.movetop = this.moveTo.top - this.moveFrom.top;
				setTimeout(()=>{
					this.isAnsWrong = true;
					//this.ansBlock.nativeElement.children[id].children[1].addClass('wrongImageStyle')
					// $("#optimage"+id).addClass('wrongImageStyle')
				},900)
				this.appModel.enableReplayBtn(false)
				$(this.ansBlock.nativeElement.children[id].children[1]).animate({ left: this.moveleft, top: this.movetop}, 1000, () => {
					this.ansBlock.nativeElement.children[id].children[1].style.visibility = 'hidden';
					this.ansArrangeBlock.nativeElement.children[2].style.visibility = 'visible' ;
					this.ansArrangeBlock.nativeElement.children[2].src  = this.containgFolderPath + "/" + option.imgsrc.url;
					setTimeout(() => {
						this.feedbackVoRef.nativeElement.src = this.commonAssets.wrong_sound.location == "content" ? this.containgFolderPath + "/" + this.commonAssets.wrong_sound.url + "?someRandomSeed=" + Math.random().toString(36) : this.containgFolderPath + "/" + this.commonAssets.wrong_sound.url + "?someRandomSeed=" + Math.random().toString(36);
						this.feedbackVoRef.nativeElement.play();
					}, 750)
					
					this.feedbackVoRef.nativeElement.onended=()=>{
							this.appModel.wrongAttemptAnimation();
					}
					

				
				
				})

			}
		}


	}



	sendFeedback(id: string, flag: string) {
		this.confirmModalRef.nativeElement.classList = "modal";
		this.correctAns.nativeElement.classList = "modal";
		this.appModel.enableReplayBtn(false);
		this.feedbackVoRef.nativeElement.pause();
		if (!this.instruction.nativeElement.paused) {
			this.instruction.nativeElement.currentTime = 0;
			this.instruction.nativeElement.pause();
		}
		if (flag == "yes") {
			this.showAnswer()
			// setTimeout(() => {
			// 	this.appModel.invokeTempSubject('showModal', 'manual');
			// }, 100);

			// $("#instructionBar").addClass("disable_div");
			// $("#optionsBlock .options").css("opacity", "0.3");
			// $("#instructionBar").css("opacity", "0.3");
			//   this.checked = true;
		} else {

			console.log("closing modal")

			//close modal
			if (this.clapSound && this.clapSound.nativeElement) {
				this.clapSound.nativeElement.pause()
			}
			if (this.wrongFeedback && this.wrongFeedback.nativeElement) {
				this.wrongFeedback.nativeElement.pause()
			}

			this.appModel.notifyUserAction();
			$("#instructionBar").removeClass("disable_div");
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

			var img_hover2 = array[randomIndex].image_hover;
			var text2 = array[randomIndex].image;
			var text2copy = array[randomIndex].image_original;
			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;

			array[currentIndex].image_hover = img_hover1;
			array[currentIndex].image = text1;
			array[currentIndex].image_original = text1copy;

			array[randomIndex].image_hover = img_hover2;
			array[randomIndex].image = text2;
			array[randomIndex].image_original = text2copy;

		}
		var flag = this.arraysIdentical(array, this.idArray);
		console.log(flag);
		if (flag) {
			this.doRandomize(array);
		}
		else {

		}

	}

	arraysIdentical(a, b) {
		console.log("checking:", a, b);
		var i = a.length;
		//var bool = false;
		while (i--) {
			/*if (a[i].id !== b[i]) 
				return false;
			*/

			if (a[i].id == b[i]) {
				return true;
			}
		}
		return false;
	}

	isPaused() {
		return this.audio.paused;
	}
	checkNextActivities() {
		if (this.isPaused()) {
			this.removeEvents();
			//if(this.currentIdx == this.optionslist.length-1 && !this.isLastActivity && this._sharedService.autoplay_var==0){

			var popup = document.getElementById("correctAns")
			popup.className = "d-flex align-items-center justify-content-center hideit";
			//disable click on options and speaker

			var optionsBlock = document.getElementById("ansBlock");
			if (optionsBlock) {
				optionsBlock.className = optionsBlock.className.concat(" disable");
			}

			if (!this.isAutoplayOn && !this.isLastQues && this.isLastQuesAct) {
				this.blink = true;
			}
			if ((this.isAutoplayOn && !this.isLastQues) || !((this.isLastQuesAct)) || ((this.isLastQuesAct && this.isAutoplayOn && !this.isLastQuesAct))) {
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
			//}

		}
		else {
			console.log("feedback_audio still playing");
		}
	}
	// previous function
	previous() {
		if (this.common_assets && this.common_assets.peechey_jayein) {
			this.common_assets.peechey_jayein = this.common_assets.peechey_jayein_original;
		}
		if (this.common_assets && this.common_assets.aagey_badhein) {
			this.common_assets.aagey_badhein = this.common_assets.aagey_badhein_original;
		}
		setTimeout(() => {
			if (this.navBlock && this.navBlock.nativeElement) {
				this.navBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around disable_div";
			}	
		}, 0)
		//console.log("prev",this.currentIdx);	
		this.blink = false;
		this.reset();

		this.currentIdx--;
		this.appModel.previousSection();
		//this.setData();
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
		if (this.common_assets && this.common_assets.peechey_jayein) {
			this.common_assets.peechey_jayein = this.common_assets.peechey_jayein_original;
		}
		if (this.common_assets && this.common_assets.aagey_badhein) {
			this.common_assets.aagey_badhein = this.common_assets.aagey_badhein_original;
		}

		if (!this.isLastQues) {
			setTimeout(() => {
				if (this.navBlock && this.navBlock.nativeElement) {
					this.navBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around disable_div";
				}
			}, 0)
			this.currentIdx++;

			this.appModel.nextSection();
			//this.setData();
			this.appModel.setLoader(true);
			this.removeEvents();
			this.reset();

		}
	}



	//setEnability(flag, option_ref) {
	// sets enabled or disabled
	//	this.bool=true;
	//	if(this.optionslist.length == option_ref && this.bool ){
	//		this._sharedService.activityfinished();
	//		this.bool=false;
	//	}
	//}

	removeEvents() {
		// remove event handlers for all clickable items in the dom
		this.blink = false;
		clearTimeout(this.timernextseg);
		if (this.fireworks && this.fireworks.nativeElement) {
			let elfireworks: HTMLElement = this.fireworks.nativeElement as HTMLElement
			elfireworks.className = "d-flex align-items-center justify-content-center hideit";
		}
	}

	close() {
		//this.appModel.event = { 'action': 'exit', 'currentPosition': this.currentVideoTime };
		this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
	}

	reset() {
		// will reset all what user performed
		this.audio.pause();
		//this._sharedService.correct_option_attempt_counter =0;
		//this._sharedService.attempt_counter =0;
		//this._sharedService.first_option_selected =0;
		//this._sharedService.first_option_selected_data="none";
		//this._sharedService.speaker_counter =0;
		if (this.myAudiohelp && this.myAudiohelp.nativeElement)
			this.myAudiohelp.nativeElement.pause();
		var optionsBlock = document.getElementById("ansBlock");
		if (optionsBlock) {
			optionsBlock.className = "d-flex flex-row justify-content-around pointer";
		}
		var popup = document.getElementById("correctAns")
		if (popup) {
			popup.className = "d-flex align-items-center justify-content-center hideit";
		}

		if (this.ans && this.ans.nativeElement && this.ans.nativeElement.src)
			this.ans.nativeElement.src = this.assetspath + '/' + this.question.img_sentence_org.url;

	}


	/*resizeContainer(){
		let containerBlock: HTMLElement = this.containerBlock.nativeElement as HTMLElement
		//console.log(this.containerBlock.nativeElement);
		containerBlock.style.width = "initial";
		let targetHeight = window.innerHeight;
		let containerHeight = containerBlock.clientHeight;
		let containerWidth = containerBlock.clientWidth;
		if(containerHeight > targetHeight){
			this.resizeFlag = true;
			while (containerHeight > targetHeight) {
			  containerHeight = containerHeight - (containerHeight * .01);
			  containerWidth = containerWidth - (containerWidth * .01);
			}
		containerBlock.style.width = containerWidth+"px";
		}
	}*/


	closeTitleScreen() {
		this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeOutAnimation";
		setTimeout(() => {
			this.showIntroScreen = false;
			this.next();
		}, 200)

	}
	templatevolume(vol, obj) {
		if (obj.narrator_voice && obj.narrator_voice.nativeElement) {
			obj.narrator_voice.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.narrator && obj.narrator.nativeElement) {
			obj.narrator.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (this.buzzerSound && this.buzzerSound.nativeElement) {
			this.buzzerSound.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.myAudiohelp && obj.myAudiohelp.nativeElement) {
			obj.myAudiohelp.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.audioEl && obj.audioEl.nativeElement) {
			obj.audioEl.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.instruction && obj.instruction.nativeElement) {
			obj.instruction.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.feedbackVoRef && obj.feedbackVoRef.nativeElement) {
			obj.feedbackVoRef.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.titleHelpAudio && obj.titleHelpAudio.nativeElement) {
			obj.titleHelpAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.mainVideo && obj.mainVideo.nativeElement) {
      	obj.mainVideo.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
	}


	ngOnInit() {
		/*this.assetspath=this.basePath;*/
		this.containgFolderPath = this.getBasePath();

		this.assetspath = this.basePath;
		this.appModel.functionone(this.templatevolume, this);//start end
		/*window.onresize = (e) =>{
		 this.resizeContainer();
		}*/
		if (this.appModel.isNewCollection) {
			//console.log("chck:",this.appModel.isNewCollection);
			this.appModel.event = { 'action': 'segmentBegins' };
		}

		let fetchedData: any = this.appModel.content.contentData.data;
		console.log("init--------------------------------->>>>>>>>>>>>>>>>>>>>:", this.appModel.content.contentData.data);
		this.setData();
		if (fetchedData.titleScreen) {
			this.quesInfo = fetchedData;
			this.showIntroScreen = true;
			this.noOfImgs = this.quesInfo.imgCount;
			//if(this.quesInfo.Instruction){
			//this.playSound(this.quesInfo.Instruction);
			/*this.timernextseg = setInterval(()=>{
			if(this.audio.paused){
				this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit";
				clearInterval(this.timernextseg);
					}
				},200)*/
			//} 
		}
		else {
			this.showIntroScreen = false;
			this.setData();
		}
		setTimeout(() => {
			if (this.navBlock && this.navBlock.nativeElement) {
				this.navBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around disable_div";
			}
		}, 0)


		this.appModel.getConfirmationPopup().subscribe((val) => {
			if (val == "uttarDikhayein") {
				if (!this.instruction.nativeElement.paused) {
					this.instruction.nativeElement.currentTime = 0;
					this.instruction.nativeElement.pause();
				}

				if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
					this.confirmModalRef.nativeElement.classList = "displayPopup modal";
					this.appModel.notifyUserAction();
				}
			}
			if (val == "replayVideo") {
				console.log("replaying video")
				if (!this.instruction.nativeElement.paused)
            {
              this.instruction.nativeElement.pause();
              this.instruction.nativeElement.currentTime = 0;
            }
				this.PlayPauseFlag = true;
          		this.quesObj.quesPlayPause = this.quesObj.quesPause;
          		this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
				this.appModel.videoStraming(true);
				if (this.confirmReplayRef && this.confirmReplayRef.nativeElement) {
				  $("#optionsBlock .options").addClass("disable_div");
				  this.confirmReplayRef.nativeElement.classList = "displayPopup modal";
				}
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
				console.log("mode manual2", mode)

				//show modal of auto
				//show answer



				this.showAnswer();
				this.isAnsWrong = false


				//this.showAnsModal(this.myoption[this.feedback.correct_ans_index])
				//this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
				//$("#instructionBar").addClass("disable_div");
				//$("#optionsBlock.options").css("opacity", "0.3");
				//$("#instructionBar").css("opacity", "0.3");
			}
		})


		this.appModel.postWrongAttempt.subscribe(() => {
			this.postWrongAttemplt();
		});
	}


	postWrongAttemplt() {
		//wrong-right ans
		//shake options
		// this.isAnsWrong = false;
		// $("#optimage"+this.itemid).removeClass('wrongImageStyle')
		this.ansBlock.nativeElement.children[this.itemid].children[1].style.visibility = 'visible';
		this.ansArrangeBlock.nativeElement.children[2].style.visibility = 'hidden' ;
		$(this.ansBlock.nativeElement.children[this.itemid].children[1]).animate({ left: 0, top: 0}, 1000, () => {
			console.log("stuffs to do wornog answer pop-up")
			this.appModel.enableReplayBtn(true);
			this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center";

		})
	}


	ngAfterViewChecked() {
		if (this.titleAudio && this.titleAudio.nativeElement) {
			this.titleAudio.nativeElement.onended = () => {
				this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeInAnimation";
			}
		}
		/*if(!this.resizeFlag){
			   this.resizeContainer();
	   }*/
		this.templatevolume(this.appModel.volumeValue, this);

	}

	getBasePath() {
		if (this.appModel && this.appModel.content) {
			return this.appModel.content.id + '';
		}
	}

	checkImgLoaded() {
		if (!this.loadFlag) {
			this.noOfImgsLoaded++;
			console.log("this.noOfImgsLoaded", this.noOfImgsLoaded, this.noOfImgs)
			if (this.noOfImgsLoaded >= this.noOfImgs) {
				this.appModel.setLoader(false);
				this.loadFlag = true;
				this.checkforQVO();
				clearTimeout(this.loaderTimer);
			}
		}
	}


	checkforQVO() {
		if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
			this.narrator.nativeElement.src = this.quesObj.quesInstruction.location == "content" ? this.containgFolderPath + "/" + this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetspath + "/" + this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
			this.appModel.handlePostVOActivity(true);
			this.appModel.enableReplayBtn(false);
			this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div";
			this.narrator.nativeElement.play();
			this.loaderTimer = setTimeout(() => {
				this.appModel.setLoader(false);
				console.log("stopping loader")
			}, 500);
			this.narrator.nativeElement.onended = () => {
				//this.startAnsShowTimer()
				//this.setBubbleEmpty();
				//this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
				this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center";
				this.appModel.handlePostVOActivity(false);
				this.appModel.enableReplayBtn(true);

			}
		} else {
			this.appModel.handlePostVOActivity(false);
			this.appModel.enableReplayBtn(true);
		}
	}


	blinkOnLastQues() {
		if (this.appModel.isLastSectionInCollection) {
			this.appModel.blinkForLastQues(this.attemptType);
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
			this.appModel.moveNextQues(this.attemptType);
		}
	}

	showReplay(ref, flag: string, action?: string) {
		ref.classList = "modal";
		this.appModel.notifyUserAction();
		if (flag == "yes") {
		  this.replayconfirmAssets.confirm_btn = this.replayconfirmAssets.confirm_btn_original;
		  if (action == "replay") {
			//this.isPlayVideo = true;
			this.replayVideo();
		  }
		} else if (flag == "no") {
		  this.appModel.videoStraming(false);
		  this.appModel.enableReplayBtn(true);
		  setTimeout(() => {
			$("#instructionBar").removeClass("disable_div");
			$("#optionsBlock .options").removeClass("disable_div");
		  }, 1000);
		}
	  }

	  replayVideo() {
		this.videoReplayd = true;
		this.isPlayVideo = true;
		this.appModel.enableSubmitBtn(false);
		$("#optionsBlock .options").addClass("disable_div");
		$(".instructionBase").addClass("disable_div");
		this.appModel.navShow = 1;
		//this.mainVideo.nativeElement.src = this.quesObj.quesVideo.location == "content" ? this.containgFolderPath + "/" + this.quesObj.quesVideo.urlOgv + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.quesObj.quesVideo.urlOgv + "?someRandomSeed=" + Math.random().toString(36);
		setTimeout(() => {
		  this.mainVideo.nativeElement.play();
		  //this.appModel.stopAllTimer();
		  this.mainVideo.nativeElement.onended = () => {
			//this.appModel.enableSubmitBtn(true);
			this.appModel.navShow = 2;
			$("#optionsBlock .options").removeClass("disable_div");
			$(".instructionBase").removeClass("disable_div");
			this.isPlayVideo = false;
			this.appModel.videoStraming(false);
			this.appModel.notifyUserAction();
		  }
		}, 500)
	  }

	  checkVideoLoaded() {
		if (!this.videoReplayd) {
		  this.appModel.setLoader(false);
		  this.appModel.navShow = 1;
		  this.isPlayVideo = true;
		  this.appModel.isVideoPlayed = true;
		  this.appModel.stopAllTimer();
		}
	  }


	  endedHandler() {
		if (!this.videoReplayd) {
		  this.isPlayVideo = false;
		  this.appModel.navShow = 2;
		  this.appModel.setLoader(true);
		  //this.appModel.startPreviousTimer();
		  setTimeout(() => {
			let navTimer = setInterval(() => {
				if (this.navBlock && this.navBlock.nativeElement) {
					clearInterval(navTimer);
					setTimeout(() => {
						if (this.navBlock && this.navBlock.nativeElement) {
							this.navBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around"
						}
					}, 500)
				}
			}, 100)
			this.noOfImgsLoaded = 0;
			this.appModel.setLoader(true);
			this.loaderTimer = setTimeout(() => {
				this.appModel.setLoader(false);
			}, 5000)

		}, this.quesInfo.formatTimeout)


		}
	  }

	showAnswer() {
		this.attemptType = "hideAnimation"
		this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div";
		//this.checkAnswer(obj,obj)
		this.ans.nativeElement.src = this.assetspath + '/' +this.feedback.correct_ans_url;
		this.confirmModalRef.nativeElement.classList="modal";
		this.ans.nativeElement.style.visibility = 'visible';
		let id: any;
		this.myoption.forEach((element,i) => {
			if (element.id == this.feedback.correct_ans_index){
				id = i;
			}
		});
		console.log("id",id)
		this.myoption[id].imgsrc.url = "";
		this.appModel.resetBlinkingTimer();
		setTimeout(() => {
			this.feedbackVoRef.nativeElement.src = this.commonAssets.show_sound.location == "content" ? this.containgFolderPath + "/" + this.commonAssets.show_sound.url + "?someRandomSeed=" + Math.random().toString(36) : this.containgFolderPath + "/" + this.commonAssets.show_sound.url + "?someRandomSeed=" + Math.random().toString(36);
			this.feedbackVoRef.nativeElement.play();
		}, 750)


		setTimeout(() => {
			// this.checkNextActivities();
			this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div disable-click";
			this.removeEvents();
			this.blinkOnLastQues();
		}, 5000)


	}

	

}
