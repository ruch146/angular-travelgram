import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

//forms
import {NgForm} from "@angular/forms";
import {finalize} from 'rxjs/operators';
//firebase
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFireDatabase} from '@angular/fire/database';
//for resizing image
import { readAndCompressImage } from 'browser-image-resizer';
//includes config for image
import { imageConfig } from 'src/utils/config';




@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  picture:string="https://learnyst.s3.amazonaws.com/assets/schools/2410/resources/images/logo_lco_i3oab.png"
  uploadPercent:number=null;

  constructor(
    private auth:AuthService,
    private router:Router,
    private db:AngularFireDatabase,
    private storage:AngularFireStorage,
    private toastr:ToastrService) { }

  ngOnInit(): void {
  }


  onSubmit(f:NgForm){
    const {email,password,username,country,bio,name}=f.form.value;

    //all validations to be done here
    this.auth.singUp(email,password)
    .then((res)=>{
      console.log(res);
      const {uid}=res.user;//uid extracted from firebase

      this.db.object(`/users/${uid}`)
      .set(
        {
          id:uid,
          name:name,
          email:email,
          instaUsername:username,
          country:country,
          bio:bio,
          picture:this.picture
        }
      )
    })
    .then(
      ()=>{
        this.router.navigateByUrl('/');
        this.toastr.success('Signup success');
      }
    )
    .catch(
      (err)=>{
        this.toastr.error("Signup Failed")
      }
    )
  }

  async  uploadFile(event){
    const file=event.target.files[0];
    let resizedImage=await readAndCompressImage(file,imageConfig)

    const filePath=file.name ;
    const fileRef=this.storage.ref(filePath)

    //uploading in storage
    const task=this.storage.upload(filePath,resizedImage);
    task.percentageChanges().subscribe((percentage)=>{
      this.uploadPercent=percentage
    });
    task.snapshotChanges()
    .pipe(
      finalize(()=>{
        fileRef.getDownloadURL().subscribe((url)=>{
          this.picture=url;
          this.toastr.info("Image upload success")
        })
      })
    )
    .subscribe();
  }

}
