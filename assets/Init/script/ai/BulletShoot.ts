import { _decorator, Component, Prefab } from 'cc';
import { PoolManager } from '../manager/PoolManager';
import { Bullet } from './Bullet';
import { GameManager } from '../manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass( 'BulletShoot' )
export class BulletShoot extends Component
{
    @property( Prefab )
    bullet: Prefab | null = null;

    start ()
    {
        PoolManager.prePool( this.bullet, 5 );
    }
    onDestroy ()
    {
        PoolManager.clearPool( 'Bullet' );
    }

    create ( isEnemy: boolean ): Bullet
    {
        let node = PoolManager.getNode( this.bullet, GameManager.Instance.node.parent );
        let info = node.getComponent( Bullet );
        info.setGroup( isEnemy );
        return info;
    }
}

