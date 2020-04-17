import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { Base } from '../../../controller/base';
import { SharedserviceService } from '../../../services/sharedservice.service';
import { PlayerConstants } from '../../../common/playerconstants';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-template3',
  templateUrl: './template3.component.html',
  styleUrls: ['./template3.component.css']
})
export class Template3Component extends Base implements OnInit {

  constructor(private appModel: ApplicationmodelService, private ActivatedRoute: ActivatedRoute, private Sharedservice: SharedserviceService) {
    super();
		this.appModel = appModel;
		this.assetsfolderlocation=this.appModel.assetsfolderpath;
		this.appModel.navShow=1;
		// if(this.optionsBlock && this.optionsBlock.nativeElement) {
		// 	this.optionsBlock.nativeElement.style.opacity="0";
		// }
		this.appModel.setLoader(true);
		// if error occured during image loading loader wil stop after 5 seconds 
      this.loaderTimer = setTimeout(() => {
		// if(this.optionsBlock && this.optionsBlock.nativeElement) {
		// 	this.optionsBlock.nativeElement.style.opacity="0";
		// }
		// if(document.getElementById("footerNavBlock")) {
		// 	document.getElementById("footerNavBlock").style.opacity="0";
		// }
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

   @ViewChild('narrator_voice') narrator_voice: any;
	 @ViewChild('myAudiohelp') myAudiohelp: any;
	 @ViewChild('myAudiospeaker') myAudiospeaker: any;
	 @ViewChild('audioEl') audioEl: any;
	 @ViewChild('titleNavBtn') titleNavBtn: any;
	 @ViewChild('container') containerBlock: any; 
	 @ViewChild('fireworks')  fireworks: any;
	 @ViewChild('ansBlock')  ansBlock: any;
	 @ViewChild('helpbtn')  helpbtn: any;
	 @ViewChild('sprite') sprite: any;
	 @ViewChild('speakerNormal') speakerNormal: any;
	 @ViewChild('disableSpeaker')  disableSpeaker: any;
	 @ViewChild('navBlock') navBlock:any;
	 @ViewChild('titleAudio')  titleAudio: any;
	 @ViewChild('autoPlayOnOffContainer') autoPlayOnOffContainer:any;
	 @ViewChild('maincontent') maincontent:any;
	 @ViewChild('clapSound') clapSound:any;
	 @ViewChild('buzzerSound') buzzerSound:any;
	 @ViewChild('videoStage') videoStage:any;
	 @ViewChild('optionsBlock') optionsBlock:any;
		assetsfolderlocation:string="";
		disableHelpBtn:boolean = false;
		optimage:any;
		assetspath:any;
		//opttext:any;
		currentIdx = 0;
		blink:boolean = false;
		showIntroScreen:boolean;
		audio =new Audio();
		bool:boolean=false;
		timernextseg:any="";
		idArray:any = [];
		speakerTimer:any="";
		speaker:any="";
		myoption:any=[];
		question:any="";
		feedback:any="";
		answers:any="";
		optionBlank:any="";
		Instruction:any="";
		quesInfo:any="";
		
		correctOpt:any;
		isFirstQues:boolean;
		isLastQues:boolean = false;
		isAutoplayOn:boolean;
		isLastQuesAct:boolean;
		
		autoplay_text:string = "";
		resizeFlag:boolean = false;
		
		noOfImgs:number;
		noOfImgsLoaded:number = 0;
		loaderTimer:any;
		common_assets:any = "";
		LoadFlag:boolean = false;
		hasEventFired:boolean = false;
		contentgFolderPath: string = "";
		videoPlayed=false;
		speakerPlayed=false;
		instructiontext: string;
		wrongCount:number=0;
			
			//quesInfo  = this._sharedService.navigatetoroute;
			//Instruction=this._sharedService.navigatetoroute.Instruction;
			//optionslist = this._sharedService.navigatetoroute.main;
			//optionslist_main = this._sharedService.navigatetoroute.main[this.currentIdx];
			//speaker = this.appModel.content.contentData.data.speaker;
			//myoption = this.appModel.content.contentData.data.options;
			//question = this.appModel.content.contentData.data.ques;
			//feedback = this.appModel.content.contentData.data.feedback;
			//answers = this.appModel.content.contentData.data.answers;
			//optionBlank =this.appModel.content.contentData.data.optionsBlank;
			
			  //disable next on last activity last question
			 // isLastActivity = this._sharedService.isLastActivity;
		get basePath(): any {
			 console.log('temponeComponent: path=', this.appModel.content.id + '/' + this.appModel.content.contentData.data['path']);
			if(this.appModel && this.appModel.content){
			
				 return this.appModel.content.id + '';
			}
		}	
		setData(){
			/*setTimeout(()=>{
				if(this.navBlock && this.navBlock.nativeElement){
				this.navBlock.nativeElement.className="d-flex flex-row align-items-center justify-content-around disable_div";
			}
			},0)*/
			
			if(this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data){
				let fetchedData:any =  this.appModel.content.contentData.data;
				this.instructiontext = fetchedData.instructiontext;
				this.common_assets = fetchedData.commonassets;
			this.speaker = fetchedData.speaker;
			this.myoption = fetchedData.optionArray;
			//console.log("myoption : "+this.myoption);
			this.question = fetchedData.quesObj;
			this.feedback = fetchedData.feedback;
			//this.answers = fetchedData.answers;
			//this.optionBlank = fetchedData.optionsBlank;
			//this.quesInfo = fetchedData.common_assets;
			//this.isFirstQues = fetchedData.isFirstQues;
			this.noOfImgs = fetchedData.imgCount;
			this.isLastQues = this.appModel.isLastSection;
			this.isLastQuesAct = this.appModel.isLastSectionInCollection;
			//this.isAutoplayOn = this.appModel.autoPlay;
            this.appModel.setQuesControlAssets(this.common_assets.ques_control);
			// setTimeout(()=>{
			// 	if(this.navBlock && this.navBlock.nativeElement){
			// 		this.navBlock.nativeElement.className="d-flex flex-row align-items-center justify-content-around";
			// 	}
			// },200)
			}else{
				/*this.speaker = "";
				this.myoption = [];
				this.question = "";
				this.feedback = "";
				this.answers = ""
				this.optionBlank = "";
				this.quesInfo = "";*/
			}
			
			/*setTimeout(()=>{
				 if(this.appModel){
					let autoPlay =  this.appModel.isAutoPlay();
				if(autoPlay){
					if(this.autoPlayOnOffContainer && this.autoPlayOnOffContainer.nativeElement){
						this.autoPlayOnOffContainer.nativeElement.children[1].checked = true;
						this.autoplay_text = "On";
						this.isAutoplayOn = true;
						this.appModel.updateAutoPlay(true);
					}
				}else{
					if(this.autoPlayOnOffContainer && this.autoPlayOnOffContainer.nativeElement){
						this.autoPlayOnOffContainer.nativeElement.children[1].checked = false;
						this.autoplay_text = "Off";
						this.isAutoplayOn = false;
						this.appModel.updateAutoPlay(false);
					}
				} 
				 }
			 },0)*/
		}
			
			
		onHoverOptions(option,index){
			//  if(!this.narrator_voice.nativeElement.paused){
			// 	console.log("narrator voice still playing");
			//  }
			//  else{
			let speakerEle= document.getElementsByClassName("speakerBtn")[0].children[1] as HTMLAudioElement ;
			if(!speakerEle.paused) {
				speakerEle.pause();
				speakerEle.currentTime=0;
				this.speaker.imgsrc=this.speaker.imgorigional;
			}
				this.myoption[index].imgsrc =this.myoption[index].imgsrc_hover;
				//this.ansBlock.nativeElement.children[index].children[0].className = "pointer";
			 //}
		}

		onHoveroutOptions(option,index){
			//console.log("out",option);
			this.myoption[index].imgsrc =this.myoption[index].image_original;
			//this.ansBlock.nativeElement.children[index].children[0].className = "";
		
			
			
		}
		onHoverPlay(option,index){
			//  if(!this.narrator_voice.nativeElement.paused){
			// 	console.log("narrator voice still playing");
			//  }
			//  else{
				if(!this.videoPlayed) {
					this.myoption[index].play_button_normal =this.myoption[index].play_button_hover;
				}
				//this.ansBlock.nativeElement.children[index].children[0].className = "pointer";
			 //}
		}
		onHoveroutPlay(option,index){
			//console.log("out",option);
			if(!this.videoPlayed) {
			  this.myoption[index].play_button_normal =this.myoption[index].play_button_original;
			}
			//this.ansBlock.nativeElement.children[index].children[0].className = "";		
		}
		onHoverhelp(option){
			//console.log("in",option);
			if(!this.narrator_voice.nativeElement.paused){
				this.helpbtn.nativeElement.className="";
				console.log("narrator voice still playing");
			}
			else{
				option.help =option.helphover;
				this.helpbtn.nativeElement.className="pointer"; 
			}
		}

		onHoverouthelp(option){
			//console.log("out",option);
			option.help = option.helpOriginal;
			
		}

		// onHoverSpeaker(){
        //    if(!this.videoPlayed && !this.speakerPlayed) {
		// 	   this.speaker.imgsrc=this.speaker.imghover;
		//    }
		// }
		// onHoveroutSpeaker() {
		// 	if(!this.videoPlayed && !this.speakerPlayed) {
		// 		this.speaker.imgsrc=this.speaker.imgorigional;
		// 	}
		// }
		
		// onHoverSpeaker(){
		// 	if(!this.narrator_voice.nativeElement.paused){
		// 		this.disableSpeaker.nativeElement.className="speakerBtn";
		// 		console.log("narrator voice still playing");
		// 	 }
		// 	 else{
		// 		this.disableSpeaker.nativeElement.className="speakerBtn pointer";
		// 	 }
		// }
		onHoverAageyBadheinBtn(){
				this.common_assets.aagey_badhein = this.common_assets.aagey_badhein_hover;
		}
		onLeaveAageyBadheinBtn(){
			this.common_assets.aagey_badhein = this.common_assets.aagey_badhein_original;
		}
		onHoverPeecheyBtn(){
				this.common_assets.peechey_jayein = this.common_assets.peechey_jayein_hover;
		}
		onLeavePeecheyBtn(){
			this.common_assets.peechey_jayein = this.common_assets.peechey_jayein_original;
		}
		onHoverZaariRakhein(){
			this.quesInfo.zaariRakhein = this.quesInfo.zaariRakhein_hover; 
		}
		onHoverOutZaariRakhein(){
			this.quesInfo.zaariRakhein = this.quesInfo.zaariRakhein_original;
		}
		
		playSound(sound) {
			// plays a sound
			if(this.myAudiohelp && this.myAudiohelp.nativeElement){
				this.myAudiohelp.nativeElement.pause();
			}
			this.audio.src =  sound;
			this.audio.load();
			this.audio.play();		
        }
		
		helpSpeaker(el : HTMLAudioElement){
			
			if(!this.narrator_voice.nativeElement.paused){
				console.log("narrator voice still playing");
			}
			else{
					if(el.id=="S"){
					 this.myAudiohelp.nativeElement.pause();
						if(el.paused) {
						el.currentTime = 0;
						el.play(); 
						}
						else{
						el.currentTime = 0;
						el.play();
						}
						//this._sharedService.speaker_counter++;
						//this._sharedService.speakerbutton();
						//console.log("speaker_counter:",this._sharedService.speaker_counter);
						this.speakerTimer = setInterval(()=>{
							this.checkSpeakerVoice();
						},100)
					
					}
					else{
					   console.log("help zone.....");
					   if(this.myAudiospeaker && this.myAudiospeaker.nativeElement){
						  this.myAudiospeaker.nativeElement.pause(); 
					   }
						el.pause();
						el.currentTime = 0;
						el.play();
						if(this.maincontent){
							this.maincontent.nativeElement.className = "disable_div";
						}
						el.onended =()=>{
							if(this.maincontent){
								this.maincontent.nativeElement.className = "";
							}
						}
				 
					}
			  
			}
		}
		checkSpeakerVoice(){
			if(!this.audioEl.nativeElement.paused){
				//this.speakerNormal.nativeElement.style.display ="none";
				this.sprite.nativeElement.style.display ="block";
			}else{
				//this.speakerNormal.nativeElement.style.display ="block";
				this.sprite.nativeElement.style.display ="none";
				clearInterval(this.speakerTimer);
			}
			
		}
		
		stopAllSounds(e) {
	    //console.log("Event", e);
		 if(!this.narrator_voice.nativeElement.paused){
			   e.stopPropagation();
			   console.log("narrator voice still playing");
		 }
		 else{}
		}
		checkAnswer(option) {          
			if(option.id == this.feedback.correct_answer) {
				 alert("right");
				 this.Sharedservice.setShowAnsEnabled(true);
			} else {
				 this.wrongCount++;
				 if(this.wrongCount == 3) {
					this.Sharedservice.setShowAnsEnabled(true);
				 }
				 alert("wrong");
				 this.idArray =[];
				 for(let i of this.myoption){
				 this.idArray.push(i.id);
			 } 
			 this.doRandomize(this.myoption);
			}			
		}
		playSpeaker() {
			//(document.getElementById("optionsBlock") as HTMLElement).style.pointerEvents="none";
			this.speakerPlayed=true;
			this.speaker.imgsrc=this.speaker.imgactive;
			let speakerEle= document.getElementsByClassName("speakerBtn")[0].children[1] as HTMLAudioElement ;
			speakerEle.play();
			speakerEle.onended=() => {
				this.speaker.imgsrc=this.speaker.imgorigional;
				//(document.getElementById("optionsBlock") as HTMLElement).style.pointerEvents="";
				this.speakerPlayed=false;
			}
		}

		playVideo(option,index) {
		  console.log("video started");
		  this.videoPlayed=true;
		  this.myoption[index].play_button_normal=this.myoption[index].play_button_selected;
		  this.videoStage.nativeElement.src=this.myoption[index].videosrc.location=="content" ? this.contentgFolderPath +"/"+ this.myoption[index].videosrc.url : this.assetsfolderlocation +"/"+ this.myoption[index].videosrc.url;
		  this.videoStage.nativeElement.play();
		  let optionBlock= document.getElementById("optionsBlock") as HTMLElement;
		  optionBlock.style.pointerEvents="none";
		  (document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents="none";
		  this.videoStage.nativeElement.onended = () => {
			this.videoPlayed=false;
			this.myoption[index].play_button_normal=this.myoption[index].play_button_original;
			optionBlock.style.pointerEvents="";
			(document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents="";
		  }
		}


		doRandomize(array) {

		    var currentIndex = array.length, temporaryValue, randomIndex;

		   // While there remain elements to shuffle...
		    while (0 !== currentIndex) {

				// Pick a remaining element...
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;
				var img_hover1 = array[currentIndex].imgsrc_hover;
				var text1 = array[currentIndex].imgsrc;
				var text1copy = array[currentIndex].image_original;
				//var optionBg1 = array[currentIndex].option_bg;
				
				var img_hover2 = array[randomIndex].imgsrc_hover;
				var text2 = array[randomIndex].imgsrc;
				var text2copy = array[randomIndex].image_original;
				//var optionBg2 = array[randomIndex].option_bg;
				// And swap it with the current element.
				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
				
				// array[currentIndex].imgsrc_hover = img_hover1;
				// array[currentIndex].imgsrc = text1;
				// array[currentIndex].image_original = text1copy;
				// //array[currentIndex].option_bg = optionBg1;
				
				// array[randomIndex].imgsrc_hover = img_hover2;
				// array[randomIndex].imgsrc = text2;
				// array[randomIndex].image_original = text2copy;
				//array[randomIndex].option_bg = optionBg2;
				
			}
			var flag=this.arraysIdentical(array,this.idArray);
			console.log(flag);
			if(flag){
				this.doRandomize(array);
			}
			else{
				
			}

	    }
		
		arraysIdentical(a, b) {
			console.log("checking:",a,b);
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
		
	    isPaused(){
			return this.audio.paused;
		} 
		checkNextActivities(){
			if(this.isPaused()){
					this.removeEvents();
						
						var popup=document.getElementById("correctAns")
						popup.className ="d-flex align-items-center justify-content-center hideit";
						//disable click on options and speaker
						var optionsBlock=document.getElementById("optionsBlock")
						optionsBlock.className = optionsBlock.className.concat(" disable");
						if(!this.appModel.autoPlay && !this.isLastQues && this.isLastQuesAct){
							this.blink = true;
						}
						if((this.appModel.autoPlay && !this.isLastQues) || !((this.isLastQuesAct)) ||((this.isLastQuesAct && this.appModel.autoPlay && !this.isLastQues))){
							this.next();
						}else{
							//disable all the option
							//this.optionBlock.nativeElement.className= "disableDiv";
						}
					//if(this.currentIdx == this.optionslist.length-1 && !this.isLastActivity && this._sharedService.autoplay_var==0){
					
						
					//}

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
			else{
				console.log("feedback_audio still playing");
			}
		}
		// previous function
        previous(){
			if(this.common_assets && this.common_assets.peechey_jayein){
			this.common_assets.peechey_jayein = this.common_assets.peechey_jayein_original;
			}
			if(this.common_assets && this.common_assets.aagey_badhein){
			this.common_assets.aagey_badhein = this.common_assets.aagey_badhein_original;
			}
			// setTimeout(()=>{
			// 	if(this.navBlock && this.navBlock.nativeElement){
			// 		this.navBlock.nativeElement.className="d-flex flex-row align-items-center justify-content-around disable_div";
			// 	}
			// },0)
			//console.log("prev",this.currentIdx);	
			this.blink=false;
			this.reset();
			
            this.currentIdx--;
			this.appModel.previousSection();
			//this.setData();
			this.appModel.setLoader(true);
        }
	
	
	    next(){
				if(!this.hasEventFired){
					if(this.isLastQuesAct){
						this.hasEventFired = true;
						this.appModel.event = {'action': 'segmentEnds'};
					}
					if(this.isLastQues){
						this.appModel.event = {'action': 'end'};	
					}
				}
			if(this.common_assets && this.common_assets.peechey_jayein){
			this.common_assets.peechey_jayein = this.common_assets.peechey_jayein_original;
			}
			if(this.common_assets && this.common_assets.aagey_badhein){
			this.common_assets.aagey_badhein = this.common_assets.aagey_badhein_original;
			}
			
			if(!this.isLastQues){
				// setTimeout(()=>{
				// 	if(this.navBlock && this.navBlock.nativeElement){
				// 		this.navBlock.nativeElement.className="d-flex flex-row align-items-center justify-content-around disable_div";
				// 	}
				// },0)
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
			 this.blink=false;
			 clearTimeout(this.timernextseg);
			 if(this.fireworks && this.fireworks.nativeElement){
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
			if(this.myAudiohelp && this.myAudiohelp.nativeElement)
			this.myAudiohelp.nativeElement.pause();
			if(this.myAudiospeaker && this.myAudiospeaker.nativeElement)
			this.myAudiospeaker.nativeElement.pause();
			//this._sharedService.correct_option_attempt_counter =0;
			//this._sharedService.attempt_counter =0;
			//this._sharedService.first_option_selected =0;
			//this._sharedService.first_option_selected_data="none";
			//this._sharedService.speaker_counter =0;
			if(this.myAudiohelp && this.myAudiohelp.nativeElement)
			this.myAudiohelp.nativeElement.pause();
			var popup=document.getElementById("correctAns")
			if(popup){
				popup.className ="d-flex align-items-center justify-content-center hideit";
			}
			
			var optionsBlock=document.getElementById("optionsBlock");
			if(optionsBlock){
				optionsBlock.className = "d-flex flex-row align-items-center justify-content-around row1";
			}
			
			var disableSpeaker=document.getElementById("disableSpeaker");
			if(disableSpeaker){
				disableSpeaker.className = "speakerBtn pointer";
			}
			
			//this.ans.nativeElement.src=this.question.img_sentence_org;
		
		}

	
		/*resizeContainer(){
			let containerBlock: HTMLElement = this.containerBlock.nativeElement as HTMLElement
			console.log(this.containerBlock.nativeElement);
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
		
		closeTitleScreen(){
			this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeOutAnimation";
			setTimeout(()=>{
				this.showIntroScreen = false;
				this.next();
			},200)
			
		}
		
		//start

	     templatevolume(vol,obj) {
			if(obj.narrator_voice && obj.narrator_voice.nativeElement){
				obj.narrator_voice.nativeElement.volume = obj.appModel.isMute?0:vol;
			}
			if(obj.clapSound && obj.clapSound.nativeElement){
				obj.clapSound.nativeElement.volume = obj.appModel.isMute?0:vol;
			}
			if(obj.buzzerSound && obj.buzzerSound.nativeElement){
				obj.buzzerSound.nativeElement.volume = obj.appModel.isMute?0:vol;
			}
			if(obj.myAudiospeaker && obj.myAudiospeaker.nativeElement){
				obj.myAudiospeaker.nativeElement.volume = obj.appModel.isMute?0:vol;
			}
			if(obj.myAudiohelp && obj.myAudiohelp.nativeElement){
				obj.myAudiohelp.nativeElement.volume = obj.appModel.isMute?0:vol;
			}
			if(obj.titleAudio && obj.titleAudio.nativeElement){
				obj.titleAudio.nativeElement.volume = obj.appModel.isMute?0:vol;
			}			
			if(obj.audioEl && obj.audioEl.nativeElement){
				obj.audioEl.nativeElement.volume =obj.appModel.isMute?0:vol;
			}  
			if(obj.audio){
				obj.audio.volume =obj.appModel.isMute?0:vol;
			}
		 }
		//end
		
		
					
		ngOnInit() {

			this.setTemplateType();
				this.contentgFolderPath=this.basePath;
				this.appModel.functionone(this.templatevolume,this);//start end
				/*window.onresize = (e) =>{
				 this.resizeContainer();
				}*/

				if(this.appModel.isNewCollection){
				//console.log("chck:",this.appModel.isNewCollection);
				this.appModel.event = {'action': 'segmentBegins'};
				}
				let fetchedData:any=this.appModel.content.contentData.data;
				console.log("init:",this.appModel.content.contentData.data);
				if(fetchedData.titleScreen){
					this.quesInfo=fetchedData;
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
				else{
					this.showIntroScreen = false;
					this.setData();
				}
				// setTimeout(()=>{
				// 	if(this.navBlock && this.navBlock.nativeElement){
				// 		this.navBlock.nativeElement.className="d-flex flex-row align-items-center justify-content-around disable_div";
				// 	}
				// },0)
		}
		
		 ngAfterViewChecked(){
			 if(this.titleAudio && this.titleAudio.nativeElement){
				this.titleAudio.nativeElement.onended = () => {
				this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeInAnimation";
				} 
			 }
			 this.templatevolume(this.appModel.volumeValue,this);
			 /* if(!this.resizeFlag){
					this.resizeContainer();
			}*/
		 }
		 
		 checkImgLoaded(){
			 if(!this.LoadFlag){
				this.noOfImgsLoaded++;
				if(this.noOfImgsLoaded>=this.noOfImgs){
					this.appModel.setLoader(false);
					document.getElementById("container").style.opacity="1";
					clearTimeout(this.loaderTimer);
					this.LoadFlag = true;
					// this.optionsBlock.nativeElement.style.opacity="1";
					// document.getElementById("footerNavBlock").style.opacity="1";
					this.checkforQVO();
					// if(this.narrator_voice && this.narrator_voice.nativeElement){
					// 	this.narrator_voice.nativeElement.play();
					// }
				} 
			 }
		}

		checkforQVO(){
			if (this.question && this.question.quesInstruction && this.question.quesInstruction.url && this.question.quesInstruction.autoPlay) {
					//this.narrator_voice.nativeElement.src = this.question.quesInstruction.location=="content" ? this.contentgFolderPath+ "/" + this.question.quesInstruction.url+"?someRandomSeed="+ Math.random().toString(36):this.assetsfolderlocation + "/" + this.question.quesInstruction.url+"?someRandomSeed="+ Math.random().toString(36);
					this.appModel.handlePostVOActivity(true);
					this.optionsBlock.nativeElement.classList = "disable_div";
					(document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents="none";
					this.narrator_voice.nativeElement.play();
					this.narrator_voice.nativeElement.onended = () => {
					  //this.appModel.handlePostVOActivity(false);
					  this.optionsBlock.nativeElement.classList = "";
					  (document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents="";
					}
				} 
			}
		 
		  updateAutoplay(){
			if(this.autoPlayOnOffContainer && this.autoPlayOnOffContainer.nativeElement){
				if(this.autoPlayOnOffContainer.nativeElement.children[1].checked){
					this.autoplay_text = "On"
					this.isAutoplayOn = true;
					this.appModel.updateAutoPlay(true);
				}else{
					this.autoplay_text = "Off"
					this.isAutoplayOn = false;
					this.appModel.updateAutoPlay(false);
				}
			}
		}

		setTemplateType(): void {
			// send message to subscribers via observable subject
			this.ActivatedRoute.data.subscribe(data => {			
				this.Sharedservice.sendData(data);
     		})
			
		}


		clearData(): void {
			// clear message
			this.Sharedservice.clearData();
		}

}
