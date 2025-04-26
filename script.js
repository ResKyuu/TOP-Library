//Array where all the Books are being stored in
const myLibrary = [];

//Initializing all the globally needed HTML Elements
const tbody = document.querySelector("#book-list");
const dialog = document.querySelector("dialog");
const showButton = document.querySelector("#showBookDialog");
const closeButton = document.querySelector("#cancelBook");
const addNewBookBtn = document.querySelector("#confirmBook");
const dialogHeader = document.getElementById("dialogHeader");

//Global variables needed to edit books
let editMode = false;
let currentBookId;

//Constructor for all Books
function Book(id, title, author, pages, available) {
  this.id = id;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.available = available;
}

//Function to add all Books to the Library
function addBookToLibrary(id, title, author, pages, available) {
  const newBook = new Book(id, title, author, pages, available);
  myLibrary.push(newBook);
}

//Function to display all Books on page load, which exist in the Library Array
function displayBooks(myLibrary) {
  myLibrary.forEach((Book) => {
    const newRow = tbody.insertRow();
    const bookID = newRow.insertCell();
    const bookTitle = newRow.insertCell();
    const bookAuthor = newRow.insertCell();
    const bookPages = newRow.insertCell();
    const bookavailable = newRow.insertCell();
    bookID.appendChild(document.createTextNode(Book.id));
    bookTitle.appendChild(document.createTextNode(Book.title));
    bookAuthor.appendChild(document.createTextNode(Book.author));
    bookPages.appendChild(document.createTextNode(Book.pages));
    bookavailable.appendChild(
      Book.available
        ? document.createTextNode("Available")
        : document.createTextNode("Not Available")
    );
    createButtons(newRow, Book.id);
  });
}

//Event Listener for "Add New Book" Button
//Shows Dialog on click of "Add New Book" button
showButton.addEventListener("click", () => {
  dialogHeader.innerHTML = "Add New Book";
  dialog.showModal();
});

//Event Listener for 'Cancel" Button
//Closes dialog on "Cancel" button click
closeButton.addEventListener("click", () => {
  dialog.close();
  dialog.querySelector("form").reset();
});

//Event Listener for the "Confirm" Button
//On "Confirm" button click of Dialog, Adds/Edits New Book to the Library and displays it
addNewBookBtn.addEventListener("click", () => {
  const form = dialog.querySelector("form");
  const titleRef = document.querySelector("#title");
  const authorRef = document.querySelector("#author");
  const pagesRef = document.querySelector("#pages");
  const availableRef = document.querySelector("#available");

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (editMode == false) {
    const newRow = tbody.insertRow();
    const bookID = newRow.insertCell();
    const bookTitle = newRow.insertCell();
    const bookAuthor = newRow.insertCell();
    const bookPages = newRow.insertCell();
    const bookavailable = newRow.insertCell();

    const uniqueID = crypto.randomUUID();
    addBookToLibrary(
      uniqueID,
      titleRef.value,
      authorRef.value,
      pages.value,
      availableRef.checked
    );

    bookID.appendChild(document.createTextNode(uniqueID));
    bookTitle.appendChild(document.createTextNode(titleRef.value));
    bookAuthor.appendChild(document.createTextNode(authorRef.value));
    bookPages.appendChild(document.createTextNode(pagesRef.value));
    console.log(bookavailable.value);
    bookavailable.appendChild(
      availableRef.checked
        ? document.createTextNode("Available")
        : document.createTextNode("Not Available")
    );
    createButtons(newRow, uniqueID);
    form.reset();
    dialog.close();
  } else {
    editBook(titleRef, authorRef, pagesRef, availableRef);
    form.reset();
    dialog.close();
  }
});

//Function to Create the "Edit" & "Delete" button to all Books in Table
function createButtons(row, bookId) {
  const editBook = row.insertCell();
  const deleteBook = row.insertCell();

  const editButton = document.createElement("button");
  editButton.classList.add("editButton");
  editButton.textContent = "Edit";

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("deleteButton");
  deleteButton.textContent = "Delete";

  editBook.appendChild(editButton);
  deleteBook.appendChild(deleteButton);

  //Event Listener for "Edit" Button
  editButton.addEventListener("click", () => {
    //${row.cells[1].textContent} = Title | ${row.cells[2].textContent} = Author
    dialogHeader.innerHTML = `Edit Book ${row.cells[1].textContent} by ${row.cells[2].textContent}`;
    editMode = true;
    console.log("editMode Activated");
    currentBookId = bookId;
    dialog.showModal();
  });

  //Event Listener for "Delete" Button
  //Delete Table row and Library Array entry
  deleteButton.addEventListener("click", () => {
    row.remove(-1);
    const bookLibraryIndex = myLibrary.findIndex((Book) => {
      if (Book.id === bookId) {
        return true;
      } else {
        return false;
      }
    });
    myLibrary.splice(bookLibraryIndex, 1);
  });
}

addBookToLibrary(crypto.randomUUID(), "test", "test", 20, true);
addBookToLibrary(crypto.randomUUID(), "test", "test", 20, true);
addBookToLibrary(crypto.randomUUID(), "test", "test", 20, true);
displayBooks(myLibrary);

function editBook(title, author, pages, availability) {
  for (const row of tbody.rows) {
    if (row.cells[0].textContent == currentBookId) {
      row.cells[1].innerHTML = title.value;
      row.cells[2].innerHTML = author.value;
      row.cells[3].innerHTML = pages.value;
      row.cells[4].innerHTML = availability.checked
        ? "Available"
        : "Not Available";
    }
  }
  //to be done, find the array entry and give it the new values
  editMode = false;
  console.log("Edit Mode deactivated");
}
