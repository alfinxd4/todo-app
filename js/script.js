
//   // container list todo
const todo = [];
// define custom event RENDER EVENT
const RENDER_EVENT = 'render-task';
// define custom event SAVED EVENT
const SAVED_EVENT = 'saved-task';
// define STORAGE KEY 
const STORAGE_KEY = 'TODO_APPS';
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
// create unique id
const createId = () => {
    // get timestamp
    return +new Date();
};
// define task object data
const generateTaskObject = (id,title,date,isCompleted) => {
    return {
        id,
        title,
        date,
        isCompleted
      }
};
// save data after submit
const saveData = () => {
    // check web storage
    if (isStorageExist()) {         ``
     // changed data from obj.js to JSON String
    const parsed = JSON.stringify(todo);
    // set local storage to save data
    localStorage.setItem(STORAGE_KEY, parsed);
    // create custom event
    document.dispatchEvent(new Event(SAVED_EVENT));
    }
  };
//  add data task
const addTask= () => {
    // get data from input value
    const titleTask =  document.getElementById('title').value;
 
    const dateTask =  document.getElementById('date').value;
    // get unique id    
    const generateId = createId();
    // get task object
    const taskObject = generateTaskObject(generateId,titleTask,dateTask,false);
    // push new data to list task
    todo.unshift(taskObject);
    // save data from local storage
    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
};
// create list task
const makeTask= (taskObject) => {
    // create title task
    const titleTask = document.createElement('h4');
    titleTask.classList.add('title-task', 'text-light', 'mb-0');
    // define element by task object
    titleTask.innerText = taskObject.title;
    // create date task
    const dateTask = document.createElement('p');
    dateTask.classList.add('desc-task', 'text-light', 'mb-0');
    dateTask.innerText = taskObject.date;
    // create task container
    const taskContainer = document.createElement('div');
    taskContainer.classList.add('col-10', 'col-lg-11', 'py-2');
    // add element
    taskContainer.appendChild(titleTask);
    taskContainer.appendChild(dateTask);
    // create task container
    const iconContainer = document.createElement('div');
    iconContainer.classList.add('col-2', 'col-lg-1');
    // create container
    const container = document.createElement('div');
    container.classList.add('row', 'todo-list' ,'my-4' ,'py-3' ,'rounded-3');
    // add element
    container.append(taskContainer);
    container.append(iconContainer);
    // set id task
    container.setAttribute('id', `task-${taskObject.id}`);
    // create icon check
    const checkButton = document.createElement('i');
    checkButton.classList.add('fa-regular', 'fa-circle');
    checkButton.setAttribute('style', 'color:#F9DC5C;cursor:pointer;font-size:1.5em');
    // create icon trash
    const trashButton = document.createElement('i');
    trashButton.classList.add('fa-solid', 'fa-trash');
    trashButton.setAttribute('style',  'color:#F9DC5C;cursor:pointer;font-size:1.5em');
    trashButton.setAttribute('data-bs-toggle', 'modal');
    trashButton.setAttribute('data-bs-target', '#deleteModal');
    // create icon column check 
    const columnCheck = document.createElement('div');
    columnCheck.classList.add('text-end','py-2');
    columnCheck.append(checkButton);
    // create icon column check 
    const columnTrash = document.createElement('div');
    columnTrash.classList.add('text-end');
    columnTrash.append(trashButton);
    // add element  
    iconContainer.appendChild(columnCheck);
    iconContainer.appendChild(columnTrash);
    //  check task has been completed
    if (taskObject.isCompleted) {
      container.setAttribute('style','background-color:#20BF55')
      container.classList.add('opacity-75');
      titleTask.classList.add('text-decoration-line-through', 'fst-italic');
      dateTask.classList.add('text-decoration-line-through', 'fst-italic');
      checkButton.classList.remove('fa-regular','fa-circle');
      checkButton.classList.add('fa-solid','fa-circle-check')
      // event listener
      checkButton.addEventListener('click',function () {
        undoTaskFromCompleted(taskObject.id);
    });
    trashButton.addEventListener('click',function () {
      const confirmDelete =  document.getElementById('confirmDelete');
      confirmDelete.addEventListener('click',function ( ) { 
          removeTaskFromList(taskObject.id);
        })
        });
    }
    //  check task status notcompleted
    else {
    // event listener
    checkButton.addEventListener('click',function () {
      addTaskFromCompleted(taskObject.id);
  });
   trashButton.addEventListener('click',function () {
    const confirmDelete =  document.getElementById('confirmDelete');
    confirmDelete.addEventListener('click',function ( ) { 
        removeTaskFromList(taskObject.id);
      })
      })
}
    // load all element above 
    return container;
}
// find list of task
const findTask = (taskId) => {
    for (const taskItem of todo) {
        if (taskItem.id === taskId) {
          return taskItem;
        }
      }
      return null;
}
// find index task from list todo
const findTaskIndex = (taskId) => {
  for (const index in todo) {
    if (todo[index].id === taskId) {
      return index;
    }
  }
  return -1;
}
// search task 
// get class 'bi-search' from icon-search
// event listener 'click'
$("#search-icon").click(function () {
  // get class 'bi' from icon-search
  // toogle btn for change icon after click
  $("#search-icon").toggleClass("fa-magnifying-glass fa-arrow-left");
  // get id 'toogler' from toogle-btn
  $("#toggler").toggle();
  // get id 'logo' from logo-todo
  $("#logo").toggle();
  // get id 'search-field' from input search-bar
  $("#search-field").toggle();
  // get id 'search-icon from icon-search
  // check class for conditional
  if ( $("#search-icon").hasClass("fa-arrow-left")) {
    // event listener click
    $(".fa-arrow-left").click(function () {
      // reset input field
      // $("#search-field").val('');
      // reload page
      location.reload()
    })
  }
});
// event listener keyup
// get id 'search-field' from input field
$("#search-field").on("keyup", function() {
// get input value and change it to lowercase
const inputValue = $(this).val().toLowerCase();
// get id 'task' n class 'todo-list' from container n list task
// filter data for search
$("#task .todo-list").filter(function() {
  // get input value and check index data available
  $(this).toggle($(this).text().toLowerCase().indexOf(inputValue) > -1)
});
});
// add task from task list to completed list
const addTaskFromCompleted = (taskId) => {
  const taskTarget = findTask(taskId);
  if(taskTarget === null) return;
  taskTarget.isCompleted = true;
  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT))
}
// undo task from list completed
const undoTaskFromCompleted = (taskId) => {
  const taskTarget = findTask(taskId);
  if (taskTarget == null) return;
  taskTarget.isCompleted = false;
  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT));
}
// remove task from list task {in completed}
const removeTaskFromList = (taskId) => {
    const taskTarget = findTaskIndex(taskId);
    if (taskTarget === -1) return;
    todo.splice(taskTarget, 1);
    location.reload();
    saveData();
      // automatic click close button modal
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
      for (const task of data) {
        todo.push(task);
      }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}
// render element
document.addEventListener(RENDER_EVENT,function () {
    console.log(todo);
    // 
    const uncompletedTaskList = document.getElementById('todo');
    uncompletedTaskList.innerHTML = '';
    // 
    const completedTaskList = document.getElementById('todoCompleted');
    completedTaskList.innerHTML = '';
    //   
    for (const taskItem of todo) {
        const taskElement = makeTask(taskItem);
        if (!taskItem.isCompleted) {
          uncompletedTaskList.append(taskElement);
        }else{
          completedTaskList.append(taskElement);
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
        ev.preventDefault();
        // automatic click close button modal
        location.reload();
        // get method add task
        addTask();
    });   
    // check web storage
    if (isStorageExist()) {
    loadDataFromStorage();
    }
  });
// 
// 