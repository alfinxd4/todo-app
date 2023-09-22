// container list books
const books = [];
// define custom event RENDER EVENT
const RENDER_EVENT = 'render-book';
// define custom event SAVED EVENT
const SAVED_EVENT = 'saved-book';
// define STORAGE KEY 
const STORAGE_KEY = 'BOOK_APPS';
// 
// check web storage
const isStorageExist = () => {
    // web storage available
    if (typeof (Storage) !== undefined) {
        return true;
    } // web storage undefined
    else {
      alert("Browser doesn't support local storage");
      return false;
    }
  };
//   
// create unique id for book
const createId = () => {
    // get timestamp
    return +new Date();
};
// define book object data
const generateBookObject = (id,title,author,year,isCompleted) => {
    return {
        id,
        title,
        author,
        year,
        isCompleted
      }
};
// save data after submit
const saveData = () => {
    // check web storage
    if (isStorageExist()) {
     // changed data from obj.js to JSON String
    const parsed = JSON.stringify(books);
    // set local storage to save data
    localStorage.setItem(STORAGE_KEY, parsed);
    // create custom event
    document.dispatchEvent(new Event(SAVED_EVENT));
    }
  };
//  add data book
const addBook = () => {
    // get data from input value
    const titleBook = document.getElementById('title').value;
    const authorBook =  document.getElementById('author').value;
    const yearBook =  document.getElementById('year').value;
    // get unique id    
    const generateId = createId();
    // get book object
    const bookObject = generateBookObject(generateId,titleBook,authorBook,yearBook,false);
    // push new data to list book
    books.push(bookObject);
    // save data from local storage
    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
};
// create list book {UI}
const makeBook = (bookObject) => {

    // create title book
    const titleBook = document.createElement('h4');
    titleBook.classList.add('title-book', 'text-light', 'mb-0');
    // define element by book object
    titleBook.innerText = bookObject.title;
    // create author book
    const authorBook = document.createElement('p');
    authorBook.classList.add('desc-task', 'text-light', 'mb-0');
    authorBook.innerText = bookObject.author;
    // create year book
    const yearBook = document.createElement('p');
    yearBook.classList.add('desc-task', 'text-light', 'fst-italic', 'mb-0');
    yearBook.innerText = bookObject.year;
    // create book container
    const bookContainer = document.createElement('div');
    bookContainer.classList.add('col-10', 'col-lg-11');
    // add element
    bookContainer.appendChild(titleBook);
    bookContainer.appendChild(authorBook);
    bookContainer.appendChild(yearBook);
    // create book container
    const iconContainer = document.createElement('div');
    iconContainer.classList.add('col-2', 'col-lg-1');
    // create container
    const container = document.createElement('div');
    container.classList.add('row', 'book-incompleted' ,'my-4' ,'py-3' ,'rounded-3');
    // add element
    container.append(bookContainer);
    container.append(iconContainer);
    // set id book
    container.setAttribute('id', `book-${bookObject.id}`);
        // create icon check
        const checkButton = document.createElement('iconify-icon');
        checkButton.classList.add('icon-check');
        checkButton.setAttribute('icon', 'ic:outline-circle');
        checkButton.setAttribute('width', 30);
        // create icon trash
        const trashButton = document.createElement('iconify-icon');
        trashButton.classList.add('icon-trash');
        trashButton.setAttribute('icon', 'mdi:trash');
        trashButton.setAttribute('width', 30);
        trashButton.setAttribute('data-bs-toggle', "modal");
        trashButton.setAttribute('data-bs-target', "#deleteModal");
        // create icon column check 
        const columnCheck = document.createElement('div');
        columnCheck.classList.add('text-end');
        columnCheck.append(checkButton);
        // create icon column check 
        const columnTrash = document.createElement('div');
        columnTrash.classList.add('text-end');
        columnTrash.append(trashButton);
        // add element  
        iconContainer.appendChild(columnCheck);
        iconContainer.appendChild(columnTrash);
    //  check book status completed
    if (bookObject.isCompleted) {
      container.classList.remove('book-incompleted');
      container.classList.add('book-completed', 'opacity-75');
      titleBook.classList.add('text-decoration-line-through');
      authorBook.classList.add('text-decoration-line-through');
      yearBook.classList.add('text-decoration-line-through');
      checkButton.removeAttribute('icon', 'ic:outline-circle');
      checkButton.setAttribute('icon', 'gg:check-o');
      checkButton.addEventListener('click',function () {
        undoBookFromCompleted(bookObject.id);
    });
      trashButton.addEventListener('click',function () {
        removeBookFromList(bookObject.id);
    });
    }
    //  check book status notcompleted
    else {
    // event listener
    checkButton.addEventListener('click',function () {
      addBookFromCompleted(bookObject.id);
  });
    trashButton.addEventListener('click',function () {
        removeBookFromList(bookObject.id);
    });
}
    // load all element above 
    return container;
}
// find list of book
const findBook = (bookId) => {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
          return bookItem;
        }
      }
      return null;
}
// find index book from list books
const findBookIndex = (bookId) => {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}
// add book from book list to completed list
const addBookFromCompleted = (bookId) => {
  const bookTarget = findBook(bookId);
  if(bookTarget === null) return;
  bookTarget.isCompleted = true;
  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT))
}
// remove book from list book {in completed}
const removeBookFromList = (bookId) => {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);
    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
// 
const undoBookFromCompleted = (bookId) => {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isCompleted = false;
  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT));
}
// 
// load data from local storage
const loadDataFromStorage = () => {
    // get data local storage
    const serializedData = localStorage.getItem(STORAGE_KEY);
    // parse data 
    let data = JSON.parse(serializedData);
    // check data avaiable
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}
// render element
document.addEventListener(RENDER_EVENT,function () {
    console.log(books);
    // 
    const uncompletedBookList = document.getElementById('books');
    uncompletedBookList.innerHTML = '';
    // 
    const completedBookList = document.getElementById('read-book');
    completedBookList.innerHTML = '';
    //   
    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
          uncompletedBookList.append(bookElement);
        }else{
            completedBookList.append(bookElement);
        }
      }
});
// saved data local storage
document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });
// evenet listener after click button submit
document.addEventListener('DOMContentLoaded',function () {
    // get element form
    const submitForm = document.getElementById('form');
    // event add 
    submitForm.addEventListener('submit',function (ev) {
        // cancel refresh web
        // ev.preventDefault();
        // get method add book
        addBook();
    });
    // check web storage
    if (isStorageExist()) {
    loadDataFromStorage();
    }
  });
//  
  


