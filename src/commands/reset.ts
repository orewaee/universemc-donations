import { MessageEmbed } from "discord.js";
import { Donation } from "../models/donationSchema";

export function reset( interaction ) {
    Donation.updateMany( { "status": true }, { "$set": { "status": false } }, function ( error, properties ) {
        if ( error ) return console.error( "Error", error );

        const resetEmbed = new MessageEmbed()
            .setColor( "#67757f" )
            .setTitle( "🗑️ Банк успешно сброшен" );

        interaction.channel.send( {
            embeds: [ resetEmbed ]
        } );

        interaction.reply( { content: "Успешно!", ephemeral: true } );
    } );
}
