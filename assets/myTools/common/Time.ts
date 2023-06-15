import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass( 'Time' )
export class Time 
{
    static first: number | null = null;//单位秒
    public static get time (): number
    {
        if ( Time.first == null )
            Time.first = performance.now();
        return ( performance.now() - Time.first ) * 0.001;
    }
}