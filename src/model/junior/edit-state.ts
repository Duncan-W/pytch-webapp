// Model slice for state of how the user is editing a program of
// "per-method" kind.

import { action, Action, computed, Computed, thunk, Thunk } from "easy-peasy";
import { Uuid } from "./structured-program/core-types";
import { StructuredProgram } from "./structured-program/program";
import { IPytchAppModel } from "..";
import { assertNever, propSetterAction } from "../../utils";
import {
  upsertSpriteInteraction,
  UpsertSpriteInteraction,
} from "./upsert-sprite";
import {
  IUpsertHatBlockInteraction,
  upsertHatBlockInteraction,
} from "./upsert-hat-block";
import { LinkedContentKind } from "../linked-content";

export type ActorPropertiesTabKey = "code" | "appearances" | "sounds";
export type InfoPanelTabKey = "output" | "errors";

export type InfoPanelState = "collapsed" | "expanded";

export type ActivityBarTabKey = "helpsidebar" | "lesson";
export type ActivityContentState =
  | { kind: "collapsed" }
  | { kind: "expanded"; tab: ActivityBarTabKey };

// Is there a more DRY way of doing the following?
type ActivityContentFullStateLabel =
  | "collapsed"
  | `expanded-${ActivityBarTabKey}`;

const collapsedActivityContentState: ActivityContentState = {
  kind: "collapsed",
};
const expandedActivityContentState = (
  tab: ActivityBarTabKey
): ActivityContentState => ({
  kind: "expanded",
  tab,
});

type BootData = {
  program: StructuredProgram;
  linkedContentKind: LinkedContentKind;
};

export type EditState = {
  mostRecentFocusedEditor: string;
  setMostRecentFocusedEditor: Action<EditState, string>;

  scriptDragInProgress: boolean;
  setScriptDragInProgress: Action<EditState, boolean>;

  activityContentState: ActivityContentState;
  activityContentFullStateLabel: Computed<
    EditState,
    ActivityContentFullStateLabel
  >;
  collapseActivityContent: Action<EditState>;
  _expandActivityContent: Action<EditState, ActivityBarTabKey>;
  expandActivityContent: Thunk<
    EditState,
    ActivityBarTabKey,
    void,
    IPytchAppModel
  >;

  tutorialChapterScrollTop: number;
  setTutorialChapterScrollTop: Action<EditState, number>;

  focusedActor: Uuid;
  setFocusedActor: Action<EditState, Uuid>;

  /** Delete the actor with the given ID, which should be the same as
   * the focused actor's ID.  This redundancy allows consistency
   * checking.  */
  deleteFocusedActor: Thunk<EditState, Uuid, void, IPytchAppModel>;

  // This needs to be in the model (rather than local to the component)
  // because we need to be able to switch to the "code" tab when an
  // error occurs.
  actorPropertiesActiveTab: ActorPropertiesTabKey;
  setActorPropertiesActiveTab: Action<EditState, ActorPropertiesTabKey>;

  // This needs to be in the model (rather than local to the component)
  // because we need to be able to switch to the "errors" tab when an
  // error occurs.
  infoPanelActiveTab: InfoPanelTabKey;
  setInfoPanelActiveTab: Action<EditState, InfoPanelTabKey>;

  infoPanelState: InfoPanelState;
  setInfoPanelState: Action<EditState, InfoPanelState>;
  toggleInfoPanelState: Action<EditState>;

  expandAndSetActive: Thunk<EditState, InfoPanelTabKey>;

  bootForProgram: Thunk<EditState, BootData>;

  assetReorderInProgress: boolean;
  setAssetReorderInProgress: Action<EditState, boolean>;

  upsertSpriteInteraction: UpsertSpriteInteraction;
  upsertHatBlockInteraction: IUpsertHatBlockInteraction;
};

export const editState: EditState = {
  mostRecentFocusedEditor: "",
  setMostRecentFocusedEditor: propSetterAction("mostRecentFocusedEditor"),

  scriptDragInProgress: false,
  setScriptDragInProgress: propSetterAction("scriptDragInProgress"),

  activityContentState: collapsedActivityContentState,
  activityContentFullStateLabel: computed((state) => {
    const activityState = state.activityContentState;
    switch (activityState.kind) {
      case "collapsed":
        return "collapsed" as const;
      case "expanded":
        return `expanded-${activityState.tab}` as const;
      default:
        return assertNever(activityState);
    }
  }),
  collapseActivityContent: action((state) => {
    state.activityContentState = collapsedActivityContentState;
  }),
  _expandActivityContent: action((state, tab) => {
    state.activityContentState = expandedActivityContentState(tab);
  }),
  expandActivityContent: thunk((actions, tab, helpers) => {
    actions._expandActivityContent(tab);
    // TODO: Is there a way to do this more cleanly?
    if (tab === "helpsidebar") {
      helpers.getStoreActions().ideLayout.helpSidebar.hideAllContent();
    }
  }),

  tutorialChapterScrollTop: 0,
  setTutorialChapterScrollTop: propSetterAction("tutorialChapterScrollTop"),

  focusedActor: "",
  setFocusedActor: action((state, focusedActor) => {
    state.focusedActor = focusedActor;
    state.mostRecentFocusedEditor = "";
  }),

  deleteFocusedActor: thunk((actions, actorId, helpers) => {
    const focusedActorId = helpers.getState().focusedActor;
    if (actorId !== focusedActorId) {
      throw new Error(
        `trying to delete actor ${actorId}` +
          ` but actor ${focusedActorId} is focused`
      );
    }

    const newFocusedActorId = helpers
      .getStoreActions()
      .activeProject.deleteSprite(actorId);

    actions.setFocusedActor(newFocusedActorId);
  }),

  actorPropertiesActiveTab: "code",
  setActorPropertiesActiveTab: propSetterAction("actorPropertiesActiveTab"),

  infoPanelActiveTab: "output",
  setInfoPanelActiveTab: propSetterAction("infoPanelActiveTab"),

  infoPanelState: "expanded",
  setInfoPanelState: propSetterAction("infoPanelState"),
  toggleInfoPanelState: action((state) => {
    state.infoPanelState =
      state.infoPanelState === "collapsed" ? "expanded" : "collapsed";
  }),

  expandAndSetActive: thunk((actions, tabKey) => {
    actions.setInfoPanelState("expanded");
    actions.setInfoPanelActiveTab(tabKey);
  }),

  bootForProgram: thunk((actions, { program, linkedContentKind }) => {
    // Where is the right place to enforce the invariant that the [0]th
    // actor must be of kind "stage"?
    const stage = program.actors[0];
    actions.setFocusedActor(stage.id);

    actions.setActorPropertiesActiveTab("code");
    actions.setInfoPanelActiveTab("output");
    actions.setInfoPanelState("expanded");
    actions.setMostRecentFocusedEditor("");
    actions.setTutorialChapterScrollTop(0);

    switch (linkedContentKind) {
      case "none":
        actions.expandActivityContent("helpsidebar");
        break;
      case "jr-tutorial":
        actions.expandActivityContent("lesson");
        break;
      case "specimen":
        // Should not happen.
        console.log(
          `unexpected linkedContentKind "specimen" in per-method program`
        );
        break;
      default:
        assertNever(linkedContentKind);
    }
  }),

  assetReorderInProgress: false,
  setAssetReorderInProgress: propSetterAction("assetReorderInProgress"),

  upsertSpriteInteraction,
  upsertHatBlockInteraction,
};
