
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

        vendingMachine.insertCoin();

        expect(display).toHaveBeenCalledWith("$ 0.05");
    });
});

class VendingMachine {
    
    constructor(display) {
        display("INSERT COIN");
        this._display = display;
    }

    insertCoin() {
        this._display("$ 0.05");
    }
}