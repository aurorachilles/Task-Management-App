const state = {
  taskList: [],
};

// DOM - Domument Object to access html

const taskContents = document.querySelector(".task__contents");
const taskModal = document.querySelector(".task__modal__of__body");

const htmlTaskContent = ({
  id,
  task_title,
  task_desc,
  task_type,
  task_url,
}) => `
    <div class='col-md-6 col-lg-4 mt-3' id=${id} key=${id}>
        <div class='card shadow-sm task__card'>
            <div class='card-header d-flex justify-content-end task__card__header gap-1'>
                <button type='button' class='btn btn-outline-info mr-2' name=${id} data-bs-toggle='modal'
                data-bs-target='#edit__tasks' onclick='openingEditTask.apply(this, arguments)'> 
                    <i class='fa-solid fa-pencil' name=${id}></i>
                </button>
                <button type='button' class='btn btn-outline-danger mr-2' name=${id} onclick='deleteTask.apply(this, arguments)'> 
                    <i class='fa-solid fa-trash' name=${id}></i>
                </button>
            </div>
            <div class='card-body'>
                ${
                  task_url
                    ? `<img width='100%' src=${task_url} alt='card image cap' class='card-image-top md-3 rounded-lg' />`
                    : `<img width='100%' src="https://kctbs.ac.in/wp-content/uploads/2014/11/default-placeholder.png " alt='card image cap' class='card-image-top md-3 rounded-lg' /> `
                }
                <h4 class='task__card__title'>${task_title}</h4>
                <p class='decription trim-3-lines text-muted' data-gram_editor='false'>${task_desc}</p>
                <div class='tags text-white d-flex flex-wrap'>
                    <span class='badge bg-primary m-1'>${task_type}</span>
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

const htmlModalContent = ({ id, task_title, task_desc, task_url }) => {
  const date = new Date(parseInt(id));
  return `
    <div id=${id}>
      ${
        task_url
          ? `<img width='100%' src=${task_url} alt='card image cap' class='card-image-top md-3 rounded-lg' />`
          : `<img width='100%' src="https://kctbs.ac.in/wp-content/uploads/2014/11/default-placeholder.png " alt='card image cap' class='card-image-top md-3 rounded-lg' /> `
      }
        <strong class='text-sm text-muted font-monospace'>Created on ${date.toDateString()}</strong>
        <h2 class='my-3'>${task_title}</h2>
        <p class='lead'>
            ${task_desc}    
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

const postIntoAWS = (obj) => {
  const requestHeaders = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  console.log(requestHeaders);
  fetch(
    "https://nij8z6ztle.execute-api.ap-south-1.amazonaws.com/Post_Initial_test",
    requestHeaders
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("pushed0");
      console.log(data).catch((err) => {
        console.error("Fetch error:", err);
      });
    });
};

const deleteFromAWS = (obj) => {
  const requestHeaders = {
    method: "DELETE",
    body: JSON.stringify(obj),
  };
  console.log(requestHeaders);
  fetch(
    "https://nij8z6ztle.execute-api.ap-south-1.amazonaws.com/Post_Initial_test",
    requestHeaders
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data).catch((err) => {
        console.error("Fetch error:", err);
      });
    });
};

const loadInitialData = () => {
  //initial
  const LocalStorageCopy = JSON.parse(localStorage.tasks); //this function can be used to directly fetch and convert data from cloud0
  if (LocalStorageCopy) state.taskList = LocalStorageCopy.tasks;

  state.taskList.map((cardDate) => {
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate));
  });

  console.log(localStorage.tasks);
};

const loadfromAWS = () => {
  fetch(
    "https://nij8z6ztle.execute-api.ap-south-1.amazonaws.com/Post_Initial_test"
  )
    .then((response) => response.json())
    .then((data) => {
      const LocalStorageCopy = data;
      if (LocalStorageCopy) state.taskList = LocalStorageCopy.tasks;
      state.taskList.map((cardDate) => {
        console.log(cardDate);
        taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate));
      });

      //DEBUG OPTIONS
      // console.log(localStorage.tasks);
      //console.log(LocalStorageCopy);
      //console.log(data);
    });
};

// FORM SUBMIT
const HandleSubmit = (event) => {
  const id = `${Date.now()}`;
  const input = {
    task_url: document.getElementById("imageUrl").value,
    task_title: document.getElementById("taskTitle").value,
    task_desc: document.getElementById("taskDesc").value,
    task_type: document.getElementById("tags").value,
  };

  if (
    input.task_title === "" ||
    input.task_desc === "" ||
    input.task_type === ""
  ) {
    return alert("Please fill all the fields!");
  }

  //This thing is basically simultanelously pushing the modal on screen as we add it.
  taskContents.insertAdjacentHTML(
    "beforeend",
    htmlTaskContent({
      ...input,
      id,
    })
  );

  //This is basically updating the main table
  state.taskList.push({ ...input, id });

  //creating a function to push into aws
  const pushing = { ...input, id };
  postIntoAWS(pushing);
  //updateLocalStorage();
};

const openTask = (e) => {
  if (!e) e = window.event;

  const getTask = state.taskList.find(({ id }) => id === e.target.id);
  taskModal.innerHTML = htmlModalContent(getTask);
};

// DELETE FUNCTION

const deleteTask = (e) => {
  if (!e) e = window.event;

  const targetId = e.target.getAttribute("name");
  const type = e.target.tagName;
  const removeTask = state.taskList.filter(({ id }) => id !== targetId);

  state.taskList = removeTask;
  deleteFromAWS({ id: targetId });

  if (type === "BUTTON") {
    return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode
    );
  }
  return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
    e.target.parentNode.parentNode.parentNode.parentNode
  );
};

// OLD EDIT
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

//OLD SAVE EDIT
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

// SEARCH FUNCTION
const searchTask = (e) => {
  if (!e) e = window.event;

  while (taskContents.firstChild) {
    taskContents.removeChild(taskContents.firstChild);
  }

  const resultData = state.taskList.filter(({ task_title }) => {
    return task_title.toLowerCase().includes(e.target.value.toLowerCase());
  });

  console.log(resultData);

  resultData.map((cardData) => {
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
  });
};

const updateAWS = (obj) => {
  const requestHeaders = {
    method: "PUT",
    body: JSON.stringify(obj),
  };
  console.log(requestHeaders);
  fetch(
    "https://nij8z6ztle.execute-api.ap-south-1.amazonaws.com/Post_Initial_test",
    requestHeaders
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("updated");
      console.log(data).catch((err) => {
        console.error("Fetch error:", err);
      });
    });
};

// CODE FOR RESETTINGFORM
const resetForm = (e) => {
  if (!e) e = window.event;

  document.getElementById("FormforSub").reset();
};

// BELOW IS THE CODE WRITTEN FOR MODIFIED EDIT
const openingEditTask = (e) => {
  if (!e) e = window.event;

  const targetid = state.taskList.find(
    //this fetches the data saved in cloud and matches it
    ({ id }) => id === e.target.getAttribute("name")
  );
  const formEdit = document.getElementById("FormforEdit");
  //This basically fetches the already typed values in the field
  formEdit.childNodes[1].childNodes[3].value = targetid.task_url;
  formEdit.childNodes[3].childNodes[3].value = targetid.task_title;
  formEdit.childNodes[5].childNodes[3].value = targetid.task_type;
  formEdit.childNodes[7].childNodes[3].value = targetid.task_desc;

  //calling this function to save the changes that are being typed in the field
  const butt = (document.getElementById("editButtonSubmit").onclick =
    function () {
      SaveChanges(targetid);
    });
};

//save channges button
const SaveChanges = (targetid) => {
  const formEdit = document.getElementById("FormforEdit");
  let StateCopy = state.taskList;
  //console.log(StateCopy);  //testing
  let passable = { id: targetid.id };
  //this part basically reads the edited fields and forms a JSON
  //if statement is present to either pick or drop the URL
  if (document.getElementById("url_edit") !== "") {
    const updatedinput = {
      task_url: document.getElementById("url_edit").value,
      task_title: document.getElementById("taskTitle_edit").value,
      task_desc: document.getElementById("taskDesc_edit").value,
      task_type: document.getElementById("tags_edit").value,
    };

    passable = { ...passable, ...updatedinput };
    //a mapping function that matches the passes modal target id and list tasks to map and update the values simultatneously
    StateCopy = StateCopy.map(
      (tasks) =>
        tasks.id === targetid.id
          ? {
              id: tasks.id,
              task_title: updatedinput.task_title,
              task_desc: updatedinput.task_desc,
              task_type: updatedinput.task_type,
              task_url: updatedinput.task_url,
            }
          : tasks
      // above, if the target id matches? make update: don't
    );
    console.log(updatedinput);
    console.log("url");
  } else {
    const updatedinput = {
      task_title: document.getElementById("taskTitle_edit").value,
      task_desc: document.getElementById("taskDesc_edit").value,
      task_type: document.getElementById("tags_edit").value,
    };

    passable = { ...passable, ...updatedinput };
    StateCopy = StateCopy.map((tasks) =>
      tasks.id === targetid.id
        ? {
            id: tasks.id,
            task_title: updatedinput.task_title,
            task_desc: updatedinput.task_desc,
            task_type: updatedinput.task_type,
            task_url: tasks.task_url,
          }
        : tasks
    );
    console.log(updatedinput);
    console.log("No url");
  }
  const task_url =
    "https://kctbs.ac.in/wp-content/uploads/2014/11/default-placeholder.png";
  passable = { ...passable, task_url };
  state.taskList = StateCopy;

  setTimeout(updateAWS(passable), 10);
  // updateAWS(passable);
  // updateLocalStorage();
  // location.reload();
};
