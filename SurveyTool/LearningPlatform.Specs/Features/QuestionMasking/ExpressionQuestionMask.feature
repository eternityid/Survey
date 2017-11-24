Feature: Expression Question Mask
	In order to control the questions to be shown on a page
	As a survey creator
	I want to be able to set question masks with the expression builder

Scenario: Expression is true and q2 is shown
	Given I have a survey with question q1 and q2 where q2 has expression question mask
	When I have answered aliases 2 on the q1 question
	And I press next
	Then the page should have questions with ids q2

Scenario: Expression is false and q2 is not shown
	Given I have a survey with question q1 and q2 where q2 has expression question mask
	When I have answered aliases 1,3 on the q1 question
	And I press next
	Then the page should have questions with ids information


Scenario: Changing q1 so that question mask goes from shown to not shown 
# (Expression goes from true to false)
	Given I have a survey with question q1 and q2 where q2 has expression question mask
	When I have answered aliases 2, 3 on the q1 question
	And I press next
	And I have answered aliases 1, 3 on the q2 question
	And I press next
	And I press back
	And I press back
	And I have answered aliases 1, 3 on the q1 question
	And I press next
	Then the page should have questions with ids information
