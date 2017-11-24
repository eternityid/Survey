Feature: Shared Options 
	In order to reuse options
	As a survey creator
	I want to be able to create options lists that can be used in multiple questions

Scenario: Shared options
	Given I have a survey with shared options
	Then the question numbers should have options with aliases 1, 2, 3
	When I have answered aliases 1,3 on the numbers question
	And I press next
	Then the question numbers2 should have options with aliases 1, 3
