export interface CourseFeedbackQuestion {
    feedbackId: string;
    questionText: string;
    questionType: string;
    questionSettings;
    mandatory: '0' | '1';
}

export interface CourseFeedbackResponse {
    feedbackId: string;
    questionText: string;
    questionType: string;
    response: string;
}