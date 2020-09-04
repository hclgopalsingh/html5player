import { Component, OnInit, ViewChild, HostListener, AfterViewChecked, OnDestroy } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { ApplicationmodelService } from './common/services/applicationmodel.service';
import { SharedserviceService } from './common/services/sharedservice.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked, OnDestroy {
	constructor(public appModel: ApplicationmodelService, private router: Router, private Sharedservice: SharedserviceService) {
		this.appModel = appModel;
		this.subscription = this.Sharedservice.getData().subscribe(data => {
			this.Template = data.data.TemplateType;
			if (this.Template === 'EVA') {
				this.EVA = true;
			} else {
				this.EVA = false;
			}

		});
	}
	title = 'app';
	@ViewChild('contentHolder') contentHolder: any;
	@ViewChild('loaderHolder') loaderHolder: any;
	@ViewChild('checkForAutoplayRef') checkForAutoplayRef: any;
	@ViewChild('animationRef') animationRef: any;
	resizeFlag: boolean = false;
	playerPreview: boolean = false;
	navUrl: string;
	isTitleScreenActive: boolean = true;
	animationAssts: any;
	happyAssetsFix: any = './assets/images/happyFixedAnimation.webp';
	sadAssetsFix: any = './assets/images/sadFixedAnimation.gif';
	animationType: string = '';
	autoplay: boolean = true;
	audioSrc: any = '';
	timeout: number = 5000;
	timer: any;
	EVA: boolean = false;
	subscription: Subscription;
	Template: any;
	isVideo: boolean = false;


	/*@HostListener('document:keyup', ['$event'])
	@HostListener('document:click', ['$event'])
	@HostListener('document:wheel', ['$event'])
	resetTimer() {
	  this.appModel.notifyUserAction();
	}*/

	ngAfterViewChecked() {
		if (!this.resizeFlag) {
			setTimeout(() => {
				this.resizeContainer();
			}, 0);
		}
	}

	ngOnInit() {
		window.onresize = (e) => {
			this.triggerWindowsResize();
			this.resizeContainer();
		}
		this.appModel.getPreviewMode(this);
		console.log('appModel.navShow', this.appModel.navShow);
		this.router.events.subscribe((event: Event) => {
			this.isVideo = false;
			if (event instanceof NavigationStart) {

			}
			if (event instanceof NavigationEnd) {
				this.resizeFlag = false;
				if (event && event.url === '/video' || event && event.url === '/videoext') {
					this.isVideo = true;
					/* this.navUrl= event.url;
					 let resizeTimer = setInterval(()=>{
							if (this.appModel && this.appModel.getVideoLoaded) {
								clearInterval(resizeTimer);
								setTimeout(()=>{
									this.resizeFlag = true;
								},200)
							}
						  },100)	*/

				} else if (event && event.url != '/') {
					/*this.navUrl= event.url;
						let resizeTimer = setInterval(()=>{
						if (this.appModel && !(this.appModel.getLoaderFlag)) {
							clearInterval(resizeTimer);
							setTimeout(()=>{
								this.resizeFlag = true;
							},200)
						}
					  },100)*/
				}
			}
		});

		this.appModel.isVideoLoaded.subscribe(() => {
			this.timer = setTimeout(() => {
				this.resizeFlag = true;
			}, 2000);
		});

		this.appModel.isTempLoaded.subscribe(() => {
			setTimeout(() => {
				this.resizeFlag = true;
			}, 2000);
		});
		this.appModel.animationAssets.subscribe((assets) => {
			this.animationType = 'right';
			if (assets) {
				this.animationAssts = assets.animationImg !== '' ? assets.animationImg : this.happyAssetsFix;
				this.audioSrc = assets.audio;
				this.timeout = assets.timer ? assets.timer : 5000;
			} else {
				this.animationAssts = this.happyAssetsFix;
			}

			if (this.audioSrc) {
				this.animationRef.animationAudio.nativeElement.src = this.audioSrc;
				this.animationRef.animationAudio.nativeElement.load();
				this.animationRef.animationAudio.nativeElement.play();
				this.animationRef.animationAudio.nativeElement.onended = () => {
					this.timer = setTimeout(() => {
						this.postAnimationActs();
					}, 2000);
				};
			} else {
				this.timer = setTimeout(() => {
					this.postAnimationActs();
				}, this.timeout);
			}
		});

		this.appModel.wrongAnimationAsts.subscribe((assts) => {
			this.animationType = 'wrong';
			if (assts) {
				this.animationAssts = assts.animationImg !== '' ? assts.animationImg : this.sadAssetsFix;
				this.audioSrc = assts.audio;
				this.timeout = assts.timer ? assts.timer : 5000;
			} else {
				this.animationAssts = this.sadAssetsFix;
			}
			if (this.audioSrc) {
				this.animationRef.animationAudio.nativeElement.src = this.audioSrc;
				this.animationRef.animationAudio.nativeElement.load();
				this.animationRef.animationAudio.nativeElement.play();
				this.animationRef.animationAudio.nativeElement.onended = () => {
					this.timer = setTimeout(() => {
						this.postAnimationActs();
					}, 2000)
				}
			} else {
				this.timer = setTimeout(() => {
					this.postAnimationActs();
				}, this.timeout)
			}
		});
		this.appModel.autoPlayBtn.subscribe(() => {
			this.autoplay = false;
		});
	}

	ngOnDestroy() {
		clearTimeout(this.timer);
	}

	resizeContainer() {
		// if (this.contentHolder && this.contentHolder.nativeElement) {
		// 	let contentHolder: HTMLElement = this.contentHolder.nativeElement as HTMLElement
		// 	contentHolder.style.width = "initial";
		// 	let targetHeight = window.innerHeight;
		// 	let containerHeight = contentHolder.clientHeight;
		// 	let containerWidth = contentHolder.clientWidth;
		// 	if (containerHeight > targetHeight) {
		// 		while (containerHeight > targetHeight) {
		// 			containerHeight = containerHeight - (containerHeight * .01);
		// 			containerWidth = containerWidth - (containerWidth * .01);
		// 		}
		// 		contentHolder.style.width = containerWidth + "px";
		// 	} else {
		// 	}
		// }

	}

	setPreviewMode(previewMode) {
		this.playerPreview = previewMode;
	}
	setTitleFlag(flag: boolean) {
		this.isTitleScreenActive = flag;
	}

	triggerWindowsResize() {
		this.appModel.windowResizeTriggerd()
	}

	postAnimationActs() {
		clearTimeout(this.timer);
		console.log('output event....');
		if (this.animationType === 'right') {
			this.appModel.moveNextQues();
		} else if (this.animationType === 'wrong') {
			//emit handle post wrong feedback
			this.appModel.handlePostWrongFeedback();
		}
		this.animationAssts = undefined;
		this.animationType = '';
	}

	startApplication() {
		this.autoplay = true;
		this.appModel.startApplication();
	}

}



