// container list todo
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
    if (isStorageExist()) {
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
    const titleTask = document.getElementById('title').value;
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
    taskContainer.classList.add('col-10', 'col-lg-11');
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
    const checkButton = document.createElement('iconify-icon');
    checkButton.classList.add('icon-check');
    checkButton.setAttribute('icon', 'ic:outline-circle');
    checkButton.setAttribute('width', 30);
    // create icon trash
    const trashButton = document.createElement('iconify-icon');
    trashButton.classList.add('icon-trash');
    trashButton.setAttribute('icon', 'mdi:trash');
    trashButton.setAttribute('width', 30);
    trashButton.setAttribute('data-bs-toggle', 'modal');
    trashButton.setAttribute('data-bs-target', '#deleteModal');
 
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
    //  check task has been completed
    if (taskObject.isCompleted) {

      container.setAttribute('style','background-color:#198754')
      container.classList.add('opacity-75');
      titleTask.classList.add('text-decoration-line-through', 'fst-italic');
      dateTask.classList.add('text-decoration-line-through', 'fst-italic');
      checkButton.removeAttribute('icon', 'ic:outline-circle');
      checkButton.setAttribute('icon', 'gg:check-o');
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
      });


    


 

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


// search task by filter data
$(".bi").click(function () {
  $(".bi").toggleClass("bi-search bi-arrow-left");
  $("#toggler").toggle();
  $("#logo").toggle();
  $("#field-search").toggle();
});

const searchTask = document.getElementById('field-search');
searchTask.addEventListener('keyup',function () { 
const inputSearch = document.getElementById("field-search");
const filter = inputSearch.value.toUpperCase();

  const data = document.getElementById("task"); //task
  const dataList = data.getElementsByClassName('todo-list');  //

  for (let i = 0; i < dataList.length; i++) {
      const task = dataList[i].getElementsByClassName("title-task")[0];
      if (task) {
          txtValue = task.textContent || task.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            dataList[i].style.display = "";
          } else {
            dataList[i].style.display = "none";
          }
      }
  }

  
 });

 const searchIcon = document.getElementById('search-icon');
searchIcon.classList.contains('bi-arrow-left');

 if (searchIcon) {
  searchIcon.addEventListener('click',function (ev) { 
   const data = searchTask.value = "";
   
  
    });
    
 }

//  const btnSearch = document.getElementById('search');

//  btnSearch.addEventListener('click',function () { 

//   const x = document.getElementById("myDIV");
//   if (x.style.display === "none") {
//     x.style.display = "block";
//   } else {
//     x.style.display = "none";
//   }
//  })
// add task from task list to completed list
const addTaskFromCompleted = (taskId) => {
  const taskTarget = findTask(taskId);
  if(taskTarget === null) return;
  
  taskTarget.isCompleted = true;
  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT))
}
// 
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
  


