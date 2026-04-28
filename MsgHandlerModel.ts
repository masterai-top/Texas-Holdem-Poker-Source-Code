import { GameRecordProto, GlobalProto, HallProto, LoginProto, OrderProto, UserInfoProto, UserStateProto, XGameComm, XGameMTT, XGameProto } from 'pb';
import ProtoMgr from '../Frameworks/Manager/ProtoMgr';
import Singleton from '../Frameworks/Base/Singleton';
import AccountModel from '../Frameworks/Model/AccountModel';
import { Log } from '../Frameworks/Utils/Log';
import EventMgr from '../Frameworks/Manager/EventMgr';
import { GAME_EVENT, SYS_EVENT } from './EventDefine';
import LanguageMgr, { LanguageEnum } from '../Language/LanguageMgr';
import { ALERT_STYLE, SceneEnum } from './Const';
import { NetMgr } from '../Frameworks/Net/NetMgr';
import { LANGUAGE } from '../Language/zh';
import GlobalModel from '../Frameworks/Model/GlobalModel';
import { GameApp } from './GameApp';
import { UIMgr } from '../Frameworks/Manager/UIMgr';

export class MsgHandlerModel extends Singleton {
    static get Instance() {
        return super.GetInstance<MsgHandlerModel>();
    }

    getSendMsg(data_: any) {
        let info = data_.data;
        let msgId = data_.msgId;
        let vecMsgData = [];
        let serverType = XGameComm.SERVICE_TYPE.SERVICE_TYPE_HALL;
        console.log("发送：" + msgId + ", 参数：", info);
        switch (msgId) {
            case XGameProto.ActionName.USER_UPDATE_USER_INFO: {
                // 发送请求更新玩家信息协议
                vecMsgData = [ProtoMgr.Instance.encode(UserInfoProto.UpdateUserInfoReq.create({
                    updateInfo: [UserInfoProto.UpdateUserInfoReq.UpdateInfo.create({
                        colName: info.colName,
                        colValue: info.colValue
                    })]
                }))];
                break;
            }
            case XGameProto.ActionName.USER_LIST_USER_ADDRESS: {
                // 发送 获取地址列表协议
                break;
            }
            case XGameProto.ActionName.USER_ADD_USER_ADDRESS: {
                // 发送增加地址协议
                vecMsgData = [ProtoMgr.Instance.encode(UserInfoProto.AddUserAddressReq.create({
                    status: Number(info.status),
                    nickname: info.nickname.toString(),
                    telephone: info.telephone.toString(),
                    address: info.address.toString()
                }))];
                break;
            }
            case XGameProto.ActionName.USER_ADD_USER_ADDRESS: {
                // 发送增加地址协议
                vecMsgData = [ProtoMgr.Instance.encode(UserInfoProto.AddUserAddressReq.create({
                    status: Number(info.status),
                    nickname: info.nickname.toString(),
                    telephone: info.telephone.toString(),
                    address: info.address.toString()
                }))];
                break;
            }
            case XGameProto.ActionName.USER_DELETE_USER_ADDRESS: {
                // 发送删除地址协议
                vecMsgData = [ProtoMgr.Instance.encode(UserInfoProto.DeleteUserAddressReq.create({
                    gid: info.gid
                }))];
                break;
            }
            case XGameProto.ActionName.USER_UPDATE_USER_ADDRESS: {
                // 发送更新地址信息协议
                let outdata: UserInfoProto.UpdateUserAddressReq.UpdateData[] = [];
                for (let i = 0; i < info.updateData.length; i++) {
                    let item = info.updateData[i];
                    outdata.push(UserInfoProto.UpdateUserAddressReq.UpdateData.create({
                        colName: item.colName,
                        colValue: String(item.colValue)
                    }));
                }
                vecMsgData = [ProtoMgr.Instance.encode(UserInfoProto.UpdateUserAddressReq.create({
                    gid: info.gid,
                    updateData: outdata
                }))];
                break;
            }
            case XGameProto.ActionName.LOGIN_USER_PHONE_SEND_CODE_TCP: {
                // 发送注销的短信发送协议
                vecMsgData = [ProtoMgr.Instance.encode(LoginProto.UserPhoneSendCodeReq.create({
                    phone: `${info.area}-${info.phone}`,
                    type: info.type
                }))];
                serverType = XGameComm.SERVICE_TYPE.SERVICE_TYPE_LOGIN;
                break;
            }
            case XGameProto.ActionName.LOGIN_USER_PHONE_VERIFY_CODE_TCP: {
                // 发送验证的短信发送协议
                vecMsgData = [ProtoMgr.Instance.encode(LoginProto.UserPhoneVerifyCodeReq.create({
                    msgCode: info.msgCode,
                    type: info.type
                }))];
                serverType = XGameComm.SERVICE_TYPE.SERVICE_TYPE_LOGIN;
                break;
            }
            case XGameProto.ActionName.LOGIN_USER_PHONE_WRITE_OFF_TCP: {
                //发送注销协议，传三个参数, password, safePwd, msgCode
                vecMsgData = [ProtoMgr.Instance.encode(LoginProto.UserPhoneWriteOffReq.create({
                    password: info.password,
                    safePwd: info.safePwd,
                    msgCode: info.msgCode// 这里因为协议没有带这个参数，所以会导致接口返回错误：验证码错误，需要重新更新pb文件和生成协议
                }))];
                serverType = XGameComm.SERVICE_TYPE.SERVICE_TYPE_LOGIN;
                break;
            }
            case XGameProto.ActionName.GLOBAL_SEND_QUEST: {
                // 发送 反馈 协议
                vecMsgData = [ProtoMgr.Instance.encode(GlobalProto.SendQuestReq.create({
                    iType: info.iType,
                    sContent: info.sContent,
                    sLink: info.sLink,
                    lDate: info.lDate
                }))];
                serverType = XGameComm.SERVICE_TYPE.SERVICE_TYPE_GLOBAL;
                break;
            }
            case XGameProto.ActionName.LOGIN_LOGOUT_TCP: {
                // 发送登出协议
                vecMsgData = [ProtoMgr.Instance.encode(LoginProto.LogoutReq.create({
                    uid: Number(AccountModel.Instance.uid),
                }))];
                serverType = XGameComm.SERVICE_TYPE.SERVICE_TYPE_LOGIN;
                break;
            }
            case XGameProto.ActionName.LOGIN_USER_SET_SAFE_PWD_TCP: {
                // 发送修改安全码的协议
                vecMsgData = [ProtoMgr.Instance.encode(LoginProto.UserSetSafePwdReq.create({
                    safePwd: info.safePwd,
                }))];
                serverType = XGameComm.SERVICE_TYPE.SERVICE_TYPE_LOGIN;
                break;
            }
            case XGameProto.ActionName.USER_LIST_USER_PROPS: {
                // 发送请求卡包的协议
                vecMsgData = [ProtoMgr.Instance.encode(UserInfoProto.ListUserPropsReq.create({
                    iType: info.iType,
                }))];
                break;
            }
            case XGameProto.ActionName.GLOBAL_QUERY_MESSAGE: {
                // 发送请求消息的协议
                vecMsgData = [ProtoMgr.Instance.encode(GlobalProto.QueryMessageReq.create({
                    iType: info.iType,
                    iCurrentPage: info.iCurrentPage
                }))];
                serverType = XGameComm.SERVICE_TYPE.SERVICE_TYPE_GLOBAL;
                break;
            }
            case XGameProto.ActionName.GAME_RECORD_BRIEF_QUERY: {
                // 发送请求参赛记录的协议
                vecMsgData = [ProtoMgr.Instance.encode(GameRecordProto.QueryGameBriefReq.create({
                    iOnlineGame: info.iOnlineGame,
                    iCurrPage: info.iCurrPage,
                }))];
                serverType = XGameComm.SERVICE_TYPE.SERVICE_TYPE_RECORD;
                break;
            }
            case XGameProto.ActionName.GAME_RECORD_COLLECT_QUERY: {
                // 发送请求收藏记录的协议
                vecMsgData = [ProtoMgr.Instance.encode(GameRecordProto.QueryCollectGameReq.create({
                    iCurrPage: info.iCurrPage,
                }))];
                serverType = XGameComm.SERVICE_TYPE.SERVICE_TYPE_RECORD;
                break;
            }
            case XGameProto.ActionName.GAME_RECORD_HONOUR_RANK_QUERY: {
                // 发送请求荣誉展示的协议
                vecMsgData = [ProtoMgr.Instance.encode(GameRecordProto.QueryHonourRankReq.create({
                    iCurrPage: info.iCurrPage,
                    sFilter: info.sFilter,
                    iOnlineGame: info.iOnlineGame,
                }))];
                serverType = XGameComm.SERVICE_TYPE.SERVICE_TYPE_RECORD;
                break;
            }
            case XGameProto.ActionName.GAME_RECORD_USER_HONOUR_QUERY: {
                vecMsgData = [ProtoMgr.Instance.encode(GameRecordProto.QueryUserHonourReq.create({
                    iCurrPage: info.iCurrPage,
                    lPlayerID: info.lPlayerID,
                    iOnlineGame: info.iOnlineGame,
                }))];
                serverType = XGameComm.SERVICE_TYPE.SERVICE_TYPE_RECORD;
                break;
            }
            case XGameProto.ActionName.GAME_RECORD_CHEAT_QUERY: {
                vecMsgData = [ProtoMgr.Instance.encode(GameRecordProto.QueryCheatReq.create({
                    iCheatType: info.iCheatType,
                    iCurrPage: info.iCurrPage,
                    sFilter: info.sFilter,
                }))];
                serverType = XGameComm.SERVICE_TYPE.SERVICE_TYPE_RECORD;
                break;
            }
            case XGameProto.ActionName.GAME_RECORD_CHEAT_GAME_QUERY: {
                vecMsgData = [ProtoMgr.Instance.encode(GameRecordProto.QueryCheatGameReq.create({
                    iCheatType: info.iCheatType,
                    sCheatId: info.sCheatId,
                    iCurrPage: info.iCurrPage,
                }))];
                serverType = XGameComm.SERVICE_TYPE.SERVICE_TYPE_RECORD;
                break;
            }
            case XGameProto.ActionName.ORDRE_PRODUCT_LIST: {
                vecMsgData = [ProtoMgr.Instance.encode(OrderProto.OrderProductListReq.create({
                    eProductType: info.eProductType,
                }))];
                serverType = XGameComm.SERVICE_TYPE.SERVICE_TYPE_ORDER;
                break;
            }
            case XGameProto.ActionName.ORDRE_CREATE_ORDER: {
                vecMsgData = [ProtoMgr.Instance.encode(OrderProto.OrderCreateReq.create({
                    ePayType: info.ePayType,
                    sProductId: info.sProductId,
                    iProductCount: info.iProductCount,
                    iExchangeIndex: info.iExchangeIndex
                }))];
                serverType = XGameComm.SERVICE_TYPE.SERVICE_TYPE_ORDER;
                break;
            }
            case XGameProto.ActionName.ORDER_LIST_QUERY: {
                vecMsgData = [ProtoMgr.Instance.encode(OrderProto.OrderListQueryReq.create({
                    iPage: info.iPage,
                    ePayType: info.ePayType,
                }))];
                serverType = XGameComm.SERVICE_TYPE.SERVICE_TYPE_ORDER;
                break;
            }
            case XGameProto.ActionName.HALL_MATCH_ROOM_LIST: {
                vecMsgData = [ProtoMgr.Instance.encode(HallProto.MatchRoomListReq.create({
                    iPage: info.iPage,
                    onlineGame: info.onlineGame,
                    vecGameStatus: info.vecGameStatus
                }))];
                break;
            }
            case XGameProto.ActionName.USER_AUTH_SAFEPWD: {
                vecMsgData = [ProtoMgr.Instance.encode(UserInfoProto.AuthSafePwdReq.create({
                    sSafePwd: info.sSafePwd,
                }))];
                break;
            }
            case XGameProto.ActionName.LOGIN_USER_INIT_FACE_VERIFY_TCP: {
                vecMsgData = [ProtoMgr.Instance.encode(LoginProto.UserInitFaceVerifyReq.create({
                    sCertName: info.sCertName,
                    sCertNo: info.sCertNo,
                    sMetaInfo: info.sMetaInfo,
                    sReturnUrl: info.sReturnUrl
                }))];
                serverType = XGameComm.SERVICE_TYPE.SERVICE_TYPE_LOGIN;
                break;
            }
            case XGameProto.ActionName.LOGIN_USER_DESCRIBE_FACE_VERIFY_TCP: {
                vecMsgData = [ProtoMgr.Instance.encode(LoginProto.UserDescribeFaceVerifyReq.create({
                    sCertifyId: info.sCertifyId,
                }))];
                serverType = XGameComm.SERVICE_TYPE.SERVICE_TYPE_LOGIN;
                break;
            }
            case XGameProto.ActionName.GAME_RECORD_INFO_QUERY: {
                vecMsgData = [ProtoMgr.Instance.encode(GameRecordProto.QueryGameInfoReq.create({
                    sRoomIndex: info.sRoomIndex,
                    iCurrPage: info.iCurrPage,
                }))];
                serverType = XGameComm.SERVICE_TYPE.SERVICE_TYPE_RECORD;
                break;
            }
            case XGameProto.ActionName.USER_LIST_USER_BASIC: {
                vecMsgData = [ProtoMgr.Instance.encode(UserInfoProto.ListUserBasicReq.create({
                    uidList: info.uidList,
                }))];
                break;
            }
            case XGameProto.ActionName.GAME_RECORD_USER_OWN_QUERY: {
                vecMsgData = [ProtoMgr.Instance.encode(GameRecordProto.QueryUserOwnReq.create({
                    lStartTime: info.lStartTime,
                    lEndTime: info.lEndTime,
                }))];
                serverType = XGameComm.SERVICE_TYPE.SERVICE_TYPE_RECORD;
                break;
            }
            case XGameProto.ActionName.ORDRE_VERIFY_ORDER: {
                // let outdata = OrderProto.OrderInfo.create({
                //     sInOrderId: info.sInOrderId,
                //     ePayType: info.ePayType
                // });
                vecMsgData = [ProtoMgr.Instance.encode(OrderProto.OrderVerifyReq.create({
                    mOrderInfo: info
                }))];
                serverType = XGameComm.SERVICE_TYPE.SERVICE_TYPE_ORDER;
                break;
            }
            case XGameProto.ActionName.USER_UPDATE_USER_REMAKE: {
                vecMsgData = [ProtoMgr.Instance.encode(UserInfoProto.UpdateUserRemarkReq.create({
                    remarkUid: info.remarkUid,
                    sRemarkContent: info.sRemarkContent
                }))];
                break;
            }
        }
        MsgHandlerModel.Instance.sendMsgDetail(msgId, vecMsgData, serverType);
    }

    private sendMsgDetail(msgId, msgData = [], serviceType: XGameComm.SERVICE_TYPE = XGameComm.SERVICE_TYPE.SERVICE_TYPE_HALL) {
        NetMgr.Instance.sendMsg({
            vecMsgHead: [
                XGameComm.TMsgHead.create({
                    nMsgID: msgId,
                    nMsgType: XGameComm.MSGTYPE.MSGTYPE_REQUEST,
                    serviceType: serviceType
                })
            ],
            vecMsgData: msgData
        })
    }

    /**
     * 请求玩家的基本信息请求
     */
    requestUserBase(): void {
        MsgHandlerModel.Instance.sendMsgDetail(XGameProto.ActionName.USER_GET_USER_BASIC, [ProtoMgr.Instance.encode(UserInfoProto.GetUserBasicReq.create({ uid: AccountModel.Instance.uid }))]);
    }
    enterRoom() {

    }

    receiveMsg(data_: any) {
        Log.trace("msgHandlerModel 接收到的协议信息-> " + data_.name);
        Log.table(data_);
        switch (data_.name) {
            case "USER_UPDATE_USER_INFO": {
                // console.log("收到更新数据返回", data_.data);
                MsgHandlerModel.Instance.requestUserBase();
                break;
            }
            case "USER_LIST_USER_ADDRESS": {
                Log.trace("接收到地址列表信息:")
                // Log.table(data_.data)
                if (data_.data && data_.data.infos) {
                    AccountModel.Instance.initUserAddressInfo(data_.data.infos);
                    EventMgr.Instance.emit(GAME_EVENT.REFRESH_USER_ADDRESS_INFO);
                }
                break;
            }
            case "USER_ADD_USER_ADDRESS": {
                Log.trace("接收到新增地址的返回")
                AccountModel.Instance.addUserAddRessInfo(data_.data.info);
                EventMgr.Instance.emit(GAME_EVENT.REFRESH_USER_ADDRESS_INFO);
                break;
            }
            case "USER_UPDATE_USER_ADDRESS": {
                Log.trace("接收到更新地址的返回")
                AccountModel.Instance.updateUserAddRessInfo(data_.data);
                EventMgr.Instance.emit(GAME_EVENT.REFRESH_USER_ADDRESS_INFO);
                break;
            }
            case "USER_DELETE_USER_ADDRESS": {
                Log.trace("接收到删除地址的返回")
                AccountModel.Instance.delUserAddRessInfo(data_.data.gid);
                EventMgr.Instance.emit(GAME_EVENT.REFRESH_USER_ADDRESS_INFO);
                break;
            }
            // case "LOGIN_USER_PHONE_SEND_CODE_TCP": {
            //     Log.trace("收到发送成功信息的返回");
            //     if (data_.data) {
            //         if (data_.data.resultCode == 0) {
            //             EventMgr.Instance.emit(GAME_EVENT.TOAST, { msg: LanguageMgr.Instance.getLanguageShow(LanguageEnum.send_code_succeed) });
            //         } else {
            //             EventMgr.Instance.emit(SYS_EVENT.ERROR_CODE, { code: data_.data.resultCode });
            //         }
            //     }
            //     break;
            // }
            case "LOGIN_USER_PHONE_WRITE_OFF_TCP": {
                Log.trace("收到注销账号的返回");
                if (!data_.data) {
                    EventMgr.Instance.emit(GAME_EVENT.LOG_OFF_ACCOUNT_MESSAGE, 0);
                } else if (data_.data && data_.data.resultCode) {
                    EventMgr.Instance.emit(GAME_EVENT.LOG_OFF_ACCOUNT_MESSAGE, data_.data.resultCode);
                }
                break;
            }
            case "GLOBAL_SEND_QUEST": {
                Log.trace("收到反馈的返回");
                if (!data_.data) {
                    EventMgr.Instance.emit(GAME_EVENT.SEND_QUEST_MESSAGE, 0);
                } else if (data_.data && data_.data.resultCode) {
                    EventMgr.Instance.emit(GAME_EVENT.SEND_QUEST_MESSAGE, data_.data.resultCode);
                }
                break;
            }
            case "LOGIN_LOGOUT_TCP": {
                Log.trace("收到登出返回");
                if (!data_.data) {
                    AccountModel.Instance.token = null;
                    localStorage.removeItem("GAME_USER_TOKEN");
                    if (GameApp.Instance.curSceneName == SceneEnum.main) {
                        UIMgr.Instance.clearBaseView();
                        EventMgr.Instance.emit(GAME_EVENT.ON_CHANGE_MAIN_TAP, 0)
                    }
                    EventMgr.Instance.emit(SYS_EVENT.CHANGE_SCENE, { name: SceneEnum.main });
                    break;
                }
            }
            case "LOGIN_USER_SET_SAFE_PWD_TCP": {
                Log.trace("收到设置安全码返回");
                if (!data_.data) {
                    EventMgr.Instance.emit(GAME_EVENT.SEND_SET_SERPWD_MESSAGE, 0);
                } else if (data_.data && data_.data.resultCode) {
                    EventMgr.Instance.emit(GAME_EVENT.SEND_SET_SERPWD_MESSAGE, data_.data.resultCode);
                }
                MsgHandlerModel.Instance.requestUserBase();
                break;
            }
            case "USER_LIST_USER_PROPS": {
                Log.trace("收到卡包返回");
                EventMgr.Instance.emit(GAME_EVENT.ON_GET_CARDBAG_LIST_MESSAGE, data_.data);
                break;
            }
            case "GLOBAL_QUERY_MESSAGE": {
                Log.trace("收到消息列表返回");
                if (data_.data) {
                    EventMgr.Instance.emit(GAME_EVENT.ON_GET_MESSAGE_LIST, data_.data);
                }
                break;
            }
            case "GAME_RECORD_BRIEF_QUERY": {
                Log.trace("收到消息 参赛记录 返回");
                if (data_.data) {
                    EventMgr.Instance.emit(GAME_EVENT.ON_GET_BRIEF_MESSAGE, data_.data);
                }
                break;
            }
            case "GAME_RECORD_COLLECT_QUERY": {
                Log.trace("收到消息 收藏 返回");
                if (data_.data) {
                    EventMgr.Instance.emit(GAME_EVENT.ON_GET_SHOUCANG_MESSAGE, data_.data);
                }
                break;
            }
            case "GAME_RECORD_HONOUR_RANK_QUERY": {
                Log.trace("收到消息 荣誉展示 返回");
                if (data_.data) {
                    EventMgr.Instance.emit(GAME_EVENT.ON_GET_HONOR_MESSAGE, data_.data);
                }
                break;
            }
            case "GAME_RECORD_USER_HONOUR_QUERY": {
                Log.trace("收到消息 荣誉展示搜索用户 返回");
                Log.table(data_);
                if (data_.data) {
                    EventMgr.Instance.emit(GAME_EVENT.ON_GET_HONOR_USER_MESSAGE, data_.data);
                }
                break;
            }
            case "GAME_RECORD_CHEAT_QUERY": {
                Log.trace("收到消息 天眼系统--玩家 返回");
                Log.table(data_);
                if (data_.data) {
                    EventMgr.Instance.emit(GAME_EVENT.ON_GET_CHEAT_QUERY_MESSAGE, data_.data);
                }
                break;
            }
            case "GAME_RECORD_CHEAT_GAME_QUERY": {
                Log.trace("收到消息 天眼系统--牌局 返回");
                Log.table(data_);
                if (data_.data) {
                    EventMgr.Instance.emit(GAME_EVENT.ON_GET_CHEAT_QUERY_GAME_MESSAGE, data_.data);
                }
                break;
            }
            case "ORDRE_PRODUCT_LIST": {
                Log.trace("收到消息 商店 返回");
                Log.table(data_);
                if (data_.data) {
                    EventMgr.Instance.emit(GAME_EVENT.ON_GET_PRODUCT_LIST_MESSAGE, data_.data);
                }
                break;
            }
            case "ORDRE_CREATE_ORDER": {
                Log.trace("收到消息 商店创建订单 返回");
                Log.table(data_);
                if (data_.data) {
                    EventMgr.Instance.emit(GAME_EVENT.ON_CREATE_ORDER_MESSAGE, data_.data);
                }
                break;
            }
            case "PUSH_COIN_CHANGE": {
                Log.trace("收到消息 货币变更刷新 返回");
                MsgHandlerModel.Instance.requestUserBase();
                break;
            }
            case "PUSH_SERVER_CHANGE_NOTIFY": {
                Log.trace("收到消息 服务器改变通知 返回");
                // sint32 iNotifyType = 1; //提示编号 0; //默认, 1; //长时间没有操作游戏, 2; //当前服务处理维护中
                // sint32 iReturnLoginGUI = 2; //返回登录界面(1-返回，0-不返回)
                console.log("打印操作：", data_);
                let tipsStr = "长时间没有操作游戏";
                if (data_.data.iNotifyType == 2) tipsStr = "当前服务处理维护中";
                if (data_.data.iReturnLoginGUI == 1) {
                    EventMgr.Instance.emit(GAME_EVENT.ALERT, {
                        style: ALERT_STYLE.confirm, msg: tipsStr, confirmCb: () => {
                            if (GameApp.Instance.curSceneName == SceneEnum.main) {
                                UIMgr.Instance.clearBaseView();
                                EventMgr.Instance.emit(GAME_EVENT.ON_CHANGE_MAIN_TAP, 0)
                            }
                            EventMgr.Instance.emit(SYS_EVENT.CHANGE_SCENE, { name: SceneEnum.main });

                            AccountModel.Instance.token = null;
                            localStorage.removeItem("GAME_USER_TOKEN");
                        }
                    });

                }
                break;
            }
            case "PUSH_MULTIPLE_LOGIN": {
                EventMgr.Instance.emit(GAME_EVENT.ALERT, { msg: "您已在其他地方登录" })
                AccountModel.Instance.token = null;
                localStorage.removeItem("GAME_USER_TOKEN");
                EventMgr.Instance.emit(SYS_EVENT.CHANGE_SCENE, { name: SceneEnum.login });
                break;
            }
            case "PUSH_SERVER_UPDATE_NOTIFY": {
                Log.trace("收到消息 服务器维护 返回");
                // sint32 iMinutes = 1;//分钟数
                // EventMgr.Instance.emit(GAME_EVENT.ALERT, {
                //     style: ALERT_STYLE.confirm, msg: "服务器维护", confirmCb: () => {
                //         EventMgr.Instance.emit(SYS_EVENT.CHANGE_SCENE, { name: SceneEnum.login })
                //         AccountModel.Instance.token = null;
                //         localStorage.removeItem("GAME_USER_TOKEN");
                //     }
                // });
                // AccountModel.Instance.token = null;
                EventMgr.Instance.emit(GAME_EVENT.ALERT, { msg: "服务器维护" })
                AccountModel.Instance.token = null;
                localStorage.removeItem("GAME_USER_TOKEN");
                EventMgr.Instance.emit(SYS_EVENT.CHANGE_SCENE, { name: SceneEnum.login });
                break;
            }
            case "PUSH_ACCOUNT_FORBIDDEN_NOTIFY": {
                Log.trace("收到消息 账号冻结通知 返回");
                // bool bForbidden = 1; //是否冻结

                break;
            }
            case "ORDER_LIST_QUERY": {
                Log.trace("收到消息 查询支付记录 返回");
                EventMgr.Instance.emit(GAME_EVENT.ON_ORDER_LIST_QUERY_MESSAGE, data_.data);
                break;
            }
            case "HALL_MATCH_ROOM_LIST": {
                Log.trace("收到消息 大厅游戏房间列表 返回");
                EventMgr.Instance.emit(GAME_EVENT.ON_ROOM_LIST_MESSAGE, data_.data);
                break;
            }
            case "USER_AUTH_SAFEPWD": {
                Log.trace("收到消息 安全码验证 返回");
                if (!data_.data) {
                    EventMgr.Instance.emit(GAME_EVENT.ON_AUTH_SW_MESSAGE, 0);
                } else if (data_.data && data_.data.resultCode) {
                    EventMgr.Instance.emit(GAME_EVENT.ON_AUTH_SW_MESSAGE, data_.data.resultCode);
                    if (data_.data.resultCode > 0) {
                        EventMgr.Instance.emit(GAME_EVENT.TOAST, { msg: LANGUAGE.LOGIN_PHONE_SAFE_PWD_FAILED })
                    }
                }
                break;
            }
            case "LOGIN_USER_INIT_FACE_VERIFY_TCP": {
                Log.trace("收到 实名认证 返回");
                EventMgr.Instance.emit(GAME_EVENT.ON_USER_INIT_FACE_VERIFY_MESSAGE, data_.data);
                break;
            }
            case "GAME_RECORD_INFO_QUERY": {
                Log.trace("收到 牌局详情 返回");
                EventMgr.Instance.emit(GAME_EVENT.ON_GAME_RECORD_INFO_QUERY, data_.data);
                break;
            }
            case "LOGIN_USER_DESCRIBE_FACE_VERIFY_TCP": {
                Log.trace("收到 实名认证结果 返回");
                let resultCode = -1;
                if (!data_.data) {
                    resultCode = 0;
                    EventMgr.Instance.emit(GAME_EVENT.TOAST, { msg: "实名认证验证成功！" });
                } else {
                    resultCode = data_.data.resultCode
                }
                EventMgr.Instance.emit(GAME_EVENT.ON_USER_DESCRIBE_FACE_MESSAGE, resultCode);
                break;
            }
            case "GAME_RECORD_USER_OWN_QUERY": {
                Log.trace("收到 我的数据 返回");
                EventMgr.Instance.emit(GAME_EVENT.ON_GAME_SEARCH_MY_DATA, data_.data);
                break;
            }
            case "ORDRE_VERIFY_ORDER": {
                Log.trace("收到 请求确认订单 返回");
                EventMgr.Instance.emit(GAME_EVENT.ON_RECEIVE_ORDER_STATE_QUERY, data_.data);
                break;
            }
            case "USER_LIST_USER_REMARK": {
                Log.trace("收到 我的备注 返回");
                EventMgr.Instance.emit(GAME_EVENT.ON_GAME_MY_BEIZHU_DATA, data_.data);
                break;
            }
            case "USER_UPDATE_USER_REMAKE":{
                Log.trace("收到 备注修改更新 返回");
                EventMgr.Instance.emit(GAME_EVENT.ON_GAME_MY_BEIZHU_UPDATE_DATA, data_.data);
                break;
            }
        }
    }
}