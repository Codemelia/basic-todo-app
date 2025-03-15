import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ValidatorFn, ValidationErrors, AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { futureDateValidator } from '../customvalidator/future-date.validator';
import { Task } from '../models/task.model';
import { StorageService } from '../services/storage.service';
import { Subscription } from 'rxjs';

// custom validator as const
// otherwise can import function as well
/*
const futureDate = (ctrl: AbstractControl) => {
  if (!ctrl.value) return (null) // dont validate if input empty
  const selectedDate = new Date(ctrl.value) // set selected date to new date
  const currDate = new Date() // set today's date
  currDate.setHours(0, 0, 0, 0) // set to start of day
  if (selectedDate > currDate) return (null) // if selected date is in future, return null (no error)
  else return { futureDate: true } as ValidationErrors // return error object with key futureDate:true if error
}
*/

@Component({
  selector: 'app-todo',
  standalone: false,
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent implements OnInit, OnDestroy {

  // form
  private fb = inject(FormBuilder)
  protected form!: FormGroup

  // task to add
  newTask!: Task
  taskArray: Task[] = []

  private storageSvc = inject(StorageService)
  private editSub!: Subscription

  // task to edit
  editTask: Task | null = null

  ngOnInit(): void {

    // create form on init
    this.form = this.createForm()

    // subscribe to storage service to display task to edit in form
    this.editSub = this.storageSvc.edit$.subscribe(
      task => {
        if (task) {
          this.editTask = task // assign edit task for form update/add button evaluation
          this.form.patchValue(task) // patch task values to form
        }
    })

  }

  // create form
  createForm(): FormGroup {
    return this.fb.group({
      description: this.fb.control<string>('', 
        [ Validators.required, Validators.minLength(5) ]),
      priority: this.fb.control<string>('LOW'),
        dueDate: this.fb.control<Date>(new Date(),
        [ futureDateValidator() ])
    })
  }

  submitForm() {

    // if user is editing task, delete old version of this task from local storage
    if (this.editTask) {
      console.log('>>> Deleting old version of task: ', this.editTask)
      this.storageSvc.deleteTask(this.editTask)
    }

    // save/update new task
    this.newTask = this.form.value // bind form values to task object
    console.log('>>> Adding new task: ', this.newTask)
    this.storageSvc.saveTask(this.newTask)

    // reset form and edit task
    if (this.editTask) this.editTask = null
    this.form.reset()

  }

  ngOnDestroy(): void {
    if (this.editSub) this.editSub.unsubscribe()
    this.storageSvc.clearTasks()
  }

}
