Feature: Loop with options mask
	In order repeat part of the survey
	As a survey creator
	I want to be able to create loops

Scenario: Answer two options going forward
	Given I have a survey with loop using options masking
	Then the question should be q1
	When I have answered aliases 1,3 on the q1 question
	And I press next
	Then the question should be q2
	And the question q2 should have the text BMW
	When I press next
	Then the question should be q2
	And the question q2 should have the text Ford
	When I press next
	Then the question should be Info

Scenario: Answer two options going forward and back again
	Given I have a survey with loop using options masking
	When I have answered aliases 1,3 on the q1 question
	And I press next
	When I have answered value 1 on the q2 question
	And I press next
	When I have answered value 2 on the q2 question
	And I press next
	Then the question should be Info
	When I press back
	Then the question q2 should have the text Ford
	Then the question q2 should have answer 2
	When I press back
	Then the question q2 should have the text BMW
	And the question q2 should have answer 1
	When I press back
	Then the question should be q1
