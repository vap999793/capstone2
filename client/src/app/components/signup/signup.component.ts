import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';
import  {Router} from '@angular/router';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  error:string;
  success:string;
  registerForm: FormGroup;
  submitted = false;

  constructor(private userServcie:UserService, private router:Router, private fb: FormBuilder) { }

  ngOnInit(): void {

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      // mobile:['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      // username: ['', [Validators.required], this.customValidator.userNameValidator.bind(this.customValidator)],
      password: ['', Validators.compose([Validators.required])],
      
    })
  }

  navigateToLoginPage(){
    this.router.navigate(['login'])
  }

  get f(){
    return this.registerForm.controls;
  }

  readValuesFromForm(form){
    // let form = <HTMLFontElement>event.target;
    let name = (<HTMLInputElement>form.getElementsByTagName("input").namedItem('name')).value;
    let email = (<HTMLInputElement>form.getElementsByTagName("input").namedItem('email')).value;
    let password = (<HTMLInputElement>form.getElementsByTagName("input").namedItem('password')).value;
    let phone = (<HTMLInputElement>form.getElementsByTagName("input").namedItem('phone')).value;

    let user : User={
      name, 
      email,
      password,
      phone
    };
    return user;

  }

  signup(event: Event){
    event.preventDefault();
    
    console.log();
    let form = <HTMLFormElement>event.target;
    let user = this.readValuesFromForm(form);
    this.createUser(user, form);
    

  }

  createUser(user:User, form : HTMLFormElement){
    this.userServcie.signup(user).subscribe(
      {
        next : (result)=>{
          console.log(result);
          this.success = result.message;
          this.error = undefined;
          form.reset();
          this.navigateToLoginPage();
          
        },
        error : (response)=>{
          console.log(response);
          this.error = response.error.error.message;
          this.success = undefined;
        }
      }
    )
  }
  

}
