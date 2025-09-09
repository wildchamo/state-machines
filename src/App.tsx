import { useMachine } from "@xstate/react";
import "./App.css";

import { assign, createMachine } from "xstate";

const feedbackMachine = createMachine({
  context: {
    feedback: "hola, Jose2222!",
  },
  on: {
    "feedback.update": {
      actions: assign({
        feedback: ({ event }) => event.feedback,
      }),
    },
  },
});

function App() {
  const [state, send] = useMachine(feedbackMachine);
  return (
    <>
      <form className="step" onSubmit={(e) => e.preventDefault()}>
        <h2>What can we do better?</h2>
        <textarea
          value={state.context.feedback}
          rows={10}
          onChange={(e) =>
            send({ type: "feedback.update", feedback: e.target.value })
          }
        />
        <button type="submit">Send</button>
      </form>
      <p>{state.context.feedback}</p>
    </>
  );
}

export default App;
