
import { _decorator, Component, Sprite, Label } from "cc";
import { GameData } from "../data/GameData";
import { UiManager } from "../manager/UiManager";
import CoinFly from "../animation/CoinFly";
import DOTweenAnimation from "../animation/DOTweenAnimation";
import { TipManager } from "../manager/TipManager";
const { ccclass, property } = _decorator;

@ccclass( "online" )
export class online extends Component
{
    @property( Sprite )
    spTimeProgress: Sprite = null;     //累积时间进度

    @property( Sprite )
    perTimeProgress: Sprite = null;    //每次的时间进度，使用sprite的FillRange来修改

    @property( Label )
    lbGold: Label = null;

    @property( CoinFly )
    coinfly: CoinFly = null;

    @property
    public timeToRecover = 0;
    @property
    public totalCount = 0;
    @property
    public currentCount = 0;
    private _timer = 0;

    onLoad ()
    {
        this._timer = 0;
        this.spTimeProgress.fillStart = 0;
        this.perTimeProgress.fillRange = 0;
    }

    onBtnOnlineClick ()
    {
        if ( this.currentCount <= 0 )
        {
            TipManager.Instance.showTips( '在线时间不足,请稍后!' );
            return;
        }
        else
        {
            this.coinfly.playAnim( () =>
            {
                var tmpNum = GameData.Coin;
                var targetNum = tmpNum + this.currentCount;
                var ani = DOTweenAnimation.stepNum( UiManager.Instance.mainPanel.CoinTxt, tmpNum, 10, targetNum, 0, '', () =>
                {
                    ani.stop();
                    GameData.Coin = targetNum;
                    UiManager.Instance.mainPanel.CoinTxt.string = GameData.Coin.toString();
                    this.clear();
                } );
            } );
        }
    }

    update ( dt: number )
    {
        if ( this.currentCount > this.totalCount )
        {
            this.currentCount = this.totalCount;
            return;
        }
        let ratio = this._timer / this.timeToRecover;
        this.spTimeProgress.fillStart = ratio;
        this.perTimeProgress.fillRange = ratio;

        this.lbGold.string = this.currentCount.toString();
        this._timer += dt;
        if ( this._timer >= this.timeToRecover )
        {
            this._timer = 0;
            this.currentCount += 50;
        }
    }

    clear ()
    {
        this._timer = 0;
        this.spTimeProgress.fillStart = 0;
        this.perTimeProgress.fillRange = 0;
        this.currentCount = 0;
    }
}
