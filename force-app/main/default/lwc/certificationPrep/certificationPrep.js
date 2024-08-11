import { LightningElement, wire } from 'lwc';
import getAvailableExams from '@salesforce/apex/ExamCalloutHandler.getAvailableExams';

export default class CertificationPrep extends LightningElement {
    exams;
    examSelected = null;

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
}
