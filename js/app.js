document.addEventListener('DOMContentLoaded', () => {
    let audio = new Audio('../audio/pride.mp3');
    audio.load();

    function playSound() {
        audio.play();
    }

    // Get references to DOM elements
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('tasks-inner');

    const loadTasks = () => {
        // Load tasks from local storage
        const tasks = JSON.parse(localStorage.getItem('prideTasks')) || [];
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            noTasksFound();
        } else {
            // Add incomplete tasks to the task list
            tasks.forEach((task, index) => {
                if (!task.completed) {
                    addTask(task, index);
                }
            });
            // Add completed tasks to the task list
            tasks.forEach((task, index) => {
                if (task.completed) {
                    addTask(task, index);
                }
            });
        }
    };

    const saveTasks = (tasks) => {
        // Save tasks to local storage
        localStorage.setItem('prideTasks', JSON.stringify(tasks));
    };

    const addTask = (task, index) => {
        // Add a task to the task list
        taskList.innerHTML += `
            <li>
                <input class="app__tasks--list__input" type="checkbox" id="task${index}" ${task.completed ? 'checked' : ''} data-index="${index}">
                <label for="task${index}" class="app__tasks--list__item">
                    <div class="custom-checkbox"></div>
                    <p>${task.text}</p>
                </label>
                <button class="app__tasks--list__trash" data-index="${index}">
                    <i class='bx bx-trash'></i>
                </button>
            </li>
        `;
    };

    function noTasksFound() {
        taskList.innerHTML = `<div class="app__tasks--loader"></div>`;
    }

    const addNewTask = () => {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            // Add a new task to the task list
            const tasks = JSON.parse(localStorage.getItem('prideTasks')) || [];
            const newTask = { text: taskText, completed: false };
            tasks.push(newTask);
            saveTasks(tasks);
            loadTasks();
            taskInput.value = '';
        }

        // Scroll to the bottom of the task list
        taskList.scrollTo({
            top: taskList.scrollHeight,
            behavior: 'smooth'
        });
    };

    const toggleTaskCompletion = (index) => {
        // Toggle the completion status of a task
        const tasks = JSON.parse(localStorage.getItem('prideTasks')) || [];
        if (tasks[index].completed) {
            tasks[index].completed = false;
        } else {
            tasks[index].completed = true;
            playSound();
        }
        saveTasks(tasks);

        // Delay loading tasks to ensure 2 seconds delay for all
        setTimeout(() => {
            loadTasks();
        }, 2000);
    };

    const deleteTask = (index) => {
        // Delete a task from the task list
        const tasks = JSON.parse(localStorage.getItem('prideTasks'));
        tasks.splice(index, 1);
        saveTasks(tasks);
        setTimeout(() => {
            loadTasks();
        }, 100);
    };

    // Delete tasks automatically after 10 hours
    setInterval(() => {
        const tasks = JSON.parse(localStorage.getItem('prideTasks')) || [];
        tasks.forEach((task, index) => {
            if (task.completed) {
                setTimeout(() => {
                    deleteTask(index);
                }, 10 * 60 * 60 * 1000); // 10 hours
            }
        });
    }, 1000);

    addTaskBtn.addEventListener('click', addNewTask);

    taskInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            addNewTask();
        }
    });

    taskInput.addEventListener('search', addNewTask);

    taskList.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.classList.contains('bx-trash')) {
            const index = e.target.closest('button').getAttribute('data-index');
            deleteTask(index);
        }

        if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
            const index = e.target.getAttribute('data-index');
            toggleTaskCompletion(index);
        }
    });

    loadTasks();
});