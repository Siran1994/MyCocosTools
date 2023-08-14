import { _decorator, Node, Prefab, instantiate, NodePool, find } from "cc";
const { ccclass } = _decorator;

@ccclass( "PoolManager" )
export class PoolManager
{
    static dictPool: { [ name: string ]: NodePool } = {}
    static dictPrefab: { [ name: string ]: Prefab } = {}

    public static getNode ( prefab: Prefab, parent: Node )
    {
        let name = prefab.data.name;
        this.dictPrefab[ name ] = prefab;
        let node: Node;
        if ( this.dictPool.hasOwnProperty( name ) )
        {
            //已有对应的对象池
            let pool = this.dictPool[ name ];
            if ( pool.size() > 0 )
            {
                node = pool.get()!;
            }
            else
            {
                node = instantiate( prefab );
            }
        }
        else
        {
            //没有对应对象池，创建他！
            let pool = new NodePool();
            this.dictPool[ name ] = pool;

            node = instantiate( prefab );
        }

        node.parent = parent;
        return node;
    }
    public static getNodeInfo ( name: string )
    {
        let node: Node;
        if ( this.dictPool.hasOwnProperty( name ) )
        {
            if ( this.dictPrefab.hasOwnProperty( name ) )
            {
                node = this.dictPrefab[ name ].data as Node;
            }
        }
        else
            node = null;
        return node;
    }
    /**
     * 将对应节点放回对象池中
     */
    public static putNode ( node: Node )
    {
        let name = node.name;
        let pool = null;
        if ( this.dictPool.hasOwnProperty( name ) )
        {
            //已有对应的对象池
            pool = this.dictPool[ name ];
        } else
        {
            //没有对应对象池，创建他！
            pool = new NodePool();
            this.dictPool[ name ] = pool;
        }
        pool.put( node );
    }
    /**
         * 将对应节点放回对象池中
         */
    public static putNodeByName ( name: string )
    {
        this.putNode( find( name ) );
    }

    public static clearPool ( name: string )
    {
        if ( this.dictPool.hasOwnProperty( name ) )
        {
            let pool = this.dictPool[ name ];
            pool.clear();
        }
    }
    /** 清理所有对象池 */
    public static clear ()
    {

    }
}
