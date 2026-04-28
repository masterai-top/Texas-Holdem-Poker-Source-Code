
import { EventTouch, find, Label, Node, NodeEventType } from 'cc';
import { RegisterType } from '../Const';
import LanguageMgr, { LanguageEnum } from '../../Language/LanguageMgr';
import { UIMgr } from '../../Frameworks/Manager/UIMgr';
import { UICtrl } from '../../Frameworks/Manager/UICtrl';




export class SetPassword extends UICtrl {
    private lbTitle: Label = null;
    private lbSubTitle: Label = null;
    private btnBack: Node = null;
    private lbPasswordTips: Label = null;

    private style: RegisterType = RegisterType.register;


    initData() {
        this.lbTitle = find("lbTitle", this.node).getComponent(Label);
        this.btnBack = find("btnBack", this.node);
        this.lbSubTitle = find("ndTop/lbSubTitle", this.node).getComponent(Label);
        this.lbPasswordTips = find("ndTop/lbPasswordTips", this.node).getComponent(Label);
    }
    initView() {

    }
    bindEventListener() {
        this.btnBack.on(NodeEventType.TOUCH_END, this.onClickBack, this);
    }


    onClickBack(event: EventTouch) {
        UIMgr.Instance.removeView(this.node);
    }

    setData(style_: RegisterType) {
        this.style = style_;

        switch (style_) {
            case RegisterType.register: {
                this.lbTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.register);
                this.lbSubTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.title_set_pwd_sub);
                this.lbPasswordTips.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.set_pwd_rules);
                break;
            }
            case RegisterType.reset_pwd: {
                this.lbTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.title_reset_pwd);
                this.lbSubTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.title_reset_pwd_sub);
                this.lbPasswordTips.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.set_pwd_rules);
                break;
            }
            case RegisterType.secondary_pwd: {
                this.lbTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.title_secondary_pwd);
                this.lbSubTitle.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.title_secondary_pwd);
                this.lbPasswordTips.string = LanguageMgr.Instance.getLanguageShow(LanguageEnum.set_secondary_pwd_rules);
                break;
            }
        }
    }


}


