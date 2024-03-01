import { Vak } from "./vak.js";

const localStorageKey = "vakkenLijst";

export class Vakkenlijst {
    #vakken;
    constructor() {
        this.#vakken = [];
    }

    save() {
        // Bewaren van de array van vakken.
        // Bemerk dat Vak objecten een toJSON() methode hebben: die zal door JSON.stringify worden aangeroepen
        // om 'meer controle' te hebben over de serialisatie naar de JSON string.
        localStorage.setItem(
            localStorageKey,
            JSON.stringify(this.#vakken)
        );
    }

    load() {
        // Een eventuele reeds geladen lijst weer leegmaken.
        this.#vakken = [];

        // Ophalen van de lijst van vakken uit de local storage.
        // Opgelet: dit kan null zijn indien de pagina een eerste keer getoond wordt.
        let vakkenLijstFromStorage = localStorage.getItem(localStorageKey);
        if (vakkenLijstFromStorage) {
            // Indien niet null: de JSON string terug omzetten naar een array van vakken.
            // Opgelet: dit zijn gewone JavaScript objecten die niet (meer) afstammen van de Vak class.
            // Vandaar loopen we over alle vakken uit de JSON en maken we terug volwaardige Vak-objecten van.
            let vakkenFromJson = JSON.parse(vakkenLijstFromStorage);
            vakkenFromJson.forEach(vakFromJson => {
                let vak = Vak.restoreFromJsonObject(vakFromJson);
                this.#vakken.push(vak);
            });
        }
        else {
            // Indien wel null: al direct vakken toevoegen :)
            this.#vakken.push(new Vak(0, "IT essentials", 3, 0));
            this.#vakken.push(new Vak(1, "IT landscape", 3, 0));
            this.#vakken.push(new Vak(2, "Databases basis", 4, 0));
            this.#vakken.push(new Vak(3, "Databases gevorderd", 4, 0));
            this.#vakken.push(new Vak(4, "Programmeren basis", 9, 0));
            this.#vakken.push(new Vak(5, "Programmeren gevorderd", 6, 0));
            this.#vakken.push(new Vak(6, "Frontend basis", 7, 0));
            this.#vakken.push(new Vak(7, "Frontend gevorderd", 5, 0));
            this.#vakken.push(new Vak(8, "Backend 1", 4, 0));
            this.#vakken.push(new Vak(9, "Verkenning van de werkplek", 4, 0));
            this.#vakken.push(new Vak(10, "Communicatievaardigheden", 3, 0));
            this.#vakken.push(new Vak(11, "Participatie op de werkplek 1", 6, 0));
            this.#vakken.push(new Vak(12, "Teamvaardigheden", 3, 0));
        }
        this.#renderVakken();
    }

    render(element) {
        let table =
            `<table id="vakkenlijst" class="table">
                <thead>
                    <tr>
                        <th>Vak</th>
                        <th>Studiepunten</th>
                        <th>Geschat aantal uren</th>
                        <th>Aantal uren</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
                <tfoot>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
            <button id="save">Bewaren</button><button id="load">Laden</button>`;

        element.innerHTML = table;

        document.getElementById("save").addEventListener("click", (e) => {
            this.save();
        })

        document.getElementById("load").addEventListener("click", (e) => {
            this.load();
        });
    }

    #renderVakken() {
        let tbody = document.querySelector("#vakkenlijst tbody");
        tbody.innerHTML = ""; // Indien render een zoveelste keer wordt aangeroepen: de rijen verwijderen en opnieuw aanmaken.
        for (let i = 0; i < this.#vakken.length; i++) {
            // Elke rij mag zichzelf dan 'renderen' in het HTML document.
            this.#vakken[i].render(tbody);
        }
    }
}