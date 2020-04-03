import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { DialogflowService } from './services/dialogflow.service';
import { Messages } from './model/messages.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  public message : Messages;
  public messages : Messages[];
  private disease : string;
  private intentId : Number;
  private diseaseId : Number; 

  constructor(private dialogFlowService: DialogflowService) {
    this.message = new Messages('', 'assets/images/user.jpg');
    this.messages = [
      new Messages('Which disease whould you like to know about?', 'assets/images/bot.png', new Date())
    ];
    this.disease = ""
    this.diseaseId = null
    this.intentId = null
   }



    userInput(){

    if(this.message.content == "")
    return

    this.message.timestamp = new Date();
    this.messages.push(this.message);


    this.dialogFlowService.getResponse(this.message.content).subscribe(
    (res : any)  => {

      if(res.result.fulfillment.speech != "")  
        this.messages.push( new Messages(res.result.fulfillment.speech, 'assets/images/bot.png', res.timestamp));

      else if(res.result.fulfillment.messages[1].payload.hasOwnProperty("disease_name")){

        this.disease = res.result.fulfillment.messages[1].payload.disease_name

        this.dialogFlowService.getDiseaseId(this.disease).subscribe( 
        (res : any) =>{
          this.diseaseId = res.disease_id

          if(this.intentId != null)
            this.displayLinks();
          else
            this.messages.push( new Messages("What would u like to know about " + this.disease + "?" , 'assets/images/bot.png', new Date()));

        })  

      }else{ 

        if(this.intentId == null)
          this.intentId = res.result.fulfillment.messages[1].payload.intentID 

        if(this.diseaseId == null){
          this.messages.push( new Messages("For which disease?", 'assets/images/bot.png', res.timestamp));
          return
        }

        this.displayLinks();
      }
    });


    this.message = new Messages('', 'assets/images/user.jpg');
    }


    displayLinks() : void{

      this.dialogFlowService.getLinks(this.diseaseId , this.intentId).subscribe( 
        (res : any) =>{
          this.messages.push( new Messages("Here are some useful links", 'assets/images/bot.png', new Date()));
          for (const link of res.links) {
            this.messages.push( new Messages(link.link, 'assets/images/bot.png', new Date()));
          }
      })  

    this.intentId = null
    }    

    
}
