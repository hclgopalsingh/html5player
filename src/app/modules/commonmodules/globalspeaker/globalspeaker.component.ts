 
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { SharedserviceService } from '../../../services/sharedservice.service';

@Component({
  selector: 'app-globalspeaker',
  templateUrl: './globalspeaker.component.html',
  styleUrls: ['./globalspeaker.component.css']
})
export class GlobalspeakerComponent implements OnInit {

  constructor(private appModel: ApplicationmodelService, private Sharedservice: SharedserviceService) {
    this.appModel = appModel;
	this.assetsfolderlocation = this.appModel.assetsfolderpath;
  }


  assetsfolderlocation: string = "";
  speaker: any = "";
  videoPlayed = false;
  speakerPlayed = false;
  contentgFolderPath: string = "";
  @ViewChild('speakerVolume') speakerVolume: any;
  @ViewChild('sprite') sprite: any;
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
  }
  onHoverSpeaker() {
		 
			this.speaker.imgsrc = this.speaker.imghover;
		 
	}
	onHoveroutSpeaker() {
		if (!this.speakerPlayed) {
			this.speaker.imgsrc = this.speaker.imgorigional;
		}
	}
	playSpeaker() {
		this.speakerPlayed = true;
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
			this.speakerPlayed = false;
		}
	}
}
