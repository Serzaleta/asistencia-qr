const html5QrCode = new Html5Qrcode("reader");
const scannedData = []; // Lista para almacenar los datos escaneados

// Iniciar el escáner
document.getElementById("start-scan").addEventListener("click", () => {
  html5QrCode.start(
    { facingMode: "environment" }, // Usa la cámara trasera
    {
      fps: 10,
      qrbox: 250
    },
    (decodedText) => {
      // Escaneo exitoso
      const timestamp = new Date().toLocaleString();
      const entry = { Código: decodedText, Fecha_Hora: timestamp };

      // Almacenar el dato escaneado si no está repetido
      if (!scannedData.some((data) => data.Código === decodedText)) {
        scannedData.push(entry);
        console.log("Escaneado:", entry);
      }
      document.getElementById("status").innerText = `Último escaneo: ${decodedText}`;
    },
    (error) => {
      console.warn(`Error escaneando: ${error}`);
    }
  ).catch((err) => {
    console.error(`Error al iniciar escáner: ${err}`);
  });
});

// Exportar asistencias a Excel
document.getElementById("export-btn").addEventListener("click", () => {
  if (scannedData.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  // Crear hoja de Excel
  const ws = XLSX.utils.json_to_sheet(scannedData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Asistencias");

  // Descargar el archivo Excel
  XLSX.writeFile(wb, "asistencias.xlsx");
});
