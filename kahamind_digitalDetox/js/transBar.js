
/*
function switchLanguage(lang) {
            document.querySelectorAll('.content').forEach(div => div.classList.remove('active'));
            document.getElementById(lang).classList.add('active');
        };


document.write(
    "<div><button class='language-btn' onclick=switchLanguage('english')>English</button>&nbsp;/&nbsp;<button class='language-btn' onclick=switchLanguage('kannada')>Kannada</button></div>"
);
*/


function setLanguage(lang) {
    localStorage.setItem("selectedLanguage", lang);
    applyLanguage(lang);
}

function applyLanguage(lang) {
    document.querySelectorAll('.content').forEach(div => div.classList.remove('active'));
    document.getElementById(lang).classList.add('active');
}

// When the page loads, apply the stored language preference
window.onload = function() {
    const savedLanguage = localStorage.getItem("selectedLanguage") || "english";
    applyLanguage(savedLanguage);
};

document.write(
    "<div><button class='language-btn' onclick=setLanguage('english')>English</button>&nbsp;/&nbsp;<button class='language-btn' onclick=setLanguage('kannada')>Kannada</button></div>"
);