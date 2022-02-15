import { Component, OnInit, ViewChild,Inject, Input} from '@angular/core';
import { Params, ActivatedRoute} from '@angular/router';
import { Location} from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { visibility ,flyInOut,expand} from '../animations/app.animation';





@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host:{
    '[@flyInOut]':'true',
    'style':'display:block;'
  },
  animations:[
    flyInOut(), 
    visibility(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {

  // @Input()
  d:Date;
  showDate:string;
  dish:Dish;
  errMess:string;
  dishIds:string[];
  prev:string;
  next:string;
  commentForm: FormGroup;
  comment:Comment;
  dishcopy: Dish;
  visibility = 'shown';
  


  @ViewChild('commform') commentFormDirective;

  formErrors ={
    'author':'',
    'rating':'',
    'comment':'',
    'date':''
  };

  vaildationMessages = {
    'author':{
      'required':'Author name is required',
      'minlength':'Author name must be at least 2 characters long',
      'maxlength':'Author name cannot be more than 25 character long'
    },
    'comment':{
      'required':'Comment is required'

    }

  }

  formatLabel(value: number) {
    if (value >= 1) {
      return Math.round(value / 1);
    }
    return value;
  }


  constructor(private dishService:DishService,
              private location: Location,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              @Inject('BaseURL') private BaseURL) {
              
               }

  ngOnInit() {  
    
   this.createForm2();
   this.dishService.getDishIds()
      .subscribe((dishIds) => this.dishIds = dishIds);
   this.route.params.pipe(switchMap((params: Params) => {this.visibility = 'hidden'; return this.dishService.getDish(params['id']);}))
      .subscribe(dish => { this.dish = dish; this.dishcopy= dish; this.setPrevNext(dish.id); this.visibility = 'shown';},
      errmess => this.errMess =<any>errmess);
  }

  setPrevNext(dishId:string){
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }



  goBack(): void{
    this.location.back();
  }

  createForm2(){
    this.commentForm = this.fb.group({
      author:['',[Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      rating:5,
      comment:['',Validators.required],
      date:''
    
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); //(re)set form validation messages
  }



  onSubmit(){

    this.d = new Date();
    this.showDate = this.d.toISOString();
    this.commentForm.value.date = this.showDate;
    this.comment = this.commentForm.value;
    console.log(this.comment);
    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy)
      .subscribe(dish=>{
        this.dish = dish; this.dishcopy = dish;
      }, 
      errmess => {this.dish =null, this.dishcopy = null; this.errMess = <any>errmess});
    this.commentFormDirective.resetForm();
    this.commentForm.reset({
      author:'',
      rating:5,
      comment:'',
    })
  }
  onValueChanged(data?: any){
    if(!this.commentForm){ return; }
    const form = this.commentForm;
    for (const field in this.formErrors){
      if(this.formErrors.hasOwnProperty(field)){
        //clear pervious error message(if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages = this.vaildationMessages[field];
          for(const key in control.errors){
            if (control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

}
