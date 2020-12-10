import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { Subscription } from 'rxjs';
import { PlayerConstants } from '../../../common/playerconstants';
import { ThemeConstants } from '../../../common/themeconstants';
import { SharedserviceService } from '../../../services/sharedservice.service';
declare const MediaRecorder: any;
declare const navigator: any;
@Component({
	selector: 'app-ntemplate14',
	templateUrl: './ntemplate14.component.html',
	styleUrls: ['./ntemplate14.component.css']
})
export class Ntemplate14Component implements OnInit {

	private appModel: ApplicationmodelService;
	private mediaRecorder: any;
	private chunks: any = [];
	question: any = "";
	quesInfo: any = "";
	isLastQues: boolean = false;
	isAutoplayOn: boolean;
	isLastQuesAct: boolean;
	/*Start: Theme Implementation(Template Changes)*/
	controlHandler = {
		isSubmitRequired: false,
		isReplayRequired: false,
		isShowAns: false
	};
	themePath: any;
	fetchedcontent: any;
	functionalityType: any;
	showAnsTimeout: number;
	/*END: Theme Implementation(Template Changes)*/
	autoplay_text: string = "";
	noOfImgs: number;
	noOfImgsLoaded: number = 0;
	loaderTimer: any;
	common_assets: any = "";
	loadFlag: boolean = false;
	quesObj: any;
	containgFolderPath: string = "";
	isPlay: boolean = false;
	isStop: boolean = true;
	isRecord: boolean = false;
	isRecording: boolean = false;
	curTime: any = 0;
	endTime: any = 0;
	showPlay: boolean = false;
	autoStop: any;
	removeBtn: boolean = true;
	infoModal: boolean = true;
	infoPopupAssets: any;
	tempSubscription: Subscription;
	isFirstTrial: boolean = true;
	showstop = false;
	playClicked = false;
	instructionDisable: boolean = true;
	lastPopUptimer: any;
	@ViewChild('stopButton') stopButton: any;
	@ViewChild('recordButton') recordButton: any;
	@ViewChild('audioT') audioT: any;
	@ViewChild('myAudiohelp') myAudiohelp: any;
	@ViewChild('maincontent') maincontent: any;
	@ViewChild('instruction') instruction: any;
	@ViewChild('narrator') narrator: any;
	@ViewChild('infoModalRef') InfoModalRef: any;
	@ViewChild('feedbackInfoAudio') feedbackInfoAudio: any;



	constructor(appModel: ApplicationmodelService, private Sharedservice: SharedserviceService) {
		this.appModel = appModel;
		// this.assetsfolderlocation = this.appModel.assetsfolderpath;
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
							this.audioT.nativeElement.currentTime = Number.MAX_SAFE_INTEGER;
							this.audioT.nativeElement.ontimeupdate = () => {
								this.audioT.nativeElement.ontimeupdate = null;
								resolve(this.audioT.nativeElement.duration);
								this.audioT.nativeElement.currentTime = 0;
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

	ngOnInit() {
		this.appModel.functionone(this.templatevolume, this);//start end
		this.containgFolderPath = this.getBasePath();
		if (this.appModel.isNewCollection) {
			this.appModel.event = { 'action': 'segmentBegins' };
		}
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
		this.setData();

		this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
			if (mode == "manual") {
				//show modal for manual
			} else if (mode == "auto") {
				if (this.InfoModalRef && this.InfoModalRef.nativeElement) {
					this.InfoModalRef.nativeElement.classList = "displayPopup modal";
					this.feedbackInfoAudio.nativeElement.play();
					this.feedbackInfoAudio.nativeElement.onended = () => {
						console.log("working")
					}
					if (this.appModel.isLastSectionInCollection) {
						//close after 5 mins disable and thn blink
						console.log("will wait 5 mins here")
						this.handleTimer();
					}
					else {
						this.appModel.moveNextQues("noBlink");
					}
				}
			}
		});
		this.appModel.resetBlinkingTimer();
		this.appModel.handleController(this.controlHandler);
	}

	ngAfterViewInit() {
		document.getElementById("audioplay").addEventListener("play", () => {
			this.appModel.stopAllTimer();
			if (!this.instruction.nativeElement.paused) {
				this.instruction.nativeElement.pause();
				this.instruction.nativeElement.currentTime = 0;
			}
		});
		document.getElementById("audioplay").addEventListener("pause", () => {
			if (this.isFirstTrial) {
				this.appModel.moveNextQues("noBlink");
			}
			else {
				this.appModel.moveNextQues();
			}
		});
		document.getElementById("audioplay").addEventListener("ended", () => {
			console.log("enddedd");
			if (this.isFirstTrial && this.playClicked) {
				this.appModel.moveNextQues();
				this.isFirstTrial = false;
			}
		});
	}

	ngAfterViewChecked() {
		this.templatevolume(this.appModel.volumeValue, this);
	}

	ngOnDestroy() {
		this.appModel.stopAllTimer();
		this.appModel.resetBlinkingTimer();
	}

	/****** hover on ok button of info popup ******/
	hoverOK() {
		this.infoPopupAssets.ok_btn = this.infoPopupAssets.ok_btn_hover;
	}

	/****** hover out ok button of info popup ******/
	houtOK() {
		this.infoPopupAssets.ok_btn = this.infoPopupAssets.ok_btn_original;
	}

	/****** hover on close button of info popup ******/
	hoverCloseOk() {
		this.infoPopupAssets.close_btn = this.infoPopupAssets.close_btn_hover;
	}

	/****** hover out close button of info popup ******/
	houtCloseOk() {
		this.infoPopupAssets.close_btn = this.infoPopupAssets.close_btn_original;
	}

	/****** Play Instruction on click of instruction bar ******/
	playInstruction() {
		this.appModel.notifyUserAction();
		if (this.narrator && !this.narrator.nativeElement.paused) {
			console.log("narrator/instruction voice still playing");
		} else {
			console.log("play on Instruction");
			if (this.instruction.nativeElement.paused) {
				this.instruction.nativeElement.currentTime = 0;
				this.instruction.nativeElement.play();

				if (!this.audioT.nativeElement.paused) {
					this.audioT.nativeElement.pause();
				}
				this.instructionDisable = true;
				this.instruction.nativeElement.onended = () => {
					this.instructionDisable = false;
				}
			}
		}
	}

	/****** Set data coming from JSON ******/
	setData() {
		if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
			let fetchedData: any = this.fetchedcontent;
			this.question = fetchedData.ques;
			this.common_assets = fetchedData.commonassets;
			this.isLastQues = this.appModel.isLastSection;
			this.isLastQuesAct = this.appModel.isLastSectionInCollection;
			this.noOfImgs = fetchedData.imgCount;
			this.quesObj = fetchedData.quesObj;
			this.autoStop = fetchedData.autoStop;
			this.infoPopupAssets = fetchedData.info_popup;
		}
	}

	/***** start recording the sound *****/
	startRecording() {
		this.isStop = false;
		this.isRecord = true;
		this.isRecording = true;
		this.showstop = true;
		this.appModel.stopAllTimer();
		if (!this.instruction.nativeElement.paused) {
			this.instruction.nativeElement.pause();
			this.instruction.nativeElement.currentTime = 0;
		}
		this.audioT.nativeElement.pause();
		this.recordButton.nativeElement.src = this.question.recordActive.url;
		if (this.mediaRecorder) {
			this.mediaRecorder.start();
		}
		else {
			console.log("Microphone access is not allowed")
		}
		//this.stopButton.nativeElement.src = this.question.stop.url;
		setTimeout(() => {
			if (!this.isStop) {
				this.stopRecording();
			}
		}, JSON.parse(this.autoStop))
	}

	/****** Play recorded audio on click of Play button ******/
	listen() {
		if (!this.instruction.nativeElement.paused) {
			this.instruction.nativeElement.pause();
			this.instruction.nativeElement.currentTime = 0;
		}
		this.showPlay = false;
		this.isPlay = true;
		this.audioT.nativeElement.currentTime = 0;
		this.appModel.notifyUserAction();
		this.audioT.nativeElement.className = "";
		this.removeBtn = false;
		this.playClicked = true;
		this.audioT.nativeElement.load();
		this.audioT.nativeElement.play();
	}

	/****** Stop recording on click of stop recorder button ******/
	stopRecording() {
		this.isRecording = false;
		this.showstop = false
		this.removeBtn = false;
		this.showPlay = true;
		if (!this.instruction.nativeElement.paused) {
			this.instruction.nativeElement.pause();
			this.instruction.nativeElement.currentTime = 0;
		}
		this.isStop = true;
		this.appModel.notifyUserAction()
		this.stopButton.nativeElement.src = this.question.stopActive.url;
		this.recordButton.nativeElement.src = this.question.record.url;
		this.mediaRecorder.stop();
		this.appModel.moveNextQues("noBlink")
		setTimeout(() => {
			this.audioT.nativeElement.currentTime = 0;
		}, 500)
	}

	close() {
		this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
	}

	handleTimer() {
		this.lastPopUptimer = setTimeout(() => {
			this.blinkOnLastQues();
			this.InfoModalRef.nativeElement.classList = "modal";
			this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div disable-click";

		}, 300000);
	}

	getBasePath() {
		if (this.appModel && this.appModel.content) {
			return this.appModel.content.id + '';
		}
	}

	/****** template volume control *******/
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

	/****** Checking of existance of quesTab in content JSON *******/
	checkquesTab() {
		if (this.fetchedcontent.commonassets.ques_control != undefined) {
			this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
		} else {
			this.appModel.getJson();
		}
	}

	/****** Check if all images are loaded *******/
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
			this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div";
			this.narrator.nativeElement.play();
			this.narrator.nativeElement.onended = () => {
				this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center";
				this.instructionDisable = false;
				this.appModel.handlePostVOActivity(false);
			}
		} else {
			this.appModel.handlePostVOActivity(false);
		}
	}

	/****** function called on click of ok or close button in infopopup *******/
	sendFeedback(ref, flag: string, action?: string) {
		ref.classList = "modal";
		this.feedbackInfoAudio.nativeElement.pause();
		this.feedbackInfoAudio.nativeElement.currentTime = 0;
		this.appModel.handlePostVOActivity(false);
		this.appModel.notifyUserAction();
	}

	/****** Blink functionality of aage badhein button *******/
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

	/****** Function called on time update of audio *******/
	isCalled() {
		console.log("getting it", Math.floor(this.audioT.nativeElement.currentTime))
		console.log("this.audioT.nativeElement.endTime", this.audioT.nativeElement.duration)
		this.curTime = this.convertTostandard(this.audioT.nativeElement.currentTime);
		this.endTime = this.convertTostandard(this.audioT.nativeElement.duration);
	}

	/****** Function to convert time to hh:mm:ss format *******/
	convertTostandard(value) {
		const sec = parseInt(value, 10); // convert value to number if it's string
		let hours: any = Math.floor(sec / 3600); // get hours
		let minutes: any = Math.floor((sec - (hours * 3600)) / 60); // get minutes
		let seconds: any = sec - (hours * 3600) - (minutes * 60); //  get seconds
		// add 0 if value < 10
		if (hours < 10) { hours = "0" + hours; }
		if (minutes < 10) { minutes = "0" + minutes; }
		if (seconds < 10) { seconds = "0" + seconds; }
		return +minutes + ':' + seconds; // Return is HH : MM : SS
	}

}