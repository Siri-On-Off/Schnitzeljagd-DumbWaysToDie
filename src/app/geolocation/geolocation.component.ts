import {Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import {DecimalPipe} from "@angular/common";

@Component({
  selector: 'app-geolocation',
  standalone: true,
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss'],
  imports: [
    DecimalPipe
  ]
})
export class GeolocationComponent implements OnInit, OnDestroy {
  ictCenterCoords = { latitude: 47.027171453084655, longitude: 8.300770702636505 };
  migrosKriensCoords = { latitude: 47.02758723687247, longitude: 8.300906172755733 };
  targetCoords = this.ictCenterCoords;
  distanceToTarget: WritableSignal<number | undefined> = signal(undefined);
  watchId: string | null = null;
  taskCompleted = false;


  async ngOnInit() {
    await this.startWatchingPosition();
  }

  ngOnDestroy() {
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
    }
  }

  async startWatchingPosition() {
    try {
      this.watchId = await Geolocation.watchPosition(
        { enableHighAccuracy: true },
        (position, err) => {
          if (err) {
            console.error('Fehler beim Abrufen der Position', err);
            return;
          }

          if (position) {
            const currentCoords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            this.calculateDistance(currentCoords);
          }
        }
      );
    } catch (error) {
      console.error('Fehler beim Starten von watchPosition', error);
    }
  }

  calculateDistance(currentCoords: { latitude: number; longitude: number }) {
    if (currentCoords) {
      this.distanceToTarget.set(haversineDistance(currentCoords, this.targetCoords));
      this.taskCompleted = this.distanceToTarget()! <= 15;
    }
  }
}

export function haversineDistance(
  coords1: { latitude: number; longitude: number },
  coords2: { latitude: number; longitude: number },
): number {
  const R = 6371e3; //  Earth's radius in meters
  const lat1Rad = coords1.latitude * (Math.PI / 180);
  const lat2Rad = coords2.latitude * (Math.PI / 180);
  const deltaLat = (coords2.latitude - coords1.latitude) * (Math.PI / 180);
  const deltaLon = (coords2.longitude - coords1.longitude) * (Math.PI / 180);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1Rad) *
    Math.cos(lat2Rad) *
    Math.sin(deltaLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // in meters
}
