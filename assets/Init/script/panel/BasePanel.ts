import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'BasePanel' )
export class BasePanel extends Component
{
    @property( { type: Node } )
    target: Node = null;

    init ()
    {

    }

    ShowPanel ( duration: number = 0.2, fun?: Function )
    {
        this.target.scale = Vec3.ZERO;
        this.node.active = true;
        tween( this.target )
            .sequence
            (
                tween().to( duration, { scale: Vec3.ONE }, { easing: "bounceInOut" } ),
                tween().call( () =>
                {
                    fun && fun();
                    this.target.scale = Vec3.ONE;
                } )
            )
            .start();
    }

    HidePanel ( duration: number = 0.2, fun?: Function )
    {
        tween( this.target )
            .sequence
            (
                tween().to( duration, { scale: Vec3.ZERO }, { easing: "bounceInOut" } ),
                tween().call( () =>
                {
                    fun && fun();
                    this.node.active = false;
                } )
            )
            .start();
    }
}