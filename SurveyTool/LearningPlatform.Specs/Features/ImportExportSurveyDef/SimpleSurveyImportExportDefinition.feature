Feature: SimpleSurveyImportExportDefinition

Scenario: Export survey definition of simple survey
	Given I have a simple survey for export
	When I export the survey as export.json
	Then json file Features\ImportExportSurveyDef\expected\SimpleSurvey.json should equal export.json while ignore the properties createdDate, created, modifiedDate, modified, version, accessRights

Scenario: Import survey definition
	Given I import the survey Features\ImportExportSurveyDef\expected\SimpleSurvey.json
	Then survey should have SurveyId set

Scenario: Import and export a survey definition of simple survey
	Given I import the survey Features\ImportExportSurveyDef\expected\SimpleSurvey.json
	When I export the survey as export2.json
	Then json file Features\ImportExportSurveyDef\expected\SimpleSurvey.json should equal export2.json while ignore the properties createdDate, created, modifiedDate, modified, name, version, accessRights

