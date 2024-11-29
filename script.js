const html5QrCode = new Html5Qrcode("reader");
const scannedData = []; // Lista para almacenar los datos escaneados

// Función para iniciar el escáner
function startScanner() {
  // Verifica las cámaras disponibles
  navigator.mediaDevices.enumerateDevices()
    .then((devices) => {
      const videoDevices = devices.filter(device => device.kind === "videoinput");
      if (videoDevices.length === 0) {
        console.error("No se encontraron cámaras disponibles.");
        alert("No se encontraron cámaras. Asegúrate de que estén conectadas o habilitadas.");
        return;
      }

      console.log("Cámaras disponibles:", videoDevices);

      // Intenta usar la cámara trasera, si está disponible
      const cameraId = videoDevices.length > 1 ? videoDevices[1].deviceId : videoDevices[0].deviceId;

      html5QrCode.start(
        { deviceId: { exact: cameraId } }, // Configuración para usar una cámara específica
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
        console.error(`Error al iniciar el escáner: ${err}`);
        alert("No se pudo iniciar el escáner. Verifica los permisos de la cámara.");
      });
    })
    .catch((err) => {
      console.error("Error enumerando dispositivos:", err);
      alert("Error al enumerar cámaras. Verifica los permisos y la configuración del dispositivo.");
    });
}

// Botón para iniciar el escáner
document.getElementById("start-scan").addEventListener("click", startScanner);

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
