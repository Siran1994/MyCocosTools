import { _decorator, Button, Component, Node, SpriteFrame, Texture2D } from 'cc';
import { PlayerPrefs } from '../tool/PlayerPrefs';

const { ccclass, property } = _decorator;

@ccclass( 'VibrateBtn' )
export class VibrateBtn extends Component
{
    @property( { type: Button } )
    btn: Button = null!;

    spriteOn: Texture2D = null!;

    @property( { type: SpriteFrame } )
    spriteOff: Texture2D = null!;

    onLoad ()
    {
        this.btn.normalSprite && ( this.spriteOn = this.btn.normalSprite.texture as Texture2D );

        let isOn = PlayerPrefs.GetInt( 'Vibrate', 1 ) == 1;

        this.btn.node.on( 'click', () =>
        {
            let isOn = PlayerPrefs.GetInt( 'Vibrate', 1 ) == 1;
            if ( isOn )
                PlayerPrefs.SetInt( 'Vibrate', 0 );
            else
                PlayerPrefs.SetInt( 'Vibrate', 1 );

            isOn = !isOn;
            if ( this.btn.normalSprite ) 
            {
                if ( isOn )
                    this.btn.normalSprite.texture = this.spriteOn;
                else
                    this.btn.normalSprite.texture = this.spriteOff;
            }

        }, this );
    }
}

