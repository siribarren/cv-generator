export default function CandidatesTable({ candidates, onSelect, onNext }) {
  return (
    <div>
      <h2>Resultados del análisis de CVs</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Seleccionar</th>
            <th>Candidato</th>
            <th>Rol</th>
            <th>Match</th>
            <th>Puntos Fuertes</th>
            <th>Puntos Débiles</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c, i) => (
            <tr key={i}>
              <td><input type="checkbox" /></td>
              <td>{c.nombre}</td>
              <td>{c.rol}</td>
              <td>{c.match}%</td>
              <td>{c.puntos_fuertes.join(', ')}</td>
              <td>{c.puntos_debiles.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onNext}>Construir CV Preliminar</button>
    </div>
  )
}
