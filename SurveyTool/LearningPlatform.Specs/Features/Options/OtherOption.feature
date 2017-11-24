Feature: Other Option
	In respondent, I would like to specify other options for single and multiple selection questions.

@mytag
Scenario: Select another option than the "other"
	Given I have a survey with other option
	When I have answered aliases 1 on the question1 question
	And I press next
	Then the question should be Info

Scenario: Select the "other" option, but not fill out the other question
	Given I have a survey with other option
	When I have answered aliases 3 on the question1 question
	And I press next
	Then an error message Question "other" is required is shown

Scenario: Select the "other" option and also fill out the other question
	Given I have a survey with other option
	When I have answered aliases 3 on the question1 question
	And I have answered value abc on the question1Other question
	And I press next
	Then the question should be Info

Scenario: Clean up other question
	Given I have a survey with other option
	When I have answered aliases 3 on the question1 question 
	And I have answered value abc on the question1Other question
	And I press next
	And I press back
	When I have answered aliases 2 on the question1 question
	And I press next
	Then the question question1Other should have value null in the database

Scenario: No clean up of other question
	Given I have a survey with other option
	When I have answered aliases 3 on the question1 question
	And I have answered value abc on the question1Other question
	And I press next
	And I press back
	When I have answered aliases 3 on the question1 question
	And I press next
	Then the question question1Other should have value abc in the database
