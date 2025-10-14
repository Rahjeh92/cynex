// ===================================
// ===== LANGUAGE TOGGLE SYSTEM ======
// ===================================
document.addEventListener("DOMContentLoaded", () => {
    const langBtn = document.getElementById("lang-toggle");
    if (!langBtn) return;

    let isArabic = false; // default language is English

    const switchLanguage = () => {
        // Fade-out effect before switching
        document.body.classList.add("lang-switching");

        setTimeout(() => {
            // Loop through all elements that have both EN and AR texts
            document.querySelectorAll("[data-en][data-ar]").forEach(el => {
                const enText = el.getAttribute("data-en");
                const arText = el.getAttribute("data-ar");
                el.textContent = isArabic ? enText : arText;
            });

            // Toggle direction and language attributes
            isArabic = !isArabic;
            const dir = isArabic ? "rtl" : "ltr";
            const lang = isArabic ? "ar" : "en";

            document.documentElement.setAttribute("dir", dir);
            document.documentElement.setAttribute("lang", lang);
            document.body.style.direction = dir;

            // 🔹 inside your switchLanguage function
            document.querySelectorAll(".slide-caption").forEach(el => {
                el.style.textAlign = isArabic ? "right" : "left"; // switch alignment
            });
            // Toggle direction for list items specifically
            document.querySelectorAll("li").forEach(li => {
                li.style.textAlign = isArabic ? "right" : "left";
            });

            // Update button label
            langBtn.textContent = isArabic ? "EN" : "AR";

            // Keep slider flow always LTR (fix reversed movement)
            const slider = document.querySelector(".slider");
            if (slider) slider.style.direction = "ltr";

            // 🔁 Fix slider arrow directions for RTL mode
            const prevBtn = document.querySelector(".slider-btn.prev");
            const nextBtn = document.querySelector(".slider-btn.next");

            if (isArabic) {
                if (prevBtn && nextBtn) {
                    prevBtn.innerHTML = "›"; // visually points right
                    nextBtn.innerHTML = "‹"; // visually points left
                }
            } else {
                if (prevBtn && nextBtn) {
                    prevBtn.innerHTML = "‹"; // back to normal
                    nextBtn.innerHTML = "›";
                }
            }

            // Fade-in after switching
            document.body.classList.remove("lang-switching");
        }, 250); // same duration as CSS transition
    };

    langBtn.addEventListener("click", switchLanguage);
});
// ===================================
// ===== LANGUAGE TOGGLE SYSTEM ======
// ===================================
document.addEventListener("DOMContentLoaded", () => {
    const langBtn = document.getElementById("lang-toggle");
    if (!langBtn) return;

    let isArabic = false; // default language is English

    const switchLanguage = () => {
        // Fade-out effect before switching
        document.body.classList.add("lang-switching");

        setTimeout(() => {
            // Loop through all elements that have both EN and AR texts
            document.querySelectorAll("[data-en][data-ar]").forEach(el => {
                const enText = el.getAttribute("data-en");
                const arText = el.getAttribute("data-ar");
                el.textContent = isArabic ? enText : arText;
            });

            // Toggle direction and language attributes
            isArabic = !isArabic;
            const dir = isArabic ? "rtl" : "ltr";
            const lang = isArabic ? "ar" : "en";

            document.documentElement.setAttribute("dir", dir);
            document.documentElement.setAttribute("lang", lang);
            document.body.style.direction = dir;

            // 🔹 inside your switchLanguage function
            document.querySelectorAll(".slide-caption").forEach(el => {
                el.style.textAlign = isArabic ? "right" : "left"; // switch alignment
            });
            // Toggle direction for list items specifically
            document.querySelectorAll("li").forEach(li => {
                li.style.textAlign = isArabic ? "right" : "left";
            });

            // Update button label
            langBtn.textContent = isArabic ? "EN" : "AR";

            // Keep slider flow always LTR (fix reversed movement)
            const slider = document.querySelector(".slider");
            if (slider) slider.style.direction = "ltr";

            // 🔁 Fix slider arrow directions for RTL mode
            const prevBtn = document.querySelector(".slider-btn.prev");
            const nextBtn = document.querySelector(".slider-btn.next");

            if (isArabic) {
                if (prevBtn && nextBtn) {
                    prevBtn.innerHTML = "›"; // visually points right
                    nextBtn.innerHTML = "‹"; // visually points left
                }
            } else {
                if (prevBtn && nextBtn) {
                    prevBtn.innerHTML = "‹"; // back to normal
                    nextBtn.innerHTML = "›";
                }
            }

            // Fade-in after switching
            document.body.classList.remove("lang-switching");
        }, 250); // same duration as CSS transition
    };

    langBtn.addEventListener("click", switchLanguage);
});
