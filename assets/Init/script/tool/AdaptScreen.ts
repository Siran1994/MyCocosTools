import { Canvas } from 'cc';
import { view } from 'cc';
import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass( 'AdaptScreen' )
export class AdaptScreen extends Component
{
    onLoad ()
    {
        this.adaptFullScreenBg();

        view.setResizeCallback( () => this.adaptFullScreenBg() );
    }

    adaptFullScreenBg ()
    {
        // 获取视图设计分辨率和输出分辨率
        let { width: designWidth, height: designHeight } = view.getDesignResolutionSize();
        let { width: screenWidth, height: screenHeight } = view.getVisibleSizeInPixel();
        //计算适配比例：
        let scaleX = designWidth / screenWidth;
        let scaleY = designHeight / screenHeight;

        let maxScale = Math.max( scaleX, scaleY );
        // 为了避免屏幕出现黑边，在高度适配与宽度适配中，使用较大的缩放比例        
        this.node.setScale( maxScale, maxScale );

        // const minScale = Math.min( scaleX, scaleY );
        //设置设计分辨率和适配模式：
        //view.setDesignResolutionSize( designWidth * minScale, designHeight * minScale, ResolutionPolicy.EXACT_FIT );
    }
}