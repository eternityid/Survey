Feature: Custom Script Options Mask
	In order to control the options shown on a question
	As a survey creator
	I want to be able to set masks on questions

	We have a survey with two pages and one question in each page: 
		question1 multiple selection with 3 options
		question2 single selection with 3 options

Scenario: Fixed mask
	Given survey with options masks [1, 3] on question1 and '' on question2
	Then the question question1 should have options with aliases [1, 3]

Scenario: Mask optionsSelected
	Given survey with options masks '' on question1 and questions.question1.optionsSelected on question2
	When I have answered aliases [3] on the question1 question
	And I press next
	Then the question question2 should have options with aliases [3]


Scenario: Mask optionsSelected multiple options answered
	Given survey with options masks '' on question1 and questions.question1.optionsSelected on question2
	When I have answered aliases [1, 3] on the question1 question
	And I press next
	Then the question question2 should have options with aliases [1, 3]


Scenario: Mask optionsNotSelected
	Given survey with options masks '' on question1 and questions.question1.optionsNotSelected on question2
	When I have answered aliases [3] on the question1 question
	And I press next
	Then the question question2 should have options with aliases [1, 2]


Scenario: Mask optionsNotShown
	Given survey with options masks '' on question1 and questions.question1.optionsNotShown on question2
	When I have answered aliases [3] on the question1 question
	And I press next
	Then the question question2 should have options with aliases []


Scenario: Mask optionsNotShown part 2
	Given survey with options masks ['1', '3'] on question1 and questions.question1.optionsNotShown on question2
	When I have answered aliases 3 on the question1 question
	And I press next
	Then the question question2 should have options with aliases [2]
