describe('Static QR code', () => {
  it('Select Website QR', () => {
    cy.visit('http://localhost:3000')

    //Finding the span of the button label
    cy.contains('Static QR Codes').children('span').as('stqr')
    //Finding the button parent of the span and clicking the button
    cy.get('@stqr').parent().click()
    // Finding in the new page the qr type
    //cy.contains('Website').parentsUntil('.MuiBox-root')
    cy.contains('Website').parent().parent().parent().parent().click()
    cy.get('body').contains('Next').click()
  })

  it('Required url',() =>{
    cy.get('body').contains('div', 'Website').find('input').first()//.type('https://server.cenit.io')
    //cy.get('body').get('[id^=ru-]')
  })
})

export {}
