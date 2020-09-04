import { PlayerConstants } from '../../../common/playerconstants';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { Component, OnInit, ViewEncapsulation, ViewChild, HostListener } from '@angular/core';

declare var Slider: any;

@Component({
  selector: 'controls',
  templateUrl: 'controls.component.html',
  styleUrls: ['controls.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ControlsComponent implements OnInit {

  public appModel: ApplicationmodelService;

  private currentVideoTime;
  private duration;
  protected currentTime = 0;
  protected progressBarValue = 0;
  // protected sliderRef = null;

  public displayVolume = false;
  protected displaySpecial = false;
  protected isPlaying = false;
  protected time = PlayerConstants.TIME_FORMAT;
  isAutoplayOn: boolean;
  volumeIcon: any = "assets/images/volume.svg";
  volumeMute: any = "assets/images/mute.svg";
  volumeBtn: any = "assets/images/volume.svg";

  @ViewChild('mainVideo') mainVideo;
  @ViewChild('autoPlayOnOffContainer') autoPlayOnOffContainer: any;
  @ViewChild('MuteVarTemp') MuteVarTemp: any;
  @ViewChild('volumeContainer') volumeContainer: any;
  @ViewChild('volumeBar') volumeBar: any;

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.volumeContainer.nativeElement.contains(event.target)) {
      this.displayVolume = false;
    }
  }

  constructor(appModel: ApplicationmodelService) {
    this.appModel = appModel;

  }

  ngOnInit() {
    let autoPlayTimer = setInterval(() => {
      if (this.autoPlayOnOffContainer && this.autoPlayOnOffContainer.nativeElement
        && this.autoPlayOnOffContainer.nativeElement.children[1]) {
        if (this.appModel) {
          let autoPlay = this.appModel.isAutoPlay();
          if (autoPlay) {
            this.autoPlayOnOffContainer.nativeElement.children[1].checked = true;
            this.isAutoplayOn = true;
            this.appModel.updateAutoPlay(true);
            clearInterval(autoPlayTimer);
          } else if (autoPlay == false) {

            this.autoPlayOnOffContainer.nativeElement.children[1].checked = false;
            this.isAutoplayOn = false;
            this.appModel.updateAutoPlay(false);
            clearInterval(autoPlayTimer);
          }
          let isMute = this.appModel.isMute;
          if (isMute) {
            this.volumeBtn = this.volumeMute;
          } else if (!isMute) {
            this.volumeBtn = this.volumeIcon;
          }
        }
      }
    }, 100)

    this.appModel.getAutoPlay().subscribe((flag) => {
      if (flag) {
        this.autoPlayOnOffContainer.nativeElement.classList = "col-sm-1 hideAutoplay";
      } else {
        this.autoPlayOnOffContainer.nativeElement.classList = "col-sm-1";
      }
    })
  }


  loadedHandler(event) {
    this.duration = event.currentTarget.duration;
    this.appModel.event = { 'action': 'segmentBegins' };
  }

  updatePlay(event) {
    this.isPlaying ? this.pauseVideo() : this.playVideo();
  }


  get basePath(): any {
    // console.log('VideoComponent: path=', this.appModel.content.id + '/' + this.appModel.content.contentData.data['path']);
    return this.appModel.content.id + '';
  }

  get path(): string {
    // console.log('VideoComponent: path=', this.appModel.content.id + '/' + this.appModel.content.contentData.data['path']);
    return this.appModel.content.id + '/' + this.appModel.content.contentData.data['path'];
  }

  volumeIconClicked(event) {
    this.displayVolume = !this.displayVolume;
    if (this.displayVolume) {
      setTimeout(() => {
        if (this.appModel) {
          let isMute = this.appModel.isMute;
          if (this.MuteVarTemp && this.MuteVarTemp.nativeElement) {
            if (isMute) {
              this.MuteVarTemp.nativeElement.children[0].checked = true;
							/*let selectBox = <HTMLElement>document.getElementById("MuteVarTemp");
							(<HTMLInputElement><any>selectBox.children[0]).checked = true;*/
              this.appModel.isMute = true;
              this.volumeBtn = this.volumeMute;
              this.volumeBar.nativeElement.className = "volumesliderDisable";
              this.appModel.functiontwo(undefined);
            } else if (!isMute) {
              this.MuteVarTemp.nativeElement.children[0].checked = false;
              this.appModel.isMute = false;
              this.volumeBtn = this.volumeIcon;
              this.appModel.functiontwo(undefined);
            }
          }
        }
      }, 0)
    }
  }

  private playVideo() {
    this.isPlaying = true;
    this.mainVideo.nativeElement.play();
    this.appModel.event = { 'action': 'play' };
  }

  private pauseVideo() {
    this.isPlaying = false;
    this.mainVideo.nativeElement.pause();
    this.appModel.event = { 'action': 'pause', 'time': new Date().getTime(), 'currentPosition': this.currentVideoTime };
  }

  updateHandler(event) {
    const duration = event.currentTarget.duration;
    this.currentVideoTime = event.currentTarget.currentTime;
    const value = (100 / duration) * this.currentVideoTime;
    this.progressBarValue = value;
    console.log('VideoComponent: updateHandler value=', value, this.progressBarValue);
    /*this.sliderRef.setAttribute('value', value);
    this.sliderRef.refresh();*/

    const curmins = Math.floor(this.currentVideoTime / 60);
    const cursecs = Math.floor(this.currentVideoTime - curmins * 60);
    const durmins = Math.floor(duration / 60);
    const dursecs = Math.floor(duration - durmins * 60);
    const ttime = dursecs + (durmins * 60);
    const ctime = cursecs + (curmins * 60);
    const rtime = ttime - ctime;
    const remainingt = this.convertDigits(Math.floor(rtime / 60)) + ':' + this.convertDigits(rtime % 60);
    const elapsed = this.convertDigits(curmins) + ':' + this.convertDigits(cursecs);
    this.time = remainingt + ' / ' + this.convertDigits(durmins) + ':' + this.convertDigits(dursecs);


    // pause if needed
    if (this.appModel.content.contentData.data['timings'] &&
      (this.appModel.content.contentData.data['timings'] as Array<string>).indexOf('00:' + elapsed) > -1) {
      this.isPlaying = false;
      this.mainVideo.nativeElement.pause();
      this.displaySpecial = true;
    }

  }

  resumeSpecial(event) {
    console.log('VideoComponent: resumeSpecial - event=', event);
    this.isPlaying = true;
    this.mainVideo.nativeElement.play();
    this.displaySpecial = false;
  }

  updateVolume(event) {
    //console.log('VideoComponent: updateVolume - event=', event);
    //this.mainVideo.nativeElement.volume = event.target.value;

    this.appModel.functiontwo(event.target.value);
    if (event.target.value == 0) {
      this.appModel.isMute = true;
      this.MuteVarTemp.nativeElement.children[0].checked = true;
      this.volumeBtn = this.volumeMute;
      this.volumeBar.nativeElement.className = "volumesliderDisable";
      this.appModel.functiontwo(undefined);
    } else {
      this.appModel.isMute = false;
      if (this.MuteVarTemp && this.MuteVarTemp.nativeElement) {
        if (this.MuteVarTemp.nativeElement.children[0].checked) {
          this.MuteVarTemp.nativeElement.children[0].checked = false;
          this.appModel.isMute = false;
          this.volumeBtn = this.volumeIcon;
          this.volumeBar.nativeElement.className = "volumeslider";
          /*let selectBox = <HTMLElement>document.getElementById("MuteVarTemp");
          (<HTMLInputElement><any>selectBox.children[0]).checked = false;*/
        }
      }
    }




  }

  UpdateMute() {
    if (this.MuteVarTemp.nativeElement.children[0].checked) {
      this.appModel.isMute = true;
      this.volumeBtn = this.volumeMute;
      this.volumeBar.nativeElement.className = "volumesliderDisable";
      this.appModel.functiontwo(undefined);
    }
    else {
      this.appModel.isMute = false;
      this.volumeBtn = this.volumeIcon;
      this.appModel.functiontwo(undefined);
      this.volumeBar.nativeElement.className = "volumeslider";
    }
  }

  endedHandler(event) {
    console.log('VideoComponent: endedHandler');
    this.appModel.event = { 'action': 'segmentEnds' };
    this.appModel.nextSection();
  }

  close(event) {
    this.appModel.event = { 'action': 'exit', 'currentPosition': this.currentVideoTime };
  }

  convertDigits(value: number): string {
    if (value < 10) {
      return '0' + value;
    } else {
      return '' + value;
    }
  }

  updateAutoplay() {
    if (this.autoPlayOnOffContainer && this.autoPlayOnOffContainer.nativeElement) {
      if (this.autoPlayOnOffContainer.nativeElement.children[1].checked) {
        this.isAutoplayOn = true;
        this.appModel.updateAutoPlay(true);
      } else {
        this.isAutoplayOn = false;
        this.appModel.updateAutoPlay(false);
      }
    }
    this.appModel.updateAutoPlay(this.isAutoplayOn);

  }
}

