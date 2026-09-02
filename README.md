# MyCocosTools - Cocos Creator 3.x 综合游戏开发框架与工具箱

[![Cocos Creator](https://img.shields.io/badge/Cocos%20Creator-3.7.2-brightgreen.svg)](https://www.cocos.com/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%204.x-blue.svg)](https://www.typescriptlang.org/)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20WeChat%20%7C%20ByteDance%20%7C%20Android%20%7C%20iOS-orange.svg)]()

`MyCocosTools` 是一套专为 **Cocos Creator 3.7.2+** 打造的企业级游戏开发框架、常用玩法模块与编辑器插件工具箱。集成了成熟的单例管理系统、UI/面板框架、3D NavMesh 寻路、反向动力学 (IK)、多语言、虚拟摇杆、动效表现库以及 11 款开箱即用的编辑器效率扩展，帮助开发者大幅缩短中小型 2D/3D 游戏开发周期。

---

## 目录

- [✨ 核心特性亮点](#-核心特性亮点)
- [🛠 技术栈与运行环境](#-技术栈与运行环境)
- [📁 项目目录结构](#-项目目录结构)
- [🧩 编辑器扩展一览 (Extensions)](#-编辑器扩展一览-extensions)
- [🏛 运行时核心框架模块 (Runtime Architecture)](#-运行时核心框架模块-runtime-architecture)
  - [1. 核心管理体系 (Managers)](#1-核心管理体系-managers)
  - [2. UI 与面板体系 (UI & Panels)](#2-ui-与面板体系-ui--panels)
  - [3. 3D 寻路、物理与控制 (Navigation, IK & Role)](#3-3d-寻路物理与控制-navigation-ik--role)
  - [4. 动画表现与特效 (Animation & Visuals)](#4-动画表现与特效-animation--visuals)
  - [5. 数据、配置与加解密 (Data, CSV & Crypto)](#5-数据配置与加解密-data-csv--crypto)
  - [6. 网络与跨平台支持 (Network & Platforms)](#6-网络与跨平台支持-network--platforms)
  - [7. 常用工具集 (Utils & Tools)](#7-常用工具集-utils--tools)
- [🚀 快速上手指南 (Quick Start)](#-快速上手指南-quick-start)
  - [初始化与加载流程](#初始化与加载流程)
  - [新建 UI 面板范例](#新建-ui-面板范例)
  - [Excel 导表与常量生成](#excel-导表与常量生成)
- [⌨️ 常用快捷键汇总](#️-常用快捷键汇总)
- [📝 许可证与鸣谢](#-许可证与鸣谢)

---

## ✨ 核心特性亮点

- **⚡ 高效编辑器工作流**：内置项目结构格式化、Excel 导表、自动生成常量、UI 自动绑定、Monaco 内置代码编辑、全局快捷搜索 (F1)、资源引用反查 (F6)、资源大小/冗余检测清理 (F4/F5)、Unity 3D 粒子转换、中文字体子集化压缩等。
- **🏛 结构清晰的单例框架**：包含 UI、资源 (Bundle/Prefab)、音频、对象池、事件消息总线、新手引导、红点系统、多平台 SDK、数据加密持久化等单例管理器。
- **🎮 丰富的 2D / 3D 玩法组件**：
  - **3D NavMesh 寻路**：基于 RecastNavigation 的 3D 网格自动烘焙、动态寻路与障碍规避。
  - **反向动力学 (IK)**：两骨骼 3D Two-Bone IK 结算系统与姿态变换。
  - **角色控制器**：第一人称/第三人称相机跟随、平滑虚拟摇杆、刚体角色移动。
  - **物理与弹道**：3D 抛物线发射计算 (Cannon/ProjectileMath)、布娃娃系统 (Ragdoll)。
- **🎨 极佳的视觉与动效封装**：DOTween 风格动画封装、贝塞尔曲线 2D/3D 可视化路径、武器运动拖尾、金币/星光飞行动画、战斗浮动飘字、震屏效果、场景转场过渡。
- **🌐 国际化与全平台适配**：内置 i18n 文本与图片本地化组件；全屏安全区与多机型自动适配 (`FitUI` / `PageAdapter`)。

---

## 🛠 技术栈与运行环境

- **引擎版本**：Cocos Creator `>= 3.7.2`
- **编程语言**：TypeScript 4.x
- **目标平台**：Web (H5) / 微信小游戏 / 抖音小游戏 / iOS / Android

---

## 📁 项目目录结构

```text
MyCocosTools/
├── assets/                           # 游戏工程主资源目录
│   ├── Init/                         # 启动与核心业务层
│   │   ├── Init.scene                # 初始化加载场景
│   │   ├── initui/                   # 初始化 UI 资源
│   │   └── script/                   # 核心脚本库
│   │       ├── ai/                   # AI 逻辑、有限状态机 (FSM)、战斗血条、子弹
│   │       ├── animation/            # 动效库 (DOTween/飘字/震屏/飞金币/序列帧)
│   │       ├── BezierTool/           # 2D/3D 贝塞尔曲线工具与 Demo
│   │       ├── camera/               # 相机管理、跟随、震动、自由漫游相机
│   │       ├── csv/                  # CSV 配置解析与读取管理
│   │       ├── data/                 # 全局数据模型、配置常量、本地持久化
│   │       ├── dragtool/             # UI 拖拽组件、圆角渲染 Assembler
│   │       ├── encryption/           # CryptoJS 数据加密解密
│   │       ├── game/                 # 游戏主关卡、Boss、路线控制
│   │       ├── i18n/                 # 多语言国际化 (LocalizedLabel / LocalizedSprite)
│   │       ├── ik/                   # 3D 两骨骼反向动力学 (Two-Bone IK)
│   │       ├── init/                 # 游戏启动入口 (Init.ts) 与 Loading 进度条
│   │       ├── item/                 # 关卡通用物件 (宝箱/陷阱/道具/指示牌)
│   │       ├── JoyStick/             # 虚拟摇杆与第三人称角色控制器
│   │       ├── lib/ & libs/          # 第三方库与类型定义 (BigNumber, JSZip)
│   │       ├── manager/              # 核心框架单例管理器集合
│   │       ├── navline/              # 3D 寻路导航指示线
│   │       ├── network/              # HTTP 请求与 WebSocket 网络通信
│   │       ├── other/                # 辅助管理 (设备/震动/页面/日志/存储)
│   │       ├── panel/                # UI 基础面板基类及各业务面板 (主页/战斗/结算/抽奖等)
│   │       ├── parabola/             # 3D 抛物线/弹道计算工具与发射器
│   │       ├── pr转场/                # 场景过渡转场效果
│   │       ├── rogdall/              # 3D 布娃娃物理模拟系统
│   │       ├── role/                 # 角色控制器与刚体移动
│   │       ├── shop/ & shopList/     # 商城系统与高性能滚动卡片列表/对象池
│   │       ├── tip/                  # Toast 飘字与战斗文字提示
│   │       ├── tool/                 # 通用工具函数 (适配/装饰器/单例/长按/静态合批等)
│   │       ├── trail/                # 3D 运动拖尾系统 (TrailRenderer)
│   │       └── tween/                # 缓动扩展工具库
│   ├── bundle/                       # 主资源 Bundle (模型/UI/材质/Shader/音效/预制体)
│   │   ├── game.scene                # 核心玩法演示场景
│   │   ├── ani/                      # 动画资源
│   │   ├── audio/                    # 背景音乐与音效
│   │   ├── effect/                   # 特效资源
│   │   ├── font/                     # 字体资源
│   │   ├── model/                    # 3D 模型与网格
│   │   ├── prefab/                   # UI 与游戏预制体
│   │   ├── shader/                   # 自定义 Shader
│   │   └── ui/                       # UI 图集与贴图
│   └── carlosyzy/                    # 3D 导航寻路模块
│       └── nav-mesh/                 # RecastNavigation 导航网格组件
├── extensions/                       # 编辑器扩展插件 (11款)
│   ├── carlosyzy_navmesh/            # 3D 导航网格烘焙扩展
│   ├── Images Optimize(free)/        # 图片压缩优化插件
│   ├── MilesEditorTool/              # 目录格式化、Excel 导表、常量生成工具
│   ├── mini-font/                    # 中文字体子集化精简工具
│   ├── mytools/                      # 自定义编辑器拓展
│   ├── Quick Editor/                 # 内置 Monaco 代码/文件编辑器与彩虹缩进
│   ├── Quick Finder/                 # 全局资源与节点快速搜索器 (F1)
│   ├── Standard Calculator/          # 编辑器内嵌计算器
│   ├── unity粒子转换器/              # Unity 3D 粒子系统转换适配工具
│   ├── 引用查找器3.x/                # 资源引用/依赖反向查找器 (F6)
│   └── 资源优化助手/                  # 资源体积分析与未引用冗余资源清理 (F4/F5)
├── settings/                         # 项目设置配置
└── tsconfig.json                     # TypeScript 编译配置
```

---

## 🧩 编辑器扩展一览 (Extensions)

项目在 `extensions/` 目录下预置了 11 个提高开发效率的编辑器插件：

| 插件名称 | 快捷键 | 菜单路径 | 主要功能与用途 |
| :--- | :--- | :--- | :--- |
| **Quick Finder** | `F1` | 扩展 -> Quick Finder | **全局快速查找**：秒级搜索场景节点、资源文件、TS 脚本并快速定位打开。 |
| **引用查找器 3.x** | `F6` | 扩展 -> 引用查找器 | **资源引用反查**：快速查找选中资源被哪些场景、Prefab、材质所引用，防止误删。 |
| **资源优化助手** | `F4` (占用体积)<br>`F5` (未引用检测)<br>`F6` (面板) | 扩展 -> 资源优化助手 | **体积优化与冗余清理**：分析工程中大体积资源占比，精准扫描未被使用的废弃资源并支持一键清理。 |
| **MilesEditorTool** | `Ctrl + Shift + L` (导表)<br>`Shift + G` (生成常量) | 顶部菜单 -> MTools | **工程工具链**：一键格式化目录结构、Excel 自动导出为配置数据、自动生成常用常量定义、UI 自动绑定。 |
| **Quick Editor** | - | 扩展 -> Quick Editor | **内置轻量编辑器**：在 Cocos Creator 内嵌 Monaco Editor 代码编辑器，支持语法高亮与彩虹缩进。 |
| **carlosyzy_navmesh**| - | 扩展 -> NavMesh | **3D 寻路网格构建**：可视化生成并导出 3D Recast 寻路导航网格数据。 |
| **mini-font** | - | 扩展 -> mini-font | **中文字体精简**：提取项目中使用的中文字符，将几十 MB 的中文字体压缩裁剪至几十 KB。 |
| **Images Optimize** | - | 扩展 -> Images Optimize | **图片压缩优化**：批量压缩 PNG/JPG 纹理贴图，降低包体体积与显存占用。 |
| **unity粒子转换器** | - | 扩展 -> unity粒子转换器 | **Unity 粒子导入**：将 Unity 导出的粒子参数转换导入为 Cocos Creator 3.x 粒子。 |
| **Standard Calculator**| - | 扩展 -> Calculator | **标准计算器**：方便在编辑器内快速计算坐标、尺寸与缩放参数。 |
| **mytools** | - | 顶部菜单 -> 工具箱 | **自定义工具**：包含游戏测试数据清理等扩展。 |

---

## 🏛 运行时核心框架模块 (Runtime Architecture)

### 1. 核心管理体系 (Managers)

所有管理器均统一采用单例模式设计（继承自 `Singleton` 或通过 `Instance` 访问），位于 `assets/Init/script/manager/`：

- **`UiManager`**：全生命周期的 UI 栈与弹窗管理，负责主界面、战斗界面、设置、签到、抽奖、商城等面板的打开/关闭/层级调度。
- **`ResMgr` & `AssetManager`**：Asset Bundle 异步加载、Prefab 动态加载与释放、远程资源缓存。
- **`PrefabManager`**：预制体集中管理，支持按模块分类别名预加载与动态实例化。
- **`AudioMgr` & `AudioManager`**：BGM 与 Sound 音效独立通道控制，支持音量调节、静音开关、本地持久化状态保存。
- **`PoolManager`**：通用节点对象池，高效复用高频生成的子弹、金币、特效及掉落物节点。
- **`Messager`**：全局事件发布/订阅总线（`Messager.on`, `Messager.emit`, `Messager.off`），解耦模块间通信。
- **`PlatformMgr`**：多平台运行环境识别与 SDK 适配（微信小游戏、抖音字节跳动小游戏、Web、Native 等）。
- **`RedPointManager`**：红点提示系统，支持树状节点红点关联与状态动态刷新。
- **`GuideManager`**：新手引导状态机驱动，支持步骤高亮遮罩与点击引导。
- **`JsonManager` & `TextAssetManager`**：JSON / 文本配置文件快速解析与键值查询。
- **`TipManager`**：全局轻量 Toast 飘字与居中浮窗提示。

### 2. UI 与面板体系 (UI & Panels)

- **`BasePanel` (`assets/Init/script/panel/BasePanel.ts`)**：
  - 提供统一的面板打开/关闭动画（缩放淡入淡出、移动滑入）。
  - 提供 `show()`, `hide()`, `init()`, `onShow()`, `onHide()` 标准生命周期回调。
- **预置常用业务面板**：
  - `MainPanel`（主主页大厅）
  - `GamePanel` / `FightPanel`（战斗玩法与 HUD）
  - `ShopPanel` / `ShopList` / `ScrollCardList`（虚拟滚动抽卡与道具商城）
  - `SignPanel`（七日签到系统）
  - `DrawPanel`（幸运抽奖/转盘）
  - `SettingPanel`（音效/音乐/震动设置）
  - `RewardPanel` / `FinishPanel` / `FailedPanel`（结算、奖励与通关/失败界面）
  - `TryPanel` / `FreeTryPanel` / `ClipPanel` / `SelectPanel`（皮肤试用与关卡选择）

### 3. 3D 寻路、物理与控制 (Navigation, IK & Role)

- **3D NavMesh 寻路系统 (`assets/carlosyzy/nav-mesh/`)**：
  - 基于 `recast.js` 移植，支持 3D 场景多边形网格寻路、障碍规避与路点平滑计算。
  - `NavLineComp`：实时绘制 3D 寻路指引线。
- **反向动力学 (IK) (`assets/Init/script/ik/`)**：
  - `TwoBoneIK`：3D 角色双骨骼反向动力学解算，适用于手部抓取、脚部地面自适应对齐。
- **虚拟摇杆与角色相机 (`assets/Init/script/JoyStick/` & `role/`)**：
  - `UI_Joystick`：触控虚拟摇杆组件，支持动态跟随与固定摇杆模式。
  - `CharacterMovement` / `PlayerCtrl` / `rigidCharacterController`：3D 角色移动、跳跃、转向与物理刚体结合控制器。
  - `ThirdPersonCamera` / `FollowTarget` / `FreeCamera`：第三人称视角跟随、自由漫游视角与第一人称视角控制。
- **3D 抛物线弹道计算 (`assets/Init/script/parabola/`)**：
  - `Cannon` / `ProjectileMath` / `VectorUtil`：基于初速度、重力加速度与发射角精准预测或模拟 3D 炮弹抛物线轨迹。
- **3D 布娃娃系统 (`assets/Init/script/rogdall/`)**：
  - 角色击飞/阵亡时动态切换为物理刚体关节模拟，表现逼真的倒地布娃娃效果。

### 4. 动画表现与特效 (Animation & Visuals)

- **`DOTweenAnimation` & `TweeTool`**：流式链式调用的缓动动效封装，支持位移、缩放、旋转、透明度、数字滚动与曲线插值。
- **`CoinFly` & `StarFly`**：金币/钻石/星星飞向指定 UI 收集目标点的曲线动画与音效触发。
- **`BloodAni` & `fightTip`**：战斗伤害数字跳字、暴击飘字、受击抖动与血条平滑扣减。
- **`CameraShake` & `ShakeEffect`**：相机与节点屏幕震动效果（支持衰减、频率与方向设置）。
- **`MotionTrail` & `TrailManager`**：3D 武器挥动刀光/角色移动 CPU 渲染拖尾组件。
- **`Bezier` & `Bezier3d` (`assets/Init/script/BezierTool/`)**：2D/3D 贝塞尔曲线计算、路径绘制与沿着曲线移动动画。
- **`ChangeEffect` (`assets/Init/script/pr转场/`)**：黑屏渐变、百叶窗、圆形遮罩等屏幕转场过渡特效。

### 5. 数据、配置与加解密 (Data, CSV & Crypto)

- **`GameData` (`assets/Init/script/data/GameData.ts`)**：全局运行时数据中心，单例维护玩家金币、钻石、关卡进度与皮肤解锁状态。
- **`PlayerPrefs` (`assets/Init/script/data/PlayerPrefs.ts`)**：封装本地存储，支持数据默认值、字符串、数值、对象序列化。
- **`CryptoJS` (`assets/Init/script/encryption/`)**：AES / MD5 / Base64 数据加解密工具，保护敏感存档与网络通信数据。
- **`CsvManager` (`assets/Init/script/csv/CsvManager.ts`)**：支持运行时解析与读取本地 CSV 格式数据表。

### 6. 网络与跨平台支持 (Network & Platforms)

- **`HttpRequest` (`assets/Init/script/network/HttpRequest.ts`)**：Promise 封装的 GET / POST 网络请求库，支持超时与错误重试。
- **`SocketConnect` (`assets/Init/script/network/SocketConnect.ts`)**：WebSocket 长连接封装，支持心跳保活、断线重连与二进制数据通信。
- **`PlatformMgr` (`assets/Init/script/manager/PlatformMgr.ts`)**：全平台环境判断、小游戏激励视频广告、插屏广告、横幅广告、震动接口统一抽象。
- **`LocalizedManager` (`assets/Init/script/i18n/`)**：多语言文本 (`LocalizedLabel`) 与图片 (`LocalizedSprite`) 动态一键切换。

### 7. 常用工具集 (Utils & Tools)

- **`FitUI` / `PageAdapter`**：多分辨率全屏适配、刘海屏/打孔屏安全区自适应。
- **`EraserTool`**：基于 RenderTexture 的橡皮擦/刮刮乐涂抹擦除组件。
- **`LongTouch`**：长按触发事件组件（可配置长按触发时延与连续触发间隔）。
- **`SwipeRotate`**：单指滑动拖拽旋转 3D 物体模型。
- **`SpineTool`**：Spine 骨骼动画快捷播放、插槽替换与监听封装。
- **`staticBatch`**：3D 静态网格自动合批合并优化，降低 DrawCall。
- **`DateUtils`**：时间戳格式化、倒计时格式化（如 `hh:mm:ss`）。
- **`Decorator`**：TypeScript 装饰器库（支持方法防抖 `debounce`、节流 `throttle`、日志打印等）。

---

## 🚀 快速上手指南 (Quick Start)

### 初始化与加载流程

1. 打开项目场景 `assets/Init/Init.scene`。
2. 场景挂载了 `Init.ts`，主流程会自动执行以下步骤：
   ```typescript
   // 1. 初始化本地数据与持久化配置
   GameData.initData();

   // 2. 异步加载主 Bundle (Base/Monster) 及常用预制体
   await ResMgr.loadBundle(Config.BundleName.Base, () => {
       PrefabManager.loadPrefab(Config.BundleName.Base, 'Lv', PrefabManager.Path.Lv, () => {
           // 3. 更新 Loading 进度条
           this.loader.showProgress('base', () => {
               // 4. 初始化游戏主逻辑与平台环境
               GameManager.Instance.init();
               PlatformMgr.Instance.getCurrentPlatform();
           });
       });
   });
   ```

### 新建 UI 面板范例

1. 在 `assets/Init/script/panel/` 下新建面板类并继承 `BasePanel`：
   ```typescript
   import { _decorator } from 'cc';
   import { BasePanel } from './BasePanel';
   const { ccclass, property } = _decorator;

   @ccclass('MyCustomPanel')
   export class MyCustomPanel extends BasePanel {
       protected onShow(): void {
           // 面板打开时的初始化逻辑
       }

       protected onHide(): void {
           // 面板关闭时的清理逻辑
       }

       public onCloseBtnClicked(): void {
           this.hide();
       }
   }
   ```
2. 在 `UiManager.ts` 中注册并在需要时调用 `UiManager.Instance.myCustomPanel.show()`。

### Excel 导表与常量生成

1. 使用快捷键 `Ctrl + Shift + L` 或点击顶部菜单 `MTools -> 导表`。
2. 插件会自动读取配置目录下的 Excel 表格并生成对应的配置与 TypeScript 类型。
3. 点击 `MTools -> 生成常量`（快捷键 `Shift + G`）生成常量枚举。

---

## ⌨️ 常用快捷键汇总

| 快捷键 | 作用 | 对应插件 / 模块 |
| :--- | :--- | :--- |
| `F1` | 打开全局快速查找面板（节点/资源/脚本） | Quick Finder |
| `F4` | 检测资源占用空间排行 | 资源优化助手 |
| `F5` | 检测工程中未引用的冗余资源 | 资源优化助手 |
| `F6` | 打开资源优化助手设置面板 / 查找当前选中资源引用 | 资源优化助手 / 引用查找器 |
| `Ctrl + Shift + L` | 一键执行 Excel 导表 | MilesEditorTool |
| `Shift + G` | 一键自动生成常量代码 | MilesEditorTool |

---

## 📝 许可证与鸣谢

本项目仅供学习与游戏开发使用。部分第三方开源插件与库的版权归原作者所有：
- **ccc-references-finder**: 原作者 [陈皮皮 (ifaswind)](https://gitee.com/ifaswind/ccc-references-finder)
- **RecastNavigation**: 导航寻路模块
- **CryptoJS** & **BigNumber**
