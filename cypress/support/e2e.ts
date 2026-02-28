// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// ---------------------------------------------------------------------------
// Zero-out CSS keyframe ANIMATIONS only (modal zoom, slide-in, etc.).
// We intentionally leave CSS transitions intact so that rc-motion (used by
// Ant Design message/notification/Popconfirm) can still fire `transitionend`
// events and manage its component lifecycle correctly.
// ---------------------------------------------------------------------------
Cypress.on('window:load', (win) => {
    const style = win.document.createElement('style');
    style.innerHTML = [
        '*, *::before, *::after {',
        '  animation-duration: 0ms !important;',
        '  animation-delay: 0ms !important;',
        '}',
    ].join('\n');
    win.document.head.appendChild(style);
});