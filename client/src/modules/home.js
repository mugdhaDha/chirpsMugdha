import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {AuthService} from 'aurelia-auth';
import {Users} from '../resources/data/users';
import {
  ValidationControllerFactory,
  ValidationController,
  ValidationRules
} from 'aurelia-validation';
import {BootstrapFormRenderer} from '../resources/utils/bootstrap-form-renderer';


@inject(Router, AuthService, Users, ValidationControllerFactory)
export class Home {
  constructor(router, auth, users, controllerFactory) {
	  this.router = router;
    this.auth = auth;
    this.message = 'Chirps';
    this.showLogon = true;
    this.email;
    this.password;
    this.loginError = "";
    this.registerError = "";
    this.users = users;
    this.controller = controllerFactory.createForCurrentScope();
    this.controller.addRenderer(new BootstrapFormRenderer());  

  }

  login() {
    return this.auth.login(this.email, this.password)
    
    .then(response => {
	      sessionStorage.setItem("user", JSON.stringify(response.user));
	      this.loginError = "";
        console.log("reached till navigator for wall");
	      this.router.navigate('wall');
      })
      .catch(error => {
        console.log(error);
        console.log("this.email: " +this.email +"this.pw: " + this.password)
        this.loginError = "Invalid credentials.";
      });
  };

  
  showRegister(){
	  this.showLogon = !this.showLogon;
  }

 
  async save() {
    let result = await this.controller.validate();
      var user = {
      fname: this.fname,
      lname: this.lname,
      email: this.email,
      screenname: this.screenname,
      password: this.password
    }

     let serverResponse =  await this.users.save(user);
     
     if(!serverResponse.error){
       this.registerError = "";
       this.showLogon = true;
    } else {
      this.registerError = "There was a problem registering the user."
    }

 }

}
ValidationRules  
	.ensure(a => a.fname).required()
	.ensure(a => a.lname).required()  
	.ensure(a => a.email).required().email()  
	.ensure(a => a.screenname).required()  
	.on(Home);
