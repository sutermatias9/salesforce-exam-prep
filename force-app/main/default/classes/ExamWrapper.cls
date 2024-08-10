public with sharing class ExamWrapper {
    @AuraEnabled
    public String name;
    @AuraEnabled
    public String URI;
    @AuraEnabled
    public Integer Number_of_Questions;
    @AuraEnabled
    public Integer Passing_Score;
    @AuraEnabled
    public Integer Time_to_Complete_minutes;
}
