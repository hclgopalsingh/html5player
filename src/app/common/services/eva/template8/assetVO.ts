export class AssetVO {
    public url: string;
    public location: string;
    public constructor(url: string = "", location: string = "") {
        this.url = url;
        this.location = location;
    }
}
