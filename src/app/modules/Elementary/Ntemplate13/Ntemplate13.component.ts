import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { Subscription } from 'rxjs'
import 'jquery';
declare var $: any;
import { PlayerConstants } from '../../../common/playerconstants';
import { SharedserviceService } from '../../../services/sharedservice.service';
import { ThemeConstants } from '../../../common/themeconstants';

@Component({
	selector: 'ntemp13',
	templateUrl: './Ntemplate13.component.html',
	styleUrls: ['./Ntemplate13.component.css', '../../../view/css/bootstrap.min.css'],

})

export class Ntemplate13 implements OnInit {
	private appModel: ApplicationmodelService;
	constructor(appModel: ApplicationmodelService, private Sharedservice: SharedserviceService) {
		this.appModel = appModel;
		this.assetsPath = this.appModel.assetsfolderpath;
		this.appModel.navShow = 2;
		this.appModel.setLoader(true);
		// if error occured during image loading loader wil stop after 5 seconds 
		this.loaderTimer = setTimeout(() => {
			this.appModel.setLoader(false);
			//this.checkforQVO();
		}, 5000);

		this.appModel.notification.subscribe(
			(data) => {
				console.log('Component: constructor - data=', data);
				switch (data) {
					case PlayerConstants.CMS_PLAYER_CLOSE:
						this.close();
						break;
					default:
						console.log('Component: constructor - default');
						break;
				}
			}
		);
	}

	@ViewChild("optionsBlock") optionsBlock: any;
	@ViewChild('narrator') narrator: any;
	@ViewChild('instruction') instruction: any;
	@ViewChild('wrongOptAudio') wrongOptAudio: any;
	@ViewChild('optionAudio') optionAudio: any;
	@ViewChild('correctAns') correctAns: any;
	@ViewChild('wrongAns') wrongAns: any;
	@ViewChild('burst') burst: any;
	@ViewChild('optionBlock') optionBlock: any;
	@ViewChild('container') containerBlock: any;
	@ViewChild('titleNavBtn') titleNavBtn: any;
	@ViewChild('maincontent') maincontent: any;
	@ViewChild('helpBtn') helpBtn: any;
	@ViewChild('titleAudio') titleAudio: any;
	@ViewChild('titleHelpAudio') titleHelpAudio: any;
	@ViewChild('clapSound') clapSound: any;
	@ViewChild('buzzerSound') buzzerSound: any;
	@ViewChild('wrongFeedback') wrongFeedback: any;
	@ViewChild('navBlock') navBlock: any;
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

	disableSection:boolean = false;
	audio = new Audio();
	blink: boolean = false;
	currentIdx = 0;
	quesInfo: any = "";
	myoption: any = [];
	narratorAudio: any;
	question: any = "";
	feedback: any = "";
	bool: boolean = false;
	showIntroScreen: boolean = true;
	commonAssets: any = "";
	idArray: any = [];
	resultSound: any = "";
	isFirstQues: boolean;
	isLastQues: boolean = false;
	isAutoplayOn: boolean;
	isLastQuesAct: boolean;
	quesObj: any;
	isPlayVideo: boolean;
	noOfImgs: number;
	noOfImgsLoaded: number = 0;
	loaderTimer: any;
	containgFolderPath: string = "";
	assetsPath: string = "";
	loadFlag: boolean = false;
	disableHelpBtn: boolean = false;
	hasEventFired: boolean = false;
	confirmPopupAssets: any;
	infoPopupAssets: any;
	feedbackObj: any;
	tempSubscription: Subscription;
	wrongImgOption: any;
	feedbackPopup: any;
	rightPopup: any;
	wrongPopup: any;
	checked: boolean = false;
	attemptType: string = "";
	popUpClosed: boolean = false;
	ifWrongAns: boolean = false;
	ifRightAns: boolean = false;
	rightAnsSoundUrl: string = "";
	fixedOptions: any = [];
	themePath: any;
	fetchedcontent: any;
	functionalityType: any;
	InstructionVo: boolean = true;
	showAnsTimeout: any;
	closeDelayTime:any;
	styleHeaderPopup: any;
	styleBodyPopup: any;
	rightanspopUpheader_img: boolean = false;
	wronganspopUpheader_img: boolean = false;
	showanspopUpheader_img: boolean = false;
	rightAnspopupAssets: any;
	disableSpeaker: boolean = false;
	controlHandler = {
	  isSubmitRequired:false,
      isReplayRequired:false
   };


	hoverDecline() {
		this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_hover;
	}

	houtDecline() {
		this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_original;
	}

	showhoverConfirm() {
		this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_hover;
	  }
	
	  showhoutConfirm() {
		this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_original;
	  }
	  hoverCloseConfirm() {
		this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_hover;
	  }
	  houtCloseConfirm() {
		this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_original;
	  }

	lastOpt: any;

	onHoverOption(opt, index) {
		//pauseinstruction VO
		console.log("this.lastOpt:", this.lastOpt, "index:", index)
		if (this.lastOpt != index) {

			this.appModel.notifyUserAction();
			if (!this.instruction.nativeElement.paused) {
				this.instruction.nativeElement.currentTime = 0;
				this.instruction.nativeElement.pause();
			}

			for (let i in this.myoption) {
				if (!this.optionBlock.nativeElement.children[i].children[2].paused) {
					return false;
				}

			}

			if (this.titleHelpAudio && this.titleHelpAudio.nativeElement) {
				this.titleHelpAudio.nativeElement.pause();
				this.titleHelpAudio.nativeElement.currentTime = 0;
			}
			//check for showWave 
			if (opt.showWave) {
				for (let i in this.myoption) {
					this.optionBlock.nativeElement.children[i].children[1].className = "speaker";
				}

				opt.imgsrc = opt.imgsrc_hover;
				this.optionBlock.nativeElement.children[index].children[1].className = "speaker dispFlex";
			}
			if (opt.sound) {
				this.optionBlock.nativeElement.children[index].children[2].play();
				this.lastOpt = index;
			}
			this.optionBlock.nativeElement.children[index].children[2].onended = () => {
				this.optionBlock.nativeElement.children[index].children[1].className = "speaker";
			}
		}
		else {
			console.log("same option")
		}
	}

	entering(opt, i) {
		console.log("optionChanged")
	}

	onHoverOptionOut(opt) {
		opt.imgsrc = opt.imgsrc_original;
		this.lastOpt = undefined
	}

	playHoverInstruction() {
		this.disableSection=true;
		this.appModel.notifyUserAction();
		if (!this.narrator.nativeElement.paused!) {
			console.log("narrator/instruction voice still playing");
		} else {
			console.log("play on Instruction");
			if (this.instruction.nativeElement.paused) {
				this.instruction.nativeElement.currentTime = 0;
				this.instruction.nativeElement.play();
				$(".instructionBase img").css("cursor", "pointer");
			}
			if (this.optionAudio && !this.optionAudio.nativeElement.paused) {
				this.instruction.nativeElement.currentTime = 0;
				this.instruction.nativeElement.pause();
			}
		}
		this.instruction.nativeElement.onended = () => {
			this.disableSection=false;
		}
	}


	sendFeedback(id: string, flag: string) {
		console.log(id);
		console.log(flag);
		this.confirmModalRef.nativeElement.classList = "modal";
		this.correctAns.nativeElement.classList = "modal";
		this.wrongOptAudio.nativeElement.pause();
		this.feedbackVoRef.nativeElement.pause();
		if (!this.instruction.nativeElement.paused) {
			this.instruction.nativeElement.currentTime = 0;
			this.instruction.nativeElement.pause();
		}
		if (flag == "yes") {
			//show answer
			this.showAnsModal(this.fixedOptions[this.feedback.correct_ans_index])

			if (this.optionsBlock) {
				this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
			}
			setTimeout(() => {
				this.appModel.invokeTempSubject('showModal', 'manual');
			}, 100);

			$("#instructionBar").addClass("disable_div");
			$("#optionsBlock .options").css("opacity", "0.3");
			$("#instructionBar").css("opacity", "0.3");
			//   this.checked = true;
		} else {

			console.log("closing modal")
			this.popUpClosed = true;
			//close modal
			if (this.instruction.nativeElement) {
				this.clapSound.nativeElement.pause()
			}
			if (this.wrongFeedback.nativeElement) {
				this.wrongFeedback.nativeElement.pause()
			}
			console.log("this.ifWrongAns", this.ifWrongAns)
			if (this.ifWrongAns) {
				this.removeEvents();
				this.appModel.wrongAttemptAnimation();
				this.idArray = [];
				for (let i of this.myoption) {
					this.idArray.push(i.id);
				}

				this.doRandomize(this.myoption);
				setTimeout(() => {
					this.optionBlock.nativeElement.className = "";
				}, 200)
				for (let i in this.myoption) {
					this.optionBlock.nativeElement.children[i].children[1].className = "speaker";
				}
				this.ifWrongAns = false;
			}

			if (this.ifRightAns) {
				this.removeEvents();
				this.ifRightAns = false;
				$("#instructionBar").addClass("disable_div");
				$("#optionsBlock .options").css("opacity", "0.3");
				$("#instructionBar").css("opacity", "0.3");
				$("#quesImage").css("opacity", "0.3");
				$("#quesImage").css("pointer-events", 'none');
				this.blinkOnLastQues();
			}
			this.appModel.notifyUserAction();
			$("#instructionBar").removeClass("disable_div");
		}
	}

	ngOnInit() {
		if (this.appModel.isNewCollection) {
			this.appModel.event = { 'action': 'segmentBegins' };
		}
		this.appModel.functionone(this.templatevolume, this);//start end
		this.containgFolderPath = this.getBasePath();
		if (this.appModel.isNewCollection) {
			//console.log("chck:",this.appModel.isNewCollection);
			this.appModel.event = { 'action': 'segmentBegins' };
		}
		let fetchedData: any = this.appModel.content.contentData.data;
		this.fetchedcontent = JSON.parse(JSON.stringify(fetchedData));;
		this.functionalityType = this.appModel.content.contentLogic.functionalityType;
		this.themePath = ThemeConstants.THEME_PATH + this.fetchedcontent.productType + '/' + this.fetchedcontent.theme_name;
		this.Sharedservice.imagePath(this.fetchedcontent, this.containgFolderPath, this.themePath, this.functionalityType);
		this.checkquesTab();
		this.appModel.globalJsonData.subscribe(data => {
			this.showAnsTimeout = data.showAnsTimeout;
			if(this.feedback.closeDelayTime){
				this.closeDelayTime = this.feedback.closeDelayTime
			} else{
				this.closeDelayTime = this.showAnsTimeout;
			}
		});
		
		if (fetchedData.titleScreen) {
			this.quesInfo = fetchedData;
			this.noOfImgs = this.quesInfo.imgCount;
			if (this.quesInfo && this.quesInfo.titleScreen) {
				this.showIntroScreen = fetchedData.titleScreen;
			} else {
				this.showIntroScreen = false;
			}
		} else {
			this.setData();
		}

		this.appModel.getConfirmationPopup().subscribe((val) => {

			if (val == "uttarDikhayein") {

				if (this.instruction && !this.instruction.nativeElement.paused) {
					this.instruction.nativeElement.currentTime = 0;
					this.instruction.nativeElement.pause();
				}

				if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
					this.confirmModalRef.nativeElement.classList = "displayPopup modal";
					this.appModel.notifyUserAction();
				}
			} else if (val == "replayVideo") {
				if (this.confirmReplayRef && this.confirmReplayRef.nativeElement) {
					this.confirmReplayRef.nativeElement.classList = "displayPopup modal";
					this.appModel.notifyUserAction();
				}
			}
		})

		this.styleHeaderPopup = this.feedbackObj.style_header;
		this.styleBodyPopup = this.feedbackObj.style_body;
		this.rightanspopUpheader_img = false;
		this.wronganspopUpheader_img = false;
		this.showanspopUpheader_img = true;
		this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
			if (mode == "manual") {
				//show modal for manual
				this.appModel.notifyUserAction();
				if (this.correctAns && this.correctAns.nativeElement) {
					$("#instructionBar").addClass("disable_div");
					this.correctAns.nativeElement.classList = "displayPopup modal";
				}

				console.log("mode manuall", mode)

			} else if (mode == "auto") {
				this.confirmModalRef.nativeElement.classList = "modal";
				this.showAnsModal(this.fixedOptions[this.feedback.correct_ans_index])
				$("#instructionBar").addClass("disable_div");
				$("#optionsBlock.options").css("opacity", "0.3");
				$("#instructionBar").css("opacity", "0.3");
			}
		})


		this.appModel.postWrongAttempt.subscribe(() => {
			this.postWrongAttemplt();
		});
		this.appModel.resetBlinkingTimer();
		this.appModel.handleController(this.controlHandler);
	}


	postWrongAttemplt() {
		//wrong-right ans
		this.optionBlock.nativeElement.children[0].className = "options animation-shake";
		this.optionBlock.nativeElement.children[1].className = "options animation-shake";
		this.optionBlock.nativeElement.children[2].className = "options animation-shake";
		setTimeout(() => {
			this.optionBlock.nativeElement.children[0].className = "options";
			this.optionBlock.nativeElement.children[1].className = "options";
			this.optionBlock.nativeElement.children[2].className = "options";
		}, 1000)
		this.appModel.startPreviousTimer();
		this.appModel.notifyUserAction();
		//shake options
	}
	checkquesTab() {
		if (this.fetchedcontent.commonassets.ques_control != undefined) {
			this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
		} else {
			this.appModel.getJson();
		}
	}
	templatevolume(vol, obj) {
		if (obj.wrongOptAudio && obj.wrongOptAudio.nativeElement) {
			obj.wrongOptAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.feedbackVoRef && obj.feedbackVoRef.nativeElement) {
			obj.feedbackVoRef.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.narrator && obj.narrator.nativeElement) {
			obj.narrator.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.instruction && obj.instruction.nativeElement) {
			obj.instruction.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.wrongFeedback && obj.wrongFeedback.nativeElement) {
			obj.wrongFeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}

		if (obj.optionBlock && obj.optionBlock.nativeElement) {
			for (let i in obj.myoption) {
				obj.optionBlock.nativeElement.children[i].children[2].volume = obj.appModel.isMute ? 0 : vol;
			}
		}
	}


	setData() {
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
		if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
			//let fetchedData: any = this.appModel.content.contentData.data;
			console.log(this.fetchedcontent);
			if (this.fetchedcontent && this.fetchedcontent.titleScreen) {
				this.showIntroScreen = true;
			} else {
				this.showIntroScreen = false;
			}

			this.myoption = this.fetchedcontent.optionObj;
			this.fixedOptions = JSON.parse(JSON.stringify(this.fetchedcontent.optionObj))
			console.log(this.myoption);
			//	this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
			this.feedback = this.fetchedcontent.feedback;
			this.commonAssets = this.fetchedcontent.commonassets;
			this.narratorAudio = this.fetchedcontent.commonassets.narrator;
			this.question = this.fetchedcontent.ques;
			this.feedback = this.fetchedcontent.feedback;
			this.quesInfo = this.fetchedcontent.commonassets;
			this.isFirstQues = this.quesInfo.isFirstQues;
			this.isLastQues = this.appModel.isLastSection;
			this.isLastQuesAct = this.appModel.isLastSectionInCollection;
			this.noOfImgs = this.quesInfo.imgCount;
			this.quesObj = this.fetchedcontent.quesObj;
			this.confirmPopupAssets = this.fetchedcontent.feedback.confirm_popup;
			this.feedbackObj = this.fetchedcontent.feedback;
			this.rightAnspopupAssets = this.feedbackObj.right_ans_popup;
			this.rightAnsSoundUrl = this.myoption[this.feedback.correct_ans_index]
			if (this.quesObj.quesVideo && this.quesObj.quesVideo.autoPlay && !this.appModel.isVideoPlayed) {
				this.isPlayVideo = true;
			} else {
				this.isPlayVideo = false;
			}
			this.controlHandler={
				isSubmitRequired:this.quesObj.submitRequired,
				isReplayRequired:this.quesObj.replayRequired
			 }
		} else {
			this.myoption = [];
			this.question = "";
			this.feedback = "";
			this.quesInfo = "";
		}
	}

	ngAfterViewChecked() {
		if (this.titleAudio && this.titleAudio.nativeElement) {
			this.titleAudio.nativeElement.onended = () => {
				this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeInAnimation";
			}
		}
		this.templatevolume(this.appModel.volumeValue, this);
	}

	ngAfterViewInit() {
		if (this.optionBlock && this.optionBlock.nativeElement) {
			this.optionBlock.nativeElement.className = "initDisable-ansBlock";
		}
	}

	checkAnswer(opt, index) {
		//this.titleHelpAudio.nativeElement.pause();
		    this.optionBlock.nativeElement.children[index].children[2].pause();
		 	this.optionBlock.nativeElement.children[index].children[2].currentTime = 0;
			this.optionBlock.nativeElement.children[index].children[1].className = "speaker";
			$(".speakerd").removeClass("dispFlex");
		
		this.disableHelpBtn = true;
		opt.imgsrc = opt.imgsrc_original;
		this.popUpClosed = false;
		// logic to check what user has done is correct or wrong
		if (opt.custom_id == this.feedback.correct_ans_index) {
			this.wrongImgOption = opt
			//this.feedbackPopup = this.rightPopup;
			this.rightanspopUpheader_img = true;
			this.wronganspopUpheader_img = false;
			this.showanspopUpheader_img = false;
			this.styleHeaderPopup = this.feedbackObj.style_header;
			this.styleBodyPopup = this.feedbackObj.style_body;
			this.attemptType = "manual";
			this.appModel.stopAllTimer();
			//Analytics
			//fireworks 
			this.ifRightAns = true;
			let correctAns: HTMLElement = this.correctAns.nativeElement as HTMLElement
			correctAns.className = "modal d-flex align-items-center justify-content-center showit correctAns dispFlex";

			this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div";
			$("#instructionBar").css("pointer-events", 'none');

			this.feedbackVoRef.nativeElement.src = opt.imgrightfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36);
			//this.feedbackVoRef.nativeElement.play();

			setTimeout(() => {
				this.feedbackVoRef.nativeElement.play();
				this.disableSpeaker = true;
			}, 50)

			this.feedbackVoRef.nativeElement.onended = () => {
				this.disableSpeaker = false;
				setTimeout(() => {
					if (!this.popUpClosed) {
						this.removeEvents();
						this.ifRightAns = false;
						$("#instructionBar").addClass("disable_div");
						$("#optionsBlock .options").css("opacity", "0.3");
						$("#instructionBar").css("opacity", "0.3");
						$("#quesImage").css("opacity", "0.3");
						$("#quesImage").css("pointer-events", 'none');
						this.blinkOnLastQues();
						this.wrongOptAudio.nativeElement.pause();
						this.wrongOptAudio.nativeElement.currentTime = 0;
			           //this.correctAns.nativeElement.children[0].lastElementChild.children[1].lastElementChild.className = "speaker";
					//alert();	
					}
				}, this.closeDelayTime)
			}

		} else {

			this.ifWrongAns = true;
			//this.feedbackPopup = this.wrongPopup;
			this.styleHeaderPopup = this.feedbackObj.wrong_style_header;
			this.styleBodyPopup = this.feedbackObj.wrong_style_body;
			this.wrongImgOption = opt  //setting wrong image options
			this.rightanspopUpheader_img = false;
			this.wronganspopUpheader_img = true;
			this.showanspopUpheader_img = false;
			this.optionBlock.nativeElement.className = "disable_div";
			let correctAns: HTMLElement = this.correctAns.nativeElement as HTMLElement
			correctAns.className = "modal d-flex align-items-center justify-content-center showit correctAns dispFlex";

			this.appModel.stopAllTimer();
			//play wrong feed back audio
			this.feedbackVoRef.nativeElement.src = opt.imgwrongfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36);
			//this.feedbackVoRef.nativeElement.play();

			setTimeout(() => {

				this.feedbackVoRef.nativeElement.play();
				this.disableSpeaker = true;
			}, 50)


			this.feedbackVoRef.nativeElement.onended = () => {
				this.disableSpeaker = false;
				setTimeout(() => {

					if (!this.popUpClosed) {
						this.removeEvents();
						this.appModel.wrongAttemptAnimation();
						this.idArray = [];
						for (let i of this.myoption) {
							this.idArray.push(i.id);
						}
						this.doRandomize(this.myoption);
						setTimeout(() => {
							this.optionBlock.nativeElement.className = "";
						}, 200)
						for (let i in this.myoption) {
							this.optionBlock.nativeElement.children[i].children[1].className = "speaker";
						}
						this.ifWrongAns = false;
					}
					    this.wrongOptAudio.nativeElement.pause();
						this.wrongOptAudio.nativeElement.currentTime = 0;
						//this.correctAns.nativeElement.children[0].lastElementChild.children[1].lastElementChild.className = "speaker";
				}, this.closeDelayTime)
			}
		}
	 
	}

	// previous function
	previous() {
		if (this.quesInfo) {
			this.quesInfo.aagey_badhein = this.quesInfo.aagey_badhein_original;
			this.quesInfo.peechey_jayein = this.quesInfo.peechey_jayein_original;
		}
		this.appModel.setLoader(true);
		if (this.optionBlock && this.optionBlock.nativeElement) {
			this.optionBlock.nativeElement.className = "";
		}
		this.audio.pause();
		if (this.titleHelpAudio && this.titleHelpAudio.nativeElement) {
			this.titleHelpAudio.nativeElement.pause();
			this.titleHelpAudio.nativeElement.currentTime = 0;
		}
		this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center";
		// remove blinking if exist
		this.blink = false;
		this.appModel.previousSection();
		//this.setData();
	}

	// next function
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
		if (this.quesInfo) {
			this.quesInfo.aagey_badhein = this.quesInfo.aagey_badhein_original;
			this.quesInfo.peechey_jayein = this.quesInfo.peechey_jayein_original;
		}

		if (!this.isLastQues) {
			if (this.optionBlock && this.optionBlock.nativeElement) {
				this.optionBlock.nativeElement.className = "";
			}

			this.audio.pause();
			if (this.titleHelpAudio && this.titleHelpAudio.nativeElement) {
				this.titleHelpAudio.nativeElement.pause();
				this.titleHelpAudio.nativeElement.currentTime = 0;
			}
			if (this.maincontent && this.maincontent.nativeElement) {
				this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center";
			}
			this.appModel.nextSection();
			this.appModel.setLoader(true);
			//this.setData();

		}
	}

	closeTitleScreen() {
		this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeOutAnimation";
		setTimeout(() => {
			this.next();
		}, 200)
	}

	checkNextActivities() {
		if (this.isPaused()) {
			this.next();
		}
		else {
			console.log("feedback_audio still playing");
		}
	}
	playSound(sound) {
		if (this.titleHelpAudio && this.titleHelpAudio.nativeElement) {
			this.titleHelpAudio.nativeElement.pause();
			this.titleHelpAudio.nativeElement.currentTime = 0;
		}
		this.audio.pause();
		this.audio.src = sound;
		this.audio.load();
		this.audio.play();
	}

	removeEvents() {
		this.correctAns.nativeElement.className = "modelpopup d-flex align-items-center justify-content-center hideit";
		this.burst.nativeElement.className = "d-flex align-items-center justify-content-center hideit"
	}
	isPaused() {
		return this.audio.paused;
	}

	doRandomize(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;
		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
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
		var bool = false;
		while (i--) {
			if (a[i].id == b[i]) {
				return true;
			}
		}
		return false;
	}

	playSoundHelp() {
		if (this.titleHelpAudio && this.titleHelpAudio.nativeElement) {
			if (this.maincontent) {
				this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div";
			}
			this.titleHelpAudio.nativeElement.pause();
			this.titleHelpAudio.nativeElement.currentTime = 0;
			this.titleHelpAudio.nativeElement.play();
			this.titleHelpAudio.nativeElement.onended = () => {
				if (this.maincontent) {
					this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center";
				}
			}
		}
	}

	close() {
		//this.appModel.event = { 'action': 'exit', 'currentPosition': this.currentVideoTime };
		this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
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

	getBasePath() {
		if (this.appModel && this.appModel.content) {
			return this.appModel.content.id + '';
		}
	}

	checkforQVO() {
		if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
			this.narrator.nativeElement.src = this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
			this.appModel.handlePostVOActivity(true);
			this.appModel.enableReplayBtn(false);
			// this.optionsBlock.nativeElement.classList = "row mx-0 disableDiv";
			this.narrator.nativeElement.play();
			this.disableSection=true;
			
			this.narrator.nativeElement.onended = () => {
				setTimeout(() => {
					$("#optionsBlock").removeClass("disable_div");
				}, 2000)
				this.disableSection=false;
				this.appModel.handlePostVOActivity(false);
				if (this.quesObj.replayRequired) {
					this.appModel.enableReplayBtn(true);
				}

				//enable ansBlock
				this.optionBlock.nativeElement.className = "";
			}
			$("#optionsBlock").addClass("disable_div");
		} else {
			this.appModel.handlePostVOActivity(false);
			this.appModel.enableReplayBtn(true);
		}
	}



	onWrongImgHoverOption(option, i) {

		$(".speakerd").addClass("dispFlex");
		//stop clapping
		if (this.instruction.nativeElement) {
			this.clapSound.nativeElement.pause()
		}

		//stop other sounds
		if (this.wrongFeedback.nativeElement) {
			this.wrongFeedback.nativeElement.pause()
			this.wrongFeedback.nativeElement.currentTime = 0
		}
		if (this.feedbackVoRef.nativeElement) {
			this.feedbackVoRef.nativeElement.pause();
			this.feedbackVoRef.nativeElement.currentTime = 0
		}
		//$(".speakerd").addClass("dispFlex");
		this.playAnySound(option.sound.url);
		this.disableSpeaker = true;
		
		this.wrongOptAudio.nativeElement.onended = () => {
			$(".speakerd").removeClass("dispFlex");
			this.disableSpeaker = false;
		}
	}


	playAnySound(sound) {
		this.containgFolderPath = this.getBasePath();
		this.wrongOptAudio.nativeElement.pause();
		this.wrongOptAudio.nativeElement.src = sound;
		this.wrongOptAudio.nativeElement.load();
		this.wrongOptAudio.nativeElement.play();
		
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


	showAnsModal(opt) {
		this.styleHeaderPopup = this.feedbackObj.style_header;
		this.styleBodyPopup = this.feedbackObj.style_body;
		$(".speakerd").removeClass("dispFlex");
		this.appModel.stopAllTimer();
		this.attemptType = "hideAnimation"
		this.ifWrongAns = false;
		this.ifRightAns = false;
		this.wrongImgOption = this.rightAnsSoundUrl
		this.feedbackPopup = this.rightPopup;
		let correctAns: HTMLElement = this.correctAns.nativeElement as HTMLElement
		correctAns.className = "modal d-flex align-items-center justify-content-center showit correctAns dispFlex";
		//disable option and question on right attempt
		this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div";
		if (this.optionBlock && this.optionBlock.nativeElement) {
			this.optionBlock.nativeElement.className = "disable-ansBlock";
		}
		$("#instructionBar").addClass("disable_div");
		$("#instructionBar").css("pointer-events", 'none');
		$("#optionsBlock .options").css("opacity", "0.3");
		$("#instructionBar").css("opacity", "0.3");
		$("#quesImage").css("opacity", "0.3");
		$("#quesImage").css("pointer-events", 'none');
		this.feedbackVoRef.nativeElement.src = this.feedback.right_ans_popup.imgrightfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36);

		setTimeout(() => {
			this.disableSpeaker = true;
			this.feedbackVoRef.nativeElement.play();
		}, 50)
		this.appModel.resetBlinkingTimer();
		this.feedbackVoRef.nativeElement.onended = () => {
			
			this.disableSpeaker = false;
			setTimeout(() => {
				this.wrongOptAudio.nativeElement.pause();
			    this.wrongOptAudio.nativeElement.currentTime = 0
				this.removeEvents();
				this.blinkOnLastQues();
			}, this.showAnsTimeout);
		}
	}
	//TRY HERE


}
