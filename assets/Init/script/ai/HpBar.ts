import { _decorator, Camera, Component, Node, ProgressBar, Sprite, UITransform, Vec3 } from 'cc';
import { UiManager } from '../manager/UiManager';
const { ccclass, property } = _decorator;

@ccclass( 'HpBar' )
export class HpBar extends Component
{
    @property( Node )
    camera: Node = null;

    uiCamera: Camera = null;
    parTrans: UITransform = null;

    @property( { type: ProgressBar } )
    hpBar: ProgressBar = null!;

    @property( { type: Sprite } )
    sprite: Sprite = null!;

    init ( isEnemy = false )
    {
        this.uiCamera = UiManager.Instance.uiCamera;

        this.parTrans = this.node.parent.getComponent( UITransform );

        if ( isEnemy )
            this.sprite.spriteFrame = UiManager.Instance.Bars[ 1 ];
        else
            this.sprite.spriteFrame = UiManager.Instance.Bars[ 0 ];
        this.hpBar.progress = 1;
    }

    showHpBar ( hpPrecent: number )
    {
        this.hpBar.progress = hpPrecent;
        if ( this.hpBar.progress == 0 )
            this.node.active = false;
    }

    showAt ( scenePos: Vec3 )
    {
        var wPos = this.uiCamera.screenToWorld( scenePos );
        var pos = this.parTrans.convertToNodeSpaceAR( wPos );
        this.node.setPosition( pos );
    }
}