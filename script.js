// ============================================
// Dynamic Data Loading System
// ============================================

// Default data (fallback if data.json fails to load)
const defaultData = {
    store_info: {
        name: "مكتبة الطالب",
        whatsapp: "+212779063241",
        email: "taswe9agency@yahoo.com",
        map_link: "https://maps.google.com/?q=Casablanca"
    },
    branding: {
        primary_color: "#2ecc71",
        secondary_color: "#27ae60"
    },
    assets: {
        logo: "assets/logo.png",
        background_video: "assets/interface.mp4",
        proof_image: "assets/b70ac3e2cf7d93c3c55ff783eb91a4e5.jpg",
        gallery_images: ["assets/i.png", "assets/i1.png", "assets/i2.png", "assets/i3.png", "assets/i5.png"]
    },
    content: {
        main_title: "تجهيز اللوائح المدرسية",
        subtitle: "نوفر لك جميع الأدوات المدرسية بجودة عالية وأسعار مناسبة",
        form_title: "اطلب اللائحة الآن",
        order_type_label: "نوع الطلب:",
        pickup_option: "نوجدها ليك وتجي تاخذها واجدة",
        delivery_option: "التوصيل للمنزل",
        name_label: "الاسم الكامل:",
        name_placeholder: "أدخل اسمك الكامل",
        address_label: "عنوان التوصيل:",
        address_placeholder: "الحي، الشارع، رقم المنزل",
        availability_label: "متى ستكون متوفراً:",
        availability_placeholder: "مثال: متوفر يومياً بعد الساعة 5 مساءً",
        submit_btn_text: "إرسال اللائحة عبر الواتساب",
        proof_text: "نجهز طلباتكم باحترافية وسرعة",
        footer_text: "© 2024 جميع الحقوق محفوظة",
        email_text: "البريد الإلكتروني",
        map_text: "موقعنا على الخريطة"
    }
};

// WhatsApp message templates
const messageTemplates = {
    pickup: (storeName, name) => 
        `مرحباً مكتبة ${storeName}، أود إرسال لائحة الأدوات المدرسية.\n` +
        `نوع الطلب: استلام من المكتبة\n` +
        `الاسم: ${name}\n` +
        `تفضلوا صورة اللائحة:`,
    
    delivery: (storeName, name, address, availability) => 
        `مرحباً مكتبة ${storeName}، أود إرسال لائحة الأدوات المدرسية.\n` +
        `نوع الطلب: توصيل للمنزل\n` +
        `الاسم: ${name}\n` +
        `العنوان: ${address}\n` +
        `الوقت المناسب: ${availability}\n` +
        `تفضلوا صورة اللائحة:`
};

// ============================================
// Initialize Application
// ============================================
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Fetch data from JSON file
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Failed to load data.json');
        }
        const data = await response.json();
        initializeApp(data);
    } catch (error) {
        console.warn('Using fallback data due to error:', error);
        initializeApp(defaultData);
    }
});

// ============================================
// Main Initialization Function
// ============================================
function initializeApp(data) {
    // Apply branding colors
    applyBranding(data.branding);
    
    // Update store information
    updateStoreInfo(data.store_info);
    
    // Update content
    updateContent(data.content);
    
    // Update assets
    updateAssets(data.assets);
    
    // Setup form logic
    setupFormLogic(data.store_info);
    
    // Update links
    updateLinks(data.store_info);
}

// ============================================
// Apply Branding Colors
// ============================================
function applyBranding(branding) {
    if (!branding) return;
    
    const root = document.documentElement;
    
    if (branding.primary_color) {
        root.style.setProperty('--primary-color', branding.primary_color);
    }
    
    if (branding.secondary_color) {
        root.style.setProperty('--secondary-color', branding.secondary_color);
    }
}

// ============================================
// Update Store Information
// ============================================
function updateStoreInfo(storeInfo) {
    if (!storeInfo) return;
    
    // Update document title
    if (storeInfo.name) {
        document.title = `${storeInfo.name} - تجهيز اللوائح المدرسية`;
    }
}

// ============================================
// Update Content
// ============================================
function updateContent(content) {
    if (!content) return;
    
    const contentMap = {
        main_title: 'mainTitle',
        subtitle: 'subtitle',
        form_title: 'formTitle',
        order_type_label: 'orderTypeLabel',
        pickup_option: 'pickupOption',
        delivery_option: 'deliveryOption',
        name_label: 'nameLabel',
        name_placeholder: 'fullName',
        address_label: 'addressLabel',
        address_placeholder: 'address',
        availability_label: 'availabilityLabel',
        availability_placeholder: 'availability',
        submit_btn_text: 'submitBtnText',
        proof_text: 'proofText',
        footer_text: 'footerText',
        email_text: 'emailText',
        map_text: 'mapText'
    };
    
    Object.entries(contentMap).forEach(([key, elementId]) => {
        const element = document.getElementById(elementId);
        if (element && content[key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = content[key];
            } else {
                element.textContent = content[key];
            }
        }
    });
}

// ============================================
// Update Assets
// ============================================
function updateAssets(assets) {
    if (!assets) return;
    
    // Update logo
    const logoElement = document.getElementById('logoImage');
    if (logoElement && assets.logo) {
        logoElement.src = assets.logo;
    }
    
    // Update video background
    const videoElement = document.getElementById('bgVideo');
    if (videoElement && assets.background_video) {
        const sourceElement = videoElement.querySelector('source');
        if (sourceElement) {
            sourceElement.src = assets.background_video;
            videoElement.load();
        }
    }
    
    // Update proof image
    const proofImage = document.querySelector('.proof-image');
    if (proofImage && assets.proof_image) {
        proofImage.src = assets.proof_image;
    }
}

// ============================================
// Update Links
// ============================================
function updateLinks(storeInfo) {
    if (!storeInfo) return;
    
    // Update email link
    const emailLink = document.getElementById('emailLink');
    if (emailLink && storeInfo.email) {
        emailLink.href = `mailto:${storeInfo.email}`;
    }
    
    // Update map link
    const mapLink = document.getElementById('mapLink');
    if (mapLink && storeInfo.map_link) {
        mapLink.href = storeInfo.map_link;
    }
}

// ============================================
// Setup Form Logic
// ============================================
function setupFormLogic(storeInfo) {
    const form = document.getElementById('orderFormElement');
    const pickupRadio = document.querySelector('input[name="orderType"][value="pickup"]');
    const deliveryRadio = document.querySelector('input[name="orderType"][value="delivery"]');
    const deliveryFields = document.getElementById('deliveryFields');
    const addressInput = document.getElementById('address');
    const availabilityInput = document.getElementById('availability');
    
    if (!form || !pickupRadio || !deliveryRadio || !deliveryFields) return;
    
    // Handle radio button changes
    pickupRadio.addEventListener('change', function() {
        if (this.checked) {
            deliveryFields.classList.remove('active');
            // Make delivery fields not required
            if (addressInput) addressInput.required = false;
            if (availabilityInput) availabilityInput.required = false;
        }
    });
    
    deliveryRadio.addEventListener('change', function() {
        if (this.checked) {
            deliveryFields.classList.add('active');
            // Make delivery fields required
            if (addressInput) addressInput.required = true;
            if (availabilityInput) availabilityInput.required = true;
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value.trim();
        const orderType = document.querySelector('input[name="orderType"]:checked').value;
        
        if (!fullName) {
            alert('الرجاء إدخال الاسم الكامل');
            return;
        }
        
        let message = '';
        const storeName = storeInfo?.name || 'مكتبة الطالب';
        
        if (orderType === 'pickup') {
            message = messageTemplates.pickup(storeName, fullName);
        } else {
            const address = addressInput ? addressInput.value.trim() : '';
            const availability = availabilityInput ? availabilityInput.value.trim() : '';
            
            if (!address || !availability) {
                alert('الرجاء إدخال عنوان التوصيل والوقت المناسب');
                return;
            }
            
            message = messageTemplates.delivery(storeName, fullName, address, availability);
        }
        
        // Encode message for URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappNumber = storeInfo?.whatsapp || '+212779063241';
        const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
        
        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');
    });
    
    // Initialize form state
    deliveryFields.classList.remove('active');
    if (addressInput) addressInput.required = false;
    if (availabilityInput) availabilityInput.required = false;
}

// ============================================
// Video Background Error Handling
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('bgVideo');
    const videoSource = video?.querySelector('source');
    
    if (video && videoSource) {
        videoSource.addEventListener('error', function() {
            console.warn('Video failed to load, using fallback image');
            video.style.display = 'none';
            const fallbackImg = video.querySelector('img');
            if (fallbackImg) {
                fallbackImg.style.display = 'block';
            }
        });
    }
});

// ============================================
// Console Debug Information
// ============================================
console.log('%c🏫 مكتبة الطالب - Dynamic Data Landing Page', 
    'font-size: 20px; font-weight: bold; color: #2ecc71;');
console.log('%cلتخصيص الموقع، قم بتعديل ملف data.json فقط', 
    'font-size: 14px; color: #3498db;');
console.log('%c💡 جميع التغييرات تتم تلقائياً دون لمس الكود', 
    'font-size: 12px; color: #95a5a6;');
