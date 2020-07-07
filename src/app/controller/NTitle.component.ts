import { Component, OnInit, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../model/applicationmodel.service';
import { ThemeConstants } from '../common/themeconstants';
import 'jquery';
import { SharedserviceService } from '../services/sharedservice.service';

declare var $: any;

@Component({
	selector: 'new-title',
	templateUrl: '../view/layout/NTitle.component.html',
	styleUrls: ['../view/css/NTitle.component.css', '../view/css/bootstrap.min.css'],

})


export class NTitleComponent implements OnInit {



	@ViewChild('container') containerBlock: any;
	@ViewChild('titleNavBtn') titleNavBtn: any;
	@ViewChild('titleAudio') titleAudio: any;

	quesInfo: any = "";
	titleTextposition: object = {};
	krikalapTextposition: object = {};
	jariRakheinBtnposition: object = {};

	noOfImgs: number;
	noOfImgsLoaded: number = 0;
	loaderTimer: any;
	containgFolderPath: string = "";
	assetsPath: string = "";
	loadFlag: boolean = false;
	fetchedcontent: any;
	themePath:any;
	functionalityType:any;


	// private appModel: ApplicationmodelService;
	constructor(private appModel: ApplicationmodelService, private Sharedservice: SharedserviceService) {
		this.appModel = appModel;
		this.assetsPath = this.appModel.assetsfolderpath;
		this.appModel.setLoader(true);
		// if error occured during image loading loader wil stop after 5 seconds 
		this.loaderTimer = setTimeout(() => {
			this.appModel.setLoader(false);
		}, 5000);
	}


	onHoverZaariRakhein() {
		this.quesInfo.jariRakheinBtn = this.quesInfo.jariRakheinBtn_hover;
	}
	onHoverOutZaariRakhein() {
		this.quesInfo.jariRakheinBtn = this.quesInfo.jariRakheinBtn_original;
	}

	ngAfterViewChecked() {
		if (this.titleAudio && this.titleAudio.nativeElement) {
			this.titleAudio.nativeElement.onended = () => {

				if (this.quesInfo.templateType && this.quesInfo.templateType === 'EVA') {
					setTimeout(() => {
						this.next();
					}, 5000)
				} else {
					this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeInAnimation";
				}
			}
		}
		this.templatevolume(this.appModel.volumeValue, this);
	}

	closeTitleScreen() {
		this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeOutAnimation";
		setTimeout(() => {
			this.next();
		}, 200)

	}
	// previous function
	previous() {
		this.appModel.setLoader(true);
		this.appModel.previousSection();
	}

	// next function
	next() {
		this.appModel.nextSection();
		this.appModel.setLoader(true);

	}

	ngOnInit() {
		 this.appModel.functionone(this.templatevolume, this);
	

		if (this.appModel.isNewCollection) {
			this.appModel.event = { 'action': 'segmentBegins' };
		}
		let fetchedData: any = this.appModel.content.contentData.data;
		this.fetchedcontent = this.appModel.content.contentData.data;
		this.functionalityType = this.appModel.content.contentLogic.functionalityType
		this.containgFolderPath = this.getBasePath();
		if (fetchedData.titleScreen) {
			this.quesInfo = fetchedData;
			this.noOfImgs = this.quesInfo.imgCount;
		}
		this.themePath = ThemeConstants.THEME_PATH + this.fetchedcontent.productType + '/'+ this.fetchedcontent.theme_name ; 
		if (this.quesInfo.templateType == undefined || this.quesInfo.templateType != 'EVA') {
			this.titleTextposition = this.fetchedcontent.titleText.position;
			this.krikalapTextposition = this.fetchedcontent.krikalapText.position;
			this.jariRakheinBtnposition = this.fetchedcontent.jariRakheinBtn.position;
			//this.imagePath(this.fetchedcontent);
			this.Sharedservice.imagePath(this.fetchedcontent, this.containgFolderPath, this.themePath, this.functionalityType)
		}
		
	}

	imagePath(){
	/*	debugger;
		var keys = Object.keys(this.fetchedcontent);
		var len = keys.length;

		for (var i=0; i<len; i++){
			var value =	this.fetchedcontent[Object.keys(this.fetchedcontent)[i]];
			if(typeof value != "object"){
				console.log('not object')
			}else{
				if(value.hasOwnProperty("location")){
					var v = value["location"];
					var l = value["url"];
					
					if(v == "content"){
						value["url"] = this.containgFolderPath + '/' + value["url"];
						//console.log(this.fetchedcontent);
					   //return this.fetchedcontent;				
						
					} else if(v == "theme"){
						if(value["url"]){
							value["url"] = this.themePath + '/type_'+ this.functionalityType +'/'+ value["url"];
						}else if(value["urlglobal"]){
							value["url"] = this.themePath + '/type_'+ this.functionalityType +'/'+ value["url"];
						}
						
						//console.log(this.fetchedcontent);
					//	return this.fetchedcontent;
						
					}
				}
				
			}
		}
*/


	}
	templatevolume(vol, obj) {
		if (obj.titleAudio && obj.titleAudio.nativeElement) {
			obj.titleAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
	}

	checkImgLoaded() {
		if (!this.loadFlag) {
			this.noOfImgsLoaded++;
			if (this.noOfImgsLoaded >= this.noOfImgs) {
				this.appModel.setLoader(false);
				this.loadFlag = true;
				clearTimeout(this.loaderTimer);
			}
		}
	}

	getBasePath() {
		if (this.appModel && this.appModel.content) {
			return this.appModel.content.id + '';
		}
	}

}



