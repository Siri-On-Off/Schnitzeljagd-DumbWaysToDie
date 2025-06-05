import {Component, EventEmitter, OnDestroy, OnInit, Output, signal, WritableSignal} from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import {DecimalPipe} from "@angular/common";
import {TaskService} from "../services/task.service";
import {
  IonCardContent,
  IonItem,
  IonLabel,
  IonText,
} from "@ionic/angular/standalone";

@Component({
  selector: 'app-distance',
  standalone: true,
  templateUrl: './distance.component.html',
  styleUrls: ['./distance.component.scss'],
  imports: [
    DecimalPipe,
    IonCardContent,
    IonText,
    IonLabel,
    IonItem
  ]
})
export class DistanceComponent  implements OnInit, OnDestroy {
  @Output() distanceSuccessEvent = new EventEmitter<void>();

  protected readonly DISTANCE_GOAL_IN_METERS: number = 20;
  protected readonly TASK_NUMBER: number = 2;

  totalDistanceTravelled: WritableSignal<number> = signal(0);

  previousCoords: { latitude: number; longitude: number } | null = null;
  taskCompleted = false;

  watchId: string | null = null;

  constructor(protected taskService: TaskService) {}


  async ngOnInit() {
    this.taskService.start(this.TASK_NUMBER);
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
            this.updateDistanceTravelled(currentCoords);
          }
        }
      );
    } catch (error) {
      console.error('Fehler beim Starten von watchPosition', error);
    }
  }

  updateDistanceTravelled(currentCoords: { latitude: number; longitude: number }) {
    if (this.previousCoords) {
      const distance = haversineDistance(this.previousCoords, currentCoords);
      const updatedTotal = this.totalDistanceTravelled() + distance;
      this.totalDistanceTravelled.set(updatedTotal);

      console.log(`+${distance.toFixed(2)}m, gesamt: ${updatedTotal.toFixed(2)}m`);

      if (!this.taskCompleted && updatedTotal >= this.DISTANCE_GOAL_IN_METERS) {
        this.taskCompleted = true;
        this.distanceSuccessEvent.emit();

        this.taskService.stop(this.TASK_NUMBER, true);
        console.log(this.taskService.printTaskInfo(this.TASK_NUMBER));
      }
    }

    this.previousCoords = currentCoords;
  }
}

// Hilfsfunktion zur Distanzberechnung
export function haversineDistance(
  coords1: { latitude: number; longitude: number },
  coords2: { latitude: number; longitude: number },
): number {
  const R = 6371e3; // Erdradius in Metern
  const toRad = (x: number) => x * (Math.PI / 180);
  const deltaLat = toRad(coords2.latitude - coords1.latitude);
  const deltaLon = toRad(coords2.longitude - coords1.longitude);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRad(coords1.latitude)) *
    Math.cos(toRad(coords2.latitude)) *
    Math.sin(deltaLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
