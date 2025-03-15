import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  // task array
  taskArray: Task[] = []
  task!: Task

  // hold current tasks from storage
  private taskSubject = new BehaviorSubject<Task[]>(this.getTasks())
  task$ = this.taskSubject.asObservable() // expose as observable

  // sending task to edit to to do form
  // defaults to null
  private editSubject = new BehaviorSubject<Task | null>(null)
  edit$ = this.editSubject.asObservable()

  // add new task to existing task array
  // add updated tasks to local storage
  saveTask(newTask: Task) {
    this.taskArray = [ // add new task to existing task array
      ...this.getTasks(),
      newTask
    ]
    localStorage.setItem('tasks', JSON.stringify(this.taskArray))
    this.taskSubject.next(this.taskArray) // notify all subscribers of new task array
  }

  // get tasks from local storage
  getTasks(): Task[] {
    const tasksString = localStorage.getItem('tasks')
    if (tasksString)
      this.taskArray = JSON.parse(tasksString)
    return this.taskArray
  }

  // delete one task from existing list
  deleteTask(taskToDelete: Task) {
    this.taskArray = this.taskArray.filter( // filter existing task array to remove the task
      t =>
        !(t.description === taskToDelete.description && // sets condition: if all properties match received task, exclude it
          t.priority === taskToDelete.priority &&
          t.dueDate === taskToDelete.dueDate)
    )
    localStorage.setItem('tasks', JSON.stringify(this.taskArray)) // set filtered tasks in local storage
    this.taskSubject.next(this.taskArray) // notify all subscribers of new task array
  }

  // send task to edit
  selectEditTask(editTask: Task) {
    this.editSubject.next(editTask) // notify all subscribers of new edit task
  }

  // clear local storage
  clearTasks(): void {
    localStorage.clear()
  }

}
