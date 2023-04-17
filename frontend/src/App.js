import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Additem from "./pages/additem";
import Adduser from "./pages/adduser";
import Dashboard from "./pages/dashboard";
import Edititem from "./pages/edititem";
import Edituser from "./pages/edituser";
import Items from "./pages/items";
import Users from "./pages/users";
import Sellitem from "./pages/sellitem";
import Confirmcheckout from "./pages/confirmcheckout";
import Stockitem from "./pages/stockitem"
import Outgoingitems from "./pages/outgoingitems";
import Editoutgoingitem from "./pages/editoutgoingitem";
import Incomingitems from "./pages/incomingitems";
import Itemdetails from "./pages/itemdetail";
import Confirmcheckin from "./pages/confirmcheckin";
import Editincomingitem from "./pages/editincomingitem";
import Wishlistitem from "./pages/wishlistitem";
import Addwishlistitem from "./pages/addwishlistitem";
import Analytics from "./pages/analytics"
import Editpreprocessdata from "./pages/forecasting/editpreprocessdata"
import Editmodelpredict from "./pages/forecasting/editmodelpredict"
import Report from "./pages/report";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/" element={<Login/>}/>
        <Route path="/users" element={<Users/>}/>
        <Route path="/users/add" element={<Adduser/>}/>
        <Route path="/users/edit/:uuid" element={<Edituser/>}/>
        <Route path="/items" element={<Items/>}/>
        <Route path="/items/add" element={<Additem/>}/>
        <Route path="/items/edit/:iuid" element={<Edititem/>}/>
        <Route path="/itemdetails/:iuid" element={<Itemdetails/>}/>
        <Route path="/wishlistitems" element={<Wishlistitem/>}/>
        <Route path="/wishlistitems/add" element={<Addwishlistitem/>}/>
        <Route path="/incomingitems" element={<Incomingitems/>}/>
        <Route path="/outgoingitems" element={<Outgoingitems/>}/>
        <Route path="/outgoingitems/edit/:id" element={<Editoutgoingitem/>}/>
        <Route path="/incomingitems/edit/:id" element={<Editincomingitem/>}/>
        <Route path="/sellitem" element={<Sellitem/>}/>
        <Route path="/sellitem/checkout" element={<Confirmcheckout/>}/>
        <Route path="/stockitem" element={<Stockitem/>}/>
        <Route path="/stockitem/checkin" element={<Confirmcheckin/>}/>
        <Route path="/analytics" element={<Analytics/>}/>
        <Route path="/analytics/editpreprocessdata" element={<Editpreprocessdata/>}/>
        <Route path="/analytics/modelpredict" element={<Editmodelpredict/>}/>
        <Route path="/report" element={<Report/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
