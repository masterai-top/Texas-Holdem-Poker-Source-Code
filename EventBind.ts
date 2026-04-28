import { Component, Game, Prefab, game } from "cc";
import EventMgr from "../Frameworks/Manager/EventMgr";
import { GAME_EVENT, NET_EVENT, SYS_EVENT } from "./EventDefine";
import { IToastData, Toast } from "./Comm/Toast";
import { Alert, IAlertData } from "./Comm/Alert";
import { BundleEnum, RoomTypeEnum, SceneEnum } from "./Const";
import { IWinParam, UIMgr } from "../Frameworks/Manager/UIMgr";
import { AlertLayer, GameApp } from "./GameApp";
import { LoginProto, UserInfoProto, UserStateProto, XGameComm, XGameHttp, XGameMTT, XGameProto, XGameRetCode } from "pb";
import LanguageMgr from "../Language/LanguageMgr";
import { GameLoading } from "./GameLoading";
import AccountModel from "../Frameworks/Model/AccountModel";
import ProtoMgr from "../Frameworks/Manager/ProtoMgr";
import HttpMgr, { HttpUrlEnum } from "../Frameworks/Manager/HttpMgr";
import GlobalModel from "../Frameworks/Model/GlobalModel";
import { NetMgr } from "../Frameworks/Net/NetMgr";
import { Log } from "../Frameworks/Utils/Log";
import { TopMessageTip } from "./Comm/TopMessageTip";
import { BundleConfig } from "../Config/BundleConfig";
import { MsgHandlerModel } from "./MsgHandlerModel";
import { LiveMathDetail } from "./Hall/LiveMain/LiveMathDetail";
import { UILayer } from "../Lobby/GameApp";


export class EventBind extends Component {
    public static Instance: EventBind = null;

    protected onLoad(): void {
        if (EventBind.Instance === null) {
            EventBind.Instance = this;
        } else {
            this.destroy();
            return;
        }
        this.bindEventListener();
    }
    protected onDestroy(): void {
        EventMgr.Instance.off(GAME_EVENT.TOAST, this.onToast, this);
        EventMgr.Instance.off(GAME_EVENT.ALERT, this.onAlert, this);
        EventMgr.Instance.off(SYS_EVENT.CHANGE_SCENE, this.onChangeScene, this);
        EventMgr.Instance.off(SYS_EVENT.ERROR_CODE, this.onErrorTips, this);
        EventMgr.Instance.off(GAME_EVENT.LOGIN_SUCCEED, this.onLoginSucceed, this);

        EventMgr.Instance.off(NET_EVENT.ON_RECV_DATA, this.onRevNetData, this);
        EventMgr.Instance.off(NET_EVENT.ON_RECV_DATA, MsgHandlerModel.Instance.receiveMsg, this);

        EventMgr.Instance.off(GAME_EVENT.ON_CONTROL_MAIN_MASK, this.onControlMainMask, this);
    }
    private bindEventListener() {
        EventMgr.Instance.on(GAME_EVENT.TOAST, this.onToast, this);
        EventMgr.Instance.on(GAME_EVENT.ALERT, this.onAlert, this);
        EventMgr.Instance.on(SYS_EVENT.CHANGE_SCENE, this.onChangeScene, this);
        EventMgr.Instance.on(SYS_EVENT.ERROR_CODE, this.onErrorTips, this);
        EventMgr.Instance.on(GAME_EVENT.LOGIN_SUCCEED, this.onLoginSucceed, this);

        EventMgr.Instance.on(NET_EVENT.ON_RECV_DATA, this.onRevNetData, this);
        EventMgr.Instance.on(NET_EVENT.ON_RECV_DATA, MsgHandlerModel.Instance.receiveMsg, this);

        EventMgr.Instance.on(GAME_EVENT.ON_CONTROL_MAIN_MASK, this.onControlMainMask, this);

        game.on(Game.EVENT_HIDE, () => {
            console.log("游戏进入后台");
            EventMgr.Instance.emit(SYS_EVENT.ON_BACKEND);
        })
        game.on(Game.EVENT_SHOW, () => {
            console.log("重新返回游戏");
            EventMgr.Instance.emit(SYS_EVENT.ON_FRONT);
        })

    }

    onControlMainMask() {
        GameLoading.Instance.showLoading(false);
        setTimeout(() => {
            GameLoading.Instance.closeLoading();
        }, 210);
    }

    async onRevNetData(data_) {
        switch (data_.name) {
            case "USER_GET_USER_BASIC": {
                if (data_ && data_.data) {
                    let userInfo = data_.data;
                    AccountModel.Instance.initUserBaseInfo(userInfo);
                    EventMgr.Instance.emit(GAME_EVENT.REFRESH_USER_DATA);
                }
                break;
            }
            case "E_MSGID_LOGIN_HALL_RESP": {
                NetMgr.Instance.sendMsg({
                    vecMsgHead: [
                        XGameComm.TMsgHead.create({
                            nMsgID: XGameProto.ActionName.PUSH_GET_USER_STATE,
                            nMsgType: XGameComm.MSGTYPE.MSGTYPE_REQUEST,
                            serviceType: XGameComm.SERVICE_TYPE.SERVICE_TYPE_PUSH
                        })
                    ],
                    vecMsgData: [ProtoMgr.Instance.encode(UserStateProto.GetGameStateReq.create({ uid: AccountModel.Instance.uid }))]
                })
                break;
            }
            case "PUSH_GET_USER_STATE": {
                console.log("获取到玩家状态：", data_.data);
                this.onRequestUserData();
                if (data_ && data_.data) {
                    GlobalModel.Instance.roomId = data_.data.sRoomID;
                    GlobalModel.Instance.roomkey = data_.data.matchID;
                    if (RoomTypeEnum.mtt == GlobalModel.Instance.matchType) {
                        NetMgr.Instance.sendMsg({
                            vecMsgHead: [
                                XGameComm.TMsgHead.create({
                                    nMsgID: XGameMTT.E_MTT_MsgId.E_MTT_MSGID_LOGIN_ROOM_CS,
                                })
                            ],
                            sRoomID: data_.data.sRoomID,
                            vecMsgData: []
                        })
                    }
                } else {
                    EventMgr.Instance.emit(SYS_EVENT.CHANGE_SCENE, { name: SceneEnum.main });
                }
                break;
            }

            case "E_MTT_MSGID_LOGIN_ROOM_CS": {
                if (data_.data && 0 < data_.data.iResultID) {
                    EventMgr.Instance.emit(SYS_EVENT.ERROR_CODE, { code: data_.data.iResultID });
                } else {
                    if (RoomTypeEnum.mtt == GlobalModel.Instance.matchType) {
                        NetMgr.Instance.sendMsg({
                            vecMsgHead: [
                                XGameComm.TMsgHead.create({
                                    nMsgID: XGameMTT.E_MTT_MsgId.E_MTT_MSGID_ENTER_CS,
                                })
                            ],
                            sRoomID: GlobalModel.Instance.roomId,
                            vecMsgData: [ProtoMgr.Instance.encode(XGameMTT.TMTTMsgEnterRoom.create({
                                sRoomKey: GlobalModel.Instance.roomkey
                            }))]
                        })
                    }
                }
                break;
            }
            case "E_MTT_MSGID_ENTER_CS": {
                console.log("打印信息：", data_);
                if (data_.data && 0 < data_.data.iResultID) {
                    EventMgr.Instance.emit(SYS_EVENT.ERROR_CODE, { code: data_.data.iResultID });
                } else {
                    Log.trace("处理E_MTT_MSGID_ENTER_CS")
                    // end
                    if (data_.data.createOption && data_.data.createOption.iOnlineGame == 0) {
                        // 线下比赛，直接发送时间打开对应界面信息
                        let view = await UIMgr.Instance.showViewEx(BundleConfig.PrefabEnum.LiveMathDetail, data_.data);
                        view.addComponent(LiveMathDetail);
                    } else {
                        // 线上比赛，直接按照原来流程打开进游戏
                        EventMgr.Instance.emit(SYS_EVENT.CHANGE_SCENE, { name: SceneEnum.game, params: data_.data });
                    }

                }
                break;
            }
            // 比赛开始通知
            case "E_MTT_MSGID_GAME_BEGIN_2C": {
                // 大厅里面直接拉进房间，游戏界面需要退出游戏界面返回大厅再进入
                if (!data_.data && 0 == data_.data.iResultID) {
                    let view = await UIMgr.Instance.showViewEx(BundleConfig.PrefabEnum.TopMessageTip, data_.data);
                    view.addComponent(TopMessageTip);
                }
                break;
            }
        }
    }
    async onLoginSucceed(data_) {
        AccountModel.Instance.uid = data_.uid;
        AccountModel.Instance.token = data_.token;
        localStorage.setItem("GAME_USER_TOKEN", data_.token);
        localStorage.setItem("GAME_USER_ID", data_.uid);

        let message: XGameHttp.THttpPackage = XGameHttp.THttpPackage.create({
            iVer: 1,
            iSeq: 1,
            nMsgID: XGameProto.ActionName.LOGIN_USER_ROUNTER,
            vecData: ProtoMgr.Instance.encode(LoginProto.UserRounterInfoReq.create({
                reserve: 2 // h5填2
            }))
        })
        let tret: any = await HttpMgr.Instance.httpRequest(HttpUrlEnum.login, {
            method: "post",
            data: ProtoMgr.Instance.encode(message)
        })
        if (0 === tret.resultCode) {
            GlobalModel.Instance.serverIP = tret.routerAddr;
            GlobalModel.Instance.port = tret.routerPort;
            // 连接sokect
            await NetMgr.Instance.connectServer().then(() => {
                // 登录大厅
                NetMgr.Instance.sendMsg({
                    vecMsgHead: [
                        XGameComm.TMsgHead.create({
                            nMsgID: XGameComm.Eum_Comm_Msgid.E_MSGID_LOGIN_HALL_REQ,
                        })
                    ],
                    vecMsgData: [],
                })
            });
        }
    }

    private async onToast(data_: IToastData) {
        let view = await UIMgr.Instance.showDialogEx(BundleConfig.PrefabEnum.Toast, data_);
        view.addComponent(Toast);
    }
    private async onAlert(data_: IAlertData) {
        let view = await UIMgr.Instance.showDialogEx(BundleConfig.PrefabEnum.Alert, data_);
        view.addComponent(Alert);
    }
    private onErrorTips(data_) {
        let key = XGameRetCode.RetCodeEnum[data_.code];
        if (data_.flag) {
            EventMgr.Instance.emit(GAME_EVENT.ALERT, { msg: LanguageMgr.Instance.getLanguageShow(key) || `系统错误[${data_.code}]` });
        } else {
            EventMgr.Instance.emit(GAME_EVENT.TOAST, { msg: LanguageMgr.Instance.getLanguageShow(key) || `系统错误[${data_.code}]` });
        }

    }
    private async onChangeScene(data_) {
        let tflag: boolean = GameApp.Instance.curSceneName === null;
        // 记录当前场景,不存在就创建， 存在溢出之前的
        if (GameApp.Instance.curSceneName === data_["name"]) {
            return;
        }
        GameApp.Instance.curSceneName = data_["name"]
        GameLoading.Instance.showLoading();

        switch (data_["name"]) {
            case SceneEnum.login: {
                GameLoading.Instance.enterLogin(data_["params"], tflag);
                break;
            }
            case SceneEnum.main: {
                GameLoading.Instance.enterHall(data_["params"], tflag);
                break;
            }
            case SceneEnum.game: {
                GameLoading.Instance.enterGame(data_["params"], tflag);
                break;
            }
        }
    }
    private onRequestUserData(): void {
        NetMgr.Instance.sendMsg({
            vecMsgHead: [
                XGameComm.TMsgHead.create({
                    nMsgID: XGameProto.ActionName.USER_GET_USER_BASIC,
                    nMsgType: XGameComm.MSGTYPE.MSGTYPE_REQUEST,
                    serviceType: XGameComm.SERVICE_TYPE.SERVICE_TYPE_HALL
                })
            ],
            vecMsgData: [ProtoMgr.Instance.encode(UserInfoProto.GetUserBasicReq.create({ uid: AccountModel.Instance.uid }))]
        })
    }
    removeAlert() {
        AlertLayer.removeAllChildren();
    }

}
