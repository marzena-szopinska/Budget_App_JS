// Creating modules
// We create modules because we want to keep pieces of code that are related to one another together inside of separate,
// independed, and organized unites. We use closures and IIFEs - immidiatelly called functions, to make our modules private, 
// we will also expose some pieces for public use.

// ARCHITECTURE OF AN APPLICATION


// BUDGET CONTROLLER
var budgetController = (function() {

    

})();

// UI CONTROLLER
var UIController = (function(){
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };

    return {
        getInput: function(){
            // return an object with things that user typed in
            return {
                // get the value of selected
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                // get the values
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }

        },

        getDOMstrings: function(){
            return DOMstrings;
        }
    };

})();

// GLOBAL APP CONTROLLER
// conecting budgetController with UIController
var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings;
        // get a button and add a click event listener to it
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        // add keypress event to listen for enter key press
        document.addEventListener('keypress', function(event){
            console.log(event.keyCode); // identifies the key that was pressed
            // if enter was pressed
            if(event.keyCode === 13 || event.which === 13){ // event.which is a check for older browsers
                ctrlAddItem();
            }
        });

    };


    var ctrlAddItem = function() {
        // get input data
        var input = UICtrl.getInput();

        // add item to the budget controller


        // add new item to the UI


        // calculate the budget 


        // display the budget on the UI


    }

    // public function initialization for our events
    return {
        init: function(){
            setupEventListeners();
        }
    }


})(budgetController, UIController);
// calling the setupEventListeners function, without that nothing will run
controller.init();
