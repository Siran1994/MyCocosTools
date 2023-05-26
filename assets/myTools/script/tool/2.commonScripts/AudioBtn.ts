import { _decorator, Button, Component, Node, SpriteFrame, Texture2D } from 'cc';
import { PlayerPrefs } from './PlayerPrefs';
import { AudioMgr } from '../Managers/AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('AudioBtn')
export class AudioBtn extends Component {
    @property( { type: Button } )
    btn: Button = null!;

    spriteOn: Texture2D = null!;

    @property( { type: SpriteFrame } )
    spriteOff: Texture2D = null!;

    onLoad ()
    {
        if ( this.btn.normalSprite )
            this.spriteOn = this.btn.normalSprite.texture as Texture2D;
        let isOn = PlayerPrefs.GetInt( 'soundOn', 1 ) == 1;
        if ( isOn )
            this.btn.normalSprite && ( this.btn.normalSprite.texture = this.spriteOn );
        else
            this.btn.normalSprite && ( this.btn.normalSprite.texture = this.spriteOff );

        this.btn.node.on('click',()=>
        {
            let isOn = PlayerPrefs.GetInt( 'soundOn', 1 ) == 1;

            if ( isOn )
                PlayerPrefs.SetInt( 'soundOn', 0 );
            else
                PlayerPrefs.SetInt( 'soundOn', 1 );

            isOn = !isOn;
            AudioMgr.isOn = isOn;

            if ( AudioMgr.isOn )
                this.btn.normalSprite && ( this.btn.normalSprite.texture = this.spriteOn );
            else
                this.btn.normalSprite && ( this.btn.normalSprite.texture = this.spriteOff );

        },this);
    }    
}

