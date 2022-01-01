import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder,FormGroup, Validators} from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {


  feedbackForm: FormGroup; // the model that is going to host reactive form
  feedback:Feedback;      // declare a var  feedback of the type of feedback
                          //later on this feedback value can be fetched from server
  contactType = ContactType;

  @ViewChild('fform') feedbackFormDirective;

  constructor(private fb: FormBuilder) {
        this.createForm();
   }

  ngOnInit() {
  }

  createForm(){
    this.feedbackForm = this.fb.group({
      firstname:['', Validators.required],
      lastname:['', Validators.required],
      telnum:[0, Validators.required],
      email:['', Validators.required],
      agree:false,
      contacttype: 'None',
      message:''
    });
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.feedbackForm.reset({
      firstname:'',
      lastname:'',
      telnum:0,
      email:'',
      agree: false,
      contacttype: 'None',
      message:''
    });
    this.feedbackFormDirective.resetForm();
  }

}
