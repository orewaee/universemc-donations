import { Schema, model } from "mongoose";

const donationSchema = new Schema( {
    payId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
} );

export const Donation = model( "Donation", donationSchema );