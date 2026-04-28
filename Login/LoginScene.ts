
import { Log } from '../../Frameworks/Utils/Log';
import LanguageMgr, { LanguageEnum } from '../../Language/LanguageMgr';
import { EditBox, EventTouch, find, Label, Node, NodeEventType, sys } from 'cc';
import EventMgr from '../../Frameworks/Manager/EventMgr';
import { ALERT_STYLE, SceneEnum, VerificationCodeEnum } from '../Const';
import { GAME_EVENT, SYS_EVENT } from '../EventDefine';
import { LoginProto, XGameHttp, XGameProto } from 'pb';
import AccountModel from '../../Frameworks/Model/AccountModel';
import ProtoMgr from '../../Frameworks/Manager/ProtoMgr';
import HttpMgr, { HttpUrlEnum } from '../../Frameworks/Manager/HttpMgr';
import { GetVerificationCodeMgr } from './GetVerificationCodeMgr';
import { ToWebView } from '../Comm/ToWebView';
import { UIMgr } from '../../Frameworks/Manager/UIMgr';
import GlobalModel from '../../Frameworks/Model/GlobalModel';
import { BundleConfig } from '../../Config/BundleConfig';
import { UICtrl } from '../../Frameworks/Manager/UICtrl';


export class LoginScene extends UICtrl {
    private btnBack: Node = null;
    private ebPhoneNumber: Node = null;
    private ebPassword: Node = null;
    private btnLogin: Node = null;
    private btnRegister: Node = null;
    private btnForgot: Node = null;
    private btnSportsmanTips: Node = null;
    private btnUseTips: Node = null;
    private lblTitle: Label = null;
    private nodeAgreement1: Label = null;
    private nodeAgreement2: Label = null;
    private nodeAgreement3: Label = null;
    private nodeAgreement4: Label = null;

    initData(): void {
        this.btnBack = find("btnBack", this.node);
        this.ebPhoneNumber = find("ndCenter/ebPhoneNumber", this.node);
        this.ebPassword = find("ndCenter/ebPassword", this.node);
        this.btnLogin = find("ndCenter/btnLogin", this.node);
        this.btnRegister = find("ndCenter/btnRegister", this.node);
        this.btnForgot = find("ndCenter/btnForgetPassword", this.node);
        this.btnSportsmanTips = find("ndBottom/btnSportsmanTips", this.node);
        this.btnUseTips = find("ndBottom/btnUseTips", this.node);

        this.lblTitle = find("lblTitle", this.node).getComponent(Label);
        this.nodeAgreement1 = find("ndBottom/lblTips1", this.node).getComponent(Label);
        this.nodeAgreement2 = find("ndBottom/btnSportsmanTips/Label", this.node).getComponent(Label);
        this.nodeAgreement3 = find("ndBottom/lblTips2", this.node).getComponent(Label);
        this.nodeAgreement4 = find("ndBottom/btnUseTips/Label", this.node).getComponent(Label);
    }
    protected async initView() {
        GlobalModel.Instance.isShowSafePWTip = false;
    }
    initLanguage() {
        this.lblTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.login);
        this.ebPhoneNumber.getComponent(EditBox).placeholderLabel.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.input_phone_place);
        this.ebPassword.getComponent(EditBox).placeholderLabel.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.input_pwd_place);
        this.btnLogin.getChildByName("Label").getComponent(Label).string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.login);
        this.btnRegister.getChildByName("Label").getComponent(Label).string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.user_register);
        this.btnForgot.getChildByName("Label").getComponent(Label).string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.forget_pwd);
        this.nodeAgreement1.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.user_agreement_1);
        this.nodeAgreement2.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.user_agreement_2);
        this.nodeAgreement3.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.user_agreement_3);
        this.nodeAgreement4.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.user_agreement_4);
    }

    protected bindEventListener(): void {
        this.btnBack.on(NodeEventType.TOUCH_END, this.back, this);
        this.btnLogin.on(NodeEventType.TOUCH_END, this.login, this);
        this.btnRegister.on(NodeEventType.TOUCH_END, this.register, this);
        this.btnForgot.on(NodeEventType.TOUCH_END, this.forgotPassword, this);
        this.btnSportsmanTips.on(NodeEventType.TOUCH_END, this.sportsManTips, this);
        this.btnUseTips.on(NodeEventType.TOUCH_END, this.useTips, this);

    }

    back(event: EventTouch) {
        Log.trace("back");
        UIMgr.Instance.removeView(this.node);
        EventMgr.Instance.emit(SYS_EVENT.CHANGE_SCENE, { name: SceneEnum.main });
    }

    async login(event: EventTouch) {
        Log.trace("login");
        let phoneNum: string = this.ebPhoneNumber.getComponent(EditBox).string;
        if ('' === phoneNum) {
            EventMgr.Instance.emit(GAME_EVENT.TOAST, { style: ALERT_STYLE.confirm_cancel, msg: LanguageMgr.Instance.getLanguageShow(LanguageEnum.input_phone_empty) })
            return;
        }
        let inputPwd: string = this.ebPassword.getComponent(EditBox).string;
        if ('' === inputPwd) {
            EventMgr.Instance.emit(GAME_EVENT.TOAST, {
                style: ALERT_STYLE.confirm_cancel, msg: LanguageMgr.Instance.getLanguageShow(LanguageEnum.input_pwd_empty)
            })
            return;
        }
        phoneNum = phoneNum.trim();
        inputPwd = inputPwd.trim();
        let message: XGameHttp.THttpPackage = XGameHttp.THttpPackage.create({
            iVer: 1,
            iSeq: 1,
            nMsgID: XGameProto.ActionName.LOGIN_USER_ACCOUNT,
            vecData: ProtoMgr.Instance.encode(LoginProto.UserLoginReq.create({
                userName: phoneNum,
                passwd: inputPwd,
                areaID: AccountModel.Instance.area,
                deviceType: sys.browserType,
                platform: LoginProto.E_Platform_Type.E_PLATFORM_TYPE_H5,
                channnelID: LoginProto.E_Channel_ID.E_CHANNEL_ID_PHONE
            }))
        })
        let tret: any = await HttpMgr.Instance.httpRequest(HttpUrlEnum.login, {
            method: "post",
            data: ProtoMgr.Instance.encode(message)
        })
        if (0 === tret.resultCode) {
            EventMgr.Instance.emit(GAME_EVENT.LOGIN_SUCCEED, tret);
            GlobalModel.Instance.isShowSafePWTip = true;
        } else {
            EventMgr.Instance.emit(SYS_EVENT.ERROR_CODE, { code: tret.resultCode });
        }
    }

    async register(event: EventTouch) {
        Log.trace("register");
        let view = await UIMgr.Instance.showViewEx(BundleConfig.PrefabEnum.GetVerificationCode, VerificationCodeEnum.register);
        view.addComponent(GetVerificationCodeMgr);
    }

    async forgotPassword(event: EventTouch) {
        Log.trace("forgot password");
        let view = await UIMgr.Instance.showViewEx(BundleConfig.PrefabEnum.GetVerificationCode, VerificationCodeEnum.reset_pwd);
        view.addComponent(GetVerificationCodeMgr);
    }

    async sportsManTips(event: EventTouch) {
        Log.trace("sportsmanTips");
        // window.open(GlobalModel.Instance.stateMentUrl);
        let view = await UIMgr.Instance.showViewEx(BundleConfig.PrefabEnum.ToWebView, { title: "参赛声明", info: [], detailLink: GlobalModel.Instance.stateMentUrl });
        view.addComponent(ToWebView);
    }

    async useTips(event: EventTouch) {
        Log.trace("useTips");
        // window.open(GlobalModel.Instance.useContentUrl);
        let view = await UIMgr.Instance.showViewEx(BundleConfig.PrefabEnum.ToWebView, { title: "使用条款", info: [], detailLink: GlobalModel.Instance.useContentUrl });
        view.addComponent(ToWebView);
    }
}


