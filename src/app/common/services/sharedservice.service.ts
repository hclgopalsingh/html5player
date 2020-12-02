import {Injectable, Output, EventEmitter} from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class SharedserviceService {
  
    private subject = new Subject<any>();
    private ShowAnswer = new Subject<any>();
    private disableShowAnswer = new Subject<any>();
    private SubmitAnswer = new Subject<any>();
    private IsVOPlaying = new Subject<any>();
    private AageyBadhe = new Subject<any>();
    private moveNextSubject = new Subject<any>();
    private isAageyBadhe = new Subject<any>();
    private isTimerActive = new Subject<any>();
    public spriteElement = new Subject<any>();
    public speakerVol = new Subject<any>();
    public showAnsRef = new Subject<any>();
    public showAnswerfeedback = new Subject<any>();
    public videoonshowAnspopUp = new Subject<any>();
    public ShowHideConfirmation = new Subject<any>();

    sendData(data: any) {
        this.subject.next({ data: data });
    }

    clearData() {
        this.subject.next();
    }

    getData(): Observable<any> {
        return this.subject.asObservable();
    }

    setShowAnsEnabled(status:any){
        this.ShowAnswer.next({data:status});
    }

    getShowAnsEnabled(){
        return this.ShowAnswer.asObservable();
    }
  
    // disable click on show answer button even if show answer btn state is enabled
    setShowAnsClickDisabled(status:any){
        this.disableShowAnswer.next({data:status});
    }

    getShowAnsClickDisabled(){
        return this.disableShowAnswer.asObservable();
    }

    setSubmitAnsEnabled(status:any){
        this.SubmitAnswer.next({data:status});
    }

    getSubmitAnsEnabled(){
        return this.SubmitAnswer.asObservable();
    }

    setVoplayingStatus(status:any){
        this.IsVOPlaying.next({data:status});
    }

    getVoPlayingStatus(){
       return this.IsVOPlaying.asObservable();
    }


    setLastQuesAageyBadheStatus(status:any){
        this.AageyBadhe.next({data:status});
    }

    getLastQuesAageyBadheStatus(){
       return this.AageyBadhe.asObservable();
    }

    setIsAggeyBadheClicked(status:any){
        this.isAageyBadhe.next({data:status});
    }

    getIsAggeyBadheClicked(){
        return this.isAageyBadhe.asObservable();
    }

    setTimeOnLastQues(Questimer:any){
        this.isTimerActive.next({data:Questimer});
    }

    getTimerOnLastQues(){
        return this.isTimerActive.asObservable();
    }
    public moveNext(){
        this.moveNextSubject.next();
      }

    get moveNextNotification(){
        return this.moveNextSubject.asObservable();
      }


    setShowHideConfirmation(status:any){
        this.ShowHideConfirmation.next({data:status});
    }

    getsetShowHideConfirmation(){
       return this.ShowHideConfirmation.asObservable();
    }
      //method to convert json with complate url based on location
      imagePath(data, containgFolderPath, themePath, functionalityType){	
        var keys = Object.keys(data);
		var objlength = keys.length;
        this.setPath(objlength, data, containgFolderPath, themePath, functionalityType);
    }

	setPath(objlength, data, containgFolderPath, themePath, functionalityType){
		for (var i=0; i<objlength; i++){
			var value =	data[Object.keys(data)[i]];

			if(typeof value != "object"){
				//console.log('not object')
			}else{
				if(value.hasOwnProperty("location") && value.length == undefined ){
					var location = value["location"];
					
					if(location == "content"){
						if(value["url"]){
							value["url"] = containgFolderPath + '/' + value["url"];
						}
						if(value["urlOgv"]){
							value["urlOgv"] = containgFolderPath + '/' + value["urlOgv"];
						}
						if(value["urlMP4"]){
							value["urlMP4"] = containgFolderPath + '/' + value["urlMP4"];
						}														
					} else if(location == "theme"){
						if(value["url"]){
							value["url"] = themePath + '/type_'+ functionalityType +'/'+ value["url"];					
						}
						if(value["urlOgv"]){
							value["urlOgv"] = themePath + '/type_'+ functionalityType +'/'+ value["urlOgv"];					
						}
						if(value["urlMP4"]){
							value["urlMP4"] = themePath + '/type_'+ functionalityType +'/'+ value["urlMP4"];					
						}
						if(value["urlglobal"]){
							value["urlglobal"] = themePath +'/'+ value["urlglobal"];
                            value['url'] = value['urlglobal']; // replace existing key with new name 
                            delete value['urlglobal'];					
						}						
					}
				}			
				this.imagePath(value, containgFolderPath, themePath, functionalityType)
			}
        }
	}
}
