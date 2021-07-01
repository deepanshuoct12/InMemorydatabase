const path = require('path')
const readline = require('readline')
//const dbBackend = require('./dbBackend')

const rl= readline.createInterface({
 input: process.stdin,
 output : process.stdout,
 terminal:false
});

 //let db = new dbBackend();
 console.log("<--------------------Inmemory database ready--------------------->");


readInput.on('line',(input)=>{
  let cmd = input.splice(' ');
  cmd[0]=cmd[0].toUppercase();
  let key;
  let value;

  if(cmd.length()>1)
  {
      key=cmd[1]||null;
      value=cmd[2]||null;
  }
  let transactionIndex;
  switch(cmd[0])
  {
      case 'SET':
          db.set(key,value);
          break;
      case 'GET':
          console.log(db.get(key));
          break;
      case 'DELETE':
        db.delete(key);
         break;
        
     case 'COUNT':
        console.log(db.count(key));
         break;
      
     case 'ROLLBACK': //undo all the changes 
      transactionIndex=db.rollback();
      if(transactionIndex==-1)console.log("No transaction found")
      else 
      console.log("Transaction rolledback with transaction id" + transactionIndex);
       break;

     case 'COMMIT':  //save all the changes in database 
     transactionIndex = db.commit();
     if(transactionIndex==-1)console.log("No transaction found")
     else 
     console.log("Transaction commited with transaction id" + transactionIndex);
      break;
      case 'DOWNLOAD':
          db.download(); //downloading json
      case 'END':
          readInput.close();
          console.log('<--------------------InMemorydatabase closed---------------->')
          break;
      case 'OPTIONS':
          console.log('options\nSET <key> <val>\n' + 'GET <Key>\nDELETE <Key>\nCOUNT <value>\n' +
          'BEGIN\nROLLBACK\nCOMMIT\nEND\n');
          break;
       default:
           console.log('\nInvalid option \n' + 'use OPTIONS to see all the commands\n');
           break;

  }

  db.manageState();//for transaction mode 

})

