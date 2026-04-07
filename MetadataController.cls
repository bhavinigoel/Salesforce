public with sharing class MetadataController {

    // Wrapper class to send field info to LWC
    public class FieldWrapper {
        @AuraEnabled public String label;
        @AuraEnabled public String apiName;

        public FieldWrapper(String label, String apiName) {
            this.label = label;
            this.apiName = apiName;
        }
    }

    // Get all objects user has access to
    @AuraEnabled(cacheable=true)
    public static List<String> getAllObjects() {
        Map<String, Schema.SObjectType> objMap = Schema.getGlobalDescribe();
        List<String> accessibleObjects = new List<String>();

        for(String objName : objMap.keySet()) {
            Schema.DescribeSObjectResult objDescribe = objMap.get(objName).getDescribe();
            // Check if user has read access to object
            if(objDescribe.isAccessible()) {
                accessibleObjects.add(objName);
            }
        }
/
    
        accessibleObjects.sort();
        return accessibleObjects;
    }

    // Get picklist fields of a given object, respecting field-level security
    @AuraEnabled(cacheable=true)
    public static List<FieldWrapper> getPicklistFields(String objectName) {
        List<FieldWrapper> picklistFields = new List<FieldWrapper>();

        if(String.isBlank(objectName)) {
            return picklistFields;
        }

        Map<String, Schema.SObjectType> objMap = Schema.getGlobalDescribe();

        if(!objMap.containsKey(objectName)) {
            return picklistFields;
        }

        Schema.DescribeSObjectResult objDescribe = objMap.get(objectName).getDescribe();

        // Respect object-level access
        if(!objDescribe.isAccessible()) {
            return picklistFields;
        }

        Map<String, Schema.SObjectField> fieldMap = objDescribe.fields.getMap();

        for(String fieldApiName : fieldMap.keySet()) {
            Schema.DescribeFieldResult fieldDescribe = fieldMap.get(fieldApiName).getDescribe();

            // Respect field-level access: only show fields the user can read
            if((fieldDescribe.getType() == Schema.DisplayType.Picklist ||
                fieldDescribe.getType() == Schema.DisplayType.MultiPicklist) &&
                fieldDescribe.isAccessible()) {
                
                picklistFields.add(new FieldWrapper(
                    fieldDescribe.getLabel(),
                    fieldApiName
                ));
            }
        }

        picklistFields.sort(new FieldWrapperComparator());
        return picklistFields;
    }

    // Comparator to sort fields alphabetically by label
    public class FieldWrapperComparator implements Comparator<FieldWrapper> {
        public Integer compare(FieldWrapper a, FieldWrapper b) {
            return a.label.toLowerCase().compareTo(b.label.toLowerCase());
        }
    }
}































/*public with sharing class MetadataController {

    // Wrapper class for picklist fields
    public class FieldWrapper {

        @AuraEnabled public String label;
        @AuraEnabled public String apiName;

        public FieldWrapper(String label, String apiName) {
            this.label = label;
            this.apiName = apiName;
        }
    }


    // Get all objects
    @AuraEnabled(cacheable=true)
    public static List<String> getAllObjects() {

        Map<String, Schema.SObjectType> objMap = Schema.getGlobalDescribe();

        List<String> objectList = new List<String>();

        for(String objName : objMap.keySet()) {

            objectList.add(objName);

        }

        objectList.sort();

        return objectList;
    }



    // Get picklist fields of selected object
    @AuraEnabled(cacheable=true)
    public static List<FieldWrapper> getPicklistFields(String objectName) {

        List<FieldWrapper> fieldList = new List<FieldWrapper>();

        Schema.DescribeSObjectResult objDescribe =
            Schema.getGlobalDescribe().get(objectName).getDescribe();

        Map<String, Schema.SObjectField> fieldMap =
            objDescribe.fields.getMap();


        for(String fieldName : fieldMap.keySet()) {

            Schema.DescribeFieldResult fieldDescribe =
                fieldMap.get(fieldName).getDescribe();


            if(fieldDescribe.getType() == Schema.DisplayType.Picklist
            || fieldDescribe.getType() == Schema.DisplayType.MultiPicklist) {

                fieldList.add(
                    new FieldWrapper(
                        fieldDescribe.getLabel(),
                        fieldName
                    )
                );

            }
        }

        return fieldList;
    }

}*/
