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
      
       if(value)
       {
           for(let property in this.data[this.tindex])
           {
               if(this.data[this.tindex].hasOwnProperty(property)) //chk if object has property or not
               {
                   if(property && (this.data[this.tindex][property]===value))
                   count++;
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


    }
};