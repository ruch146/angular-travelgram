import { Injectable } from '@angular/core';
//for authorization
import {AngularFireAuth} from "@angular/fire/auth"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //injecting auth in constructor
  constructor(private auth:AngularFireAuth) { }

  singUp(email:string,password:string){
    //returns an observable
    return this.auth.createUserWithEmailAndPassword(email,password)
  }
   



  singIn(email:string,password:string){
   //returns an observable
    return this.auth.signInWithEmailAndPassword(email,password)
  }


  getUser(){
    //authstate is a big object which gives info of user
    return this.auth.authState;
  }


  signOut(){
    return this.auth.signOut();
  }




  
}
