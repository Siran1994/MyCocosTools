import { _decorator, Component, EventTouch, Input, Node, Vec2, Vec3, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'DragUi' )
export class DragUi extends Component
{
    @property( Node )
    myTouch: Node
    touchStartPoint: Vec2 = new Vec2( 0, 0 )

    protected onLoad ()
    {
        if ( this.myTouch == null )
            this.myTouch = this.node;
        this.touchStartPoint = new Vec2( this.node.position.x, this.node.position.y );
    }

    start ()
    {
        this.myTouch.on( Input.EventType.TOUCH_CANCEL, () =>
        {
            this.myTouch.position = new Vec3( this.touchStartPoint.x, this.touchStartPoint.y );
            // this.touchStartPoint = new Vec2( 0, 0 );
        }, this )

        this.myTouch.on( Input.EventType.TOUCH_END, () =>
        {
            this.myTouch.position = new Vec3( this.touchStartPoint.x, this.touchStartPoint.y );
            // this.touchStartPoint = new Vec2( 0, 0 );
        }, this )

        this.myTouch.on( Input.EventType.TOUCH_MOVE, ( event: EventTouch ) =>
        {
            let node: Node = event.currentTarget
            let pos = new Vec2()
            let shit = pos.set( event.getUILocation() )
            let x = shit.x - view.getVisibleSize().width / 2 - this.touchStartPoint.x
            let y = shit.y - view.getVisibleSize().height / 2 - this.touchStartPoint.y
            node.setPosition( x, y, 0 )

        }, this )

        this.myTouch.on( Input.EventType.TOUCH_START, ( event: EventTouch ) =>
        {
            let node: Node = event.currentTarget
            this.touchStartPoint.set( event.getUILocation() )
            let x = this.touchStartPoint.x - view.getVisibleSize().width / 2 - node.getPosition().x
            let y = this.touchStartPoint.y - view.getVisibleSize().height / 2 - node.getPosition().y
            this.touchStartPoint = new Vec2( x, y )

        }, this )
    }
}

