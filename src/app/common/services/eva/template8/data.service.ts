import { QuestionBlockVO } from "./questionblockVO";
import { TemplateVO } from "./templateVO";
import { Constants } from "./constants";
import { AssetVO } from "./assetVO"
import { from } from "rxjs/observable/from";

export class DataService {

	private _rawData: any;
	private _assetsPath: string;
	private _contentPath: string;
	private _dataVO: TemplateVO;


	public constructor() {
		this._dataVO = new TemplateVO();
	}

	set rawData(value: any) {
		this._rawData = value;
		this.parseData();
	}

	get rawData(): any {
		return this._rawData;
	}

	get data(): TemplateVO {
		return this._dataVO;
	}

	private parseData(): void {
		this._dataVO = new TemplateVO();

		/********* main screen question data *********/
		const mainScreenQBVO: QuestionBlockVO = new QuestionBlockVO();
		const mainScreenData: any = this.rawData.ques.mainscreen;
		mainScreenQBVO.urlQuestionBase = this.getCompletePath(new AssetVO(mainScreenData.questionBase.url, mainScreenData.questionBase.location));
		mainScreenQBVO.urlQuestionStatement = this.getCompletePath(new AssetVO(mainScreenData.questionStatement.url, mainScreenData.questionStatement.location));
		mainScreenQBVO.containerType = Constants.CONTAINER_MAIN_SCREEN;
		if (this.variation == Constants.VARIATION_EVA8V0) {
			mainScreenQBVO.bQuestionBlinking = true;
			mainScreenQBVO.urlQuestionBlinkingImg1 = this.getCompletePath(new AssetVO(mainScreenData.questionBlinking1.url, mainScreenData.questionBlinking1.location));
			mainScreenQBVO.urlQuestionBlinkingImg2 = this.getCompletePath(new AssetVO(mainScreenData.questionBlinking2.url, mainScreenData.questionBlinking2.location));

			mainScreenQBVO.bSelectedOptionBlinking = true;

		} else {
			mainScreenQBVO.bQuestionBlinking = false;
		}

		this._dataVO.mainScreenQuestionData = mainScreenQBVO;

		/********* end main screen question data *********/



		/********* feedback popup question data *********/
		const feedbackQBVO: QuestionBlockVO = new QuestionBlockVO();
		const feedbackPopupData: any = this.rawData.ques.feedbackpopup;
		feedbackQBVO.urlQuestionBase = this.getCompletePath(new AssetVO(feedbackPopupData.questionBase.url, feedbackPopupData.questionBase.location));
		feedbackQBVO.urlQuestionStatement = this.getCompletePath(new AssetVO(feedbackPopupData.questionStatement.url, feedbackPopupData.questionStatement.location));
		feedbackQBVO.bQuestionBlinking = false;
		feedbackQBVO.containerType = Constants.CONTAINER_FEEDBACK_POPUP;

		if (this.variation == Constants.VARIATION_EVA8V0) {
			feedbackQBVO.bSelectedOptionBlinking = true;
		} else {
			feedbackQBVO.bSelectedOptionBlinking = false;
		}

		this._dataVO.feedbackPopupQuestionData = feedbackQBVO;

		/********* end feedback popup question data *********/



		/********* show answer popup question data *********/
		const showAnsPopupQBVO: QuestionBlockVO = new QuestionBlockVO();
		const showAnsPopupData: any = this.rawData.ques.showanswerpopup;

		showAnsPopupQBVO.urlQuestionBase = this.getCompletePath(new AssetVO(showAnsPopupData.questionBase.url, showAnsPopupData.questionBase.location));
		showAnsPopupQBVO.urlQuestionStatement = this.getCompletePath(new AssetVO(showAnsPopupData.questionStatement.url, showAnsPopupData.questionStatement.location));

		showAnsPopupQBVO.containerType = Constants.CONTAINER_SHOW_ANSWER_POPUP;
		showAnsPopupQBVO.bQuestionBlinking = false;
		showAnsPopupQBVO.bSelectedOptionBlinking = false;

		this._dataVO.showAnswerPopupQuestionData = showAnsPopupQBVO;

		/********* end feedback popup question data *********/

	}

	public getCompletePath(value: AssetVO): string {
		if (value.location == Constants.FOLDER_ASSETS) {
			return this._assetsPath + "/" + value.url;
		} else {
			return this._contentPath + "/" + value.url;
		}
	}

	set assetsPath(value: string) {
		this._assetsPath = value;
	}

	get assetsPath(): string {
		return this._assetsPath;
	}

	set contentPath(value: string) {
		this._contentPath = value;
	}

	get contentPath(): string {
		return this._contentPath;
	}

	public rightWrongPopupData(): QuestionBlockVO {
		const vo: QuestionBlockVO = new QuestionBlockVO();

		return vo;
	}

	public showAnswerPopupData(): QuestionBlockVO {
		const vo: QuestionBlockVO = new QuestionBlockVO();

		return vo;
	}

	get optionsData(): any {
		const jsonString = JSON.stringify(this.rawData.options);
		return JSON.parse(jsonString);
	}

	getOptionById(value: string): any {
		for (const element of this.optionsData) {
			if (value == element.id) {
				return element;
			}
		}

		return null;
	}

	get instructionText(): string {
		return this.rawData.instructiontext;
	}

	get commonAssets(): any {
		return this.rawData.commonassets;
	}

	get ques(): any {
		return this.rawData.ques;
	}

	get speaker(): any {
		return this.rawData.speaker;
	}

	get feedback(): any {
		return this.rawData.feedback;
	}

	get quesObj(): any {
		return this.rawData.quesObj;
	}

	get imgCount(): number {
		return this.rawData.imgCount;
	}

	get variation(): string {
		return this.rawData.variation;
	}

	get popupAssets(): any {
		return this.rawData.feedback.popupassets;
	}

	get quesControl(): any {
		return this.rawData.commonassets.ques_control;
	}
}
