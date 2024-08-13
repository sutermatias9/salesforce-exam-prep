import { LightningElement, wire } from 'lwc';
import getAvailableExams from '@salesforce/apex/ExamCalloutHandler.getAvailableExams';
import getExamQuestions from '@salesforce/apex/ExamCalloutHandler.getExamQuestions';

export default class CertificationPrep extends LightningElement {
    exams;
    examSelected = null;
    showExam = false;
    questions;

    get showSelector() {
        return !this.examSelected;
    }

    @wire(getAvailableExams)
    wiredExams({ data, error }) {
        if (data) {
            this.exams = data;
            console.log('exams');
            console.log(JSON.stringify(this.exams));
        } else if (error) {
            console.log(error);
        }
    }

    handleExamSelect(event) {
        this.examSelected = this.exams.find((exam) => exam.name === event.detail);
    }

    handleBack() {
        this.examSelected = null;
    }

    async handleStartExam() {
        this.showExam = true;

        try {
            this.questions = await getExamQuestions({ examURI: this.examSelected.URI });
        } catch (error) {
            console.log('error start exam' + error);
        }
    }
}
