import { LightningElement, api } from 'lwc';

export default class ExamSelector extends LightningElement {
    @api exams;

    handleExamClick(event) {
        const examSelected = event.currentTarget.dataset.exam;
        this.fireEvent('select', examSelected);
    }

    fireEvent(name, detail) {
        this.dispatchEvent(new CustomEvent(name, { detail }));
    }
}
