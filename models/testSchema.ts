import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "We need the name"], // Sends message if name is not implemented
        unique: true //unique auto index by default
    },
    category: {
        type: [String], //Makes the schema datatype an array of string
        required: true,
        enum : ['Fruits', 'Vegetables'],
        message: "Submitted an incorrect value for category"
    }, 
    price: Number,
    stocked: {
        type: Boolean,
        default: false // gives the default value of false
    }
})


testSchema.index({category: 1, price : -1})
testSchema.index({price: 1})


testSchema.methods.getCategory = function (cb:Function) {
    return mongoose.model("Produce").find({ category: this.category }, cb);
};
  
// Static Method
testSchema.statics.priceAbove = function (value) {
return this.find({ price: { $gt: value } });
};


// virtual property
// Only runs on queries 
// Gives a property of expensive and returns value
testSchema.virtual("expensive").get(function(){
    if(!this.price) return
    return this?.price > 7 ? "this is very expensive" : "not very expensive"
})

testSchema.virtual("withTaxPrice").get(function(){
    if(!this.price) return
    let priceTax = this.price * 1.08
    return Number(priceTax.toFixed(2))
})

// Have to to this to allow virtuals
testSchema.set("toJSON", {virtuals: true})


// The name of the collection always has to start in capitol 
export default mongoose.model("Produce", testSchema)