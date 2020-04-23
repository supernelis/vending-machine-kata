
// Matteo, Nelis, Saket
"use strict";

const nickelWeight = 5.0;
const dimeWeight = 2.268;
const quarterWeight = 5.670;
const invalidWeight = 123.45;

let display, returnCoin, vendingMachine, dispenser;

beforeEach(() => {
    dispenser = {
        dispense1 : jest.fn()
    };
    display = jest.fn();
    returnCoin = jest.fn();
    vendingMachine = new VendingMachine(display, returnCoin, dispenser);
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

describe("Select product", () => {

    window.setTimeout = (callback) => callback();

    it("displays $1.00 when cola is selected without adding money", () => {
        vendingMachine.selectProduct1();

        expect(display).toHaveBeenCalledWith("PRICE $ 1.00");
        expect(display).toHaveBeenLastCalledWith("INSERT COIN");
    });

    it("displays $1.00 and then the current amount when cola is selected and inserted amount is insufficient", () => {
        vendingMachine.insertCoin(nickelWeight);

        vendingMachine.selectProduct1();

        expect(display).toHaveBeenCalledWith("PRICE $ 1.00");
        expect(display).toHaveBeenLastCalledWith("$ 0.05");
    });

    it("displays THANK YOU after successfull selection", () => {
        vendingMachine.insertCoin(quarterWeight);
        vendingMachine.insertCoin(quarterWeight);
        vendingMachine.insertCoin(quarterWeight);
        vendingMachine.insertCoin(quarterWeight);

        vendingMachine.selectProduct1();

        expect(display).toHaveBeenCalledWith("THANK YOU");
        expect(display).toHaveBeenLastCalledWith("INSERT COIN");
    });

    it("dispenses a coke after successfull selection", () => {
        vendingMachine.insertCoin(quarterWeight);
        vendingMachine.insertCoin(quarterWeight);
        vendingMachine.insertCoin(quarterWeight);
        vendingMachine.insertCoin(quarterWeight);

        vendingMachine.selectProduct1();

        expect(dispenser.dispense1).toHaveBeenCalled();
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
const formatAmount = (amount) => `$ ${amount.toFixed(2)}`;

class VendingMachine {

    constructor(display, returnCoin, dispenser) {
        display("INSERT COIN");
        this._display = display;
        this._returnCoin = returnCoin;
        this._currentAmount = 0;
        this._dispenser = dispenser;
    }

    insertCoin(weight) {
        const coin = coins.find((c) => c.weight == weight);

        if (isValidCoin(coin)) {
            this._currentAmount += coin.amount;
            this._display(formatAmount(this._currentAmount));
        } else {
            this._returnCoin();
        }
    }

    selectProduct1() {
        if (this._currentAmount >= 1.0) {
            this._display("THANK YOU");
            this._dispenser.dispense1();
            setTimeout(() => this._display("INSERT COIN"), 3000);
        } else {
            this._display("PRICE $ 1.00");
            const message = this._currentAmount > 0
                ? formatAmount(this._currentAmount)
                : "INSERT COIN";
            setTimeout(() => this._display(message), 3000);
        }
    }
}