// const bcrypt = require('bcryptjs');

// const hashedPassword = '$2b$10$.D1TanIvQjDIxn5a67PFJeJ3QG9WImeeH2Yv7F.Tet1CQ3DBu5WqC'; // e.g., $2b$10$...
// const inputPassword = '123456'; // Enter the password you used in registration

// bcrypt.compare(inputPassword, hashedPassword).then(match => {
//   console.log('Match:', match); // Should print true
// });

const bcrypt = require('bcryptjs');

const password = '123456';

bcrypt.hash(password, 10).then(hash => {
  console.log("Hash:", hash);

  bcrypt.compare(password, hash).then(match => {
    console.log("Match after hashing:", match); // should be true
  });
});
