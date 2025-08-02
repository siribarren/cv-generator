import fs from "fs";

export function fillTemplate(data) {
  let template = fs.readFileSync("cv_sermaluc.html", "utf-8");

  // Reemplazos dinámicos
  return template
    .replace(/Nombre/g, data.nombre || "")
    .replace(/Rol o Cargo/g, data.rol || "")
    .replace(/Lorem ipsum[^<]*/g, (data.resumen || []).join(" "))
    .replace(
      /<span class="tech-item">[^<]*<\/span>/g,
      (data.tecnologias || [])
        .map(t => `<span class="tech-item">${t}</span>`)
        .join("\n")
    )
    .replace(
      /<tr style="border-bottom: 0.5px solid #ccc;">[\s\S]*?<\/tr>/g,
      (data.habilidades || [])
        .map(
          h => `<tr>
        <td style="padding: 12px 8px; border-bottom: 0.5px solid #ccc; border-right: 0.5px solid #ccc;">${h.habilidad}</td>
        <td style="padding: 8px; border-bottom: 0.5px solid #ccc;">${h.evidencia}</td>
      </tr>`
        )
        .join("\n")
    )
    .replace(
      /<div class="experience-block">[\s\S]*?<\/div>/g,
      (data.experiencias || [])
        .map(
          exp => `<div class="experience-block">
        <p><strong>${exp.empresa}</strong> – ${exp.rol} <em>– ${exp.periodo}</em></p>
        <p>${exp.detalle}</p>
        <p><strong>Herramientas:</strong> ${(exp.herramientas || []).join(", ")}</p>
      </div>`
        )
        .join("\n")
    )
    .replace(
      /<ul>[\s\S]*?<\/ul>/,
      `<ul>${(data.formacion || [])
        .map(f => `<li><strong>${f}</strong></li>`)
        .join("\n")}</ul>`
    );
}
