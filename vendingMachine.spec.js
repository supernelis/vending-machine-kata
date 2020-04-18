
// Matteo, Nelis, Saket

describe ("accept coin", () => {
   it ("displays INSERT COIN on startup", () => {
       const display = jest.fn();
       const vendingMachine = new VendingMachine(display);
       expect(display).toHaveBeenCalledWith("INSERT COIN");
   }); 
});

class VendingMachine{
    constructor(display) {
        display("INSERT COIN");
    }
}