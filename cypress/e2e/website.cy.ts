describe('Static QR code', () => {
  it('Select Website QR', () => {
    cy.visit('http://localhost:3000');

  })

  it('Complete Content',() =>{
    cy.get('.css-1gvpih1-MuiButtonBase-root-MuiTab-root').click();
    cy.get(':nth-child(2) > .css-b69al4 > .css-1ckupud > .css-cblyn4 > .MuiBox-root > .MuiTypography-root').click();
    cy.get('#buttonNext').click();
    cy.get('#\\:r3\\:').should('have.value', '').type('https://server.cenit.io');
    cy.get('body').contains('Next').click();
  })

  it('Complete QR Desing',() =>{
    cy.get('body').click();
    cy.contains('Squares').parent().parent().parent().as('code')
    cy.get('@code').click()
    cy.get('[data-value="rounded"] > .MuiListItemText-root > .MuiTypography-root').click();
    cy.get('body').click();
    cy.get('.css-a5rdam-MuiGrid-root > :nth-child(3) > .css-oc995m-MuiPaper-root > .css-q7l9ym-MuiFormControl-root').click();
    cy.get('[data-value="-1"] > .MuiListItemText-root > .MuiTypography-root').click();
    cy.get('#buttonNext').click();
  })

  it('Dowload QR',() =>{
    cy.get('#buttonDow').click();
    cy.get('.css-xvj9q9-MuiButtonBase-root-MuiButton-root').click();
    cy.get('#buttonD').click();
   })

})


export {}
