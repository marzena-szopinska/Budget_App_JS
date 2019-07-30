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
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };


    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
        // calculate the sum 
        var sum = 0;
        data.allItems[type].forEach(function(curr){
            sum = sum + curr.value;
        });
        // store sum data into totals 
        data.totals[type] = sum;

    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    
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


        deleteItem: function(type, id){
            var ids, index;
            // current element, index, entire element, returns brand new array
            ids = data.allItems[type].map(function(current){
                return current.id;
            })

            // find index
            index = ids.indexOf(id);

            // delete the item from an array
            if(index !== -1){
                //remove just one element on the specified index
                // splice will start removing elements from a specified index, thats why its important to specify how many elements it should remove
                data.allItems[type].splice(index, 1); // index of an item we want to delete, and a number of how many elements we want to delete
            }
        },

        calculateBudget: function(){
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income that we spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                DOMMatrixReadOnly.percentage = -1;
            }
        },

        calculatePercentages: function(){
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });

            return allPerc;
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage'
    };

    
    var formatNumber = function(num, type){
        var numSplit, int, dec, type;
        // + or - before a number
        // 2 decimal points
        // comma separating the thousands
        // 2310.4567 -> + 2,310.46
        // 2000 -> + 2,000.0

        num = Math.abs(num) // removes sign of the number
        num = num.toFixed(2); // return string example: (2.4567).toFixed(2) -> '2.46'

        numSplit = num.split('.');
        int = numSplit[0];

        if(int.length > 3){
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); // input 23510 output 23,510
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    return {
        getInput: function(){
            // return an object with things that user typed in
            return {
                // get the value of selected
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                // get the values
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }

        },

        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel); // returns node list, its because the DOM tree where all of the html elements of our page are stored, each element is called a node.

            var nodeListForEach = function(list, callback) {
                for(var i = 0; i < list.length; i++){
                    callback(list[i], i);

                }
            }

            nodeListForEach(fields, function(current, index){
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
                
            });
        },

        getDOMstrings: function(){
            return DOMstrings;
        },

        addListItem: function(obj, type){
            var html, newHTML, element;
            // create HTML string with placeholder text
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // replace the placeholder text with some actual data
            newHTML = html.replace('%id%', obj.id); // replace %id% with that what's in obj.id
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', formatNumber(obj.value, type));

            // instert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);

        },

        deleteListItem: function(selectorId){
            var el = document.getElementById(selectorId);
            // removing from the DOM
            el.parentNode.removeChild(el);
        },

        clearFields: function(){
            var fields, fieldsArr;
            // ',' - separates different selectors, so you can actually call multiple selectors and join them together
            // !! querySelectorAll returns a list, not an array
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            // converting a list into an array, so we can loop over the array
            fieldsArr = Array.prototype.slice.call(fields);
            // loop over the array , forEach have access to three arguments: current value, index number and entire array
            fieldsArr.forEach(function(current, index, array) {
                // clear each input
                current.value = '';
            });
            // add focus back to this element
            fieldsArr[0].focus();
        },

        displayBudget: function(obj){
            var type;
            type = obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            

            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function() {
        // calculate  the budget
        budgetCtrl.calculateBudget();

        // return the budget
        var budget = budgetCtrl.getBudget();

        // display the budget on the UI
        UICtrl.displayBudget(budget);
    };


    var updatePercentages = function(){
        // calculate percentages 
        budgetCtrl.calculatePercentages();

        // read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();


        // update the UI with the new percentages
        UICtrl.displayPercentages(percentages);

    };


    var ctrlAddItem = function() {
        var input, newItem;
        // get input data
        input = UICtrl.getInput();
        // check if inputs arent empty, if they are do nothing
        if(input.description !== '' && !isNaN(input.value) && input.value > 0){
            // add item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // add new item to the UI
            UICtrl.addListItem(newItem, input.type);

            // clear the fields
            UICtrl.clearFields();

            // calculate and update budget
            updateBudget();

            // calculate and update percentages
            updatePercentages();
        }
    }


    var ctrlDeleteItem =  function(event){
        var itemID, splitID, type, ID;
        // get an id of the container that holds description and value
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){
            splitID = itemID.split('-'); // returns ['inc', '0']
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // delete the item from the UI
            UICtrl.deleteListItem(itemID);

            // update and show the new budget
            updateBudget();

            // calculate and update percentages
            updatePercentages();
        }
    };

    // public function initialization for our events
    return {
        init: function(){
            console.log('Application has started!');
            UICtrl.displayBudget(
                {
                    budget: 0,
                    totalInc: 0,
                    totalExp: 0,
                    percentage: -1
                }
            );
            setupEventListeners();
        }
    }


})(budgetController, UIController);
// calling the setupEventListeners function, without that nothing will run
controller.init();
