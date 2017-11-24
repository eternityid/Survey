Feature: Piped Text
	In order to control what is on the page
	As a survey creator
	I want to be able to pipe text on any question

@mytag
Scenario: Piped text 
	Given I have survey with piped text
	When I have answered value John on the name question
	And I press next
	Then the question info should have the text Hello John

Scenario: Piped text pointing to the same question
	Given I have survey with piped text pointing to the same question
	When I have answered value John on the name question
	When I press next
	And I press back
	Then the question name should have the text Hello John