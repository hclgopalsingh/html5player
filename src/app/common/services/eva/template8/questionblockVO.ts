import { SelectedOptionVO } from "./selectedOptionVO";


export class QuestionBlockVO {
    public urlQuestionBase:string = "";
    public urlQuestionStatement:string = "";
    
    public bQuestionBlinking:boolean = false;
    public urlQuestionBlinkingImg1:string = "";
    public urlQuestionBlinkingImg2:string = "";

    public bSelectedOptionBlinking:boolean = false;
    public selectedOptionData:SelectedOptionVO;

    public containerType:string;
    
    public constructor() {
		
    }
}
