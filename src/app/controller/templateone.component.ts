import { Component , OnInit ,HostListener ,ViewChild ,OnDestroy} from '@angular/core';
import { ApplicationmodelService } from '../model/applicationmodel.service';
import { PlayerConstants } from '../common/playerconstants';


import 'jquery';


declare var $: any;

@Component({
    selector: 'tempone',
    templateUrl: '../view/layout/templateone.component.html',
    styleUrls: ['../view/css/templateone.component.css', '../view/css/bootstrap.min.css'],

})

export class TemplateoneComponent implements OnInit{
 private appModel: ApplicationmodelService;
	constructor(appModel: ApplicationmodelService) {
		this.appModel = appModel;
		this.assetsfolderlocation=this.appModel.assetsfolderpath;
		this.appModel.navShow=1;
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
  	 //@ViewChild('ans')  ans: any;
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
	 @ViewChild('buzzerSound') buzzerSound:any;
			assetsfolderlocation:string="";
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
			isFirstQues:boolean;
			isLastQues:boolean = false;
			isAutoplayOn:boolean;
			isLastQuesAct:boolean;
			common_assets:any = "";
			autoplay_text:string = "";
			resizeFlag:boolean = false;
			
			noOfImgs:number;
			noOfImgsLoaded:number = 0;
			loaderTimer:any;
			currentVolume:any;
			disableHelpBtn:boolean = false;
			LoadFlag:boolean = false;
			hasEventFired:boolean = false;
			
			//correctOpt:any;
			
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
			if(this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data){
					let fetchedData:any =  this.appModel.content.contentData.data;
					this.common_assets = fetchedData.common_assets;
					this.speaker = fetchedData.speaker;
					this.myoption = fetchedData.options;
					console.log("myoption : "+this.myoption);
					this.question = fetchedData.ques;
					this.feedback = fetchedData.feedback;
					this.answers = fetchedData.answers;
					this.optionBlank = fetchedData.optionsBlank;
					this.isFirstQues = fetchedData.isFirstQues;
					this.isLastQues = this.appModel.isLastSection;
					this.isLastQuesAct = this.appModel.isLastSectionInCollection;
					
					this.noOfImgs = fetchedData.imgCount;
					
					//this.isAutoplayOn = this.appModel.autoPlay;
					if(fetchedData){
						var disableSpeaker=document.getElementById("disableSpeaker");
						if(disableSpeaker)
						disableSpeaker.className = "speakerBtn pointer";
						var optionsBlock=document.getElementById("optionsBlock")
						if(optionsBlock)
						optionsBlock.className = "d-flex align-items-center justify-content-center";
					//} 
					}
					setTimeout(()=>{
						if(this.navBlock && this.navBlock.nativeElement){
							this.navBlock.nativeElement.className="d-flex flex-row align-items-center justify-content-around";
						}
					},200)
				}else{
					/*this.speaker = "";
					this.myoption = []
					this.question = "";
					this.feedback = "";
					this.answers = "";
					this.optionBlank = "";*/
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
			 if(!this.narrator_voice.nativeElement.paused){
				console.log("narrator voice still playing");
			 }
			 else{
				if(this.myAudiohelp && this.myAudiohelp.nativeElement){
				this.myAudiohelp.nativeElement.pause();
			    }
				if(this.myAudiospeaker && this.myAudiospeaker.nativeElement){
				this.myAudiospeaker.nativeElement.pause();
			    }
				for(let i in this.myoption){
					this.ansBlock.nativeElement.children[i].children[1].pause();
					this.ansBlock.nativeElement.children[i].children[1].currentTime = 0;
					this.ansBlock.nativeElement.children[i].children[0].children[0].className="lip";
					this.ansBlock.nativeElement.children[i].children[0].children[1].className="lipsync hideit";
			
				}
				this.ansBlock.nativeElement.children[index].children[1].play();
				if(this.ansBlock.nativeElement.children[index].children[1].play()){
					this.ansBlock.nativeElement.children[index].children[0].children[0].className="lip hideit";
					this.ansBlock.nativeElement.children[index].children[0].children[1].className="lipsync";
					
				}
				this.ansBlock.nativeElement.children[index].children[1].onended =()=>{
					for(let i in this.myoption){
					this.ansBlock.nativeElement.children[i].children[0].children[0].className="lip";
					this.ansBlock.nativeElement.children[i].children[0].children[1].className="lipsync hideit";
					}
					
				}
			 }
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
		
		onHoverSpeaker(){
			if(!this.narrator_voice.nativeElement.paused){
				this.disableSpeaker.nativeElement.className="speakerBtn";
				console.log("narrator voice still playing");
			 }
			 else{
				this.disableSpeaker.nativeElement.className="speakerBtn pointer";
			 }
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
						for(let i in this.myoption){
						this.ansBlock.nativeElement.children[i].children[1].pause();
						this.ansBlock.nativeElement.children[i].children[1].currentTime = 0;
						$('#lip'+i).show();
						//$('#lipsync'+i).hide();	
						}
					    this.myAudiohelp.nativeElement.pause();
							if(el.paused) {
							el.currentTime = 0;
							el.play(); 
							}
							else{
							el.currentTime = 0;
							el.play();
							}
					
						this.speakerTimer = setInterval(()=>{
							this.checkSpeakerVoice();
						},100)
					
					}
					else{
					   //console.log("help zone.....");
					   for(let i in this.myoption){
					    this.ansBlock.nativeElement.children[i].children[1].pause();
						this.ansBlock.nativeElement.children[i].children[1].currentTime = 0;
						$('#lip'+i).show();
						//$('#lipsync'+i).hide();	
					   }
					   this.myAudiospeaker.nativeElement.pause();
					
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
				this.speakerNormal.nativeElement.style.display ="block";
				this.sprite.nativeElement.style.display ="block";
			}else{
				this.speakerNormal.nativeElement.style.display ="block";
				this.sprite.nativeElement.style.display ="none";
				clearInterval(this.speakerTimer);
			}
			
		}
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
		
		stopAllSounds(e) {
	    //console.log("Event", e);
		 if(!this.narrator_voice.nativeElement.paused){
			   e.stopPropagation();
			   console.log("narrator voice still playing");
		 }
		 else{}
		}
			checkAnswer(option,event,idx) {
				
				if(this.myAudiohelp && this.myAudiohelp.nativeElement){
				this.myAudiohelp.nativeElement.pause();
				this.myAudiohelp.nativeElement.currentTime = 0;
				}
			// Analytics called for attempt counter & first option is clicked
			
				if(!this.narrator_voice.nativeElement.paused){
					console.log("narrator voice still playing");
				}
				else{
					this.disableHelpBtn = true;
					//this._sharedService.optionclickhandler(option.id,option.imgsrc,this.optionslist_main.id);
					//this._sharedService.attempt_counter++;  // called when any option is clicked
					//console.log("attempt_counter>>>>",this._sharedService.attempt_counter);
					//if(this._sharedService.attempt_counter == 1){
					//this._sharedService.first_option_selected=option.id;
					//this._sharedService.first_option_selected_data=option.imgsrc;
					//console.log("first option selected >>>>",this._sharedService.first_option_selected,this._sharedService.first_option_selected_data);
				

					// logic to check what user has done is correct
					if(option.id==this.feedback.correct_ans_index){

						//console.log("i have hit correct sequence",this.assetspath + '/' +this.feedback.write_ans_sound.path);	
						this.playSound(this.assetspath + '/' +this.feedback.write_ans_sound.path.url);
						//this.isLastQues = this.appModel.isLastSection;
							// call to play answer sound and show popup
							//this.correctOpt = option;
							//this.ans.nativeElement.src=this.feedback.write_ans_popup.image;
						
							let elfireworks: HTMLElement = this.fireworks.nativeElement as HTMLElement
							elfireworks.className = "d-flex align-items-center justify-content-center showit";
						
							//disable click on options and speaker
							var optionsBlock=document.getElementById("optionsBlock")
							var disableSpeaker=document.getElementById("disableSpeaker")
							optionsBlock.className = optionsBlock.className.concat(" disable");
							disableSpeaker.className = disableSpeaker.className.concat(" disable");
							
							// question next timeout
							this.timernextseg = setInterval(()=>{
							this.checkNextActivities();
							},500) 
			
					}


						else{

							this.buzzerSound.nativeElement.play();
							if(this.maincontent){
								this.maincontent.nativeElement.className = "disable_div";
							}
							//vibrate POC
							
							console.log("E:",event);
							this.optimage=event.path[1];
							this.optimage.className=this.optimage.className.concat(" animation-shake");
							
							var optionsBlock=document.getElementById("optionsBlock")
							optionsBlock.className = optionsBlock.className.concat(" disable");
						
							this.buzzerSound.nativeElement.onended = () => {
								this.optimage.className = "options";
								setTimeout(()=>{
									this.maincontent.nativeElement.className = "";
								},200)
								//this.opttext.className = "img-fluid";
								var optionsBlock=document.getElementById("optionsBlock")
								optionsBlock.className = "d-flex align-items-center justify-content-center";
									this.optimage.className = "options";

									this.idArray =[];
									for(let i of this.myoption){
									this.idArray.push(i.id);
									}
									this.doRandomize(this.myoption);	
									console.log("random options array: ",this.myoption);
							}
						

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
				
				
				
				// And swap it with the current element.
				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
				
				
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
					
					
						
						//disable click on options and speaker
						var optionsBlock=document.getElementById("optionsBlock")
						optionsBlock.className = optionsBlock.className.concat(" disable");
						var disableSpeaker=document.getElementById("disableSpeaker")
						disableSpeaker.className = "speakerBtn disable";
						if(!this.appModel.autoPlay && !this.isLastQues && this.isLastQuesAct){
							this.blink = true;
						}
						if((this.appModel.autoPlay && !this.isLastQues) || !((this.isLastQuesAct)) ||((this.isLastQuesAct && this.appModel.autoPlay && !this.isLastQues))){
							this.next();
						}else{
							//disable all the option
							//this.optionBlock.nativeElement.className= "disableDiv";
						}
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
			setTimeout(()=>{
				if(this.navBlock && this.navBlock.nativeElement){
					this.navBlock.nativeElement.className="d-flex flex-row align-items-center justify-content-around disable_div";
				}
			},0)
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
				
				setTimeout(()=>{
				if(this.navBlock && this.navBlock.nativeElement){
					this.navBlock.nativeElement.className="d-flex flex-row align-items-center justify-content-around disable_div";
				}
			},0)
			
            //if( this.currentIdx < (this.optionslist.length-1)) {
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
			if(this.myAudiohelp && this.myAudiohelp.nativeElement)
			this.myAudiohelp.nativeElement.pause();
	
			
			var optionsBlock=document.getElementById("optionsBlock");
			if(optionsBlock){
				optionsBlock.className = "d-flex align-items-center justify-content-center";
			}
			for(let i in this.myoption){
					this.ansBlock.nativeElement.children[i].children[0].children[0].className="lip";
					this.ansBlock.nativeElement.children[i].children[0].children[1].className="lipsync hideit";
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
		
		ngOnInit() {
			this.assetspath=this.basePath;
			this.appModel.functionone(this.templatevolume,this);//start end
			if(this.appModel.isNewCollection){
				//console.log("chck:",this.appModel.isNewCollection);
				this.appModel.event = {'action': 'segmentBegins'};
			}
			//this.appModel.event = {'action': 'segmentBegins'};
				/*window.onresize = (e) =>{
				 this.resizeContainer();
				}*/
				let fetchedData:any=this.appModel.content.contentData.data;
				console.log("init:",this.appModel.content.contentData.data);
				if(fetchedData.titleScreen){
					this.quesInfo=fetchedData;
					this.noOfImgs = this.quesInfo.imgCount;
					this.showIntroScreen = true;
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
				setTimeout(()=>{
					if(this.navBlock && this.navBlock.nativeElement){
						this.navBlock.nativeElement.className="d-flex flex-row align-items-center justify-content-around disable_div";
					}
				},0)
		}
		  
		  templatevolume(vol,obj) {
			if(obj.narrator_voice && obj.narrator_voice.nativeElement){
				obj.narrator_voice.nativeElement.volume = obj.appModel.isMute?0:vol;
			}
			if(this.buzzerSound && this.buzzerSound.nativeElement){
				this.buzzerSound.nativeElement.volume = obj.appModel.isMute?0:vol;
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
			if(obj.ansBlock && obj.ansBlock.nativeElement){
				for(let i in obj.myoption){
					obj.ansBlock.nativeElement.children[i].children[1].volume = obj.appModel.isMute?0:vol;
				}
			}
		 }
		 
		ngAfterViewChecked(){
			 if(this.titleAudio && this.titleAudio.nativeElement){
				//this.titleAudio.nativeElement.volume = this.currentVolume;
				this.titleAudio.nativeElement.onended = () => {
				this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeInAnimation";
				} 
			 }
			 this.templatevolume(this.appModel.volumeValue,this);
			/*if(!this.resizeFlag){
				this.resizeContainer();
			} */
		 }
		 
		 checkImgLoaded(){
			 if(!this.LoadFlag){
				this.noOfImgsLoaded++;
				if(this.noOfImgsLoaded>=this.noOfImgs){
					this.appModel.setLoader(false);
					clearTimeout(this.loaderTimer);
					this.LoadFlag = true;
					if(this.narrator_voice && this.narrator_voice.nativeElement){
						this.narrator_voice.nativeElement.play();
					}	
					
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

  }
