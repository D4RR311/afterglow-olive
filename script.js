/* =========================================
   OLIVE AFTERGLOW
   FRONTEND JAVASCRIPT
========================================= */


/* =========================================
   CONFIGURATION
========================================= */

const CONFIG = {

    /*
     * GANTI nilai ini dengan URL Web App
     * Google Apps Script setelah deployment.
     */
    API_URL: "https://script.google.com/macros/s/AKfycbyZyoIL6qfmQ0njq-JmEwiWVuUSyJyL-oK8x_gRweAZl1-2TVhGgA5Y5Pf6marCew1w/exec",

    /*
     * URL Google Maps yang digunakan adalah
     * URL yang diberikan pada data proyek.
     *
     * Tempatkan URL tersebut di sini.
     */
    MAPS_URL: "https://share.google/zdQVbhlJqtp4zq05a",

    /*
     * Target countdown:
     * 17 September 2026 pukul 09.15 WIB.
     */
    EVENT_DATE: "2026-09-17T09:15:00+07:00"

};


/* =========================================
   DOM ELEMENTS
========================================= */

const elements = {

    header: document.getElementById("siteHeader"),

    menuToggle: document.getElementById("menuToggle"),

    navigation: document.getElementById("mainNavigation"),

    countdown: document.getElementById("countdown"),

    countdownFinished:
        document.getElementById("countdownFinished"),

    days: document.getElementById("days"),

    hours: document.getElementById("hours"),

    minutes: document.getElementById("minutes"),

    seconds: document.getElementById("seconds"),

    mapsButton:
        document.getElementById("mapsButton"),

    rsvpForm:
        document.getElementById("rsvpForm"),

    rsvpName:
        document.getElementById("rsvpName"),

    rsvpNameError:
        document.getElementById("rsvpNameError"),

    rsvpAttendanceError:
        document.getElementById("rsvpAttendanceError"),

    rsvpSubmit:
        document.getElementById("rsvpSubmit"),

    rsvpFeedback:
        document.getElementById("rsvpFeedback"),

    wishForm:
        document.getElementById("wishForm"),

    wishName:
        document.getElementById("wishName"),

    wishNameError:
        document.getElementById("wishNameError"),

    wishMessage:
        document.getElementById("wishMessage"),

    wishMessageError:
        document.getElementById("wishMessageError"),

    wishCharacterCount:
        document.getElementById("wishCharacterCount"),

    wishSubmit:
        document.getElementById("wishSubmit"),

    wishFeedback:
        document.getElementById("wishFeedback"),

    wishesList:
        document.getElementById("wishesList")

};


/* =========================================
   INITIALIZATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeNavigation();

    initializeHeader();

    initializeCountdown();

    initializeMapButton();

    initializeForms();

    initializeCharacterCounter();

    initializeRevealAnimations();

    loadGuestWishes();

});


/* =========================================
   NAVIGATION
========================================= */

function initializeNavigation() {

    if (!elements.menuToggle || !elements.navigation) {
        return;
    }

    elements.menuToggle.addEventListener("click", () => {

        const isOpen =
            elements.navigation.classList.toggle("active");

        elements.menuToggle.classList.toggle(
            "active",
            isOpen
        );

        elements.menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        document.body.classList.toggle(
            "menu-open",
            isOpen
        );

    });


    const navItems =
        elements.navigation.querySelectorAll("a");

    navItems.forEach((link) => {

        link.addEventListener("click", () => {

            closeMobileMenu();

        });

    });

}


function closeMobileMenu() {

    if (!elements.navigation ||
        !elements.menuToggle) {
        return;
    }

    elements.navigation.classList.remove("active");

    elements.menuToggle.classList.remove("active");

    elements.menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );

    document.body.classList.remove("menu-open");

}


/* =========================================
   HEADER
========================================= */

function initializeHeader() {

    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

}


function updateHeader() {

    if (!elements.header) {
        return;
    }

    if (window.scrollY > 20) {

        elements.header.classList.add("scrolled");

    } else {

        elements.header.classList.remove("scrolled");

    }

}


/* =========================================
   COUNTDOWN
========================================= */

function initializeCountdown() {

    updateCountdown();

    setInterval(
        updateCountdown,
        1000
    );

}


function updateCountdown() {

    const target =
        new Date(CONFIG.EVENT_DATE).getTime();

    const now =
        Date.now();

    const difference =
        target - now;


    if (difference <= 0) {

        showCountdownFinished();

        return;

    }


    const totalSeconds =
        Math.floor(difference / 1000);

    const days =
        Math.floor(
            totalSeconds / 86400
        );

    const hours =
        Math.floor(
            (totalSeconds % 86400) / 3600
        );

    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );

    const seconds =
        totalSeconds % 60;


    elements.days.textContent =
        formatNumber(days);

    elements.hours.textContent =
        formatNumber(hours);

    elements.minutes.textContent =
        formatNumber(minutes);

    elements.seconds.textContent =
        formatNumber(seconds);

}


function showCountdownFinished() {

    if (elements.countdown) {
        elements.countdown.hidden = true;
    }

    if (elements.countdownFinished) {
        elements.countdownFinished.hidden = false;
    }

}


function formatNumber(number) {

    return String(number).padStart(2, "0");

}


/* =========================================
   GOOGLE MAPS
========================================= */

function initializeMapButton() {

    if (!elements.mapsButton) {
        return;
    }

    /*
     * URL tidak dibuat ulang.
     * URL harus berasal dari konfigurasi pengguna.
     */

    if (
        CONFIG.MAPS_URL &&
        !CONFIG.MAPS_URL.includes("PASTE_YOUR")
    ) {

        elements.mapsButton.href =
            CONFIG.MAPS_URL;

    } else {

        elements.mapsButton.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                alert(
                    "URL Google Maps belum dikonfigurasi."
                );

            }
        );

    }

}


/* =========================================
   FORM INITIALIZATION
========================================= */

function initializeForms() {

    if (elements.rsvpForm) {

        elements.rsvpForm.addEventListener(
            "submit",
            handleRSVPSubmit
        );

    }


    if (elements.wishForm) {

        elements.wishForm.addEventListener(
            "submit",
            handleWishSubmit
        );

    }

}


/* =========================================
   RSVP
========================================= */

async function handleRSVPSubmit(event) {

    event.preventDefault();

    clearRSVPValidation();

    const name =
        elements.rsvpName.value.trim();

    const attendance =
        document.querySelector(
            'input[name="kehadiran"]:checked'
        )?.value || "";


    let valid = true;


    if (!name) {

        showFieldError(
            elements.rsvpName,
            elements.rsvpNameError,
            "Nama wajib diisi."
        );

        valid = false;

    } else if (name.length < 2) {

        showFieldError(
            elements.rsvpName,
            elements.rsvpNameError,
            "Nama minimal 2 karakter."
        );

        valid = false;

    }


    if (!attendance) {

        elements.rsvpAttendanceError.textContent =
            "Silakan pilih kehadiran.";

        valid = false;

    }


    if (!valid) {
        return;
    }


    setButtonLoading(
        elements.rsvpSubmit,
        true
    );

    clearFeedback(
        elements.rsvpFeedback
    );


    try {

        const response =
            await sendToAPI({
                action: "rsvp",
                nama: name,
                kehadiran: attendance
            });


        if (!response.success) {

            throw new Error(
                response.message ||
                "Gagal menyimpan RSVP."
            );

        }


        showFeedback(
            elements.rsvpFeedback,
            response.message ||
            "Terima kasih, konfirmasi kehadiran Anda telah tersimpan.",
            "success"
        );


        elements.rsvpForm.reset();


    } catch (error) {

        console.error(
            "RSVP Error:",
            error
        );

        showFeedback(
            elements.rsvpFeedback,
            error.message ||
            "Terjadi kesalahan saat mengirim RSVP.",
            "error"
        );

    } finally {

        setButtonLoading(
            elements.rsvpSubmit,
            false
        );

    }

}


/* =========================================
   GUEST WISHES
========================================= */

async function handleWishSubmit(event) {

    event.preventDefault();

    clearWishValidation();

    const name =
        elements.wishName.value.trim();

    const message =
        elements.wishMessage.value.trim();


    let valid = true;


    if (!name) {

        showFieldError(
            elements.wishName,
            elements.wishNameError,
            "Nama wajib diisi."
        );

        valid = false;

    } else if (name.length < 2) {

        showFieldError(
            elements.wishName,
            elements.wishNameError,
            "Nama minimal 2 karakter."
        );

        valid = false;

    }


    if (!message) {

        showFieldError(
            elements.wishMessage,
            elements.wishMessageError,
            "Ucapan wajib diisi."
        );

        valid = false;

    } else if (message.length < 3) {

        showFieldError(
            elements.wishMessage,
            elements.wishMessageError,
            "Ucapan terlalu pendek."
        );

        valid = false;

    }


    if (!valid) {
        return;
    }


    setButtonLoading(
        elements.wishSubmit,
        true
    );

    clearFeedback(
        elements.wishFeedback
    );


    try {

        const response =
            await sendToAPI({
                action: "wish",
                nama: name,
                ucapan: message
            });


        if (!response.success) {

            throw new Error(
                response.message ||
                "Gagal menyimpan ucapan."
            );

        }


        showFeedback(
            elements.wishFeedback,
            response.message ||
            "Terima kasih atas ucapan Anda.",
            "success"
        );


        elements.wishForm.reset();

        updateCharacterCount();

        await loadGuestWishes();


    } catch (error) {

        console.error(
            "Guest Wishes Error:",
            error
        );

        showFeedback(
            elements.wishFeedback,
            error.message ||
            "Terjadi kesalahan saat mengirim ucapan.",
            "error"
        );

    } finally {

        setButtonLoading(
            elements.wishSubmit,
            false
        );

    }

}


/* =========================================
   API COMMUNICATION
========================================= */

async function sendToAPI(data) {

    validateAPIConfiguration();


    /*
     * URLSearchParams digunakan agar POST
     * tetap berupa simple request sehingga
     * tidak membutuhkan preflight JSON.
     */

    const body =
        new URLSearchParams();


    Object.entries(data).forEach(
        ([key, value]) => {

            body.append(
                key,
                value
            );

        }
    );


    const response =
        await fetch(
            CONFIG.API_URL,
            {
                method: "POST",
                body: body
            }
        );


    if (!response.ok) {

        throw new Error(
            `Server mengembalikan HTTP ${response.status}.`
        );

    }


    const result =
        await response.json();


    if (
        typeof result !== "object" ||
        result === null
    ) {

        throw new Error(
            "Response server tidak valid."
        );

    }


    return result;

}


/* =========================================
   LOAD GUEST WISHES
========================================= */

async function loadGuestWishes() {

    if (!elements.wishesList) {
        return;
    }


    if (
        !CONFIG.API_URL ||
        CONFIG.API_URL.includes("YOUR_")
    ) {

        elements.wishesList.innerHTML = `
            <div class="no-wishes">
                Guest Wishes belum terhubung.
            </div>
        `;

        return;

    }


    elements.wishesList.innerHTML = `
        <div class="wishes-loading">
            Memuat ucapan...
        </div>
    `;


    try {

        const url =
            new URL(CONFIG.API_URL);

        url.searchParams.set(
            "action",
            "getWishes"
        );


        const response =
            await fetch(
                url.toString(),
                {
                    method: "GET"
                }
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message ||
                "Gagal mengambil Guest Wishes."
            );

        }


        renderGuestWishes(
            result.data || []
        );


    } catch (error) {

        console.error(
            "Load Wishes Error:",
            error
        );

        elements.wishesList.innerHTML = `
            <div class="no-wishes">
                Guest Wishes belum dapat dimuat.
            </div>
        `;

    }

}


/* =========================================
   RENDER GUEST WISHES
========================================= */

function renderGuestWishes(wishes) {

    if (!wishes.length) {

        elements.wishesList.innerHTML = `
            <div class="no-wishes">
                Belum ada ucapan.
                Jadilah yang pertama memberikan doa.
            </div>
        `;

        return;

    }


    /*
     * Tampilkan yang terbaru terlebih dahulu.
     */

    const sorted =
        [...wishes].reverse();


    elements.wishesList.innerHTML = "";


    sorted.forEach(
        (wish, index) => {

            const card =
                createWishCard(
                    wish,
                    index
                );

            elements.wishesList.appendChild(
                card
            );

        }
    );

}


/* =========================================
   CREATE WISH CARD
========================================= */

function createWishCard(wish, index) {

    const article =
        document.createElement("article");

    article.className =
        "wish-card";

    article.style.animationDelay =
        `${index * 70}ms`;


    const header =
        document.createElement("div");

    header.className =
        "wish-card-header";


    const name =
        document.createElement("h3");

    name.className =
        "wish-name";

    /*
     * textContent digunakan untuk mencegah
     * HTML injection dari input pengguna.
     */

    name.textContent =
        wish.nama || "Tamu";


    const date =
        document.createElement("time");

    date.className =
        "wish-date";

    date.textContent =
        formatWishDate(
            wish.timestamp
        );


    const message =
        document.createElement("p");

    message.className =
        "wish-message";

    message.textContent =
        wish.ucapan || "";


    header.appendChild(name);

    header.appendChild(date);

    article.appendChild(header);

    article.appendChild(message);


    return article;

}


/* =========================================
   DATE FORMATTER
========================================= */

function formatWishDate(timestamp) {

    if (!timestamp) {
        return "";
    }


    const date =
        new Date(timestamp);


    if (Number.isNaN(date.getTime())) {
        return "";
    }


    return new Intl.DateTimeFormat(
        "id-ID",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    ).format(date);

}


/* =========================================
   VALIDATION HELPERS
========================================= */

function showFieldError(
    input,
    errorElement,
    message
) {

    if (input) {
        input.classList.add("input-error");
    }

    if (errorElement) {
        errorElement.textContent = message;
    }

}


function clearRSVPValidation() {

    elements.rsvpName.classList.remove(
        "input-error"
    );

    elements.rsvpNameError.textContent =
        "";

    elements.rsvpAttendanceError.textContent =
        "";

}


function clearWishValidation() {

    elements.wishName.classList.remove(
        "input-error"
    );

    elements.wishMessage.classList.remove(
        "input-error"
    );

    elements.wishNameError.textContent =
        "";

    elements.wishMessageError.textContent =
        "";

}


/* =========================================
   FEEDBACK
========================================= */

function showFeedback(
    element,
    message,
    type
) {

    if (!element) {
        return;
    }

    element.textContent =
        message;

    element.className =
        `form-feedback ${type}`;

}


function clearFeedback(element) {

    if (!element) {
        return;
    }

    element.textContent = "";

    element.className =
        "form-feedback";

}


/* =========================================
   BUTTON LOADING
========================================= */

function setButtonLoading(
    button,
    loading
) {

    if (!button) {
        return;
    }


    const text =
        button.querySelector(
            ".button-text"
        );

    const loadingText =
        button.querySelector(
            ".button-loading"
        );


    button.disabled =
        loading;


    if (text) {
        text.hidden = loading;
    }

    if (loadingText) {
        loadingText.hidden = !loading;
    }

}


/* =========================================
   CHARACTER COUNTER
========================================= */

function initializeCharacterCounter() {

    if (!elements.wishMessage) {
        return;
    }

    elements.wishMessage.addEventListener(
        "input",
        updateCharacterCount
    );

    updateCharacterCount();

}


function updateCharacterCount() {

    if (
        !elements.wishMessage ||
        !elements.wishCharacterCount
    ) {
        return;
    }


    const length =
        elements.wishMessage.value.length;


    elements.wishCharacterCount.textContent =
        `${length}/500`;

}


/* =========================================
   API CONFIGURATION CHECK
========================================= */

function validateAPIConfiguration() {

    if (
        !CONFIG.API_URL ||
        CONFIG.API_URL.includes("YOUR_GOOGLE")
    ) {

        throw new Error(
            "Google Apps Script Web App URL belum dikonfigurasi."
        );

    }

}


/* =========================================
   REVEAL ANIMATIONS
========================================= */

function initializeRevealAnimations() {

    const revealElements =
        document.querySelectorAll(
            ".reveal"
        );


    if (!revealElements.length) {
        return;
    }


    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        revealElements.forEach(
            (element) => {

                element.classList.add(
                    "visible"
                );

            }
        );

        return;

    }


    const observer =
        new IntersectionObserver(
            (entries, observerInstance) => {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observerInstance.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(
        (element) => {

            observer.observe(
                element
            );

        }
    );

}
