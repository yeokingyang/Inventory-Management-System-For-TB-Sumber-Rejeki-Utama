import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Dashboard from "./pages/dashboard";
import Items from "./pages/items";
import Users from "./pages/users";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/" element={<Login/>}/>
        <Route path="/users" element={<Users/>}/>
        <Route path="/items" element={<Items/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
