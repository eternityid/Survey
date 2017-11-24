Feature: Required Validation
	In order to ensure that the respondent answers a question
	As a survey creator
	I want to set a question as required 

@mytag
Scenario: Required but no answer
	Given I have survey with required question
	When I press next
	Then an error message Question "name" is required is shown


Scenario: Required and answered
	Given I have survey with required question
	When I have answered value John on the nameId question
	And I press next
	Then no error message is shown
