import { Component, find, sys, Node, sp, SpriteAtlas, UITransform } from "cc";
import AccountModel from "../Frameworks/Model/AccountModel";
import { Log } from "../Frameworks/Utils/Log";
import { GameLoading } from "./GameLoading";
import { TimerMgr } from "../Frameworks/Manager/TimerMgr";
import GlobalModel from "../Frameworks/Model/GlobalModel";
import { GAME_EVENT, SYS_EVENT } from "./EventDefine";
import EventMgr from "../Frameworks/Manager/EventMgr";
import { ALERT_STYLE, BundleEnum, SceneEnum } from "./Const";
import { LoginProto, XGameHttp, XGameProto } from "pb";
import ProtoMgr from "../Frameworks/Manager/ProtoMgr";
import { Utils } from "../Frameworks/Utils/Utils";
import HttpMgr, { HttpUrlEnum } from "../Frameworks/Manager/HttpMgr";
import { EventBind } from "./EventBind";
import { ResMgr } from "../Frameworks/Manager/ResMgr";
import { BundleConfig } from "../Config/BundleConfig";
import { UIUtils } from "../Frameworks/Utils/UIUtils";


//应用
export let AppLayer: Node;//应用层
//游戏
export let GameLayer: Node;//游戏场景层
export let UILayer: Node;//游戏UI层
export let DialogLayer: Node;//游戏对话框层
export let AlertLayer: Node;//游戏提示层
export let LoadingLayer: Node;//游戏下载层

export class GameApp extends Component {

    public static Instance: GameApp = null;

    curScene: Node = null;
    curSceneName: string = null;

    private checkTimer: number = 0;

    protected onLoad(): void {
        if (GameApp.Instance === null) {
            GameApp.Instance = this;
        } else {
            this.destroy();
            return;
        }
        this.initView();
    }
    onDestroy() {
        TimerMgr.instance.Unschedule(this.checkTimer);
    }
    initView() {
        AppLayer = find("Canvas/AppLayer");
        GameLayer = find("Canvas/GameLayer");
        UILayer = find("Canvas/UILayer");
        DialogLayer = find("Canvas/DialogLayer");
        AlertLayer = find("Canvas/AlertLayer");
        LoadingLayer = find("Canvas/LoadingLayer");

        LoadingLayer.addComponent(GameLoading);
    }
    // 游戏入入口
    startGame() {
        Log.trace("是否是原生平台" + sys.isNative);
        Log.trace("是否是浏览器" + sys.isBrowser);
        Log.trace("是否是移动端平台" + sys.isMobile);
        Log.trace("是否是小端序" + sys.isLittleEndian);
        Log.trace("运行平台或环境" + sys.platform);
        Log.trace("运行环境的语言" + sys.language);
        Log.trace("运行环境的语言代码" + sys.languageCode);
        Log.trace("当前运行系统" + sys.os);
        Log.trace("运行系统版本字符串" + sys.osVersion);
        Log.trace("当前系统主版本" + sys.osMainVersion);
        Log.trace("当前运行的浏览器类型" + sys.browserType);
        Log.trace("获取当前设备的网络类型+ 如果网络类型无法获取，默认将返回 `sys.NetworkType.LAN`" + sys.getNetworkType());
        Log.trace("获取当前设备的电池电量，如果电量无法获取，默认将返回 1" + sys.getBatteryLevel());

        // 账号初始化
        AccountModel.Instance.init();
        this.checkAutoLogin();
        this.onRequestData();
    }
    
    /**
     * 用于请求配置的信息
     */
    async onRequestData() {
        HttpMgr.Instance.onGetNewsList(GlobalModel.Instance.linkMapUrl).then((data_: any) => {
            if (data_.data) {
                GlobalModel.Instance.iptIntroduceUrl = data_.data["about"];
                GlobalModel.Instance.useContentUrl = data_.data["service"];
                GlobalModel.Instance.stateMentUrl = data_.data["declaration"];
            }
        });

        GlobalModel.Instance.userHeadAtlas = await ResMgr.Instance.load<SpriteAtlas>(BundleEnum.Characters, SpriteAtlas, BundleConfig.AtlasEnum.HEAD_ICON);
        GlobalModel.Instance.mapsAtlas = await ResMgr.Instance.load<SpriteAtlas>(BundleEnum.Maps, SpriteAtlas, BundleConfig.AtlasEnum.MAPS);

        for (let i = 1; i < 5; i++) {
            GlobalModel.Instance.cardAtlas[i] = await ResMgr.Instance.load<SpriteAtlas>(BundleEnum.Cards, SpriteAtlas, "poker" + i);
        }

    }

    // 请求登录
    checkAutoLogin() {
        GlobalModel.Instance.isShowSafePWTip = true;
        if (null !== AccountModel.Instance.token) {
            let message: XGameHttp.THttpPackage = XGameHttp.THttpPackage.create({
                iVer: 1,
                iSeq: 1,
                nMsgID: XGameProto.ActionName.LOGIN_QUICK,
                vecData: ProtoMgr.Instance.encode(LoginProto.QuickLoginReq.create({
                    uid: AccountModel.Instance.uid,
                    loginType: 1,
                    token: AccountModel.Instance.token,
                    deviceID: Utils.getDeviceId()
                }))
            })
            HttpMgr.Instance.httpRequest(HttpUrlEnum.login, {
                method: "post",
                data: ProtoMgr.Instance.encode(message)
            }).then((data_: any) => {
                if (0 === data_.resultCode) {
                    EventMgr.Instance.emit(GAME_EVENT.LOGIN_SUCCEED, data_);
                } else {
                    // 登录失败进入大厅
                    AccountModel.Instance.token = null;
                    localStorage.removeItem("GAME_USER_TOKEN");
                    EventMgr.Instance.emit(SYS_EVENT.CHANGE_SCENE, { name: SceneEnum.main });
                }
            }).catch(e => {
                // 登录失败进入大厅
                AccountModel.Instance.token = null;
                localStorage.removeItem("GAME_USER_TOKEN");
                EventMgr.Instance.emit(SYS_EVENT.CHANGE_SCENE, { name: SceneEnum.main });
            })
        } else {
            EventMgr.Instance.emit(SYS_EVENT.CHANGE_SCENE, { name: SceneEnum.main });
        }
    }

    removeAlert() {
        EventBind.Instance.removeAlert();
    }

}
