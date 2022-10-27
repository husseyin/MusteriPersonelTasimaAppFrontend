import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  // form
  userForm: FormGroup;

  // response
  users: User[];

  // table
  loading: boolean;
  selectedUsers: User[];

  // dialog
  userDialog: boolean;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.loadUser();
    this.createdUserForm();
  }

  exit() {
    this.router.navigate(['/']).then(() => {
      window.localStorage.clear();
      window.location.reload();
    });
  }

  createdUserForm() {
    this.userForm = this.formBuilder.group({
      userId: [0],
      kullaniciAdi: ['', Validators.required],
      email: ['', Validators.required],
      sifre: ['', Validators.required],
      firma: ['', Validators.required],
    });
  }

  updateUserButton(user: User) {
    this.userForm.setValue({
      userId: user.userId,
      kullaniciAdi: user.kullaniciAdi,
      email: user.email,
      sifre: user.sifre,
      firma: user.firma,
    });

    this.userDialog = true;
  }

  cancelUserDialog() {
    this.userForm.setValue({
      userId: 0,
      kullaniciAdi: '',
      email: '',
      sifre: '',
      firma: '',
    });

    this.userDialog = false;
  }

  saveUserDialog() {
    if (this.userForm.valid) {
      let userModel = Object.assign({}, this.userForm.value);

      if (userModel['userId']) {
        this.userService.update(userModel).subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: response.message,
              detail: userModel['kullaniciAdi'],
            });

            this.cancelUserDialog();
            this.loadUser();
          },
          (responseError) => {
            this.messageService.add({
              severity: 'error',
              summary: responseError.error.message,
              detail: userModel['kullaniciAdi'],
            });
          }
        );
      } else {
        this.userService.add(userModel).subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: response.message,
              detail: userModel['kullaniciAdi'],
            });

            this.cancelUserDialog();
            this.loadUser();
          },
          (responseError) => {
            this.messageService.add({
              severity: 'error',
              summary: responseError.error.message,
              detail: userModel['kullaniciAdi'],
            });
          }
        );
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Hata!!',
        detail: 'Formu Eksiksiz Doldurun!!',
      });
    }
  }

  deleteUserConfirm(user: User) {
    this.selectedUsers = [];
    this.selectedUsers.push(user);

    this.confirmationService.confirm({
      message: `${user.kullaniciAdi} Silinecektir Onaylıyor Musunuz?`,
      header: 'Kullanıcı Silme',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'reject',
      acceptLabel: 'Evet',
      acceptButtonStyleClass: 'p-button-sm p-button-outlined  p-button-info',
      rejectLabel: 'Hayır',
      rejectButtonStyleClass: 'p-button-sm p-button-outlined  p-button-info',
      accept: () => {
        this.userService.delete(user).subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: response.message,
              detail: user.kullaniciAdi,
            });

            this.selectedUsers = [];
            this.loadUser();
          },
          (responseError) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Hata!!',
              detail: responseError.error.message,
            });
          }
        );
      },
      reject: () => {
        this.selectedUsers = [];
      },
    });
  }

  deleteAllUserConfirm() {
    this.confirmationService.confirm({
      message: 'Seçili Kullanıcılar Silinecektir Onaylıyor Musunuz?',
      header: 'Çoklu Kullanıcı Silme',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'reject',
      acceptLabel: 'Evet',
      acceptButtonStyleClass: 'p-button-sm p-button-outlined  p-button-info',
      rejectLabel: 'Hayır',
      rejectButtonStyleClass: 'p-button-sm p-button-outlined  p-button-info',
      accept: () => {
        let successful = <any>[];
        this.userService.deleteAll(this.selectedUsers).subscribe(
          (response) => {
            this.selectedUsers.forEach((user) => {
              if (response.success) successful.push(user.kullaniciAdi);
            });

            this.messageService.add({
              severity: 'success',
              summary: response.message,
              detail: `${successful.join(', ')}`,
            });

            this.selectedUsers = [];
            this.loadUser();
          },
          (responseError) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Hata!!',
              detail: responseError.error.message,
            });
          }
        );
      },
      reject: () => {
        this.selectedUsers = [];
      },
    });
  }

  loadUser() {
    this.loading = true;

    setTimeout(() => {
      this.userService.getAll().subscribe(
        (response) => {
          this.users = response.data;
          this.loading = false;
        },
        (responseError) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Hata!!',
            detail: responseError.error.message,
          });
        }
      );
    }, 1000);
  }
}
