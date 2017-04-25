import Field from '../../app/scripts/Field.js'

describe('Field', function() {

  it('exists', function() {
    let field = new Field();
    expect(field).to.exist;
  });
  it('can be opened', function() {
    let field = new Field();
    expect(field).to.have.property('isOpened');
    field.isOpened = true;
    expect(field.isOpened).to.equal(true);
  });
  it('can be marked', function() {
    let field = new Field();
    expect(field).to.have.property('isMarked');
    field.isMarked = true;
    expect(field.isMarked).to.equal(true);
  });
  it('can be unmarked', function() {
    let field = new Field();
    expect(field).to.have.property('isMarked');
    field.isMarked = false;
    expect(field.isMarked).to.equal(false);
  });

  // We can have more its here
});