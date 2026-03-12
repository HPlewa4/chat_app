import React from 'react';
import Test from './Components/Test';
import AllChats from './Components/AllChats';
import ChatWindow from './Components/ChatWindow';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* <Test/> */}
      <AllChats/>
      <ChatWindow/>
    </div>
  );
}

export default App;
