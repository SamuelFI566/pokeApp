const imgPoke2 = document.querySelector('#poke2');
const namePoke2 = document.querySelector('#nombrePoke-rival');
const poke2Tipo = document.querySelector('#tipoRival');
const poke2TipoSecundario = document.querySelector('#tipoRivalSecundario');
const poke2Ataque = document.querySelector('#ataqueRival');

const imgPoke = document.querySelector('#poke');
const namePoke = document.querySelector('#nombrePoke-propio');
const pokeTipo = document.querySelector('#tipoPropio');
const pokeTipoSecundario = document.querySelector('#tipoPropioSecundario');
const pokeAtaque = document.querySelector('#ataquePropio');

const input = document.querySelector('#input');
const btnElegir = document.querySelector('#btn-poke');
const btnPelear = document.querySelector('#combate');

const getNumRandom = () => {
    let min = Math.ceil(0);
    let max = Math.floor(1001);

    return Math.floor(Math.random() * (max - min) + min);
  }

const obtenerPokePropio = ()=>{
    const num = input.value;

    axios.get(`https://pokeapi.co/api/v2/pokemon/${num}`).then((res)=>{

        return res.data
    }).then((res)=>{
        console.log(res);
        imgPoke.src = res.sprites.back_default;
        pokeTipo.innerHTML = res.types[0].type.name;
        pokeTipoSecundario.innerHTML = res.types.length > 1 ? res.types[1].type.name : null;
        namePoke.innerHTML = res.name;
        pokeAtaque.innerHTML = res.stats[0].base_stat;
    })
}

const obtenerPokeRival = () =>{

    const numPokeRival = getNumRandom();

    axios.get(`https://pokeapi.co/api/v2/pokemon/${numPokeRival}`).then((res)=>{

        return res.data
    }).then((res)=>{
        console.log(res);
        imgPoke2.src = res.sprites.front_default;
        poke2Tipo.innerHTML = res.types[0].type.name;
        poke2TipoSecundario.innerHTML = res.types.length > 1 ? res.types[1].type.name : null;
        namePoke2.innerHTML = res.name;
        poke2Ataque.innerHTML = res.stats[0].base_stat;
    })

}

const calcularMultiplicadorAtaque = (tipoAtaque, tipoDefensaPrimario, tipoDefensaSecundario) => {

    const tablaTipos = {
        "steel": {"normal": 1, "fire": 0.5, "water": 0.5, "grass": 1, "electric": 0.5, "ice": 2, "fighting": 1, "poison": 1, "ground": 1, "flying": 1, "psychic": 1, "bug": 1, "rock": 2, "ghost": 1, "dragon": 1, "dark": 1, "steel": 0.5, "fairy": 2 },
        "water": {"normal": 1, "fire": 2, "water": 0.5, "grass": 0.5, "electric": 1, "ice": 1, "fighting": 1, "poison": 1, "ground": 2, "flying": 1, "psychic": 1, "bug": 1, "rock": 2, "ghost": 1, "dragon": 0.5, "dark": 1, "steel": 1, "fairy": 1 },
        "bug": {"normal": 1, "fire": 0.5, "water": 1, "grass": 2, "electric": 1, "ice": 1, "fighting": 0.5, "poison": 0.5, "ground": 1, "flying": 0.5, "psychic": 2, "bug": 1, "rock": 1, "ghost": 0.5, "dragon": 1, "dark": 2, "steel": 0.5, "fairy": 0.5 },
        "dragon": {"normal": 1, "fire": 1, "water": 1, "grass": 1, "electric": 1, "ice": 1, "fighting": 1, "poison": 1, "ground": 1, "flying": 1, "psychic": 1, "bug": 1, "rock": 1, "ghost": 1, "dragon": 2, "dark": 1, "steel": 0.5, "fairy": 0 },
        "electric": {"normal": 1, "fire": 1, "water": 2, "grass": 0.5, "electric": 0.5, "ice": 1, "fighting": 1, "poison": 1, "ground": 0, "flying": 2, "psychic": 1, "bug": 1, "rock": 1, "ghost": 1, "dragon": 0.5, "dark": 1, "steel": 1, "fairy": 1 },
        "ghost": {"normal": 0, "fire": 1, "water": 1, "grass": 1, "electric": 1, "ice": 1, "fighting": 1, "poison": 1, "ground": 1, "flying": 1, "psychic": 2, "bug": 1, "rock": 1, "ghost": 2, "dragon": 1, "dark": 0.5, "steel": 1, "fairy": 1 },
        "fire": {"normal": 1, "fire": 0.5, "water": 0.5, "grass": 2, "electric": 1, "ice": 2, "fighting": 1, "poison": 1, "ground": 1, "flying": 1, "psychic": 1, "bug": 2, "rock": 0.5, "ghost": 1, "dragon": 0.5, "dark": 1, "steel": 2, "fairy": 1 },
        "fairy": {"normal": 1, "fire": 0.5, "water": 1, "grass": 1, "electric": 1, "ice": 1, "fighting": 2, "poison": 0.5, "ground": 1, "flying": 1, "psychic": 1, "bug": 1, "rock": 1, "ghost": 1, "dragon": 2, "dark": 2, "steel": 0.5, "fairy": 1 },
        "ice": {"normal": 1, "fire": 0.5, "water": 0.5, "grass": 2, "electric": 1, "ice": 0.5, "fighting": 2, "poison": 0.5, "ground": 2, "flying": 0.5, "psychic": 0.5, "bug": 0.5, "rock": 1, "ghost": 1, "dragon": 2, "dark": 1, "steel": 0.5, "fairy": 1 },
        "fighting": {"normal": 2, "fire": 1, "water": 1, "grass": 1, "electric": 1, "ice": 2, "fighting": 1, "poison": 1, "ground": 1, "flying": 1, "psychic": 1, "bug": 1, "rock": 2, "ghost": 0, "dragon": 1, "dark": 1, "steel": 2, "fairy": 0.5 },
        "normal": {"normal": 1, "fire": 1, "water": 1, "grass": 1, "electric": 1, "ice": 1, "fighting": 1, "poison": 1, "ground": 1, "flying": 1, "psychic": 1, "bug": 1, "rock": 0.5, "ghost": 0, "dragon": 1, "dark": 1, "steel": 0.5, "fairy": 1 },
        "grass": {"normal": 1, "fire": 0.5, "water": 2, "grass": 0.5, "electric": 1, "ice": 1, "fighting": 1, "poison": 0.5, "ground": 2, "flying": 0.5, "psychic": 1, "bug": 0.5, "rock": 2, "ghost": 1, "dragon": 0.5, "dark": 1, "steel": 0.5, "fairy": 1 },
        "psychic": {"normal": 1, "fire": 1, "water": 1, "grass": 1, "electric": 1, "ice": 1, "fighting": 2, "poison": 2, "ground": 1, "flying": 1, "psychic": 0.5, "bug": 1, "rock": 1, "ghost": 1, "dragon": 1, "dark": 0, "steel": 0.5, "fairy": 1 },
        "rock": {"normal": 1, "fire": 2, "water": 1, "grass": 1, "electric": 1, "ice": 2, "fighting": 0.5, "poison": 1, "ground": 0.5, "flying": 2, "psychic": 1, "bug": 2, "rock": 1, "ghost": 1, "dragon": 1, "dark": 1, "steel": 0.5, "fairy": 1 },
        "dark": {"normal": 1, "fire": 1, "water": 1, "grass": 1, "electric": 1, "ice": 1, "fighting": 0.5, "poison": 1, "ground": 1, "flying": 1, "psychic": 2, "bug": 1, "rock": 1, "ghost": 2, "dragon": 1, "dark": 0.5, "steel": 1, "fairy": 0.5 },
        "ground": {"normal": 1, "fire": 2, "water": 1, "grass": 0.5, "electric": 2, "ice": 1, "fighting": 1, "poison": 2, "ground": 1, "flying": 0, "psychic": 1, "bug": 0.5, "rock": 2, "ghost": 1, "dragon": 1, "dark": 1, "steel": 2, "fairy": 1 },
        "poison": {"normal": 1, "fire": 1, "water": 1, "grass": 2, "electric": 1, "ice": 1, "fighting": 1, "poison": 0.5, "ground": 0.5, "flying": 1, "psychic": 1, "bug": 1, "rock": 0.5, "ghost": 0.5, "dragon": 1, "dark": 1, "steel": 0, "fairy": 2 },
        "flying": {"normal": 1, "fire": 1, "water": 1, "grass": 2, "electric": 0.5, "ice": 1, "fighting": 2, "poison": 1, "ground": 1, "flying": 1, "psychic": 1, "bug": 2, "rock": 0.5, "ghost": 1, "dragon": 1, "dark": 1, "steel": 0.5, "fairy": 1 }

    };

    let multiplicadorAtaquePrimario = tablaTipos[tipoAtaque][tipoDefensaPrimario];

    let multiplicadorAtaqueSecundario = 1;
    if (tipoDefensaSecundario && tipoDefensaSecundario !== "") {
        multiplicadorAtaqueSecundario = tablaTipos[tipoAtaque][tipoDefensaSecundario];
    }

    const multiplicadorFinal = multiplicadorAtaquePrimario*multiplicadorAtaqueSecundario;
    return multiplicadorFinal;
}

const efectividad = (multiplicador) => {

    const mensajes = {
        0: " falló ",
        0.25: " fue muy poco efectivo ",
        0.5: " fue poco efectivo ",
        1: " fue efectivo ",
        2: " fue muy efectivo ",
        4: " fue SUPER EFECTIVO "
    };

    if (mensajes[multiplicador] !== undefined) {
        return mensajes[multiplicador];
    } else {
        return " tuvo un efecto desconocido ";
    }
}


const combate = ()=>{

    const nombreRival = namePoke2.textContent;
    const nombrePropio = namePoke.textContent;
    const ataqueRival = parseInt(poke2Ataque.textContent);
    const ataquePropio = parseInt(pokeAtaque.textContent);
    const tipoRival = poke2Tipo.textContent;
    const tipoPropio = pokeTipo.textContent;
    const tipoRivalSecundario = poke2TipoSecundario.textContent;
    const tipoPropioSecundario = pokeTipoSecundario.textContent;

    const multiplicadorAtaquePropio = calcularMultiplicadorAtaque(tipoPropio, tipoRival, tipoRivalSecundario);
    const ataquePropioTotal = ataquePropio * multiplicadorAtaquePropio;
    const efectividadAtaquePropio = efectividad(multiplicadorAtaquePropio);

    const multiplicadorAtaqueRival = calcularMultiplicadorAtaque(tipoRival, tipoPropio, tipoPropioSecundario);
    const ataqueRivalTotal = ataqueRival * multiplicadorAtaqueRival;
    const efectividadAtaqueRival = efectividad(multiplicadorAtaqueRival);

    const mensajeAtaquePropio = document.createElement('p');
    mensajeAtaquePropio.textContent = `¡${nombrePropio} ataca!, ¡Su ataque ${efectividadAtaquePropio} e hizo ${ataquePropioTotal} puntos de daño al ${nombreRival} enemigo!`;

    const mensajeAtaqueRival = document.createElement('p');
    mensajeAtaqueRival.textContent = `¡${nombreRival} ataca!, ¡Su ataque ${efectividadAtaqueRival} e hizo ${ataqueRivalTotal} puntos de daño a tu ${nombrePropio}!`;

    const resultadoCombate = document.createElement('p');
    if (ataquePropioTotal === ataqueRivalTotal) {
        resultadoCombate.textContent = "¡El enfrentamiento resulta en un empate!";
    } else {
        const nombreGanador = ataquePropioTotal > ataqueRivalTotal ? nombrePropio : nombreRival;
        resultadoCombate.textContent = `¡El ganador del enfrentamiento es ${nombreGanador}!`;
    }

    const mensajesCombate = document.getElementById('mensajes-combate');
    mensajesCombate.innerHTML = '';
    mensajesCombate.appendChild(mensajeAtaquePropio);
    mensajesCombate.appendChild(mensajeAtaqueRival);
    mensajesCombate.appendChild(resultadoCombate);
}

window.addEventListener('load', obtenerPokeRival);
btnElegir.addEventListener('click', obtenerPokePropio);
btnPelear.addEventListener('click', combate);



