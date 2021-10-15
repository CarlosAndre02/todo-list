import Modal from "../modules/modal"
const modal = new Modal()
const csrf = document.querySelector('input[name="_csrf"]').value

// Handling the menu on user icon
const menuElement = document.querySelector(".menu")
const userIconWrapperElement = document.querySelector(".user-icon-wrapper")
userIconWrapperElement.addEventListener("click", () => {
    menuElement.classList.toggle("active")
})

// Handling todo actions visualization
const todos = document.querySelectorAll(".todo")
for(let todo of todos) {
    if(window.screen.width > 800) {
        const todoActions = todo.querySelector(".todo-actions")
        todo.addEventListener("mouseenter", () => todoActions.style.visibility = "visible")
        todo.addEventListener("mouseleave", () => todoActions.style.visibility = "hidden")
    }
}

// Handling filter buttons
const todoContainerElement = document.querySelector(".todo-container")
const filterButtons = document.querySelectorAll(".filter-button")
let previousButtonSelected = document.querySelector(".filter-button.selected")
for(let filterButton of filterButtons) {
    filterButton.addEventListener("click", () => {
        if(filterButton.classList.contains("selected")) return

        previousButtonSelected.classList.remove("selected")
        filterButton.classList.add("selected")
        previousButtonSelected = filterButton

        const buttonType = filterButton.dataset.type
        if(buttonType === "all") return filterAllTodos()
        if(buttonType === "active") return filterActiveTodos()
        filterCompletedTodos()
    })
}

const filterAllTodos = () => fetchTodoContainer(todos)

const filterActiveTodos = () => {
    const todoElements = Array.from(todos)
    const activeTodos = todoElements.filter(todoElement => !todoElement.classList.contains("completed"))
    fetchTodoContainer(activeTodos)
}

const filterCompletedTodos = () => {
    const todoElements = Array.from(todos)
    const completedTodos = todoElements.filter(todoElement => todoElement.classList.contains("completed"))
    fetchTodoContainer(completedTodos)
}

const fetchTodoContainer = (todoElements) => {
    todoContainerElement.innerHTML = ''
    for(const todo of todoElements) {
        todoContainerElement.appendChild(todo)
    }
}

// Handling todo checkbox
const todoCheckBoxes = document.querySelectorAll(".todo-checkbox")
for(let checkbox of todoCheckBoxes) {
    checkbox.addEventListener("click", async () => {
        try {
            const parentElement = checkbox.parentElement
            const todoId = parentElement.dataset.id
            const todoStatusAfterClick = parentElement.classList.contains("completed") ? "active" : "completed"
            
            if(todoStatusAfterClick == "completed") parentElement.classList.add("completed")
            else parentElement.classList.remove("completed")

            await fetch(`/todo/update/${todoId}`, {
                method: "POST",
                body: JSON.stringify({
                    _csrf: csrf,
                    status: `${todoStatusAfterClick}`
                }),
                headers: {"Content-type": "application/json"}
            })
        } catch(e) {
            console.log(e)
        }
    })
}

// Handling create operation
const addTodoButton = document.querySelector(".add-todo-button")
addTodoButton.addEventListener("click", () => {
    modal.open("create")
})

const cancelButtons = document.querySelectorAll(".cancel-button")
for(let cancelButton of cancelButtons) {
    cancelButton.addEventListener("click", () => {
        modal.close()
    })
}

const modalCreateInput = document.querySelector("#modal-create-input")
const createTodoForm = document.querySelector(".form-create")
createTodoForm.addEventListener("submit", (e) => {
    e.preventDefault()

    if(modalCreateInput.value == "") return alert("Campo não pode estar vazio")

    createTodoForm.submit()
})

// Handling update operation
const todoEditable = {
    id: null,
    todoElement: null,
    todoPrevText: null
}

const modalEditInput = document.querySelector("#modal-edit-input")
const editTodoButtons = document.querySelectorAll(".edit-todo-button")
for(let editButton of editTodoButtons) {
    editButton.addEventListener("click", (e) => {
        modal.open("update")

        const todoTextElement = e.path[3].children[1]
        const todoId = e.path[3].dataset.id
        
        modalEditInput.value = todoTextElement.innerText
        
        todoEditable.id = todoId
        todoEditable.todoElement = todoTextElement
        todoEditable.todoPrevText = todoTextElement.innerText
    })
}

const modalUpdateButton = document.querySelector(".modal-update-button")
modalUpdateButton.addEventListener("click", async () => {
    if(modalEditInput.value == "") return alert("Campo não pode estar vazio")
    
    try {
        const todoId = todoEditable.id

        const response = await fetch(`/todo/update/${todoId}`, {
            method: "POST",
            body: JSON.stringify({
                _csrf: csrf,
                todo: `${modalEditInput.value}`
            }),
            headers: {"Content-type": "application/json"}
        })
        const data = await response.json()

        todoEditable.todoElement.innerText = data.todo || todoEditable.todoPrevText
        modal.close()
    } catch(e) {
        console.log(e)
        alert("Um erro inesperado aconteceu")
    }
})

// Handling delete operation
const modalDeleteButton = document.querySelector(".modal-delete-button")
const deleteTodoButtons = document.querySelectorAll(".delete-todo-button")
for(let deleteButton of deleteTodoButtons) {
    deleteButton.addEventListener("click", (e) => {
        modal.open("delete")
        const todoId = e.path[3].dataset.id
        modalDeleteButton.setAttribute("href", `/todo/delete/${todoId}`)
    })
}