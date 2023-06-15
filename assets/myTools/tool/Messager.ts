interface IEventData 
{
    func: Function;
    target: any;
}
interface IEvent 
{
    [ eventName: string ]: IEventData[];
}
export class Messager 
{
    public static handle: IEvent = {};

    public static AddListener ( eventName: string, target: any, cb: Function )
    {
        if ( !this.handle[ eventName ] )
        {
            this.handle[ eventName ] = [];
        }

        const data: IEventData = { func: cb, target };
        this.handle[ eventName ].push( data );
    }

    public static RemoveListener ( eventName: string, target: any, cb: Function )
    {
        const list = this.handle[ eventName ];
        if ( !list || list.length <= 0 )
        {
            return;
        }

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

    public static Broadcast ( eventName: string, ...args: any )
    {
        const list = this.handle[ eventName ];
        if ( !list || list.length <= 0 )
        {
            return;
        }

        for ( let i = 0; i < list.length; i++ )
        {
            const event = list[ i ];
            event.func.apply( event.target, args );
        }
    }
}