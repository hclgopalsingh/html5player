import { Component, OnInit, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { PlayerConstants } from '../../../common/playerconstants';
import { Subscription } from 'rxjs';
import { timer } from 'rxjs/observable/timer';
import { take } from 'rxjs/operators';
import { SharedserviceService } from '../../../common/services/sharedservice.service';
import { ThemeConstants } from '../../../common/themeconstants';

@Component({
	selector: 'temp16',
	templateUrl: './Ntemplate16.component.html',
	styleUrls: ['./Ntemplate16.component.scss'],

})

export class Ntemplate16Component implements OnInit, AfterViewChecked, OnDestroy {
	private appModel: ApplicationmodelService;
	constructor(appModel: ApplicationmodelService, private Sharedservice: SharedserviceService) {
		this.appModel = appModel;
		this.assetsPath = this.appModel.assetsfolderpath;
		this.appModel.navShow = 2;
		this.appModel.setLoader(true);
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
	@ViewChild('correctAns') correctAns: any;
	@ViewChild('optionBlock') optionBlock: any;
	@ViewChild('maincontent') maincontent: any;
	@ViewChild('navBlock') navBlock: any;
	@ViewChild('confirmModalRef') confirmModalRef: any;
	@ViewChild('confirmReplayRef') confirmReplayRef: any;
	@ViewChild("optionImage") optionImage: any;
	@ViewChild('titleHelpAudio') titleHelpAudio: any;
	@ViewChild('feedbackSound') feedbackSound: any;
	@ViewChild('wrongFeedback') wrongFeedback: any;
	@ViewChild('narrator') narrator: any;
	@ViewChild('instruction') instruction: any;
	@ViewChild('mainVideo') mainVideo: any;
	@ViewChild('showAnsFeedback') showAnsFeedback: any;

	countdown: number;
	audio = new Audio();
	blink: boolean = false;
	quesInfo: any = "";
	myoption: any = [];
	question: any = "";
	feedback: any = "";
	ansList: any = [];
	isFirstQues: boolean;
	isLastQues: boolean = false;
	isAutoplayOn: boolean;
	isLastQuesAct: boolean;
	showFormat: boolean;
	blinkState1: any = "";
	blinkState2: any = "";
	blinkIndex: number = 0;
	optionToSelect: any;
	noOfRightAns: number = 0;
	commonAssets: any;
	noOfImgs: number;
	noOfImgsLoaded: number = 0;
	loaderTimer: any;
	confirmPopupAssets: any;
	disableHelpBtn: boolean = false;
	containgFolderPath: string = "";
	assetsPath: string = "";
	loadFlag: boolean = false;
	wrongImgOption: any;
	feedbackPopup: any;
	wrongPopup: any;
	popUpObj: any;
	aksharOnDisplay; any;
	attemptType: string = "";
	quesObj: any;
	tempSubscription: Subscription;
	feedbackObj: any;
	isPlayVideo: boolean;
	videoReplayd: boolean;
	replayconfirmAssets: any;
	tempTimer: any;
	wrongTimer: any;
	closed: boolean = false;
	PlayPauseFlag: boolean = true;
	blinkNextTimer: any;
	/*Start: Theme Implementation(Template Changes)*/
	controlHandler = {
		isSubmitRequired: false,
		isReplayRequired: false
	};
	themePath: any;
	fetchedcontent: any;
	functionalityType: any;
	showAnsTimeout: number;
	actComplete: boolean = false;
	disableInstruction: boolean = false;
	disableAllOpt: boolean = false;
	instructionOpacity: boolean = false;
	optOpacity: boolean = false;
	quesSkip: boolean = false;
	timerSubscription: Subscription;
	displayAnswerTimer: number = 1;
	showans: any;
	isShowAns: boolean = false;
	isLastQuestion: boolean;
	autoCloseTimerSubscription: Subscription;
	confirmPopupSubscription: any;
	activityStarted: boolean = false;
	/*END: Theme Implementation(Template Changes)*/
	playHoverInstruction() {
		if (this.timerSubscription != undefined) {
			this.timerSubscription.unsubscribe();
		}
		if (!this.narrator.nativeElement.paused) {
			console.log("narrator/instruction voice still playing");
		} else {
			console.log("play on Instruction");
			if (this.instruction.nativeElement.paused) {
				this.disableInstruction = true;
				this.instruction.nativeElement.currentTime = 0;
				this.instruction.nativeElement.play();
				this.instruction.nativeElement.onended = () => {
					this.disableInstruction = false;
					this.resetTimerForAnswer();
				}
			}

		}
	}
	PlayPauseVideo() {
		if (this.PlayPauseFlag) {
			this.mainVideo.nativeElement.pause();
			this.quesObj.quesPlayPause = this.quesObj.quesPlay;
			this.PlayPauseFlag = false;
		} else {
			this.mainVideo.nativeElement.play();
			this.quesObj.quesPlayPause = this.quesObj.quesPause;
			this.PlayPauseFlag = true;
		}

	}
	hoverPlayPause() {
		if (this.PlayPauseFlag) {
			this.quesObj.quesPlayPause = this.quesObj.quesPauseHover;
		} else {
			this.quesObj.quesPlayPause = this.quesObj.quesPlayHover;
		}
	}

	leavePlayPause() {
		if (this.PlayPauseFlag) {
			this.quesObj.quesPlayPause = this.quesObj.quesPauseOriginal;
		} else {
			this.quesObj.quesPlayPause = this.quesObj.quesPlayOriginal;
		}
	}
	hoverSkip() {
		// this.skipFlag = false;
		this.quesObj.quesSkip = this.quesObj.quesSkipHover;
	}

	houtSkip() {
		this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
	}
	hoverDecline() {
		this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_hover;
	}

	houtDecline() {
		this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_original;
	}

	hoverConfirm() {
		this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_hover;
	}

	houtConfirm() {
		this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_original;
	}
	hoverCloseFeedback() {
		this.feedbackPopup.close_btn = this.feedbackPopup.close_btn_hover;
	}
	houtCloseFeedback() {
		this.feedbackPopup.close_btn = this.feedbackPopup.close_btn_original;
	}
	hoverCloseConfirm() {
		this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_hover;
	}
	houtCloseConfirm() {
		this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_original;
	}
	hoverCloseReplay() {
		this.replayconfirmAssets.close_btn = this.replayconfirmAssets.close_btn_hover;
	}
	houtCloseReplay() {
		this.replayconfirmAssets.close_btn = this.replayconfirmAssets.close_btn_original;
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

	onHoverOption(opt, index) {
		opt.bgImgsrc = opt.bgImgsrc_hover;
		if (opt.sound) {
			this.playSound(opt.sound, index);
		}
	}
	hoverOK() {
		this.showans.ok_btn = this.showans.ok_btn_hover;
	}
	houtOK() {
		this.showans.ok_btn = this.showans.ok_btn_original;
	}
	playSound(sound, idx) {
		if (this.titleHelpAudio && this.titleHelpAudio.nativeElement) {
			this.titleHelpAudio.nativeElement.pause();
			this.titleHelpAudio.nativeElement.currentTime = 0;
		}
		if (this.audio && this.audio.paused) {
			this.audio.pause();
			this.audio.src = sound.url;
			this.audio.load();
			this.audio.play();
			for (let i = 0; i < this.myoption.length; i++) {
				if (i != idx && this.myoption[i]) {
					this.myoption[i].disableOpt = true;
				}
			}
			if (this.instruction && this.instruction.nativeElement.play) {
				this.instruction.nativeElement.pause();
				this.instruction.nativeElement.currentTime = 0;
			}
			this.disableInstruction = true;
			this.audio.onended = () => {
				this.stopOptionHoverAudio();
			}
		}

	}
	stopOptionHoverAudio() {
		this.disableInstruction = false;
		if (this.audio && !this.audio.paused) {
			this.audio.pause();
			this.audio.currentTime = 0;
		}
		for (let i = 0; i < this.myoption.length; i++) {
			if (this.myoption[i].disableOpt == true) {
				this.myoption[i].disableOpt = false;
			}
		}
	}
	optionHover(opt, i) {
		this.resetTimerForAnswer();
		if (this.instruction && this.instruction.nativeElement.play) {
			this.instruction.nativeElement.pause();
			this.instruction.nativeElement.currentTime = 0;
		}
		this.disableInstruction = false;
		this.optionImage.nativeElement.children[i].classList.add("scaleInAnimation");
		this.optionImage.nativeElement.children[i].children[1].style.cursor = "pointer";
	}

	onHoverOptionOut(opt, i) {
		if (opt && opt != undefined) {
			opt.bgImgsrc = opt.bgImgsrc_original;
			this.OptionZoomOutAnimation(opt, i);
		}
	}


	runCounter() {
		console.log(document.getElementById("circle1"))
		this.appModel.enableReplayBtn(false)
		console.log("this.quesInfo.formatTimeout", this.quesInfo.formatTimeout)
		this.countdown = (this.quesInfo.formatTimeout) / 1000;
		if (document.getElementById("circle1")) {
			document.getElementById("circle1").style.animationDuration = this.countdown + 's';
		}

		let timeTicking = setInterval(() => {
			console.log("this.countdown", this.countdown)
			if (this.countdown < 0) {
				clearInterval(timeTicking);
			} else {
				this.countdown = --this.countdown;
			}
		}, 1000);
	}

	checkRightAnswer(opt) {
		if (opt.custom_id == this.optionToSelect.custom_id) {
			return true;
		} else {
			return false;
		}
	}

	allCorrectUserAttempted(flag) {
		if (flag == 'manualSelect') {			
			setTimeout(() => {
				if (this.feedbackSound && this.feedbackSound.nativeElement) {
					this.feedbackSound.nativeElement.src = this.quesInfo.right_sound.url + "?someRandomSeed=" + Math.random().toString(36);
					this.feedbackSound.nativeElement.play();
				}
				this.feedbackSound.nativeElement.onended = () => {
					this.completeActivity();
				}
			}, 200)
		} else {			
			setTimeout(() => {
				if (this.feedbackSound && this.feedbackSound.nativeElement) {
					this.feedbackSound.nativeElement.src = this.quesInfo.autoPlaced_sound.url + "?someRandomSeed=" + Math.random().toString(36);
					this.feedbackSound.nativeElement.play();
				}
				this.feedbackSound.nativeElement.onended = () => {
					this.completeActivity();
				}
			}, 200)
		}

	}
	completeActivity() {
		this.maincontent.nativeElement.className = "disable_div";
		this.disableInstruction = true;
		this.blinkNextTimer = setTimeout(() => {
			this.optionBlock.nativeElement.className = "optionsBlock disable_div disable-click";
			this.instructionOpacity = true;
			this.optOpacity = true;
			//disable option and question on right attempt
			console.log("disable option and question on right attempt");
			this.appModel.handlePostVOActivity(false)
			this.blinkOnLastQues()
		}, this.quesObj.allCorrectBlackoutSec * 1000)
	}
	correctUserAttempted(flag) {
		if (flag == 'manualSelect') {
			if (this.feedbackSound && this.feedbackSound.nativeElement) {
				this.optionBlock.nativeElement.className = "optionsBlock disable_div";
				this.feedbackSound.nativeElement.src = this.quesInfo.right_sound.url + "?someRandomSeed=" + Math.random().toString(36);
				this.feedbackSound.nativeElement.play();
			}
			this.feedbackSound.nativeElement.onended = () => {
				this.checkForNextActivity();
			}
		} else {
			if (this.feedbackSound && this.feedbackSound.nativeElement) {
				this.optionBlock.nativeElement.className = "optionsBlock disable_div";
				this.feedbackSound.nativeElement.src = this.quesInfo.autoPlaced_sound.url + "?someRandomSeed=" + Math.random().toString(36);
				this.feedbackSound.nativeElement.play();
			}
			this.feedbackSound.nativeElement.onended = () => {
				this.checkForNextActivity();
			}
		}

	}
	checkForNextActivity() {
		this.appModel.handlePostVOActivity(false);
		this.appModel.enableReplayBtn(true);
		this.maincontent.nativeElement.className = "";
		this.optionBlock.nativeElement.className = "optionsBlock";
		setTimeout(() => {
			this.disableAllOpt = false;
		}, 1000)
		if (this.blinkIndex < this.feedback.correct_ans_index.length) {
			let rightOptIdx = this.feedback.correct_ans_index[this.blinkIndex];
			for (var i in this.myoption) {
				if (this.myoption[i].custom_id == rightOptIdx) {
					this.optionToSelect = this.myoption[i];
				}
			}
			this.startBlinkState();
		}
	}
	checkAnswer(opt, index, flag) {
		clearTimeout(this.wrongTimer);
		this.closed = false;
		this.blinkState1 = "";
		this.blinkState2 = "";
		this.timerSubscription.unsubscribe();;
		this.stopOptionHoverAudio();
		this.disableAllOpt = true;
		this.maincontent.nativeElement.className = "disable_div";		
		this.disableHelpBtn = true;
		this.titleHelpAudio.nativeElement.pause();
		this.titleHelpAudio.nativeElement.currentTime = 0;
		this.appModel.handlePostVOActivity(true);
		this.appModel.enableReplayBtn(false);
		if (flag == 'manualSelect'){
			this.attemptType = "manual";
			this.onHoverOptionOut(opt, index);
		}
		// logic to check what user has done is correct or wrong
		if (this.checkRightAnswer(opt)) {
			this.noOfRightAns++;
			this.ansList.push(opt);
			//Analyticsz
			if (this.noOfRightAns == this.feedback.correct_ans_index.length) {
				this.actComplete = true;
				this.appModel.enableReplayBtn(false)
				this.appModel.handlePostVOActivity(true)
				this.optionBlock.nativeElement.className = "optionsBlock disable_div";
				{
					this.ansList.forEach(element => {
						element.filled_img = element.filled_img_green
					});
				}
				opt.bgImgsrc = opt.bgImgsrc_empty;
				opt.imgsrc = "";
				this.allCorrectUserAttempted(flag);
			} else {
				opt.bgImgsrc = opt.bgImgsrc_empty;
				opt.imgsrc = "";
				this.blinkIndex++;
				this.correctUserAttempted(flag);
			}
		} else {
			//new code

			this.popUpObj = opt;
			this.feedbackPopup = this.wrongPopup;
			this.appModel.enableReplayBtn(false);
			this.wrongImgOption = opt  //setting wrong image options
			this.optionBlock.nativeElement.className = "optionsBlock disable_div";
			let correctAns: HTMLElement = this.correctAns.nativeElement as HTMLElement
			correctAns.className = "modal d-flex align-items-center justify-content-center showit correctAns dispFlex";

			//play wrong feed back audio

			setTimeout(() => {
				if (this.wrongFeedback && this.wrongFeedback.nativeElement) {
					this.wrongFeedback.nativeElement.play();
				}
			}, 50)

			this.wrongFeedback.nativeElement.onended = () => {

				this.wrongTimer = setTimeout(() => {
					this.correctAns.nativeElement.classList = "modal";
					if (!this.closed) {
						this.appModel.wrongAttemptAnimation();
						this.maincontent.nativeElement.className = "";
						// this.appModel.handlePostVOActivity(false);
						this.appModel.enableReplayBtn(true);
					}
				}, this.quesObj.WrongAnimationSec * 1000);

			}
		}
	}

	close() {
		//this.appModel.event = { 'action': 'exit', 'currentPosition': this.currentVideoTime };
		this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
	}

	get basePath(): any {
		// console.log('temponeComponent: path=', this.appModel.content.id + '/' + this.appModel.content.contentData.data['path']);
		if (this.appModel && this.appModel.content) {

			return this.appModel.content.id + '';
		}
	}


	ngOnInit() {
		this.appModel.handlePostVOActivity(true);
		this.appModel.enableReplayBtn(false);
		// this.appModel.functionone(this.templatevolume, this);//start end

		if (this.appModel.isNewCollection) {
			this.appModel.event = { 'action': 'segmentBegins' };
		}
		this.containgFolderPath = this.getBasePath();
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
		console.log("fetch data from six " + this.appModel.content.contentData.data);
		this.setData();
		this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
			if (mode == "manual") {
				//show modal for manual
				console.log("mode manuall", mode)

			} else if (mode == "auto") {
				console.log("mode manual2", mode)
				this.showAnswer();
			}
		})
		this.confirmPopupSubscription = this.appModel.getConfirmationPopup().subscribe((val) => {

			this.blinkState1 = "";
			this.blinkState2 = "";
			if (this.timerSubscription != undefined) {
				this.timerSubscription.unsubscribe();
			}
			if (this.audio && !this.audio.paused) {
				this.audio.pause();
				this.audio.currentTime = 0;
				this.stopOptionHoverAudio();
			}
			if (this.instruction && !this.instruction.nativeElement.paused) {
				this.instruction.nativeElement.currentTime = 0;
				this.instruction.nativeElement.pause();
				this.disableInstruction = false;
			}
			if (!this.actComplete) {
				this.appModel.handlePostVOActivity(false);
			} else {
				this.appModel.notifyUserAction();
			}
			if (val == "uttarDikhayein") {
				if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
					console.log("confirmPopupAssets", this.confirmPopupAssets, this.assetsPath, this.getBasePath())
					this.confirmModalRef.nativeElement.classList = "displayPopup modal";
					this.checkForAutoClose();
				}
			}
			if (val == "replayVideo") {
				// this.appModel.videoStraming(true);
				this.activityStarted = true;
				if (this.confirmReplayRef && this.confirmReplayRef.nativeElement) {
					this.disableAllOpt = true;
					this.confirmReplayRef.nativeElement.classList = "displayPopup modal";
					this.PlayPauseFlag = true;
					this.quesObj.quesPlayPause = this.quesObj.quesPause;
					this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
				}
			}
		})
		this.appModel.postWrongAttempt.subscribe(() => {
			this.postWrongAttempt()
			this.resetTimerForAnswer();
		});
		this.appModel.resetBlinkingTimer();
		this.appModel.handleController(this.controlHandler);
	}

	ngAfterViewChecked() {
		this.templatevolume(this.appModel.volumeValue, this);
	}

	ngOnDestroy() {
		console.log("current template is being destroyed");
		clearTimeout(this.blinkNextTimer);
		clearTimeout(this.tempTimer);
		clearTimeout(this.wrongTimer);
		if (this.confirmPopupSubscription != undefined) {
			this.confirmPopupSubscription.unsubscribe();
		}
		if (this.timerSubscription != undefined) {
			this.timerSubscription.unsubscribe();
		}
		if (this.autoCloseTimerSubscription != undefined) {
			this.autoCloseTimerSubscription.unsubscribe();
		}
		if (this.narrator && this.narrator.nativeElement) {
			this.narrator.nativeElement.pause();
			this.narrator.nativeElement.currentTime = 0;
		}
		if (this.audio && !this.audio.paused) {
			this.audio.pause();
			this.audio.currentTime = 0;
		}
	}
	checkForAutoClose() {
		if (this.confirmModalRef.nativeElement.classList.contains("displayPopup")) {
			if (this.isLastQuestion && this.actComplete) {
				this.resetTimerForAutoClose();
			} else {
				if (this.autoCloseTimerSubscription != undefined) {
					this.autoCloseTimerSubscription.unsubscribe();
				}
			}
		}
	}
	resetTimerForAutoClose() {
		if (this.autoCloseTimerSubscription) {
			this.autoCloseTimerSubscription.unsubscribe();
		}
		this.appModel.stopAllTimer();
		const interval = 1000;
		const closeConfirmInterval = 2 * 60;
		this.autoCloseTimerSubscription = timer(0, interval).pipe(
			take(closeConfirmInterval)
		).subscribe(value =>
			this.removeSubscriptionAutoClose((closeConfirmInterval - +value) * interval),
			err => {
				//console.log("error occuered....");
			},
			() => {
				this.sendFeedback('confirm-modal-id', 'no');
				this.autoCloseTimerSubscription.unsubscribe();
			}
		)
	}
	removeSubscriptionAutoClose(timer) {
		console.log("waiting for autoClose", timer / 1000);
	}
	postWrongAttempt() {
		if (this.blinkIndex < this.feedback.correct_ans_index.length) {
			let rightOptIdx = this.feedback.correct_ans_index[this.blinkIndex];
			for (var i in this.myoption) {
				if (this.myoption[i].custom_id == rightOptIdx) {
					this.optionToSelect = this.myoption[i];
				}
			}
			this.startBlinkState();
		}
		this.optionBlock.nativeElement.className = "optionsBlock";
		this.maincontent.nativeElement.className = "";
		setTimeout(() => {
			this.disableAllOpt = false;
		}, 1000)
		this.appModel.handlePostVOActivity(false);
		this.appModel.enableReplayBtn(true);
		// setTimeout(() => {
		// 	this.closed = false;
		// }, 2000)

	}

	/******Checking of existance of quesTab in content JSON *******/
	checkquesTab() {
		if (this.fetchedcontent.commonassets.ques_control != undefined) {
			this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
		} else {
			this.appModel.getJson();
		}
	}


	OptionZoomOutAnimation(opt, i) {
		if (this.narrator.nativeElement.paused) {
			this.optionImage.nativeElement.children[i].classList.add("scaleOutAnimation");
			setTimeout(() => {
				this.optionImage.nativeElement.children[i].classList.remove("scaleInAnimation");
				this.optionImage.nativeElement.children[i].classList.remove("scaleOutAnimation");
			}, 500);
		}
	}


	templatevolume(vol, obj) {
		if (obj.feedbackSound && obj.feedbackSound.nativeElement) {
			obj.feedbackSound.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.audio) {
			obj.audio.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.wrongFeedback && obj.wrongFeedback.nativeElement) {
			obj.wrongFeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.narrator && obj.narrator.nativeElement) {
			obj.narrator.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.titleHelpAudio && obj.titleHelpAudio.nativeElement) {
			obj.titleHelpAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.instruction && obj.instruction.nativeElement) {
			obj.instruction.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.mainVideo && obj.mainVideo.nativeElement) {
			obj.mainVideo.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.showAnsFeedback && obj.showAnsFeedback.nativeElement) {
			obj.showAnsFeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
	}

	/******Data set from content JSON *******/
	setData() {
		if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
			console.log(this.fetchedcontent);
			this.showFormat = true;
			this.myoption = JSON.parse(JSON.stringify(this.fetchedcontent.options))
			console.log(this.myoption);
			this.question = this.fetchedcontent.ques;
			this.quesInfo = this.fetchedcontent.commonassets;
			this.commonAssets = this.fetchedcontent.commonassets;
			this.isFirstQues = this.quesInfo.isFirstQues;
			this.isLastQuestion = this.commonAssets.isLastQues;
			this.isLastQues = this.appModel.isLastSection;
			this.isLastQuesAct = this.appModel.isLastSectionInCollection;
			this.noOfImgs = this.quesInfo.imgCount;
			this.feedback = this.fetchedcontent.feedback;
			this.confirmPopupAssets = this.fetchedcontent.feedback.confirm_popup;
			this.wrongPopup = this.feedback.wrongFeedback;
			this.showans = this.feedback.showAns;
			this.feedbackPopup = this.wrongPopup;
			this.quesObj = this.fetchedcontent.quesObj;
			this.feedbackObj = this.fetchedcontent.feedback;
			this.replayconfirmAssets = this.fetchedcontent.feedback.replay_confirm;
			this.blinkIndex = 0;
			let rightOptIdx = this.feedback.correct_ans_index[this.blinkIndex];
			this.displayAnswerTimer = this.quesObj.autoFillTimer;
			this.countdown = (this.quesInfo.formatTimeout) / 1000;
			for (var i in this.myoption) {
				this.myoption[i].disableOpt = false;
				if (this.myoption[i].custom_id == rightOptIdx) {
					this.optionToSelect = this.myoption[i];
				}
			}
			/*Start: Theme Implementation(Template Changes)*/
			this.controlHandler = {
				isSubmitRequired: this.quesObj.submitRequired,
				isReplayRequired: this.quesObj.replayRequired
			}
			/*End: Theme Implementation(Template Changes)*/
			if (this.quesObj.quesVideo && this.quesObj.quesVideo.autoPlay && !this.appModel.isVideoPlayed) {
				this.isPlayVideo = true;
			} else {
				this.isPlayVideo = false;
				setTimeout(() => {
					this.runCounter();
				}, 200)
				this.tempTimer = setTimeout(() => {
					this.showFormat = false;
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


		} else {
			this.blinkState1 = "";
			this.blinkState2 = "";
			this.myoption = [];
			this.question = "";
			this.feedback = "";
			this.quesInfo = "";
			this.ansList.splice(0, this.ansList.length);
			if (!this.isLastQues) {
				this.appModel.setLoader("loader");
			}
		}
	}

	resetTimerForAnswer() {
		if (this.timerSubscription) {
			this.timerSubscription.unsubscribe();
		}

		if (this.actComplete) {
			this.appModel.notifyUserAction();
		} else {
			this.appModel.stopAllTimer();
			const interval = 1000;
			const showAnsInterval = this.displayAnswerTimer * 60;
			this.timerSubscription = timer(0, interval).pipe(
				take(showAnsInterval)
			).subscribe(value =>
				this.removeSubscription((showAnsInterval - +value) * interval),
				err => {
					//console.log("error occuered....");
				},
				() => {
					let save;
					for (let i = 0; i < this.myoption.length; i++) {
						if (this.optionToSelect === this.myoption[i]) {
							save = i;
						}
					}
					this.timerSubscription.unsubscribe();
					this.appModel.startPreviousTimer();
					this.checkAnswer(this.optionToSelect, save, 'autoSelect');
				}
			)
		}

	}

	removeSubscription(timer) {
		console.log("waiting for autoselect", timer / 1000);
	}
	startBlinkState() {
		setTimeout(() => {
			this.blinkState1 = this.optionToSelect.blink_state1;
			this.blinkState2 = this.optionToSelect.blink_state2;
		}, 200)
		this.aksharOnDisplay = this.optionToSelect.aksharImg.url;
		this.resetTimerForAnswer();
	}

	checkImgLoaded() {
		if (!this.loadFlag) {
			this.noOfImgsLoaded++;
			console.log("this.noOfImgsLoaded", this.noOfImgsLoaded, this.noOfImgs)
			if (this.noOfImgsLoaded >= this.noOfImgs) {
				this.appModel.setLoader(false);
				this.loadFlag = true;
				clearTimeout(this.loaderTimer);
				this.appModel.navShow = 2;
				this.checkforQVO();

			}
		}
	}

	showReplay(ref, flag: string, action?: string) {
		ref.classList = "modal";
		if (flag == "yes") {
			this.replayconfirmAssets.confirm_btn = this.replayconfirmAssets.confirm_btn_original;
			if (action == "replay") {
				this.quesSkip = true;
				this.replayVideo();
			}
		} else if (flag == "no") {
			this.appModel.videoStraming(false);
			this.appModel.enableReplayBtn(true);
			if (this.blinkIndex < this.feedback.correct_ans_index.length) {
				let rightOptIdx = this.feedback.correct_ans_index[this.blinkIndex];
				for (var i in this.myoption) {
					if (this.myoption[i].custom_id == rightOptIdx) {
						this.optionToSelect = this.myoption[i];
					}
				}
				this.startBlinkState();
			}
			setTimeout(() => {
				this.disableAllOpt = false;
				this.disableInstruction = false;
				this.resetTimerForAnswer();
			}, 1000);
		}
	}

	checkforQVO() {
		if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
			this.narrator.nativeElement.src = this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
			this.appModel.handlePostVOActivity(true);
			this.appModel.enableReplayBtn(false);
			this.optionBlock.nativeElement.className = "optionsBlock disable_div";
			this.disableInstruction = true;
			this.disableAllOpt = true;
			this.narrator.nativeElement.play();
			this.activityStarted = true;
			this.narrator.nativeElement.onended = () => {
				this.optionBlock.nativeElement.className = "optionsBlock";
				this.disableInstruction = false;
				this.appModel.handlePostVOActivity(false);
				this.appModel.enableReplayBtn(true);
				this.startBlinkState();
				setTimeout(() => {
					this.disableAllOpt = false;
				}, 1000)
			}
		} else {
			this.appModel.handlePostVOActivity(false);
			this.appModel.enableReplayBtn(true);
			this.startBlinkState();
			setTimeout(() => {
				this.disableAllOpt = false;
			}, 1000)
		}
	}

	checkSingleImgLoaded() {
		this.appModel.navShow = 1;
		this.appModel.setLoader(false);
	}

	getBasePath() {
		if (this.appModel && this.appModel.content) {
			return this.appModel.content.id + '';
		}
	}

	sendFeedback(id: string, flag: string) {
		if (this.autoCloseTimerSubscription != undefined) {
			this.autoCloseTimerSubscription.unsubscribe();
		}
		this.confirmModalRef.nativeElement.classList = "modal";
		this.correctAns.nativeElement.classList = "modal";
		this.optionBlock.nativeElement.className = "optionsBlock";
		this.appModel.notifyUserAction();
		if (flag == "yes") {
			//show answer

			this.showAnswer();
		} else {

			if (!this.actComplete && this.blinkIndex < this.feedback.correct_ans_index.length) {
				let rightOptIdx = this.feedback.correct_ans_index[this.blinkIndex];
				for (var i in this.myoption) {
					if (this.myoption[i].custom_id == rightOptIdx) {
						this.optionToSelect = this.myoption[i];
					}
				}
				this.startBlinkState();
			}
		}
	}

	wrongAnsClose() {
		clearTimeout(this.wrongTimer);
		this.closed = true;
		this.correctAns.nativeElement.classList = "modal";
		this.correctAns.nativeElement.classList = "modal";
		this.appModel.wrongAttemptAnimation();

	}

	blinkOnLastQues() {
		this.appModel.enableReplayBtn(false);
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

	loadSingleImg() {
		this.isShowAns = true;
		this.appModel.navShow = 1;
	}
	loadQuesScreen() {
		this.isShowAns = false;
		this.appModel.navShow = 2;
	}
	showAnswer() {
		this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_original;
		this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_original;
		this.actComplete = true;
		// this.ansList.length = 0;
		this.blinkState1 = "";
		this.blinkState2 = "";
		this.optionBlock.nativeElement.className = "optionsBlock disable_div";
		// document.getElementById("ele_ansBtn").classList.add("disableBtn");
		this.appModel.handlePostVOActivity(true)
		this.appModel.enableReplayBtn(false);
		this.maincontent.nativeElement.className = "disable_div";
		this.optOpacity = false;
		this.instructionOpacity = false;
		// this.ansList.forEach(element => {
		// 	element.filled_img = element.filled_img_green
		// });
		// this.feedback.correct_ans_index.forEach(element1 => {
		// 	this.myoption.forEach(element2 => {
		// 		if (element2.custom_id == element1) {
		// 			this.ansList.push(element2);
		// 			element2.bgImgsrc = element2.bgImgsrc_empty;
		// 			element2.imgsrc = "";
		// 		}
		// 	});
		// });

		this.attemptType = "no animation";
		this.confirmModalRef.nativeElement.classList = "modal";
		this.confirmReplayRef.nativeElement.classList = "modal";
		this.loadSingleImg();
		// this.appModel.resetBlinkingTimer();
		setTimeout(() => {
			if (this.showAnsFeedback && this.showAnsFeedback.nativeElement) {
				this.showAnsFeedback.nativeElement.play();
				this.showAnsFeedback.nativeElement.onended = () => {
					this.blinkNextTimer = setTimeout(() => {
						this.exitShowAnswer();
					}, this.showAnsTimeout)
				}
			} else {
				this.blinkNextTimer = setTimeout(() => {
					this.exitShowAnswer();
				}, this.showAnsTimeout)
			}
		}, 200)


	}
	exitShowAnswer() {
		this.loadQuesScreen();
		this.disableInstruction = true;
		this.instructionOpacity = true;
		this.optOpacity = true;
		this.disableAllOpt = true;
		this.appModel.handlePostVOActivity(false)
		this.blinkOnLastQues();

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
			setTimeout(() => {
				this.runCounter()
			}, 200)
			setTimeout(() => {
				this.showFormat = false;
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
				this.appModel.enableReplayBtn(true);
			}, this.quesInfo.formatTimeout)
		} else {
			this.onVideoEnd();
		}
	}

	replayVideo() {
		this.appModel.stopAllTimer();
		this.videoReplayd = true;
		this.activityStarted = true;
		this.isPlayVideo = true;
		this.disableAllOpt = true;
		this.disableInstruction = true;
		this.appModel.navShow = 1;
		setTimeout(() => {
			this.mainVideo.nativeElement.play();
			this.mainVideo.nativeElement.onended = () => {
				this.onVideoEnd();
			}
		}, 500)
	}
	endedHandleronSkip() {
		this.isPlayVideo = false;
		this.appModel.enableReplayBtn(true);
		this.appModel.videoStraming(false);
		this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
		this.appModel.navShow = 2;
		console.log("this.activityStarted", this.activityStarted)
		if (!this.activityStarted) {
			setTimeout(() => {
				this.runCounter()
			}, 200)
			setTimeout(() => {
				this.showFormat = false;
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
		} else {
			this.onVideoEnd();
		}
	}

	onVideoEnd() {
		this.appModel.navShow = 2;
		this.disableInstruction = false;
		setTimeout(() => {
			this.disableAllOpt = false;
		}, 1000)
		this.isPlayVideo = false;
		this.appModel.videoStraming(false);
		if (this.blinkIndex < this.feedback.correct_ans_index.length) {
			let rightOptIdx = this.feedback.correct_ans_index[this.blinkIndex];
			for (var i in this.myoption) {
				if (this.myoption[i].custom_id == rightOptIdx) {
					this.optionToSelect = this.myoption[i];
				}
			}
			this.startBlinkState();
		}
		this.resetTimerForAnswer();
	}

}
