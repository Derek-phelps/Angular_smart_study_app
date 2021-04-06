import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MessageService } from "primeng/api";
import { filter, take } from "rxjs/operators";
import { array2map, groupBy, map2array, ObjectMap, uniqueBy } from "src/app/common/map_utils";
import { CourseFeedbackQuestion, CourseFeedbackResponse } from "src/app/core/models/course-feedback-question";
import { ConfirmationBoxComponent } from "src/app/theme/components/confirmation-box/confirmation-box.component";
import { AdminCourseService } from "../../../adminCourse.service";

@Component({
  selector: 'course-questions',
  templateUrl: './course-questions.component.html',
  styleUrls: ['./course-questions.component.scss']
})
export class CourseQuestionsComponent {

  @Input() courseData: any;
  @Output() updateData = new EventEmitter();

  questionDialog: boolean;

  questions: CourseFeedbackQuestion[];
  responsesByFeedbackId = {} as ObjectMap<CourseFeedbackResponse[]>;

  unsavedQuestion: CourseFeedbackQuestion;
  unsavedQuestionIndex: number;

  selectedQuestions: CourseFeedbackQuestion[];

  submitted: boolean;
  isReordering = true;

  chartOptions = {
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          callback: function (value) { if (Number.isInteger(value)) { return value; } },
          stepSize: 1
        }
      }]
    },
  };

  constructor(
    private questionService: AdminCourseService,
    private messageService: MessageService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.questionService.getCourseFeedbackQuestions(this.courseData.courseInfo.courseId).subscribe(data => {
      this.questions = <CourseFeedbackQuestion[]>data.questionList;
      this.responsesByFeedbackId = this._groupResponses(this.questions, <CourseFeedbackResponse[]>data.answerList);
    });
  }

  private _groupResponses(questions: CourseFeedbackQuestion[], responses: CourseFeedbackResponse[]) {
    const questionsByFeedbackId = array2map(questions, x => x.feedbackId, x => x);
    const responsesByFeedbackId = groupBy(responses, x => x.feedbackId, x => x) as ObjectMap<any>;
    for (const feedbackId of Object.keys(responsesByFeedbackId)) {
      responsesByFeedbackId[feedbackId] = this._processResponsesForQuestion(questionsByFeedbackId[feedbackId], responsesByFeedbackId[feedbackId]);
    }
    return responsesByFeedbackId;
  }

  private _processResponsesForQuestion(question: CourseFeedbackQuestion, responses: CourseFeedbackResponse[]) {
    if (question.questionType === 'text') {
      return uniqueBy(responses, x => x.response).map(x => x.response).sort();
    } else if (question.questionType === 'scale') {
      const {min, max} = question.questionSettings;
      return this._groupResponsesForQuestionScale(min, max, responses);
    }
    return responses;
  }
  
  private _groupResponsesForQuestionScale(min: string, max: string, responses: CourseFeedbackResponse[]) {
    const groups = groupBy(responses, x => x.response, x => x) as ObjectMap<any>;
    for (const key of Object.keys(groups)) {
      groups[key] = groups[key].length;
    }
    
    const zeros = {} as any;
    for (let i = parseInt(min); i < parseInt(max) + 1; i++) {
      zeros[i] = 0;
    }

    return this._getChartData({...zeros, ...groups});
  }

  private _getChartData(summaryMap: Object) {
    const labels = Object.keys(summaryMap);
    const data = labels.map(x => summaryMap[x]);
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: "rgba(121, 200, 121, 0.8)",
        borderColor: "rgba(140, 140, 140, 0.0)",
        borderWidth: 0,
      }],
    }
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

      let data = await this.saveQuestions(this.courseData.courseInfo.courseId, this.questions);
      this.questions = <CourseFeedbackQuestion[]>data.questionList;

      delete this.selectedQuestions;
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Questions Deleted', life: 3000 });
    });
  }

  editQuestion(question: CourseFeedbackQuestion, index: number) {
    this.unsavedQuestion = { ...question };
    this.unsavedQuestionIndex = index;
    this.questionDialog = true;
    delete this.selectedQuestions;
  }

  async deleteQuestion(question: CourseFeedbackQuestion) {
    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '400px',
      data: { Mes: `Are you sure you want to delete ${question.questionText}?` },
      autoFocus: false,
    });

    dialogRef.afterClosed().pipe(take(1)).pipe(filter(x => x)).subscribe(async () => {
      this.questions = this.questions.filter(val => val.feedbackId !== question.feedbackId);

      let data = await this.saveQuestions(this.courseData.courseInfo.courseId, this.questions);
      this.questions = <CourseFeedbackQuestion[]>data.questionList;

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

  async saveQuestion(question: CourseFeedbackQuestion) {
    this.unsavedQuestion = question;
    this.submitted = true;

    if (!this.unsavedQuestion.questionText) {
      return;
    }

    if (this.unsavedQuestion.feedbackId) {

      this.questions[this.unsavedQuestionIndex] = this.unsavedQuestion;

      let data = await this.saveQuestions(this.courseData.courseInfo.courseId, this.questions);
      this.questions = <CourseFeedbackQuestion[]>data.questionList;
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Question Updated', life: 3000 });
    }
    else {
      this.questions.push(this.unsavedQuestion);

      let data = await this.saveQuestions(this.courseData.courseInfo.courseId, this.questions);
      this.questions = <CourseFeedbackQuestion[]>data.questionList;
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Question Created', life: 3000 });
    }

    this.questions = [...this.questions];
    this.questionDialog = false;
    delete this.unsavedQuestion;
    delete this.unsavedQuestionIndex;
    delete this.selectedQuestions;
  }

  onRowReordered() {
    this.questionService.setCourseFeedbackQuestions(this.courseData.courseInfo.courseId, this.questions).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Order Changed', life: 3000 });
    });
  }

  async saveQuestions(courseId: string, questions: CourseFeedbackQuestion[]) {
    return await this.questionService.setCourseFeedbackQuestions(courseId, questions).toPromise();
  }

}