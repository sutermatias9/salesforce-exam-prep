public with sharing class ExamCalloutHandler {
    @AuraEnabled(cacheable=true)
    public static List<ExamWrapper> getAvailableExams() {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('callout:ExamService/services/apexrest/AvailableExams');
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');

        HttpResponse response = http.send(request);

        if (response.getStatusCode() == 200) {
            List<ExamWrapper> exams = (List<ExamWrapper>) JSON.deserialize(response.getBody().replaceAll('__c', ''), List<ExamWrapper>.class);
            return exams;
        } else {
            throw new AuraHandledException('Failed to fetch available exams: ' + response.getStatus());
        }
    }

    @AuraEnabled
    public static List<QuestionWrapper> getExamQuestions(String examURI) {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('callout:ExamService/services/apexrest/Exams/' + examURI);
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');

        HttpResponse response = http.send(request);

        if (response.getStatusCode() == 200) {
            List<QuestionWrapper> questions = (List<QuestionWrapper>) JSON.deserialize(
                response.getBody().replaceAll('__c', ''),
                List<QuestionWrapper>.class
            );

            return questions;
        } else {
            throw new AuraHandledException('Failed to fetch exam questions: ' + response.getStatus());
        }
    }
}
