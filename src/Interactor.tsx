import { ChangeEvent, useState } from "react";

interface InteractorProps {
  process: (input: string) => string;
}

interface InteractorState {
  kind: 'ok' | 'error';
  message: string
}

function Interactor(props: InteractorProps) {
  const [state, setState] = useState<InteractorState>({kind: 'ok', message: ''});

  function inputChange(e: ChangeEvent<HTMLTextAreaElement>) {
    try {
      const output = props.process(e.target.value);
      setState({kind: 'ok', message: output});
    }
    catch (e) {
      setState({kind: 'error', message: 'Look in devtools'});
      throw e;
    }
  }

  return (
    <>
      <textarea onChange={inputChange}></textarea>
      <pre className={`message-${state.kind}`}>
        {state.message}
      </pre>
    </>
  )
}

export default Interactor