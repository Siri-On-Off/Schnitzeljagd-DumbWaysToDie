import { Component } from '@angular/core';
import { GameService } from '../services/game.service';
import { PermissionService } from '../services/permission.service';
import { Router } from '@angular/router';
import {AlertController, IonButton, IonContent, IonHeader, IonTitle, IonToolbar} from "@ionic/angular/standalone";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
  ],
})
export class HomePage {
  playerName: string = '';

  constructor(
    private alertCtrl: AlertController,
    private gameService: GameService,
    private permissionService: PermissionService,
    private router: Router
  ) {}

  async startGame() {
    const alert = await this.alertCtrl.create({
      header: 'Willkommen!',
      message: 'Wie heisst du?',
      inputs: [
        {
          name: 'playerName',
          type: 'text',
          placeholder: 'Dein Name',
        },
      ],
      buttons: [
        {
          text: 'Starten',
          handler: (data) => {
            const name = data.playerName?.trim();
            if (!name) {
              this.showError('Bitte gib einen Namen ein.');
              return false;
            }
            this.playerName = name;
            return true;
          },
        },
      ],
      backdropDismiss: false,
    });

    await alert.present();
    const result = await alert.onDidDismiss();

    if (!this.playerName) return;

    // const camGranted = await this.permissionService.checkCameraPermission();
    // if (!camGranted) {
    //   await this.showError('Kamera-Zugriff verweigert.');
    //   return;
    // }
    //
    // const locGranted = await this.permissionService.checkLocationPermission();
    // if (!locGranted) {
    //   await this.showError('Standort-Zugriff verweigert.');
    //   return;
    // }

    this.gameService.setPlayer(this.playerName);
    await this.router.navigateByUrl('/tasks/qr');
  }

  private async showError(msg: string) {
    const alert = await this.alertCtrl.create({
      header: 'Fehler',
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
