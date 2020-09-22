import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';
import  {Router} from '@angular/router';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  form : HTMLFormElement
  error:string;
  success:string;
  constructor(private userServcie:UserService, private router:Router, private fb: FormBuilder) { }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      // name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // mobile:new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      // username: ['', [Validators.required], this.customValidator.userNameValidator.bind(this.customValidator)],
      password: ['', Validators.compose([Validators.required])]
      
    });
  }

  login($event : Event){
    event.preventDefault();
    console.log(event.target);
    this.form = <HTMLFormElement>event.target;
    this.readFormValues();
  }

  navigateToHomePage(){
    this.router.navigate([""]);
  }

  readFormValues(){
    let email = (<HTMLInputElement>this.form.elements.namedItem("email")).value;
    let password = (<HTMLInputElement>this.form.elements.namedItem("password")).value;

    let credentials = {
      email, password
    }

    console.log(credentials);
    this.userServcie.login(credentials).subscribe(
      {
        next:(result)=>{
          console.log(result);
          this.success=result.message;
          this.error = undefined;
          this.navigateToHomePage();
        },
        error : (response)=>{
          console.log(response.error);
          this.success = undefined;
          this.error = response.error.error.message;
        }
      }
    )
  }

}
