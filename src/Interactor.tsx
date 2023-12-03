import { useEffect, useState } from "react";

interface InteractorProps {
  process: (input: string) => string;
}

interface InteractorState {
  kind: 'ok' | 'error';
  message: string;
  input: string;
}

const key = 'interactor-data';

function Interactor(props: InteractorProps) {
  const [state, setState] = useState<InteractorState>({kind: 'ok', input: '', message: ''});

  useEffect(() => {
    const value = window.localStorage.getItem(key);
    if (value !== null) {
      inputChange(value);
    }
  }, []);

  function inputChange(input: string) {
    window.localStorage.setItem(key, input);
    try {
      const output = props.process(input);
      setState({kind: 'ok', message: output, input});
    }
    catch (e) {
      setState({kind: 'error', message: 'Look in devtools', input});
      throw e;
    }
  }

  return (
    <>
      <textarea onChange={e => inputChange(e.target.value)} value={state.input}></textarea>
      <pre className={`message-${state.kind}`}>
        {state.message}
      </pre>
    </>
  )
}

export default Interactor