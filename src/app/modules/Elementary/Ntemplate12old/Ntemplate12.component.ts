import { Component, OnInit, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { PlayerConstants } from '../../../common/playerconstants';
import { ThemeConstants } from '../../../common/themeconstants';
import { SharedserviceService } from '../../../services/sharedservice.service';
import { Subscription } from 'rxjs'
import 'jquery';


declare var $: any;

@Component({
	selector: 'ntemp12',
	templateUrl: './Ntemplate12.component.html',
	styleUrls: ['./Ntemplate12.component.css'],

})

export class Ntemplate12 implements OnInit, AfterViewChecked {
	private appModel: ApplicationmodelService;
	constructor(appModel: ApplicationmodelService, private Sharedservice: SharedserviceService) {
		this.appModel = appModel;
		this.assetsfolderlocation = this.appModel.assetsfolderpath;
		this.appModel.navShow = 2;
		this.appModel.setLoader(true);
		this.appModel.handlePostVOActivity(false);
		// if error occured during image loading loader wil stop after 5 seconds 
		this.loaderTimer = setTimeout(() => {
			this.appModel.setLoader(false);
		}, 5000);
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

	@ViewChild('ans') ans: any;
	@ViewChild('optionAudio') optionAudio: any;
	@ViewChild('instruction') instruction: any;
	@ViewChild('narrator_voice') narrator_voice: any;
	@ViewChild('myAudiohelp') myAudiohelp: any;
	@ViewChild('audioEl') audioEl: any;
	@ViewChild('titleNavBtn') titleNavBtn: any;
	@ViewChild('container') containerBlock: any;
	@ViewChild('fireworks') fireworks: any;
	@ViewChild('ansBlock') ansBlock: any;
	@ViewChild('helpbtn') helpbtn: any;
	@ViewChild('navBlock') navBlock: any;
	@ViewChild('buzzerSound') buzzerSound: any;
	@ViewChild('titleAudio') titleAudio: any;
	@ViewChild('autoPlayOnOffContainer') autoPlayOnOffContainer: any;
	@ViewChild('maincontent') maincontent: any;
	@ViewChild('confirmModalRef') confirmModalRef: any;
	@ViewChild('correctAns') correctAns: any;
	@ViewChild('optionBlock') optionBlock: any;
	@ViewChild('answerBlock') answerBlock: any;
	@ViewChild('narrator') narrator: any;
	@ViewChild('feedbackVoRef') feedbackVoRef: any;

	disableHelpBtn: boolean = false;
	optimage: any;
	assetspath: any;
	ansShow: boolean = false;
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
	// questionn: any = "";
	feedback: any = "";
	answers: any = "";
	optionBlank: any = "";
	Instruction: any = "";
	quesInfo: any = "";
	isFirstQues: boolean;
	isLastQues: boolean = false;
	isAutoplayOn: boolean;
	isLastQuesAct: boolean;
	feedbackObj: any;
	autoplay_text: string = "";
	resizeFlag: boolean = false;
	confirmPopupAssets: any;
	noOfImgs: number;
	noOfImgsLoaded: number = 0;
	loaderTimer: any;
	assetsfolderlocation: string = "";
	commonassets: any = "";
	hasEventFired: boolean = false;
	ifRightAns: boolean = false;
	tempSubscription: Subscription;
	attemptType: string = "";
	wrongImgOption: any;
	rightAnsSoundUrl: string = "";
	feedbackPopup: any;
	rightPopup: any;
	flag: string = "no";
	itemid: any = 0;
	loadFlag: boolean = false;
	quesObj: any;
	containgFolderPath: string = "";
	controlHandler = {
		isTab:true,
		isSubmitRequired: false,
		isReplayRequired: false
	 };
	  /*Start: Theme Implementation(Template Changes)*/
	  
	  themePath: any;
	  fetchedcontent: any;
	  functionalityType: any;
	  showAnsTimeout: number;
	  /*END: Theme Implementation(Template Changes)*/
	  disableInstruction:boolean=false;
	  disableMainContent:boolean=true;
	get basePath(): any {
		// console.log('temponeComponent: path=', this.appModel.content.id + '/' + this.appModel.content.contentData.data['path']);
		if (this.appModel && this.appModel.content) {

			return this.appModel.content.id + '';
		}
	}
	ngOnInit() {
		// let that = this;
        // $( "#navBlock" ).click(function() {
        //     if (!that.instruction.nativeElement.paused)
        //     {
        //       that.instruction.nativeElement.pause();
        //       that.instruction.nativeElement.currentTime = 0;
        //     }
        //   });
		this.assetspath = this.basePath;
		this.containgFolderPath = this.getBasePath();
		this.appModel.functionone(this.templatevolume, this);//start end		
		if (this.appModel.isNewCollection) {
			//console.log("chck:",this.appModel.isNewCollection);
			this.appModel.event = { 'action': 'segmentBegins' };
		}
		// let fetchedData: any = this.appModel.content.contentData.data;
		// console.log("init:", this.appModel.content.contentData.data);
		
		/*Start: Theme Implementation(Template Changes)*/
		let fetchedData: any = this.appModel.content.contentData.data;
		this.fetchedcontent = JSON.parse(JSON.stringify(fetchedData));;
		this.functionalityType = this.appModel.content.contentLogic.functionalityType;
		this.themePath = ThemeConstants.THEME_PATH + this.fetchedcontent.productType + '/' + this.fetchedcontent.theme_name;
		this.Sharedservice.imagePath(this.fetchedcontent, this.containgFolderPath, this.themePath, undefined);
		this.checkquesTab();
		this.appModel.globalJsonData.subscribe(data => {
		  this.showAnsTimeout = data.showAnsTimeout;
		});
		/*End: Theme Implementation(Template Changes)*/
		if (fetchedData.titleScreen) {
			this.quesInfo = fetchedData;
			this.showIntroScreen = true;
			this.noOfImgs = this.quesInfo.imgCount;
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
					this.disableInstruction=false;
				}

				if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
					this.confirmModalRef.nativeElement.classList = "displayPopup modal";
					this.appModel.notifyUserAction();
				}
			}
		})

		this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
			if (mode == "manual") {
				//show modal for manual
				this.appModel.notifyUserAction();
				if (this.correctAns && this.correctAns.nativeElement) {
					this.disableInstruction=true;
					this.correctAns.nativeElement.classList = "displayPopup modal";
					// this.setFeedbackAudio(mode);
				}

				console.log("mode manuall", mode)

			} else if (mode == "auto") {
				console.log("mode manual2", mode)

				this.showAnswer();
			}
		})

		this.appModel.postWrongAttempt.subscribe(() => {
			this.postWrongAttemplt();
		});
		this.appModel.resetBlinkingTimer();
		this.appModel.handleController(this.controlHandler);
	}
	ngAfterViewChecked() {
		if (this.titleAudio && this.titleAudio.nativeElement) {
			this.titleAudio.nativeElement.onended = () => {
				this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeInAnimation";
			}
		}
		this.templatevolume(this.appModel.volumeValue, this);

	}
	setData() {
		if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {

			// let fetchedData: any = this.appModel.content.contentData.data;
			// this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
			this.speaker = this.fetchedcontent.speaker;
			this.commonassets = this.fetchedcontent.commonassets;
			this.myoption = JSON.parse(JSON.stringify(this.fetchedcontent.options));
			console.log("myoption : " + this.myoption);
			// this.questionn = this.fetchedcontent.quess;
			this.question = this.fetchedcontent.ques;
			this.feedback = this.fetchedcontent.feedback;
			this.answers = this.fetchedcontent.answers;
			this.optionBlank = this.fetchedcontent.optionsBlank;
			this.isFirstQues = this.commonassets.isFirstQues;
			this.noOfImgs = this.commonassets.imgCount;
			this.isLastQues = this.appModel.isLastSection;
			this.isLastQuesAct = this.appModel.isLastSectionInCollection;
			this.quesObj = this.fetchedcontent.quesObj;
			//this.isAutoplayOn = this.appModel.autoPlay;
			this.feedbackObj = this.fetchedcontent.feedback;
			this.confirmPopupAssets = this.fetchedcontent.feedback.confirm_popup;
			if (this.fetchedcontent) {
				var optionsBlock = document.getElementById("optionsBlock")
				if (optionsBlock)
					optionsBlock.className = "d-flex align-items-center justify-content-center";
				//} 
			}
			setTimeout(() => {
				if (this.navBlock && this.navBlock.nativeElement) {
					this.navBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around";
				}
			}, 200)
		} else {
			console.log("content not loaded")
		}
	}
	/******Checking of existance of quesTab in content JSON *******/
	checkquesTab() {
		if (this.fetchedcontent.commonassets.ques_control != undefined) {
		  this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
		} else {
		  this.appModel.getJson();
		}
	  }
	onHoverOptions(option, idx) {
		//console.log("in",option);
		if (!this.narrator_voice.nativeElement.paused) {
			console.log("narrator voice still playing");
		}
		else {
			option.image = option.image_hover;
			//this.ansBlock.nativeElement.className="pointer";
			this.ansBlock.nativeElement.children[idx].className = "options pointer";
		}
	}

	onHoveroutOptions(option, idx) {
		//console.log("out",option);
		option.image = option.image_original;
		//this.ansBlock.nativeElement.className="";
		this.ansBlock.nativeElement.children[idx].className = "options";



	}
	onHoverhelp(option) {
		//console.log("in",option);
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
		this.commonassets.aagey_badhein = this.commonassets.aagey_badhein_hover;
	}
	onLeaveAageyBadheinBtn() {
		this.commonassets.aagey_badhein = this.commonassets.aagey_badhein_original;
	}
	onHoverPeecheyBtn() {
		this.commonassets.peechey_jayein = this.commonassets.peechey_jayein_hover;
	}
	onLeavePeecheyBtn() {
		this.commonassets.peechey_jayein = this.commonassets.peechey_jayein_original;
	}
	onHoverZaariRakhein() {
		this.quesInfo.zaariRakhein = this.quesInfo.zaariRakhein_hover;
	}
	onHoverOutZaariRakhein() {
		this.quesInfo.zaariRakhein = this.quesInfo.zaariRakhein_original;
	}
	playSound(sound) {
		// plays a sound
		// if (this.myAudiohelp && this.myAudiohelp.nativeElement) {
		// 	this.myAudiohelp.nativeElement.pause();
		// }
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

	stopAllSounds(e) {
		//console.log("Event", e);
		if (!this.narrator_voice.nativeElement.paused) {
			e.stopPropagation();
			console.log("narrator voice still playing");
		}
		else { }
	}

	moveTo: any;
	moveFrom: any;
	moveleft: any;
	movetop: any;

	checkAnswer(option, event) {
		// $( "#navBlock" ).addClass("disableNavBtn")
		this.controlHandler.isTab = false;
    	this.appModel.handleController(this.controlHandler);
		if (!this.instruction.nativeElement.paused) {
			this.instruction.nativeElement.currentTime = 0;
			this.instruction.nativeElement.pause();
			this.disableInstruction=false;
		}
		// Analytics called for attempt counter & first option is clicked
		this.appModel.notifyUserAction();
		// if (this.myAudiohelp && this.myAudiohelp.nativeElement) {
		// 	this.myAudiohelp.nativeElement.pause();
		// 	this.myAudiohelp.nativeElement.currentTime = 0;
		// }
		if (!this.narrator_voice.nativeElement.paused) {
			console.log("narrator voice still playing");
		}
		else {
			this.disableHelpBtn = true;
			// logic to check what user has done is correct
			if (option.id == this.feedback.correct_ans_index) {
				let id = option.idx;
				this.attemptType = "manual";
				this.moveTo = this.answerBlock.nativeElement.children[0].children[2].getBoundingClientRect();
				this.moveFrom = this.ansBlock.nativeElement.children[id].children[1].getBoundingClientRect();
				console.log("this.moveTo", this.moveTo)
				this.itemid = option.idx;
				this.moveleft = this.moveTo.left - this.moveFrom.left + 25;
				this.movetop = this.moveTo.top - this.moveFrom.top;
				this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div ";
				$(this.ansBlock.nativeElement.children[id].children[1]).animate({ left: this.moveleft, top: this.movetop, height: this.moveTo.height, width: this.moveTo.width }, 1000, () => {
					this.ansBlock.nativeElement.children[id].children[1].style.visibility = 'hidden'
					this.answerBlock.nativeElement.children[0].children[2].style.visibility = 'visible';
					
					setTimeout(() => {
						this.feedbackVoRef.nativeElement.src = this.commonassets.right_sound.url + "?someRandomSeed=" + Math.random().toString(36);
						this.feedbackVoRef.nativeElement.play();
					}, 750)
					
					this.feedbackVoRef.nativeElement.onended=()=>{	
					setTimeout(() => {
						// this.checkNextActivities();
						this.controlHandler.isTab = true;
    					this.appModel.handleController(this.controlHandler);
						this.removeEvents();
						this.blinkOnLastQues()
						// $( "#navBlock" ).removeClass("disableNavBtn")
					}, 200)
					setTimeout(() => {
						this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div disable-click";
					}, 5000)
				}
				});
			}
			else {
				this.itemid = option.idx;
				this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div ";
				this.moveTo = this.answerBlock.nativeElement.children[0].children[2].getBoundingClientRect();
				this.moveFrom = this.ansBlock.nativeElement.children[this.itemid].children[1].getBoundingClientRect();
				this.moveleft = this.moveTo.left - this.moveFrom.left + 25;
				this.movetop = this.moveTo.top - this.moveFrom.top;
				let id = option.idx;
				$(this.ansBlock.nativeElement.children[id].children[1]).animate({ left: this.moveleft, top: this.movetop, height: this.moveTo.height, width: this.moveTo.width }, 1000, () => {
						this.ansBlock.nativeElement.children[id].children[1].style.visibility = 'hidden'
						this.answerBlock.nativeElement.children[0].children[2].style.visibility = 'visible';
					
						setTimeout(() => {
							this.feedbackVoRef.nativeElement.src = this.commonassets.wrong_sound.url + "?someRandomSeed=" + Math.random().toString(36);
							this.feedbackVoRef.nativeElement.play();
						}, 750)
						this.feedbackVoRef.nativeElement.onended=()=>{							
						this.appModel.wrongAttemptAnimation();
					}

				});

			}
		}


	}

	playHoverInstruction() {
		if (!this.narrator_voice.nativeElement.paused) {
			console.log("narrator/instruction voice still playing");
		} else {
			this.appModel.notifyUserAction();
			console.log("play on Instruction");
			if (this.instruction.nativeElement.paused) {
				this.instruction.nativeElement.currentTime = 0;
				this.disableInstruction=true;
				this.instruction.nativeElement.play();
				this.instruction.nativeElement.onended = () => {
					this.disableInstruction=false;					
				}
				// if (!this.optionAudio.nativeElement.paused) {
				// 	this.instruction.nativeElement.currentTime = 0;
				// 	this.instruction.nativeElement.pause();
				// }				
			}

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
			//}

		}
		else {
			console.log("feedback_audio still playing");
		}
	}

	sendFeedback(id: string, flag: string) {
		this.confirmModalRef.nativeElement.classList = "modal";
		// this.correctAns.nativeElement.classList = "modal";
		this.flag = flag;
		if (flag == "yes") {
			this.showAnswer();
		} else {
			console.log("closing modal")

			if (this.ifRightAns) {
				this.removeEvents();
				this.ifRightAns = false;
				// $("#ansBlock .options").css("opacity", "0.3");
				// $("#ansBlock .options").addClass("disable_div");
				// $("#ansBlock").css("pointer-events", 'none');
				// $("#instructionBar").css("opacity", "0.3");
				// $("#quesImage").css("opacity", "0.3");
				// $("#quesImage").css("pointer-events", 'none');
				// $("#answerBlock").css("opacity", "0.3");

			}
			this.appModel.notifyUserAction();
			this.disableInstruction=true;
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
					this.appModel.event = { 'action': 'end' };
				}
			}

		} else {
			this.appModel.moveNextQues(this.attemptType);
		}
	}


	// previous function
	previous() {
		if (this.commonassets && this.commonassets.peechey_jayein) {
			this.commonassets.peechey_jayein = this.commonassets.peechey_jayein_original;
		}
		if (this.commonassets && this.commonassets.aagey_badhein) {
			this.commonassets.aagey_badhein = this.commonassets.aagey_badhein_original;
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
		if (this.commonassets && this.commonassets.peechey_jayein) {
			this.commonassets.peechey_jayein = this.commonassets.peechey_jayein_original;
		}
		if (this.commonassets && this.commonassets.aagey_badhein) {
			this.commonassets.aagey_badhein = this.commonassets.aagey_badhein_original;
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
		this.audio.pause()
		// if (this.myAudiohelp && this.myAudiohelp.nativeElement)
		// 	this.myAudiohelp.nativeElement.pause();
		var popup = document.getElementById("correctAns")
		if (popup) {
			popup.className = "d-flex align-items-center justify-content-center hideit";
		}
		var optionsBlock = document.getElementById("optionsBlock");
		if (optionsBlock) {
			optionsBlock.className = "d-flex align-items-center justify-content-center";
		}
		if (this.ans && this.ans.nativeElement && this.ans.nativeElement.src)
			this.ans.nativeElement.src = this.question.img_sentence_org;

	}

	closeTitleScreen() {
		this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeOutAnimation";
		setTimeout(() => {
			this.showIntroScreen = false;
			this.next();
		}, 200)

	}

	
	postWrongAttemplt() {
		this.ansBlock.nativeElement.children[this.itemid].children[1].style.visibility = 'visible'
		this.answerBlock.nativeElement.children[0].children[2].style.visibility = 'hidden';
		$(this.ansBlock.nativeElement.children[this.itemid].children[1]).animate({ left: 0, top: 0 }, 1000, () => {
			console.log("stuffs to do after wornog answer pop-up")
			// $( "#navBlock" ).removeClass("disableNavBtn")
			this.controlHandler.isTab = true;
			this.appModel.handleController(this.controlHandler);
			this.ansBlock.nativeElement.children[this.itemid].children[1].style.height = 'auto'
			this.ansBlock.nativeElement.children[this.itemid].children[1].style.width = 'auto'
			this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center";
		})
		//shake options
	}


	getBasePath() {
		if (this.appModel && this.appModel.content) {
			return this.appModel.content.id + '';
		}
	}


	templatevolume(vol, obj) {
		if (obj.narrator && obj.narrator.nativeElement) {
			obj.narrator.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (this.buzzerSound && this.buzzerSound.nativeElement) {
			this.buzzerSound.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.myAudiohelp && obj.myAudiohelp.nativeElement) {
			obj.myAudiohelp.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.titleAudio && obj.titleAudio.nativeElement) {
			obj.titleAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.instruction && obj.instruction.nativeElement) {
			obj.instruction.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.audio && obj.audio.nativeElement) {
			obj.audio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
	}


	hoverConfirm() {
		this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_hover;
	}

	houtConfirm() {
		this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_original;
	}

	hoverDecline() {
		this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_hover;
	}

	houtDecline() {
		this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_original;
	}

	hoverCloseConfirm() {
		this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_hover;
	}
	houtCloseConfirm() {
		this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_original;
	}

	
	updateAutoplay() {
		if (this.autoPlayOnOffContainer && this.autoPlayOnOffContainer.nativeElement) {
			if (this.autoPlayOnOffContainer.nativeElement.children[1].checked) {
				this.autoplay_text = "On"
				this.isAutoplayOn = true;
				this.appModel.updateAutoPlay(true);
			} else {
				this.autoplay_text = "Off"
				this.isAutoplayOn = false;
				this.appModel.updateAutoPlay(false);
			}
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
			this.narrator.nativeElement.src = this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
			this.appModel.handlePostVOActivity(true);
			this.appModel.enableReplayBtn(true);

			this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div";
			this.narrator.nativeElement.play();
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

	showAnswer() {
		this.attemptType = "hideAnimation";
		this.ansShow = true;
		this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div";
		//this.checkAnswer(obj,obj)
		this.ans.nativeElement.src = this.assetspath + '/' + this.feedback.correct_ans_url;
		this.confirmModalRef.nativeElement.classList="modal";
		this.ans.nativeElement.style.visibility = 'visible';
		let id: any;
		this.myoption.forEach((element, i) => {
			if (element.id == this.feedback.correct_ans_index) {
				id = i;
			}
		});
		console.log("id", id)
		this.myoption[id].imgsrc.url = "";
		this.appModel.resetBlinkingTimer();
		setTimeout(() => {
			this.feedbackVoRef.nativeElement.src = this.commonassets.show_sound.url + "?someRandomSeed=" + Math.random().toString(36);
			this.feedbackVoRef.nativeElement.play();
		}, 750)
		this.feedbackVoRef.nativeElement.onended=()=>{	
			setTimeout(() => {
				// this.checkNextActivities();
				this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div disable-click";
				this.removeEvents();
				this.blinkOnLastQues()
			}, 3000)
		}
		
	}
}