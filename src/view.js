import {createElement, EventEmitter} from "./helpers";
import Controller from "./controller";

class View extends EventEmitter {
  constructor() {
    super();

    this.form = document.getElementById("todo-form");
    this.input = document.getElementById("add-input");
    this.list = document.getElementById("todo-list");

    this.form.addEventListener("submit", this.handleAdd.bind(this));
  }

  createListElement(todo) {
    const checkbox = createElement("input", { type: "checkbox", className: "checkbox", checked: todo.completed ? "checked" : "" });
    const label = createElement("label", {className: "title"}, todo.title);
    const editInput = createElement("input", {className: "textfield"});
    const editButton = createElement("button", {className: "edit"}, "Изменить");
    const removeButton = createElement("button", {className: "remove"}, "Удалить");
    const item = createElement("li", {className: `todo-item${todo.completed ? "completed" : ""}`, "data-id": todo.id }, checkbox, label, editInput, editButton, removeButton);

    return this.addEventListeners(item);
  }

  addEventListeners(listItem) {
    const checkbox = listItem.querySelector(".checkbox");
    const editButton = listItem.querySelector(".edit");
    const removeButton = listItem.querySelector(".remove");

    checkbox.addEventListener("change", this.handleToggle.bind(this));
    editButton.addEventListener("click", this.handleEdit.bind(this));
    removeButton.addEventListener("click", this.handleRemove.bind(this));

    return listItem;
  }

  handleAdd(event) {
    event.preventDefault();

    if(!this.input.value) return alert("Необходимо ввести название задачи");

    const value = this.input.value;

    this.emit("add", value);
  }

  handleToggle({ target }) {
    const listItem = target.parentNode;
    const id = listItem.getAttribute("data-id");
    const completed = target.checked;

    this.emit("toggle", { id, completed });
  }

  handleEdit({ target }) {
    const listItem = target.parentNode;
    const id = listItem.getAttribute("data-id");
    const label = listItem.querySelector(".title");
    const input = listItem.querySelector("textfield");
    const editButton = listItem.querySelector(".edit");
    const isEditing = listItem.classList.contains("editing");

    if(isEditing) {
      const input = listItem.querySelector(".textfield");
      const title = input.value;
      this.emit("edit", { id, title });
    } else {
      const input = listItem.querySelector(".textfield");
      const label = listItem.querySelector(".title");
      listItem.classList.add("editing");
      editButton.textContent = "Сохранить";
      input.value = label.textContent;
    }
  }

  handleRemove({ target }) {
    const listItem = target.parentNode;
    const id = listItem.getAttribute("data-id");

    this.emit("remove", id);
  }

  findListItem(id) {
    return this.list.querySelector(`[data-id="${id}"]`);
  }

  addItem(todo) {
    const listItem = this.createListElement(todo);
    this.input.value = "";
    this.list.appendChild(listItem);
  }

  toggleItem(todo) {
    const listItem = this.findListItem(todo.id);
    const checkbox = listItem.querySelector(".checkbox");
    checkbox.checked = todo.completed;
    (todo.completed) ? listItem.classList.add("completed") : listItem.classList.remove("completed");
  }

  editItem(todo) {
    const listItem = this.findListItem(todo.id);
    const label = listItem.querySelector(".title");
    const input = listItem.querySelector("textfield");
    const editButton = listItem.querySelector(".edit");

    label.textContent = todo.title;
    editButton.textContent = "Изменить";
    listItem.classList.remove("editing");
  }

  removeItem(id) {
    const listItem = this.findListItem(id);
    this.list.removeChild(listItem);
  }
}

export default View;
