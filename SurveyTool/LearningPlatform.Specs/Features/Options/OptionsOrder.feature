Feature: Options Order
	In order to control the order of the options
	As a survey creator
	I want to be able to set randomized, rotated, flipped, in order on the question

Scenario: Options Random
	Given I have a survey with a question numbers that is Random order
	Then the question numbers should have options with aliases 2, 4, 3, 1

Scenario: Options Rotated
	Given I have a survey with a question numbers that is Rotated order
	Then the question numbers should have options with aliases 4, 1, 2, 3

Scenario: Options Flipped
	Given I have a survey with a question numbers that is Flipped order
	Then the question numbers should have options with aliases 4, 3, 2, 1

Scenario: Options In Order
	Given I have a survey with a question numbers that is InOrder order
	Then the question numbers should have options with aliases 1, 2, 3, 4

	