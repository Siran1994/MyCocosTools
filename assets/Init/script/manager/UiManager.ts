import { _decorator, Component } from 'cc';
import { DrawPanel } from '../panel/DrawPanel';
import { FailedPanel } from '../panel/FailedPanel';
import { FinishPanel } from '../panel/FinishPanel';
import { FreeTryPanel } from '../panel/FreeTryPanel';
import { GamePanel } from '../panel/GamePanel';
import { MainPanel } from '../panel/MainPanel';
import { RewardPanel } from '../panel/RewardPanel';
import { SettingPanel } from '../panel/SettingPanel';
import { ShopPanel } from '../panel/ShopPanel';
import { SignPanel } from '../panel/SignPanel';
import { ShopList } from '../shopList/ShopList';
import CoinFly from '../animation/CoinFly';
const { ccclass, property } = _decorator;

@ccclass( 'UiManager' )
export class UiManager extends Component 
{
    public static Instance: UiManager = null;
    onLoad ()
    {
        UiManager.Instance = this;
    }

    @property( MainPanel )
    mainPanel: MainPanel;//主界面

    @property( GamePanel )
    gamePanel: GamePanel = null;

    @property( SettingPanel )
    settingPanel: SettingPanel = null;//设置

    @property( SignPanel )
    signPanel: SignPanel = null;//签到

    @property( DrawPanel )
    drawPanel: DrawPanel = null;//抽奖

    @property( ShopList )
    shopList: ShopList = null;//抽奖

    @property( ShopPanel )
    shopPanel: ShopPanel = null;//抽奖

    @property( FinishPanel )
    finishPanel: FinishPanel = null;//胜利

    @property( FailedPanel )
    faildPanel: FailedPanel = null;//失败

    @property( RewardPanel )
    rewardPanel: RewardPanel = null;//奖励

    @property( FreeTryPanel )
    freeTryPanel: FreeTryPanel = null;//试用

    @property( CoinFly )
    coinfly: CoinFly = null;
}