const clone = require('clone');
const fs = require('fs');

module.exports = class myDB{

    constructor()
    {
        //Data
        this.data = [{}];

        //current transaction index
        this.tindex=0;

        //Transaction mode indicator 
        this.transactionMode=false;

   // BASIC FUNCTIONS
   /* {@function} count - Returns the number of names that have the given value
    * assigned to them. If that value is not assigned anywhere, return 0
    * @params {String} value the unique identifier for the db search
    * @return {Number} the number of names tht have the given value
    */
    this.count = function(value)
    {
      let count=0;
      
      if (value) {
        for (let property in this.data[this.tindex]) {
            if (this.data[this.tindex].hasOwnProperty(property)) {
                if (property && (this.data[this.tindex][property] === value)) {
                    count++;
                }
            }
        }
    }
          
       return count;
    };
     
    
   /* {@function} Deletes the value from the database.
    * @params {String} name the unique identifier for the db lookup
    */

    this.delete = function(name)
    {
        if(name)
        {
            if(this.data[this.tindex][name])
            delete this.data[this.tindex][name];
        }
    };

    
   /* {@function} get - Returns the value for the given name. 
    * If the value is not in the database, prints N ULL
    * @params name the unique identifier for the db lookup
    * @return {Object} the value for the given name
    */

    this.get = function(name)
    {
      let res=null;

      if(name)
      res=this.data[this.tindex][name];
         
      return res?res:null
    }

    
   /* {@function} set - Sets the name in the database to the given value
    * @params {String} name the unique identifier for the entry
    * @params {String} value the value for the given entry
    */

    this.set = function(name,value)
    {
        if(!this.data[this.tindex])
        this.data[this.tindex]={};

        if(name && name.length>0)
        this.data[this.tindex][name]=value || null;
    };
     
      // TRANSACTION FUNCTIONS 

   /* {@function} begin - Begins a new transaction. Turns off auto-commit
    */

    this.begin = function()
    {
        if(!this.transactionMode)
        {
            this.transactionMode=true;
        }
        	// Make sure stage and and main are in sync
        this.data[this.tindex+1]=clone(this.data[this.tindex]);
        this.tindex++;
    };
    /* {@function} commit - Commit all of the open transactions. Turns on auto-commit
    */
     this.commit = function()
     {
         if(this.tindex === 0)
         {
             this.transactionMode=false;
         }

         if(this.tindex>0)
         {
            	// Sync Data from transaction
	    	this.data[this.tIndex-1] = clone(this.data[this.tIndex]);
	    	// Clear out the transaction data
	    	this.data[this.tIndex] = {};
	    	// Point to earlier version of data
            this.tIndex--;
         }
         return this.tindex;
     }

      
    /* {@function} download - Downloads the content of DB into db_dump.txt
    * @return {Number} the new transaction index
    */
       
    this.download = function ()
    {
      var db_dump;
      this.data.forEach((entry)=>{
        db_dump = JSON.stringify(entry);
      });

      fs.writeFileSync('database.json',db_dump);
      console.log("--------------Saving DB to db_dump.json -----------")
    }
     /* {@function} rollback - Rolls back the most recent transaction.
    * @return {Number} the new transaction index
    */

      this.rollback = function()
      {
          if(this.tindex==0)
          {
              return -1;
          }

          if(this.transactionMode){
              this.data[this.tindex]={};
              this.tindex--;
          }

          return this.tindex;
      }

      /* {@function} manageState - Auxilary function to manage state between
    * transactionMode(auto-commit-off) and regular(auto-commit-on) mode
    */
      this.manageState = function()
      {
         if(!this.transactionMode)
         {
             this.data[0]=clone(this.data[this.tindex]);
         }
      }
     
    }
};