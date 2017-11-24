Feature: Resume where left off in loop
	The respondent should be able to resume a survey also when loops are used

Scenario: Resume in loop
	Given I have a survey with loop
	When I press next
	And I have answered value 1 on the q2 question
	And I press next
	And I have answered value 2 on the q2 question
	And I press back
	When I resume survey
	Then the question q2 should have answer 1

Scenario: Resume in loop 2
	Given I have a survey with loop
	When I press next
	And I have answered value 1 on the q2 question
	And I press next
	And I have answered value 2 on the q2 question
	And I press next
	And I press back
	When I resume survey
	Then the question q2 should have answer 2

Scenario: Resume in loop and go forward
	Given I have a survey with loop
	When I press next
	And I have answered value 1 on the q2 question
	And I press next
	And I have answered value 2 on the q2 question
	And I press back
	When I resume survey
	And I press next
	Then the question q2 should have answer 2


Scenario: Resume and go back
	Given I have a survey with loop
	When I press next
	And I have answered value 1 on the q2 question
	And I press next
	And I have answered value 2 on the q2 question
	When I resume survey
	And I press back
	Then the question q2 should have answer 1

Scenario: Resume loop last iteration
	Given I have a survey with loop
	When I press next
	And I have answered value 1 on the q2 question
	And I press next
	And I have answered value 2 on the q2 question
	And I press next
	And I have answered value 3 on the q2 question
	And I press back
	And I press next
	When I resume survey
	Then the question q2 should have answer 3	

Scenario: Resume after loop at end of survey
	Given I have a survey with loop
	When I press next
	And I have answered value 1 on the q2 question
	And I press next
	And I have answered value 2 on the q2 question
	And I press next
	And I have answered value 3 on the q2 question
	And I press next
	When I resume survey
	Then navigation button is back only