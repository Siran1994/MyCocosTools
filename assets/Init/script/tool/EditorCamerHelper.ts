import { _decorator, Component, Camera, log, Node } from 'cc';
import { EDITOR } from 'cc/env';
const { ccclass, property, executeInEditMode } = _decorator;
declare const cce: any;

@ccclass( 'EditorCamerHelper' )
@executeInEditMode
export class EditorCamerHelper extends Component
{
    _targetCamera: Camera = null!
    get targetCamera ()
    {
        return this._targetCamera
    }
    @property( Camera )
    set targetCamera ( v )
    {
        this._targetCamera = v;
        this.node.worldPosition = this.targetCamera.node.worldPosition
        this.node.worldRotation = this.targetCamera.node.worldRotation
    }

    _refresh: boolean = false;
    get refresh ()
    {
        return this._refresh
    }
    @property
    set refresh ( v )
    {
        this._refresh = v;
        this.syncFromCameraTransform()
    }

    start ()
    {
        this.syncFromCameraTransform()
    }

    onFocusInEditor ()
    {
        this.syncFromCameraTransform()
        this.node.on( Node.EventType.TRANSFORM_CHANGED, this.onTransfromChange, this )
    }
    onLostFocusInEditor ()
    {
        this.node.off( Node.EventType.TRANSFORM_CHANGED, this.onTransfromChange, this )
        this.refresh = false
    }

    private syncFromCameraTransform ()
    {
        if ( this.targetCamera )
        {
            this.node.worldPosition = this.targetCamera.node.worldPosition
            this.node.worldRotation = this.targetCamera.node.worldRotation
        }
    }

    private onTransfromChange ()
    {
        if ( EDITOR && this.refresh && this.targetCamera )
        {
            this.targetCamera.node.worldPosition = this.node.worldPosition
            this.targetCamera.node.worldRotation = this.node.worldRotation
        }
    }

    lateUpdate ( deltaTime: number )
    {
        if ( EDITOR && this.refresh && this.targetCamera )
        {
            const editorCamera: Camera = cce.Camera.camera;
            editorCamera.cameraType = this.targetCamera.cameraType
            editorCamera.fov = this.targetCamera.fov
            editorCamera.far = this.targetCamera.far
            editorCamera.orthoHeight = this.targetCamera.orthoHeight
            editorCamera.node.worldPosition = this.targetCamera.node.worldPosition
            editorCamera.node.worldRotation = this.targetCamera.node.worldRotation
        }
    }
}
