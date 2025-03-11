function switchLanguage(lang) {
            document.querySelectorAll('.content').forEach(div => div.classList.remove('active'));
            document.getElementById(lang).classList.add('active');
        }

document.write(
    "<div><button class='language-btn' onclick=switchLanguage('english')>English</button>&nbsp;/&nbsp;<button class='language-btn' onclick=switchLanguage('kannada')>Kannada</button></div>"
);