
// Matteo, Nelis, Saket
"use strict";

const nickelWeight = 5.0;
const dimeWeight = 2.268;
const quarterWeight = 5.670;
const invalidWeight = 123.45;

let display, returnCoin, machine, dispenser, coinMachine;

beforeEach(() => {
    dispenser = {
        dispense1: jest.fn(),
        dispense2: jest.fn(),
        dispense3: jest.fn(),
        isTray1Empty: () => false,
        isTray2Empty: () => false,
        isTray3Empty: () => false
    };
    display = jest.fn();
    coinMachine = {
        returnInserted: jest.fn(),
        returnQuarter: jest.fn(),
        returnDime: jest.fn(),
        returnNickel: jest.fn(),
        refund: jest.fn()
    };
    window.setTimeout = (callback) => callback();
    machine = vendingMachine(display, coinMachine, dispenser);
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

        expect(coinMachine.returnInserted).toBeCalled();
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

    it("displays $1.00 when cola is selected without adding money", () => {
        machine.selectProduct1();

        expect(display).toHaveBeenCalledWith("PRICE $ 1.00");
        expect(display).toHaveBeenLastCalledWith("INSERT COIN");
    });

    it("displays $0.50 when chips is selected without adding money", () => {
        machine.selectProduct2();

        expect(display).toHaveBeenCalledWith("PRICE $ 0.50");
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

    it("dispenses candy after successful selection", () => {
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);
        machine.insertCoin(dimeWeight);
        machine.insertCoin(nickelWeight);

        machine.selectProduct3();

        expect(dispenser.dispense3).toHaveBeenCalled();
    });
});

describe("Make change", () => {
    it("returns a quarter when 3 quarters are inserted and chips is selected", () => {
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);

        machine.selectProduct2();

        expect(coinMachine.returnQuarter).toHaveBeenCalledTimes(1);
    });

    it("returns 2 quarters when 4 quarters are inserted and chips is selected", () => {
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);

        machine.selectProduct2();

        expect(coinMachine.returnQuarter).toHaveBeenCalledTimes(2);
    });

    it("returns 3 quarters when 5 quarters are inserted and chips is selected", () => {
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);

        machine.selectProduct2();

        expect(coinMachine.returnQuarter).toHaveBeenCalledTimes(3);
    });

    it("returns a dime when 3 quarters are inserted and candy is selected", () => {
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);

        machine.selectProduct3();

        expect(coinMachine.returnDime).toHaveBeenCalledTimes(1);
    });

    it("returns a dime and a quarter when 4 quarters are inserted and candy is selected", () => {
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);

        machine.selectProduct3();

        expect(coinMachine.returnDime).toHaveBeenCalledTimes(1);
        expect(coinMachine.returnQuarter).toHaveBeenCalledTimes(1);
    });

    it("returns 2 dimes when 3 quarters and 1 dime are inserted and candy is selected", () => {
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);
        machine.insertCoin(dimeWeight);

        machine.selectProduct3();

        expect(coinMachine.returnDime).toHaveBeenCalledTimes(2);
    });

    it("returns 1 nickel when 7 dimes are inserted and candy is selected", () => {
        machine.insertCoin(dimeWeight);
        machine.insertCoin(dimeWeight);
        machine.insertCoin(dimeWeight);
        machine.insertCoin(dimeWeight);
        machine.insertCoin(dimeWeight);
        machine.insertCoin(dimeWeight);
        machine.insertCoin(dimeWeight);

        machine.selectProduct3();

        expect(coinMachine.returnNickel).toHaveBeenCalledTimes(1);
    });

    it("returns 1 nickel, 1 dime and a quarter when 3 quarters, 1 nickel and 1 dime are inserted and chips is selected", () => {
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);
        machine.insertCoin(dimeWeight);
        machine.insertCoin(nickelWeight);

        machine.selectProduct2();

        expect(coinMachine.returnQuarter).toHaveBeenCalledTimes(1);
        expect(coinMachine.returnDime).toHaveBeenCalledTimes(1);
        expect(coinMachine.returnNickel).toHaveBeenCalledTimes(1);
    });
});

describe("Return Coin", () => {
    it("returns the inserted money when the money return button is pressed", () => {
        machine.insertCoin(quarterWeight);
        machine.insertCoin(dimeWeight);
        machine.insertCoin(nickelWeight);

        machine.refund();

        expect(coinMachine.refund).toHaveBeenCalledTimes(1);
        expect(display).toHaveBeenLastCalledWith("INSERT COIN");
    });

    it("does not dispense chips when sufficient money is inserted and refunded", () => {
        machine.insertCoin(quarterWeight);
        machine.insertCoin(quarterWeight);
        machine.refund();

        machine.selectProduct2();

        expect(dispenser.dispense2).toBeCalledTimes(0);
    });
});

describe("Sold Out", () => {
    it("displays SOLD OUT when there are no chips", () => {
        dispenser.isTray2Empty = () => true;

        machine.selectProduct2();

        expect(display).toHaveBeenCalledWith("SOLD OUT");
        expect(display).toHaveBeenLastCalledWith("INSERT COIN");
    });

    it("displays SOLD OUT and already inserted amount when there are no chips", () => {
        dispenser.isTray2Empty = () => true;
        machine.insertCoin(quarterWeight);

        machine.selectProduct2();

        expect(display).toHaveBeenCalledWith("SOLD OUT");
        expect(display).toHaveBeenLastCalledWith("$ 0.25");
    });

    it("displays SOLD OUT and already inserted amount when there are no coke", () => {
        dispenser.isTray1Empty = () => true;
        machine.insertCoin(quarterWeight);

        machine.selectProduct1();

        expect(display).toHaveBeenCalledWith("SOLD OUT");
        expect(display).toHaveBeenLastCalledWith("$ 0.25");
    });

    it("displays SOLD OUT and already inserted amount when there are no candy", () => {
        dispenser.isTray3Empty = () => true;
        machine.insertCoin(quarterWeight);

        machine.selectProduct3();

        expect(display).toHaveBeenCalledWith("SOLD OUT");
        expect(display).toHaveBeenLastCalledWith("$ 0.25");
    });
});

function vendingMachine(display, coinMachine, dispenser) {

    const nickel = {
        weight: 5.0,
        amount: 5,
        asChange: coinMachine.returnNickel
    };

    const dime = {
        weight: 2.268,
        amount: 10,
        asChange: coinMachine.returnDime
    };

    const quarter = {
        weight: 5.670,
        amount: 25,
        asChange: coinMachine.returnQuarter
    };

    const coins = [nickel, dime, quarter];
    const isValidCoin = (coin) => coin;
    const formatAmount = (amount) => `$ ${(amount / 100).toFixed(2)}`;

    display("INSERT COIN");
    let currentAmount = 0;

    function select(product) {
        if (product.isSoldOut()) {
            soldOut();
        }else if (currentAmount >= product.price) {
            dispense(product);
        } else {
            reject(product.price);
        }
    }

    function soldOut(){
        display("SOLD OUT");
        askForMoreMoney();
    }

    function dispense(product) {
        display("THANK YOU");
        currentAmount = currentAmount - product.price;
        returnChange();
        product.tray();
        askForMoreMoney();
    }

    function returnChange() {
        coins.reverse().forEach(coin => {
            while (currentAmount >= coin.amount) {
                currentAmount -= coin.amount;
                coin.asChange();
            }
        });
    }

    function reject(price) {
        display(`PRICE ${formatAmount(price)}`);
        askForMoreMoney();
    }

    function askForMoreMoney() {
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
                coinMachine.returnInserted();
            }
        },

        selectProduct1: () => {
            const cola = {
                price: 100,
                tray: dispenser.dispense1,
                isSoldOut: dispenser.isTray1Empty
            };
            select(cola);
        },

        selectProduct2: () => {
            const chips = {
                price: 50,
                tray: dispenser.dispense2,
                isSoldOut: dispenser.isTray2Empty
            };
            select(chips);
        },

        selectProduct3: () => {
           const candy = {
                price: 65,
                tray: dispenser.dispense3,
                isSoldOut: dispenser.isTray3Empty
            };
            select(candy);
        },

        refund: () => {
            coinMachine.refund();
            currentAmount = 0;
            display("INSERT COIN");
        }
    };
}