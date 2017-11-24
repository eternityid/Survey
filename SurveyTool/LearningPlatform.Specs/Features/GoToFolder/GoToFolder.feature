Feature: Go To Folder
	In order repeat questions in folder or to control the flow of the survey
	As a survey creator
	I want to be able to jump to folders and return when the folder is finished

Scenario: Go to folder going forward
	Given I have a survey with go to folder elements
	Then the question should be q2
	When I press next
	Then the question should be q1
	When I press next
	Then the question should be q2
	When I press next
	Then the question should be q3
	When I press next
	Then the question should be q2
	When I press next
	Then the question should be complete


Scenario: Go to folder going back
	Given I have a survey with go to folder elements
	When I press next
	And I press next
	And I press next
	And I press next
	And I press next
	And I press back
	Then the question should be q2
	When I press back
    Then the question should be q3
	When I press back
    Then the question should be q2
	When I press back
    Then the question should be q1
	When I press back
    Then the question should be q2
