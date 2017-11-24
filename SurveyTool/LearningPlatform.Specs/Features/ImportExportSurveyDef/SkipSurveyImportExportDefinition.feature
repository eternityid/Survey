Feature: SkipSurveyImportExportDefinition

Scenario: Export survey definition of skip survey
	Given I have survey with skip logic for export
	When I export the survey as export.json
	Then json file Features\ImportExportSurveyDef\expected\skipSurvey.json should equal export.json while ignore the properties createdDate, created, modifiedDate, modified, version, accessRights

Scenario: Import and export a survey definition of simple survey
	Given I import the survey Features\ImportExportSurveyDef\expected\skipSurvey.json
	When I export the survey as export2.json
	Then json file Features\ImportExportSurveyDef\expected\skipSurvey.json should equal export2.json while ignore the properties createdDate, created, modifiedDate, modified, name, version, accessRights

