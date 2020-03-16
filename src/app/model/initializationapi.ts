export class Helper {

  constructor(startAt: number, segmentId: number, file: string, isCompleted:boolean) {
    this._startAt = startAt;
    this._segmentId = segmentId;
    this._file = file;
    this._isCompleted = isCompleted;
  }

  private _startAt: number;

  get startAt(): number {
    return this._startAt;
  }

  private _segmentId: number;

  get segmentId(): number {
    return this._segmentId;
  }

  private _file: string;

  get file(): string {
    return this._file;
  }

  private _isCompleted: boolean;

  get isCompleted():boolean{
    return this._isCompleted;
  }

}

export class Info {

  constructor(id: string, data: any) {
    this._id = id;
    this._data = data;
  }

  private _id: string;

  get id(): string {
    return this._id;
  }

  private _data: any;

  get data(): any {
    return this._data;
  }

}

export class InitializationAPI {

  constructor(homePath: string, forwardEnabled: boolean, playerPreview: boolean, videoType: string, sessionId: string, files: Array<Helper>) {
    this._homePath = homePath;
    this._forwardEnabled = forwardEnabled;
    this._playerPreview = playerPreview;
	this._videoType = videoType;
    this._sessionId = sessionId;
    this._files = files;
  }

  private _homePath: string;

  get homePath(): string {
    return this._homePath;
  }

  private _forwardEnabled: boolean;

  get forwardEnabled(): boolean {
    return this._forwardEnabled;
  }

  private _playerPreview: boolean;
  
  private _videoType:string;

  get playerPreview(): boolean {
    return this._playerPreview;
  }
  
  get videoType() : string{
	  return this._videoType;
  }

  private _sessionId: string;

  get sessionId(): string {
    return this._sessionId;
  }

  private _files: Array<Helper>;

  get files(): Array<Helper> {
    return this._files;
  }

}
