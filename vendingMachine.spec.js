
// Matteo, Nelis, Saket
"use strict";

describe("accept coin", () => {
    it("displays INSERT COIN on startup", () => {
        const display = jest.fn();
        const vendingMachine = new VendingMachine(display);

        expect(display).toHaveBeenCalledWith("INSERT COIN");
    });

    it("displays the value of a nickel when it's inserted", () => {
        const display = jest.fn();
        const vendingMachine = new VendingMachine(display);

        vendingMachine.insertCoin(5.0);

        expect(display).toHaveBeenCalledWith("$ 0.05");
    });

    it("display the value of a dime when inserted", () => {
        const display = jest.fn();
        const vendingMachine = new VendingMachine(display);

        vendingMachine.insertCoin(2.268);

        expect(display).toHaveBeenCalledWith("$ 0.10");
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
        }else {
            this._display("$ 0.10");
        }
    }
}