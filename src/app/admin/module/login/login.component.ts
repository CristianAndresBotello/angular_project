import { Component, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  UntypedFormBuilder,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs';
import {Md5} from 'ts-md5';

//Services
import { AuthService } from "../../service/auth/auth.service";
import { EncryptionService } from "../../service/encryption/encryption.service";
import { ToastService } from "../../service/toast/toast.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm!: UntypedFormGroup;
  submitted = false;

  public toastOptions = { id: "login-toast" };

  constructor(
    private encryptionService: EncryptionService,
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // Validate if already was logged in
    if (this.authService.userValue) {
      this.router.navigateByUrl("/admin/dashboard");
    }

    //Form object and validations
    this.loginForm = this.formBuilder.group({
      loginUser: ["", [Validators.required, Validators.minLength(4)]],
      loginPassword: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  /**
   * Get form control element
   * @param controlName
   * @returns FormControl
   */
  getControl(controlName: string): UntypedFormControl {
    return this.loginForm.get(controlName) as UntypedFormControl;
  }

  /**
   * Login form submit
   */
  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.toastService.clear();

    //Validate form
    if (this.loginForm.invalid) {
      return;
    }

    // Encrypt data to send
    let { userName, password } = this.encryptionService.encryptObject({
      userName: this.generateMD5(this.loginForm.controls.loginUser.value),
      password: this.generateMD5(this.loginForm.controls.loginPassword.value),
    });

    //Get API response
    this.authService
      .loginUser(userName, password)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastService.success("Welcome!", this.toastOptions);
          // get return url from query parameters or default to home page
          const returnUrl =
            this.route.snapshot.queryParams["returnUrl"] || "/admin/dashboard";
          this.router.navigateByUrl(returnUrl);
        },
        error: (error) => {
          // console.log({ error });
          this.toastService.error(error.error.message, this.toastOptions);
        },
      });
  }

  /**
   * Generate md5 from string
   * @param {String} data
   * @returns {String}
   */
  private generateMD5(data: string): string {
    const md5 = new Md5();
    let response: any = md5.appendStr(data).end();
    return response;
  }

  /**
   * Get current year
   * @returns Integer
   */
  getCurrentYear() {
    const date = new Date();
    return date.getFullYear();
  }
}
