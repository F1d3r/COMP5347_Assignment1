# Environment requirement
The following are the development environment.
OS: Windows.
Browser tested: Edge, Chrome.
Node.js: 22.14.0
npm: 10.9.2
Similary version of above is required to run the application in a local server environment.


# Instruction to run the application
In the command line, go to the directory of the project and launch the local server by command _'http-server'_.
Using the urls provided in the browser to access the web page.


# Instruction to interact
## Browse the books
The main page of the application consists of two part: a form including the search box and category selection, and the table of book list.
The page will automatically load all available books recorded in the data.json file. The user can input to the search box or select according category of books in the form.
By clicking the _'search'_ or _'filter'_ button, the form will be submit and the search/filter will be applied. Books with selected category will be displayed and thoes who matches the search term will be highlighted. If there is no matched result to the search, an alert window will show up.

## Add books into cart
The user can add books into cart by first checking the corresponding checkbox or the area of corresponding row, then click _"add to cart"_ button, then enter the quantity at the popup panel and confirm the quantity by clicking the _"confirm"_ button.
When user input a value out of quantity range _[0,10]_ and click the confirm button, the input field will blink red to notice, then the focus will go back to the input field for further input.
The user can add one type of book into cart at once.

## Reset the cart
The user can reset the cart by clicking the _"reset the cart"_ button. A popup panel will show up asking for confirmation. The reset will be applied after the user confirm the reset.
Clear the search field and apply the search to see all available books.

## Darkmode
The user can use darkmode style by clicking the switch at the top-right corner of the page. Click again to return normal mode.


# Key features:
## Row where the user's cursor is placing at will be highlighted.
This is implemented by adding listener to onmouseenter event of the each table row element.
On mouse enter the row, add/remove _'mouseHover'_ class to the classList. The style of _'mouseHover'_ class sets the background color.

## The user can check the box by clicking the whole row area instead of only the box area.
This is implemented by adding listener to the onclick event of the each table row element. Onclick, trigger the change event of the corresponding checkbox.

## Checking one box will automatically uncheck other boxes.
An array of checkboxes are dynamically maintained in the javascript, whenever the search/filter is applied. On clicking of certain row, the change event of corresponding checkbox is triggered, at the time, all other checkboxes are unchecked besides the checked one.

## Dynamically combine the search and fileter.
By pressing either _'Search'_ or _'Filter'_ button, the effect of search and filter will be combined and applied. These behaviors are handled by _'onsubmit'_ event of the form.

## Automatically focus on the quantity input of the popup item after clicking the "add to cart" button.
On click the _"add to cart"_ button, set the focus by _quantity_input.focus()_.

## The quantity input will blink red to notice a invalid input
Detection of invalid input will add 'invalid' class to certain element. Using the animation of invalid class to implement the remind of invalid input. After the period of animation time, the invalid class is removed by _setTimeout()_.
Regular expression '/^[0-9]+$/' is used to check the user input. Any input besides _[0-9]_ will be treated as invalid.

## The user can increase/decrease the quantity by 1 using the arrows beside.
Implemented by _input[type='number']_.

## Hide the popup item after losing focus on the input field, by clicking other position of the page, etc.
_'hidden'_ class is added to the _classList_ of the popup element. On focusout of the _input[type='number']_ element, check if the confirm button get the focus. If not, indicates the user clicked other position of the page. Apply the _'hidden'_ class to pop up.

## Darkmode
Corresponding color style will automatically change in the darkmode, for example, the background color, color of row where the mouse hovers, color of rows which are highlighted.
