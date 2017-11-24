Feature: Data Cleaning for conditions
	In order to have consistent data
	As survey owner
	I want the survey to clean up false branch in a condition


Scenario: Data Cleaning
	Given I have a survey with a condition with true and false branch
	When I have answered value 2 on the gender question
	And I press next
	And I have answered value abc on the femaleQuestion question
	And I press back
	And I have answered value 1 on the gender question
	And I press next
	Then the question femaleQuestion should have value null in the database


Scenario: Data Cleaning Going Back from end of survey
	Given I have a survey with a condition with true and false branch with script before complete
	When I have answered value 2 on the gender question
	And I press next
	And I have answered value abc on the femaleQuestion question
	And I press next
	And I press next
	And I press next
	#It should not clean questions before stepping over them, so navigating back should not clean
	And I press back 
	Then the question femaleQuestion should have value abc in the database


Scenario: Data Cleaning with nested conditions
	Given I have a survey with nested conditions
	When I have answered value 1 on the gender question
	And I press next
	When I have answered value abc on the q1 question
	And I press next
	And I have answered value abc on the q2 question
	And I have answered value abc on the q3 question
	And I press next
	And I have answered value abc on the q4 question
	And I press next
	And I press back
	And I press back
	And I press back
	And I press back
	And I have answered value 2 on the gender question
	And I press next
	Then the questions with ids q1, q2, q3, q4 should have value null in the database