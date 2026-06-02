import '../../styles/ModalConfirmar.css';

function ModalConfirmar({ abierto, confirmarEliminacion, cancelarEliminacion, entidad }) {
  if (!abierto) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <h3>¿Estás seguro?</h3>
        <p>Esta acción no se puede deshacer. La {entidad} se borrará permanentemente.</p>
        <div className="modal-acciones">
          <button className="btn-cancelar" onClick={cancelarEliminacion}>Cancelar</button>
          <button className="btn-eliminar-confirm" onClick={confirmarEliminacion}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirmar;