Feature: Read lists of cities, states and zip codes for the US.
  As a front end
  I want to retrieve lists of cities, states and zip codes by the parts of their names and other criteria
  So That I can provide type ahead, and data caching for the end user

  Scenario: I can retrieve a list of cities based on a partial name
    Given Cities exist as geographic boundaries
    When I provide "Ph" as the beginning of a city name
    Then I get a list of cities
    And the list of cities contains "Phoenix"
    And the list of cities contains "Philadelphia"
    And the list of cities is only 2 long

  Scenario: I can retrieve a list of states based on a partial name
    Given States exist as geographic boundaries
    When I provide "Ar" as the beginning of a state name
    Then I get a list of states
    And the list of states contains "Arkansas"
    And the list of states contains "Arizona"
    And the list of states is only 2 long

    Scenario: I can retrieve a list of zip codes based on a partial zip code
      Given Zip Codes exist as geographic boundaries
      When I provide "850" as the beginning of a zip code
      Then I get a list of zip codes
      And the list of states contains "85037"
      And the list of states contains "85036"
      And the list of states is only 82 long
