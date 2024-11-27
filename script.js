// Elementos HTML
const readerElement = document.getElementById('reader');
const attendanceList = document.getElementById('attendance-list');
const startScanButton = document.getElementById('start-scan');
const stopScanButton = document.getElementById('stop-scan');
const exportButton = document.getElementById('export-btn');

// Inicializa el escáner QR
let qrScanner = new Html5Qrcode("reader");
let isScanning = false;

// Array para almacenar las asistencias
let attendanceData = [];

// Función para iniciar el escáner
startScanButton.addEventListener('click', () => {
  if (!isScanning) {
    qrScanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          const now = new Date();
          const timestamp = now.toLocaleString();

          // Evita duplicados
          if (!attendanceData.some((entry) => entry.id === decodedText)) {
            attendanceData.push({ id: decodedText, timestamp });
            const listItem = document.createElement('li');
            listItem.textContent = `ID: ${decodedText} - Hora: ${timestamp}`;
            attendanceList.appendChild(listItem);
          }
        },
        (error) => {
          console.error("Error escaneando:", error);
        }
      )
      .then(() => (isScanning = true))
      .catch((err) => console.error("Error al iniciar el escáner:", err));
  }
});

// Función para detener el escáner
stopScanButton.addEventListener('click', () => {
  if (isScanning) {
    qrScanner.stop().then(() => (isScanning = false));
  }
});

// Función para exportar las asistencias como CSV
exportButton.addEventListener('click', () => {
  if (attendanceData.length === 0) {
    alert("No hay asistencias registradas para exportar.");
    return;
  }

  // Generar el contenido del CSV
  const csvContent =
    "data:text/csv;charset=utf-8," +
    ["ID,Hora de Registro"]
      .concat(attendanceData.map((entry) => `${entry.id},${entry.timestamp}`))
      .join("\n");

  // Crear un enlace para descargar el archivo
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "asistencias.csv");
  document.body.appendChild(link);

  // Simular el clic para descargar
  link.click();
  document.body.removeChild(link);
});
