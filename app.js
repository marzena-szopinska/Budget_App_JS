// Creating modules
// We create modules because we want to keep pieces of code that are related to one another together inside of separate,
// independed, and organized unites. We use closures and IIFEs - immidiatelly called functions, to make our modules private, 
// we will also expose some pieces for public use.

// ARCHITECTURE OF AN APPLICATION


// BUDGET CONTROLLER
var budgetController = (function() {

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }
    
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            // create new id
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            // create new item based on 'inc' or 'exp' type
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            //push it into out data structure
            data.allItems[type].push(newItem);
            // return the new element
            return newItem;
            
        },

        testing: function(){
            console.log(data);
        }


    };


})();

// UI CONTROLLER
var UIController = (function(){
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
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
        },

        addListItem: function(obj, type){
            var html, newHTML, element;
            // create HTML string with placeholder text
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // replace the placeholder text with some actual data
            newHTML = html.replace('%id%', obj.id); // replace %id% with that what's in obj.id
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value);

            // instert the HTML into the DOM
            document.quesrySelector(element).insertAdjacentHTML('beforeend', newHTML);

        }
    };

})();

// GLOBAL APP CONTROLLER
// conecting budgetController with UIController
var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings();
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
        var input, newItem;
        // get input data
        input = UICtrl.getInput();

        // add item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

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
