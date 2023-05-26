import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

interface IEventData 
{
    func: Function;
    target: any;
}
interface IEvent 
{
    [ eventName: string ]: IEventData[];
}

@ccclass('Messager')
export class Messager 
{
    private static instance: Messager;
    public static get Instance (): Messager
    {
        if ( Messager.instance == null )
            Messager.instance = new Messager();
        return Messager.instance;
    }

    public handle: IEvent = {};

    public Broadcast ( eventName: string, ...args: any ) 
    {
        const list = this.handle[ eventName ];
        if ( !list || list.length <= 0 )
            return;
        for ( let i = 0; i < list.length; i++ )
        {
            const event = list[ i ];
            event.func.apply( event.target, args );
        }
    }
    
    public AddListener ( eventName: string, target: any, cb: Function ) 
    {
        if ( !this.handle[ eventName ] )
            this.handle[ eventName ] = [];

        const data: IEventData = { func: cb, target };
        this.handle[ eventName ].push( data );
    }

    public RemoveListener ( eventName: string, target: any, cb: Function )
    {
        const list = this.handle[ eventName ];
        if ( !list || list.length <= 0 )
            return;

        for ( let i = 0; i < list.length; i++ )
        {
            const event = list[ i ];
            if ( event.func === cb && ( !target || target === event.target ) )
            {
                list.splice( i, 1 );
                break;
            }
        }
    }    
}