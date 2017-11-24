Feature: Options Order with fixed position
	In order to control the order of some options
	As a survey creator
	I want to be able to set fixed position on some options on the question

Scenario: Options Random
	Given I have a survey with a question numbers that is Random order where the last option is in fixed position
	Then the question numbers should have options with aliases 1, 3, 2, 4

Scenario: Options Rotated
	Given I have a survey with a question numbers that is Rotated order where the last option is in fixed position
	Then the question numbers should have options with aliases 1, 2, 3, 4

Scenario: Options Flipped
	Given I have a survey with a question numbers that is Flipped order where the last option is in fixed position
	Then the question numbers should have options with aliases 3, 2, 1, 4

Scenario: Options In Order
	Given I have a survey with a question numbers that is InOrder order where the last option is in fixed position
	Then the question numbers should have options with aliases 1, 2, 3, 4

	