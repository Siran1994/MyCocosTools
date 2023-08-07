import { _decorator, Component, EventTouch, input, Input, Label, Node, Sprite, Vec3 } from 'cc';
import { UiManager } from '../manager/UiManager';
import { Messager } from '../manager/Messager';
import { GameManager } from '../manager/GameManager';
import { Boss } from '../role/Boss';
const { ccclass, property } = _decorator;

@ccclass( 'FinishPanel' )
export class FinishPanel extends Component 
{
   @property( Sprite )
   blue: Sprite = null!;
   @property( Sprite )
   red: Sprite = null!;
   @property( { type: Node } )
   pointer: Node = null;
   @property( Label )
   Power: Label = null;

   @property( { type: Node } )
   rewardPanel: Node = null;

   isfinal = false;
   protected start (): void
   {
      this.blue.fillStart = 0.5;
      this.red.fillStart = 0.5;
      this.pointer.position = Vec3.ZERO;
      this.Power.string = '战斗力:' + UiManager.Instance.gamePanel.power.toString();//战力
   }

   onEnable ()
   {
      input.on( Input.EventType.TOUCH_END, this.touchEnd, this );
      Messager.AddListener( 'addProgress', this, this.addProgress );
   }

   onDisable ()
   {
      input.off( Input.EventType.TOUCH_END, this.touchEnd, this );
      Messager.RemoveListener( 'addProgress', this, this.addProgress );
   }

   touchEnd ( touch: EventTouch )//点击
   {
      if ( this.isfinal != true )
      {
         let index = Math.floor( Math.random() * 2 )
         Messager.Broadcast( 'isAtking', index );
      }
   }

   addProgress ( target: string )
   {
      switch ( target )
      {
         case 'player':
            this.blue.fillStart += 0.15;
            this.red.fillStart += 0.15;
            this.pointer.setPosition( 284 * ( this.blue.fillStart - 0.5 ) * 2, 0 );
            break;
         case 'boss':
            this.blue.fillStart -= 0.15;
            this.red.fillStart -= 0.15;
            this.pointer.setPosition( 284 * ( this.red.fillStart - 0.5 ) * 2, 0 );
            break;
      }
      if ( this.blue.fillStart >= 1 && this.isfinal == false )
      {
         this.blue.fillStart = 1;
         this.red.fillStart = 1;
         Messager.Broadcast( 'isAtking', 2 );
         this.isfinal = true;
      }
      else if ( this.red.fillStart <= 0 || this.blue.fillStart <= 0 )
      {
         this.isfinal = true;
         this.red.fillStart = 0;
         this.blue.fillStart = 0;
         Boss.Instance.CancelAutoAtk( true );
      }
   }

   public calculateDis ()//计算飞行距离
   {
      this.pointer.parent.parent.active = false;
      // var dis = UiManager.Instance.gamePanel.power - GameManager.Instance.BossPower;
      let index = Math.floor( UiManager.Instance.gamePanel.power / GameManager.Instance.BossPower );
      if ( index >= 6 )
         index = 6;
      return index;
   }
}