import { LightningElement, api, track } from 'lwc';

export default class MockExam extends LightningElement {
    @api exam;
    @api questions;
    @track questionSelected;

    isInitialized = false;
    showExam = true;
    score;
    isReview = false;

    _examQuestions;

    get examName() {
        return this.exam.name + ' Exam';
    }

    get examQuestions() {
        if (this.questions && !this.isInitialized) {
            this._examQuestions = this.questions.map((question, index) => {
                return {
                    index: index + 1,
                    userAnswers: { Option_A: false, Option_B: false, Option_C: false, Option_D: false, Option_E: false },
                    isAnswered: false,
                    ...question
                };
            });

            this.questionSelected = this._examQuestions[0];
        }

        return this._examQuestions;
    }

    get questionSelectedBox() {
        if (this.questionSelected) {
            return this.template.querySelector(`div[data-index="${this.questionSelected.index}"`);
        }

        return null;
    }

    get optionKeys() {
        if (this.questionSelected) {
            return Object.keys(this.questionSelected).filter((key) => key.startsWith('Option_'));
        }

        return null;
    }

    get isNotLastQuestion() {
        return this.questionSelected.index !== this.examQuestions.length;
    }

    renderedCallback() {
        if (this.questionSelected && this.showExam) {
            this.populateOptionLabels();
            this.populateCheckboxes();
            this.toggleBoxSelection(true);

            if (this.isReview) {
                this.clearAnswerHighlights();
                this.highlightQuestionBoxes();
                this.highlightAnswers();
                this.enableAllCheckboxes(false);
            } else {
                this.updateCheckboxStates();

                if (!this.isInitialized) {
                    this.toggleBoxSelection(true);
                    this.isInitialized = true;
                }
            }
        }
    }

    handleNumberClick(event) {
        const questionIndex = Number(event.currentTarget.textContent);
        this.selectQuestionByIndex(questionIndex);

        console.log('Question selected' + JSON.stringify(this.questionSelected));
    }

    handleOptionChange(event) {
        const optionChanged = event.currentTarget.value;
        const isChecked = event.currentTarget.checked;
        const q = { ...this.questionSelected };

        q.userAnswers[optionChanged] = isChecked;
        this.questionSelected = q;
    }

    handleNextClick() {
        if (this.isNotLastQuestion) {
            this.selectQuestionByIndex(this.questionSelected.index + 1);
        }
    }

    handleFinishClick() {
        const numberOfQuestions = this.examQuestions.length;
        const numberOfCorrectAnswers = this.examQuestions.reduce((accumulator, question) => {
            if (this.isCorrect(question)) {
                return (accumulator += 1);
            }

            return accumulator;
        }, 0);

        this.score = (numberOfCorrectAnswers / numberOfQuestions) * 100;
        this.result = this.score >= this.exam.Passing_Score ? 'PASS' : 'FAIL';
        this.showExam = false;
    }

    handleReviewClick() {
        this.showExam = true;
        this.isReview = true;
        this.questionSelected = this.examQuestions[0];
    }

    isCorrect(question) {
        const userAnswers = this.getUserSelectedOptions(question);
        const correctAnswers = this.getQuestionCorrectAnswers(question);

        return userAnswers.length === correctAnswers.length && userAnswers.every((option) => correctAnswers.includes(option));
    }

    getUserSelectedOptions(question) {
        return Object.entries(question.userAnswers)
            .filter(([, checked]) => checked)
            .map(([option]) => option);
    }

    // Example: "Option A;Option D" => ['Option_A', 'Option_D']
    getQuestionCorrectAnswers(question) {
        const answers = question.Correct_Answers.split(';');
        return answers.map((str) => str.replace(' ', '_'));
    }

    selectQuestionByIndex(index) {
        this.toggleBoxSelection(false);
        this.questionSelected = this.examQuestions.find((q) => q.index === index);
    }

    toggleBoxSelection(isSelected) {
        const classList = this.questionSelectedBox.classList;

        if (isSelected) {
            classList.add('selected');
        } else {
            classList.remove('selected');
        }
    }

    updateCheckboxStates() {
        const numberOfCorrectAnswers = this.getQuestionCorrectAnswers(this.questionSelected).length;
        const numberOfOptionsSelected = this.getUserSelectedOptions(this.questionSelected).length;

        if (numberOfCorrectAnswers === numberOfOptionsSelected) {
            this.disableUncheckedOptions();
            this.questionSelectedBox.classList.add('answered');
        } else {
            this.enableAllCheckboxes(true);
            this.questionSelectedBox.classList.remove('answered');
        }
    }

    populateOptionLabels() {
        this.template.querySelectorAll('label').forEach((label) => {
            const option = label.dataset.option;
            label.textContent = '  ' + this.questionSelected[option];
        });
    }

    populateCheckboxes() {
        this.getCheckboxes().forEach((checkbox) => {
            const option = checkbox.value;
            checkbox.checked = this.questionSelected.userAnswers[option];
        });
    }

    highlightQuestionBoxes() {
        this.template.querySelectorAll('div.question-number').forEach((box) => {
            const boxIndex = Number(box.textContent);
            const question = this.examQuestions.find((q) => q.index === boxIndex);

            if (this.isCorrect(question)) {
                box.classList.add('correct-box');
            } else {
                box.classList.add('incorrect-box');
            }
        });
    }

    highlightAnswers() {
        const answers = this.getQuestionCorrectAnswers(this.questionSelected);

        this.template.querySelectorAll('label').forEach((label) => {
            const option = label.dataset.option;
            const checkbox = label.previousElementSibling;

            if (checkbox.checked && !answers.includes(option)) {
                label.classList.add('incorrect-label');
            } else if (answers.includes(option)) {
                label.classList.add('correct-label');
            }
        });
    }

    clearAnswerHighlights() {
        this.template.querySelectorAll('label').forEach((label) => {
            label.classList.remove('incorrect-label');
            label.classList.remove('correct-label');
        });
    }

    enableAllCheckboxes(isEnabled) {
        this.getCheckboxes().forEach((checkbox) => {
            checkbox.disabled = !isEnabled;
        });
    }

    disableUncheckedOptions() {
        this.getCheckboxes().forEach((checkbox) => {
            checkbox.disabled = !checkbox.checked;
        });
    }

    getCheckboxes() {
        return this.template.querySelectorAll('input');
    }
}
