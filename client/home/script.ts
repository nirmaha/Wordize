let startbtn: HTMLButtonElement = document.querySelector('#start');
let quitbtn: HTMLButtonElement = document.querySelector('#quit');
startbtn.onclick = () => {
    window.location.href = "/game";
};