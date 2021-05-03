import { Component , OnInit ,HostListener ,ViewChild } from '@angular/core';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { PlayerConstants } from '../../../common/playerconstants';
import 'jquery';
declare var $: any;

@Component({
  selector: 'app-template4',
  templateUrl: './template4.component.html',
  styleUrls: ['./template4.component.scss']
})
export class Template4Component  implements OnInit{
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
	  
	 
	  @ViewChild('fireworks')  fireworks: any;
	  @ViewChild('narrator_voice') narrator_voice: any;
	  @ViewChild('myAudiospeaker') myAudiospeaker: any;
	  @ViewChild('myAudiohelp') myAudiohelp: any;
	  @ViewChild('container') containerBlock: any;
	  @ViewChild('titleNavBtn') titleNavBtn: any;
	  @ViewChild('sprite') sprite: any;
	  @ViewChild('speakerNormal') speakerNormal: any;
	  @ViewChild('audioEl') audioEl: any;
	  @ViewChild('helpbtn')  helpbtn: any; 
	  @ViewChild('ansBlock')  ansBlock: any;
	  @ViewChild('disableSpeaker')  disableSpeaker: any;
	  @ViewChild('correctAns')  correctAns: any;
	  @ViewChild('navBlock') navBlock:any;
	  @ViewChild('buzzerSound')  buzzerSound: any;
	  @ViewChild('titleAudio')  titleAudio: any;
	  @ViewChild('autoPlayOnOffContainer') autoPlayOnOffContainer:any;
	  @ViewChild('maincontent') maincontent:any;
		
		
		disableHelpBtn:boolean = false;
		timernextseg:any;
		containgFolderPath:any;
		// initialize all variables
			i=0;
			currentIdx = 0;
			j:number=0;
			ans_idx:number=0;
			optimage:any;
			bool:boolean=false;
			audio =new Audio();
			Instruction:any = [];
			optionslist:any = [];
			optionslist_main:any = [];
			speaker:any = "";
			myoption:any = [];
			question:any = "";
			answers:any = "";
			optionBlank:any = "";
			isLastActivity:boolean = false;
			feedback:any = "";
			autoplay_text:string = "";
			resizeFlag:boolean = false;
			assetspath:any;
			assetsfolderlocation:string="";
			common_assets:any = "";
			/*Instruction = this._sharedService.navigatetoroute.Instruction;
			optionslist = this._sharedService.navigatetoroute.main;
			optionslist_main = this._sharedService.navigatetoroute.main[this.currentIdx];
			speaker = this.optionslist[this.currentIdx].speaker;
			myoption = this.optionslist[this.currentIdx].options;
			question = this.optionslist[this.currentIdx].ques;
			feedback = this.optionslist[this.currentIdx].feedback;
			answers = this.optionslist[this.currentIdx].answers;
			optionBlank =this.optionslist[this.currentIdx].optionsBlank;
			*/
			
			
			blink:boolean = false;
			showIntroScreen:boolean;
			speakerTimer:any;
			quesInfo:any="";
			isFirstQues:boolean;
			isLastQues:boolean = false;
			isAutoplayOn:boolean;
			isLastQuesAct:boolean;
			idArray:any = [];
			
			noOfImgs:number;
			noOfImgsLoaded:number = 0;
			loaderTimer:any;
			LoadFlag:boolean = false;
			hasEventFired:boolean = false;
		

		
		closeTitleScreen(){
			this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeOutAnimation";
			setTimeout(()=>{
				this.showIntroScreen = false;
				this.next();
			},200)
			
		}
		get basePath(): any {
			 console.log('temponeComponent: path=', this.appModel.content.id + '/' + this.appModel.content.contentData.data['path']);
			if(this.appModel && this.appModel.content){
			
				 return this.appModel.content.id + '';
			}
		}	
		
		ngOnInit() {
				this.assetspath=this.basePath;
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
		 }
		 
		 
		ngAfterViewChecked(){
			 if(this.titleAudio && this.titleAudio.nativeElement){
				this.titleAudio.nativeElement.onended = () => {
				this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeInAnimation";
				} 
			 }
			 this.templatevolume(this.appModel.volumeValue,this);
			 /*if(!this.resizeFlag){
					this.resizeContainer();
			}*/
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
				this.reset();
				//console.log("i m next:",this.currentIdx, this.optionslist.length-1);
				//enable click on options and speaker
					var optionsBlock=document.getElementById("optionsBlock")
					var disableSpeaker=document.getElementById("disableSpeaker")
					if(optionsBlock)
					optionsBlock.className = "d-flex justify-content-around row1";
					if(disableSpeaker)
					disableSpeaker.className = "speakerBtn pointer";
					this.appModel.nextSection();
					//this.setData();
					this.appModel.setLoader(true);
			}				  
		}
		
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
		this.blink=false;
			this.appModel.previousSection();
			//this.setData();
			this.appModel.setLoader(true);
        }
		
	setData(){
		if(this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data){
			let fetchedData:any =  this.appModel.content.contentData.data;
			this.speaker = fetchedData.speaker;
			this.myoption = fetchedData.options;
			this.question = fetchedData.ques;
			this.feedback = fetchedData.feedback;
			this.answers = fetchedData.answers;
			this.isFirstQues = fetchedData.isFirstQues;
			this.isLastQues = this.appModel.isLastSection;
			this.isLastQuesAct = this.appModel.isLastSectionInCollection;
			this.noOfImgs = fetchedData.imgCount;
			this.common_assets = fetchedData.common_assets;
			//this.isAutoplayOn = this.appModel.autoPlay;
			console.log(this.appModel.content);
			setTimeout(()=>{
				if(this.navBlock && this.navBlock.nativeElement){
					this.navBlock.nativeElement.className="d-flex flex-row align-items-center justify-content-around";
				}
			},200)
		}else{
			/*this.speaker = "";
			this.myoption = [];
			this.question = "";
			this.feedback = "";
			this.answers = "";*/
		}
		
	}
	
	checkAnswer(option,event,idx) {
			
			// Analytics called for attempt counter & first option is clicked
			if(this.myAudiohelp && this.myAudiohelp.nativeElement){
				this.myAudiohelp.nativeElement.pause();
				this.myAudiohelp.nativeElement.currentTime = 0;
			}
			
			if(!this.narrator_voice.nativeElement.paused){
				console.log("narrator voice still playing");
			}
			else{
				this.disableHelpBtn = true;
			// logic to check what user has done is correct
			if(option.custom_id == this.answers[this.i].custom_id && this.i<this.answers.length){
				
				this.myAudiospeaker.nativeElement.pause();
				this.myAudiohelp.nativeElement.pause();
				console.log("when correct answer clicked",event.toElement);
				// empty cloud
				event.toElement.className ="img-fluid emptyoption"
				
				console.log("i have hit correct sequence");

				//visibility true and call loadImage()
				if(this.j < this.answers.length){
					console.log("loadImage would be called");
				//this.loadImage(this.answers[this.j].imgsrc, document.getElementById("div"+this.j));
				this.j++;
				}
				document.getElementById("div"+this.i).style.visibility = "visible";
				this.i++;
				console.log("check:",this.i,this.answers.length);
				if(this.i==this.answers.length)
				{
				//fireworks POC
				// call to play answer sound and show popup
				this.playSound(this.feedback.write_ans_sound.path.url);
				//this.isLastQues = this.appModel.isLastSection;
				
					let correctAns: HTMLElement = this.correctAns.nativeElement as HTMLElement
					correctAns.className = "d-flex align-items-center justify-content-center showit";
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
				
			
			}


			else{
				this.myAudiospeaker.nativeElement.pause();
				console.log("when wrong answer clicked");
				//set all options again 
				
				for (const {item, index} of this.myoption.map((item, index) => ({ item, index }))) {
					console.log("index",index);
					item.imgsrc=item.imgOriginal;
					document.getElementById("div"+index).style.visibility = "hidden";
					//this.UnloadImage(document.getElementById("div"+index));
					
				}
				for(this.j=0;this.j< this.answers.length;this.j++){
				document.getElementById("optimage"+this.j).className ="img-fluid"
				}
				this.i=0;
				this.j=0;
				// call to play answer sound

				if(this.buzzerSound && this.buzzerSound.nativeElement){
					this.buzzerSound.nativeElement.play();
				}

				console.log("try again",event,idx);
				//vibrate POC
				$("#optblank"+idx).addClass("animation-shake");
				$("#optimage"+idx).addClass("animation-shake");
				this.ansBlock.nativeElement.className="d-flex justify-content-around row1 disable";
				
				
				this.buzzerSound.nativeElement.onended = () => {
				$("#optblank"+idx).removeClass("animation-shake");
				$("#optimage"+idx).removeClass("animation-shake");
	
					this.idArray =[];
						for(let i of this.myoption){
						this.idArray.push(i.id);
					} 
					this.doRandomize(this.myoption);
					setTimeout(()=>{
						this.ansBlock.nativeElement.className="d-flex justify-content-around row1";
					},200)
				}
				

			}
			}
			

		}
		
		checkNextActivities(){
			if(this.isPaused()){
				this.removeEvents();
					
						var popup=document.getElementById("correctAns")
						popup.className ="d-flex align-items-center justify-content-center hideit";
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
		removeEvents() {
			 // remove event handlers for all clickable items in the dom
			 this.blink=false;
			 clearTimeout(this.timernextseg);
			 let elfireworks: HTMLElement = this.fireworks.nativeElement as HTMLElement
			 elfireworks.className = "d-flex align-items-center justify-content-center hideit";
  }

  close() {
    //this.appModel.event = { 'action': 'exit', 'currentPosition': this.currentVideoTime };
    this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
  }
		
		 playSound(sound) {
        // plays a sound
			if(this.myAudiospeaker && this.myAudiospeaker.nativeElement){
				this.myAudiospeaker.nativeElement.pause();
				this.myAudiohelp.nativeElement.pause();
			}
			this.audio.src =  sound;
			this.audio.load();
			this.audio.play();		
        }
		
		isPaused(){
			return this.audio.paused;
		} 
		
		stopAllSounds(e) {
		 if(!this.narrator_voice.nativeElement.paused){
			   e.stopPropagation();
			   console.log("narrator voice still playing");
		 }
		 else{}
		}
		onHoverOptions(option,idx){
			//console.log("in",option);
			 if(!this.narrator_voice.nativeElement.paused){
				console.log("narrator voice still playing");
			 }
			 else{
				option.image =option.imagehover;
				this.ansBlock.nativeElement.children[idx].className="options pointer";
			 }
		}

		onHoveroutOptions(option,idx){
			//console.log("out",option);
			  option.image =option.imageorg;
			  this.ansBlock.nativeElement.children[idx].className="options";
			
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
		
		doRandomize(array) {

		    var currentIndex = array.length, temporaryValue, randomIndex;

		   // While there remain elements to shuffle...
		    while (0 !== currentIndex) {

				// Pick a remaining element...
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;
				var img_hover1 = array[currentIndex].imagehover;
				var text1 = array[currentIndex].image;
				var text1copy = array[currentIndex].imageorg;
				
				var img_hover2 = array[randomIndex].imagehover;
				var text2 = array[randomIndex].image;
				var text2copy = array[randomIndex].imageorg;
				// And swap it with the current element.
				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
				
				array[currentIndex].imagehover = img_hover1;
				array[currentIndex].image = text1;
				array[currentIndex].imageorg = text1copy;
				
				array[randomIndex].imagehover = img_hover2;
				array[randomIndex].image = text2;
				array[randomIndex].imageorg = text2copy;
				
			}

			return array;

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
		onHover(option){
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

		onHoverout(option){
			//console.log("out",option);
			option.help = option.helpOriginal;
			
		}
		
		playSound_Speaker(el: HTMLAudioElement){
			if(!this.narrator_voice.nativeElement.paused){
				console.log("narrator voice still playing");
			}
			else{
					if(el.id=="S"){
					 this.myAudiohelp.nativeElement.pause();
					 //this._sharedService.speaker_counter++;
					// this._sharedService.speakerbutton();
						//console.log("speaker_counter:",this._sharedService.speaker_counter);
						this.speakerTimer = setInterval(()=>{
							this.checkSpeakerVoice();
						},100)
						
							if (el.paused) {
							el.currentTime = 0;
							el.play(); 
							}
							else{
							el.currentTime = 0;
							el.play();
							}
					}
					else{
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
				this.speakerNormal.nativeElement.style.display ="none";
				this.sprite.nativeElement.style.display ="block";
			}else{
				this.speakerNormal.nativeElement.style.display ="block";
				this.sprite.nativeElement.style.display ="none";
				clearInterval(this.speakerTimer);
			}
			
		}
		
		reset() {
			if(this.correctAns && this.correctAns.nativeElement){
				let correctAns: HTMLElement = this.correctAns.nativeElement as HTMLElement
				correctAns.className = "d-flex align-items-center justify-content-center hideit";
			}
			if(this.fireworks && this.fireworks.nativeElement){
				let elfireworks: HTMLElement = this.fireworks.nativeElement as HTMLElement
				elfireworks.className = "d-flex align-items-center justify-content-center hideit";
			}
			  // will reset all what user performed
			this.audio.pause();
			if(this.myAudiohelp && this.myAudiohelp.nativeElement)
			this.myAudiohelp.nativeElement.pause();
			if(this.answers && this.answers.length){
				for(this.j=0;this.j< this.answers.length;this.j++){
				document.getElementById("div"+this.j).style.visibility = "hidden";
				document.getElementById("optimage"+this.j).className ="img-fluid"
				
				}
			}
			
				
				//enable click on options and speaker
				var optionsBlock=document.getElementById("optionsBlock")
				var disableSpeaker=document.getElementById("disableSpeaker")
				if(optionsBlock)
				optionsBlock.className = "d-flex justify-content-around row1";
				if(disableSpeaker)
				disableSpeaker.className = "speakerBtn";
				this.i=0;
				this.j=0;
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
