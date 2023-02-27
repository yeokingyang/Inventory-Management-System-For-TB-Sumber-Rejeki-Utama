import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Additem from "./pages/additem";
import Adduser from "./pages/adduser";
import Dashboard from "./pages/dashboard";
import Edititem from "./pages/edititem";
import Edituser from "./pages/edituser";
import Items from "./pages/items";
import Users from "./pages/users";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/" element={<Login/>}/>
        <Route path="/users" element={<Users/>}/>
        <Route path="/users/add" element={<Adduser/>}/>
        <Route path="/users/edit/:id" element={<Edituser/>}/>
        <Route path="/items" element={<Items/>}/>
        <Route path="/items/add" element={<Additem/>}/>
        <Route path="/items/edit/:id" element={<Edititem/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
