import { useState } from 'react';

export default function TestComponent() {
  const [test, setTest] = useState('working');
  
  return (
    <div>
      <h1>Test Component: {test}</h1>
      <button onClick={() => setTest('clicked')}>Click me</button>
    </div>
  );
}