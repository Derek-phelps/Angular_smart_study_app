import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MessageService } from "primeng/api";
import { filter, take } from "rxjs/operators";
import { ConfirmationBoxComponent } from "src/app/theme/components/confirmation-box/confirmation-box.component";
import { AdminCourseService, Question } from "../../../adminCourse.service";

@Component({
  selector: 'course-questions',
  templateUrl: './course-questions.component.html',
  styleUrls: ['./course-questions.component.scss']
})
export class CourseQuestionsComponent {

  @Input() courseData: any;
  @Output() updateData = new EventEmitter();

  questionDialog: boolean;

  questions: Question[];

  unsavedQuestion: Question;
  unsavedQuestionIndex: number;

  selectedQuestions: Question[];

  submitted: boolean;
  isReordering = true;

  constructor(
    private questionService: AdminCourseService,
    private messageService: MessageService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.questionService.getCourseQuestions(this.courseData.courseInfo.courseId).subscribe(data => this.questions = data);
  }

  newQuestion() {
    this.unsavedQuestion = { questionType: 'text' } as any;
    this.submitted = false;
    this.questionDialog = true;
    delete this.unsavedQuestionIndex;
    delete this.selectedQuestions;
  }

  async deleteSelectedQuestions() {
    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '400px',
      data: { Mes: 'Are you sure you want to delete the selected questions?' },
      autoFocus: false,
    });

    dialogRef.afterClosed().pipe(take(1)).pipe(filter(x => x)).subscribe(async () => {
      this.questions = this.questions.filter(val => !this.selectedQuestions.includes(val));
      
      this.questions = await this.saveQuestions(this.courseData.courseInfo.courseId, this.questions);

      delete this.selectedQuestions;
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Questions Deleted', life: 3000 });
    });
  }

  editQuestion(question: Question, index: number) {
    this.unsavedQuestion = { ...question };
    this.unsavedQuestionIndex = index;
    this.questionDialog = true;
    delete this.selectedQuestions;
  }

  async deleteQuestion(question: Question) {
    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '400px',
      data: { Mes: `Are you sure you want to delete ${question.questionText}?` },
      autoFocus: false,
    });

    dialogRef.afterClosed().pipe(take(1)).pipe(filter(x => x)).subscribe(async () => {
      this.questions = this.questions.filter(val => val.feedbackId !== question.feedbackId);
      
      this.questions = await this.saveQuestions(this.courseData.courseInfo.courseId, this.questions);

      delete this.unsavedQuestion;
      delete this.unsavedQuestionIndex;
      delete this.selectedQuestions;
      
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Question Deleted', life: 3000 });
    });
  }

  hideDialog() {
    this.questionDialog = false;
    this.submitted = false;
  }

  async saveQuestion(question: Question) {
    this.unsavedQuestion = question;
    this.submitted = true;

    if (!this.unsavedQuestion.questionText) {
      return;
    }

    if (this.unsavedQuestion.feedbackId) {
      
      this.questions[this.unsavedQuestionIndex] = this.unsavedQuestion;

      this.questions = await this.saveQuestions(this.courseData.courseInfo.courseId, this.questions);
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Question Updated', life: 3000 });
    }
    else {
      this.questions.push(this.unsavedQuestion);

      this.questions = await this.saveQuestions(this.courseData.courseInfo.courseId, this.questions);
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Question Created', life: 3000 });
    }

    this.questions = [...this.questions];
    this.questionDialog = false;
    delete this.unsavedQuestion;
    delete this.unsavedQuestionIndex;
    delete this.selectedQuestions;
  }

  onRowReordered() {
    this.questionService.setCourseQuestions(this.courseData.courseInfo.courseId, this.questions).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Order Changed', life: 3000 });
    });
  }

  async saveQuestions(courseId: string, questions: Question[]) {
    return await this.questionService.setCourseQuestions(courseId, questions).toPromise();
  }

}