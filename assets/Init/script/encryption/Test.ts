import { _decorator, Component } from 'cc';
import CryptoJS from './CryptoJS';
const { ccclass } = _decorator;

@ccclass( 'Test' )
export class Test extends Component
{
    start ()
    {
        let str = '陈源';
        let encode = CryptoJS.encode( str );
        console.error( '密文: ' + encode );
        let decode = CryptoJS.decode( encode );
        console.error( '解密: ' + decode );
    }
}