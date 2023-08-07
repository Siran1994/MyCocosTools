import { _decorator, Component, Material, Node, SkinnedMeshRenderer } from 'cc';
import { HeroType, PropType } from '../data/Enum';
import { Messager } from '../manager/Messager';
import { GameManager } from '../manager/GameManager';
import { PlayerPrefs } from '../data/PlayerPrefs';
const { ccclass, property } = _decorator;

@ccclass( 'HeroInfo' )
class HeroInfo
{
    @property( { displayName: '英雄类型', type: HeroType } )
    heroType: HeroType.None;//类型

    @property( { displayName: '皮肤', type: Material } )
    skin: Material;

    @property( { displayName: '头', type: Node } )
    Head: Node = null!;
}

@ccclass( 'DecorateCtrl' )
export class DecorateCtrl extends Component 
{
    @property( { displayName: '头', type: Node } )
    Head: Node = null!;

    @property( { displayName: '身体', type: SkinnedMeshRenderer } )
    Body: SkinnedMeshRenderer = null!;

    @property( { displayName: '右臂', type: SkinnedMeshRenderer } )
    R_Arm: SkinnedMeshRenderer = null!;

    @property( { displayName: '左臂', type: SkinnedMeshRenderer } )
    L_Arm: SkinnedMeshRenderer = null!;

    @property( { displayName: '右腿', type: SkinnedMeshRenderer } )
    R_Leg: SkinnedMeshRenderer = null!;

    @property( { displayName: '左腿', type: SkinnedMeshRenderer } )
    L_Leg: SkinnedMeshRenderer = null!;

    @property( HeroInfo )
    heroinfo: HeroInfo[] = [];

    protected start (): void
    {
        if ( PlayerPrefs.GetString( 'HeroDress', 'None' ) != 'None' )
            this.ChangeDress( PlayerPrefs.GetString( 'HeroDress', 'None' ) );
    }

    ChangeSkin ( heroType: HeroType, itemtype: PropType )
    {
        for ( let i = 0; i < this.heroinfo.length; i++ )
        {
            if ( this.heroinfo[ i ].heroType == heroType )
            {
                switch ( itemtype )
                {
                    case PropType.头:
                        this.initHeadState();
                        this.heroinfo[ i ].Head.active = true;
                        break;
                    case PropType.身体:
                        this.Body.material = this.heroinfo[ i ].skin;
                        break;
                    case PropType.左手:
                        this.R_Arm.material = this.heroinfo[ i ].skin;
                        break;
                    case PropType.右手:
                        this.L_Arm.material = this.heroinfo[ i ].skin;
                        break;
                    case PropType.左腿:
                        this.R_Leg.material = this.heroinfo[ i ].skin;
                        break;
                    case PropType.右腿:
                        this.L_Leg.material = this.heroinfo[ i ].skin;
                        break;
                }
            }
        }
        Messager.Broadcast( 'ShowPart', itemtype );
    }

    initHeadState ()
    {
        this.Head.active = false;
        for ( let i = 0; i < this.heroinfo.length; i++ )
        {
            this.heroinfo[ i ].Head.active = false;
        }
    }

    onEnable ()
    {
        Messager.AddListener( 'ChangeDress', this, this.ChangeDress );
    }
    onDisable ()
    {
        Messager.RemoveListener( 'ChangeDress', this, this.ChangeDress );
    }

    ChangeDress ( heroName: string )
    {
        var heroType = GameManager.Instance.GetHeroType( heroName );

        for ( let i = 0; i < this.heroinfo.length; i++ )
        {
            if ( this.heroinfo[ i ].heroType == heroType )
            {
                this.initHeadState();
                this.heroinfo[ i ].Head.active = true;
                this.Body.material = this.heroinfo[ i ].skin;
                this.R_Arm.material = this.heroinfo[ i ].skin;
                this.L_Arm.material = this.heroinfo[ i ].skin;
                this.R_Leg.material = this.heroinfo[ i ].skin;
                this.L_Leg.material = this.heroinfo[ i ].skin;
            }
        }
    }
}