import { _decorator, Component, Node, BoxCollider, ICollisionEvent, ITriggerEvent, director } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('PlayerCollision')
export class PlayerCollision extends Component {
    start() {
        let collider = this.node.getComponent(BoxCollider);
        collider.on('onCollisionEnter', this.onCollisionEnter, this);
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
    }

    onDestroy(){
        let collider = this.node.getComponent(BoxCollider);
        collider.off('onCollisionEnter', this.onCollisionEnter, this);
        collider.off('onTriggerEnter', this.onTriggerEnter, this);
    }

    onCollisionEnter(event:ICollisionEvent){
        console.log('hit');
        if(event.otherCollider.node.name == 'Obstacle'){
           

            //director.getScene().emit('level_failed');
        }
    }

    onTriggerEnter(event:ITriggerEvent)
    {
        console.log('You Win');       

        //director.getScene().emit('level_successful');
    }

    update(deltaTime: number) {
        
    }
}

