Feature: DataCleaningForQuestionMasking
	In order to have consistent data
	As survey owner
	I want the survey to clean values of questions that are not shown due to question masking

Scenario: Changing q1 so that question mask goes from shown to not shown and question is cleaned
	Given I have a survey with question q1 and q2 where q2 has expression question mask
	When I have answered aliases [2, 3] on the q1 question
	And I press next
	And I have answered aliases [1, 3] on the q2 question
	And I press next
	And I press back
	And I press back
	And I have answered aliases [1, 3] on the q1 question
	And I press next
	And I press back
	And I have answered aliases [1, 2, 3] on the q1 question
	And I press next
	Then the question q2 should have aliases [] in the database

Scenario: No cleaning when q1 mask is not changed
	Given I have a survey with question q1 and q2 where q2 has expression question mask
	When I have answered aliases [2, 3] on the q1 question
	And I press next
	And I have answered aliases [1, 3] on the q2 question
	And I press next
	And I press back
	And I press back
	And I have answered aliases [1, 2, 3] on the q1 question
	And I press next
	And I press next
	Then the question q2 should have aliases [1,3] in the database