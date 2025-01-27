export function darkmode() {
    const body = document.body;
    const wasDarkmode = localStorage.getItem('darkmode') === 'true';

    localStorage.setItem('darkmode', !wasDarkmode);
    body.classList.toggle('dark-mode', !wasDarkmode);
}