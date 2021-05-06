import { Component , OnInit ,HostListener ,ViewChild } from '@angular/core';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { PlayerConstants } from '../../../common/playerconstants';
import 'jquery';
declare var $: any;
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-template16',
  templateUrl: './template16.component.html',
  styleUrls: ['./template16.component.scss']
})
export class Template16Component implements OnInit {
	public appModel: ApplicationmodelService;
	private sanitizer: any;
	constructor(appModel: ApplicationmodelService, sanitizer: DomSanitizer) {
		this.appModel = appModel;
		this.sanitizer = sanitizer;
		this.assetsPath = this.appModel.assetsfolderpath;
		this.appModel.navShow = 0;
		this.appModel.setLoader(true);
		// if error occured during image loading loader wil stop after 5 seconds 
		this.loaderTimer = setTimeout(() => {
			this.appModel.setLoader(false);
		}, 5000)

		this.appModel.notification.subscribe(
			(data) => {
				console.log('VideoComponent: constructor - data=', data);
				switch (data) {
					case PlayerConstants.CMS_PLAYER_PLAY:
						console.log('VideoComponent: constructor - cmsPlayerPlay');
						this.playVideo();
						break;

					case PlayerConstants.CMS_PLAYER_PAUSE:
						console.log('VideoComponent: constructor - cmsPlayerPause');
						this.pauseVideo();
						break;

					case PlayerConstants.CMS_PLAYER_CLOSE:
                    console.log('VideoComponent: constructor - cmsPlayerClose');
                    this.close();
						break;

					default:
						console.log('VideoComponent: constructor - default');
						break;
				}
			}
		);
	}
	@ViewChild('container') containerBlock: any;
	@ViewChild('titleNavBtn') titleNavBtn: any;
	@ViewChild('helpBtn') helpBtn: any;
	@ViewChild('titleAudio') titleAudio: any;
	@ViewChild('titleHelpAudio') titleHelpAudio: any;
	@ViewChild('navBlock') navBlock: any;
	@ViewChild('autoPlayOnOffContainer',{static: true}) autoPlayOnOffContainer: any;
	@ViewChild('sliderRef') sliderRef: any;
	@ViewChild('volumeBar') volumeBar: any;
	@ViewChild('MuteVar') MuteVar: any;
	@ViewChild('rangeSliderRef') rangeSliderRef: any;
	@ViewChild('volumeContainer') volumeContainer: any;
	@ViewChild('scannedImg') scannedImg: any;
	@ViewChild('concludeAudio') concludeAudio: any;
	@ViewChild('disableRange') disableRange: any;
	@ViewChild('container') container: any;
	@ViewChild('posTest') posTest: any;

	@HostListener('document:click', ['$event'])
	clickout(event) {
		if (!this.volumeContainer.nativeElement.contains(event.target)) {
			this.displayVolume = false;
		}
	}

	audio = new Audio();
	blink: boolean = false;
	currentIdx = 0;
	quesInfo: any = "";
	question: any = "";
	questionArray: any = [];
	feedback: any = "";
	isLastActivity: any = "";
	bool: boolean = false;
  showIntroScreen: boolean;

	helpAudio: any = "";
	idArray: any = [];
	isFirstQues: boolean;
	isLastQues: boolean = false;
	isAutoplayOn: boolean;
	isLastQuesAct: boolean;

	noOfImgs: number;
	noOfImgsLoaded: number = 0;
	loaderTimer: any;
	disableHelpBtn: boolean = false;
	containgFolderPath: string = "";
	assetsPath: string = "";
	loadFlag: boolean = false;
	isPlaying: boolean = true;
	progressValue: number = 0;
	timeDuration: number;
	currentTime: number = 0;
	time = PlayerConstants.TIME_FORMAT;
	displayVolume: boolean = false;
	tooltipValue: any;
	isDrag: boolean = false;
	safeStyle: SafeStyle;

	volumeIcon: any = "";
	volumeMute: any = "";
	volumeBtn: any = "";
	timer: any;
	timeVar: any;
	videoEnded: boolean = false;
	timeArray: any = [];
	timeCover: number = 0;
	questionNumber: number = 0;
	concludeSound: any;
	//soundPlayed:boolean = false;
	videoPlayedTime: any = 0;
	isForwardEnabled: boolean = true;
	videoProgress: any;
	timeInterval: any = 10;
	root: any = document.documentElement;
	zarriRakheinBtn: any = null;
	seekedFlag: boolean = false;
	lastPauseAt: number = -1;
	pauseTimesArry: number[] = [];
	displaySpecial: boolean = false;
	pauseBtn: any;
	fadeOutFlag: boolean = false;
	hasEventFired:boolean = false;

	onHoverContinuousBtn() {
		this.zarriRakheinBtn = this.quesInfo.nextbtn_graphic_hover;
	}
	onLeaveContinuousBtn() {
		this.zarriRakheinBtn = this.quesInfo.nextbtn_graphic_original;
	}


	ngAfterViewChecked() {
		if (this.titleAudio && this.titleAudio.nativeElement) {
			this.titleAudio.nativeElement.onended = () => {
				this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeInAnimation";
			}
		}
		this.templatevolume(this.appModel.volumeValue, this);
		this.setDynamicCss();
	}


	// next function
	next() {
		if(!this.hasEventFired){
			if(this.isLastQuesAct){
				this.hasEventFired = true;
				this.appModel.event = {'action': 'segmentEnds'};
			}
			if(this.isLastQues){
				this.appModel.event = {'action': 'end'};	
			}
		}

		if (!this.isLastQues) { 

			//this.currentIdx = this.appModel.currentSection-1;
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
		if (this.titleHelpAudio && this.titleHelpAudio.nativeElement) {
			this.titleHelpAudio.nativeElement.pause();
			this.titleHelpAudio.nativeElement.currentTime = 0;
			this.titleHelpAudio.nativeElement.play();
			this.titleHelpAudio.nativeElement.onended = () => {
			}
		}
	}
	checkAnswer(opt, index) {

	}

	removeEvents() {

	}
	isPaused() {
		return this.audio.paused;
	}

	doRandomize(array) {

	}

	ngOnInit() {
		this.appModel.functionone(this.templatevolume, this);
		if (this.appModel.isNewCollection) {
			this.appModel.event = { 'action': 'segmentBegins' };
		}
		let fetchedData: any = this.appModel.content.contentData.data;
		this.containgFolderPath = this.getBasePath();
		if (fetchedData.titleScreen) {
			this.quesInfo = fetchedData;
			this.noOfImgs = this.quesInfo.imgCount;
		} else {
			this.isForwardEnabled = this.appModel.getforwardEnableFlag();
			console.log(this.isForwardEnabled);
			this.setData();
		}

		this.setDynamicCss();
		/*window.onresize = (e) => {
			this.setDynamicCss();
		}*/
		this.appModel.getAutoPlay().subscribe((flag) =>{
     if(flag){
       this.autoPlayOnOffContainer.nativeElement.classList="col-sm-1 hideAutoplay";
     }else{
       this.autoPlayOnOffContainer.nativeElement.classList="col-sm-1";
     }
   })
	}

	ngOnDestroy(){
		this.appModel.setLoader(false);
		this.question = "";
		this.feedback = "";
		this.quesInfo = "";
		clearInterval(this.timer);
		this.fadeOutFlag = false;
		this.displaySpecial = false;
		this.questionArray = [];
		this.timeDuration = undefined;
		this.currentTime = 0;
		this.timeArray = [];
		this.timeCover = 0;
		this.questionNumber= 0;
		this.videoPlayedTime = 0;
		if(this.scannedImg && this.scannedImg.nativeElement && this.scannedImg.nativeElement.children[0] && this.scannedImg.nativeElement.children[0].src){
			this.scannedImg.nativeElement.children[0].src = "";
		}
		if(this.container && this.container.nativeElement && this.container.nativeElement.children[1]){
			this.container.nativeElement.children[1].classList="scannedImgOuter d-flex align-items-center justify-content-center redBg";
		}
    }

	setDynamicCss() {
		let customeHeight: any = window.outerWidth / 200;
		if(customeHeight == 0) {
			customeHeight = window.innerWidth / 200;
		}
		this.root.style.setProperty('--sliderHeight', customeHeight + 'px');
		this.root.style.setProperty('--thumbMessurement', customeHeight * 2 + 'px');
	}


	templatevolume(vol, obj) {
		if (obj.concludeAudio && obj.concludeAudio.nativeElement) {
			obj.concludeAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.audio) {
			obj.audio.volume = obj.appModel.isMute ? 0 : vol;
		}
	}

	setData() {
		/*
			let navTimer = setInterval(() =>{
				if(this.navBlock && this.navBlock.nativeElement){
					clearInterval(navTimer);
					setTimeout(()=>{
					if(this.navBlock && this.navBlock.nativeElement){
						this.navBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around"
					}
				},500)
				}
			},100)
			**/
		if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
			let fetchedData: any = this.appModel.content.contentData.data;
			console.log(fetchedData);
			this.questionArray = fetchedData.ques;
			//this.question = this.questionArray[0];
			this.feedback = fetchedData.feedback;
			this.quesInfo = fetchedData.commonassets;
			this.concludeSound = fetchedData.soundConclude;
			this.pauseTimesArry = fetchedData.pauseTimes;

			this.volumeIcon = this.quesInfo.volume_graphic;
			this.volumeMute = this.quesInfo.mute_graphic;
			this.volumeBtn = this.quesInfo.volume_graphic;
			this.isFirstQues = this.quesInfo.isFirstQues;
			this.isLastQues = this.appModel.isLastSection;
			this.isLastQuesAct = this.appModel.isLastSectionInCollection;
			//this.isAutoplayOn = this.appModel.autoPlay;
			this.noOfImgs = this.quesInfo.imgCount;
			this.setTimeZone();
			this.setQuestion();
			//this.timeDuration = this.quesInfo.durationInSecond;
			/*this.timer  = setInterval(()=>{
			  if(this.sliderRef.nativeElement && (parseFloat((this.currentTime + 0.01).toFixed(3))<=this.timeDuration) && this.isPlaying && !this.isDrag){
				  let remainingTime = this.timeDuration - this.currentTime;
				  this.time = this.convertTimeFormat(remainingTime) + '/' +this.convertTimeFormat(this.timeDuration);
				  this.currentTime = parseFloat((this.currentTime + (timeInterval/1000)).toFixed(3));
				  this.progressValue = (this.currentTime/this.timeDuration)*100;
			  }else if(this.progressValue>99.99){
				  clearInterval(this.timer);
				  this.isPlaying = false;
			  }
			},timeInterval)
			*/

		} else {
			this.question = "";
			this.feedback = "";
			this.quesInfo = "";
		}

	}

	startActivityFrom(startTime) {
		this.seekbarSeeked(undefined, startTime);
	}

	/*	setQuestion(){
			for(let i in this.timeArray){
				if(this.currentTime > this.timeCover){
					this.question = this.questionArray[this.questionNumber];
					this.timeCover =+ this.questionArray[i].durationTime;
					break;
				}else{
					if(this.currentTime==0){
						this.question = this.questionArray[this.questionNumber];
						if(this.questionNumber < this.timeArray.length-1){
							this.questionNumber++;
						}
						break;
					}
				}
			}
		}
		*/
	setQuestion() {
		if (this.currentTime > this.timeCover) {
			this.question = this.questionArray[this.questionNumber];
			if (this.scannedImg && this.scannedImg.nativeElement) {
				this.scannedImg.nativeElement.className = "scannedImg fadeInAnimation";
			}
			this.timeCover = this.timeArray[this.questionNumber];
			if (this.questionNumber < this.timeArray.length - 1) {
				this.questionNumber++;
			} else {

			}
		} else {
			if (this.currentTime == 0) {
				this.question = this.questionArray[this.questionNumber];
				if (this.scannedImg && this.scannedImg.nativeElement) {
					this.scannedImg.nativeElement.className = "scannedImg fadeInAnimation";
				}
				if (this.questionNumber < this.timeArray.length - 1) {
					this.questionNumber++;
				}
			} else {
			}
		}
	}


	setTimeZone() {
		for (let i = 0; i < this.questionArray.length; i++) {
			let j = i;
			let num = 0;
			while ((j == 0) || (j > 0)) {
				num += this.questionArray[j].durationTime;
				j--
			}
			this.timeArray.push(num);
		}
		this.timeCover = this.timeArray[0];
		if (this.concludeSound && this.concludeSound.soundExist) {
			let audioTagReady = setInterval(() => {
				if (this.concludeAudio && this.concludeAudio.nativeElement && this.concludeAudio.nativeElement.duration) {
					this.timeDuration = this.timeArray[this.timeArray.length - 1] + parseInt((this.concludeAudio.nativeElement.duration).toFixed(0));
					clearInterval(audioTagReady);

					if (this.appModel.initVal) {
						this.startActivityFrom(parseInt(this.appModel.initVal + ""));
					} else {
						this.timer = setInterval(() => {
							this.testProgress()
						}, 10);
					}
				}
			}, 50)
		} 
		else if(this.concludeSound && !this.concludeSound.soundExist){
			this.timeDuration = this.timeArray[this.timeArray.length - 1];
			if (this.appModel.initVal) {
					this.startActivityFrom(parseInt(this.appModel.initVal + ""));
				}else{
					this.timer = setInterval(() => {
						this.testProgress()
					}, 10);
				}
		}
	}

	testProgress() {
		if (this.sliderRef.nativeElement && this.isPlaying && !this.isDrag && this.progressValue < 100) {
			let remainingTime = this.timeDuration - this.currentTime;
			this.time = this.convertTimeFormat(remainingTime) + ' / ' + this.convertTimeFormat(this.timeDuration);
			this.currentTime = this.timeDuration > parseFloat((this.currentTime + (this.timeInterval / 1000)).toFixed(3)) ? parseFloat((this.currentTime + (this.timeInterval / 1000)).toFixed(3)) : this.timeDuration;

			if ((this.pauseTimesArry.indexOf(Math.floor(this.currentTime)) != -1) && this.lastPauseAt != Math.floor(this.currentTime)) {
				this.displaySpecial = true;
				this.fadeOutFlag = false;
				this.pauseBtn = this.quesInfo.nextbtn_graphic;
				this.isPlaying = false;
				this.lastPauseAt = Math.floor(this.currentTime);
				clearInterval(this.timer);
			}

			if ((Math.floor(this.currentTime) == this.timeArray[this.questionNumber - 1] - 1) || (Math.floor(this.currentTime) == this.timeArray[this.timeArray.length - 1] - 1)) {
				if (this.scannedImg && this.scannedImg.nativeElement) {
					this.scannedImg.nativeElement.className = "scannedImg fadeOutAnimation";
				}
			}
			this.progressValue = 100 >= (this.currentTime / this.timeDuration) * 100 ? (this.currentTime / this.timeDuration) * 100 : 100;
			//this.videoPlayedTime = this.videoPlayedTime > this.progressValue ? this.videoPlayedTime: this.progressValue;
			if (!this.isForwardEnabled) {
				this.videoPlayedTime = this.videoPlayedTime > this.currentTime ? this.videoPlayedTime : this.currentTime;
				this.videoProgress = (this.videoPlayedTime / this.timeDuration) * 100;
				this.disableRange.nativeElement.style.left = (this.videoPlayedTime / this.timeDuration) * 100 + "%";
				this.disableRange.nativeElement.style.width = (100 - this.progressValue) + "%";
			} else if (this.isForwardEnabled) {
				this.videoProgress = this.progressValue;
			}

			// this.disableRange.nativeElement.style.left = (this.videoPlayedTime/this.timeDuration)*100 +"%";

			; if (this.currentTime < this.timeArray[this.timeArray.length - 1]) {
				this.setQuestion();
			} else {
				//this.scannedImg.nativeElement.className="scannedImg fadeOutAnimation";
				/*
				if(!this.soundPlayed){
					this.soundPlayed = true;
					if(this.concludeAudio && this.concludeAudio.nativeElement){
						this.concludeAudio.nativeElement.play();
					}
				}
				*/
				if (this.concludeSound && this.concludeSound.soundExist) {
					this.setConcludeSound();
				}
			}
		} else if (this.progressValue == 100) {
			if (this.scannedImg && this.scannedImg.nativeElement) {
				//this.scannedImg.nativeElement.className="scannedImg fadeOutAnimation";
			}
			this.videoEnded = true;
			clearInterval(this.timer);
			this.isPlaying = false;
			this.checkNextActivities();
		}
	}

	setConcludeSound() {
		//if(!this.soundPlayed){
		//this.soundPlayed = true;
		if (this.concludeAudio && this.concludeAudio.nativeElement) {
			this.concludeAudio.nativeElement.play();
			this.concludeAudio.nativeElement.onended = () => {
				this.concludeAudio.nativeElement.pause();
				this.concludeAudio.nativeElement.currentTime = 0;
				//this.soundPlayed = false;
			}
		}
		//}
	}

	checkNextActivities() {
		if (this.concludeAudio && this.concludeAudio.nativeElement) {
			this.concludeAudio.nativeElement.pause();
			this.concludeAudio.nativeElement.currentTime = 0;
		}
		let autoPlay = this.appModel.isAutoPlay();
		if (autoPlay) {
			this.next();
		} else {
			if(!this.hasEventFired){
				if(this.isLastQuesAct){
					this.hasEventFired = true;
					this.appModel.event = {'action': 'segmentEnds'};
				}
				if(this.isLastQues){
					this.appModel.event = {'action': 'end'};	
				}
			}
		}
	}

	checkImgLoaded() {
		if (!this.loadFlag) {
			this.noOfImgsLoaded++;
			if (this.noOfImgsLoaded >= this.noOfImgs) {
				this.appModel.setLoader(false);
				this.loadFlag = true;
				clearTimeout(this.loaderTimer);

				if (this.appModel) {
					let autoPlay = this.appModel.isAutoPlay();
					if (autoPlay) {
						if (this.autoPlayOnOffContainer && this.autoPlayOnOffContainer.nativeElement && this.autoPlayOnOffContainer.nativeElement.children[0]) {
							this.autoPlayOnOffContainer.nativeElement.children[0].children[1].checked = true;
							this.isAutoplayOn = true;
							this.appModel.updateAutoPlay(true);
						}
					} else {
						if (this.autoPlayOnOffContainer && this.autoPlayOnOffContainer.nativeElement && this.autoPlayOnOffContainer.nativeElement.children[0]) {
							this.autoPlayOnOffContainer.nativeElement.children[0].children[1].checked = false;
							this.isAutoplayOn = false;
							this.appModel.updateAutoPlay(false);
						}
					}
					let isMute = this.appModel.isMute;
					if (isMute) {
						this.volumeBtn = this.volumeMute;
					} else if (!isMute) {
						this.volumeBtn = this.volumeIcon;
					}
				}
			}
		}
	}

	getBasePath() {
		if (this.appModel && this.appModel.content) {
			return this.appModel.content.id + '';
		}
	}

	updatePlay() {
		this.isPlaying ? this.pauseVideo() : this.playVideo();
		if (this.isPlaying) {
			if (this.progressValue == 100) {
				let autoPlay = this.appModel.isAutoPlay();
				//if((this.appModel.autoPlay && !this.isLastQues) || !((this.isLastQuesAct)) ||((this.isLastQuesAct && this.appModel.autoPlay && !this.isLastQues))){
				if (!autoPlay || this.isLastQues) {
					this.currentTime = 0;
					this.progressValue = 0;
					this.isPlaying = true;
					this.questionNumber = 0;
					this.timeCover = this.timeArray[this.questionNumber];
					this.setQuestion();
					if (this.scannedImg && this.scannedImg.nativeElement) {
						this.scannedImg.nativeElement.className = "scannedImg fadeInAnimation";
					}
					clearInterval(this.timer);
					if (this.zarriRakheinBtn != null) {
						this.zarriRakheinBtn = null;
					}
					this.timer = setInterval(() => {
						this.testProgress();
					}, 10);
				} else {
					this.checkNextActivities();
				}
			} else {
				this.isPlaying = true;
				clearInterval(this.timer);
				this.timer = setInterval(() => {
					this.testProgress();
				}, 10);

				this.fadeOutFlag = true;
				setTimeout(() => {
					this.fadeOutFlag = false;
					this.displaySpecial = false;
				}, 300)
			}
			if (this.concludeAudio && this.concludeAudio.nativeElement && this.currentTime > this.timeArray[this.timeArray.length - 1]) {
				//if(this.concludeAudio.nativeElement.currentTime!=0){
				this.concludeAudio.nativeElement.play();
				//}
			}
		} else {
			clearInterval(this.timer);
			if (this.concludeAudio && this.concludeAudio.nativeElement && !this.concludeAudio.nativeElement.paused) {
				this.concludeAudio.nativeElement.pause();
			}
		}
	}

	private playVideo() {
		this.appModel.event = { 'action': 'play' };
		this.isPlaying = true;
	}

	private pauseVideo() {
		this.isPlaying = false;
		this.appModel.event = { 'action': 'pause', 'time': new Date().getTime(), 'currentPosition': Math.floor(this.currentTime) };
  }

  close() {
    this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': Math.floor(this.currentTime) };
  }

	showValueOnTooltip(event) {
		let calValue = (this.timeDuration) * (event.offsetX / event.target.clientWidth);
		/*
		if(calValue>0){
		   
		}
		*/
		if ((calValue < this.timeDuration || calValue == this.timeDuration) && (calValue > 0 || calValue == 0)) {
			if ((this.isForwardEnabled == false && (calValue < this.videoPlayedTime) || (calValue == this.videoPlayedTime)) || this.isForwardEnabled) {
				this.tooltipValue = this.convertTimeFormatMouseOver(calValue);
				if (this.rangeSliderRef && this.rangeSliderRef.nativeElement && this.rangeSliderRef.nativeElement.children[1]) {
					this.rangeSliderRef.nativeElement.children[1].style.display = "block";
					this.rangeSliderRef.nativeElement.children[1].style.left = (calValue * 100) / (this.timeDuration) + "%";
				}
				if (this.isDrag) {
					if (!this.isForwardEnabled) {
						this.progressValue = this.videoPlayedTime < calValue ? (this.videoPlayedTime / this.timeDuration) * 100 : (calValue / this.timeDuration) * 100;
					} else if (this.isForwardEnabled) {
						this.progressValue = (calValue / this.timeDuration) * 100;
						this.videoProgress = this.progressValue;
					}
					//this.currentTime = parseFloat((calValue).toFixed(3));
					this.currentTime = (this.progressValue * this.timeDuration) / 100;
					this.seekedQuestionSet();
				}
			}
		}
	}

	seekbarSeeked(event, playFrom) {
		this.lastPauseAt = -1;
		if (event) {
			console.log("seeked time ", ((this.timeDuration) * (event.offsetX / event.target.clientWidth)) / 1000);
			if (!this.isForwardEnabled) {
				this.currentTime = this.videoPlayedTime < (this.timeDuration) * (event.offsetX / event.target.clientWidth) ? this.videoPlayedTime : (this.timeDuration) * (event.offsetX / event.target.clientWidth);
			} else if (this.isForwardEnabled) {
				this.currentTime = (this.timeDuration) * (event.offsetX / event.target.clientWidth);
			}
		} else if (event == undefined) {
			this.currentTime = playFrom;
			if (!this.isForwardEnabled) {
				this.videoPlayedTime = this.currentTime;
			}
		}
		this.progressValue = (this.currentTime / this.timeDuration) * 100;
		if (!this.isForwardEnabled) {
			this.videoPlayedTime = this.videoPlayedTime > (this.progressValue * this.timeDuration) / 100 ? this.videoPlayedTime : (this.progressValue * this.timeDuration) / 100;
			this.videoProgress = (this.videoPlayedTime / this.timeDuration) * 100;
		} else if (this.isForwardEnabled) {
			this.videoProgress = this.progressValue;
		}

		if (this.progressValue < 100 || this.zarriRakheinBtn != null) {
			this.zarriRakheinBtn = null;
		}
		/*
		if(this.sliderRef.nativeElement && (this.currentTime+0.01)<=this.timeDuration && this.isPlaying){
		  this.sliderRef.nativeElement.style.width = this.progressValue+"%";
		}
		*/

		let remainingTime = this.timeDuration - this.currentTime;
		this.time = this.convertTimeFormat(remainingTime) + '/' + this.convertTimeFormat(this.timeDuration);
		this.seekedQuestionSet();
		/*if(this.scannedImg && this.scannedImg.nativeElement){
			this.scannedImg.nativeElement.className="scannedImg";
		}*/

		//this.setSeekedConcludeSound();
		/*
		 if(this.soundPlayed){
			  this.soundPlayed = false;
			  if(this.concludeAudio && this.concludeAudio.nativeElement && !this.soundPlayed){
				  this.concludeAudio.nativeElement.currentTime = 0;
				this.concludeAudio.nativeElement.pause();
				let soundCurrentTime = this.currentTime - this.timeArray[this.timeArray.length-1];
				if(soundCurrentTime>0){
					this.concludeAudio.nativeElement.currentTime = soundCurrentTime;
				}else{
					this.concludeAudio.nativeElement.currentTime = 0;
				}
			}
			  
		  }
		  */
		if (event == undefined) {
			this.timer = setInterval(() => {
				this.testProgress()
			}, 10);
		}
	}

	setSeekedConcludeSound() {
		// this.soundPlayed = true;
		//if(this.soundPlayed){
		// this.soundPlayed = false;
		if (this.concludeAudio && this.concludeAudio.nativeElement) {//  &&!this.soundPlayed
			//this.concludeAudio.nativeElement.currentTime = 0;
			if (this.isPlaying) {
				this.concludeAudio.nativeElement.play();
			}
			let soundCurrentTime = this.currentTime - this.timeArray[this.timeArray.length - 1];
			if (soundCurrentTime > 0) {
				this.concludeAudio.nativeElement.currentTime = soundCurrentTime;
			} else {
				this.concludeAudio.nativeElement.currentTime = 0;
			}
		}

		// }  
	}

	seekedQuestionSet() {
		if (this.currentTime > this.timeArray[this.timeArray.length - 1]) {
			if (this.scannedImg && this.scannedImg.nativeElement) {
				this.scannedImg.nativeElement.className = "scannedImg hideQuesImg";
			}
			if (this.concludeAudio && this.concludeAudio.soundExist) {
				this.setSeekedConcludeSound();
			}
		} else {
			if (this.concludeAudio && this.concludeAudio.nativeElement && !this.concludeAudio.nativeElement.paused) {
				this.concludeAudio.nativeElement.pause();
				this.concludeAudio.nativeElement.currentTime = 0;
			}
			if (this.scannedImg && this.scannedImg.nativeElement) {
				this.scannedImg.nativeElement.className = "scannedImg";
			}
			this.timeCover = this.timeArray[0];
			if ((this.currentTime > this.timeCover)) {
				let j = 1;
				while ((this.timeCover < this.currentTime)) {
					this.timeCover = this.timeArray[j];
					j++;
				}
				this.questionNumber = j - 1;
			} else {
				this.questionNumber = 0;
			}
			this.question = this.questionArray[this.questionNumber];
			if (this.questionNumber < this.timeArray.length - 1) {
				this.questionNumber++;
			}
		}
	}

	hideToolTip() {
		if (this.rangeSliderRef && this.rangeSliderRef.nativeElement && this.rangeSliderRef.nativeElement.children[1]) {
			this.rangeSliderRef.nativeElement.children[1].style.display = "none";
		}
	}

	convertTimeFormat(time) {
		let min: any = this.convertDigits(Math.floor((time) / 60));
		let sec: any = this.convertDigits(Math.floor((time) - (min * 60)));
		return min + ':' + sec;
	}

	convertTimeFormatMouseOver(time) {
		//let min:any = this.convertDigits(parseInt(parseFloat(time.toFixed(0))/60));
		let min: any = this.convertDigits(Math.floor((time).toFixed(0) / 60));
		let sec: any = this.convertDigits(Math.floor((time).toFixed(0) - (min * 60)));
		/*if(sec==60){
			min = parseFloat(min)+1;
			sec = 0;
		}*/
		//let sec:any = this.convertDigits(Math.floor((time)-(min*60)));
		if (isNaN(min) || isNaN(sec)) {
			min = "00";
			sec = "00";
		}
		return min + ':' + sec;
	}

	convertDigits(value: number): string {
		if (value < 10) {
			return '0' + value;
		} else {
			return '' + value;
		}
	}

	volumeIconClicked(event) {
		this.displayVolume = !this.displayVolume;
		if (this.displayVolume) {
			setTimeout(() => {
				if (this.appModel) {
					let isMute = this.appModel.isMute;
					if (this.MuteVar && this.MuteVar.nativeElement) {
						if (isMute) {
							this.MuteVar.nativeElement.children[0].checked = true;
							this.appModel.isMute = true;
							this.volumeBar.nativeElement.className = "volumesliderDisable";
							this.appModel.functiontwo(undefined);
						} else if (!isMute) {
							this.MuteVar.nativeElement.children[0].checked = false;
							this.appModel.isMute = false;
							this.appModel.functiontwo(undefined);
						}
					}
				}
			}, 0)
		}
	}

	updateAutoplay() {
		if (this.autoPlayOnOffContainer && this.autoPlayOnOffContainer.nativeElement && this.autoPlayOnOffContainer.nativeElement.children[0]) {
			if (this.autoPlayOnOffContainer.nativeElement.children[0].children[1].checked) {
				this.isAutoplayOn = true;
				this.appModel.updateAutoPlay(true);
			} else {
				this.isAutoplayOn = false;
				this.appModel.updateAutoPlay(false);
			}
		}
	}

	UpdateMute() {
		if (this.MuteVar.nativeElement.children[0].checked) {
			this.appModel.isMute = true;
			this.volumeBtn = this.volumeMute;
			this.volumeBar.nativeElement.className = "volumesliderDisable";

			//this.appModel.functiontwo(undefined);
		} else {
			this.appModel.isMute = false;
			this.volumeBtn = this.volumeIcon;
			this.volumeBar.nativeElement.className = "volumeslider";
			if (this.concludeAudio && this.concludeAudio.nativeElement) {
				this.concludeAudio.nativeElement.volume = this.appModel.volumeValue;
			}
			//this.appModel.functiontwo(undefined);
		}
	}

	updateVolume(event) {
		if (this.concludeAudio && this.concludeAudio.nativeElement) {
			this.concludeAudio.nativeElement.volume = this.appModel.isMute ? 0 : this.appModel.volumeValue;
			this.appModel.functiontwo(event.target.value);
		}
		if (this.MuteVar.nativeElement.children[0].checked) {
			this.MuteVar.nativeElement.children[0].checked = false;
			this.appModel.isMute = false;
			this.volumeBtn = this.volumeIcon;
			this.volumeBar.nativeElement.className = "volumeslider";
		}
	}

	mouseDownEvent() {
		this.isDrag = true;
		if (this.concludeAudio && this.concludeAudio.nativeElement && !this.concludeAudio.nativeElement.paused) {
			this.concludeAudio.nativeElement.pause();
			this.concludeAudio.nativeElement.currentTime = 0;
		}
		//this.progressValue = (this.currentTime/this.timeDuration)*100;
	}
	mouseUpEvent() {
		this.isDrag = false;
	}

	onHoverZariRakheinBtn() {
		this.pauseBtn = this.quesInfo.nextbtn_graphic_hover;
	}
	onLeaveZariRakheinBtn() {
		this.pauseBtn = this.quesInfo.nextbtn_graphic_original;
	}

	resumeSpecial() {
		this.isPlaying = true;
		this.fadeOutFlag = true;
		this.timer = setInterval(() => {
			this.testProgress();
		}, 10);
		setTimeout(() => {
			this.fadeOutFlag = false;
			this.displaySpecial = false;
		}, 200)
	}
}

