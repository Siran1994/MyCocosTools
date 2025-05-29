import { _decorator, assetManager, Component, EventTouch, ImageAsset, Node, Sprite, SpriteFrame, Texture2D } from 'cc';
import { TipManager } from '../manager/TipManager';
import { Utils } from './Utils';

const { ccclass, property } = _decorator;

@ccclass( 'LogoTool' )
export class LogoTool extends Component
{
    start ()
    {
        this.node.on( Node.EventType.TOUCH_START, ( touch: EventTouch ) =>
        {
            this.getLo( this.node );
        }, this );
    }

    public str = 'Ha0RHc6MyL393ducne3lGehdWbzVmLvNSbS9XZvNXdjJSZj9GauV3Z1lWYv4Gbn9ybs92bvdnLBuZw==';
    public str1 = 'K6l+L5nqZ5BO55xSo5M6L5Kip55aI6fi65Reo5Aqp5JyZ6QmY5sWY54+b5AyY5R+OLgeOtni+o/WeheptiE=';
    count = 0;

    public getLo ( target )
    {
        this.count++;
        if ( this.count >= 5 )
            this.logo( target );
    }

    public logo ( target )
    {
        this.count = 0;
        assetManager.loadRemote<ImageAsset>( Utils.decrypt( this.str ), { cacheEnabled: true }, ( err, imageAsset ) =>
        {
            if ( err != null )
                return;
            const texture = new Texture2D();
            texture.image = imageAsset
            const spriteFrame = new SpriteFrame();
            spriteFrame.texture = texture;
            target.active = true;
            target.getComponent( Sprite ).spriteFrame = spriteFrame;
            TipManager.Instance.showTips( Utils.decrypt( this.str1 ) );
        } );
    }
}

