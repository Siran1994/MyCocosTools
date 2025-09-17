import { _decorator, Enum, macro, Node, SkeletalAnimation, Vec3 } from 'cc';
import FSM, { FSMAction } from './FSM';
import { NavManager } from '../manager/NavManager';
import { AiState, FoodType } from '../data/Enum';
import { Utils } from '../tool/Utils';
import { Global } from '../data/Global';
import { Config } from '../data/Config';
import { PoolManager } from '../manager/PoolManager';
import { PrefabManager } from '../manager/PrefabManager';
import { Messager } from '../manager/Messager';
import { GameData } from '../data/GameData';
import { roleBase } from './roleBase';
const { ccclass, property } = _decorator;
export enum W_Action
{
    GoToCookArea,       //去烹饪区
    GoToShelf,  //去对应货架
    GoToDesk, //去餐桌
    GoToWashMachine,//去垃圾桶
    Waiting,    //等待中
}
Enum( W_Action )

@ccclass( 'Waiter' )
export class Waiter extends roleBase
{
    @property( SkeletalAnimation )
    animator: SkeletalAnimation = null;

    fsm: FSM = null;

    @property( Node )//搬运
    takeList: Node[] = [];

    @property
    target: Vec3 = null;

    @property
    AgentId = -1;

    @property
    isMoving = false;
    takeNum = 2;

    cookBenchInfo = null;
    foodShelfInfo = null;
    deskInfo = null;
    washMachine = null;

    cookAreaId = 0;
    waiterInfo = null;

    onLoad ()
    {
        this.isMoving = false;
        this.takeList.length = null;
        this.curState = '';
        this.initFsm();
        this.Init( () =>
        {
            this.hudInfo.hudInit();
        } );
        if ( this.AgentId == -1 )
        {
            this.AgentId = NavManager.Instance.InitAgent( this.node, Global.getWaiterSpeed( this.node.name ) );//速度需配表    
            this.waiterInfo = Global.uiMgr.waiterPanel.getWaiterInfoByName( this.node.name );//员工信息
        }
    }

    onEnable ()
    {
        this.target = null;
        this.takeNum = Global.getWaiterTakeNum( this.node.name );
        Messager.AddListener( 'UpdateWaiterState', this, this.UpdateWaiterInfo );
    }

    onDisable ()
    {
        Messager.RemoveListener( 'UpdateWaiterState', this, this.UpdateWaiterInfo );
    }

    UpdateWaiterInfo ( info )
    {
        if ( this.node.name == info.name )
        {
            NavManager.Instance.setAgentSpeed( this.AgentId, Global.getWaiterSpeed( this.node.name ) );
            this.takeNum = Global.getWaiterTakeNum( this.node.name );
        }
    }

    initFsm ()
    {
        this.fsm = this.node.addComponent( FSM );
        this.fsm.init( this )
        this.fsm.addState( new FSMAction( this, W_Action.Waiting, this.WaitingEnter, this.WaitingUpdate, this.WaitingExit ) );
        this.fsm.addState( new FSMAction( this, W_Action.GoToCookArea, this.GoToCookAreaEnter, this.GoToCookAreaUpdate, this.GoToCookAreaExit ) );
        this.fsm.addState( new FSMAction( this, W_Action.GoToShelf, this.GoToShelfEnter, this.GoToShelfUpdate, this.GoToShelfExit ) );
        this.fsm.addState( new FSMAction( this, W_Action.GoToDesk, this.GoToDeskEnter, this.GoToDeskUpdate, this.GoToDeskExit ) );
        this.fsm.addState( new FSMAction( this, W_Action.GoToWashMachine, this.GoToWashMachineEnter, this.GoToWashMachineUpdate, this.GoToWashMachineExit ) );
    }

    // 0 披萨 1 牛排 2 土豆 3 柠檬汁
    run ()//开局先进入待机状态
    {
        switch ( this.node.name )
        {
            case '阿康': //搬披萨
                this.cookAreaId = 0;
                this.fsm.enterState( W_Action.Waiting )
                break;
            case '小鹿': //搬餐盘
                this.fsm.enterState( W_Action.Waiting )
                break;
            case '大鹏': //默认搬牛排
                if ( GameData.BlockId < 12 )//牛排没有解锁
                    this.cookAreaId = 0;
                else
                    this.cookAreaId = 1;
                this.fsm.enterState( W_Action.Waiting )
                break;
            case '乐仔': //默认搬土豆
                if ( GameData.BlockId < 12 )//牛排没有解锁
                    this.cookAreaId = 0;
                else if ( GameData.BlockId >= 12 && GameData.BlockId < 20 )//牛排解锁
                    this.cookAreaId = 1;
                else
                    this.cookAreaId = 2;//土豆解锁
                this.fsm.enterState( W_Action.Waiting )
                break;
            case '米娜': //默认搬柠檬汁
                this.cookAreaId = 3;
                this.fsm.enterState( W_Action.Waiting )
                break;
            default: //全能
                this.fsm.enterState( W_Action.Waiting )
                break;
        }
    }

    WaitingEnter ()
    {
        this.target = Global.spawmMgr.restPosList[ this.waiterInfo.id - 1 ].worldPosition;//1
        this.isMoving = NavManager.Instance.moveAgent( this.target, this.AgentId );
    };

    WaitingUpdate ( dt )
    {
        if ( this.target != null )
        {
            if ( NavManager.Instance.isMoveOver( this.AgentId ) && this.isMoving )
            {
                this.isMoving = false;
                this.node.eulerAngles = new Vec3( 0, 90, 0 );
                this.hudInfo.ShowEmoji( 11 );//困  
                this.schedule( this.CheckState, 3, macro.REPEAT_FOREVER );
            }
        }
    };

    CheckState ()
    {
        switch ( this.waiterInfo.type )
        {
            case 1: //搬披萨
            case 3: //默认搬牛排
            case 4: //默认搬土豆
            case 5: //默认搬柠檬汁
                this.cookBenchInfo = Global.mapMgr.getCookBenchInfo( this.cookAreaId );
                this.foodShelfInfo = Global.mapMgr.getFoodShelfInfo( this.cookAreaId );
                if ( this.foodShelfInfo.foodList.length >= this.foodShelfInfo.foodPos.length )
                {
                    this.fsm.changeState( W_Action.Waiting )
                    this.hudInfo.ShowEmoji( 11 );//困  
                }
                else
                {
                    if ( this.takeList.length > 0 )
                    {
                        this.unschedule( this.CheckState );
                        this.fsm.changeState( W_Action.GoToShelf )
                    }
                    else
                    {
                        this.unschedule( this.CheckState );
                        switch ( this.node.name )
                        {
                            case '大鹏': //默认搬牛排
                                if ( GameData.BlockId < 12 )//牛排没有解锁
                                    this.cookAreaId = 0;
                                else
                                    this.cookAreaId = 1;
                                break;
                            case '乐仔': //默认搬土豆
                                if ( GameData.BlockId < 12 )//牛排没有解锁
                                    this.cookAreaId = 0;
                                else if ( GameData.BlockId >= 12 && GameData.BlockId < 20 )//牛排解锁
                                    this.cookAreaId = 1;
                                else
                                    this.cookAreaId = 2;//土豆解锁                              
                                break;
                        }
                        this.fsm.changeState( W_Action.GoToCookArea )
                    }
                }
                break;
            case 2: //搬餐盘
                this.deskInfo = Global.mapMgr.getDeskInfo();
                if ( this.deskInfo )
                {
                    this.unschedule( this.CheckState );
                    this.fsm.changeState( W_Action.GoToDesk )
                }
                else
                {
                    this.fsm.changeState( W_Action.Waiting )
                }
                break;
        }
    }

    WaitingExit () { };

    GoToCookAreaEnter ()
    {
        Utils.DelayCallBack( 0.5, () => //根据Ai类型进行决定开始做什么
        {
            this.cookBenchInfo = Global.mapMgr.getCookBenchInfo( this.cookAreaId );
            this.foodShelfInfo = Global.mapMgr.getFoodShelfInfo( this.cookAreaId );
            this.target = this.cookBenchInfo.getWaiterPos();

            if ( ( this.cookBenchInfo.foodType === FoodType.披萨 && this.target ) ||
                ( this.cookBenchInfo.foodList.length > 0 && this.target ) )
            {
                this.isMoving = NavManager.Instance.moveAgent( this.target, this.AgentId );
            }
            else
            {
                this.fsm.changeState( W_Action.Waiting );
            }
        } );
    };
    GoToCookAreaUpdate ( dt )
    {
        if ( this.target != null )
        {
            if ( NavManager.Instance.isMoveOver( this.AgentId ) && this.isMoving )
            {
                this.isMoving = false;
                if ( this.cookBenchInfo.ani )
                    this.cookBenchInfo.ani.play();
                let needTake = this.takeNum - this.takeList.length;//搬运食材
                for ( let i = 0; i < needTake; i++ )
                {
                    setTimeout( () =>
                    {
                        if ( this.cookBenchInfo.foodType == FoodType.披萨 )//披萨
                        {
                            if ( this.cookBenchInfo.ani )
                                this.cookBenchInfo.ani.play( 'open' );
                            let food = PoolManager.getNode( PrefabManager.get( FoodType[ this.cookBenchInfo.foodType ], PrefabManager.FoodMap ), this.cookBenchInfo.foodPos );
                            food.position = Vec3.ZERO;
                            food.eulerAngles = Vec3.ZERO;
                            food.children[ 0 ].active = true;
                            this.addFood( food );
                        }
                        else
                        {
                            if ( this.cookBenchInfo.foodList.length > 0 )//其他食材(牛排,薯条,柠檬汁)
                            {
                                let food = this.cookBenchInfo.foodList.pop();
                                food.eulerAngles = Vec3.ZERO;
                                food.children[ 0 ].active = true;
                                this.addFood( food );
                                if ( this.cookBenchInfo.foodList.length < this.cookBenchInfo.foodPosList.length )
                                    Messager.Broadcast( 'StartCook' );
                            }
                            else
                                this.fsm.changeState( W_Action.Waiting );
                        }
                    }, i * Config.Value.delayTime );
                }
            }
        }
    };
    GoToCookAreaExit () { };

    GoToShelfEnter ()
    {
        if ( this.cookBenchInfo.ani )
            this.cookBenchInfo.ani.play( 'close' );
        this.target = this.foodShelfInfo.getWaiterPos();
        if ( this.target != null )
        {
            this.isMoving = NavManager.Instance.moveAgent( this.target, this.AgentId );
        }
        else
        {
            this.target = new Vec3( 5, 0, -38 );
            this.isMoving = NavManager.Instance.moveAgent( this.target, this.AgentId );
        }
    };
    GoToShelfUpdate ( dt )
    {
        if ( this.target != null )
        {
            if ( NavManager.Instance.isMoveOver( this.AgentId ) && this.isMoving )
            {
                this.isMoving = false;
                this.placeFood();
            }
        }
    };
    GoToShelfExit () { };

    GoToDeskEnter ()
    {
        Utils.DelayCallBack( 0.5, () => //根据Ai类型进行决定开始做什么
        {
            this.washMachine = Global.mapMgr.washMachine;
            this.target = this.deskInfo.getWaiterPos();
            if ( this.target != null )
            {
                this.isMoving = NavManager.Instance.moveAgent( this.target, this.AgentId );
            }
            else
            {
                this.fsm.changeState( W_Action.Waiting )
            }
        } );

    };
    GoToDeskUpdate ( dt )
    {
        if ( this.target != null )
        {
            if ( NavManager.Instance.isMoveOver( this.AgentId ) && this.isMoving )
            {
                this.isMoving = false;
                if ( this.deskInfo.plateList.length == 0 )
                {
                    this.deskInfo = Global.mapMgr.getDeskInfo();
                    if ( this.deskInfo )
                        this.fsm.enterState( W_Action.GoToDesk );
                    else
                        this.fsm.enterState( W_Action.Waiting );
                }
                else
                {
                    for ( let i = 0; i < this.deskInfo.plateList.length; i++ )
                    {
                        setTimeout( () =>
                        {
                            this.addDish( this.deskInfo.plateList.shift() );
                        }, i * Config.Value.delayTime );
                    }
                    Utils.DelayCallBack( this.deskInfo.plateList.length * Config.Value.delayTime + 0.3, () =>
                    {
                        this.count = 0;
                        this.deskInfo.DeskRecover();
                        this.fsm.changeState( W_Action.GoToWashMachine );
                    } );
                }
            }
        }
    };
    GoToDeskExit () { };

    GoToWashMachineEnter ()
    {
        this.target = this.washMachine.getWaiterPos();
        if ( this.target != null )
        {
            this.isMoving = NavManager.Instance.moveAgent( this.target, this.AgentId );
        }
    };
    GoToWashMachineUpdate ( dt )//放盘子
    {
        if ( this.target != null )
        {
            if ( NavManager.Instance.isMoveOver( this.AgentId ) && this.isMoving )
            {
                this.isMoving = false;
                for ( let i = 0; i < this.takeList.length; i++ )
                {
                    setTimeout( () =>
                    {
                        let item = this.takeList.pop();
                        Utils.flyTo( item, this.washMachine.recyclePos, this.washMachine.recyclePos.worldPosition.clone(), Config.Value.flyTime,
                            () =>
                            {
                                if ( this.takeList.length == 0 )
                                {
                                    this.washMachine.ani.play();
                                    this.deskInfo = Global.mapMgr.getDeskInfo();
                                    if ( this.deskInfo )
                                        this.fsm.changeState( W_Action.GoToDesk );
                                    else
                                        this.fsm.changeState( W_Action.Waiting );
                                }
                            } );
                    }, i * Config.Value.delayTime );
                }
            }
        }
    };
    GoToWashMachineExit () { };

    getAction ()
    {
        return this.fsm.getCurrState().id
    }

    update ( dt: number )
    {
        this.updateAni();
    }
    updateAni ()
    {
        if ( this.isMoving )
        {
            if ( this.takeList.length == 0 )
                this.playAni( AiState.走路 );
            else
                this.playAni( AiState.搬运走路 );
        }
        else
        {
            if ( this.takeList.length == 0 )
                this.playAni( AiState.待机 );
            else
                this.playAni( AiState.搬运待机 );
        }
    }

    addFood ( item: any )//搬运食物
    {
        let targetPos = new Vec3( 0, this.takeList.length * Config.Value.foodH )
        Utils.flyTo( item, this.takePos, this.takePos.worldPosition.clone().add( targetPos.clone() ), Config.Value.flyTime, () =>
        {
            item.position = targetPos
        } )
        this.takeList.push( item );
        Utils.DelayCallBack( 0.5, () =>
        {
            if ( this.takeList.length >= this.takeNum )
            {
                if ( this.foodShelfInfo.foodList.length >= this.foodShelfInfo.foodPos.length )
                {
                    this.fsm.changeState( W_Action.Waiting )
                    return;
                }
                else
                {
                    this.fsm.changeState( W_Action.GoToShelf );
                }
            }
        } );
    }

    placeFood ()//放置食物
    {
        if ( this.foodShelfInfo.foodList.length >= this.foodShelfInfo.foodPos.length )
        {
            this.fsm.changeState( W_Action.Waiting )
            return;
        }
        else
        {
            this.foodShelfInfo.isPlacing = true;
            let hasNum = this.takeList.length;
            let resNum = this.foodShelfInfo.foodPos.length - this.foodShelfInfo.foodList.length;
            let num = Math.min( hasNum, resNum );
            let index = this.foodShelfInfo.foodList.length;
            for ( let i = 0; i < num; i++ )
            {
                setTimeout( () =>
                {
                    this.foodShelfInfo.FoodAni( this.takeList.pop(), this.foodShelfInfo.foodPos[ i + index ] );

                }, i * 100 );
            }
            Utils.DelayCallBack( num * 0.1 + 0.1, () =>
            {
                this.foodShelfInfo.foodList.forEach( ( node, index ) =>//重新整理
                {
                    node.parent = this.foodShelfInfo.foodPos[ index ];
                    node.position = Vec3.ZERO;
                } );
                this.foodShelfInfo.isPlacing = false;
                if ( this.foodShelfInfo.foodList.length >= this.foodShelfInfo.foodPos.length )
                {
                    this.fsm.changeState( W_Action.Waiting )
                }
                else
                {
                    this.fsm.changeState( W_Action.GoToCookArea )
                }
            } );
        }
    }

    count = 0;
    addDish ( plate )//搬运餐盘
    {
        this.count += 1;
        let targetPos = new Vec3( 0, ( this.count - 1 ) * Config.Value.foodH );
        Utils.flyTo( plate, this.takePos, this.takePos.worldPosition.clone().add( targetPos.clone() ), Config.Value.flyTime, () =>
        {
            plate.position = targetPos;
        } )
        this.takeList.push( plate );
    }

    curState = '';
    playAni ( state: AiState | string )
    {
        switch ( state )
        {
            case AiState.待机:
                state = 'idle';
                break;
            case AiState.搬运待机:
                state = 'carry_idle';
                break;
            case AiState.走路:
                state = 'run';
                break;
            case AiState.搬运走路:
                state = 'carry_run';
                break;
        }
        if ( this.curState != state )
        {
            this.animator?.crossFade( state );
            this.curState = state;
        }
    }
}