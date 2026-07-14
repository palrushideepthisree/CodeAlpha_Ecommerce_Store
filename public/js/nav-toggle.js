document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('nav-toggle');
    const links = document.querySelector('.nav-links');

    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
        toggle.classList.toggle('open');
        links.classList.toggle('open');
    });

    links.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            toggle.classList.remove('open');
            links.classList.remove('open');
        });
    });
});