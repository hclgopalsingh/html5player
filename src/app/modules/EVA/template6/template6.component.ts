import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { Base } from '../../../controller/base';
import { SharedserviceService } from '../../../services/sharedservice.service';
import { PlayerConstants } from '../../../common/playerconstants';
import { ActivatedRoute } from '@angular/router';
import { DragulaService } from "ng2-dragula";

import 'jquery';
declare var $: any;

@Component({
	selector: 'app-template6',
	templateUrl: './template6.component.html',
	styleUrls: ['./template6.component.css']
})
export class Template6Component extends Base implements OnInit {

	constructor(private dragulaService: DragulaService, private appModel: ApplicationmodelService, private ActivatedRoute: ActivatedRoute, private Sharedservice: SharedserviceService) {
		super();
		this.dragSubscription = dragulaService.drop().subscribe((value: any) => {
			if (value.source == value.target || value.source.parentElement.className == value.target.parentElement.className) {
				dragulaService.find('second-bag2').drake.cancel(true);
			} else {
				this.imageChange = setTimeout(() => {
					this.optionHolder.leftHolder = this.optionHolder.leftHolder_original;
					this.optionHolder.rightHolder = this.optionHolder.rightHolder_original;
				}, 500);

				var abc = value.el.getAttribute("id");
				var xyz = this.myoption[abc];
				if (this.blinkCategory == xyz.category) {
					this.submitAttempt(abc, xyz);
				} else {
					dragulaService.find('second-bag2').drake.cancel(true);
					this.submitAttempt(abc, xyz);
				}
			}

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
	@ViewChild('mainContainer') mainContainer: any;
	@ViewChild('narrator_voice') narrator_voice: any;
	@ViewChild('titleNavBtn') titleNavBtn: any;
	@ViewChild('container') containerBlock: any;
	@ViewChild('sprite') sprite: any;
	@ViewChild('titleAudio') titleAudio: any;
	@ViewChild('maincontent') maincontent: any;
	@ViewChild('clapSound') clapSound: any;
	@ViewChild('optionsBlock') optionsBlock: any;
	@ViewChild('showAnswerfeedback') showAnswerfeedback: any;
	@ViewChild('showAnswerRef') showAnswerRef: any;
	@ViewChild('ansPopup') ansPopup: any;
	@ViewChild('rightFeedback') rightFeedback: any;
	@ViewChild('wrongFeedback') wrongFeedback: any;
	@ViewChild('speakerVolume') speakerVolume: any;
	@ViewChild('showAnswerVO') showAnswerVO: any;
	//@ViewChild('videoonshowAnspopUp') videoonshowAnspopUp: any;
	@ViewChild('overlay') overlay: any;
	@ViewChild('optionRef') optionRef: any;
	@ViewChild('celebrationPopup') celebrationsPopup: any;


	assetsfolderlocation: string = "";
	lastQuestionCheck: any;
	assetspath: any;
	blink: boolean = false;
	showIntroScreen: boolean;
	audio = new Audio();
	bool: boolean = false;
	idArray: any = [];
	speaker: any = "";
	myoption: any = [];
	question: any = "";
	feedback: any = "";
	answers: any = "";
	Instruction: any = "";
	quesInfo: any = "";
	isLastQues: boolean = false;
	isAutoplayOn: boolean;
	isLastQuesAct: boolean;
	noOfImgs: number;
	noOfImgsLoaded: number = 0;
	loaderTimer: any;
	common_assets: any = "";
	LoadFlag: boolean = false;
	contentgFolderPath: string = "";
	videoPlayed = false;
	speakerPlayed = false;
	instructiontext: string;
	wrongCount: number = 0;
	showAnswerSubscription: any;
	popupType: string = "";
	attemptType: string = "";
	ifRightAns: boolean = false;
	popupAssets: any;
	rightPopup: any;
	wrongPopup: any;
	ifWrongAns: boolean = false;
	closed: boolean = false;
	showAnswerPopup: any;
	popupclosedinRightWrongAns: boolean = false;
	rightTimer: any;
	clapTimer: any;
	optionHolder: any = [];
	maxOpotions: number = 3;
	LastquestimeStart: boolean = false;
	dummyImgs: any = [];

	questionObj: any;
	selectableOpts: number;
	completeRandomArr: any = [];
	leftRandomArray: any = [];
	rightRandomArray: any = [];
	blinkCategory1: number = 0;
	blinkCategory2: number = 0;
	moveTo: any;
	leftSelectedIdx: number = 0;
	blinkSide: string = "";
	startCount: number = 0;
	blinkFlag: boolean = true;
	blinkTimeInterval: any;
	moveFrom: any;
	categoryA: any = {
		"correct": [],
		"incorrect": []
	};
	categoryB: any = {
		"correct": [],
		"incorrect": []
	};
	isWrongAttempted: boolean = false;
	clappingTimer: any;
	celebrationTimer: any;
	randomIdx: any;
	LRightAttempt: number = 0;
	RRightAttempt: number = 0;
	splishedValue: any;
	leftAnswerImage: any;
	rightAnswerImage: any;
	dragSubscription: any;
	blinkCategory: any;
	isdrop = false;
	optionHolderValue: any;
	imageChange: any
	get basePath(): any {
		if (this.appModel && this.appModel.content) {
			return this.appModel.content.id + '';
		}
	}
	setData() {
		if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
			let fetchedData: any = this.appModel.content.contentData.data;
			this.instructiontext = fetchedData.instructiontext;
			this.optionHolderValue = fetchedData.option_holder
			this.common_assets = fetchedData.commonassets;
			this.optionHolder = fetchedData.option_holder;
			this.speaker = JSON.parse(JSON.stringify(fetchedData.speaker));
			this.myoption = JSON.parse(JSON.stringify(fetchedData.optionArray));
			this.question = fetchedData.quesObj;
			this.questionObj = fetchedData.quesObj;
			this.selectableOpts = JSON.parse(JSON.stringify(this.questionObj.noOfOptions));
			for (let i = 0; i < this.maxOpotions; i++) {
				this.dummyImgs.push(fetchedData.optionArray[i]);
			}

			this.leftRandomArray = JSON.parse(JSON.stringify(this.optionHolder.left_random_index));
			this.rightRandomArray = JSON.parse(JSON.stringify(this.optionHolder.right_random_index));
			this.completeRandomArr = this.leftRandomArray.concat(this.rightRandomArray);
			this.feedback = fetchedData.feedback;
			this.popupAssets = fetchedData.feedback.popupassets;
			this.rightPopup = this.feedback.right_ans_sound;
			this.wrongPopup = this.feedback.wrong_ans_sound;
			this.showAnswerVO = this.feedback.show_ans_sound;
			this.showAnswerPopup = this.feedback.show_ans_popup;
			this.leftAnswerImage = JSON.parse(JSON.stringify(this.feedback.show_ans_popup.leftHolder.answer));
			this.rightAnswerImage = JSON.parse(JSON.stringify(this.feedback.show_ans_popup.rightHolder.answer));
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
		if (this.lastQuestionCheck) {
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
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
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
		if (obj.audio) {
			obj.audio.volume = obj.appModel.isMute ? 0 : vol;
		}
	}
	//end



	ngOnInit() {
		clearInterval(this.blinkTimeInterval);
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
				if (!this.audio.paused) {
					this.audio.pause();
					this.audio.currentTime = 0;
					this.enableAllOptions();
				}
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
					this.showAnswerRef.nativeElement.classList = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
					this.wrongFeedback.nativeElement.pause();
					this.rightFeedback.nativeElement.pause();
					if (this.showAnswerfeedback && this.showAnswerfeedback.nativeElement) {
						this.showAnswerfeedback.nativeElement.play();
						this.showAnswerfeedback.nativeElement.onended = () => {
							setTimeout(() => {
								this.closePopup("showanswer");
							}, 10000);

						}

					}
				}
			}
		})
		this.imageChange = setTimeout(() => {
			this.optionHolder.leftHolder = this.optionHolder.leftHolder_original;
			this.optionHolder.rightHolder = this.optionHolder.rightHolder_original;
		}, 500);
	}

	ngOnDestroy() {
		this.showAnswerSubscription.unsubscribe();
		clearTimeout(this.rightTimer);
		clearTimeout(this.imageChange);
		clearTimeout(this.clapTimer);
		clearInterval(this.blinkTimeInterval);
		clearTimeout(this.celebrationTimer);
		this.dragSubscription.unsubscribe();
	}

	ngAfterViewChecked() {
		if (this.titleAudio && this.titleAudio.nativeElement) {
			this.titleAudio.nativeElement.onended = () => {
				this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeInAnimation";
			}
		}
		this.templatevolume(this.appModel.volumeValue, this);
	}

	checkImgLoaded() {
		if (!this.LoadFlag) {
			this.noOfImgsLoaded++;
			if (this.noOfImgsLoaded >= this.noOfImgs) {
				this.appModel.setLoader(false);
				this.Sharedservice.setShowAnsEnabled(false);
				document.getElementById("container").style.opacity = "1";
				clearTimeout(this.loaderTimer);
				this.LoadFlag = true;
				this.checkforQVO();
			}
		}
	}

	checkforQVO() {
		if (this.question && this.question.quesInstruction && this.question.quesInstruction.url && this.question.quesInstruction.autoPlay) {
			this.appModel.handlePostVOActivity(true);
			this.optionsBlock.nativeElement.classList = "disable_div";
			(document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "none";
			this.narrator_voice.nativeElement.play();
			this.narrator_voice.nativeElement.onended = () => {
				this.optionsBlock.nativeElement.classList = "";
				(document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "";
			}
			this.startActivity();
		}
	}
	startActivity() {
		this.getRandomIndxBlink(this.selectableOpts);
	}

	getRandomIndxBlink(no) {
		clearInterval(this.blinkTimeInterval);
		$(this.optionsBlock.nativeElement.children[0].children[2]).removeClass("disableDiv1");
		$(this.optionsBlock.nativeElement.children[0].children[0]).removeClass("disableDiv1");
		this.randomIdx = Math.floor((Math.random() * no));

		if (this.optionHolder.left_random_index.includes(this.completeRandomArr[this.randomIdx]) && this.blinkCategory1 < 3 && this.LRightAttempt < 3) {
			this.blinkCategoryA(this.randomIdx);
			$(this.optionsBlock.nativeElement.children[0].children[2]).addClass("disableDiv1");
		} else if (this.optionHolder.right_random_index.includes(this.completeRandomArr[this.randomIdx]) && this.blinkCategory2 < 3 && this.RRightAttempt < 3) {
			this.blinkCategoryB(this.randomIdx);
			$(this.optionsBlock.nativeElement.children[0].children[0]).addClass("disableDiv1");
		} else if (this.blinkCategory1 == 3) {
			let flagFound = false;
			for (let i = 0; i < this.completeRandomArr.length; i++) {
				if (this.optionHolder.right_random_index.includes(this.completeRandomArr[i])) {
					flagFound = true;
					this.blinkCategoryB(i);
					break;
				}
			}
			if (!flagFound) {
				this.blinkCategory1 = 0;
				this.getRandomIndxBlink(this.selectableOpts);
			}

		} else if (this.blinkCategory2 == 3) {
			let flagFound = false;
			for (let i = 0; i < this.completeRandomArr.length; i++) {
				if (this.optionHolder.left_random_index.includes(this.completeRandomArr[i])) {
					flagFound = true
					this.blinkCategoryA(i);
					break;
				}
			}
			if (!flagFound) {
				this.blinkCategory2 = 0;
				this.getRandomIndxBlink(this.selectableOpts);
			}
		}

	}

	blinkCategoryA(randomIdx) {

		this.blinkCategory = "A";
		this.blinkSide = "left";
		this.startCount = 1;
		this.blinkHolder();
		this.blinkCategory2 = 0;
	}

	blinkCategoryB(randomIdx) {

		this.blinkCategory = "B";
		this.blinkSide = "right";
		this.startCount = 1;
		this.blinkHolder();
		this.blinkCategory1 = 0;
	}

	blinkHolder() {
		this.blinkFlag = true;
		this.blinkTimeInterval = setInterval(() => {
			if (this.startCount == 1) {
				this.blinkHolderImg();
			} else {
				clearInterval(this.blinkTimeInterval)
			}
		}, 300);

	}

	blinkHolderImg = () => {
		if (this.blinkSide == 'left') {
			if (this.blinkFlag) {
				this.optionHolder.leftHolder = this.optionHolder.leftHolder_blink1;
				setTimeout(() => {
					this.optionHolder.leftHolder = this.optionHolder.leftHolder_blink2;
				}, 150)
				this.blinkFlag = false;
			} else {
				this.optionHolder.leftHolder = this.optionHolder.leftHolder_original;
				this.blinkFlag = true;
			}
		} else if (this.blinkSide == 'right') {
			if (this.blinkFlag) {
				this.optionHolder.rightHolder = this.optionHolder.rightHolder_blink1;
				setTimeout(() => {
					this.optionHolder.rightHolder = this.optionHolder.rightHolder_blink2;
				}, 150)
				this.blinkFlag = false;
			} else {
				this.optionHolder.rightHolder = this.optionHolder.rightHolder_original;
				this.blinkFlag = true;
			}
		}
	}

	submitAttempt(idx, opt) {
		this.appModel.enableReplayBtn(false);
		this.startCount = 0;
		clearInterval(this.blinkTimeInterval);
		this.blinkTimeInterval = 0;
		this.moveFrom = this.optionsBlock.nativeElement.children[1].children[idx].children[0].src;
		for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
			document.getElementsByClassName("ansBtn")[i].classList.add("disableDiv");
		}
		this.stopAllSounds("dragged");
		if (this.blinkSide == "left") {
			if ((this.optionHolder.left_random_index).includes(opt.id)) {
				this.LRightAttempt++;
				this.selectableOpts--;
				this.blinkCategory1++;
				this.splishedValue = this.completeRandomArr[this.randomIdx];
				this.completeRandomArr.splice(this.randomIdx, 1);
				$(this.optionsBlock.nativeElement.children[1].children[idx]).addClass("disableDiv1");
				this.setClappingTimer(this.rightFeedback);
				this.ifRightAns = true;
				this.categoryA.correct.push(opt);
			} else {
				if (this.blinkCategory1 != 0) {
					this.blinkCategory1--;
				}
				this.completeRandomArr.push(this.splishedValue);
				//this.selectableOpts++;
				this.categoryA.incorrect.push(opt);
				this.ifWrongAns = true;
				this.optionsBlock.nativeElement.className = "optionsBlock disableDiv";
				this.appModel.stopAllTimer();
				this.wrongCount += 1;
				setTimeout(() => {
					if (this.wrongFeedback && this.wrongFeedback.nativeElement) {
						this.wrongFeedback.nativeElement.play();
					}
					this.wrongFeedback.nativeElement.onended = () => {
						this.getRandomIndxBlink(this.selectableOpts);
						this.optionsBlock.nativeElement.classList.remove("disableDiv");
						if (this.wrongCount >= 3 && this.ifWrongAns) {
							this.Sharedservice.setShowAnsEnabled(true);
						}
						this.doRandomize(this.myoption);
						for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
							document.getElementsByClassName("ansBtn")[i].classList.remove("disableDiv");
						}
					}
				});

			}
		}
		if (this.blinkSide == "right") {

			if ((this.optionHolder.right_random_index).includes(opt.id)) {
				this.RRightAttempt++;
				this.selectableOpts--;
				this.blinkCategory2++;
				this.splishedValue = this.completeRandomArr[this.randomIdx];
				this.completeRandomArr.splice(this.randomIdx, 1);
				$(this.optionsBlock.nativeElement.children[1].children[idx]).addClass("disableDiv1");
				this.setClappingTimer(this.rightFeedback);
				this.categoryB.correct.push(opt);
				this.ifRightAns = true;
			} else {
				if (this.blinkCategory2 != 0) {
					this.blinkCategory2--;
				}
				this.completeRandomArr.push(this.splishedValue);
				//this.selectableOpts++;
				this.categoryB.incorrect.push(opt);

				this.ifWrongAns = true;
				this.optionsBlock.nativeElement.className = "optionsBlock disableDiv";
				this.appModel.stopAllTimer();
				this.wrongCount += 1;
				setTimeout(() => {
					if (this.wrongFeedback && this.wrongFeedback.nativeElement) {
						this.wrongFeedback.nativeElement.play();
					}
					this.wrongFeedback.nativeElement.onended = () => {
						this.getRandomIndxBlink(this.selectableOpts);
						this.optionsBlock.nativeElement.classList.remove("disableDiv");
						if (this.wrongCount >= 3 && this.ifWrongAns) {
							this.Sharedservice.setShowAnsEnabled(true);
						}
						this.doRandomize(this.myoption);
						for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
							document.getElementsByClassName("ansBtn")[i].classList.remove("disableDiv");
						}
					}
				});
			}
		}
		if (this.categoryA.incorrect.length > 0 || this.categoryB.incorrect.length > 0) {
			this.isWrongAttempted = true;
		}
		this.optionHolder.leftHolder = this.optionHolder.leftHolder_original;
		this.optionHolder.rightHolder = this.optionHolder.rightHolder_original;
	}


	/****** sets clapping timer ********/
	setClappingTimer(feedback) {
		this.clapSound.nativeElement.play();
		$(this.optionsBlock.nativeElement).addClass("disableDiv1");
		this.clapTimer = setTimeout(() => {
			this.clapSound.nativeElement.pause();
			this.clapSound.nativeElement.currentTime = 0;
			this.rightFeedback.nativeElement.play();

		}, 2000);
		this.rightFeedback.nativeElement.onended = () => {
			$(this.optionsBlock.nativeElement).removeClass("disableDiv1");
			for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
				document.getElementsByClassName("ansBtn")[i].classList.remove("disableDiv");
			}
			if (this.selectableOpts > 0) {
				//if (this.categoryA.correct.length != 3 && this.categoryB.correct.length != 3) {
				this.getRandomIndxBlink(this.selectableOpts);
			} else {
				if (this.blinkTimeInterval) {
					clearInterval(this.blinkTimeInterval);
				}
				if (this.categoryA.correct.length == 3 && this.categoryB.correct.length == 3) {
					this.optionsBlock.nativeElement.classList = "bodyContent disableDiv";
					this.showCelebrations();
				}
			}
		}


	}

	showCelebrations() {
		let celebrationsPopup: HTMLElement = this.celebrationsPopup.nativeElement as HTMLElement;
		this.celebrationTimer = setTimeout(() => {
			if (this.rightFeedback && this.rightFeedback.nativeElement) {
				celebrationsPopup.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
				this.rightFeedback.nativeElement.play();
			}
		}, 4000);
		this.rightFeedback.nativeElement.onended = () => {
			this.optionsBlock.nativeElement.className = "optionsBlock";
			this.maincontent.nativeElement.className = "disableDiv";
			this.optionsBlock.nativeElement.className = "optionsBlock disableDiv";
			this.Sharedservice.setShowAnsEnabled(true);
			this.rightTimer = setTimeout(() => {
				this.closePopup('answerPopup');
			}, 10000);
		}
	}
	setTemplateType(): void {
		this.ActivatedRoute.data.subscribe(data => {
			this.Sharedservice.sendData(data);
		})

	}


	clearData(): void {
		// clear message
		this.Sharedservice.clearData();
	}

	closePopup(Type) {
		clearTimeout(this.imageChange);
		this.showAnswerRef.nativeElement.classList = "modal";
		this.celebrationsPopup.nativeElement.classList = "modal";
		this.wrongFeedback.nativeElement.pause();
		this.wrongFeedback.nativeElement.currentTime = 0;
		this.rightFeedback.nativeElement.pause();
		this.rightFeedback.nativeElement.currentTime = 0;
		this.showAnswerfeedback.nativeElement.pause();
		this.showAnswerfeedback.nativeElement.currentTime = 0;
		this.optionHolder.leftHolder = this.optionHolder.leftHolder_original;
		this.optionHolder.rightHolder = this.optionHolder.rightHolder_original;

		if (Type === "answerPopup") {
			this.popupclosedinRightWrongAns = true;
			if (this.ifRightAns) {
				this.Sharedservice.setShowAnsEnabled(true);
				this.overlay.nativeElement.classList.value = "fadeContainer";
				this.blinkOnLastQues();
				if (!this.lastQuestionCheck) {

				} else if (this.lastQuestionCheck) {
					debugger;
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
			if (this.categoryA.correct.length == 3 && this.categoryB.correct.length == 3) {
				this.blinkOnLastQues();
			} else {
				$(this.optionsBlock.nativeElement).removeClass("disableDiv");
				$(this.optionsBlock.nativeElement).removeClass("disableDiv1");
				this.getRandomIndxBlink(this.selectableOpts);
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

	/***** Enable all options and speaker on audio end *******/
	enableAllOptions() {
		for (let i = 0; i < this.optionRef.nativeElement.children.length; i++) {
			if (this.optionRef.nativeElement.children[i].classList.contains("disableDiv")) {
				this.optionRef.nativeElement.children[i].classList.remove("disableDiv");
			}
		}
	}

	/** Function to stop all sounds **/
	stopAllSounds(dragged?) {
		this.audio.pause();
		this.audio.currentTime = 0;

		this.speakerVolume.nativeElement.pause();
		this.speakerVolume.nativeElement.currentTime = 0;

		this.wrongFeedback.nativeElement.pause();
		this.wrongFeedback.nativeElement.currentTime = 0;

		this.rightFeedback.nativeElement.pause();
		this.rightFeedback.nativeElement.currentTime = 0;

		this.clapSound.nativeElement.pause();
		this.clapSound.nativeElement.currentTime = 0;

		this.showAnswerfeedback.nativeElement.pause();
		this.showAnswerfeedback.nativeElement.currentTime = 0;

		if (dragged) {
			this.enableAllOptions();
		}

	}

}
