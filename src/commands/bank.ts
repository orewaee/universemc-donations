import { MessageEmbed } from "discord.js";

import { users } from "../config.json";
import { Donation } from "../models/donationSchema";

async function getAmount( username ) {
    try {
        var document = await Donation.find( { username, status: true } ).exec();

        let amount = 0;

        document.map( function ( donation ) {
            amount += donation.amount;
        } );

        return amount;
    } catch ( error ) {
        console.log( "Error", error );
    }
};

export async function bank( interaction ) {
    var embedArray = [];
    var totalAmount = 0;

    for ( let i = 0; i < users.length; i++ ) {
        let amount = await getAmount( users[ i ].username );

        totalAmount += amount;

        embedArray.push( { name: users[ i ].username, value: `\`\`\`${ amount }₽\`\`\``, inline: true } );
    }

    embedArray.unshift( { name: ":moneybag: Общая сумма", value: `\`\`\`${ totalAmount }₽\`\`\`` }, );

    const bankEmbed = new MessageEmbed()
        .setColor( "#fdd888" )
        .addFields(
            ...embedArray
        );

    interaction.channel.send( {
        embeds: [ bankEmbed ]
    } );

    interaction.reply( { content: "Успешно!", ephemeral: true } );
}
