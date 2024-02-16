"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTemporaryPassword = void 0;
const generateTemporaryPassword = () => {
    const length = 12;
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const symbolChars = '!@#$%^&*()_-+=<>?/[]{}|';
    const allChars = uppercaseChars + lowercaseChars + symbolChars;
    let temporaryPassword = '';
    temporaryPassword += getRandomChar(uppercaseChars);
    temporaryPassword += getRandomChar(lowercaseChars);
    temporaryPassword += getRandomChar(symbolChars);
    for (let i = 0; i < length - 3; i++) {
        temporaryPassword += getRandomChar(allChars);
    }
    temporaryPassword = temporaryPassword.split('').sort(() => Math.random() - 0.5).join('');
    return temporaryPassword;
};
exports.generateTemporaryPassword = generateTemporaryPassword;
const getRandomChar = (charSet) => {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    return charSet[randomIndex];
};
