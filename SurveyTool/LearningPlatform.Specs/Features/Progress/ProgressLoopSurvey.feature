Feature: Progress in loop survey
	In order for the respondent to see the progress of the survey,	
	I want to compute the progress from 0 to 100 at every point in the survey.

@mytag
Scenario: Progress in loop when going forward selecting all options
	Given I have a survey with loop using options masking
	Then the progress should be 0
	When I have answered aliases 1,2,3 on the q1 question
	And I press next
	Then the progress should be 20
	When I press next
	Then the progress should be 40
	When I press next
	Then the progress should be 60
	When I press next
	Then the progress should be 80
	When I press next
	Then the progress should be 100


Scenario: Progress in loop when going forward selecting two options
	Given I have a survey with loop using options masking
	Then the progress should be 0
	When I have answered aliases 1,3 on the q1 question
	And I press next
	Then the progress should be 20
	When I press next
	Then the progress should be 50
	When I press next
	Then the progress should be 80
	When I press next
	Then the progress should be 100

Scenario: Progress in loop when going back selecting two options
	Given I have a survey with loop using options masking
	When I have answered aliases 1,3 on the q1 question
	And I press next
	When I press next
	When I press next
	Then the progress should be 80
	When I press back
	Then the progress should be 50
	When I press back
	Then the progress should be 20
	When I press back
	Then the progress should be 0
	