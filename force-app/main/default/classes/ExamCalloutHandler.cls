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

    public with sharing class ExamWrapper {
        public String name;
        public String URI;
        public Integer Number_of_Questions;
        public Integer Passing_Score;
        public Integer Time_to_Complete_minutes;
    }
}
