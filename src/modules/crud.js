const list = document.getElementById('todos-list');
const addInput = document.getElementById('todo-input');
const completed = document.getElementById('completed');

let listArray = [];

const getLocal = () => {
  const possibleList = localStorage.getItem('New Todo');
  if (possibleList !== undefined && possibleList !== null) {
    return JSON.parse(possibleList);
  }

  return listArray;
};

const updateLocal = (newData) => {
  localStorage.setItem('New Todo', JSON.stringify(newData));
};

const mSort = (callback) => {
  const currentList = getLocal();

  const mSorted = [];

  for (let m = 0; m < currentList.length; m += 1) {
    const e = currentList[m];
    e.index = m + 1;
    mSorted.push(e);

    if (m === currentList.length - 1) {
      updateLocal(mSorted);
    }
  }

  callback();
};

export const loadTodo = () => {
  mSort(() => {
    list.innerHTML = '';
    const local = getLocal();

    local.forEach((element, i) => {
      const li = document.createElement('li');
      const checkbox = document.createElement('input');
      checkbox.classList.add('checkbox');
      checkbox.type = 'checkbox';
      checkbox.id = element.index;

      checkbox.checked = element.completed;

      checkbox.checked = element.completed;

      const paragraph = document.createElement('p');
      paragraph.id = element.index;
      paragraph.classList.add('paragraph');
      paragraph.textContent = element.description;

      const div = document.createElement('div');
      div.classList.add('TextItems');

      const remove = document.createElement('button');
      remove.value = i;
      remove.addEventListener('click', () => {
        const local = getLocal();
        const m = local.filter((e, m) => m !== i);

        updateLocal(m);
        loadTodo();
      });
      remove.classList.add('remove');
      remove.innerHTML = '<i class="fas fa-trash delete-icon"></i>';

      li.appendChild(checkbox);
      li.appendChild(paragraph);
      li.appendChild(remove);
      list.appendChild(li);

      addInput.value = '';
    });
  });
};

export const createTodo = () => {
  const text = addInput.value;

  if (text === '') {
    return;
  }

  listArray = getLocal();

  listArray.push({
    completed: false,
    index: listArray.length + 1,
    description: text,
  });

  updateLocal(listArray);
  loadTodo();
};

export const updateTodo = () => {
  const editInput = document.getElementsByName('editInput')[0];

  if (!editInput) {
    return;
  }

  const newText = editInput.value;

  if (newText !== '') {
    const paragraph = editInput.parentElement.querySelector('.paragraph');
    const position = parseInt(paragraph.id, 10);

    const local = getLocal();

    const newList = [];

    local.forEach((element, i) => {
      if (position === i + 1) {
        newList.push({
          index: element.index,
          description: newText,
          completed: element.completed,
        });
      } else {
        newList.push(element);
      }
    });

    updateLocal(newList);
    loadTodo();
  }

  editInput.remove();
};

export const showEditInput = (paregraphElement) => {
  const editInput = document.getElementsByName('editInput')[0];

  if (editInput) {
    editInput.remove();
  }

  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'editInput';
  input.value = paregraphElement.textContent;
  input.classList.add('editInput');

  paregraphElement.parentElement.appendChild(input);
  input.focus();
};

// eslint-disable-next-line no-unused-vars
const removeTodo = (todoId, clear = false) => {
  let currentList = getLocal();
  if (!clear) {
    currentList = currentList.filter((todo) => todo.id !== todoId);
  } else {
    currentList = currentList.filter((todo) => todo.id !== true);
  }
  updateLocal(currentList);
};

list.addEventListener('click', (e) => {
  if (e.target.tagName === 'INPUT') {
    const checkbox = e.target.checked;
    const currentList = getLocal();
    const task = currentList.find((todo) => todo.index === Number(e.target.id));
    task.completed = checkbox;
    updateLocal(currentList);
  }
});

const clearCompleted = () => {
  let currentList = getLocal();

  currentList = currentList.filter((todo) => !todo.completed);
  currentList = currentList.map((todo, index) => {
    todo.index = index + 1;
    return todo;
  });
  updateLocal(currentList);
  loadTodo();
};

completed.addEventListener('click', clearCompleted);

export const toggleComplete = (inputElement) => {
  if (inputElement.checked === false) {
    inputElement.parentElement.classList.remove('complete');
  } else {
    inputElement.parentElement.classList.add('complete');
    inputElement.checked = true;
  }
};
