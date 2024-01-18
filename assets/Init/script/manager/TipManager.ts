import { Prefab, UITransformComponent, Vec3, _decorator, find, Node, SpriteFrame } from 'cc';
import { FightTip } from '../tip/fightTip';
import { tips } from '../tip/tips';
import { PoolManager } from './PoolManager';
import { ResMgr } from './ResMgr';
import { Config } from '../data/Config';
import { tipPanel } from '../tip/tipPanel';
import { PrefabManager } from './PrefabManager';

const { ccclass } = _decorator;

const SHOW_STR_INTERVAL_TIME = 800;

@ccclass( 'TipManager' )
export class TipManager 
{
    private static instance: TipManager = null;

    public static get Instance ()
    {
        if ( this.instance )
            return this.instance;
        this.instance = new TipManager();
        return this.instance;
    }

    showTipsTime: number = 0

    /**
     * 显示提示
     * @param {String} content 
     * @param {Function} cb 
     */
    showTips ( content: string | number, targetPos: Vec3 = new Vec3(), scale: number = 1, callback: Function = () => { } )
    {
        let str = String( content );
        let next = () =>
        {
            this._showTipsAni( str, targetPos, scale, callback );
        }

        var now = Date.now();
        if ( now - this.showTipsTime < SHOW_STR_INTERVAL_TIME )
        {
            var spareTime = SHOW_STR_INTERVAL_TIME - ( now - this.showTipsTime );
            setTimeout( () =>
            {
                next();
            }, spareTime );

            this.showTipsTime = now + spareTime;
        } else
        {
            next();
            this.showTipsTime = now;
        }
    }

    //弹窗展示
    showTipPanel ( title: string, content: string, callback: Function, isAd = false )
    {
        let Prefab = PrefabManager.get( 'tipPanel', PrefabManager.UiMap )
        let parentNode = null
        if ( find( "Canvas" ) )
            parentNode = find( "Canvas" );
        else
            parentNode = find( "Init" );

        let tipsNode = PoolManager.getNode( Prefab, parentNode as Node );
        tipsNode.getComponent( UITransformComponent ).priority = 900;

        let tipScript = tipsNode.getComponent( tipPanel ) as tipPanel;
        tipScript.show( title, content, callback, isAd );
    }

    /**
        * 内部函数
        * @param {String} content 
        * @param {Function} cb 
        */
    _showTipsAni ( content: string, targetPos: Vec3, scale: number, callback?: Function )
    {
        let Prefab = PrefabManager.get( 'tips', PrefabManager.UiMap )
        let parentNode = null
        if ( find( "Canvas" ) )
            parentNode = find( "Canvas" );
        else
            parentNode = find( "Init" );
        let tipsNode = PoolManager.getNode( Prefab, parentNode as Node );

        tipsNode.getComponent( UITransformComponent ).priority = 900;

        let tipScript = tipsNode.getComponent( tips ) as tips;
        tipScript.show( content, targetPos, scale, callback );
    }

    showFightTips ( type: number, txt: string, pos: Vec3, callback?: Function )
    {
        let Prefab = PrefabManager.get( 'fightTip', PrefabManager.UiMap )
        let parentNode = null
        if ( find( "Canvas" ) )
            parentNode = find( "Canvas" );
        else
            parentNode = find( "Init" );
        let ndTip = PoolManager.getNode( Prefab, parentNode as Node );
        ndTip.setPosition( pos );

        let UICom = ndTip.getComponent( UITransformComponent ) as UITransformComponent;

        if ( type === 0 )
            UICom.priority = 999;
        else if ( type === 1 )
            UICom.priority = 1000;
        let scriptTip = <FightTip> ndTip.getComponent( FightTip );
        scriptTip.show( type, txt, callback );
    }
}

