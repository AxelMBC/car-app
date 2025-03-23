import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Vehiculo {
  id: number;
  tipo: string;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  imagen?: string;
}

const VehiculoDetail = () => {
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedVehiculo, setEditedVehiculo] = useState<Vehiculo | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8080/vehiculos/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setVehiculo(data.data);
        setEditedVehiculo(data.data);
      })
      .catch((error) => console.error("Error al obtener datos:", error));
  }, [id]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedVehiculo((prev) => prev ? {
      ...prev,
      [name]: name === "anio" ? parseInt(value) || 0 : value,
    } : null);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedVehiculo) return;

    fetch(`http://localhost:8080/vehiculos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedVehiculo),
    })
      .then((res) => res.json())
      .then(() => {
        setVehiculo(editedVehiculo);
        setIsEditing(false);
      })
      .catch((error) => console.error("Error al actualizar vehículo:", error));
  };

  const handleDelete = () => {
    if (!window.confirm("¿Estás seguro de eliminar este vehículo?")) return;

    fetch(`http://localhost:8080/vehiculos/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        navigate("/");
      })
      .catch((error) => console.error("Error al eliminar vehículo:", error));
  };

  if (!vehiculo || !editedVehiculo) {
    return (
      <div className="container-fluid px-4 py-5 brutalist-container">
        <h2 className="brutalist-title">CARGANDO...</h2>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-5 brutalist-container">
      <button 
        className="brutalist-button mb-4"
        onClick={() => navigate("/")}
      >
        ← VOLVER
      </button>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="brutalist-card detail-card">
            <div className="image-container detail-image">
              <img
                src={vehiculo.imagen || "https://via.placeholder.com/600x400"}
                alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                className="vehicle-image"
              />
            </div>
            <div className="card-content">
              {isEditing ? (
                <form onSubmit={handleEditSubmit}>
                  <input
                    type="text"
                    name="marca"
                    value={editedVehiculo.marca}
                    onChange={handleEditChange}
                    className="brutalist-input mb-3"
                    required
                  />
                  <input
                    type="text"
                    name="modelo"
                    value={editedVehiculo.modelo}
                    onChange={handleEditChange}
                    className="brutalist-input mb-3"
                    required
                  />
                  <input
                    type="text"
                    name="tipo"
                    value={editedVehiculo.tipo}
                    onChange={handleEditChange}
                    className="brutalist-input mb-3"
                    required
                  />
                  <input
                    type="number"
                    name="anio"
                    value={editedVehiculo.anio}
                    onChange={handleEditChange}
                    className="brutalist-input mb-3"
                  />
                  <input
                    type="text"
                    name="color"
                    value={editedVehiculo.color}
                    onChange={handleEditChange}
                    className="brutalist-input mb-3"
                  />
                  <input
                    type="text"
                    name="imagen"
                    value={editedVehiculo.imagen || ""}
                    onChange={handleEditChange}
                    className="brutalist-input mb-3"
                    placeholder="URL IMAGEN (OPCIONAL)"
                  />
                  <div className="d-flex gap-3">
                    <button type="submit" className="brutalist-button">
                      GUARDAR
                    </button>
                    <button
                      type="button"
                      className="brutalist-button cancel"
                      onClick={() => setIsEditing(false)}
                    >
                      CANCELAR
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="vehicle-title detail-title">
                    {vehiculo.marca} {vehiculo.modelo}
                  </h3>
                  <div className="vehicle-specs detail-specs">
                    <p>ID: {vehiculo.id}</p>
                    <p>TIPO: {vehiculo.tipo}</p>
                    <p>AÑO: {vehiculo.anio}</p>
                    <p>COLOR: {vehiculo.color}</p>
                  </div>
                  <div className="d-flex gap-3 mt-4">
                    <button
                      className="brutalist-button"
                      onClick={() => setIsEditing(true)}
                    >
                      EDITAR
                    </button>
                    <button
                      className="brutalist-button delete"
                      onClick={handleDelete}
                    >
                      ELIMINAR
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehiculoDetail;