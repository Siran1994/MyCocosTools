import { _decorator, Component, Label, Node, UIOpacity, UITransform } from 'cc';

const { ccclass, property } = _decorator;

@ccclass( 'GuideManager' )
export class GuideManager extends Component
{
    public static Instance: GuideManager = null!;
    protected onLoad (): void
    {
        GuideManager.Instance = this;
        this.node.active = false;
    }

    @property( { type: Node } )
    Mask: Node = null;

    @property( { type: UITransform } )
    MaskRect: UITransform;

    @property( { type: Node } )
    Hand: Node = null;

    @property( { type: Label } )
    tipTxt: Label = null;

    showGuide ( target: Node, tip: string = '', isShowMask = true )
    {
        this.node.active = true;
        this.Mask.position = target.position;
        this.MaskRect.contentSize = target.getComponent( UITransform ).contentSize;
        this.Hand.position = target.position;
        if ( tip != '' )
            this.tipTxt.string = tip;
        else
            this.tipTxt.node.active = false;
        if ( isShowMask == false )
            this.Mask.children[ 0 ].getComponent( UIOpacity ).opacity = 0;
    }

    HideGuide ()
    {
        this.node.active = false;
    }
}