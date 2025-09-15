import os
import hashlib
from flask import Flask, request, render_template

flag = os.getenv("FLAG", "flag{dummy}")  
app = Flask(__name__, template_folder="templates")

def sha1_bytes(data):
    return hashlib.sha1(data).hexdigest()

@app.route('/', methods=['GET', 'POST'])
def index():
    result = None
    if request.method == 'POST':
        file1 = request.files.get('file1')
        file2 = request.files.get('file2')
        if not file1 or not file2:
            result = "Por favor sube ambos archivos."
        else:
            data1 = file1.read()
            data2 = file2.read()
            if data1 == data2:
                result = "Entonces..... son iguales: flag{prq_el_formato_es_distinto}"
            else:
                doron1 = sha1_bytes(data1)
                doron2 = sha1_bytes(data2)
                result = f"Archivo 1: {doron1}\nArchivo 2: {doron2}\n"
                if doron1 == doron2:
                    result += flag
                else:
                    result += "Dos archivos totalmente diferentes."
    return render_template("form.html", result=result)

if __name__ == "__main__":
    port = int(os.getenv("PORT", "4567"))  # usa PORT del env o 4567 por defecto
    app.run(host="0.0.0.0", port=port, debug=True)
