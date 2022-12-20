
// This test is to check if the home page is loading correctly
describe('The Home Page', () => {
  it('successfully loads', () => {

    cy.visit('http://localhost:3000') // change URL to match your dev URL
    cy.get('.form-control').type('d12') // type into the input element
    cy.get('.btn').click() // click on the button
    cy.get('.card').should('have.length', 10) // check the number of cards 
    
  }
)})