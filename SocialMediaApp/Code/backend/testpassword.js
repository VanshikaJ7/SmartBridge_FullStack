// testPassword.js

const bcrypt = require('bcryptjs');

async function testPassword() {
  try {
    
    const testPassword = 'Sanya';
    
    
    const hashedPassword = await bcrypt.hash(testPassword, 12);
    console.log('Hashed Password:', hashedPassword);

    
    const isMatch = await bcrypt.compare(testPassword, hashedPassword);
    console.log('Password Match:', isMatch); 
  } catch (error) {
    console.error('Error during password test:', error);
  }
}

testPassword();
