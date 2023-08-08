import { director } from 'cc';
import { view, UITransform } from 'cc';
import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass( 'AdaptScreen' )
export class AdaptScreen extends Component
{
    start ()
    {
        this.adaptFullScreenBg();
    }

    adaptFullScreenBg ()
    {
        // 获取视图设计的分辨率
        const drSize = view.getDesignResolutionSize();
        // 获取背景图片的内容尺寸（分辨率）
        //const bgSize = this.node.getComponent( UITransform ).contentSize;
        const bgSize = view.getVisibleSizeInPixel();
        // 宽度适配缩放比例
        const widthAdaptScale = drSize.width / bgSize.width;
        // 高度适配缩放比例
        const heightAdaptScale = drSize.height / bgSize.height;
        // 为了避免屏幕出现黑边，在高度适配与宽度适配中，使用较大的缩放比例
        const adaptScale = widthAdaptScale > heightAdaptScale ? widthAdaptScale : heightAdaptScale;
        this.node.setScale( adaptScale, adaptScale );
    }
}