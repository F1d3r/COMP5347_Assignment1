// Load the JSON object through the JSON file
function getJsonObject(path, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
              if (success) success(JSON.parse(xhr.responseText));
          } else {
              if (error) error(xhr);
          }
      }
  };
  // async here is set to false for local environment test.
  xhr.open("GET", path, true);
  xhr.send();
}


window.onload = function () {
    var bookList = [];
    var elements = {};
    var selectBookList = [];
    var bookCategory = [];

    // Get the JSON Object from the data.json file.
    getJsonObject("./data.json",
        function(data) {
            bookList = data;
            selectBookList = bookList;

            // Get neccessary element for the script.
            getElements(elements);

            // console.log(elements["mainForm"]);
            // console.log(elements["table"]);
            // console.log(elements["tableBody"]);
            // console.log(elements["dropdown"]);
            // console.log(elements["addBtn"]);
            // console.log(elements["resetBtn"]);
            // console.log(elements["cartNumber"]);
            // console.log(elements["searchInput"]);
            // console.log(elements["categorySelect"]);
            // console.log(elements["checkboxes"]);
            // console.log(elements["popup"]);
            // console.log(elements["quantityInput"]);
            // console.log(elements["confirmBtn"]);
            // console.log(elements["darkCheckbox"]);

            setCategory(selectBookList, bookCategory);
            // console.log(bookCategory);

            loadTable(elements["tableBody"], selectBookList, elements);
            // console.log(elements["checkboxes"]);

            setDropdown(elements["dropdown"], bookCategory);

            addHover(elements["tableBody"]);

            linkCheckboxes(elements["checkboxes"]);

            setAddBtn(elements);

            setResetBtn(elements["resetBtn"],elements["cartNumber"] , elements["checkboxes"]);

            setPopup(elements);

            setSubmit(elements, bookList, bookCategory, selectBookList);

            setDarkMode(elements["darkCheckbox"]);

        },
        function(xhr) { console.error(xhr); }
    )

}


function setDarkMode(darkCheckbox){
    console.log(darkCheckbox);
    // Set listener to dark mode checkbox
    darkCheckbox.addEventListener("click", ()=>{
        let body = document.querySelector("body");
        let table = document.querySelector("table");
        let tableBody = table.querySelector("tbody");
        let tableHead = document.querySelector("thead");
        let pageTitle = document.getElementById("pageTitle");
        let popup = document.querySelector("div#popup");

        table.classList.toggle("darkMode");
        tableBody.classList.toggle("darkMode");
        tableBody.querySelectorAll("tr").forEach(row =>{
            row.classList.toggle("darkMode");
        })

        tableHead.classList.toggle("darkMode");
        body.classList.toggle("darkMode");
        mainForm.classList.toggle("darkMode");
        pageTitle.classList.toggle("darkMode");
        popup.classList.toggle("darkMode");
    })
}


function setSubmit(elements, bookList, bookCategory, selectBookList){
    let mainForm = elements["mainForm"];
    let tableBody = elements["tableBody"];
    let categorySelect = elements["categorySelect"];
    let searchInput = elements["searchInput"];

    // Add on submit event.
    mainForm.onsubmit = function(){

        // Prevent the page to refresh.
        event.preventDefault();

        // Add rows for the table according the json file content and the search/filter input.
        // First add matched books into select book list.
        if(categorySelect.value == -1){
            // Do nothing.
        }
        // Select 'All'
        else if(categorySelect.value == 0){
            selectBookList = [];
            selectBookList = bookList;
        }
        else{
            selectBookList = [];
            bookList.forEach(book => {
                if(book['category'] == bookCategory[categorySelect.value]){
                    selectBookList.push(book);
                }
            })
        }
        
        // Reload the table
        loadTable(tableBody, selectBookList, elements);
        // Add hover to all rows.
        addHover(tableBody);
        // 
        setAddBtn(elements);
        linkCheckboxes(elements["checkboxes"]);
        

        // Then change the background color of searched books.
        tableBody.querySelectorAll("tr").forEach(row => {
            if(searchInput.value == "" || searchInput.value == null){
                // console.log("Empty search input.");
                // console.log("not match");
                row.setAttribute("class", "");
                return;
            }
            // If the title of the row match the search input.
            if(row.childNodes[2].firstChild.innerHTML.includes(searchInput.value)){
                // console.log("match");
                row.classList.add("matchSearch");
            }else{
                // console.log("not match");
                row.classList.remove("matchSearch");
            }
        })
    }
}


// Hide the popup when the focus out of the quantity input field.
// Add listener to the confirm button, to check the input, and update the cart.
function setPopup(elements){
    let quantityInput = elements["quantityInput"];
    let popup = elements["popup"];
    let confirmBtn = elements["confirmBtn"];
    let cartNumber = elements["cartNumber"];

    // Add listener to the popup item. Hide the item when it loses focus.
    quantityInput.addEventListener("focusout", (event)=>{
        // If the focus is not captured by the confirmation button. Hide the popup.
        if(!confirmBtn.contains(event.relatedTarget)){
            quantityInput.value = "";
            popup.classList.add("hidden");
        }
    })


    // Add listener to the confirmation button.
    confirmBtn.addEventListener("click", ()=>{
        let num = parseInt(cartNumber.innerHTML.slice(1, -1), 10);
        let input_num = parseInt(quantityInput.value);
        let regex = /^[0-9]+$/;

        if(input_num == NaN){
            quantityInput.focus();
        }
        else if(input_num >= quantityInput.min && input_num <= quantityInput.max && regex.test(quantityInput.value)){
            num += input_num
            quantityInput.value="";
            cartNumber.innerHTML = "(" + num + ")";
            // Hide the item when clicking confirm.
            popup.classList.add("hidden");
        }
        else{
            console.log("invalid");
            quantityInput.classList.add("invalid");
            setTimeout(()=>{
                quantityInput.classList.remove("invalid");
            }, 1000)
            quantityInput.focus();
        }
    })
}


function setResetBtn(resetBtn, cartNumber, checkboxes){
    // Add listener to add to reset button.
    resetBtn.addEventListener("click", ()=>{
        // Ask the user for confirmation before the reset.
        let confirmReset = confirm("Are you sure to reset the cart?");
        if(confirmReset){
            // console.log("Cart is reset.");
            cartNumber.innerHTML = "(" + 0 + ")";
            // Then uncheck all books.
            checkboxes.forEach(checkbox => {
                if(checkbox.checked){
                    checkbox.checked = false;
                }
            });
        }
        
    })
}


// Add listener to the add button.
function setAddBtn(elements){
    let checkboxes = elements["checkboxes"];
    let popup = elements["popup"];
    let quantityInput = elements["quantityInput"]

    // Add listener to add to add button.
    elements["addBtn"].addEventListener("click", listenCheckbox=>{
        // Works only when a checkbox is checked.
        console.log("test");
        console.log(checkboxes);
        checkboxes.forEach(checkbox =>{
            if(checkbox.checked){
                checkbox.checked = false;
                popup.classList.remove("hidden");
                quantityInput.focus();
            }
        })

    })

}


// Link all checkboxes, uncheck others when any of one is checked.
function linkCheckboxes(checkboxes){

    checkboxes.forEach(checkbox =>{
        // Add listener to each boxes.
        checkbox.addEventListener("change", ()=>{
            checkboxes.forEach(box =>{
                // Uncheck every other boxes.
                if(box != checkbox){
                    box.checked = false;
                }
            })
        })
    })
}


// For given row, link the events of clicking its area and the clicking the checkbox. 
function linkRowCheckbox(row){
    let checkbox = row.querySelector("input[type='checkbox']");
    checkbox.onclick = function(){
        event.stopPropagation();
    }

    // Trigger the change event of the checkbox.
    row.onclick = function(){
        console.log("Row clicked");
        let checkbox = row.querySelector("input[type='checkbox']");
        console.log(checkbox);
        checkbox.checked = !checkbox.checked;
        
        // Then trigger the change event of the checkbox
        let changeEvent = new Event("change");
        checkbox.dispatchEvent(changeEvent);
    }
}


// For given table body, add listener to all its row elements, allowing them to detect hover of
// mouse and highlight corresponding row.
function addHover(tableBody){
    tableBody.querySelectorAll("tr").forEach(row => {
        // Add hover to classList when mosue enter/leave the row area.
        row.onmouseenter = function(){
            row.classList.add('mouseHover');
        }
        row.onmouseleave = function(){
            row.classList.remove('mouseHover');
        }
        // Link the click event of checkbox and row elements.
        linkRowCheckbox(row);
    });
}


// Add a row of book info into the table body.
function addRow(tableBody, book){
    let newRow = tableBody.insertRow();
    if(tableBody.classList.contains("darkMode")){
        newRow.classList.add("darkMode");
    }

    // Add checkbox
    let new_data = document.createElement("td");
    let checkbox_cell = document.createElement("input");
    checkbox_cell.setAttribute("type", "checkbox"); 
    new_data.appendChild(checkbox_cell);
    newRow.appendChild(new_data);

    // Add image
    new_data = document.createElement("td");
    let img_cell = document.createElement("img");
    img_cell.setAttribute("class", "bookThumbnail");
    img_cell.setAttribute("src", book["img"]);
    img_cell.setAttribute("alt", book["title"]);
    new_data.appendChild(img_cell);
    newRow.appendChild(new_data);

    // Add title
    new_data = document.createElement("td");
    let title_cell = document.createElement("label");
    title_cell.innerHTML = book["title"];
    new_data.appendChild(title_cell);
    newRow.appendChild(new_data);

    // Add rating
    new_data = document.createElement("td");
    let rating_cell = document.createElement("div");
    rating_cell.setAttribute("class", "flex-row");
    // Add stars according to the rating.
    for(let i = 1; i <= 5; i++){
        if(i <= book["rating"]){
            let star = document.createElement("img");
            star.setAttribute("class", "icons");
            star.setAttribute("src", "./images/star-16.ico");
            star.setAttribute("alt", "star");
            rating_cell.appendChild(star);
        }
        else{
            let outline_star = document.createElement("img");
            outline_star.setAttribute("class", "icons");
            outline_star.setAttribute("src", "./images/outline-star-16.ico");
            outline_star.setAttribute("alt", "outline_star");
            rating_cell.appendChild(outline_star);
        }
    }
    new_data.appendChild(rating_cell);
    newRow.appendChild(new_data);

    // Add authors
    new_data = document.createElement("td");
    var author_cell = document.createElement("label");
    author_cell.innerHTML = book["authors"];
    new_data.appendChild(author_cell);
    newRow.appendChild(new_data);

    // Add year
    new_data = document.createElement("td");
    var year_cell = document.createElement("label");
    year_cell.innerHTML = book["year"];
    new_data.appendChild(year_cell);
    newRow.appendChild(new_data);

    // Add price
    new_data = document.createElement("td");
    var price_cell = document.createElement("label");
    price_cell.innerHTML = book["price"];
    new_data.appendChild(price_cell);
    newRow.appendChild(new_data);

    // Add publisher
    new_data = document.createElement("td");
    var pub_cell = document.createElement("label");
    pub_cell.innerHTML = book["publisher"];
    new_data.appendChild(pub_cell);
    newRow.appendChild(new_data);

    // Add category
    new_data = document.createElement("td");
    var cate_cell = document.createElement("label");
    cate_cell.innerHTML = book["category"];
    new_data.appendChild(cate_cell);
    newRow.appendChild(new_data);
}


function setDropdown(dropdown, bookCategory){
    // Add the categories into the drop down menu
    for(let i = 0; i < bookCategory.length; i++){
        let option = document.createElement("option");
        option.innerHTML = bookCategory[i];
        option.value = i;
        dropdown.appendChild(option);
    }
}


// Given selected books, update the table and the checkboxes.
function loadTable(tableBody, selectBookList, elements){
    while(tableBody.firstChild){
        tableBody.removeChild(tableBody.firstChild);
    }

    // Add rows for the table according the json file content.
    for(let i = 0; i < selectBookList.length; i++){
        addRow(tableBody, selectBookList[i]);
    }
    // Update checkboxes
    elements["checkboxes"] = tableBody.querySelectorAll('input[type="checkbox"]');
}


// Given the selected book list, identify all distinct category.
function setCategory(selectBookList, bookCategory){
    // Add additional all option to the menu.
    bookCategory.push("All");
    for(let i = 0; i < selectBookList.length; i++){
        // Add the distinct category.
        if(!bookCategory.includes(selectBookList[i]['category'])){
            bookCategory.push(selectBookList[i]['category']);
        }
    }
    // Add additional other option to the menu.
    bookCategory.push("Other");
}


// Load all necessary element from the page.
function getElements(elements){
    // Get the form.
    let mainForm = document.getElementById("mainForm");
    // Get table body.
    let table = document.querySelector("table");
    // Get table body.
    let tableBody = document.querySelector("table tbody");
    // // Get the dropdown menu.
    let dropdown = document.querySelector("select");
    // Get the add button.
    let addBtn = document.getElementById("add_to_cart");
    // Get the reset button.
    let resetBtn = document.getElementById("reset_cart");
    // Get the cart.
    let cartNumber = document.getElementById("cart_number");
    // Get the search input.
    let searchInput = document.getElementById("searchbox");
    // Get the category selection.
    let categorySelect = document.getElementById("filterselect");
    // Variable to record all checkboxes.
    let checkboxes = [];
    // Get the popup item.
    let popup = document.querySelector("div.popupNumber");
    // Get the input field.
    let quantityInput = popup.querySelector("input[type='number']");
    // Get the popup confirm button.
    let confirmBtn = popup.querySelector("input[type='button']")
    // Get the dark mode checkbox.
    let darkCheckbox = document.getElementById("darkModeCheckBox");
    
    elements.mainForm = mainForm;
    elements.table = table;
    elements.tableBody = tableBody;
    elements.dropdown = dropdown;
    elements.addBtn = addBtn;
    elements.resetBtn = resetBtn;
    elements.cartNumber = cartNumber;
    elements.searchInput = searchInput;
    elements.categorySelect = categorySelect;
    elements.checkboxes = checkboxes;
    elements.popup = popup;
    elements.quantityInput = quantityInput;
    elements.confirmBtn = confirmBtn;
    elements.darkCheckbox = darkCheckbox;
}