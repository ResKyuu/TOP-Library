//Array where all the Books are being stored in
const myLibrary = [];

//Initializing all the globally needed HTML Elements
const tbody = document.querySelector("#book-list");
const dialog = document.querySelector("dialog");
const showButton = document.querySelector("#showBookDialog");
const closeButton = document.querySelector("#cancelBook");
const addNewBookBtn = document.querySelector("#confirmBook");
const dialogHeader = document.getElementById("dialogHeader");

const forms = document.querySelectorAll("form");
const titleError = document.querySelector("#title + span.error");
const authorError = document.querySelector("#author + span.error");
const pagesError = document.querySelector("#pages + span.error");
const title = document.querySelector("#title");
const author = document.querySelector("#author");
const pages = document.querySelector("#pages");
let inputArray = [title, author, pages];
let errorArray = [titleError, authorError, pagesError];

//Global variables needed to edit books
let editMode = false;
let currentBookId;

class Book {
  //Constructor for all Books
  constructor(id, title, author, pages, available) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.available = available;
  }
}

//Constructor for all Books
/*function Book(id, title, author, pages, available) {
  this.id = id;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.available = available;
}
  */

//Function to add all Books to the Library

function addBookToLibrary(id, title, author, pages, available) {
  const newBook = new Book(id, title, author, pages, available);
  myLibrary.push(newBook);
}

//Function to display all Books on page load, which exist in the Library Array
function displayBooks(myLibrary) {
  tbody.innerHTML = "";
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
  clearErrors();
  dialog.showModal();
});

//Event Listener for 'Cancel" Button
//Closes dialog on "Cancel" button click
closeButton.addEventListener("click", () => {
  if (editMode === true) {
    editMode = false;
    console.log("editMode deactivated");
  }
  clearErrors();
  dialog.close();
  dialog.querySelector("form").reset();
});

//Event Listener for the "Confirm" Button
//On "Confirm" button click of Dialog, Adds/Edits New Book to the Library and displays it
forms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    let valid = true;
    inputArray.forEach((input, idx) => {
      if (!input.validity.valid) {
        showError(input, errorArray[idx]);
        valid = false;
      }
    });
    if (!valid) {
      event.preventDefault();
      return;
    }

    // Handle add/edit logic here
    const titleRef = title;
    const authorRef = author;
    const pagesRef = pages;
    const availableRef = document.querySelector("#available");

    if (!editMode) {
      const uniqueID = crypto.randomUUID();
      addBookToLibrary(
        uniqueID,
        titleRef.value,
        authorRef.value,
        pagesRef.value,
        availableRef.checked
      );
    } else {
      editBook(titleRef, authorRef, pagesRef, availableRef);
      currentBookId = "";
      editMode = false;
    }
    displayBooks(myLibrary);
    form.reset();
    dialog.close();
    event.preventDefault(); // Prevent default dialog close
  });
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
    const titleRef = document.querySelector("#title");
    const authorRef = document.querySelector("#author");
    const pagesRef = document.querySelector("#pages");
    const availableRef = document.querySelector("#available");

    const bookLibraryIndex = myLibrary.findIndex((Book) => {
      if (Book.id === bookId) {
        return true;
      } else {
        return false;
      }
    });
    titleRef.value = myLibrary[bookLibraryIndex].title;
    authorRef.value = myLibrary[bookLibraryIndex].author;
    pagesRef.value = myLibrary[bookLibraryIndex].pages;
    availableRef.checked = myLibrary[bookLibraryIndex].available;
    console.log(bookLibraryIndex);

    //${row.cells[1].textContent} = Title | ${row.cells[2].textContent} = Author
    dialogHeader.innerHTML = `Edit Book ${myLibrary[bookLibraryIndex].title} by ${myLibrary[bookLibraryIndex].author}`;
    editMode = true;
    console.log("editMode Activated");
    currentBookId = bookId;
    clearErrors();
    dialog.showModal();
  });

  //Event Listener for "Delete" Button
  //Delete Table row and Library Array entry
  deleteButton.addEventListener("click", () => {
    const bookLibraryIndex = myLibrary.findIndex((Book) => {
      if (Book.id === bookId) {
        return true;
      } else {
        return false;
      }
    });
    myLibrary.splice(bookLibraryIndex, 1);
    displayBooks(myLibrary);
  });
}

function editBook(title, author, pages, availability) {
  const bookLibraryIndex = myLibrary.findIndex((Book) => {
    if (Book.id === currentBookId) {
      return true;
    } else {
      return false;
    }
  });
  myLibrary[bookLibraryIndex].title = title.value;
  myLibrary[bookLibraryIndex].author = author.value;
  myLibrary[bookLibraryIndex].pages = pages.value;
  myLibrary[bookLibraryIndex].available = availability.checked;
  console.log(myLibrary);
  console.log("Edit Mode deactivated");
}

inputArray.forEach((inputType, index) => {
  inputType.addEventListener("input", (event) => {
    if (inputType.validity.valid) {
      errorArray[index].textContent = "";
      errorArray[index].className = "error";
    } else {
      showError(inputType, errorArray[index]);
    }
  });
});

function showError(inputType, errorType) {
  if (inputType === title) {
    if (title.validity.valueMissing) {
      errorType.textContent = "Please enter a title.";
    } else if (title.validity.tooShort) {
      errorType.textContent = `Title must be at least ${title.minLength} characters; you entered ${title.value.length}.`;
    } else if (title.validity.patternMismatch) {
      errorType.textContent =
        "Title can only contain letters, spaces, hyphens, apostrophes, and periods.";
    }
  } else if (inputType === author) {
    if (author.validity.valueMissing) {
      errorType.textContent = "Please enter an author.";
    } else if (author.validity.tooShort) {
      errorType.textContent = `Author must be at least ${author.minLength} characters; you entered ${author.value.length}.`;
    } else if (author.validity.patternMismatch) {
      errorType.textContent =
        "Author can only contain letters, spaces, hyphens, apostrophes, and periods.";
    }
  } else if (inputType === pages) {
    if (pages.validity.valueMissing) {
      errorType.textContent = "Please enter the number of pages.";
    } else if (pages.validity.rangeUnderflow) {
      errorType.textContent = `The number of pages must be at least ${pages.min}.`;
    }
  }
  errorType.className = "error active";
}

function clearErrors() {
  errorArray.forEach((errorSpan) => {
    errorSpan.textContent = "";
    errorSpan.className = "error";
  });
}

addBookToLibrary(crypto.randomUUID(), "Book 1", "reskyuu", 20, true);
addBookToLibrary(crypto.randomUUID(), "Book 2", "reskyuu ", 25, true);
addBookToLibrary(crypto.randomUUID(), "Book 3", "reskyuu", 30, false);
displayBooks(myLibrary);
