import { Vec3, _decorator, Component, Label, UITransformComponent, view, tween, Node } from "cc";
import { PoolManager } from "../manager/PoolManager";
let v3_zero = new Vec3();
let v3_scale = new Vec3( 0.7, 0.7, 0.7 );
let v3_scale_0 = new Vec3();
let v3_scale_1 = new Vec3( 1, 1, 1 );

const { ccclass, property } = _decorator;

@ccclass( 'FightTip' )
export class FightTip extends Component
{

    @property( Label )
    addnum: Label = null;

    @property( Label )
    reducenum: Label = null;

    tweenTip = null;

    costTime: number = 1.5;

    public show ( tipType: number, txt: string, callback?: Function )
    {
        this._closeTweenTip();
        this.node.eulerAngles = v3_zero;
        this.node.setScale( v3_scale );
        let arrChildren = this.node.children;
        arrChildren.forEach( ( item ) =>
        {
            item.active = false;
        } );

        let ndSub: Node = null!;
        if ( tipType === 0 )
        {
            ndSub = this.node.getChildByName( "add" ) as Node;
            this.addnum.string = txt;
        }
        else if ( tipType === 1 )
        {
            ndSub = this.node.getChildByName( "minus" ) as Node;
            this.reducenum.string = txt;
        }
        ndSub.active = true;
        let pos = this.node.getPosition();
        let width: number = ndSub.getComponent( UITransformComponent )?.width;
        let height: number = ndSub.getComponent( UITransformComponent )?.height;
        if ( ( Math.abs( pos.x ) + width / 2 ) > view.getCanvasSize().width / 2 )
        {
            let w = view.getCanvasSize().width / 2 - width / 2;
            pos.x = pos.x > 0 ? w : -w;
        }

        if ( ( Math.abs( pos.y ) + height / 2 ) > view.getCanvasSize().height / 2 )
        {
            let h = view.getCanvasSize().height / 2 - height / 2;
            pos.y = pos.y > 0 ? h : -h;
        }
        this.node.setPosition( pos );

        this.tweenTip = tween( this.node )
            .to( this.costTime * 0.4, { scale: v3_scale_1 }, { easing: 'backOutIn' } )
            .to( this.costTime * 0.2, { position: new Vec3( 25, 50, 0 ) } )
            .to( this.costTime * 0.2, { scale: v3_scale_0 } )
            .call( () =>
            {
                this._closeTweenTip();
                PoolManager.putNode( this.node );
                callback && callback();
            } )
            .start();
    }

    private _closeTweenTip ()
    {
        if ( this.tweenTip )
        {
            this.tweenTip.stop();
            this.tweenTip = null;
        }
    }
}
