const loginForm = document.getElementById('loginForm');
const mensaje = document.getElementById('mensaje');
const loginSection = document.getElementById('loginSection');
const appSection = document.getElementById('appSection');
const datosUsuario = document.getElementById('datosUsuario');

const tablaFactura = document.getElementById('tablaFactura');
const subtotalElem = document.getElementById('subtotal');
const ivaElem = document.getElementById('iva');
const totalElem = document.getElementById('total');
const limpiarBtn = document.getElementById('limpiarBtn');

let productosFactura = [];

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const usuario = document.getElementById('usuario').value.trim();
    const clave = document.getElementById('clave').value.trim();

    if (!usuario || !clave) {
        mensaje.textContent = 'Por favor completa todos los campos.';
        return;
    }

    loginSection.classList.add('d-none');
    appSection.classList.remove('d-none');

    datosUsuario.innerHTML = `<strong>Usuario conectado:</strong> ${escapeHtml(usuario)} <br><small class="text-muted">Datos de sesion mostrados en pantalla</small>`;
});

function escapeHtml(s){
    return String(s).replace(/[&<>"'`=\/]/g, function (c) {
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','/':'&#47;','`':'&#96;','=':'&#61;'}[c];
    });
}

document.querySelectorAll('.agregarBtn').forEach(btn => {
    btn.addEventListener('click', () => {
        const nombre = btn.dataset.nombre;
        const precio = parseFloat(btn.dataset.precio);

        const existente = productosFactura.find(p => p.nombre === nombre);
        if (existente) {
            existente.cantidad += 1;
        } else {
            productosFactura.push({ nombre, precio, cantidad: 1 });
        }
        actualizarTabla();
    });
});

function actualizarTabla(){
    tablaFactura.innerHTML = '';

    let subtotal = 0;

    productosFactura.forEach((p, index) => {
        const importe = p.precio * p.cantidad;
        subtotal += importe;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <input type="number" min="1" value="${p.cantidad}" class="form-control form-control-sm cantidadInput" data-index="${index}">
            </td>
            <td class="text-start">${escapeHtml(p.nombre)}</td>
            <td>$${p.precio.toFixed(2)}</td>
            <td>$${importe.toFixed(2)}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-warning eliminarUnoBtn mb-1" data-index="${index}">-1</button>
                <button class="btn btn-sm btn-danger eliminarBtn" data-index="${index}">X</button>
            </td>
        `;
        tablaFactura.appendChild(tr);
    });

    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    subtotalElem.textContent = subtotal.toFixed(2);
    ivaElem.textContent = iva.toFixed(2);
    totalElem.textContent = total.toFixed(2);

    document.querySelectorAll('.eliminarBtn').forEach(btn => {
        btn.addEventListener('click', () => {
            const i = parseInt(btn.dataset.index);
            productosFactura.splice(i, 1);
            actualizarTabla();
        });
    });

    document.querySelectorAll('.eliminarUnoBtn').forEach(btn => {
        btn.addEventListener('click', () => {
            const i = parseInt(btn.dataset.index);
            if (productosFactura[i].cantidad > 1) {
                productosFactura[i].cantidad -= 1;
            } else {
                productosFactura.splice(i, 1);
            }
            actualizarTabla();
        });
    });

    document.querySelectorAll('.cantidadInput').forEach(input => {
        input.addEventListener('change', () => {
            const i = parseInt(input.dataset.index);
            let val = parseInt(input.value);
            if (isNaN(val) || val < 1) val = 1;
            productosFactura[i].cantidad = val;
            actualizarTabla();
        });
    });
}

limpiarBtn.addEventListener('click', () => {
    if (!confirm('Deseas vaciar la factura?')) return;
    productosFactura = [];
    actualizarTabla();
});
