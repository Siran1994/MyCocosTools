import { _decorator, Node, Prefab } from 'cc';
import { PoolManager } from './PoolManager';
import { PrefabManager } from './PrefabManager';
import { UITransform, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'RedPointManager' )
export class RedPointManager 
{
    public static instance: RedPointManager = null!;
    public static get Instance ()
    {
        if ( this.instance )
            return this.instance;
        this.instance = new RedPointManager();
        return this.instance;
    }

    dotPrefab: Prefab = null;

    showPoint ( target: Node )
    {
        for ( let i = 0; i < target.children.length; i++ )
        {
            if ( target.children[ i ].name == 'RedPoint' )
                return;
            //PoolManager.putNode( target.children[ i ] );
        }

        this.dotPrefab = PrefabManager.get( 'RedPoint', PrefabManager.UiMap )
        let dot = PoolManager.getNode( this.dotPrefab, target );
        switch ( target.name )
        {
            case 'UpLvBtn':
            case 'BeautyBtn':
            case 'RoomBtn':
                dot.getComponent( UITransform ).anchorPoint = new Vec2( -2.5, -0.6 );
                break;
            case 'UpgradeBtn':
            case 'CoinUpBtn':
            case 'AdUpBtn':
            case 'GetAllBtn':
            case 'BuyBtn':
            case 'SellBtn':
            case 'RecruitBtn':
            case 'MakeBtn':
            case 'TrainBtn':
            case 'GetBtn':
            case 'AdGetBtn':
                dot.getComponent( UITransform ).anchorPoint = new Vec2( -2, -0.6 );
                break;
            case 'signBtn':
            case 'onLineBtn':
                dot.getComponent( UITransform ).anchorPoint = new Vec2( -0.5, -0.9 );
                break;
            default:
                dot.getComponent( UITransform ).anchorPoint = new Vec2( -1.2, -1.2 );
                break;
        }
    }

    hidePoint ( target: Node )
    {
        if ( target.getChildByName( this.dotPrefab.name ) )
            PoolManager.putNode( target.getChildByName( this.dotPrefab.name ) );
    }
}