Feature: RandomDataGenerator
	In order to avoid mistakes in the survey and to generate test data
	As a survey creator
	I want to be able to generate random data for the survey.


Scenario: Random Generator
	Given I have a survey for random data generation
	When I start random data generator
	Then the database should have the following responses 
| Id  | SurveyId|RespondentId| QuestionName  | Alias      | AnswerType|IntegerAnswer|DoubleAnswer| DateTimeAnswer    | TextAnswer                  |
|   1 |       000000000000000000000001 |          1 | cars          | bmw        | Multi     |           0 |            |                   |                             |
|   2 |       000000000000000000000001 |          1 | cars          | mercedes   | Multi     |           1 |            |                   |                             |
|   3 |       000000000000000000000001 |          1 | cars          | ford       | Multi     |           0 |            |                   |                             |
|   4 |       000000000000000000000001 |          1 | cars          | tesla      | Multi     |           0 |            |                   |                             |
|   5 |       000000000000000000000001 |          1 | cars_fav      |            | Single    |             |            |                   |                             |
|   6 |       000000000000000000000001 |          1 | name          |            | Open      |             |            |                   |                             |
|   7 |       000000000000000000000001 |          1 | rate_bmw      |            | Single    |             |            |                   | 4                           |
|   8 |       000000000000000000000001 |          1 | rate_mercedes |            | Single    |             |            |                   | 3                           |
|   9 |       000000000000000000000001 |          1 | rate_ford     |            | Single    |             |            |                   | 1                           |
|  10 |       000000000000000000000001 |          1 | rateBmw       |            | Single    |             |            |                   | 5                           |
|  11 |       000000000000000000000001 |          1 | numeric       |            | Number    |             |            |                   |                             |
|  12 |       000000000000000000000001 |          1 | date          |            | Date      |             |            |                   |                             |
|  13 |       000000000000000000000001 |          2 | cars          | bmw        | Multi     |           0 |            |                   |                             |
|  14 |       000000000000000000000001 |          2 | cars          | mercedes   | Multi     |           0 |            |                   |                             |
|  15 |       000000000000000000000001 |          2 | cars          | ford       | Multi     |           1 |            |                   |                             |
|  16 |       000000000000000000000001 |          2 | cars          | tesla      | Multi     |           1 |            |                   |                             |
|  17 |       000000000000000000000001 |          2 | cars_fav      |            | Single    |             |            |                   |                             |
|  18 |       000000000000000000000001 |          2 | name          |            | Open      |             |            |                   | Cupidatat.                  |
|  19 |       000000000000000000000001 |          2 | rate_bmw      |            | Single    |             |            |                   |                             |
|  20 |       000000000000000000000001 |          2 | rate_mercedes |            | Single    |             |            |                   | 4                           |
|  21 |       000000000000000000000001 |          2 | rate_ford     |            | Single    |             |            |                   |                             |
|  22 |       000000000000000000000001 |          2 | rateBmw       |            | Single    |             |            |                   |                             |
|  23 |       000000000000000000000001 |          2 | numeric       |            | Number    |             |            |                   |                             |
|  24 |       000000000000000000000001 |          2 | date          |            | Date      |             |            |                   |                             |
|  25 |       000000000000000000000001 |          3 | cars          | bmw        | Multi     |           1 |            |                   |                             |
|  26 |       000000000000000000000001 |          3 | cars          | mercedes   | Multi     |           0 |            |                   |                             |
|  27 |       000000000000000000000001 |          3 | cars          | ford       | Multi     |           1 |            |                   |                             |
|  28 |       000000000000000000000001 |          3 | cars          | tesla      | Multi     |           1 |            |                   |                             |
|  29 |       000000000000000000000001 |          3 | cars_fav      |            | Single    |             |            |                   |                             |
|  30 |       000000000000000000000001 |          3 | name          |            | Open      |             |            |                   |                             |
|  31 |       000000000000000000000001 |          3 | rate_bmw      |            | Single    |             |            |                   |                             |
|  32 |       000000000000000000000001 |          3 | rate_mercedes |            | Single    |             |            |                   |                             |
|  33 |       000000000000000000000001 |          3 | rate_ford     |            | Single    |             |            |                   | 2                           |
|  34 |       000000000000000000000001 |          3 | rateBmw       |            | Single    |             |            |                   |                             |
|  35 |       000000000000000000000001 |          3 | numeric       |            | Number    |             |            |                   |                             |
|  36 |       000000000000000000000001 |          3 | date          |            | Date      |             |            |02/08/2000 08:31:10|                             |
|  37 |       000000000000000000000001 |          4 | cars          | bmw        | Multi     |           1 |            |                   |                             |
|  38 |       000000000000000000000001 |          4 | cars          | mercedes   | Multi     |           1 |            |                   |                             |
|  39 |       000000000000000000000001 |          4 | cars          | ford       | Multi     |           0 |            |                   |                             |
|  40 |       000000000000000000000001 |          4 | cars          | tesla      | Multi     |           1 |            |                   |                             |
|  41 |       000000000000000000000001 |          4 | cars_fav      |            | Single    |             |            |                   | tesla                       |
|  42 |       000000000000000000000001 |          4 | name          |            | Open      |             |            |                   | Do.                         |
|  43 |       000000000000000000000001 |          4 | rate_bmw      |            | Single    |             |            |                   | 2                           |
|  44 |       000000000000000000000001 |          4 | rate_mercedes |            | Single    |             |            |                   |                             |
|  45 |       000000000000000000000001 |          4 | rate_ford     |            | Single    |             |            |                   | 4                           |
|  46 |       000000000000000000000001 |          4 | rateBmw       |            | Single    |             |            |                   |                             |
|  47 |       000000000000000000000001 |          4 | numeric       |            | Number    |             |            |                   |                             |
|  48 |       000000000000000000000001 |          4 | date          |            | Date      |             |            |02/08/1997 04:25:57|                             |
|  49 |       000000000000000000000001 |          5 | cars          | bmw        | Multi     |           1 |            |                   |                             |
|  50 |       000000000000000000000001 |          5 | cars          | mercedes   | Multi     |           1 |            |                   |                             |
|  51 |       000000000000000000000001 |          5 | cars          | ford       | Multi     |           0 |            |                   |                             |
|  52 |       000000000000000000000001 |          5 | cars          | tesla      | Multi     |           1 |            |                   |                             |
|  53 |       000000000000000000000001 |          5 | cars_fav      |            | Single    |             |            |                   | bmw                         |
|  54 |       000000000000000000000001 |          5 | name          |            | Open      |             |            |                   | Ullamco dolor voluptate.    |
|  55 |       000000000000000000000001 |          5 | rate_bmw      |            | Single    |             |            |                   |                             |
|  56 |       000000000000000000000001 |          5 | rate_mercedes |            | Single    |             |            |                   |                             |
|  57 |       000000000000000000000001 |          5 | rate_ford     |            | Single    |             |            |                   |                             |
|  58 |       000000000000000000000001 |          5 | rateBmw       |            | Single    |             |            |                   |                             |
|  59 |       000000000000000000000001 |          5 | numeric       |            | Number    |             |            |                   |                             |
|  60 |       000000000000000000000001 |          5 | date          |            | Date      |             |            |07/20/1995 21:13:52|                             |
