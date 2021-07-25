import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { User } from 'src/app/models/user';
import { HelperService, Status } from 'src/app/services/helper.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  userForm:FormGroup;

  selectedUser: User = {id:null, username:'', email: ''};

  submitButton:string = 'CREATE USER';


  constructor(
    private fb:FormBuilder,
    private snackbar: MatSnackBar,
    private helperService:HelperService,
    private dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User

  ) { }

  ngOnInit() {
    if(this.data){
      this.selectedUser = this.data;
      if(this.data.id){ this.submitButton = 'UPDATE USER'; }
    }

    this.createuserForm();
  }

  createuserForm(){
    this.userForm = this.fb.group({
      username: [this.selectedUser.username, [Validators.required, this.checkValidUsername()]],
      email: [this.selectedUser.email, [Validators.required, Validators.email]]
    });
  }

  checkValidUsername(){
    return (control: AbstractControl): ValidationErrors | null=> {
      let error = /^\S*$/.test(control.value);
      return !error ? {usernameValidator: {value: "Username should not contain spaces."}} : null;
    };
  }

  getErrorMessage(control:AbstractControl){
    if(control.errors.required) return 'Required';
    if(control.errors.usernameValidator) return control.errors.usernameValidator.value;
    if(control.errors.email) return 'Invalid email';
  }

  onSubmit(){
    if(this.userForm.valid){

      let user = new User(this.userForm.value);

      var userResult;

      if(this.data && this.data.id){
        userResult = this.helperService.setUsers([user], Status.UPDATE);  
      }
      else{
        userResult = this.helperService.setUsers([user], Status.CREATE);  
      }

      if(!userResult.success){
        this.snackbar.open(userResult.message, 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
      else{
        this.dialogRef.close();
      }
    }
  }

}
