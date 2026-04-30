import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import InventoryApp from "./inventory/Inventory";
import VendorsDetails from "./inventory/VendorsDetails";


export default function MainApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<InventoryApp />} />
        <Route path="/vendor/:id" element={<VendorsDetails/>}/>
      </Routes>
    </BrowserRouter>
  );
}