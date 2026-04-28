import { EditBox, EventTouch, find, Label, Node, NodeEventType } from 'cc';
import { GetVerificationCodeMgr } from './GetVerificationCodeMgr';
import { ALERT_STYLE, ISetVerificationCodeData, VerificationCodeEnum } from '../Const';
import LanguageMgr, { LanguageEnum } from '../../Language/LanguageMgr';
import EventMgr from '../../Frameworks/Manager/EventMgr';
import { GAME_EVENT, NET_EVENT, SYS_EVENT } from '../EventDefine';
import { IRecvData, NetMgr } from '../../Frameworks/Net/NetMgr';
import { CMD } from '../Cmd2Pb';
import { SetPasswordMgr } from './SetPasswordMgr';
import { Log } from '../../Frameworks/Utils/Log';
import { LoginProto, XGameComm, XGameHttp, XGameProto, XGameRetCode } from 'pb';
import ProtoMgr from '../../Frameworks/Manager/ProtoMgr';
import HttpMgr, { HttpUrlEnum } from '../../Frameworks/Manager/HttpMgr';
import { UIMgr } from '../../Frameworks/Manager/UIMgr';
import { BundleConfig } from '../../Config/BundleConfig';
import { UICtrl } from '../../Frameworks/Manager/UICtrl';
import { MsgHandlerModel } from '../MsgHandlerModel';


export class SetVerificationCodeMgr extends UICtrl {
    private btnBack: Node = null;
    private btnVerification: Node = null;
    private ebNumber: Node = null;
    private lbNumbers: Node[] = [];
    private code: string = "";
    private lbTitle: Label = null;
    private lbSubTitle: Label = null;
    private lbTips: Label = null;
    private lbReSend: Label = null;

    private timer: number = null;
    private timedown: number = 60;
    private style: VerificationCodeEnum = VerificationCodeEnum.register;
    private sendData: ISetVerificationCodeData = null;

    protected initData(): void {
        this.btnBack = find("btnBack", this.node);
        this.lbTitle = find("lbTitle", this.node).getComponent(Label);
        this.lbSubTitle = find("ndTop/lbSubTitle", this.node).getComponent(Label);
        this.lbTips = find("ndTop/lbTips", this.node).getComponent(Label);
        this.btnVerification = find("ndTop/btnVerification", this.node);
        this.ebNumber = find("ndTop/spNumbers/ebNumber", this.node);
        this.lbReSend = find("ndTop/lbReSend", this.node).getComponent(Label);

        for (let i = 0; i < 4; ++i) {
            this.lbNumbers[i] = find(`ndTop/spNumbers/lblNumber${i}`, this.node);
        }
    }

    protected initView(): void {
        this.lbReSend.node.active = false;
        this.setData(this.viewParam);
    }
    protected initLanguage(): void {
        // this.lbTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.register);
        this.lbSubTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.input_code);
        this.lbTips.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.input_code_sub);
        this.lbReSend.string = `${this.timedown}    ${LanguageMgr.Instance.getLanguageShow(LanguageEnum.resend_tip)}`;
        this.btnVerification.getChildByName("Label").getComponent(Label).string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.verify);
        this.lbTips.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.input_code_sub).replace('xxx', this.sendData.phone || "");
    }
    protected bindEventListener(): void {
        this.btnBack.on(NodeEventType.TOUCH_END, this.onClickBack, this);
        this.btnVerification.on(NodeEventType.TOUCH_END, this.onVerification, this);
        this.ebNumber.on('text-changed', this.onChange, this);
        EventMgr.Instance.on(NET_EVENT.ON_RECV_DATA, this.onRecvData, this);
    }

    protected onDisable(): void {
        EventMgr.Instance.off(NET_EVENT.ON_RECV_DATA, this.onRecvData, this)

    }
    protected onDestroy(): void {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        EventMgr.Instance.off(NET_EVENT.ON_RECV_DATA, this.onRecvData, this)
    }

    private async onRecvData(data_: IRecvData) {
        switch (data_.cmd) {
            case CMD.LOGIN_USER_PHONE_SEND_CODE_TCP: {
                // 获取验证码
                if (null != data_.data && 0 < data_.data.resultCode) {
                    EventMgr.Instance.emit(SYS_EVENT.ERROR_CODE, { code: data_.data.resultCode });
                } else {
                    EventMgr.Instance.emit(GAME_EVENT.TOAST, { msg: LanguageMgr.Instance.getLanguageShow(LanguageEnum.send_code_succeed) });
                }
                break;
            }
            case CMD.LOGIN_USER_PHONE_VERIFY_CODE_TCP: {
                // 验证码验证
                if (null != data_.data && 0 < data_.data.resultCode) {
                    EventMgr.Instance.emit(SYS_EVENT.ERROR_CODE, { code: data_.data.resultCode });
                } else {
                    if (1 == data_.data.type) {
                        let view = await UIMgr.Instance.showViewEx(BundleConfig.PrefabEnum.GetVerificationCode, VerificationCodeEnum.set_phone);
                        view.addComponent(GetVerificationCodeMgr);
                    } else if (3 == data_.data.type) {
                        data_.data.code = this.code;
                        data_.data.style = this.style;
                        let view = await UIMgr.Instance.showViewEx(BundleConfig.PrefabEnum.SetPassword, data_.data);
                        view.addComponent(SetPasswordMgr);
                    } else {
                        EventMgr.Instance.emit(GAME_EVENT.TOAST, { msg: LanguageMgr.Instance.getLanguageShow(LanguageEnum.reset_phone_succeed) });
                    }
                }
                break;
            }
        }
    }

    onClickBack(event: EventTouch) {
        Log.trace("onClickBack");
        EventMgr.Instance.emit(GAME_EVENT.ALERT, {
            msg: LanguageMgr.Instance.getLanguageShow(this.style == VerificationCodeEnum.register ? LanguageEnum.send_code_back_tips : LanguageEnum.reset_code_back_tips),
            style: ALERT_STYLE.confirm_cancel,
            confirmCb: () => {
                UIMgr.Instance.removeView(this.node);
            }
        });
    }

    async setData(data_: ISetVerificationCodeData) {
        this.sendData = data_;
        this.style = data_.style;
        try {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        } catch (error) {

        }

        this.timedown = 60;
        this.lbReSend.node.active = true;
        this.lbReSend.string = `${this.timedown--}    ${LanguageMgr.Instance.getLanguageShow(LanguageEnum.resend_tip)}`;
        this.btnVerification.getChildByName("Label").getComponent(Label).string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.verify);
        this.timer = setInterval(() => {
            if (0 < this.timedown)
                this.lbReSend.string = `${this.timedown--}    ${LanguageMgr.Instance.getLanguageShow(LanguageEnum.resend_tip)}`;
            else {
                this.lbReSend.node.active = false;
                this.btnVerification.getChildByName("Label").getComponent(Label).string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.resend);
            }

        }, 1000)

        this.lbTips.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.input_code_sub).replace('xxx', this.sendData.phone || "");
        switch (this.style) {
            case VerificationCodeEnum.register: {
                this.lbTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.register);
                break;
            }
            case VerificationCodeEnum.reset_pwd: {
                this.lbTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.title_reset_pwd);
                break;
            }
            case VerificationCodeEnum.reset_phone:
            case VerificationCodeEnum.set_phone: {
                this.lbTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.title_reset_phone);
                break;
            }
            case VerificationCodeEnum.secondary_pwd: {
                this.lbTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.title_secondary_pwd);
                break;
            }

        }
        // 注册 重置密码用post
        if (VerificationCodeEnum.register == this.style || VerificationCodeEnum.reset_pwd == this.style) {
            this.getCodeFromHttp();
        } else {
            this.getCodeFromServer();
        }
    }
    // 注册 重置密码用post
    getCodeFromHttp(): void {
        let message: XGameHttp.THttpPackage = XGameHttp.THttpPackage.create({
            iVer: 1,
            iSeq: 1,
            nMsgID: XGameProto.ActionName.LOGIN_SEND_PHONE_CODE,
            vecData: ProtoMgr.Instance.encode(LoginProto.SendMessageCodeReq.create({
                userName: `${this.sendData.area}-${this.sendData.phone}`,
                channnelID: LoginProto.E_Channel_ID.E_CHANNEL_ID_PHONE
            }))
        })
        HttpMgr.Instance.httpRequest(HttpUrlEnum.login, {
            method: "post",
            data: ProtoMgr.Instance.encode(message)
        }).then((data_: any) => {
            // let data1: any = ProtoMgr.Instance.decode("LoginProto.SendMessageCodeResp", data_.vecData);
            if (0 === data_.resultCode) {
                localStorage.setItem("GAME_USER_AREA", this.sendData.area.toString());
                EventMgr.Instance.emit(GAME_EVENT.TOAST, { msg: LanguageMgr.Instance.getLanguageShow(LanguageEnum.send_code_succeed) })
            }
        })
    }
    getCodeFromServer() {
        let tstyle = 1
        if (VerificationCodeEnum.set_phone == this.sendData.style) {
            tstyle = 2;
        } else if (VerificationCodeEnum.secondary_pwd == this.sendData.style) {
            tstyle = 3;
        }


        let data = {
            msgId: XGameProto.ActionName.LOGIN_USER_PHONE_SEND_CODE_TCP,
            data: {
                area: this.sendData.area,
                phone: this.sendData.phone,
                type: tstyle,
            }
        }
        console.log("发送验证码请求：", data);
        MsgHandlerModel.Instance.getSendMsg(data);
    }
    async onVerificationTcp() {
        let tstyle = 1
        if (VerificationCodeEnum.set_phone == this.sendData.style) {
            tstyle = 2;
        } else if (VerificationCodeEnum.secondary_pwd == this.sendData.style) {
            tstyle = 3;
        }

        let data = {
            msgId: XGameProto.ActionName.LOGIN_USER_PHONE_VERIFY_CODE_TCP,
            data: {
                msgCode: this.code,
                type: tstyle
            }
        }
        MsgHandlerModel.Instance.getSendMsg(data);
    }
    async onVerification() {
        Log.trace("onVerification");
        if (0 < this.timedown) {
            // 验证
            if (4 === this.code.length) {
                Log.trace("sendVerificationCode:" + this.code)
                if (VerificationCodeEnum.register == this.style || VerificationCodeEnum.reset_pwd == this.style) {
                    let message: XGameHttp.THttpPackage = XGameHttp.THttpPackage.create({
                        iVer: 1,
                        iSeq: 1,
                        nMsgID: XGameProto.ActionName.LOGIN_VERIFY_CODE,
                        vecData: ProtoMgr.Instance.encode(LoginProto.VerifyCodeReq.create({
                            userName: this.sendData.phone,
                            msgCode: this.code,
                        }))
                    })

                    let response: any = await HttpMgr.Instance.httpRequest(HttpUrlEnum.login, {
                        method: "post",
                        data: ProtoMgr.Instance.encode(message)
                    })
                    if (0 === response.resultCode) {
                        this.sendData.code = this.code;
                        this.sendData.style = this.style;
                        let view = await UIMgr.Instance.showViewEx(BundleConfig.PrefabEnum.SetPassword, this.sendData);
                        view.addComponent(SetPasswordMgr);
                    } else if (XGameRetCode.RetCodeEnum.LOGIN_AUTH_CODE_ERROR === response.resultCode) {
                        EventMgr.Instance.emit(GAME_EVENT.TOAST, { msg: LanguageMgr.Instance.getLanguageShow(LanguageEnum.input_code_error) })
                    }
                } else {
                    // tcp 验证
                    this.onVerificationTcp();
                }
            } else {
                EventMgr.Instance.emit(GAME_EVENT.TOAST, { msg: LanguageMgr.Instance.getLanguageShow(LanguageEnum.input_code_error) })
            }
        } else {
            // 重新获取验证码
            this.setData(this.sendData);
        }
    }

    onChange() {
        this.code = this.ebNumber.getComponent(EditBox).string;
        this.refreshCode(this.code);
    }

    refreshCode(code: string) {
        for (let i = 0; i < 4; ++i) {
            this.lbNumbers[i].getComponent(Label).string = "";
        }
        if (code.length == 0) {
            return;
        }
        for (let i = 0; i < code.length; ++i) {
            this.lbNumbers[i].getComponent(Label).string = code.charAt(i);
        }
    }
}


