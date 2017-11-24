Feature: Scripting
	In order to do advanced things
	As survey creator
	I want to be able to use Javascript in my survey

@mytag
Scenario: Simple Script
	Given I have a survey with a script block with the following code:
		"""
		var test = "";
		for(var i=0;i<10;i++)
			test += i;
		questions.q1.answer = test;
		"""
	Then the question q1 should have answer 0123456789
