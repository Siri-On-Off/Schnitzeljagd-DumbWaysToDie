import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  async checkCameraPermission(): Promise<boolean> {
    if (Capacitor.getPlatform() === 'web') {
      console.warn('⚠️ Kamera-Berechtigung wird im Web simuliert.');
      return true;
    }

    const result = await Camera.requestPermissions();
    return result.camera === 'granted';
  }

  async checkLocationPermission(): Promise<boolean> {
    if (Capacitor.getPlatform() === 'web') {
      console.warn('⚠️ Standort-Berechtigung wird im Web simuliert.');
      return true;
    }

    const result = await Geolocation.requestPermissions();
    return result.location === 'granted';
  }
}
