import { _decorator, Node, Prefab, instantiate, NodePool, director } from "cc";
const { ccclass } = _decorator;

@ccclass( "PoolManager" )
export class PoolManager
{
    static dictPool: any = {}
    static dictPrefab: any = {}

    //从对象池中获取对象
    public static getNode ( prefab: Prefab, parent?: Node )
    {
        let name = prefab.data.name;
        this.dictPrefab[ name ] = prefab;
        let node = null;
        if ( this.dictPool.hasOwnProperty( name ) )
        {
            //已有对应的对象池
            let pool = this.dictPool[ name ];
            if ( pool.size() > 0 )
                node = pool.get()!;
            else
                node = instantiate( prefab );
        }
        else
        {
            //没有对应对象池，创建他！
            let pool = new NodePool();
            this.dictPool[ name ] = pool;
            node = instantiate( prefab );
        }
        if ( parent == null )
            director.getScene().addChild( node );
        else
            node.parent = parent;
        node.active = true;
        return node;
    }

    //预生成对象池
    public static prePool ( prefab: Prefab, nodeNum: number )
    {
        const name = prefab.name;

        let pool = new NodePool();
        this.dictPool[ name ] = pool;

        for ( let i = 0; i < nodeNum; i++ )
        {
            const node = instantiate( prefab );
            pool.put( node );
        }
    }

    //将对应节点放回对象池中
    public static putNode ( node: Node ) 
    {
        let name = node.name;
        let pool = null;
        if ( this.dictPool.hasOwnProperty( name ) )
            pool = this.dictPool[ name ]; //已有对应的对象池
        else
        {
            pool = new NodePool();//没有对应对象池，创建他！
            this.dictPool[ name ] = pool;
        }
        pool.put( node );
    }

    //清理指定对象池
    public static clearPool ( name: string )
    {
        if ( this.dictPool.hasOwnProperty( name ) )
        {
            let pool = this.dictPool[ name ];
            pool.clear();
        }
    }

    public static clear ()//清理所有对象池
    {
        // PoolManager.clearPool( 'Coin' );       
    }
}