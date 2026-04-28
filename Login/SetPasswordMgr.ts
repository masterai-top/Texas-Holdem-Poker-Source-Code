import { EditBox, EventTouch, find, Label, Node, NodeEventType, sys } from 'cc';
import { ISetVerificationCodeData, VerificationCodeEnum } from '../Const';
import LanguageMgr, { LanguageEnum } from '../../Language/LanguageMgr';
import { LoginProto, XGameHttp, XGameProto } from 'pb';
import ProtoMgr from '../../Frameworks/Manager/ProtoMgr';
import { Utils } from '../../Frameworks/Utils/Utils';
import HttpMgr, { HttpUrlEnum } from '../../Frameworks/Manager/HttpMgr';
import AccountModel from '../../Frameworks/Model/AccountModel';
import { GAME_EVENT, SYS_EVENT } from '../EventDefine';
import EventMgr from '../../Frameworks/Manager/EventMgr';
import { Log } from '../../Frameworks/Utils/Log';
import { UIMgr } from '../../Frameworks/Manager/UIMgr';
import { MsgHandlerModel } from '../MsgHandlerModel';
import { BundleConfig } from '../../Config/BundleConfig';
import { UICtrl } from '../../Frameworks/Manager/UICtrl';

export class SetPasswordMgr extends UICtrl {
    private lbTitle: Label = null;
    private lbSubTitle: Label = null;
    private btnBack: Node = null;
    private lbPasswordTips: Label = null;
    private inputPwd: EditBox = null;
    private inputPwd2: EditBox = null;
    private nodeEye: Node = null;
    private nodeEye2: Node = null;
    private btnConfirm: Node = null;

    private style: VerificationCodeEnum = VerificationCodeEnum.register;
    private sendData: ISetVerificationCodeData = null;
    protected initData(): void {
        this.lbTitle = find("lbTitle", this.node).getComponent(Label);
        this.btnBack = find("btnBack", this.node);
        this.lbSubTitle = find("ndTop/lbSubTitle", this.node).getComponent(Label);
        this.lbPasswordTips = find("ndTop/lbPasswordTips", this.node).getComponent(Label);
        this.inputPwd = find("ndTop/inputPwd", this.node).getComponent(EditBox);
        this.inputPwd2 = find("ndTop/inputPwd2", this.node).getComponent(EditBox);
        this.nodeEye = find("ndTop/nodeEye", this.node);
        this.nodeEye2 = find("ndTop/nodeEye2", this.node);
        this.btnConfirm = find("ndTop/btnConfirm", this.node);
    }
    protected initView(): void {
        this.setData(this.viewParam);
    }
    protected initLanguage(): void {
        // this.lbTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.register);
        // this.lbSubTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.title_set_pwd_sub);
        // this.lbPasswordTips.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.set_pwd_rules);
        this.inputPwd.placeholderLabel.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.input_pwd_empty);
        this.inputPwd2.placeholderLabel.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.input_pwd_empty1);
        this.btnConfirm.getChildByName("Label").getComponent(Label).string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.confirm);
    }
    protected bindEventListener(): void {
        this.btnBack.on(NodeEventType.TOUCH_END, this.onClickBack, this);
        this.nodeEye.on(NodeEventType.TOUCH_END, this.onClickEye, this);
        this.nodeEye2.on(NodeEventType.TOUCH_END, this.onClickEye1, this);
        this.btnConfirm.on(NodeEventType.TOUCH_END, this.onClickConfirm, this);

        EventMgr.Instance.on(GAME_EVENT.SEND_SET_SERPWD_MESSAGE, this.onReceiveData, this);
    }
    protected onDestroy(): void {
        EventMgr.Instance.off(GAME_EVENT.SEND_SET_SERPWD_MESSAGE, this.onReceiveData, this);

    }

    private async onReceiveData(resultCode) {
        if (0 == resultCode) {
            let str = LanguageMgr.Instance.getLanguageShow(LanguageEnum.reset_pwd_succeed);
            if(this.style == VerificationCodeEnum.secondary_pwd){
                str = LanguageMgr.Instance.getLanguageShow(LanguageEnum.reset_safe_pwd_succeed);
            }

            EventMgr.Instance.emit(GAME_EVENT.TOAST, { msg: str})
            UIMgr.Instance.destroyView(BundleConfig.PrefabEnum.GetVerificationCode);
            UIMgr.Instance.destroyView(BundleConfig.PrefabEnum.SetVerificationCode);
            UIMgr.Instance.destroyView(BundleConfig.PrefabEnum.SetPassword);
            UIMgr.Instance.destroyView(BundleConfig.PrefabEnum.Register);
        } else {
            EventMgr.Instance.emit(SYS_EVENT.ERROR_CODE, { code: resultCode });
        }
    }

    setData(data_: ISetVerificationCodeData) {
        this.style = data_.style;
        this.sendData = data_;

        this.inputPwd.maxLength = 16;
        this.inputPwd2.maxLength = 16;
        this.inputPwd.inputMode = 6;
        this.inputPwd2.inputMode = 6;
        
        switch (this.style) {
            case VerificationCodeEnum.register: {
                this.lbTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.register);
                this.lbSubTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.title_set_pwd_sub);
                this.lbPasswordTips.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.set_pwd_rules);
                break;
            }
            case VerificationCodeEnum.reset_pwd: {
                this.lbTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.title_reset_pwd);
                this.lbSubTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.title_reset_pwd_sub);
                this.lbPasswordTips.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.set_pwd_rules);
                break;
            }
            case VerificationCodeEnum.secondary_pwd: {
                this.lbTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.title_secondary_pwd);
                this.lbSubTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.title_secondary_pwd);
                this.lbPasswordTips.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.set_secondary_pwd_rules);
                this.inputPwd.maxLength = 6;
                this.inputPwd2.maxLength = 6;
                this.inputPwd.inputMode = 2;
                this.inputPwd2.inputMode = 2;
                break;
            }
        }
    }

    onClickBack(event: EventTouch) {
        UIMgr.Instance.removeView(this.node);
    }
    onClickEye(event: EventTouch) {
        let target = event.currentTarget;
        target.getChildByName("cbEye").active = !target.getChildByName("cbEye").active;
        target.getChildByName("Checkmark").active = !target.getChildByName("Checkmark").active;
        this.inputPwd.inputFlag = target.getChildByName("Checkmark").active ? EditBox.InputFlag.DEFAULT : EditBox.InputFlag.PASSWORD;
    }
    onClickEye1(event: EventTouch) {
        let target = event.currentTarget;
        target.getChildByName("cbEye").active = !target.getChildByName("cbEye").active;
        target.getChildByName("Checkmark").active = !target.getChildByName("Checkmark").active;
        this.inputPwd2.inputFlag = target.getChildByName("Checkmark").active ? EditBox.InputFlag.DEFAULT : EditBox.InputFlag.PASSWORD;
    }
    async register(pwd_: string) {
        console.log("this.sendData, ", this.sendData);
        let message: XGameHttp.THttpPackage = XGameHttp.THttpPackage.create({
            iVer: 1,
            iSeq: 1,
            nMsgID: XGameProto.ActionName.LOGIN_USER_ACCOUNT_REGISTER,
            vecData: ProtoMgr.Instance.encode(LoginProto.UserRegisterReq.create({
                msgCode: this.sendData.code,
                registerInfo: LoginProto.RegisterInfo.create({
                    userName: this.sendData.phone,
                    passwd: pwd_,
                    deviceID: Utils.getDeviceId(),
                    deviceType: sys.browserType,
                    platform: LoginProto.E_Platform_Type.E_PLATFORM_TYPE_H5,
                    channnelID: LoginProto.E_Channel_ID.E_CHANNEL_ID_PHONE,
                    areaID: this.sendData.area,
                })
            }))
        })
        HttpMgr.Instance.httpRequest(HttpUrlEnum.login, {
            method: "post",
            data: ProtoMgr.Instance.encode(message)
        }).then((data_: any) => {
            if (0 === data_.resultCode) {
                AccountModel.Instance.uid = data_.uid;
                EventMgr.Instance.emit(GAME_EVENT.ALERT, { msg: LanguageMgr.Instance.getLanguageShow(LanguageEnum.register_succeed) })
                UIMgr.Instance.destroyView(BundleConfig.PrefabEnum.GetVerificationCode);
                UIMgr.Instance.destroyView(BundleConfig.PrefabEnum.SetVerificationCode);
                UIMgr.Instance.destroyView(BundleConfig.PrefabEnum.SetPassword);
                UIMgr.Instance.destroyView(BundleConfig.PrefabEnum.Register);
            }else{
                EventMgr.Instance.emit(SYS_EVENT.ERROR_CODE, { code: data_.resultCode });
            }
        })
    }

    async resetPwd(pwd_: string) {
        let message: XGameHttp.THttpPackage = XGameHttp.THttpPackage.create({
            iVer: 1,
            iSeq: 1,
            nMsgID: XGameProto.ActionName.LOGIN_USER_ACCOUNT_RESET_PASSWD,
            vecData: ProtoMgr.Instance.encode(LoginProto.UserResetPasswordReq.create({
                msgCode: this.sendData.code,
                userName: this.sendData.phone,
                newPassword: pwd_
            }))
        })
        let tret: any = await HttpMgr.Instance.httpRequest(HttpUrlEnum.login, {
            method: "post",
            data: ProtoMgr.Instance.encode(message)
        })
        if (tret && 0 == tret.resultCode) {
            let str = LanguageMgr.Instance.getLanguageShow(LanguageEnum.reset_pwd_succeed);
            if(this.style == VerificationCodeEnum.secondary_pwd){
                str = LanguageMgr.Instance.getLanguageShow(LanguageEnum.reset_safe_pwd_succeed);
            }

            EventMgr.Instance.emit(GAME_EVENT.TOAST, { msg: str})
            UIMgr.Instance.destroyView(BundleConfig.PrefabEnum.GetVerificationCode);
            UIMgr.Instance.destroyView(BundleConfig.PrefabEnum.SetVerificationCode);
            UIMgr.Instance.destroyView(BundleConfig.PrefabEnum.SetPassword);
            UIMgr.Instance.destroyView(BundleConfig.PrefabEnum.Register);
        } else {
            Log.trace(tret.resultCode)
            EventMgr.Instance.emit(SYS_EVENT.ERROR_CODE, { code: tret.resultCode });
        }

    }

    private setSerPwd(pwd_: string) {
        let data = {
            msgId: XGameProto.ActionName.LOGIN_USER_SET_SAFE_PWD_TCP,
            data: {
                userName: this.sendData.phone,
                msgCode: this.sendData.code,
                safePwd: pwd_
            }
        }
        MsgHandlerModel.Instance.getSendMsg(data);
    }

    async onClickConfirm(event: EventTouch) {
        let pwd: string = this.inputPwd.string;
        if ('' === pwd) {
            EventMgr.Instance.emit(GAME_EVENT.TOAST, { msg: LanguageMgr.Instance.getLanguageShow(LanguageEnum.input_pwd_empty) });
            return;
        }
        let pwd1: string = this.inputPwd2.string;
        if ('' === pwd1) {
            EventMgr.Instance.emit(GAME_EVENT.TOAST, { msg: LanguageMgr.Instance.getLanguageShow(LanguageEnum.input_pwd_empty1) });
            return;
        }
        if (pwd !== pwd1) {
            EventMgr.Instance.emit(GAME_EVENT.TOAST, { msg: LanguageMgr.Instance.getLanguageShow(LanguageEnum.input_pwd_different) });
            return;
        }

        if(this.style == VerificationCodeEnum.register || this.style == VerificationCodeEnum.reset_pwd){
            if(pwd.length < 8 || pwd.length > 16){
                EventMgr.Instance.emit(GAME_EVENT.TOAST, { msg: LanguageMgr.Instance.getLanguageShow(LanguageEnum.pwd_length_error) });
                return;
            }
        }

        switch (this.style) {
            case VerificationCodeEnum.register: {
                this.register(pwd);
                break;
            }
            case VerificationCodeEnum.reset_pwd: {
                this.resetPwd(pwd);
                break;
            }
            case VerificationCodeEnum.secondary_pwd: {
                this.setSerPwd(pwd);
                break;
            }
        }
    }

}


