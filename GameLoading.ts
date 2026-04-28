import { BlockInputEvents, Component, Label, Node, Prefab, ProgressBar, SpriteFrame, Tween, find, sp, tween, v3 } from "cc";
import { BundleEnum, SceneEnum } from "./Const";
import { ResMgr } from "../Frameworks/Manager/ResMgr";
import { AppLayer, GameApp } from "./GameApp";
import { IWinParam, UIMgr } from "../Frameworks/Manager/UIMgr";
import { HallScene } from "./Hall/HallScene";
import { GameScene } from "./Game/GameScene";
import { LoginScene } from "./Login/LoginScene";
import { PokerMgr } from "./Game/Views/PokerMgr";
import { BundleConfig } from "../Config/BundleConfig";
import { UIUtils } from "../Frameworks/Utils/UIUtils";
import GlobalModel from "../Frameworks/Model/GlobalModel";


export class GameLoading extends Component {
    public static Instance: GameLoading = null;

    private UILoading: Node = null;
    private UIWaiting: Node = null;
    private pgBar: Node = null;
    private lbProgress: Label = null;

    private nodeAni: any = null;
    private nodeAni1: any = null;
    private mNodeLoading: Node = null;

    protected onLoad(): void {
        if (GameLoading.Instance === null) {
            GameLoading.Instance = this;
        } else {
            this.destroy();
            return;
        }
        this.initView()
    }
    private async initView() {
        this.UILoading = find("UILoading", this.node);
        this.UIWaiting = find("UIWaiting", this.node);
        this.pgBar = find("UILoading/ProgressBar", this.node);
        this.lbProgress = find("UILoading/Label", this.node).getComponent(Label);
        this.node.getComponent(BlockInputEvents).enabled = false;
    }

    async showLoading(isShowLoading : boolean = true) {
        if (this.UILoading.active) {
            return
        }

        if(isShowLoading){
            this.UIWaiting.active = true
            if (!this.mNodeLoading)
                this.mNodeLoading = await UIUtils.addSpineAnim({
                abName: BundleConfig.BundleEnum.Anim,
                path: "jiazaijiemian",
                parent: this.UIWaiting
            })
            this.mNodeLoading.getComponent(sp.Skeleton).paused = false;
        }
        this.node.getComponent(BlockInputEvents).enabled = true;
    }
    closeLoading() {
        this.UIWaiting.active = false;
        if (this.mNodeLoading)
            this.mNodeLoading.getComponent(sp.Skeleton).paused = true;
        this.node.getComponent(BlockInputEvents).enabled = false;
    }
    async enterLogin<T>(param_: T, flag_: boolean = false) {
        let prepkg: any = {
            "GUI": {
                assetType: Prefab,
                urls: [
                    "UIPrefab/Login/Login",
                ]
            },
            "Anim": {
                assetType: sp.SkeletonData,
                urls: [
                    "jiazaijiemian",
                ]
            }
        }
        await ResMgr.Instance.preloadResPkg(prepkg, (now: number, total: number) => {
            this.pgBar.getComponent(ProgressBar).progress = now / total;
            this.lbProgress.string = `${((now / total) * 100).toFixed()}%`;
        }, async () => {
            let tview = await UIMgr.Instance.showViewEx(BundleConfig.PrefabEnum.LoginScene)
            tview.addComponent(LoginScene);
            this.UILoading.active = false;

            if (GameApp.Instance.curScene) {
                UIMgr.Instance.removeView(GameApp.Instance.curScene);
                // 移除上个场景的资源
                this.releaseResPkg();
            }
            GameLoading.Instance.closeLoading();
            GameApp.Instance.curScene = tview;
            GameApp.Instance.curSceneName = SceneEnum.login;
        })
    }
    async enterHall<T>(param_: T, flag_: boolean = false) {
        let prepkg: any = {
            "GUI": {
                assetType: Prefab,
                urls: [
                    "UIPrefab/Hall/Hall",
                    "UIPrefab/Hall/Match/MatchMain",
                    "UIPrefab/Hall/Mine/MineMain",
                ]
            },
            "Anim": {
                assetType: sp.SkeletonData,
                urls: [
                    "jiazaijiemian",
                ]
            }
        }
        await ResMgr.Instance.preloadResPkg(prepkg, (now: number, total: number) => {
            this.pgBar.getComponent(ProgressBar).progress = now / total;
            this.lbProgress.string = `${((now / total) * 100).toFixed()}%`;
        }, async () => {
            let tview = await UIMgr.Instance.showViewEx(BundleConfig.PrefabEnum.HallScene, param_, null, false);
            tview.addComponent(HallScene);
            this.UILoading.active = false;
            GameLoading.Instance.closeLoading();
            if (GameApp.Instance.curScene) {
                UIMgr.Instance.removeView(GameApp.Instance.curScene);
                this.releaseResPkg();
            }
            GameApp.Instance.curScene = tview;
            GameApp.Instance.curSceneName = SceneEnum.main;
        })
    }
    async enterGame<T>(param_: T, flag_: boolean = false) {
        let prepkg: any = {
            // "Maps": {
            //     assetType: SpriteFrame,
            //     urls: [
            //         "46"
            //     ]
            // },
            "GUI": {
                assetType: Prefab,
                urls: [
                    "UIPrefab/Game/Game",
                    "UIPrefab/Game/PlayerHead",
                    "UIPrefab/Game/Operate",
                    "UIPrefab/Game/GameRewards",
                    "UIPrefab/Game/Trusteeship",
                ]
            },
            "Anim": {
                assetType: sp.SkeletonData,
                urls: [
                    "jiazaijiemian",
                ]
            }

        }
        // prepkg["Cards"] = {
        //     assetType: SpriteFrame,
        //     urls: PokerMgr.Instance.getPreloadRes()
        // }
        await ResMgr.Instance.preloadResPkg(prepkg, (now: number, total: number) => {
            this.pgBar.getComponent(ProgressBar).progress = now / total;
            this.lbProgress.string = `${((now / total) * 100).toFixed()}%`;
        }, async () => {
            let tview = await UIMgr.Instance.showViewEx(BundleConfig.PrefabEnum.GameScene, param_, null, false);
            tview.addComponent(GameScene);
            this.UILoading.active = false;
            GameLoading.Instance.closeLoading();
            if (GameApp.Instance.curScene) {
                UIMgr.Instance.removeView(GameApp.Instance.curScene);
                this.releaseResPkg();
            }
            GameApp.Instance.curScene = tview;
            GameApp.Instance.curSceneName = SceneEnum.game;
        })

    }
    releaseResPkg() {
        switch (GameApp.Instance.curSceneName) {
            case SceneEnum.login:
                break;
            case SceneEnum.main:
                break;
            case SceneEnum.game:
                break;
        }
    }
}