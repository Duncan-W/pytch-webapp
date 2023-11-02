import { Action, action, Thunk, thunk } from "easy-peasy";
import { PytchAppModelActions } from "..";
import { IModalUserInteraction, modalUserInteraction } from ".";
import { ICreateProjectDescriptor, ProjectTemplateKind } from "../projects";
import { WhetherExampleTag } from "../project-templates";
import { PytchProgramKind } from "../pytch-program";
import { propSetterAction } from "../../utils";

type ICreateProjectBase = IModalUserInteraction<ICreateProjectDescriptor>;

interface ICreateProjectSpecific {
  name: string;
  setName: Action<ICreateProjectSpecific, string>;

  whetherExample: WhetherExampleTag;
  setWhetherExample: Action<ICreateProjectSpecific, WhetherExampleTag>;
  editorKind: PytchProgramKind;
  setEditorKind: Action<ICreateProjectSpecific, PytchProgramKind>;

  refreshInputsReady: Thunk<ICreateProjectBase & ICreateProjectSpecific>;
  launch: Thunk<ICreateProjectBase & ICreateProjectSpecific, void>;
}

const attemptCreate = async (
  actions: PytchAppModelActions,
  descriptor: ICreateProjectDescriptor
) => {
  const createNewProject = actions.projectCollection.createNewProject;
  const newProject = await createNewProject(descriptor);
  actions.navigationRequestQueue.enqueue({ path: `/ide/${newProject.id}` });
};

const createProjectSpecific: ICreateProjectSpecific = {
  name: "",
  setName: action((state, name) => {
    state.name = name;
  }),

  whetherExample: "with-example",
  setWhetherExample: propSetterAction("whetherExample"),
  editorKind: "per-method",
  setEditorKind: propSetterAction("editorKind"),

  refreshInputsReady: thunk((actions, _payload, helpers) => {
    const state = helpers.getState();
    actions.setInputsReady(state.name !== "");
  }),

  launch: thunk((actions) => {
    actions.setName("Untitled project");
    actions.setTemplate("bare-bones");
    actions.superLaunch();
    // TODO: Can we bring refreshInputsReady() into superclass?
    actions.refreshInputsReady();
  }),
};

export type ICreateProjectInteraction = ICreateProjectBase &
  ICreateProjectSpecific;

export const createProjectInteraction = modalUserInteraction(
  attemptCreate,
  createProjectSpecific
);
