import { LightningElement, wire } from 'lwc';
import getAvailableExams from '@salesforce/apex/ExamCalloutHandler.getAvailableExams';

export default class CertificationPrep extends LightningElement {
    exams;

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
        console.log('Exam selected: ' + event.detail);
    }
}
