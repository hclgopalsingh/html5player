import { Component , OnInit ,HostListener ,ViewChild } from '@angular/core';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { PlayerConstants } from '../../../common/playerconstants';
import 'jquery';
declare var $: any;

@Component({
  selector: 'app-template12',
  templateUrl: './template12.component.html',
  styleUrls: ['./template12.component.scss']
})
export class Template12Component implements OnInit{
	private appModel: ApplicationmodelService;
	constructor(appModel: ApplicationmodelService) {
		this.appModel = appModel;
		this.assetsPath=this.appModel.assetsfolderpath;
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
		
		
		 @ViewChild('titleNavBtn')  titleNavBtn: any;
		 @ViewChild('maincontent')  maincontent: any;
		 @ViewChild('helpBtn')  helpBtn: any;
		 @ViewChild('titleAudio')  titleAudio: any;
		 @ViewChild('titleHelpAudio')  titleHelpAudio: any;
		 @ViewChild('navBlock') navBlock:any;
		 @ViewChild('videoReference') videoReference:any;
		 @ViewChild('videoContainer') videoContainer:any;
		audio =new Audio();
		blink:boolean = false;
		isLastActivity :any = "";
		quesInfo:any;
		helpAudio:any = "";
		isFirstQues:boolean;
		isLastQues:boolean = false;
		showIntroScreen:boolean;
		//isAutoplayOn:boolean;
		isLastQuesAct:boolean;
		questionVideo:any;
		noOfImgs:number;
		noOfImgsLoaded:number = 0;
		loaderTimer:any;
		disableHelpBtn:boolean = false;
		containgFolderPath:string = "";
		assetsPath:string = "";
		loadFlag:boolean = false;
		hasEventFired:boolean = false;

		/*
		to print 
		hasEventFired:boolean = false;
		if(!this.hasEventFired){
				if(this.isLastQuesAct){
					this.hasEventFired = true;
					this.appModel.event = {'action': 'segmentEnds'};
				}
				if(this.isLastQues){
					this.appModel.event = {'action': 'exit'};	
				}
			}
		*/
		
		onHoverHelp(){
				this.quesInfo.help_btn =  this.quesInfo.help_btn_hover; 
		}
		onHoverHelpOut(){
				this.quesInfo.help_btn =  this.quesInfo.help_btn_original;  
		}
		 onHoverZaariRakhein(){
			this.quesInfo.jariRakheinBtn = this.quesInfo.jariRakheinBtn_hover; 
		}
		onHoverOutZaariRakhein(){
			this.quesInfo.jariRakheinBtn = this.quesInfo.jariRakheinBtn_original;
		}
		onHoverAageyBadheinBtn(){
				this.quesInfo.aagey_badhein = this.quesInfo.aagey_badhein_hover;
		}
		onLeaveAageyBadheinBtn(){
			this.quesInfo.aagey_badhein = this.quesInfo.aagey_badhein_original;
		}
		onHoverPeecheyBtn(){
				this.quesInfo.peechey_jayein = this.quesInfo.peechey_jayein_hover;
		}
		onLeavePeecheyBtn(){
			this.quesInfo.peechey_jayein = this.quesInfo.peechey_jayein_original;
		}
		
		
		 ngAfterViewChecked(){
			 if(this.titleAudio && this.titleAudio.nativeElement){
				this.titleAudio.nativeElement.onended = () => {
				this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeInAnimation";
				} 
			 }
			 this.templatevolume(this.appModel.volumeValue,this);
		 }
		 
		 
		closeTitleScreen(){
			this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeOutAnimation";
			setTimeout(()=>{
				this.next();
			},200)
			
		}
		
		setEnability(flag, option_ref) {
		
        }
		// previous function
			previous(){
				if(this.quesInfo){
					this.quesInfo.aagey_badhein = this.quesInfo.aagey_badhein_original;
					this.quesInfo.peechey_jayein = this.quesInfo.peechey_jayein_original;
			    }
				this.audio.pause();
				if(this.titleHelpAudio && this.titleHelpAudio.nativeElement){
					this.titleHelpAudio.nativeElement.pause(); 
					this.titleHelpAudio.nativeElement.currentTime = 0; 
				}
				// remove blinking if exist
				this.blink=false;
				this.appModel.previousSection();
			}
		
       // next function
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
			if(this.quesInfo){
				this.quesInfo.aagey_badhein = this.quesInfo.aagey_badhein_original;
				this.quesInfo.peechey_jayein = this.quesInfo.peechey_jayein_original;
			 }
			if(!this.isLastQues){
			this.audio.pause();
			if(this.titleHelpAudio && this.titleHelpAudio.nativeElement){
				this.titleHelpAudio.nativeElement.pause(); 
				this.titleHelpAudio.nativeElement.currentTime = 0; 
			}
            this.appModel.nextSection();
			}
			
		}
		playSound(sound) {
			if(this.titleHelpAudio && this.titleHelpAudio.nativeElement){
				this.titleHelpAudio.nativeElement.pause(); 
				this.titleHelpAudio.nativeElement.currentTime = 0; 
			}
			this.audio.pause();
			this.audio.src =  sound;
			this.audio.load();
			this.audio.play();
		}
		playSoundHelp(){
			if(this.titleHelpAudio && this.titleHelpAudio.nativeElement){
				this.titleHelpAudio.nativeElement.pause(); 
				this.titleHelpAudio.nativeElement.currentTime = 0; 
				this.titleHelpAudio.nativeElement.play();
				this.videoContainer.nativeElement.className = "disable_div d-flex align-items-center justify-content-around";
				if(this.videoReference && this.videoReference.nativeElement){
					this.videoReference.nativeElement.pause();
					this.titleHelpAudio.nativeElement.onended = () =>{
						this.videoContainer.nativeElement.className = "d-flex align-items-center justify-content-around";
					}
				}
			 }
		}
		checkAnswer(opt,index){}
		isPaused(){
			return this.audio.paused;
		}
		
		
		
		 ngOnInit() {
			this.appModel.functionone(this.templatevolume,this);//start end
			/* window.onresize = (e) =>{
				 if(this.ansDivIndex!=null){
					this.drawConnectingLine(this.div1,this.div2);
				 }
			}*/
			this.containgFolderPath = this.getBasePath();
			if(this.appModel.isNewCollection){
				//console.log("chck:",this.appModel.isNewCollection);
				this.appModel.event = {'action': 'segmentBegins'};
			}
			let fetchedData:any = this.appModel.content.contentData.data;
			if(fetchedData.titleScreen){
				this.quesInfo = fetchedData;
				this.noOfImgs = this.quesInfo.imgCount;
				if(this.quesInfo && this.quesInfo.titleScreen){
					this.showIntroScreen = fetchedData.titleScreen;
				}else{
					this.showIntroScreen = false;
				}
			}else{
				this.setData();
			}
		}
		
		setData(){	
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
			if(this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data){
				let fetchedData:any = this.appModel.content.contentData.data;
				this.isLastQues = this.appModel.isLastSection;
				this.isLastQuesAct = this.appModel.isLastSectionInCollection;
				if(fetchedData && fetchedData.ques && fetchedData.ques.video){
					this.questionVideo = fetchedData.ques.video;
					this.quesInfo = fetchedData.commonassets;
				}
				if(fetchedData && fetchedData.commonassets && fetchedData.commonassets.isFirstQues){
					this.isFirstQues =  fetchedData.commonassets.isFirstQues;
				}
			}else{
				
			}
		}
		
		checkNextActivities(){
			if(this.isPaused()){
				if(!this.hasEventFired){
					if(this.isLastQuesAct){
						this.hasEventFired = true;
						this.appModel.event = {'action': 'segmentEnds'};
					}
					if(this.isLastQues){
						this.appModel.event = {'action': 'end'};	
					}
				}
					this.next();
			}
			else{
				console.log("feedback_audio still playing");
			}
  }

  close() {
    //this.appModel.event = { 'action': 'exit', 'currentPosition': this.currentVideoTime };
    this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
  }
		
		checkVideoLoaded(){
			this.appModel.setLoader(false);
			clearTimeout(this.loaderTimer);
		}
		
		 templatevolume(vol,obj) {
			if(obj.titleHelpAudio && obj.titleHelpAudio.nativeElement){
				obj.titleHelpAudio.nativeElement.volume = obj.appModel.isMute?0:vol;
			}
			if(obj.titleAudio && obj.titleAudio.nativeElement){
				obj.titleAudio.nativeElement.volume = obj.appModel.isMute?0:vol;
			} 
			if(obj.audio){
				obj.audio.volume =obj.appModel.isMute?0:vol;
			}
		 }
		 
		 checkImgLoaded(){
			if(!this.loadFlag){
				this.noOfImgsLoaded++;
				if(this.noOfImgsLoaded>=this.noOfImgs){
					this.appModel.setLoader(false);
					this.loadFlag = true;
					clearTimeout(this.loaderTimer);
				}
			}
		}
		
		getBasePath(){
			if(this.appModel && this.appModel.content){
				 return this.appModel.content.id + '';
			}
		}
		
		playVideo(){
			this.disableHelpBtn = true;
			if(this.videoReference && this.videoReference.nativeElement){
				this.videoReference.nativeElement.play();
				this.quesInfo.play_btn = "";
				this.videoReference.nativeElement.onended =() =>{
					if(!this.hasEventFired){
						if(this.isLastQuesAct){
							this.hasEventFired = true;
							this.appModel.event = {'action': 'segmentEnds'};
						}
						if(this.isLastQues){
							this.appModel.event = {'action': 'end'};	
						}
					}
					if(!this.appModel.autoPlay){
						this.blink = true;
					}else{
						this.next(); 
					}
				} 
			 }
		}
		
	  }