describe.only('The login flow and user creation flow', () => {
  it('should ensure login page loads correctly', () => {
    cy.visit('/');
    cy.get('[data-cy=email]').should('exist');
    cy.get('[data-cy=continue]').should('exist');
    cy.get('[data-cy=continue]').should('be.disabled');
    cy.get('[data-cy=continueGoogle]').should('exist');
    

    //get users.json fixtures file
    cy.fixture('users').as('myUserFixture');

    //type email from the first user in users.json file into email input
    cy.get('@myUserFixture').then((user) => {
      cy.get('[data-cy=email]').type(user[0].email).then(()=>{
         //check that the continue button is enabled
          cy.contains('Continue').should('exist').should('be.enabled').click();
      });
    });
     
    
    
    //check you are on the create user account page
    cy.contains('Create new user account').should('exist');

    //type a fullName
    cy.fixture('users').as('myUserFixture');
    cy.get('@myUserFixture').then((user) => {
      cy.get('[data-cy=createUser-fullName]').type(user[0].name);
    });

    //type a password
    cy.get('[data-cy=createUser-password]').type('P@ssword123');
    //click create account
    cy.contains('Create Account').should('exist').should('be.enabled').click();

    cy.contains('started').should('exist');
    cy.pause();


      // Get Started page
      cy.get('[data-cy=getStarted]').should('exist');
      cy.get('[data-cy=getStarted]').click();
      
      // Step 1
      cy.get('[data-cy=addFarm-continue]').should('exist');
      cy.get('[data-cy=addFarm-continue]').should('be.disabled');
      cy.get('[data-cy=addFarm-farmName]').should('exist');
      cy.get('[data-cy=addFarm-location]').should('exist');

      // Step 2

      cy.get('[data-cy=addFarm-farmName]').type('UBC FARM');
      cy.get('[data-cy=addFarm-location]').type('49.250833,-123.2410777');
      cy.get('[data-cy=addFarm-continue]').should('not.be.disabled');
      cy.get('[data-cy=addFarm-continue]').click();
      
      
  });

});


