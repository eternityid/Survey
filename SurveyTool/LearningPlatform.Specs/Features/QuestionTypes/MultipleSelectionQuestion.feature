Feature: MultipleSelectionQuestion
	In order to allow user to select multiple selection
	As a respondent
	I want to be able to answer multiple selection questions

Scenario: Check that question is multi question
	Given I have a survey with a multiple selection question
	Then the question cars should be of type MultipleSelectionQuestion 

Scenario: Answer multi question and press next
	Given I have a survey with a multiple selection question
	When I have answered aliases 2,3 on the cars question
	And I press next
	Then the question cars should have aliases 2,3 in the database

Scenario: Answer multi question and change answer
	Given I have a survey with a multiple selection question
	When I have answered aliases 2,3 on the cars question
	And I press next
	And I press back
	When I have answered aliases 1 on the cars question
	And I press next
	Then the question cars should have aliases 1 in the database
