const { connectToDatabase, getProductsByDepartment, sortByPriceHighToLow, sortByPriceLowToHigh, sortByPopularityHighToLow, sortByPopularityLowToHigh, displayProducts } = require('./db_connection');

//Function to display the selection menu
function showMenu() {
    console.log("\nSelect one of these options (enter the digit only):");
    console.log("1. View all products");
    console.log("2. Sort products by price (high to low)");
    console.log("3. Sort products by price (low to high)");
    console.log("4. Show only Men's products");
    console.log("5. Show only Women's products");
    console.log("6. Show only Kids' products");
    console.log("7. Sort by popularity score (high to low)");
    console.log("8. Sort by popularity score (low to high)");
    console.log("9. Exit");
}

//Function to handle user selection
function handleSelection(selection) {
    switch (selection) {
        case '1':
            connectToDatabase((connection) => {
                const query = 'SELECT * FROM products';
                connection.query(query, (err, results) => {
                    if (err) {
                        console.error("Error fetching products:", err.message);
                        return;
                    }
                    displayProducts(results);
                    promptUser(); 
                });
            });
            break;

        case '2':
            connectToDatabase((connection) => {
                sortByPriceHighToLow((results) => {
                    displayProducts(results);
                    promptUser(); 
                });
            });
            break;

        case '3':
            connectToDatabase((connection) => {
                sortByPriceLowToHigh((results) => {
                    displayProducts(results);
                    promptUser(); 
                });
            });
            break;

        case '4':
            connectToDatabase((connection) => {
                getProductsByDepartment(1, (results) => { // doesn't make sense
                    displayProducts(results);
                    promptUser(); 
                });
            });
            break;

        case '5':
            connectToDatabase((connection) => {
                getProductsByDepartment(2, (results) => {
                    displayProducts(results);
                    promptUser();  
                });
            });
            break;

        case '6':
            connectToDatabase((connection) => {
                getProductsByDepartment(3, (results) => { 
                    displayProducts(results);
                    promptUser();  
                });
            });
            break;

        case '7':
            connectToDatabase((connection) => {
                sortByPopularityHighToLow((results) => {
                    displayProducts(results);
                    promptUser(); 
                });
            });
            break;

        case '8':
            connectToDatabase((connection) => {
                sortByPopularityLowToHigh((results) => {
                    displayProducts(results);
                    promptUser();  
                });
            });
            break;

        case '9':
            console.log("Exiting...!");
            process.exit();
            break;

        default:
            console.log("Invalid selection. Please choose a valid option.");
            promptUser();  
            break;
    }
}

//Function to prompt user for input
function promptUser() {
    showMenu(); 
    process.stdout.write("\nEnter your selection: ");
    process.stdin.once('data', (data) => {
        const selection = data.toString().trim();
        handleSelection(selection);
    });
}

connectToDatabase((connection) => {
    promptUser();
});
