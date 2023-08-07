import { _decorator, Collider, Component, ITriggerEvent, Label, Node, Sprite, SpriteFrame } from 'cc';
import { HeroType, PropType } from '../data/Enum';
import { Messager } from '../manager/Messager';
import { PlayerCtrl } from '../role/PlayerCtrl';
import { Utils } from '../tool/Utils';
import { GameManager } from '../manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass( 'PartItem' )
export class PartItem extends Component
{
    //头,身体,左右手,左右腿
    @property( { type: PropType } )
    propType: PropType = PropType.None;

    @property( { type: HeroType } )
    heroType: HeroType = HeroType.None;

    @property( { displayName: '战力', type: Label } )
    Power: Label;

    @property( { displayName: '图标', type: Sprite } )
    Icon: Sprite = null;
    @property( { displayName: '图集', type: SpriteFrame } )
    icons: SpriteFrame[] = [];

    @property( Node )
    Green: Node = null;

    @property( Node )
    Red: Node = null;

    @property( { displayName: '是否收集目标?', type: Boolean } )
    isTarget = false;

    PowerNum: number = 0;

    protected onLoad (): void
    {
        if ( this.isTarget )
        {
            this.Green.active = true;
            this.Red.active = false;
        }
        else
        {
            this.Green.active = false;
            this.Red.active = true;
        }
    }

    start ()
    {
        const collider = this.getComponent( Collider );
        collider?.on( 'onTriggerEnter', ( event: ITriggerEvent ) => 
        {
            if ( event.otherCollider.node.name == 'Player' )
            {
                event.otherCollider.node.name = '';
                collider.enabled = false;
                PlayerCtrl.Instance.PlayAni();
                Messager.Broadcast( 'PropItem', this.heroType, this.propType, this.PowerNum );
                this.node.destroy();
            }
            Utils.DelayCallBack( 0.5, () => { GameManager.Instance.target.name = 'Player' } );
        } );
    }

    onEnable ()
    {
        Messager.AddListener( 'ChangePart', this, this.ChangePart );
    }
    onDisable ()
    {
        Messager.RemoveListener( 'ChangePart', this, this.ChangePart );
    }

    ChangePart ( targetName: string )
    {
        if ( this.isTarget )
        {
            this.setHeroType( targetName );
            this.setIcon( targetName );
        }
        else
        {
            var name = this.getRandomName( targetName );
            this.setHeroType( name );
            this.setIcon( name );
        }
    }
    getRandomName ( targetName: string )
    {
        switch ( targetName )
        {
            case '美国队长':
                return '雷神';
            case '蜘蛛侠':
                return '钢铁侠';
            case '钢铁侠':
                return '蜘蛛侠';
            case '毒液':
                return '绿巨人';
            case '绿巨人':
                return '毒液';
            case '雷神':
                return '美国队长';
        }
    }
    setHeroType ( targetName: string )
    {
        switch ( targetName )
        {
            case '美国队长':
                this.heroType = HeroType.美国队长;
                switch ( this.propType )
                {
                    case PropType.头:
                        this.PowerNum = 180;
                        break;
                    case PropType.身体:
                        this.PowerNum = 250;
                        break;
                    case PropType.左手:
                    case PropType.右手:
                        this.PowerNum = 80;
                        break;
                    case PropType.左腿:
                    case PropType.右腿:
                        this.PowerNum = 100;
                        break;
                }
                break;
            case '蜘蛛侠':
                this.heroType = HeroType.蜘蛛侠;
                switch ( this.propType )
                {
                    case PropType.头:
                        this.PowerNum = 200;
                        break;
                    case PropType.身体:
                        this.PowerNum = 270;
                        break;
                    case PropType.左手:
                    case PropType.右手:
                        this.PowerNum = 120;
                        break;
                    case PropType.左腿:
                    case PropType.右腿:
                        this.PowerNum = 120;
                        break;
                }
                break;
            case '钢铁侠':
                this.heroType = HeroType.钢铁侠;
                switch ( this.propType )
                {
                    case PropType.头:
                        this.PowerNum = 240;
                        break;
                    case PropType.身体:
                        this.PowerNum = 310;
                        break;
                    case PropType.左手:
                    case PropType.右手:
                        this.PowerNum = 140;
                        break;
                    case PropType.左腿:
                    case PropType.右腿:
                        this.PowerNum = 160;
                        break;
                }
                break;
            case '毒液':
                this.heroType = HeroType.毒液;
                switch ( this.propType )
                {
                    case PropType.头:
                        this.PowerNum = 260;
                        break;
                    case PropType.身体:
                        this.PowerNum = 330;
                        break;
                    case PropType.左手:
                    case PropType.右手:
                        this.PowerNum = 160;
                        break;
                    case PropType.左腿:
                    case PropType.右腿:
                        this.PowerNum = 180;
                        break;
                }
                break;
            case '绿巨人':
                this.heroType = HeroType.绿巨人;
                switch ( this.propType )
                {
                    case PropType.头:
                        this.PowerNum = 280;
                        break;
                    case PropType.身体:
                        this.PowerNum = 350;
                        break;
                    case PropType.左手:
                    case PropType.右手:
                        this.PowerNum = 180;
                        break;
                    case PropType.左腿:
                    case PropType.右腿:
                        this.PowerNum = 200;
                        break;
                }
                break;
            case '雷神':
                this.heroType = HeroType.雷神;
                switch ( this.propType )
                {
                    case PropType.头:
                        this.PowerNum = 450;
                        break;
                    case PropType.身体:
                        this.PowerNum = 550;
                        break;
                    case PropType.左手:
                    case PropType.右手:
                        this.PowerNum = 250;
                        break;
                    case PropType.左腿:
                    case PropType.右腿:
                        this.PowerNum = 250;
                        break;
                }
                break;
        }
        if ( this.isTarget )
            this.Power.string = '+' + this.PowerNum;
        else
            this.Power.string = '-' + this.PowerNum;
    }
    setIcon ( targetName: string )
    {
        switch ( targetName )
        {
            case '美国队长':
                this.Icon.spriteFrame = this.icons[ 0 ];
                break;
            case '蜘蛛侠':
                this.Icon.spriteFrame = this.icons[ 1 ];
                break;
            case '钢铁侠':
                this.Icon.spriteFrame = this.icons[ 2 ];
                break;
            case '毒液':
                this.Icon.spriteFrame = this.icons[ 3 ];
                break;
            case '绿巨人':
                this.Icon.spriteFrame = this.icons[ 4 ];
                break;
            case '雷神':
                this.Icon.spriteFrame = this.icons[ 5 ];
                break;
        }
    }
}