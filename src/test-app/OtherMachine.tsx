import { identity } from "lodash";
import React from "react";
import { createMachine } from "xstate";

import {
  buildSelectors,
  buildView,
  buildXStateTreeMachine,
  PickEvent,
} from "../";
import { RoutingEvent } from "../routing";

import { settingsRoute } from "./routes";

declare global {
  interface XstateTreeEvents {
    DO_THE_THING: { type: "DO_THE_THING" };
    GO_TO_DO_THE_THING_STATE: { type: "GO_TO_DO_THE_THING_STATE" };
  }
}
type Events =
  | PickEvent<"DO_THE_THING" | "GO_TO_DO_THE_THING_STATE">
  | RoutingEvent<typeof settingsRoute>;
const machine = createMachine<unknown, Events>({
  id: "other",
  initial: "awaitingRoute",
  states: {
    awaitingRoute: {
      on: {
        GO_SETTINGS: "idle",
      },
    },
    idle: {
      on: {
        GO_TO_DO_THE_THING_STATE: "doTheThing",
      },
    },
    doTheThing: {
      on: {
        DO_THE_THING: "idle",
      },
    },
  },
});

const selectors = buildSelectors(machine, (_ctx, canHandleEvent) => ({
  canDoTheThing: canHandleEvent({ type: "DO_THE_THING" }),
}));
const view = buildView(machine, selectors, identity, [], ({ selectors }) => {
  return (
    <>
      <p data-testid="can-do-the-thing">
        {selectors.canDoTheThing ? "true" : "false"}
      </p>
      <p data-testid="other-text">Other</p>
    </>
  );
});

export const OtherMachine = buildXStateTreeMachine(machine, {
  view,
  slots: [],
  actions: identity,
  selectors,
});
