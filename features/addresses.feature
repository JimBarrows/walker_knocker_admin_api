Feature: Create, read, update and delete addresses
  As an administrator
  I want to manage addresses
  So that I can assign addresses to volunteers

  Scenario: Administors can get a list of all addresses
    Given there are 3 street addresses in the database
    When I retrieve a list of addressess
    Then there must be 3 street addresses in the response
    And the 3 street addresses must be correct

  Scenario: Administrators can create an address
    Given an address of "1123 Carriage Road"
    And a city of "Phoenix"
    And a state of "Arizona"
    And a zip code of "85037"
    And a country of "United States"
    When I save the address
    Then the address should be in the database
