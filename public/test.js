'use strict'
reset();

function reset() {
    var human = document.querySelector("#yourHand");
    var computer = document.querySelector("#myHand");
    //var presenter = new Presenter();
    while (human.hasChildNodes()) {
        human.removeChild(human.lastChild);
    }
    while (computer.hasChildNodes()) {
        computer.removeChild(computer.lastChild);
    }
    
    document.getElementById("status").textContent = "Game reset";
    // presenter.eraseHands();
    //presenter.play();
}