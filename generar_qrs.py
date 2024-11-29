import pandas as pd
import qrcode
import os

# Leer el archivo Excel
file_path = "alumnos.xlsx"  # Cambia al nombre de tu archivo
output_dir = "qrs"  # Carpeta donde se guardarán los QR
os.makedirs(output_dir, exist_ok=True)  # Crear carpeta si no existe

# Cargar los datos del archivo Excel
data = pd.read_excel(file_path)

# Iterar por cada fila del archivo y generar un QR
for index, row in data.iterrows():
    # Crear el contenido del QR con los datos del alumno
    qr_content = f"id={row['id']}&nombre={row['nombre']}&grupo={row['grupo']}&hora_entrada={row['hora_entrada']}"
    
    # Generar el código QR
    qr = qrcode.make(qr_content)
    
    # Guardar el QR con el ID del alumno como nombre
    qr.save(os.path.join(output_dir, f"{row['id']}_qr.png"))

print(f"Códigos QR generados en la carpeta: {output_dir}")
