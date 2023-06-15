
/**
 * @en Registration method for the main process of Extension
 * @zh 为扩展的主进程的注册方法
 */
export const methods: { [ key: string ]: ( ...any: any ) => any } =
{
    log ()
    {

        console.log( '垃圾Cocos3D!' )

        // Editor.Message.send( 'scene', 'execute-component-method', { uuid: '56CYrYgPxAc4bbM2x0Q1Pn', name: 'test', args: null } );

    },
};

/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
export function load ()
{

}

/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
export function unload () { }



