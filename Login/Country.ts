import { Log } from "../../Frameworks/Utils/Log";
import { Config } from "../../Config/Config";
import { EditBox, EventTouch, Label, Node, NodeEventType, Prefab, UITransform, find, instantiate, size, v3 } from "cc";
import { TimerMgr } from "../../Frameworks/Manager/TimerMgr";
import { ResMgr } from "../../Frameworks/Manager/ResMgr";
import EventMgr from "../../Frameworks/Manager/EventMgr";
import { GAME_EVENT } from "../EventDefine";
import { UIMgr } from "../../Frameworks/Manager/UIMgr";
import { BundleConfig } from "../../Config/BundleConfig";
import { UICtrl } from "../../Frameworks/Manager/UICtrl";



export class Country extends UICtrl {
    public static instance: Country = null;
    btnBack: Node = null;
    ebPhoneNumber: Node = null;
    sv: Node = null;
    country = null;
    currIndex = 0;
    timeID = null;
    pf: Prefab = null;

    toggleGroup: Node = null;

    protected initData(): void {
        this.toggleGroup = find("ndCenter/ToggleGroup", this.node);
        this.toggleGroup.active = false;

        this.btnBack = find("btnBack", this.node);
        this.btnBack.on(NodeEventType.TOUCH_END, this.back, this);
        this.ebPhoneNumber = find("ndTop/ebPhoneNumber", this.node);
        this.sv = find("sv/view/content", this.node);
        this.country = JSON.parse(Config.Country);
        this.ebPhoneNumber.on('text-changed', this.onChange, this);
    }
    protected initView(): void {
        this.showCountryList(this.country);
    }
    protected onDestroy(): void {
        TimerMgr.instance.Unschedule(this.timeID);
    }
    back(event: EventTouch) {
        UIMgr.Instance.removeView(this.node);
    }
    onChange() {
        let editBox = this.ebPhoneNumber.getComponent(EditBox);
        let list = this.sv.children;
        for (let i = 0; i < list.length; i++) {
            list[i].active = true;
        }
        if (editBox.string.trim().length <= 0) return;
        let showAll = true;
        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            let str1 = find("btn/lblNumber", item).getComponent(Label).string;
            let str2 = find("btn/lblCountry", item).getComponent(Label).string;
            let matches1 = str1.indexOf(editBox.string);
            let matches2 = str2.indexOf(editBox.string);
            item.active = false;
            if (matches1 != -1 || matches2 != -1) {
                item.active = true;
                showAll = false;
            }
        }
        if (showAll) {
            for (let i = 0; i < list.length; i++) {
                list[i].active = true;
            }
        }
    }

    async showCountryList(data) {
        let self = this;
        this.country = data;
        this.currIndex = 0;
        this.sv.removeAllChildren();
        let pf = null;
        let node: Node = null;
        try {
            let pbData = BundleConfig.bundles.get(BundleConfig.PrefabEnum.CountryItem);
            pf = await ResMgr.Instance.load<Prefab>(pbData.name, Prefab, pbData.path);
            let i = 0;
            for (; i < data.length; ++i) {
                let info = data[i];
                let index = i;
                this.scheduleOnce(async () => {
                    node = instantiate(pf);
                    node.parent = self.sv;
                    node.getChildByName("btn")["index"] = index;
                    node.getChildByName("btn").on(NodeEventType.TOUCH_END, self.select, self);
                    self.setCountryData(node, info);
                    // node.setPosition(v3(0, -15 - 80 * i, 0));
                }, 0.01 * i);
            }
        } catch (err: any) {
            console.error(err);
            return;
        }

    }

    addItem(pf) {
        let self = Country.instance;
        let node: Node = instantiate(pf);
        node.setParent(self.sv);
        self.setCountryData(node, self.country[self.currIndex]);
        node.setPosition(v3(0, -15 - 80 * self.currIndex, 0));
        node.getChildByName("btn")["index"] = self.currIndex;
        node.getChildByName("btn").on(NodeEventType.TOUCH_END, self.select, self);
        self.currIndex++;
        if (self.currIndex == self.country.length) {
            self.sv.getComponent(UITransform).setContentSize(size(655, self.currIndex * 80));
            TimerMgr.instance.Unschedule(self.timeID);
        }
    }

    setCountryData(node: Node, data: any) {
        let number = node.getChildByName("btn").getChildByName("lblNumber");
        let country = node.getChildByName("btn").getChildByName("lblCountry");
        number.getComponent(Label).string = `+${data.areaID}`;
        country.getComponent(Label).string = data.name;
    }

    select(event: EventTouch) {
        let node = event.getCurrentTarget();
        console.log("click", node);
        Log.trace(`click index = ${node["index"]}`);
        // Log.trace(`click index = ${node["id"].name}`);

        EventMgr.Instance.emit(GAME_EVENT.SELECTED_COUTRY, node["index"]);
        UIMgr.Instance.removeView(this.node);
    }
}
