Feature: Question Order In Page
	In order to control the order of the questions in a page
	As a survey creator
	I want to be able to set randomized, rotated, flipped, in order on the page

@mytag
Scenario: Page Random
	Given I have a survey with a page that is Random order
	Then the page should have questions with ids q2, q4, q3, q1

Scenario: Page Rotated
	Given I have a survey with a page that is Rotated order
	Then the page should have questions with ids q4, q1, q2, q3

Scenario: Page Flipped
	Given I have a survey with a page that is Flipped order
	Then the page should have questions with ids q4, q3, q2, q1

Scenario: Page In Order
	Given I have a survey with a page that is InOrder order
	Then the page should have questions with ids q1, q2, q3, q4
