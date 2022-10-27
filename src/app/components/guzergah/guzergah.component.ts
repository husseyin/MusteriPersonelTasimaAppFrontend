import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Guzergah } from 'src/app/models/guzergah';
import { GuzergahService } from 'src/app/services/guzergah.service';
declare var google: any;

@Component({
  selector: 'app-guzergah',
  templateUrl: './guzergah.component.html',
  styleUrls: ['./guzergah.component.css'],
})
export class GuzergahComponent implements OnInit {
  // form
  guzergahForm: FormGroup;

  // response
  guzergahlar: Guzergah[];

  // table
  loading: boolean;
  selectedGuzergahlar: Guzergah[];

  // dialog
  guzergahDialog: boolean;

  // map
  options: any;
  overlays: any[];
  location: string;

  constructor(
    private guzergahService: GuzergahService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.loadGuzergah();
    this.createdGuzergahForm();

    this.options = {
      center: { lat: 41.015137, lng: 28.97953 },
      zoom: 12,
    };
  }

  handleMapClick(event: any) {
    this.overlays = [];

    this.overlays.push(
      new google.maps.Marker({
        position: { lat: event.latLng.lat(), lng: event.latLng.lng() },
        title: 'Güzergah',
        draggable: false,
      })
    );

    this.location = `${event.latLng.lat()} ${event.latLng.lng()}`;
    this.createdGuzergahForm();
  }

  handleOverlayClick() {
    this.overlays = [];
    this.location = '';
    this.createdGuzergahForm();
  }

  exit() {
    this.router.navigate(['/']).then(() => {
      window.localStorage.clear();
      window.location.reload();
    });
  }

  createdGuzergahForm() {
    this.guzergahForm = this.formBuilder.group({
      guzergahId: [0],
      guzergahAdi: ['', Validators.required],
      guzergahLoc: [this.location, Validators.required],
    });
  }

  updateGuzergahButton(guzergah: Guzergah) {
    this.guzergahForm.setValue({
      guzergahId: guzergah.guzergahId,
      guzergahAdi: guzergah.guzergahAdi,
      guzergahLoc: this.location ? this.location : guzergah.guzergahLoc,
    });

    this.guzergahDialog = true;
  }

  cancelGuzergahDialog() {
    this.guzergahForm.setValue({
      guzergahId: 0,
      guzergahAdi: '',
      guzergahLoc: '',
    });

    this.guzergahDialog = false;
    this.handleOverlayClick();
  }

  saveGuzergahDialog() {
    if (this.guzergahForm.valid) {
      let guzergahModel = Object.assign({}, this.guzergahForm.value);
      guzergahModel['firma'] = localStorage.getItem('firma');

      if (guzergahModel['guzergahId']) {
        this.guzergahService.update(guzergahModel).subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: response.message,
              detail: guzergahModel['guzergahAdi'],
            });

            this.cancelGuzergahDialog();
            this.loadGuzergah();
          },
          (responseError) => {
            this.messageService.add({
              severity: 'error',
              summary: responseError.error.message,
              detail: guzergahModel['guzergahAdi'],
            });
          }
        );
      } else {
        this.guzergahService.add(guzergahModel).subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: response.message,
              detail: guzergahModel['guzergahAdi'],
            });

            this.cancelGuzergahDialog();
            this.loadGuzergah();
          },
          (responseError) => {
            this.messageService.add({
              severity: 'error',
              summary: responseError.error.message,
              detail: guzergahModel['guzergahAdi'],
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

  deleteGuzergahConfirm(guzergah: Guzergah) {
    this.selectedGuzergahlar = [];
    this.selectedGuzergahlar.push(guzergah);

    this.confirmationService.confirm({
      message: `${guzergah.guzergahAdi} Silinecektir Onaylıyor Musunuz?`,
      header: 'Güzergah Silme',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'reject',
      acceptLabel: 'Evet',
      acceptButtonStyleClass: 'p-button-sm p-button-outlined  p-button-info',
      rejectLabel: 'Hayır',
      rejectButtonStyleClass: 'p-button-sm p-button-outlined  p-button-info',
      accept: () => {
        this.guzergahService.delete(guzergah).subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: response.message,
              detail: guzergah.guzergahAdi,
            });

            this.selectedGuzergahlar = [];
            this.loadGuzergah();
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
        this.selectedGuzergahlar = [];
      },
    });
  }

  deleteAllGuzergahConfirm() {
    this.confirmationService.confirm({
      message: 'Seçili Güzergahlar Silinecektir Onaylıyor Musunuz?',
      header: 'Çoklu Güzergah Silme',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'reject',
      acceptLabel: 'Evet',
      acceptButtonStyleClass: 'p-button-sm p-button-outlined  p-button-info',
      rejectLabel: 'Hayır',
      rejectButtonStyleClass: 'p-button-sm p-button-outlined  p-button-info',
      accept: () => {
        let successful = <any>[];
        this.guzergahService.deleteAll(this.selectedGuzergahlar).subscribe(
          (response) => {
            this.selectedGuzergahlar.forEach((guzergah) => {
              if (response.success) successful.push(guzergah.guzergahAdi);
            });

            this.messageService.add({
              severity: 'success',
              summary: response.message,
              detail: `${successful.join(', ')}`,
            });

            this.selectedGuzergahlar = [];
            this.loadGuzergah();
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
        this.selectedGuzergahlar = [];
      },
    });
  }

  loadGuzergah() {
    this.loading = true;

    setTimeout(() => {
      this.guzergahService.getAll().subscribe(
        (response) => {
          this.guzergahlar = response.data;
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
