import React from "react";
import AceEditor from "react-ace";
import { PytchAceAutoCompleter } from "../../skulpt-connection/code-completion";

import {
  ActorKind,
  StructuredProgramOps,
  Uuid,
} from "../../model/junior/structured-program";
import { useStoreActions } from "../../store";

import {
  AceEditorT,
  aceControllerMap,
  pendingCursorWarp,
} from "../../skulpt-connection/code-editor";

import { HatBlock } from "./HatBlock";
import classNames from "classnames";

import { useMappedProgram } from "./hooks";

type PytchScriptEditorProps = {
  actorKind: ActorKind;
  actorId: Uuid;
  handlerId: Uuid;
};
export const PytchScriptEditor: React.FC<PytchScriptEditorProps> = ({
  actorKind,
  actorId,
  handlerId,
}) => {
  const handler = useMappedProgram("<PytchScriptEditor>", (program) =>
    StructuredProgramOps.uniqueHandlerByIdGlobally(program, handlerId)
  );

  const setHandlerPythonCode = useStoreActions(
    (actions) => actions.activeProject.setHandlerPythonCode
  );

  const updateCodeText = (code: string) => {
    setHandlerPythonCode({ actorId, handlerId, code });
  };

  const updateControllerMap = (editor: AceEditorT) => {
    const controller = aceControllerMap.set(handlerId, editor);

    const maybeWarpTarget = pendingCursorWarp.acquireIfForHandler(handlerId);
    if (maybeWarpTarget != null) {
      controller.gotoLocation(maybeWarpTarget.lineNo, maybeWarpTarget.colNo);
      controller.focus();
    }
  };

  const nCodeLines = handler.pythonCode.split("\n").length;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const completers = [new PytchAceAutoCompleter() as any];

  return (
    <>
      <div className={classNames("PytchScriptEditor")}>
        <HatBlock
          actorId={actorId}
          actorKind={actorKind}
          handlerId={handlerId}
          event={handler.event}
        />
        <div className="hat-code-spacer" />
        <AceEditor
          mode="python"
          theme="github"
          enableBasicAutocompletion={completers}
          value={handler.pythonCode}
          onChange={updateCodeText}
          name={`ace-${handler.id}`}
          onLoad={updateControllerMap}
          fontSize={15}
          width="100%"
          height="100%"
          minLines={nCodeLines}
          maxLines={nCodeLines}
        />
      </div>
    </>
  );
};
