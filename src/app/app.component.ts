import { Component, OnInit, ViewChild, HostListener, AfterViewChecked, OnDestroy, EventEmitter, Output, Input, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute, Params, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { ApplicationmodelService } from './common/services/applicationmodel.service';
import { SharedserviceService } from './common/services/sharedservice.service';
import { Subscription, Observable } from 'rxjs';
import { ParentcommunicationService } from './common/services/parentcommunication.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
	constructor(private activatedRoute: ActivatedRoute, public appModel: ApplicationmodelService, private router: Router, private Sharedservice: SharedserviceService, private parentCommunication: ParentcommunicationService) {
		this.appModel = appModel;
		this.subscription = this.Sharedservice.getData().subscribe(data => {
			this.Template = data.data.TemplateType;
			if (this.Template === 'EVA') {
				this.EVA = true;
			} else {
				this.EVA = false;
			}

		});
		this.activatedRoute.queryParams.subscribe((params: Params) => {
			const playContent = params["pInitJson"];
			if (playContent) {
				this.parentCommunication.setInitData(playContent);
				this.appModel.initializeApp(playContent);
			}
			console.log("params value is",params);
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
	@Input() initData:Observable<any>;
	@Output() playerEvent = new EventEmitter<any>();

	ngOnInit() {
		window.onresize = (e) => {
			if (this.appModel.contentInParam) {
				this.resizeContainer();
			}
			this.triggerWindowsResize();
		}
		this.appModel.getPreviewMode(this);
		this.appModel.eventSubject.subscribe(event => {
			this.playerEvent.emit(event);
			console.log("app component event",event);
		});
		console.log('appModel.navShow', this.appModel.navShow);
		this.router.events.subscribe((event: Event) => {
			this.isVideo = false;
			if (event instanceof NavigationStart) {

			}
			if (event instanceof NavigationEnd) {
				this.resizeFlag = false;
				if (event && event.url === '/video' || event && event.url === '/videoext') {
					this.isVideo = true;
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

	ngAfterViewChecked() {
		if (!this.resizeFlag && this.appModel.contentInParam) {
			setTimeout(() => {
				this.resizeContainer();
			}, 0);
		}
	}

	ngOnDestroy() {
		clearTimeout(this.timer);
	}

	resizeContainer() {
		if (this.contentHolder && this.contentHolder.nativeElement) {
			let contentHolder: HTMLElement = this.contentHolder.nativeElement as HTMLElement
			contentHolder.style.width = "initial";
			let targetHeight = window.innerHeight;
			let containerHeight = contentHolder.clientHeight;
			let containerWidth = contentHolder.clientWidth;
			if (containerHeight > targetHeight) {
				while (containerHeight > targetHeight) {
					containerHeight = containerHeight - (containerHeight * .01);
					containerWidth = containerWidth - (containerWidth * .01);
				}
				contentHolder.setAttribute("style","width: " + containerWidth + "px !important");
			} else {
			}
		}

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



