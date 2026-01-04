import { Routes, Route, Link } from 'react-router-dom';
import NotFound from './components/NotFound';
import Login from './components/Auth/Login';
import DashHome from './components/Dashboard/DashHome';
import AddApplication from './components/Dashboard/AddApplication';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<DashHome/>} />
        <Route path="*" element={<NotFound />} />
        <Route path="/test" element={<AddApplication />} />



      </Routes>
    </div>
  );
}

export default App;
