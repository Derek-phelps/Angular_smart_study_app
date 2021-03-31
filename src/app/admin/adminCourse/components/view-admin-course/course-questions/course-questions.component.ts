import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
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

  constructor(
    private questionService: AdminCourseService, 
    private messageService: MessageService, 
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {
    this.questionService.getCourseQuestions(this.courseData.courseInfo.courseId).subscribe(data => this.questions = data);
  }

  newQuestion() {
    this.unsavedQuestion = {} as any;
    delete this.unsavedQuestionIndex;
    this.submitted = false;
    this.questionDialog = true;
  }

  deleteSelectedQuestions() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected questions?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.questions = this.questions.filter(val => !this.selectedQuestions.includes(val));
        this.selectedQuestions = null;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Questions Deleted', life: 3000 });
      }
    });
  }

  editQuestion(question: Question, index: number) {
    this.unsavedQuestion = { ...question };
    this.unsavedQuestionIndex = index;
    this.questionDialog = true;
  }

  deleteQuestion(question: Question) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + question.questionText + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.questions = this.questions.filter(val => val.questionId !== question.questionId);
        delete this.unsavedQuestion;
        delete this.unsavedQuestionIndex;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Question Deleted', life: 3000 });
      }
    });
  }

  hideDialog() {
    this.questionDialog = false;
    this.submitted = false;
  }

  saveQuestion(question: Question) {
    this.unsavedQuestion = question;
    this.submitted = true;

    if (!this.unsavedQuestion.questionText) {
      return;
    }
    
    if (this.unsavedQuestion.questionId) {
      // TODO: Call back-end

      this.questions[this.unsavedQuestionIndex] = this.unsavedQuestion;

      this.questionService.setCourseQuestions(this.courseData.courseInfo.courseId, this.questions).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Question Updated', life: 3000 });
      });
    }
    else {
      // TODO: Call back-end
      this.unsavedQuestion.questionId = this.createId();

      this.questions.push(this.unsavedQuestion);

      this.questionService.setCourseQuestions(this.courseData.courseInfo.courseId, this.questions).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Question Created', life: 3000 });
      });
    }

    this.questions = [...this.questions];
    this.questionDialog = false;
    delete this.unsavedQuestion;
    delete this.unsavedQuestionIndex;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

}