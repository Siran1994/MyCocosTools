import { _decorator, Component, Node, Prefab, ParticleUtils, ParticleSystem, instantiate } from "cc";


const { ccclass, property } = _decorator;

@ccclass( "EffectManager" )
export class EffectManager extends Component
{
    @property( Prefab )
    EatCoin: Prefab = null;//吃金币

    @property( Prefab )
    ChangeDress: Prefab = null;//变装

    @property( Prefab )
    EndFire: Prefab = null;//烟花

    @property( Prefab )
    CoinExplore: Prefab = null;//爆金币

    @property( Prefab )
    RunEffect: Prefab = null;//尾气
}
