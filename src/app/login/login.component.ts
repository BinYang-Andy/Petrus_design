import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user = {username:'',password:'', remember: false};
  errMess:string;

  constructor(public dialogRef:MatDialogRef<LoginComponent>,
              public authService:AuthService) { } //<LoginComponets is the reference to a dialog opened>

  ngOnInit() {
  }

  onSubmit(){ 
     console.log('User: ', this.user);
     this.authService.logIn(this.user)
      .subscribe(res=>{
        if(res.success){
        this.dialogRef.close(res.success);
      } else {
        console.log(res);
      }
    },
    error=>{
      console.log(error);
      this.errMess=error;
    });
  
  }

}
