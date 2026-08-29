/* ==========================================================================
   script.js
   ------------------------------------------------------------------------
   This file is a GENERIC ENGINE. It contains no store name, no phone
   number, no colors, no marketing copy. Everything it renders comes from
   data.json. To launch a new branch/city, edit data.json only — never
   this file.
   ========================================================================== */

'use strict';

/* ==========================================================================
   1. DEFAULT DATA (fallback if data.json fails to load or is incomplete)
   ========================================================================== */
const DEFAULT_DATA = {
  store_info: {
    name: 'المكتبة',
    whatsapp: '+212600000000',
    email: '',
    google_maps: '#',
    city: ''
  },
  branding: {
    primary: '#1E3A5F',
    primary_dark: '#142A45',
    secondary: '#F5A623',
    accent: '#E8544E',
    background: '#F6F8FB',
    surface: '#FFFFFF',
    text: '#16232E',
    text_muted: '#5C6B7A'
  },
  assets: {
    logo: '',
    video: '',
    gallery: [],
    social_proof: ''
  },
  content: {
    badge: '',
    hero_title: 'لائحتك المدرسية بين يديك',
    hero_description: '',
    primary_cta: 'أرسل الطلب',
    secondary_cta: 'المنتوجات',
    form_title: 'أرسل طلبك',
    form_description: '',
    pickup_option: 'استلام من المكتبة',
    delivery_option: 'التوصيل للمنزل',
    name_label: 'الاسم الكامل',
    name_placeholder: '',
    address_label: 'عنوان التوصيل',
    address_placeholder: '',
    availability_label: 'متى ستكون متوفراً؟',
    availability_placeholder: '',
    upload_label: 'اختر صورة اللائحة',
    upload_hint: '',
    submit_button: 'إرسال عبر الواتساب',
    social_proof_title: '',
    social_proof_description: '',
    gallery_title: 'منتوجاتنا',
    gallery_description: '',
    footer_text: 'جميع الحقوق محفوظة',
    whatsapp_label: 'واتساب'
  },
  messages: {
    whatsapp_intro: 'مرحباً 👋\n\nأود إرسال لائحة الأدوات المدرسية.',
    whatsapp_order_type_label: 'نوع الطلب',
    whatsapp_name_label: 'الاسم',
    whatsapp_address_label: 'العنوان',
    whatsapp_availability_label: 'الوقت المناسب',
    whatsapp_image_note: 'سأرسل صورة اللائحة في هذه المحادثة.',
    whatsapp_closing: 'شكراً لكم.',
    whatsapp_success: 'تم فتح واتساب، لا تنس إرفاق الصورة!',
    validation_name: 'الرجاء إدخال الاسم الكامل',
    validation_address: 'الرجاء إدخال عنوان التوصيل',
    validation_availability: 'الرجاء تحديد الوقت المناسب',
    validation_image_type: 'صيغة الصورة غير مدعومة',
    validation_image_size: 'حجم الصورة كبير جداً',
    data_load_error: 'تعذر تحميل بيانات المتجر، تم عرض بيانات افتراضية.'
  }
};

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_FIELD_LENGTH = 160;

let STORE_DATA = null; // populated by loadData()

/* ==========================================================================
   2. ENTRY POINT
   ========================================================================== */
document.addEventListener('DOMContentLoaded', init);

async function init() {
  const rawData = await loadData();
  STORE_DATA = mergeWithDefaults(rawData);

  applyTheme(STORE_DATA.branding);
  renderContent(STORE_DATA);
  initForm(STORE_DATA);
  initImageUpload(STORE_DATA);
  initWhatsAppSubmit(STORE_DATA);

  hideLoader();
}

/* ==========================================================================
   3. DATA LOADING
   ========================================================================== */
async function loadData() {
  try {
    const response = await fetch('data.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const json = await response.json();
    return json;
  } catch (err) {
    console.warn('data.json failed to load, using defaults:', err);
    showToast(DEFAULT_DATA.messages.data_load_error, 'error');
    return {};
  }
}

/**
 * Deep-merges the loaded JSON on top of DEFAULT_DATA so that any
 * missing field falls back gracefully instead of becoming `undefined`.
 */
function mergeWithDefaults(data) {
  const merged = {};
  for (const section of Object.keys(DEFAULT_DATA)) {
    if (section === 'assets') {
      merged.assets = {
        ...DEFAULT_DATA.assets,
        ...(data.assets || {}),
        gallery: Array.isArray(data.assets && data.assets.gallery) && data.assets.gallery.length
          ? data.assets.gallery
          : DEFAULT_DATA.assets.gallery
      };
    } else {
      merged[section] = { ...DEFAULT_DATA[section], ...(data[section] || {}) };
    }
  }
  return merged;
}

/* ==========================================================================
   4. THEME (CSS variables ← branding)
   ========================================================================== */
function applyTheme(branding) {
  const root = document.documentElement;
  const map = {
    primary: '--primary',
    secondary: '--secondary',
    accent: '--accent',
    background: '--background',
    surface: '--surface',
    text: '--text',
    text_muted: '--text-muted'
  };
  for (const [key, cssVar] of Object.entries(map)) {
    if (branding[key]) root.style.setProperty(cssVar, branding[key]);
  }
  // Derive a darker shade of primary for headings/footer if not provided.
  root.style.setProperty('--primary-dark', branding.primary_dark || darken(branding.primary, 0.18));

  const themeColorMeta = document.getElementById('meta-theme-color');
  if (themeColorMeta) themeColorMeta.setAttribute('content', branding.primary || '#1E3A5F');
}

function darken(hex, amount) {
  if (!hex) return '#142A45';
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return hex;
  const num = parseInt(clean, 16);
  let r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
  r = Math.max(0, Math.round(r * (1 - amount)));
  g = Math.max(0, Math.round(g * (1 - amount)));
  b = Math.max(0, Math.round(b * (1 - amount)));
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

/* ==========================================================================
   5. RENDER CONTENT (DOM population — text via textContent, never innerHTML)
   ========================================================================== */
function renderContent(data) {
  const { store_info, content, assets } = data;

  // --- Page meta ---
  setText('page-title', `${store_info.name} — أدوات مدرسية`);
  setAttr('meta-description', 'content', content.hero_description || store_info.name);
  setAttr('og-title', 'content', store_info.name);
  setAttr('og-description', 'content', content.hero_description || '');
  setAttr('og-image', 'content', assets.social_proof || assets.logo || '');

  // --- Navbar ---
  setImage('nav-logo', assets.logo, store_info.name);
  setText('nav-store-name', store_info.name);
  setAttr('nav-maps', 'href', store_info.google_maps || '#');
  setAttr('nav-whatsapp', 'href', buildWhatsAppLink(store_info.whatsapp, content.whatsapp_label));
  setText('nav-whatsapp-label', content.whatsapp_label);

  // --- Hero ---
  setVideoSource('hero-video', assets.video);
  setText('hero-badge', content.badge);
  toggleHidden('hero-badge', !content.badge);
  setText('hero-title', content.hero_title);
  setText('hero-description', content.hero_description);
  setText('hero-primary-cta-text', content.primary_cta);
  setText('hero-secondary-cta-text', content.secondary_cta);

  // --- Order form copy ---
  setText('form-title', content.form_title);
  setText('form-description', content.form_description);
  setText('pickup-label', content.pickup_option);
  setText('delivery-label', content.delivery_option);
  setText('name-label', content.name_label);
  setAttr('input-name', 'placeholder', content.name_placeholder);
  setText('address-label', content.address_label);
  setAttr('input-address', 'placeholder', content.address_placeholder);
  setText('availability-label', content.availability_label);
  setAttr('input-availability', 'placeholder', content.availability_placeholder);
  setText('upload-label', content.upload_label);
  setText('upload-dropzone-text', '📎 ' + content.upload_label);
  setText('upload-hint', content.upload_hint);
  setText('submit-button-text', content.submit_button);

  // --- Trust / social proof ---
  setImage('trust-image', assets.social_proof, content.social_proof_title);
  setText('trust-title', content.social_proof_title);
  setText('trust-description', content.social_proof_description);

  // --- Gallery ---
  setText('gallery-title', content.gallery_title);
  setText('gallery-description', content.gallery_description);
  renderGallery(assets.gallery, store_info.name);

  // --- Footer ---
  setImage('footer-logo', assets.logo, store_info.name);
  setText('footer-store-name', store_info.name);
  setText('footer-store-name-2', store_info.name);
  setText('footer-city', store_info.city);
  setText('footer-whatsapp', store_info.whatsapp);
  setAttr('footer-whatsapp', 'href', buildWhatsAppLink(store_info.whatsapp, content.whatsapp_label));
  setText('footer-email', store_info.email);
  setAttr('footer-email', 'href', store_info.email ? `mailto:${store_info.email}` : '#');
  setAttr('footer-maps', 'href', store_info.google_maps || '#');
  setText('footer-copyright-text', content.footer_text);
  setText('footer-year', String(new Date().getFullYear()));
}

function renderGallery(images, storeName) {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  grid.innerHTML = ''; // safe: we build elements below, no user data involved

  images.forEach((src, index) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = src;
    img.alt = `${storeName} — منتوج ${index + 1}`;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('error', () => {
      item.style.display = 'none'; // gracefully hide missing demo assets
    });

    item.appendChild(img);
    grid.appendChild(item);
  });
}

/* ==========================================================================
   6. FORM LOGIC (order type toggle + validation)
   ========================================================================== */
function initForm(data) {
  const radios = document.querySelectorAll('input[name="order-type"]');
  const deliveryFields = document.getElementById('delivery-fields');
  const addressInput = document.getElementById('input-address');
  const availabilityInput = document.getElementById('input-availability');

  function syncDeliveryVisibility() {
    const selected = document.querySelector('input[name="order-type"]:checked');
    const isDelivery = selected && selected.value === 'delivery';

    if (isDelivery) {
      deliveryFields.hidden = false;
      requestAnimationFrame(() => deliveryFields.classList.add('is-open'));
      addressInput.required = true;
      availabilityInput.required = true;
    } else {
      deliveryFields.classList.remove('is-open');
      addressInput.required = false;
      availabilityInput.required = false;
      clearFieldError('address');
      clearFieldError('availability');
      // wait for the collapse transition before hiding from a11y tree
      const onEnd = () => {
        if (!deliveryFields.classList.contains('is-open')) deliveryFields.hidden = true;
        deliveryFields.removeEventListener('transitionend', onEnd);
      };
      deliveryFields.addEventListener('transitionend', onEnd);
      // Fallback in case reduced-motion skips the transition event
      setTimeout(() => {
        if (!deliveryFields.classList.contains('is-open')) deliveryFields.hidden = true;
      }, 400);
    }
  }

  radios.forEach(radio => radio.addEventListener('change', syncDeliveryVisibility));
  syncDeliveryVisibility();

  // Enforce max length defensively even though maxlength attr is set.
  [document.getElementById('input-name'), addressInput, availabilityInput].forEach(input => {
    input.addEventListener('input', () => {
      if (input.value.length > MAX_FIELD_LENGTH) {
        input.value = input.value.slice(0, MAX_FIELD_LENGTH);
      }
    });
  });
}

function getOrderType() {
  const selected = document.querySelector('input[name="order-type"]:checked');
  return selected ? selected.value : 'pickup';
}

function validateForm(data) {
  let isValid = true;
  const orderType = getOrderType();
  const messages = data.messages;

  const name = document.getElementById('input-name').value.trim();
  if (!name) {
    setFieldError('name', messages.validation_name);
    isValid = false;
  } else {
    clearFieldError('name');
  }

  if (orderType === 'delivery') {
    const address = document.getElementById('input-address').value.trim();
    const availability = document.getElementById('input-availability').value.trim();

    if (!address) {
      setFieldError('address', messages.validation_address);
      isValid = false;
    } else {
      clearFieldError('address');
    }

    if (!availability) {
      setFieldError('availability', messages.validation_availability);
      isValid = false;
    } else {
      clearFieldError('availability');
    }
  }

  return isValid;
}

function setFieldError(fieldId, message) {
  const input = document.getElementById(`input-${fieldId}`);
  const error = document.getElementById(`${fieldId}-error`);
  if (input) input.classList.add('is-invalid');
  if (error) {
    error.textContent = message;
    error.classList.add('is-visible');
  }
}

function clearFieldError(fieldId) {
  const input = document.getElementById(`input-${fieldId}`);
  const error = document.getElementById(`${fieldId}-error`);
  if (input) input.classList.remove('is-invalid');
  if (error) {
    error.textContent = '';
    error.classList.remove('is-visible');
  }
}

/* ==========================================================================
   7. IMAGE UPLOAD (client-side only — never uploaded to any server)
   ========================================================================== */
let selectedImageName = null;

function initImageUpload(data) {
  const input = document.getElementById('input-image');
  const preview = document.getElementById('image-preview');
  const previewImg = document.getElementById('image-preview-img');
  const removeBtn = document.getElementById('image-remove');
  const messages = data.messages;

  input.addEventListener('change', () => {
    const file = input.files && input.files[0];
    clearFieldError('image');

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setFieldError('image', messages.validation_image_type);
      input.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setFieldError('image', messages.validation_image_size);
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      preview.hidden = false;
      selectedImageName = file.name;
    };
    reader.readAsDataURL(file);
  });

  removeBtn.addEventListener('click', () => {
    input.value = '';
    previewImg.src = '';
    preview.hidden = true;
    selectedImageName = null;
  });
}

/* ==========================================================================
   8. WHATSAPP SUBMISSION
   ========================================================================== */
function initWhatsAppSubmit(data) {
  const form = document.getElementById('order-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleWhatsAppSubmit(data);
  });
}

function handleWhatsAppSubmit(data) {
  if (!validateForm(data)) {
    const firstError = document.querySelector('.field__input.is-invalid');
    if (firstError) firstError.focus();
    return;
  }

  const orderType = getOrderType();
  const name = document.getElementById('input-name').value.trim();
  const address = document.getElementById('input-address').value.trim();
  const availability = document.getElementById('input-availability').value.trim();

  const message = buildWhatsAppMessage(data, {
    orderType,
    name,
    address,
    availability
  });

  const link = buildWhatsAppLink(data.store_info.whatsapp, null, message);
  window.open(link, '_blank', 'noopener,noreferrer');

  showToast(data.messages.whatsapp_success, 'success');
}

/**
 * Builds the WhatsApp message body from data.json → messages,
 * omitting address/availability entirely for pickup orders.
 */
function buildWhatsAppMessage(data, { orderType, name, address, availability }) {
  const m = data.messages;
  const content = data.content;
  const orderTypeText = orderType === 'delivery' ? content.delivery_option : content.pickup_option;

  const lines = [
    m.whatsapp_intro.replace('{store_name}', data.store_info.name),
    '',
    `${m.whatsapp_order_type_label}: ${orderTypeText}`,
    '',
    `${m.whatsapp_name_label}: ${name}`
  ];

  if (orderType === 'delivery') {
    lines.push('', `${m.whatsapp_address_label}: ${address}`);
    lines.push('', `${m.whatsapp_availability_label}: ${availability}`);
  }

  lines.push('', m.whatsapp_image_note, '', m.whatsapp_closing);

  return lines.join('\n');
}

/**
 * Builds a wa.me link. The phone number is sanitized to digits only
 * (no "+", no spaces, no dashes) as required by the wa.me URL format.
 */
function buildWhatsAppLink(rawPhone, fallbackText, message) {
  const cleanPhone = sanitizePhone(rawPhone);
  const text = message || fallbackText || '';
  return `https://wa.me/${cleanPhone}${text ? '?text=' + encodeURIComponent(text) : ''}`;
}

function sanitizePhone(phone) {
  return String(phone || '').replace(/[^\d]/g, '');
}

/* ==========================================================================
   9. DOM HELPERS (textContent-first, no innerHTML with dynamic/user data)
   ========================================================================== */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value != null ? value : '';
}

function setAttr(id, attr, value) {
  const el = document.getElementById(id);
  if (el && value != null) el.setAttribute(attr, value);
}

function setImage(id, src, alt) {
  const el = document.getElementById(id);
  if (!el) return;
  if (src) {
    el.src = src;
    el.alt = alt || '';
    el.addEventListener('error', () => { el.style.visibility = 'hidden'; }, { once: true });
  } else {
    el.style.visibility = 'hidden';
  }
}

function setVideoSource(id, src) {
  const video = document.getElementById(id);
  const fallback = document.getElementById('hero-fallback');
  if (!video) return;

  if (!src) {
    video.style.display = 'none';
    return;
  }

  const source = document.createElement('source');
  source.src = src;
  source.type = 'video/mp4';
  video.appendChild(source);

  video.addEventListener('error', () => {
    video.style.display = 'none';
    if (fallback) fallback.style.display = 'block';
  });

  video.play().catch(() => {
    // Autoplay can be blocked by the browser; the gradient fallback
    // underneath still reads fine since the overlay handles contrast.
  });
}

function toggleHidden(id, hidden) {
  const el = document.getElementById(id);
  if (el) el.style.display = hidden ? 'none' : '';
}

function hideLoader() {
  const loader = document.getElementById('page-loader');
  if (loader) loader.classList.add('is-hidden');
}

/* ==========================================================================
   10. TOAST / ERROR FEEDBACK
   ========================================================================== */
let toastTimer = null;
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast || !message) return;

  toast.textContent = message;
  toast.classList.toggle('is-error', type === 'error');
  toast.classList.add('is-visible');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 4000);
}

function showError(message) {
  showToast(message, 'error');
}
