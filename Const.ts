export const getObjType = (obj: Record<string, any>): any => {
    const toString = Object.prototype.toString;
    const map: Record<string, any> = {
        "[object Boolean]": "boolean",
        "[object Number]": "number",
        "[object String]": "string",
        "[object Function]": "function",
        "[object Array]": "array",
        "[object Date]": "date",
        "[object RegExp]": "regExp",
        "[object Undefined]": "undefined",
        "[object Null]": "null",
        "[object Object]": "object",
    };
    if (obj instanceof Element) {
        return "element";
    }
    return map[toString.call(obj)];
};

export const clone = (data: any) => {
    const type = getObjType(data);
    let obj: any;
    if (type === "array") {
        obj = [];
    } else if (type === "object") {
        obj = {};
    } else {
        // 不再具有下一层次
        return data;
    }
    if (type === "array") {
        const len = data.length;
        for (let i = 0; i < len; i++) {
            data[i] = (() => {
                if (data[i] === 0) {
                    return data[i];
                }
                return data[i];
            })();
            if (data[i]) {
                delete data[i].$parent;
            }
            obj.push(clone(data[i]));
        }
    } else if (type === "object") {
        for (const key in data) {
            if (data) {
                delete data.$parent;
            }
            obj[key] = clone(data[key]);
        }
    }
    return obj;
};


export enum SceneEnum {
    loading = "loading",
    login = "login",
    main = "main",
    game = "game",
}

export enum RegisterType {
    register = 0,                             // 注册
    reset_pwd,                                // 重置密码
    secondary_pwd,                            // 设置安全码
    reset_phone,                              // 修改手机号码
    set_phone,                                // 设置新的手机号码
}

export enum AdertsEnum {
    honor,                             // 荣誉展示
    eye_system,                        // 天眼系统
    notice,                            // 管理公告
    ipt_offline,                       // IPT线下比赛
}

// 获取验证码的方式
export enum VerificationCodeEnum {
    register = 0,                             // 注册
    reset_pwd,                                // 重置密码
    secondary_pwd,                            // 设置安全码
    reset_phone,                              // 修改手机号码
    set_phone,                                // 设置新的手机号码
}
export interface ISetVerificationCodeData {
    style: VerificationCodeEnum,
    buff?: Uint8Array,
    phone?: string;
    area?: number;
    code?: string;
}

export enum RoomTypeEnum {
    mtt = 0,
    sng,
}
export enum GameState {
    none = 0,
    sign_up = 1,
    playing = 2,
    knockout = 3
}

export enum BundleEnum {
    GUI = "GUI",
    Maps = "Maps",
    Characters = "Characters",
    Cards = "Cards",

    game = "game",
    hall = "hall",
    login = "login",
    comm = "comm",
}

//下注类型
export enum E_NN_ACT {
    NN_ACT_UNKNOWN = 0x0001,  //未知
    NN_ACT_FOLD = 0x0010,   //弃牌
    NN_ACT_PASS = 0x0020,   //过
    NN_ACT_FOLLOW = 0x0040,   //跟注
    NN_ACT_RAISE = 0x0080,   //加注
    NN_ACT_ALLIN = 0x0100,   //全下
    NN_ACT_SMALL_BLIND = 0x0200, //小盲
    NN_ACT_BIG_BLIND = 0x0400, //大盲
    NN_ACT_APPLY_PAO_MA = 0x0800, //申请跑马
    NN_ACT_AGREE_PAO_MA = 0x1000,  //同意跑马
    NN_ACT_REFUSE_PAO_MA = 0x2000, //拒绝跑马
    NN_ACT_CONTRAL_BLIND = 0x4000, //强制大肓
    NN_ACT_CATCH_BLIND = 0x8000,   //抓肓
};

// 游戏状态
export enum E_NN_STATE {
    NN_STATE_NONE = -1,
    NN_STATE_GAME_BEGIN = 0x0001,
    NN_STATE_FRONT_BET = 0x0002,
    NN_STATE_GAME_BANKER = 0x0003,
    NN_STATE_HD_CARD = 0x0004,
    NN_STATE_COMMON_CARD = 0x0005,
    NN_STATE_TURN_CARD = 0x0006,
    NN_STATE_RIVER_CARD = 0x0007,
    NN_STATE_GAME_END = 0x0008,
    NN_STATE_INSURE_TURN = 0x0009,   // 转牌圈保险  // 为了不打乱原来的流程，且能快速回到原来的流程，所以额外提供两个买保险的阶段
    NN_STATE_INSURE_RIVER = 0x000A,   // 河牌圏保险
    NN_STATE_PAOMA = 0x000B,   // 跑马
};

export enum PRE_OPERATE {
    NONE = -1,
    PASS_FOLD,
    AUTO_PASS,
    FOLLOW,
    AUTO_FOLLOW
}

export const PROP_ID_NAME = {
    "1000": "IPT点",
    "1001": "比赛积分",
    "1002": "获奖积分",
    "2000": "初级比赛卡",
}

export const BLID_TYPE_DESC = {
    "0": "盲注", //盲注
    "1": "延迟报名", //延迟报名
    "2": "rebuy", //rebuy
    "3": "add-on", //add-on
    "4": "休息", //休息
}

//下注类型
export const E_NN_ACT_DESC = {
    "1": "未知",
    "16": "弃牌",
    "32": "过牌",
    "64": "跟注",
    "128": "加注",
    "256": "ALLIN",
    "512": "小盲",
    "1024": "大盲",
    "2048": "申请跑马",
    "4096": "同意跑马",
    "8192": "拒绝跑马",
    "16384": "强制大肓",
    "32768": "抓肓",
}

// 游戏状态
export enum E_MTT_STATUS {
    E_MTT_NONE = 0,
    E_MTT_WAIT,     //等待
    E_MTT_SIGNUP,   //报名中
    E_MTT_DOING,    //比赛中
}

export enum ALERT_STYLE {
    confirm = 0,
    confirm_cancel
}

export const PROP_CONFIG = [
    { id: 5001, type: 4, name: "互动道具", icon: "img_daoju01", des: "互动道具", cansend: 1, cantransation: 0, anim: "meiguihua" },
    { id: 5002, type: 4, name: "互动道具", icon: "img_daoju02", des: "互动道具", cansend: 1, cantransation: 0, anim: "dianzan" },
    { id: 5003, type: 4, name: "互动道具", icon: "img_daoju03", des: "互动道具", cansend: 1, cantransation: 0, anim: "pijiu" },
    { id: 5004, type: 4, name: "互动道具", icon: "img_daoju04", des: "互动道具", cansend: 1, cantransation: 0, anim: "fanqie" },
    { id: 5005, type: 4, name: "互动道具", icon: "img_daoju05", des: "互动道具", cansend: 1, cantransation: 0, anim: "shuitong" },

    { id: 5006, type: 4, name: "互动道具", icon: "img_daoju06", des: "互动道具", cansend: 1, cantransation: 0, anim: "jidan" },
    { id: 5007, type: 4, name: "互动道具", icon: "img_daoju07", des: "互动道具", cansend: 1, cantransation: 0, anim: "bixin" },
    { id: 5008, type: 4, name: "互动道具", icon: "img_daoju08", des: "互动道具", cansend: 1, cantransation: 0, anim: "qinwen" },
    { id: 5009, type: 4, name: "互动道具", icon: "img_daoju09", des: "互动道具", cansend: 1, cantransation: 0, anim: "diaoyu" },
    { id: 5010, type: 4, name: "互动道具", icon: "img_daoju10", des: "互动道具", cansend: 1, cantransation: 0, anim: "zhuaji" },

    { id: 5011, type: 4, name: "互动道具", icon: "img_daoju11", des: "互动道具", cansend: 1, cantransation: 0, anim: "leichui" },
    { id: 5012, type: 4, name: "互动道具", icon: "img_daoju12", des: "互动道具", cansend: 1, cantransation: 0, anim: "guzhang" },// guzhang2 是对别人
    { id: 5013, type: 4, name: "互动道具", icon: "img_daoju13", des: "互动道具", cansend: 1, cantransation: 0, anim: "hecha" },
    { id: 5014, type: 4, name: "互动道具", icon: "img_daoju14", des: "互动道具", cansend: 1, cantransation: 0, anim: "motou" },
    { id: 5015, type: 4, name: "互动道具", icon: "img_daoju15", des: "互动道具", cansend: 1, cantransation: 0, anim: "shayu" },// shayu2 是对别人
]

export function getPropById(id_) {
    for (var i = 0; i < PROP_CONFIG.length; ++i) {
        if (id_ == PROP_CONFIG[i].id) {
            return PROP_CONFIG[i];
        }
    }
}