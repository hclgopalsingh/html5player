import { Component, OnInit, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../model/applicationmodel.service';
import 'jquery';
import { Subscription } from 'rxjs'
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { ThemeConstants } from '../common/themeconstants';
import { SharedserviceService } from '../services/sharedservice.service';
declare var $: any;

@Component({
	selector: 'temp14',
	templateUrl: '../view/layout/Ntemplate10.component.html',
	styleUrls: ['../view/css/Ntemplate10.component.css', '../view/css/bootstrap.min.css'],

})

export class Ntemplate10 implements OnInit {
	private appModel: ApplicationmodelService;
	constructor(appModel: ApplicationmodelService, private Sharedservice: SharedserviceService) {
		this.appModel = appModel;
		this.assetsPath = this.appModel.assetsfolderpath;
		this.appModel.navShow = 2;
		this.appModel.setLoader(true);
		// if error occured during image loading loader wil stop after 5 seconds 
		this.loaderTimer = setTimeout(() => {
			this.appModel.setLoader(false);
		}, 5000)
	}

	@ViewChild("optionsBlock") optionsBlock: any;
	@ViewChild('correctAns') correctAns: any;
	@ViewChild('burst') burst: any;
	@ViewChild('optionBlock') optionBlock: any;
	@ViewChild('container') containerBlock: any;
	@ViewChild('titleNavBtn') titleNavBtn: any;
	@ViewChild('helpBtn') helpBtn: any;
	@ViewChild('titleAudio') titleAudio: any;
	@ViewChild('titleHelpAudio') titleHelpAudio: any;
	@ViewChild('clapSound') clapSound: any;
	@ViewChild('buzzerSound') buzzerSound: any;
	@ViewChild('navBlock') navBlock: any;
	@ViewChild('speakerBtn') speakerBtn: any;
	@ViewChild('optionHolder') optionHolder: any;
	@ViewChild('questionSound') questionSound: any;
	@ViewChild('narrator') narrator: any;
	@ViewChild('instruction') instruction: any;
	@ViewChild('optionAudio') optionAudio: any;
	@ViewChild('confirmReplayRef') confirmReplayRef: any;
	@ViewChild('feedbackInfoAudio') feedbackInfoAudio: any;
	@ViewChild('onlyOneAttemptModalRef') onlyOneAttemptModalRef: any;
	@ViewChild('feedbackoneAttemptAudio') feedbackoneAttemptAudio: any;
	@ViewChild('confirmModalRef') confirmModalRef: any;
	@ViewChild('maincontent') maincontent: any;

	hideButtons:boolean = false;
	audio = new Audio();
	blink: boolean = false;
	currentIdx = 0;
	quesInfo: any = "";
	optionslist: any = [];
	optionslist_main: any = "";
	myoption: any = [];
	question: any = "";
	feedback: any = "";
	feedbackObj: any;
	feedbackAudio: any;
	isLastActivity: any = "";
	bool: boolean = false;
	showIntroScreen: boolean;
	commonAssets: any = "";
	quesObj: any;
	isPlayVideo: boolean;
	videoReplayd: boolean;
	helpAudio: any = "";
	correctOpt: any;
	idArray: any = [];
	isFirstQues: boolean;
	isLastQues: boolean = false;
	isAutoplayOn: boolean;
	isLastQuesAct: boolean;
	narratorAudio: any;
	popupAssets: any;
	confirmPopupAssets: any;
	noOfImgs: number;
	noOfImgsLoaded: number = 0;
	loaderTimer: any;
	maxNosOpt: number;
	optionRandomArray: any = [];
	randomOptionIndex: any = [];
	quesSoundInfo: any;
	quesNo: number = 0;
	optBackup: any = [];
	timer: any;
	disableHelpBtn: boolean = false;
	containgFolderPath: string = "";
	assetsPath: string = "";
	loadFlag: boolean = false;
	hasEventFired: boolean = false;
	skip_on_hover: boolean = false;
	tempSubscription: Subscription;
	attemptType: string = "";
	isSkip: boolean = false;
	isShake: boolean = false;
	controlHandler = {
		isShowAns:true,
		isSubmitRequired:false,
    	isReplayRequired:false
	 };
	/*Start: Theme Implementation(Template Changes)*/	
	themePath:any;
	fetchedcontent:any;
	functionalityType:any;
	bgSubscription: Subscription;
	/*End: Theme Implementation(Template Changes)*/

	onHoverHelp() {
		this.quesInfo.help_btn = this.quesInfo.help_btn_hover;
	}
	onHoverHelpOut() {
		this.quesInfo.help_btn = this.quesInfo.help_btn_original;
	}
	onHoverZaariRakhein() {
		this.quesInfo.jariRakheinBtn = this.quesInfo.jariRakheinBtn_hover;
	}
	onHoverOutZaariRakhein() {
		this.quesInfo.jariRakheinBtn = this.quesInfo.jariRakheinBtn_original;
	}
	onHoverAageyBadheinBtn() {
		this.quesInfo.aagey_badhein = this.quesInfo.aagey_badhein_hover;
	}
	onLeaveAageyBadheinBtn() {
		this.quesInfo.aagey_badhein = this.quesInfo.aagey_badhein_original;
	}
	onHoverPeecheyBtn() {
		this.quesInfo.peechey_jayein = this.quesInfo.peechey_jayein_hover;
	}
	onLeavePeecheyBtn() {
		this.quesInfo.peechey_jayein = this.quesInfo.peechey_jayein_original;
	}

	onHoverOption(opt) {
		opt.bgImgsrc = opt.bgImgsrc_hover;
	}
	onHoverOptionOut(opt) {
		opt.bgImgsrc = opt.bgImgsrc_original;
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

	hoverClosePopup() {
		this.feedbackObj.popup_commmon_imgs.close_btn = this.feedbackObj.popup_commmon_imgs.close_btn_hover;
	}

	houtClosePopup() {
		this.feedbackObj.popup_commmon_imgs.close_btn = this.feedbackObj.popup_commmon_imgs.close_btn_original;
	}

	playHoverInstruction() {
		console.log("weare heree---------------------->>>>>>>>>>>>>>>>>>>")
		this.appModel.notifyUserAction();
		let that = this;
		if (!this.narrator.nativeElement.paused) {
			console.log("narrator/instruction voice still playing");
		} else {
			console.log("play on Instruction");
			if (this.instruction.nativeElement.paused) {
				this.instruction.nativeElement.currentTime = 0;
				setTimeout(()=>{
					that.instruction.nativeElement.play();
					$(".instructionBase img").css("cursor", "default");
				},350)
			}
			console.log("loooooooooooooooooooooooooooo")
			this.instruction.nativeElement.onended= () => {

				$(".instructionBase img").css("cursor", "pointer");
			}
			// if (!this.instruction.nativeElement.paused) {
			// 	this.instruction.nativeElement.currentTime = 0;
			// 	this.instruction.nativeElement.pause();
			// }
			// if (this.questionSound && this.questionSound.nativeElement) {
				that.questionSound.nativeElement.pause();
				that.questionSound.nativeElement.currentTime = 0;
				that.speakerBtn.nativeElement.children[1].className = "speaker";
			//}
		}
	}

	onClickSpeaker() {
		this.appModel.notifyUserAction();
		if (this.instruction && this.instruction.nativeElement) {
			this.instruction.nativeElement.pause();
			this.instruction.nativeElement.currentTime = 0;
		}
		if (this.titleHelpAudio && this.titleHelpAudio.nativeElement) {
			this.titleHelpAudio.nativeElement.pause();
			this.titleHelpAudio.nativeElement.currentTime = 0;
		}
		this.playQuestionSound(this.question[this.quesNo]);
		if (!this.instruction.nativeElement.paused) {
			this.instruction.nativeElement.pause();
			this.instruction.nativeElement.currentTime = 0;
		}
		//this.speakerBtn.nativeElement.children[1].className = "speaker dispFlex";
	}
	onMouseOutSpeaker() {
		this.speakerBtn.nativeElement.children[1].className = "speaker";
	}

	ngAfterViewChecked() {
		if (this.titleAudio && this.titleAudio.nativeElement) {
			this.titleAudio.nativeElement.onended = () => {
				this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeInAnimation";
			}
		}
		this.templatevolume(this.appModel.volumeValue, this);
	}


	closeTitleScreen() {
		this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeOutAnimation";
		setTimeout(() => {
			this.next();
		}, 200)

	}

	setEnability(flag, option_ref) {

	}
	// previous function
	previous() {
		if (this.quesInfo) {
			this.quesInfo.aagey_badhein = this.quesInfo.aagey_badhein_original;
			this.quesInfo.peechey_jayein = this.quesInfo.peechey_jayein_original;
		}
		//this.appModel.setLoader(true);
		clearTimeout(this.timer);
		this.audio.pause();
		if (this.titleHelpAudio && this.titleHelpAudio.nativeElement) {
			this.titleHelpAudio.nativeElement.pause();
			this.titleHelpAudio.nativeElement.currentTime = 0;
		}
		/*this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center";
		this.maincontent.nativeElement.style.visibility="hidden";
		setTimeout(()=>{
			this.maincontent.nativeElement.style.visibility="visible";
		},200)*/
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
				this.appModel.event = { 'action': 'exit' };
			}
		}
		if (this.quesInfo) {
			this.quesInfo.aagey_badhein = this.quesInfo.aagey_badhein_original;
			this.quesInfo.peechey_jayein = this.quesInfo.peechey_jayein_original;
		}
		clearTimeout(this.timer);
		if (!this.isLastQues) {
			this.audio.pause();
			if (this.titleHelpAudio && this.titleHelpAudio.nativeElement) {
				this.titleHelpAudio.nativeElement.pause();
				this.titleHelpAudio.nativeElement.currentTime = 0;
			}
			this.appModel.nextSection();
			//this.appModel.setLoader(true);
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
	playSoundHelp() {
		if (this.questionSound && this.questionSound.nativeElement) {
			this.questionSound.nativeElement.pause();
			this.questionSound.nativeElement.currentTime = 0;
			this.speakerBtn.nativeElement.children[1].className = "speaker";
		}
		/*
		if(this.titleHelpAudio && this.titleHelpAudio.nativeElement){
			if(this.titleHelpAudio.nativeElement.paused){
				this.titleHelpAudio.nativeElement.play();
			}else{
				this.titleHelpAudio.nativeElement.pause();
				this.titleHelpAudio.nativeElement.currentTime = 0;
			}
		}
		*/
		if (this.titleHelpAudio && this.titleHelpAudio.nativeElement) {
			if (this.optionBlock) {
				this.optionBlock.nativeElement.className = "optionsBlock disable_div";
			}
			this.titleHelpAudio.nativeElement.pause();
			this.titleHelpAudio.nativeElement.currentTime = 0;
			this.titleHelpAudio.nativeElement.play();
			this.titleHelpAudio.nativeElement.onended = () => {
				if (this.optionBlock) {
					this.optionBlock.nativeElement.className = "optionsBlock";
				}
			}
		}
	}
	checkAnswer(opt, index) {
		this.disableHelpBtn = true;
		this.quesNo = this.quesNo + 1;
		// to stop help audio if playing
		if (!this.instruction.nativeElement.paused) {
			this.instruction.nativeElement.currentTime = 0;
			this.instruction.nativeElement.pause();
			$(".instructionBase img").css("cursor", "pointer");
		}
		if (this.titleHelpAudio && this.titleHelpAudio.nativeElement) {
			this.titleHelpAudio.nativeElement.pause();
			this.titleHelpAudio.nativeElement.currentTime = 0;
		}
		// logic to check what user has done is correct or wrong
		if (opt.custom_id == this.quesSoundInfo.index && this.quesNo == this.quesInfo.noOfQues) {
			//ater user has chosen all the right answers
			this.setSelectedImage(opt, index);
			setTimeout(() => {

				this.attemptType = this.isSkip ? "hideAnimation": "manual";
				//disable option and question on right attempt
				console.log("disable option and question on right attempt");
				$("#optionsBlock ").addClass("disable-click");
				$(".speakerBtn ").addClass("disable-div");
				$("#instructionBar").addClass("disable_div");
				$("#optionsBlock").css("opacity", "0.3");
				$("#instructionBar").css("opacity", "0.3");
				this.removeEvents();
				this.blinkOnLastQues()
			}, 200)

		} else if (opt.custom_id == this.quesSoundInfo.index && this.quesNo < this.quesInfo.noOfQues) {
			//chosen a right ans but still not all yet.	
			this.appModel.notifyUserAction();
			this.setSelectedImage(opt, index);
			this.optionBlock.nativeElement.className = "optionsBlock disable_div";
			this.playQuestionSound(this.question[this.quesNo]);
		} else {
			//reset question wrong attempt
			this.quesNo = 0;
			//let optionBlock: HTMLElement = this.optionBlock.nativeElement as HTMLElement
			this.optionBlock.nativeElement.className = "optionsBlock disable_div";
			this.optionHolder.nativeElement.children[index].className = "options animation-shake option" + index + "";

			//show wrong ans animation
			
			this.appModel.wrongAttemptAnimation();
			this.appModel.handlePostVOActivity(true);
			// if(this.buzzerSound && this.buzzerSound.nativeElement){
			// 	this.buzzerSound.nativeElement.play();
			// }
			//this.buzzerSound.nativeElement.onended = () => {
			// this.isShake = true;
			// setTimeout(()=>{
			// 	this.isShake = false;
			// 	this.postWrongAttemplt()
			// 	},750 )
			//}

			this.optionHolder.nativeElement.children[index].className = "options option" + index + "";

		}
	}


	showAnswer(){
		if (!this.instruction.nativeElement.paused) {
			this.instruction.nativeElement.currentTime = 0;
			this.instruction.nativeElement.pause();
		}
		console.log("myoption",this.myoption,this.optBackup)
		this.attemptType = "hideAnimation"
		$(".speakerBtn ").addClass("disable_div");

		$("#instructionBar").addClass("disable_div");	  
		$("#optionsBlock ").addClass("disable_div");
		$("#optionsBlock").css("cursor", "inherit");
		$("#optionsBlock").css("opacity", "1");
		$("#instructionBar").css("opacity", "1");
		this.appModel.resetBlinkingTimer();
		setTimeout(()=>{
			this.blinkOnLastQues();	
			$("#optionsBlock").css("opacity", "0.3");
			$("#instructionBar").css("opacity", "0.3");	
		},5000)

		this.myoption.forEach(element1 => {
			this.optBackup.forEach(element2 => {
				if(element1.custom_id == element2.custom_id){
					element1.imgsrc = element2.imgsrc;
				}
			});
		}); 

	}


	setSelectedImage(opt, index) {
		for (let i in this.optBackup) {
			if (this.optBackup[i].custom_id == opt.custom_id) {
				this.myoption[index].imgsrc = this.optBackup[i].imgsrc;
				break;
			}
		}

	}

	removeEvents() {
		this.burst.nativeElement.className = "d-flex align-items-center justify-content-center hideit"
	}
	isPaused() {
		return this.audio.paused;
	}

	doRandomize(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;
		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			// And swap it with the current element.
			var bgImgsrc1 = array[currentIndex].bgImgsrc;
			var bgImgsrc2 = array[randomIndex].bgImgsrc;

			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;

			array[currentIndex].bgImgsrc = bgImgsrc1;

			array[randomIndex].bgImgsrc = bgImgsrc2;
		}

		var flag = this.arraysIdentical(array, this.idArray);
		console.log(flag);
		if (flag) {
			this.doRandomize(array);
		}
		else {
			setTimeout(() => {
				console.log(this.optBackup)
				let formatOpt = JSON.parse(JSON.stringify(this.optBackup));
				for (var i in this.randomOptionIndex) {
					this.myoption[this.randomOptionIndex[i]] = formatOpt[i];
				}
			}, 200)
		}
	}

	doRandomizeQues(arrayQues) {
		let currentIndex = arrayQues.length, temporaryValue, randomIndex, bgImgsrc1, bgImgsrc2;
		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			// And swap it with the current element.
			//store the background
			if (arrayQues[currentIndex].bgImgsrc && arrayQues[randomIndex].bgImgsrc) {
				bgImgsrc1 = arrayQues[currentIndex].bgImgsrc;
				bgImgsrc2 = arrayQues[randomIndex].bgImgsrc;
			}
			temporaryValue = arrayQues[currentIndex];
			arrayQues[currentIndex] = arrayQues[randomIndex];

			arrayQues[randomIndex] = temporaryValue;
			if (arrayQues[currentIndex].bgImgsrc && arrayQues[randomIndex].bgImgsrc) {
				arrayQues[currentIndex].bgImgsrc = bgImgsrc1;
				arrayQues[randomIndex].bgImgsrc = bgImgsrc2;
			}
		}

		return arrayQues;
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

	ngOnInit() {
		console.log("version newwwwwwwwwwwww ", this.appModel.version);

		let id = window.setTimeout(() => { }, 0);
		while (id--) {
			window.clearTimeout(id);
		}
		this.appModel.functionone(this.templatevolume, this);//start end
		/* window.onresize = (e) =>{
			this.resizeContainer();
		}*/
		this.containgFolderPath = this.getBasePath();
		/*Start: Theme Implementation(Template Changes)*/
		let fetchedData: any = this.appModel.content.contentData.data;
		this.fetchedcontent = JSON.parse(JSON.stringify(fetchedData));;
		this.functionalityType = this.appModel.content.contentLogic.functionalityType;
		this.themePath = ThemeConstants.THEME_PATH + this.fetchedcontent.productType + '/'+ this.fetchedcontent.theme_name ; 
		this.Sharedservice.imagePath(this.fetchedcontent, this.containgFolderPath, this.themePath, this.functionalityType);
		this.checkquesTab();
		/*End: Theme Implementation(Template Changes)*/

		if (this.appModel.isNewCollection) {
			//console.log("chck:",this.appModel.isNewCollection);
			this.appModel.event = { 'action': 'segmentBegins' };
		}
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




		this.appModel.getConfirmationPopup().subscribe((action) => {
			this.appModel.notifyUserAction();
			if (action == "uttarDikhayein") {
				console.log("clicked on show show answer")
				if (!this.instruction.nativeElement.paused) {
					this.instruction.nativeElement.currentTime = 0;
					this.instruction.nativeElement.pause();
					$(".instructionBase img").css("cursor", "pointer");
				}
				if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
					$("#instructionBar").addClass("disable_div");
					this.confirmModalRef.nativeElement.classList = "displayPopup modal";
				}
			}
			if (action == "replayVideo") {
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
				this.confirmModalRef.nativeElement.classList = "modal";
				console.log("mode manual2 show answer working", mode)
				this.showAnswer();
				//

			}
		})

		this.appModel.postWrongAttempt.subscribe(() => {
			//this.postWrongAttemplt();
			this.isShake = true;
			setTimeout(()=>{
				this.isShake = false;
				this.postWrongAttemplt()
				},750 )
		});
		this.appModel.handleController(this.controlHandler);
		this.appModel.resetBlinkingTimer();
	}

	ngOnDestroy() {
		/*Start: Theme Implementation(Template Changes)*/
		if(this.bgSubscription!=undefined){
		  this.bgSubscription.unsubscribe();
		}
		/*End: Theme Implementation(Template Changes)*/
	  }
	
	  /*Start: Theme Implementation(Template Changes)*/
	checkquesTab() {
		if(this.fetchedcontent.commonassets.ques_control!=undefined) {
		this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
		} else {
		this.appModel.getJson();      
		}
	}

	/*End: Theme Implementation(Template Changes)*/

	postWrongAttemplt() {
		//wrong-right ans	
		this.idArray = [];
		for (let i of this.optBackup) {
			this.idArray.push(i.id);
		}
		this.doRandomize(this.optBackup);
		//randomize question
		this.doRandomizeQues(this.question);
		setTimeout(() => {
			//this.optionBlock.nativeElement.className = "optionsBlock";
			this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div";
			this.setBubbleEmpty();
		}, 200)
		this.appModel.notifyUserAction();
		//this.appModel.startPreviousTimer();
		//shake options
	}




	templatevolume(vol,obj) {
		if(obj.wrongOptAudio && obj.wrongOptAudio.nativeElement){
			obj.wrongOptAudio.nativeElement.volume = obj.appModel.isMute?0:vol;
		}
		if(obj.feedbackVoRef && obj.feedbackVoRef.nativeElement){
			obj.feedbackVoRef.nativeElement.volume = obj.appModel.isMute?0:vol;
		}
		if(obj.narrator && obj.narrator.nativeElement){
			obj.narrator.nativeElement.volume = obj.appModel.isMute?0:vol;
		}
		if(obj.instruction && obj.instruction.nativeElement){
			obj.instruction.nativeElement.volume = obj.appModel.isMute?0:vol;
		}
		if(obj.questionSound && obj.questionSound.nativeElement){
			obj.questionSound.nativeElement.volume = obj.appModel.isMute?0:vol;
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

			//let fetchedData: any = JSON.parse(JSON.stringify(this.appModel.content.contentData.data));
			if (this.fetchedcontent && this.fetchedcontent.titleScreen) {
				this.showIntroScreen = true;
			} else {
				this.showIntroScreen = false;
			}
			this.quesObj = this.fetchedcontent.quesObj;
			this.myoption.splice(0, this.myoption.length);
			this.commonAssets = this.fetchedcontent.commonassets;
			//this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
			this.optionRandomArray.splice(0, this.optionRandomArray.length);
			this.randomOptionIndex.splice(0, this.randomOptionIndex.length);
			let orig_option = this.doRandomizeQues(this.fetchedcontent.options);
			this.optBackup = JSON.parse(JSON.stringify(this.fetchedcontent.options));
			this.question = this.doRandomizeQues(this.fetchedcontent.ques);
			this.feedback = this.fetchedcontent.feedback;
			this.feedbackObj = this.fetchedcontent.feedback;
			// this.correctImg = this.feedbackObj.popup_commmon_imgs.correctimg;
			// this.incorrectImg = this.feedbackObj.popup_commmon_imgs.incorrectimg;
			// this.rightAnspopupAssets = this.feedbackObj.right_ans_popup;
			this.narratorAudio = this.fetchedcontent.commonassets.narrator;
			this.quesInfo = this.fetchedcontent.commonassets;
			this.confirmPopupAssets = this.fetchedcontent.feedback.confirm_popup;
			this.maxNosOpt = this.quesInfo.maxNosOpt;
			let emptyOpt = { "imgsrc": "", "bgImgsrc": "" };
			for (let i = 0; i < this.maxNosOpt; i++) {
				this.optionRandomArray.push(i);
				this.myoption.push(emptyOpt);
			}
			for (let i in orig_option) {
				let idx = this.getRandomInt(0, this.optionRandomArray.length - 1);
				this.randomOptionIndex.push(idx);
				this.myoption[idx] = orig_option[i];
			}
			/*if(this.maxNosOpt>this.myoption.length){
				let emptyNosOpt = this.maxNosOpt - this.myoption.length;
				let emptyOpt = {"imgsrc":"", "bgImgsrc":""};
				for(let i=0;i<emptyNosOpt;i++){
					this.myoption.push(emptyOpt);
				}
			}*/
			console.log("new updated option array ", this.myoption);
			this.isFirstQues = this.quesInfo.isFirstQues;
			this.isLastQues = this.appModel.isLastSection;
			this.isLastQuesAct = this.appModel.isLastSectionInCollection;
			//this.isAutoplayOn = this.appModel.autoPlay;
			this.noOfImgs = this.quesInfo.imgCount;
			this.quesObj = this.fetchedcontent.quesObj;
			// if (this.quesObj.quesVideo && this.quesObj.quesVideo.autoPlay && !this.appModel.isVideoPlayed) {
			//  this.isPlayVideo = true;
			// 	//sessionStorage.setItem("isPlayVideo", "true");
			// } else {
			// this.isPlayVideo = false;
			// }
			console.log(this.optBackup);
			//this.setBubbleEmpty();
			/*Start: Theme Implementation(Template Changes)*/
			this.controlHandler={
				isShowAns:true,
				isSubmitRequired:this.quesObj.submitRequired,
				isReplayRequired:this.quesObj.replayRequired
		  }
		  /*End: Theme Implementation(Template Changes)*/
		} else {
			this.myoption = [];
			this.question = "";
			this.feedback = "";
			this.quesInfo = "";
		}
	}

	//to stop any activity when help audio is playing
	checkHelpAudio() {
		if (this.titleHelpAudio && this.titleHelpAudio.nativeElement) {
			return this.titleHelpAudio.nativeElement.paused;
		} else {
			return true;
		}
	}

	getRandomInt(min, max) {
		let idx = Math.floor(Math.random() * (max - min + 1)) + min;
		let indReturn = this.optionRandomArray[idx];
		this.optionRandomArray.splice(idx, 1);
		return indReturn;
	}

	setBubbleEmpty() {
		this.timer = setTimeout(() => {
			if (this.checkHelpAudio()) {
				this.setQuestion();
			} else {
				if (this.titleHelpAudio && this.titleHelpAudio.nativeElement) {
					this.titleHelpAudio.nativeElement.onended = () => {
						this.setQuestion();
					}
				}
			}
		}, this.quesInfo.textRemoveTime);
	}

	setQuestion() {
		for (let i in this.myoption) {
			this.myoption[i].imgsrc = "";
		}
		setTimeout(() => {
			this.playQuestionSound(this.question[this.quesNo]);
		}, 200)
	}

	playQuestionSound(ques) {
		this.quesSoundInfo = ques;
		if (this.instruction && this.instruction.nativeElement) {
			this.instruction.nativeElement.pause();
			this.instruction.nativeElement.currentTime = 0;
		}
		if (this.questionSound && this.questionSound.nativeElement) {
			// if (this.quesSoundInfo.sound.location == 'content') {
			// 	this.questionSound.nativeElement.src = this.containgFolderPath + '/' + this.quesSoundInfo.sound.url;
			// } else {
			// 	this.questionSound.nativeElement.src = this.assetsPath + '/' + this.quesSoundInfo.sound.url;
			// }
			this.questionSound.nativeElement.src = this.quesSoundInfo.sound.url;
			this.questionSound.nativeElement.play();
			this.speakerBtn.nativeElement.children[1].className = "speaker dispFlex";
			this.questionSound.nativeElement.onended = () => {
				this.appModel.handlePostVOActivity(false);
				this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center";
				$(".instructionBase img").css("cursor", "pointer");
				this.speakerBtn.nativeElement.children[1].className = "speaker";
				if (this.optionBlock) {
					this.optionBlock.nativeElement.className = "optionsBlock";
				}
			}
		}
	}

	checkNextActivities() {
		if (this.isPaused()) {
			this.removeEvents();
			this.next();
		}
		else {
			console.log("feedback_audio still playing");
		}
	}

	getBasePath() {
		if (this.appModel && this.appModel.content) {
			return this.appModel.content.id + '';
		}
	}

	checkforQVO() {
		if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
			// this.narrator.nativeElement.src = this.quesObj.quesInstruction.location == "content" ? this.containgFolderPath + "/" + this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
			this.appModel.handlePostVOActivity(true);
			this.appModel.enableReplayBtn(true);
			$(".instructionBase img").css("cursor", "default");
			$(".skipBtn").css("opacity", "0.5");
			this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div";
			//   this.optionsBlock.nativeElement.classList = "row mx-0 disableDiv";
			this.narrator.nativeElement.play();
			this.narrator.nativeElement.onended = () => {
				//this.startAnsShowTimer()

				this.setBubbleEmpty();
				this.appModel.enableReplayBtn(true);
				$(".skipBtn").css("opacity", "1");
			}
		} else {
			this.appModel.handlePostVOActivity(false);
			this.appModel.enableReplayBtn(true);
		}
	}

	checkImgLoaded() {
		if (!this.loadFlag) {
			this.noOfImgsLoaded++;
			console.log(this.noOfImgsLoaded);
			if (this.noOfImgsLoaded >= this.noOfImgs) {
				this.appModel.setLoader(false);
				if (this.optionBlock) {
					this.optionBlock.nativeElement.className = "optionsBlock disable_div";
				}
				this.loadFlag = true;
				clearTimeout(this.loaderTimer);
				this.checkforQVO();
			}
		}
	}
	hoverConfirm() {
		this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_hover;
	}

	houtConfirm() {
		this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_original;
	}

	dontshowFeedback(id: string, flag: string) {
		if (id == "submit-modal-id") {
			//this.submitModalRef.nativeElement.classList = "modal";
			this.optionsBlock.nativeElement.classList = "row mx-0";
			$("#optionsBlock .options").removeClass("disable_div");
			$("#optionsBlock .options").css("opacity", "unset");
			this.appModel.enableSubmitBtn(false);
			this.appModel.enableReplayBtn(true);
			this.appModel.notifyUserAction();
			//this.resetAttempt();
		}
	}


	sendFeedback(id: string, flag: string) {
		this.confirmModalRef.nativeElement.classList = "modal";

		if (flag == "yes") {
			this.hideButtons = true;
			this.showAnswer();
		} else {
			this.appModel.notifyUserAction();
			$("#instructionBar").removeClass("disable_div");	
		}
	}


	skipQuestion() {
		//skip an option move to next option
		//opt.custom_id == this.quesSoundInfo.index
		if (!this.instruction.nativeElement.paused) {
			this.instruction.nativeElement.currentTime = 0;
			this.instruction.nativeElement.pause();
		}
		this.isSkip = true;
		let option = {};
		let ind:any;
		console.log(this.quesSoundInfo, "this.quesSoundInfo")
		console.log("myoption", this.myoption)
		this.myoption.forEach((element,i) => {
			if(element.custom_id == this.quesSoundInfo.index){
				option = element;
				ind = i
			}
		});
		this.appModel.notifyUserAction();
		this.checkAnswer(option,ind)
		//this.appModel.nextSection();
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

	
	// startAnsShowTimer(){
	// 	setTimeout(()=>{
	// 		//show answer appears after 1 minute
	// 		this.controlHandler.isShowAns = true;
	// 		console.log("dfdfsfsdfdsfdffffff==============>>>>>>>>>>>>>>>>")
	// 		this.appModel.handleController(this.controlHandler);
	// 	},60000)


	// }


}