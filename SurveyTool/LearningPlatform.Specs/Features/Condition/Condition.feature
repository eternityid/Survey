Feature: Condition
	In order to have different paths through the survey
	As survey creator
	I want to be able to use conditional logic


Scenario: Survey with condition, false branch
	Given I have a survey with a condition with true and false branch
	When I have answered value 2 on the gender question
	And I press next
	Then the question should be femaleQuestion

Scenario: Survey with condition, true branch
	Given I have a survey with a condition with true and false branch
	When I have answered value 1 on the gender question
	And I press next
	Then the question should be maleQuestion

Scenario: Survey with condition, true branch going back
	Given I have a survey with a condition with true and false branch
	When I have answered value 1 on the gender question
	And I press next
	And I have answered value abc on the maleQuestion question
	And I press back
	Then the question should be gender

Scenario: Survey with condition, false branch going back
	Given I have a survey with a condition with true and false branch
	When I have answered value 2 on the gender question
	And I press next
	And I have answered value abc on the femaleQuestion question
	And I press back
	Then the question should be gender