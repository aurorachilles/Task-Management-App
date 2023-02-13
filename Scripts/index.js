const state = {
  taskList: [],
};

// DOM - Domument Object to access html

const taskContents = document.querySelector(".task__contents");
const taskModal = document.querySelector(".task__modal__of__body");

const htmlTaskContent = ({ id, title, description, type, url }) => `
    <div class='col-md-6 col-lg-4 mt-3' id=${id} key=${id}>
        <div class='card shadow-sm task__card'>
            <div class='card-header d-flex justify-content-end task__card__header gap-1'>
                <button type='button' class='btn btn-outline-info mr-2' name=${id} onclick='editTasks.apply(this, arguments)'> 
                    <i class='fa-solid fa-pencil' name=${id}></i>
                </button>
                <button type='button' class='btn btn-outline-danger mr-2' name=${id} onclick='deleteTask.apply(this, arguments)'> 
                    <i class='fa-solid fa-trash' name=${id}></i>
                </button>
            </div>
            <div class='card-body'>
                ${
                  url
                    ? `<img width='100%' src=${url} alt='card image cap' class='card-image-top md-3 rounded-lg' />`
                    : `<img width='100%' src="https://kctbs.ac.in/wp-content/uploads/2014/11/default-placeholder.png " alt='card image cap' class='card-image-top md-3 rounded-lg' /> `
                }
                <h4 class='task__card__title'>${title}</h4>
                <p class='decription trim-3-lines text-muted' data-gram_editor='false'>${description}</p>
                <div class='tags text-white d-flex flex-wrap'>
                    <span class='badge bg-primary m-1'>${type}</span>
                </div>
            </div>
            <div class='card-footer'>
                <button 
                type='button' 
                class='btn btn-outline-primary float-right' 
                data-bs-toggle='modal'
                data-bs-target='#ShowTask'
                id=${id}
                onclick='openTask.apply(this, arguments)'>
                Open Task
                </button>
            </div>
        </div>
    </div>
`;

const htmlModalContent = ({ id, title, description, url }) => {
  const date = new Date(parseInt(id));
  return `
    <div id=${id}>
      ${
        url
          ? `<img width='100%' src=${url} alt='card image cap' class='card-image-top md-3 rounded-lg' />`
          : `<img width='100%' src="https://kctbs.ac.in/wp-content/uploads/2014/11/default-placeholder.png " alt='card image cap' class='card-image-top md-3 rounded-lg' /> `
      }
        <strong class='text-sm text-muted font-monospace'>Created on ${date.toDateString()}</strong>
        <h2 class='my-3'>${title}</h2>
        <p class='lead'>
            ${description}    
        </p>
    </div>

  `;
};

const updateLocalStorage = () => {
  localStorage.setItem(
    "tasks",
    JSON.stringify({
      tasks: state.taskList,
    })
  );
};

const loadInitialData = () => {
  const LocalStorageCopy = JSON.parse(localStorage.tasks);
  if (LocalStorageCopy) state.taskList = LocalStorageCopy.tasks;

  state.taskList.map((cardDate) => {
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate));
  });
};

const HandleSubmit = (event) => {
  const id = `${Date.now()}`;
  const input = {
    url: document.getElementById("imageUrl").value,
    title: document.getElementById("taskTitle").value,
    description: document.getElementById("taskDesc").value,
    type: document.getElementById("tags").value,
  };

  if (input.title === "" || input.description === "" || input.type === "") {
    return alert("Please fill all the fields!");
  }

  taskContents.insertAdjacentHTML(
    "beforeend",
    htmlTaskContent({
      ...input,
      id,
    })
  );

  state.taskList.push({ ...input, id });
  updateLocalStorage();
};

const openTask = (e) => {
  if (!e) e = window.event;

  const getTask = state.taskList.find(({ id }) => id === e.target.id);
  taskModal.innerHTML = htmlModalContent(getTask);
};

const deleteTask = (e) => {
  if (!e) e = window.event;

  const targetId = e.target.getAttribute("name");
  const type = e.target.tagName;
  const removeTask = state.taskList.filter(({ id }) => id !== targetId);

  state.taskList = removeTask;
  updateLocalStorage();

  if (type === "BUTTON") {
    return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode
    );
  }
  return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
    e.target.parentNode.parentNode.parentNode.parentNode
  );
};

const editTasks = (e) => {
  const targetId = e.target.id;
  const typeofbut = e.target.tagName;

  let parentNode = null;
  let taskTitle;
  let taskDesc;
  let type;
  let SubmitButton;

  if (typeofbut === "BUTTON") {
    parentNode = e.target.parentNode.parentNode;
  } else {
    parentNode = e.target.parentNode.parentNode.parentNode;
  }

  taskTitle = parentNode.childNodes[3].childNodes[3];
  taskDesc = parentNode.childNodes[3].childNodes[5];
  type = parentNode.childNodes[3].childNodes[7].childNodes[1];
  SubmitButton = parentNode.childNodes[5].childNodes[1];

  taskTitle.setAttribute("contenteditable", "true");
  taskDesc.setAttribute("contenteditable", "true");
  type.setAttribute("contenteditable", "true");

  SubmitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
  SubmitButton.removeAttribute("data-bs-toggle");
  SubmitButton.removeAttribute("data-bs-target");
  SubmitButton.innerHTML = "Save Changes";
};

const saveEdit = (e) => {
  if (!e) e = window.event;

  const targetId = e.target.id;
  const parentNode = e.target.parentNode.parentNode;

  const taskTitle = parentNode.childNodes[3].childNodes[3];
  const taskDesc = parentNode.childNodes[3].childNodes[5];
  const type = parentNode.childNodes[3].childNodes[7].childNodes[1];
  const SubmitButton = parentNode.childNodes[5].childNodes[1];

  const updateData = {
    taskTitle: taskTitle.innerHTML,
    taskDesc: taskDesc.innerHTML,
    type: type.innerHTML,
  };

  let StateCopy = state.taskList;

  StateCopy = StateCopy.map((task) =>
    task.id === targetId
      ? {
          id: task.id,
          title: updateData.taskTitle,
          description: updateData.taskDesc,
          type: updateData.type,
          url: task.url,
        }
      : task
  );

  state.taskList = StateCopy;
  updateLocalStorage();

  taskTitle.setAttribute("contenteditable", "false");
  taskDesc.setAttribute("contenteditable", "false");
  type.setAttribute("contenteditable", "false");

  SubmitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
  SubmitButton.setAttribute("data-bs-toggle", "modal");
  SubmitButton.setAttribute("data-bs-target", "#ShowTask");
  SubmitButton.innerHTML = "OpenTask";
};
