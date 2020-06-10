import { Component, OnInit, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../model/applicationmodel.service';
import { Subject, Observable, Subscription } from 'rxjs';


declare const MediaRecorder: any;
declare const navigator: any;
import 'jquery';
import { PlayerConstants } from '../common/playerconstants';


declare var $: any;

@Component({
	selector: 'Ntemplate14',
	templateUrl: '../view/layout/Ntemplate14.component.html',
	styleUrls: ['../view/css/Ntemplate14.component.css', '../view/css/bootstrap.min.css']

})

export class Ntemplate14 implements OnInit {

	private appModel: ApplicationmodelService;
	ques_control: any;
	private mediaRecorder: any;
	private chunks: any = [];
	helpbtnUrl: any = "assets/images/help.svg";
	helpbtnHoverUrl: any = "assets/images/help_hover.svg";
	disableHelpBtn: boolean = false;
	currentIdx = 0;
	assetspath: any;
	blink: boolean = false;
	showIntroScreen: boolean;
	bool: boolean = false;
	timernextseg: any = "";
	question: any = "";
	Instruction: any = "";
	quesInfo: any = "";
	isFirstQues: boolean;
	isLastQues: boolean = false;
	isAutoplayOn: boolean;
	isLastQuesAct: boolean;
	autoplay_text: string = "";
	resizeFlag: boolean = false;
	noOfImgs: number;
	noOfImgsLoaded: number = 0;
	loaderTimer: any;
	assetsfolderlocation: string = "";
	common_assets: any = "";
	hasEventFired: boolean = false;
	loadFlag: boolean = false;
	quesObj: any;
	containgFolderPath: string = "";
	isPlay: boolean = false;
	isStop: boolean = true;
	isRecord: boolean = false;
	isRecording: boolean = false;
	controlHandler = {
		isShowAns: false,
	};
	curTime:any = 0;
	endTime:any = 0;
	showPlay: boolean = false;
	autoStop: any;
	removeBtn: boolean = true;
	infoModal: boolean = true;
	infoPopupAssets: any;
	tempSubscription: Subscription;
	isFirstTrial: boolean = true;
	showstop = false;
	playClicked = false;
	@ViewChild('playpause') playpause: any;
	@ViewChild('stopButton') stopButton: any;
	@ViewChild('recordButton') recordButton: any;
	@ViewChild('audioT') audioT: any;
	@ViewChild('narrator_voice') narrator_voice: any;
	@ViewChild('myAudiohelp') myAudiohelp: any;
	@ViewChild('titleNavBtn') titleNavBtn: any;
	@ViewChild('container') containerBlock: any;
	@ViewChild('fireworks') fireworks: any;
	@ViewChild('ansBlock') ansBlock: any;
	@ViewChild('helpbtn') helpbtn: any;
	@ViewChild('sprite') sprite: any;
	@ViewChild('speakerNormal') speakerNormal: any;
	@ViewChild('navBlock') navBlock: any;
	@ViewChild('buzzerSound') buzzerSound: any;
	@ViewChild('titleAudio') titleAudio: any;
	@ViewChild('autoPlayOnOffContainer') autoPlayOnOffContainer: any;
	@ViewChild('maincontent') maincontent: any;
	@ViewChild('instruction') instruction: any;
	@ViewChild('narrator') narrator: any;
	@ViewChild('feedbackModal') feedbackModal: any;
	@ViewChild('infoModalRef') InfoModalRef: any;



	constructor(appModel: ApplicationmodelService) {

		this.appModel = appModel;
		this.assetsfolderlocation = this.appModel.assetsfolderpath;
		this.appModel.navShow = 2;
		this.appModel.setLoader(true);
		// if error occured during image loading loader wil stop after 5 seconds 
		this.loaderTimer = setTimeout(() => {
			this.appModel.setLoader(false);
		}, 5000);
		this.appModel.handleController(this.controlHandler);
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



		const onSuccess = stream => {
			this.mediaRecorder = new MediaRecorder(stream);
			this.mediaRecorder.onstop = e => {
				//const audio = new Audio();
				const blob = new Blob(this.chunks, { 'type': 'audio/ogg; codecs=opus' });
				//this.chunks.length = 0;
				const durationP = new Promise(resolve =>
					this.audioT.nativeElement.addEventListener('loadedmetadata', () => {
						// Chrome bug: https://bugs.chromium.org/p/chromium/issues/detail?id=642012
						if (this.audioT.nativeElement.duration === Infinity) {
							this.audioT.nativeElement.currentTime = Number.MAX_SAFE_INTEGER
							this.audioT.nativeElement.ontimeupdate = () => {
								this.audioT.nativeElement.ontimeupdate = null
								resolve(this.audioT.nativeElement.duration)
								this.audioT.nativeElement.currentTime = 0
							}
						}
						// Normal behavior
						else
							resolve(this.audioT.nativeElement.duration)
					})
				)
				durationP.then(function (duration) {
					console.log("duration:", duration + ' seconds');
				});


				this.audioT.nativeElement.src = window.URL.createObjectURL(blob);

				//console.log("length:::",this.audioT.nativeElement.src);



			};

			this.mediaRecorder.ondataavailable = e => this.chunks.push(e.data);
		};

		navigator.getUserMedia = (navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia ||
			navigator.msGetUserMedia);

		navigator.getUserMedia({ audio: true }, onSuccess, e => console.log(e));
	}


	get basePath(): any {
		console.log('temponeComponent: path=', this.appModel.content.id + '/' + this.appModel.content.contentData.data['path']);
		if (this.appModel && this.appModel.content) {

			return this.appModel.content.id + '';
		}
	}

	playInstruction() {
		this.appModel.notifyUserAction();
		if (this.narrator && !this.narrator.nativeElement.paused) {
			console.log("narrator/instruction voice still playing");
		} else {
			console.log("play on Instruction");
			if (this.instruction.nativeElement.paused) {
				this.instruction.nativeElement.currentTime = 0;
				this.instruction.nativeElement.play();

				if(	!this.audioT.nativeElement.paused){
					this.audioT.nativeElement.pause();
				}
				this.instruction.nativeElement.onended = () => {
					$("#ansBlock .options").removeClass("disable_div");
					$("#ansBlock").css("pointer-events", 'auto');
				}
				$(".instructionBase img").css("cursor", "pointer");
				// $("#ansBlock .options").addClass("disable_div");
				// $("#ansBlock").css("pointer-events", 'none');
			}

		}
	}



	setData() {
		if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
			let fetchedData: any = this.appModel.content.contentData.data;
			this.ques_control = fetchedData.commonassets.ques_control;
			this.question = fetchedData.ques;
			this.common_assets = fetchedData.commonassets;
			this.isFirstQues = fetchedData.isFirstQues;
			this.isLastQues = this.appModel.isLastSection;
			this.isLastQuesAct = this.appModel.isLastSectionInCollection;
			this.noOfImgs = fetchedData.imgCount;
			this.quesObj = fetchedData.quesObj;
			this.autoStop = fetchedData.autoStop;
			console.log("this.autoStop", this.autoStop)
			this.infoPopupAssets = fetchedData.info_popup;
			console.log("this.isLastQuesAct",this.isLastQuesAct)
			console.log("this.isLastQues",this.isLastQues)
			//this.isAutoplayOn = this.appModel.autoPlay;
			if (fetchedData) {

			}
			setTimeout(() => {
				if (this.navBlock && this.navBlock.nativeElement) {
					this.navBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around";
				}
			}, 200)
		} else {

		}


	}
	onHoverhelp(option) {
		//console.log("in",option);


		option.help = option.helphover;
		this.helpbtn.nativeElement.className = "pointer";

	}

	onHoverouthelp(option) {
		//console.log("out",option);
		option.help = option.helpOriginal;

	}
	hoverOK() {
		this.infoPopupAssets.ok_btn = this.infoPopupAssets.ok_btn_hover;
	}

	houtOK() {
		this.infoPopupAssets.ok_btn = this.infoPopupAssets.ok_btn_original;
	}

	hoverCloseOk() {
		this.infoPopupAssets.close_btn = this.infoPopupAssets.close_btn_hover;
	}
	houtCloseOk() {
		this.infoPopupAssets.close_btn = this.infoPopupAssets.close_btn_original;
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
	helpSpeaker(el: HTMLAudioElement) {

		el.pause();
		el.currentTime = 0;
		el.play();
		if (this.maincontent) {
			this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div";
		}
		el.onended = () => {
			if (this.maincontent) {
				this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center";
			}
		}
	}

	//strats recording the sound
	startRecording() {
		this.isStop = false;
		this.isRecord = true;
		this.isRecording =true;
		this.showstop = true;
		this.appModel.stopAllTimer()
		if (!this.instruction.nativeElement.paused) {
			this.instruction.nativeElement.pause();
			this.instruction.nativeElement.currentTime = 0;
		}
		this.disableHelpBtn = true;
		this.audioT.nativeElement.pause();
		this.recordButton.nativeElement.src = this.question.recordActive.url;
		if (this.mediaRecorder){
			this.mediaRecorder.start();
		}
		else{
			console.log("Microphone access is not allowed")
		}
		//this.stopButton.nativeElement.src = this.question.stop.url;
		setTimeout(() => {
			if (!this.isStop) {
				this.stopRecording();
			}
		}, JSON.parse(this.autoStop))
	}

	listen() {
		if (!this.instruction.nativeElement.paused) {
			this.instruction.nativeElement.pause();
			this.instruction.nativeElement.currentTime = 0;
		}
		this.showPlay= false;
		this.isPlay = true;
		//this.audioT.nativeElement.currentTime=0;
		this.appModel.notifyUserAction()
		this.audioT.nativeElement.className = "";
		this.removeBtn = false;
		this.playClicked = true;
		//this.playpause.nativeElement.className = "img-fluid playbtn";
		// this.stopButton.nativeElement.className = "displayNone";
		// this.recordButton.nativeElement.className = "displayNone";
		this.audioT.nativeElement.load();
		this.audioT.nativeElement.play();

	}

	stopRecording() {
		this.isRecording =false;
		this.showstop= false
		this.removeBtn = false;
		this.showPlay =true;
		if (!this.instruction.nativeElement.paused) {
			this.instruction.nativeElement.pause();
			this.instruction.nativeElement.currentTime = 0;
		}
		this.isStop = true;
		this.appModel.notifyUserAction()
		this.stopButton.nativeElement.src = this.question.stopActive.url;
		this.recordButton.nativeElement.src = this.question.record.url;
		// this.playpause.nativeElement.className = "img-fluid";
		this.mediaRecorder.stop();
		this.appModel.moveNextQues("noBlink")
	}

	checkNextActivities() {

		this.removeEvents();
		if (!this.appModel.autoPlay && !this.isLastQues && this.isLastQuesAct) {
			this.blink = true;
		}
		if ((this.appModel.autoPlay && !this.isLastQues) || !((this.isLastQuesAct)) || ((this.isLastQuesAct && this.appModel.autoPlay && !this.isLastQues))) {
			this.next();
		} else {

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


	removeEvents() {
		// remove event handlers for all clickable items in the dom
		this.blink = false;
		clearTimeout(this.timernextseg);
	}

	close() {
		//this.appModel.event = { 'action': 'exit', 'currentPosition': this.currentVideoTime };
		this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
	}

	reset() {
		// will reset all what user performed
		if (this.audioT && this.audioT.nativeElement) {
			this.audioT.nativeElement.pause();
		}

		if (this.myAudiohelp && this.myAudiohelp.nativeElement)
			this.myAudiohelp.nativeElement.pause();
	}

	closeTitleScreen() {
		this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeOutAnimation";
		setTimeout(() => {
			this.showIntroScreen = false;
			this.next();
		}, 200)
	}

	lastPopUptimer: any;
	handleTimer(){
		console.log("heeree in")
		let that = this
		 this.lastPopUptimer = setTimeout(() => {
			 console.log("here also");
			 that.blinkOnLastQues();
			 that.InfoModalRef.nativeElement.classList = "modal";
			 that.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div disable-click";

		}, 300000)
	}

	ngOnInit() {
		let that = this;
		$("#navBlock").click(function () {
			if (!that.instruction.nativeElement.paused) {
				that.instruction.nativeElement.pause();
				that.instruction.nativeElement.currentTime = 0;
			}
		});
		this.assetspath = this.basePath;
		this.appModel.functionone(this.templatevolume, this);//start end
		this.containgFolderPath = this.getBasePath();
		/*window.onresize = (e) =>{
		 this.resizeContainer();
		}*/
		if (this.appModel.isNewCollection) {
			//console.log("chck:",this.appModel.isNewCollection);
			this.appModel.event = { 'action': 'segmentBegins' };
		}
		let fetchedData: any = this.appModel.content.contentData.data;
		this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
		console.log("init:", this.appModel.content.contentData.data);
		if (fetchedData.titleScreen) {
			this.showIntroScreen = true;
			this.quesInfo = fetchedData;
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

		this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
			if (mode == "manual") {
				//show modal for manual

				//   if (this.popupRef && this.popupRef.nativeElement) {
				// 	$("#instructionBar").addClass("disable_div");
				// 	this.popupRef.nativeElement.classList = "displayPopup modal";
				//   }
			} else if (mode == "auto") {
				if (this.InfoModalRef && this.InfoModalRef.nativeElement ) {
					$("#instructionBar").addClass("disable_div");
					this.InfoModalRef.nativeElement.classList = "displayPopup modal";					//this.appModel.enableReplayBtn(true);
					//this.setFeedbackAudio();
					if(this.appModel.isLastSectionInCollection)
					{
						//close after 5 mins disable and thn blink
						console.log("will wait 5 mins here")
						this.handleTimer()
					}
					else{
					this.appModel.moveNextQues("noBlink");
					}
				
					}
				

			}
		})
		this.appModel.resetBlinkingTimer();
	}

	ngAfterViewInit(){
		let that = this;
		
		document.getElementById("audioplay").addEventListener("play",function(){
			that.appModel.stopAllTimer();
			if (!that.instruction.nativeElement.paused) {
				that.instruction.nativeElement.pause();
				that.instruction.nativeElement.currentTime = 0;
			}
		});
		document.getElementById("audioplay").addEventListener("pause",function(){
			if (that.isFirstTrial){
				that.appModel.moveNextQues("noBlink");
			}
			else{
				that.appModel.moveNextQues();
			}
		});

		document.getElementById("audioplay").addEventListener("ended",function(){
			if(that.isFirstTrial && that.playClicked){
				that.appModel.moveNextQues();
				that.isFirstTrial  = false;
			}
			//that.appModel.notifyUserAction();
		});

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
		if (obj.instruction && obj.instruction.nativeElement) {
			obj.instruction.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.audioT && obj.audioT.nativeElement) {
			obj.audioT.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
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
			//this.appModel.handlePostVOActivity(true);
			this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div";
			this.narrator.nativeElement.play();
			this.narrator.nativeElement.onended = () => {
				this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center";
				this.appModel.handlePostVOActivity(false);
				//this.appModel.moveNextQues('forwarding')
			}
		} else {
			this.appModel.handlePostVOActivity(false);
			//this.appModel.moveNextQues('forwarding')
		}
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

	openModal() {
		this.feedbackModal.nativeElement.classList = "modal displayPopup";
		this.infoModal = false;
	}

	sendFeedback(ref, flag: string, action?: string) {
		ref.classList = "modal";
		this.appModel.handlePostVOActivity(false);
		this.appModel.notifyUserAction();
	}

	ngOnDestroy() {
		this.appModel.stopAllTimer();
		this.appModel.resetBlinkingTimer();	
	  }

	  blinkOnLastQues(type?) {
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
			this.appModel.moveNextQues(type);
		}
	}

	isCalled(){
		console.log("getting it",Math.floor(this.audioT.nativeElement.currentTime))
		console.log("this.audioT.nativeElement.endTime",this.audioT.nativeElement.duration)
		this.curTime = this.convertTostandard(this.audioT.nativeElement.currentTime)
		this.endTime = this.convertTostandard(this.audioT.nativeElement.duration)
	}

	convertTostandard(value){
			const sec = parseInt(value, 10); // convert value to number if it's string
			let hours:any   = Math.floor(sec / 3600); // get hours
			let minutes:any = Math.floor((sec - (hours * 3600)) / 60); // get minutes
			let seconds:any = sec - (hours * 3600) - (minutes * 60); //  get seconds
			// add 0 if value < 10
			if (hours   < 10) {hours   = "0"+hours;}
			if (minutes < 10) {minutes = "0"+minutes;}
			if (seconds < 10) {seconds = "0"+seconds;}
			return +minutes+':'+seconds; // Return is HH : MM : SS
	}
}
