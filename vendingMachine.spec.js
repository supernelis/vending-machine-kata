
// Matteo, Nelis, Saket
"use strict";

describe("accept coin", () => {

    let display, vendingMachine;

    beforeEach(() => {
        display = jest.fn();
        vendingMachine = new VendingMachine(display);
    });

    it("displays INSERT COIN on startup", () => {
        expect(display).toHaveBeenCalledWith("INSERT COIN");
    });

    it("displays the value of a nickel when inserted", () => {
        vendingMachine.insertCoin(5.0);

        expect(display).toHaveBeenCalledWith("$ 0.05");
    });

    it("displays the value of a dime when inserted", () => {
        vendingMachine.insertCoin(2.268);

        expect(display).toHaveBeenCalledWith("$ 0.10");
    });

    it("displays the value of a quarter when inserted", () => {
        vendingMachine.insertCoin(5.670);

        expect(display).toHaveBeenCalledWith("$ 0.25");
    });
});

class VendingMachine {

    constructor(display) {
        display("INSERT COIN");
        this._display = display;
    }

    insertCoin(weight) {
        if (weight === 5.0) {
            this._display("$ 0.05");
        } else if (weight === 5.670) {
            this._display("$ 0.25");
        } else {
            this._display("$ 0.10");
        }
    }
}