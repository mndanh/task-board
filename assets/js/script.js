let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

const taskFormEl = $('#task-form');
const taskTitleInputEl = $('#task-title-input');
const taskDescriptionEl = $('#task-description');
const taskDateInputEl = $('#task-due-date');

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(taskList));
}

function createTaskCard(task) {
  const taskCard = $('<div>').addClass('task task-card draggable my-3').attr('data-task-id', task.id);
  const cardHeader = $('<div>').addClass('taskCard-header h4').text(task.title);
  const cardBody = $('<div>').addClass('task-body');
  const cardDescription = $('<p>').addClass('task-text').text(task.description);
  const cardDueDate = $('<p>').addClass('task-text').text(task.dueDate);
  const cardDeleteBtn = $('<button>').addClass('btn btn-danger delete').text('Delete').attr('data-task-id', task.id);
  cardDeleteBtn.on('click', handleDeleteTask);

  if (task.dueDate) {
    const now = dayjs();
    const taskDueDate = dayjs(task.dueDate);

    if (now.isSame(taskDueDate, 'day')) {
      taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass('bg-danger text-white');
    }
  }

  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);
  return taskCard;
}

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

function generateTaskId() {
  return 'task-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

function handleTaskFormSubmit(event) {
  event.preventDefault();

  const taskTitle = taskTitleInputEl.val().trim();
  const taskDescription = taskDescriptionEl.val().trim();
  const taskDueDate = taskDateInputEl.val();

  if (taskTitle && taskDescription && taskDueDate) {
    const newTask = {
      id: generateTaskId(),
      title: taskTitle,
      description: taskDescription,
      dueDate: taskDueDate,
      status: 'todo'
    };

    taskList.push(newTask);
    saveToLocalStorage();
    renderTaskList();

    taskTitleInputEl.val('');
    taskDescriptionEl.val('');
    taskDateInputEl.val('');

    $('#formModal').modal('hide');
  }
}

function handleDeleteTask(event) {
  const taskId = $(event.target).attr('data-task-id');
  taskList = taskList.filter(task => task.id !== taskId);
  saveToLocalStorage();
  renderTaskList();
}

function setupDragAndDrop() {
  $(".lane").droppable({
    accept: ".task-card",
    drop: function(event, ui) {
      const taskCard = $(ui.helper);
      const newStatus = $(this).attr('id');
      const taskId = taskCard.attr('data-task-id');

      taskList = taskList.map(task => {
        if (task.id === taskId) {
          task.status = newStatus;
        }
        return task;
      });

      saveToLocalStorage();
      renderTaskList();
    }
  });
}

$(document).ready(function() {
  renderTaskList();
  setupDragAndDrop();

  taskFormEl.on('submit', handleTaskFormSubmit);
});
