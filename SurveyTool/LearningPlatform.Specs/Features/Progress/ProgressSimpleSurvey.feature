Feature: Progress in simple survey
	In order for the respondent to see the progress of the survey,	
	I want to compute the progress from 0 to 100 at every point in the survey.

@mytag
Scenario: Progress when going forward
	Given I have a survey with single question "gender" and number question "age"
	Then the progress should be 0
	When I press next
	Then the progress should be 33
	When I press next
	Then the progress should be 66
	When I press next
	Then the progress should be 100

Scenario: Progress when going back
	Given I have a survey with single question "gender" and number question "age"
	When I press next
	When I press next
	Then the progress should be 66
	When I press back
	Then the progress should be 33
	When I press back
	Then the progress should be 0
