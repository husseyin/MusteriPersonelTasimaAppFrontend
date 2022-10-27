import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Sofor } from 'src/app/models/sofor';
import { SoforService } from 'src/app/services/sofor.service';

@Component({
  selector: 'app-sofor',
  templateUrl: './sofor.component.html',
  styleUrls: ['./sofor.component.css'],
})
export class SoforComponent implements OnInit {
  // form
  soforForm: FormGroup;

  // response
  soforler: Sofor[];

  // table
  loading: boolean;
  selectedSoforler: Sofor[];

  // dialog
  soforDialog: boolean;

  constructor(
    private soforService: SoforService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.loadSofor();
    this.createdSoforForm();
  }

  exit() {
    this.router.navigate(['/']).then(() => {
      window.localStorage.clear();
      window.location.reload();
    });
  }

  createdSoforForm() {
    this.soforForm = this.formBuilder.group({
      soforId: [0],
      soforAdSoyad: ['', Validators.required],
      soforTc: [''],
      soforCep: [''],
    });
  }

  updateSoforButton(sofor: Sofor) {
    this.soforForm.setValue({
      soforId: sofor.soforId,
      soforAdSoyad: sofor.soforAdSoyad,
      soforTc: sofor.soforTc,
      soforCep: sofor.soforCep,
    });

    this.soforDialog = true;
  }

  cancelSoforDialog() {
    this.soforForm.setValue({
      soforId: 0,
      soforAdSoyad: '',
      soforTc: '',
      soforCep: '',
    });

    this.soforDialog = false;
  }

  saveSoforDialog() {
    if (this.soforForm.valid) {
      let soforModel = Object.assign({}, this.soforForm.value);

      if (soforModel['soforId']) {
        this.soforService.update(soforModel).subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: response.message,
              detail: soforModel['soforAdSoyad'],
            });

            this.cancelSoforDialog();
            this.loadSofor();
          },
          (responseError) => {
            this.messageService.add({
              severity: 'error',
              summary: responseError.error.message,
              detail: soforModel['soforAdSoyad'],
            });
          }
        );
      } else {
        this.soforService.add(soforModel).subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: response.message,
              detail: soforModel['soforAdSoyad'],
            });

            this.cancelSoforDialog();
            this.loadSofor();
          },
          (responseError) => {
            this.messageService.add({
              severity: 'error',
              summary: responseError.error.message,
              detail: soforModel['soforAdSoyad'],
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

  deleteSoforConfirm(sofor: Sofor) {
    this.selectedSoforler = [];
    this.selectedSoforler.push(sofor);

    this.confirmationService.confirm({
      message: `${sofor.soforAdSoyad} Silinecektir Onaylıyor Musunuz?`,
      header: 'Şoför Silme',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'reject',
      acceptLabel: 'Evet',
      acceptButtonStyleClass: 'p-button-sm p-button-outlined  p-button-info',
      rejectLabel: 'Hayır',
      rejectButtonStyleClass: 'p-button-sm p-button-outlined  p-button-info',
      accept: () => {
        this.soforService.delete(sofor).subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: response.message,
              detail: sofor.soforAdSoyad,
            });

            this.selectedSoforler = [];
            this.loadSofor();
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
        this.selectedSoforler = [];
      },
    });
  }

  deleteAllSoforConfirm() {
    this.confirmationService.confirm({
      message: 'Seçili Şoförler Silinecektir Onaylıyor Musunuz?',
      header: 'Çoklu Şoför Silme',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'reject',
      acceptLabel: 'Evet',
      acceptButtonStyleClass: 'p-button-sm p-button-outlined  p-button-info',
      rejectLabel: 'Hayır',
      rejectButtonStyleClass: 'p-button-sm p-button-outlined  p-button-info',
      accept: () => {
        let successful = <any>[];
        this.soforService.deleteAll(this.selectedSoforler).subscribe(
          (response) => {
            this.selectedSoforler.forEach((sofor) => {
              if (response.success) successful.push(sofor.soforAdSoyad);
            });

            this.messageService.add({
              severity: 'success',
              summary: response.message,
              detail: `${successful.join(', ')}`,
            });

            this.selectedSoforler = [];
            this.loadSofor();
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
        this.selectedSoforler = [];
      },
    });
  }

  loadSofor() {
    this.loading = true;

    setTimeout(() => {
      this.soforService.getAll().subscribe(
        (response) => {
          this.soforler = response.data;
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
