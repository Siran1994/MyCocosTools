"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const config_1 = __importDefault(require("./config"));
const utils_1 = __importDefault(require("./common/utils"));
const log_1 = __importDefault(require("./common/log"));
var Fontmin = require('fontmin');
class default_1 {
    constructor(engine_version, path_input, path_scan, path_out) {
        this.text = "";
        log_1.default.log("start");
        log_1.default.log("cocos creator version " + engine_version);
        if (engine_version.search(/3.[0-9].[0-9]/) == 0) {
            engine_version = "3xx";
        }
        else if (engine_version.search(/2.[0-9].[0-9]/) == 0) {
            engine_version = "2xx";
        }
        else {
            throw Error(`This engine version is not supported. Please contact the developer`);
        }
        this.path_input = path_input;
        this.path_scan = path_scan;
        this.path_out = path_out;
        this.build();
    }
    async build() {
        const time = new Date().getTime();
        await new Promise((resolve, reject) => {
            this._on_char();
            resolve({});
        }).then(async () => {
            let files = utils_1.default.get_dir_all_file_ext(this.path_input, config_1.default.set_font_ext);
            for (let file of files) {
                await this._on_min(file, this.text);
            }
            log_1.default.warn("success time : " + (new Date().getTime() - time) + "ms");
            return true;
        }).catch((err) => {
            throw err;
        });
    }
    _on_char() {
        let files = utils_1.default.get_dir_all_file_ext(this.path_scan, config_1.default.set_scan_ext);
        let file_str = "";
        for (let file of files) {
            let file_ext = path.extname(file);
            let str = utils_1.default.read_file_toString(file);
            if (file_ext === ".js" || file_ext === ".ts") {
                str = utils_1.default.str_filter_notes(str);
            }
            file_str += str;
        }
        this.text = utils_1.default.str_unique(file_str);
        for (let i = 0; i <= 32; i++) {
            //过滤前32个无用的字符
            if (this.text.charCodeAt(i) >= 32) {
                this.text = this.text.substring(i);
                break;
            }
        }
        log_1.default.warn("number of characters scanned : " + this.text.length);
        log_1.default.warn(this.text);
    }
    async _on_min(file, text) {
        return new Promise((resolve, reject) => {
            const out = this.path_out || path.dirname(file);
            if (!text) {
                throw new Error("characters is empty");
            }
            log_1.default.warn("task start :" + file);
            log_1.default.log("out dir", out);
            const org_size = utils_1.default.get_file_size(file);
            var fontmin = new Fontmin()
                .use(Fontmin.glyph({
                // text: ` !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_\`abcdefghijklmnopqrstuvwxyz{|}~“”、。一七三上下不与且丢两个中串临为主举久义之乐乘也买了事二于云互五些交产享亮人仅今从他付代以们件价任份休优会传伸似但位低体余作你使例供依侧保信修倍倒候值做停傅储像允元充先免入全公共关其具典内册再写冲决况冷准减凑几凭出击函分切列则创初删判利到制刷刹刻前剩剪功加务动励勾包化区十升半协卓单南占卡即却历压原去参又及友双反发取受变口句只叭可台右号司各合同名后向吗否含听启告员周命和咨品响哥唯商喇嘛器回因围图圆圈在地场圾址均坐块垂垃型城域基堂填境增声处备复外多大天失头夹奖套女好如始婆子字存季它安完宏定宝实审客家容宽密寸对导封将小少尔尚尝就尺尾局层屋屏展属嵌工左差已币市布师希带帧帮常幕平并幸广序库应底店废度延建开异弃式引张弯弹强归当录形影往径得循微必快忽态性总息您情惜意感慢戏成我或战截戳户房所手才打托扣执批找技把抗护报抬抽拉拍拟拥择括拷持挂指按振换据授掉排接控推提搜摄摸撞播操擎支收改放效敌敏数整文斗断新方旋无日旧时明昨是昵显晃普景暂暗曲更替最月有朋服期未末本机杂权束条来板构析枚果某染查标栏树校样核根格栽框案档检概榜模横次款止正此步殊段毁每比毕毫民气水永求池汽沉沙没法注活测消添清渐渲游源满激火灯灰点然照父片版牌物特状独率玩环现理生用由申电男画界留略登白百的益监盖盘目直相看真知短石码砖础确碰示礼神票祸禁福离种秒秘积称移程空窗立竖站端笔笛符第等签算管箱米类粉精系素索累红级纬纵纹线组细终经绑结绘给络统继续维缓编缩缺网罗置群老考者而聊背胜能脚自至致般色节英范荐获菜蒙蓝藏虚行街补表被装西要覆见视览角解触言警计订认议讯记许设证识试话询该详语误说请读调象贝负败账货质购贴费资赖赚走赶起超越足跑距跟路跳踪身车转轮轴载较辆辑输边达过运近返还这进连迟迷追退送逆选透逐递通速造逻遍道遵避邀那部都配酒采释里重量金针钟钥钮钱钻银铺链销锁错键锯镜长门闭问间闹队防附际陆限除随隐隔雄集雨需静非面音页顶项顺须顾顿预领频题颜额风飞馈首马驶驻验高鸣黄默齿！（），：；？`,
                text: text,
                hinting: false
            }))
                .src(file)
                .dest(out);
            fontmin.run(function (err, files) {
                if (err) {
                    throw err;
                }
                const new_size = files[0].stat.size;
                log_1.default.warn((org_size / 1000).toFixed(1) + "kb >> " + (new_size / 1000).toFixed(1) + "kb >> " + (new_size / org_size * 100).toFixed(2) + "%");
                log_1.default.log("task end");
                resolve({});
            });
        });
    }
}
exports.default = default_1;
