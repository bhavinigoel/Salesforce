public with sharing class ContactController {

    @AuraEnabled
    public static List<Contact> searchContacts(String firstName, String lastName, String email) {
        String query = 'SELECT Id, FirstName, LastName, Email FROM Contact WHERE Id != null';

        if (String.isNotBlank(firstName)) {
            query += ' AND FirstName LIKE \'%' + firstName + '%\'';
        }
        if (String.isNotBlank(lastName)) {
            query += ' AND LastName LIKE \'%' + lastName + '%\'';
        }
        if (String.isNotBlank(email)) {
            query += ' AND Email LIKE \'%' + email + '%\'';
        }

        return Database.query(query);
    }

    @AuraEnabled
    public static void updateContact(Contact con) {
        update con;
    }

    @AuraEnabled
    public static void deleteContact(Id contactId) {
        delete [SELECT Id FROM Contact WHERE Id = :contactId];
    }
}