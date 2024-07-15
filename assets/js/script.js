const tasklistEl = $(`#task-list`);
const nextIdEl = $(`#next-Id`);

function readTasksFromStorage () {
  let taskList = JSON.parse(localStorage.getItem("task"));
    if (!task) {
      task = [];
    }
    return task;
  } 

function readNextIdFromStorage () {
  let nextId = JSON.parse(localStorage.getItem("nextId"));
    if (!nextId) {
      nextId = [];
    }
    return nextId;
}

// Retrieve tasks and nextId from localStorage
function retrieveTasksFromStorage () {
  let taskList = JSON.parse(localStorage.getItem("task"));
    if (!task) {
      task = [];
    }
    return task;
  } 

function retrieveNextIdFromStorage () {
  let nextId = JSON.parse(localStorage.getItem("nextId"));
    if (!nextId) {
      nextId = [];
    }
    return nextId;
}

function saveTasksToStorage(task) {
  localStorage.setItem("task", JSON.stringify(taskList));
}

function saveNextIdToStorage(nextId) {
  localStorage.setItem("nextId", JSON.stringify(nextId));
}

// Todo: create a function to create a task card
function createTasksCard(task) {
  const taskCard = $(`<div>`)
    .addClass(`task task-card draggable my-3`)
    .attr(`data-task-id`, task.id);
  const taskHeader = $(`<div>`).addClass(`taskCard-header h4`).text(task.title)
  const taskBody = $('<div>').addClass('task-body');
  const taskDescription = $('<p>').addClass('task-text').text(task.type);
  const taskDueDate = $('<p>').addClass('task-text').text(task.dueDate);
  const taskDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-project-id', task.id);
  cardDeleteBtn.on('click', handleDeleteProject);
    // return $(`
    //     <div class="card task-card" id="task-${task.id}" data-id="${task.id}">
    //       <div class="card-body">
    //         <h5 class="card-title">${task.title}</h5>
    //         <p class="card-text">${task.description}</p>
    //         <button class="btn btn-danger btn-sm delete-task">Delete</button>
    //       </div>
    //     </div>
    //   `);
    }

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $("#todo-cards, #in-progress-cards, #done-cards").empty();

  taskList.forEach(task => {
    const taskCard = createTaskCard(task);
    $(`#${task.status}-cards`).append(taskCard);
    taskCard.draggable({
      revert: "invalid",
      helper: "clone"
    });
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    const title = $("#taskTitle").val();
    const description = $("#taskDescription").val();
    const status = "to-do";
  
    if (title && description) {
      const task = { id: generateTaskId(), title, description, status };
      taskList.push(task);
      saveToLocalStorage();
      renderTaskList();
      $("#formModal").modal('hide');
      $("#taskTitle").val('');
      $("#taskDescription").val('');
    }
  }

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(event.target).closest('.task-card').data('id');
    taskList = taskList.filter(task => task.id !== taskId);
    saveToLocalStorage();
    renderTaskList();
  }


// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.data('id');
    const newStatus = $(this).attr('id').replace('-cards', '');
    const task = taskList.find(task => task.id === taskId);
    task.status = newStatus;
    saveToLocalStorage();
    renderTaskList();
  }

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
      // Make lanes droppable
  $(".card-body").droppable({
    accept: ".task-card",
    drop: handleDrop
  });

  // Add event listeners
  $("#addTaskForm").on("submit", handleAddTask);
  $(document).on("click", ".delete-task", handleDeleteTask);

  // Initialize the modal form (example)
  $("#formModal").on("shown.bs.modal", function () {
    $("#taskTitle").trigger("focus");
  });
});
