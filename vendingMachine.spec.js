
// Matteo, Nelis, Saket
"use strict";

const nickelWeight = 5.0;
const dimeWeight = 2.268;
const quarterWeight = 5.670;
const invalidWeight = 123.45;

let display, returnCoin, vendingMachine;

beforeEach(() => {
    display = jest.fn();
    returnCoin = jest.fn();
    vendingMachine = new VendingMachine(display, returnCoin);
});

describe("accept coin", () => {

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

    it("returns invalid coins", () => {
        vendingMachine.insertCoin(invalidWeight);

        expect(returnCoin).toBeCalled();
    });

    it("doesn't update the display when an invalid coin is inserted", () => {
        vendingMachine.insertCoin(invalidWeight);

        expect(display).toBeCalledTimes(1);
    });

    it("displays current amount of inserted coins", () => {
        vendingMachine.insertCoin(quarterWeight);
        vendingMachine.insertCoin(dimeWeight);
        vendingMachine.insertCoin(nickelWeight);

        expect(display).toHaveBeenCalledWith("$ 0.40");
    });
});

const nickel = {
    weight: 5.0,
    amount: 0.05
};

const dime = {
    weight: 2.268,
    amount: 0.10
};

const quarter = {
    weight: 5.670,
    amount: 0.25
};

const coins = [nickel, dime, quarter];
const isValidCoin = (coin) => coin;

class VendingMachine {

    constructor(display, returnCoin) {
        display("INSERT COIN");
        this._display = display;
        this._returnCoin = returnCoin;
        this._currentAmount = 0;
    }

    insertCoin(weight) {
        const coin = coins.find((c) => c.weight == weight);

        if (isValidCoin(coin)) {
            this._currentAmount += coin.amount;
            this._display(`$ ${this._currentAmount.toFixed(2)}`);
        } else {
            this._returnCoin();
        }
    }


}