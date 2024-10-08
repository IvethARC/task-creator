import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Person } from '../../../../core/models/person.model';
import { TaskService } from 'src/app/core/services/task.service';
import { List } from 'src/app/core/models/list.model';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnInit {
  taskForm: FormGroup;
  isOldDeveloper = false;
  persons: Person[] = [];
  selectedPerson: Person | null = null;
  isLoading: boolean = true;
  newDeveloper = { name: '', age: null };
  selectedDeveloperType: 'old' | 'new' | null = null;
  
  constructor(private fb: FormBuilder,
              private taskService: TaskService,
              private cdr: ChangeDetectorRef ){
    this.taskForm = this.fb.group({
      taskName: ['', [Validators.required, Validators.minLength(3)]],
      dueDate: ['', Validators.required],
      newDeveloperName: ['', [Validators.required, Validators.minLength(5)]],
      newDeveloperAge: [null, [Validators.required, Validators.min(18)]],
      selectedPerson: [null]
    });
  }

  ngOnInit(): void {
    this.loadPersons();
  }

  loadPersons() {
    this.isLoading = true;
    this.taskService.getPersons().subscribe((persons) => {
      this.persons = persons;
      this.isLoading = false;
      this.cdr.detectChanges();
    }, error => {
      console.error('Error loading persons:', error);
      this.isLoading = false;
    });
  }

  selectOldDeveloper(): void {
    this.isOldDeveloper = true;
    this.selectedDeveloperType = 'old';
  }
  
  selectNewDeveloper(): void {
    this.isOldDeveloper = false;
    this.selectedDeveloperType = 'new';
  }

  onSubmitFormData() {
    if (this.taskForm.valid  || (this.isOldDeveloper && this.selectedPerson)) {
      const formData: List = {
        taskName: this.taskForm.get('taskName')?.value,
        dueDate: this.taskForm.get('dueDate')?.value,
        selectedPerson: this.isOldDeveloper ? this.selectedPerson : null,
        newDeveloper: this.isOldDeveloper ? null : {
          name: this.taskForm.get('newDeveloperName')?.value,
          age: this.taskForm.get('newDeveloperAge')?.value
        }
      };
      this.taskService.addTask(formData);
    }
  }
}
