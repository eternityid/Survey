Feature: Skip
	Survey creator should be able to set up skipping rules 
	So particular parts of the survey will not be displayed to the respondent.

Scenario: No skipping because expression is false
	Given I have survey with skip logic
	When I have answered value Bob on the name question
	And I press next
	Then the page should have questions with ids notForOeyvind

Scenario: Skip page because expression is true
	Given I have survey with skip logic
	When I have answered value Oeyvind on the name question
	And I press next
	Then the page should have questions with ids Completed

Scenario: Skip page on navigating back
	Given I have survey with skip logic
	When I have answered value Oeyvind on the name question
	And I press next
	And I press back
	Then the page should have questions with ids name

Scenario: No skipping when change expression from true to false and going back
	Given I have survey with skip logic
	When I have answered value Oeyvind on the name question
	And I press next
	And I press back
	And I have answered value Bob on the name question
	And I press next
	And I press next
	And I press next
	And I press back
	Then the page should have questions with ids alsoNotForOeyvind