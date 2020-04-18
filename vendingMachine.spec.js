
// Matteo, Nelis, Saket
"use strict";

describe("accept coin", () => {

    const nickelWeight = 5.0;
    const dimeWeight = 2.268;
    const quarterWeight = 5.670;

    let display, returnCoin, vendingMachine;

    beforeEach(() => {
        display = jest.fn();
        returnCoin = jest.fn();
        vendingMachine = new VendingMachine(display, returnCoin);
    });

    it("displays INSERT COIN on startup", () => {
        expect(display).toHaveBeenCalledWith("INSERT COIN");
    });

    it("displays the value of a nickel when inserted", () => {
        vendingMachine.insertCoin(nickelWeight);

        expect(display).toHaveBeenCalledWith("$ 0.05");
    });

    it("displays the value of a dime when inserted", () => {
        vendingMachine.insertCoin(dimeWeight);

        expect(display).toHaveBeenCalledWith("$ 0.10");
    });

    it("displays the value of a quarter when inserted", () => {
        vendingMachine.insertCoin(quarterWeight);

        expect(display).toHaveBeenCalledWith("$ 0.25");
    });

    it("rejects invalid coins", () => {
        vendingMachine.insertCoin(123.45);

        expect(returnCoin).toBeCalled();
        expect(display).toBeCalledTimes(1);
    });
});

class VendingMachine {

    constructor(display, returnCoin) {
        display("INSERT COIN");
        this._display = display;
        this._returnCoin = returnCoin;
    }

    insertCoin(weight) {
        if (weight === 5.0) {
            this._display("$ 0.05");
        } else if (weight === 5.670) {
            this._display("$ 0.25");
        } else if (weight === 2.268) {
            this._display("$ 0.10");
        } else {
            this._returnCoin();
        }
    }
}