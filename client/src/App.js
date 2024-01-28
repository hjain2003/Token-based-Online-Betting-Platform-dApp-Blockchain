import './App.css';
import Landing from './Landing/Landing';
import { Routes, Route } from 'react-router-dom';
import Main from './Main/Main';
import Betting from './Betting/Betting';

function App() {
  return (
    <>
    <Routes>

      <Route path='/' element={<Landing/>}/>
      <Route path='/main' element={<Main/>}/>
      <Route path='/playerspace' element={<Betting/>}/>
    </Routes>
    </>
  );
}

export default App;
