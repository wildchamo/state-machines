import { useMachine } from "@xstate/react";
import "./App.css";

import { assign, setup } from "xstate";

const feedbackMachine = setup({}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAYkwBsB7WMAbQAYBdRUAB2twBddL8WQAHogAsAJgA0IAJ6IAHAE4AdLIDsAVgC+GyWix5CRRawBOlVK04kAZmEgAjLAGtFUSpQgNmSEO1hcefN5CCMIqSvL0AGyiapIyCKIAjPSKAMzpGZkZwlo6GDgExEam5pY29k6KDh5M-L7+vPzBoeFRMXGIiamiuSC6BQaKVpTGqCQOmI6edRzcjUGIamqpivJJqrHScomKmtp9+fpFw6MksACudqhc0971c4GgwSrCKfTyqeodCAq7slkAnL7fpHQwUaiQEjGOCcdDGTi3NizAJNRCiYSRRTJD5fLY-JQbLT7fDuOD8EGFIgzPwPVEIAC0kW+jN6FMGJjMFmpDUegkQqTUskUokiamim3iETS6lZh0pQxGqG5tIWCFFomF9FSiXaeKl9H+AMyQLyenlnGw6Hwjngd2R8yecjUGvksmEnwliHkKjSRqyJoOZsG4JoEGVKNViXdylEsh1noQUo9RI0QA */
  context: {
    feedback: "",
  },
  initial: "prompt",
  states: {
    prompt: {
      on: {
        "feedback.good": {
          target: "thanks",
        },
        "feedback.bad": {
          target: "form",
        },
      },
    },
    form: {
      on: {
        back: {
          target: "prompt",
        },
        submit: {
          target: "thanks",
        },
        "feedback.update": {
          actions: assign(({ event }) => {
            console.log(event);
            return {
              feedback: event.context.feedback,
            };
          }),
        },
      },
    },
    thanks: {},
    closed: {
      on: {
        restart: {
          target: "prompt",
        },
      },
    },
  },
  on: {
    close: {
      target: ".closed",
    },
  },
});

function App() {
  const [state, send] = useMachine(feedbackMachine);

  const renderComponent = () => {
    switch (state.value) {
      case "prompt":
        return <PromtState send={send} />;
      case "form":
        return <FormState send={send} />;
      case "thanks":
        return <ThanksState />;

      default:
        return null;
    }
  };

  return (
    <>
      <h2>State: {state.value + ""}</h2>
      {renderComponent()}
      <p>{JSON.stringify(state, null, 2)}</p>
    </>
  );
}

function PromtState({ send }: { send: any }) {
  function sendFeedback(type: "good" | "bad") {
    send({ type: "feedback." + type });
  }

  return (
    <section>
      <h2>How was your experience?</h2>
      <button type="button" onClick={() => sendFeedback("good")}>
        Good
      </button>
      <button type="button" onClick={() => sendFeedback("bad")}>
        Bad
      </button>
    </section>
  );
}

function ThanksState() {
  return (
    <section>
      <h2>Thank you for your feedback!</h2>
    </section>
  );
}
function FormState({ send }: { send: any }) {
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    send({
      type: "submit",
      context: { feedback: event.currentTarget.feedback.value },
    });
  }
  return (
    <section>
      <h2>What can we do better?</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          name="feedback"
          rows={4}
          onChange={(event) =>
            send({
              type: "feedback.update",
              context: { feedback: event.currentTarget.value },
            })
          }
        />
        <button type="submit">Submit</button>
      </form>
    </section>
  );
}

export default App;
