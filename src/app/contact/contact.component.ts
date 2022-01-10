import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder,FormGroup, NgForm, Validators} from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { flyInOut } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';
import { baseURL } from '../shared/baseurl';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host:{
    '[@flyInOut]':'true',
    'style':'display:block;'
  },
  animations:[
    flyInOut()
  ]
})
export class ContactComponent implements OnInit {


  feedbackForm: FormGroup; // the model that is going to host reactive form
  feedback:Feedback;      // declare a var  feedback of the type of feedback
                          //later on this feedback value can be fetched from server
  contactType = ContactType;
  showSpinner = false;
  showForm = true;
  aftersubmit= null;
 
  @ViewChild('fform') feedbackFormDirective;

  formErrors ={
    'firstname':'',
    'lastname':'',
    'telnum':'',
    'email':''
  };

  validationMessages = {
    'firstname':{
      'required':      'First name is required.',
      'minlength':     'First name must be at least 2 characters long',
      'maxlength':     'First name cannot be more than 25 characters long'
    },
    'lastname':{
      'required':      'Last name is required.',
      'minlength':     'Last name must be at least 2 characters long',
      'maxlength':     'Last name cannot be more than 25 characters long'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  }

  constructor(private fb: FormBuilder,
              private feedbackService: FeedbackService) {
        
   }

  ngOnInit() {
    this.createForm();
    // this.feedbackService.getFeedback()
    //   .subscribe(feedback=>this.feedback=feedback)
  }

  createForm(){
    this.feedbackForm = this.fb.group({
      firstname:['', [Validators.required, Validators.minLength(2),Validators.maxLength(25)]],
      lastname:['', [Validators.required, Validators.minLength(2),Validators.maxLength(25)]],
      telnum:[0, [Validators.required, Validators.pattern]],
      email:['', [Validators.required, Validators.email]],
      agree:false,
      contacttype: 'None',
      message:''
    });

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); //(re)set form validation messages
  }

  onValueChanged(data?: any){
    if(!this.feedbackForm){ return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors){
      if(this.formErrors.hasOwnProperty(field)){
        //clear pervious error message(if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];
          for(const key in control.errors){
            if (control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.showForm = false;
    this.feedbackService.addFeedback(this.feedback)
    .subscribe(feedback=>{
      this.aftersubmit = feedback;
      this.feedback = null;
      setTimeout(()=>{
        this.aftersubmit = null; this.showForm = true
      },5000)
    });
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

  loadData(){
    this.showSpinner = true;
    
    setTimeout(()=>{
      this.showSpinner = false;
    }, 2000);
  }
}
