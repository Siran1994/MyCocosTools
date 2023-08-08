import { _decorator, Component, Node, Material, MeshRenderer, EventTouch } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DissolveEffect')
export class DissolveEffect extends Component {
    
    @property
    delayTime = 4.2;

    @property([Material])
    mats:Material[] = [];

    _mat:Material;
    _startTime:number = 0;
    _playTime:number = 0;
    start() {
    }

    play(timeS:number){
        this._playTime = timeS;
        this._startTime = Date.now() + this.delayTime*1000;
        for(let i = 0; i < this.mats.length; ++i){
            this.mats[i].setProperty('dissolveThreshold',0.0);
        }
    }

    onPlayTest(event:EventTouch, customData){
        this.play(customData - 0);
    }

    update(deltaTime: number) {
        if(this._startTime && this._playTime && this._startTime < Date.now()){
            let timeElapsed = (Date.now() - this._startTime)/1000.0;
            let factor = timeElapsed / this._playTime;
            if(factor >= 1.0){
                factor = 1.0;
                this._startTime = 0;
                this._playTime = 0;
            }

            for(let i = 0; i < this.mats.length; ++i){
                this.mats[i].setProperty('dissolveThreshold',factor);
            }
        }
    }
}

