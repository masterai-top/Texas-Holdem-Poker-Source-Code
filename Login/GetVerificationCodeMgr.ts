import { EditBox, EventTouch, find, Label, native, Node, NodeEventType } from 'cc';
import { SetVerificationCodeMgr } from './SetVerificationCodeMgr';
import { VerificationCodeEnum } from '../Const';
import { Config } from '../../Config/Config';
import LanguageMgr, { LanguageEnum } from '../../Language/LanguageMgr';
import { GAME_EVENT } from '../EventDefine';
import EventMgr from '../../Frameworks/Manager/EventMgr';
import { Utils } from '../../Frameworks/Utils/Utils';
import { Country } from './Country';
import { UIMgr } from '../../Frameworks/Manager/UIMgr';
import { BundleConfig } from '../../Config/BundleConfig';
import { UICtrl } from '../../Frameworks/Manager/UICtrl';
import GlobalModel from '../../Frameworks/Model/GlobalModel';
import { ToWebView } from '../Comm/ToWebView';


export class GetVerificationCodeMgr extends UICtrl {
    private lbTitle: Label = null;
    private btnBack: Node = null;

    private lbCountry: Label = null;
    private lbSubTitle: Label = null;
    private lbCountryResult: Label = null;
    private btnCountry: Node = null;
    private inputTelphone: EditBox = null;
    private btnGetCode: Node = null;
    private nodeBottom: Node = null;

    private lbTips1: Label = null;
    private btnSportsmanTips: Node = null;
    private lbTips2: Label = null;
    private btnUseTips: Node = null;

    private country = null;
    private countryIndex: number = 45;
    private style: VerificationCodeEnum = VerificationCodeEnum.register;

    protected initData(): void {
        this.country = JSON.parse(Config.Country);

        let tnode = find("nodeContent/nodeTop", this.node);
        this.lbTitle = find("lbTitle", tnode).getComponent(Label);
        this.btnBack = find("btnBack", tnode);

        tnode = find("nodeContent/nodeCenter", this.node);
        this.lbSubTitle = find("lbSubTitle", tnode).getComponent(Label);
        this.lbCountry = find("nodeCountry/lbCountry", tnode).getComponent(Label);
        this.lbCountryResult = find("nodeCountry/lbCountryResult", tnode).getComponent(Label);
        this.btnCountry = find("nodeCountry/btnCountry", tnode)
        this.inputTelphone = find("inputTelphone", tnode).getComponent(EditBox);
        this.btnGetCode = find("btnGetCode", tnode);

        this.nodeBottom = find("nodeContent/nodeBottom", this.node);
        this.lbTips1 = find("lbTips1", this.nodeBottom).getComponent(Label);
        this.lbTips2 = find("lbTips2", this.nodeBottom).getComponent(Label);
        this.btnSportsmanTips = find("btnSportsmanTips", this.nodeBottom);
        this.btnUseTips = find("btnUseTips", this.nodeBottom);

        this.nodeBottom.active = false;

    }
    protected initView(): void {
        this.setData(this.viewParam)
    }
    protected initLanguage(): void {
        this.lbCountry.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.country);
        this.lbCountryResult.string = `${this.country[this.countryIndex].name}(+${this.country[this.countryIndex].areaID})`;
        this.inputTelphone.placeholderLabel.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.input_phone_place);
        this.btnGetCode.getChildByName("Label").getComponent(Label).string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.get_verify_code);
        this.lbTips1.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.user_agreement_1);
        this.btnSportsmanTips.getChildByName("Label").getComponent(Label).string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.user_agreement_2);
        this.btnUseTips.getChildByName("Label").getComponent(Label).string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.user_agreement_4);
        this.lbTips2.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.user_agreement_3);
    }
    protected bindEventListener(): void {
        this.btnBack.on(NodeEventType.TOUCH_END, this.onClickBack, this);
        this.btnGetCode.on(NodeEventType.TOUCH_END, this.onClickGetCode, this);
        this.btnCountry.on(NodeEventType.TOUCH_END, this.onClickCountry, this);

        this.btnSportsmanTips.on(NodeEventType.TOUCH_END, this.sportsManTips, this);
        this.btnUseTips.on(NodeEventType.TOUCH_END, this.useTips, this);

        EventMgr.Instance.on(GAME_EVENT.SELECTED_COUTRY, this.selectCountry, this)
    }
    protected onDestroy(): void {
        EventMgr.Instance.off(GAME_EVENT.SELECTED_COUTRY, this.selectCountry, this)
    }

    selectCountry(data: any) {
        this.countryIndex = data;
        this.lbCountryResult.getComponent(Label).string = `${this.country[this.countryIndex].name}(+${this.country[this.countryIndex].areaID})`;
    }

    setData(data_: VerificationCodeEnum) {
        this.style = data_;
        switch (data_) {
            case VerificationCodeEnum.register: {
                this.nodeBottom.active = true;
                this.lbTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.register);
                this.lbSubTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.title_register_sub);
                break;
            }
            case VerificationCodeEnum.reset_pwd: {
                this.lbTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.title_reset_pwd);
                this.lbSubTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.title_reset_pwd_sub);
                break;
            }
            case VerificationCodeEnum.set_phone: {
                this.lbTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.title_reset_phone);
                this.lbSubTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.title_set_phone_sub);
                break;
            }
            case VerificationCodeEnum.reset_phone: {
                this.lbTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.title_reset_phone);
                this.lbSubTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.title_reset_phone_sub);
                break;
            }
            case VerificationCodeEnum.secondary_pwd: {
                this.lbTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.title_secondary_pwd);
                this.lbSubTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.title_reset_phone_sub);
                break;
            }
        }
    }

    onClickBack(event: EventTouch) {
        UIMgr.Instance.removeView(this.node);
    }
    async onClickGetCode(event: EventTouch) {
        let phoneNum: string = this.inputTelphone.string;
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
        UIMgr.Instance.removeView(this.node);
    }
    async onClickCountry(event: EventTouch) {
        let view = await UIMgr.Instance.showViewEx(BundleConfig.PrefabEnum.Country);
        view.addComponent(Country);
    }

    sportsManTips(event: EventTouch) {
        this.onToView({ title: "参赛声明", info: [], detailLink: GlobalModel.Instance.stateMentUrl });
    }

    useTips(event: EventTouch) {
        this.onToView({ title: "使用条款", info: [], detailLink: GlobalModel.Instance.useContentUrl });
    }

    async onToView(data) {
        // window.open(data.detailLink);
        let view = await UIMgr.Instance.showViewEx(BundleConfig.PrefabEnum.ToWebView, data);
        view.addComponent(ToWebView);
    }

}


