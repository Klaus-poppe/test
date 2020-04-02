import { Component, OnInit, Input } from '@angular/core';
import { DialogflowService } from './services/dialogflow.service';
import { Messages } from './model/messages.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public message : Messages;
  public messages : Messages[];
  private disease : string;
  private intentId : Number;
  private diseaseId : Number; 

  ngOnInit() {
  }


  constructor(private dialogFlowService: DialogflowService) {
    this.message = new Messages('', 'assets/images/user.jpg');
    this.messages = [
      new Messages('Welcome to chatbot universe', 'assets/images/bot.png', new Date())
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

       if(res.result.fulfillment.messages[1].payload.hasOwnProperty("disease_name")){
         this.disease = res.result.fulfillment.messages[1].payload.disease_name
         this.dialogFlowService.getDiseaseId(this.disease).subscribe( 
          (res : any) =>{
            this.diseaseId = res.disease_id
            console.log(this.diseaseId + " " + this.intentId)
        })  
        if(this.intentId == null)
       this.messages.push( new Messages("What would u like to know about " + this.disease + "?" , 'assets/images/bot.png', res.timestamp));
       console.log(this.diseaseId + " " + this.intentId)
      } 
        
      if (this.intentId != null || res.result.fulfillment.messages[1].payload.hasOwnProperty("intentID")) {
        console.log(this.diseaseId + " " + this.intentId)
        if(this.intentId == null)
        this.intentId = res.result.fulfillment.messages[1].payload.intentID 
        if(this.diseaseId == null){
        this.messages.push( new Messages("For which disease?", 'assets/images/bot.png', res.timestamp));
        console.log(this.diseaseId + " " + this.intentId)
          return
        }
         
        this.dialogFlowService.getLinks(this.diseaseId , this.intentId).subscribe( 
          (res : any) =>{
            for (const link of res.links) {
              this.messages.push( new Messages(link.link, 'assets/images/bot.png', new Date()));
            }
        })  
     
       this.intentId = null
       }
      });


  //  if(this.disease != ""){
  //    this.dialogFlowServic*e.getDiseaseId(this.disease).subscribe( 
  //      (res : any) =>{
  //        this.diseaseId = res.diseaseId
  //        this.messages.push( new Messages("What would u like to know about" + this.disease , 'assets/images/bot.png', res.timestamp));
       
  //      })  
  //   this.disease = ""
  //   } 

    // if(this.intentId != null){
    //   if(this.diseaseId == null)
    //   this.messages.push( new Messages("For which disease?", 'assets/images/bot.png', res.timestamp));
       
    //   this.dialogFlowService.getLinks(this.diseaseId , this.intentId).subscribe( 
    //     (res : any) =>{
    //       for (const link of res.links) {
    //         this.messages.push( new Messages(link.link, 'assets/images/bot.png', new Date()));
    //       }
    //     })  
    //  this.intentId = null
    //  } 

  this.message = new Messages('', 'assets/images/user.jpg');
}

}
