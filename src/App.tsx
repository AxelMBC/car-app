import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VehiculosList from "./components/VehiculosLista";
import VehiculoDetalles from "./components/VehiculoDetalles";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VehiculosList />} />
        <Route path="/vehiculo/:id" element={<VehiculoDetalles />} />
      </Routes>
    </Router>
  );
}

export default App;