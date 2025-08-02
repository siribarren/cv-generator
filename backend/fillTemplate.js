// Genera el HTML final basado en cv_sermaluc.html
import fs from "fs";

export function fillTemplate(data) {
  let template = fs.readFileSync("cv_sermaluc.html", "utf-8");

  return template
    .replace(/{{NOMBRE}}/g, data.nombre || "")
    .replace(/{{ROL}}/g, data.rol || "")
    .replace(/{{CODIGO_INTERNO}}/g, data.codigo_interno || "")
    .replace(/{{CODIGO_CLIENTE}}/g, data.codigo_cliente || "")
    .replace(/{{RESUMEN}}/g, (data.resumen || []).map(p => `<p>${p}</p>`).join(""))
    .replace(/{{HABILIDADES}}/g, (data.habilidades || []).map(h => `<tr><td>${h.habilidad}</td><td>${h.evidencia}</td></tr>`).join(""))
    .replace(/{{TECNOLOGIAS}}/g, (data.tecnologias || []).map(t => `<li>${t}</li>`).join(""))
    .replace(/{{EXPERIENCIAS}}/g, (data.experiencias || []).map(exp => `<div class="experience-block"><strong>${exp.empresa} - ${exp.rol}</strong> (${exp.periodo})<p>${exp.detalle}</p></div>`).join(""))
    .replace(/{{FORMACION}}/g, (data.formacion || []).map(f => `<li>${f}</li>`).join(""))
    .replace(/{{CURSOS}}/g, (data.cursos || []).map(c => `<li>${c}</li>`).join(""));
}
