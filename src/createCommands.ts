export function createCommands( commands ) {
    commands.create( {
        name: "банк",
        description: "Показывает отложенную сумму."
    } );

    commands.create( {
        name: "сбросить",
        description: "Сбрасывает отложенную сумму."
    } );
}