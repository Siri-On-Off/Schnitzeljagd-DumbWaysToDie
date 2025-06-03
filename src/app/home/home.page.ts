import { Component } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { GameService } from '../services/game.service';
import { PermissionService } from '../services/permission.service';
import { Router } from '@angular/router';
import {ScannerComponent} from "../scanner/scanner/scanner.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [IonicModule, ScannerComponent],
})
export class HomePage {
  constructor(
    private alertCtrl: AlertController,
    private gameService: GameService,
    private permissionService: PermissionService,
    private router: Router
  ) {}

  async ionViewDidEnter() {
    await this.askPlayerName();
  }

  async askPlayerName() {
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
              return false; // Popup bleibt offen
            }
            return true; // Popup schließt sich
          },
        },
      ],
      backdropDismiss: false,
    });

    await alert.present();

    const { data } = await alert.onDidDismiss();
    const name = data?.values?.playerName?.trim();

    if (!name) {
      // Sicherheit, falls leer
      return;
    }

    const camGranted = await this.permissionService.checkCameraPermission();
    if (!camGranted) {
      await this.showError('Kamera-Zugriff verweigert.');
      await this.askPlayerName(); // Popup wieder öffnen
      return;
    }

    const locGranted = await this.permissionService.checkLocationPermission();
    if (!locGranted) {
      await this.showError('Standort-Zugriff verweigert.');
      await this.askPlayerName(); // Popup wieder öffnen
      return;
    }

    this.gameService.setPlayer(name);
    await this.showSuccess(`Viel Glück, ${name}!`);
    await this.router.navigateByUrl('/tasks');
  }

  private async showError(msg: string) {
    const alert = await this.alertCtrl.create({
      header: 'Fehler',
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }

  private async showSuccess(msg: string) {
    const alert = await this.alertCtrl.create({
      header: 'Schnitzeljagd gestartet',
      message: msg,
      buttons: ['Los geht’s!'],
    });
    await alert.present();
  }
}
