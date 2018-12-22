#!/bin/sh

# Run test with truffle@5
npm run test

# Find real truffle global bin path
cmd_truffle=`which npm | sed  -e 's/npm/truffle/'`
# Run test with truffle@4
$cmd_truffle test test_truffle_4/ERC20Test.js
