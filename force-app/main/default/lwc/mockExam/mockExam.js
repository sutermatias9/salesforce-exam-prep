import { LightningElement, api } from 'lwc';

export default class MockExam extends LightningElement {
    @api questions;
    questionSelected;

    _examQuestions;
    isInitialized;

    get examQuestions() {
        if (this.questions && !this.isInitialized) {
            this.isInitialized = true;

            this._examQuestions = this.questions.map((question, index) => {
                return {
                    index: index + 1,
                    userAnswers: { Option_A: false, Option_B: false, Option_C: false, Option_D: false, Option_E: false },
                    ...question
                };
            });

            this.questionSelected = this._examQuestions[0];
        }

        return this._examQuestions;
    }

    handleNumberClick(event) {
        const questionIndex = Number(event.currentTarget.textContent);

        this.questionSelected = this.examQuestions.find((q) => q.index === questionIndex);
        console.log(JSON.stringify(this.questionSelected));
    }
}
