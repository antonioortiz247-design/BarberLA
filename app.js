// --- Supabase Configuration ---
// Intenta obtener de variables de entorno (Vercel) o usa las locales por defecto
const SUPABASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'https://krkazlphcjgkvcazbdlj.supabase.co' 
    : (window.NEXT_PUBLIC_SUPABASE_URL || 'https://krkazlphcjgkvcazbdlj.supabase.co');

const SUPABASE_KEY = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtya2F6bHBoY2pna3ZjYXpiZGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMDU4NjgsImV4cCI6MjA5MDY4MTg2OH0.aaFH8ngWsCgyogfmZT1SvNr5OcuoquDV0lQywlwz-AQ'
    : (window.NEXT_PUBLIC_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtya2F6bHBoY2pna3ZjYXpiZGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMDU4NjgsImV4cCI6MjA5MDY4MTg2OH0.aaFH8ngWsCgyogfmZT1SvNr5OcuoquDV0lQywlwz-AQ');

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- State Management ---
let state = {
    view: 'home',
    cart: JSON.parse(localStorage.getItem('barber_cart')) || [],
    booking: null, // Temporary booking during checkout
    allBookings: [], // From Supabase
    services: [], // From Supabase
    products: [], // From Supabase
    isAdmin: sessionStorage.getItem('barber_admin') === 'true'
};

// --- Data Fetching ---
async function fetchData() {
    try {
        // Fetch Services
        const { data: services, error: sError } = await supabase.from('services').select('*').order('id');
        if (sError) throw sError;
        state.services = services;

        // Fetch Products
        const { data: products, error: pError } = await supabase.from('products').select('*').order('id');
        if (pError) throw pError;
        state.products = products;

        // Fetch Bookings (if admin)
        if (state.isAdmin) {
            await fetchBookings();
        }

        renderView();
    } catch (error) {
        console.error('Error fetching data:', error);
        showToast('Error al conectar con la base de datos');
    }
}

async function fetchBookings() {
    const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: true });
    
    if (error) console.error('Error fetching bookings:', error);
    else state.allBookings = bookings;
}

// --- Realtime Subscription ---
function setupRealtime() {
    supabase
        .channel('public:bookings')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, payload => {
            fetchBookings().then(() => {
                if (state.view === 'admin-dash') renderAdminDashboard();
            });
        })
        .subscribe();
}

// --- Navigation ---
function navigateTo(viewId, event) {
    if (event) event.preventDefault();
    
    if (viewId === 'admin-dash' && !state.isAdmin) {
        viewId = 'admin-login';
    }
    
    state.view = viewId;
    
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        const onclickAttr = item.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`'${viewId}'`)) {
            item.classList.add('active');
        }
    });

    window.scrollTo(0, 0);
    renderView();
}

// --- Render Logic ---
function renderView() {
    switch (state.view) {
        case 'home': renderHome(); break;
        case 'servicios': renderServices(); break;
        case 'tienda': renderStore(); break;
        case 'carrito': renderCart(); break;
        case 'checkout': renderCheckout(); break;
        case 'admin-dash': renderAdminDashboard(); break;
    }
    updateCartBadge();
}

function renderAdminDashboard() {
    // 1. Render Services Prices
    const servicesList = document.getElementById('admin-services-list');
    servicesList.innerHTML = state.services.map(s => `
        <div class="form-group" style="margin-bottom: 1rem">
            <label style="color: var(--text); font-size: 0.9rem">${s.name}</label>
            <div style="display: flex; gap: 0.5rem; align-items: center">
                <span style="color: var(--gold)">$</span>
                <input type="number" class="service-price-input" data-id="${s.id}" value="${s.price}" style="padding: 0.5rem">
            </div>
        </div>
    `).join('');

    // 2. Render Scheduled Bookings
    const bookingsList = document.getElementById('admin-bookings-list');
    if (state.allBookings.length === 0) {
        bookingsList.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 1rem">No hay citas agendadas.</p>`;
    } else {
        bookingsList.innerHTML = state.allBookings.map(b => {
            const service = state.services.find(s => s.id == b.service_id);
            const statusColor = b.status === 'Confirmada' ? 'var(--success)' : (b.status === 'Cancelada' ? 'var(--danger)' : 'var(--gold)');
            return `
                <div class="card" style="margin-bottom: 0.8rem; border-color: ${statusColor}; padding: 0.8rem">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start">
                        <div style="flex: 1">
                            <div style="display: flex; justify-content: space-between; align-items: center">
                                <h4 style="font-size: 0.95rem; color: var(--gold)">${b.name}</h4>
                                <span style="font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 20px; background: ${statusColor}; color: #000; font-weight: 800">${b.status}</span>
                            </div>
                            <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0.2rem 0">
                                <i class="fas fa-cut"></i> ${service ? service.name : 'Servicio desconocido'}
                            </p>
                            <p style="font-size: 0.8rem; color: var(--text)">
                                <i class="fas fa-calendar"></i> ${b.date} | <i class="fas fa-clock"></i> ${b.time}
                            </p>
                            <p style="font-size: 0.8rem; color: var(--text-muted)">
                                <i class="fab fa-whatsapp"></i> ${b.phone}
                            </p>
                            ${b.proof ? `
                                <div style="margin-top: 0.5rem">
                                    <button class="btn btn-outline" style="padding: 0.3rem; font-size: 0.7rem; width: auto" onclick="viewProof('${b.proof}')">
                                        <i class="fas fa-eye"></i> Ver Comprobante
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <div style="display: flex; gap: 0.5rem; margin-top: 1rem">
                        <button class="btn btn-primary" onclick="confirmAndNotify(${b.id})" style="padding: 0.4rem; font-size: 0.7rem; background: var(--success); color: #000">Confirmar & Notificar</button>
                        <button class="btn btn-outline" onclick="updateBookingStatus(${b.id}, 'Cancelada')" style="padding: 0.4rem; font-size: 0.7rem; border-color: var(--danger); color: var(--danger)">Cancelar</button>
                        <button onclick="deleteBooking(${b.id})" style="background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 0.5rem">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // 3. Render Product Management
    const productsList = document.getElementById('admin-products-list');
    productsList.innerHTML = state.products.map(p => `
        <div class="card" style="margin-bottom: 1rem; border-color: #333">
            <div style="display: flex; gap: 1rem; align-items: center">
                <img src="${p.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px">
                <div style="flex: 1">
                    <input type="text" class="edit-prod-name" data-id="${p.id}" value="${p.name}" 
                           style="padding: 0.3rem; margin-bottom: 0.3rem; font-size: 0.9rem; background: transparent; border: 1px solid #444">
                    <div style="display: flex; align-items: center; gap: 0.5rem">
                        <span style="color: var(--gold); font-size: 0.8rem">$</span>
                        <input type="number" class="edit-prod-price" data-id="${p.id}" value="${p.price}" 
                               style="padding: 0.3rem; width: 80px; font-size: 0.8rem; background: transparent; border: 1px solid #444">
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.5rem">
                    <button class="btn btn-primary" onclick="updateProduct(${p.id})" style="padding: 0.4rem; width: auto; font-size: 0.7rem">
                        <i class="fas fa-save"></i>
                    </button>
                    <button class="btn btn-outline" onclick="deleteProduct(${p.id})" style="padding: 0.4rem; width: auto; font-size: 0.7rem; border-color: var(--danger); color: var(--danger)">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

async function saveServicePrices() {
    const inputs = document.querySelectorAll('.service-price-input');
    for (const input of inputs) {
        const id = parseInt(input.dataset.id);
        const newPrice = parseFloat(input.value);
        if (!isNaN(newPrice)) {
            await supabase.from('services').update({ price: newPrice }).eq('id', id);
        }
    }
    showToast('Precios actualizados');
    fetchData();
}

function renderHome() {
    const featServices = state.services.filter(s => s.featured);
    const featProducts = state.products.filter(p => p.featured);
    
    document.getElementById('featured-services').innerHTML = featServices.map(s => `
        <div class="card service-item" onclick="selectServiceForBooking(${s.id})">
            <div class="info">
                <h4>${s.name}</h4>
                <p><i class="fas fa-clock"></i> ${s.duration}</p>
            </div>
            <div class="price">$${s.price}</div>
        </div>
    `).join('');

    document.getElementById('featured-products').innerHTML = featProducts.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}">
            <div class="product-info">
                <h4>${p.name}</h4>
                <div class="summary-line">
                    <span class="price">$${p.price}</span>
                    <button class="btn btn-primary" style="padding: 0.5rem; width: auto" onclick="addToCart(${p.id})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderServices() {
    document.getElementById('services-list').innerHTML = state.services.map(s => `
        <div class="card service-item">
            <div class="info">
                <h4>${s.name}</h4>
                <p>${s.duration}</p>
            </div>
            <div style="text-align: right">
                <div class="price" style="margin-bottom: 0.5rem">$${s.price}</div>
                <button class="btn btn-outline" style="padding: 0.4rem 1rem; width: auto; font-size: 0.7rem" onclick="selectServiceForBooking(${s.id})">Reservar</button>
            </div>
        </div>
    `).join('');
}

function renderStore() {
    document.getElementById('store-list').innerHTML = state.products.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}">
            <div class="product-info">
                <h4>${p.name}</h4>
                <div class="price" style="margin-bottom: 0.8rem">$${p.price}</div>
                <button class="btn btn-primary" onclick="addToCart(${p.id})">Agregar</button>
            </div>
        </div>
    `).join('');
}

function renderCart() {
    const cartEl = document.getElementById('cart-details');
    if (state.cart.length === 0) {
        cartEl.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 2rem">Tu carrito está vacío</p>`;
        document.getElementById('checkout-btn').style.display = 'none';
        return;
    }

    document.getElementById('checkout-btn').style.display = 'block';
    let html = '';
    let total = 0;

    state.cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        html += `
            <div class="service-item" style="border-bottom: 1px solid var(--border); margin-bottom: 1rem; padding-bottom: 1rem">
                <div class="info">
                    <h4>${item.name}</h4>
                    <p>$${item.price} c/u</p>
                </div>
                <div style="text-align: right">
                    <div class="price" style="margin-bottom: 0.5rem">$${subtotal}</div>
                    <div style="display: flex; align-items: center; gap: 0.8rem; justify-content: flex-end">
                        <div class="quantity-control">
                            <button class="btn-qty" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="btn-qty" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                        <button style="background: none; border: none; color: var(--danger); cursor: pointer; font-size: 1.1rem" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    html += `
        <div class="summary-total" style="margin-top: 1rem">
            <div class="summary-line">
                <span>Total Carrito</span>
                <span>$${total}</span>
            </div>
        </div>
    `;

    cartEl.innerHTML = html;
}

function renderCheckout() {
    const summaryEl = document.getElementById('checkout-summary');
    let html = '';
    let total = 0;

    if (state.booking) {
        const service = state.services.find(s => s.id == state.booking.serviceId);
        html += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem">
                    <h4 style="color: var(--gold)">Tu Cita (Pendiente de Verificación)</h4>
                 </div>`;
        html += `
            <div class="summary-line">
                <span>${service.name}</span>
                <span>$${service.price}</span>
            </div>
            <div class="summary-line" style="color: var(--text-muted); font-size: 0.85rem">
                <span>${state.booking.date} a las ${state.booking.time}</span>
            </div>
            <div style="margin-bottom: 1.5rem"></div>
        `;
        total += service.price;
    }

    if (state.cart.length > 0) {
        html += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem">
                    <h4 style="color: var(--gold)">Productos</h4>
                 </div>`;
        state.cart.forEach(item => {
            html += `
                <div class="summary-line">
                    <span>${item.name} (x${item.quantity})</span>
                    <span>$${item.price * item.quantity}</span>
                </div>
            `;
            total += item.price * item.quantity;
        });
    }

    if (!state.booking && state.cart.length === 0) {
        html = `<p style="text-align: center; color: var(--text-muted)">No hay nada en tu pedido.</p>`;
    } else {
        html += `
            <div class="summary-total">
                <div class="summary-line">
                    <span>Total</span>
                    <span>$${total}</span>
                </div>
            </div>
        `;
    }

    summaryEl.innerHTML = html;
}

// --- Cart Actions ---
function addToCart(productId) {
    const product = state.products.find(p => p.id === productId);
    const existing = state.cart.find(item => item.id === productId);
    if (existing) existing.quantity += 1;
    else state.cart.push({ ...product, quantity: 1 });
    localStorage.setItem('barber_cart', JSON.stringify(state.cart));
    showToast('Producto agregado');
    updateCartBadge();
}

function updateQuantity(productId, delta) {
    const item = state.cart.find(i => i.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) removeFromCart(productId);
        else {
            localStorage.setItem('barber_cart', JSON.stringify(state.cart));
            renderCart();
            updateCartBadge();
        }
    }
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    localStorage.setItem('barber_cart', JSON.stringify(state.cart));
    updateCartBadge();
    if (state.view === 'carrito') renderCart();
}

function updateCartBadge() {
    const count = state.cart.reduce((acc, item) => acc + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    const floatCart = document.getElementById('floating-cart');
    const floatBadge = document.getElementById('cart-count-float');

    if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'flex';
        if (state.view !== 'carrito' && state.view !== 'checkout') {
            floatCart.style.display = 'flex';
            floatBadge.textContent = count;
        } else floatCart.style.display = 'none';
    } else {
        badge.style.display = 'none';
        floatCart.style.display = 'none';
    }
}

// --- Admin Actions ---
let currentProductImage = '';
let currentBookingProof = '';

function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            const preview = document.getElementById('image-preview');
            preview.style.backgroundImage = `url(${e.target.result})`;
            preview.innerHTML = '';
            currentProductImage = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function previewBookingProof(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            const preview = document.getElementById('booking-proof-preview');
            preview.style.backgroundImage = `url(${e.target.result})`;
            preview.innerHTML = ''; 
            currentBookingProof = e.target.result; 
        };
        reader.readAsDataURL(file);
    }
}

function checkAdmin() {
    const pass = document.getElementById('admin-pass').value;
    if (pass === 'admin123') {
        state.isAdmin = true;
        sessionStorage.setItem('barber_admin', 'true');
        showToast('Bienvenido, Admin');
        fetchBookings().then(() => navigateTo('admin-dash'));
    } else showToast('Contraseña incorrecta');
}

function logoutAdmin() {
    state.isAdmin = false;
    sessionStorage.removeItem('barber_admin');
    navigateTo('home');
}

async function addNewProduct() {
    const name = document.getElementById('new-prod-name').value;
    const price = parseFloat(document.getElementById('new-prod-price').value);
    const featured = document.getElementById('new-prod-featured').checked;

    if (!name || !price || !currentProductImage) {
        showToast('Completa todos los campos');
        return;
    }

    const { error } = await supabase.from('products').insert([{ name, price, image: currentProductImage, featured }]);
    if (error) showToast('Error al guardar');
    else {
        showToast('Producto agregado');
        fetchData();
        // Clear form
        document.getElementById('new-prod-name').value = '';
        document.getElementById('new-prod-price').value = '';
        document.getElementById('image-preview').style.backgroundImage = 'none';
        currentProductImage = '';
    }
}

async function updateProduct(id) {
    const name = document.querySelector(`.edit-prod-name[data-id="${id}"]`).value;
    const price = parseFloat(document.querySelector(`.edit-prod-price[data-id="${id}"]`).value);
    await supabase.from('products').update({ name, price }).eq('id', id);
    showToast('Producto actualizado');
    fetchData();
}

async function deleteProduct(id) {
    if (confirm('¿Eliminar producto?')) {
        await supabase.from('products').delete().eq('id', id);
        showToast('Producto eliminado');
        fetchData();
    }
}

async function updateBookingStatus(id, newStatus) {
    await supabase.from('bookings').update({ status: newStatus }).eq('id', id);
    showToast(`Cita ${newStatus.toLowerCase()}`);
    fetchBookings().then(() => renderAdminDashboard());
}

async function confirmAndNotify(id) {
    const booking = state.allBookings.find(b => b.id === id);
    if (booking) {
        await supabase.from('bookings').update({ status: 'Confirmada' }).eq('id', id);
        const service = state.services.find(s => s.id == booking.service_id);
        const message = `✅ *¡Cita Confirmada!*\n\nHola ${booking.name}, tu pago ha sido verificado. Te esperamos:\n\n✂️ *Servicio:* ${service.name}\n📅 *Fecha:* ${booking.date}\n⏰ *Hora:* ${booking.time}\n📍 *Ubicación:* BarberLA\n\n¡Gracias por tu confianza!`;
        window.open(`https://wa.me/${booking.phone}?text=${encodeURIComponent(message)}`, '_blank');
        fetchBookings().then(() => renderAdminDashboard());
    }
}

async function deleteBooking(id) {
    if (confirm('¿Eliminar cita?')) {
        await supabase.from('bookings').delete().eq('id', id);
        fetchBookings().then(() => renderAdminDashboard());
    }
}

function viewProof(base64) {
    const modal = document.getElementById('image-viewer');
    const fullImg = document.getElementById('full-image');
    modal.style.display = "block";
    fullImg.src = base64;
}

function closeImageViewer() {
    document.getElementById('image-viewer').style.display = "none";
}

// --- Booking Actions ---
function selectServiceForBooking(serviceId) {
    navigateTo('agenda');
    document.getElementById('booking-service').value = serviceId;
}

async function confirmBooking() {
    const serviceId = document.getElementById('booking-service').value;
    const date = document.getElementById('booking-date').value;
    const time = document.getElementById('booking-time').value;
    const name = document.getElementById('booking-name').value;
    const phone = document.getElementById('booking-phone').value;

    if (!serviceId || !date || !time || !name || !phone || !currentBookingProof) {
        showToast('Completa todos los campos y sube tu comprobante');
        return;
    }

    const { data: duplicates } = await supabase.from('bookings')
        .select('id').eq('date', date).eq('time', time).neq('status', 'Cancelada');

    if (duplicates && duplicates.length > 0) {
        showToast('Horario ya reservado');
        return;
    }

    const { error } = await supabase.from('bookings').insert([{
        service_id: serviceId, date, time, name, phone, proof: currentBookingProof, status: 'Pendiente'
    }]);

    if (error) showToast('Error al agendar');
    else {
        state.booking = { serviceId, date, time, name, phone };
        currentBookingProof = '';
        navigateTo('checkout');
    }
}

// --- WhatsApp Store Integration ---
function sendToWhatsApp() {
    if (!state.booking && state.cart.length === 0) return;
    let total = 0;
    let message = `Hola, quiero agendar una cita y hacer un pedido:\n\n`;

    if (state.booking) {
        const service = state.services.find(s => s.id == state.booking.serviceId);
        message += `👤 *Nombre:* ${state.booking.name}\n✂️ *Servicio:* ${service.name}\n📅 *Fecha:* ${state.booking.date}\n⏰ *Hora:* ${state.booking.time}\n\n`;
        total += service.price;
    }

    if (state.cart.length > 0) {
        message += `🛍️ *Productos:*\n`;
        state.cart.forEach(item => {
            message += `- ${item.name} (x${item.quantity}) - $${item.price * item.quantity}\n`;
            total += item.price * item.quantity;
        });
        message += `\n`;
    }
    message += `💰 *Total:* $${total}`;
    window.open(`https://wa.me/5611451113?text=${encodeURIComponent(message)}`, '_blank');
}

// --- UI Helpers ---
function showToast(text) {
    const toast = document.getElementById('toast');
    toast.textContent = text;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// --- Initialization ---
window.addEventListener('load', () => {
    fetchData();
    setupRealtime();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('booking-date').setAttribute('min', today);

    // Populate service select (initial)
    const serviceSelect = document.getElementById('booking-service');
    serviceSelect.innerHTML = '<option value="">Cargando servicios...</option>';
    
    setTimeout(() => {
        serviceSelect.innerHTML = '<option value="">Selecciona un servicio</option>' + 
            state.services.map(s => `<option value="${s.id}">${s.name} - $${s.price}</option>`).join('');
    }, 2000);

    setTimeout(() => {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(() => document.getElementById('loader').style.display = 'none', 800);
    }, 1500);
});
