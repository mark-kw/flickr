import { Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { __spreadArrays } from 'tslib';



export interface output {
  photos: {
    photo: fphoto[];
  }
}

export interface fphoto {
  farm: string;
  id: string;
  secret: string;
  server: string;
  title: string;
}

export interface info {
  photo: {
    title: string,
    description: string,
    owner: string,
    dates: any,
    comments: string,
    location: any
    urls:{
      url :any;
    }
    dateuploaded: any
  };

}

export interface image_size{
  sizes : {
    size : [];
  }

}


@Injectable({
  providedIn: 'root'
})
export class FlickrService {
  page = 1;
  constructor(private http: HttpClient) { }

  search(word: string, page: any,filter:any){

    var params = `api_key=${environment.flickr.key}&text=${word}&format=json&nojsoncallback=1&per_page=12&page=${page}`;

    filter.forEach(element => {
      switch(element.name) {
        case "val1": {
          if(!isNaN(element.value)){
            params = params + "&min_upload_date="+element.value;
          }
          break;
        }
        case "val2" : {
          if(!isNaN(element.value)){
            params = params + "&max_upload_date="+element.value;
          }
          break;
        }
        case "val3" : {
          if(!isNaN(element.value)){
            params = params + "&geo_context="+element.value;
          }
          break;
        }
        default: {
           break;
        }
     }
    });
    const url = 'https://www.flickr.com/services/rest/?method=flickr.photos.search&';
    return this.http.get(url + params).pipe(map((res :output) => {
      const urlArr = [];
      res.photos.photo.forEach((ph: fphoto) => {
        const photoObj = {
          url: `https://farm${ph.farm}.staticflickr.com/${ph.server}/${ph.id}_${ph.secret}`,
          id : ph.id,
          title: ph.title
        };
        urlArr.push(photoObj);
      });
      return urlArr;
    }
    ));
  }

  getInfo(id:string){
    const url = 'https://www.flickr.com/services/rest/?method=flickr.photos.getInfo&'
    const params = `api_key=${environment.flickr.key}&photo_id=${id}&format=json&nojsoncallback=1`;
      return this.http.get(url + params).pipe(map((res : info) => {

      const pub = new Date(res.photo.dates["posted"]*1000);
      const upload = new Date(res.photo.dateuploaded * 1000)
      console.log(res);
        const tab = {
          title: res.photo.title["_content"],
          description : res.photo.description["_content"],
          auteur: res.photo.owner["username"],
          localisation:[],
          taken: res.photo.dates["taken"],
          dateuploaded : upload.toLocaleDateString("fr-FR"),
          posted: pub.toLocaleDateString("fr-FR"),
          commentaire: res.photo.comments["_content"],
          url : res.photo.urls.url[0]["_content"]        };
        if (res.photo.location)
        {
          for (const key in res.photo.location)
          {
            if (key =="accuracy" || key =="context" || key == "neighbourhood") continue;
            if (res.photo.location[key]["_content"]) { tab.localisation[key] = res.photo.location[key]["_content"];}
            else {tab.localisation[key] = res.photo.location[key];}
          }
        }
        return tab;
    }));
  }

  getSize(id : any,tab : any){
    const url2 = 'https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&';
    const params2 = `api_key=${environment.flickr.key}&photo_id=${id}&format=json&nojsoncallback=1`;
    return this.http.get(url2 + params2).pipe(map((rs : image_size) => {
      rs.sizes.size.forEach(element => {
        if (element["label"] == "Medium"){
          tab["dimension"] = element["width"] +' x ' + element["height"]
        }
      });
      return tab;
    }))
  }
}


