import { Prefab, UITransformComponent, Vec3, _decorator, find, Node } from 'cc';
import { FightTip } from '../tip/fightTip';
import { tips } from '../tip/tips';
import { PoolManager } from './PoolManager';
import { ResMgr } from './ResMgr';

const { ccclass } = _decorator;

const SHOW_STR_INTERVAL_TIME = 800;

@ccclass( 'TipManager' )
export class TipManager 
{
    private static instance: TipManager = null;

    public static get Instance ()
    {
        if ( TipManager.instance == null )
        {
            TipManager.instance = new TipManager();
        }
        return TipManager.instance;
    }

    public static set Instance ( value: TipManager )
    {
        this.instance = value;
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

    /**
        * 内部函数
        * @param {String} content 
        * @param {Function} cb 
        */
    _showTipsAni ( content: string, targetPos: Vec3, scale: number, callback?: Function )
    {
        ResMgr.loadPrefab( 'prefab/common/tips', ( obj: Prefab ) =>
        {
            let tipsNode = PoolManager.getNode( obj, find( "Canvas" ) as Node );

            tipsNode.getComponent( UITransformComponent ).priority = 900;

            let tipScript = tipsNode.getComponent( tips ) as tips;
            tipScript.show( content, targetPos, scale, callback );
        } );
    }

    showFightTips ( type: number, txt: string, pos: Vec3, callback?: Function )
    {
        ResMgr.loadPrefab( 'prefab/common/fightTip', ( obj: Prefab ) =>
        {
            let ndTip = <Node> PoolManager.getNode( obj, <Node> find( "Canvas" ) );
            ndTip.setPosition( pos );

            let UICom = ndTip.getComponent( UITransformComponent ) as UITransformComponent;

            if ( type === 0 )
                UICom.priority = 999;
            else if ( type === 1 )
                UICom.priority = 1000;
            let scriptTip = <FightTip> ndTip.getComponent( FightTip );
            scriptTip.show( type, txt, callback );
        } );
    }
}

