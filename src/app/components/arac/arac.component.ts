import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Arac } from 'src/app/models/arac';
import { AracService } from 'src/app/services/arac.service';

@Component({
  selector: 'app-arac',
  templateUrl: './arac.component.html',
  styleUrls: ['./arac.component.css'],
})
export class AracComponent implements OnInit {
  // form
  aracForm: FormGroup;

  // response
  araclar: Arac[];

  // table
  loading: boolean;
  selectedAraclar: Arac[];

  // dialog
  aracDialog: boolean;

  constructor(
    private aracService: AracService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.loadArac();
    this.createdAracForm();
  }

  exit() {
    this.router.navigate(['/']).then(() => {
      window.localStorage.clear();
      window.location.reload();
    });
  }

  createdAracForm() {
    this.aracForm = this.formBuilder.group({
      aracId: [0],
      aracPlaka: ['', Validators.required],
    });
  }

  updateAracButton(arac: Arac) {
    this.aracForm.setValue({
      aracId: arac.aracId,
      aracPlaka: arac.aracPlaka,
    });

    this.aracDialog = true;
  }

  cancelAracDialog() {
    this.aracForm.setValue({
      aracId: 0,
      aracPlaka: '',
    });

    this.aracDialog = false;
  }

  saveAracDialog() {
    if (this.aracForm.valid) {
      let aracModel = Object.assign({}, this.aracForm.value);
      aracModel['firma'] = localStorage.getItem('firma');

      if (aracModel['aracId']) {
        this.aracService.update(aracModel).subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: response.message,
              detail: aracModel['aracPlaka'],
            });
            this.cancelAracDialog();
            this.loadArac();
          },
          (responseError) => {
            this.messageService.add({
              severity: 'error',
              summary: responseError.error.message,
              detail: aracModel['aracPlaka'],
            });
          }
        );
      } else {
        this.aracService.add(aracModel).subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: response.message,
              detail: aracModel['aracPlaka'],
            });
            this.cancelAracDialog();
            this.loadArac();
          },
          (responseError) => {
            this.messageService.add({
              severity: 'error',
              summary: responseError.error.message,
              detail: aracModel['aracPlaka'],
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

  deleteAracConfirm(arac: Arac) {
    this.selectedAraclar = [];
    this.selectedAraclar.push(arac);

    this.confirmationService.confirm({
      message: `${arac.aracPlaka} Silinecektir Onaylıyor Musunuz?`,
      header: 'Araç Silme',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'reject',
      acceptLabel: 'Evet',
      acceptButtonStyleClass: 'p-button-sm p-button-outlined  p-button-info',
      rejectLabel: 'Hayır',
      rejectButtonStyleClass: 'p-button-sm p-button-outlined  p-button-info',
      accept: () => {
        this.aracService.delete(arac).subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: response.message,
              detail: arac.aracPlaka,
            });

            this.selectedAraclar = [];
            this.loadArac();
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
        this.selectedAraclar = [];
      },
    });
  }

  deleteAllAracConfirm() {
    this.confirmationService.confirm({
      message: 'Seçili Araçlar Silinecektir Onaylıyor Musunuz?',
      header: 'Çoklu Araç Silme',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'reject',
      acceptLabel: 'Evet',
      acceptButtonStyleClass: 'p-button-sm p-button-outlined  p-button-info',
      rejectLabel: 'Hayır',
      rejectButtonStyleClass: 'p-button-sm p-button-outlined  p-button-info',
      accept: () => {
        let successful = <any>[];
        this.aracService.deleteAll(this.selectedAraclar).subscribe(
          (response) => {
            this.selectedAraclar.forEach((arac) => {
              if (response.success) successful.push(arac.aracPlaka);
            });

            this.messageService.add({
              severity: 'success',
              summary: response.message,
              detail: `${successful.join(', ')}`,
            });

            this.selectedAraclar = [];
            this.loadArac();
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
        this.selectedAraclar = [];
      },
    });
  }

  loadArac() {
    this.loading = true;

    setTimeout(() => {
      this.aracService.getAll().subscribe(
        (response) => {
          this.araclar = response.data;
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
