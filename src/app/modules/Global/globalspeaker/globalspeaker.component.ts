import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { SharedserviceService } from '../../../common/services/sharedservice.service';

@Component({
	selector: 'app-Globalspeaker',
	templateUrl: './Globalspeaker.component.html',
	styleUrls: ['./Globalspeaker.component.scss']
})
export class GlobalspeakerComponent implements OnInit {

	constructor(private appModel: ApplicationmodelService, private Sharedservice: SharedserviceService) {
		this.appModel = appModel;
		this.assetsfolderlocation = this.appModel.assetsfolderpath;
	}


	assetsfolderlocation: string = "";
	speaker: any = "";
	videoPlayed = false;
	//   speakerPlayed = false;
	contentgFolderPath: string = "";
	@ViewChild('speakerVolume', {static: true}) speakerVolume: any;
	@ViewChild('sprite', {static: true}) sprite: any;
	@Output() clickSpeaker = new EventEmitter<any>();
	get basePath(): any {
		if (this.appModel && this.appModel.content) {
			return this.appModel.content.id + '';
		}
	}

	setData() {
		if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
			let fetchedData: any = this.appModel.content.contentData.data;
			this.speaker = JSON.parse(JSON.stringify(fetchedData.speaker));
		}
	}

	ngOnInit() {
		this.contentgFolderPath = this.basePath;
		this.setData();
		this.sprite.nativeElement.style = "display:none";
		this.Sharedservice.speakerVol.next(this.speakerVolume);
		this.Sharedservice.spriteElement.next(this.sprite);
	}


	onHoverSpeaker() {

		this.speaker.imgsrc = this.speaker.imghover;

	}
	onHoveroutSpeaker() {
		if (this.speakerVolume.nativeElement.paused) {
			this.speaker.imgsrc = this.speaker.imgorigional;
		}
	}
	playSpeaker() {
		this.clickSpeaker.emit();
		this.speaker.imgsrc = this.speaker.imgactive;
		this.Sharedservice.spriteElement.next(this.speaker);
		this.Sharedservice.speakerVol.next(this.speakerVolume);
		this.speakerVolume.nativeElement.play();
		this.sprite.nativeElement.style = "display:flex";
		(document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "none";
		this.speakerVolume.nativeElement.onended = () => {
			this.speaker.imgsrc = this.speaker.imgorigional;
			this.sprite.nativeElement.style = "display:none";
			(document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "";
		}
	}
}
