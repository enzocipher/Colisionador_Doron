// app.js
const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const process = require('process');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const FLAG = process.env.FLAG || 'flag{dummy}';

function sha1hex(buffer) {
  return crypto.createHash('sha1').update(buffer).digest('hex');
}

// Página única con frontend embebido
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Doron Colisionador de Mundos</title>
  <style>
    body { font-family: 'Segoe UI', Arial; background: #181c20; color: #f2f2f2;
           display: flex; flex-direction: column; align-items: center; min-height: 100vh; margin: 0; }
    h2 { margin-top: 40px; color: #ffb347; letter-spacing: 2px; text-shadow: 1px 1px 4px #000; }
    form { background: #23272b; padding: 24px 32px; border-radius: 12px; margin-top: 24px;
           display: flex; flex-direction: column; gap: 16px; min-width: 320px; max-width: 400px; }
    input[type="file"], input[type="submit"] { padding: 8px; border-radius: 6px; }
    input[type="submit"] { background: #ffb347; color: #23272b; border: none; font-weight: bold; cursor: pointer; }
    input[type="submit"]:hover { background: #ff9900; }
    #resultado { background: #23272b; margin-top: 32px; padding: 18px 24px; border-radius: 10px;
                 color: #ffb347; font-size: 1.1em; max-width: 400px; word-break: break-all; display: none; }
    pre { background: #181c20; color: #f2f2f2; padding: 10px; border-radius: 6px; overflow-x: auto; }
  </style>
</head>
<body>
  <h2>Doron Colisionador de Mundos</h2>
  <form id="uploadForm">
    <label>Archivo 1:</label>
    <input type="file" name="file1" required>
    <label>Archivo 2:</label>
    <input type="file" name="file2" required>
    <input type="submit" value="Verificar">
  </form>
  <div id="resultado">
    <h3>Resultado:</h3>
    <pre id="resultText"></pre>
  </div>
  <script>
    const form = document.getElementById("uploadForm");
    const resultDiv = document.getElementById("resultado");
    const resultText = document.getElementById("resultText");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      try {
        const res = await fetch("/check", { method: "POST", body: formData });
        const text = await res.text();
        resultText.textContent = text;
        resultDiv.style.display = "block";
      } catch (err) {
        resultText.textContent = "Error: " + err;
        resultDiv.style.display = "block";
      }
    });
  </script>
</body>
</html>`);
});

// Endpoint que procesa archivos
app.post('/check', upload.fields([{ name: 'file1' }, { name: 'file2' }]), (req, res) => {
  const f1 = req.files?.file1?.[0];
  const f2 = req.files?.file2?.[0];
  if (!f1 || !f2) return res.send('Por favor sube ambos archivos.');

  const buf1 = f1.buffer;
  const buf2 = f2.buffer;

  if (Buffer.compare(buf1, buf2) === 0) {
    return res.send('Entonces..... son iguales: flag{prq_el_formato_es_distinto}');
  }

  const h1 = sha1hex(buf1);
  const h2 = sha1hex(buf2);
  let result = \`Archivo 1: \${h1}\\nArchivo 2: \${h2}\\n\`;
  if (h1 === h2) {
    result += FLAG;
  } else {
    result += 'Dos archivos totalmente diferentes.';
  }
  res.type('text/plain').send(result);
});

const port = parseInt(process.env.PORT || '3000', 10);
app.listen(port, () => {
  console.log(\`Servidor corriendo en http://localhost:\${port}\`);
});
