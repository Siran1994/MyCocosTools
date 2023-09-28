import { _decorator, Collider, Component, ITriggerEvent, Label, Node, Sprite, SpriteFrame } from 'cc';
import { Messager } from '../manager/Messager';
import { PropType, HeroType } from '../data/Enum';
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
                //PlayerCtrl.Instance.PlayAni();
                Messager.Broadcast( 'PropItem', this.heroType, this.propType, this.PowerNum );
                this.node.destroy();
            }
            // Utils.DelayCallBack( 0.5, () => { GameManager.Instance.target.name = 'Player' } );
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
            case '黑白电视人':
                return '美女电视人';
            case '美女电视人':
                return '花屏电视人';
            case '花屏电视人':
                return '美女电视人';
            case '黄电视人':
                return '蓝电视人';
            case '蓝电视人':
                return '黄电视人';
        }
    }
    setHeroType ( targetName: string )
    {
        switch ( targetName )
        {
            case '黑白电视人':
                this.heroType = HeroType.黑白电视人;
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
            case '美女电视人':
                this.heroType = HeroType.美女电视人;
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
            case '花屏电视人':
                this.heroType = HeroType.花屏电视人;
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
            case '黄电视人':
                this.heroType = HeroType.黄电视人;
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
            case '蓝电视人':
                this.heroType = HeroType.蓝电视人;
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
            case '黑白电视人':
                this.Icon.spriteFrame = this.icons[ 0 ];
                break;
            case '美女电视人':
                this.Icon.spriteFrame = this.icons[ 1 ];
                break;
            case '花屏电视人':
                this.Icon.spriteFrame = this.icons[ 2 ];
                break;
            case '黄电视人':
                this.Icon.spriteFrame = this.icons[ 3 ];
                break;
            case '蓝电视人':
                this.Icon.spriteFrame = this.icons[ 4 ];
                break;
        }
    }
}