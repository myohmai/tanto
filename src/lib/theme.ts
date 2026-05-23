const THEME_KEY = 'tanto-theme';

let _mq: MediaQueryList | null = null;
let _listener: ((e: MediaQueryListEvent) => void) | null = null;

function _cleanup() {
    if (_mq && _listener) {
        _mq.removeEventListener('change', _listener);
        _mq = null;
        _listener = null;
    }
}

export function applyTheme(value: string) {
    localStorage.setItem(THEME_KEY, value);
    _cleanup();

    if (value === 'system') {
        _mq = window.matchMedia('(prefers-color-scheme: dark)');
        _listener = (e) => document.documentElement.classList.toggle('night', e.matches);
        document.documentElement.classList.toggle('night', _mq.matches);
        _mq.addEventListener('change', _listener);
    } else {
        document.documentElement.classList.toggle('night', value === 'dark');
    }
}

export function getSavedTheme(): string {
    return localStorage.getItem(THEME_KEY) ?? 'system';
}

export function initTheme() {
    applyTheme(getSavedTheme());
}
