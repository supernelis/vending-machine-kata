
// Matteo, Nelis, Saket
"use strict";

const nickelWeight = 5.0;
const dimeWeight = 2.268;
const quarterWeight = 5.670;
const invalidWeight = 123.45;

let display, returnCoin, machine, dispenser;

beforeEach(() => {
    dispenser = {
        dispense1: jest.fn(),
        dispense2: jest.fn()
    };
    display = jest.fn();
    returnCoin = jest.fn();
    machine = vendingMachine(display, returnCoin, dispenser);
});

describe("accept coin", () => {

    it("displays INSERT COIN on startup", () => {
        expect(display).toHaveBeenCalledWith("INSERT COIN");
    });

    it("displays the value of a nickel when inserted", () => {
        machine.insertCoin(nickelWeight);

        expect(display).toHaveBeenCalledWith("$ 0.05");
    });

    it("displays the value of a dime when inserted", () => {
        machine.insertCoin(dimeWeight);

        expect(display).toHaveBeenCalledWith("$ 0.10");
    });

    it("displays the value of a quarter when inserted", () => {
        machine.insertCoin(quarterWeight);

        expect(display).toHaveBeenCalledWith("$ 0.25");
    });

    it("returns invalid coins", () => {
        machine.insertCoin(invalidWeight);

        expect(returnCoin).toBeCalled();
    });

    it("doesn't update the display when an invalid coin is inserted", () => {
        machine.insertCoin(invalidWeight);

        expect(display).toBeCalledTimes(1);
    });

    it("displays current amount of inserted coins", () => {
        machine.insertCoin(quarterWeight);
        machine.insertCoin(dimeWeight);
        machine.insertCoin(nickelWeight);

        expect(display).toHaveBeenCalledWith("$ 0.40");
    });
});

describe("Select product", () => {

    window.setTimeout = (callback) => callback();

    it("displays $1.00 when cola is selected without adding money", () => {
        machine.selectProduct1();

        expect(display).toHaveBeenCalledWith("PRICE $ 1.00");
        expect(display).toHaveBeenLastCalledWith("INSERT COIN");
    });

    it("displays $1.00 and then the current amount when cola is selected and inserted amount is insufficient", () => {
        machine.insertCoin(nickelWeight);

        machine.selectProduct1();

        expect(display).toHaveBeenCalledWith("PRICE $ 1.00");
        expect(display).toHaveBeenLastCalledWith("$ 0.05");
    });

    it("displays THANK YOU after successfull selection", () => {
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);

        machine.selectProduct1();

        expect(display).toHaveBeenCalledWith("THANK YOU");
        expect(display).toHaveBeenLastCalledWith("INSERT COIN");
    });

    it("dispenses a coke after successfull selection", () => {
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);

        machine.selectProduct1();

        expect(dispenser.dispense1).toHaveBeenCalled();
    });

    it("allows only one product to be dispensed", () => {
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);

        machine.selectProduct1();
        machine.selectProduct1();

        expect(display).toHaveBeenCalledWith("PRICE $ 1.00");
        expect(display).toHaveBeenLastCalledWith("INSERT COIN");

        expect(dispenser.dispense1).toHaveBeenCalledTimes(1);
    });

    it("dispenses chips after successful selection", () => {
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);

        machine.selectProduct2();

        expect(dispenser.dispense2).toHaveBeenCalled();
    });
});

function vendingMachine(display, returnCoin, dispenser) {

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

    display("INSERT COIN");
    let currentAmount = 0;

    function dispense() {
        display("THANK YOU");
        currentAmount = 0;
        dispenser.dispense1();
        setTimeout(() => display("INSERT COIN"), 3000);
    }

    function reject() {
        display("PRICE $ 1.00");
        const message = currentAmount > 0
            ? formatAmount(currentAmount)
            : "INSERT COIN";
        setTimeout(() => display(message), 3000);
    }

    return {
        insertCoin: (weight) => {
            const coin = coins.find((c) => c.weight == weight);

            if (isValidCoin(coin)) {
                currentAmount += coin.amount;
                display(formatAmount(currentAmount));
            } else {
                returnCoin();
            }
        },

        selectProduct1: () => {
            const cola = {
                price: 1.0
            }
            if (currentAmount >= cola.price) {
                dispense();
            } else {
                reject();
            }
        },

        selectProduct2: () => {
            const chips = {
                price: 0.5
            }
            if (currentAmount >= chips.price) {
                display("THANK YOU");
                currentAmount = 0;
                dispenser.dispense2();
                setTimeout(() => display("INSERT COIN"), 3000);
            } else {
                reject();
            }
        }
    };
}