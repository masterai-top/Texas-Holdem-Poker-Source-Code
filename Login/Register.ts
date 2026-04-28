import { _decorator, Component, EditBox, EventTouch, find, Label, Node, NodeEventType } from 'cc';
import { BundleEnum, VerificationCodeEnum } from '../Const';
import { Config } from '../../Config/Config';
import EventMgr from '../../Frameworks/Manager/EventMgr';
import { GAME_EVENT } from '../EventDefine';
import LanguageMgr, { LanguageEnum } from '../../Language/LanguageMgr';
import { Log } from '../../Frameworks/Utils/Log';
import { Utils } from '../../Frameworks/Utils/Utils';
import { SetVerificationCodeMgr } from './SetVerificationCodeMgr';
import { GameApp } from '../GameApp';
import { Country } from './Country';
import { IWinParam, UIMgr } from '../../Frameworks/Manager/UIMgr';
import { ToWebView } from '../Comm/ToWebView';
import GlobalModel from '../../Frameworks/Model/GlobalModel';
import { BundleConfig } from '../../Config/BundleConfig';
import { UICtrl } from '../../Frameworks/Manager/UICtrl';


export class Register extends UICtrl {
    btnBack: Node = null;
    ebPhoneNumber: EditBox = null;
    btnGetCode: Node = null;
    btnSportsmanTips: Node = null;
    btnUseTips: Node = null;
    lblCountry: Node = null;
    btnCountry: Node = null;
    country = null;
    lblCountryResult: Node = null;
    countryIndex: number = 45;
    lbTitle: Label = null;
    lbSubTitle: Label = null;

    private style: VerificationCodeEnum = VerificationCodeEnum.register;

    protected initData(): void {
        this.country = JSON.parse(Config.Country);
        this.btnBack = find("btnBack", this.node);
        this.btnBack.on(NodeEventType.TOUCH_END, this.back, this);
        this.ebPhoneNumber = find("ndTop/ebPhoneNumber", this.node).getComponent(EditBox);
        this.btnGetCode = find("ndTop/btnGetCode", this.node);
        this.btnGetCode.on(NodeEventType.TOUCH_END, this.getCode, this);
        this.btnSportsmanTips = find("ndBottom/btnSportsmanTips", this.node);
        this.btnSportsmanTips.on(NodeEventType.TOUCH_END, this.sportsManTips, this);
        this.btnUseTips = find("ndBottom/btnUseTips", this.node);
        this.btnUseTips.on(NodeEventType.TOUCH_END, this.useTips, this);
        this.btnCountry = find("ndTop/spCountry/btnCountry", this.node);
        this.btnCountry.on(NodeEventType.TOUCH_END, this.onCountry, this);
        this.lblCountryResult = find("ndTop/spCountry/lblCountryResult", this.node);
        this.lblCountryResult.getComponent(Label).string = `${this.country[this.countryIndex].name}(+${this.country[this.countryIndex].areaID})`;

        this.lbTitle = find("lblTitle", this.node).getComponent(Label);
        this.lbSubTitle = find("ndTop/lblWelcome", this.node).getComponent(Label);

    }
    protected initView(): void {
        this.setData(this.viewParam);
    }
    protected bindEventListener(): void {
        EventMgr.Instance.on(GAME_EVENT.SELECTED_COUTRY, this.selectCountry, this)
    }
    protected onDestroy(): void {
        EventMgr.Instance.off(GAME_EVENT.SELECTED_COUTRY, this.selectCountry, this)
    }
    setData(type_: VerificationCodeEnum) {
        this.style = type_;
        switch (type_) {
            case VerificationCodeEnum.register: {
                this.lbTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.register);
                this.lbSubTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.title_register_sub);
                break;
            }
            case VerificationCodeEnum.reset_pwd: {
                this.lbTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.title_reset_pwd);
                this.lbSubTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.title_reset_pwd_sub);
                break;
            }
            case VerificationCodeEnum.secondary_pwd: {
                this.lbTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.title_secondary_pwd);
                this.lbSubTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.get_verify_code);
                break;
            }
        }
    }

    back(event: EventTouch) {
        Log.trace("REGISTER back");
        UIMgr.Instance.removeView(this.node);
    }

    selectCountry(data: any) {
        this.countryIndex = data;
        this.lblCountryResult.getComponent(Label).string = `${this.country[this.countryIndex].name}(+${this.country[this.countryIndex].areaID})`;
    }

    async getCode(event: EventTouch) {
        let phoneNum: string = this.ebPhoneNumber.string;

        if ('' === phoneNum) {
            EventMgr.Instance.emit(GAME_EVENT.TOAST, { msg: LanguageMgr.Instance.getLanguageShow(LanguageEnum.input_phone_empty) })
            return;
        }
        if (!Utils.checkInputNumber(phoneNum)) {
            EventMgr.Instance.emit(GAME_EVENT.TOAST, { msg: LanguageMgr.Instance.getLanguageShow(LanguageEnum.input_phone_error) })
            return;
        }

        let view = await UIMgr.Instance.showViewEx(BundleConfig.PrefabEnum.SetVerificationCode, { style: this.style, phone: phoneNum, area: this.country[this.countryIndex].areaID, code: "" });
        view.addComponent(SetVerificationCodeMgr);
    }

    sportsManTips(event: EventTouch) {
        Log.trace("sportsmanTips");
        this.onToView({ title: "参赛声明", info: [], detailLink: GlobalModel.Instance.stateMentUrl });
    }

    useTips(event: EventTouch) {
        Log.trace("useTips");
        this.onToView({ title: "使用条款", info: [], detailLink: GlobalModel.Instance.useContentUrl });
    }

    async onToView(data) {
        // window.open(data.detailLink);
        let view = await UIMgr.Instance.showViewEx(BundleConfig.PrefabEnum.ToWebView, data);
        view.addComponent(ToWebView);
    }

    async onCountry(event: EventTouch) {
        Log.trace("show country");
        let view = await UIMgr.Instance.showViewEx(BundleConfig.PrefabEnum.Country);
        view.addComponent(Country);
    }
}


