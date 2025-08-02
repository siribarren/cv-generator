export default function PreliminaryTable({ candidates, onNext }) {
  return (
    <div>
      <h2>CVs Preliminares</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Candidato</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Ver/Editar</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c, i) => (
            <tr key={i}>
              <td>{c.nombre}</td>
              <td>{c.rol}</td>
              <td>✅ CV Preliminar listo</td>
              <td><a href="#" target="_blank">Abrir</a></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onNext}>Aprobar y Generar CV</button>
    </div>
  )
}
