import {PlayerConstants} from '../common/playerconstants';
import {ApplicationmodelService} from '../model/applicationmodel.service';
import {Component, OnInit, ViewEncapsulation, ViewChild, HostListener} from '@angular/core';
import { $ } from 'protractor';

declare var Slider: any;

@Component({
  selector: 'app-video',
  templateUrl: '../view/layout/video.component.html',
  styleUrls: ['../view/css/video.component.css', '../view/css/bootstrap.css',
    '../view/css/bootstrap-slider.css'],
  host: {
    '(document:keypress)': 'handleKeyboardEvent($event)'
   },
  encapsulation: ViewEncapsulation.None,
})
export class VideoComponent implements OnInit {

  public appModel: ApplicationmodelService;
  private previousElapsed;
  private currentVideoTime;
  private duration;
  public currentTime = 0;
  protected progressBarValue = 0;
  protected sliderRef = null;
  protected testRef = null;

  public displayVolume = false;
  public displaySpecial = false;
  public isPlaying = false;
  public time = PlayerConstants.TIME_FORMAT;
  isAutoplayOn:boolean;
  text:any = "";
  private curmins = 0;
  private cursecs = 0;
  private curds = 0;
  private currentHit:any;
  private previousHit:any;
  private prehitFormat:any;
  private dsCollapse:any;
  private seekingEvent:any;
  private videoDuration:any;
  private tooltipValue:any;
  private tooltipLeft:any;
  private sliderValue:any;
  private previousX:any;
  private mouseovervalue:any;
  
  volumeIcon:any = "";
  volumeMute:any = "";
  volumeBtn:any = "";
  timeArr:any = [];
  pauseFlag:boolean = false;
  loaderTimer:any;
  fadeOutFlag:boolean = false;
  
  isLastQues:boolean = false;
  isLastQuesAct:boolean;
  videoType:string = "video/ogg";
  isVideLoaded:boolean = false;
  videoSeekedFlag:boolean = false;
  isAssetsFound:boolean = false;
  isDrag:boolean = false;
  isForwardEnabled:boolean = true;
  videoPlayedTime:any = 0;
  videoProgress:any;
  isVideoPlaying:boolean = true;
	templateTypeEVA:boolean;
  root:any = document.documentElement;
  private previousStopPoint;
	speakerPlayed:boolean;
  
  @ViewChild('mainVideo') mainVideo;
  @ViewChild('autoPlayOnOffContainer') autoPlayOnOffContainer:any;
  @ViewChild('videoOuterMost') videoOuterMost:any;
  @ViewChild('volumeContainer') volumeContainer:any;
  @ViewChild('MuteVar') MuteVar:any;
  @ViewChild('volumeBar') volumeBar:any;
  @ViewChild('speakerBtn') speakerBtn:any;
  @ViewChild('quesRepeat') quesRepeat:any;
  @ViewChild('controlsContainer') controlsContainer:any;
  @ViewChild('sliderContainerRef') sliderContainerRef:any;
  @ViewChild('disableRange') disableRange:any;
	//@ViewChild('spriteEVA') spriteEVA:any;
  
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(!this.volumeContainer.nativeElement.contains(event.target)) {
		this.displayVolume = false;
    }
  }
  
  /*
  on click of space button pause and play
  handleKeyboardEvent(event: KeyboardEvent) { 
	  if(event.which==32){
		 if(this.mainVideo.nativeElement.paused){
			 this.mainVideo.nativeElement.play();
			 this.fadeOutFlag = true;
		     setTimeout(()=>{
				this.fadeOutFlag = false;
				this.displaySpecial = false;
			},200)
		 }else{
			this.mainVideo.nativeElement.pause(); 
		 }
		 this.isPlaying ? this.pauseVideo() : this.playVideo();
	  }
  }
  */
  assets:any;
  assetsOnVideo:any;
  cuePoints:any;
  containgFolderPath:any = "";
  assetsPath:string = "";
  zarriRakheinBtn:any ="";

  constructor(appModel: ApplicationmodelService) {
    this.appModel = appModel;
	this.appModel.navShow=0;
	this.assetsPath=this.appModel.assetsfolderpath;
	
	this.appModel.setLoader(false);
	this.appModel.setVideoLoaded(false);
	setTimeout(()=>{
		this.appModel.setVideoLoaded(true);
	},5000)

    this.appModel.notification.subscribe(
      (data) => {
        console.log('VideoComponent: constructor - data=', data);
        switch (data) {
					case PlayerConstants.CMS_PLAYER_PLAY:
            this.playVideo();
            break;

					case PlayerConstants.CMS_PLAYER_PAUSE:
            this.pauseVideo();
            break;

          case PlayerConstants.CMS_PLAYER_CLOSE:
            this.close();
            console.log('VideoComponent: constructor - cmsPlayerClose');
            break;

          default:
            console.log('VideoComponent: constructor - default');
            break;
        }
      }
    );
  }

  ngOnInit() {
	  this.containgFolderPath = this.getBasePath();
	  let imagesList = this.appModel.content.contentData.data['assets'];
	  this.volumeIcon = imagesList.volume_graphic;
	  this.volumeMute = imagesList.mute_graphic;
	  this.volumeBtn = imagesList.volume_graphic;
	  this.isLastQues = this.appModel.isLastSection;
	  this.isLastQuesAct = this.appModel.isLastSectionInCollection;
	  this.getTimeArr();
	  this.isForwardEnabled = this.appModel.getforwardEnableFlag();
		let template = this.appModel.content.contentData.data['templateType'];
		if(template == "EVA") {
			this.templateTypeEVA=true;
		} else {
			this.templateTypeEVA=false;
		}
	  this.assets = this.appModel.content.contentData.data['assets'];
	  this.cuePoints = this.appModel.content.contentData.data['cuePoints'];
	  if(this.appModel.getVideoType()){
		this.videoType = this.appModel.getVideoType();
	  }
	  console.log("video type from backend" +this.videoType);
		//this.spriteEVA.nativeElement.style = "display:none";
	  if(this.videoOuterMost.nativeElement && this.videoOuterMost.nativeElement.parentElement 
	     && this.videoOuterMost.nativeElement.parentElement.parentElement && this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement
		  && this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement && 
		   this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement.children){
			//this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement.children[2].className = "loaderHeight";
	  }
	  
	if(this.appModel.isNewCollection){
		//console.log("chck:",this.appModel.isNewCollection);
		//this.appModel.event = {'action': 'segmentBegins'};
		if(this.appModel.initVal == 0){
			this.appModel.event = {'action': 'segmentBegins'};
		}
		else{
			//this.appModel.event = {'action': 'play'};
			// play automatically from startAt milliseconds
			console.log('VideoComponent: ngOnInit - initVal', this.appModel.initVal);
			this.playVideoFrom(this.appModel.initVal);
		}
	}
    const thisref = this;
    /*this.sliderRef = new Slider('#seek-bar', { id: "slider5a",
     * formatter: updateTimeTT, min: 0, max: 100, value: 0, forwardValue: maxtime + 1, forwardEnabled: !p });
     */
    this.sliderRef = new Slider('#seek-bar', {
      id: 'slider5a', // latest
      min: 0, max: 100, value: this.progressBarValue, formatter: this.showTooltipValue.bind(this), forwardValue: 50, forwardEnabled: false
    });
	
    this.sliderRef.on('slideStop', function(event) {
      thisref.currentTime = event / (100 / thisref.duration);

    });	

		this.setDynamicCss();
		/*window.onresize = (e) =>{
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
	
	/*valuetest(event):any{
	this.mouseovervalue  = ((this.videoDuration)*((event.x - (parseInt(document.getElementById("sliderContainer").style.paddingLeft) + parseInt(document.getElementById("sliderContainer").style.paddingRight) + document.getElementById("playPauseContainer").clientWidth))/ (document.getElementById("sliderContainer").clientWidth)));
	let mouseoverminute = Math.floor(this.mouseovervalue/60)
	let mouseoversecond = Math.floor(this.mouseovervalue - mouseoverminute*60);
	this.tooltipValue =  this.convertDigits(mouseoverminute) + ':' + this.convertDigits(mouseoversecond);
	this.tooltipLeft = (this.mouseovervalue/this.videoDuration) *100;
	}*/
	
	hideToolTip(){
		if(this.sliderContainerRef.nativeElement && this.sliderContainerRef.nativeElement.children[0] && this.sliderContainerRef.nativeElement.children[0].children[1]){
			this.sliderContainerRef.nativeElement.children[0].children[1].style.display = "none";
		}
	}
	
	setDynamicCss(){
		    let customeHeight:any = window.innerHeight/112;
			this.root.style.setProperty('--sliderHeight', customeHeight+'px');
			this.root.style.setProperty('--thumbMessurement', customeHeight*2+'px');
		}
	
	
  
  checkImgLoaded(){
	  setTimeout(()=>{
		  this.appModel.setVideoLoaded(true);
	  },200)
  }
  
	showTooltipValue():any{
		return this.tooltipValue;
	}
  
  getTimeArr(){
	  if(this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data && this.appModel.content.contentData.data['cuePoints']){
		for(let i in this.appModel.content.contentData.data['cuePoints']){
			if(this.appModel.content.contentData.data['cuePoints'][i].time.lastIndexOf(":")!=8){
				this.appModel.content.contentData.data['cuePoints'][i].time = this.appModel.content.contentData.data['cuePoints'][i].time + ":0";
			}
		  this.timeArr.push(this.appModel.content.contentData.data['cuePoints'][i].time);
	  }
		
	  }
	  console.log(this.timeArr);
  }
  
   updateTimeTT(value) {
		//return this.convertDigits(this.curmins) + ':' + this.convertDigits(this.cursecs);
		return this.tooltipValue;
   }

  getInitialVolume(){
	  if(this.mainVideo && this.mainVideo.nativeElement){
		 this.mainVideo.nativeElement.volume = this.appModel.isMute?0:this.appModel.volumeValue; 
	  }
  }
  
  ngAfterViewChecked(){
	this.getInitialVolume();
	if(this.sliderContainerRef.nativeElement && this.sliderContainerRef.nativeElement.children[0] && this.sliderContainerRef.nativeElement.children[0].children[1]){
		this.sliderContainerRef.nativeElement.children[0].children[1].style.left = this.tooltipLeft+"%";
	}
	if(this.sliderContainerRef.nativeElement && this.sliderContainerRef.nativeElement.children[0] && this.sliderContainerRef.nativeElement.children[0].children[1]){
		this.sliderContainerRef.nativeElement.children[0].children[1].style.left = this.tooltipLeft+"%";
		this.sliderContainerRef.nativeElement.children[0].children[1].style.marginLeft = -(1.9)+"%";
		this.sliderContainerRef.nativeElement.children[0].children[0].children[1].style.width = this.videoProgress+"%";
		this.sliderContainerRef.nativeElement.children[0].children[0].children[2].style.width = (100-this.videoProgress)+"%";
		if(this.isForwardEnabled!=undefined && this.isForwardEnabled==false){
			this.disableRange.nativeElement.style.left = this.videoProgress + "%";
			this.disableRange.nativeElement.style.width = (100-this.videoProgress) + "%";
		}
	}
	if(this.sliderContainerRef.nativeElement && this.sliderContainerRef.nativeElement.children[0] && this.sliderContainerRef.nativeElement.children[0].children[4]){
		this.sliderContainerRef.nativeElement.children[0].children[4].style.left = this.progressBarValue+"%";
	}
	this.setDynamicCss();
  }
  

  loadedHandler(event) {
    this.duration = event.currentTarget.duration;
  }

  updatePlay(event) {
	//console.log("this.mainVideo.nativeElement.currentTime:",this.mainVideo.nativeElement.currentTime);  
	this.isPlaying ? this.playVideo() : this.pauseVideo();
	console.log("this.isPlaying",this.isPlaying)
	if(!this.isPlaying){
	this.fadeOutFlag = true;
	setTimeout(()=>{
		this.fadeOutFlag = false;
	    this.displaySpecial = false;
	},200)
	}
	
	
	//this.previousElapsed = -1;
  }

  get basePath(): any {
    // console.log('VideoComponent: path=', this.appModel.content.id + '/' + this.appModel.content.contentData.data['path']);
	if(this.appModel && this.appModel.content){
		//this.volumeIcon = this.appModel.content.id;
		 return this.appModel.content.id + '';
	}
  }

  get path(): string {
	   if(this.appModel && this.appModel.content && this.appModel.content.id && 
		this.appModel.content.contentData && this.appModel.content.contentData.data){
			return this.appModel.content.id + '/' + this.appModel.content.contentData.data['path'];
	}
    // console.log('VideoComponent: path=', this.appModel.content.id + '/' + this.appModel.content.contentData.data['path']);
    
  }

  get sourceType(): string {
    // console.log('VideoComponent: sourceType=', this.appModel.content.contentData.data['type']);
	if(this.appModel && this.appModel.content  && this.appModel.content.contentData && this.appModel.content.contentData.data){
		return this.appModel.content.contentData.data['type'];
	}
    
  }

  get images(): any {
    // console.log('VideoComponent: path=', this.appModel.content.id + '/' + this.appModel.content.contentData.data['path']);
	if(this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data){
			return this.appModel.content.contentData.data['assets'];
	}
  }

  volumeIconClicked(event) {
    this.displayVolume = !this.displayVolume;
	if(this.displayVolume){
		setTimeout(()=>{
				 if(this.appModel){
					let isMute = this.appModel.isMute;
				if(this.MuteVar && this.MuteVar.nativeElement){
					if(isMute){
						this.MuteVar.nativeElement.children[0].checked = true;
						this.appModel.isMute = true;
						this.volumeBar.nativeElement.className = "volumesliderDisable";
						this.appModel.functiontwo(undefined);
					}else if(!isMute){
						this.MuteVar.nativeElement.children[0].checked = false;
						this.appModel.isMute = false;
						this.appModel.functiontwo(undefined);
					   }
				}				
			}
			 },0)
	}
  }

  private playVideo(ct?: number) {
	if(this.quesRepeat.nativeElement){
		this.quesRepeat.nativeElement.pause();
		this.quesRepeat.nativeElement.currentTime = 0;
	}
	if (this.speakerBtn.nativeElement) {
		this.speakerBtn.nativeElement.children[1].style.display = "none";
	}
	if (this.templateTypeEVA) {
		this.assets.speaker = this.assets.speaker_original;
	} else {
		this.speakerBtn.nativeElement.children[1].className = "speaker";
	}
   this.isPlaying = false;
   if(this.mainVideo && this.mainVideo.nativeElement){
	   if(ct) {
		   this.currentTime = ct;
		   this.mainVideo.nativeElement.currentTime=ct;
	   }
		this.mainVideo.nativeElement.play();
	}
    this.appModel.event = {'action': 'play'};
  }

  private pauseVideo() {
    this.isPlaying = true;
    if(this.mainVideo && this.mainVideo.nativeElement){
		this.mainVideo.nativeElement.pause();
	}
    this.appModel.event = {'action': 'pause', 'time': new Date().getTime(), 'currentPosition': this.mainVideo.nativeElement.currentTime };
  }
			
  updateHandler(event) {
		this.currentHit = event.currentTarget.currentTime;
	//let strTime = event.currentTarget.currentTime.toFixed(1);
	let strTime = (event.currentTarget.currentTime).toString().substr(0,((event.currentTarget.currentTime).toString().indexOf(".")+2));
	//let secondIncrement = 0;
	/*let strTimeDup = event.currentTarget.currentTime.toFixed(2);
	if(parseInt(strTimeDup.substr(strTimeDup.length-2,2)) >=95){
		console.log("seconds going to increment by 1");
		console.log(parseInt(strTimeDup.substr(strTimeDup.length-2,2)));
		secondIncrement = 1;
	}*/
	this.curds = strTime[strTime.length -1];
    const duration = event.currentTarget.duration;
    this.currentVideoTime = event.currentTarget.currentTime;
    const value = (100 / duration) * this.currentVideoTime;
	this.sliderValue = value;
    this.progressBarValue = value;
	if(!this.isForwardEnabled){
		this.videoPlayedTime = this.videoPlayedTime > this.currentVideoTime ? this.videoPlayedTime: this.currentVideoTime;
		this.videoProgress = (this.videoPlayedTime/duration)*100;
		
	}else if(this.isForwardEnabled){
		this.videoProgress = this.progressBarValue;
	}
	this.zarriRakheinBtn = "";
    this.curmins = Math.floor(this.currentVideoTime / 60);
    this.cursecs = Math.floor(this.currentVideoTime - this.curmins * 60);
    const durmins = Math.floor(duration / 60);
    const dursecs = Math.floor(duration - durmins * 60);
    const ttime = dursecs + (durmins * 60);
    const ctime = this.cursecs + (this.curmins * 60);
    const rtime = ttime - ctime;
    const remainingt = this.convertDigits(Math.floor(rtime / 60)) + ':' + this.convertDigits(rtime % 60);
    const elapsed = this.convertDigits(this.curmins) + ':' + this.convertDigits(this.cursecs) + ':' + this.curds;
	this.time = remainingt + ' / ' + this.convertDigits(durmins) + ':' + this.convertDigits(dursecs);
	this.isAssetsFound = false;
	
	let dsDiff:any = this.getDiffrence(this.prehitFormat,this.currentHit,this.previousHit);
	if(dsDiff && dsDiff.length<=0){
		let timeArr:any = [];
		timeArr.push(elapsed);
		dsDiff = timeArr;
	}
	if(dsDiff && dsDiff.length>0){
		for(let i=dsDiff.length-1; i>=0; i--){
		if((this.timeArr.indexOf('00:' + dsDiff[i])!=-1) && (this.previousStopPoint != this.timeArr[this.timeArr.indexOf('00:' + dsDiff[i])])){
			//if((this.timeArr.indexOf('00:' + dsDiff[i])!=-1) && (this.previousElapsed != elapsed)){
			this.assetsOnVideo = this.cuePoints[this.timeArr.indexOf('00:' + dsDiff[i])];
			this.pauseFlag = true;
			this.displaySpecial = true;
			//this.previousElapsed = elapsed;
			this.previousStopPoint = this.timeArr[this.timeArr.indexOf('00:' + dsDiff[i])];
			this.isPlaying = false;
			setTimeout(()=>{
				document.getElementById("playPauseContainer").click();
			},500)
			this.mainVideo.nativeElement.pause();
			console.log("pause at ",dsDiff[i]);
			console.log("pause at... new ",this.timeArr[this.timeArr.indexOf('00:' + dsDiff[i])]);
			this.isAssetsFound = true;
			break;
		}else{
			//this.fadeOutFlag = false;
			//this.previousElapsed = -1;
		}
	}
	}else{
	}
	if(!this.isAssetsFound && this.videoSeekedFlag){
		this.displaySpecial = false;
	}
    // update slider
	//this.sliderRef.setValue(value, false, false); don't remove
	this.sliderRef.setValue(this.videoPlayedTime, false, false);
	
	this.prehitFormat = elapsed;
	this.videoSeekedFlag = false;
  }
  
  getDiffrence(preHit,next,pre){
	  //console.log("this.prehitFormat",preHit);
	  let timeArrNew:any = [];
	  let timeDiff = Math.ceil((next-pre)*10);
	  if(preHit && !this.videoSeekedFlag){
		  let preDS = preHit[preHit.lastIndexOf(':')+1];
		  let preS = preHit.substr(preHit.lastIndexOf(':')-2,2);
		  let preM = preHit.substr(0,preHit.indexOf(':'));
		  let timeInFormat:any;
		  for(let i=0;i<timeDiff;i++){
			  preDS = +preDS + + 1;
			  if(preDS>9){
				  preS = +preS+ + Math.floor(preDS/10);
				  preDS = preDS%10;
				  if(preS>59){
					  preM = +preM + +Math.floor(preS/60);
					  preS = preS%60;
				  }
			  }
			  timeInFormat = (this.convertDigitsCal(preM) + ':' + this.convertDigitsCal(preS) + ':' + preDS);
			  if(this.dsCollapse==timeInFormat){
			  }
			  if((this.dsCollapse && this.dsCollapse!=timeInFormat) || !this.dsCollapse){
				timeArrNew.push(timeInFormat);  
			  }
		  }
	  }else{
		  console.log("video seeking flag true");
	  }
	  this.previousHit = this.currentHit;
	  if(timeArrNew && timeArrNew.length && timeArrNew[timeArrNew.length-1]){
		this.dsCollapse = timeArrNew[timeArrNew.length-1];  
	  }
	  return timeArrNew;
  }
  
  videoSeeked(event){
	 this.videoSeekedFlag = true;
	 //this.previousElapsed = -1;
	 this.previousStopPoint = -1;
	 console.log("video seeking from video seeked");
  }
  
  convertDigitsCal(value:string): string {
    if (value.toString().length<2) {
      return '0' + value;
    } else {
      return '' + value;
    }
  }

  resumeSpecial(event) {
	console.log('VideoComponent: resumeSpecial - event=', event);
    // this.isPlaying = true;
    // this.mainVideo.nativeElement.play();
	// this.fadeOutFlag = true;
	// setTimeout(()=>{
	//   	this.fadeOutFlag = false;
	//     this.displaySpecial = false;
	// },200)
	this.updatePlay("t");
	//this.previousElapsed = -1;
	//this.displaySpecial = false;
	//this.assetsOnVideo = "";
  }

  updateVolume(event) {
    console.log('VideoComponent: updateVolume - event=', event);
    if(this.mainVideo && this.mainVideo.nativeElement){
		this.mainVideo.nativeElement.volume = this.appModel.isMute?0:event.target.value;
		if(this.quesRepeat && this.quesRepeat.nativeElement){
			this.quesRepeat.nativeElement.volume = this.appModel.isMute?0:event.target.value;
		}
		this.appModel.functiontwo(event.target.value);
		if(this.MuteVar.nativeElement.children[0].checked){
			this.MuteVar.nativeElement.children[0].checked = false;
			this.appModel.isMute = false;
			this.volumeBtn = this.volumeIcon;
			this.volumeBar.nativeElement.className = "volumeslider";
			/*let selectBox = <HTMLElement>document.getElementById("MuteVar");
			(<HTMLInputElement><any>selectBox.children[0]).checked = false;*/
		}
		if(event.target.value == 0){
			this.appModel.isMute = true;
			this.MuteVar.nativeElement.children[0].checked = true;
			this.volumeBtn = this.volumeMute;
			this.volumeBar.nativeElement.className = "volumesliderDisable";
		}
	}
  }
  
  UpdateMute(event){
		 if(this.MuteVar.nativeElement.children[0].checked){
			this.appModel.isMute = true;
			this.volumeBtn = this.volumeMute;
			this.volumeBar.nativeElement.className = "volumesliderDisable";
			if(this.mainVideo && this.mainVideo.nativeElement){
				this.mainVideo.nativeElement.volume = this.appModel.isMute?0:this.appModel.volumeValue;
			}
			if(this.quesRepeat && this.quesRepeat.nativeElement){
				this.quesRepeat.nativeElement.volume = this.appModel.isMute?0:event.target.value;
			}
			//this.appModel.functiontwo(undefined);
		}else{
			this.appModel.isMute = false;
			this.volumeBtn = this.volumeIcon;
			this.volumeBar.nativeElement.className = "volumeslider";
			if(this.mainVideo && this.mainVideo.nativeElement){
				this.mainVideo.nativeElement.volume = this.appModel.volumeValue;
			}
			if(this.quesRepeat && this.quesRepeat.nativeElement){
				this.quesRepeat.nativeElement.volume = this.appModel.volumeValue;
			}
			//this.appModel.functiontwo(undefined);
		} 
  }

  endedHandler(event) {
    console.log('VideoComponent: endedHandler');
    this.appModel.event = {'action': 'segmentEnds'};
	this.isPlaying = true;
	if((this.appModel.autoPlay && !this.isLastQues) || !((this.isLastQuesAct)) ||((this.isLastQuesAct && this.appModel.autoPlay && !this.isLastQues))){
		if(this.videoOuterMost && this.videoOuterMost.nativeElement 
			   && this.videoOuterMost.nativeElement.parentElement && 
			   this.videoOuterMost.nativeElement.parentElement.parentElement && 
			   this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement &&
			   this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement 
			   && this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement){
					//this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement.className = "container-fluid d-flex align-items-center justify-content-center";
					//this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement.children[2].className = "loaderTest";
			}
		//this.appModel.setLoader(true);
		this.appModel.nextSection();
	}else if(!this.appModel.autoPlay && !this.isLastQues){
		this.zarriRakheinBtn = this.assets.nextbtn_graphic;
	}else if(this.isLastQues){
		this.appModel.event = {'action': 'end'};	
	}
  }
  
  onHoverContinuousBtn(){
	 this.zarriRakheinBtn = this.assets.nextbtn_graphic_hover; 
  }
  
  onLeaveContinuousBtn(){
	this.zarriRakheinBtn = this.assets.nextbtn_graphic_original;  
  }

	onHoverSpeakerBtn() {
    this.assets.speaker=this.assets.speaker_hover;
	}

	onLeaveSpeakerBtn() {
		if(!this.speakerPlayed) {
      this.assets.speaker=this.assets.speaker_original;
		}
	}

	onHoverReplayBtn() {
   this.assets.replay=this.assets.replay_hover;
	}

	onLeaveReplayBtn() {
   this.assets.replay=this.assets.replay_original;
	}
  
  next(){
	  if(!this.isLastQues){
		if(this.videoOuterMost && this.videoOuterMost.nativeElement 
			   && this.videoOuterMost.nativeElement.parentElement && 
			   this.videoOuterMost.nativeElement.parentElement.parentElement && 
			   this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement &&
			   this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement 
			   && this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement){
					//this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement.className = "container-fluid d-flex align-items-center justify-content-center";
					//this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement.children[2].className = "loaderTest";
			}
			this.fadeOutFlag = true;
			setTimeout(()=>{
				//this.zarriRakheinBtn = "";
				//this.appModel.setLoader(true);
				this.appModel.nextSection(); 
				//this.fadeOutFlag = false;
			},200) 
	  }  
  }
  
  playVideoFrom(millisecs: number) {
	  // play from milliseconds 
	  this.playVideo(millisecs);
	  //this.mainVideo.nativeElement.currentTime=millisecs;
	  //console.log("newStart:",millisecs,this.mainVideo.nativeElement.currentTime);
  }

  close() {
    //this.appModel.event = { 'action': 'exit', 'currentPosition': this.currentVideoTime };
    this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': this.mainVideo.nativeElement.currentTime };
  }

  convertDigits(value: number): string {
    if (value < 10) {
      return '0' + value;
    } else {
      return '' + value;
    }
  }
  
  checkVideoLoaded(){
	  this.controlsContainer.nativeElement.style.display = "flex";
		//this.appModel.setLoader(false);
		 if(this.videoOuterMost.nativeElement && this.videoOuterMost.nativeElement.parentElement 
	     && this.videoOuterMost.nativeElement.parentElement.parentElement && this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement
		  && this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement && 
		   this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement.children){
		   //this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement.className = "";
			//this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement.children[2].className = "loaderHeight";
		}
		//clearTimeout(this.loaderTimer);
		
		setTimeout(()=>{
				 if(this.appModel){
					let autoPlay =  this.appModel.isAutoPlay();
				if(autoPlay){
					if(this.autoPlayOnOffContainer && this.autoPlayOnOffContainer.nativeElement && this.autoPlayOnOffContainer.nativeElement.children[0] && this.autoPlayOnOffContainer.nativeElement.children[0].children[1]){
						this.autoPlayOnOffContainer.nativeElement.children[0].children[1].checked = true;
						this.isAutoplayOn = true;
						this.appModel.updateAutoPlay(true);
					}
				}else{
					if(this.autoPlayOnOffContainer && this.autoPlayOnOffContainer.nativeElement && this.autoPlayOnOffContainer.nativeElement.children[0] && this.autoPlayOnOffContainer.nativeElement.children[0].children[1]){
						this.autoPlayOnOffContainer.nativeElement.children[0].children[1].checked = false;
						this.isAutoplayOn = false;
						this.appModel.updateAutoPlay(false);
					}
				} 
				let isMute = this.appModel.isMute;
				if(isMute){
					this.volumeBtn = this.volumeMute;
				}else if(!isMute){
					this.volumeBtn = this.volumeIcon;
				}	
				 }
				 
			   if(this.videoOuterMost && this.videoOuterMost.nativeElement 
			   && this.videoOuterMost.nativeElement.parentElement && 
			   this.videoOuterMost.nativeElement.parentElement.parentElement && 
			   this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement &&
			   this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement 
			   && this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement){
					//this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement.className = "";
			}
			/*let thisref = this;
			document.getElementById("slider5a").onmousemove = function(event){
				thisref.sliderContainerRef.nativeElement.children[0].children[1].style.display = "block";
				thisref.valuetest(event);
			}
			document.getElementById("slider5a").onmouseleave = function(event){
				thisref.hideToolTip();
			}*/
			 },100)
			 this.isVideLoaded = true;
			 
			 this.appModel.setVideoLoaded(true);
			 this.videoDuration = this.mainVideo.nativeElement.duration;
	}
		
    updateAutoplay(){
			if(this.autoPlayOnOffContainer && this.autoPlayOnOffContainer.nativeElement && this.autoPlayOnOffContainer.nativeElement.children[0] && this.autoPlayOnOffContainer.nativeElement.children[0].children[1]){
				if(this.autoPlayOnOffContainer.nativeElement.children[0].children[1].checked){
					this.isAutoplayOn = true;
					this.appModel.updateAutoPlay(true);
				}else{
					this.isAutoplayOn = false;
					this.appModel.updateAutoPlay(false);
				}
			}
		}
		
		getBasePath(){
			if(this.appModel && this.appModel.content){
				 return this.appModel.content.id + '';
			}
		}
		
		onHoverZariRakheinBtn(){
			this.assets.nextbtn_graphic = this.assets.nextbtn_graphic_hover;
		}
		onLeaveZariRakheinBtn(){
			this.assets.nextbtn_graphic = this.assets.nextbtn_graphic_original;
		}
		
		repeatQues(){
			if(this.templateTypeEVA) {
				this.speakerPlayed=true;
				this.assets.speaker = this.assets.speaker_hover;
      this.speakerBtn.nativeElement.children[1].style.display="flex";
			if(this.assetsOnVideo){
				this.quesRepeat.nativeElement.play();
				this.quesRepeat.nativeElement.onended = ()=>{
					this.speakerPlayed=false;
					this.assets.speaker = this.assets.speaker_original;
					this.speakerBtn.nativeElement.children[1].style.display="none";
				}
			}
			} else {
      this.speakerBtn.nativeElement.children[1].className = "speaker dispFlex";
			if(this.assetsOnVideo){
				this.quesRepeat.nativeElement.play();
				this.quesRepeat.nativeElement.onended = ()=>{
					this.speakerBtn.nativeElement.children[1].className = "speaker";
				}
			}
			}
		}

		replayVideo() {
			this.mainVideo.nativeElement.currentTime=this.assetsOnVideo.replaytime;
			this.mainVideo.nativeElement.play();
			this.isPlaying ? this.playVideo() : this.pauseVideo();
		}
		/*
		showValueOnTooltip(event){
			this.mouseovervalue = ((this.videoDuration)*(event.offsetX / event.target.clientWidth));
			if(this.mouseovervalue>0){
				let mouseoverminute = Math.floor(this.mouseovervalue/60)
				let mouseoversecond = parseInt((this.mouseovervalue - mouseoverminute*60).toFixed(0));
				this.tooltipValue =  this.convertDigits(mouseoverminute) + ':' + this.convertDigits(mouseoversecond);
				this.tooltipLeft = (this.mouseovervalue/this.videoDuration) *100;
				this.sliderRef.setValue(this.sliderValue, false, false);
				//console.log(this.tooltipValue);
				if(this.sliderContainerRef.nativeElement && this.sliderContainerRef.nativeElement.children[0] && this.sliderContainerRef.nativeElement.children[0].children[1]){
					this.sliderContainerRef.nativeElement.children[0].children[1].style.display = "block";
					this.sliderContainerRef.nativeElement.children[0].children[1].style.opacity = "1";
				}
				if(this.isDrag){
					let calValue = (this.mouseovervalue/this.videoDuration) *100;
					if(calValue>0 || calValue==0){
						 if(this.isForwardEnabled==false && (calValue < this.videoPlayedTime) || (calValue==this.videoPlayedTime)){
							 this.progressBarValue = calValue;
							 this.mouseovervalue = calValue;
							 this.videoProgress = calValue;
						 }else if(this.isForwardEnabled){
							 this.progressBarValue = calValue;
						 }
						//this.progressBarValue = calValue;
						this.mainVideo.nativeElement.currentTime = this.mouseovervalue;
						if(this.sliderContainerRef.nativeElement && this.sliderContainerRef.nativeElement.children[0] && this.sliderContainerRef.nativeElement.children[0].children[1]){
							this.sliderContainerRef.nativeElement.children[0].children[1].style.left = this.tooltipLeft+"%";
							this.sliderContainerRef.nativeElement.children[0].children[0].children[1].style.width = this.videoProgress+"%";
							this.sliderContainerRef.nativeElement.children[0].children[0].children[2].style.width = (100-this.videoProgress)+"%";
						}
						if(this.sliderContainerRef.nativeElement && this.sliderContainerRef.nativeElement.children[0] && this.sliderContainerRef.nativeElement.children[0].children[4]){
							this.sliderContainerRef.nativeElement.children[0].children[4].style.left = this.progressBarValue+"%";
						}
						this.sliderRef.setValue(this.sliderValue, false, false);
					}		
				}
				
			}
		}
		*/
		showValueOnTooltip(event){
		  let calValue = ((this.videoDuration)*(event.offsetX / event.target.clientWidth));
		  //this.mouseovervalue = calValue;
		  /*
		  if(calValue>0){
			 
		  }
		  */
		  if((calValue < this.videoDuration || calValue==this.videoDuration) && (calValue> 0 || calValue==0)){
			  if((this.isForwardEnabled==false && (calValue < this.videoPlayedTime) || (calValue==this.videoPlayedTime)) || this.isForwardEnabled){
				let mouseoverminute = Math.floor(calValue/60);
				let mouseoversecond = parseInt((calValue - mouseoverminute*60).toFixed(0));
				this.tooltipValue =  this.convertDigits(mouseoverminute) + ':' + this.convertDigits(mouseoversecond);
				this.tooltipLeft = (calValue/this.videoDuration) *100;
				this.sliderRef.setValue(this.sliderValue, false, false);
		        if(this.sliderContainerRef.nativeElement && this.sliderContainerRef.nativeElement.children[0] && this.sliderContainerRef.nativeElement.children[0].children[1]){
					this.sliderContainerRef.nativeElement.children[0].children[1].style.display = "block";
					this.sliderContainerRef.nativeElement.children[0].children[1].style.opacity = "1";
				}
				if(this.isDrag){
					  if(!this.isForwardEnabled){
						this.progressBarValue = this.videoPlayedTime < calValue ? (this.videoPlayedTime/this.videoDuration)*100 : (calValue/this.videoDuration)*100;  
						this.videoProgress = (this.videoPlayedTime/this.videoDuration)*100;
					  }else if(this.isForwardEnabled){
						  this.progressBarValue = (calValue/this.videoDuration)*100;
						  this.videoProgress = this.progressBarValue;
					  }
					//this.currentTime = parseFloat((calValue).toFixed(3));
					this.currentTime = (this.progressBarValue*this.videoDuration)/100;
					this.mainVideo.nativeElement.currentTime = calValue;
						if(this.sliderContainerRef.nativeElement && this.sliderContainerRef.nativeElement.children[0] && this.sliderContainerRef.nativeElement.children[0].children[1]){
							this.sliderContainerRef.nativeElement.children[0].children[1].style.left = this.tooltipLeft+"%";
							this.sliderContainerRef.nativeElement.children[0].children[0].children[1].style.width = this.videoProgress+"%";
							this.sliderContainerRef.nativeElement.children[0].children[0].children[2].style.width = (100-this.videoProgress)+"%";
						}
						if(this.sliderContainerRef.nativeElement && this.sliderContainerRef.nativeElement.children[0] && this.sliderContainerRef.nativeElement.children[0].children[4]){
							this.sliderContainerRef.nativeElement.children[0].children[4].style.left = this.progressBarValue+"%";
						}
				} 
			  }
		  }
	  }
		
		seekbarSeeked(event){
			this.mouseovervalue = ((this.videoDuration)*(event.offsetX / event.target.clientWidth));
			this.mainVideo.nativeElement.currentTime = this.mouseovervalue;
			//let mouseoverminute = Math.floor(this.mouseovervalue/60)
			//let mouseoversecond = Math.floor(this.mouseovervalue - mouseoverminute*60);
			//this.tooltipValue =  this.convertDigits(mouseoverminute) + ':' + this.convertDigits(mouseoversecond);
			//this.tooltipLeft = (this.mouseovervalue/this.videoDuration) *100;
			this.sliderRef.setValue(this.sliderValue, false, false);
		}
		
		updateSliderValue(event){
			console.log("mouse drag event");
			/*this.mouseovervalue = ((this.videoDuration)*(event.offsetX / event.target.clientWidth));
			this.mainVideo.nativeElement.currentTime = this.mouseovervalue;
			//let mouseoverminute = Math.floor(this.mouseovervalue/60)
			//let mouseoversecond = Math.floor(this.mouseovervalue - mouseoverminute*60);
			//this.tooltipValue =  this.convertDigits(mouseoverminute) + ':' + this.convertDigits(mouseoversecond);
			//this.tooltipLeft = (this.mouseovervalue/this.videoDuration) *100;
			this.sliderRef.setValue(this.sliderValue, false, false);*/
		}
		
		/*
		
		//pause and play video on click on video
		pausePlay(){
			if(this.mainVideo.nativeElement.paused){
				this.mainVideo.nativeElement.play();
				this.fadeOutFlag = true;
				setTimeout(()=>{
					this.fadeOutFlag = false;
					this.displaySpecial = false;
				},200)
			}else{
				this.mainVideo.nativeElement.pause(); 
			}
			this.isPlaying ? this.pauseVideo() : this.playVideo();
		}
		
		*/
		
		
		mouseDownEvent(){
			this.isDrag = true; 
			if(this.mainVideo.nativeElement.paused){
				this.isVideoPlaying = false;
			}else{
				this.isVideoPlaying = true;
				this.mainVideo.nativeElement.pause();
			}
		}
		mouseUpEvent(){
			this.isDrag = false; 
			if(this.isVideoPlaying){
				this.mainVideo.nativeElement.play();
			}
		}

}


