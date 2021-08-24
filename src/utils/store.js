import {atom} from "jotai";

const timerIdAtom = atom(0);
const secondAtom = atom(0);
const dSecondAtom = atom(0);
const speedAtom = atom(25);
const durationAtom = atom(0);

export {
    timerIdAtom,
    secondAtom,
    dSecondAtom,
    speedAtom,
    durationAtom,
};
