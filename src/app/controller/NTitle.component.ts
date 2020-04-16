import { Component , OnInit ,HostListener ,ViewChild,OnDestroy} from '@angular/core';
import {ApplicationmodelService} from '../model/applicationmodel.service';
import 'jquery';


declare var $: any;

@Component({
    selector: 'new-title',
     templateUrl: '../view/layout/NTitle.component.html',
    styleUrls: ['../view/css/NTitle.component.css', '../view/css/bootstrap.min.css'],

})

export class NTitleComponent implements OnInit{
	private appModel: ApplicationmodelService;
	constructor(appModel: ApplicationmodelService) {
		this.appModel = appModel;
		this.assetsPath=this.appModel.assetsfolderpath;
		this.appModel.setLoader(true);
		// if error occured during image loading loader wil stop after 5 seconds 
		this.loaderTimer = setTimeout(()=>{
			this.appModel.setLoader(false);
		},5000)
	}
		
		 @ViewChild('container')  containerBlock: any;
		 @ViewChild('titleNavBtn')  titleNavBtn: any;
         @ViewChild('titleAudio')  titleAudio: any;
         
        quesInfo:any = "";
        
		noOfImgs:number;
		noOfImgsLoaded:number = 0;
		loaderTimer:any;
		containgFolderPath:string = "";
		assetsPath:string = "";
        loadFlag:boolean = false;

		 onHoverZaariRakhein(){
			this.quesInfo.jariRakheinBtn = this.quesInfo.jariRakheinBtn_hover; 
		}
		onHoverOutZaariRakhein(){
			this.quesInfo.jariRakheinBtn = this.quesInfo.jariRakheinBtn_original;
		}
		
		 ngAfterViewChecked(){
			if(this.titleAudio && this.titleAudio.nativeElement){
				this.titleAudio.nativeElement.onended = () => {
					setTimeout(()=>{
						this.next();
					},500)
				// this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeInAnimation";
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
		// previous function
			previous(){
				this.appModel.setLoader(true);
				this.appModel.previousSection();
			}
		
       // next function
        next(){
            this.appModel.nextSection();
			this.appModel.setLoader(true);
			
		}
		
		 ngOnInit() {
			this.appModel.functionone(this.templatevolume,this);
			if(this.appModel.isNewCollection){
				this.appModel.event = {'action': 'segmentBegins'};
			}
			let fetchedData:any = this.appModel.content.contentData.data;
			this.containgFolderPath = this.getBasePath(); 
			if(fetchedData.titleScreen){
				this.quesInfo = fetchedData;
				this.noOfImgs = this.quesInfo.imgCount;
			}
		}
		  
		  
		  templatevolume(vol,obj) {
			if(obj.titleAudio && obj.titleAudio.nativeElement){
				obj.titleAudio.nativeElement.volume = obj.appModel.isMute?0:vol;
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
		
	  }
	  
	 
	  
