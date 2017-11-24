Feature: Loop
	In order repeat part of the survey
	As a survey creator
	I want to be able to create loops

Scenario: Answer three options going forward
	Given I have a survey with loop
	Then the question should be start
	When I press next
	Then the question should be q2
	And the question q2 should have the text ''
	When I press next
	Then the question should be q2
	And the question q2 should have the text ''
	When I press next
	Then the question should be q2
	And the question q2 should have the text ''
	When I press next
	Then the question should be complete

Scenario: Answer three options going forward and back again
	Given I have a survey with loop
	Then the question should be start
	When I press next
	When I have answered value 1 on the q2 question
	And I press next
	When I have answered value 2 on the q2 question
	And I press next
	When I have answered value 3 on the q2 question
	And I press next
	Then the question should be complete
	When I press back
	Then the question q2 should have answer 3
	When I press back
	Then the question q2 should have answer 2
	When I press back
	Then the question q2 should have answer 1
	When I press back
	Then the question should be start

