import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  // form
  loginForm: FormGroup;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createdLoginForm();
  }

  createdLoginForm() {
    this.loginForm = this.formBuilder.group({
      kullaniciAdi: ['', Validators.required],
      sifre: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.valid) {
      let loginModel = Object.assign({}, this.loginForm.value);

      this.userService
        .validUser(loginModel['kullaniciAdi'], loginModel['sifre'])
        .subscribe(
          (valid) => {
            if (valid.success) {
              this.messageService.add({
                severity: 'success',
                summary: 'Onaylandı.',
                detail: 'Giriş Onaylandı.',
              });

              this.userService
                .getByUsername(loginModel['kullaniciAdi'])
                .subscribe((user) => {
                  setTimeout(() => {
                    window.localStorage.setItem('token', valid.data.toString());
                    window.localStorage.setItem('firma', user.data.firma);
                    this.router.navigate(['/araclar']);
                  }, 500);
                });
            }
          },
          (validError) => {
            this.messageService.add({
              severity: 'error',
              summary: validError.error.message,
              detail: 'Kullanıcı Adı veya Şifre Hatalı!!',
            });
          }
        );

      //   this.userService.getAll().subscribe((response) => {
      //     response.data.forEach((element) => {
      //       if (
      //         loginModel['kullaniciAdi'] == element.kullaniciAdi &&
      //         loginModel['sifre'] == element.sifre
      //       ) {
      //         this.messageService.add({
      //           severity: 'success',
      //           summary: 'Onaylandı.',
      //           detail: 'Giriş Onaylandı.',
      //         });

      //         window.localStorage.setItem('email', element.email);
      //         window.localStorage.setItem('firma', element.firma);
      //         this.router.navigate(['/araclar']);
      //       } else {
      //         this.messageService.add({
      //           severity: 'error',
      //           summary: 'Hata!!',
      //           detail: 'Kullanıcı Adı veya Şifre Hatalı!!',
      //         });
      //       }
      //     });
      //   });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Hata!!',
        detail: 'Formu Eksiksiz Doldurun!!',
      });
    }
  }
}
