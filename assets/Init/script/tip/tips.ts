import { _decorator, Component, LabelComponent, Vec3, tween, UIOpacityComponent, isValid, SpriteFrame, SpriteComponent, UITransformComponent, Color } from 'cc';
import { PoolManager } from '../manager/PoolManager';
const { ccclass, property } = _decorator;

let color0 = new Color( 214, 132, 53, 255 );
let v3_targetPos = new Vec3( 0, 100, 0 );

@ccclass( 'tips' )
export class tips extends Component
{

    @property( LabelComponent )
    public lbTips: LabelComponent = null!;

    @property( SpriteComponent )
    public spIcon: SpriteComponent = null!;

    @property( SpriteComponent )
    public spBg: SpriteComponent = null!;

    @property( UIOpacityComponent )
    public UIOpacityBg: UIOpacityComponent = null!;

    @property( SpriteFrame )
    public sfGold: SpriteFrame = null!;

    @property( SpriteFrame )
    public sfHeart: SpriteFrame = null!;

    public show ( content: string, targetPos: Vec3, scale: number, callback: Function = () => { } )
    {
        this.node.setScale( new Vec3( scale, scale, scale ) );

        let size = this.lbTips?.node?.getComponent( UITransformComponent )?.contentSize;
        if ( !isValid( size ) )
        {//size不存在，自我销毁
            PoolManager.putNode( this.node );
            return;
        }

        this.lbTips.string = content;
        this.lbTips.color = color0;

        //纯文字提示
        this.spBg.enabled = true;
        this.UIOpacityBg.opacity = 255;
        this.node.setPosition( targetPos );

        this.spIcon.node.active = false;

        this.scheduleOnce( () =>
        {
            tween( this.node )
                .to( 0.8, { position: v3_targetPos }, { easing: 'smooth' } )
                .call( () =>
                {
                    callback && callback();
                    PoolManager.putNode( this.node );
                } )
                .start();

            tween( this.UIOpacityBg )
                .to( 0.5, { opacity: 220 }, { easing: 'smooth' } )
                .to( 0.25, { opacity: 0 }, { easing: 'smooth' } )
                .call( () =>
                {

                } )
                .start();
        }, 0.8 );
    }
}
