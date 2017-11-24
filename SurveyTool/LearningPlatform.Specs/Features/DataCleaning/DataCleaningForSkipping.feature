Feature: DataCleaningForSkipping
	In order to have consistent data
	As survey owner
	I want the survey to clean values of questions that are skipped

Scenario: No cleaning because we are not skipping
	Given I have survey with skip logic
	When I have answered value Bob on the name question
	And I press next
	And I have answered value Hello on the notForOeyvind question
	And I press next
	And I have answered value World on the alsoNotForOeyvind question
	And I press back
	And I press back
	When I have answered value Tom on the name question
	And I press next
	Then the question notForOeyvind should have value Hello in the database
	And the question alsoNotForOeyvind should have value World in the database

Scenario: Cleaning skipped questions
	Given I have survey with skip logic
	When I have answered value Bob on the name question
	And I press next
	And I have answered value Hello on the notForOeyvind question
	And I press next
	And I have answered value World on the alsoNotForOeyvind question
	And I press back
	And I press back
	When I have answered value Oeyvind on the name question
	And I press next
	Then the question notForOeyvind should have value null in the database
	And the question alsoNotForOeyvind should have value null in the database


Scenario: Do not clean question on page skipped to
	Given I have survey with skip logic
	When I have answered value John on the name question
	And I press next
	And I have answered value World on the alsoNotForOeyvind question
	And I press back
	And I press next
	Then the question alsoNotForOeyvind should have value World in the database
