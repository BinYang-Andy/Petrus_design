import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user = {username:'',password:'', remember: false};

  constructor(public dialogRef:MatDialogRef<LoginComponent>) { } //<LoginComponets is the reference to a dialog opened>

  ngOnInit() {
  }

  onSubmit(){ 
     console.log('User: ', this.user);
     this.dialogRef.close(); // when close it, we also want to dismiss the component here.
  }

}
