
import { PhysicsSystem, Vec3, game } from 'cc';
import { profiler } from 'cc';
import { _decorator, director } from 'cc';
import { Config } from '../data/Config';
const { ccclass } = _decorator;

// electron模块，打包web-mobil后在HTML中定义全局变量electron
const electron = ( window as any ).electron;

@ccclass( "DeviceManager" )
export class DeviceManager 
{
    private static instance: DeviceManager = null;

    public static get Instance ()
    {
        if ( this.instance )
            return this.instance;
        this.instance = new DeviceManager();
        return this.instance;
    }

    public getGpuInfo ()
    {
        return director.root.device.renderer;
    }

    public setTargetFPS ()
    {
        PhysicsSystem.instance.gravity = new Vec3( 0, Config.Gravity, 0 ); // 设置重力向量为向下的 1000 米/秒²//设置重力
        game.frameRate = Config.GameFrame;//帧率设置
        PhysicsSystem.instance.fixedTimeStep = 1 / game.frameRate;//优化物理引擎计算次数
    }

    public showFPS ( isDebugOpen: boolean = true )
    {
        isDebugOpen === true ? profiler.showStats() : profiler.hideStats();
    }

    // 开关阴影
    public setShadow ( isOpen = false )
    {
        director.getScene()!.globals.shadows.enabled = isOpen;
    }

    // 开关天空盒
    public setSkyBox ( isOpen = false )
    {
        director.getScene()!.globals.skybox.enabled = isOpen;
    }

    // 开关全局雾
    public setFog ( isOpen = false )
    {
        director.getScene()!.globals.fog.enabled = isOpen;
    }

    // 移动窗口到中心
    public center ()
    {
        electron.ipcRenderer.send( "e_center" );
    }

    // 全屏专用函数，e代表electron
    public fullScreen ()
    {
        electron.ipcRenderer.send( "e_fullScreen" );
    }

    // 窗口化专用函数
    public window ()
    {
        electron.ipcRenderer.send( "e_window" );
    }

    // 打开开发者工具
    public openDevTools ()
    {
        electron.ipcRenderer.send( "e_openDevTools" );
    }

    // 关闭开发者工具
    public closeDevTools ()
    {
        electron.ipcRenderer.send( "e_closeDevTools" );
    }

    // 设置窗口大小
    public setSize ( width: number, height: number )
    {
        electron.ipcRenderer.send( "e_setSize", width.toString(), height.toString() );
    }

    // 设置分辨率，修改的电脑的分辨率
    public setResolution ( width: number, height: number )
    {
        electron.ipcRenderer.send( "e_setResolution", width.toString(), height.toString() );
    }

    // 当前是否全屏
    public isFullScreen (): boolean
    {
        return electron.ipcRenderer.sendSync( "e_isFullScreen" );
    }

    // 设置分辨率，这才是最终调用的接口，如果全屏设置分辨率，不全屏设置窗口大小
    public setScreenResolution ( width: number, height: number )
    {
        if ( this.isFullScreen() == true )
        {
            this.setResolution( width, height );
        } else
        {
            this.setSize( width, height );
        }
    }

    // 获取一些信息，返回string
    public getMassage (): string
    {
        return electron.ipcRenderer.sendSync( "e_getMassage" );
    }


    // 获取屏幕支持的所有分辨率，是一个string的数组，eg:[1920×1080, 800×600]
    public getAllResolutions (): string[]
    {
        return electron.ipcRenderer.sendSync( "e_getAllResolutions" );
    }

    // 获取当前的屏幕分辨率，是一个string变量，eg:1920×1080
    public getCurrentResolution (): string
    {
        return electron.ipcRenderer.sendSync( "e_getCurrentResolution" );
    }

    // 退出游戏
    public quit ()
    {
        electron.ipcRenderer.send( "e_quit" );
    }
    // 自定义nircmd命令，不需要在前面输入nircmd.exe
    public nircmdUD ( order: string )
    {
        electron.ipcRenderer.send( "e_nircmdUD", order );
    }

    // 每个按钮的指令，其实前面还有nircmd.exe 
    order: string[] = [
        "setsysvolume 65535",
        "mutesysvolume 1",
        "mutesysvolume 0",
        "standby",
        `qboxcom "你想重新启动你的计算机吗?" "重启" exitwin reboot`,
        "clipboard set ~$folder.desktop$",
        "clipboard clear",
        `cmdwait 2000 savescreenshot ~$folder.desktop$/延迟2秒截屏到桌面.png`,
        "savescreenshot ~$folder.desktop$/截图到桌面.png",
        "beep 500 2000",
        "stdbeep",
        `nircmd infobox "你点击了弹窗" "一个可爱的弹窗"`,
    ];

    // 每个指令的名字，这个将显示到按钮的文字上
    order_name: string[] = [
        "设置为最高音量",
        "设置为静音",
        "取消静音",
        "进入待机状态",
        "弹窗重启",
        "复制桌面路径",
        "清空剪切板",
        "延迟两秒截图到桌面",
        "截图到桌面",
        "发出嘟嘟声",
        "标准嘟嘟声",
        "弹窗",
    ];
}