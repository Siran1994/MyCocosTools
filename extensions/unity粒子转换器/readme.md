### DESC
```
1. 将unity的预制体保存格式改为文本格式：
    Edit -> Project Setting -> Editor，把Asset Serialization的Mode改成Force Text

2. 将一个unity节点保存为预制体，节点上可带有3d粒子组件，可拥有子节点，子节点也可带有3d粒子组件。

3. 通过本插件内的【u3d粒子转换】，选择那个预制体文件，点击【创建creator粒子】，
    便可得到对应的节点树，且同时创建节点上的3d粒子组件。

4. 在创建过程中，如果无任何错误，creator控制台最后输出【plz set ParticleSystemRenderer】
    此提示，表示所有的节点已经创建完毕，对应的粒子组件信息也解析完毕，但是最后一步，需要你自行创建粒子材质，
    提供给粒子组件使用，粒子的渲染模块内，数据已经同步，但是对应的材质、模型等，需要拖拽引用上去。
```