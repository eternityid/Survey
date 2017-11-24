Feature: Progress in survey with condition 
	In order for the respondent to see the progress of the survey,	
	I want to compute the progress from 0 to 100 at every point in the survey.

Scenario: Progress in condition going forward in the true branch
	Given I have a survey with a condition with true and false branch
	Then the progress should be 0
	When I have answered value 1 on the gender question
	And I press next
	Then the progress should be 20
	When I press next
	Then the progress should be 80
	When I press next
	Then the progress should be 100


Scenario: Progress in condition going forward in the false branch
	Given I have a survey with a condition with true and false branch
	Then the progress should be 0
	When I have answered value 2 on the gender question
	And I press next
	Then the progress should be 20	
	When I press next	
	Then the progress should be 60	
	When I press next
	Then the progress should be 80	
	When I press next
	Then the progress should be 100


Scenario: Progress in condition going back in the false branch
	Given I have a survey with a condition with true and false branch
	When I have answered value 2 on the gender question
	And I press next
	When I press next	
	When I press next
	Then the progress should be 80
	When I press back
	Then the progress should be 60
	When I press back
	Then the progress should be 20
	When I press back
	Then the progress should be 0
