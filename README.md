## Setup


- `git clone https://github.com/TypeLuis/mongoose_boilerplate_ts.git . && rm -rf .git` 




- `npm run env` & populate env,  
**node -e in package.json means to evaluate the JS code. makes it so we do have to create a file**


- `npm i`

- `npm run seed`

- `npm run dev`


- ## to see the pdf file, download the pdf viewer extention by `Mathematic inc`

- ## MAKE SURE REST CLIENT IS INSTALLED TO USE app.http


# Notes on session/transaction in MongoDB!
- **What is transaction?** “Either ALL these database changes succeed, or NONE of them do.”
- `session.startTransaction()` -> Start grouping all upcoming operations together
- `await session.commitTransaction()` -> Apply all changes permanently.
- `await session.abortTransaction()` -> Undo everything that happened during this transaction.
- if running locally you need to run this -> `mongod --dbpath "/your/data/path" --replSet rs0`


# what is populate?
- populate is used from the schema model that's used as a reference. example below
```
    sellerId: {
      type: mongoose.Schema.Types.ObjectId, // this field must store the id of another mongo document like a relationship
      ref: "User", // refrences the User model 
      required: [true, "Seller is required"],
      index: true
    }
```

- when sending json, we can add the json of the userId as well, by telling which data to add, example below

**without populate**

```
const listing = await Listing.findById(id);

console.log(listing.sellerId);
// ObjectId("65f3a9c9e9e1f8c123456789") -> output
```

**with populate**

```
const listing = await Listing
  .findById(id)
  .populate("sellerId", "username displayName");

console.log(listing.sellerId);
/*
OUTPUT
{
  _id: "65f3a9c9e9e1f8c123456789",
  username: "luis123",
  displayName: "Luis"
}
*/

```