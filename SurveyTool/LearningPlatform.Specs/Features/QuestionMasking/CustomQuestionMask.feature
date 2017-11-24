Feature: Custom Question Mask
	In order to control the questions to be shown on a page
	As a survey creator
	I want to be able to handle advanced requirements through custom question masks


Scenario: Simple question mask hidden
	Given I have a survey with question q1 with custom masks false and q2
	Then the page should have questions with ids q2

Scenario: Simple question mask shown
	Given I have a survey with question q1 with custom masks true and q2
	Then the page should have questions with ids q1, q2


Scenario: All questions in page are hidden
	Given I have a survey with question masks where all questions in page is hidden
	Then the page should have questions with ids q3
	And navigation button is forward only

