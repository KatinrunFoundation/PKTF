export const calQRParams = () => {
    let newSw = (window.innerWidth * 128) / 600;
    let top = 36;
    let left = 28;
    top = (window.innerWidth < 470) ? 35: top;
    top = (window.innerWidth < 435) ? 33: top;
    top = (window.innerWidth < 390) ? 32: top;
    top = (window.innerWidth < 360) ? 31: top;

    newSw = (window.innerWidth > 790) ? window.innerWidth / 30 + 120: newSw;
    left = (window.innerWidth > 790) ? ((9 * window.innerWidth + 12000) / 650): left;

    return {
        size: newSw,
        top: top,
        left: left
    }
};