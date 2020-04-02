import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http'


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'Bearer ' +  environment.token
  })
};

const httpOptions2 = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    // 'Authorization': 'Bearer ' +  environment.token
  })
};


@Injectable({
  providedIn: 'root'
})
export class DialogflowService {

  
  private baseUrl = "http://192.168.50.100:6001/digital-assistant/v1/"


  constructor(private http: HttpClient ){}

  public getResponse(query: string) : any{
    let URL: string = "https://api.dialogflow.com/v1/query?v=20150910";	

    let data = {
      query : query,
      lang: 'en',
      sessionId: '12345'
    }
    return this.http.post(URL, data, httpOptions)
     
  }

  
  getLinks(diseaseId : Number , intentId : Number)
  {
    let data = {
      "disease_id": diseaseId,
      "intent_id" : intentId
  }
    let url = this.baseUrl + "getLinks";
    console.log(url);
    return this.http.post(url,data,httpOptions2);
  } 

  getDiseaseId(diseaseName : string )
  {
    let data = {
      "disease_name": diseaseName
  }
    let url = this.baseUrl + "getdiseaseId";
    console.log(url);
    return this.http.post(url,data);
  }


}
