/**
 * main.js — JavaScript Entry Point
 * Imports and initialises all feature modules
 */

import { initNav }        from './modules/nav.js';
import { initAnimations } from './modules/animations.js';
import { initForms }      from './modules/forms.js';
import { initCursor }     from './modules/cursor.js';

initNav();
initAnimations();
initForms();
initCursor();
