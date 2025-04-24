const myLibrary = [];
const tbody = document.querySelector("#book-list");
const dialog = document.querySelector("dialog");
const showButton = document.querySelector("#showBookDialog");
const closeButton = document.querySelector("#cancelBook");
const addNewBookBtn = document.querySelector("#confirmBook");

function Book(id, title, author, pages, available) {
  this.id = id;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.available = available;
}

function addBookToLibrary(id, title, author, pages, available) {
  const newBook = new Book(id, title, author, pages, available);
  myLibrary.push(newBook);
}

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
  });
}

showButton.addEventListener("click", () => {
  dialog.showModal();
});

closeButton.addEventListener("click", () => {
  dialog.querySelector("form").reset();
});

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

  form.reset();
  dialog.close();
});
