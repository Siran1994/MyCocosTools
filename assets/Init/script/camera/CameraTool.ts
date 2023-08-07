import {   IVec3Like,   Node,  Quat, Vec3 } from "cc";

/**
 * 该类属于一个引擎内部的Quat四元数类的一个扩展简化版
 * 因为本人觉得有些out参数过于多余，在这里就隐藏掉了
 * 同时也加了些其他的四元数旋转的功能
 */
export class Quaternion {
    
    private static Deg2Rad:number=(Math.PI) / 180;

    /**
     * 绕Y轴旋转置顶节点
     * @param _node 需要旋转的节点
     * @param _angle 旋转的角度（是角度不是弧度）
     */
    public static RotateY(_node: Node, _angle: number): Quat {
        let _quat = new Quat();
        _node.rotation = Quat.rotateY(_quat, _node.rotation, _angle * this.Deg2Rad);
        return _quat;
    }

     /**
     * 绕X轴旋转置顶节点
     * @param _node 需要旋转的节点
     * @param _angle 旋转的角度（是角度不是弧度）
     */
    public static RotateX(_node: Node, _angle: number): Quat {
        let _quat = new Quat();
        _node.rotation = Quat.rotateX(_quat, _node.rotation, _angle * this.Deg2Rad);
        return _quat;
    }

     /**
     * 绕Z轴旋转置顶节点
     * @param _node 需要旋转的节点
     * @param _angle 旋转的角度（是角度不是弧度）
     */
    public static RotateZ(_node: Node, _angle: number): Quat {
        let _quat = new Quat();
        _node.rotation = Quat.rotateZ(_quat, _node.rotation, _angle * this.Deg2Rad);
        return _quat;
    }

    /**
     * 绕世界空间下指定轴旋转四元数
     * @param _targetQuat 指定要旋转四元数
     * @param axis 旋转轴
     * @param _angle 旋转角度
     */
    public static RotateAround(_targetQuat: Quat, axis: Vec3, _angle: number): Quat {
        let _quat = new Quat();
        Quat.rotateAround(_quat, _targetQuat, axis, _angle * this.Deg2Rad);
        return _quat;
    }

    /**
     *  绕本地空间下指定轴旋转四元数
     * @param _targetQuat 指定要旋转四元数
     * @param axis 旋转轴
     * @param _angle 旋转角度
     */
    public static RotateAroundLocal(_targetQuat: Quat, axis: Vec3, _angle: number): Quat {
        let _quat = new Quat();
        Quat.rotateAroundLocal(_quat, _targetQuat, axis, _angle * this.Deg2Rad);
        return _quat;
    }

    /**
     * 将变换围绕穿过世界坐标中的 point 的 axis 旋转 angle 度。
     * 这会修改变换的位置和旋转。
     * @param self 要变换旋转的目标
     * @param pos 指定围绕的point
     * @param axis 旋转轴
     * @param angle 旋转角度
     */
    public static RotationAroundNode(self:Node,pos:Vec3,axis:Vec3,angle:number):Quat
    {
        let _quat=new Quat();
        let v1=new Vec3();
        let v2=new Vec3();
        let pos2:Vec3=self.position;
        let rad=angle* this.Deg2Rad;
        Quat.fromAxisAngle(_quat,axis,rad);
        Vec3.subtract(v1,pos2,pos);
        Vec3.transformQuat(v2,v1,_quat);
        self.position=Vec3.add(v2,pos,v2);
        Quat.rotateAround(_quat,self.rotation,axis,rad);
        return _quat;
    }

    /**
     * 从四元数得到欧拉角
     * @param _quat 四元数
     */
    public static GetEulerFromQuat(_quat: Quat): IVec3Like {
        let angle: IVec3Like = Quat.toEuler(new Vec3(), _quat, true);
        return angle;
    }

    /**
     * 从欧拉角得到四元数
     * @param _angle 欧拉角
     */
    public static GetQuatFromAngle(_angle: IVec3Like): Quat {
        let _quat: Quat = Quat.fromEuler(new Quat(), _angle.x, _angle.y, _angle.z);
        return _quat;
    }

    /**
     * 四元数差值，在 a 和 b 之间插入 t，然后对结果进行标准化处理。参数 t 被限制在 [0, 1] 范围内。
     * 该方法比 Slerp 快，但如果旋转相距很远，其视觉效果也更糟糕。
     * @param _a 
     * @param _b 
     * @param _t 
     */
    public static Lerp(_a: Quat, _b: Quat, _t: number): Quat {
        let _quat = new Quat();
        Quat.lerp(_quat, _a, _b, _t);
        return _quat;
    }

    /**
     * 四元数球形差值
     * 在 a 和 b 之间以球形方式插入 t。参数 t 被限制在 [0, 1] 范围内。
     * @param _a 
     * @param _b 
     * @param _t 
     */
    public static Slerp(_a: Quat, _b: Quat, _t: number): Quat {
        let _quat = new Quat();
        Quat.slerp(_quat, _a, _b, _t);
        return _quat;
    }


    public static LookRotation(_forward: Vec3, _upwards: Vec3 = Vec3.UP): Quat {
        let _quat = new Quat();
        Vec3.normalize(_forward,_forward);
        Quat.fromViewUp(_quat,_forward,_upwards);
        return _quat;
    }

}

export class VectorTool {
    
    public static SmoothDampV3(current:IVec3Like,target:Vec3,currentVelocity:IVec3Like,smoothTime:number,maxSpeed:number,deltaTime:number)
    {
        let outputX:number=0;
        let outputY:number=0;
        let outputZ:number=0;
        smoothTime=Math.max(0.0001,smoothTime);
        let omega:number=2/smoothTime;
        let x:number=omega*deltaTime;
        let exp:number=1/(1+x+0.48*x*x+0.235*x*x*x);
        let changX:number=current.x-target.x;
        let changY:number=current.y-target.y;
        let changZ:number=current.z-target.z;
        let originalTo:Vec3=target;

        let maxChange:number=maxSpeed*smoothTime;

        let maxChangeSq:number=maxChange*maxChange;
        let sqrmag:number=changX*changX+changY*changY+changZ*changZ;
        if(sqrmag>maxChangeSq)
        {
            let mag:number=Math.sqrt(sqrmag);
            changX=changX/mag*maxChangeSq;
            changY=changY/mag*maxChangeSq;
            changZ=changZ/mag*maxChangeSq;
        }

        target.x=current.x-changX;
        target.y=current.y-changY;
        target.z=current.z-changZ;

        let tempX:number=(currentVelocity.x+omega*changX)*deltaTime;
        let tempY:number=(currentVelocity.y+omega*changY)*deltaTime;
        let tempZ:number=(currentVelocity.z+omega*changZ)*deltaTime;

        currentVelocity.x=(currentVelocity.x-omega*tempX)*exp;
        currentVelocity.y=(currentVelocity.y-omega*tempY)*exp;
        currentVelocity.z=(currentVelocity.z-omega*tempZ)*exp;

        outputX=target.x+(changX+tempX)*exp;
        outputY=target.y+(changY+tempY)*exp;
        outputZ=target.z+(changZ+tempZ)*exp;

        let origMinusCurrentX:number=originalTo.x-current.x;
        let origMinusCurrentY:number=originalTo.y-current.y;
        let origMinusCurrentZ:number=originalTo.z-current.z;
        let outMinusOrigX:number=outputX-originalTo.x;
        let outMinusOrigY:number=outputY-originalTo.y;
        let outMinusOrigZ:number=outputZ-originalTo.z;

        if(origMinusCurrentX*outMinusOrigX+origMinusCurrentY*outMinusOrigY+origMinusCurrentZ*outMinusOrigZ>0)
        {
            outputX=originalTo.x;
            outputY=originalTo.y;
            outputZ=originalTo.z;

            currentVelocity.x=(outputX-originalTo.x)/deltaTime;
            currentVelocity.y=(outputY-originalTo.y)/deltaTime;
            currentVelocity.z=(outputZ-originalTo.z)/deltaTime;
        }
        return new Vec3(outputX,outputY,outputZ);

    }
    
    public static SmoothDamp(current:number,target:number,currentVelocity:number,smoothTime:number,maxSpeed:number,deltaTime:number)
    {
        smoothTime=Math.max(0.0001,smoothTime);
        let num:number=2/smoothTime;
        let num2:number=num*deltaTime;
        let num3:number=1/(1+num2+0.48*num2*num2+0.235*num2*num2*num2);
        let num4:number=current-target;
        let num5:number=target;
        let num6:number=maxSpeed*smoothTime;
        num4=VectorTool.Clamp(num4,-num6,num6);
        target=current-num4;
        let num7:number=(currentVelocity+num*num4)*deltaTime;
        currentVelocity=(currentVelocity-num*num7)*num3;
        let num8:number=target+(num4+num7)*num3;
        if(num5-current>0==num8>num5)
        {
            num8=num5;
            currentVelocity=(num8-num5)/deltaTime;
        }
        return num8;
    }

    public static Clamp(val:number,min:number,max:number)
    {
        if(val<=min) val=min;
        if(val>=max) val=max;

        return val;
    }
}
