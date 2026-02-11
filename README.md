## Setup


- `npm run env` & populate env,  
**node -e in package.json means to evaluate the JS code. makes it so we do have to create a file**


- `npm i`

- `npm run seed`

- `npm run dev`


- ### to see the pdf file, download the pdf viewer extention by `Mathematic inc`

- ### MAKE SURE REST CLIENT IS INSTALLED TO USE app.http

# API ROUTES

## USER ROUTES
| Method | Path             | Description                  |
| ------ | ---------------- | ---------------------------- |
| POST   | `/api/users`     | Create a new user            |
| GET    | `/api/users`     | Retrieve all users           |
| GET    | `/api/users/:id` | Retrieve a single user by ID |
| PATCH  | `/api/users/:id` | Update user fields           |
| DELETE | `/api/users/:id` | Delete a user                |

## Listing Routes
| Method | Path                | Description                              |
| ------ | ------------------- | ---------------------------------------- |
| POST   | `/api/listings`     | Create a new listing                     |
| GET    | `/api/listings`     | Retrieve all listings (supports filters) |
| GET    | `/api/listings/:id` | Retrieve a listing by ID                 |
| PATCH  | `/api/listings/:id` | Update listing fields                    |
| DELETE | `/api/listings/:id` | Delete a listing                         |

### Listing query params
| Query Param | Description                                        |
| ----------- | -------------------------------------------------- |
| `category`  | Filter by listing category                         |
| `status`    | Filter by listing status (ACTIVE, SOLD, CANCELLED) |
| `sellerId`  | Filter listings by seller                          |
| `minPrice`  | Minimum price filter                               |
| `maxPrice`  | Maximum price filter                               |
| `q`         | Case-insensitive partial title search              |

- Example `GET /api/listings?category=ELECTRONICS&minPrice=100`

## Offers
| Method | Path                       | Description                                                |
| ------ | -------------------------- | ---------------------------------------------------------- |
| POST   | `/api/offers`              | Create an offer on a listing                               |
| GET    | `/api/offers`              | Retrieve offers (supports filters)                         |
| GET    | `/api/offers/:id`          | Retrieve a specific offer                                  |
| PATCH  | `/api/offers/:id/withdraw` | Buyer withdraws a pending offer                            |
| PATCH  | `/api/offers/:id/accept`   | Seller accepts offer (declines others, marks listing SOLD) |
| PATCH  | `/api/offers/:id/decline`  | Seller declines a pending offer                            |

### Offer query params
| Query Param | Description                    |
| ----------- | ------------------------------ |
| `listingId` | View offers for a listing      |
| `buyerId`   | View offers created by a buyer |
| `status`    | Filter offers by status        |

#### Offer Status Enum:

- PENDING

- ACCEPTED

- DECLINED

- WITHDRAWN

## Transactions
| Method | Path                    | Description                                   |
| ------ | ----------------------- | --------------------------------------------- |
| POST   | `/api/transactions`     | Finalize a transaction from an accepted offer |
| GET    | `/api/transactions`     | Retrieve transactions (supports filters)      |
| GET    | `/api/transactions/:id` | Retrieve a specific transaction               |

### Transaction query params
| Query Param | Description                     |
| ----------- | ------------------------------- |
| `buyerId`   | View purchases made by buyer    |
| `sellerId`  | View sales made by seller       |
| `listingId` | View transactions for a listing |
| `status`    | Filter by transaction status    |

#### Transaction Status Enum:

- COMPLETED

- CANCELLED

- REFUNDED




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