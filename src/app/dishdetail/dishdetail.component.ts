import { Component, OnInit, ViewChild,Inject, Input} from '@angular/core';
import { Params, ActivatedRoute} from '@angular/router';
import { Location} from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Comment } from '../shared/comment';





// const DISH = {
//   id: '0',
//   name: 'Uthappizza',
//   image: '/assets/images/uthappizza.png',
//   category: 'mains',
//   featured: true,
//   label: 'Hot',
//   price: '4.99',
//   // tslint:disable-next-line:max-line-length
//   description: 'A unique combination of Indian Uthappam (pancake) and Italian pizza, topped with Cerignola olives, ripe vine cherry tomatoes, Vidalia onion, Guntur chillies and Buffalo Paneer.',
//   comments: [
//        {
//            rating: 5,
//            comment: 'Imagine all the eatables, living in conFusion!',
//            author: 'John Lemon',
//            date: '2012-10-16T17:57:28.556094Z'
//        },
//        {
//            rating: 4,
//            comment: 'Sends anyone to heaven, I wish I could get my mother-in-law to eat it!',
//            author: 'Paul McVites',
//            date: '2014-09-05T17:57:28.556094Z'
//        },
//        {
//            rating: 3,
//            comment: 'Eat it, just eat it!',
//            author: 'Michael Jaikishan',
//            date: '2015-02-13T17:57:28.556094Z'
//        },
//        {
//            rating: 4,
//            comment: 'Ultimate, Reaching for the stars!',
//            author: 'Ringo Starry',
//            date: '2013-12-02T17:57:28.556094Z'
//        },
//        {
//            rating: 2,
//            comment: 'It\'s your birthday, we\'re gonna party!',
//            author: '25 Cent',
//            date: '2011-12-02T17:57:28.556094Z'
//        }
//    ]
// };

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  // @Input()
  dish:Dish;
  dishIds:string[];
  prev:string;
  next:string;
  d:Date;       // const d = new Date()         
  showDate:string; //let showD = d.toISOString()
  commentForm: FormGroup;
  comment:Comment;
  


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
   this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id)});
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
      rating:[5, [Validators.required]],
      // rating:'',
      comment:['',[Validators.required]],
      date:''
      
    });
  }


  onSubmit(){
    this.d= new Date();
    this.showDate = this.d.toISOString();

    this.commentForm.value.date = this.showDate;

    this.comment = this.commentForm.value;

    console.log(this.comment);

    this.dish.comments.push(this.comment);

    this.commentForm.reset({
      author:'',
      rating:5,
      comment:'',
      date:''
    })
    this.commentFormDirective.resetForm();

  }

}
