import ExcelJS from "exceljs";
import { listarIngressosVendidos } from "../repositories/relatorio.repository.js";

export async function exportarIngressosExcel(req, res) {
  const dados = await listarIngressosVendidos();

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Ingressos");

  sheet.columns = [
    { header: "Código Ingresso", key: "codigo_ingresso", width: 25 },
    { header: "Nome", key: "nome", width: 30 },
    { header: "Email", key: "email", width: 30 },
    { header: "CPF", key: "cpf", width: 18 },
    { header: "Telefone", key: "telefone", width: 20 },
    { header: "Pedido ID", key: "pedido_id", width: 36 },
    { header: "Status", key: "status", width: 12 },
    { header: "Data Compra", key: "created_at", width: 22 }
  ];

  sheet.addRows(dados);

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=ingressos.xlsx"
  );

  await workbook.xlsx.write(res);
  res.end();
}
