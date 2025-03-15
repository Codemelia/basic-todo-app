import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function futureDateValidator(): ValidatorFn { // function returns validator function

    // returned function takes in abstract control (form control)
    // returns null if input id valid (no error)
    // returns object with error key: futureDate: true if validation fails
    return (ctrl: AbstractControl): ValidationErrors | null => {

        if (!ctrl.value) {
            return null // if no value, validation not applied
        }

        const selectedDate = new Date(ctrl.value) // set selected date as date
        const currDate = new Date() // set today's date
        currDate.setHours(0, 0, 0, 0) // normalise to start of day

        // if selected date greater than curr date, validation passes
        // if selected date lesser than curr date, return futureDate: true which signals validation error
        return selectedDate > currDate ? null: { futureDate: true }

    }

}