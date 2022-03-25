import { Client, Intents, MessageEmbed } from "discord.js";
import io from "socket.io-client";
import { users, discordConfig, mongooseConfig, donationalertsConfig } from "./config.json";

import mongoose from "mongoose";

import { createCommands } from "./createCommands";

const client = new Client( { intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ] } );

const donationalerts = io( `${ donationalertsConfig.soket }:${ donationalertsConfig.port }` );
donationalerts.emit( "add-user", { token: donationalertsConfig.token, type: donationalertsConfig.type } );

import { bank } from "./commands/bank";
import { reset } from "./commands/reset";

import { Donation } from "./models/donationSchema";

mongoose.connect( mongooseConfig.uri );

client.on( "ready", function () {
    console.log( "I am ready!" );

    const guild = client.guilds.cache.get( discordConfig.guildId );
    const channel = client.channels.cache.get( discordConfig.channelId );

    let commands;

    if ( guild ) {
        commands = guild.commands;
    } else {
        commands = client.application.commands;
    }

    createCommands( commands );

    donationalerts.on( "donation", function ( donation ) {
        donation = JSON.parse( donation );

        const donationEmbed = new MessageEmbed()
            .setColor( "#64f074" )
            .setTitle( "💸 Новое пожертвование" )
            .setDescription( `Пришло новое пожертвование \`#${ donation.id }\`` )
            .addFields(
                { name: ":woman_bald: Пользователь", value: `\`\`\`${ donation.username }\`\`\`` },
                { name: ":thought_balloon: Сообщение", value: `\`\`\`${ donation.message }\`\`\`` },
                { name: ":moneybag: Сумма", value: `\`\`\`${ donation.amount_main } ${ donation.currency }\`\`\`` },
                { name: "Jafar", value: `\`\`\`+${ users[ 0 ].amount }₽\`\`\``, inline: true },
                { name: "Nine",  value: `\`\`\`+${ users[ 1 ].amount }₽\`\`\``, inline: true },
                { name: "Misha",  value: `\`\`\`+${ users[ 2 ].amount }₽\`\`\``, inline: true }
            );

        // @ts-ignore
        channel.send( { embeds: [ donationEmbed ] } );

        users.map( function ( user ) {
            const newDonation = new Donation( { payId: donation.id, username: user.username, status: true, amount: user.amount } );

            newDonation.save( function ( error ) {
                if ( error ) return console.error( "Error", error );
            } );
        } );
    } );
} );

client.on( "interactionCreate", function ( interaction ) {
    if ( !interaction.isCommand() ) return;

    const { commandName } = interaction;

    switch ( commandName ) {
        case "банк":
            bank( interaction );
            break;

        case "сбросить":
            reset( interaction );
            break;
    }
} );

client.login( discordConfig.token );
