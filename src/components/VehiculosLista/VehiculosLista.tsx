import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Counter from "../Counter";

interface Vehiculo {
  id: number;
  tipo: string;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  imagen?: string;
}

const VehiculosList = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newVehiculo, setNewVehiculo] = useState({
    tipo: "",
    marca: "",
    modelo: "",
    anio: 0,
    color: "",
    imagen: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/vehiculos")
      .then((res) => res.json())
      .then((data) => setVehiculos(data.data))
      .catch((error) => console.error("Error al obtener datos:", error));
  }, []);

  const handleCardClick = (id: number) => {
    navigate(`/vehiculo/${id}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewVehiculo((prev) => ({
      ...prev,
      [name]: name === "anio" ? parseInt(value) || 0 : value,
    }));
  };

  const handleCancelar = () => {
    setShowModal(false);
    setNewVehiculo({
      tipo: "",
      marca: "",
      modelo: "",
      anio: 0,
      color: "",
      imagen: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("http://localhost:8080/vehiculos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newVehiculo),
    })
      .then((res) => res.json())
      .then((data) => {
        setVehiculos([...vehiculos, data.data]);
        setShowModal(false);
        setNewVehiculo({
          tipo: "",
          marca: "",
          modelo: "",
          anio: 0,
          color: "",
          imagen: "",
        });
      })
      .catch((error) => console.error("Error al agregar vehículo:", error));
  };

  return (
    <div className="container-fluid px-4 py-5 brutalist-container">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="brutalist-title">VEHÍCULOS</h2>
        <button className="brutalist-button" onClick={() => setShowModal(true)}>
          + NUEVO VEHÍCULO
        </button>
      </div>
      <Counter />
      <div className="row g-4">
        {vehiculos.map((vehiculo) => (
          <div key={vehiculo.id} className="col-md-4 col-sm-6 col-12">
            <div
              className="brutalist-card"
              onClick={() => handleCardClick(vehiculo.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="image-container">
                <img
                  src={vehiculo.imagen || "https://via.placeholder.com/300x200"}
                  alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                  className="vehicle-image"
                />
              </div>
              <div className="card-content">
                <h3 className="vehicle-title">
                  {vehiculo.marca} {vehiculo.modelo}
                </h3>
                <div className="vehicle-specs">
                  <p>TIPO: {vehiculo.tipo}</p>
                  <p>AÑO: {vehiculo.anio}</p>
                  <p>COLOR: {vehiculo.color}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="brutalist-modal">
          <div className="brutalist-modal-content">
            <h3 className="vehicle-title">AGREGAR VEHÍCULO</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="tipo"
                placeholder="TIPO"
                value={newVehiculo.tipo}
                onChange={handleInputChange}
                className="brutalist-input"
                required
              />
              <input
                type="text"
                name="marca"
                placeholder="MARCA"
                value={newVehiculo.marca}
                onChange={handleInputChange}
                className="brutalist-input"
                required
              />
              <input
                type="text"
                name="modelo"
                placeholder="MODELO"
                value={newVehiculo.modelo}
                onChange={handleInputChange}
                className="brutalist-input"
                required
              />
              <input
                type="number"
                name="anio"
                placeholder="AÑO"
                value={newVehiculo.anio || ""}
                onChange={handleInputChange}
                className="brutalist-input"
              />
              <input
                type="text"
                name="color"
                placeholder="COLOR"
                value={newVehiculo.color}
                onChange={handleInputChange}
                className="brutalist-input"
              />
              <input
                type="text"
                name="imagen"
                placeholder="URL IMAGEN (OPCIONAL)"
                value={newVehiculo.imagen}
                onChange={handleInputChange}
                className="brutalist-input"
              />
              <div className="d-flex gap-3 mt-4">
                <button type="submit" className="brutalist-button">
                  AGREGAR
                </button>
                <button
                  type="button"
                  className="brutalist-button cancel"
                  onClick={() => handleCancelar()}
                >
                  CANCELAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiculosList;
