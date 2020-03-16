import {ApplicationmodelService} from '../model/applicationmodel.service';
import {Component, OnInit, ViewChild, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'animation-component',
  templateUrl: '../view/layout/animation.component.html',
  styleUrls: ['../view/css/animation.component.css', '../view/css/bootstrap.min.css']
})
export class AnimationComponent implements OnInit {

  private appModel: ApplicationmodelService;
  @Input() animationAssets: any;
  @Input() audioAssets: any;
  @Output() closeAnimationEvent = new EventEmitter();
  @ViewChild('animationAudio') animationAudio:any;
  constructor(appModel: ApplicationmodelService) {
    this.appModel = appModel;
  }
  timer: any;
  ngOnInit() {
    //control volume 
    console.log("controla vlolume")
    this.appModel.functionone(this.templatevolume,this);//start end
  }

  ngAfterViewChecked(){
    this.templatevolume(this.appModel.volumeValue,this);
  }

  closeAnimation() {
    clearTimeout(this.timer);
    this.closeAnimationEvent.emit()
  }

  templatevolume(vol,obj) {
    //animationAudio
    if(obj.animationAudio && obj.animationAudio.nativeElement){
      obj.animationAudio.nativeElement.volume = obj.appModel.isMute?0:vol;
    }
   }

}

