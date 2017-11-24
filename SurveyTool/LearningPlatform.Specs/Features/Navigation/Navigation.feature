Feature: Navigation
	In order to change the answers in the survey
	As a respondent
	I want to be able to navigate back and forward


Scenario: First page
	Given I have a survey with single question "gender" and number question "age"
	Then navigation button is forward only

Scenario: Second page
	Given I have a survey with single question "gender" and number question "age"
	When I have answered value 1 on the gender question
	And I press next
	Then navigation buttons are both directions


Scenario: Complete the survey
	Given I have a survey with single question "gender" and number question "age"
	When I have answered value 1 on the gender question
	And I press next
	And I have answered value 30 on the age question
	And I press next
	And I press next
	Then the question should be Completed
	And navigation button is not displayed

Scenario: Next and back
	Given I have a survey with single question "gender" and number question "age"
	When I have answered value 1 on the gender question
	And I press next
	And I press back
	Then navigation button is forward only
	And the question gender should have answer 1


Scenario: Survey with nested folders - First Page 
	Given I have a survey with nested folders
	Then the question should be q1

Scenario: Survey with nested folders - Second Page 
	Given I have a survey with nested folders
	When I press next
	Then the question should be q2

Scenario: Survey with nested folders - Third Page 
	Given I have a survey with nested folders
	When I press next
	And I press next
	Then the question should be q3

Scenario: Survey with nested folders - Back to Second Page 
	Given I have a survey with nested folders
	When I press next
	And I press next
	And I press back
	Then the question should be q2

Scenario: Survey with nested folders - Back to First Page 
	Given I have a survey with nested folders
	When I press next
	And I press next
	And I press back
	And I press back
	Then the question should be q1


Scenario: Survey with two folders - First Page 
	Given I have a survey with two folders inside the main folder
	Then the question should be q1

Scenario: Survey with two folders - Second Page 
	Given I have a survey with two folders inside the main folder
	When I press next
	Then the question should be q2

Scenario: Survey with two folders - Third Page 
	Given I have a survey with two folders inside the main folder
	When I press next
	And I press next
	Then the question should be q3

Scenario: Survey with two folders - Back to Second Page 
	Given I have a survey with two folders inside the main folder
	When I press next
	And I press next
	And I press back
	Then the question should be q2

Scenario: Survey with two folders - Back to First Page 
	Given I have a survey with two folders inside the main folder
	When I press next
	And I press next
	And I press back
	And I press back
	Then the question should be q1


Scenario: Condition at the beginning, first page
	Given I have a survey with a condition as the first element
	Then the question should be gender
	And the question should be age

Scenario: Condition at the beginning, complete it
	Given I have a survey with a condition as the first element
	When I have answered value 2 on the gender question
	And I have answered value 5 on the age question
	And I press next
	Then the question should be information


Scenario: Condition at the beginning, next and back, condition true
	Given I have a survey with a condition as the first element
	When I have answered value 2 on the gender question
	And I have answered value 5 on the age question
	And I press next
	And I press back
	Then navigation buttons are both directions


Scenario: Condition at the beginning, next and back, condition false
	Given I have a survey with a condition as the first element
	When I have answered value 2 on the gender question
	And I have answered value 3 on the age question
	And I press next
	And I press back
	Then navigation button is forward only

Scenario: Condition at the beginning,  next and back, condition true and then false
	Given I have a survey with a condition as the first element
	When I have answered value 2 on the gender question
	And I have answered value 5 on the age question
	And I press next
	And I press back
	And I have answered value 3 on the age question
	And I press back
	Then the question should be gender
	And navigation button is forward only 
