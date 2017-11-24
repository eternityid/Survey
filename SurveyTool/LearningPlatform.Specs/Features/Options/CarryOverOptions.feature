Feature: Carry Over Options 
	In order to reuse options from another question
	As a survey creator
	I want to be able to carry over options from that question

Scenario: Carry over custom mask script, options selected
	Given I have a survey with carry over options with custom mask script questions.numbers.optionsSelected
	Then the question numbers should have options with aliases 1, 2, 3
	When I have answered aliases 1,3 on the numbers question
	And I press next
	Then the question numbers2 should have options with aliases 1, 3

Scenario: Carry over custom mask script, options not selected
	Given I have a survey with carry over options with custom mask script questions.numbers.optionsNotSelected
	When I have answered aliases 1,3 on the numbers question
	And I press next
	Then the question numbers2 should have options with aliases 2

Scenario: Carry over options selected
	Given I have a survey with carry over options with type OptionsSelected
	When I have answered aliases 2,3 on the numbers question
	And I press next
	Then the question numbers2 should have options with aliases 2,3

Scenario: Carry over options not selected
	Given I have a survey with carry over options with type OptionsNotSelected
	When I have answered aliases 3 on the numbers question
	And I press next
	Then the question numbers2 should have options with aliases 1,2

Scenario: Carry over options shown
	Given I have a survey with carry over options with type OptionsShown
	When I have answered aliases 3 on the numbers question
	And I press next
	Then the question numbers2 should have options with aliases 1,2,3

Scenario: Carry over options not shown
	Given I have a survey with carry over options with type OptionsNotShown
	When I have answered aliases 3 on the numbers question
	And I press next
	Then the question numbers2 should have options with aliases 4
