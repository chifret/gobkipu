import { Injectable, NgZone } from '@angular/core';
import * as BABYLON from 'babylonjs';

@Injectable()
export class BabylonjsService {
    private _engine: BABYLON.Engine;
    private _uid: number;

    constructor(private zone: NgZone) {
        if (!this._uid) {
            this._uid = Math.floor(Date.now() / 1);
        }
    }

    public createEngine(canvas: HTMLCanvasElement): BABYLON.Engine {
        this._engine = new BABYLON.Engine(canvas);

        window.addEventListener('resize', () => {
            this._engine.resize();
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

        });

        return this._engine;
    }

    public getEngine(): BABYLON.Engine {
        return this._engine;
    }

    public getUID(): number {
        return this._uid;
    }

    public start(scene: BABYLON.Scene): void {
        this.zone.runOutsideAngular(() => {
            this._engine.runRenderLoop(() => {
                scene.render();
            });
        })
    }

    public stop(): void {

    }

    public addScene(scene: BABYLON.Scene): void {

    }
}
