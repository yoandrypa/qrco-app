describe('vCard QR code', () => {
  it('Load site', () => {
    cy.visit('http://localhost:3000');
    cy.get('.css-1gvpih1-MuiButtonBase-root-MuiTab-root').click();
    cy.get('#cardvcard').click();
    cy.get('#buttonNext').click();
  })

  it('Complete Content',() =>{
    cy.get('label').contains('Prefix').parent().find('input').type('MSc');
    cy.get('label').contains('First name').parent().find('input').type('Jessica');
    cy.get('label').contains('Last name').parent().find('input').type('Yanes');
    cy.get('label').contains('Cell number').parent().find('input').type('5358624975');
    cy.get('.css-1vsvf3g').click();
    cy.get('label').contains('Address').parent().find('input').type('Test address');
    cy.get('label').contains('City').parent().find('input').type('Test city');
    cy.get('label').contains('Email').parent().find('input').type('email@gmail.com');
    cy.get('#buttonNext').click();
    cy.url().should('include', '/qr/design')
  })

  it('Complete QR Desing',() =>{
    cy.contains('Squares').parent().parent().parent().as('code')
    cy.get('@code').click()
    cy.get('[data-value="extra-rounded"] > .MuiListItemText-root > .MuiTypography-root').click();
    cy.get(':nth-child(2) > #cornersSquareOptions\\.typeid').click();
    cy.get('[data-value="dot"] > .MuiListItemText-root > .MuiTypography-root').click();
    cy.get('label').contains('Dot').parent().click();
    cy.get('[data-value="dot"] > .MuiListItemText-root > .MuiTypography-root').click();
    cy.get('#buttonNext').click();
  })

  it('Dowload QR',() =>{
    cy.get('#buttonDow').click();
    cy.get('#buttonPNG').click();
    cy.get('#buttonD').click();
  })

})

export{}
