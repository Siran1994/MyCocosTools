import { _decorator, Node, Prefab, instantiate, NodePool, find } from "cc";
const { ccclass } = _decorator;

@ccclass( "PoolManager" )
export class PoolManager
{
    static dictPool: any = {}
    static dictPrefab: any = {}

    public static getNode ( prefab: Prefab, parent: Node )//从对象池中获取对象
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
        node.parent = parent;
        node.active = true;
        return node;
    }

    /**
        * 预生成对象池
        * @param prefab 
        * @param nodeNum 
        * 使用——PoolManager.instance.prePool(prefab, 40);
        */
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

    public static getNodeInfo ( name: string )
    {
        let node: Node;
        if ( this.dictPool.hasOwnProperty( name ) )
        {
            if ( this.dictPrefab.hasOwnProperty( name ) )
                node = this.dictPrefab[ name ].data as Node;
        }
        else
            node = null;
        return node;
    }

    public static putNode ( node: Node ) //将对应节点放回对象池中
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

    public static putNodeByName ( name: string )//将对应节点放回对象池中
    {
        this.putNode( find( name ) );
    }

    public static clearPool ( name: string )//清理指定对象池
    {
        if ( this.dictPool.hasOwnProperty( name ) )
        {
            let pool = this.dictPool[ name ];
            pool.clear();
        }
    }

    public static clear ()//清理所有对象池
    {
        PoolManager.clearPool( 'RewardPanel' );
    }
}