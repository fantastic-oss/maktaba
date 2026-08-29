/* =========================================================
   DEFAULT DATA / FALLBACKS

   هذا المحتوى يستخدم تلقائياً إذا:
   - فشل تحميل data.json
   - كان أحد الحقول مفقوداً
========================================================= */

const DEFAULT_DATA = {

    store_info: {
        name: "مكتبتنا",
        whatsapp: "+212779063241",
        email: "taswe9agency@yahoo.com",
        google_maps: "#"
    },

    branding: {
        primary_color: "#6C63FF",
        secondary_color: "#FF6584"
    },

    assets: {
        logo: "assets/logo.png",
        background_video: "assets/interface.mp4",

        gallery: [
            "assets/i.png",
            "assets/i1.png",
            "assets/i2.png",
            "assets/i3.png",
            "assets/i5.png"
        ],

        proof_image:
            "assets/b70ac3e2cf7d93c3c55ff783eb91a4e5.jpg"
    },

    content: {

        store_subtitle:
            "مستلزمات مدرسية بكل سهولة",

        location_button:
            "موقع المكتبة",

        hero_badge:
            "🎒 الدخول المدرسي أصبح أسهل",

        hero_title:
            "أرسل لائحتك وسنجهز كل مستلزماتك",

        hero_description:
            "وفر وقتك وتجنب عناء البحث. أرسل لنا لائحة الأدوات المدرسية عبر واتساب، وسنقوم بتجهيزها لك باحترافية وسرعة.",

        benefits: [
            "تجهيز احترافي للطلبات",
            "توفير الوقت والمجهود",
            "استلام من المكتبة أو توصيل للمنزل"
        ],

        proof_title:
            "نجهز طلباتكم باحترافية وسرعة",

        proof_description:
            "فقط أرسل لائحتك وسنتكفل بالباقي",

        form_title:
            "كيف ترغب في استلام طلبك؟",

        form_description:
            "اختر الطريقة المناسبة لك ثم أرسل لائحتك عبر واتساب",

        pickup_title:
            "نوجدها ليك وتجي تاخذها واجدة",

        pickup_description:
            "استلام مباشر من المكتبة",

        delivery_title:
            "التوصيل للمنزل",

        delivery_description:
            "نوصل طلبك إلى عنوانك",

        name_label:
            "الاسم الكامل",

        name_placeholder:
            "أدخل اسمك الكامل",

        address_label:
            "عنوان التوصيل",

        address_placeholder:
            "المدينة، الحي، الشارع...",

        time_label:
            "متى ستكون متوفراً؟",

        time_placeholder:
            "مثال: بعد الساعة 17:00",

        submit_button:
            "إرسال اللائحة عبر الواتساب",

        form_note:
            "سيتم فتح واتساب لإرسال تفاصيل طلبك وصورة اللائحة.",

        footer_text:
            "جميع حقوق النشر محفوظة",

        footer_email:
            "البريد الإلكتروني",

        footer_location:
            "موقع المكتبة"
    }
};



/* =========================================================
   APPLICATION STATE
========================================================= */

let appData = DEFAULT_DATA;



/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    await loadData();

    setupOrderTypeLogic();

    setupFormSubmission();

});



/* =========================================================
   LOAD DATA.JSON
========================================================= */

async function loadData() {

    try {

        const response = await fetch("data.json");

        if (!response.ok) {
            throw new Error(
                `HTTP Error: ${response.status}`
            );
        }


        const jsonData = await response.json();


        /*
            دمج البيانات مع البيانات الافتراضية.

            بهذه الطريقة إذا كان حقل مفقوداً في JSON،
            يتم استخدام القيمة الافتراضية بدلاً من
            توقف الموقع.
        */

        appData = deepMerge(
            DEFAULT_DATA,
            jsonData
        );


        applyDataToWebsite();

    }

    catch (error) {

        console.warn(
            "تعذر تحميل data.json. سيتم استخدام البيانات الافتراضية.",
            error
        );


        appData = DEFAULT_DATA;

        applyDataToWebsite();

    }

}



/* =========================================================
   DEEP MERGE

   دمج البيانات بدون فقدان الحقول الافتراضية
========================================================= */

function deepMerge(target, source) {

    const output = { ...target };


    if (
        !source ||
        typeof source !== "object"
    ) {
        return output;
    }


    Object.keys(source).forEach(key => {

        if (
            source[key] &&
            typeof source[key] === "object" &&
            !Array.isArray(source[key])
        ) {

            output[key] = deepMerge(
                target[key] || {},
                source[key]
            );

        }

        else {

            output[key] = source[key];

        }

    });


    return output;

}



/* =========================================================
   APPLY DATA
========================================================= */

function applyDataToWebsite() {

    const {
        store_info,
        branding,
        assets,
        content
    } = appData;



    /* =====================================================
       CSS COLORS
    ===================================================== */

    setCSSVariable(
        "--primary-color",
        branding.primary_color
    );


    setCSSVariable(
        "--secondary-color",
        branding.secondary_color
    );


    /*
        إنشاء RGB من اللون الرئيسي
        لاستخدامه في rgba()
    */

    const primaryRGB = hexToRGB(
        branding.primary_color
    );


    if (primaryRGB) {

        setCSSVariable(
            "--primary-rgb",
            primaryRGB
        );

    }



    /* =====================================================
       PAGE TITLE
    ===================================================== */

    document.title =
        store_info.name || DEFAULT_DATA.store_info.name;



    /* =====================================================
       ASSETS
    ===================================================== */

    setImageSource(
        "storeLogo",
        assets.logo
    );


    setImageSource(
        "proofImage",
        assets.proof_image
    );


    setVideoSource(
        "backgroundVideo",
        assets.background_video
    );



    /* =====================================================
       STORE INFORMATION
    ===================================================== */

    setText(
        "storeNameHeader",
        store_info.name
    );


    setText(
        "footerStoreName",
        store_info.name
    );


    setText(
        "storeSubtitleHeader",
        content.store_subtitle
    );



    /* =====================================================
       MAP LINKS
    ===================================================== */

    setLink(
        "mapLink",
        store_info.google_maps
    );


    setLink(
        "footerMapLink",
        store_info.google_maps
    );



    /* =====================================================
       EMAIL
    ===================================================== */

    const emailLink =
        document.getElementById("emailLink");


    if (
        emailLink &&
        store_info.email
    ) {

        emailLink.href =
            `mailto:${store_info.email}`;

    }



    /* =====================================================
       CONTENT
    ===================================================== */

    setText(
        "locationButtonText",
        content.location_button
    );


    setText(
        "heroBadge",
        content.hero_badge
    );


    setText(
        "heroTitle",
        content.hero_title
    );


    setText(
        "heroDescription",
        content.hero_description
    );


    setText(
        "benefit1",
        content.benefits?.[0]
    );


    setText(
        "benefit2",
        content.benefits?.[1]
    );


    setText(
        "benefit3",
        content.benefits?.[2]
    );


    setText(
        "proofTitle",
        content.proof_title
    );


    setText(
        "proofDescription",
        content.proof_description
    );


    setText(
        "formTitle",
        content.form_title
    );


    setText(
        "formDescription",
        content.form_description
    );


    setText(
        "pickupTitle",
        content.pickup_title
    );


    setText(
        "pickupDescription",
        content.pickup_description
    );


    setText(
        "deliveryTitle",
        content.delivery_title
    );


    setText(
        "deliveryDescription",
        content.delivery_description
    );


    setText(
        "nameLabel",
        content.name_label
    );


    setText(
        "addressLabel",
        content.address_label
    );


    setText(
        "timeLabel",
        content.time_label
    );


    setText(
        "submitButtonText",
        content.submit_button
    );


    setText(
        "formNote",
        content.form_note
    );


    setText(
        "footerText",
        content.footer_text
    );


    setText(
        "footerEmail",
        content.footer_email
    );


    setText(
        "footerLocation",
        content.footer_location
    );



    /* =====================================================
       INPUT PLACEHOLDERS
    ===================================================== */

    setPlaceholder(
        "fullName",
        content.name_placeholder
    );


    setPlaceholder(
        "address",
        content.address_placeholder
    );


    setPlaceholder(
        "availableTime",
        content.time_placeholder
    );



    /* =====================================================
       GALLERY
    ===================================================== */

    renderGallery(
        assets.gallery
    );

}



/* =========================================================
   HELPER FUNCTIONS
========================================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (
        element &&
        value
    ) {
        element.textContent = value;
    }

}



function setPlaceholder(id, value) {

    const element =
        document.getElementById(id);


    if (
        element &&
        value
    ) {
        element.placeholder = value;
    }

}



function setLink(id, url) {

    const element =
        document.getElementById(id);


    if (
        element &&
        url
    ) {
        element.href = url;
    }

}



function setImageSource(id, source) {

    const element =
        document.getElementById(id);


    if (
        element &&
        source
    ) {

        element.src = source;

    }

}



function setVideoSource(id, source) {

    const video =
        document.getElementById(id);


    if (
        video &&
        source
    ) {

        video.src = source;

        video.load();

    }

}



function setCSSVariable(name, value) {

    if (!value) return;


    document.documentElement.style.setProperty(
        name,
        value
    );

}



/* =========================================================
   HEX TO RGB
========================================================= */

function hexToRGB(hex) {

    if (!hex) return null;


    let cleanHex =
        hex.replace("#", "");


    if (cleanHex.length === 3) {

        cleanHex =
            cleanHex
                .split("")
                .map(char => char + char)
                .join("");

    }


    const number =
        parseInt(cleanHex, 16);


    if (Number.isNaN(number)) {
        return null;
    }


    const r =
        (number >> 16) & 255;


    const g =
        (number >> 8) & 255;


    const b =
        number & 255;


    return `${r}, ${g}, ${b}`;

}



/* =========================================================
   GALLERY
========================================================= */

function renderGallery(images) {

    const gallery =
        document.getElementById("gallery");


    if (!gallery) return;


    gallery.innerHTML = "";


    if (
        !Array.isArray(images) ||
        images.length === 0
    ) {
        return;
    }


    images.forEach((imagePath, index) => {

        if (!imagePath) return;


        const image =
            document.createElement("img");


        image.src = imagePath;


        image.alt =
            `صورة من منتجات المكتبة ${index + 1}`;


        image.loading = "lazy";


        /*
            إذا كانت الصورة غير موجودة،
            يتم إخفاؤها بدون التأثير على الصفحة.
        */

        image.onerror = () => {
            image.remove();
        };


        gallery.appendChild(image);

    });

}



/* =========================================================
   ORDER TYPE LOGIC
========================================================= */

function setupOrderTypeLogic() {

    const pickupOption =
        document.getElementById("pickupOption");


    const deliveryOption =
        document.getElementById("deliveryOption");


    const deliveryFields =
        document.getElementById("deliveryFields");


    const addressInput =
        document.getElementById("address");


    const timeInput =
        document.getElementById("availableTime");


    const orderTypeInputs =
        document.querySelectorAll(
            'input[name="orderType"]'
        );


    orderTypeInputs.forEach(input => {

        input.addEventListener(
            "change",
            () => {

                const isDelivery =
                    input.value === "delivery" &&
                    input.checked;


                if (isDelivery) {

                    deliveryFields.classList.add(
                        "show"
                    );


                    deliveryOption.classList.add(
                        "active"
                    );


                    pickupOption.classList.remove(
                        "active"
                    );


                    /*
                        جعل حقول التوصيل مطلوبة
                    */

                    addressInput.required = true;


                    timeInput.required = true;

                }

                else {

                    deliveryFields.classList.remove(
                        "show"
                    );


                    pickupOption.classList.add(
                        "active"
                    );


                    deliveryOption.classList.remove(
                        "active"
                    );


                    /*
                        إزالة required عند الاستلام
                    */

                    addressInput.required = false;


                    timeInput.required = false;

                }

            }
        );

    });

}



/* =========================================================
   FORM SUBMISSION
========================================================= */

function setupFormSubmission() {

    const form =
        document.getElementById("orderForm");


    if (!form) return;


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const fullName =
                document
                    .getElementById("fullName")
                    .value
                    .trim();


            const address =
                document
                    .getElementById("address")
                    .value
                    .trim();


            const availableTime =
                document
                    .getElementById("availableTime")
                    .value
                    .trim();


            const selectedType =
                document.querySelector(
                    'input[name="orderType"]:checked'
                );


            const orderType =
                selectedType
                    ? selectedType.value
                    : "pickup";


            /*
                حماية إضافية
            */

            if (!fullName) {

                alert(
                    "المرجو إدخال الاسم الكامل."
                );

                return;

            }



            /* =============================================
               ORDER TYPE LABEL
            ============================================= */

            let orderTypeLabel =
                "استلام من المكتبة";


            if (orderType === "delivery") {

                orderTypeLabel =
                    "التوصيل للمنزل";

            }



            /* =============================================
               CREATE WHATSAPP MESSAGE
            ============================================= */

            let message =
                `مرحباً مكتبة ${appData.store_info.name}،\n\n` +
                `أود إرسال لائحة الأدوات المدرسية.\n\n` +
                `نوع الطلب: ${orderTypeLabel}\n` +
                `الاسم: ${fullName}\n`;


            /*
                إضافة بيانات التوصيل فقط
                عند اختيار التوصيل.
            */

            if (orderType === "delivery") {

                message +=
                    `العنوان: ${address}\n` +
                    `الوقت المناسب: ${availableTime}\n`;

            }


            message +=
                `\nتفضلوا صورة اللائحة:`;


            /*
                تنظيف رقم واتساب:

                +212779063241
                تصبح:

                212779063241
            */

            const whatsappNumber =
                cleanWhatsAppNumber(
                    appData.store_info.whatsapp
                );


            /*
                التحقق من الرقم
            */

            if (!whatsappNumber) {

                alert(
                    "رقم الواتساب غير متوفر حالياً."
                );

                return;

            }



            /* =============================================
               WHATSAPP URL
            ============================================= */

            const whatsappURL =
                `https://wa.me/${whatsappNumber}?text=` +
                encodeURIComponent(message);


            /*
                Redirect
            */

            window.location.href =
                whatsappURL;

        }
    );

}



/* =========================================================
   CLEAN WHATSAPP NUMBER
========================================================= */

function cleanWhatsAppNumber(number) {

    if (!number) return "";


    /*
        الاحتفاظ بالأرقام فقط
    */

    return String(number)
        .replace(/\D/g, "");

}
