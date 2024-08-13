import { LightningElement, api } from 'lwc';

export default class MockExam extends LightningElement {
    @api questions;
    questionSelected;

    get examQuestions() {
        if (this.questions) {
            return this.questions.map((question, index) => {
                return { index: index + 1, ...question };
            });
        }

        return null;
    }

    handleNumberClick(event) {
        const questionIndex = Number(event.currentTarget.textContent);

        this.questionSelected = this.examQuestions.find((q) => q.index === questionIndex);
        console.log(JSON.stringify(this.questionSelected));
    }
}
