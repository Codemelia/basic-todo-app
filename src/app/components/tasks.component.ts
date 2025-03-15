import { Component, EventEmitter, inject, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Task } from '../models/task.model';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-tasks',
  standalone: false,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit, OnDestroy {

  private storageSvc = inject(StorageService)

  // task array
  taskArray: Task[] = []

  // sub
  private storageSub!: Subscription

  ngOnInit(): void {
    this.storageSub = this.storageSvc.task$.subscribe(tasks => { // subscribe to storage svc to update tasks
      this.taskArray = tasks
    })
  }

  // retrieve tasks from local storage
  getTasks(): Task[] {
    const storedTasks = this.storageSvc.getTasks()
    return storedTasks
  }

  // delete task from existing task array
  deleteTask(description: string, priority: string,dueDate: Date) {
    const taskToDelete: Task = {
      description: description,
      priority: priority,
      dueDate: dueDate
    }
    console.log('>>> Deleting task: ', taskToDelete)
    this.storageSvc.deleteTask(taskToDelete)
  }

  // edit task from existing tasks
  editTask(description: string, priority: string,dueDate: Date) {
    const editTask = this.taskArray.find( // find task that matches properties passed in
      t => 
        (t.description === description &&
        t.priority === priority &&
        t.dueDate === dueDate)
    )
    if (editTask) {
      console.log('>>> Editing task: ', editTask)
      this.storageSvc.selectEditTask(editTask) // if edit task exists in array, save it in local storage
    }
  }

  ngOnDestroy(): void {
      if (this.storageSub) this.storageSub.unsubscribe()
  }

}
