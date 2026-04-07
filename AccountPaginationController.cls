public with sharing class AccountPaginationController {

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [
            SELECT Id, Name, Industry, Phone
            FROM Account
            ORDER BY Name
        ];
    }
}
