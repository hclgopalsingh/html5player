import { QuestionBlockVO } from "./questionblockVO";

export class TemplateVO {
    public urlSelectedOptionNormal:string = "";
    public urlSelectedOptionHighlightImg1:string = "";
    public urlSelectedOptionHighlightImg2:string = "";

    public feedbackPopupQuestionData:QuestionBlockVO;
    public showAnswerPopupQuestionData:QuestionBlockVO;
    public mainScreenQuestionData:QuestionBlockVO;

    public constructor() {
        this.feedbackPopupQuestionData = new QuestionBlockVO();
        this.showAnswerPopupQuestionData = new QuestionBlockVO();
        this.mainScreenQuestionData = new QuestionBlockVO();
    }

}
