"use strict";

export function debounce(func: () => void, timer: any, wait = 50): any {
    clearTimeout(timer);
    return setTimeout(() => func(), wait);
}

export function getDebounce(func: () => void, timer: any, wait = 50): Function {
    return () => debounce(func, timer, wait);
}
